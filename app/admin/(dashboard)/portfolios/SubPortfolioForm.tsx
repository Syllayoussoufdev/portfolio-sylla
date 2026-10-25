"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { type SubPortfolioActionState } from "../../actions/subportfolios";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Sparkles,
  Check,
  FolderKanban,
  Code,
  Palette,
  Film,
  Zap,
} from "lucide-react";

interface SubPortfolioFormProps {
  initialData?: {
    id: string;
    slug: string;
    label: string;
    template?: string;
    description: string | null;
    actif: boolean;
    projects: { projectId: string; ordre: number }[];
  };
  availableProjects: {
    id: string;
    titre: string;
    slug: string;
    tags: string[];
    visible: boolean;
  }[];
  action: (
    prevState: SubPortfolioActionState | undefined,
    formData: FormData
  ) => Promise<SubPortfolioActionState>;
  isEditing?: boolean;
}

const TEMPLATES = [
  {
    id: "creatif",
    label: "Créatif & Visuel",
    badge: "Design & DA",
    description: "Élégant, aéré, centré sur l'identité visuelle, les affiches et la création de marque.",
    icon: Palette,
    color: "from-amber-500/10 to-orange-500/10 border-orange-200 text-orange-600",
  },
  {
    id: "developpeur",
    label: "Développeur Web & Mobile",
    badge: "Code & Tech",
    description: "Cartes techniques, badge de stack (React, Next.js, Laravel) et focus architecture logicielle.",
    icon: Code,
    color: "from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-600",
  },
  {
    id: "immersif",
    label: "Immersif Vidéo & Motion",
    badge: "Vidéo & Écran",
    description: "Ambiance cinématique sombre, grand format, axé teasers, clips et montages rythmés.",
    icon: Film,
    color: "from-purple-500/10 to-pink-500/10 border-purple-200 text-purple-600",
  },
  {
    id: "devcreative",
    label: "DevCreative Freelance",
    badge: "Offres & Business",
    description: "Vitrine orientée conversion, packs de services, devis sur-mesure et propositions commerciales.",
    icon: Zap,
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-600",
  },
];

