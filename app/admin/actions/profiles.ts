"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { getSession } from "@/lib/auth";
import { validateProfileSlug } from "@/lib/constants/reserved-slugs";
import {
  ProfileSchema,
  type ProfileInput,
  type SectionItem,
} from "@/lib/validations/profile";

export type ProfileActionState = {
  error?: string;
  success?: boolean;
};

/**
 * Parse et prépare les données depuis FormData
 */
function parseFormData(formData: FormData): {
  parsedData?: ProfileInput;
  error?: string;
} {
  const label = (formData.get("label") as string) || "";
  const rawSlug = (formData.get("slug") as string) || "";
  const slug = rawSlug.trim().toLowerCase();

  // 1. Validation du slug réservé
  const slugCheck = validateProfileSlug(slug);
  if (!slugCheck.valid) {
    return { error: slugCheck.error };
  }

  // 2. Préparation du Hero
  const rawHeroOutils = formData.getAll("heroOutils") as string[];
  const heroData = {
    headline: (formData.get("headline") as string) || "",
    subline: (formData.get("subline") as string) || "",
    tagline: (formData.get("tagline") as string) || undefined,
    ctaPrimary: {
      label: (formData.get("ctaPrimaryLabel") as string) || "",
      href: (formData.get("ctaPrimaryHref") as string) || "",
    },
    ctaSecondary: {
      label: (formData.get("ctaSecondaryLabel") as string) || "",
      href: (formData.get("ctaSecondaryHref") as string) || "",
    },
    media: {
      kind: ((formData.get("mediaKind") as string) || "image") as "image" | "abstract",
      alt: (formData.get("mediaAlt") as string) || undefined,
    },
    outils: rawHeroOutils.length > 0 ? rawHeroOutils : undefined,
  };

  // 3. Préparation des sections
  const rawSections = (formData.get("sectionsJson") as string) || "[]";
  let sections: SectionItem[] = [];
  try {
    sections = JSON.parse(rawSections);
  } catch {
    sections = [
      { key: "hero", visible: true, order: 0 },
      { key: "projets", visible: true, order: 1 },
      { key: "competences", visible: true, order: 2 },
      { key: "apropos", visible: true, order: 3 },
      { key: "contact", visible: true, order: 4 },
    ];
  }

  const rawSubPortfolioId = (formData.get("subPortfolioId") as string) || null;
  const heroMediaId = (formData.get("heroMediaId") as string) || null;

  // Extraction des familles de compétences sélectionnées
  const rawSkillsFamilies = formData.getAll("skillsFamilies") as string[];

  const rawProfile = {
    label,
    slug,
    template: (formData.get("template") as string) || "creatif",
    accent: (formData.get("accent") as string) || "default",
    hero: heroData,
    sections,
    variables: {
      skillsFamilies: rawSkillsFamilies,
    },
    seoTitle: (formData.get("seoTitle") as string) || null,
    seoDescription: (formData.get("seoDescription") as string) || null,
    heroMediaId: heroMediaId && heroMediaId !== "" ? heroMediaId : null,
    isDefault: formData.get("isDefault") === "on" || formData.get("isDefault") === "true",
    actif: formData.get("actif") === "on" || formData.get("actif") === "true",
    subPortfolioId: rawSubPortfolioId && rawSubPortfolioId !== "" ? rawSubPortfolioId : null,
  };

  const parsed = ProfileSchema.safeParse(rawProfile);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Données du profil invalides" };
  }

  return { parsedData: parsed.data };
}

/**
 * Création d'un nouveau profil
 */
