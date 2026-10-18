"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Palette,
  ExternalLink,
  Code,
  Film,
  Compass,
} from "lucide-react";
import { type ProfileActionState } from "../../actions/profiles";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { type UploadedMedia } from "@/components/admin/MediaUploader";
import { isReservedSlug } from "@/lib/constants/reserved-slugs";
import { MASTER_SKILL_CATEGORIES } from "@/lib/constants/skills";
import type { HeroData, SectionItem, TemplateName } from "@/lib/validations/profile";

interface ProfileFormProps {
  initialData?: {
    id: string;
    label: string;
    slug: string;
    template: string;
    accent: string;
    hero: unknown;
    sections: unknown;
    variables: unknown;
    seoTitle: string | null;
    seoDescription: string | null;
    heroMediaId: string | null;
    heroMedia?: { id: string; url: string; alt: string } | null;
    isDefault: boolean;
    actif: boolean;
    subPortfolioId: string | null;
  };
  subPortfolios: { id: string; label: string; slug: string }[];
  action: (
    prevState: ProfileActionState | undefined,
    formData: FormData
  ) => Promise<ProfileActionState>;
  isEditing?: boolean;
}

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero (Introduction & Accroche)",
  projets: "Grille des Réalisations & Projets",
  competences: "Domaines de Compétences & Outils",
  apropos: "Présentation & À Propos",
  parcours: "Parcours & Expériences",
  contact: "Section Contact & Prise de rendez-vous",
};

