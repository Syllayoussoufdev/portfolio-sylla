import React from "react";
import Link from "next/link";
import { GithubIcon, FigmaIcon } from "./icons";
import { Mail, MessageCircle, ArrowUp } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Identité */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-bebas text-xl text-[#0B132B] tracking-wide">
              SYLLA YOUSSOUF
            </span>
          </Link>
          <p className="text-xs text-[#64748B] mt-1 font-mono">
            Développeur Web &amp; Mobile · Tous droits réservés &copy; {currentYear}
          </p>
        </div>

        {/* Liens de navigation rapides */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-[#475569]">
          <Link href="/#hero" className="hover:text-[#2563EB] transition-colors">
            Accueil
          </Link>
          <Link href="/#projets" className="hover:text-[#2563EB] transition-colors">
            Projets
          </Link>
          <Link href="/#competences" className="hover:text-[#2563EB] transition-colors">
            Compétences
          </Link>
          <Link href="/#a-propos" className="hover:text-[#2563EB] transition-colors">
            À propos
          </Link>
          <Link href="/#contact" className="hover:text-[#2563EB] transition-colors">
            Contact
          </Link>
          <Link href="/admin" className="text-slate-400 hover:text-slate-600 transition-colors font-mono">
            Admin
          </Link>
        </div>

        {/* Réseaux sociaux & Remonter en haut */}
        <div className="flex items-center gap-3">
          <a
            href="mailto:contact@syllayoussouf.com"
            title="Email"
            className="p-2 rounded-xl text-slate-500 hover:text-[#2563EB] hover:bg-slate-50 transition-colors border border-slate-200/60"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="p-2 rounded-xl text-slate-500 hover:text-[#0B132B] hover:bg-slate-50 transition-colors border border-slate-200/60"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://figma.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Figma"
            className="p-2 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-slate-50 transition-colors border border-slate-200/60"
          >
            <FigmaIcon className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/33600000000"
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
            className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-slate-50 transition-colors border border-slate-200/60"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          <Link
            href="#hero"
            title="Remonter en haut"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors ml-2"
          >
            <ArrowUp className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
