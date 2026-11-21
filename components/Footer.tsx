"use client";

import React from "react";
import Link from "next/link";
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, BehanceIcon } from "./icons";
import { SyllaBrandLogo } from "./icons/SyllaBrandLogo";
import { Mail, MessageCircle, ArrowUp, MapPin } from "lucide-react";

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
  const rawDigits = (settings?.whatsapp || "2250594564993").replace(/\D/g, "");
  const cleanWhatsapp = rawDigits.length === 10 && rawDigits.startsWith("0") ? `225${rawDigits}` : (rawDigits || "2250594564993");

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
        {/* Identité issue de SiteSettings & NAP Google */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="flex items-center gap-2.5 group">
            <SyllaBrandLogo variant="squircle" className="w-6 h-6 rounded-md shadow-xs transition-transform group-hover:scale-105" />
            <span className="font-bebas text-xl text-[var(--ink)] tracking-wide">
              SYLLA YOUSSOUF
            </span>
          </Link>
          <p className="text-xs font-semibold text-[#0F172A] mt-1">
            Communication Digitale &amp; Web
          </p>
          <div className="text-[11px] text-[var(--subtle)] mt-1 font-mono flex flex-wrap items-center justify-center md:justify-start gap-x-2.5 gap-y-1">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#2563EB]" />
              <span>Abidjan, Côte d&apos;Ivoire</span>
            </span>
            <span>•</span>
            <a
              href="tel:+2250594564993"
              className="hover:text-[var(--accent)] transition-colors font-medium text-[#0F172A]"
            >
              +225 05 94 56 49 93
            </a>
            <span>•</span>
            <span>&copy; {currentYear}</span>
          </div>
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
          <Link href="/mentions-legales" className="hover:text-[var(--accent)] transition-colors">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="hover:text-[var(--accent)] transition-colors">
            Confidentialité
          </Link>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.openCookieSettings) {
                window.openCookieSettings();
              }
            }}
            className="hover:text-[var(--accent)] transition-colors cursor-pointer"
          >
            Cookies
          </button>
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

          <a
            href="https://www.behance.net/youssoufsylla"
            target="_blank"
            rel="noopener noreferrer"
            title="Portfolio Behance"
            className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors border border-slate-200/60"
          >
            <BehanceIcon className="w-4 h-4" />
          </a>

          <a
            href="https://maps.google.com/?q=Sylla+Youssouf+Abidjan"
            target="_blank"
            rel="noopener noreferrer"
            title="Fiche Google Business • Abidjan"
            className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-slate-50 transition-colors border border-slate-200/60"
          >
            <MapPin className="w-4 h-4 text-red-500" />
          </a>

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
