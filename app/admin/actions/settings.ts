"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { SiteSettingsSchema, type SiteSettingsInput } from "@/lib/validations/profile";

export type SettingsActionState = {
  error?: string;
  success?: boolean;
};

/**
 * Mise à jour des réglages globaux du site (SiteSettings).
 */
export async function updateSiteSettingsAction(
  prevState: SettingsActionState | undefined,
  formData: FormData
): Promise<SettingsActionState> {
  const session = await getSession();
  if (!session) {
    return { error: "Non autorisé : session requise" };
  }

  const rawData: Record<string, unknown> = {
    nom: formData.get("nom"),
    metier: formData.get("metier") || null,
    emailPublic: formData.get("emailPublic") || null,
    whatsapp: formData.get("whatsapp") || null,
    github: formData.get("github") || null,
    linkedin: formData.get("linkedin") || null,
    twitter: formData.get("twitter") || null,
    instagram: formData.get("instagram") || null,
  };

  const parsed = SiteSettingsSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Données invalides" };
  }

  const data: SiteSettingsInput = parsed.data;

  try {
    const existing = await prisma.siteSettings.findFirst();

    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: {
          nom: data.nom,
          metier: data.metier || null,
          emailPublic: data.emailPublic || null,
          whatsapp: data.whatsapp || null,
          github: data.github || null,
          linkedin: data.linkedin || null,
          twitter: data.twitter || null,
          instagram: data.instagram || null,
        },
      });
    } else {
      await prisma.siteSettings.create({
        data: {
          nom: data.nom,
          metier: data.metier || null,
          emailPublic: data.emailPublic || null,
          whatsapp: data.whatsapp || null,
          github: data.github || null,
          linkedin: data.linkedin || null,
          twitter: data.twitter || null,
          instagram: data.instagram || null,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/reglages");
    revalidatePath("/projets");
    revalidatePath("/contact");

    return { success: true };
  } catch (err) {
    console.error("Erreur enregistrement réglages site:", err);
    return { error: "Impossible d'enregistrer les réglages en base." };
  }
}
