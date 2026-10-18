"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ProjectLightboxProps {
  images: GalleryImage[];
}

export function ProjectLightbox({ images }: ProjectLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const isOpen = selectedIndex !== null;

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? 0 : (prev + 1) % images.length));
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? 0 : (prev - 1 + images.length) % images.length));
  }, [images.length]);

  // Écouteur clavier : Echap, Flèche gauche, Flèche droite
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Empêcher le scroll de la page quand la lightbox est ouverte
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, handleClose, handleNext, handlePrev]);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full">
      {/* Grille d'affichage des miniatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedIndex(idx)}
            className="group relative aspect-16/10 rounded-2xl overflow-hidden glass border border-white/60 shadow-sm hover:shadow-md transition-all cursor-pointer text-left focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Voile au survol avec icône zoom */}
            <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="p-2.5 rounded-full bg-white/90 text-[#0F172A] shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                <Maximize2 className="w-4 h-4" />
              </span>
            </div>

            {img.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 pt-6 text-white text-xs font-mono">
                {img.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Plein Écran */}
      <AnimatePresence>
        {isOpen && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/85 backdrop-blur-md"
            onClick={handleClose}
          >
            {/* Bouton Fermer */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-white"
              aria-label="Fermer la lightbox (Échap)"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Précédent */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer focus:outline-hidden"
                aria-label="Image précédente"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Image courante */}
            <div
              className="relative max-w-5xl max-h-[85vh] w-full h-[75vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl"
              >
                <Image
                  src={images[selectedIndex].src}
                  alt={images[selectedIndex].alt}
                  fill
                  priority
                  className="object-contain"
                />
              </motion.div>

              {/* Barre de statut / légende */}
              <div className="mt-4 flex items-center justify-between w-full max-w-md px-4 py-2 rounded-full bg-white/10 text-white text-xs font-mono backdrop-blur-md">
                <span className="truncate pr-2">
                  {images[selectedIndex].caption || images[selectedIndex].alt}
                </span>
                <span className="text-white/60 whitespace-nowrap">
                  {selectedIndex + 1} / {images.length}
                </span>
              </div>
            </div>

            {/* Navigation Suivant */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer focus:outline-hidden"
                aria-label="Image suivante"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
