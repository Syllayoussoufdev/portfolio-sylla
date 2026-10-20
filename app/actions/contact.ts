"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, incrementRateLimit } from "@/lib/rate-limit";
import { escapeHtml } from "@/lib/utils";

export const ContactSchema = z.object({
  nom: z
    .string()
    .min(2, "Veuillez renseigner un nom valide (au moins 2 caractères)")
    .max(100, "Le nom ne doit pas dépasser 100 caractères"),
  email: z
    .string()
    .email("Veuillez renseigner une adresse email valide")
    .max(200, "L'adresse email est trop longue"),
  message: z
    .string()
    .min(10, "Votre message doit comporter au moins 10 caractères")
    .max(3000, "Votre message ne doit pas dépasser 3 000 caractères"),
  company_website: z.string().optional(),
});

export type ContactActionState = {
  success?: boolean;
  error?: string;
};

export async function sendContactMessage(
  prevState: ContactActionState | undefined,
  formData: FormData
): Promise<ContactActionState> {
  try {
    // 1. Récupération de l'adresse IP cliente pour la limitation de débit
    let clientIp = "127.0.0.1";
    try {
      const headersList = await headers();
      clientIp =
        headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headersList.get("x-real-ip") ||
        "127.0.0.1";
    } catch {
      // Ignorer si headers() n'est pas disponible (ex: tests)
    }

    // 2. Limitation de débit (5 messages par tranche de 15 minutes par IP)
    const rateLimitKey = `contact:${clientIp}`;
    const rateResult = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
    if (!rateResult.allowed) {
      return {
        error: `Trop de messages envoyés récemment. Veuillez patienter ${rateResult.retryAfterSeconds}s avant de réessayer.`,
      };
    }

    // 3. Extraction et validation Zod
    const rawData = {
      nom: (formData.get("nom") as string) || "",
      email: (formData.get("email") as string) || "",
      message: (formData.get("message") as string) || "",
      company_website: (formData.get("company_website") as string) || "",
    };

    // Piège anti-spam (Honeypot) : si le champ invisible est rempli, feindre le succès sans rien enregistrer
    if (rawData.company_website && rawData.company_website.trim().length > 0) {
      console.warn(`[Anti-Spam] Bot détecté via champ honeypot depuis l'IP ${clientIp}`);
      return { success: true };
    }

    const parsed = ContactSchema.safeParse(rawData);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || "Données invalides" };
    }

    // Incrémenter la consommation du quota anti-abus
    incrementRateLimit(rateLimitKey, 15 * 60 * 1000);

    const safeNom = parsed.data.nom.trim();
    const safeEmail = parsed.data.email.trim().toLowerCase();
    const safeMessage = parsed.data.message.trim();

    // 4. Enregistrement systématique en base AVANT tout envoi réseau
    await prisma.contactMessage.create({
      data: {
        nom: safeNom,
        email: safeEmail,
        message: safeMessage,
      },
    });

    // 5. Envoi par e-mail via Resend (si configuré)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
        const toEmail =
          process.env.CONTACT_EMAIL ||
          process.env.ADMIN_EMAIL ||
          "contact@syllayoussouf.com";

        const escapedNom = escapeHtml(safeNom);
        const escapedEmail = escapeHtml(safeEmail);
        const escapedMessage = escapeHtml(safeMessage).replace(/\n/g, "<br/>");

        await resend.emails.send({
          from: `Portfolio Sylla <${fromEmail}>`,
          to: [toEmail],
          replyTo: safeEmail,
          subject: `[Portfolio] Nouveau message de ${escapedNom}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 12px;">Nouveau message de contact</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 100px;"><strong>Expéditeur :</strong></td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><strong>${escapedNom}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px;"><strong>Email :</strong></td>
                  <td style="padding: 8px 0; color: #2563eb; font-size: 14px;"><a href="mailto:${escapedEmail}" style="color: #2563eb; text-decoration: none;">${escapedEmail}</a></td>
                </tr>
              </table>
              <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #2563eb;">
                <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapedMessage}</p>
              </div>
              <p style="margin-top: 24px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                Ce message a été envoyé via le formulaire de contact sur <a href="https://syllayoussouf.com" style="color: #64748b;">syllayoussouf.com</a>. Cliquez directement sur « Répondre » pour écrire à ${escapedNom}.
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        // L'échec d'e-mail est journalisé sans dégrader l'expérience du visiteur
        console.error("[Contact Resend Error]: Échec de l'envoi d'e-mail :", emailErr);
      }
    } else {
      console.info("[Contact]: Message enregistré en base (RESEND_API_KEY non renseignée).");
    }

    return { success: true };
  } catch (err) {
    console.error("[Contact Action Error]:", err);
    return {
      error: "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.",
    };
  }
}
