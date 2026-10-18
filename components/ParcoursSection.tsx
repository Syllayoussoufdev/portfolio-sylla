import React from "react";
import { EXPERIENCES } from "@/content/experience";
import { Compass, Calendar } from "lucide-react";

export function ParcoursSection() {
  return (
    <section id="parcours" className="py-24 px-4 sm:px-6 max-w-5xl mx-auto scroll-mt-24">
      {/* En-tête de section */}
      <div className="space-y-3 mb-16 text-center max-w-2xl mx-auto">
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

      {/* Timeline chronologique */}
      <div className="relative border-l-2 border-slate-200/80 ml-4 sm:ml-32 space-y-12">
        {EXPERIENCES.map((exp) => (
          <div key={exp.id} className="relative pl-8 sm:pl-10 group">
            {/* Point de repère sur l'axe : bleu pour le passé, orange pour l'étape active */}
            <span
              className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-125 ${
                exp.current
                  ? "bg-[var(--accent-2)] ring-4 ring-orange-100"
                  : "bg-[var(--accent)] ring-2 ring-blue-50"
              }`}
            />

            {/* Période affichée à gauche sur grand écran */}
            <div className="hidden sm:block absolute -left-32 top-1 w-24 text-right">
              <span
                className={`text-xs font-mono font-semibold ${
                  exp.current ? "text-[var(--accent-2)]" : "text-[var(--subtle)]"
                }`}
              >
                {exp.periode}
              </span>
            </div>

            {/* Carte éditoriale de l'étape */}
            <div className="editorial-card p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl space-y-2">
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
