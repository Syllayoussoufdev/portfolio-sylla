"use client";

import { useState, useMemo } from "react";
import { ProjectCard, type ProjectData } from "./ProjectCard";
import { Layers, RotateCcw } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "Tous" },
  { id: "Web", label: "Web & SaaS" },
  { id: "Mobile", label: "Mobile & UI/UX" },
  { id: "Branding", label: "Branding & Stratégie" },
  { id: "IA", label: "IA & Automatisation" },
  { id: "Vidéo", label: "Vidéo & Motion" },
];

export function ProjectsGrid({ projects }: { projects: ProjectData[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects;

    return projects.filter((project) => {
      const tagsStr = project.tags.join(" ").toLowerCase();
      const titleDesc = `${project.titre} ${project.description}`.toLowerCase();

      switch (selectedCategory) {
        case "Web":
          return tagsStr.includes("web") || tagsStr.includes("dev") || tagsStr.includes("next") || tagsStr.includes("react") || tagsStr.includes("laravel") || tagsStr.includes("typescript");
        case "Mobile":
          return tagsStr.includes("mobile") || tagsStr.includes("ui") || tagsStr.includes("ux") || tagsStr.includes("figma") || tagsStr.includes("motion");
        case "Branding":
          return tagsStr.includes("brand") || tagsStr.includes("guideline") || tagsStr.includes("graphique") || tagsStr.includes("canva") || tagsStr.includes("identité");
        case "IA":
          return tagsStr.includes("ia") || tagsStr.includes("ai") || tagsStr.includes("prompt") || tagsStr.includes("automatisation");
        case "Vidéo":
          return tagsStr.includes("vidéo") || tagsStr.includes("video") || tagsStr.includes("montage") || tagsStr.includes("cadrage");
        default:
          return tagsStr.includes(selectedCategory.toLowerCase()) || titleDesc.includes(selectedCategory.toLowerCase());
      }
    });
  }, [projects, selectedCategory]);

  return (
    <section id="projets" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
      {/* En-tête de section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[#0B132B] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            <span>Sélection &amp; Réalisations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B132B]">
            Projets &amp; Réalisations
          </h2>

          <p className="text-sm sm:text-base text-[#475569] max-w-2xl leading-relaxed">
            Une sélection de réalisations concrètes : applications SaaS, plateformes web,
            systèmes de design et solutions numériques complètes.
          </p>
        </div>

        {/* Compteur discret */}
        <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs text-[#64748B] bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
          <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>
            {filteredProjects.length} sur {projects.length} projet{projects.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Barre de filtres interactive */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0B132B] text-white shadow-xs"
                  : "bg-white text-[#475569] hover:text-[#0B132B] hover:bg-slate-100/80 border border-slate-200/80"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grille des cartes */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#0B132B]">Aucun projet dans cette catégorie</h3>
          <p className="text-xs text-[#64748B] mt-1 mb-5">
            Aucun projet n&apos;est actuellement associé à ce filtre.
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B132B] text-white text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser les filtres</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
