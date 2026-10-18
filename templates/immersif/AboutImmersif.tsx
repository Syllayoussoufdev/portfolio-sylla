"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Film, Sparkles, Video, Play, Compass } from "lucide-react";
import type { SiteSettingsData } from "@/lib/profiles";

interface AboutImmersifProps {
  settings?: SiteSettingsData | null;
}

export function AboutImmersif({ settings }: AboutImmersifProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  const displayName = settings?.nom || "Sylla Youssouf";
  const displayMetier = settings?.metier || "Directeur Créatif & Créateur Multimédia";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Colonne média gauche
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current.children,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "back.out(1.3)",
            scrollTrigger: {
              trigger: leftColRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 2. Textes éditoriaux
      if (textColRef.current) {
        gsap.fromTo(
          textColRef.current.children,
          { opacity: 0, y: 35 },
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

      // 3. Piliers narratifs
      if (pillarsRef.current) {
        gsap.fromTo(
          pillarsRef.current.children,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
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

  return (
    <section
      ref={sectionRef}
      id="a-propos"
      className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24 text-slate-100 relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Colonne Gauche : Composition Visuelle & Écrans Médias (Style Image 3) */}
        <div ref={leftColRef} className="lg:col-span-5 relative space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-purple-950/20 shadow-2xl p-2.5">
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-900">
              <Image
                src="/sylla.jpg"
                alt={`${displayName} au studio créatif`}
                fill
                sizes="400px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                <div>
                  <span className="text-[11px] font-mono text-purple-300 block uppercase tracking-wider">
                    Creative Direction
                  </span>
                  <h3 className="text-base font-syne font-bold text-white">{displayName}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Vignette secondaire de production visuelle */}
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 backdrop-blur-md flex items-center justify-between hover:border-purple-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 text-pink-400 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Production &amp; Motion</span>
                <span className="text-[11px] text-slate-400 font-mono">Montage, Cadrage &amp; 3D</span>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              4K Studio
            </span>
          </div>
        </div>

        {/* Colonne Droite : Philosophie de Création Immersive (Style Image 3) */}
        <div className="lg:col-span-7 space-y-6">
          <div ref={textColRef} className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-mono font-medium">
              <Compass className="w-3.5 h-3.5" />
              <span>Vision Créative &amp; Récit Numérique</span>
            </div>

            <h2 className="font-syne text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Designing Digital Experiences That People Love: Simple, Useful &amp; Memorable.
            </h2>

            <p className="text-base text-slate-300 leading-relaxed font-light">
              À la croisée de l&apos;audiovisuel, du design d&apos;interface et de la 3D interactive,
              je façonne des expériences narratives qui captivent l&apos;attention et transforment
              une simple marque en un souvenir durable.
            </p>
          </div>

          <div ref={pillarsRef} className="space-y-3 pt-2">
            {[
              {
                title: "Direction Artistique & Identité",
                desc: "Création d'univers graphiques singuliers, typographies sur-mesure et chartes multimédias.",
                color: "from-purple-500 to-indigo-600",
              },
              {
                title: "Montage Vidéo & Motion Design",
                desc: "Rythme cinématique, effets sonores, teasers percutants et animations vectorielles 2D.",
                color: "from-pink-500 to-rose-600",
              },
              {
                title: "Expériences Interactives 3D",
                desc: "Intégration WebGL fluide, animations spatiales et interfaces de nouvelle génération.",
                color: "from-violet-500 to-purple-600",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/20 backdrop-blur-md space-y-1 hover:border-purple-500/50 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                <h4 className="text-sm font-syne font-bold text-white flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${p.color}`} />
                  <span>{p.title}</span>
                </h4>
                <p className="text-xs text-slate-400 pl-4 leading-relaxed font-mono">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
