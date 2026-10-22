"use client";

import React, { useState, useTransition } from "react";
import {
  Code,
  Server,
  Smartphone,
  Palette,
  Film,
  Terminal,
  Cpu,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
  Wrench,
  BookOpen,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  createSkillCategoryAction,
  deleteSkillCategoryAction,
  createSkillAction,
  deleteSkillAction,
  updateCategorySubPortfoliosAction,
} from "@/app/admin/actions/skills";
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

interface CompetencesClientProps {
  categories: SkillCategoryWithSkills[];
  subPortfolios: { id: string; label: string; slug: string }[];
}

export function CompetencesClient({
  categories,
  subPortfolios,
}: CompetencesClientProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal d'ajout de catégorie
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // État local pour le formulaire d'ajout rapide par catégorie
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    categories[0]?.id || null
  );

  // Statistiques globales
  const totalCategories = categories.length;
  const allSkills = categories.flatMap((c) => c.skills);
  const totalCompetences = allSkills.filter((s) => s.type === "COMPETENCE").length;
  const totalOutils = allSkills.filter((s) => s.type === "OUTIL").length;

  const handleDeleteCategory = (catId: string, title: string) => {
    if (!confirm(`Supprimer la famille "${title}" et toutes ses compétences associées ?`)) {
      return;
    }
    startTransition(async () => {
      setErrorMsg(null);
      const res = await deleteSkillCategoryAction(catId);
      if (res.error) setErrorMsg(res.error);
    });
  };

  const handleDeleteSkill = (skillId: string, nom: string) => {
    if (!confirm(`Supprimer "${nom}" ?`)) return;
    startTransition(async () => {
      setErrorMsg(null);
      const res = await deleteSkillAction(skillId);
      if (res.error) setErrorMsg(res.error);
    });
  };

  const handleToggleSubPortfolio = (categoryId: string, spId: string, currentAssigned: string[]) => {
    const updated = currentAssigned.includes(spId)
      ? currentAssigned.filter((id) => id !== spId)
      : [...currentAssigned, spId];

    startTransition(async () => {
      setErrorMsg(null);
      const res = await updateCategorySubPortfoliosAction(categoryId, updated);
      if (res.error) setErrorMsg(res.error);
    });
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Alerte d'erreur */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* En-tête de page & Statistiques */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-bebas text-3xl sm:text-4xl text-[#0F172A] tracking-wide">
            Compétences &amp; Outils Techniques
          </h1>
          <p className="text-xs text-[#64748B]">
            Gérez les grandes familles, séparez vos savoir-faire des outils de production, et attribuez-les aux sous-portfolios.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCategoryModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Famille</span>
        </button>
      </div>

      {/* Barre de métriques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-mono text-[#64748B] block">Grandes Familles</span>
          <span className="text-2xl font-bebas text-[#0F172A]">{totalCategories} Pôles</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-mono text-[#2563EB] block">Savoir-faire &amp; Compétences</span>
          <span className="text-2xl font-bebas text-[#0F172A]">{totalCompetences} Expertises</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-mono text-[#F97316] block">Outils &amp; Logiciels</span>
          <span className="text-2xl font-bebas text-[#0F172A]">{totalOutils} Technologies</span>
        </div>
      </div>

      {/* Liste des Familles de Compétences */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || Code;
          const competences = cat.skills.filter((s) => s.type === "COMPETENCE");
          const outils = cat.skills.filter((s) => s.type === "OUTIL");
          const assignedSpIds = (cat.subPortfolios || []).map((sp) => sp.subPortfolioId);

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
            >
              {/* En-tête de la famille */}
              <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-blue-100">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-[#0F172A]">{cat.titre}</h2>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                        {cat.slug}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-[#64748B] mt-0.5">{cat.description}</p>
                    )}
                  </div>
                </div>

                {/* Attribution rapide aux Sous-Portfolios */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-[#64748B] mr-1">Attribution :</span>
                  {subPortfolios.map((sp) => {
                    const isAssigned = assignedSpIds.includes(sp.id);
                    return (
                      <button
                        type="button"
                        key={sp.id}
                        disabled={isPending}
                        onClick={() => handleToggleSubPortfolio(cat.id, sp.id, assignedSpIds)}
                        className={`text-xs font-mono px-3 py-1 rounded-full border transition-all cursor-pointer ${
                          isAssigned
                            ? "bg-[#0B132B] text-white border-[#0B132B] shadow-2xs"
                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                        }`}
                        title={isAssigned ? `Visible sur /${sp.slug}` : `Masqué sur /${sp.slug}`}
                      >
                        {isAssigned ? "✓ " : "+ "}
                        /{sp.slug}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDeleteCategory(cat.id, cat.titre)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-2 cursor-pointer"
                    title="Supprimer cette catégorie"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contenu : Séparation Savoir-faire vs Outils */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 1. Savoir-faire & Compétences Techniques (avec Niveaux) */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] uppercase tracking-wider pb-2 border-b border-slate-100">
                    <BookOpen className="w-4 h-4 text-[#2563EB]" />
                    <span>Savoir-faire &amp; Compétences ({competences.length})</span>
                  </div>

                  {competences.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Aucun savoir-faire répertorié.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {competences.map((comp) => (
                        <div
                          key={comp.id}
                          className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between gap-3 group"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-[#0F172A]">{comp.nom}</span>
                              {comp.niveau && (
                                <span className="text-[10px] font-mono text-[#2563EB] font-bold">
                                  {comp.niveau} {comp.pourcentage ? `· ${comp.pourcentage}%` : ""}
                                </span>
                              )}
                            </div>

                            {comp.pourcentage !== null && (
                              <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#2563EB] h-full rounded-full transition-all"
                                  style={{ width: `${comp.pourcentage}%` }}
                                />
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleDeleteSkill(comp.id, comp.nom)}
                            className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Outils, Logiciels & Frameworks */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] uppercase tracking-wider pb-2 border-b border-slate-100">
                    <Wrench className="w-4 h-4 text-[#F97316]" />
                    <span>Outils &amp; Logiciels de Production ({outils.length})</span>
                  </div>

                  {outils.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Aucun outil répertorié.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {outils.map((tool) => (
                        <div
                          key={tool.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-medium text-[#0F172A] shadow-2xs group hover:border-[#F97316]/50"
                        >
                          <span>{tool.nom}</span>
                          {tool.niveau && (
                            <span className="text-[9px] text-[#64748B]">({tool.niveau})</span>
                          )}
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleDeleteSkill(tool.id, tool.nom)}
                            className="text-slate-400 hover:text-red-600 transition-colors ml-1 cursor-pointer"
                            title="Supprimer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Formulaire d'ajout rapide inline */}
              <div className="px-6 py-4 bg-slate-50/40 border-t border-slate-100">
                <form
                  action={async (formData) => {
                    startTransition(async () => {
                      setErrorMsg(null);
                      const res = await createSkillAction(undefined, formData);
                      if (res.error) setErrorMsg(res.error);
                    });
                  }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <input type="hidden" name="categoryId" value={cat.id} />

                  <input
                    type="text"
                    name="nom"
                    required
                    placeholder="Ajouter une compétence ou un outil..."
                    className="flex-1 min-w-[200px] px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white"
                  />

                  <select
                    name="type"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-[#0F172A]"
                  >
                    <option value="OUTIL">Outil / Logiciel</option>
                    <option value="COMPETENCE">Savoir-faire / Compétence</option>
                  </select>

                  <select
                    name="niveau"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-[#0F172A]"
                  >
                    <option value="Expert">Expert</option>
                    <option value="Avancé">Avancé</option>
                    <option value="Maîtrisé">Maîtrisé</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                  </select>

                  <input
                    type="number"
                    name="pourcentage"
                    min="10"
                    max="100"
                    placeholder="%"
                    defaultValue="90"
                    className="w-16 px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-center font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white"
                  />

                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                  >
                    + Ajouter
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Création Nouvelle Famille */}
      {categoryModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bebas text-2xl text-[#0F172A]">
                Créer une Nouvelle Famille
              </h3>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form
              action={async (formData) => {
                startTransition(async () => {
                  setErrorMsg(null);
                  const res = await createSkillCategoryAction(undefined, formData);
                  if (res.error) {
                    setErrorMsg(res.error);
                  } else {
                    setCategoryModalOpen(false);
                  }
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] uppercase mb-1.5">
                  Titre de la Famille *
                </label>
                <input
                  type="text"
                  name="titre"
                  required
                  placeholder="Ex : Intelligence Artificielle & Automatisation"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] uppercase mb-1.5">
                  Slug URL (optionnel)
                </label>
                <input
                  type="text"
                  name="slug"
                  placeholder="Ex : ia-automatisation"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] uppercase mb-1.5">
                  Icône Lucide
                </label>
                <select
                  name="icon"
                  defaultValue="Code"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="Code">Code (Développement)</option>
                  <option value="Server">Server (Backend / Base de données)</option>
                  <option value="Smartphone">Smartphone (Mobile Apps)</option>
                  <option value="Palette">Palette (Design / UI-UX)</option>
                  <option value="Film">Film (Vidéo / Motion)</option>
                  <option value="Terminal">Terminal (DevOps / Sysadmin)</option>
                  <option value="Cpu">Cpu (Tech / Architecture)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] uppercase mb-1.5">
                  Description synthétique
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Ex : Agents autonomes, prompt engineering et workflows génératifs."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPending ? "Création..." : "Enregistrer la famille"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
