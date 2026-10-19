"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { parcoursItemSchema } from "@/lib/parcours";
import type { ParcoursType } from "@/app/generated/prisma/client";

export type ParcoursActionState = {
  error?: string;
  success?: boolean;
};

/**
 * 1. Créer un nouveau jalon de parcours
 */
export async function createParcoursAction(
  prevState: ParcoursActionState | undefined,
  formData: FormData
): Promise<ParcoursActionState> {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  try {
    const type = (formData.get("type") as string) as ParcoursType;
    const titre = (formData.get("titre") as string)?.trim();
    const organisme = (formData.get("organisme") as string)?.trim();
    const lieu = (formData.get("lieu") as string)?.trim() || null;
    const anneeDebut = parseInt((formData.get("anneeDebut") as string) || "2026", 10);
    const moisDebutRaw = formData.get("moisDebut") as string;
    const moisDebut = moisDebutRaw ? parseInt(moisDebutRaw, 10) : null;
    const anneeFinRaw = formData.get("anneeFin") as string;
    const anneeFin = anneeFinRaw ? parseInt(anneeFinRaw, 10) : null;
    const moisFinRaw = formData.get("moisFin") as string;
    const moisFin = moisFinRaw ? parseInt(moisFinRaw, 10) : null;
    const enCours = formData.get("enCours") === "true" || formData.get("enCours") === "on";
    const description = (formData.get("description") as string)?.trim() || null;
    const tagsRaw = (formData.get("tags") as string) || "";
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const badge = (formData.get("badge") as string)?.trim() || null;
    const url = (formData.get("url") as string)?.trim() || null;
    const visible = formData.get("visible") !== "false";
    const ordre = parseInt((formData.get("ordre") as string) || "0", 10);
    const profilSlugsRaw = (formData.get("profilSlugs") as string) || "";
    const profilSlugs = profilSlugsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Validation Zod
    const validated = parcoursItemSchema.parse({
      type,
      titre,
      organisme,
      lieu,
      anneeDebut,
      moisDebut,
      anneeFin,
      moisFin,
      enCours,
      description,
      tags,
      badge,
      url,
      visible,
      ordre,
      profilSlugs,
    });

    await prisma.parcoursItem.create({
      data: validated,
    });

    revalidatePath("/admin/parcours");
    revalidatePath("/");
    revalidatePath("/[profil]", "page");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Erreur lors de la création du jalon." };
  }
}

/**
 * 2. Modifier un jalon existant
 */
export async function updateParcoursAction(
  id: string,
  prevState: ParcoursActionState | undefined,
  formData: FormData
): Promise<ParcoursActionState> {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  try {
    const type = (formData.get("type") as string) as ParcoursType;
    const titre = (formData.get("titre") as string)?.trim();
    const organisme = (formData.get("organisme") as string)?.trim();
    const lieu = (formData.get("lieu") as string)?.trim() || null;
    const anneeDebut = parseInt((formData.get("anneeDebut") as string) || "2026", 10);
    const moisDebutRaw = formData.get("moisDebut") as string;
    const moisDebut = moisDebutRaw ? parseInt(moisDebutRaw, 10) : null;
    const anneeFinRaw = formData.get("anneeFin") as string;
    const anneeFin = anneeFinRaw ? parseInt(anneeFinRaw, 10) : null;
    const moisFinRaw = formData.get("moisFin") as string;
    const moisFin = moisFinRaw ? parseInt(moisFinRaw, 10) : null;
    const enCours = formData.get("enCours") === "true" || formData.get("enCours") === "on";
    const description = (formData.get("description") as string)?.trim() || null;
    const tagsRaw = (formData.get("tags") as string) || "";
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const badge = (formData.get("badge") as string)?.trim() || null;
    const url = (formData.get("url") as string)?.trim() || null;
    const visible = formData.get("visible") !== "false";
    const ordre = parseInt((formData.get("ordre") as string) || "0", 10);
    const profilSlugsRaw = (formData.get("profilSlugs") as string) || "";
    const profilSlugs = profilSlugsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const validated = parcoursItemSchema.parse({
      type,
      titre,
      organisme,
      lieu,
      anneeDebut,
      moisDebut,
      anneeFin,
      moisFin,
      enCours,
      description,
      tags,
      badge,
      url,
      visible,
      ordre,
      profilSlugs,
    });

    await prisma.parcoursItem.update({
      where: { id },
      data: validated,
    });

    revalidatePath("/admin/parcours");
    revalidatePath("/");
    revalidatePath("/[profil]", "page");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Erreur lors de la modification du jalon." };
  }
}

/**
 * 3. Supprimer un jalon
 */
export async function deleteParcoursAction(id: string): Promise<ParcoursActionState> {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  try {
    await prisma.parcoursItem.delete({
      where: { id },
    });

    revalidatePath("/admin/parcours");
    revalidatePath("/");
    revalidatePath("/[profil]", "page");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Erreur lors de la suppression." };
  }
}

/**
 * 4. Basculer la visibilité d'un jalon
 */
export async function toggleParcoursVisibilityAction(
  id: string,
  visible: boolean
): Promise<ParcoursActionState> {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  try {
    await prisma.parcoursItem.update({
      where: { id },
      data: { visible },
    });

    revalidatePath("/admin/parcours");
    revalidatePath("/");
    revalidatePath("/[profil]", "page");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Erreur lors du changement de visibilité." };
  }
}

/**
 * 5. Réordonner deux jalons (accessibilité clavier haut/bas)
 */
export async function reorderParcoursAction(
  id: string,
  direction: "up" | "down"
): Promise<ParcoursActionState> {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  try {
    const item = await prisma.parcoursItem.findUnique({ where: { id } });
    if (!item) return { error: "Jalon introuvable" };

    // Trouver le jalon adjacent du même type
    const adjacent = await prisma.parcoursItem.findFirst({
      where: {
        type: item.type,
        ordre: direction === "up" ? { lt: item.ordre } : { gt: item.ordre },
      },
      orderBy: {
        ordre: direction === "up" ? "desc" : "asc",
      },
    });

    if (adjacent) {
      // Inverser les ordres
      await prisma.$transaction([
        prisma.parcoursItem.update({
          where: { id: item.id },
          data: { ordre: adjacent.ordre },
        }),
        prisma.parcoursItem.update({
          where: { id: adjacent.id },
          data: { ordre: item.ordre },
        }),
      ]);
    } else {
      // Aucun élément adjacent, ajuster l'ordre de 1
      const newOrder = direction === "up" ? Math.max(0, item.ordre - 1) : item.ordre + 1;
      await prisma.parcoursItem.update({
        where: { id: item.id },
        data: { ordre: newOrder },
      });
    }

    revalidatePath("/admin/parcours");
    revalidatePath("/");
    revalidatePath("/[profil]", "page");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Erreur lors de la réorganisation." };
  }
}
