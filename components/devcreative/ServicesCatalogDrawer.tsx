"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
  Layers,
  Filter,
} from "lucide-react";
import { OFFER_FAMILIES } from "@/lib/validations/devcreative";
import { formatFCFA, type ServiceOfferData } from "@/lib/devcreative-catalog";
import { trackWhatsappClick } from "@/lib/analytics-client";

interface ServicesCatalogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  offers: ServiceOfferData[];
  onSelectOffer: (title: string, price?: number) => void;
  whatsappNumber?: string;
}

export function ServicesCatalogDrawer({
  isOpen,
  onClose,
  offers,
  onSelectOffer,
  whatsappNumber = "2250594564993",
}: ServicesCatalogDrawerProps) {
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Écoute de la touche Échap pour fermer le panneau
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Filtrage combiné par famille et terme de recherche
  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const matchFamily =
        selectedFamily === "all" || offer.famille === selectedFamily;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        offer.titre.toLowerCase().includes(q) ||
        offer.accroche.toLowerCase().includes(q) ||
        offer.livrables.some((l) => l.toLowerCase().includes(q));
      return matchFamily && matchSearch;
    });
  }, [offers, selectedFamily, searchQuery]);

  const cleanWhatsapp = useMemo(() => {
    const digits = whatsappNumber.replace(/[^0-9]/g, "");
    return digits.length === 10 && digits.startsWith("0") ? `225${digits}` : (digits || "2250594564993");
  }, [whatsappNumber]);

  const getWhatsappHref = (offerTitle: string) => {
    const text = `Bonjour Sylla 👋, je suis intéressé par votre prestation à la carte : "${offerTitle}". Pouvons-nous échanger sur les détails ?`;
    return `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(text)}`;
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Catalogue des services à la carte"
      className="fixed inset-0 z-[110] flex justify-end"
    >
      {/* Fond sombre cliquable pour refermer */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#061326]/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
      />

      {/* Conteneur coulissant du panneau latéral droit */}
      <div className="relative w-full max-w-2xl bg-[#F8FAFC] h-full shadow-2xl flex flex-col z-10 border-l border-[#CBE2FF] animate-slideInRight">
        {/* En-tête du panneau */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#CBE2FF] flex items-start justify-between gap-4 sticky top-0 z-20">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0EA5E9]" />
              Catalogue à l&apos;unité
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0A1D37] font-[family-name:var(--font-dm-sans)]">
              Prestations &amp; Services à la carte
            </h2>
            <p className="text-xs text-[#526D82] mt-1">
              Tarifs unitaires attractifs dès 50 000 FCFA pour vos besoins ciblés (n8n, Facebook Ads, Audit, Design...).
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le panneau des services"
            className="w-10 h-10 rounded-full bg-[#F0F7FF] hover:bg-[#E0F2FE] text-[#0A1D37] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barre de recherche & Filtres rapides */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E2E8F0] space-y-3">
          {/* Champ de recherche */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher (ex: n8n, Facebook, logo, vitrine...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-xs text-[#0A1D37] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-[#0A1D37]"
              >
                Effacer
              </button>
            )}
          </div>

          {/* Onglets de catégories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedFamily("all")}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFamily === "all"
                  ? "bg-[#0A1D37] text-white shadow-xs"
                  : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
              }`}
            >
              Tous ({offers.length})
            </button>
            {OFFER_FAMILIES.map((fam) => {
              const count = offers.filter((o) => o.famille === fam.id).length;
              return (
                <button
                  key={fam.id}
                  type="button"
                  onClick={() => setSelectedFamily(fam.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedFamily === fam.id
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                  }`}
                >
                  {fam.shortLabel} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Corps défilant avec les cartes de prestations */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredOffers.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-[#CBD5E1]">
              <Layers className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
              <h3 className="text-sm font-bold text-[#0A1D37]">
                Aucun service trouvé pour cette recherche
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                Essayez d&apos;autres termes ou réinitialisez vos filtres.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedFamily("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 rounded-full bg-[#0A1D37] text-white text-xs font-bold"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filteredOffers.map((offer) => {
              const familyObj = OFFER_FAMILIES.find((f) => f.id === offer.famille);
              const isCustomQuote = /brief|devis précis/i.test(offer.prixLabel || "");

              return (
                <div
                  key={offer.id || offer.slug}
                  className="bg-white rounded-2xl border border-[#CBE2FF] p-5 shadow-xs hover:shadow-md hover:border-[#2563EB]/40 transition-all space-y-4"
                >
                  {/* Haut de carte : Famille + Prix mis en valeur */}
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F0F7FF] text-[#2563EB] border border-[#CBE2FF]/60">
                      {familyObj?.shortLabel || offer.famille}
                    </span>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-[#64748B] block">
                        TARIF
                      </span>
                      <strong className="text-sm sm:text-base font-extrabold text-[#0A1D37]">
                        {offer.prixLabel || formatFCFA(offer.prixDepuis)}
                      </strong>
                    </div>
                  </div>

                  {/* Titre & Description */}
                  <div>
                    <h3 className="text-base font-bold text-[#0A1D37]">
                      {offer.titre}
                    </h3>
                    <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                      {offer.accroche}
                    </p>
                  </div>

                  {/* Livrables inclus */}
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-[#64748B]">
                      <span>CE QUI EST INCLUS :</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#0EA5E9]" />
                        Délai : {offer.delai}
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-[#0A1D37]">
                      {offer.livrables.map((liv, idx) => {
                        const isWarning = /⚠️|requis|brief|devis précis/i.test(liv);
                        const isAnnexe = /annexe|option/i.test(liv);
                        return (
                          <li key={idx} className="flex items-start gap-2">
                            {isWarning ? (
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            ) : isAnnexe ? (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            )}
                            <span
                              className={
                                isWarning
                                  ? "text-amber-800 font-semibold"
                                  : isAnnexe
                                  ? "text-[#64748B] italic"
                                  : "text-[#1E293B]"
                              }
                            >
                              {liv}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {isCustomQuote && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-medium flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Projet sur-mesure · Cadrage par brief & devis précis requis.</span>
                    </div>
                  )}

                  {/* Boutons d'action */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectOffer(offer.titre, offer.prixDepuis || undefined);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0A1D37] hover:bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Demander cette prestation</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#0EA5E9]" />
                    </button>

                    <a
                      href={getWhatsappHref(offer.titre)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsappClick("service_drawer")}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#22C55E]" />
                      <span>Échanger sur WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pied de panneau fixe */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#CBE2FF] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-[#0A1D37] block">
              Besoin d&apos;un conseil direct ?
            </span>
            <span className="text-[11px] text-[#64748B]">
              Je réponds à vos questions en moins de 2h sur WhatsApp.
            </span>
          </div>

          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
              "Bonjour Sylla 👋, j'ai une question sur vos prestations à la carte."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsappClick("drawer_footer")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Discuter en direct</span>
          </a>
        </div>
      </div>
    </div>
  );
}
