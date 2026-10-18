"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  useReducedMotion,
  useMagnetic,
  revealElement,
  revealList,
  splitTextWords,
  createScrollProgressTrigger,
} from "@/lib/motion";
import { Scene3D } from "@/components/3d/Scene3D";
import { ArrowLeft, Sparkles, Move, Eye, Zap, Layers, Activity } from "lucide-react";

export default function MotionDemoPage() {
  // Page strictement réservée aux environnements de développement
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const isReduced = useReducedMotion();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedShape, setSelectedShape] = useState<"icosahedron" | "torus" | "abstract">(
    "icosahedron"
  );
  const [simulateNoWebGL, setSimulateNoWebGL] = useState(false);

  // Références d'éléments pour les tests de mouvement
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Hook magnétique sur le bouton
  const magneticButtonRef = useMagnetic<HTMLButtonElement>(0.35, 10);
  const magneticLinkRef = useMagnetic<HTMLAnchorElement>(0.35, 10);

  // Test de SplitText et apparitions GSAP
  useEffect(() => {
    if (titleRef.current) {
      const words = splitTextWords(titleRef.current);
      revealList(words, {
        duration: 0.8,
        stagger: 0.06,
        y: 20,
      });
    }

    if (cardsContainerRef.current) {
      const cards = cardsContainerRef.current.querySelectorAll<HTMLElement>(".demo-card");
      revealList(cards, {
        duration: 0.7,
        stagger: 0.1,
        y: 30,
        trigger: cardsContainerRef.current,
      });
    }

    if (trackRef.current) {
      const trigger = createScrollProgressTrigger(trackRef.current, (progress) => {
        setScrollProgress(Math.round(progress * 100));
      });

      return () => {
        trigger?.kill();
      };
    }
  }, []);

  return (
    <div className="min-h-[220vh] bg-[#F8FAFC] text-[#0B132B] px-4 sm:px-8 py-12 max-w-5xl mx-auto space-y-16">
      {/* En-tête de la démo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#475569] hover:text-[#2563EB] mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l&apos;accueil</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-[#0B132B]">
              Laboratoire de Mouvement &amp; 3D
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Dev Only
            </span>
          </div>
        </div>

        {/* Indicateur prefers-reduced-motion */}
        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <Activity className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Reduced Motion : </span>
          <span
            className={`font-semibold ${
              isReduced ? "text-amber-600" : "text-emerald-600"
            }`}
          >
            {isReduced ? "ACTIF (animations coupées)" : "DÉSACTIF (animations fluides)"}
          </span>
        </div>
      </div>

      {/* Démo 1 : Révélation de texte découpé (SplitText) */}
      <section className="space-y-4 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#2563EB]">
          <Zap className="w-4 h-4" />
          <span>1. Découpage de texte et révélation mot à mot</span>
        </div>

        <h2
          ref={titleRef}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B132B] leading-tight"
        >
          Des interfaces réactives qui allient précision géométrique et performances sans compromis.
        </h2>

        <p className="text-xs text-[#64748B] font-mono">
          Chaque mot est masqué et glisse avec une courbe power3.out échelonnée (stagger).
        </p>
      </section>

      {/* Démo 2 : Effet d'attraction magnétique */}
      <section className="space-y-6 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#2563EB]">
          <Move className="w-4 h-4" />
          <span>2. Micro-interactions magnétiques (useMagnetic ≤ 8px)</span>
        </div>

        <p className="text-sm text-[#475569] max-w-xl">
          Passez votre curseur à proximité des boutons pour observer la force d&apos;attraction subtile
          vers le pointeur avec restitution élastique au départ.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            ref={magneticButtonRef}
            type="button"
            className="px-6 py-3.5 rounded-full bg-[#0B132B] hover:bg-[#1E293B] text-white text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Bouton magnétique principal
          </button>

          <a
            ref={magneticLinkRef}
            href="#scene-3d"
            className="px-6 py-3.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-semibold border border-blue-200 shadow-2xs active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vers la scène 3D</span>
          </a>
        </div>
      </section>

      {/* Démo 3 : Scène 3D autonome chargée à la demande */}
      <section id="scene-3d" className="space-y-6 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#2563EB]">
            <Eye className="w-4 h-4" />
            <span>3. Composant 3D à la demande avec pause hors-écran &amp; repli</span>
          </div>

          {/* Sélecteur de forme et toggle WebGL */}
          <div className="flex flex-wrap items-center gap-2">
            {(["icosahedron", "torus", "abstract"] as const).map((shape) => (
              <button
                type="button"
                key={shape}
                onClick={() => setSelectedShape(shape)}
                className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-colors cursor-pointer ${
                  selectedShape === shape
                    ? "bg-[#0B132B] text-white"
                    : "bg-slate-100 text-[#475569] hover:bg-slate-200"
                }`}
              >
                {shape}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setSimulateNoWebGL(!simulateNoWebGL)}
              className="px-3 py-1 rounded-lg text-xs font-mono bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 cursor-pointer"
            >
              {simulateNoWebGL ? "Désactiver simulation sans WebGL" : "Simuler WebGL absent"}
            </button>
          </div>
        </div>

        <div className="h-80 w-full rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-4 relative overflow-hidden flex items-center justify-center">
          {simulateNoWebGL ? (
            <div className="text-center text-slate-400 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs font-mono text-white">Repli WebGL simulé activé</p>
              <p className="text-[11px] text-slate-400">Le dispositif reste net sans planter</p>
            </div>
          ) : (
            <Scene3D
              shape={selectedShape}
              color={selectedShape === "abstract" ? "#7C5CFF" : "#2563EB"}
              wireframe={selectedShape !== "abstract"}
              speed={1.2}
            />
          )}
        </div>

        <p className="text-xs text-[#64748B] font-mono leading-relaxed">
          Le calcul GPU est automatiquement stoppé dès que ce cadre sort de la fenêtre grâce à
          l&apos;IntersectionObserver. DPR plafonné à 1.5 sur grand écran et 1 sur mobile.
        </p>
      </section>

      {/* Démo 4 : Suivi de progression au défilement (ScrollTrigger) */}
      <section
        ref={trackRef}
        className="space-y-6 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#2563EB]">
            <Layers className="w-4 h-4" />
            <span>4. Suivi de progression ScrollTrigger</span>
          </div>

          <span className="font-mono text-sm font-bold text-[#0B132B]">
            {scrollProgress}%
          </span>
        </div>

        {/* Barre de progression */}
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200/80">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-75 ease-out rounded-full"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <p className="text-xs text-[#64748B] font-mono">
          Faites défiler la page pour voir la progression synchronisée avec Lenis et ScrollTrigger.
        </p>
      </section>

      {/* Démo 5 : Apparition échelonnée d'éléments */}
      <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[
          { title: "Performance Défilement", val: "60 FPS avec Lenis" },
          { title: "Zéro Décalage (CLS)", val: "Dimensions réservées" },
          { title: "Mémoire Propre", val: "Dispose Three.js & Kill GSAP" },
        ].map((item, idx) => (
          <div
            key={item.title}
            className="demo-card p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2"
          >
            <span className="text-xs font-mono text-[#2563EB]">0{idx + 1}</span>
            <h3 className="text-base font-bold text-[#0B132B]">{item.title}</h3>
            <p className="text-xs text-[#64748B] font-mono">{item.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
