import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/profiles";
import { Navbar } from "@/components/Navbar";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Réalisations & Projets — Sylla Youssouf",
  description:
    "Découvrez l'ensemble de mes projets en développement web, applications mobiles et création numérique.",
};

export default async function ProjetsPage() {
  const [visibleProjects, settings] = await Promise.all([
    prisma.project.findMany({
      where: { visible: true },
      include: { coverMedia: true },
      orderBy: [{ ordre: "asc" }, { createdAt: "desc" }],
    }),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col">
      <Navbar settings={settings} />
      <main className="flex-1 pt-24">
        <ProjectsGrid projects={visibleProjects} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
