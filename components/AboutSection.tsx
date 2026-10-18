import React from "react";
import Image from "next/image";
import { UserCheck } from "lucide-react";

export function AboutSection() {
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
    <section id="a-propos" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Colonne Gauche : Image & Fiche personnelle */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white p-3 shadow-lg shadow-slate-900/5">
            <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-slate-900">
              <Image
                src="/sylla.jpg"
                alt="Sylla Youssouf au travail"
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
              />
            </div>

            <div className="p-4 pt-5">
              <span className="text-xs font-mono text-[#64748B] block">Profil vérifié</span>
              <h3 className="text-base font-bold text-[#0B132B]">Sylla Youssouf</h3>
              <p className="text-xs text-[#475569] mt-0.5">
                Développeur Web &amp; Mobile basé en France · Disponible en freelance &amp; opportunités d&apos;équipe.
              </p>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Approche & Valeur Ajoutée */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[#0B132B] text-xs font-medium">
            <UserCheck className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>À propos &amp; Méthode de travail</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B132B] leading-tight">
            Créer des solutions logicielles qui résolvent de vrais problèmes.
          </h2>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
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
                <h4 className="text-sm font-semibold text-[#0B132B] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                  <span>{pillar.title}</span>
                </h4>
                <p className="text-xs text-[#64748B] pl-3.5 leading-relaxed">
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