export function SubPortfolioForm({
  initialData,
  availableProjects,
  action,
  isEditing,
}: SubPortfolioFormProps) {
  const [state, formAction, isPending] = useActionState<SubPortfolioActionState, FormData>(
    action,
    {}
  );

  const [label, setLabel] = useState(initialData?.label || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [template, setTemplate] = useState(initialData?.template || "creatif");
  const [hasManuallyPickedTemplate, setHasManuallyPickedTemplate] = useState(Boolean(initialData?.template));

  const initialSelected = initialData?.projects.map((p) => p.projectId) || [];
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(initialSelected);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLabel(val);

    if (autoSlug) {
      const generated = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);

      // Auto-détection intelligente du template si non sélectionné manuellement
      if (!hasManuallyPickedTemplate) {
        const lower = val.toLowerCase();
        if (lower.includes("dev") || lower.includes("web") || lower.includes("mobile") || lower.includes("code")) {
          setTemplate("developpeur");
        } else if (lower.includes("video") || lower.includes("montage") || lower.includes("film")) {
          setTemplate("immersif");
        } else if (lower.includes("freelance") || lower.includes("business")) {
          setTemplate("devcreative");
        }
      }
    }
  };

  const toggleProject = (projectId: string) => {
    if (selectedProjectIds.includes(projectId)) {
      setSelectedProjectIds(selectedProjectIds.filter((id) => id !== projectId));
    } else {
      setSelectedProjectIds([...selectedProjectIds, projectId]);
    }
  };

  const selectAll = () => {
    setSelectedProjectIds(availableProjects.map((p) => p.id));
  };

  const deselectAll = () => {
    setSelectedProjectIds([]);
  };

  return (
    <form action={formAction} className="space-y-8 max-w-4xl">
      {/* Champ caché pour le template */}
      <input type="hidden" name="template" value={template} />

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/portfolios"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-bebas text-3xl sm:text-4xl text-[#0F172A] tracking-wide">
              {isEditing ? "Modifier le sous-portfolio" : "Créer un sous-portfolio sur-mesure"}
            </h1>
            <p className="text-xs text-[#64748B]">
              Configurez une URL personnalisée, un template visuel adapté et filtrez les réalisations ciblées.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.98] text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all disabled:opacity-70 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Enregistrer le sous-portfolio</span>
            </>
          )}
        </button>
      </div>

      {/* Message d'erreur */}
      {state?.error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Section 1 : Configuration du lien */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-base font-semibold text-[#0F172A] flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-[#F97316]" />
          Paramètres du Lien Public
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Label / Nom */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Titre / Cible du sous-portfolio *
            </label>
            <input
              type="text"
              name="label"
              required
              value={label}
              onChange={handleLabelChange}
              placeholder="Ex: Candidature Développeur Web & Mobile"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all"
            />
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                Slug URL personnalisé *
              </label>
              <button
                type="button"
                onClick={() => setAutoSlug(!autoSlug)}
                className="text-[11px] font-mono text-[#F97316] hover:underline"
              >
                {autoSlug ? "Mode manuel" : "Génération auto"}
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center font-mono text-xs text-slate-400">
                syllayoussouf.com/
              </span>
              <input
                type="text"
                name="slug"
                required
                value={slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setSlug(e.target.value);
                }}
                placeholder="developpeur"
                className="w-full pl-36 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F172A] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Choix du Template Visuel */}
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
            Template & Mise en page de la vitrine *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {TEMPLATES.map((tpl) => {
              const isSelected = template === tpl.id;
              const IconComp = tpl.icon;

              return (
                <div
                  key={tpl.id}
                  onClick={() => {
                    setTemplate(tpl.id);
                    setHasManuallyPickedTemplate(true);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
                    isSelected
                      ? "border-[#F97316] bg-orange-50/40 shadow-sm"
                      : "border-slate-200/80 bg-slate-50/30 hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg bg-white border ${tpl.color}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#0F172A]">{tpl.label}</h4>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#F97316]">
                          {tpl.badge}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#F97316] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed mt-1">
                    {tpl.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description optionnelle */}
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
            Description personnalisée d&apos;en-tête (Optionnelle)
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={initialData?.description || ""}
            placeholder="Ex: Bonjour ! Voici une sélection rigoureuse de mes créations en code et développement web..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all resize-y"
          />
        </div>

        {/* Statut actif */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="actif"
            name="actif"
            defaultChecked={initialData?.actif !== false}
            className="w-4 h-4 text-[#F97316] rounded focus:ring-orange-500"
          />
          <label htmlFor="actif" className="text-sm font-medium text-[#0F172A] cursor-pointer">
            Lien actif (Accessible publiquement aux recruteurs et clients)
          </label>
        </div>
      </div>

      {/* Section 2 : Sélection des projets */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#2563EB]" />
              Sélection des Projets à Afficher ({selectedProjectIds.length} sélectionné{selectedProjectIds.length > 1 ? "s" : ""})
            </h2>
            <p className="text-xs text-[#64748B]">
              Cochez uniquement les réalisations que ce profil spécifique doit voir.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="text-xs font-medium text-[#2563EB] hover:underline cursor-pointer"
            >
              Tout cocher
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={deselectAll}
              className="text-xs font-medium text-slate-500 hover:underline cursor-pointer"
            >
              Tout décocher
            </button>
          </div>
        </div>

        {availableProjects.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#64748B]">
            Aucun projet disponible en base. Vous pourrez lier des projets une fois créés.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {availableProjects.map((p) => {
              const isChecked = selectedProjectIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => toggleProject(p.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? "bg-blue-50/60 border-blue-200 text-[#0F172A]"
                      : "bg-slate-50/40 border-slate-200/80 text-slate-600 hover:bg-slate-100/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="projectIds"
                    value={p.id}
                    checked={isChecked}
                    onChange={() => {}} // géré par le parent
                    className="mt-1 w-4 h-4 text-[#2563EB] rounded"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate text-[#0F172A]">{p.titre}</p>
                    <p className="text-xs font-mono text-[#64748B] truncate">/{p.slug}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {p.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isChecked && (
                    <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Barre d'action inférieure */}
      <div className="flex items-center justify-between pt-4 pb-8 border-t border-slate-200">
        <Link
          href="/admin/portfolios"
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-semibold"
        >
          Retour aux sous-portfolios
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEditing ? "Enregistrer les modifications" : "Créer le sous-portfolio"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
