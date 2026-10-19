"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession, destroySession, verifyAdminCredentials } from "@/lib/auth";
import { checkRateLimit, incrementRateLimit, resetRateLimit } from "@/lib/rate-limit";

const LoginSchema = z.object({
  email: z.string().email("Veuillez saisir une adresse email valide"),
  password: z.string().min(1, "Le mot de passe est obligatoire"),
});

export type ActionState = {
  error?: string;
  success?: boolean;
};

export async function loginAction(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");
  const from = (formData.get("from") as string) || "/admin";

  const validatedFields = LoginSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0]?.message || "Données invalides",
    };
  }

  const { email, password } = validatedFields.data;
  const rateLimitKey = `login:${email.toLowerCase().trim()}`;

  // 1. Contrôle de limitation de débit (5 tentatives max par tranche de 15 minutes)
  const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    const minutesRemaining = Math.max(1, Math.ceil(rateLimit.retryAfterSeconds / 60));
    return {
      error: `Trop de tentatives de connexion échouées. Par mesure de sécurité, veuillez patienter ${minutesRemaining} minute(s) avant de réessayer.`,
    };
  }

  const isValid = await verifyAdminCredentials(email, password);
  if (!isValid) {
    incrementRateLimit(rateLimitKey, 15 * 60 * 1000);
    const remaining = Math.max(0, rateLimit.remaining - 1);
    return {
      error:
        remaining > 0
          ? `Email ou mot de passe incorrect. (${remaining} tentative${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""})`
          : "Trop de tentatives de connexion échouées. Compte temporairement verrouillé pour 15 minutes.",
    };
  }

  // 2. Réinitialisation du quota en cas de succès
  resetRateLimit(rateLimitKey);

  await createSession(email);
  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
