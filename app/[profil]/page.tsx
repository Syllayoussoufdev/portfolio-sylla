import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { trackVisit } from "@/lib/analytics";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { ArrowLeft, Layers, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProfilPageProps {
  params: Promise<{ profil: string }>;
}

const RESERVED_SLUGS = ["admin", "projets", "contact", "api", "_next", "favicon.ico"];

export async function generateMetadata({ params }: ProfilPageProps): Promise<Metadata> {
  const { profil } = await params;

  if (RESERVED_SLUGS.includes(profil.toLowerCase())) {
    return { title: "Portfolio — Sylla Youssouf" };
  }

  const subPortfolio = await prisma.subPortfolio.findUnique({
    where: { slug: profil.toLowerCase() },
  });

  if (!subPortfolio || !subPortfolio.actif) {
    return { title: "Portfolio introuvable | Sylla Youssouf" };
  }

  return {
    title: `${subPortfolio.label} | Sélection — Sylla Youssouf`,
    description:
      subPortfolio.description || `Sélection de réalisations ciblées pour ${subPortfolio.label}.`,
  };
}

export default async function ProfilPage({ params }: ProfilPageProps) {
  const { profil } = await params;
  const slug = profil.toLowerCase();

  if (RESERVED_SLUGS.includes(slug)) {
    notFound();
  }

  // Récupération du sous-portfolio et de ses projets associés
  const subPortfolio = await prisma.subPortfolio.findUnique({
    where: { slug },
    include: {
      projects: {
        include: {
          project: true,
        },
        orderBy: { ordre: "asc" },
      },
    },
  });

  if (!subPortfolio || !subPortfolio.actif) {
    notFound();
  }

  // Enregistrement anonymisé de la visite sur ce sous-portfolio
  await trackVisit(`/${slug}`, { subPortfolioId: subPortfolio.id });

  // Extraction des projets visibles
  const projects = subPortfolio.projects
    .map((sp) => sp.project)
    .filter((p) => p.visible);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B132B] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Fil d'ariane / Retour accueil */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#475569] hover:text-[#2563EB] transition-colors group"
          >
            <span className="p-1.5 rounded-full bg-white border border-slate-200 group-hover:border-[#2563EB]/40 group-hover:-translate-x-0.5 transition-all shadow-2xs">
              <ArrowLeft className="w-3.5 h-3.5 text-[#0B132B] group-hover:text-[#2563EB]" />
            </span>
            <span>Retour à l&apos;accueil général</span>
          </Link>
        </div>

        {/* En-tête éditorial du sous-portfolio */}
        <header className="mb-14 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-[#0B132B] text-xs font-medium">
            <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Sélection personnalisée</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0B132B]">
            {subPortfolio.label}
          </h1>

          {subPortfolio.description && (
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
              {subPortfolio.description}
            </p>
          )}

          <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#64748B]">
            <span>{projects.length} réalisation{projects.length > 1 ? "s" : ""} sélectionnée{projects.length > 1 ? "s" : ""}</span>
            <span>·</span>
            <span>Sylla Youssouf · Développeur Web &amp; Mobile</span>
          </div>
        </header>

        {/* Grille des réalisations */}
        {projects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 max-w-md mx-auto">
            <h3 className="text-base font-semibold text-[#0B132B]">Aucune réalisation liée</h3>
            <p className="text-xs text-[#64748B] mt-1 mb-5">
              Ce profil ne contient pas encore de projet actif.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B132B] text-white text-xs font-medium"
            >
              <span>Voir tout le portfolio</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Bannière de contact en bas de page sous-portfolio */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-900/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-[#0B132B]">
              Cette sélection correspond à vos attentes ?
            </h3>
            <p className="text-sm text-[#475569]">
              Discutons de vos besoins, de vos délais et des modalités de collaboration.
            </p>
          </div>

          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B132B] hover:bg-[#1E293B] text-white text-sm font-semibold shadow-sm transition-all whitespace-nowrap"
          >
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Me contacter directement</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
