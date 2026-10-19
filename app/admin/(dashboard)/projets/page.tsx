import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProjectAction, toggleVisibilityAction } from "../../actions/projects";
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
} from "lucide-react";
import { GithubIcon, FigmaIcon } from "@/components/icons";

type ProjectItem = Awaited<ReturnType<typeof prisma.project.findMany>>[number];

export default async function AdminProjectsListPage() {
  let projects: ProjectItem[] = [];
  try {
    projects = await prisma.project.findMany({
      orderBy: [{ ordre: "asc" }, { createdAt: "desc" }],
    });
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
            {projects.length} projet{projects.length > 1 ? "s" : ""} enregistré{projects.length > 1 ? "s" : ""} dans votre base de données.
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

      {/* Tableau des projets */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#0F172A]">Aucun projet pour le moment</h3>
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
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-mono uppercase tracking-wider text-[#475569]">
                  <th className="py-3.5 px-4">Ordre</th>
                  <th className="py-3.5 px-4">Projet</th>
                  <th className="py-3.5 px-4">Tags & Casquettes</th>
                  <th className="py-3.5 px-4">Liens</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {projects.map((p) => {
                  const links = (p.links || {}) as Record<string, string>;
                  const toggleThisVisibility = toggleVisibilityAction.bind(null, p.id, p.visible);
                  const deleteThisProject = deleteProjectAction.bind(null, p.id);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
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
                            <span className="font-mono text-xs text-[#64748B]">/{p.slug}</span>
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
                        <form action={toggleThisVisibility}>
                          <button
                            type="submit"
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
                        </form>
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

                          <form action={deleteThisProject}>
                            <button
                              type="submit"
                              title="Supprimer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
