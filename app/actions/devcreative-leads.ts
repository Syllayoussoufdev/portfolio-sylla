"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, incrementRateLimit } from "@/lib/rate-limit";
import { escapeHtml } from "@/lib/utils";
import {
  ProjectLeadWizardSchema,
  WaitlistSchema,
  type ProjectLeadWizardInput,
} from "@/lib/validations/devcreative";

export interface LeadSubmissionResult {
  success?: boolean;
  error?: string;
  leadId?: string;
  whatsappUrl?: string;
  statusCode?: number;
}

const DEFAULT_WHATSAPP_NUMBER = "2250594564993";

function cleanPhoneForWhatsApp(rawPhone: string | null | undefined): string {
  const digits = (rawPhone || "").replace(/[^0-9]/g, "");
  if (digits.length === 10 && digits.startsWith("0")) {
    return `225${digits}`;
  }
  return digits.length >= 8 ? digits : DEFAULT_WHATSAPP_NUMBER;
}

export async function submitProjectLeadAction(
  rawInput: ProjectLeadWizardInput
): Promise<LeadSubmissionResult> {
  try {
    let clientIp = "127.0.0.1";
    try {
      const headersList = await headers();
      clientIp =
        headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headersList.get("x-real-ip") ||
        "127.0.0.1";
    } catch {
      // Fallback hors contexte requête
    }

    // 1. Piège anti-spam Honeypot
    if (rawInput.company_website && rawInput.company_website.trim().length > 0) {
      return { success: true, statusCode: 201 };
    }

    // 2. Limitation de débit par IP (429)
    const rateKey = `lead:${clientIp}`;
    const rateResult = checkRateLimit(rateKey, 6, 15 * 60 * 1000);
    if (!rateResult.allowed) {
      return {
        error: `Trop de demandes envoyées récemment. Veuillez patienter ${rateResult.retryAfterSeconds}s.`,
        statusCode: 429,
      };
    }

    // 3. Validation Zod stricte (400)
    const parsed = ProjectLeadWizardSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message || "Données du brief invalides.",
        statusCode: 400,
      };
    }

    incrementRateLimit(rateKey, 15 * 60 * 1000);

    const data = parsed.data;
    const safeName = data.name.trim();
    const safeEmail = data.email.trim().toLowerCase();
    const safePhone = data.phone.trim();
    const safeGoal = data.goal.trim();
    const safeMessage = (data.message || "").trim();

    // 4. Enregistrement du Lead en base PostgreSQL
    let createdLeadId = `lead-${Date.now()}`;
    let targetWhatsappNumber = DEFAULT_WHATSAPP_NUMBER;

    try {
      const [lead, settings] = await Promise.all([
        prisma.projectLead.create({
          data: {
            typeProjet: data.projectType,
            objectif: safeGoal,
            budgetTranche: data.budgetRange,
            delai: data.deadline,
            nom: safeName,
            email: safeEmail,
            telephone: safePhone,
            message: safeMessage || null,
            consentement: true,
            utm: data.utm || {},
            statut: "NOUVEAU",
          },
        }),
        prisma.siteSettings.findFirst(),
      ]);
      createdLeadId = lead.id;
      if (settings?.whatsapp) {
        targetWhatsappNumber = cleanPhoneForWhatsApp(settings.whatsapp);
      }
    } catch (dbErr) {
      console.error("[Lead] Erreur écriture base :", dbErr);
    }

    // 5. Construction du lien WhatsApp pré-rempli (PRD §4.6 & §11)
    const waLines = [
      `Bonjour Sylla 👋, je viens de remplir un brief sur votre site :`,
      ``,
      `• *Projet :* ${data.projectType}`,
      `• *Objectif :* ${safeGoal}`,
      `• *Budget estimé :* ${data.budgetRange}`,
      `• *Délai souhaité :* ${data.deadline}`,
      `• *Contact :* ${safeName} (${safePhone} / ${safeEmail})`,
    ];
    if (safeMessage) {
      waLines.push(`• *Précisions :* ${safeMessage}`);
    }
    const whatsappUrl = `https://wa.me/${targetWhatsappNumber}?text=${encodeURIComponent(
      waLines.join("\n")
    )}`;

    // 6. Notification Email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
        const toEmail =
          process.env.CONTACT_EMAIL ||
          process.env.ADMIN_EMAIL ||
          "youssoufs1209@gmail.com";

        await resend.emails.send({
          from: `DevCreative Sylla <${fromEmail}>`,
          to: [toEmail],
          replyTo: safeEmail,
          subject: `🔥 [Brief Qualifié] ${escapeHtml(safeName)} — ${escapeHtml(data.projectType)} (${escapeHtml(data.budgetRange)})`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #E6DEC8; border-radius: 16px; background: #ffffff;">
              <div style="background: #091410; color: #ffffff; padding: 16px 20px; border-radius: 12px; margin-bottom: 20px;">
                <span style="color: #FF4D00; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Nouveau Lead DevCreative</span>
                <h2 style="margin: 4px 0 0; font-size: 20px;">${escapeHtml(safeName)} — ${escapeHtml(data.projectType)}</h2>
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #0D1F1A;">
                <tr><td style="padding: 8px 0; color: #4A635B; width: 140px;"><strong>Type de projet :</strong></td><td style="padding: 8px 0;"><strong>${escapeHtml(data.projectType)}</strong></td></tr>
                <tr><td style="padding: 8px 0; color: #4A635B;"><strong>Budget estimé :</strong></td><td style="padding: 8px 0; color: #FF4D00; font-weight: 700;">${escapeHtml(data.budgetRange)}</td></tr>
                <tr><td style="padding: 8px 0; color: #4A635B;"><strong>Délai souhaité :</strong></td><td style="padding: 8px 0;">${escapeHtml(data.deadline)}</td></tr>
                <tr><td style="padding: 8px 0; color: #4A635B;"><strong>WhatsApp / Tél :</strong></td><td style="padding: 8px 0;"><a href="https://wa.me/${cleanPhoneForWhatsApp(safePhone)}" style="color: #00A86B; font-weight: 600;">${escapeHtml(safePhone)}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #4A635B;"><strong>Email :</strong></td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(safeEmail)}" style="color: #00A86B;">${escapeHtml(safeEmail)}</a></td></tr>
              </table>
              <div style="margin-top: 16px; padding: 16px; background: #FFFBF5; border-radius: 12px; color: #0D1F1A; font-size: 14px; line-height: 1.6;">
                <strong>Objectif principal :</strong><br/>
                ${escapeHtml(safeGoal).replace(/\n/g, "<br/>")}
                ${safeMessage ? `<br/><br/><strong>Détails complémentaires :</strong><br/>${escapeHtml(safeMessage).replace(/\n/g, "<br/>")}` : ""}
              </div>
              <div style="margin-top: 20px; text-align: center;">
                <a href="https://wa.me/${cleanPhoneForWhatsApp(safePhone)}" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; font-weight: 700; padding: 12px 24px; border-radius: 999px; font-size: 14px;">Répondre sur WhatsApp au prospect</a>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.warn("[Lead] Avertissement envoi email Resend :", emailErr);
      }
    }

    return {
      success: true,
      leadId: createdLeadId,
      whatsappUrl,
      statusCode: 201,
    };
  } catch (err) {
    console.error("[Lead] Erreur inattendue :", err);
    return {
      error: "Une erreur est survenue lors de l'envoi du brief. Veuillez réessayer.",
      statusCode: 500,
    };
  }
}

