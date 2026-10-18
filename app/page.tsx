import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { SkillsSection } from "@/components/SkillsSection";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sylla Youssouf — Développeur Web & Mobile | Portfolio",
  description:
    "Je conçois des expériences web et mobiles utiles, performantes et soignées. Développeur fullstack Laravel, React, Next.js et création numérique.",
};

export default async function HomePage() {
  const visibleProjects = await prisma.project.findMany({
    where: { visible: true },
    orderBy: [{ ordre: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B132B] flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="flex-1">
        {/* Section 1 : Hero */}
        <Hero projectsCount={visibleProjects.length} />

        {/* Section 2 : Projets Sélectionnés */}
        <ProjectsGrid projects={visibleProjects} />

        {/* Section 3 : Compétences & Technologies */}
        <SkillsSection />

        {/* Section 4 : À propos & Méthode de travail */}
        <AboutSection />

        {/* Section 5 : Prise de Contact & Conversion */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
