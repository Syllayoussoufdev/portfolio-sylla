"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const SubPortfolioSchema = z.object({
  label: z.string().min(2, "Le label est obligatoire"),
  slug: z
    .string()
    .min(2, "Le slug doit comporter au moins 2 caractères")
    .regex(/^[a-z0-9-]+$/, "Le slug ne peut contenir que des minuscules, chiffres et tirets"),
  description: z.string().optional(),
  actif: z.boolean().default(true),
  projectIds: z.array(z.string()).default([]),
});

export type SubPortfolioActionState = {
  error?: string;
  success?: boolean;
};

/**
 * Création d'un sous-portfolio
 */
export async function createSubPortfolioAction(
  prevState: SubPortfolioActionState | undefined,
  formData: FormData
): Promise<SubPortfolioActionState> {
  const session = await getSession();
  if (!session) {
    return { error: "Non autorisé" };
  }

  const selectedProjects = formData.getAll("projectIds") as string[];

  const parsed = SubPortfolioSchema.safeParse({
    label: formData.get("label"),
    slug: (formData.get("slug") as string)?.toLowerCase().trim(),
    description: formData.get("description") || undefined,
    actif: formData.get("actif") === "on" || formData.get("actif") === "true",
    projectIds: selectedProjects,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Champs invalides" };
  }

  const data = parsed.data;

  // Vérifier l'unicité du slug
  const existing = await prisma.subPortfolio.findUnique({
    where: { slug: data.slug },
  });

  if (existing) {
    return { error: `Le slug "/${data.slug}" est déjà réservé.` };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const sub = await tx.subPortfolio.create({
        data: {
          label: data.label,
          slug: data.slug,
          description: data.description || null,
          actif: data.actif,
        },
      });

      if (data.projectIds.length > 0) {
        await tx.subPortfolioProject.createMany({
          data: data.projectIds.map((pId, index) => ({
            subPortfolioId: sub.id,
            projectId: pId,
            ordre: index,
          })),
        });
      }
    });
  } catch (err) {
    console.error("Erreur création sous-portfolio:", err);
    return { error: "Échec de l'enregistrement en base de données." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/portfolios");
  revalidatePath(`/${data.slug}`);
  redirect("/admin/portfolios");
}

/**
 * Modification d'un sous-portfolio
 */
export async function updateSubPortfolioAction(
  id: string,
  prevState: SubPortfolioActionState | undefined,
  formData: FormData
): Promise<SubPortfolioActionState> {
  const session = await getSession();
  if (!session) {
    return { error: "Non autorisé" };
  }

  const selectedProjects = formData.getAll("projectIds") as string[];

  const parsed = SubPortfolioSchema.safeParse({
    label: formData.get("label"),
    slug: (formData.get("slug") as string)?.toLowerCase().trim(),
    description: formData.get("description") || undefined,
    actif: formData.get("actif") === "on" || formData.get("actif") === "true",
    projectIds: selectedProjects,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Champs invalides" };
  }

  const data = parsed.data;

  // Vérifier l'unicité du slug s'il a changé
  const existingWithSlug = await prisma.subPortfolio.findFirst({
    where: {
      slug: data.slug,
      NOT: { id },
    },
  });

  if (existingWithSlug) {
    return { error: `Le slug "/${data.slug}" est déjà utilisé.` };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.subPortfolio.update({
        where: { id },
        data: {
          label: data.label,
          slug: data.slug,
          description: data.description || null,
          actif: data.actif,
        },
      });

      // Synchronisation des liaisons
      await tx.subPortfolioProject.deleteMany({
        where: { subPortfolioId: id },
      });

      if (data.projectIds.length > 0) {
        await tx.subPortfolioProject.createMany({
          data: data.projectIds.map((pId, index) => ({
            subPortfolioId: id,
            projectId: pId,
            ordre: index,
          })),
        });
      }
    });
  } catch (err) {
    console.error("Erreur modification sous-portfolio:", err);
    return { error: "Échec de la mise à jour." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/portfolios");
  revalidatePath(`/${data.slug}`);
  redirect("/admin/portfolios");
}

/**
 * Suppression d'un sous-portfolio
 */
export async function deleteSubPortfolioAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  try {
    await prisma.subPortfolio.delete({
      where: { id },
    });
  } catch (err) {
    console.error("Erreur suppression sous-portfolio:", err);
    return;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/portfolios");
}

/**
 * Bascule actif / inactif
 */
export async function toggleSubPortfolioStatusAction(id: string, currentActif: boolean): Promise<void> {
  const session = await getSession();
  if (!session) return;

  await prisma.subPortfolio.update({
    where: { id },
    data: { actif: !currentActif },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/portfolios");
}
