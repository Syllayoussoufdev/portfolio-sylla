import { NextRequest } from "next/server";
import { z } from "zod";
import { buildChatbotSystemPrompt } from "@/lib/chatbot-context";
import { checkRateLimit, incrementRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// Quotas anti-abus (par IP) : 20 messages / 10 min
const RATE_MAX = 20;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(1500),
      })
    )
    .min(1)
    .max(30),
  page: z.string().max(200).optional(),
});

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  const rawKey = process.env.GROQ_API_KEY || "";
  const apiKey = rawKey.trim().replace(/^['"]|['"]$/g, "");
  if (!apiKey) {
    return jsonError(
      "L'assistant n'est pas encore configuré. Contactez Youssouf directement sur WhatsApp.",
      503
    );
  }

  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous";
  const rateKey = `chatbot:${ip}`;
  const rate = checkRateLimit(rateKey, RATE_MAX, RATE_WINDOW_MS);
  if (!rate.allowed) {
    return jsonError(
      `Vous avez envoyé beaucoup de messages. Réessayez dans ${Math.ceil(
        rate.retryAfterSeconds / 60
      )} min ou écrivez directement sur WhatsApp.`,
      429
    );
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return jsonError("Requête invalide.", 400);
  }

  incrementRateLimit(rateKey, RATE_WINDOW_MS);

  const systemPrompt = await buildChatbotSystemPrompt();
  const pageContext = body.page ? `\n\nLe visiteur consulte actuellement la page : ${body.page}` : "";

  // On ne garde que les 8 derniers échanges pour économiser les tokens
  const history = body.messages.slice(-8);

  // Cascade de modèles pour résilience maximale sur l'offre gratuite Groq
  const candidateModels = Array.from(
    new Set([GROQ_MODEL, "llama-3.1-8b-instant", "mixtral-8x7b-32768"].filter(Boolean))
  );

  let upstream: Response | null = null;
  let lastErrorDetail = "";

  for (const model of candidateModels) {
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          stream: true,
          temperature: 0.5,
          max_tokens: 500,
          messages: [{ role: "system", content: systemPrompt + pageContext }, ...history],
        }),
      });

      if (res.ok && res.body) {
        upstream = res;
        break;
      }

      // Si erreur, on capture le détail
      lastErrorDetail = await res.text().catch(() => "");
      console.warn(`[chatbot] Tentative modèle ${model} échouée (${res.status}) :`, lastErrorDetail.slice(0, 300));

      // Si 401 (clé API invalide), inutile de tester d'autres modèles, c'est la clé
      if (res.status === 401) {
        upstream = res;
        break;
      }
    } catch (err) {
      lastErrorDetail = err instanceof Error ? err.message : String(err);
      console.error(`[chatbot] Exception fetch modèle ${model} :`, lastErrorDetail);
    }
  }

  if (!upstream || !upstream.ok || !upstream.body) {
    let parsedMessage = "";
    try {
      const parsed = JSON.parse(lastErrorDetail);
      parsedMessage = parsed.error?.message || "";
    } catch {
      parsedMessage = lastErrorDetail.slice(0, 200);
    }

    const status = upstream?.status || 502;
    let userMsg = "L'assistant est momentanément indisponible. Écrivez à Youssouf sur WhatsApp.";

    if (status === 401) {
      userMsg = `Clé API Groq non reconnue (${parsedMessage || "vérifiez sur console.groq.com/keys"}).`;
    } else if (status === 429) {
      userMsg = "Quota gratuit Groq temporairement atteint. Réessayez dans une minute ou écrivez sur WhatsApp.";
    } else if (parsedMessage) {
      userMsg = `Service Groq : ${parsedMessage}`;
    }

    return jsonError(userMsg, status === 429 ? 429 : status === 401 ? 401 : 502);
  }

  // Conversion du flux SSE OpenAI-compatible en simple flux de texte
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const json = JSON.parse(data);
              const delta: string | undefined = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // fragment partiel ignoré
            }
          }
        }
      } catch (err) {
        console.error("[chatbot] Flux interrompu :", err);
      } finally {
        controller.close();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
