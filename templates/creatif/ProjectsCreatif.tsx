"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ProjectCard, type ProjectData } from "@/components/ProjectCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Layers, Sparkles, ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "Toutes les réalisations" },
  { id: "Design", label: "Design & Branding" },
  { id: "Web", label: "Web & SaaS" },
  { id: "Mobile", label: "Mobile & UI/UX" },
  { id: "Vidéo", label: "Vidéo & Motion" },
];

export function ProjectsCreatif({ projects }: { projects: ProjectData[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects;

    return projects.filter((project) => {
      const tagsStr = project.tags.join(" ").toLowerCase();
      const titleDesc = `${project.titre} ${project.description}`.toLowerCase();

      switch (selectedCategory) {
        case "Design":
          return (
            tagsStr.includes("brand") ||
            tagsStr.includes("graphique") ||
            tagsStr.includes("canva") ||
            tagsStr.includes("design") ||
            tagsStr.includes("figma")
          );
        case "Web":
          return (
            tagsStr.includes("web") ||
            tagsStr.includes("dev") ||
            tagsStr.includes("next") ||
            tagsStr.includes("react") ||
            tagsStr.includes("laravel")
          );
        case "Mobile":
          return (
            tagsStr.includes("mobile") ||
            tagsStr.includes("ui") ||
            tagsStr.includes("ux")
          );
        case "Vidéo":
          return (
            tagsStr.includes("vidéo") ||
            tagsStr.includes("video") ||
            tagsStr.includes("motion")
          );
        default:
          return (
            tagsStr.includes(selectedCategory.toLowerCase()) ||
            titleDesc.includes(selectedCategory.toLowerCase())
          );
      }
    });
  }, [projects, selectedCategory]);

  // Duplication des cartes pour une boucle infinie continue et fluide
  const displayProjects = useMemo(() => {
    if (filteredProjects.length === 0) return [];
    if (filteredProjects.length < 4) {
      return [
        ...filteredProjects,
        ...filteredProjects,
        ...filteredProjects,
        ...filteredProjects,
      ];
    }
    return [...filteredProjects, ...filteredProjects];
  }, [filteredProjects]);

  // Défilement automatique continu en boucle avec GSAP
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced || !trackRef.current || displayProjects.length === 0) return;

    const track = trackRef.current;
    gsap.set(track, { xPercent: 0 });

    // Durée proportionnelle au nombre de projets (environ 4s par carte visible)
    const duration = Math.max(22, (displayProjects.length / 2) * 4.5);

    const tween = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration,
      repeat: -1,
    });
    tweenRef.current = tween;

    return () => {
      tween.kill();
    };
  }, [displayProjects]);

  // Mettre en pause le défilement au survol de la souris
  const handleMouseEnter = () => {
    tweenRef.current?.pause();
  };

  const handleMouseLeave = () => {
    tweenRef.current?.play();
  };

  return (
    <section
      id="projets"
      className="py-24 max-w-7xl mx-auto scroll-mt-24 relative text-[#0F172A] overflow-hidden"
    >
      {/* Orbe lumineuse bleue en arrière-plan */}
      <div className="absolute top-1/3 left-[-40px] w-80 h-80 rounded-full bg-[#2563EB] opacity-15 blur-[120px] pointer-events-none -z-10" />

      {/* En-tête de section Créatif */}
      <div className="px-4 sm:px-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass border border-white/80 shadow-2xs text-xs font-semibold text-[#0F172A]">
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Sélection Créative &amp; Ingénierie</span>
          </div>

          <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl tracking-wide text-[#0F172A]">
            PROJETS &amp; CRÉATIONS
          </h2>

          <p className="text-sm sm:text-base text-[#475569] max-w-2xl leading-relaxed">
            Applications interactives, plateformes SaaS, identités visuelles et créations numériques.
          </p>
        </div>

        {/* Compteur discret en verre */}
        <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs text-[#0F172A] glass px-4 py-2 rounded-full border border-white shadow-2xs">
          <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>
            {filteredProjects.length} réalisation{filteredProjects.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Filtres Créatifs en Verre */}
      <div className="px-4 sm:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-mono tracking-wider uppercase transition-all cursor-pointer ${
                isActive
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/25 scale-102"
                  : "glass text-[#475569] hover:text-[#0F172A] hover:bg-white/80 border border-white/80 shadow-2xs"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* CAROUSEL HORIZONTAL À DÉFILEMENT AUTOMATIQUE */}
      {filteredProjects.length === 0 ? (
        <div className="px-4 sm:px-6">
          <div className="glass p-12 text-center rounded-3xl border border-white max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">
              Aucun projet dans cette catégorie
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Sélectionnez un autre filtre ou consultez tous les projets.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="relative py-4 select-none group/carousel"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Dégradés latéraux pour fondu cinématique */}
          <div className="absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-[#F9FAFB] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-[#F9FAFB] to-transparent z-10 pointer-events-none" />

          {/* Piste défilante en continu */}
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-5 sm:gap-6 w-max px-4 sm:px-6 will-change-transform"
            >
              {displayProjects.map((project, idx) => (
                <div
                  key={`${project.id}-${idx}`}
                  className="w-[280px] sm:w-[320px] shrink-0 transform transition-transform duration-300 hover:-translate-y-1"
                >
                  <SpotlightCard
                    spotlightColor="rgba(37, 99, 235, 0.18)"
                    className="h-full rounded-2xl border border-white/80 bg-white/80 backdrop-blur-md shadow-md hover:shadow-xl transition-shadow"
                  >
                    <ProjectCard project={project} />
                  </SpotlightCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BOUTON FLOTTANT "VOIR TOUS LES PROJETS" */}
      <div className="mt-8 flex justify-center px-4 relative z-20">
        <Link
          href="/projets"
          className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#0F172A] hover:bg-[#2563EB] active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-slate-900/15 hover:shadow-blue-600/30 border border-white/20 hover:-translate-y-0.5 cursor-pointer"
        >
          <span>Voir tous les projets</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-medium">
            {projects.length}
          </span>
          <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
