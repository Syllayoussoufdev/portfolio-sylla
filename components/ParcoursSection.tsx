"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPERIENCES } from "@/content/experience";
import { Compass, Calendar } from "lucide-react";

export function ParcoursSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Révélation de l'en-tête de section
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

      // 2. Traçage progressif de la ligne de timeline au scroll scrub
      if (timelineRef.current && lineFillRef.current) {
        gsap.fromTo(
          lineFillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
              end: "bottom 85%",
              scrub: 0.6,
            },
          }
        );
      }

      // 3. Apparition échelonnée de chaque étape du parcours
      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll(".parcours-step");
        items.forEach((item) => {
          const dot = item.querySelector(".parcours-dot");
          const date = item.querySelector(".parcours-date");
          const card = item.querySelector(".parcours-card");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });

          if (dot) {
            tl.fromTo(
              dot,
              { scale: 0, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.5)" }
            );
          }

          if (date) {
            tl.fromTo(
              date,
              { opacity: 0, x: -20 },
              { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
              "-=0.3"
            );
          }

          if (card) {
            tl.fromTo(
              card,
              { opacity: 0, x: 40, y: 15 },
              { opacity: 1, x: 0, y: 0, duration: 0.7, ease: "power3.out" },
              "-=0.4"
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="parcours"
      className="py-24 px-4 sm:px-6 max-w-5xl mx-auto scroll-mt-24 relative"
    >
      {/* En-tête de section */}
      <div ref={headerRef} className="space-y-3 mb-16 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200/80 text-[var(--ink)] text-xs font-medium">
          <Compass className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Trajectoire &amp; Expériences</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
          Parcours &amp; Évolutions
        </h2>

        <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
          Les étapes clés qui forgent ma double expertise en communication visuelle et en ingénierie logicielle.
        </p>
      </div>

      {/* Timeline chronologique avec ligne traçante */}
      <div ref={timelineRef} className="relative ml-4 sm:ml-32 space-y-12">
        {/* Ligne d'arrière-plan statique */}
        <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-slate-200/70" />

        {/* Ligne animée active au scroll */}
        <div
          ref={lineFillRef}
          className="absolute left-0 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#2563EB] to-[#F97316] will-change-transform origin-top"
        />

        {EXPERIENCES.map((exp) => (
          <div key={exp.id} className="parcours-step relative pl-8 sm:pl-10 group">
            {/* Point de repère sur l'axe : bleu pour le passé, orange pour l'étape active */}
            <span
              className={`parcours-dot absolute -left-[7px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-transform duration-300 group-hover:scale-125 ${
                exp.current
                  ? "bg-[var(--accent-2)] ring-4 ring-orange-100"
                  : "bg-[var(--accent)] ring-2 ring-blue-50"
              }`}
            />

            {/* Période affichée à gauche sur grand écran */}
            <div className="parcours-date hidden sm:block absolute -left-32 top-1 w-24 text-right">
              <span
                className={`text-xs font-mono font-semibold ${
                  exp.current ? "text-[var(--accent-2)]" : "text-[var(--subtle)]"
                }`}
              >
                {exp.periode}
              </span>
            </div>

            {/* Carte éditoriale de l'étape */}
            <div className="parcours-card editorial-card p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl space-y-2 hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-300">
              <div className="sm:hidden flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--accent)] mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{exp.periode}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-base font-bold text-[var(--ink)]">{exp.role}</h3>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] w-fit">
                  {exp.contexte}
                </span>
              </div>

              <p className="text-sm text-[var(--muted)] leading-relaxed pt-1">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
