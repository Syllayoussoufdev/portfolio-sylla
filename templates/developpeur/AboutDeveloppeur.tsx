"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Compass,
  Code2,
  Sparkles,
  Layout,
  Palette,
  Zap,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import type { SiteSettingsData } from "@/lib/profiles";

interface AboutDeveloppeurProps {
  settings?: SiteSettingsData | null;
}

export function AboutDeveloppeur({ settings }: AboutDeveloppeurProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const photoCardRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const methodRef = useRef<HTMLDivElement>(null);
  const aiBlockRef = useRef<HTMLDivElement>(null);

  const displayName = settings?.nom || "Sylla Youssouf";
  const displayMetier = settings?.metier || "Développeur Web & Mobile";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Apparition du cadre photo avec léger spring
      if (photoCardRef.current) {
        gsap.fromTo(
          photoCardRef.current,
          { opacity: 0, y: 50, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "back.out(1.3)",
            scrollTrigger: {
              trigger: photoCardRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 2. Révélation échelonnée des textes
      if (textColRef.current) {
        gsap.fromTo(
          textColRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textColRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 3. Cascade des 4 étapes de méthode
      if (methodRef.current) {
        gsap.fromTo(
          methodRef.current.children,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: methodRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 4. Apparition du bloc L'apport du design et de l'IA
      if (aiBlockRef.current) {
        gsap.fromTo(
          aiBlockRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: aiBlockRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      num: "01",
      title: "Comprendre",
      description:
        "Cibler précisément les besoins métier, les parcours utilisateurs et les contraintes techniques avant toute écriture de code.",
    },
    {
      num: "02",
      title: "Concevoir",
      description:
        "Modélisation de base de données relationnelle, structuration d'API claire et prototypage d'interface ergonomique.",
    },
    {
      num: "03",
      title: "Développer",
      description:
        "Développement avec typage strict TypeScript, composants modulaires Next.js/React, logique serveur Laravel et tests ciblés.",
    },
    {
      num: "04",
      title: "Livrer",
      description:
        "Déploiement en production, optimisation des performances (Lighthouse), sécurité et transmission de documentation claire.",
    },
  ];

  const designAiPoints = [
    {
      icon: Layout,
      title: "Interfaces plus soignées",
      desc: "Typographie nette, hiérarchie visuelle lisible et contrastes scrupuleusement respectés pour une navigation fluide.",
    },
    {
      icon: Palette,
      title: "Cohérence visuelle",
      desc: "Composants harmonisés, micro-interactions discrètes et design system partagé sur l'ensemble de l'application.",
    },
    {
      icon: Zap,
      title: "Visuels & contenus produits plus vite avec l'IA",
      desc: "Itérations accélérées sur les maquettes et génération ciblée d'éléments visuels et d'assets d'accompagnement.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="a-propos"
      className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24 text-[#0B1B3A]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Colonne Gauche : Portrait en Cadre Stylisé & Badge */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div
            ref={photoCardRef}
            className="sticky top-28 relative w-full max-w-[380px] p-4 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-900/5 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Halo bleu subtil */}
            <div className="absolute inset-0 rounded-3xl bg-blue-500/5 blur-xl pointer-events-none" />

            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 mb-4">
              <Image
                src="/sylla.jpg"
                alt={`Présentation de ${displayName}`}
                fill
                sizes="(max-width: 768px) 100vw, 380px"
                className="object-cover object-top transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F6F7FB] border border-slate-200 shadow-2xs">
              <div>
                <span className="block text-[10px] font-mono text-[#64748B] uppercase tracking-wider">
                  Développeur Web &amp; Mobile
                </span>
                <span className="block text-sm font-bold text-[#0B1B3A]">
                  {displayName}
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F5BFF] flex items-center justify-center font-bold text-xs">
                SY
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Méthode en 4 étapes + Apport Design & IA */}
        <div className="lg:col-span-7 space-y-8">
          <div ref={textColRef} className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-[#2F5BFF] text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Méthode de Développement &amp; Vision</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1B3A] leading-tight">
              Construire des applications solides, avec la rigueur du code et le soin du design.
            </h2>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Développeur web et mobile, je conçois des plateformes fiables et maintenables. Chaque interface est affinée par ma formation en design graphique et enrichie par les technologies d&apos;intelligence artificielle.
            </p>
          </div>

          {/* Méthode en 4 étapes */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#64748B] block">
              Ma démarche en 4 étapes :
            </span>

            <div ref={methodRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {steps.map((step) => (
                <SpotlightCard
                  key={step.num}
                  spotlightColor="rgba(47, 91, 255, 0.12)"
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#2F5BFF]/40 transition-all duration-300 group cursor-default"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-[#2F5BFF] bg-blue-50 px-2 py-1 rounded-md border border-blue-100 shrink-0 group-hover:bg-[#2F5BFF] group-hover:text-white transition-colors">
                      {step.num}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-[#0B1B3A] group-hover:text-[#2F5BFF] transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs text-[#475569] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* Bloc « L'apport du design et de l'IA » */}
          <div
            ref={aiBlockRef}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5B83D]" />
              <h3 className="text-sm font-bold text-[#0B1B3A] uppercase tracking-wide">
                L&apos;apport du design et de l&apos;IA
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {designAiPoints.map((pt) => {
                const Icon = pt.icon;
                return (
                  <div key={pt.title} className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2F5BFF] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-[#0B1B3A] leading-snug">
                      {pt.title}
                    </h4>
                    <p className="text-[11px] text-[#475569] leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
