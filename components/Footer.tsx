import React from "react";
import Link from "next/link";
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from "./icons";
import { Mail, MessageCircle, ArrowUp } from "lucide-react";

export interface FooterSettings {
  nom?: string | null;
  metier?: string | null;
  emailPublic?: string | null;
  whatsapp?: string | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  instagram?: string | null;
}

interface FooterProps {
  settings?: FooterSettings;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const displayName = settings?.nom || "Sylla Youssouf";
  const displayMetier = settings?.metier ?? "Développeur Web & Mobile";

  // Formater le lien WhatsApp sans caractères non numériques
  const cleanWhatsapp = settings?.whatsapp?.replace(/\D/g, "");

  const hasSocials = Boolean(
    settings?.emailPublic ||
      settings?.whatsapp ||
      settings?.github ||
      settings?.linkedin ||
      settings?.twitter ||
      settings?.instagram
  );

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Identité issue de SiteSettings */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-bebas text-xl text-[var(--ink)] tracking-wide">
              {displayName.toUpperCase()}
            </span>
          </Link>
          <p className="text-xs text-[var(--subtle)] mt-1 font-mono">
            {displayMetier ? `${displayMetier} · ` : ""}Tous droits réservés &copy; {currentYear}
          </p>
        </div>

        {/* Liens de navigation rapides */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-[var(--muted)]">
          <Link href="/#hero" className="hover:text-[var(--accent)] transition-colors">
            Accueil
          </Link>
          <Link href="/#a-propos" className="hover:text-[var(--accent)] transition-colors">
            À propos
          </Link>
          <Link href="/#projets" className="hover:text-[var(--accent)] transition-colors">
            Projets
          </Link>
          <Link href="/#competences" className="hover:text-[var(--accent)] transition-colors">
            Compétences
          </Link>
          <Link href="/#contact" className="hover:text-[var(--accent)] transition-colors">
            Contact
          </Link>
          <Link
            href="/admin"
            className="text-[var(--subtle)] hover:text-[var(--ink)] transition-colors font-mono"
          >
            Admin
          </Link>
        </div>

        {/* Réseaux sociaux réels & Remonter en haut */}
        <div className="flex items-center gap-2.5">
          {settings?.emailPublic && (
            <a
              href={`mailto:${settings.emailPublic}`}
              title={`Écrire à ${settings.emailPublic}`}
              className="p-2 rounded-xl text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--glass)] transition-colors border border-[var(--border)]"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}

          {cleanWhatsapp && (
            <a
              href={`https://wa.me/${cleanWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Discuter sur WhatsApp"
              className="p-2 rounded-xl text-[var(--muted)] hover:text-emerald-500 hover:bg-[var(--glass)] transition-colors border border-[var(--border)]"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}

          {settings?.github && (
            <a
              href={settings.github}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="p-2 rounded-xl text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--glass)] transition-colors border border-[var(--border)]"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}

          {settings?.linkedin && (
            <a
              href={settings.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors border border-slate-200/60"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}

          {settings?.twitter && (
            <a
              href={settings.twitter}
              target="_blank"
              rel="noopener noreferrer"
              title="X / Twitter"
              className="p-2 rounded-xl text-slate-500 hover:text-[var(--ink)] hover:bg-slate-50 transition-colors border border-slate-200/60"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
          )}

          {settings?.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="p-2 rounded-xl text-slate-500 hover:text-pink-600 hover:bg-slate-50 transition-colors border border-slate-200/60"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          )}

          <Link
            href="#hero"
            title="Remonter en haut de page"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors ml-1"
          >
            <ArrowUp className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
