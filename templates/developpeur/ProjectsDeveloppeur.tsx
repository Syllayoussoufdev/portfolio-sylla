"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ProjectData } from "@/components/ProjectCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MagneticButton } from "@/components/motion/MagneticButton";
import {
  Code2,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  FolderGit2,
} from "lucide-react";
import { GithubIcon } from "@/components/icons";

const CATEGORIES = [
  { id: "all", label: "Toutes les réalisations" },
  { id: "web", label: "Web & Fullstack" },
  { id: "backend", label: "Backend & API" },
];

export function ProjectsDeveloppeur({ projects }: { projects: ProjectData[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const featuredPinRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects;

    return projects.filter((project) => {
      const tagsStr = project.tags.join(" ").toLowerCase();
      const titleDesc = `${project.titre} ${project.description}`.toLowerCase();

      switch (selectedCategory) {
        case "web":
          return (
            tagsStr.includes("web") ||
            tagsStr.includes("next") ||
            tagsStr.includes("react") ||
            tagsStr.includes("saas") ||
            titleDesc.includes("web")
          );
        case "backend":
          return (
            tagsStr.includes("laravel") ||
            tagsStr.includes("postgres") ||
            tagsStr.includes("api") ||
            tagsStr.includes("prisma") ||
            tagsStr.includes("python") ||
            tagsStr.includes("django") ||
            tagsStr.includes("docker")
          );
        default:
          return (
            tagsStr.includes(selectedCategory.toLowerCase()) ||
            titleDesc.includes(selectedCategory.toLowerCase())
          );
      }
    });
  }, [projects, selectedCategory]);

  const featuredProject = filteredProjects[0];
  const otherProjects = filteredProjects.slice(1);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Révélation de l'en-tête
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 2. Projet à la une épinglé (ScrollTrigger pin doux sur grand écran)
      if (featuredPinRef.current && window.innerWidth >= 1024 && otherProjects.length > 0) {
        ScrollTrigger.create({
          trigger: featuredPinRef.current,
          start: "top 120px",
          endTrigger: gridRef.current,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
        });
      }

      // 3. Révélation de la liste des autres projets
      if (gridRef.current && gridRef.current.children.length > 0) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [selectedCategory, otherProjects.length]);

  return (
    <section
      ref={sectionRef}
      id="projets"
      className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24 text-[#0B1B3A]"
    >
      {/* En-tête de section */}
      <div ref={headerRef} className="space-y-4 mb-14 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-[#2F5BFF] text-xs font-semibold">
          <Code2 className="w-3.5 h-3.5" />
          <span>Ingénierie Logicielle &amp; Réalisations Web</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0B1B3A]">
          Projets &amp; Systèmes Développés
        </h2>

        <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
          Applications web, architectures backend et plateformes concrètes. Chaque projet combine robustesse logicielle, code typé et interfaces soignées.
        </p>

        {/* Filtres par catégories */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#0B1B3A] text-white shadow-sm scale-102"
                  : "bg-white border border-slate-200 text-[#475569] hover:border-[#2F5BFF]/40 hover:text-[#0B1B3A]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2F5BFF] flex items-center justify-center mx-auto">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#0B1B3A] text-base">Aucun projet dans cette catégorie</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Sélectionnez une autre catégorie pour explorer les autres réalisations logicielles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 1. Projet À LA UNE épinglé (Grand format avec détails) */}
          {featuredProject && (
            <div className="lg:col-span-5">
              <div ref={featuredPinRef} className="space-y-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#2F5BFF] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5B83D]" />
                  Projet à la une
                </span>

                <SpotlightCard
                  spotlightColor="rgba(47, 91, 255, 0.15)"
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-5 hover:border-[#2F5BFF]/40 transition-all duration-300"
                >
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                    {featuredProject.coverMedia?.url || featuredProject.coverImage ? (
                      <Image
                        src={featuredProject.coverMedia?.url || featuredProject.coverImage || ""}
                        alt={featuredProject.titre}
                        fill
                        sizes="(max-width: 1024px) 100vw, 480px"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6">
                        <Code2 className="w-8 h-8 text-[#2F5BFF] mb-2" />
                        <span className="font-bold text-sm text-[#0B1B3A]">{featuredProject.titre}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#0B1B3A]">
                      {featuredProject.titre}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      {featuredProject.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {featuredProject.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-blue-50 text-[#2F5BFF] border border-blue-100 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Liens avec attraction magnétique */}
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    <MagneticButton maxDistance={8}>
                      <Link
                        href={`/projets/${featuredProject.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1B3A] text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
                      >
                        <span>Étude de cas</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#2F5BFF]" />
                      </Link>
                    </MagneticButton>

                    {((featuredProject.links || {}) as Record<string, string>).demo && (
                      <MagneticButton maxDistance={8}>
                        <a
                          href={((featuredProject.links || {}) as Record<string, string>).demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#0B1B3A] hover:bg-slate-50 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#2F5BFF]" />
                          <span>Démo live</span>
                        </a>
                      </MagneticButton>
                    )}

                    {((featuredProject.links || {}) as Record<string, string>).github && (
                      <MagneticButton maxDistance={8}>
                        <a
                          href={((featuredProject.links || {}) as Record<string, string>).github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#0B1B3A] hover:bg-slate-50 transition-colors"
                        >
                          <GithubIcon className="w-3.5 h-3.5 text-slate-700" />
                          <span>Code source</span>
                        </a>
                      </MagneticButton>
                    )}
                  </div>
                </SpotlightCard>
              </div>
            </div>
          )}

          {/* 2. Liste / Grille des autres projets */}
          <div ref={gridRef} className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
              Autres Réalisations &amp; Outils ({otherProjects.length})
            </span>

            {otherProjects.map((project, idx) => {
              const projectLinks = (project.links || {}) as Record<string, string>;
              const img = project.coverMedia?.url || project.coverImage;

              return (
                <SpotlightCard
                  key={project.id}
                  spotlightColor="rgba(47, 91, 255, 0.12)"
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#2F5BFF]/40 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-xs font-bold text-[#2F5BFF] bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 shrink-0">
                      {(idx + 2).toString().padStart(2, "0")}
                    </span>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-[#0B1B3A] group-hover:text-[#2F5BFF] transition-colors">
                          {project.titre}
                        </h4>
                      </div>

                      <p className="text-xs text-[#475569] leading-relaxed line-clamp-2 max-w-xl">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {projectLinks.github && (
                      <a
                        href={projectLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl text-slate-500 hover:text-[#0B1B3A] hover:bg-slate-100 transition-colors"
                        title="Code source GitHub"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}

                    <Link
                      href={`/projets/${project.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#2F5BFF] hover:text-white text-[#0B1B3A] text-xs font-semibold transition-all"
                    >
                      <span>Détails</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
