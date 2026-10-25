"use client";

import { useState, useEffect } from "react";
import {
  X,
  Search,
  Image as ImageIcon,
  Upload,
  Check,
  Loader2,
  Link2,
  AlertCircle,
  Plus,
  Sparkles,
  CheckSquare,
  Square,
  Layers,
} from "lucide-react";
import { MediaUploader, type UploadedMedia } from "./MediaUploader";
import { normalizeImageUrl, isGoogleDriveUrl } from "@/lib/media-url";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: UploadedMedia) => void;
  /** Callback appelé en mode sélection multiple */
  onSelectMultiple?: (medias: UploadedMedia[]) => void;
  /** Active la sélection multiple d'images (ex: pour une galerie de projet) */
  multiple?: boolean;
  /** IDs des médias déjà présents dans la galerie pour information visuelle */
  alreadySelectedIds?: string[];
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  onSelectMultiple,
  multiple = false,
  alreadySelectedIds = [],
  title = "Sélectionner une image",
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload" | "url">("library");
  const [medias, setMedias] = useState<UploadedMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // États pour l'onglet "Ajouter par lien URL" (Mode Unitaire & Mode Multiple)
  const [urlMode, setUrlMode] = useState<"single" | "batch">(multiple ? "batch" : "single");
  const [urlInput, setUrlInput] = useState("");
  const [urlAltInput, setUrlAltInput] = useState("");
  const [batchUrlsText, setBatchUrlsText] = useState("");
  const [batchBaseAlt, setBatchBaseAlt] = useState("");
  const [urlSubmitting, setUrlSubmitting] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlImageError, setUrlImageError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedIds([]);
    setUrlMode(multiple ? "batch" : "single");

    async function fetchMedias() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/media");
        if (res.ok) {
          const data = await res.json();
          setMedias(data.medias || []);
        }
      } catch (err) {
        console.error("Erreur chargement médiathèque:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMedias();
  }, [isOpen, multiple]);

  if (!isOpen) return null;

  const filtered = medias.filter(
    (m) =>
      m.alt.toLowerCase().includes(search.toLowerCase()) ||
      m.publicId.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMediaSelection = (mediaId: string) => {
    if (!multiple) {
      setSelectedIds([mediaId]);
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(mediaId) ? prev.filter((id) => id !== mediaId) : [...prev, mediaId]
    );
  };

  const handleConfirmSelection = () => {
    if (selectedIds.length === 0) return;
    const selectedMedias = selectedIds
      .map((id) => medias.find((m) => m.id === id))
      .filter((m): m is UploadedMedia => Boolean(m));

    if (selectedMedias.length === 0) return;

    if (multiple && onSelectMultiple) {
      onSelectMultiple(selectedMedias);
    } else if (multiple) {
      selectedMedias.forEach((m) => onSelect(m));
    } else {
      onSelect(selectedMedias[0]);
    }
    onClose();
  };

  const handleSelectSingleImmediate = (media: UploadedMedia) => {
    if (multiple && onSelectMultiple) {
      onSelectMultiple([media]);
    } else {
      onSelect(media);
    }
    onClose();
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = filtered.map((m) => m.id);
    const allSelected = filteredIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedIds, ...filteredIds]));
      setSelectedIds(merged);
    }
  };

  const handleBatchUploadSuccess = (uploadedMedias: UploadedMedia[]) => {
    setMedias((prev) => [...uploadedMedias, ...prev]);
    if (multiple && onSelectMultiple) {
      onSelectMultiple(uploadedMedias);
      onClose();
    } else if (multiple) {
      uploadedMedias.forEach((m) => onSelect(m));
      onClose();
    } else if (uploadedMedias[0]) {
      onSelect(uploadedMedias[0]);
      onClose();
    }
  };

  const normalizedInputUrl = normalizeImageUrl(urlInput);
  const isDriveLink = isGoogleDriveUrl(urlInput);

  // Enregistrement d'une ou plusieurs URLs dans la base Neon / Médiathèque
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    if (urlMode === "single") {
      if (!normalizedInputUrl) {
        setUrlError("Veuillez renseigner une URL valide");
        return;
      }
      if (!urlAltInput.trim()) {
        setUrlError("Veuillez renseigner un texte descriptif (alt)");
        return;
      }

      setUrlSubmitting(true);
      try {
        const res = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: normalizedInputUrl,
            alt: urlAltInput.trim(),
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Impossible d'enregistrer l'image");
        }

        const createdMedia = data.media;
        setMedias((prev) => [createdMedia, ...prev]);
        if (multiple && onSelectMultiple) {
          onSelectMultiple([createdMedia]);
        } else {
          onSelect(createdMedia);
        }
        setUrlInput("");
        setUrlAltInput("");
        onClose();
      } catch (err: unknown) {
        setUrlError(err instanceof Error ? err.message : "Erreur inattendue");
      } finally {
        setUrlSubmitting(false);
      }
      return;
    }

    // Mode Lot (Batch URLs : 1 par ligne)
    const rawLines = batchUrlsText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (rawLines.length === 0) {
      setUrlError("Veuillez coller au moins une URL d'image (une par ligne).");
      return;
    }

    const baseAlt = batchBaseAlt.trim() || "Visuel réalisation";
    const items = rawLines.map((line, index) => {
      // Support optionnel du format "https://... | Mon texte alt"
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
        throw new Error(data.error || "Impossible d'enregistrer le lot d'images");
      }

      const createdList: UploadedMedia[] = data.medias || (data.media ? [data.media] : []);
      setMedias((prev) => [...createdList, ...prev]);

      if (multiple && onSelectMultiple) {
        onSelectMultiple(createdList);
      } else if (multiple) {
        createdList.forEach((m) => onSelect(m));
      } else if (createdList[0]) {
        onSelect(createdList[0]);
      }

      setBatchUrlsText("");
      setBatchBaseAlt("");
      onClose();
    } catch (err: unknown) {
      setUrlError(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setUrlSubmitting(false);
    }
  };

  const parsedBatchCount = batchUrlsText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* En-tête */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ImageIcon className="w-5 h-5 text-[#2563EB]" />
            <div>
              <h3 className="font-semibold text-sm text-[#0F172A]">{title}</h3>
              {multiple && (
                <p className="text-[11px] text-slate-500">
                  Sélection multiple activée : cliquez sur plusieurs visuels pour les ajouter d&apos;un seul coup.
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Onglets */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("library")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "library"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Médiathèque ({medias.length})</span>
            {selectedIds.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px]">
                {selectedIds.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "url"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Importer par URL / Drive (1 ou plusieurs)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "upload"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Téléverser fichiers (1 ou plusieurs)</span>
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 flex-1 overflow-y-auto min-h-[380px]">
          {activeTab === "library" ? (
            <div className="space-y-4">
              {/* Barre de recherche + Outils de sélection multiple */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher par description (alt) ou identifiant..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                {multiple && filtered.length > 0 && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleSelectAllFiltered}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#0F172A] cursor-pointer"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>
                        {filtered.every((m) => selectedIds.includes(m.id))
                          ? "Tout désélectionner"
                          : `Tout cocher (${filtered.length})`}
                      </span>
                    </button>
                    {selectedIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedIds([])}
                        className="px-2.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Réinitialiser ({selectedIds.length})
                      </button>
                    )}
                  </div>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" />
                  <span className="text-xs">Chargement de la médiathèque...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-slate-400 space-y-3">
                  <p className="text-xs">
                    {search
                      ? "Aucune image ne correspond à votre recherche."
                      : "La médiathèque est vide pour le moment."}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab("url")}
                      className="inline-flex items-center gap-1.5 text-xs text-[#2563EB] font-medium hover:underline cursor-pointer"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      Importer par URL / Drive
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("upload")}
                      className="inline-flex items-center gap-1.5 text-xs text-[#2563EB] font-medium hover:underline cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Téléverser des images
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filtered.map((media) => {
                    const selectionIndex = selectedIds.indexOf(media.id);
                    const isSelected = selectionIndex !== -1;
                    const isAlreadyInGallery = alreadySelectedIds.includes(media.id);

                    return (
                      <div
                        key={media.id}
                        onClick={() => toggleMediaSelection(media.id)}
                        onDoubleClick={() => {
                          if (!multiple) handleSelectSingleImmediate(media);
                        }}
                        className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all aspect-video bg-slate-900 ${
                          isSelected
                            ? "ring-2 ring-[#2563EB] border-[#2563EB] shadow-md"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={media.url}
                          alt={media.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-90" />

                        {/* Badge Déjà dans la galerie */}
                        {isAlreadyInGallery && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[9px] font-bold shadow">
                            Déjà ajouté
                          </div>
                        )}

                        {/* Case à cocher / Numéro d'ordre de sélection */}
                        <div
                          className={`absolute top-2 right-2 min-w-6 h-6 px-1.5 rounded-full flex items-center justify-center text-[11px] font-bold shadow transition-all ${
                            isSelected
                              ? "bg-[#2563EB] text-white scale-105"
                              : "bg-black/50 text-white/80 border border-white/40 group-hover:bg-black/75"
                          }`}
                        >
                          {isSelected ? (
                            multiple ? (
                              <span>#{selectionIndex + 1}</span>
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )
                          ) : (
                            <Square className="w-3 h-3 opacity-70" />
                          )}
                        </div>

                        <div className="absolute bottom-2 left-2 right-2 text-white">
                          <p className="text-[11px] font-semibold truncate leading-tight">
                            {media.alt}
                          </p>
                          <span className="text-[9px] font-mono opacity-70">
                            {media.width && media.height
                              ? `${media.width}×${media.height} • `
                              : ""}
                            {media.format}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : activeTab === "url" ? (
            <div className="max-w-xl mx-auto py-1 space-y-4">
              {/* Sélecteur Mode Unitaire vs Mode Lot (Multi-URLs) */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                <button
                  type="button"
                  onClick={() => setUrlMode("single")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    urlMode === "single"
                      ? "bg-white text-[#0F172A] shadow-sm"
                      : "text-slate-600 hover:text-[#0F172A]"
                  }`}
                >
                  Une seule URL
                </button>
                <button
                  type="button"
                  onClick={() => setUrlMode("batch")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    urlMode === "batch"
                      ? "bg-white text-[#2563EB] shadow-sm"
                      : "text-slate-600 hover:text-[#0F172A]"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Importation multiple (Lot d&apos;URLs)</span>
                </button>
              </div>

              {urlError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{urlError}</span>
                </div>
              )}

              {urlMode === "single" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                      Lien de l&apos;image (URL directe ou lien Google Drive) *
                    </label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => {
                        setUrlInput(e.target.value);
                        setUrlImageError(false);
                      }}
                      placeholder="https://drive.google.com/file/d/... ou https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                    {isDriveLink && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          Lien Google Drive détecté et converti automatiquement !
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                      Texte alternatif descriptif (alt) *
                    </label>
                    <input
                      type="text"
                      value={urlAltInput}
                      onChange={(e) => setUrlAltInput(e.target.value)}
                      placeholder="Ex : Capture de l'application SaaS en mode sombre"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  {normalizedInputUrl && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Aperçu en direct
                      </span>
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video max-h-48 flex items-center justify-center">
                        {urlImageError ? (
                          <div className="p-4 text-center text-amber-200 flex flex-col items-center justify-center gap-1.5 max-w-sm">
                            <AlertCircle className="w-6 h-6 text-amber-400" />
                            <p className="text-xs font-semibold text-white">
                              Impossible d&apos;afficher l&apos;image
                            </p>
                          </div>
                        ) : (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={normalizedInputUrl}
                            alt={urlAltInput || "Prévisualisation"}
                            onError={() => setUrlImageError(true)}
                            onLoad={() => setUrlImageError(false)}
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleUrlSubmit}
                      disabled={urlSubmitting || !normalizedInputUrl || !urlAltInput.trim()}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                    >
                      {urlSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Enregistrement...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Enregistrer et sélectionner</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-800 space-y-1">
                    <p className="font-semibold">
                      Importation rapide de plusieurs images par liens URL / Google Drive :
                    </p>
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      Collez <strong>une URL par ligne</strong>. Toutes les images seront automatiquement normalisées, enregistrées dans la médiathèque et ajoutées à votre sélection.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                      Titre / Description de base pour le lot *
                    </label>
                    <input
                      type="text"
                      value={batchBaseAlt}
                      onChange={(e) => setBatchBaseAlt(e.target.value)}
                      placeholder="Ex : Maquette Plateforme Immobilier (numéroté automatiquement #1, #2...)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-[#0F172A]">
                        Liste des URLs d&apos;images (1 lien par ligne) *
                      </label>
                      <span className="text-[11px] font-mono text-[#2563EB] font-semibold">
                        {parsedBatchCount} lien{parsedBatchCount > 1 ? "s" : ""} détecté{parsedBatchCount > 1 ? "s" : ""}
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      value={batchUrlsText}
                      onChange={(e) => setBatchUrlsText(e.target.value)}
                      placeholder={`https://images.unsplash.com/photo-1...\nhttps://drive.google.com/file/d/...\nhttps://... | Description personnalisée optionnelle`}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleUrlSubmit}
                      disabled={urlSubmitting || parsedBatchCount === 0}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                    >
                      {urlSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Importation de {parsedBatchCount} image(s)...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>
                            Importer et sélectionner {parsedBatchCount > 0 ? `(${parsedBatchCount})` : ""}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <MediaUploader
                folder="portfolio/projets"
                onBatchUploadSuccess={handleBatchUploadSuccess}
              />
            </div>
          )}
        </div>

        {/* Pied de modal pour l'onglet médiathèque */}
        {activeTab === "library" && filtered.length > 0 && (
          <div className="px-6 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
            <span className="text-xs text-slate-600">
              {selectedIds.length > 0 ? (
                <strong className="text-[#2563EB]">
                  {selectedIds.length} image{selectedIds.length > 1 ? "s" : ""} sélectionnée{selectedIds.length > 1 ? "s" : ""}
                </strong>
              ) : multiple ? (
                "Cliquez sur une ou plusieurs images pour les cocher."
              ) : (
                "Double-cliquez sur une image ou sélectionnez-la puis validez."
              )}
            </span>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={handleConfirmSelection}
                className="px-5 py-2 text-xs font-semibold bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                {multiple && selectedIds.length > 1
                  ? `Ajouter les ${selectedIds.length} images sélectionnées`
                  : "Valider la sélection"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
