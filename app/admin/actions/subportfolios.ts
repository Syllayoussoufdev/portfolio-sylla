"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isReservedSlug } from "@/lib/constants/reserved-slugs";
import type { HeroData, SectionItem } from "@/lib/validations/profile";

const SubPortfolioSchema = z.object({
  label: z.string().min(2, "Le label est obligatoire"),
  slug: z
    .string()
    .min(2, "Le slug doit comporter au moins 2 caractères")
    .regex(/^[a-z0-9-]+$/, "Le slug ne peut contenir que des minuscules, chiffres et tirets"),
  template: z
    .enum(["creatif", "developpeur", "immersif", "devcreative"])
    .default("creatif"),
  description: z.string().optional(),
  actif: z.boolean().default(true),
  projectIds: z.array(z.string()).default([]),
});

export type SubPortfolioActionState = {
  error?: string;
  success?: boolean;
};

/**
 * Détermine intelligemment le template le plus pertinent si non spécifié
 */
function inferTemplate(
  slug: string,
  label: string
): "creatif" | "developpeur" | "immersif" | "devcreative" {
  const s = slug.toLowerCase();
  const l = label.toLowerCase();
  if (s.includes("freelance") || s.includes("devcreative") || l.includes("freelance")) {
    return "devcreative";
  }
  if (
    s.includes("dev") ||
    s.includes("code") ||
    s.includes("web") ||
    s.includes("mobile") ||
    s.includes("tech") ||
    l.includes("dev") ||
    l.includes("web")
  ) {
    return "developpeur";
  }
  if (
    s.includes("video") ||
    s.includes("film") ||
    s.includes("montage") ||
    s.includes("motion") ||
    l.includes("video")
  ) {
    return "immersif";
  }
  return "creatif";
}

/**
 * Construit un Hero par défaut pour un nouveau sous-portfolio
 */
function buildDefaultHero(label: string, description?: string): HeroData {
  return {
    headline: label,
    subline:
      description ||
      "Découvrez une sélection ciblée de mes réalisations, projets et compétences.",
    tagline: label,
    ctaPrimary: {
      label: "Voir mes réalisations",
      href: "#projets",
    },
    ctaSecondary: {
      label: "Discuter d'un projet",
      href: "#contact",
    },
    media: {
      kind: "image",
      alt: `${label} - Sylla Youssouf`,
    },
  };
}

/**
 * Construit les sections par défaut pour un nouveau profil
 */
function buildDefaultSections(): SectionItem[] {
  return [
    { key: "hero", visible: true, order: 0 },
    { key: "projets", visible: true, order: 1 },
    { key: "competences", visible: true, order: 2 },
    { key: "apropos", visible: true, order: 3 },
    { key: "parcours", visible: true, order: 4 },
    { key: "contact", visible: true, order: 5 },
  ];
}

