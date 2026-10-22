import React from "react";
import Image from "next/image";
import { UserCheck } from "lucide-react";
import type { SiteSettingsData } from "@/lib/profiles";

interface AboutSectionProps {
  settings?: SiteSettingsData | null;
}

export function AboutSection({ settings }: AboutSectionProps) {
  const displayName = settings?.nom || "Sylla Youssouf";
  const displayMetier = settings?.metier || "Développeur Web & Mobile";

  const pillars = [
    {
      title: "1. Compréhension du besoin métier",
      desc: "Avant d'écrire la moindre ligne de code, je m'assure de cerner précisément les objectifs du projet, la cible utilisatrice et les contraintes de livraison.",
    },
    {
      title: "2. Architecture & Choix pérennes",
      desc: "Je privilégie des technologies éprouvées (Laravel, Next.js, PostgreSQL) et un code modulaire facile à maintenir et à faire évoluer dans le temps.",
    },
    {
      title: "3. Finition soignée & Performance",
      desc: "Le souci du détail sur l'ergonomie, les temps de chargement réduits et l'accessibilité sur tous les formats d'écrans.",
    },
  ];

  return (
    <section id="a-propos" className="py-10 sm:py-16 lg:py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Colonne Gauche : Image & Fiche personnelle */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white p-3 shadow-lg shadow-slate-900/5">
            <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-slate-900">
              <Image
                src="/sylla.jpg"
                alt={`${displayName} au travail`}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
              />
            </div>

            <div className="p-4 pt-5">
              <h3 className="text-base font-bold text-[var(--ink)]">{displayName}</h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                {displayMetier} · Disponible pour missions et collaborations innovantes.
              </p>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Approche & Valeur Ajoutée */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200/80 text-[var(--ink)] text-xs font-medium">
            <UserCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>À propos &amp; Méthode de travail</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] leading-tight">
            Créer des solutions logicielles qui résolvent de vrais problèmes.
          </h2>

          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            Passionné par la croisée des chemins entre rigueur technique et design d&apos;interface,
            j&apos;accompagne les entreprises, startups et créateurs dans la concrétisation de leurs
            projets numériques, de la maquette jusqu&apos;à la mise en production.
          </p>

          {/* Les 3 piliers de travail */}
          <div className="space-y-4 pt-2">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1"
              >
                <h4 className="text-sm font-semibold text-[var(--ink)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  <span>{pillar.title}</span>
                </h4>
                <p className="text-xs text-[var(--subtle)] pl-3.5 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
