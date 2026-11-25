"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  Eye,
  Edit3,
  Clock,
  Tag,
  FolderOpen,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
} from "lucide-react";
import { BLOG_CATEGORIES, estimateReadingTime } from "@/lib/validations/blog";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { type UploadedMedia } from "@/components/admin/MediaUploader";
import { type BlogActionState } from "../../actions/blog";

interface BlogPostFormProps {
  initialData?: {
    id: string;
    titre: string;
    slug: string;
    description: string;
    contenu: string;
    coverImage: string | null;
    coverMediaId?: string | null;
    categorie: string;
    tags: string[];
    tempsLecture: number;
    statut: "PUBLIE" | "BROUILLON";
    featured: boolean;
  };
  action: (
    prevState: BlogActionState | undefined,
    formData: FormData
  ) => Promise<BlogActionState>;
  isEditing?: boolean;
}

export function BlogPostForm({ initialData, action, isEditing }: BlogPostFormProps) {
  const [state, formAction, isPending] = useActionState<BlogActionState, FormData>(
    action,
    {}
  );

  const [titre, setTitre] = useState(initialData?.titre || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [contenu, setContenu] = useState(initialData?.contenu || "");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImage || "");
  const [coverMediaId, setCoverMediaId] = useState(initialData?.coverMediaId || "");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(", ") || "");

  // Génération automatique du slug à la saisie du titre si nouveau
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

  // Insertion d'éléments Markdown dans le textarea
  const insertMarkdown = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = document.getElementById("contenu-textarea") as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = contenu.substring(start, end) || placeholder;
    const replacement = `${before}${selected}${after}`;

    const newContent = contenu.substring(0, start) + replacement + contenu.substring(end);
    setContenu(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 10);
  };

  const handleMediaSelect = (media: UploadedMedia) => {
    setCoverImageUrl(media.url);
    setCoverMediaId(media.id);
  };

  const currentReadingTime = estimateReadingTime(contenu);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Fil d'ariane & Navigation de retour */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#2563EB] transition-colors group"
        >
          <span className="p-1.5 rounded-xl bg-white border border-slate-200 group-hover:border-[#2563EB]/40 shadow-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
          </span>
          <span>Retour aux articles</span>
        </Link>

        {initialData?.slug && initialData.statut === "PUBLIE" && (
          <Link
            href={`/blog/${initialData.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-semibold"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Voir l&apos;article public</span>
          </Link>
        )}
      </div>

      {/* 2. Message d'erreur de soumission */}
      {state.error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-semibold">Une erreur est survenue :</div>
            <div>{state.error}</div>
          </div>
        </div>
      )}

      {/* 3. Formulaire Principal */}
      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne Principale : Contenu & Titres (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="font-bebas text-2xl text-[#0F172A] tracking-wide">
                INFORMATIONS PRINCIPALES
              </h2>

              {/* Titre */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Titre de l&apos;article *
                </label>
                <input
                  type="text"
                  name="titre"
                  required
                  placeholder="Ex : Comment l'IA Générative et n8n transforment le Web en 2026"
                  value={titre}
                  onChange={handleTitreChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB] shadow-xs text-[#0F172A]"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-700">Slug (URL) *</label>
                  <button
                    type="button"
                    onClick={() => setAutoSlug(!autoSlug)}
                    className="text-[11px] text-[#2563EB] hover:underline"
                  >
                    {autoSlug ? "Personnaliser" : "Générer automatiquement"}
                  </button>
                </div>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-xs">
                  <span className="px-3 text-xs text-slate-400 font-mono select-none">
                    /blog/
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
                    className="w-full py-2.5 pr-3 bg-transparent text-xs font-mono text-[#0F172A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Description courte (Chapeau) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Chapeau / Extrait de l&apos;article *
                </label>
                <textarea
                  name="description"
                  required
                  rows={2}
                  defaultValue={initialData?.description || ""}
                  placeholder="Résumé percutant de 2 ou 3 phrases pour capter l'attention dans la grille et sur les réseaux sociaux."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] shadow-xs resize-y"
                />
              </div>
            </div>

            {/* Éditeur de Contenu Markdown */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-bebas text-2xl text-[#0F172A] tracking-wide">
                  CONTENU DE L&apos;ARTICLE
                </h2>

                {/* Onglets Édition / Aperçu */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      activeTab === "edit"
                        ? "bg-white text-[#0F172A] shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5 inline-block mr-1" />
                    Édition
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      activeTab === "preview"
                        ? "bg-white text-[#0F172A] shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 inline-block mr-1" />
                    Aperçu
                  </button>
                </div>
              </div>

              {activeTab === "edit" ? (
                <div className="space-y-2">
                  {/* Barre d'outils Markdown */}
                  <div className="flex flex-wrap items-center gap-1 p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
                    <button
                      type="button"
                      onClick={() => insertMarkdown("**", "**", "texte en gras")}
                      title="Gras"
                      className="p-1.5 rounded-lg hover:bg-white hover:text-[#0F172A] transition-colors"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("*", "*", "texte en italique")}
                      title="Italique"
                      className="p-1.5 rounded-lg hover:bg-white hover:text-[#0F172A] transition-colors"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertMarkdown("## ", "\n", "Titre de section")}
                      title="Titre 2"
                      className="p-1.5 rounded-lg hover:bg-white hover:text-[#0F172A] transition-colors"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("### ", "\n", "Sous-titre")}
                      title="Titre 3"
                      className="p-1.5 rounded-lg hover:bg-white hover:text-[#0F172A] transition-colors"
                    >
                      <Heading3 className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertMarkdown("> ", "\n", "Citation ou remarque importante")}
                      title="Citation"
                      className="p-1.5 rounded-lg hover:bg-white hover:text-[#0F172A] transition-colors"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("```javascript\n", "\n```", "// votre code ici")}
                      title="Bloc de code"
                      className="p-1.5 rounded-lg hover:bg-white hover:text-[#0F172A] transition-colors"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("- ", "\n", "Élément de liste")}
                      title="Liste à puces"
                      className="p-1.5 rounded-lg hover:bg-white hover:text-[#0F172A] transition-colors"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    id="contenu-textarea"
                    name="contenu"
                    required
                    rows={18}
                    value={contenu}
                    onChange={(e) => setContenu(e.target.value)}
                    placeholder="Rédigez votre article en Markdown : structurez avec des titres ##, des listes, des encadrés et des exemples concrets..."
                    className="w-full p-4 rounded-2xl border border-slate-200 font-mono text-xs leading-relaxed text-[#0F172A] focus:outline-none focus:border-[#2563EB] shadow-xs resize-y"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Markdown supporté</span>
                    <span>Temps de lecture estimé : ~{currentReadingTime} min</span>
                  </div>
                </div>
              ) : (
                <div className="min-h-[400px] p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-line">
                  {contenu || (
                    <span className="text-slate-400 italic">
                      L&apos;aperçu apparaîtra ici dès que vous saisirez du texte.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Colonne Latérale : Paramètres, Image & Statut (1 col) */}
          <div className="space-y-6">
            {/* Boîte Paramètres de Publication */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bebas text-xl text-[#0F172A] tracking-wide border-b border-slate-100 pb-2">
                PUBLICATION
              </h3>

              {/* Statut */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Statut</label>
                <select
                  name="statut"
                  defaultValue={initialData?.statut || "PUBLIE"}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB] shadow-xs cursor-pointer"
                >
                  <option value="PUBLIE">Publié (En ligne)</option>
                  <option value="BROUILLON">Brouillon (Non visible)</option>
                </select>
              </div>

              {/* Catégorie */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Catégorie *</label>
                <select
                  name="categorie"
                  defaultValue={initialData?.categorie || "Intelligence Artificielle"}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB] shadow-xs cursor-pointer"
                >
                  {BLOG_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Tags (séparés par une virgule)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Ex : Next.js, n8n, Automatisation, IA"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] shadow-xs"
                />
              </div>

              {/* Temps de lecture manuel */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Temps de lecture (minutes)
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    name="tempsLecture"
                    min={1}
                    max={60}
                    defaultValue={initialData?.tempsLecture || currentReadingTime}
                    className="w-20 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] shadow-xs"
                  />
                  <span className="text-xs text-slate-400 font-mono">min</span>
                </div>
              </div>

              {/* À la une (Featured) */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-[#0F172A] block">
                    Mettre en avant
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Afficher en grande bannière sur le blog
                  </span>
                </div>
                <input
                  type="checkbox"
                  name="featured"
                  value="true"
                  defaultChecked={initialData?.featured || false}
                  className="w-4 h-4 rounded text-[#2563EB] focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Bouton de Soumission */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enregistrement en cours...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isEditing ? "Mettre à jour l'article" : "Publier l'article"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Boîte Image de Couverture */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="font-bebas text-xl text-[#0F172A] tracking-wide border-b border-slate-100 pb-2">
                IMAGE DE COUVERTURE
              </h3>

              {coverImageUrl ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <Image
                    src={coverImageUrl}
                    alt="Aperçu couverture"
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImageUrl("");
                      setCoverMediaId("");
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors text-xs"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <div className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-center text-slate-400">
                  <ImageIcon className="w-8 h-8 mb-1 stroke-1" />
                  <span className="text-xs font-medium">Aucune image sélectionnée</span>
                </div>
              )}

              {/* Champ caché pour la soumission */}
              <input type="hidden" name="coverImage" value={coverImageUrl} />
              <input type="hidden" name="coverMediaId" value={coverMediaId} />

              <div className="pt-1 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Choisir dans la Médiathèque</span>
                </button>

                <div className="relative">
                  <input
                    type="url"
                    placeholder="Ou coller une URL d'image..."
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Modal Médiathèque Cloudinary */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}
