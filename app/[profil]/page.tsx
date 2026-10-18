import { Metadata } from "next";
import { notFound } from "next/navigation";
import { isReservedSlug } from "@/lib/constants/reserved-slugs";
import { getProfileBySlug, getSiteSettings } from "@/lib/profiles";
import { prisma } from "@/lib/prisma";
import { trackVisit } from "@/lib/analytics";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionRenderer } from "@/components/SectionRenderer";
import type { HeroData, SectionItem } from "@/lib/validations/profile";

export const dynamic = "force-dynamic";

interface ProfilPageProps {
  params: Promise<{ profil: string }>;
}

export async function generateMetadata({
  params,
}: ProfilPageProps): Promise<Metadata> {
  const { profil } = await params;
  const slug = profil.toLowerCase();

  if (isReservedSlug(slug)) {
    return { title: "Portfolio — Sylla Youssouf" };
  }

  const profile = await getProfileBySlug(slug);

  if (!profile || !profile.actif) {
    return { title: "Profil introuvable | Sylla Youssouf" };
  }

  return {
    title:
      profile.seoTitle || `${profile.label} | Portfolio — Sylla Youssouf`,
    description:
      profile.seoDescription ||
      `Découvrez le profil et les réalisations ciblées de ${profile.label}.`,
  };
}

export default async function ProfilPage({ params }: ProfilPageProps) {
  const { profil } = await params;
  const slug = profil.toLowerCase();

  // Refuser formellement tout slug réservé
  if (isReservedSlug(slug)) {
    notFound();
  }

  // Récupération du profil depuis la base (ou null si inactif / introuvable)
  const profile = await getProfileBySlug(slug);

  if (!profile || !profile.actif) {
    notFound();
  }

  // Traçabilité anonymisée de la visite
  await trackVisit(`/${slug}`, {
    subPortfolioId: profile.subPortfolioId || undefined,
  });

  const settings = await getSiteSettings();

  // Extraction des projets : soit depuis le sous-portfolio rattaché, soit tous les projets visibles
  let visibleProjects = [];
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

  const hero = profile.hero as unknown as HeroData;
  const rawSections = (profile.sections as unknown as SectionItem[]) || [];

  // Sections visibles triées par ordre
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
          />
        ))}
      </main>
      <Footer settings={settings} />
    </div>
  );
}
