"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ParcoursItemData } from "@/lib/parcours";
import {
  Compass,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  Layers,
  ExternalLink,
  MapPin,
  Building2,
} from "lucide-react";
import { GlassReliefTile } from "@/components/ui/GlassReliefTile";
import {
  Icon3DAIFormation,
  Icon3DUniversityDegree,
  Icon3DSoftwareEngineer,
  Icon3DScientificBac,
  Icon3DExperiencePro,
  Icon3DCertificationBadge,
} from "@/components/icons/Rich3DIcons";

type FilterTab = "all" | "experience" | "formation" | "certification";

const MONTHS_FR = [
  "Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin",
  "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."
];

function formatPeriode(item: ParcoursItemData): string {
  const debut = item.moisDebut
    ? `${MONTHS_FR[item.moisDebut - 1]} ${item.anneeDebut}`
    : `${item.anneeDebut}`;

  if (item.enCours) {
    return `${debut} – Aujourd'hui`;
  }

  if (item.anneeFin) {
    const fin = item.moisFin
      ? `${MONTHS_FR[item.moisFin - 1]} ${item.anneeFin}`
      : `${item.anneeFin}`;
    return `${debut} – ${fin}`;
  }

  return debut;
}

function renderParcours3DIcon(milestone: ParcoursItemData) {
  const t = (milestone.titre + " " + milestone.organisme).toLowerCase();

  if (t.includes("ia") || t.includes("simplon") || t.includes("prompt")) {
    return <Icon3DAIFormation className="w-5 h-5" />;
  }
  if (t.includes("licence") || t.includes("pigier") || t.includes("master")) {
    return <Icon3DUniversityDegree className="w-5 h-5" />;
  }
  if (t.includes("bts") || t.includes("application") || t.includes("isfmi") || t.includes("développeur")) {
    return <Icon3DSoftwareEngineer className="w-5 h-5" />;
  }
  if (t.includes("baccalauréat") || t.includes("lycée") || t.includes("bac")) {
    return <Icon3DScientificBac className="w-5 h-5" />;
  }
  if (milestone.type === "experience") {
    return <Icon3DExperiencePro className="w-5 h-5" />;
  }
  if (milestone.type === "certification") {
    return <Icon3DCertificationBadge className="w-5 h-5" />;
  }
  return <Icon3DUniversityDegree className="w-5 h-5" />;
}

interface ParcoursSectionProps {
  items?: ParcoursItemData[];
}

