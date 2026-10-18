"use client";

import { useState, useEffect } from "react";
import { X, Search, Image as ImageIcon, Upload, Check, Loader2 } from "lucide-react";
import { MediaUploader, type UploadedMedia } from "./MediaUploader";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: UploadedMedia) => void;
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = "Sélectionner une image",
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [medias, setMedias] = useState<UploadedMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = medias.filter(
    (m) =>
      m.alt.toLowerCase().includes(search.toLowerCase()) ||
      m.publicId.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectMedia = (media: UploadedMedia) => {
    onSelect(media);
    onClose();
  };

  const handleUploadSuccess = (newMedia: UploadedMedia) => {
    setMedias((prev) => [newMedia, ...prev]);
    onSelect(newMedia);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* En-tête */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-semibold text-sm text-[#0F172A]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Onglets */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab("library")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "library"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Médiathèque ({medias.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "upload"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Téléverser direct</span>
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 flex-1 overflow-y-auto min-h-[360px]">
          {activeTab === "library" ? (
            <div className="space-y-4">
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher par description (alt) ou identifiant..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
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
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className="inline-flex items-center gap-1.5 text-xs text-[#2563EB] font-medium hover:underline"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Téléverser une image maintenant
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filtered.map((media) => {
                    const isSelected = selectedId === media.id;
                    return (
                      <div
                        key={media.id}
                        onClick={() => setSelectedId(media.id)}
                        onDoubleClick={() => handleSelectMedia(media)}
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-2 left-2 right-2 text-white">
                          <p className="text-[11px] font-semibold truncate leading-tight">
                            {media.alt}
                          </p>
                          <span className="text-[9px] font-mono opacity-70">
                            {media.width}×{media.height} • {media.format}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <MediaUploader
              folder="portfolio/projets"
              onUploadSuccess={handleUploadSuccess}
            />
          )}
        </div>

        {/* Pied de modal pour l'onglet médiathèque */}
        {activeTab === "library" && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-[11px] text-slate-500">
              Double-cliquez sur une image ou sélectionnez-la puis validez.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={!selectedId}
                onClick={() => {
                  const m = medias.find((item) => item.id === selectedId);
                  if (m) handleSelectMedia(m);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                Valider la sélection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
