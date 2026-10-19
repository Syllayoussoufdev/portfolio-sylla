import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  FolderKanban,
  Layers,
  BarChart3,
  MessageSquare,
  Plus,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default async function AdminDashboardOverviewPage() {
  let totalProjects = 0;
  let totalVisibleProjects = 0;
  let totalSubPortfolios = 0;
  let totalVisits = 0;
  let unreadMessages = 0;
  let recentProjects: Array<{
    id: string;
    titre: string;
    slug: string;
    visible: boolean;
  }> = [];
  let subPortfoliosList: Array<{
    id: string;
    label: string;
    slug: string;
    createdAt: Date;
  }> = [];
  let dbError = false;

  try {
    const [
      tp,
      tvp,
      tsp,
      tv,
      um,
      rp,
      spl,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { visible: true } }),
      prisma.subPortfolio.count({ where: { actif: true } }),
      prisma.visit.count(),
      prisma.contactMessage.count({ where: { lu: false } }),
      prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, titre: true, slug: true, visible: true },
      }),
      prisma.subPortfolio.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        select: { id: true, label: true, slug: true, createdAt: true },
      }),
    ]);
    totalProjects = tp;
    totalVisibleProjects = tvp;
    totalSubPortfolios = tsp;
    totalVisits = tv;
    unreadMessages = um;
    recentProjects = rp;
    subPortfoliosList = spl;
  } catch (err) {
    console.warn("Tableau de bord admin : connexion base de données interrompue (repli actif)", err);
    dbError = true;
  }

  return (
    <div className="space-y-8 select-none">
      {/* Alerte si la base de données est inaccessible */}
      {dbError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-xs flex items-start gap-3.5 text-amber-900">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-amber-900">
              Connexion à la base de données Neon interrompue (Erreur P1000 / 28P01)
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              Le mot de passe de l&apos;utilisateur <code>neondb_owner</code> configuré dans <code>.env</code> a été modifié ou réinitialisé dans la console Neon.
              Pour synchroniser les métriques et éditer vos données, mettez à jour votre variable <code>DATABASE_URL</code> avec le nouveau mot de passe fourni par Neon.
            </p>
          </div>
        </div>
      )}

      {/* En-tête de bienvenue */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-[#0F172A]">
            Tableau de Bord
          </h1>
          <p className="text-sm text-[#475569]">
            Bienvenue Sylla. Voici l&apos;état actuel de votre portfolio et de vos sous-liens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projets/nouveau"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau projet</span>
          </Link>
          <Link
            href="/admin/portfolios/nouveau"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau sous-portfolio</span>
          </Link>
        </div>
      </div>

      {/* Cartes KPI métriques réelles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Projets */}
        <div className="glass p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-[#475569] uppercase tracking-wider">
              Projets publiés
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-bebas text-4xl text-[#0F172A]">{totalVisibleProjects}</span>
            <span className="text-xs text-[#64748B]">/ {totalProjects} au total</span>
          </div>
          <Link
            href="/admin/projets"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:underline"
          >
            Gérer les projets <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Sous-portfolios */}
        <div className="glass p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-[#475569] uppercase tracking-wider">
              Sous-portfolios
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-bebas text-4xl text-[#0F172A]">{totalSubPortfolios}</span>
            <span className="text-xs text-[#64748B]">actifs (/profil)</span>
          </div>
          <Link
            href="/admin/portfolios"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#F97316] hover:underline"
          >
            Gérer les liens <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Visites */}
        <div className="glass p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-[#475569] uppercase tracking-wider">
              Visites enregistrées
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-bebas text-4xl text-[#0F172A]">{totalVisits}</span>
            <span className="text-xs text-emerald-700 font-medium">sans cookies</span>
          </div>
          <Link
            href="/admin/analytics"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline"
          >
            Voir les stats <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Messages */}
        <div className="glass p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-[#475569] uppercase tracking-wider">
              Messages contact
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-bebas text-4xl text-[#0F172A]">{unreadMessages}</span>
            <span className="text-xs text-purple-700 font-medium">non lus</span>
          </div>
          <Link
            href="/admin/messages"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-purple-700 hover:underline"
          >
            Lire les messages <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Grille 2 colonnes : Derniers projets & Sous-portfolios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Derniers projets */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">Projets récents</h2>
              <p className="text-xs text-[#64748B]">Dernières réalisations enregistrées en base</p>
            </div>
            <Link
              href="/admin/projets"
              className="text-xs font-medium text-[#2563EB] hover:underline"
            >
              Tous voir ({totalProjects})
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {recentProjects.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-[#64748B]">Aucun projet enregistré pour le moment.</p>
                <Link
                  href="/admin/projets/nouveau"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#2563EB] font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Créer mon premier projet
                </Link>
              </div>
            ) : (
              recentProjects.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-medium text-[#0F172A] truncate">{p.titre}</p>
                    <p className="text-xs font-mono text-[#64748B] truncate">/{p.slug}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {p.visible ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Visible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Masqué
                      </span>
                    )}
                    <Link
                      href={`/admin/projets/${p.id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sous-portfolios configurés */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">Sous-portfolios actifs</h2>
              <p className="text-xs text-[#64748B]">Liens sur-mesure à envoyer aux recruteurs</p>
            </div>
            <Link
              href="/admin/portfolios"
              className="text-xs font-medium text-[#F97316] hover:underline"
            >
              Tous voir ({totalSubPortfolios})
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {subPortfoliosList.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-[#64748B]">
                  Aucun sous-portfolio configuré pour l&apos;instant.
                </p>
                <Link
                  href="/admin/portfolios/nouveau"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#F97316] font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Créer un profil filtré (ex: /design)
                </Link>
              </div>
            ) : (
              subPortfoliosList.map((sp) => (
                <div key={sp.id} className="py-3 flex items-center justify-between">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-medium text-[#0F172A] truncate">{sp.label}</p>
                    <p className="text-xs font-mono text-[#F97316] truncate">/{sp.slug}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(sp.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                    <Link
                      href={`/${sp.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
                      title="Ouvrir le lien"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
