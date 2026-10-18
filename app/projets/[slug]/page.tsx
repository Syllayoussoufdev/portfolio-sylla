import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/profiles";
import { trackVisit } from "@/lib/analytics";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProjectLightbox, type GalleryImage } from "@/components/ProjectLightbox";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Globe,
  Video,
  FolderOpen,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { GithubIcon, FigmaIcon, CanvaIcon, DriveIcon, YoutubeIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    select: { titre: true, description: true, coverImage: true },
  });

  if (!project) {
    return {
      title: "Projet non trouvé | Sylla Youssouf",
      description: "Le projet demandé n'existe pas ou n'est plus disponible.",
    };
  }

  return {
    title: `${project.titre} | Réalisations — Sylla Youssouf`,
    description: project.description,
    openGraph: {
      title: `${project.titre} — Sylla Youssouf`,
      description: project.description,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  // Récupération du projet avec ses liaisons sous-portfolios
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      subPortfolios: {
        include: {
          subPortfolio: true,
        },
      },
    },
  });

  if (!project || !project.visible) {
    notFound();
  }

  // Enregistrement anonymisé de la visite (sans cookie)
  await trackVisit(`/projets/${slug}`, { projectId: project.id });

  // Navigation vers projet précédent et suivant et réglages du site
  const [prevProject, nextProject, settings] = await Promise.all([
    prisma.project.findFirst({
      where: { visible: true, ordre: { lt: project.ordre } },
      orderBy: { ordre: "desc" },
      select: { slug: true, titre: true },
    }),
    prisma.project.findFirst({
      where: { visible: true, ordre: { gt: project.ordre } },
      orderBy: { ordre: "asc" },
      select: { slug: true, titre: true },
    }),
    getSiteSettings(),
  ]);

  // Extraction typée des liens externes
  const links = (project.links || {}) as Record<string, string>;

  // Construction de la galerie d'images
  const galleryImages: GalleryImage[] = [];
  if (project.coverImage) {
    galleryImages.push({
      src: project.coverImage,
      alt: `Aperçu principal — ${project.titre}`,
      caption: "Vue principale du projet",
    });
  }

  // Si des images additionnelles sont fournies dans les liens
  if (links.gallery && typeof links.gallery === "string") {
    try {
      const parsed = JSON.parse(links.gallery);
      if (Array.isArray(parsed)) {
        parsed.forEach((item, idx) => {
          if (typeof item === "string" && item.startsWith("http")) {
            galleryImages.push({
              src: item,
              alt: `${project.titre} — Visuel ${idx + 2}`,
              caption: `Aperçu complémentaire #${idx + 2}`,
            });
          }
        });
      }
    } catch {
      // Ignorer si ce n'est pas du JSON valide
    }
  }

  // Formatage de la date
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(project.createdAt);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col">
      <Navbar settings={settings} />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        {/* 1. Fil d'Ariane & Bouton retour */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/#projets"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#475569] hover:text-[#2563EB] transition-colors group"
          >
            <span className="p-1.5 rounded-full bg-white border border-slate-200/80 group-hover:border-[#2563EB]/40 group-hover:-translate-x-0.5 transition-all shadow-xs">
              <ArrowLeft className="w-3.5 h-3.5 text-[#0F172A] group-hover:text-[#2563EB]" />
            </span>
            <span>Retour aux réalisations</span>
          </Link>

          {project.featured && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#F97316] text-xs font-semibold border border-orange-200/80">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Projet à la une</span>
            </span>
          )}
        </div>

        {/* 2. En-tête du projet */}
        <header className="mb-10">
          {/* Tags de compétences */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200/80 text-[#2563EB] shadow-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-bebas text-4xl sm:text-6xl text-[#0F172A] tracking-wider leading-none mb-4">
            {project.titre}
          </h1>

          <p className="text-base sm:text-xl text-[#475569] leading-relaxed max-w-3xl">
            {project.description}
          </p>

          {/* Méta-données & actions directes */}
          <div className="mt-6 pt-6 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="capitalize">{formattedDate}</span>
              </span>

              {project.subPortfolios.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>
                    Profils :{" "}
                    {project.subPortfolios
                      .map((sp) => sp.subPortfolio.label)
                      .join(", ")}
                  </span>
                </span>
              )}
            </div>

            {/* Boutons d'action rapides */}
            <div className="flex flex-wrap items-center gap-2">
              {links.demo && (
                <a
                  href={links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Tester la démo live</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}

              {links.github && (
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 text-[#0F172A] text-xs font-semibold border border-slate-200 shadow-xs transition-all"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}

              {links.figma && (
                <a
                  href={links.figma}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-purple-50 text-[#0F172A] text-xs font-semibold border border-slate-200 shadow-xs transition-all"
                >
                  <FigmaIcon className="w-3.5 h-3.5" />
                  <span>Maquette Figma</span>
                </a>
              )}

              {links.video && (
                <a
                  href={links.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-red-50 text-[#0F172A] text-xs font-semibold border border-slate-200 shadow-xs transition-all"
                >
                  <Video className="w-3.5 h-3.5 text-red-500" />
                  <span>Vidéo</span>
                </a>
              )}

              {links.drive && (
                <a
                  href={links.drive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-amber-50 text-[#0F172A] text-xs font-semibold border border-slate-200 shadow-xs transition-all"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                  <span>Dossier Assets</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* 3. Image de Couverture principale */}
        {project.coverImage ? (
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden glass border border-white/80 shadow-lg shadow-black/5 mb-14">
            <Image
              src={project.coverImage}
              alt={project.titre}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 960px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative aspect-video w-full rounded-3xl glass border border-white/80 shadow-sm flex flex-col items-center justify-center p-8 text-center mb-14">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3">
              <Sparkles className="w-8 h-8 text-[#F97316]" />
            </div>
            <h2 className="font-bebas text-3xl text-[#0F172A]">{project.titre}</h2>
            <p className="text-xs text-[#64748B] font-mono mt-1">
              Visuel en cours de préparation par Sylla
            </p>
          </div>
        )}

        {/* 4. Étude de cas / Contenu détaillé */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-14">
          {/* Colonne Principale : Récit & Résolution */}
          <div className="lg:col-span-2 space-y-8">
            <section className="glass p-6 sm:p-8 rounded-3xl">
              <h2 className="font-bebas text-2xl sm:text-3xl text-[#0F172A] tracking-wide mb-4">
                DÉMARCHE &amp; RÉALISATION
              </h2>

              {project.contenu ? (
                <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-[#334155] whitespace-pre-line space-y-4 font-sans">
                  {project.contenu}
                </div>
              ) : (
                <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
                  <p>
                    Ce projet combine une approche créative méticuleuse et une implémentation
                    technique orientée résultat. L&apos;objectif principal était de délivrer une
                    expérience fluide, esthétique et directement opérationnelle pour les utilisateurs.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/60">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A] mb-1">
                        <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                        <span>Conception Hybride</span>
                      </div>
                      <p className="text-xs text-[#64748B]">
                        Du prototype interactif Figma jusqu&apos;au développement final.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/60">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A] mb-1">
                        <CheckCircle2 className="w-4 h-4 text-[#F97316]" />
                        <span>Qualité &amp; Performance</span>
                      </div>
                      <p className="text-xs text-[#64748B]">
                        Optimisation des flux, accessibilité et design épuré sans superflu.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Galerie média interactive si plus d'images sont disponibles */}
            {galleryImages.length > 1 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bebas text-2xl text-[#0F172A] tracking-wide">
                    GALERIE &amp; APERÇUS
                  </h3>
                  <span className="text-xs font-mono text-[#64748B]">
                    {galleryImages.length} visuels (cliquez pour agrandir)
                  </span>
                </div>
                <ProjectLightbox images={galleryImages} />
              </section>
            )}
          </div>

          {/* Colonne Latérale : Fiche synthétique & Ressources */}
          <aside className="space-y-6">
            {/* Boîte Fiche Synthèse */}
            <div className="glass p-6 rounded-3xl space-y-4">
              <h3 className="font-bebas text-xl text-[#0F172A] tracking-wide pb-2 border-b border-slate-200/70">
                FICHE PROJET
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#64748B] block font-mono">Domaines &amp; Rôle</span>
                  <span className="font-semibold text-[#0F172A] mt-0.5 block">
                    {project.tags.join(" • ")}
                  </span>
                </div>

                <div>
                  <span className="text-[#64748B] block font-mono">Année</span>
                  <span className="font-semibold text-[#0F172A] mt-0.5 block">
                    {new Date(project.createdAt).getFullYear()}
                  </span>
                </div>

                <div>
                  <span className="text-[#64748B] block font-mono">Auteur</span>
                  <span className="font-semibold text-[#0F172A] mt-0.5 block">
                    Sylla Youssouf
                  </span>
                </div>
              </div>
            </div>

            {/* Boîte Ressources & Liens externes */}
            <div className="glass p-6 rounded-3xl space-y-3">
              <h3 className="font-bebas text-xl text-[#0F172A] tracking-wide pb-2 border-b border-slate-200/70">
                RESSOURCES LIÉES
              </h3>

              <div className="space-y-2">
                {links.demo && (
                  <a
                    href={links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-blue-50 text-[#0F172A] text-xs font-semibold border border-slate-200/80 transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#2563EB]" />
                      <span>Démo en production</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
                  </a>
                )}

                {links.figma && (
                  <a
                    href={links.figma}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-purple-50 text-[#0F172A] text-xs font-semibold border border-slate-200/80 transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <FigmaIcon className="w-4 h-4 text-purple-600" />
                      <span>Fichier Figma</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                  </a>
                )}

                {links.github && (
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-slate-100 text-[#0F172A] text-xs font-semibold border border-slate-200/80 transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <GithubIcon className="w-4 h-4" />
                      <span>Code source GitHub</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 transition-colors" />
                  </a>
                )}

                {links.canva && (
                  <a
                    href={links.canva}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-cyan-50 text-[#0F172A] text-xs font-semibold border border-slate-200/80 transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <CanvaIcon className="w-4 h-4" />
                      <span>Design Canva</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 transition-colors" />
                  </a>
                )}

                {links.drive && (
                  <a
                    href={links.drive}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-amber-50 text-[#0F172A] text-xs font-semibold border border-slate-200/80 transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <DriveIcon className="w-4 h-4" />
                      <span>Dossier Drive / Livrables</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
                  </a>
                )}

                {links.video && (
                  <a
                    href={links.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-red-50 text-[#0F172A] text-xs font-semibold border border-slate-200/80 transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <YoutubeIcon className="w-4 h-4 text-red-600" />
                      <span>Vidéo du projet</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 transition-colors" />
                  </a>
                )}

                {!links.demo && !links.figma && !links.github && !links.canva && !links.drive && !links.video && (
                  <p className="text-xs text-[#64748B] italic py-2">
                    Aucun lien externe public n&apos;est associé à ce projet.
                  </p>
                )}
              </div>
            </div>

            {/* Carte CTA Contact */}
            <div className="glass p-6 rounded-3xl bg-gradient-to-br from-blue-50/50 to-orange-50/50 border border-blue-200/50 text-center space-y-3">
              <h4 className="font-bebas text-xl text-[#0F172A] tracking-wide">
                UN PROJET SIMILAIRE EN TÊTE ?
              </h4>
              <p className="text-xs text-[#475569] leading-relaxed">
                Besoin d&apos;un profil complet pour concevoir, prototyper ou développer votre vision ?
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-sm w-full"
              >
                <span>Échanger avec Sylla</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>

        {/* 5. Navigation entre projets (Suivant / Précédent) */}
        <div className="pt-10 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevProject ? (
            <Link
              href={`/projets/${prevProject.slug}`}
              className="glass p-4 rounded-2xl flex items-center gap-3 w-full sm:w-1/2 hover:border-[#2563EB]/40 transition-colors group text-left"
            >
              <div className="p-2 rounded-xl bg-white border border-slate-200/80 group-hover:border-[#2563EB]/40 group-hover:-translate-x-0.5 transition-all">
                <ArrowLeft className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block">
                  Projet précédent
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#0F172A] truncate block group-hover:text-[#2563EB] transition-colors">
                  {prevProject.titre}
                </span>
              </div>
            </Link>
          ) : (
            <div className="hidden sm:block sm:w-1/2" />
          )}

          {nextProject ? (
            <Link
              href={`/projets/${nextProject.slug}`}
              className="glass p-4 rounded-2xl flex items-center justify-end gap-3 w-full sm:w-1/2 hover:border-[#2563EB]/40 transition-colors group text-right"
            >
              <div className="overflow-hidden">
                <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block">
                  Projet suivant
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#0F172A] truncate block group-hover:text-[#2563EB] transition-colors">
                  {nextProject.titre}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-slate-200/80 group-hover:border-[#2563EB]/40 group-hover:translate-x-0.5 transition-all">
                <ArrowRight className="w-4 h-4 text-[#2563EB]" />
              </div>
            </Link>
          ) : (
            <div className="hidden sm:block sm:w-1/2" />
          )}
        </div>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
