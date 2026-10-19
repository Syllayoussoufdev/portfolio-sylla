"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Film,
  Play,
  ArrowUpRight,
  Globe,
  Layers,
  Sparkles,
  Video,
  MonitorPlay,
  ExternalLink,
} from "lucide-react";
import { GithubIcon, FigmaIcon } from "@/components/icons";
import type { ProjectData } from "@/components/ProjectCard";

const CATEGORIES = [
  { id: "all", label: "Toutes les pièces" },
  { id: "Motion", label: "Motion 3D & WebGL" },
  { id: "Video", label: "Montage & Showreel" },
  { id: "Design", label: "Direction Artistique" },
];

export function ProjectsImmersif({ projects }: { projects: ProjectData[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);

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
            tagsStr.includes("reel") ||
            titleDesc.includes("montage")
          );
        case "Design":
          return (
            tagsStr.includes("brand") ||
            tagsStr.includes("graphique") ||
            tagsStr.includes("design") ||
            tagsStr.includes("figma")
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

      // 2. Grille de projets
      if (gridRef.current && gridRef.current.children.length > 0) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 40, scale: 0.98 },
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

      // 3. Ruban cinématique Filmstrip
      if (ribbonRef.current) {
        gsap.to(ribbonRef.current, {
          xPercent: -35,
          ease: "none",
          scrollTrigger: {
            trigger: ribbonRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [selectedCategory]);

  return (
    <section
      ref={sectionRef}
      id="projets"
      className="py-28 px-5 sm:px-8 max-w-7xl mx-auto scroll-mt-24 text-white relative"
    >
      {/* En-tête de section (Inspiration "Ideas out in the world.") */}
      <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 border-b border-white/10 pb-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#FF2A14] text-xs font-mono font-medium tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A14]" />
            <span>[ 02 · SÉLECTION DE TRAVAUX ]</span>
          </div>

          <h2 className="font-syne text-4xl sm:text-6xl font-extrabold tracking-tight text-white uppercase leading-tight">
            Ideas out in the world.
          </h2>

          <p className="text-xs sm:text-sm font-mono text-zinc-400 max-w-2xl leading-relaxed">
            Films publicitaires, vidéos courtes à haute rétention, identités visuelles et modélisations 3D.
          </p>
        </div>

        {/* Compteur d'éléments */}
        <div className="flex items-center gap-3 font-mono text-xs text-zinc-300 bg-zinc-950 px-4 py-2 rounded-full border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#FF2A14]" />
          <span>
            {filteredProjects.length} pièce{filteredProjects.length > 1 ? "s" : ""} au catalogue
          </span>
        </div>
      </div>

      {/* Filtres de catégorie en pilules sobres */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-3 mb-14 -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#FF2A14] text-white font-bold shadow-lg shadow-red-950/50 border border-[#FF2A14]"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/10"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grille de projets format Éditorial Sombre & Cadence */}
      {filteredProjects.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#111113] border border-white/10 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-[#FF2A14] flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-syne">
            Aucun projet dans cette catégorie
          </h3>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Explorez nos autres catégories ou sélectionnez l&apos;ensemble du catalogue.
          </p>
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-28">
          {filteredProjects.map((project, idx) => {
            const links = (project.links || {}) as Record<string, string>;
            const imageSrc = project.coverMedia?.url || project.coverImage;
            const imageAlt = project.coverMedia?.alt || project.titre;

            return (
              <div
                key={project.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-[#111113] border border-white/10 hover:border-[#FF2A14]/70 transition-all duration-500 overflow-hidden"
              >
                {/* 1. Zone visuelle cinématique */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-950 border-b border-white/10">
                  {imageSrc ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={imageSrc}
                      alt={imageAlt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-zinc-900 to-black text-zinc-400">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FF2A14] mb-2 group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                      <span className="font-syne text-sm text-white tracking-wide">
                        {project.titre}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        Production Vidéo
                      </span>
                    </div>
                  )}

                  {/* Gradient sombre cinématique */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Bouton de survol Play rouge */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-[#FF2A14] text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Badge index minimaliste */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300">
                    PRJ_{String(idx + 1).padStart(2, "0")}
                  </div>

                  {project.featured && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#FF2A14] text-white font-mono text-[9px] font-bold tracking-wider uppercase">
                      FEATURED
                    </div>
                  )}

                  <Link
                    href={`/projets/${project.slug}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Voir le détail du projet ${project.titre}`}
                  />
                </div>

                {/* 2. Détails du projet */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Tags sobres */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-[10px] font-mono text-zinc-500 self-center">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Titre & Lien */}
                    <Link
                      href={`/projets/${project.slug}`}
                      className="group/title block"
                    >
                      <h3 className="font-syne font-bold text-lg text-white group-hover/title:text-[#FF2A14] transition-colors flex items-center justify-between gap-2">
                        <span className="truncate">{project.titre}</span>
                        <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover/title:text-[#FF2A14] group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all shrink-0" />
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-xs font-mono text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* 3. Pied de carte */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between relative z-20">
                    <div className="flex items-center gap-2">
                      {links.demo && (
                        <a
                          href={links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
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
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
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
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="Maquette Figma"
                        >
                          <FigmaIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <Link
                      href={`/projets/${project.slug}`}
                      className="text-xs font-mono font-semibold text-zinc-300 hover:text-[#FF2A14] transition-colors flex items-center gap-1"
                    >
                      Étude de cas
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Filmstrip Ribbon Dynamique ("Always in motion.") */}
      <div className="border-t border-white/10 pt-20 mb-24 overflow-hidden">
        <div className="space-y-4 mb-8">
          <span className="text-xs font-mono text-[#FF2A14] uppercase tracking-wider block">
            [ FLUX CONTINU ]
          </span>
          <h3 className="font-syne text-3xl sm:text-5xl font-extrabold text-white uppercase">
            Always in motion.
          </h3>
        </div>

        {/* Bande défilante GSAP */}
        <div className="relative w-full overflow-hidden py-4 select-none">
          <div ref={ribbonRef} className="flex gap-5 w-max">
            {projects.slice(0, 6).map((item, idx) => {
              const src = item.coverMedia?.url || item.coverImage;
              return (
                <div
                  key={idx}
                  className="w-64 sm:w-80 aspect-16/9 rounded-2xl overflow-hidden bg-zinc-900 border border-white/15 relative shrink-0 group"
                >
                  {src ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={src}
                      alt={item.titre}
                      className="w-full h-full object-cover filter contrast-110 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500 font-mono text-xs">
                      {item.titre}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-syne font-bold text-white truncate">
                      {item.titre}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Signature Brutaliste Marque (Inspiration "Your idea. Our next obsession. / Velom ®") */}
      <div className="border-t border-white/10 pt-20 pb-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#FF2A14] uppercase tracking-wider block">
              [ CALL TO ACTION ]
            </span>
            <h3 className="font-syne text-3xl sm:text-5xl font-extrabold text-white uppercase">
              Your idea.<br />Our next obsession.
            </h3>
          </div>

          <Link
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FF2A14] hover:bg-[#E0240F] active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-red-950/50 cursor-pointer self-start md:self-auto"
          >
            <span>Démarrer une collaboration</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Typographie Géante Style "Velom ®" */}
        <div className="pt-12 border-t border-white/10 flex items-baseline justify-between select-none overflow-hidden">
          <div className="font-syne font-black text-6xl sm:text-9xl tracking-tighter text-white uppercase leading-none">
            ✦ SYLLA<span className="text-[#FF2A14]">®</span>
          </div>
          <span className="hidden sm:block font-mono text-xs text-zinc-500 uppercase tracking-widest">
            PARIS / ABIDJAN · 2026
          </span>
        </div>
      </div>
    </section>
  );
}
