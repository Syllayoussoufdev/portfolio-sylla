"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

export interface NavbarSettings {
  nom?: string | null;
  metier?: string | null;
  emailPublic?: string | null;
  whatsapp?: string | null;
}

interface NavbarProps {
  settings?: NavbarSettings;
}

export function Navbar({ settings }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const displayName = settings?.nom || "Sylla Youssouf";
  const displayMetier = settings?.metier ?? "Développeur Web & Mobile";

  // Gestion du défilement : compactage après 80px, masquage à la descente, réapparition à la montée
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Compactage
      setIsScrolled(currentScrollY > 80);

      // Masquage / affichage selon direction
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current + 5) {
          // Défilement vers le bas : masquer
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY.current - 5) {
          // Défilement vers le haut : réafficher
          setIsVisible(true);
        }
      } else {
        // En haut de page : toujours visible
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu mobile lors d'un appui sur Échap et verrouiller le scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/#hero", label: "Accueil" },
    { href: "/#projets", label: "Projets" },
    { href: "/#competences", label: "Compétences" },
    { href: "/#a-propos", label: "À propos" },
    { href: "/#contact", label: "Contact" },
  ];

  // Initiales pour le monogramme
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "SY";

  return (
    <header
      className={`fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"
      }`}
    >
      <nav
        aria-label="Navigation principale"
        className={`pointer-events-auto px-6 transition-all duration-300 flex items-center justify-between gap-6 sm:gap-10 max-w-6xl w-full rounded-2xl ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-md shadow-slate-900/5 py-2.5"
            : "bg-white/50 backdrop-blur-md border border-slate-200/50 shadow-xs py-4"
        }`}
      >
        {/* Logo & Identité issue de SiteSettings */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-[var(--ink)] text-white flex items-center justify-center font-bebas text-lg shadow-xs transition-transform group-hover:scale-105">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="font-bebas text-xl text-[var(--ink)] tracking-wide leading-none">
              {displayName.toUpperCase()}
            </span>
            {displayMetier && (
              <span className="text-[10px] font-mono text-[var(--muted)] leading-tight mt-0.5">
                {displayMetier}
              </span>
            )}
          </div>
        </Link>

        {/* Liens de navigation Desktop avec marges généreuses (>= 32px) */}
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-[var(--muted)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[var(--accent)] transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA & Burger Mobile */}
        <div className="flex items-center gap-3">
          <Link
            href="/#contact"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--ink)] hover:opacity-90 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
          >
            <span>Me contacter</span>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)]" />
          </Link>

          {/* Bouton Menu Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[var(--ink)] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Menu Mobile Plein Écran Accessible */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation mobile"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md pointer-events-auto md:hidden flex flex-col justify-end"
        >
          <div className="bg-white rounded-t-3xl p-6 shadow-2xl border-t border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span className="font-bebas text-lg text-[var(--ink)]">Menu Navigation</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-4 text-base font-medium text-[var(--ink)]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-xl hover:bg-slate-50 hover:text-[var(--accent)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 mt-2 border-t border-slate-100">
                <Link
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[var(--ink)] text-white text-sm font-semibold shadow-md active:scale-[0.98] transition-all"
                >
                  <span>Me contacter</span>
                  <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
