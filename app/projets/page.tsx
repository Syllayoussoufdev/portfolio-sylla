import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
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
  const visibleProjects = await prisma.project.findMany({
    where: { visible: true },
    orderBy: [{ ordre: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B132B] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <ProjectsGrid projects={visibleProjects} />
      </main>
      <Footer />
    </div>
  );
}
