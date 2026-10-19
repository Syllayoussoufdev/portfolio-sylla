"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Video, Film, Sparkles, Scissors, Eye, Volume2, ArrowUpRight, GraduationCap } from "lucide-react";
import type { SiteSettingsData } from "@/lib/profiles";

interface AboutImmersifProps {
  settings?: SiteSettingsData | null;
}

const APPRENTISSAGES = [
  {
    num: "01",
    titre: "Dérushage & Sens du Rythme",
    desc: "Sélectionner les meilleures prises, tailler dans le superflu et caler les coupes sur le tempo de la musique.",
    tag: "Découpe & Cadence",
  },
  {
    num: "02",
    titre: "Formats Courts & Dynamisme",
    desc: "Structurer des vidéos percutantes pour les réseaux sociaux, avec accroches visuelles et sous-titres soignés.",
    tag: "Reels & Shorts",
  },
  {
    num: "03",
    titre: "Projets de Films & Fiction",
    desc: "Expérimenter la narration, installer une ambiance, respecter la continuité des plans et des regards.",
    tag: "Narration & Cinéma",
  },
  {
    num: "04",
    titre: "Habillage Graphique & Audio",
    desc: "Nettoyer les pistes voix, intégrer des bruitages (SFX) et soigner la lisibilité des textes à l'écran.",
    tag: "Finition & Son",
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
      if (bentoRef.current) {
        gsap.fromTo(
          bentoRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
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

      if (listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { opacity: 0, x: -25 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
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
      className="py-24 px-5 sm:px-8 max-w-7xl mx-auto scroll-mt-24 text-white relative"
    >
      {/* 1. En-tête de section en français */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#FF2A14] uppercase tracking-wider block mb-2">
            [ 01 · MA DÉMARCHE &amp; PASSION ]
          </span>
          <h2 className="font-syne text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
            À propos de moi.
          </h2>
        </div>
        <p className="text-xs font-mono text-zinc-400 max-w-xs leading-relaxed">
          Débutant motivé en montage vidéo, passionné par la narration et le pouvoir des images en mouvement.
        </p>
      </div>

      {/* 2. Bento Grid Personnel & Authentique */}
      <div ref={bentoRef} className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-20">
        {/* CARTE 1 : Portrait Personnel Grand Format de Sylla */}
        <div className="md:col-span-5 relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 flex flex-col justify-end p-7 min-h-[340px] group">
          <Image
            src="/sylla.jpg"
            alt={displayName}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover object-top filter grayscale contrast-115 group-hover:filter-none transition-all duration-700 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-[#FF2A14]/10 mix-blend-color pointer-events-none" />

          <div className="relative z-10 space-y-1.5">
            <span className="text-[10px] font-mono text-[#FF2A14] uppercase tracking-wider block">
              [ MONTEUR VIDÉO &amp; CRÉATEUR ]
            </span>
            <h3 className="font-syne text-2xl font-bold text-white">
              {displayName}
            </h3>
            <p className="text-xs font-mono text-zinc-300">
              « Chaque nouveau projet est un terrain d&apos;exercice pour aiguiser mon regard et progresser. »
            </p>
          </div>
        </div>

        {/* CARTE 2 : Bloc Rouge Vermillon Plein - Ma Philosophie d'apprentissage */}
        <div className="md:col-span-7 bg-[#FF2A14] text-white p-8 sm:p-10 rounded-3xl flex flex-col justify-between min-h-[340px] shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-white/80">
            <span>DÉMARCHE CRÉATIVE</span>
            <span>PASSION &amp; PRATIQUE</span>
          </div>

          <div className="space-y-3 my-auto py-4">
            <span className="font-syne text-5xl sm:text-6xl font-extrabold leading-none block">
              01
            </span>
            <h3 className="font-syne text-2xl sm:text-3xl font-bold leading-tight max-w-lg">
              Apprendre, expérimenter et donner une âme à chaque montage.
            </h3>
            <p className="text-xs sm:text-sm font-mono text-white/90 leading-relaxed max-w-md">
              Je construis mes compétences pas à pas : assembler les rushs avec soin, équilibrer les coupes, soigner le son et raconter une histoire simple et captivante.
            </p>
          </div>

          <div className="pt-3 border-t border-white/20 text-xs font-mono text-white/90 flex items-center justify-between">
            <span>RYTHME · CADENCE · COUPE JUSTE</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </div>

        {/* CARTE 3 : Métier / Outils utilisés */}
        <div className="md:col-span-4 bg-[#111113] border border-white/10 p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#FF2A14] mb-3">
            <Scissors className="w-5 h-5" />
            <span className="font-mono text-xs uppercase">Rigueur du montage</span>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-syne text-base font-bold text-white">Découper au bon moment</h4>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              Éviter les longueurs, dynamiser les scènes et garder le spectateur attentif du début à la fin.
            </p>
          </div>
        </div>

        {/* CARTE 4 : Formats explorés */}
        <div className="md:col-span-4 bg-[#111113] border border-white/10 p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center gap-2 text-white mb-3">
            <Film className="w-5 h-5 text-[#FF2A14]" />
            <span className="font-mono text-xs uppercase text-zinc-400">Formats de prédilection</span>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-syne text-base font-bold text-white">Vidéos courtes &amp; Projets de films</h4>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              Formats verticaux pour réseaux sociaux, teasers, interviews et courts projets fictionnels.
            </p>
          </div>
        </div>

        {/* CARTE 5 : Esprit d'évolution */}
        <div className="md:col-span-4 bg-[#111113] border border-white/10 p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center gap-2 text-emerald-400 mb-3">
            <GraduationCap className="w-5 h-5" />
            <span className="font-mono text-xs uppercase text-zinc-400">Progression continue</span>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-syne text-base font-bold text-white">En formation permanente</h4>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              Pratique régulière sur CapCut, Premiere Pro et After Effects pour progresser à chaque projet.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Ce que je travaille au quotidien */}
      <div className="border-t border-white/10 pt-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-[#FF2A14] uppercase tracking-wider block">
              [ CE QUE JE PRATIQUE ]
            </span>
            <h3 className="font-syne text-2xl sm:text-4xl font-extrabold text-white uppercase">
              Mes axes de travail actuels.
            </h3>
          </div>

          <div ref={listRef} className="space-y-3">
            {APPRENTISSAGES.map((item) => (
              <div
                key={item.num}
                className="group p-6 sm:p-7 rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-[#FF2A14]/60 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-default"
              >
                <div className="flex items-center gap-5">
                  <span className="font-mono text-xs text-zinc-500 group-hover:text-[#FF2A14] transition-colors">
                    {item.num}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-[#FF2A14] transition-all" />
                    <h4 className="font-syne text-lg sm:text-xl font-bold text-white group-hover:translate-x-1 transition-transform">
                      {item.titre}
                    </h4>
                  </div>
                </div>

                <div className="sm:max-w-md sm:text-right space-y-1 pl-7 sm:pl-0">
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

      {/* 4. Encadré Personnel */}
      <div className="mt-20 p-8 sm:p-10 rounded-3xl bg-[#111113] border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-4 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
            <Image
              src="/sylla.jpg"
              alt={displayName}
              fill
              className="object-cover object-top"
            />
          </div>
          <div>
            <h4 className="font-syne text-base font-bold text-white">{displayName}</h4>
            <p className="text-xs font-mono text-[#FF2A14]">Monteur Vidéo Passionné</p>
            <p className="text-[11px] font-mono text-zinc-500 mt-0.5">Portfolio 3 · Vidéo &amp; Film</p>
          </div>
        </div>

        <div className="md:col-span-8 space-y-2 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
            NOTE PERSONNELLE
          </span>
          <p className="font-syne text-base sm:text-lg text-zinc-200 leading-relaxed italic">
            &ldquo;J&apos;ai créé ce 3ème portfolio pour regrouper et partager mes projets vidéo, mes essais de montage et mon évolution dans l&apos;audiovisuel.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
