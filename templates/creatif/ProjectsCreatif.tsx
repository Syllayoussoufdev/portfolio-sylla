"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectCard, type ProjectData } from "@/components/ProjectCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Layers, Sparkles } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "Toutes les réalisations" },
  { id: "Design", label: "Design & Branding" },
  { id: "Web", label: "Web & SaaS" },
  { id: "Mobile", label: "Mobile & UI/UX" },
  { id: "Vidéo", label: "Vidéo & Motion" },
];

function TiltCardWrapper({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
    const rotateY = ((x - centerX) / centerX) * 6;  // max 6 deg

    gsap.to(el, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      ease: "power1.out",
      duration: 0.3,
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      ease: "power2.out",
      duration: 0.5,
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="h-full will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

export function ProjectsCreatif({ projects }: { projects: ProjectData[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects;

    return projects.filter((project) => {
      const tagsStr = project.tags.join(" ").toLowerCase();
      const titleDesc = `${project.titre} ${project.description}`.toLowerCase();

      switch (selectedCategory) {
        case "Design":
          return tagsStr.includes("brand") || tagsStr.includes("graphique") || tagsStr.includes("canva") || tagsStr.includes("design") || tagsStr.includes("figma");
        case "Web":
          return tagsStr.includes("web") || tagsStr.includes("dev") || tagsStr.includes("next") || tagsStr.includes("react") || tagsStr.includes("laravel");
        case "Mobile":
          return tagsStr.includes("mobile") || tagsStr.includes("ui") || tagsStr.includes("ux");
        case "Vidéo":
          return tagsStr.includes("vidéo") || tagsStr.includes("video") || tagsStr.includes("motion");
        default:
          return tagsStr.includes(selectedCategory.toLowerCase()) || titleDesc.includes(selectedCategory.toLowerCase());
      }
    });
  }, [projects, selectedCategory]);

  // Point 4 : Apparition échelonnée des cartes (stagger 70ms)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced || !gridRef.current) return;

    const cards = gridRef.current.children;
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [selectedCategory]);

  return (
    <section id="projets" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24 relative text-[#0F172A]">
      {/* Orbe lumineuse bleue */}
      <div className="absolute top-1/3 left-[-40px] w-80 h-80 rounded-full bg-[#2563EB] opacity-15 blur-[120px] pointer-events-none -z-10" />

      {/* En-tête de section Créatif */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
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

      {/* Filtres Créatifs en Verre avec Accent Orange/Bleu */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
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

      {/* Grille des cartes avec 3D Tilt individuel */}
      {filteredProjects.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border border-white max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0F172A]">Aucun projet dans cette catégorie</h3>
          <p className="text-xs text-[#64748B] mt-1">Sélectionnez un autre filtre ou consultez tous les projets.</p>
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <TiltCardWrapper key={project.id}>
              <SpotlightCard
                spotlightColor="rgba(37, 99, 235, 0.18)"
                className="h-full rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md shadow-md hover:shadow-xl"
              >
                <ProjectCard project={project} />
              </SpotlightCard>
            </TiltCardWrapper>
          ))}
        </div>
      )}
    </section>
  );
}
