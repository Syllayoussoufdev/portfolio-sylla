import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logoutAction } from "../actions/auth";
import {
  LayoutDashboard,
  FolderKanban,
  Image as ImageIcon,
  Layers,
  BarChart3,
  MessageSquare,
  ExternalLink,
  LogOut,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col md:flex-row text-[#0F172A]">
      {/* Sidebar latérale */}
      <aside className="w-full md:w-64 bg-white/80 backdrop-blur-md border-r border-slate-200/80 flex flex-col justify-between shrink-0 p-5 md:min-h-screen">
        <div>
          {/* Logo & Titre */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bebas text-2xl">
              S
            </div>
            <div>
              <div className="font-bebas text-2xl tracking-wide text-[#0F172A] leading-none">
                SYLLA BACKOFFICE
              </div>
              <span className="text-[11px] font-mono text-[#F97316] font-semibold flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3" /> Creative Engineer
              </span>
            </div>
          </div>

          {/* Navigation principale */}
          <nav className="mt-6 space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#0F172A] hover:bg-slate-100/80 hover:text-[#2563EB] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-[#2563EB]" />
              <span>Vue d&apos;ensemble</span>
            </Link>

            <Link
              href="/admin/projets"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#475569] hover:bg-slate-100/80 hover:text-[#2563EB] transition-colors"
            >
              <FolderKanban className="w-4 h-4" />
              <span>Projets</span>
            </Link>

            <Link
              href="/admin/medias"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#475569] hover:bg-slate-100/80 hover:text-[#2563EB] transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Médiathèque</span>
            </Link>

            <Link
              href="/admin/portfolios"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#475569] hover:bg-slate-100/80 hover:text-[#2563EB] transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span>Sous-portfolios</span>
            </Link>

            <Link
              href="/admin/analytics"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#475569] hover:bg-slate-100/80 hover:text-[#2563EB] transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </Link>

            <Link
              href="/admin/messages"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#475569] hover:bg-slate-100/80 hover:text-[#2563EB] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messages contact</span>
            </Link>
          </nav>
        </div>

        {/* Pied de sidebar */}
        <div className="pt-6 border-t border-slate-100 space-y-2 mt-6 md:mt-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-[#475569] hover:bg-slate-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Voir le site public
            </span>
            <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
              V0
            </span>
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header supérieur */}
        <header className="h-16 bg-white/70 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Neon PostgreSQL connecté
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-[#0F172A]">{session.email}</div>
              <div className="text-[10px] font-mono text-[#475569]">Administrateur</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#F97316] text-white flex items-center justify-center font-bebas text-lg shadow-sm">
              SY
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
