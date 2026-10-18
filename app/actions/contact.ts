"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const ContactSchema = z.object({
  nom: z.string().min(2, "Veuillez renseigner un nom valide (au moins 2 caractères)"),
  email: z.string().email("Veuillez renseigner une adresse email valide"),
  message: z.string().min(10, "Votre message doit comporter au moins 10 caractères"),
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
    const rawData = {
      nom: formData.get("nom") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    const parsed = ContactSchema.safeParse(rawData);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || "Données invalides" };
    }

    await prisma.contactMessage.create({
      data: {
        nom: parsed.data.nom.trim(),
        email: parsed.data.email.trim().toLowerCase(),
        message: parsed.data.message.trim(),
      },
    });

    return { success: true };
  } catch (err) {
    console.error("[Contact Action Error]:", err);
    return { error: "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer." };
  }
}
