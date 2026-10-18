"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, Play, Film, Sparkles, Video, Layers, MonitorPlay } from "lucide-react";
import type { HeroData } from "@/lib/validations/profile";
import type { MediaData, SiteSettingsData } from "@/lib/profiles";

interface HeroImmersifProps {
  hero?: HeroData;
  heroMedia?: MediaData | null;
  projectsCount?: number;
  settings?: SiteSettingsData | null;
}

export function HeroImmersif({
  hero,
  heroMedia,
  projectsCount = 35,
  settings,
}: HeroImmersifProps) {
  const containerRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const showreelRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const headline =
    hero?.headline || "Turning Ideas Into Beautiful Digital Experiences.";
  const subline =
    hero?.subline ||
    "Direction créative, motion design, univers 3D immersifs et production visuelle d'impact pour marques audacieuses.";
  const primaryCta = hero?.ctaPrimary || {
    label: "Explorer le Showreel & Réalisations",
    href: "#projets",
  };
  const secondaryCta = hero?.ctaSecondary || {
    label: "Lancer un projet créatif",
    href: "#contact",
  };

  const displayName = settings?.nom || "Sylla Youssouf";
  const imageSrc = heroMedia?.url || "/sylla.jpg";
  const imageAlt = heroMedia?.alt || `Direction créative de ${displayName}`;

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6 }
      );

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.3"
      );

      tl.fromTo(
        sublineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      );

      tl.fromTo(
        showreelRef.current,
        { opacity: 0, scale: 0.94, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.2)" },
        "-=0.3"
      );

      if (metricsRef.current) {
        tl.fromTo(
          metricsRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "-=0.4"
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current.children,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          "-=0.2"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[95vh] flex flex-col justify-center pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden text-slate-100"
    >
      {/* Halo lumineux violet & magenta (Style Image 3 ELAM) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full bg-gradient-to-r from-purple-600/25 to-pink-600/20 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto w-full space-y-10 text-center">
        {/* Pastille Studio de Création Numérique */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium mx-auto shadow-sm"
        >
          <Film className="w-3.5 h-3.5 text-pink-400" />
          <span>STUDIO DE DIRECTION CRÉATIVE &amp; MOTION 3D</span>
        </div>

        {/* Titre Éditorial Épuré en Police Syne (Style Image 3) */}
        <div className="space-y-6">
          <h1
            ref={titleRef}
            className="font-syne text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto"
          >
            {headline}
          </h1>

          <p
            ref={sublineRef}
            className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light"
          >
            {subline}
          </p>
        </div>

        {/* Grand Écran Vidéo / Showreel Central Widescreen (Style Image 3) */}
        <div
          ref={showreelRef}
          className="relative aspect-21/9 sm:aspect-16/7 w-full rounded-3xl overflow-hidden border border-purple-500/25 shadow-2xl shadow-purple-950/40 bg-gradient-to-br from-slate-900 to-purple-950/50 group"
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center group-hover:scale-102 transition-transform duration-700 opacity-80"
          />

          {/* Dégradé cinématique sombre */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Bouton Showreel Central Flottant (Style Vidéo) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <a
              href="#projets"
              className="group/btn relative flex items-center gap-3 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 text-white shadow-2xl transition-all transform hover:scale-105 active:scale-95"
            >
              <span className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg group-hover/btn:bg-pink-600 transition-colors">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </span>
              <span className="text-xs font-mono font-bold tracking-wider uppercase">
                Découvrir les vidéos &amp; 3D
              </span>
            </a>
          </div>

          {/* Badge coin inférieur gauche : Direction Artistique */}
          <div className="absolute bottom-5 left-5 hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-slate-300 font-mono">
            <Video className="w-3.5 h-3.5 text-purple-400" />
            <span>Showreel 2026 · 4K / 60FPS</span>
          </div>

          {/* Badge coin inférieur droit : 2D & 3D */}
          <div className="absolute bottom-5 right-5 hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-pink-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Illustrations 2D / 3D WebGL</span>
          </div>
        </div>

        {/* Métriques Studio (Style Image 3 : 40+ Projects, 15+ Motion, 98% Impact) */}
        <div ref={metricsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
          {[
            { num: `${projectsCount}+`, label: "Projets Déployés" },
            { num: "15+", label: "Pièces Motion & Vidéo" },
            { num: "3D", label: "WebGL & Shaders" },
            { num: "98%", label: "Impact Visuel" },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 backdrop-blur-md"
            >
              <div className="font-syne text-2xl font-bold text-white">{item.num}</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Boutons d'Action Immersifs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href={primaryCta.href}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-98 text-white font-bold text-xs tracking-wider uppercase shadow-xl shadow-purple-600/25 transition-all cursor-pointer"
          >
            <span>{primaryCta.label}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href={secondaryCta.href}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 active:scale-98 text-white border border-white/20 text-xs font-mono transition-all cursor-pointer"
          >
            <MonitorPlay className="w-4 h-4 text-purple-400" />
            <span>{secondaryCta.label}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