export async function submitWaitlistAction(rawInput: {
  email: string;
  offreVisee: string;
  consentement: true;
  company_website?: string;
}): Promise<{ success?: boolean; error?: string; statusCode?: number }> {
  try {
    let clientIp = "127.0.0.1";
    try {
      const headersList = await headers();
      clientIp =
        headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    } catch {
      // Fallback
    }

    if (rawInput.company_website && rawInput.company_website.trim().length > 0) {
      return { success: true, statusCode: 201 };
    }

    const rateKey = `waitlist:${clientIp}`;
    const rateResult = checkRateLimit(rateKey, 6, 15 * 60 * 1000);
    if (!rateResult.allowed) {
      return {
        error: `Trop de tentatives. Veuillez réessayer dans ${rateResult.retryAfterSeconds}s.`,
        statusCode: 429,
      };
    }

    const parsed = WaitlistSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message || "Données invalides",
        statusCode: 400,
      };
    }

    incrementRateLimit(rateKey, 15 * 60 * 1000);

    await prisma.waitlistEntry.create({
      data: {
        email: parsed.data.email.trim().toLowerCase(),
        offreVisee: parsed.data.offreVisee.trim(),
        consentement: true,
      },
    });

    return { success: true, statusCode: 201 };
  } catch (err) {
    console.error("[Waitlist] Erreur :", err);
    return {
      error: "Impossible d'enregistrer votre inscription pour le moment.",
      statusCode: 500,
    };
  }
}
