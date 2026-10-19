import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getDefaultProfile, getSiteSettings } from "@/lib/profiles";
import { getSkillsForSubPortfolio } from "@/lib/skills";
import { getParcours } from "@/lib/parcours";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionRenderer } from "@/components/SectionRenderer";
import type { HeroData, SectionItem } from "@/lib/validations/profile";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getDefaultProfile();
  return {
    title: profile.seoTitle || "Sylla Youssouf — Portfolio & Réalisations",
    description:
      profile.seoDescription ||
      "Portfolio de Sylla Youssouf, expert en création numérique, design et développement d'applications web & mobiles.",
  };
}

export default async function HomePage() {
  const [profile, settings, parcoursItems] = await Promise.all([
    getDefaultProfile(),
    getSiteSettings(),
    getParcours("default"),
  ]);

  const skillCategories = await getSkillsForSubPortfolio(profile.subPortfolioId);

  // Chargement des projets selon la configuration du profil avec tolérance aux pannes
  let visibleProjects: any[] = [];
  try {
    if (profile.subPortfolioId) {
      const spProjects = await prisma.subPortfolioProject.findMany({
        where: { subPortfolioId: profile.subPortfolioId },
        include: {
          project: {
            include: { coverMedia: true },
          },
        },
        orderBy: { ordre: "asc" },
      });
      visibleProjects = spProjects
        .map((sp) => sp.project)
        .filter((p) => p.visible);
    } else {
      visibleProjects = await prisma.project.findMany({
        where: { visible: true },
        include: { coverMedia: true },
        orderBy: [{ ordre: "asc" }, { createdAt: "desc" }],
      });
    }
  } catch (err) {
    console.warn("Avertissement lors de la récupération des projets (repli vide) :", err);
    visibleProjects = [];
  }

  const hero = profile.hero as unknown as HeroData;
  const rawSections = (profile.sections as unknown as SectionItem[]) || [];

  // Sections visibles triées par ordre croissant d'affichage
  const sortedSections = rawSections
    .filter((sec) => sec.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div
      data-template={profile.template}
      data-accent={profile.accent}
      className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col selection:bg-blue-100 selection:text-blue-900 transition-colors duration-300"
    >
      <Navbar settings={settings} />
      <main className="flex-1">
        {sortedSections.map((sec) => (
          <SectionRenderer
            key={sec.key}
            sectionKey={sec.key}
            hero={hero}
            heroMedia={profile.heroMedia}
            projects={visibleProjects}
            settings={settings}
            template={profile.template}
            variables={profile.variables as Record<string, unknown>}
            skillCategories={skillCategories}
            parcoursItems={parcoursItems}
          />
        ))}
      </main>
      <Footer settings={settings} />
    </div>
  );
}