/**
 * Création d'un sous-portfolio et génération automatique de son profil public
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

  const rawTemplate = formData.get("template") as string;
  const parsed = SubPortfolioSchema.safeParse({
    label: formData.get("label"),
    slug: (formData.get("slug") as string)?.toLowerCase().trim(),
    template: rawTemplate || undefined,
    description: formData.get("description") || undefined,
    actif: formData.get("actif") === "on" || formData.get("actif") === "true",
    projectIds: selectedProjects,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Champs invalides" };
  }

  const data = parsed.data;

  // Interdire les slugs réservés (ex: admin, api, login, etc.)
  if (isReservedSlug(data.slug)) {
    return {
      error: `Le slug "/${data.slug}" est réservé par le système. Veuillez choisir un autre slug.`,
    };
  }

  // Vérifier l'unicité du slug
  const existingSub = await prisma.subPortfolio.findUnique({
    where: { slug: data.slug },
  });

  if (existingSub) {
    return { error: `Le slug "/${data.slug}" est déjà réservé par un autre sous-portfolio.` };
  }

  const chosenTemplate = data.template || inferTemplate(data.slug, data.label);

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Création du sous-portfolio
      const sub = await tx.subPortfolio.create({
        data: {
          label: data.label,
          slug: data.slug,
          description: data.description || null,
          actif: data.actif,
        },
      });

      // 2. Association des projets sélectionnés
      if (data.projectIds.length > 0) {
        await tx.subPortfolioProject.createMany({
          data: data.projectIds.map((pId, index) => ({
            subPortfolioId: sub.id,
            projectId: pId,
            ordre: index,
          })),
        });
      }

      // 3. Création ou synchronisation du Profil public lié
      const existingProfile = await tx.profile.findUnique({
        where: { slug: data.slug },
      });

      if (existingProfile) {
        await tx.profile.update({
          where: { id: existingProfile.id },
          data: {
            subPortfolioId: sub.id,
            label: data.label,
            template: chosenTemplate,
            actif: data.actif,
          },
        });
      } else {
        await tx.profile.create({
          data: {
            slug: data.slug,
            label: data.label,
            template: chosenTemplate,
            accent: "default",
            hero: buildDefaultHero(data.label, data.description) as any,
            sections: buildDefaultSections() as any,
            subPortfolioId: sub.id,
            actif: data.actif,
            seoTitle: `${data.label} — Sylla Youssouf`,
            seoDescription:
              data.description || `Découvrez les réalisations ciblées : ${data.label}.`,
          },
        });
      }
    });
  } catch (err) {
    console.error("Erreur création sous-portfolio:", err);
    return { error: "Échec de l'enregistrement en base de données." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/portfolios");
  revalidatePath("/admin/profils");
  revalidatePath(`/${data.slug}`);
  redirect("/admin/portfolios");
}

/**
 * Modification d'un sous-portfolio et mise à jour de son profil public lié
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
  const rawTemplate = formData.get("template") as string;

  const parsed = SubPortfolioSchema.safeParse({
    label: formData.get("label"),
    slug: (formData.get("slug") as string)?.toLowerCase().trim(),
    template: rawTemplate || undefined,
    description: formData.get("description") || undefined,
    actif: formData.get("actif") === "on" || formData.get("actif") === "true",
    projectIds: selectedProjects,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Champs invalides" };
  }

  const data = parsed.data;

  // Interdire les slugs réservés
  if (isReservedSlug(data.slug)) {
    return {
      error: `Le slug "/${data.slug}" est réservé par le système. Veuillez choisir un autre slug.`,
    };
  }

  // Vérifier l'unicité du slug s'il a changé
  const existingWithSlug = await prisma.subPortfolio.findFirst({
    where: {
      slug: data.slug,
      NOT: { id },
    },
  });

  if (existingWithSlug) {
    return { error: `Le slug "/${data.slug}" est déjà utilisé par un autre sous-portfolio.` };
  }

  const chosenTemplate = data.template || inferTemplate(data.slug, data.label);

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Mise à jour du sous-portfolio
      const oldSub = await tx.subPortfolio.findUnique({
        where: { id },
        select: { slug: true },
      });

      await tx.subPortfolio.update({
        where: { id },
        data: {
          label: data.label,
          slug: data.slug,
          description: data.description || null,
          actif: data.actif,
        },
      });

      // 2. Synchronisation des projets
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

      // 3. Synchronisation du profil lié
      const linkedProfile = await tx.profile.findFirst({
        where: {
          OR: [{ subPortfolioId: id }, { slug: data.slug }, { slug: oldSub?.slug || "" }],
        },
      });

      if (linkedProfile) {
        await tx.profile.update({
          where: { id: linkedProfile.id },
          data: {
            slug: data.slug,
            label: data.label,
            template: chosenTemplate,
            actif: data.actif,
            subPortfolioId: id,
          },
        });
      } else {
        await tx.profile.create({
          data: {
            slug: data.slug,
            label: data.label,
            template: chosenTemplate,
            accent: "default",
            hero: buildDefaultHero(data.label, data.description) as any,
            sections: buildDefaultSections() as any,
            subPortfolioId: id,
            actif: data.actif,
            seoTitle: `${data.label} — Sylla Youssouf`,
            seoDescription:
              data.description || `Découvrez les réalisations ciblées : ${data.label}.`,
          },
        });
      }
    });
  } catch (err) {
    console.error("Erreur modification sous-portfolio:", err);
    return { error: "Échec de la mise à jour en base de données." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/portfolios");
  revalidatePath("/admin/profils");
  revalidatePath(`/${data.slug}`);
  redirect("/admin/portfolios");
}

/**
 * Suppression d'un sous-portfolio et de son profil personnalisé lié
 */
export async function deleteSubPortfolioAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  try {
    await prisma.$transaction(async (tx) => {
      // Supprimer les profils non-par-défaut liés
      await tx.profile.deleteMany({
        where: {
          subPortfolioId: id,
          isDefault: false,
        },
      });

      await tx.subPortfolio.delete({
        where: { id },
      });
    });
  } catch (err) {
    console.error("Erreur suppression sous-portfolio:", err);
    return;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/portfolios");
  revalidatePath("/admin/profils");
}

/**
 * Bascule actif / inactif d'un sous-portfolio et de son profil lié
 */
export async function toggleSubPortfolioStatusAction(
  id: string,
  currentActif: boolean
): Promise<void> {
  const session = await getSession();
  if (!session) return;

  const nextStatus = !currentActif;

  await prisma.$transaction([
    prisma.subPortfolio.update({
      where: { id },
      data: { actif: nextStatus },
    }),
    prisma.profile.updateMany({
      where: { subPortfolioId: id },
      data: { actif: nextStatus },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/portfolios");
  revalidatePath("/admin/profils");
}
