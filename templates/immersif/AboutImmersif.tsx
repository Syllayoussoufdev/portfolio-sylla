"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Film, Video, Play, ArrowUpRight, Sparkles, Scissors, Eye, Volume2 } from "lucide-react";
import type { SiteSettingsData } from "@/lib/profiles";

interface AboutImmersifProps {
  settings?: SiteSettingsData | null;
}

const DISCIPLINES = [
  {
    num: "01",
    name: "Direction Artistique",
    desc: "Définition de l'univers visuel, grammaire de plans, tonalité lumineuse et identité graphique percutante.",
    tag: "Art Direction",
  },
  {
    num: "02",
    name: "Montage Vidéo & Rythme",
    desc: "Découpage millimétré, rétention d'audience maximale, cadence sonore et narration émotionnelle.",
    tag: "Editing",
  },
  {
    num: "03",
    name: "Motion Design 2D & 3D",
    desc: "Animations typographiques cinétiques, titrages percutants, modélisation et intégration spatiale WebGL.",
    tag: "Motion 3D",
  },
  {
    num: "04",
    name: "Sound Design & Étalonnage",
    desc: "Ambiances sonores enveloppantes, transitions SFX dynamiques et color grading cinématique 4K.",
    tag: "Finishing",
  },
];

export function AboutImmersif({ settings }: AboutImmersifProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const displayName = settings?.nom || "Sylla Youssouf";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // Animation d'apparition des cartes Bento avec léger décalage
      if (bentoRef.current) {
        gsap.fromTo(
          bentoRef.current.children,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bentoRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animation de la liste de disciplines
      if (listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="a-propos"
      className="py-28 px-5 sm:px-8 max-w-7xl mx-auto scroll-mt-24 text-white relative"
    >
      {/* 1. Titre de section Bento (Inspiration "A closer look.") */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#FF2A14] uppercase tracking-wider block mb-2">
            [ 01 · EXPLORATION &amp; VISION ]
          </span>
          <h2 className="font-syne text-4xl sm:text-6xl font-extrabold tracking-tight text-white uppercase">
            A closer look.
          </h2>
        </div>
        <p className="text-xs font-mono text-zinc-400 max-w-xs leading-relaxed">
          Une approche radicale qui combine rigueur technique, sens du tempo et impact graphique immédiat.
        </p>
      </div>

      {/* 2. Bento Grid Éditorial Haute Précision */}
      <div ref={bentoRef} className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-24">
        {/* CARTE 1 : Bloc Rouge Vermillon Plein (Style "03" du moodboard) */}
        <div className="md:col-span-7 bg-[#FF2A14] text-white p-8 sm:p-10 rounded-3xl flex flex-col justify-between min-h-[300px] shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-white/80">
            <span>VISION ARTISTIQUE</span>
            <span>01 / 04</span>
          </div>

          <div className="space-y-4 my-auto py-6">
            <span className="font-syne text-6xl sm:text-7xl font-extrabold leading-none block">
              03
            </span>
            <h3 className="font-syne text-2xl sm:text-3xl font-bold leading-tight max-w-md">
              Stories that strike deep and refuse to be forgotten.
            </h3>
          </div>

          <div className="pt-4 border-t border-white/20 text-xs font-mono text-white/90 flex items-center justify-between">
            <span>RYTHME · TENSION DRAMATIQUE · DÉCOUPE</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </div>

        {/* CARTE 2 : Visuel Portrait Moody / Red Lighting (Style "Look and sound iconic") */}
        <div className="md:col-span-5 relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 flex flex-col justify-end p-8 min-h-[300px] group">
          <Image
            src="/sylla.jpg"
            alt={displayName}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover object-center filter grayscale contrast-125 group-hover:scale-105 group-hover:filter-none transition-all duration-700 opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-[#FF2A14]/10 mix-blend-color pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-mono text-[#FF2A14] uppercase tracking-wider block">
              [ DIRECTION &amp; POST-PROD ]
            </span>
            <h4 className="font-syne text-2xl font-bold text-white uppercase">
              Look and sound iconic.
            </h4>
            <p className="text-xs font-mono text-zinc-300">
              {displayName} · Créateur d&apos;expériences multimédias
            </p>
          </div>
        </div>

        {/* CARTE 3 : Stat Metric 01 */}
        <div className="md:col-span-4 bg-[#111113] border border-white/10 p-7 rounded-3xl flex flex-col justify-between">
          <span className="font-syne text-5xl font-extrabold text-white">01</span>
          <div className="space-y-1 mt-6">
            <h4 className="font-syne text-base font-bold text-white">Précision chirurgicale</h4>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              Chaque coupure et chaque onde sonore sont calées sur la pulsation naturelle de l&apos;attention.
            </p>
          </div>
        </div>

        {/* CARTE 4 : Stat Metric 30 */}
        <div className="md:col-span-4 bg-[#111113] border border-white/10 p-7 rounded-3xl flex flex-col justify-between">
          <span className="font-syne text-5xl font-extrabold text-[#FF2A14]">30+</span>
          <div className="space-y-1 mt-6">
            <h4 className="font-syne text-base font-bold text-white">Projets audiovisuels &amp; 3D</h4>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              Campagnes, showreels, teasers de marque et interfaces immersives déployées.
            </p>
          </div>
        </div>

        {/* CARTE 5 : Teaser 4K Precision */}
        <div className="md:col-span-4 bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-7 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">STANDARDS</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-zinc-300">
              4K / 60FPS
            </span>
          </div>
          <div className="space-y-1 mt-6">
            <h4 className="font-syne text-base font-bold text-white">smartrates. animations.</h4>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              Pipeline optimisé pour YouTube, Reels, TikTok et écrans scéniques haute résolution.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Liste Cinétique des Disciplines (Inspiration "Strategy • Identity • Digital Design") */}
      <div className="border-t border-white/10 pt-16">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-[#FF2A14] uppercase tracking-wider block">
              [ EXPERTISE &amp; SAVOIR-FAIRE ]
            </span>
            <h3 className="font-syne text-3xl sm:text-5xl font-extrabold text-white uppercase">
              What we obsess over.
            </h3>
          </div>

          <div ref={listRef} className="space-y-3">
            {DISCIPLINES.map((item) => (
              <div
                key={item.num}
                className="group p-6 sm:p-8 rounded-2xl bg-zinc-950/60 border border-white/10 hover:border-[#FF2A14]/60 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-default"
              >
                <div className="flex items-center gap-6">
                  <span className="font-mono text-xs text-zinc-500 group-hover:text-[#FF2A14] transition-colors">
                    {item.num}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-[#FF2A14] group-hover:scale-125 transition-all" />
                    <h4 className="font-syne text-xl sm:text-3xl font-bold text-white group-hover:translate-x-1 transition-transform">
                      {item.name}
                    </h4>
                  </div>
                </div>

                <div className="sm:max-w-md sm:text-right space-y-1 pl-8 sm:pl-0">
                  <span className="text-[10px] font-mono text-[#FF2A14] uppercase tracking-widest block">
                    {item.tag}
                  </span>
                  <p className="text-xs font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Section Témoignage Éditorial ("Better, together.") */}
      <div className="mt-28 p-8 sm:p-14 rounded-3xl bg-[#111113] border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-4 flex items-center gap-5">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
            <Image
              src="/sylla.jpg"
              alt={displayName}
              fill
              className="object-cover filter grayscale contrast-125"
            />
          </div>
          <div>
            <h4 className="font-syne text-lg font-bold text-white">{displayName}</h4>
            <p className="text-xs font-mono text-[#FF2A14]">Creative Engineering</p>
            <p className="text-[11px] font-mono text-zinc-500 mt-1">Portfolio Sylla · 2026</p>
          </div>
        </div>

        <div className="md:col-span-8 space-y-3 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
            PHILOSOPHIE STUDIO
          </span>
          <p className="font-syne text-lg sm:text-xl font-medium text-zinc-200 leading-relaxed italic">
            &ldquo;L&apos;audiovisuel moderne n&apos;a pas besoin d&apos;effets gratuits. Il a besoin d&apos;une intention limpide, d&apos;un rythme tranchant et d&apos;une image qui ne ressemble à aucune autre.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
