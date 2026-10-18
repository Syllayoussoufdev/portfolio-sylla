"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu mobile lors d'un appui sur Echap
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

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300">
      <nav
        className={`pointer-events-auto px-5 transition-all duration-300 flex items-center justify-between gap-6 sm:gap-10 max-w-5xl w-full rounded-2xl ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-md shadow-slate-900/5 py-2.5"
            : "bg-white/80 backdrop-blur-md border border-slate-200/70 shadow-xs py-3"
        }`}
      >
        {/* Logo Sylla */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-bebas text-xl shadow-xs transition-transform group-hover:scale-105">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-bebas text-xl text-[#0B132B] tracking-wide leading-none">
              SYLLA YOUSSOUF
            </span>
            <span className="text-[10px] font-mono text-[#475569] leading-tight">
              Développeur Web &amp; Mobile
            </span>
          </div>
        </Link>

        {/* Liens de navigation Desktop */}
        <div className="hidden md:flex items-center gap-7 text-xs font-medium text-[#475569]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#2563EB] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA & Burger Mobile */}
        <div className="flex items-center gap-3">
          <Link
            href="/#contact"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
          >
            <span>Me contacter</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
          </Link>

          {/* Bouton Menu Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#0B132B] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Tiroir Mobile Accessible */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm pointer-events-auto md:hidden flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-6 shadow-2xl border-t border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span className="font-bebas text-lg text-[#0B132B]">Navigation</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-base font-medium text-[#0B132B]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 py-3 rounded-full bg-[#0B132B] text-white text-sm font-semibold shadow-sm"
              >
                <span>Me contacter</span>
                <ArrowRight className="w-4 h-4 text-blue-400" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
