"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession, destroySession, verifyAdminCredentials } from "@/lib/auth";

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

  const isValid = await verifyAdminCredentials(email, password);
  if (!isValid) {
    return {
      error: "Email ou mot de passe incorrect.",
    };
  }

  await createSession(email);
  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
