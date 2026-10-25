"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Globe,
  Video,
  FolderOpen,
  Image as ImageIcon,
  Search,
  CheckSquare,
  Loader2,
} from "lucide-react";
import { GithubIcon, FigmaIcon } from "@/components/icons";
import {
  deleteProjectAction,
  toggleVisibilityAction,
  bulkDeleteProjectsAction,
  bulkSetProjectsVisibilityAction,
} from "../../actions/projects";

export interface AdminProjectRow {
  id: string;
  titre: string;
  slug: string;
  coverImage: string | null;
  tags: string[];
  links: unknown;
  ordre: number;
  visible: boolean;
  featured: boolean;
}

export function ProjectsTableClient({
  initialProjects,
}: {
  initialProjects: AdminProjectRow[];
}) {
  const [projects, setProjects] = useState<AdminProjectRow[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const filtered = projects.filter(
    (p) =>
      p.titre.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllFiltered = () => {
    const filteredIds = filtered.map((p) => p.id);
    const allSelected =
      filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...filteredIds])));
    }
  };

  const handleSingleVisibility = (id: string, currentVisible: boolean) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, visible: !currentVisible } : p))
    );
    startTransition(async () => {
      await toggleVisibilityAction(id, currentVisible);
    });
  };

  const handleSingleDelete = (id: string, titre: string) => {
    if (!confirm(`Supprimer définitivement le projet « ${titre} » ?`)) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    startTransition(async () => {
      await deleteProjectAction(id);
    });
  };

  const handleBulkVisibility = (visible: boolean) => {
    if (selectedIds.length === 0) return;
    const idsToUpdate = [...selectedIds];
    setProjects((prev) =>
      prev.map((p) => (idsToUpdate.includes(p.id) ? { ...p, visible } : p))
    );
    setSelectedIds([]);
    startTransition(async () => {
      await bulkSetProjectsVisibilityAction(idsToUpdate, visible);
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (
      !confirm(
        `Confirmez-vous la suppression définitive des ${selectedIds.length} projet(s) sélectionné(s) ?`
      )
    ) {
      return;
    }
    const idsToDelete = [...selectedIds];
    setProjects((prev) => prev.filter((p) => !idsToDelete.includes(p.id)));
    setSelectedIds([]);
    startTransition(async () => {
      await bulkDeleteProjectsAction(idsToDelete);
    });
  };

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-3">
          <Plus className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-[#0F172A]">
          Aucun projet pour le moment
        </h3>
        <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
          Ajoutez votre premier projet de design, développement, vidéo ou IA pour l&apos;afficher sur votre portfolio.
        </p>
        <Link
          href="/admin/projets/nouveau"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-medium"
        >
          <Plus className="w-4 h-4" /> Ajouter mon premier projet
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche & actions groupées */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un projet par titre, slug ou tag..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSelectAllFiltered}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#0F172A] cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>
                {filtered.length > 0 && filtered.every((p) => selectedIds.includes(p.id))
                  ? "Tout décocher"
                  : `Tout cocher (${filtered.length})`}
              </span>
            </button>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-blue-50/60 -mx-4 -mb-4 px-4 py-3 rounded-b-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
              <CheckSquare className="w-4 h-4" />
              <span>
                {selectedIds.length} projet{selectedIds.length > 1 ? "s" : ""} sélectionné{selectedIds.length > 1 ? "s" : ""}
              </span>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-slate-500 hover:text-slate-800 underline ml-2 font-normal cursor-pointer"
              >
                Désélectionner
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleBulkVisibility(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-emerald-50 text-emerald-700 text-xs font-semibold shadow-sm cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Rendre visibles</span>
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => handleBulkVisibility(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-sm cursor-pointer"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Masquer</span>
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Supprimer ({selectedIds.length})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-mono uppercase tracking-wider text-[#475569]">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filtered.length > 0 &&
                      filtered.every((p) => selectedIds.includes(p.id))
                    }
                    onChange={toggleSelectAllFiltered}
                    className="w-4 h-4 rounded text-[#2563EB] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Ordre</th>
                <th className="py-3.5 px-4">Projet</th>
                <th className="py-3.5 px-4">Tags & Casquettes</th>
                <th className="py-3.5 px-4">Liens</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((p) => {
                const links = (p.links || {}) as Record<string, string>;
                const isSelected = selectedIds.includes(p.id);

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isSelected ? "bg-blue-50/40" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(p.id)}
                        className="w-4 h-4 rounded text-[#2563EB] cursor-pointer"
                      />
                    </td>

                    {/* Ordre */}
                    <td className="py-3.5 px-4 font-mono text-xs text-[#64748B]">
                      #{p.ordre}
                    </td>

                    {/* Projet & Cover */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center text-slate-400">
                          {p.coverImage ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={p.coverImage}
                              alt={p.titre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-[#0F172A] truncate flex items-center gap-2">
                            <span>{p.titre}</span>
                            {p.featured && (
                              <span className="text-[10px] bg-orange-100 text-[#F97316] font-medium px-1.5 py-0.2 rounded">
                                À la une
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs text-[#64748B]">
                            /{p.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tags */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
                          >
                            {tag}
                          </span>
                        ))}
                        {p.tags.length > 3 && (
                          <span className="text-[10px] font-mono text-slate-400 self-center">
                            +{p.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Liens */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        {links.demo && (
                          <a
                            href={links.demo}
                            target="_blank"
                            title="Démo Live"
                            className="hover:text-emerald-600 transition-colors"
                          >
                            <Globe className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {links.github && (
                          <a
                            href={links.github}
                            target="_blank"
                            title="GitHub"
                            className="hover:text-slate-800 transition-colors"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {links.figma && (
                          <a
                            href={links.figma}
                            target="_blank"
                            title="Figma"
                            className="hover:text-purple-600 transition-colors"
                          >
                            <FigmaIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {links.video && (
                          <a
                            href={links.video}
                            target="_blank"
                            title="Vidéo"
                            className="hover:text-red-600 transition-colors"
                          >
                            <Video className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {links.drive && (
                          <a
                            href={links.drive}
                            target="_blank"
                            title="Drive/Canva"
                            className="hover:text-amber-600 transition-colors"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Statut Visibilité */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleSingleVisibility(p.id, p.visible)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          p.visible
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {p.visible ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-slate-400" />
                            <span>Masqué</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/projets/${p.slug}`}
                          target="_blank"
                          title="Aperçu public"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <Link
                          href={`/admin/projets/${p.id}`}
                          title="Modifier"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleSingleDelete(p.id, p.titre)}
                          title="Supprimer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