export function ParcoursSection({ items = [] }: ParcoursSectionProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);

  // Filtrage réactif selon l'onglet actif
  const displayedMilestones = useMemo(() => {
    if (activeTab === "all") return items;
    return items.filter((m) => m.type === activeTab);
  }, [items, activeTab]);

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
        const itemNodes = timelineRef.current.querySelectorAll(".parcours-step");
        itemNodes.forEach((node) => {
          const dot = node.querySelector(".parcours-dot");
          const date = node.querySelector(".parcours-date");
          const card = node.querySelector(".parcours-card");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: node,
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
              { opacity: 0, y: 25, scale: 0.98 },
              { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" },
              "-=0.3"
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [displayedMilestones]);

  const tabs: { key: FilterTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "all", label: "Tous les jalons", icon: Compass },
    { key: "experience", label: "Expériences", icon: Briefcase },
    { key: "formation", label: "Formations", icon: GraduationCap },
    { key: "certification", label: "Certifications", icon: Award },
  ];

  return (
    <section
      ref={sectionRef}
      id="parcours"
      className="py-24 px-4 sm:px-6 max-w-5xl mx-auto scroll-mt-24"
    >
      {/* En-tête de section avec onglets de filtrage */}
      <div ref={headerRef} className="space-y-4 mb-16 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-slate-200 text-[#0F172A] text-xs font-mono font-medium shadow-2xs">
          <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Évolution &amp; Trajectoire</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
          Mon Parcours &amp; Expériences
        </h2>

        <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
          Une trajectoire alliant rigueur universitaire, veille continue sur l'IA et réalisations concrètes sur le terrain.
        </p>

        {/* Boutons de filtrage dynamiques */}
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
                    : "bg-white/80 backdrop-blur-xs border border-slate-200 text-[#475569] hover:bg-white hover:text-[#0F172A]"
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
      <div ref={timelineRef} className="relative ml-4 sm:ml-36 space-y-10">
        {/* Ligne d'arrière-plan statique */}
        <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-slate-200/80" />

        {/* Ligne animée active au scroll */}
        <div
          ref={lineFillRef}
          className="absolute left-0 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#2563EB] via-[#8B5CF6] to-[#F97316] will-change-transform origin-top"
        />

        {displayedMilestones.length === 0 ? (
          <div className="p-8 text-center bg-white/60 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
            Aucun élément répertorié dans cette catégorie pour ce profil.
          </div>
        ) : (
          displayedMilestones.map((milestone) => {
            const isExp = milestone.type === "experience";
            const isFormation = milestone.type === "formation";
            const isCert = milestone.type === "certification";

            const dotColor = milestone.enCours
              ? "bg-[#F97316] ring-4 ring-orange-100"
              : isFormation
              ? "bg-[#8B5CF6] ring-2 ring-purple-100"
              : isCert
              ? "bg-[#10B981] ring-2 ring-emerald-100"
              : "bg-[#2563EB] ring-2 ring-blue-100";

            const glowColor = milestone.enCours
              ? "rgba(249, 115, 22, 0.22)"
              : isFormation
              ? "rgba(139, 92, 246, 0.22)"
              : isCert
              ? "rgba(16, 185, 129, 0.22)"
              : "rgba(37, 99, 235, 0.22)";

            const periodeStr = formatPeriode(milestone);

            return (
              <div key={milestone.id} className="parcours-step relative pl-8 sm:pl-10 group">
                {/* Point de repère sur l'axe */}
                <span
                  className={`parcours-dot absolute -left-[7px] top-2.5 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-transform duration-300 group-hover:scale-125 ${dotColor}`}
                />

                {/* Période affichée à gauche sur grand écran */}
                <div className="parcours-date hidden sm:block absolute -left-36 top-1.5 w-28 text-right">
                  <span
                    className={`text-xs font-mono font-bold block ${
                      milestone.enCours ? "text-[#F97316]" : "text-[#0F172A]"
                    }`}
                  >
                    {periodeStr}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
                    {isExp ? "Expérience" : isFormation ? "Diplôme" : "Certification"}
                  </span>
                </div>

                {/* Carte éditoriale en verre givré */}
                <div className="parcours-card p-6 bg-white/70 backdrop-blur-md border border-white/90 rounded-2xl space-y-3.5 shadow-sm hover:border-[#2563EB]/40 hover:shadow-md transition-all duration-300">
                  {/* Badge mobile pour la date */}
                  <div className="sm:hidden flex items-center justify-between gap-2 text-xs font-mono font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-[#2563EB]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{periodeStr}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {isExp ? "Expérience" : isFormation ? "Diplôme" : "Certification"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <GlassReliefTile
                        size="sm"
                        glowColor={glowColor}
                        className="shrink-0"
                      >
                        {renderParcours3DIcon(milestone)}
                      </GlassReliefTile>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug">
                          {milestone.titre}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-[#475569] font-medium mt-0.5">
                          <span className="flex items-center gap-1 text-[#0F172A] font-semibold">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {milestone.organisme}
                          </span>
                          {milestone.lieu && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <MapPin className="w-3 h-3" />
                              {milestone.lieu}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0 mt-1 sm:mt-0">
                      {milestone.badge && (
                        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/60">
                          {milestone.badge}
                        </span>
                      )}

                      {milestone.enCours && (
                        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-[#F97316] border border-orange-200">
                          En cours
                        </span>
                      )}
                    </div>
                  </div>

                  {milestone.description && (
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      {milestone.description}
                    </p>
                  )}

                  {/* Compétences / Tags associés */}
                  {milestone.tags && milestone.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {milestone.tags.map((tag, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {milestone.url && (
                    <div className="pt-1">
                      <a
                        href={milestone.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
                      >
                        <span>En savoir plus / Certificat</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
