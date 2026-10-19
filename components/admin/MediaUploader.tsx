"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X, Image as ImageIcon } from "lucide-react";

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
  onCancel?: () => void;
  className?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo

export function MediaUploader({
  folder = "portfolio/projets",
  onUploadSuccess,
  onCancel,
  className = "",
}: MediaUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    setSuccess(false);

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Format non autorisé. Formats acceptés : JPEG, PNG, WebP, AVIF.");
      return;
    }

    if (selectedFile.size > MAX_SIZE_BYTES) {
      setError(
        `Fichier trop volumineux (${(selectedFile.size / (1024 * 1024)).toFixed(1)} Mo). Taille maximale autorisée : 10 Mo.`
      );
      return;
    }

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setAlt("");
    setError(null);
    setSuccess(false);
    setUploadProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Veuillez sélectionner un fichier image.");
      return;
    }

    if (!alt.trim()) {
      setError("Le texte descriptif alternatif (alt) est obligatoire pour l'accessibilité.");
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(10);

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

      const { signature, timestamp, apiKey, cloudName, folder: targetFolder } = await signRes.json();
      setUploadProgress(35);

      // 2. Téléversement direct depuis le navigateur vers l'API Cloudinary (évite la limite Vercel)
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
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
          cldErr.error?.message || "Échec du téléversement vers le serveur Cloudinary."
        );
      }

      const cldData = await cloudinaryRes.json();
      setUploadProgress(80);

      // 3. Enregistrement des métadonnées du média dans la base Neon
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
          alt: alt.trim(),
        }),
      });

      if (!saveRes.ok) {
        const saveErr = await saveRes.json().catch(() => ({}));
        throw new Error(saveErr.error || "Échec de l'enregistrement du média dans la base.");
      }

      const { media } = await saveRes.json();
      setUploadProgress(100);
      setSuccess(true);

      if (onUploadSuccess) {
        onUploadSuccess(media);
      }

      // Nettoyage après un court délai
      setTimeout(() => {
        handleReset();
      }, 1500);
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
            Téléversement direct d&apos;image (Cloudinary)
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

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Image téléversée et enregistrée avec succès dans la médiathèque !</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Zone de sélection / Drag and drop */}
        {!previewUrl ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-[#2563EB] bg-blue-50/50"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-slate-50/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-[#0F172A] mb-1">
              Glissez-déposez votre image ici, ou <span className="text-[#2563EB]">parcourez</span>
            </p>
            <p className="text-[11px] text-slate-400">
              JPEG, PNG, WebP ou AVIF • Max 10 Mo • Ratio 16:9 recommandé
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Aperçu du fichier */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center aspect-video max-h-56">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Aperçu avant envoi"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={handleReset}
                disabled={uploading}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
                title="Supprimer la sélection"
              >
                <X className="w-4 h-4" />
              </button>
              {file && (
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-mono text-white">
                  {file.name} • {(file.size / (1024 * 1024)).toFixed(2)} Mo
                </div>
              )}
            </div>

            {/* Champ obligatoire : Texte alternatif (alt) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#0F172A]">
                  Texte alternatif (Alt) <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  Obligatoire pour le référencement et l&apos;accessibilité
                </span>
              </div>
              <input
                type="text"
                required
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                disabled={uploading}
                placeholder="Ex : Aperçu du tableau de bord de gestion des projets"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>
        )}

        {/* Barre de progression */}
        {uploading && uploadProgress !== null && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>Téléversement direct vers Cloudinary...</span>
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
        {file && (
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={uploading}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading || !alt.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Confirmer et téléverser</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
