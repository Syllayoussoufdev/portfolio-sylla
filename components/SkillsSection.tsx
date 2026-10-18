import React from "react";
import {
  Code,
  Smartphone,
  Server,
  Palette,
  Terminal,
  Cpu,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { MASTER_SKILL_CATEGORIES } from "@/lib/constants/skills";

interface SkillsSectionProps {
  skillsFamilies?: string[];
}

const ICON_MAP = {
  Code,
  Server,
  Smartphone,
  Palette,
  Terminal,
};

export function SkillsSection({ skillsFamilies }: SkillsSectionProps) {
  // Filtrage selon les familles choisies pour ce profil / sous-portfolio
  const displayCategories = React.useMemo(() => {
    if (!skillsFamilies || skillsFamilies.length === 0) {
      return MASTER_SKILL_CATEGORIES;
    }
    return MASTER_SKILL_CATEGORIES.filter((cat) =>
      skillsFamilies.includes(cat.id)
    );
  }, [skillsFamilies]);

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
          Une boîte à outils moderne orientée production, axée sur les technologies fiables du marché.
        </p>
      </div>

      {/* Grille des pôles de compétences filtrés par sous-portfolio */}
      <div
        className={`grid gap-6 mb-16 ${
          displayCategories.length === 1
            ? "grid-cols-1 max-w-md mx-auto"
            : displayCategories.length === 2
            ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
            : displayCategories.length === 3
            ? "grid-cols-1 md:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {displayCategories.map((cat) => {
          const Icon = ICON_MAP[cat.iconName] || Terminal;
          return (
            <div
              key={cat.id}
              className="editorial-card p-6 flex flex-col justify-between bg-[var(--surface)] border border-[var(--border)] rounded-2xl transition-all hover:border-[var(--accent)]/50"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[var(--ink)] mb-2">{cat.title}</h3>
                <p className="text-xs text-[var(--muted)] mb-6 leading-relaxed">{cat.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--border)]">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[var(--bg)] border border-[var(--border)] text-[var(--ink)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

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
