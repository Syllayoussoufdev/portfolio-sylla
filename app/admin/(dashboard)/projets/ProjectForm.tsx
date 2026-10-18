"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { type ProjectActionState } from "../../actions/projects";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  Globe,
  FolderOpen,
  Video,
  Image as ImageIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { GithubIcon, FigmaIcon } from "@/components/icons";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { type UploadedMedia } from "@/components/admin/MediaUploader";

interface ProjectFormProps {
  initialData?: {
    id: string;
    titre: string;
    slug: string;
    description: string;
    contenu: string | null;
    coverImage: string | null;
    coverMediaId?: string | null;
    coverMedia?: { id: string; url: string; alt: string; format?: string; width?: number; height?: number } | null;
    mediaGallery?: {
      media: { id: string; url: string; alt: string; format?: string; width?: number; height?: number };
      position: number;
    }[];
    tags: string[];
    links: unknown;
    ordre: number;
    visible: boolean;
    featured: boolean;
  };
  action: (
    prevState: ProjectActionState | undefined,
    formData: FormData
  ) => Promise<ProjectActionState>;
  isEditing?: boolean;
}

export function ProjectForm({ initialData, action, isEditing }: ProjectFormProps) {
  const [state, formAction, isPending] = useActionState<ProjectActionState, FormData>(
    action,
    {}
  );

  const [titre, setTitre] = useState(initialData?.titre || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!isEditing);

  // Génération automatique du slug à la saisie du titre
  const handleTitreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitre(val);
    if (autoSlug) {
      const generated = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  const linksObj = (initialData?.links || {}) as Record<string, string>;

  // Casquettes recommandées du PRD
  const presetTags = [
    "Design Graphique",
    "Branding & Com",
    "Montage Vidéo",
    "Design UI/UX",
    "IA Product Creator",
    "Développement Web",
    "Next.js",
    "TypeScript",
    "Figma",
    "Canva",
  ];

  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
  const [customTagInput, setCustomTagInput] = useState("");

  // Gestion Couverture Cloudinary & Rétrocompatibilité
  const [coverMedia, setCoverMedia] = useState<{
    id: string;
    url: string;
    alt: string;
  } | null>(initialData?.coverMedia || null);
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialData?.coverImage || initialData?.coverMedia?.url || ""
  );

  // Gestion Galerie ordonnée (ProjectMedia)
  const [galleryItems, setGalleryItems] = useState<{
    id: string;
    url: string;
    alt: string;
  }[]>(
    initialData?.mediaGallery
      ? initialData.mediaGallery.map((g) => ({
          id: g.media.id,
          url: g.media.url,
          alt: g.media.alt,
        }))
      : []
  );

  // Modal sélecteur de média
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"cover" | "gallery">("cover");

  const openPickerForCover = () => {
    setPickerTarget("cover");
    setPickerOpen(true);
  };

  const openPickerForGallery = () => {
    setPickerTarget("gallery");
    setPickerOpen(true);
  };

  const handleMediaSelected = (media: UploadedMedia) => {
    if (pickerTarget === "cover") {
      setCoverMedia({
        id: media.id,
        url: media.url,
        alt: media.alt,
      });
      setCoverImageUrl(media.url);
    } else {
      if (!galleryItems.some((item) => item.id === media.id)) {
        setGalleryItems([...galleryItems, { id: media.id, url: media.url, alt: media.alt }]);
      }
    }
  };

  const removeCover = () => {
    setCoverMedia(null);
    setCoverImageUrl("");
  };

  const moveGalleryItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryItems.length) return;
    const newItems = [...galleryItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setGalleryItems(newItems);
  };

  const removeGalleryItem = (id: string) => {
    setGalleryItems(galleryItems.filter((item) => item.id !== id));
  };

  const toggleTag = (t: string) => {
    if (selectedTags.includes(t)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== t));
    } else {
      setSelectedTags([...selectedTags, t]);
    }
  };

  const addCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customTagInput.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(customTagInput.trim())) {
        setSelectedTags([...selectedTags, customTagInput.trim()]);
      }
      setCustomTagInput("");
    }
  };

  return (
    <form action={formAction} className="space-y-8 max-w-4xl">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projets"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-bebas text-3xl sm:text-4xl text-[#0F172A] tracking-wide">
              {isEditing ? "Modifier le projet" : "Créer un nouveau projet"}
            </h1>
            <p className="text-xs text-[#64748B]">
              Renseignez les détails, visuels et liens de votre réalisation.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all disabled:opacity-70 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Enregistrer le projet</span>
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

      {/* Section 1 : Informations principales */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-base font-semibold text-[#0F172A] flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-[#F97316]" />
          Informations Générales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Titre */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Titre du projet *
            </label>
            <input
              type="text"
              name="titre"
              required
              value={titre}
              onChange={handleTitreChange}
              placeholder="Ex: Refonte Identité Visuelle ou Plateforme SaaS"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all"
            />
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                Slug URL unique *
              </label>
              <button
                type="button"
                onClick={() => setAutoSlug(!autoSlug)}
                className="text-[11px] font-mono text-[#2563EB] hover:underline"
              >
                {autoSlug ? "Mode manuel" : "Génération auto"}
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center font-mono text-xs text-slate-400">
                /projets/
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
                placeholder="mon-projet"
                className="w-full pl-20 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F172A] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Description courte */}
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
            Description synthétique (affichée sur la carte) *
          </label>
          <textarea
            name="description"
            required
            rows={3}
            defaultValue={initialData?.description || ""}
            placeholder="Courte présentation percutante du projet en 2 à 3 phrases..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all resize-y"
          />
        </div>

        {/* Contenu détaillé */}
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
            Contenu détaillé / Étude de cas (Page détail projet)
          </label>
          <textarea
            name="contenu"
            rows={6}
            defaultValue={initialData?.contenu || ""}
            placeholder="Contexte, problématique résolue, méthodologie créative ou technique, résultats obtenus..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all resize-y font-mono text-xs"
          />
        </div>

        {/* Image de couverture principale (Cloudinary / Rétrocompatible) */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                Image de couverture principale *
              </label>
              <p className="text-[11px] text-slate-500">
                Format 16:9 recommandé • Téléversement direct Cloudinary avec texte alternatif
              </p>
            </div>
            <button
              type="button"
              onClick={openPickerForCover}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#2563EB] hover:bg-blue-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{coverMedia || coverImageUrl ? "Modifier l'image" : "Choisir une image"}</span>
            </button>
          </div>

          {/* Aperçu de la couverture */}
          {coverMedia || coverImageUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video max-h-72 flex items-center justify-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverMedia?.url || coverImageUrl}
                alt={coverMedia?.alt || "Image de couverture"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 p-4 flex flex-col justify-between">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={removeCover}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white transition-colors cursor-pointer"
                    title="Retirer la couverture"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-white space-y-0.5">
                  <div className="text-xs font-semibold truncate">
                    {coverMedia?.alt || "Image saisie manuellement"}
                  </div>
                  <div className="text-[10px] font-mono text-slate-300 truncate">
                    {coverMedia?.url || coverImageUrl}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={openPickerForCover}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-[#2563EB] hover:bg-blue-50/30 transition-all cursor-pointer bg-slate-50/50"
            >
              <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#0F172A]">
                Aucune image de couverture sélectionnée
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cliquez pour choisir dans la médiathèque ou téléverser
              </p>
            </div>
          )}

          {/* Champs masqués transmis au serveur */}
          <input type="hidden" name="coverMediaId" value={coverMedia?.id || ""} />
          <input type="hidden" name="coverImage" value={coverMedia?.url || coverImageUrl} />

          {/* Option repliable : saisie manuelle d'URL (compatibilité) */}
          <details className="text-[11px] text-slate-500 pt-1">
            <summary className="cursor-pointer hover:text-slate-800 font-medium">
              Options avancées (URL directe / fallback externe)
            </summary>
            <div className="mt-2">
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => {
                  setCoverImageUrl(e.target.value);
                  setCoverMedia(null);
                }}
                placeholder="https://... URL directe de secours"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </details>
        </div>

        {/* Galerie d'images ordonnée (ProjectMedia) */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                Galerie de visuels ordonnée (ProjectMedia)
              </label>
              <p className="text-[11px] text-slate-500">
                Ajoutez des captures ou maquettes et ajustez leur ordre d&apos;affichage avec les flèches.
              </p>
            </div>
            <button
              type="button"
              onClick={openPickerForGallery}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Ajouter à la galerie</span>
            </button>
          </div>

          {galleryItems.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center text-xs text-slate-400 bg-slate-50/30">
              Aucune image dans la galerie pour le moment.
            </div>
          ) : (
            <div className="space-y-2">
              {galleryItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all"
                >
                  <span className="w-5 text-center text-xs font-mono font-semibold text-slate-400">
                    #{index + 1}
                  </span>
                  <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#0F172A] truncate">{item.alt}</p>
                    <p className="text-[10px] font-mono text-slate-400 truncate">{item.url}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveGalleryItem(index, "up")}
                      className="p-1 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Monter"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === galleryItems.length - 1}
                      onClick={() => moveGalleryItem(index, "down")}
                      className="p-1 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                      title="Descendre"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(item.id)}
                      className="p-1 rounded-md text-red-500 hover:bg-red-50 ml-1"
                      title="Retirer de la galerie"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Champ JSON masqué contenant les IDs ordonnés */}
          <input
            type="hidden"
            name="galleryMediaIds"
            value={JSON.stringify(galleryItems.map((item) => item.id))}
          />
        </div>
      </div>

      {/* Section 2 : Compétences & Tags */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-[#0F172A] border-b border-slate-100 pb-3">
          Tags & Domaines de Compétences
        </h2>

        <p className="text-xs text-[#64748B]">
          Cliquez sur les tags prédéfinis pour les ajouter ou saisissez un tag sur-mesure (Entrée) :
        </p>

        <div className="flex flex-wrap gap-2">
          {presetTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#2563EB] text-white shadow-sm"
                    : "bg-slate-100 text-[#475569] hover:bg-slate-200"
                }`}
              >
                {isSelected ? "✓ " : "+ "}
                {tag}
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          <input
            type="text"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            onKeyDown={addCustomTag}
            placeholder="Ajouter un tag personnalisé puis appuyer sur Entrée..."
            className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        {/* Input caché contenant les tags pour le formulaire */}
        <input type="hidden" name="tags" value={selectedTags.join(",")} />

        {selectedTags.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-mono text-[#64748B] mr-1">Tags sélectionnés :</span>
            {selectedTags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-[#2563EB] text-xs font-medium border border-blue-100"
              >
                {t}
                <button
                  type="button"
                  onClick={() => toggleTag(t)}
                  className="hover:text-red-500 ml-0.5 text-xs font-bold"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Section 3 : Liens externes (JSON) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-[#0F172A] flex items-center gap-2 border-b border-slate-100 pb-3">
          <LinkIcon className="w-4 h-4 text-[#2563EB]" />
          Liens Externes & Ressources
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[#475569] flex items-center gap-1.5 mb-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-600" /> Démo Live / Site Web
            </label>
            <input
              type="url"
              name="link_demo"
              defaultValue={linksObj.demo || ""}
              placeholder="https://mon-site.com"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#475569] flex items-center gap-1.5 mb-1.5">
              <GithubIcon className="w-3.5 h-3.5 text-slate-800" /> Dépôt GitHub
            </label>
            <input
              type="url"
              name="link_github"
              defaultValue={linksObj.github || ""}
              placeholder="https://github.com/..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#475569] flex items-center gap-1.5 mb-1.5">
              <FigmaIcon className="w-3.5 h-3.5 text-purple-600" /> Maquette / Prototype Figma
            </label>
            <input
              type="url"
              name="link_figma"
              defaultValue={linksObj.figma || ""}
              placeholder="https://figma.com/file/..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#475569] flex items-center gap-1.5 mb-1.5">
              <Video className="w-3.5 h-3.5 text-red-600" /> Vidéo YouTube / Vimeo
            </label>
            <input
              type="url"
              name="link_video"
              defaultValue={linksObj.video || ""}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-[#475569] flex items-center gap-1.5 mb-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-amber-600" /> Dossier Drive / Canva / Presse
            </label>
            <input
              type="url"
              name="link_drive"
              defaultValue={linksObj.drive || ""}
              placeholder="https://drive.google.com/... ou lien Canva"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 4 : Paramètres d'affichage */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-[#0F172A] border-b border-slate-100 pb-3">
          Visibilité & Ordre d&apos;affichage
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-2">
              Ordre de tri
            </label>
            <input
              type="number"
              name="ordre"
              defaultValue={initialData?.ordre || 0}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            <p className="text-[11px] text-[#64748B] mt-1">
              Les projets avec le plus petit chiffre apparaissent en premier.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 sm:pt-0">
            <input
              type="checkbox"
              id="visible"
              name="visible"
              defaultChecked={initialData?.visible !== false}
              className="w-4 h-4 text-[#2563EB] rounded focus:ring-blue-500"
            />
            <label htmlFor="visible" className="text-sm font-medium text-[#0F172A] cursor-pointer">
              Projet visible en public
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={initialData?.featured || false}
              className="w-4 h-4 text-[#F97316] rounded focus:ring-orange-500"
            />
            <label htmlFor="featured" className="text-sm font-medium text-[#0F172A] cursor-pointer">
              À la une (Featured Hero)
            </label>
          </div>
        </div>
      </div>

      {/* Modal sélecteur de média */}
      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleMediaSelected}
        title={
          pickerTarget === "cover"
            ? "Choisir ou téléverser l'image de couverture"
            : "Ajouter un visuel à la galerie ordonnée"
        }
      />
    </form>
  );
}
