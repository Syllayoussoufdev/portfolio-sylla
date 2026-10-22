"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  MapPin,
  CheckCircle2,
  FileText,
  Mail,
  Code2,
  Terminal,
  Sparkles,
} from "lucide-react";
import { TechWireframe3D } from "@/components/3d/TechWireframe3D";
import { MagneticButton } from "@/components/motion/MagneticButton";
import type { HeroData } from "@/lib/validations/profile";
import type { MediaData, SiteSettingsData } from "@/lib/profiles";

interface HeroDeveloppeurProps {
  hero?: HeroData;
  heroMedia?: MediaData | null;
  projectsCount?: number;
  settings?: SiteSettingsData | null;
}

const TECH_MARQUEE = [
  { name: "Laravel", category: "Backend & API" },
  { name: "React", category: "Frontend UI" },
  { name: "Next.js", category: "Framework Fullstack" },
  { name: "TypeScript", category: "Typage Strict" },
  { name: "PostgreSQL", category: "Base de Données" },
  { name: "Tailwind CSS", category: "Design System" },
  { name: "Docker", category: "Conteneurisation" },
  { name: "Python", category: "Backend & IA" },
  { name: "Prisma ORM", category: "Modélisation DB" },
  { name: "WordPress", category: "CMS Moderne" },
  { name: "GSAP", category: "Mouvement & Rendu" },
  { name: "VS Code", category: "Environnement de Dev" },
];

const DEFAULT_STACK = [
  "Laravel",
  "React",
  "Next.js",
  "TypeScript",
  "PostgreSQL",
  "Tailwind CSS",
  "Docker",
  "Python",
];

