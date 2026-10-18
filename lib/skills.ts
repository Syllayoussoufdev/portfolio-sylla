import { prisma } from "@/lib/prisma";
import type { SkillType } from "@/app/generated/prisma/client";

export interface SkillItem {
  id: string;
  nom: string;
  type: SkillType;
  niveau: string | null;
  pourcentage: number | null;
  icon: string | null;
  ordre: number;
  visible: boolean;
  categoryId: string;
}

export interface SkillCategoryWithSkills {
  id: string;
  slug: string;
  titre: string;
  description: string | null;
  icon: string;
  ordre: number;
  skills: SkillItem[];
  subPortfolios?: { subPortfolioId: string }[];
}

/**
 * Récupère toutes les catégories de compétences avec leurs compétences actives
 */
export async function getAllSkillCategories(): Promise<SkillCategoryWithSkills[]> {
  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: { ordre: "asc" },
      include: {
        skills: {
          where: { visible: true },
          orderBy: [{ ordre: "asc" }, { nom: "asc" }],
        },
        subPortfolios: {
          select: { subPortfolioId: true },
        },
      },
    });

    return categories as unknown as SkillCategoryWithSkills[];
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories de compétences :", error);
    return [];
  }
}

/**
 * Récupère les catégories et compétences attribuées à un sous-portfolio spécifique
 * Si aucun sous-portfolio n'est fourni ou si aucune catégorie n'est attribuée, retourne toutes les catégories.
 */
export async function getSkillsForSubPortfolio(
  subPortfolioId?: string | null
): Promise<SkillCategoryWithSkills[]> {
  try {
    if (subPortfolioId) {
      const assigned = await prisma.subPortfolioSkillCategory.findMany({
        where: { subPortfolioId },
        orderBy: { ordre: "asc" },
        include: {
          category: {
            include: {
              skills: {
                where: { visible: true },
                orderBy: [{ ordre: "asc" }, { nom: "asc" }],
              },
            },
          },
        },
      });

      if (assigned.length > 0) {
        return assigned.map((item) => item.category) as unknown as SkillCategoryWithSkills[];
      }
    }

    // Repli sur toutes les catégories
    return await getAllSkillCategories();
  } catch (error) {
    console.error("Erreur getSkillsForSubPortfolio :", error);
    return [];
  }
}
