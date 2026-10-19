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
} from "lucide-react";
import { GithubIcon, FigmaIcon } from "@/components/icons";
import type { ProjectData } from "@/components/ProjectCard";

const CATEGORIES = [
  { id: "all", label: "Tous mes projets" },
  { id: "Video", label: "Montages & Réseaux" },
  { id: "Motion", label: "Motion & Effets" },
  { id: "Design", label: "Design & Visuels" },
];

function CinematicProjectVisual({
  imageSrc,
  imageAlt,
  title,
  index,
}: {
  imageSrc?: string | null;
  imageAlt: string;
  title: string;
  index: number;
}) {
  const filterId = `disp-filter-${index}`;
  const mapId = `disp-map-${index}`;
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const map = document.getElementById(mapId);
    if (map) {
      gsap.fromTo(
        map,
        { attr: { scale: 0 } },
        {
          attr: { scale: 16 },
          duration: 0.25,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(map, { attr: { scale: 4 }, duration: 0.4, ease: "power1.inOut" });
          },
        }
      );
    }
  };

  const handleMouseLeave = () => {
    const map = document.getElementById(mapId);
    if (map) {
      gsap.to(map, { attr: { scale: 0 }, duration: 0.35, ease: "power2.in" });
    }
  };

  const timecodes = [
    "00:01:24:18",
    "00:03:45:09",
    "00:02:11:04",
    "00:04:19:22",
    "00:00:58:15",
    "00:02:50:00",
  ];
  const tc = timecodes[index % timecodes.length];

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full overflow-hidden"
    >
      {/* Contrat de mouvement immersif #3 : Distorsion shader au survol (feDisplacementMap) */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035 0.05"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              id={mapId}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="w-full h-full relative transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ filter: `url(#${filterId})`, willChange: "filter, transform" }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative w-full h-full bg-gradient-to-br from-[#141418] via-[#0A0A0D] to-black flex flex-col justify-between p-5 overflow-hidden select-none">
            {/* Grille et viseur caméra cinéma */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF2A14]/15 rounded-full blur-2xl pointer-events-none" />

            {/* Barre d'état Viewfinder */}
            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF2A14] animate-pulse" />
                <span className="text-white font-semibold">REC ● 4K UHD</span>
              </div>
              <span className="text-zinc-500 font-mono">{tc}</span>
            </div>

            {/* Centre : Titre percutant & Play badge */}
            <div className="relative z-10 text-center my-auto py-2 space-y-2">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#FF2A14] mx-auto group-hover:scale-110 group-hover:bg-[#FF2A14] group-hover:text-white transition-all duration-300 shadow-lg">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
              <div className="font-syne font-bold text-sm sm:text-base text-white truncate max-w-xs mx-auto">
                {title}
              </div>
            </div>

            {/* Bas : Timeline & Audio Waveform stylisée */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 text-[9px] font-mono text-zinc-500">
              <div className="flex items-center gap-1">
                <span className="w-1 h-3 bg-[#FF2A14] rounded-full" />
                <span className="w-1 h-4 bg-[#FF2A14]/80 rounded-full" />
                <span className="w-1 h-2 bg-zinc-600 rounded-full" />
                <span className="w-1 h-5 bg-[#FF2A14] rounded-full" />
                <span className="w-1 h-3 bg-zinc-600 rounded-full" />
              </div>
              <span>60 FPS · MONTAGE VIDÉO</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
        case "Video":
          return (
            tagsStr.includes("vidéo") ||
            tagsStr.includes("video") ||
            tagsStr.includes("montage") ||
            tagsStr.includes("reel") ||
            titleDesc.includes("montage")
          );
        case "Motion":
          return (
            tagsStr.includes("motion") ||
            tagsStr.includes("3d") ||
            tagsStr.includes("anim") ||
            titleDesc.includes("motion")
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
      className="py-24 px-5 sm:px-8 max-w-7xl mx-auto scroll-mt-24 text-white relative"
    >
      {/* 1. En-tête de section en français */}
      <div
        ref={headerRef}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 border-b border-white/10 pb-6"
      >
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#FF2A14] text-xs font-mono font-medium tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A14]" />
            <span>[ 02 · MES RÉALISATIONS &amp; ESSAIS ]</span>
          </div>

          <h2 className="font-syne text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase leading-tight">
            Mes Projets Vidéo.
          </h2>

          <p className="text-xs sm:text-sm font-mono text-zinc-400 max-w-2xl leading-relaxed">
            Vidéos courtes, projets de films, exercices de montage et réalisations en cours d&apos;apprentissage.
          </p>
        </div>

        {/* Compteur d'éléments */}
        <div className="flex items-center gap-3 font-mono text-xs text-zinc-300 bg-zinc-950 px-4 py-2 rounded-full border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#FF2A14]" />
          <span>
            {filteredProjects.length} projet{filteredProjects.length > 1 ? "s" : ""} présenté{filteredProjects.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* 2. LE CAROUSEL CINÉMATIQUE "EN CONTINU" EN VITRINE */}
      <div className="mb-20 overflow-hidden -mx-5 sm:-mx-8 py-6 bg-gradient-to-b from-[#0B0B0E] via-[#070708] to-[#0B0B0E] border-y border-white/10">
        <div className="px-5 sm:px-8 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FF2A14] animate-pulse" />
            <h3 className="font-syne text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
              En continu · Défilement de mes montages
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            [ APERÇU CINÉTIQUE ]
          </span>
        </div>

        {/* Ruban animé avec GSAP Scrub */}
        <div className="relative w-full overflow-hidden select-none">
          <div ref={ribbonRef} className="flex gap-6 w-max px-4">
            {projects.map((item, idx) => {
              const src = item.coverMedia?.url || item.coverImage;
              return (
                <Link
                  key={`ribbon-${item.id}-${idx}`}
                  href={`/projets/${item.slug}`}
                  className="w-72 sm:w-96 aspect-16/10 rounded-3xl overflow-hidden bg-[#111113] border border-white/15 hover:border-[#FF2A14] relative shrink-0 group transition-all duration-300 shadow-xl"
                >
                  <CinematicProjectVisual
                    imageSrc={src}
                    imageAlt={item.titre}
                    title={item.titre}
                    index={idx}
                  />

                  {/* Gradient & Overlay Titre */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5 pointer-events-none">
                    <span className="text-[10px] font-mono text-[#FF2A14] uppercase tracking-wider mb-1">
                      {item.tags[0] || "Projet Vidéo"}
                    </span>
                    <h4 className="font-syne font-bold text-base text-white group-hover:text-[#FF2A14] transition-colors truncate">
                      {item.titre}
                    </h4>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Filtres de catégorie en français */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-3 mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
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

      {/* 4. Grille de projets détaillée */}
      {filteredProjects.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#111113] border border-white/10 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-[#FF2A14] flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-syne">
            Aucun projet dans cette catégorie
          </h3>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Sélectionnez une autre catégorie ou consultez l&apos;ensemble de mes projets.
          </p>
        </div>
      ) : (
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
        >
          {filteredProjects.map((project, idx) => {
            const links = (project.links || {}) as Record<string, string>;
            const imageSrc = project.coverMedia?.url || project.coverImage;
            const imageAlt = project.coverMedia?.alt || project.titre;

            return (
              <div
                key={project.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-[#111113] border border-white/10 hover:border-[#FF2A14]/70 transition-all duration-500 overflow-hidden"
              >
                {/* 1. Zone visuelle avec fallback cinéma 4K */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-950 border-b border-white/10">
                  <CinematicProjectVisual
                    imageSrc={imageSrc}
                    imageAlt={imageAlt}
                    title={project.titre}
                    index={idx}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-[#FF2A14] text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300">
                    PRJ_{String(idx + 1).padStart(2, "0")}
                  </div>

                  <Link
                    href={`/projets/${project.slug}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Voir le détail du projet ${project.titre}`}
                  />
                </div>

                {/* 2. Détails */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
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

                    <Link
                      href={`/projets/${project.slug}`}
                      className="group/title block"
                    >
                      <h3 className="font-syne font-bold text-lg text-white group-hover/title:text-[#FF2A14] transition-colors flex items-center justify-between gap-2">
                        <span className="truncate">{project.titre}</span>
                        <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover/title:text-[#FF2A14] group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all shrink-0" />
                      </h3>
                    </Link>

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
                          title="Voir la vidéo"
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
                          title="Fichiers ou projet"
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
                          title="Maquette ou storyboard"
                        >
                          <FigmaIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <Link
                      href={`/projets/${project.slug}`}
                      className="text-xs font-mono font-semibold text-zinc-300 hover:text-[#FF2A14] transition-colors flex items-center gap-1"
                    >
                      Détails du projet
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Signature Personnelle en bas de page */}
      <div className="border-t border-white/10 pt-16 pb-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#FF2A14] uppercase tracking-wider block">
              [ ÉCHANGE &amp; COLLABORATION ]
            </span>
            <h3 className="font-syne text-2xl sm:text-4xl font-extrabold text-white uppercase">
              Une idée de vidéo ou un projet ?<br />Parlons-en simplement.
            </h3>
          </div>

          <Link
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FF2A14] hover:bg-[#E0240F] active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-red-950/50 cursor-pointer self-start md:self-auto"
          >
            <span>Me contacter pour échanger</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pt-8 border-t border-white/10 flex items-baseline justify-between select-none overflow-hidden">
          <div className="font-syne font-black text-4xl sm:text-7xl tracking-tighter text-white uppercase leading-none">
            ✦ SYLLA YOUSSOUF<span className="text-[#FF2A14]">.</span>
          </div>
          <span className="hidden sm:block font-mono text-xs text-zinc-500 uppercase tracking-widest">
            PORTFOLIO CRÉATEUR VIDÉO · 2026
          </span>
        </div>
      </div>
    </section>
  );
}
