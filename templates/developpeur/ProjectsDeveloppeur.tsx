"use client";

import { useState, useMemo } from "react";
import { ProjectCard, type ProjectData } from "@/components/ProjectCard";
import { FolderGit2, Code2, Layers, Sparkles } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "Tous" },
  { id: "Web", label: "Web & SaaS" },
  { id: "Mobile", label: "Applications Mobiles" },
  { id: "Backend", label: "Backend & API" },
];

export function ProjectsDeveloppeur({ projects }: { projects: ProjectData[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects;

    return projects.filter((project) => {
      const tagsStr = project.tags.join(" ").toLowerCase();
      const titleDesc = `${project.titre} ${project.description}`.toLowerCase();

      switch (selectedCategory) {
        case "Web":
          return tagsStr.includes("web") || tagsStr.includes("next") || tagsStr.includes("react") || tagsStr.includes("saas");
        case "Backend":
          return tagsStr.includes("laravel") || tagsStr.includes("postgres") || tagsStr.includes("api") || tagsStr.includes("prisma") || tagsStr.includes("node");
        case "Mobile":
          return tagsStr.includes("mobile") || tagsStr.includes("flutter") || tagsStr.includes("react native");
        default:
          return tagsStr.includes(selectedCategory.toLowerCase()) || titleDesc.includes(selectedCategory.toLowerCase());
      }
    });
  }, [projects, selectedCategory]);

  return (
    <section id="projets" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24 text-[#0B132B]">
      {/* En-tête de section (Style Image 1) */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-[#2563EB] text-xs font-semibold">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Sélection d&apos;ingénierie logicielle</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0B132B]">
            Projets &amp; Réalisations
          </h2>

          <p className="text-sm sm:text-base text-[#475569] max-w-2xl leading-relaxed">
            Une sélection de réalisations concrètes : applications SaaS, plateformes web, systèmes de gestion et interfaces ergonomiques.
          </p>
        </div>

        {/* Compteur discret */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#64748B] bg-slate-100 px-4 py-2 rounded-full border border-slate-200/80">
          <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>
            {filteredProjects.length} projet{filteredProjects.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Barre de filtres sobre (Style Image 1) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#0B132B] text-white shadow-sm"
                  : "bg-white text-[#475569] hover:text-[#0B132B] hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grille des cartes de projets */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-white text-[#2563EB] flex items-center justify-center mx-auto mb-3 border border-slate-200">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#0B132B]">Aucun projet dans cette catégorie</h3>
          <p className="text-xs text-[#64748B] mt-1">Consultez l&apos;ensemble des réalisations disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
