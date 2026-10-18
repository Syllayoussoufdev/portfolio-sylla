"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { SkillType } from "@/app/generated/prisma/client";

export type SkillActionState = {
  error?: string;
  success?: boolean;
};

/**
 * 1. Créer une nouvelle famille de compétences
 */
export async function createSkillCategoryAction(
  prevState: SkillActionState | undefined,
  formData: FormData
): Promise<SkillActionState> {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  const titre = (formData.get("titre") as string)?.trim();
  const rawSlug = (formData.get("slug") as string)?.trim().toLowerCase();
  const description = (formData.get("description") as string)?.trim() || null;
  const icon = (formData.get("icon") as string)?.trim() || "Code";
  const ordre = parseInt((formData.get("ordre") as string) || "0", 10);

  if (!titre) return { error: "Le titre de la catégorie est obligatoire." };

  const slug =
    rawSlug ||
    titre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  try {
    const existing = await prisma.skillCategory.findUnique({ where: { slug } });
    if (existing) {
      return { error: `Le slug "${slug}" est déjà utilisé par une autre catégorie.` };
    }

    await prisma.skillCategory.create({
      data: {
        titre,
        slug,
        description,
        icon,
        ordre,
      },
    });

    revalidatePath("/admin/competences");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Erreur lors de la création de la catégorie." };
  }
}

/**
 * 2. Modifier une famille de compétences
 */
export async function updateSkillCategoryAction(
  categoryId: string,
  prevState: SkillActionState | undefined,
  formData: FormData
): Promise<SkillActionState> {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  const titre = (formData.get("titre") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const icon = (formData.get("icon") as string)?.trim() || "Code";
  const ordre = parseInt((formData.get("ordre") as string) || "0", 10);

  if (!titre) return { error: "Le titre est obligatoire." };

  try {
    await prisma.skillCategory.update({
      where: { id: categoryId },
      data: {
        titre,
        description,
        icon,
        ordre,
      },
    });

    revalidatePath("/admin/competences");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Erreur de mise à jour." };
  }
}

/**
 * 3. Supprimer une famille de compétences
 */
export async function deleteSkillCategoryAction(categoryId: string): Promise<SkillActionState> {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  try {
    await prisma.skillCategory.delete({
      where: { id: categoryId },
    });

    revalidatePath("/admin/competences");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Erreur de suppression." };
  }
}

/**
 * 4. Ajouter une compétence ou un outil
 */
export async function createSkillAction(
  prevState: SkillActionState | undefined,
  formData: FormData
): Promise<SkillActionState> {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  const categoryId = (formData.get("categoryId") as string)?.trim();
  const nom = (formData.get("nom") as string)?.trim();
  const rawType = (formData.get("type") as string)?.trim();
  const niveau = (formData.get("niveau") as string)?.trim() || null;
  const rawPourcentage = (formData.get("pourcentage") as string)?.trim();
  const ordre = parseInt((formData.get("ordre") as string) || "0", 10);

  if (!categoryId || !nom) {
    return { error: "Le nom et la catégorie sont obligatoires." };
  }

  const type = rawType === "OUTIL" ? SkillType.OUTIL : SkillType.COMPETENCE;
  const pourcentage = rawPourcentage ? parseInt(rawPourcentage, 10) : null;

  try {
    await prisma.skill.create({
      data: {
        categoryId,
        nom,
        type,
        niveau,
        pourcentage: isNaN(Number(pourcentage)) ? null : pourcentage,
        ordre,
        visible: true,
      },
    });

    revalidatePath("/admin/competences");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Erreur lors de l'ajout de la compétence." };
  }
}

/**
 * 5. Supprimer une compétence ou un outil
 */
export async function deleteSkillAction(skillId: string): Promise<SkillActionState> {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  try {
    await prisma.skill.delete({
      where: { id: skillId },
    });

    revalidatePath("/admin/competences");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Erreur de suppression." };
  }
}

/**
 * 6. Mettre à jour l'attribution des sous-portfolios pour une famille
 */
export async function updateCategorySubPortfoliosAction(
  categoryId: string,
  subPortfolioIds: string[]
): Promise<SkillActionState> {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  try {
    await prisma.subPortfolioSkillCategory.deleteMany({
      where: { categoryId },
    });

    for (let i = 0; i < subPortfolioIds.length; i++) {
      await prisma.subPortfolioSkillCategory.create({
        data: {
          categoryId,
          subPortfolioId: subPortfolioIds[i],
          ordre: i,
        },
      });
    }

    revalidatePath("/admin/competences");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Erreur lors de l'attribution." };
  }
}
