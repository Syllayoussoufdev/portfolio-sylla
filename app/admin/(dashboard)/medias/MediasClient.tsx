"use client";

import { useState } from "react";
import Image from "next/image";
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
} from "lucide-react";
import { MediaUploader, type UploadedMedia } from "@/components/admin/MediaUploader";

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadSuccess = (newMedia: UploadedMedia) => {
    const formatted: MediaWithUsage = {
      ...newMedia,
      coverForProjects: [],
      projectGalleries: [],
    };
    setMedias((prev) => [formatted, ...prev]);
    setSuccessNotice("Média ajouté avec succès à la médiathèque.");
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleDelete = async (media: MediaWithUsage) => {
    setErrorNotice(null);
    setSuccessNotice(null);

    const isUsed =
      media.coverForProjects.length > 0 || media.projectGalleries.length > 0;

    if (isUsed) {
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
      setSuccessNotice("Image supprimée avec succès.");
      setTimeout(() => setSuccessNotice(null), 3000);
    } catch (err: unknown) {
      setErrorNotice(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="font-bebas text-3xl tracking-wide text-[#0F172A] flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-[#2563EB]" />
            MÉDIATHÈQUE CLOUDINARY
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Gestion centralisée des visuels haute fidélité, ratios et métadonnées d&apos;accessibilité (Alt).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUploader(!showUploader)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>{showUploader ? "Fermer l'envoi" : "Téléverser une image"}</span>
        </button>
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
            className="text-xs text-red-500 hover:text-red-800"
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

      {/* Uploader dépliable */}
      {showUploader && (
        <MediaUploader
          folder="portfolio/projets"
          onUploadSuccess={handleUploadSuccess}
          onCancel={() => setShowUploader(false)}
        />
      )}

      {/* Grille des médias */}
      {medias.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-[#0F172A] mb-1">
            Aucune image dans la médiathèque
          </h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto mb-6">
            Téléversez vos visuels de réalisations directement vers Cloudinary avec texte alternatif
            obligatoire pour alimenter les couvertures et galeries.
          </p>
          <button
            type="button"
            onClick={() => setShowUploader(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Ajouter ma première image</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {medias.map((media) => {
            const isUsedCover = media.coverForProjects.length > 0;
            const isUsedGallery = media.projectGalleries.length > 0;
            const isUsed = isUsedCover || isUsedGallery;

            return (
              <div
                key={media.id}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
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
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(media.id, media.url)}
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors text-[10px]"
                      title="Copier l'URL Cloudinary"
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
                    <span className="bg-black/65 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono">
                      {(media.bytes / 1024).toFixed(0)} Ko
                    </span>
                  </div>
                </div>

                {/* Métadonnées & Utilisation */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A] line-clamp-2" title={media.alt}>
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
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
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
