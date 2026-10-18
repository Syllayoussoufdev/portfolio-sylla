"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, Sparkles, FolderGit2, Mail } from "lucide-react";
import { HeroCanvas3D } from "./HeroCanvas3D";
import { GithubIcon } from "./icons";
import type { HeroData } from "@/lib/validations/profile";
import type { MediaData, SiteSettingsData } from "@/lib/profiles";

interface HeroProps {
  hero?: HeroData;
  heroMedia?: MediaData | null;
  projectsCount?: number;
  settings?: SiteSettingsData | null;
  template?: string;
}

export function Hero({
  hero,
  heroMedia,
  projectsCount,
  settings,
  template = "developpeur",
}: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  // Fallbacks si non renseigné
  const headline =
    hero?.headline ||
    "Je conçois des expériences web et mobiles utiles, performantes et soignées.";
  const subline =
    hero?.subline || "Développeur Web & Mobile · Laravel · React · Next.js";
  const tagline = hero?.tagline;
  const primaryCta = hero?.ctaPrimary || {
    label: "Voir mes réalisations",
    href: "#projets",
  };
  const secondaryCta = hero?.ctaSecondary || {
    label: "Me contacter",
    href: "#contact",
  };

  const displayName = settings?.nom || "Sylla Youssouf";
  const displayMetier = settings?.metier || "Fullstack & Mobile Engineer";

  // Image source : Cloudinary media ou fallback local
  const imageSrc = heroMedia?.url || "/sylla.jpg";
  const imageAlt =
    heroMedia?.alt ||
    hero?.media?.alt ||
    `Portrait professionnel de ${displayName}`;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 },
      });

      tl.from(headlineRef.current, {
        y: 30,
        opacity: 0,
        delay: 0.1,
      })
        .from(
          subtextRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.5"
        )
        .from(
          ctaRef.current,
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.4"
        )
        .from(
          visualRef.current,
          {
            scale: 0.95,
            opacity: 0,
            duration: 0.9,
            ease: "back.out(1.4)",
          },
          "-=0.6"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[85vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
        {/* Colonne Gauche : Discours & Conversion Immédiate */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">
          {/* Badge de statut professionnel (uniquement si tagline ou statut défini) */}
          {tagline ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/80 text-[var(--ink)] text-xs font-medium w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{tagline}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/80 text-[var(--ink)] text-xs font-medium w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Disponible pour opportunités &amp; collaborations</span>
            </div>
          )}

          {/* Titre Principal Éditorial */}
          <h1
            ref={headlineRef}
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--ink)] leading-[1.12] ${
              template === "creatif" ? "font-bebas tracking-wide" : ""
            }`}
          >
            {headline}
          </h1>

          {/* Positionnement et sous-titre */}
          <div ref={subtextRef} className="space-y-3">
            <p className="text-lg sm:text-xl font-medium text-[var(--muted)]">
              {subline}
            </p>

            {/* Badges technologiques sobres */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                "TypeScript",
                "React",
                "Next.js",
                "Laravel",
                "Tailwind CSS",
                "PostgreSQL",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 text-xs font-mono text-[#334155] shadow-2xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Appels à l'action pilotés par les données */}
          <div
            ref={ctaRef}
            className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
          >
            {/* CTA 1 : Primaire */}
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--ink)] hover:opacity-90 active:scale-[0.98] text-white text-sm font-semibold shadow-md shadow-slate-900/10 transition-all group"
            >
              <span>{primaryCta.label}</span>
              <ArrowRight className="w-4 h-4 text-[var(--accent)] group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* CTA 2 : Secondaire */}
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 active:scale-[0.98] text-[var(--ink)] text-sm font-semibold border border-slate-300 shadow-2xs transition-all"
            >
              <Mail className="w-4 h-4 text-[var(--accent)]" />
              <span>{secondaryCta.label}</span>
            </Link>

            {/* CTA 3 : GitHub si présent dans SiteSettings */}
            {settings?.github && (
              <a
                href={settings.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white/60 hover:bg-white text-[var(--muted)] hover:text-[var(--ink)] text-sm font-medium border border-slate-200/80 transition-colors"
                aria-label="Profil GitHub"
              >
                <GithubIcon className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            )}
          </div>

          {/* Preuve sociale / métriques vérifiées sans fausse promesse */}
          {typeof projectsCount === "number" && projectsCount > 0 && (
            <div className="pt-2 flex items-center gap-6 text-xs text-[var(--subtle)] font-mono">
              <span className="flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span className="font-semibold text-[var(--ink)]">
                  {projectsCount}
                </span>{" "}
                réalisation{projectsCount > 1 ? "s" : ""} disponible
                {projectsCount > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Colonne Droite : Composition Visuelle avec Portrait & Dispositif 3D */}
        <div
          ref={visualRef}
          className="lg:col-span-5 relative flex items-center justify-center py-6"
        >
          {/* Dispositif 3D Three.js en arrière-plan */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none scale-125 z-0">
            <HeroCanvas3D />
          </div>

          {/* Cadre du Portrait */}
          <div className="relative z-10 w-72 h-72 sm:w-80 sm:h-80 rounded-3xl overflow-hidden p-2 bg-gradient-to-b from-white/90 to-slate-100/80 border border-slate-200/90 shadow-2xl shadow-slate-900/10">
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0B132B]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 640px) 288px, 320px"
                className="object-cover object-center transform hover:scale-103 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Pastille flottante d'identité */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-md flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--ink)]">
                  {displayName}
                </span>
                <span className="text-[10px] text-[var(--subtle)] font-mono">
                  {displayMetier}
                </span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[var(--accent)] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