export async function createProfileAction(
  prevState: ProfileActionState | undefined,
  formData: FormData
): Promise<ProfileActionState> {
  const session = await getSession();
  if (!session) {
    return { error: "Non autorisé" };
  }

  const { parsedData, error } = parseFormData(formData);
  if (error || !parsedData) {
    return { error: error || "Erreur de formulaire" };
  }

  // Vérifier l'unicité du slug
  const existing = await prisma.profile.findUnique({
    where: { slug: parsedData.slug },
  });

  if (existing) {
    return { error: `Le slug "/${parsedData.slug}" est déjà utilisé par un autre profil.` };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Si ce profil devient le profil par défaut, désactiver isDefault sur les autres
      if (parsedData.isDefault) {
        await tx.profile.updateMany({
          where: { isDefault: true },
          data: { isDefault: false },
        });
      }

      await tx.profile.create({
        data: {
          label: parsedData.label,
          slug: parsedData.slug,
          template: parsedData.template,
          accent: parsedData.accent,
          hero: parsedData.hero as unknown as Prisma.InputJsonValue,
          sections: parsedData.sections as unknown as Prisma.InputJsonValue,
          variables: (parsedData.variables || {}) as unknown as Prisma.InputJsonValue,
          seoTitle: parsedData.seoTitle,
          seoDescription: parsedData.seoDescription,
          heroMediaId: parsedData.heroMediaId,
          isDefault: parsedData.isDefault,
          actif: parsedData.actif,
          subPortfolioId: parsedData.subPortfolioId,
        },
      });
    });
  } catch (err) {
    console.error("Erreur création profil:", err);
    return { error: "Impossible de créer le profil en base de données." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/profils");
  redirect("/admin/profils");
}

/**
 * Mise à jour d'un profil existant
 */
export async function updateProfileAction(
  id: string,
  prevState: ProfileActionState | undefined,
  formData: FormData
): Promise<ProfileActionState> {
  const session = await getSession();
  if (!session) {
    return { error: "Non autorisé" };
  }

  const { parsedData, error } = parseFormData(formData);
  if (error || !parsedData) {
    return { error: error || "Erreur de formulaire" };
  }

  // Vérifier l'unicité du slug s'il a changé
  const existing = await prisma.profile.findFirst({
    where: {
      slug: parsedData.slug,
      NOT: { id },
    },
  });

  if (existing) {
    return { error: `Le slug "/${parsedData.slug}" est déjà utilisé par un autre profil.` };
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (parsedData.isDefault) {
        await tx.profile.updateMany({
          where: {
            isDefault: true,
            NOT: { id },
          },
          data: { isDefault: false },
        });
      }

      await tx.profile.update({
        where: { id },
        data: {
          label: parsedData.label,
          slug: parsedData.slug,
          template: parsedData.template,
          accent: parsedData.accent,
          hero: parsedData.hero as unknown as Prisma.InputJsonValue,
          sections: parsedData.sections as unknown as Prisma.InputJsonValue,
          variables: (parsedData.variables || {}) as unknown as Prisma.InputJsonValue,
          seoTitle: parsedData.seoTitle,
          seoDescription: parsedData.seoDescription,
          heroMediaId: parsedData.heroMediaId,
          isDefault: parsedData.isDefault,
          actif: parsedData.actif,
          subPortfolioId: parsedData.subPortfolioId,
        },
      });
    });
  } catch (err) {
    console.error("Erreur mise à jour profil:", err);
    return { error: "Impossible de mettre à jour le profil en base de données." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/profils");
  revalidatePath(`/admin/profils/${id}`);
  revalidatePath(`/${parsedData.slug}`);
  redirect("/admin/profils");
}

/**
 * Suppression d'un profil
 */
export async function deleteProfileAction(id: string): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  const profile = await prisma.profile.findUnique({
    where: { id },
  });

  if (!profile) return { error: "Profil introuvable" };

  if (profile.isDefault) {
    return { error: "Impossible de supprimer le profil par défaut du site." };
  }

  try {
    await prisma.profile.delete({
      where: { id },
    });
  } catch (err) {
    console.error("Erreur suppression profil:", err);
    return { error: "Erreur lors de la suppression." };
  }

  revalidatePath("/admin/profils");
  revalidatePath("/");
  return {};
}

/**
 * Bascule d'activation d'un profil
 */
export async function toggleProfileActiveAction(id: string, currentActive: boolean) {
  const session = await getSession();
  if (!session) return;

  await prisma.profile.update({
    where: { id },
    data: { actif: !currentActive },
  });

  revalidatePath("/admin/profils");
  revalidatePath("/");
}

/**
 * Définit un profil comme profil par défaut pour la racine "/"
 */
export async function setDefaultProfileAction(id: string) {
  const session = await getSession();
  if (!session) return;

  await prisma.$transaction([
    prisma.profile.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    }),
    prisma.profile.update({
      where: { id },
      data: { isDefault: true, actif: true },
    }),
  ]);

  revalidatePath("/admin/profils");
  revalidatePath("/");
}