export function HeroDeveloppeur({
  hero,
  heroMedia,
  settings,
}: HeroDeveloppeurProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  const headline =
    hero?.headline ||
    "Je conçois et déploie des applications web robustes qui font tourner votre business";
  const subline =
    hero?.subline ||
    "Du backend solide aux interfaces qui convertissent — architectures fiables, code maintenable et performance mesurable.";

  const primaryCta = hero?.ctaPrimary || {
    label: "Discuter de votre projet",
    href: "#contact",
  };
  const secondaryCta = hero?.ctaSecondary || {
    label: "Voir mes projets",
    href: "#projets",
  };

  const displayName = settings?.nom || "Sylla Youssouf";
  const displayMetier = settings?.metier || "Développeur Web & Mobile";
  const imageSrc = heroMedia?.url || "/sylla.jpg";
  const imageAlt = heroMedia?.alt || `Portrait de ${displayName}`;

  // Découpage du titre mot à mot pour l'animation SplitText avec masque
  const words = headline.split(" ");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Révélation du titre mot à mot avec masque qui monte (Contrat de mouvement point 1)
      if (titleRef.current) {
        const wordSpans = titleRef.current.querySelectorAll(".word-reveal");
        gsap.fromTo(
          wordSpans,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.04,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 2. Parallaxe et rotation lente du polyèdre avec le défilement (Point 2)
      if (visualRef.current) {
        gsap.to(visualRef.current, {
          y: -40,
          rotate: 4,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [headline]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex flex-col justify-start sm:justify-center pt-20 pb-6 sm:pt-28 sm:pb-12 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden bg-[#F6F7FB] text-[#0B1B3A]"
    >
      {/* Halos d'ambiance sobres bleu nuit */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] rounded-full bg-slate-200/50 blur-[100px] pointer-events-none -z-10" />

      {/* Grille principale 2 colonnes asymétrique */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16">
        {/* Colonne Gauche : Discours, Stack & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Tagline / Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 text-xs font-semibold text-[#0B1B3A] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2F5BFF] animate-pulse" />
            <span>Applications Web Robustes · Performance &amp; Conversion</span>
          </div>

          {/* Titre Principal avec effet masque montant par mot */}
          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-[#0B1B3A] leading-[1.15]"
          >
            {words.map((w, idx) => (
              <span key={idx} className="inline-block overflow-hidden mr-[0.25em] align-top pb-1">
                <span className="word-reveal inline-block will-change-transform">
                  {w}
                </span>
              </span>
            ))}
          </h1>

          {/* Sous-titre & démarche */}
          <div className="space-y-3">
            <p className="text-base sm:text-lg font-semibold text-[#0B1B3A] leading-relaxed">
              {subline}
            </p>
            <p className="text-sm text-[#475569] leading-relaxed max-w-2xl">
              De l&apos;architecture back-end aux interfaces réactives, je développe des solutions logicielles stables et véloces, pensées pour soutenir l&apos;activité de votre entreprise et offrir un parcours fluide à vos utilisateurs.
            </p>
          </div>

          {/* Badges de Technologies Réelles */}
          <div className="flex flex-wrap gap-2 pt-1">
            {DEFAULT_STACK.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-white border border-slate-200 text-[#334155] shadow-2xs"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Boutons d'Action avec attraction magnétique légère (max 8px) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <MagneticButton maxDistance={8}>
              <Link
                href={primaryCta.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B1B3A] hover:bg-slate-800 text-white text-xs font-semibold shadow-md shadow-slate-900/10 transition-all active:scale-[0.98]"
              >
                <span>{primaryCta.label}</span>
                <ArrowRight className="w-4 h-4 text-[#2F5BFF]" />
              </Link>
            </MagneticButton>

            <MagneticButton maxDistance={8}>
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-[#0B1B3A] text-xs font-semibold border border-slate-200 shadow-2xs transition-all active:scale-[0.98]"
              >
                <Code2 className="w-4 h-4 text-[#2F5BFF]" />
                <span>{secondaryCta.label}</span>
              </Link>
            </MagneticButton>

            <MagneticButton maxDistance={8}>
              <a
                href="#a-propos"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-[#475569] text-xs font-semibold border border-slate-200 shadow-2xs transition-all"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Démarche &amp; Méthode</span>
              </a>
            </MagneticButton>
          </div>

          {/* Réassurance sobre */}
          <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-[#64748B] font-mono">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#2F5BFF]" />
              <span>Abidjan, Côte d&apos;Ivoire</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Architecture modulaire &amp; Typage strict</span>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Visuel Portrait avec Polyèdre 3D réactif */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div ref={visualRef} className="relative w-[340px] sm:w-[400px] aspect-square flex items-center justify-center">
            {/* Polyèdre 3D filaire réactif à la souris et au scroll */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none scale-110">
              <TechWireframe3D />
            </div>

            {/* Cadre du Portrait au liseré fin */}
            <div className="relative z-10 w-[280px] sm:w-[320px] aspect-square rounded-3xl overflow-hidden bg-slate-900 border-2 border-white shadow-xl shadow-slate-900/10 group">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 280px, 320px"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-104"
              />

              {/* Gradient subtil bas */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />

              {/* Badge Identité */}
              <div className="absolute bottom-3 inset-x-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between gap-2">
                <div className="truncate">
                  <span className="block text-xs font-bold text-[#0B1B3A] truncate">
                    {displayName}
                  </span>
                  <span className="block text-[10px] font-mono text-[#64748B] truncate">
                    {displayMetier}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#2F5BFF] flex items-center justify-center shrink-0">
                  <Code2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ruban Défilant Marquee des Technologies Réelles */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
            <Terminal className="w-3.5 h-3.5 text-[#2F5BFF]" />
            <span>ENVIRONNEMENT DE DÉVELOPPEMENT &amp; OUTILS DE PRODUCTION</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#475569]">
            <Sparkles className="w-3.5 h-3.5 text-[#F5B83D]" />
            <span>Pratique continue &amp; Projets concrets</span>
          </div>
        </div>

        {/* Marquee en boucle continue */}
        <div className="relative overflow-hidden w-full py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex items-center gap-3 animate-marquee whitespace-nowrap">
            {[...TECH_MARQUEE, ...TECH_MARQUEE].map((tech, idx) => (
              <div
                key={`${tech.name}-${idx}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-[#0B1B3A] hover:border-[#2F5BFF]/50 transition-colors cursor-default shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F5BFF]" />
                <span className="font-bold">{tech.name}</span>
                <span className="text-[10px] text-[#64748B] font-mono">({tech.category})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
