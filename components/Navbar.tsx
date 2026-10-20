"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X, FileText, Sparkles } from "lucide-react";
import { useMotion } from "@/components/motion/MotionProvider";
import type { SectionItem } from "@/lib/validations/profile";

export interface NavbarSettings {
  nom?: string | null;
  metier?: string | null;
  emailPublic?: string | null;
  whatsapp?: string | null;
  cvUrl?: string | null;
}

interface NavbarProps {
  settings?: NavbarSettings | null;
  sections?: SectionItem[];
  template?: string;
  slug?: string;
}

const SECTION_CONFIG: Record<string, { label: string; id: string }> = {
  hero: { label: "Accueil", id: "hero" },
  apropos: { label: "À propos", id: "a-propos" },
  projets: { label: "Projets", id: "projets" },
  competences: { label: "Compétences", id: "competences" },
  parcours: { label: "Parcours", id: "parcours" },
};

export function Navbar({ settings, sections, slug }: NavbarProps) {
  const pathname = usePathname() || "";
  const { lenis } = useMotion();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const lastScrollY = useRef(0);

  const displayName = settings?.nom || "Sylla Youssouf";
  const displayMetier = settings?.metier ?? "Développeur Web & Mobile";

  // Déterminer le préfixe selon qu'on est sur l'accueil ou un sous-portfolio (ex: /dev, /design, /video)
  const isSubPortfolio =
    pathname !== "/" &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/projets/");

  const basePath = isSubPortfolio ? pathname : "";

  // Liens de navigation dynamiques selon les sections réellement actives (sans doubler "Contact")
  const navLinks = useMemo(() => {
    if (sections && sections.length > 0) {
      return sections
        .filter((s) => s.visible && s.key !== "contact" && SECTION_CONFIG[s.key])
        .sort((a, b) => a.order - b.order)
        .map((s) => {
          const cfg = SECTION_CONFIG[s.key];
          return {
            id: cfg.id,
            href: `${basePath}#${cfg.id}`,
            label: cfg.label,
          };
        });
    }

    // Repli par défaut propre
    return [
      { id: "hero", href: `${basePath}#hero`, label: "Accueil" },
      { id: "a-propos", href: `${basePath}#a-propos`, label: "À propos" },
      { id: "projets", href: `${basePath}#projets`, label: "Projets" },
      { id: "competences", href: `${basePath}#competences`, label: "Compétences" },
      { id: "parcours", href: `${basePath}#parcours`, label: "Parcours" },
    ];
  }, [sections, basePath]);

  // Call To Action bien ciblé à droite
  const ctaConfig = useMemo(() => {
    if (settings?.cvUrl) {
      return {
        label: "Mon CV (PDF)",
        href: settings.cvUrl,
        isExternal: true,
        icon: FileText,
      };
    }

    if (slug === "video") {
      return {
        label: "Proposer un projet",
        href: `${basePath}#contact`,
        isExternal: false,
        icon: Sparkles,
      };
    }

    return {
      label: "Discuter d'un projet",
      href: `${basePath}#contact`,
      isExternal: false,
      icon: ArrowRight,
    };
  }, [settings?.cvUrl, slug, basePath]);

  // Gestion du défilement & ScrollSpy robuste jusqu'au Contact et Footer
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Compactage
      setIsScrolled(currentScrollY > 80);

      // Masquage / affichage selon direction
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY.current + 5) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY.current - 5) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;

      // Détection fiable de la section active
      const sectionIds = ["hero", "a-propos", "projets", "competences", "parcours", "contact"];
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      if (pageHeight - scrollPosition < 150) {
        setActiveSection("contact");
        return;
      }

      const triggerY = window.scrollY + 200;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= triggerY) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Clic sur un lien de navigation : défilement fluide sans rechargement
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    const el = document.getElementById(targetId);
    if (el) {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(el, { offset: -70, duration: 1.1 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
      window.history.pushState(null, "", `${basePath}#${targetId}`);
      setActiveSection(targetId);
      setMobileMenuOpen(false);
    }
  };

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

  // Initiales pour le monogramme
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "SY";

  const CtaIcon = ctaConfig.icon;

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
            ? "bg-[var(--glass)] backdrop-blur-xl border border-[var(--border)] shadow-lg shadow-black/5 py-2.5"
            : "bg-[var(--glass)] backdrop-blur-md border border-[var(--glass-border)] shadow-xs py-4"
        }`}
      >
        {/* Logo & Identité issue de SiteSettings */}
        <Link
          href={basePath || "/"}
          onClick={(e) => handleNavClick(e, "hero")}
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-xl bg-[var(--ink)] text-[var(--bg)] flex items-center justify-center font-bebas text-lg shadow-xs transition-transform group-hover:scale-105">
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

        {/* Liens de navigation Desktop avec ScrollSpy et gestion du clic fluide */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-medium text-[var(--muted)]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`transition-all py-1 relative ${
                  isActive
                    ? "text-[var(--ink)] font-semibold"
                    : "hover:text-[var(--accent)]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--accent)] rounded-full animate-in fade-in duration-200" />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA & Burger Mobile */}
        <div className="flex items-center gap-3">
          {ctaConfig.isExternal ? (
            <a
              href={ctaConfig.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--ink)] hover:opacity-90 text-[var(--bg)] text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
            >
              <span>{ctaConfig.label}</span>
              <CtaIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
            </a>
          ) : (
            <Link
              href={ctaConfig.href}
              onClick={(e) => handleNavClick(e, "contact")}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--ink)] hover:opacity-90 text-[var(--bg)] text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
            >
              <span>{ctaConfig.label}</span>
              <CtaIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
            </Link>
          )}

          {/* Bouton Menu Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[var(--ink)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
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

            <nav className="flex flex-col gap-2 text-base font-medium text-[var(--ink)]">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={`py-2 px-3 rounded-xl transition-colors flex items-center justify-between ${
                      isActive
                        ? "bg-blue-50 text-[var(--accent)] font-semibold"
                        : "hover:bg-slate-50 hover:text-[var(--accent)]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                    )}
                  </Link>
                );
              })}

              <div className="pt-4 mt-2 border-t border-slate-100">
                {ctaConfig.isExternal ? (
                  <a
                    href={ctaConfig.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[var(--ink)] text-white text-sm font-semibold shadow-md active:scale-[0.98] transition-all"
                  >
                    <span>{ctaConfig.label}</span>
                    <CtaIcon className="w-4 h-4 text-[var(--accent)]" />
                  </a>
                ) : (
                  <Link
                    href={ctaConfig.href}
                    onClick={(e) => handleNavClick(e, "contact")}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[var(--ink)] text-white text-sm font-semibold shadow-md active:scale-[0.98] transition-all"
                  >
                    <span>{ctaConfig.label}</span>
                    <CtaIcon className="w-4 h-4 text-[var(--accent)]" />
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
