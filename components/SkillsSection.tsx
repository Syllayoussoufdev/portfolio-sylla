"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Code,
  Smartphone,
  Server,
  Palette,
  Film,
  Terminal,
  Cpu,
  ShieldCheck,
  Zap,
  BookOpen,
  Wrench,
} from "lucide-react";
import type { SkillCategoryWithSkills } from "@/lib/skills";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Server,
  Smartphone,
  Palette,
  Film,
  Terminal,
  Cpu,
};

interface SkillsSectionProps {
  categories?: SkillCategoryWithSkills[];
}

export function SkillsSection({ categories = [] }: SkillsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const principlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // 1. Apparition de l'en-tête au défilement
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

      // 2. Apparition des cartes de catégories avec effet cascade
      if (cardsGridRef.current) {
        const cards = cardsGridRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: cardsGridRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );

        // 3. Animation vivante des barres de compétences (remplissage progressif)
        const progressBars = cardsGridRef.current.querySelectorAll(".skill-progress-bar");
        progressBars.forEach((bar) => {
          gsap.fromTo(
            bar,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: bar,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        // 4. Pop-in échelonné des badges d'outils
        const toolBadges = cardsGridRef.current.querySelectorAll(".tool-badge");
        gsap.fromTo(
          toolBadges,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.03,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: cardsGridRef.current,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 5. Apparition du bandeau des principes fondamentaux
      if (principlesRef.current) {
        gsap.fromTo(
          principlesRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: principlesRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [categories]);

  const corePrinciples = [
    {
      title: "Rigueur & Performance",
      description: "Code propre, typé et optimisé pour des temps de chargement minimes.",
      icon: Zap,
    },
    {
      title: "Sécurité & Fiabilité",
      description: "Validation stricte des données entrantes, authentification et conformité.",
      icon: ShieldCheck,
    },
    {
      title: "Créativité Technologique",
      description: "Passerelle naturelle entre le design visuel et l'implémentation logicielle.",
      icon: Cpu,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="competences"
      className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24"
    >
      {/* En-tête de section animé */}
      <div ref={headerRef} className="space-y-3 mb-14 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] text-xs font-mono font-medium shadow-2xs">
          <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Expertises &amp; Savoir-faire</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
          Compétences &amp; Technologies
        </h2>

        <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
          Une boîte à outils moderne orientée production, adaptée à chaque domaine de spécialisation.
        </p>
      </div>

      {/* Grille des pôles de compétences filtrés pour ce sous-portfolio */}
      {categories.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[var(--surface)] border border-[var(--border)] max-w-md mx-auto mb-16">
          <Cpu className="w-8 h-8 text-[var(--accent)] mx-auto mb-2" />
          <p className="text-sm text-[var(--muted)]">
            Aucune compétence spécifique attribuée pour le moment.
          </p>
        </div>
      ) : (
        <div
          ref={cardsGridRef}
          className={`grid gap-7 mb-16 ${
            categories.length === 1
              ? "grid-cols-1 max-w-2xl mx-auto"
              : categories.length === 2
              ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
              : categories.length === 3
              ? "grid-cols-1 md:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {categories.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || Code;
            const competences = cat.skills.filter((s) => s.type === "COMPETENCE");
            const outils = cat.skills.filter((s) => s.type === "OUTIL");

            return (
              <div
                key={cat.id}
                className="editorial-card p-6 sm:p-7 flex flex-col justify-between bg-[var(--surface)] border border-[var(--border)] rounded-3xl transition-all duration-300 hover:border-[var(--accent)]/60 hover:shadow-2xl hover:shadow-black/5 group"
              >
                <div>
                  {/* Icône & Titre de la famille */}
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0 border border-[var(--accent)]/20 transition-transform duration-300 group-hover:scale-108 group-hover:rotate-3">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[var(--ink)] leading-snug group-hover:text-[var(--accent)] transition-colors">
                        {cat.titre}
                      </h3>
                      {cat.description && (
                        <p className="text-xs text-[var(--muted)] leading-relaxed mt-0.5">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 1. Savoir-faire & Compétences avec barres de progression animées */}
                  {competences.length > 0 && (
                    <div className="space-y-3 pt-3 pb-4 border-t border-[var(--border)]">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Savoir-faire ({competences.length})</span>
                      </div>
                      <div className="space-y-2.5">
                        {competences.map((c) => (
                          <div key={c.id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-[var(--ink)]">{c.nom}</span>
                              {c.niveau && (
                                <span className="text-[10px] font-mono text-[var(--accent)] font-bold">
                                  {c.niveau} {c.pourcentage ? `· ${c.pourcentage}%` : ""}
                                </span>
                              )}
                            </div>
                            {c.pourcentage !== null && (
                              <div className="w-full bg-[var(--bg)] h-1.5 rounded-full overflow-hidden border border-[var(--border)]/50">
                                <div
                                  className="skill-progress-bar bg-[var(--accent)] h-full rounded-full"
                                  style={{ width: `${c.pourcentage}%` }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Outils & Technologies de production */}
                  {outils.length > 0 && (
                    <div className="space-y-2.5 pt-3 border-t border-[var(--border)]">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--accent-2)] font-semibold uppercase tracking-wider">
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Outils &amp; Technologies</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {outils.map((tool) => (
                          <span
                            key={tool.id}
                            className="tool-badge text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--ink)] shadow-2xs hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-default"
                          >
                            {tool.nom}
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
      )}

      {/* Bandeau d'approche de travail / Principes avec animation échelonnée */}
      <div
        ref={principlesRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] shadow-xl shadow-black/5"
      >
        {corePrinciples.map((principle) => {
          const Icon = principle.icon;
          return (
            <div key={principle.title} className="space-y-2 group">
              <div className="flex items-center gap-2.5 text-[var(--accent)] font-semibold text-sm group-hover:translate-x-1 transition-transform">
                <Icon className="w-4 h-4" />
                <span>{principle.title}</span>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                {principle.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
