import { NextRequest } from "next/server";
import { z } from "zod";
import { buildChatbotSystemPrompt } from "@/lib/chatbot-context";
import { checkRateLimit, incrementRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_FALLBACK_MODEL = process.env.GROQ_FALLBACK_MODEL || "llama-3.1-8b-instant";

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
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return jsonError("L'assistant n'est pas encore configuré. Contactez Youssouf sur WhatsApp.", 503);
  }

  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous";
  const rateKey = `chatbot:${ip}`;
  const rate = checkRateLimit(rateKey, RATE_MAX, RATE_WINDOW_MS);
  if (!rate.allowed) {
    return jsonError(
      `Vous avez envoyé beaucoup de messages. Réessayez dans ${Math.ceil(rate.retryAfterSeconds / 60)} min ou écrivez directement sur WhatsApp.`,
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

  // On ne garde que les 12 derniers échanges pour limiter les tokens
  const history = body.messages.slice(-12);

  let upstream: Response;
  const callGroq = (model: string) =>
    fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.5,
        max_tokens: 600,
        messages: [{ role: "system", content: systemPrompt + pageContext }, ...history],
      }),
    });

  try {
    upstream = await callGroq(GROQ_MODEL);
    // Quota gratuit du modèle principal atteint → bascule sur le modèle de secours
    if (upstream.status === 429 && GROQ_FALLBACK_MODEL !== GROQ_MODEL) {
      upstream = await callGroq(GROQ_FALLBACK_MODEL);
    }
  } catch (err) {
    console.error("[chatbot] Groq injoignable :", err);
    return jsonError("L'assistant est momentanément indisponible. Écrivez à Youssouf sur WhatsApp.", 502);
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error(`[chatbot] Erreur Groq ${upstream.status} :`, detail.slice(0, 500));
    const msg =
      upstream.status === 429
        ? "L'assistant reçoit beaucoup de demandes. Réessayez dans un instant ou écrivez sur WhatsApp."
        : "L'assistant est momentanément indisponible. Écrivez à Youssouf sur WhatsApp.";
    return jsonError(msg, upstream.status === 429 ? 429 : 502);
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
              // fragment JSON incomplet : ignoré
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
