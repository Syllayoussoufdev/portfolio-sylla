import Link from "next/link";
import { ArrowLeft, Home, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B132B] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-32">
        <div className="editorial-card max-w-lg w-full p-8 sm:p-12 text-center rounded-3xl shadow-xl shadow-slate-900/5 bg-white border border-slate-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-semibold mb-4 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Erreur 404</span>
          </div>

          <h1 className="font-bebas text-6xl sm:text-7xl text-[#0B132B] tracking-wider leading-none mb-3">
            PAGE INTROUVABLE
          </h1>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed mb-8">
            La page ou la réalisation que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0B132B] hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>Retour à l&apos;accueil</span>
            </Link>

            <Link
              href="/#projets"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#0B132B] text-xs font-semibold border border-slate-200 transition-all shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voir les réalisations</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
