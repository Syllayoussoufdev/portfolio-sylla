"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Palette, Code2, Rocket } from "lucide-react";
import type { SiteSettingsData } from "@/lib/profiles";

interface AboutCreatifProps {
  settings?: SiteSettingsData | null;
}

export function AboutCreatif({ settings }: AboutCreatifProps) {
  const displayName = settings?.nom || "Sylla Youssouf";
  const displayMetier = settings?.metier || "Expert Communication & Développeur Web";

  const pillars = [
    {
      title: "1. Direction Artistique & Graphisme",
      desc: "Chartes graphiques mémorables, typographies tranchées et identités visuelles conçues sous Figma et Canva.",
      icon: Palette,
      color: "#F97316",
    },
    {
      title: "2. Ingénierie Logicielle & Web",
      desc: "Développement fullstack moderne (Next.js, React, Tailwind, Laravel) optimisé pour la vitesse et le SEO.",
      icon: Code2,
      color: "#2563EB",
    },
    {
      title: "3. Finition Soignée & Effets Vivants",
      desc: "Verre givré, micro-interactions, mouvement fluide et textures visuelles qui font vibrer chaque écran.",
      icon: Rocket,
      color: "#8B5CF6",
    },
  ];

  return (
    <section id="a-propos" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24 relative">
      {/* Orbe lumineuse subtile */}
      <div className="absolute top-1/2 right-10 w-80 h-80 rounded-full bg-[#F97316] opacity-15 blur-[100px] pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Colonne Gauche : Cadre Polaroid Créatif avec Pin et Annotation */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative p-3 pb-10 bg-white rounded-3xl shadow-2xl border-2 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-300 max-w-sm w-full">
            {/* Effet Scotch / Tape en haut */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-100/80 backdrop-blur-xs border border-amber-200/60 rotate-1 rounded-sm shadow-xs z-10" />

            <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-slate-900">
              <Image
                src="/sylla.jpg"
                alt={`${displayName} au studio`}
                fill
                sizes="(max-width: 1024px) 100vw, 380px"
                className="object-cover"
              />
            </div>

            <div className="pt-4 px-2 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">{displayName}</h3>
                <p className="text-xs text-[#64748B] font-mono">{displayMetier}</p>
              </div>
              <span className="font-caveat text-base text-[#F97316] font-bold">
                Double casquette ✌️
              </span>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Démarche et Piliers en Verre Givré */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass border border-white/80 shadow-xs text-xs font-semibold text-[#0F172A]">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>À Propos &amp; Philosophie de Création</span>
          </div>

          <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl tracking-wide text-[#0F172A] leading-tight">
            ALLIER LA BEAUTÉ VISUELLE À LA RIGUEUR LOGICIELLE.
          </h2>

          <p className="text-base text-[#475569] leading-relaxed">
            Je refuse de choisir entre créativité expressive et rigueur d&apos;ingénierie.
            Chaque projet est pensé comme une pièce d&apos;art fonctionnelle : impact visuel immédiat,
            ergonomie soignée et architecture logicielle robuste.
          </p>

          {/* Les 3 piliers créatifs en cartes de verre */}
          <div className="space-y-3.5 pt-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="glass p-5 rounded-2xl border border-white/80 shadow-sm hover:border-[#2563EB]/40 hover:shadow-md transition-all flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-white"
                    style={{ backgroundColor: pillar.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A] mb-1">{pillar.title}</h4>
                    <p className="text-xs text-[#64748B] leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
