"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Palette, Code2, Rocket } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
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
  const displayMetier = settings?.metier || "Expert Communication & Développeur Web";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Animation du polaroid gauche (décrochement dynamique avec spring)
      if (polaroidRef.current) {
        gsap.fromTo(
          polaroidRef.current,
          { opacity: 0, y: 60, scale: 0.92, rotate: -6 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: -2,
            duration: 1,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: polaroidRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 2. Révélation échelonnée des textes éditoriaux
      if (contentRef.current) {
        const textElements = contentRef.current.querySelectorAll(".about-reveal");
        gsap.fromTo(
          textElements,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 3. Cascade dynamique des 3 piliers en verre givré
      if (pillarsRef.current) {
        const pillarCards = pillarsRef.current.children;
        gsap.fromTo(
          pillarCards,
          { opacity: 0, x: 40, y: 20 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
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
      title: "1. Identité visuelle & Supports de communication",
      desc: "Création de chartes graphiques complètes, affiches, flyers, bannières et maquettes d'interfaces Figma UI/UX conçues pour professionnaliser l'image de votre marque.",
      icon: Palette,
      color: "#F97316",
    },
    {
      title: "2. Stratégie de contenu & Visibilité",
      desc: "Production de visuels percutants, animation de vos réseaux et supports marketing ciblés pour capter l'attention de vos prospects et valoriser votre offre.",
      icon: Sparkles,
      color: "#8B5CF6",
    },
    {
      title: "3. Conception & Développement web",
      desc: "Sites vitrines et applications web modernes (Next.js, React, Laravel), rapides, sécurisés et optimisés pour le référencement naturel et la conversion.",
      icon: Code2,
      color: "#2563EB",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="a-propos"
      className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24 relative"
    >
      {/* Orbe lumineuse subtile */}
      <div className="absolute top-1/2 right-10 w-80 h-80 rounded-full bg-[#F97316] opacity-15 blur-[100px] pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Colonne Gauche : Cadre Polaroid Créatif avec Pin et Annotation */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div
            ref={polaroidRef}
            className="relative p-3 pb-10 bg-white rounded-3xl shadow-2xl border-2 border-white transform -rotate-2 hover:rotate-0 hover:scale-[1.02] transition-all duration-300 max-w-sm w-full cursor-default"
          >
            {/* Effet Scotch / Tape en haut */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-100/90 backdrop-blur-xs border border-amber-200/70 rotate-1 rounded-sm shadow-xs z-10" />

            <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-slate-900">
              <Image
                src="/sylla.jpg"
                alt={`${displayName} au studio`}
                fill
                sizes="(max-width: 1024px) 100vw, 380px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div className="pt-4 px-2 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">{displayName}</h3>
                <p className="text-xs text-[#64748B] font-mono">{displayMetier}</p>
              </div>
              <span className="font-caveat text-base text-[#F97316] font-bold">
                De l'idée au déploiement
              </span>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Démarche et Piliers en Verre Givré */}
        <div ref={contentRef} className="lg:col-span-7 space-y-6">
          <div className="about-reveal inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass border border-white/80 shadow-xs text-xs font-semibold text-[#0F172A]">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>À Propos &amp; Philosophie de Création</span>
          </div>

          <h2 className="about-reveal font-bebas text-4xl sm:text-5xl lg:text-6xl tracking-wide text-[#0F172A] leading-tight">
            CRÉER DES SUPPORTS QUI MARQUENT ET DES SITES QUI CONVERTISSENT.
          </h2>

          <p className="about-reveal text-base text-[#475569] leading-relaxed">
            Pour développer votre activité, votre image et vos outils digitaux doivent inspirer confiance dès le premier regard. Je conçois des supports visuels professionnels et développe des sites rapides, fiables et pensés pour transformer vos visiteurs en clients.
          </p>

          {/* Les 3 piliers créatifs en cartes de verre interactives */}
          <div ref={pillarsRef} className="space-y-3.5 pt-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              const glowColor =
                pillar.color === "#F97316"
                  ? "rgba(249, 115, 22, 0.18)"
                  : pillar.color === "#2563EB"
                  ? "rgba(37, 99, 235, 0.18)"
                  : "rgba(139, 92, 246, 0.18)";
              return (
                <SpotlightCard
                  key={pillar.title}
                  spotlightColor={glowColor}
                  className="glass p-5 rounded-2xl border border-white/80 shadow-sm hover:border-[#2563EB]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4 group cursor-default"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-white group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: pillar.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A] mb-1 group-hover:text-[#2563EB] transition-colors">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-[#64748B] leading-relaxed">{pillar.desc}</p>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
