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
  FileText,
  Send,
  ExternalLink,
  HelpCircle,
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
import { trackPackView, trackWizardStart, trackWhatsappClick, trackCtaClick } from "@/lib/analytics-client";
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
          { y: 30, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.65,
            stagger: 0.08,
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

  // Récupérer l'ensemble des packs (6 packs en 2 lignes de 3 colonnes)
  const displayPacks: ServicePackData[] =
    packs.length > 0
      ? packs
      : INITIAL_SERVICE_PACKS.map((p, idx) => ({ ...p, id: `init-pack-${idx}` }));

  // Extraction propre du numéro WhatsApp
  const rawDigits = (settings?.whatsapp || "2250594564993").replace(/[^0-9]/g, "");
  const cleanWhatsapp =
    rawDigits.length === 10 && rawDigits.startsWith("0") ? `225${rawDigits}` : (rawDigits || "2250594564993");

  const handleOrderPack = (label: string, slug = "", price = 0) => {
    trackPackView(slug, label, price);
    setWizardType(label);
    trackWizardStart(label, "pricing_card");
    setWizardOpen(true);
  };

  const getWhatsappPackHref = (packTitle: string, isQuote = false) => {
    const message = isQuote
      ? `Bonjour Sylla 👋, j'ai un projet spécifique nécessitant un devis sur-mesure ("${packTitle}"). Pouvons-nous échanger sur le cahier des charges ?`
      : `Bonjour Sylla 👋, je suis intéressé par votre formule "${packTitle}". Pouvons-nous échanger sur la mise en place ?`;
    return `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section
      id="offres-packs"
      ref={sectionRef}
      className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20 space-y-12 text-[#0A1D37]"
    >
      {/* =====================================================================
          1. EN-TÊTE ÉPURÉ AVEC MENTION DU DEVIS SUR-MESURE & INCITATION AU CONTACT
         ===================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#CBE2FF] shadow-2xs text-xs font-semibold text-[#0A1D37]">
            <Sparkles className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>Tarifs clairs &amp; Devis personnalisés · Aucun frais caché</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0A1D37] font-[family-name:var(--font-dm-sans)]">
            Des formules pensées pour{" "}
            <span className="italic font-normal text-[#0EA5E9] font-[family-name:var(--font-instrument-serif)] text-[1.12em]">
              votre rentabilité.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            Tarifs attractifs calibrés pour démarrer vite et convertir. Pour tout projet spécifique ou objectif particulier, <strong className="text-[#0A1D37]">la réalisation d&apos;un devis sur-mesure est toujours possible</strong>.
          </p>
        </div>

        {/* Liens d'accès rapide : Formulaire direct, WhatsApp, Panneau à la carte */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="#contact"
            onClick={() => trackCtaClick("Formulaire direct", "anchor_contact", "pricing_header")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A1D37] hover:bg-[#2563EB] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Formulaire de contact</span>
          </a>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F0F7FF] border border-[#CBE2FF] hover:border-[#2563EB] text-[#0A1D37] text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#2563EB] group-hover:scale-110 transition-transform" />
            <span>Prestations à la carte</span>
          </button>

          <Link
            href="/liens"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#475569] hover:text-[#0A1D37] text-xs font-semibold transition-all"
          >
            <span>Mes liens</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* =====================================================================
          2. GRILLE DE 6 CARTES : 2 LIGNES DE 3 COLONNES (Format compact & équilibré)
         ===================================================================== */}
      <div
        ref={packsGridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
      >
        {displayPacks.slice(0, 6).map((pack, idx) => {
          const isFeatured = pack.misEnAvant || idx === 2; // Pack Acquisition & Campagne Ciblée
          const isCustomQuote = pack.prix >= 300000 || /sur-mesure|\+300k|devis/i.test(pack.titre);

          const cleanFeatures = pack.servicesInclus.map((item) =>
            item.replace(/^(Inclus\s*:\s*|Annexe\s*\/\s*Option\s*:\s*|⚠️\s*REQUIS\s*:\s*|📋\s*Recommandé\s*:\s*)/i, "").trim()
          );

          return (
            <div
              key={pack.id || pack.slug}
              className={`relative rounded-[26px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                isFeatured
                  ? "bg-[#061326] text-white border-2 border-[#0EA5E9] shadow-2xl lg:-translate-y-2 z-10"
                  : isCustomQuote
                  ? "bg-gradient-to-b from-white to-[#F0F7FF] text-[#0A1D37] border-2 border-[#93C5FD] shadow-md hover:shadow-xl"
                  : "bg-white text-[#0A1D37] border border-[#CBD5E1]/80 hover:border-[#2563EB]/60 hover:shadow-xl shadow-xs"
              }`}
            >
              {/* Badge Populaire / Recommandé */}
              {isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] text-white text-[10px] font-mono font-extrabold uppercase tracking-widest shadow-md">
                  ⭐ Recommandé · Le plus choisi
                </div>
              )}

              {/* Badge Sur Devis pour projets > 300 K */}
              {isCustomQuote && !isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-blue-100 text-[#1D4ED8] border border-blue-300 text-[10px] font-mono font-bold uppercase tracking-wider shadow-2xs">
                  📋 Soumission sur Devis (&gt; 300K)
                </div>
              )}

              <div className="space-y-4">
                {/* 1. Prix ou Mention Devis centré en haut de carte */}
                <div className="text-center pt-1 pb-1">
                  {isCustomQuote ? (
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-[family-name:var(--font-dm-sans)] text-[#0284C7]">
                        Sur Devis Personnalisé
                      </div>
                      <span className="text-[11px] font-mono text-[#64748B] block mt-1 font-semibold">
                        Estimation dès 300 000 FCFA · Cahier des charges
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div
                        className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-[family-name:var(--font-dm-sans)] ${
                          isFeatured ? "text-white" : "text-[#0A1D37]"
                        }`}
                      >
                        {formatFCFA(pack.prix)}
                      </div>
                      <span
                        className={`text-[11px] font-mono mt-0.5 block font-semibold ${
                          isFeatured ? "text-[#0EA5E9]" : "text-[#64748B]"
                        }`}
                      >
                        Délai moyen : {pack.delai}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Nom de la formule & Sous-titre compact */}
                <div className="text-center space-y-1 pb-2 border-b border-[#E2E8F0]/30">
                  <h3
                    className={`text-base sm:text-lg font-bold ${
                      isFeatured ? "text-white" : "text-[#0A1D37]"
                    }`}
                  >
                    {pack.titre}
                  </h3>
                  {pack.sousTitre && (
                    <p
                      className={`text-xs leading-relaxed line-clamp-2 ${
                        isFeatured ? "text-slate-300" : "text-[#475569]"
                      }`}
                    >
                      {pack.sousTitre}
                    </p>
                  )}
                </div>

                {/* 3. Liste de contrôle épurée (4-5 puces max) */}
                <ul className="space-y-2.5 text-xs pt-1">
                  {cleanFeatures.slice(0, 5).map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
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
                        className={`leading-snug text-[11px] sm:text-xs ${
                          isFeatured ? "text-slate-200" : "text-[#334155]"
                        }`}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                {isCustomQuote && (
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-[11px] text-[#1E40AF] leading-snug">
                    💡 <strong>Projets &gt; 300 K :</strong> Nous préconisons un cadrage préalable par devis détaillé et un échange approfondi.
                  </div>
                )}
              </div>

              {/* 4. Boutons d'Action (Demande de devis / Choix du pack + WhatsApp) */}
              <div className="pt-6 space-y-2 mt-4 border-t border-[#E2E8F0]/30">
                <button
                  type="button"
                  onClick={() => handleOrderPack(pack.titre, pack.slug, pack.prix)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isFeatured
                      ? "bg-[#0EA5E9] hover:bg-[#38BDF8] text-[#061326] shadow-lg shadow-sky-500/25 active:scale-98"
                      : isCustomQuote
                      ? "bg-[#0284C7] hover:bg-[#0369A1] text-white active:scale-98 shadow-sm"
                      : "bg-[#0F172A] hover:bg-[#2563EB] text-white active:scale-98"
                  }`}
                >
                  <span>{isCustomQuote ? "Demander ce devis" : "Choisir ce pack"}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <a
                  href={getWhatsappPackHref(pack.titre, isCustomQuote)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsappClick(`pack_card_${pack.slug}`)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
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
          3. BANDEAU DE CONVERSION : PROJETS SUR-MESURE & CONTACT DIRECT
         ===================================================================== */}
      <div className="rounded-3xl bg-gradient-to-r from-[#061326] via-[#0A1D37] to-[#0A2540] text-white p-7 sm:p-9 shadow-xl border border-white/10 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/10 text-[#38BDF8] text-[11px] font-mono font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Projets Personnalisés · Devis sur-mesure</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-dm-sans)]">
              Votre projet ne rentre pas exactement dans une formule ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Chaque entreprise a des besoins, des contraintes et des objectifs spécifiques. Pour tout projet hybride, fonctionnalité avancée ou budget supérieur à 300 000 FCFA, <strong>nous préconisons un cadrage par devis détaillé</strong> après discussion de votre cahier des charges.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <span className="hidden sm:inline-block w-px h-16 bg-white/15" />
            <div className="text-left sm:text-right">
              <span className="text-[11px] font-mono text-slate-400 block">DÉLAI DE RÉPONSE</span>
              <strong className="text-sm font-bold text-[#38BDF8]">Devis gratuit en &lt; 24h</strong>
            </div>
          </div>
        </div>

        {/* 3 Canaux de contact directs incitatifs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          {/* Canal 1 : Formulaire de contact */}
          <a
            href="#contact"
            onClick={() => trackCtaClick("Formulaire direct", "anchor_contact", "quote_banner")}
            className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#38BDF8]/60 transition-all flex items-center justify-between gap-3 cursor-pointer"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors block">
                1. Formulaire direct de contact
              </span>
              <span className="text-[11px] text-slate-400 block">
                Détaillez vos besoins et recevez une offre chiffrée
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#38BDF8] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Canal 2 : WhatsApp direct */}
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
              "Bonjour Sylla 👋, j'ai un projet spécifique et j'aimerais échanger pour obtenir un devis sur-mesure."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsappClick("quote_banner")}
            className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#22C55E]/60 transition-all flex items-center justify-between gap-3"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white group-hover:text-[#22C55E] transition-colors flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>2. Échange direct WhatsApp</span>
              </span>
              <span className="text-[11px] text-slate-400 block">
                Discussion rapide en temps réel sur vos objectifs
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#22C55E] shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Canal 3 : Tous mes liens professionnels (/liens) */}
          <Link
            href="/liens"
            onClick={() => trackCtaClick("Page Liens", "internal_link", "quote_banner")}
            className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all flex items-center justify-between gap-3"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors block">
                3. Tous mes liens &amp; réseaux
              </span>
              <span className="text-[11px] text-slate-400 block">
                LinkedIn, GitHub, email et coordonnées directes
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/70 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* =====================================================================
          4. BANDEAU DE RECOURS : PRESTATIONS À LA CARTE (Dès 50 000 FCFA)
         ===================================================================== */}
      <div className="rounded-3xl bg-white border border-[#CBE2FF] p-6 sm:p-7 flex flex-col lg:flex-row items-center justify-between gap-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F0F7FF] text-[#2563EB] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#0A1D37]">
                Besoin d&apos;une mission ponctuelle ou d&apos;un service unitaire ?
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7] text-[10px] font-mono font-bold">
                dès 50 000 FCFA
              </span>
            </div>
            <p className="text-xs text-[#475569] max-w-2xl leading-relaxed">
              Workflows n8n, Campagnes Facebook Ads ciblées, Page Facebook Pro, Audit UX ou Maintenance mensuelle (dès 25 000 FCFA/mois). Découvrez les 15 offres à l&apos;unité sans engagement.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="w-full lg:w-auto px-5 py-3 rounded-xl bg-[#0A1D37] hover:bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-2xs"
        >
          <span>Ouvrir le panneau à la carte</span>
          <ArrowUpRight className="w-4 h-4 text-[#0EA5E9]" />
        </button>
      </div>

      {/* =====================================================================
          5. BOUTON FLOTTANT DISCRET POUR ROUVRIR LE PANNEAU À TOUT MOMENT
         ===================================================================== */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label="Ouvrir les services à la carte"
        className="fixed bottom-6 right-6 z-40 hidden md:inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#061326] text-white hover:bg-[#2563EB] text-xs font-bold shadow-2xl border border-white/20 transition-all hover:scale-105 cursor-pointer"
      >
        <Layers className="w-4 h-4 text-[#0EA5E9]" />
        <span>Prestations à la carte (dès 50k)</span>
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
