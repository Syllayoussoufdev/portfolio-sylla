import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  deleteSubPortfolioAction,
  toggleSubPortfolioStatusAction,
} from "../../actions/subportfolios";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";

export default async function AdminSubPortfoliosListPage() {
  const subPortfolios = await prisma.subPortfolio.findMany({
    include: {
      projects: {
        include: {
          project: {
            select: {
              id: true,
              titre: true,
            },
          },
        },
      },
      visits: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-bebas text-4xl sm:text-5xl text-[#0F172A] tracking-wide">
            Sous-Portfolios Filtrés
          </h1>
          <p className="text-sm text-[#475569]">
            Générez des liens sur-mesure pour chaque recruteur ou prospect (ex: /design, /dev, /video).
          </p>
        </div>

        <Link
          href="/admin/portfolios/nouveau"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau sous-portfolio</span>
        </Link>
      </div>

      {/* Bannière "Feature Différenciante" */}
      <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#F97316] text-white flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
            Feature Différenciante — Conversion Maximale
          </h4>
          <p className="text-xs text-[#0F172A] mt-0.5 leading-relaxed">
            Un recruteur en design ne doit pas fouiller parmi des repos Git. En lui envoyant un sous-lien comme{" "}
            <span className="font-mono font-bold text-[#F97316]">/design</span>, il accède immédiatement à une vitrine épurée contenant uniquement vos créations pertinentes.
          </p>
        </div>
      </div>

      {/* Tableau des sous-portfolios */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {subPortfolios.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#0F172A]">Aucun sous-portfolio créé</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              Créez votre première vue filtrée pour un domaine précis (par exemple : /design pour vos affiches et identités visuelles).
            </p>
            <Link
              href="/admin/portfolios/nouveau"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F97316] text-white text-xs font-medium"
            >
              <Plus className="w-4 h-4" /> Créer mon premier sous-lien
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-mono uppercase tracking-wider text-[#475569]">
                  <th className="py-3.5 px-4">Lien public</th>
                  <th className="py-3.5 px-4">Cible / Intitulé</th>
                  <th className="py-3.5 px-4">Projets associés</th>
                  <th className="py-3.5 px-4">Visites</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {subPortfolios.map((sp) => {
                  const toggleStatus = toggleSubPortfolioStatusAction.bind(null, sp.id, sp.actif);
                  const deleteThis = deleteSubPortfolioAction.bind(null, sp.id);

                  return (
                    <tr key={sp.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Slug URL */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/${sp.slug}`}
                            target="_blank"
                            className="font-mono text-xs font-bold text-[#F97316] hover:underline flex items-center gap-1"
                          >
                            /{sp.slug}
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>
                        </div>
                      </td>

                      {/* Cible */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#0F172A]">{sp.label}</div>
                        {sp.description && (
                          <div className="text-xs text-[#64748B] line-clamp-1 max-w-xs">
                            {sp.description}
                          </div>
                        )}
                      </td>

                      {/* Projets */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-[#2563EB] border border-blue-100">
                          {sp.projects.length} projet{sp.projects.length > 1 ? "s" : ""}
                        </span>
                      </td>

                      {/* Visites */}
                      <td className="py-3.5 px-4 font-mono text-xs text-[#0F172A] font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          {sp.visits.length}
                        </span>
                      </td>

                      {/* Statut */}
                      <td className="py-3.5 px-4">
                        <form action={toggleStatus}>
                          <button
                            type="submit"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                              sp.actif
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            {sp.actif ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Actif</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-slate-400" />
                                <span>Désactivé</span>
                              </>
                            )}
                          </button>
                        </form>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/portfolios/${sp.id}`}
                            title="Modifier"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#F97316] hover:bg-orange-50 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <form action={deleteThis}>
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
