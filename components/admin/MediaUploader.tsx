"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Image as ImageIcon,
  Plus,
  Sparkles,
} from "lucide-react";

export interface UploadedMedia {
  id: string;
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  alt: string;
  createdAt: string | Date;
}

interface MediaUploaderProps {
  folder?: string;
  onUploadSuccess?: (media: UploadedMedia) => void;
  onBatchUploadSuccess?: (medias: UploadedMedia[]) => void;
  onCancel?: () => void;
  className?: string;
}

interface QueuedFileItem {
  uid: string;
  file: File;
  previewUrl: string;
  alt: string;
  status: "pending" | "uploading" | "done" | "error";
  errorMessage?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo

function deriveDefaultAlt(filename: string): string {
  const withoutExt = filename.replace(/\.[^/.]+$/, "");
  const cleaned = withoutExt
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "Visuel réalisation";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function MediaUploader({
  folder = "portfolio/projets",
  onUploadSuccess,
  onBatchUploadSuccess,
  onCancel,
  className = "",
}: MediaUploaderProps) {
  const [queue, setQueue] = useState<QueuedFileItem[]>([]);
  const [globalAltPrefix, setGlobalAltPrefix] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFilesToQueue = (selectedFiles: FileList | File[]) => {
    setError(null);
    setSuccessCount(0);

    const filesArr = Array.from(selectedFiles);
    const rejectedMessages: string[] = [];
    const newItems: QueuedFileItem[] = [];

    for (const selectedFile of filesArr) {
      if (!ALLOWED_TYPES.includes(selectedFile.type)) {
        rejectedMessages.push(
          `${selectedFile.name} : format non autorisé (JPEG, PNG, WebP, AVIF uniquement).`
        );
        continue;
      }

      if (selectedFile.size > MAX_SIZE_BYTES) {
        rejectedMessages.push(
          `${selectedFile.name} : trop volumineux (${(selectedFile.size / (1024 * 1024)).toFixed(1)} Mo > 10 Mo).`
        );
        continue;
      }

      newItems.push({
        uid: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file: selectedFile,
        previewUrl: URL.createObjectURL(selectedFile),
        alt: deriveDefaultAlt(selectedFile.name),
        status: "pending",
      });
    }

    if (rejectedMessages.length > 0) {
      setError(rejectedMessages.join(" "));
    }

    if (newItems.length > 0) {
      setQueue((prev) => [...prev, ...newItems]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeQueueItem = (uid: string) => {
    setQueue((prev) => {
      const target = prev.find((i) => i.uid === uid);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((i) => i.uid !== uid);
    });
  };

  const updateItemAlt = (uid: string, newAlt: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.uid === uid ? { ...item, alt: newAlt } : item))
    );
  };

  const applyGlobalAltToAll = () => {
    const base = globalAltPrefix.trim();
    if (!base) return;
    setQueue((prev) =>
      prev.map((item, idx) => ({
        ...item,
        alt: prev.length > 1 ? `${base} — Visuel #${idx + 1}` : base,
      }))
    );
  };

  const handleReset = () => {
    queue.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setQueue([]);
    setGlobalAltPrefix("");
    setError(null);
    setSuccessCount(0);
    setUploadProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pendingItems = queue.filter((i) => i.status !== "done");
    if (pendingItems.length === 0) {
      setError("Veuillez sélectionner au moins une image à téléverser.");
      return;
    }

    const missingAlt = pendingItems.find((i) => !i.alt.trim());
    if (missingAlt) {
      setError(
        `Veuillez renseigner un texte alternatif (Alt) pour le fichier « ${missingAlt.file.name} ».`
      );
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(5);

    try {
      // 1. Récupération de la signature sécurisée auprès du serveur
      const signRes = await fetch("/api/admin/media/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });

      if (!signRes.ok) {
        const signErr = await signRes.json().catch(() => ({}));
        throw new Error(signErr.error || "Impossible d'obtenir la signature d'envoi.");
      }

      const {
        signature,
        timestamp,
        apiKey,
        cloudName,
        folder: targetFolder,
      } = await signRes.json();

      const uploadedResults: UploadedMedia[] = [];
      let completed = 0;

      for (const item of pendingItems) {
        setQueue((prev) =>
          prev.map((q) => (q.uid === item.uid ? { ...q, status: "uploading" } : q))
        );

        try {
          // 2. Téléversement direct vers Cloudinary
          const uploadFormData = new FormData();
          uploadFormData.append("file", item.file);
          uploadFormData.append("api_key", apiKey);
          uploadFormData.append("timestamp", String(timestamp));
          uploadFormData.append("signature", signature);
          uploadFormData.append("folder", targetFolder);

          const cloudinaryRes = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: "POST",
              body: uploadFormData,
            }
          );

          if (!cloudinaryRes.ok) {
            const cldErr = await cloudinaryRes.json().catch(() => ({}));
            throw new Error(
              cldErr.error?.message || "Échec du téléversement vers Cloudinary."
            );
          }

          const cldData = await cloudinaryRes.json();

          // 3. Enregistrement en base Neon
          const saveRes = await fetch("/api/admin/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              publicId: cldData.public_id,
              url: cldData.secure_url || cldData.url,
              width: cldData.width,
              height: cldData.height,
              format: cldData.format,
              bytes: cldData.bytes,
              alt: item.alt.trim(),
            }),
          });

          if (!saveRes.ok) {
            const saveErr = await saveRes.json().catch(() => ({}));
            throw new Error(saveErr.error || "Échec de l'enregistrement en base.");
          }

          const { media } = await saveRes.json();
          uploadedResults.push(media);

          setQueue((prev) =>
            prev.map((q) => (q.uid === item.uid ? { ...q, status: "done" } : q))
          );

          if (onUploadSuccess) {
            onUploadSuccess(media);
          }
        } catch (itemErr) {
          const msg =
            itemErr instanceof Error ? itemErr.message : "Erreur lors de l'envoi";
          setQueue((prev) =>
            prev.map((q) =>
              q.uid === item.uid ? { ...q, status: "error", errorMessage: msg } : q
            )
          );
        }

        completed++;
        setUploadProgress(Math.round((completed / pendingItems.length) * 100));
      }

      if (uploadedResults.length > 0) {
        setSuccessCount(uploadedResults.length);
        if (onBatchUploadSuccess) {
          onBatchUploadSuccess(uploadedResults);
        }
      }

      // Si tout a réussi, nettoyage automatique après un court délai
      if (uploadedResults.length === pendingItems.length) {
        setTimeout(() => {
          handleReset();
        }, 1400);
      }
    } catch (err: unknown) {
      console.error("Erreur téléversement média:", err);
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-sm font-semibold text-[#0F172A]">
            Téléversement d&apos;images (Unitaire ou Multiple • Cloudinary)
          </h3>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {successCount > 0 && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>
            {successCount > 1
              ? `${successCount} images téléversées et enregistrées avec succès dans la médiathèque !`
              : "Image téléversée et enregistrée avec succès dans la médiathèque !"}
          </span>
        </div>
      )}

      <div className="space-y-4">
        {/* Input file caché avec support MULTIPLE */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Zone Drag & Drop */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-[#2563EB] bg-blue-50/50"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-slate-50/20"
          }`}
        >
          <div className="w-11 h-11 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-2.5">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-[#0F172A] mb-1">
            Glissez-déposez <strong>une ou plusieurs images</strong> ici, ou{" "}
            <span className="text-[#2563EB] underline">parcourez vos fichiers</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Sélection multiple activée • JPEG, PNG, WebP ou AVIF • Max 10 Mo / image
          </p>
        </div>

        {/* Liste des fichiers en attente d'envoi */}
        {queue.length > 0 && (
          <div className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="text-xs font-semibold text-[#0F172A]">
                {queue.length} image{queue.length > 1 ? "s" : ""} prête{queue.length > 1 ? "s" : ""} à l&apos;importation
              </div>

              {queue.length > 1 && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={globalAltPrefix}
                    onChange={(e) => setGlobalAltPrefix(e.target.value)}
                    placeholder="Titre commun (ex: Projet SaaS)..."
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                  <button
                    type="button"
                    onClick={applyGlobalAltToAll}
                    disabled={!globalAltPrefix.trim()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563EB] hover:bg-blue-100 text-[11px] font-semibold disabled:opacity-40 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Numéroter les Alt</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {queue.map((item, idx) => (
                <div
                  key={item.uid}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all ${
                    item.status === "done"
                      ? "bg-emerald-50/50 border-emerald-200"
                      : item.status === "error"
                      ? "bg-red-50/50 border-red-200"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/70 text-white text-[9px] font-mono">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono text-slate-400 truncate">
                        {item.file.name} ({(item.file.size / (1024 * 1024)).toFixed(2)} Mo)
                      </span>
                      <button
                        type="button"
                        onClick={() => removeQueueItem(item.uid)}
                        disabled={uploading}
                        className="text-slate-400 hover:text-red-600 p-0.5 rounded"
                        title="Retirer ce fichier"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.alt}
                      onChange={(e) => updateItemAlt(item.uid, e.target.value)}
                      disabled={uploading || item.status === "done"}
                      placeholder="Texte alternatif (Alt) *"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />

                    {item.errorMessage && (
                      <p className="text-[10px] text-red-600">{item.errorMessage}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Barre de progression globale */}
        {uploading && uploadProgress !== null && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>Téléversement groupé vers Cloudinary ({queue.length} fichier{queue.length > 1 ? "s" : ""})...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2563EB] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        {queue.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter d&apos;autres fichiers</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                disabled={uploading}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Tout vider
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={uploading || queue.some((i) => !i.alt.trim())}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Importation en cours...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>
                      Téléverser {queue.length} image{queue.length > 1 ? "s" : ""}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
