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

export function SkillsSection() {
  const skillCategories = [
    {
      title: "Développement Frontend",
      icon: Code,
      description: "Interfaces web rapides, accessibles et réactives.",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5 / CSS3", "State Management"],
    },
    {
      title: "Backend & Architectures API",
      icon: Server,
      description: "Logique serveur robuste, bases relationnelles et sécurité.",
      skills: ["Laravel", "Node.js", "PostgreSQL", "Prisma ORM", "REST API", "Auth / JWT"],
    },
    {
      title: "Mobile & Multiplateforme",
      icon: Smartphone,
      description: "Applications mobiles fluides et expériences cross-platform.",
      skills: ["React Native", "Flutter", "PWA", "Responsive Web Design", "Optimisation tactile"],
    },
    {
      title: "UI/UX & Outils Créatifs",
      icon: Palette,
      description: "Prototypage interactif, design systems et médias.",
      skills: ["Figma", "Design System", "Canva", "Montage Vidéo", "UI Motion", "Direction Artistique"],
    },
  ];

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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[#0B132B] text-xs font-medium">
          <Terminal className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Expertises &amp; Savoir-faire</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B132B]">
          Compétences &amp; Technologies
        </h2>

        <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
          Une boîte à outils moderne orientée production, axée sur les technologies fiables du marché.
        </p>
      </div>

      {/* Grille des 4 pôles de compétences */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {skillCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.title}
              className="editorial-card p-6 flex flex-col justify-between bg-white border border-slate-200/90 rounded-2xl"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#0B132B] mb-2">{cat.title}</h3>
                <p className="text-xs text-[#64748B] mb-6 leading-relaxed">{cat.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/70 text-[#334155]"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-900/10">
        {corePrinciples.map((principle) => {
          const Icon = principle.icon;
          return (
            <div key={principle.title} className="space-y-2">
              <div className="flex items-center gap-2.5 text-blue-400 font-semibold text-sm">
                <Icon className="w-4 h-4" />
                <span>{principle.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {principle.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
