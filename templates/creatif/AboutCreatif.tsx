"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, ArrowRight } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  BrandIdentityIllustration,
  ContentStrategyIllustration,
  WebDevIllustration,
} from "@/components/illustrations/AboutIllustrations";
import type { SiteSettingsData } from "@/lib/profiles";

interface AboutCreatifProps {
  settings?: SiteSettingsData | null;
}

export function AboutCreatif({ settings }: AboutCreatifProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const polaroidRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  const displayName = settings?.nom || "Sylla Youssouf";
  const displayMetier = settings?.metier || "Direction Artistique & Développement Web";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Animation du polaroid
      if (polaroidRef.current) {
        gsap.fromTo(
          polaroidRef.current,
          { opacity: 0, y: 40, rotate: -4 },
          {
            opacity: 1,
            y: 0,
            rotate: -2,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: polaroidRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 2. Révélation du texte d'en-tête
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 3. Cascade dynamique des 3 cartes illustrées
      if (pillarsRef.current) {
        gsap.fromTo(
          pillarsRef.current.children,
          { opacity: 0, y: 35, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "back.out(1.3)",
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const pillars = [
    {
      title: "Identité Visuelle & Branding",
      desc: "Chartes graphiques complètes, affiches, maquettes Figma UI/UX et déclinaisons print conçues pour valoriser votre marque.",
      tag: "Design & Print",
      Illustration: BrandIdentityIllustration,
      glowColor: "rgba(249, 115, 22, 0.18)",
      accentBorder: "group-hover:border-orange-300",
    },
    {
      title: "Contenu & Visibilité Digitale",
      desc: "Création de visuels percutants, animation de vos réseaux et supports marketing ciblés pour capter l'attention de vos prospects.",
      tag: "Stratégie & Social",
      Illustration: ContentStrategyIllustration,
      glowColor: "rgba(139, 92, 246, 0.18)",
      accentBorder: "group-hover:border-purple-300",
    },
    {
      title: "Conception & Développement Web",
      desc: "Sites vitrines et applications web rapides, ergonomiques et optimisés pour transformer vos visiteurs en clients qualifiés.",
      tag: "Next.js & Laravel",
      Illustration: WebDevIllustration,
      glowColor: "rgba(37, 99, 235, 0.18)",
      accentBorder: "group-hover:border-blue-300",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="a-propos"
      className="py-14 sm:py-18 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20 relative"
    >
      {/* Orbe lumineuse subtile */}
      <div className="absolute top-1/3 right-10 w-72 h-72 rounded-full bg-[#F97316] opacity-10 blur-[90px] pointer-events-none -z-10" />

      {/* Rangée Supérieure : Polaroid compact & Discours d'accroche */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10">
        {/* Colonne Gauche : Cadre Polaroid compact */}
        <div className="lg:col-span-4 flex justify-center">
          <div
            ref={polaroidRef}
            className="relative p-2.5 pb-7 bg-white rounded-2xl shadow-xl border border-slate-200/80 transform -rotate-2 hover:rotate-0 hover:scale-[1.02] transition-all duration-300 max-w-[240px] sm:max-w-[270px] w-full cursor-default"
          >
            {/* Effet Scotch / Tape en haut */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-amber-100/90 border border-amber-200/80 rotate-1 rounded-xs shadow-2xs z-10" />

            <div className="relative aspect-4/5 w-full rounded-xl overflow-hidden bg-slate-900">
              <Image
                src="/sylla.jpg"
                alt={`${displayName} au studio`}
                fill
                sizes="(max-width: 640px) 240px, 270px"
                className="object-cover transition-transform duration-700 hover:scale-104"
              />
            </div>

            <div className="pt-3 px-1.5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">{displayName}</h3>
                <p className="text-[11px] text-[#64748B] font-mono">{displayMetier}</p>
              </div>
              <span className="font-caveat text-sm text-[#F97316] font-bold">
                Sur-mesure ✨
              </span>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Message éditorial condensé */}
        <div ref={contentRef} className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200 shadow-2xs text-xs font-semibold text-[#0F172A]">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>À Propos &amp; Philosophie</span>
          </div>

          <h2 className="font-bebas text-3xl sm:text-4xl lg:text-5xl tracking-wide text-[#0F172A] leading-tight">
            CRÉER DES SUPPORTS QUI MARQUENT ET DES SITES QUI CONVERTISSENT.
          </h2>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-3xl">
            Pour développer votre activité, votre image et vos outils digitaux doivent inspirer confiance dès le premier regard. De la conception graphique au déploiement technique, je prends en charge votre présence en ligne pour transformer vos visiteurs en clients engagés.
          </p>
        </div>
      </div>

      {/* Rangée Inférieure : Les 3 Piliers en grille horizontale compacte avec illustrations sur-mesure */}
      <div
        ref={pillarsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5"
      >
        {pillars.map((pillar, idx) => {
          const { Illustration } = pillar;
          return (
            <SpotlightCard
              key={pillar.title}
              spotlightColor={pillar.glowColor}
              className={`bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group ${pillar.accentBorder}`}
            >
              <div>
                {/* Illustration visuelle dédiée */}
                <div className="p-2.5 pb-0 transition-transform duration-300 group-hover:scale-[1.02]">
                  <Illustration className="w-full h-24 sm:h-28 rounded-xl" />
                </div>

                {/* Contenu textuel concis */}
                <div className="p-4 sm:p-5 pt-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {pillar.tag}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-[#2563EB] transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0F172A] leading-snug group-hover:text-[#2563EB] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>

              <div className="px-4 sm:px-5 pb-4 pt-1 flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span>En savoir plus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
}
