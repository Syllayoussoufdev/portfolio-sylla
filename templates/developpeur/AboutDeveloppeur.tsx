"use client";

import React from "react";
import Image from "next/image";
import {
  Compass,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Code2,
} from "lucide-react";
import type { SiteSettingsData } from "@/lib/profiles";

interface AboutDeveloppeurProps {
  settings?: SiteSettingsData | null;
}

export function AboutDeveloppeur({ settings }: AboutDeveloppeurProps) {
  const displayName = settings?.nom || "Sylla Youssouf";
  const displayMetier = settings?.metier || "Fullstack & Mobile Engineer";

  const pillars = [
    {
      num: "01",
      title: "Compréhension du besoin métier",
      description:
        "Analyse approfondie des enjeux pour concevoir des architectures qui répondent directement aux vrais besoins des utilisateurs et des organisations.",
    },
    {
      num: "02",
      title: "Architecture & Code pérenne",
      description:
        "Code modulaire, typage strict TypeScript, documentation claire et tests pour garantir une scalabilité et une maintenabilité optimales dans le temps.",
    },
    {
      num: "03",
      title: "Maîtrise des outils & autonomie",
      description:
        "De la modélisation de la base de données au déploiement automatisé en production, une prise en charge agile de l'ensemble du cycle de vie logiciel.",
    },
  ];

  return (
    <section
      id="a-propos"
      className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24 text-[#0B132B]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Colonne Gauche : Portrait en Cadre Stylisé & Badge (Style Image 1) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[380px] p-4 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-lg shadow-slate-900/5">
            {/* Halo bleu subtil */}
            <div className="absolute inset-0 rounded-3xl bg-blue-500/5 blur-xl pointer-events-none" />

            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 mb-4">
              <Image
                src="/sylla.jpg"
                alt={`Présentation de ${displayName}`}
                fill
                sizes="(max-width: 768px) 100vw, 380px"
                className="object-cover object-top"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div>
                <span className="block text-[10px] font-mono text-[#64748B] uppercase tracking-wider">
                  Fullstack &amp; Mobile
                </span>
                <span className="block text-sm font-bold text-[#0B132B]">
                  {displayName}
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs">
                SY
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Titre & Piliers d'ingénierie (Style Image 1) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-[#2563EB] text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Vision &amp; Méthode de Travail</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B132B] leading-tight">
              Créer des solutions logicielles qui résolvent de vrais problèmes.
            </h2>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Développeur passionné par la conception d&apos;applications robustes, scalables et intuitives. Mon approche repose sur une rigueur technique absolue alliée à un sens poussé du produit et de l&apos;ergonomie.
            </p>
          </div>

          {/* 3 Piliers Numérotés (Style Image 1) */}
          <div className="space-y-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.num}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#2563EB]/40 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-sm font-bold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 shrink-0">
                    {pillar.num}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#0B132B] group-hover:text-[#2563EB] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
