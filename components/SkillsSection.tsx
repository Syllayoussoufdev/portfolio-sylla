import React from "react";
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
    <section id="competences" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
      {/* En-tête de section */}
      <div className="space-y-3 mb-14 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] text-xs font-mono font-medium">
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
                className="editorial-card p-6 sm:p-7 flex flex-col justify-between bg-[var(--surface)] border border-[var(--border)] rounded-3xl transition-all duration-300 hover:border-[var(--accent)]/50 hover:shadow-xl hover:shadow-black/5"
              >
                <div>
                  {/* Icône & Titre de la famille */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0 border border-[var(--accent)]/20">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[var(--ink)] leading-snug">
                        {cat.titre}
                      </h3>
                      {cat.description && (
                        <p className="text-xs text-[var(--muted)] leading-relaxed mt-0.5">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 1. Savoir-faire & Compétences avec niveaux de maîtrise */}
                  {competences.length > 0 && (
                    <div className="space-y-2.5 pt-3 pb-4 border-t border-[var(--border)]">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
                        <BookOpen className="w-3 h-3" />
                        <span>Savoir-faire ({competences.length})</span>
                      </div>
                      <div className="space-y-2">
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
                              <div className="w-full bg-[var(--bg)] h-1 rounded-full overflow-hidden border border-[var(--border)]/50">
                                <div
                                  className="bg-[var(--accent)] h-full rounded-full transition-all duration-500"
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
                    <div className="space-y-2 pt-3 border-t border-[var(--border)]">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--accent-2)] font-semibold uppercase tracking-wider">
                        <Wrench className="w-3 h-3" />
                        <span>Outils &amp; Technologies</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {outils.map((tool) => (
                          <span
                            key={tool.id}
                            className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--ink)] shadow-2xs"
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

      {/* Bandeau d'approche de travail / Principes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] shadow-xl shadow-black/5">
        {corePrinciples.map((principle) => {
          const Icon = principle.icon;
          return (
            <div key={principle.title} className="space-y-2">
              <div className="flex items-center gap-2.5 text-[var(--accent)] font-semibold text-sm">
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
