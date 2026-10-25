import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { ProjectsTableClient, type AdminProjectRow } from "./ProjectsTableClient";

export default async function AdminProjectsListPage() {
  let projects: AdminProjectRow[] = [];
  try {
    const raw = await prisma.project.findMany({
      orderBy: [{ ordre: "asc" }, { createdAt: "desc" }],
    });
    projects = raw.map((p) => ({
      id: p.id,
      titre: p.titre,
      slug: p.slug,
      coverImage: p.coverImage,
      tags: p.tags,
      links: p.links,
      ordre: p.ordre,
      visible: p.visible,
      featured: p.featured,
    }));
  } catch (err) {
    console.warn("Erreur récupération projets admin (repli vide) :", err);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-bebas text-4xl sm:text-5xl text-[#0F172A] tracking-wide">
            Gestion des Projets
          </h1>
          <p className="text-sm text-[#475569]">
            {projects.length} projet{projects.length > 1 ? "s" : ""} enregistré{projects.length > 1 ? "s" : ""} • Sélection multiple et actions groupées activées.
          </p>
        </div>

        <Link
          href="/admin/projets/nouveau"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau projet</span>
        </Link>
      </div>

      <ProjectsTableClient initialProjects={projects} />
    </div>
  );
}
