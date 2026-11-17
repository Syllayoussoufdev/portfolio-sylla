"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
  Layers,
  Wrench,
  Check,
  ChevronRight,
} from "lucide-react";
import { BriefWizardModal } from "@/components/devcreative/BriefWizardModal";
import { ServicesCatalogDrawer } from "@/components/devcreative/ServicesCatalogDrawer";
import {
  formatFCFA,
  INITIAL_SERVICE_OFFERS,
  INITIAL_SERVICE_PACKS,
  type ServiceOfferData,
  type ServicePackData,
} from "@/lib/devcreative-catalog";
import { trackPackView, trackWizardStart, trackWhatsappClick } from "@/lib/analytics-client";
import type { SiteSettingsData } from "@/lib/profiles";

interface ServicesPacksDevCreativeProps {
  offers?: ServiceOfferData[];
  packs?: ServicePackData[];
  settings?: SiteSettingsData | null;
}

export function ServicesPacksDevCreative({
  offers = [],
  packs = [],
  settings,
}: ServicesPacksDevCreativeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const packsGridRef = useRef<HTMLDivElement>(null);

  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardType, setWizardType] = useState<string>("Pack Starter Lancement");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      if (packsGridRef.current) {
        gsap.fromTo(
          packsGridRef.current.children,
          { y: 35, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: packsGridRef.current,
              start: "top 88%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const displayOffers: ServiceOfferData[] =
    offers.length > 0
      ? offers
      : INITIAL_SERVICE_OFFERS.map((o, idx) => ({ ...o, id: `init-offer-${idx}` }));

  const displayPacks: ServicePackData[] =
    packs.length > 0
      ? packs
      : INITIAL_SERVICE_PACKS.map((p, idx) => ({ ...p, id: `init-pack-${idx}` }));

  // Extraction du numéro WhatsApp propre
  const rawDigits = (settings?.whatsapp || "2250594564993").replace(/[^0-9]/g, "");
  const cleanWhatsapp =
    rawDigits.length === 10 && rawDigits.startsWith("0") ? `225${rawDigits}` : (rawDigits || "2250594564993");

  const handleOrderPack = (label: string, slug = "", price = 0) => {
    trackPackView(slug, label, price);
    setWizardType(label);
    trackWizardStart(label, "pricing_card");
    setWizardOpen(true);
  };

  const getWhatsappPackHref = (packTitle: string) => {
    const message = `Bonjour Sylla 👋, je suis intéressé par votre formule "${packTitle}". Pouvons-nous échanger sur la mise en place ?`;
    return `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section
      id="offres-packs"
      ref={sectionRef}
      className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20 space-y-12 text-[#0A1D37]"
    >
      {/* =====================================================================
          1. EN-TÊTE ÉPURÉ DE LA SECTION TARIFS (Style SaaS Minimaliste)
         ===================================================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#CBE2FF] shadow-2xs text-xs font-semibold text-[#0A1D37]">
            <Sparkles className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>Tarifs clairs &amp; transparents · Aucun frais caché</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0A1D37] font-[family-name:var(--font-dm-sans)]">
            Des formules conçues pour{" "}
            <span className="italic font-normal text-[#0EA5E9] font-[family-name:var(--font-instrument-serif)] text-[1.12em]">
              votre rentabilité.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            Investissement attractif pensé pour démarrer vite et convertir. Choisissez la formule adaptée à votre ambition.
          </p>
        </div>

        {/* Bouton d'accès au Panneau des Services à la carte */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="group inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-white hover:bg-[#F0F7FF] border-2 border-[#CBE2FF] hover:border-[#2563EB] text-[#0A1D37] text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#2563EB] group-hover:scale-110 transition-transform" />
            <span>Panneau des services à la carte (15 offres)</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#0EA5E9] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. GRILLE DES 4 PACKS MINIMALISTES (Style Référence SaaS Minimaliste)
         ===================================================================== */}
      <div
        ref={packsGridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
      >
        {displayPacks.slice(0, 4).map((pack, idx) => {
          const isFeatured = pack.misEnAvant || idx === 2; // Pack Croissance & Acquisition mis en valeur
          const cleanFeatures = pack.servicesInclus.map((item) =>
            item.replace(/^(Inclus\s*:\s*|Annexe\s*\/\s*Option\s*:\s*|⚠️\s*REQUIS\s*:\s*)/i, "").trim()
          );

          return (
            <div
              key={pack.id || pack.slug}
              className={`relative rounded-[28px] p-7 flex flex-col justify-between transition-all duration-300 ${
                isFeatured
                  ? "bg-[#061326] text-white border-2 border-[#0EA5E9] shadow-2xl lg:-translate-y-3 z-10"
                  : "bg-white text-[#0A1D37] border border-[#CBD5E1]/80 hover:border-[#2563EB]/60 hover:shadow-xl shadow-xs"
              }`}
            >
              {/* Badge Populaire / Recommandé */}
              {isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] text-white text-[10px] font-mono font-extrabold uppercase tracking-widest shadow-md">
                  ⭐ Recommandé · Le plus choisi
                </div>
              )}

              <div className="space-y-6">
                {/* 1. Prix géant centré / haut de carte */}
                <div className="text-center pt-2">
                  <div
                    className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-[family-name:var(--font-dm-sans)] ${
                      isFeatured ? "text-white" : "text-[#0A1D37]"
                    }`}
                  >
                    {formatFCFA(pack.prix)}
                  </div>
                  <span
                    className={`text-[11px] font-mono mt-1 block font-semibold ${
                      isFeatured ? "text-[#0EA5E9]" : "text-[#64748B]"
                    }`}
                  >
                    Délai estimé : {pack.delai}
                  </span>
                </div>

                {/* 2. Nom de la formule & Sous-titre */}
                <div className="text-center space-y-1.5 pb-2 border-b border-[#E2E8F0]/30">
                  <h3
                    className={`text-lg font-bold ${
                      isFeatured ? "text-white" : "text-[#0A1D37]"
                    }`}
                  >
                    {pack.titre}
                  </h3>
                  {pack.sousTitre && (
                    <p
                      className={`text-xs leading-relaxed ${
                        isFeatured ? "text-slate-300" : "text-[#475569]"
                      }`}
                    >
                      {pack.sousTitre}
                    </p>
                  )}
                </div>

                {/* 3. Liste de contrôle des fonctionnalités épurée (Green Checkmarks) */}
                <ul className="space-y-3 text-xs">
                  {cleanFeatures.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isFeatured
                            ? "bg-[#0EA5E9]/20 text-[#0EA5E9]"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span
                        className={`leading-snug ${
                          isFeatured ? "text-slate-200" : "text-[#334155]"
                        }`}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Boutons d'Action Clairs (Primaire + Secondaire WhatsApp) */}
              <div className="pt-8 space-y-2.5 mt-6 border-t border-[#E2E8F0]/30">
                <button
                  type="button"
                  onClick={() => handleOrderPack(pack.titre, pack.slug, pack.prix)}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isFeatured
                      ? "bg-[#0EA5E9] hover:bg-[#38BDF8] text-[#061326] shadow-lg shadow-sky-500/25 active:scale-98"
                      : "bg-[#0F172A] hover:bg-[#2563EB] text-white active:scale-98"
                  }`}
                >
                  <span>Choisir ce pack</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <a
                  href={getWhatsappPackHref(pack.titre)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsappClick(`pack_card_${pack.slug}`)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isFeatured
                      ? "bg-white/10 hover:bg-white/15 text-white border border-white/15"
                      : "bg-white hover:bg-slate-50 text-[#334155] border border-slate-200"
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>Discuter sur WhatsApp</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================================
          3. BANDEAU DE RECOURS : SERVICES À LA CARTE & MAINTENANCE (Dès 50k / 25k)
         ===================================================================== */}
      <div className="rounded-3xl bg-gradient-to-r from-white via-white to-[#F0F7FF] border border-[#CBE2FF] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#0A1D37]">
                Besoin d&apos;une prestation spécifique à l&apos;unité ?
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7] text-[10px] font-mono font-bold">
                dès 50 000 FCFA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] max-w-2xl leading-relaxed">
              Automatisation n8n, Campagnes Facebook Ads ciblées, Création de page professionnelle, Audit UX ou Maintenance technique mensuelle (dès 25 000 FCFA/mois). Tout est accessible sans engagement.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="w-full lg:w-auto px-6 py-3.5 rounded-xl bg-[#0A1D37] hover:bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <span>Ouvrir le panneau à la carte</span>
            <ArrowUpRight className="w-4 h-4 text-[#0EA5E9]" />
          </button>
        </div>
      </div>

      {/* =====================================================================
          4. BOUTON FLOTTANT DISCRET POUR ROUVRIR LE PANNEAU À TOUT MOMENT
         ===================================================================== */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label="Ouvrir les services à la carte"
        className="fixed bottom-6 right-6 z-40 hidden md:inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#061326] text-white hover:bg-[#2563EB] text-xs font-bold shadow-2xl border border-white/20 transition-all hover:scale-105 cursor-pointer"
      >
        <Layers className="w-4 h-4 text-[#0EA5E9]" />
        <span>Services à la carte (dès 50k)</span>
      </button>

      {/* MODALE DU BRIEF EN 4 ÉTAPES */}
      <BriefWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        initialProjectType={wizardType}
      />

      {/* PANNEAU LATÉRAL COULISSANT DES SERVICES À LA CARTE */}
      <ServicesCatalogDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        offers={displayOffers}
        onSelectOffer={(title) => {
          setWizardType(title);
          setWizardOpen(true);
        }}
        whatsappNumber={cleanWhatsapp}
      />
    </section>
  );
}
