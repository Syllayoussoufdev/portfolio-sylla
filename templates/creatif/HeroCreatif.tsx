"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Sparkles,
  FolderGit2,
  Mail,
  Heart,
  Video,
  Camera,
  Smile,
} from "lucide-react";
import { FigmaIcon, CanvaIcon } from "@/components/icons";
import type { HeroData } from "@/lib/validations/profile";
import type { MediaData, SiteSettingsData } from "@/lib/profiles";

interface HeroCreatifProps {
  hero?: HeroData;
  heroMedia?: MediaData | null;
  projectsCount?: number;
  settings?: SiteSettingsData | null;
}

export function HeroCreatif({
  hero,
  heroMedia,
  projectsCount = 35,
  settings,
}: HeroCreatifProps) {
  const containerRef = useRef<HTMLElement>(null);
  const leftVisualRef = useRef<HTMLDivElement>(null);
  const polaroid1Ref = useRef<HTMLDivElement>(null);
  const polaroid2Ref = useRef<HTMLDivElement>(null);
  const mainPortraitRef = useRef<HTMLDivElement>(null);
  const stickersRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const doodleArrowRef = useRef<SVGPathElement>(null);
  const doodleSparkleRef = useRef<SVGPathElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);

  const headline = hero?.headline || "SYLLA PORTFOLIO";
  const subline =
    hero?.subline ||
    "Double casquette Créative & Ingénierie logicielle : identités mémorables et applications web performantes.";
  const primaryCta = hero?.ctaPrimary || {
    label: "Voir mes projets",
    href: "#projets",
  };
  const secondaryCta = hero?.ctaSecondary || {
    label: "Me contacter",
    href: "#contact",
  };

  const displayName = settings?.nom || "Sylla Youssouf";
  const imageSrc = heroMedia?.url || "/sylla.jpg";
  const imageAlt = heroMedia?.alt || `Portrait créatif de ${displayName}`;

  // =========================================================================
  // ORCHESTRATION DU CONTRAT DE MOUVEMENT (GSAP)
  // =========================================================================
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;

    if (isReduced) {
      // Accessibilité : Affichage statique immédiat sans mouvement
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Point 1 : Entrée orchestrée en ressort (back.out) ≤ 1,2s, une seule fois
      tl.fromTo(
        mainPortraitRef.current,
        { scale: 0.85, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: "back.out(1.5)" }
      );

      tl.fromTo(
        polaroid1Ref.current,
        { scale: 0, opacity: 0, rotation: -25 },
        { scale: 1, opacity: 1, rotation: -8, duration: 0.7, ease: "back.out(1.8)" },
        "-=0.6"
      );

      tl.fromTo(
        polaroid2Ref.current,
        { scale: 0, opacity: 0, rotation: 22 },
        { scale: 1, opacity: 1, rotation: 6, duration: 0.7, ease: "back.out(1.8)" },
        "-=0.5"
      );

      // Stickers flottants pop-in
      if (stickersRef.current) {
        const items = stickersRef.current.children;
        tl.fromTo(
          items,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(2)" },
          "-=0.4"
        );
      }

      // Titre et contenu textuel
      if (contentRef.current) {
        tl.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          "-=0.5"
        );
      }

      // Point 2 : Doodles SVG qui se tracent à l'entrée
      if (doodleArrowRef.current) {
        const length = doodleArrowRef.current.getTotalLength();
        gsap.set(doodleArrowRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        tl.to(
          doodleArrowRef.current,
          { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" },
          "-=0.3"
        );
      }

      if (doodleSparkleRef.current) {
        const length = doodleSparkleRef.current.getTotalLength();
        gsap.set(doodleSparkleRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        tl.to(
          doodleSparkleRef.current,
          { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" },
          "-=0.4"
        );
      }

      // Point 3 : Parallaxe au défilement (vitesses différentes)
      gsap.to(polaroid1Ref.current, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(polaroid2Ref.current, {
        y: -25,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Point 6 : Vitesse de la bande défilante accélérée au défilement
      if (marqueeTrackRef.current) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            const velocity = Math.abs(self.getVelocity() / 300);
            if (marqueeTrackRef.current) {
              const speedFactor = 1 + Math.min(velocity, 3);
              marqueeTrackRef.current.style.animationDuration = `${25 / speedFactor}s`;
            }
          },
        });
      }
    }, containerRef);

    // Point 3 : Parallaxe de souris (≤ 12 px, désactivée au tactile)
    const handleMouseMove = (e: MouseEvent) => {
      if (isTouch || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      if (polaroid1Ref.current) {
        gsap.to(polaroid1Ref.current, {
          x: relX * -12,
          y: relY * -12,
          duration: 0.6,
          ease: "power1.out",
          overwrite: "auto",
        });
      }
      if (polaroid2Ref.current) {
        gsap.to(polaroid2Ref.current, {
          x: relX * 10,
          y: relY * 10,
          duration: 0.6,
          ease: "power1.out",
          overwrite: "auto",
        });
      }
      if (stickersRef.current) {
        gsap.to(stickersRef.current, {
          x: relX * 8,
          y: relY * 8,
          duration: 0.8,
          ease: "power1.out",
          overwrite: "auto",
        });
      }
    };

    const container = containerRef.current;
    if (container && !isTouch) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      ctx.revert();
      if (container && !isTouch) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[92vh] flex flex-col justify-center pt-28 pb-14 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden text-[#0F172A]"
    >
      {/* 1. Orbes lumineuses d'ambiance vibrantes (Bleu Royal & Orange Vif - DESIGN.md Image 1) */}
      <div className="absolute top-10 left-[-80px] w-96 h-96 rounded-full bg-[#2563EB] opacity-35 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-[-60px] w-[420px] h-[420px] rounded-full bg-[#F97316] opacity-30 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-[#3B82F6] opacity-25 blur-[100px] pointer-events-none -z-10" />

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-12">
        {/* Colonne Gauche : Composition Visuelle avec Polaroids, Stickers Y2K & Effets Techno */}
        <div
          ref={leftVisualRef}
          className="lg:col-span-6 relative flex items-center justify-center min-h-[440px] sm:min-h-[500px]"
        >
          {/* Polaroid 1 (en haut à gauche, incliné -8deg) */}
          <div
            ref={polaroid1Ref}
            className="absolute top-2 left-2 sm:left-6 -rotate-8 z-10 p-2 sm:p-2.5 pb-6 sm:pb-8 bg-white rounded-xl shadow-xl shadow-slate-900/10 border border-slate-100 transform hover:rotate-0 hover:scale-105 transition-all duration-300 w-32 sm:w-36 cursor-pointer"
          >
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-900">
              <Image
                src="/sylla.jpg"
                alt="Sylla — Moment candide"
                fill
                sizes="150px"
                className="object-cover"
              />
            </div>
            <span className="font-caveat text-[11px] text-slate-700 block text-center mt-1.5 font-bold">
              Inspiration ☕
            </span>
          </div>

          {/* Polaroid 2 (en bas à gauche, incliné 6deg) */}
          <div
            ref={polaroid2Ref}
            className="absolute bottom-4 left-6 sm:left-12 rotate-6 z-10 p-2 sm:p-2.5 pb-6 sm:pb-8 bg-white rounded-xl shadow-xl shadow-slate-900/10 border border-slate-100 transform hover:rotate-0 hover:scale-105 transition-all duration-300 w-32 sm:w-36 cursor-pointer"
          >
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-800">
              <Image
                src="/sylla.jpg"
                alt="Sylla — Studio focus"
                fill
                sizes="150px"
                className="object-cover grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <span className="font-caveat text-[11px] text-slate-700 block text-center mt-1.5 font-bold">
              Creative mood ✨
            </span>
          </div>

          {/* Portrait Détouré Principal avec Contour Sticker Blanc */}
          <div
            ref={mainPortraitRef}
            className="relative z-20 w-64 h-64 sm:w-76 sm:h-76 md:w-80 md:h-80 rounded-3xl overflow-hidden p-2.5 bg-gradient-to-tr from-white via-white/80 to-blue-50/50 backdrop-blur-xl border-2 border-white shadow-2xl shadow-blue-900/15 group"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0F172A]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 640px) 260px, 320px"
                className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Sticker Flottant Figma */}
            <div className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-white shadow-lg border border-slate-100 flex items-center justify-center transform hover:scale-110 transition-transform">
              <FigmaIcon className="w-5 h-5 text-purple-600" />
            </div>

            {/* Sticker Flottant Canva */}
            <div className="absolute top-16 right-[-8px] z-30 p-2 rounded-xl bg-white shadow-lg border border-slate-100 flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform">
              <CanvaIcon className="w-5 h-5" />
            </div>
          </div>

          {/* Groupe de Stickers Flottants & Badges Y2K */}
          <div ref={stickersRef} className="contents">
            <div className="absolute top-6 right-8 sm:right-16 z-30 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-mono text-[10px] font-extrabold uppercase shadow-lg transform rotate-12 hover:rotate-0 transition-transform cursor-default">
              Y2K Vibe ⚡
            </div>

            <div className="absolute top-1/2 left-[-10px] z-30 w-10 h-10 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shadow-lg border-2 border-white transform -rotate-12 hover:scale-110 transition-transform">
              <Smile className="w-6 h-6 fill-current text-slate-900" />
            </div>

            <div className="absolute bottom-20 left-0 z-30 w-9 h-9 rounded-xl bg-white text-slate-800 flex items-center justify-center shadow-lg border border-slate-200 transform rotate-12 hover:scale-110 transition-transform">
              <Camera className="w-5 h-5 text-[#2563EB]" />
            </div>

            {/* Pastille Verre Givré : Natural Candids */}
            <div className="absolute -bottom-2 right-4 sm:right-10 z-30 glass px-4 py-2.5 flex items-center gap-2.5 shadow-xl border border-white/80">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="p-1 rounded-md bg-purple-100 text-purple-600">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </span>
                <span className="p-1 rounded-md bg-blue-100 text-[#2563EB]">
                  <Video className="w-3.5 h-3.5" />
                </span>
              </div>
              <span className="text-xs font-semibold text-[#0F172A] font-mono">
                Natural candids ✨
              </span>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Typographie XXL & Discours Vivant (Bleu/Orange) */}
        <div ref={contentRef} className="lg:col-span-6 space-y-6 text-left">
          {/* Pastille Statut Créatif avec Badge Actif */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-2xs text-[#0F172A] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
            <span className="font-mono font-semibold">Active Creative Badge · 2026</span>
          </div>

          {/* Grand Titre Expressif en Bebas Neue + Pilules Doubles (ENGINEER / DESIGN) */}
          <div className="space-y-3 relative">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3.5 py-1 rounded-full bg-[#2563EB] text-white font-mono text-xs font-bold tracking-wider uppercase shadow-md shadow-blue-500/20">
                ENGINEER
              </span>
              <span className="px-3.5 py-1 rounded-full bg-[#F97316] text-white font-mono text-xs font-bold tracking-wider uppercase shadow-md shadow-orange-500/20">
                DESIGN
              </span>
            </div>

            <div className="relative inline-block">
              <h1 className="font-bebas text-5xl sm:text-7xl lg:text-8xl tracking-wide text-[#0F172A] leading-[0.95]">
                {headline}
              </h1>

              {/* Point 2 : Doodle Sparkle SVG tracé */}
              <svg
                className="absolute -top-6 -right-6 w-10 h-10 text-[#F97316] pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  ref={doodleSparkleRef}
                  d="M12 2v4m0 12v4M2 12h4m12 0h4m-3.5-6.5l-2.8 2.8m-7.4 7.4l-2.8 2.8m0-13l2.8 2.8m7.4 7.4l2.8 2.8"
                />
              </svg>
            </div>
          </div>

          {/* Positionnement et accroche */}
          <p className="text-base sm:text-lg text-[#475569] max-w-xl leading-relaxed">
            {subline}
          </p>

          {/* Carte de métriques en verre givré */}
          <div className="glass p-5 grid grid-cols-3 gap-4 border border-white/80 shadow-lg text-center max-w-lg">
            <div className="space-y-0.5">
              <div className="font-bebas text-2xl sm:text-3xl text-[#2563EB] tracking-wide">
                {projectsCount}+
              </div>
              <div className="text-[11px] font-mono text-[#64748B]">Projets Conçus</div>
            </div>

            <div className="space-y-0.5 border-x border-slate-200/60 px-2">
              <div className="font-bebas text-2xl sm:text-3xl text-[#F97316] tracking-wide">
                100%
              </div>
              <div className="text-[11px] font-mono text-[#64748B]">Sur-Mesure</div>
            </div>

            <div className="space-y-0.5">
              <div className="font-bebas text-2xl sm:text-3xl text-[#0F172A] tracking-wide">
                DUAL
              </div>
              <div className="text-[11px] font-mono text-[#64748B]">Tech &amp; Design</div>
            </div>
          </div>

          {/* Boutons d'action en Verre & Bleu Royal */}
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#2563EB] hover:bg-blue-700 active:scale-98 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all group cursor-pointer"
            >
              <span>{primaryCta.label}</span>
              <ArrowRight className="w-4 h-4 text-orange-300 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full glass hover:bg-white text-[#0F172A] text-sm font-semibold border border-white/90 shadow-md active:scale-98 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#F97316]" />
              <span>{secondaryCta.label}</span>
            </Link>

            {/* Point 2 : Doodle Flèche Tracée pointant vers le CTA */}
            <svg
              className="hidden sm:block absolute -right-24 top-0 w-20 h-16 text-[#F97316] pointer-events-none"
              viewBox="0 0 100 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                ref={doodleArrowRef}
                d="M 10 70 Q 50 10 85 45 M 65 40 L 85 45 L 80 25"
              />
            </svg>
          </div>

          {/* Annotation manuscrite style Caveat */}
          <div className="pt-1 flex items-center gap-2 text-slate-500">
            <span className="font-caveat text-base sm:text-lg text-[#F97316] font-bold">
              ↗ Tout est personnalisable via le dashboard !
            </span>
          </div>
        </div>
      </div>

      {/* Point 6 : Ruban de texte défilant dont la vitesse suit le défilement */}
      <div className="pt-6 border-t border-slate-200/60 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div ref={marqueeTrackRef} className="flex items-center gap-6 animate-marquee whitespace-nowrap text-xs font-mono font-semibold text-[#64748B]">
          <span>⚡ MOTION GRAPHICS</span>
          <span>·</span>
          <span className="text-[#2563EB]">★ BRAND IDENTITY</span>
          <span>·</span>
          <span>3D UNIVERSES</span>
          <span>·</span>
          <span className="text-[#F97316]">✨ PRODUCT ENGINEERING</span>
          <span>·</span>
          <span>CREATIVE DIRECTION</span>
          <span>·</span>
          <span>⚡ MOTION GRAPHICS</span>
          <span>·</span>
          <span className="text-[#2563EB]">★ BRAND IDENTITY</span>
          <span>·</span>
          <span>3D UNIVERSES</span>
          <span>·</span>
          <span className="text-[#F97316]">✨ PRODUCT ENGINEERING</span>
        </div>
      </div>
    </section>
  );
}
