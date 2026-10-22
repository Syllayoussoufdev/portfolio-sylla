"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ToolSquircle,
  TOOLS_ROW_1,
  TOOLS_ROW_2,
  type ToolItem,
} from "@/components/ToolIcons";
import type { SkillCategoryWithSkills } from "@/lib/skills";
import { Sparkles, Layers, Cpu, Wrench } from "lucide-react";

interface SkillsImmersifProps {
  categories?: SkillCategoryWithSkills[];
}

export function SkillsImmersif({ categories = [] }: SkillsImmersifProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 82%",
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
      id="competences"
      className="py-10 sm:py-16 lg:py-24 px-5 sm:px-8 max-w-7xl mx-auto scroll-mt-20 text-white relative overflow-hidden"
    >
      {/* 1. En-tête de section Éditorial Sombre */}
      <div ref={headerRef} className="space-y-4 mb-14 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#FF2A14] text-xs font-mono font-medium tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A14]" />
          <span>[ 03 · LOGICIELS &amp; OUTILS DE MONTAGE ]</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2 className="font-syne text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase leading-tight">
            Mes Outils de Création.
          </h2>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 max-w-md leading-relaxed">
            Une maîtrise opérationnelle de la suite de montage, d&apos;étalonnage et d&apos;habillage graphique pour livrer des contenus prêts à diffuser.
          </p>
        </div>
      </div>

      {/* 2. LE DOUBLE CAROUSEL D'ICÔNES (Style Image 3 soumise par l'utilisateur) */}
      <div className="space-y-4 my-12 -mx-5 sm:-mx-8 py-4 bg-gradient-to-b from-[#070708] via-[#0E1117]/60 to-[#070708] border-y border-white/10 relative overflow-hidden">
        {/* Dégradés latéraux pour fondu cinématique */}
        <div className="absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#070708] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#070708] to-transparent z-10 pointer-events-none" />

        {/* Rangée 1 : Défilement vers la GAUCHE */}
        <div className="flex w-max gap-4 sm:gap-6 animate-marquee select-none group">
          {[...TOOLS_ROW_1, ...TOOLS_ROW_1].map((tool, idx) => (
            <div key={`r1-${tool.id}-${idx}`} className="flex flex-col items-center gap-2">
              <ToolSquircle>
                {tool.icon}
              </ToolSquircle>
              <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors truncate max-w-[70px] text-center">
                {tool.name}
              </span>
            </div>
          ))}
        </div>

        {/* Rangée 2 : Défilement vers la DROITE (reverse) */}
        <div
          className="flex w-max gap-4 sm:gap-6 select-none group"
          style={{
            animation: "marquee 32s linear infinite reverse",
          }}
        >
          {[...TOOLS_ROW_2, ...TOOLS_ROW_2].map((tool, idx) => (
            <div key={`r2-${tool.id}-${idx}`} className="flex flex-col items-center gap-2">
              <ToolSquircle>
                {tool.icon}
              </ToolSquircle>
              <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors truncate max-w-[70px] text-center">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bento Grid des 4 Piliers d'Apprentissage Vidéo */}
      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
        {[
          {
            num: "01",
            title: "Montage & Découpe Vidéo",
            desc: "Assemblage chronologique, coupes franches, dynamique de scènes et sélection minutieuse des prises.",
            tools: ["CapCut", "Premiere Pro", "Formats Courts"],
          },
          {
            num: "02",
            title: "Animation & Titrages",
            desc: "Création de textes animés, sous-titres dynamiques, transitions personnalisées et habillage visuel.",
            tools: ["After Effects", "Canva", "Titrages"],
          },
          {
            num: "03",
            title: "Habillage Graphique & Vignettes",
            desc: "Conception de miniatures percutantes, retouche d'images et préparation d'éléments graphiques.",
            tools: ["Photoshop", "Illustrator", "Figma"],
          },
          {
            num: "04",
            title: "Outils IA & Voix Off",
            desc: "Accompagnement créatif par l'IA pour la génération vocale, la structuration de scripts et l'inspiration.",
            tools: ["ElevenLabs", "Claude", "ChatGPT"],
          },
        ].map((item) => (
          <div
            key={item.num}
            className="p-7 rounded-3xl bg-[#111113] border border-white/10 hover:border-[#FF2A14]/60 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-[#FF2A14] font-bold">
                  [{item.num}]
                </span>
                <span className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-[#FF2A14] transition-colors" />
              </div>
              <h3 className="font-syne text-lg font-bold text-white mb-2 group-hover:text-[#FF2A14] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6 flex flex-wrap gap-1.5">
              {item.tools.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-[10px] font-mono text-zinc-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Compétences déclarées en base (si présentes) */}
      {categories && categories.length > 0 && (
        <div className="mt-16 pt-10 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono text-zinc-500 uppercase">
              MODULES VALIDÉS EN BASE :
            </span>
            {categories.map((cat) => (
              <div key={cat.id} className="flex flex-wrap items-center gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300"
                  >
                    {skill.nom}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
