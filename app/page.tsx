import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getDefaultProfile, getSiteSettings } from "@/lib/profiles";
import { getSkillsForSubPortfolio } from "@/lib/skills";
import { getParcours } from "@/lib/parcours";
import { getDevCreativeCatalog } from "@/lib/devcreative";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionRenderer } from "@/components/SectionRenderer";
import { ImmersiveCursor } from "@/components/motion/ImmersiveCursor";
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

  const [skillCategories, devCreativeCatalog] = await Promise.all([
    getSkillsForSubPortfolio(profile.subPortfolioId),
    profile.template === "devcreative" ? getDevCreativeCatalog() : Promise.resolve(null),
  ]);

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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:shadow-xl focus:rounded-lg focus:font-medium focus:outline-none"
      >
        Aller au contenu principal
      </a>
      {profile.template === "immersif" && <ImmersiveCursor />}
      <Navbar
        settings={settings}
        sections={sortedSections}
        slug={profile.slug}
        template={profile.template}
      />
      <main id="main-content" role="main" tabIndex={-1} className="flex-1 outline-none">
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
            devCreativeCatalog={devCreativeCatalog}
          />
        ))}
      </main>
      <Footer settings={settings} />
    </div>
  );
}
