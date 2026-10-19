"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, Play, Film, Sparkles, Video, ArrowUpRight, MonitorPlay } from "lucide-react";
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
  { en: "EVOLVE", jp: "進化" },
  { en: "IMAGINE", jp: "想像" },
  { en: "SHAPE", jp: "創造" },
  { en: "DIRECT", jp: "監督" },
  { en: "CRAFT", jp: "技" },
  { en: "MOTION", jp: "動画" },
  { en: "IMPACT", jp: "衝撃" },
  { en: "ELEVATE", jp: "高揚" },
];

export function HeroImmersif({
  hero,
  heroMedia,
  projectsCount = 35,
  settings,
}: HeroImmersifProps) {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  const headline =
    hero?.headline &&
    hero.headline !== "Turning Ideas Into Beautiful Digital Experiences." &&
    hero.headline !== "DES IMAGES QUI BOUGENT, UN RÉCIT QUI TIENT."
      ? hero.headline
      : "Ideas made\nunforgettable.";
  const subline =
    hero?.subline &&
    hero.subline !== "Montage vidéo, motion et direction visuelle."
      ? hero.subline
      : "We build films, motion systems and visual identities that turn a clear idea into a distinctive experience.";
  const primaryCta = hero?.ctaPrimary || {
    label: "Explorer le Showreel",
    href: "#projets",
  };
  const secondaryCta = hero?.ctaSecondary || {
    label: "Démarrer un projet",
    href: "#contact",
  };

  const displayName = settings?.nom || "Sylla Youssouf";

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Entrée cinématique du Hero
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        metaRef.current,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.7 }
      );

      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 40, skewY: 1.5 },
        { opacity: 1, y: 0, skewY: 0, duration: 1 },
        "-=0.4"
      );

      tl.fromTo(
        statementRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      );

      // 2. Animation GSAP Marquee Ticker ultra fluide
      if (tickerRef.current) {
        const row = tickerRef.current;
        gsap.to(row, {
          xPercent: -50,
          repeat: -1,
          duration: 22,
          ease: "none",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen bg-[#070708] text-white pt-28 pb-16 overflow-hidden flex flex-col justify-between"
    >
      {/* Grille structurelle subtile d'arrière-plan */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Lueur cinématique rouge vermillon très rasante */}
      <div className="absolute top-1/4 right-0 w-[420px] h-[420px] bg-[#FF2A14]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full relative z-10 flex-1 flex flex-col justify-center">
        {/* Barre méta technique */}
        <div
          ref={metaRef}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-12 text-[11px] font-mono text-zinc-400 uppercase tracking-widest"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF2A14] animate-pulse" />
            <span className="text-white font-semibold">{displayName} · STUDIO</span>
          </div>
          <div className="hidden sm:block">DIRECTION CRÉATIVE &amp; MONTAGE VIDÉO</div>
          <div className="text-zinc-500">PARIS / ABIDJAN / WORLDWIDE</div>
        </div>

        {/* Bloc Principal Asymétrique (Inspiration "Ideas made unforgettable.") */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#FF2A14] text-[11px] font-mono font-medium tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A14]" />
              EST. 2026 · EDITION IMMERSIVE
            </div>

            <h1
              ref={headlineRef}
              className="font-syne text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[0.98] uppercase"
            >
              Ideas made<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#FF2A14]">
                unforgettable.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed font-light font-mono">
              Montage haute cadence, motion design 3D et récits cinématographiques pour marques, créateurs et plateformes exigeantes.
            </p>

            {/* Actions rapides */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#FF2A14] hover:bg-[#E0240F] active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-950/50 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{primaryCta.label}</span>
              </Link>

              <Link
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 active:scale-95 text-zinc-300 hover:text-white border border-white/15 text-xs font-mono transition-all cursor-pointer"
              >
                <span>{secondaryCta.label}</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF2A14]" />
              </Link>
            </div>
          </div>

          {/* Sculpture 3D Chrome sombre avec reflets rouge vermillon */}
          <div className="lg:col-span-5 relative aspect-square max-w-md mx-auto w-full flex items-center justify-center">
            <div className="absolute inset-0 -z-10 bg-radial from-[#FF2A14]/15 via-transparent to-transparent rounded-full blur-2xl" />
            <MotionShowreel3D />
          </div>
        </div>

        {/* Second volet éditorial : "We build brands and websites..." */}
        <div
          ref={statementRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-10 border-t border-white/10 items-baseline"
        >
          <div className="md:col-span-8">
            <h2 className="font-syne text-2xl sm:text-4xl font-bold tracking-tight text-white leading-snug">
              {subline}
            </h2>
          </div>
          <div className="md:col-span-4 space-y-3 font-mono text-xs text-zinc-400">
            <p className="leading-relaxed">
              De la découpe au millième de seconde au sound design immersif, chaque seconde est pensée pour retenir l&apos;attention et imprimer une émotion durable.
            </p>
            <div className="flex items-center gap-3 text-white font-semibold">
              <span className="text-[#FF2A14] font-bold">[{projectsCount}+]</span>
              <span>RÉALISATIONS AU CATALOGUE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Ticker GSAP : EVOLVE 進化 • IMAGINE 想像 • SHAPE 創造 */}
      <div className="mt-14 border-y border-white/10 py-4 bg-zinc-950/80 overflow-hidden whitespace-nowrap relative select-none">
        <div ref={tickerRef} className="inline-flex items-center gap-10">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-4">
              <span className="font-syne text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
                {item.en}
              </span>
              <span className="text-xl sm:text-2xl text-zinc-500 font-bold">
                {item.jp}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#FF2A14] mx-2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