export function ProfileForm({
  initialData,
  subPortfolios,
  action,
  isEditing,
}: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState<ProfileActionState, FormData>(
    action,
    {}
  );

  const [label, setLabel] = useState(initialData?.label || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [template, setTemplate] = useState<TemplateName>(
    (initialData?.template as TemplateName) || "creatif"
  );
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);

  // Hero Data
  const initialHero = (initialData?.hero || {}) as Partial<HeroData>;
  const [headline, setHeadline] = useState(
    initialHero.headline || "EXPERT COMMUNICATION DIGITALE & DÉVELOPPEUR WEB"
  );
  const [subline, setSubline] = useState(
    initialHero.subline ||
      "Je conçois des identités mémorables et des applications modernes, performantes et scalables."
  );
  const [tagline, setTagline] = useState(initialHero.tagline || "");
  const [ctaPrimaryLabel, setCtaPrimaryLabel] = useState(
    initialHero.ctaPrimary?.label || "Découvrir mes réalisations"
  );
  const [ctaPrimaryHref, setCtaPrimaryHref] = useState(
    initialHero.ctaPrimary?.href || "#projets"
  );
  const [ctaSecondaryLabel, setCtaSecondaryLabel] = useState(
    initialHero.ctaSecondary?.label || "Me contacter"
  );
  const [ctaSecondaryHref, setCtaSecondaryHref] = useState(
    initialHero.ctaSecondary?.href || "/contact"
  );
  const [mediaKind, setMediaKind] = useState<"image" | "abstract">(
    initialHero.media?.kind || "image"
  );
  const [mediaAlt, setMediaAlt] = useState(initialHero.media?.alt || "");

  // Hero Media relation
  const [heroMedia, setHeroMedia] = useState<{
    id: string;
    url: string;
    alt: string;
  } | null>(initialData?.heroMedia || null);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Sections
  const defaultSections: SectionItem[] = [
    { key: "hero", visible: true, order: 0 },
    { key: "apropos", visible: true, order: 1 },
    { key: "projets", visible: true, order: 2 },
    { key: "competences", visible: true, order: 3 },
    { key: "parcours", visible: true, order: 4 },
    { key: "contact", visible: true, order: 5 },
  ];

  const [sections, setSections] = useState<SectionItem[]>(
    Array.isArray(initialData?.sections) && initialData.sections.length > 0
      ? (initialData.sections as SectionItem[])
      : defaultSections
  );

  // Familles de compétences sélectionnées pour ce profil / sous-portfolio
  const initialVariables = (initialData?.variables || {}) as Record<string, unknown>;
  const [selectedSkillFamilies, setSelectedSkillFamilies] = useState<string[]>(
    Array.isArray(initialVariables.skillsFamilies)
      ? (initialVariables.skillsFamilies as string[])
      : MASTER_SKILL_CATEGORIES.map((c) => c.id)
  );

  const toggleSkillFamily = (id: string) => {
    setSelectedSkillFamilies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Gestion du slug automatique
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLabel(val);
    if (autoSlug && !isDefault) {
      const generated = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  const isSlugReserved = slug !== "default" && isReservedSlug(slug);

  // Déplacement accessible des sections
  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Réassigner les numéros d'ordre
    const updated = newSections.map((sec, i) => ({ ...sec, order: i }));
    setSections(updated);
  };

  const toggleSectionVisibility = (index: number) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      visible: !newSections[index].visible,
    };
    setSections(newSections);
  };

  return (
    <form action={formAction} className="space-y-8 max-w-4xl">
      {/* Alerte d'erreur */}
      {state?.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          <div>
            <div className="font-semibold mb-0.5">Erreur lors de l&apos;enregistrement</div>
            <div>{state.error}</div>
          </div>
        </div>
      )}

      {/* En-tête de formulaire */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/profils"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-bebas text-3xl sm:text-4xl text-[#0F172A] tracking-wide">
              {isEditing ? "Modifier le profil" : "Créer un profil ciblé"}
            </h1>
            <p className="text-xs text-[#64748B]">
              Configurez le template, le Hero et l&apos;agencement des sections sans toucher au code.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing && (
            <Link
              href={`/admin/profils/${initialData?.id}/apercu`}
              target="_blank"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
            >
              <ExternalLink className="w-4 h-4 text-[#2563EB]" />
              <span>Aperçu public</span>
            </Link>
          )}

          <button
            type="submit"
            disabled={isPending || isSlugReserved}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Mettre à jour" : "Créer le profil"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Section 1 : Informations Générales & Template */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-base font-semibold text-[#0F172A] border-b border-slate-100 pb-3 flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#2563EB]" />
          Direction & Modèle de Page
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Label / Nom du profil */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Nom du profil (usage interne dashboard) *
            </label>
            <input
              type="text"
              name="label"
              required
              value={label}
              onChange={handleLabelChange}
              placeholder="Ex : Profil Direction Artistique"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Slug URL */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                Slug URL unique *
              </label>
              {!isDefault && (
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[11px] font-mono text-[#2563EB] hover:underline"
                >
                  {autoSlug ? "Mode manuel" : "Génération auto"}
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center font-mono text-xs text-slate-400">
                /
              </span>
              <input
                type="text"
                name="slug"
                required
                disabled={isDefault}
                value={slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setSlug(e.target.value.toLowerCase().trim());
                }}
                placeholder="mon-profil"
                className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 ${
                  isSlugReserved
                    ? "border-red-400 bg-red-50 text-red-900 focus:ring-red-500"
                    : "border-slate-200 bg-slate-50/50 text-[#0F172A] focus:ring-[#2563EB]"
                }`}
              />
            </div>
            {isSlugReserved && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Ce slug est réservé par le système Next.js et ne peut pas être utilisé.
              </p>
            )}
            {isDefault && (
              <p className="text-[11px] text-[#2563EB] mt-1">
                Ce profil est le profil par défaut affiché à la racine (/).
              </p>
            )}
          </div>
        </div>

        {/* Sélection visuelle du Template */}
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-3">
            Template Visuel & Ambiance
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Template Creatif */}
            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                template === "creatif"
                  ? "border-[#2563EB] bg-blue-50/30 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F97316]" />
                    <span className="text-sm font-bold text-[#0F172A]">Créatif</span>
                  </div>
                  <input
                    type="radio"
                    name="template"
                    value="creatif"
                    checked={template === "creatif"}
                    onChange={() => setTemplate("creatif")}
                    className="w-4 h-4 text-[#2563EB]"
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verre givré, orbes bleu & orange, sticker portrait, typographie Bebas Neue.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#2563EB] mt-3 font-semibold">
                Recommandé : DA, Branding, Graphisme
              </span>
            </label>

            {/* Template Developpeur */}
            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                template === "developpeur"
                  ? "border-[#2563EB] bg-blue-50/30 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-sm font-bold text-[#0F172A]">Développeur</span>
                  </div>
                  <input
                    type="radio"
                    name="template"
                    value="developpeur"
                    checked={template === "developpeur"}
                    onChange={() => setTemplate("developpeur")}
                    className="w-4 h-4 text-[#2563EB]"
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Grille éditoriale rigoureuse, bleu nuit, typographie Plus Jakarta Sans et code.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#2563EB] mt-3 font-semibold">
                Recommandé : Ingénierie, Web, Mobile
              </span>
            </label>

            {/* Template Immersif */}
            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                template === "immersif"
                  ? "border-[#2563EB] bg-blue-50/30 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-[#0F172A]">Immersif</span>
                  </div>
                  <input
                    type="radio"
                    name="template"
                    value="immersif"
                    checked={template === "immersif"}
                    onChange={() => setTemplate("immersif")}
                    className="w-4 h-4 text-[#2563EB]"
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Contraste sombre, visuels plein cadre, mouvement ample et accents profonds.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#2563EB] mt-3 font-semibold">
                Recommandé : Vidéo, Motion, 3D
              </span>
            </label>
          </div>
        </div>

        {/* Liaison avec sous-portfolio */}
        {subPortfolios.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Liaison à une sélection de projets (Sous-portfolio)
            </label>
            <select
              name="subPortfolioId"
              defaultValue={initialData?.subPortfolioId || ""}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white"
            >
              <option value="">-- Aucun (Affiche tous les projets visibles) --</option>
              {subPortfolios.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.label} (/{sub.slug})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Section 2 : Configuration du Hero */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-base font-semibold text-[#0F172A] border-b border-slate-100 pb-3 flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#2563EB]" />
          Contenu du Hero (Premier écran)
        </h2>

        {/* Headline & Subline */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Titre principal du Hero (Headline) *
            </label>
            <input
              type="text"
              name="headline"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Ex : EXPERT COMMUNICATION DIGITALE & DÉVELOPPEUR WEB"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Sous-titre / Promesse (Subline) *
            </label>
            <textarea
              name="subline"
              required
              rows={2}
              value={subline}
              onChange={(e) => setSubline(e.target.value)}
              placeholder="Ex : Je conçois des identités mémorables et des applications modernes, performantes et scalables."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Accroche courte / Tagline (Optionnelle)
            </label>
            <input
              type="text"
              name="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Ex : Double casquette Création & Architecture logicielle"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        {/* Boutons d'action (CTAs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-slate-100">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
              Bouton d&apos;action Primaire
            </h3>
            <input
              type="text"
              name="ctaPrimaryLabel"
              required
              value={ctaPrimaryLabel}
              onChange={(e) => setCtaPrimaryLabel(e.target.value)}
              placeholder="Libellé : Découvrir mes projets"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            <input
              type="text"
              name="ctaPrimaryHref"
              required
              value={ctaPrimaryHref}
              onChange={(e) => setCtaPrimaryHref(e.target.value)}
              placeholder="Lien : #projets ou /projets"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
              Bouton d&apos;action Secondaire
            </h3>
            <input
              type="text"
              name="ctaSecondaryLabel"
              required
              value={ctaSecondaryLabel}
              onChange={(e) => setCtaSecondaryLabel(e.target.value)}
              placeholder="Libellé : Me contacter"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            <input
              type="text"
              name="ctaSecondaryHref"
              required
              value={ctaSecondaryHref}
              onChange={(e) => setCtaSecondaryHref(e.target.value)}
              placeholder="Lien : /contact"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        {/* Visuel du Hero */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                Visuel du Hero (Portrait ou Composition)
              </label>
              <p className="text-[11px] text-slate-500">
                Choisissez un visuel dans la médiathèque ou optez pour une scène abstraite.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                name="mediaKind"
                value={mediaKind}
                onChange={(e) => setMediaKind(e.target.value as "image" | "abstract")}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
              >
                <option value="image">Image / Portrait</option>
                <option value="abstract">Scène abstraite / Code</option>
              </select>
            </div>
          </div>

          {mediaKind === "image" && (
            <div className="space-y-3">
              {heroMedia ? (
                <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroMedia.url}
                      alt={heroMedia.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0F172A] truncate">
                      {heroMedia.alt}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 truncate">
                      {heroMedia.url}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="text-xs text-[#2563EB] hover:underline font-semibold"
                  >
                    Changer
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroMedia(null)}
                    className="text-xs text-red-600 hover:underline font-semibold ml-2"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setPickerOpen(true)}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-[#2563EB] hover:bg-blue-50/20 transition-all cursor-pointer"
                >
                  <ImageIcon className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-[#0F172A]">
                    Choisir un visuel de Hero depuis la médiathèque
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Portrait détouré (PNG) ou capture haute résolution
                  </p>
                </div>
              )}

              <input type="hidden" name="heroMediaId" value={heroMedia?.id || ""} />

              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  Description alternative du visuel (alt)
                </label>
                <input
                  type="text"
                  name="mediaAlt"
                  value={mediaAlt}
                  onChange={(e) => setMediaAlt(e.target.value)}
                  placeholder="Ex : Portrait de Sylla Youssouf en posture de travail créatif"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 3 : Agencement des Sections (Accessible au clavier) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2563EB]" />
              Sections de la Page & Ordre d&apos;Affichage
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Ajustez l&apos;ordre avec les touches ou boutons Monter/Descendre et contrôlez la visibilité.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {sections.map((sec, index) => {
            const labelText = SECTION_LABELS[sec.key] || sec.key;
            return (
              <div
                key={sec.key}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  sec.visible
                    ? "bg-slate-50/60 border-slate-200"
                    : "bg-slate-100/40 border-dashed border-slate-300 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-mono text-xs font-semibold text-slate-400">
                    #{index + 1}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-[#0F172A]">
                      {labelText}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 ml-2">
                      ({sec.key})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Visibilité */}
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility(index)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      sec.visible
                        ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                        : "text-slate-500 bg-slate-200 hover:bg-slate-300"
                    }`}
                    title={sec.visible ? "Masquer la section" : "Rendre visible"}
                  >
                    {sec.visible ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Masquée</span>
                      </>
                    )}
                  </button>

                  {/* Boutons Monter / Descendre (Accessibles au clavier) */}
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveSection(index, "up")}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
                    title="Monter cette section (ordre supérieur)"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === sections.length - 1}
                    onClick={() => moveSection(index, "down")}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
                    title="Descendre cette section (ordre inférieur)"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input masqué contenant la liste ordonnée des sections */}
        <input
          type="hidden"
          name="sectionsJson"
          value={JSON.stringify(sections)}
        />
      </div>

      {/* Section 4 : Filtrage des Compétences & Outils par Famille */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
            <Code className="w-4 h-4 text-[#2563EB]" />
            Grandes Familles de Compétences &amp; Outils
          </h2>
          <span className="text-xs text-[#64748B] font-mono">
            {selectedSkillFamilies.length} sélectionnée{selectedSkillFamilies.length > 1 ? "s" : ""}
          </span>
        </div>

        <p className="text-xs text-[#64748B]">
          Choisissez précisément quelles familles de compétences et outils doivent être visibles sur ce profil / sous-portfolio (ex : cibler uniquement Frontend + Backend pour un profil dev).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {MASTER_SKILL_CATEGORIES.map((cat) => {
            const isChecked = selectedSkillFamilies.includes(cat.id);
            return (
              <label
                key={cat.id}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  isChecked
                    ? "bg-blue-50/50 border-[#2563EB]/40 shadow-xs"
                    : "bg-slate-50/50 border-slate-200 opacity-60 hover:opacity-100"
                }`}
              >
                <input
                  type="checkbox"
                  name="skillsFamilies"
                  value={cat.id}
                  checked={isChecked}
                  onChange={() => toggleSkillFamily(cat.id)}
                  className="mt-1 w-4 h-4 text-[#2563EB] rounded focus:ring-blue-500 cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#0F172A]">
                    {cat.title}
                  </div>
                  <div className="text-xs text-[#64748B]">
                    {cat.description}
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {cat.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[#475569]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Section 5 : Référencement SEO & Visibilité */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-base font-semibold text-[#0F172A] border-b border-slate-100 pb-3">
          Référencement SEO & Activation
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Balise Titre SEO (Meta Title)
            </label>
            <input
              type="text"
              name="seoTitle"
              defaultValue={initialData?.seoTitle || ""}
              placeholder="Ex : Sylla Youssouf — Portfolio Direction Artistique"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Description SEO (Meta Description)
            </label>
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={initialData?.seoDescription || ""}
              placeholder="Description synthétique pour les moteurs de recherche et partages sociaux..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-y"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="actif"
                name="actif"
                defaultChecked={initialData?.actif !== false}
                className="w-4 h-4 text-[#2563EB] rounded focus:ring-blue-500"
              />
              <label htmlFor="actif" className="text-sm font-medium text-[#0F172A] cursor-pointer">
                Profil actif (accessible aux visiteurs)
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={isDefault}
                onChange={(e) => {
                  setIsDefault(e.target.checked);
                  if (e.target.checked) {
                    setSlug("default");
                  }
                }}
                className="w-4 h-4 text-[#2563EB] rounded focus:ring-blue-500"
              />
              <label
                htmlFor="isDefault"
                className="text-sm font-medium text-[#0F172A] cursor-pointer"
              >
                Définir comme profil par défaut (chargé sur /)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Médiathèque pour choisir le Hero Media */}
      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(media: UploadedMedia) => {
          setHeroMedia({
            id: media.id,
            url: media.url,
            alt: media.alt,
          });
          if (!mediaAlt) {
            setMediaAlt(media.alt);
          }
        }}
        title="Sélectionner le visuel principal du Hero"
      />
    </form>
  );
}
