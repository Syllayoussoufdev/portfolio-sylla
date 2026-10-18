import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getAllSkillCategories } from "@/lib/skills";
import { CompetencesClient } from "./CompetencesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gestion des Compétences & Outils | Admin",
  description: "Gérez les grandes familles de compétences, les outils de production et leur attribution par sous-portfolio.",
};

export default async function AdminCompetencesPage() {
  const [categories, subPortfolios] = await Promise.all([
    getAllSkillCategories(),
    prisma.subPortfolio.findMany({
      select: { id: true, label: true, slug: true },
      orderBy: { label: "asc" },
    }),
  ]);

  return (
    <CompetencesClient
      categories={categories}
      subPortfolios={subPortfolios}
    />
  );
}
