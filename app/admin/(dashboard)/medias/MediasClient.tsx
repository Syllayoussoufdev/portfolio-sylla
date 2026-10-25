"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  Loader2,
  Link2,
  Plus,
  X,
  Search,
  CheckSquare,
  Square,
} from "lucide-react";
import { MediaUploader, type UploadedMedia } from "@/components/admin/MediaUploader";
import { normalizeImageUrl, isGoogleDriveUrl } from "@/lib/media-url";

export interface MediaWithUsage {
  id: string;
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  alt: string;
  createdAt: string | Date;
  coverForProjects: { id: string; titre: string; slug: string }[];
  projectGalleries: {
    project: { id: string; titre: string; slug: string };
  }[];
}

interface MediasClientProps {
  initialMedias: MediaWithUsage[];
}

export function MediasClient({ initialMedias }: MediasClientProps) {
  const [medias, setMedias] = useState<MediaWithUsage[]>(initialMedias);
  const [showUploader, setShowUploader] = useState(false);
  const [showUrlAdder, setShowUrlAdder] = useState(false);

  // Mode URL : unitaire ou lot
  const [urlMode, setUrlMode] = useState<"single" | "batch">("batch");
  const [urlInput, setUrlInput] = useState("");
  const [urlAltInput, setUrlAltInput] = useState("");
  const [batchUrlsText, setBatchUrlsText] = useState("");
  const [batchBaseAlt, setBatchBaseAlt] = useState("");
  const [urlSubmitting, setUrlSubmitting] = useState(false);
  const [urlImgError, setUrlImgError] = useState(false);

  // Recherche, filtre et sélection multiple
  const [search, setSearch] = useState("");
  const [usageFilter, setUsageFilter] = useState<"all" | "used" | "unused">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const isMediaUsed = (m: MediaWithUsage) =>
    m.coverForProjects.length > 0 || m.projectGalleries.length > 0;

  const filteredMedias = medias.filter((m) => {
    const matchesSearch =
      m.alt.toLowerCase().includes(search.toLowerCase()) ||
      m.publicId.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (usageFilter === "used") return isMediaUsed(m);
    if (usageFilter === "unused") return !isMediaUsed(m);
    return true;
  });

  const handleUrlAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    if (urlMode === "single") {
      const cleanUrl = normalizeImageUrl(urlInput);
      if (!cleanUrl || !urlAltInput.trim()) return;
      setUrlSubmitting(true);
      try {
        const res = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: cleanUrl,
            alt: urlAltInput.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Impossible d'ajouter l'image");
        }
        const formatted: MediaWithUsage = {
          ...data.media,
          coverForProjects: [],
          projectGalleries: [],
        };
        setMedias((prev) => [formatted, ...prev]);
        setUrlInput("");
        setUrlAltInput("");
        setShowUrlAdder(false);
        setSuccessNotice("Image enregistrée avec succès dans la médiathèque.");
        setTimeout(() => setSuccessNotice(null), 3500);
      } catch (err) {
        setErrorNotice(err instanceof Error ? err.message : "Erreur inattendue");
      } finally {
        setUrlSubmitting(false);
      }
      return;
    }

    // Mode Lot (Batch URLs)
    const rawLines = batchUrlsText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (rawLines.length === 0) return;

    const baseAlt = batchBaseAlt.trim() || "Visuel réalisation";
    const items = rawLines.map((line, index) => {
      const [rawUrlPart, customAltPart] = line.split("|").map((s) => s.trim());
      return {
        url: normalizeImageUrl(rawUrlPart),
        alt:
          customAltPart ||
          (rawLines.length > 1 ? `${baseAlt} — #${index + 1}` : baseAlt),
      };
    });

    setUrlSubmitting(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Impossible d'importer le lot d'images");
      }
      const createdList: UploadedMedia[] = data.medias || (data.media ? [data.media] : []);
      const formattedList: MediaWithUsage[] = createdList.map((m) => ({
        ...m,
        coverForProjects: [],
        projectGalleries: [],
      }));
      setMedias((prev) => [...formattedList, ...prev]);
      setBatchUrlsText("");
      setBatchBaseAlt("");
      setShowUrlAdder(false);
      setSuccessNotice(
        `${formattedList.length} image(s) importée(s) avec succès dans la médiathèque.`
      );
      setTimeout(() => setSuccessNotice(null), 3500);
    } catch (err) {
      setErrorNotice(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setUrlSubmitting(false);
    }
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopySelectedUrls = () => {
    const urls = medias
      .filter((m) => selectedIds.includes(m.id))
      .map((m) => m.url)
      .join("\n");
    if (!urls) return;
    navigator.clipboard.writeText(urls);
    setSuccessNotice(`${selectedIds.length} URL(s) copiée(s) dans le presse-papiers.`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleBatchUploadSuccess = (uploadedList: UploadedMedia[]) => {
    const formattedList: MediaWithUsage[] = uploadedList.map((m) => ({
      ...m,
      coverForProjects: [],
      projectGalleries: [],
    }));
    setMedias((prev) => [...formattedList, ...prev]);
    setSuccessNotice(
      uploadedList.length > 1
        ? `${uploadedList.length} médias ajoutés avec succès à la médiathèque.`
        : "Média ajouté avec succès à la médiathèque."
    );
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  const toggleSelectMedia = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllFiltered = () => {
    const filteredIds = filteredMedias.map((m) => m.id);
    const allSelected =
      filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...filteredIds])));
    }
  };

  const selectUnusedFiltered = () => {
    const unusedIds = filteredMedias.filter((m) => !isMediaUsed(m)).map((m) => m.id);
    setSelectedIds(unusedIds);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setErrorNotice(null);
    setSuccessNotice(null);

    const selectedMedias = medias.filter((m) => selectedIds.includes(m.id));
    const deletable = selectedMedias.filter((m) => !isMediaUsed(m));
    const usedCount = selectedMedias.length - deletable.length;

    if (deletable.length === 0) {
      setErrorNotice(
        "Tous les médias sélectionnés sont actuellement utilisés par des projets. Retirez-les d'abord des projets concernés."
      );
      return;
    }

    const confirmMsg =
      usedCount > 0
        ? `Supprimer définitivement ${deletable.length} image(s) non utilisée(s) ? (${usedCount} image(s) utilisée(s) par des projets seront conservées).`
        : `Confirmez-vous la suppression définitive des ${deletable.length} image(s) sélectionnée(s) ?`;

    if (!confirm(confirmMsg)) return;

    setBulkDeleting(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: deletable.map((m) => m.id) }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la suppression groupée");
      }

      const deletedSet = new Set<string>(data.deletedIds || []);
      setMedias((prev) => prev.filter((m) => !deletedSet.has(m.id)));
      setSelectedIds((prev) => prev.filter((id) => !deletedSet.has(id)));
      setSuccessNotice(`${deletedSet.size} image(s) supprimée(s) avec succès.`);
      setTimeout(() => setSuccessNotice(null), 3500);
    } catch (err) {
      setErrorNotice(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleDelete = async (media: MediaWithUsage) => {
    setErrorNotice(null);
    setSuccessNotice(null);

    if (isMediaUsed(media)) {
      setErrorNotice(
        `Suppression impossible : ce média est utilisé dans des projets existants. Retirez-le d'abord de la couverture ou galerie.`
      );
      return;
    }

    if (!confirm(`Confirmez-vous la suppression définitive de cette image (${media.alt}) ?`)) {
      return;
    }

    setDeletingId(media.id);
    try {
      const res = await fetch(`/api/admin/media/${media.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      setMedias((prev) => prev.filter((m) => m.id !== media.id));
      setSelectedIds((prev) => prev.filter((id) => id !== media.id));
      setSuccessNotice("Image supprimée avec succès.");
      setTimeout(() => setSuccessNotice(null), 3000);
    } catch (err: unknown) {
      setErrorNotice(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setDeletingId(null);
    }
  };

  const parsedBatchCount = batchUrlsText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="font-bebas text-3xl tracking-wide text-[#0F172A] flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-[#2563EB]" />
            MÉDIATHÈQUE ({medias.length})
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Importation multiple, sélection groupée et gestion centralisée des visuels et métadonnées (Alt).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setShowUrlAdder(!showUrlAdder);
              if (showUploader) setShowUploader(false);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#0F172A] text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Link2 className="w-4 h-4 text-[#2563EB]" />
            <span>{showUrlAdder ? "Fermer l'import URL" : "Importer par URL (1 ou lot)"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowUploader(!showUploader);
              if (showUrlAdder) setShowUrlAdder(false);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{showUploader ? "Fermer l'envoi" : "Téléverser (1 ou plusieurs)"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorNotice && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorNotice(null)}
            className="text-xs text-red-500 hover:text-red-800 cursor-pointer"
          >
            Fermer
          </button>
        </div>
      )}

      {successNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Formulaire d'ajout par URL (Unitaire ou Lot Multiple) */}
      {showUrlAdder && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-sm font-semibold text-[#0F172A]">
                Importer des images par liens URL / Google Drive
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUrlMode("batch")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    urlMode === "batch"
                      ? "bg-white text-[#2563EB] shadow-sm"
                      : "text-slate-600 hover:text-[#0F172A]"
                  }`}
                >
                  Lot multiple (Plusieurs URLs)
                </button>
                <button
                  type="button"
                  onClick={() => setUrlMode("single")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    urlMode === "single"
                      ? "bg-white text-[#0F172A] shadow-sm"
                      : "text-slate-600 hover:text-[#0F172A]"
                  }`}
                >
                  Une seule URL
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowUrlAdder(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {urlMode === "single" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                    URL directe de l&apos;image *
                  </label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      setUrlImgError(false);
                    }}
                    placeholder="https://images.unsplash.com/... ou lien Google Drive"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                    Texte alternatif descriptif (alt) *
                  </label>
                  <input
                    type="text"
                    value={urlAltInput}
                    onChange={(e) => setUrlAltInput(e.target.value)}
                    placeholder="Ex : Identité visuelle marque de café"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUrlAdder(false)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleUrlAdd}
                    disabled={urlSubmitting || !urlInput.trim() || !urlAltInput.trim()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                  >
                    {urlSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Enregistrer dans la médiathèque</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Aperçu */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/50 aspect-video max-h-48 overflow-hidden">
                {urlInput.trim() ? (
                  urlImgError ? (
                    <div className="p-3 text-center text-amber-700 flex flex-col items-center justify-center gap-1.5">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <p className="text-[11px] font-semibold">Image inaccessible</p>
                      <p className="text-[10px] text-slate-500 leading-snug">
                        {isGoogleDriveUrl(urlInput)
                          ? "Vérifiez que ce fichier Google Drive est partagé sur « Tous les utilisateurs disposant du lien »."
                          : "Le lien ne renvoie pas une image valide."}
                      </p>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={normalizeImageUrl(urlInput.trim())}
                      alt={urlAltInput || "Aperçu"}
                      className="w-full h-full object-contain"
                      onError={() => setUrlImgError(true)}
                      onLoad={() => setUrlImgError(false)}
                    />
                  )
                ) : (
                  <div className="text-center text-slate-400 text-xs">
                    <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                    <span>Saisissez une URL pour voir l&apos;aperçu</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                      Description (Alt) commune pour le lot
                    </label>
                    <input
                      type="text"
                      value={batchBaseAlt}
                      onChange={(e) => setBatchBaseAlt(e.target.value)}
                      placeholder="Ex : Campagne Branding (numéroté #1, #2...)"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Astuce : vous pouvez aussi préciser un Alt spécifique sur une ligne avec le séparateur <code className="font-mono bg-slate-100 px-1 rounded">|</code> (ex: <code className="font-mono text-[10px]">https://... | Mon titre</code>).
                  </p>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[#0F172A]">
                      Collez vos liens d&apos;images (1 URL par ligne) *
                    </label>
                    <span className="text-xs font-mono font-semibold text-[#2563EB]">
                      {parsedBatchCount} image{parsedBatchCount > 1 ? "s" : ""} prête{parsedBatchCount > 1 ? "s" : ""}
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={batchUrlsText}
                    onChange={(e) => setBatchUrlsText(e.target.value)}
                    placeholder={`https://images.unsplash.com/photo-1...\nhttps://drive.google.com/file/d/...\nhttps://... | Texte alternatif personnalisé`}
                    className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowUrlAdder(false)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleUrlAdd}
                      disabled={urlSubmitting || parsedBatchCount === 0}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      {urlSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Importation en cours...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>
                            Importer les {parsedBatchCount > 0 ? parsedBatchCount : ""} image(s)
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Uploader dépliable (Support Multi-Fichiers) */}
      {showUploader && (
        <MediaUploader
          folder="portfolio/projets"
          onBatchUploadSuccess={handleBatchUploadSuccess}
          onCancel={() => setShowUploader(false)}
        />
      )}

      {/* Barre de recherche, filtres et sélection multiple */}
      {medias.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une image par description ou identifiant..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            {/* Filtres d'utilisation & boutons de sélection */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setUsageFilter("all")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    usageFilter === "all"
                      ? "bg-white text-[#0F172A] shadow-sm font-semibold"
                      : "text-slate-600"
                  }`}
                >
                  Tous ({medias.length})
                </button>
                <button
                  type="button"
                  onClick={() => setUsageFilter("used")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    usageFilter === "used"
                      ? "bg-white text-[#2563EB] shadow-sm font-semibold"
                      : "text-slate-600"
                  }`}
                >
                  Utilisés ({medias.filter(isMediaUsed).length})
                </button>
                <button
                  type="button"
                  onClick={() => setUsageFilter("unused")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    usageFilter === "unused"
                      ? "bg-white text-amber-700 shadow-sm font-semibold"
                      : "text-slate-600"
                  }`}
                >
                  Non utilisés ({medias.filter((m) => !isMediaUsed(m)).length})
                </button>
              </div>

              <button
                type="button"
                onClick={toggleSelectAllFiltered}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#0F172A] cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>
                  {filteredMedias.length > 0 &&
                  filteredMedias.every((m) => selectedIds.includes(m.id))
                    ? "Tout décocher"
                    : "Tout cocher"}
                </span>
              </button>

              <button
                type="button"
                onClick={selectUnusedFiltered}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-600 cursor-pointer"
                title="Sélectionner uniquement les médias qui ne sont utilisés par aucun projet"
              >
                <span>Cocher non-utilisés</span>
              </button>
            </div>
          </div>

          {/* Barre d'actions groupées lorsque des images sont cochées */}
          {selectedIds.length > 0 && (
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-blue-50/60 -mx-4 -mb-4 px-4 py-3 rounded-b-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
                <CheckSquare className="w-4 h-4" />
                <span>
                  {selectedIds.length} image{selectedIds.length > 1 ? "s" : ""} sélectionnée{selectedIds.length > 1 ? "s" : ""}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="text-slate-500 hover:text-slate-800 underline ml-2 font-normal cursor-pointer"
                >
                  Désélectionner
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySelectedUrls}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#0F172A] shadow-sm cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Copier les {selectedIds.length} URL(s)</span>
                </button>

                <button
                  type="button"
                  disabled={bulkDeleting}
                  onClick={handleBulkDelete}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {bulkDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Supprimer la sélection ({selectedIds.length})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grille des médias */}
      {filteredMedias.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-[#0F172A] mb-1">
            {medias.length === 0
              ? "Aucune image dans la médiathèque"
              : "Aucun média ne correspond à ce filtre"}
          </h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto mb-6">
            Ajoutez vos visuels par lot d&apos;URLs ou téléversez plusieurs images simultanément vers Cloudinary.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMedias.map((media) => {
            const isUsedCover = media.coverForProjects.length > 0;
            const isUsedGallery = media.projectGalleries.length > 0;
            const isUsed = isUsedCover || isUsedGallery;
            const isSelected = selectedIds.includes(media.id);

            return (
              <div
                key={media.id}
                onClick={() => toggleSelectMedia(media.id)}
                className={`group bg-white rounded-2xl border overflow-hidden transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "ring-2 ring-[#2563EB] border-[#2563EB] shadow-md"
                    : "border-slate-200/80 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Image & Overlay */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={media.url}
                    alt={media.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Case de sélection en haut à gauche */}
                  <div className="absolute top-2 left-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shadow transition-all ${
                        isSelected
                          ? "bg-[#2563EB] text-white"
                          : "bg-black/55 text-white/80 hover:bg-black/80"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>

                  <div
                    className="absolute top-2 right-2 flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(media.id, media.url)}
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors text-[10px] cursor-pointer"
                      title="Copier l'URL"
                    >
                      {copiedId === media.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
                      title="Ouvrir l'image en pleine résolution"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Format & Dimensions */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                    <span className="bg-black/65 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono uppercase">
                      {media.format}
                    </span>
                    <span className="bg-black/65 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono">
                      {media.width}×{media.height}
                    </span>
                  </div>
                </div>

                {/* Métadonnées & Utilisation */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div
                      className="text-xs font-semibold text-[#0F172A] line-clamp-2"
                      title={media.alt}
                    >
                      {media.alt}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate mt-1">
                      {media.publicId}
                    </div>
                  </div>

                  {/* Badges d'utilisation */}
                  <div className="space-y-1.5">
                    {isUsedCover && (
                      <div className="flex flex-wrap gap-1 items-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-[#2563EB] border border-blue-200">
                          <Sparkles className="w-2.5 h-2.5" /> Couverture :
                        </span>
                        {media.coverForProjects.map((p) => (
                          <span
                            key={p.id}
                            className="text-[10px] text-slate-600 font-medium truncate max-w-[120px]"
                            title={p.titre}
                          >
                            {p.titre}
                          </span>
                        ))}
                      </div>
                    )}

                    {isUsedGallery && (
                      <div className="flex flex-wrap gap-1 items-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Layers className="w-2.5 h-2.5" /> Galerie :
                        </span>
                        {media.projectGalleries.map((g) => (
                          <span
                            key={g.project.id}
                            className="text-[10px] text-slate-600 font-medium truncate max-w-[120px]"
                            title={g.project.titre}
                          >
                            {g.project.titre}
                          </span>
                        ))}
                      </div>
                    )}

                    {!isUsed && (
                      <span className="text-[10px] text-slate-400 italic">
                        Non associé à un projet
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    className="pt-2 border-t border-slate-100 flex items-center justify-between"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(media.createdAt).toLocaleDateString("fr-FR")}
                    </span>

                    <button
                      type="button"
                      disabled={isUsed || deletingId === media.id}
                      onClick={() => handleDelete(media)}
                      className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg transition-colors ${
                        isUsed
                          ? "text-slate-300 cursor-not-allowed"
                          : "text-red-600 hover:bg-red-50 cursor-pointer"
                      }`}
                      title={
                        isUsed
                          ? "Impossible de supprimer : le média est utilisé par un projet"
                          : "Supprimer définitivement l'image"
                      }
                    >
                      {deletingId === media.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
