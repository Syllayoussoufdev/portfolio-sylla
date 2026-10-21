"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";
import {
  CONSENT_STORAGE_KEY,
  updateGtagConsent,
  type ConsentStatus,
} from "@/lib/analytics-client";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Vérifier si un choix a déjà été enregistré
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) {
      // Afficher la bannière après un léger délai pour une expérience fluide
      const timer = setTimeout(() => setIsVisible(true), 900);
      return () => clearTimeout(timer);
    }
  }, []);

  // Permettre au footer ou à n'importe quel bouton de ré-ouvrir les paramètres de cookies
  useEffect(() => {
    window.openCookieSettings = () => {
      setIsVisible(true);
      setIsMinimized(false);
    };
  }, []);

  const handleConsent = (status: ConsentStatus) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
    updateGtagConsent(status);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      role="region"
      aria-label="Gestion des cookies et confidentialité"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[9999] transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-900/15 text-[#0F172A] dark:text-white space-y-4">
        {/* En-tête */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Respect de votre vie privée
              </h3>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Mesure d'audience anonymisée (GA4)
              </p>
            </div>
          </div>
          <button
            onClick={() => handleConsent("denied")}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            title="Refuser et fermer"
            aria-label="Refuser et fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message d'explication transparent */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Ce site utilise des cookies de mesure d’audience Google Analytics 4 (anonymisés) pour comprendre les contenus les plus consultés et améliorer l'expérience. Aucun cookie publicitaire n'est utilisé.
        </p>

        {/* Actions directes sans piège */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <button
            onClick={() => handleConsent("granted")}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#0F172A] dark:bg-[#2563EB] hover:bg-[#2563EB] dark:hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            Accepter
          </button>
          <button
            onClick={() => handleConsent("denied")}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200/80 dark:border-white/10 transition-all active:scale-[0.98] cursor-pointer"
          >
            Refuser
          </button>
        </div>

        {/* Lien vers politique de confidentialité */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-white/5">
          <Link
            href="/confidentialite"
            className="hover:text-[#2563EB] dark:hover:text-blue-400 underline underline-offset-2 transition-colors"
          >
            Politique de confidentialité
          </Link>
          <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Conforme RGPD
          </span>
        </div>
      </div>
    </aside>
  );
}
