"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Film,
  Sparkles,
  Layers,
  Play,
  ArrowUpRight,
  MonitorPlay,
  ExternalLink,
  Globe,
} from "lucide-react";
import { GithubIcon, FigmaIcon } from "@/components/icons";
import type { ProjectData } from "@/components/ProjectCard";

const CATEGORIES = [
  { id: "all", label: "Toutes les créations" },
  { id: "Motion", label: "Motion Design & 3D" },
  { id: "Video", label: "Vidéo & Showreel" },
  { id: "Design", label: "Branding & DA" },
  { id: "Web", label: "Expériences Web & SaaS" },
];

export function ProjectsImmersif({ projects }: { projects: ProjectData[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects;

    return projects.filter((project) => {
      const tagsStr = project.tags.join(" ").toLowerCase();
      const titleDesc = `${project.titre} ${project.description}`.toLowerCase();

      switch (selectedCategory) {
        case "Motion":
          return (
            tagsStr.includes("motion") ||
            tagsStr.includes("3d") ||
            tagsStr.includes("anim") ||
            titleDesc.includes("motion") ||
            titleDesc.includes("3d")
          );
        case "Video":
          return (
            tagsStr.includes("vidéo") ||
            tagsStr.includes("video") ||
            tagsStr.includes("montage") ||
            tagsStr.includes("reel")
          );
        case "Design":
          return (
            tagsStr.includes("brand") ||
            tagsStr.includes("graphique") ||
            tagsStr.includes("design") ||
            tagsStr.includes("figma")
          );
        case "Web":
          return (
            tagsStr.includes("web") ||
            tagsStr.includes("next") ||
            tagsStr.includes("react") ||
            tagsStr.includes("saas") ||
            tagsStr.includes("app")
          );
        default:
          return (
            tagsStr.includes(selectedCategory.toLowerCase()) ||
            titleDesc.includes(selectedCategory.toLowerCase())
          );
      }
    });
  }, [projects, selectedCategory]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. En-tête
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 2. Grille
      if (gridRef.current && gridRef.current.children.length > 0) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 45, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [selectedCategory]);

  return (
    <section
      ref={sectionRef}
      id="projets"
      className="py-28 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24 relative text-slate-100"
    >
      {/* Halo lumineux d'ambiance violette & rose */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[350px] rounded-full bg-gradient-to-l from-pink-600/15 via-purple-600/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[300px] rounded-full bg-gradient-to-r from-purple-700/15 to-transparent blur-[130px] pointer-events-none -z-10" />

      {/* En-tête de section Immersif / Motion Studio */}
      <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium">
            <Film className="w-3.5 h-3.5 text-pink-400" />
            <span>STUDIO SHOWCASE · DIRECTION ARTISTIQUE &amp; MOTION</span>
          </div>

          <h2 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Réalisations &amp; Expériences
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Explorations cinématographiques, univers 3D interactifs, plateformes
            digitales et productions audiovisuelles d&apos;impact.
          </p>
        </div>

        {/* Compteur studio de réalisations */}
        <div className="flex items-center gap-2 font-mono text-xs text-purple-200 bg-purple-950/40 px-4 py-2 rounded-full border border-purple-500/30 shadow-sm backdrop-blur-md">
          <MonitorPlay className="w-3.5 h-3.5 text-pink-400" />
          <span>
            {filteredProjects.length} pièce{filteredProjects.length > 1 ? "s" : ""} au catalogue
          </span>
        </div>
      </div>

      {/* Filtres de catégorie éditoriale */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-12 -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 border border-pink-400/30"
                  : "bg-purple-950/30 text-slate-300 hover:text-white hover:bg-purple-900/40 border border-purple-800/40"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grille de projets format Studio Cinéma */}
      {filteredProjects.length === 0 ? (
        <div className="p-14 text-center rounded-3xl bg-purple-950/20 border border-purple-800/30 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/40 text-pink-400 flex items-center justify-center mx-auto mb-3 border border-purple-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white font-syne">
            Aucun projet dans cette catégorie
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Découvrez nos autres catégories ou explorez l&apos;ensemble du catalogue.
          </p>
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProjects.map((project) => {
            const links = (project.links || {}) as Record<string, string>;
            const imageSrc = project.coverMedia?.url || project.coverImage;
            const imageAlt = project.coverMedia?.alt || project.titre;

            return (
              <div
                key={project.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-[#120B22]/80 border border-purple-800/30 hover:border-pink-500/50 transition-all duration-400 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-900/30 backdrop-blur-md"
              >
                {/* 1. Zone d'aperçu cinématographique */}
                <div className="relative aspect-video w-full overflow-hidden bg-purple-950/50 border-b border-purple-900/30">
                  {imageSrc ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={imageSrc}
                      alt={imageAlt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-950/80 to-slate-950 text-purple-300">
                      <div className="w-12 h-12 rounded-2xl bg-purple-800/30 border border-purple-500/30 flex items-center justify-center text-pink-400 mb-2 group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-pink-400 ml-0.5" />
                      </div>
                      <span className="font-syne text-base text-white tracking-wide">
                        {project.titre}
                      </span>
                      <span className="text-[10px] font-mono text-purple-300/70">
                        Aperçu Showreel
                      </span>
                    </div>
                  )}

                  {/* Bouton de survol Play cinématique */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-13 h-13 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                  </div>

                  {/* Badge À la une ou format */}
                  {project.featured && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-mono text-[10px] font-bold tracking-wider uppercase shadow-md border border-white/20">
                      ★ Showreel Phare
                    </div>
                  )}

                  <Link
                    href={`/projets/${project.slug}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Voir le détail du projet ${project.titre}`}
                  />
                </div>

                {/* 2. Corps du projet */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Tags pastel violacé */}
                    <div className="flex flex-wrap gap-1.5 mb-3.5">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-[10px] font-mono text-purple-400 self-center">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Titre */}
                    <Link
                      href={`/projets/${project.slug}`}
                      className="group/title block"
                    >
                      <h3 className="font-syne font-bold text-lg text-white group-hover/title:text-pink-300 transition-colors flex items-center justify-between gap-2">
                        <span className="truncate">{project.titre}</span>
                        <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover/title:text-pink-300 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all shrink-0" />
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* 3. Pied de carte avec liens externes */}
                  <div className="mt-6 pt-3.5 border-t border-purple-900/30 flex items-center justify-between relative z-20">
                    <div className="flex items-center gap-2">
                      {links.demo && (
                        <a
                          href={links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900/40 transition-colors"
                          title="Lien Démo"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {links.github && (
                        <a
                          href={links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900/40 transition-colors"
                          title="Code source"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      {links.figma && (
                        <a
                          href={links.figma}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900/40 transition-colors"
                          title="Maquette Figma"
                        >
                          <FigmaIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <Link
                      href={`/projets/${project.slug}`}
                      className="text-xs font-mono font-medium text-pink-300 hover:text-white transition-colors flex items-center gap-1"
                    >
                      Détails de production
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
