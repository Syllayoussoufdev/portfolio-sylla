"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, FolderGit2, Mail, Heart, Video, Camera, Smile } from "lucide-react";
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

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden"
    >
      {/* 1. Orbes lumineuses d'ambiance vibrantes (Bleu Royal & Orange Vif - DESIGN.md Image 1) */}
      <div className="absolute top-10 left-[-80px] w-96 h-96 rounded-full bg-[#2563EB] opacity-35 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-[-60px] w-[420px] h-[420px] rounded-full bg-[#F97316] opacity-30 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-[#3B82F6] opacity-25 blur-[100px] pointer-events-none -z-10" />

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Colonne Gauche : Composition Visuelle avec Polaroids, Stickers Y2K & Effets Techno */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[440px] sm:min-h-[500px]">
          {/* Polaroid 1 (en haut à gauche, incliné -8deg) */}
          <div className="absolute top-2 left-2 sm:left-6 -rotate-8 z-10 p-2 sm:p-2.5 pb-6 sm:pb-8 bg-white rounded-xl shadow-xl shadow-slate-900/10 border border-slate-100 transform hover:rotate-0 hover:scale-105 transition-all duration-300 w-32 sm:w-36">
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
          <div className="absolute bottom-4 left-6 sm:left-12 rotate-6 z-10 p-2 sm:p-2.5 pb-6 sm:pb-8 bg-white rounded-xl shadow-xl shadow-slate-900/10 border border-slate-100 transform hover:rotate-0 hover:scale-105 transition-all duration-300 w-32 sm:w-36">
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
          <div className="relative z-20 w-64 h-64 sm:w-76 sm:h-76 md:w-80 md:h-80 rounded-3xl overflow-hidden p-2.5 bg-gradient-to-tr from-white via-white/80 to-blue-50/50 backdrop-blur-xl border-2 border-white shadow-2xl shadow-blue-900/15 group">
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

          {/* Badge Y2K & Stickers Ludiques Flottants */}
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

        {/* Colonne Droite : Typographie XXL & Discours Vivant (Bleu/Orange) */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Pastille Statut Créatif avec Badge Actif */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-xs text-[#0F172A] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
            <span className="font-mono font-semibold">Active Creative Badge · 2026</span>
          </div>

          {/* Grand Titre Expressif en Bebas Neue + Pilules Doubles (ENGINEER / DESIGN) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3.5 py-1 rounded-full bg-[#2563EB] text-white font-mono text-xs font-bold tracking-wider uppercase shadow-md shadow-blue-500/20">
                ENGINEER
              </span>
              <span className="px-3.5 py-1 rounded-full bg-[#F97316] text-white font-mono text-xs font-bold tracking-wider uppercase shadow-md shadow-orange-500/20">
                DESIGN
              </span>
            </div>

            <h1 className="font-bebas text-5xl sm:text-7xl lg:text-8xl tracking-wide text-[#0F172A] leading-[0.95]">
              {headline}
            </h1>
          </div>

          {/* Positionnement et accroche */}
          <p className="text-base sm:text-lg text-[#475569] max-w-xl leading-relaxed">
            {subline}
          </p>

          {/* Carte de métriques en verre givré (Style Image 1 : 710 Ste, 35 Stats, 500+) */}
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
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
          </div>

          {/* Annotation manuscrite style Caveat */}
          <div className="pt-1 flex items-center gap-2 text-slate-500">
            <span className="font-caveat text-base sm:text-lg text-[#F97316] font-bold">
              ↗ Tout est personnalisable via le dashboard !
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
