"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { Play, ArrowUpRight, Sparkles, Video, Film, CheckCircle2 } from "lucide-react";
import { MotionShowreel3D } from "@/components/3d/MotionShowreel3D";
import type { HeroData } from "@/lib/validations/profile";
import type { MediaData, SiteSettingsData } from "@/lib/profiles";

interface HeroImmersifProps {
  hero?: HeroData;
  heroMedia?: MediaData | null;
  projectsCount?: number;
  settings?: SiteSettingsData | null;
}

const TICKER_ITEMS = [
  "MONTAGE VIDÉO",
  "RYTHME & TEMPO",
  "NARRATION VISUELLE",
  "PASSION CINÉMA",
  "STORYTELLING",
  "FORMATS COURTS",
  "PROJETS DE FILMS",
  "CADRAGE & DÉCOUPE",
];

export function HeroImmersif({
  hero,
  heroMedia,
  projectsCount = 6,
  settings,
}: HeroImmersifProps) {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  const headline = hero?.headline || "Des images qui vibrent,\nun récit qui captive.";
  const subline =
    hero?.subline ||
    "Monteur vidéo débutant et passionné, j'explore le rythme, la narration et le montage dynamique à travers mes premiers projets et créations visuelles.";

  const primaryCta = hero?.ctaPrimary || {
    label: "Voir mes projets vidéo",
    href: "#projets",
  };
  const secondaryCta = hero?.ctaSecondary || {
    label: "Me contacter",
    href: "#contact",
  };

  const displayName = settings?.nom || "Sylla Youssouf";
  const portraitSrc = heroMedia?.url || "/sylla.jpg";

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        profileCardRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7 }
      );

      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.9 },
        "-=0.4"
      );

      tl.fromTo(
        statementRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      );

      // Contrat de mouvement immersif #4 : Titres horizontaux liés à la vitesse de défilement
      if (tickerRef.current) {
        const tickerAnim = gsap.to(tickerRef.current, {
          xPercent: -50,
          repeat: -1,
          duration: 25,
          ease: "none",
        });

        ScrollTrigger.create({
          onUpdate: (self) => {
            const velocity = Math.abs(self.getVelocity());
            const boost = 1 + Math.min(velocity / 200, 3.5);
            gsap.to(tickerAnim, {
              timeScale: boost,
              duration: 0.2,
              overwrite: "auto",
              onComplete: () => {
                gsap.to(tickerAnim, {
                  timeScale: 1,
                  duration: 0.8,
                  ease: "power2.out",
                });
              },
            });
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen bg-[#070708] text-white pt-28 pb-14 overflow-hidden flex flex-col justify-between"
    >
      {/* Grille structurelle subtile */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Lueur rouge vermillon discrète */}
      <div className="absolute top-1/4 right-0 w-[420px] h-[420px] bg-[#FF2A14]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full relative z-10 flex-1 flex flex-col justify-center">
        {/* Carte Profil Personnel avec Photo de Sylla Youssouf */}
        <div
          ref={profileCardRef}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[#FF2A14]/60 bg-zinc-800 shadow-lg shadow-red-950/30 shrink-0">
              <Image
                src={portraitSrc}
                alt={displayName}
                fill
                priority
                sizes="80px"
                className="object-cover object-top"
              />
              <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#070708]" title="Disponible pour projets" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-syne text-lg sm:text-xl font-bold text-white tracking-wide">
                  {displayName}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-[#FF2A14] font-semibold border border-white/10">
                  PORTFOLIO PERSONNEL
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400 mt-0.5 flex items-center gap-2">
                <Video className="w-3.5 h-3.5 text-[#FF2A14]" />
                <span>Monteur Vidéo · Projets de Films &amp; Formats Courts</span>
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-[#FF2A14] animate-pulse" />
            <span>EN PHASE D&apos;APPRENTISSAGE ACTIF &amp; RÉALISATION</span>
          </div>
        </div>

        {/* Section Principale : Titre & Sculpture 3D */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-14">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#FF2A14] text-[11px] font-mono font-medium">
              <Film className="w-3.5 h-3.5" />
              <span>MON 3ÈME UNIVERS · CRÉATION VIDÉO</span>
            </div>

            <h1
              ref={headlineRef}
              className="font-syne text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.04] uppercase"
            >
              Des images qui vibrent,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#FF2A14]">
                un récit qui captive.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed font-light">
              {subline}
            </p>

            {/* Boutons d'action clairs en français */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#FF2A14] hover:bg-[#E0240F] active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-950/50 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{primaryCta.label}</span>
              </Link>

              <Link
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 active:scale-95 text-zinc-300 hover:text-white border border-white/15 text-xs font-mono transition-all cursor-pointer"
              >
                <span>{secondaryCta.label}</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF2A14]" />
              </Link>
            </div>
          </div>

          {/* Effet 3D conservé avec la sculpture géométrique sombre */}
          <div className="lg:col-span-5 relative aspect-square max-w-md mx-auto w-full flex items-center justify-center">
            <div className="absolute inset-0 -z-10 bg-radial from-[#FF2A14]/15 via-transparent to-transparent rounded-full blur-2xl" />
            <MotionShowreel3D />
          </div>
        </div>

        {/* Démarche & Authenticité */}
        <div
          ref={statementRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-white/10 items-baseline"
        >
          <div className="md:col-span-8">
            <h3 className="font-syne text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
              Donner du rythme, soigner les transitions et apprendre chaque jour pour sublimer les histoires.
            </h3>
          </div>
          <div className="md:col-span-4 space-y-2 font-mono text-xs text-zinc-400">
            <p className="leading-relaxed">
              Ce portfolio regroupe mes premières créations, mes exercices de montage et mes projets de films.
            </p>
            <div className="text-white font-semibold flex items-center gap-2">
              <span className="text-[#FF2A14]">[{projectsCount}]</span>
              <span>PROJETS PRÉSENTÉS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ruban Défilant Ticker 100% en Français */}
      <div className="mt-12 border-y border-white/10 py-3.5 bg-zinc-950/90 overflow-hidden whitespace-nowrap relative select-none">
        <div ref={tickerRef} className="inline-flex items-center gap-8">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-4">
              <span className="font-syne text-xl sm:text-2xl font-bold tracking-wider text-white">
                {item}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#FF2A14] mx-2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
