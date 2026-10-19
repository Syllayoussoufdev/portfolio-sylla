import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { ParcoursType } from "@/app/generated/prisma/client";

export const parcoursItemSchema = z.object({
  type: z.enum(["formation", "experience", "certification"]),
  titre: z.string().min(2, "Le titre doit contenir au moins 2 caractères").max(120),
  organisme: z.string().min(2, "L'organisme doit contenir au moins 2 caractères").max(120),
  lieu: z.string().max(100).nullable().optional(),
  anneeDebut: z.number().int().min(2000).max(2100),
  moisDebut: z.number().int().min(1).max(12).nullable().optional(),
  anneeFin: z.number().int().min(2000).max(2100).nullable().optional(),
  moisFin: z.number().int().min(1).max(12).nullable().optional(),
  enCours: z.boolean().default(false),
  description: z.string().max(600, "La description ne doit pas dépasser 600 caractères").nullable().optional(),
  tags: z.array(z.string()).default([]),
  badge: z.string().max(60).nullable().optional(),
  url: z.string().url("URL invalide").nullable().optional().or(z.literal("")),
  visible: z.boolean().default(true),
  ordre: z.number().int().default(0),
  profilSlugs: z.array(z.string()).default([]),
});

export type ParcoursItemInput = z.infer<typeof parcoursItemSchema>;

export interface ParcoursItemData {
  id: string;
  type: ParcoursType;
  titre: string;
  organisme: string;
  lieu?: string | null;
  anneeDebut: number;
  moisDebut?: number | null;
  anneeFin?: number | null;
  moisFin?: number | null;
  enCours: boolean;
  description?: string | null;
  tags: string[];
  badge?: string | null;
  url?: string | null;
  visible: boolean;
  ordre: number;
  profilSlugs: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Récupère les jalons de parcours visibles, filtrés optionnellement par profil et par type.
 * Un jalon avec profilSlugs vide [] est universel (affiché sur tous les profils).
 */
export async function getParcours(
  profilSlug?: string | null,
  typeFilter?: ParcoursType
): Promise<ParcoursItemData[]> {
  try {
    const whereClause: any = {
      visible: true,
    };

    if (typeFilter) {
      whereClause.type = typeFilter;
    }

    const items = await prisma.parcoursItem.findMany({
      where: whereClause,
      orderBy: [{ ordre: "asc" }, { anneeDebut: "desc" }],
    });

    if (!profilSlug) {
      return items as unknown as ParcoursItemData[];
    }

    // Normalisation : "default" ou slug spécifique (ex: "dev", "design", "video")
    const targetSlug = profilSlug === "/" ? "default" : profilSlug;

    return items.filter(
      (item) =>
        item.profilSlugs.length === 0 ||
        item.profilSlugs.includes(targetSlug) ||
        (targetSlug === "default" && item.profilSlugs.includes("/"))
    ) as unknown as ParcoursItemData[];
  } catch (error) {
    console.error("Erreur lors de la récupération du parcours en base :", error);
    return [];
  }
}

/**
 * Récupère tous les jalons pour l'administration (avec ou sans masquage)
 */
export async function getAllParcoursAdmin(): Promise<ParcoursItemData[]> {
  try {
    const items = await prisma.parcoursItem.findMany({
      orderBy: [{ type: "asc" }, { ordre: "asc" }, { anneeDebut: "desc" }],
    });
    return items as unknown as ParcoursItemData[];
  } catch (error) {
    console.error("Erreur lors de la récupération admin du parcours :", error);
    return [];
  }
}
