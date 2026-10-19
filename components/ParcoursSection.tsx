"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  PARCOURS_CHRONOLOGIQUE,
  CERTIFICATIONS,
  ExperienceMilestone,
} from "@/content/experience";
import {
  Compass,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  Layers,
} from "lucide-react";

type FilterTab = "all" | "experience" | "formation" | "certification";

export function ParcoursSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<FilterTab>("formation");

  const displayedMilestones = useMemo(() => {
    if (activeTab === "all") return PARCOURS_CHRONOLOGIQUE;
    if (activeTab === "experience")
      return PARCOURS_CHRONOLOGIQUE.filter((m) => m.type === "experience");
    if (activeTab === "formation")
      return PARCOURS_CHRONOLOGIQUE.filter((m) => m.type === "formation");
    if (activeTab === "certification") return CERTIFICATIONS;
    return PARCOURS_CHRONOLOGIQUE;
  }, [activeTab]);

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
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });

          if (dot) {
            tl.fromTo(
              dot,
              { scale: 0, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2.5)" }
            );
          }

          if (date) {
            tl.fromTo(
              date,
              { opacity: 0, x: -15 },
              { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
              "-=0.25"
            );
          }

          if (card) {
            tl.fromTo(
              card,
              { opacity: 0, x: 30, y: 15 },
              { opacity: 1, x: 0, y: 0, duration: 0.6, ease: "power3.out" },
              "-=0.3"
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [displayedMilestones]);

  const tabs: { key: FilterTab; label: string; icon: React.ElementType }[] = [
    { key: "formation", label: "Diplômes & Formations", icon: GraduationCap },
    { key: "experience", label: "Expériences Pro", icon: Briefcase },
    { key: "all", label: "Vue Chronologique Complète", icon: Layers },
    { key: "certification", label: "Certifications", icon: Award },
  ];

  return (
    <section
      ref={sectionRef}
      id="parcours"
      className="py-24 px-4 sm:px-6 max-w-5xl mx-auto scroll-mt-24 relative"
    >
      {/* En-tête de section */}
      <div ref={headerRef} className="space-y-4 mb-12 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100/80 border border-slate-200/80 text-[var(--ink)] text-xs font-medium">
          <Compass className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Trajectoire, Diplômes &amp; Expériences</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--ink)]">
          Parcours &amp; Évolutions
        </h2>

        <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
          Les étapes clés qui forgent ma double expertise en communication visuelle, conception graphique et ingénierie logicielle.
        </p>

        {/* Sélecteur de filtres / Onglets */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20 scale-102"
                    : "bg-white/80 border border-slate-200 text-[#475569] hover:bg-white hover:text-[#0F172A]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline chronologique avec ligne traçante */}
      <div ref={timelineRef} className="relative ml-4 sm:ml-32 space-y-10">
        {/* Ligne d'arrière-plan statique */}
        <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-slate-200/70" />

        {/* Ligne animée active au scroll */}
        <div
          ref={lineFillRef}
          className="absolute left-0 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#2563EB] via-[#8B5CF6] to-[#F97316] will-change-transform origin-top"
        />

        {displayedMilestones.map((milestone) => {
          const isExp = milestone.type === "experience";
          const isFormation = milestone.type === "formation";
          const isCert = milestone.type === "certification";

          const IconComponent = isExp
            ? Briefcase
            : isFormation
            ? GraduationCap
            : Award;

          const dotColor = milestone.current
            ? "bg-[#F97316] ring-4 ring-orange-100"
            : isFormation
            ? "bg-[#8B5CF6] ring-2 ring-purple-50"
            : isCert
            ? "bg-[#10B981] ring-2 ring-emerald-50"
            : "bg-[#2563EB] ring-2 ring-blue-50";

          return (
            <div key={milestone.id} className="parcours-step relative pl-8 sm:pl-10 group">
              {/* Point de repère sur l'axe avec icône miniature */}
              <span
                className={`parcours-dot absolute -left-[7px] top-2 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-transform duration-300 group-hover:scale-125 ${dotColor}`}
              />

              {/* Période affichée à gauche sur grand écran */}
              <div className="parcours-date hidden sm:block absolute -left-32 top-1.5 w-24 text-right">
                <span
                  className={`text-xs font-mono font-semibold block ${
                    milestone.current ? "text-[#F97316]" : "text-[var(--subtle)]"
                  }`}
                >
                  {milestone.periode}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
                  {isExp ? "Expérience" : isFormation ? "Diplôme" : "Certificat"}
                </span>
              </div>

              {/* Carte éditoriale de l'étape */}
              <div className="parcours-card editorial-card p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl space-y-3 hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-300">
                <div className="sm:hidden flex items-center justify-between gap-2 text-xs font-mono font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-[var(--accent)]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{milestone.periode}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {isExp ? "Expérience" : isFormation ? "Diplôme" : "Certificat"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <IconComponent className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--ink)] leading-snug">
                      {milestone.role}
                    </h3>
                  </div>

                  {milestone.badge ? (
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60 w-fit self-start sm:self-auto shrink-0">
                      {milestone.badge}
                    </span>
                  ) : (
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] w-fit self-start sm:self-auto shrink-0">
                      {milestone.contexte}
                    </span>
                  )}
                </div>

                {milestone.badge && (
                  <p className="text-xs font-mono text-[#2563EB] font-medium">
                    {milestone.contexte}
                  </p>
                )}

                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {milestone.description}
                </p>

                {/* Modules et compétences spécifiques (ex: Simplon IA Product Creator) */}
                {milestone.modules && milestone.modules.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ink)]">
                      <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                      <span>Modules &amp; Compétences du programme :</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {milestone.modules.map((mod) => (
                        <span
                          key={mod}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/70"
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
