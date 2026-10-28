"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  Bell,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { BriefWizardModal, WaitlistModal } from "@/components/devcreative/BriefWizardModal";
import { OFFER_FAMILIES } from "@/lib/validations/devcreative";
import {
  formatFCFA,
  INITIAL_SERVICE_OFFERS,
  INITIAL_SERVICE_PACKS,
  type ServiceOfferData,
  type ServicePackData,
} from "@/lib/devcreative-catalog";
import { trackPackView, trackWizardStart } from "@/lib/analytics-client";

interface ServicesPacksDevCreativeProps {
  offers?: ServiceOfferData[];
  packs?: ServicePackData[];
}

export function ServicesPacksDevCreative({
  offers = [],
  packs = [],
}: ServicesPacksDevCreativeProps) {
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const sectionRef = useRef<HTMLElement>(null);
  const packsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      if (packsGridRef.current) {
        gsap.fromTo(
          packsGridRef.current.children,
          { y: 45, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: packsGridRef.current,
              start: "top 86%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardType, setWizardType] = useState<string>("pack-lancement");
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistTitle, setWaitlistTitle] = useState<string>("");

  const displayOffers: ServiceOfferData[] =
    offers.length > 0
      ? offers
      : INITIAL_SERVICE_OFFERS.map((o, idx) => ({ ...o, id: `init-offer-${idx}` }));

  const displayPacks: ServicePackData[] =
    packs.length > 0
      ? packs
      : INITIAL_SERVICE_PACKS.map((p, idx) => ({ ...p, id: `init-pack-${idx}` }));

  const filteredOffers =
    selectedFamily === "all"
      ? displayOffers
      : displayOffers.filter((o) => o.famille === selectedFamily);

  const handleOrderOffer = (label: string, isPack = false, slug = "", price = 0) => {
    if (isPack) {
      trackPackView(slug, label, price);
    }
    setWizardType(label);
    trackWizardStart(label, isPack ? "packs_section" : "offers_section");
    setWizardOpen(true);
  };

  const handleOpenWaitlist = (title: string) => {
    setWaitlistTitle(title);
    setWaitlistOpen(true);
  };

  return (
    <section
      id="offres-packs"
      ref={sectionRef}
      className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20 space-y-16 text-[#0A1D37]"
    >
      {/* =====================================================================
          PARTIE A : LES 4 PACKS CLÉS EN MAIN (PRD §3 & §11)
         ===================================================================== */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F2FE]/70 text-[#0A1D37] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#0EA5E9]" />
              Offres Packagées · Tarifs Transparents
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-[family-name:var(--font-dm-sans)]">
              Des packs conçus pour votre{" "}
              <span className="italic font-normal text-[#0EA5E9] font-[family-name:var(--font-instrument-serif)] text-[1.12em]">
                retour sur investissement.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#334E68]">
              Tarifs attractifs pensés pour faciliter votre démarrage. Chaque formule détaille clairement les éléments inclus, les options annexes, et les projets nécessitant un cadrage sur brief et devis précis.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline self-start md:self-auto"
          >
            <span>Voir la grille détaillée des services</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grille des 4 Packs */}
        <div ref={packsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayPacks.map((pack) => {
            const isAvailable = pack.statut === "DISPONIBLE";
            const isFeatured = pack.misEnAvant;

            return (
              <div
                key={pack.id}
                className={`rounded-[28px] p-6 flex flex-col justify-between transition-all duration-300 border-2 ${
                  isFeatured
                    ? "bg-[#061326] text-white border-[#0EA5E9] shadow-2xl lg:-translate-y-2"
                    : "bg-white text-[#0A1D37] border-[#CBE2FF] hover:border-[#2563EB]/50 shadow-sm"
                }`}
              >
                <div className="space-y-4">
                  {/* Badges Phase & Économie */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                        isAvailable
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-700 border border-amber-300"
                      }`}
                    >
                      {isAvailable ? "● Disponible (Phase 1)" : `Phase ${pack.phase} · Bientôt`}
                    </span>

                    {pack.economie && (
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isFeatured
                            ? "bg-[#0EA5E9] text-[#061326]"
                            : "bg-[#E0F2FE]/60 text-[#0A1D37]"
                        }`}
                      >
                        {pack.economie}
                      </span>
                    )}
                  </div>

                  {/* Titre & Prix FCFA */}
                  <div>
                    <h3 className="text-xl font-bold font-[family-name:var(--font-dm-sans)]">
                      {pack.titre}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span
                        className={`text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-dm-sans)] ${
                          isFeatured ? "text-[#0EA5E9]" : "text-[#0A1D37]"
                        }`}
                      >
                        {formatFCFA(pack.prix)}
                      </span>
                    </div>
                    {pack.sousTitre && (
                      <p
                        className={`text-xs mt-2 leading-relaxed ${
                          isFeatured ? "text-white/75" : "text-[#334E68]"
                        }`}
                      >
                        {pack.sousTitre}
                      </p>
                    )}
                  </div>

                  {/* Délai annoncé */}
                  <div
                    className={`flex items-center gap-1.5 text-xs font-mono py-2 border-y ${
                      isFeatured
                        ? "border-white/10 text-white/80"
                        : "border-[#CBE2FF] text-[#526D82]"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-[#0EA5E9]" />
                    <span>Délai : {pack.delai}</span>
                  </div>

                  {/* Livrables inclus & Annexes */}
                  <ul className="space-y-2 text-xs">
                    {pack.servicesInclus.map((item, idx) => {
                      const isAnnexe = /annexe|option/i.test(item);
                      const isWarning = /⚠️|requis|brief|devis précis/i.test(item);
                      return (
                        <li key={idx} className="flex items-start gap-2">
                          {isWarning ? (
                            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                          ) : isAnnexe ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                          ) : (
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 mt-0.5 ${
                                isFeatured ? "text-[#0EA5E9]" : "text-[#2563EB]"
                              }`}
                            />
                          )}
                          <span
                            className={
                              isWarning
                                ? isFeatured
                                  ? "text-amber-300 font-semibold text-[11px]"
                                  : "text-amber-700 font-semibold text-[11px]"
                                : isAnnexe
                                ? isFeatured
                                  ? "text-white/60 italic text-[11px]"
                                  : "text-[#526D82] italic text-[11px]"
                                : isFeatured
                                ? "text-white/90"
                                : "text-[#0A1D37]"
                            }
                          >
                            {item}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Bouton d'action selon statut (Règle PRD §16 : Aucune offre Bientôt ne peut être commandée, seulement liste d'attente) */}
                <div className="pt-6 mt-6">
                  {isAvailable ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleOrderOffer(pack.titre, true, pack.slug, pack.prix)
                      }
                      className={`w-full py-3.5 px-4 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isFeatured
                          ? "bg-[#0EA5E9] hover:bg-[#ff936e] text-[#061326] shadow-lg"
                          : "bg-[#0A1D37] hover:bg-[#2563EB] text-white"
                      }`}
                    >
                      <span>Choisir ce pack</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenWaitlist(pack.titre)}
                      className="w-full py-3 px-4 rounded-full border border-[#CBE2FF] bg-[#F0F7FF] hover:bg-[#CBE2FF]/60 text-[#0A1D37] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5 text-[#0EA5E9]" />
                      <span>Rejoindre la liste d&apos;attente</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          PARTIE B : LES 5 FAMILLES D'OFFRES À LA CARTE (PRD §3)
         ===================================================================== */}
      <div id="competences" className="space-y-8 pt-6 border-t border-[#CBE2FF] scroll-mt-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#2563EB] font-bold">
              Prestations dès 50 000 FCFA · Transparence Inclus vs Annexes
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold mt-1 font-[family-name:var(--font-dm-sans)]">
              Catalogue des 5 familles de services
            </h3>
          </div>

          {/* Onglets des 5 familles */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedFamily("all")}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedFamily === "all"
                  ? "bg-[#061326] text-white"
                  : "bg-white text-[#334E68] border border-[#CBE2FF] hover:border-[#2563EB]"
              }`}
            >
              Toutes (5 familles)
            </button>
            {OFFER_FAMILIES.map((fam) => (
              <button
                key={fam.id}
                type="button"
                onClick={() => setSelectedFamily(fam.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedFamily === fam.id
                    ? "bg-[#2563EB] text-white shadow-xs"
                    : "bg-white text-[#334E68] border border-[#CBE2FF] hover:border-[#2563EB]"
                }`}
              >
                {fam.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Cartes des offres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOffers.map((offer) => {
            const isAvailable = offer.statut === "DISPONIBLE";
            const familyObj = OFFER_FAMILIES.find((f) => f.id === offer.famille);

            return (
              <div
                key={offer.id}
                className="bg-white rounded-[24px] border border-[#CBE2FF] p-6 flex flex-col justify-between hover:border-[#2563EB]/50 hover:shadow-lg transition-all"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-semibold text-[#2563EB] bg-[#F0F7FF] px-2.5 py-1 rounded-full">
                      {familyObj?.shortLabel || offer.famille}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        isAvailable
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {isAvailable ? "Disponible" : `Phase ${offer.phase} · Bientôt`}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-[#0A1D37]">{offer.titre}</h4>
                    <p className="text-xs text-[#334E68] mt-1 leading-relaxed">
                      {offer.accroche}
                    </p>
                  </div>

                  {/* Livrables & Éléments annexes */}
                  <div className="p-3.5 rounded-2xl bg-[#F0F7FF]/80 space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#526D82] font-bold">
                      Détail de la prestation :
                    </div>
                    <ul className="space-y-1.5 text-xs text-[#0A1D37]">
                      {offer.livrables.map((liv, i) => {
                        const isAnnexe = /annexe|option/i.test(liv);
                        const isWarning = /⚠️|requis|brief|devis précis/i.test(liv);
                        return (
                          <li key={i} className="flex items-start gap-2">
                            {isWarning ? (
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            ) : isAnnexe ? (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA5E9] shrink-0 mt-0.5" />
                            )}
                            <span
                              className={
                                isWarning
                                  ? "text-amber-800 font-semibold text-[11px]"
                                  : isAnnexe
                                  ? "text-[#526D82] italic text-[11px]"
                                  : "text-[#0A1D37]"
                              }
                            >
                              {liv}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Pied de carte : Tarif FCFA, Délai & Action */}
                <div className="pt-4 mt-4 border-t border-[#CBE2FF] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#526D82] block text-[10px] font-mono">
                        INVESTISSEMENT
                      </span>
                      <strong className="text-sm font-extrabold text-[#0A1D37]">
                        {offer.prixLabel || formatFCFA(offer.prixDepuis)}
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[#526D82] block text-[10px] font-mono">
                        DÉLAI MOYEN
                      </span>
                      <strong className="text-xs font-bold text-[#334E68]">
                        {offer.delai}
                      </strong>
                    </div>
                  </div>

                  {/brief|devis précis/i.test(offer.prixLabel || "") && (
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-800 bg-amber-100/70 border border-amber-200/80 px-2.5 py-1 rounded-full w-full justify-center">
                      <span>📋 Projet sur-mesure · Brief & devis précis requis</span>
                    </div>
                  )}

                  {isAvailable ? (
                    <button
                      type="button"
                      onClick={() => handleOrderOffer(offer.titre)}
                      className="w-full py-2.5 px-4 rounded-full bg-[#0A1D37] hover:bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Demander un devis pour cette offre</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#0EA5E9]" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenWaitlist(offer.titre)}
                      className="w-full py-2.5 px-4 rounded-full border border-[#CBE2FF] bg-slate-50 hover:bg-[#F0F7FF] text-[#334E68] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5 text-[#0EA5E9]" />
                      <span>Être prévenu à l&apos;ouverture (Phase {offer.phase})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BriefWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        initialProjectType={wizardType}
      />

      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        offerTitle={waitlistTitle}
      />
    </section>
  );
}
