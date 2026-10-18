import { prisma } from "@/lib/prisma";
import { BarChart3, Eye, ShieldCheck, Globe, Clock, Layers } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const [totalVisits, visitsByPath, subPortfoliosWithVisits, recentVisits] =
    await Promise.all([
      prisma.visit.count(),
      prisma.visit.groupBy({
        by: ["path"],
        _count: { path: true },
        orderBy: { _count: { path: "desc" } },
        take: 10,
      }),
      prisma.subPortfolio.findMany({
        select: {
          id: true,
          slug: true,
          label: true,
          visits: { select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.visit.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        include: {
          subPortfolio: {
            select: { slug: true, label: true },
          },
        },
      }),
    ]);

  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div>
        <h1 className="font-bebas text-4xl sm:text-5xl text-[#0F172A] tracking-wide">
          Analytics & Fréquentation
        </h1>
        <p className="text-sm text-[#475569]">
          Suivi de l&apos;impact de vos candidatures et sous-portfolios sans aucun cookie tiers.
        </p>
      </div>

      {/* Bannière de conformité vie privée */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Solution Légère, Éthique & Respectueuse (RGPD)
          </h4>
          <p className="text-xs text-[#0F172A] mt-0.5 leading-relaxed">
            Aucun bandeau de cookies requis. Les visites sont comptabilisées de manière anonymisée. Les adresses IP ne sont jamais conservées en clair, garantissant une conformité totale avec la vie privée de vos visiteurs.
          </p>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between text-xs font-mono text-[#475569] uppercase">
            <span>Total des visites</span>
            <Eye className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="mt-4 font-bebas text-5xl text-[#0F172A]">{totalVisits}</div>
          <span className="text-xs text-[#64748B]">Toutes pages confondues</span>
        </div>

        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between text-xs font-mono text-[#475569] uppercase">
            <span>Pages uniques visitées</span>
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-4 font-bebas text-5xl text-[#0F172A]">{visitsByPath.length}</div>
          <span className="text-xs text-[#64748B]">Points d&apos;entrée distincts</span>
        </div>

        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between text-xs font-mono text-[#475569] uppercase">
            <span>Sous-portfolios actifs</span>
            <Layers className="w-4 h-4 text-[#F97316]" />
          </div>
          <div className="mt-4 font-bebas text-5xl text-[#0F172A]">
            {subPortfoliosWithVisits.length}
          </div>
          <span className="text-xs text-[#64748B]">Liens ciblés en circulation</span>
        </div>
      </div>

      {/* Grille 2 colonnes : Pages les plus vues & Performance des sous-portfolios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pages les plus vues */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-[#0F172A] pb-3 border-b border-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#2563EB]" />
            Pages les plus consultées
          </h2>

          <div className="mt-4 divide-y divide-slate-100">
            {visitsByPath.length === 0 ? (
              <p className="py-6 text-xs text-center text-[#64748B]">Aucune visite enregistrée pour l&apos;instant.</p>
            ) : (
              visitsByPath.map((v) => (
                <div key={v.path} className="py-2.5 flex items-center justify-between">
                  <span className="font-mono text-xs font-medium text-[#0F172A]">{v.path}</span>
                  <span className="font-mono text-xs font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {v._count.path} vue{v._count.path > 1 ? "s" : ""}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Visites par Sous-Portfolio */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-[#0F172A] pb-3 border-b border-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#F97316]" />
            Impact des sous-portfolios ciblés
          </h2>

          <div className="mt-4 divide-y divide-slate-100">
            {subPortfoliosWithVisits.length === 0 ? (
              <p className="py-6 text-xs text-center text-[#64748B]">Aucun sous-portfolio configuré.</p>
            ) : (
              subPortfoliosWithVisits.map((sp) => (
                <div key={sp.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#0F172A]">{sp.label}</span>
                    <span className="block font-mono text-[11px] text-[#F97316]">/{sp.slug}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#F97316] bg-orange-50 px-2.5 py-0.5 rounded-full">
                    {sp.visits.length} vue{sp.visits.length > 1 ? "s" : ""}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Journal des dernières visites */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[#0F172A] pb-3 border-b border-slate-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#475569]" />
          Dernières consultations en temps réel
        </h2>

        <div className="mt-4 overflow-x-auto">
          {recentVisits.length === 0 ? (
            <p className="py-6 text-xs text-center text-[#64748B]">Aucune donnée récente.</p>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-mono text-[#64748B] uppercase">
                  <th className="py-2.5 px-3">Chemin</th>
                  <th className="py-2.5 px-3">Sous-portfolio</th>
                  <th className="py-2.5 px-3">Date & Heure</th>
                  <th className="py-2.5 px-3">Navigateur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {recentVisits.map((rv) => (
                  <tr key={rv.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-[#0F172A]">{rv.path}</td>
                    <td className="py-2.5 px-3 text-[#F97316]">
                      {rv.subPortfolio ? `/${rv.subPortfolio.slug}` : "—"}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {new Date(rv.createdAt).toLocaleString("fr-FR")}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate">
                      {rv.userAgent ? rv.userAgent.split(" ")[0] : "Inconnu"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
