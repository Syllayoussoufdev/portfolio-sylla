"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  ArrowUpRight,
  MessageCircle,
  Mail,
  Sparkles,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { BriefWizardModal } from "@/components/devcreative/BriefWizardModal";
import { trackCtaClick, trackWhatsappClick } from "@/lib/analytics-client";
import type { SiteSettingsData } from "@/lib/profiles";

interface ContactFooterDevCreativeProps {
  settings?: SiteSettingsData | null;
}

export function ContactFooterDevCreative({ settings }: ContactFooterDevCreativeProps) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const magneticBtnRef = useRef<HTMLButtonElement>(null);

  const displayName = settings?.nom || "Sylla Youssouf";
  const rawWhatsapp = (settings?.whatsapp || "2250700000000").replace(/[^0-9]/g, "");
  const whatsappHref = `https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(
    "Bonjour Sylla 👋, je viens de parcourir votre site et je souhaite démarrer un projet."
  )}`;

  // Effet Bouton Magnétique GSAP quickTo (PRD §10 : 0.3s au survol souris, désactivé sur tactile)
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;
    const btn = magneticBtnRef.current;
    if (isReduced || isTouch || !btn) return;

    const xTo = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power3.out" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * 0.25);
      yTo(relY * 0.25);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);

    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <section
        id="contact"
        className="bg-[#0B0D1C] text-white pt-14 sm:pt-20 pb-8 px-4 sm:px-6 relative overflow-hidden scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          {/* Rangée Supérieure : Appel final à la conversion + Gros Bouton Rond Magnétique Orange « Discutons ↗ » */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-white/10 pb-12">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#F4825A] text-xs font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Prêt à passer à l&apos;action ?
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none font-[family-name:var(--font-dm-sans)]">
                Transformons votre vision en{" "}
                <span className="italic font-normal text-[#F4825A] font-[family-name:var(--font-instrument-serif)]">
                  résultats mesurables.
                </span>
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/75 pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#F4825A]" />
                  Réponse sous 24 h
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Devis gratuit &amp; sans engagement
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsappClick("footer_devcreative")}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-bold transition-all shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Écrire sur WhatsApp</span>
                </a>

                {settings?.emailPublic && (
                  <a
                    href={`mailto:${settings.emailPublic}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
                  >
                    <Mail className="w-4 h-4 text-[#F4825A]" />
                    <span>{settings.emailPublic}</span>
                  </a>
                )}

                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-bold text-white/80 hover:text-[#F4825A] transition-colors"
                >
                  <span>Consulter tous les tarifs FCFA →</span>
                </Link>
              </div>
            </div>

            {/* Grand Bouton Rond Magnétique Orange « Discutons ↗ » (Style Référence Aquilas Dev) */}
            <div className="shrink-0 self-center md:self-auto">
              <button
                ref={magneticBtnRef}
                type="button"
                onClick={() => {
                  trackCtaClick("Discutons Circle", "wizard_modal", "footer_devcreative");
                  setWizardOpen(true);
                }}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#F4825A] hover:bg-[#ff946e] text-[#14172E] flex flex-col items-center justify-center gap-1 shadow-2xl shadow-[#F4825A]/30 cursor-pointer transition-colors group"
              >
                <ArrowUpRight className="w-6 h-6 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                <span className="text-sm sm:text-base font-extrabold tracking-tight font-[family-name:var(--font-dm-sans)]">
                  Discutons
                </span>
                <span className="text-[10px] font-mono opacity-75">Brief 2 min</span>
              </button>
            </div>
          </div>

          {/* Signature Typographique Monumentale Pleine Largeur (Style Référence Bas de Page) */}
          <div className="pt-2 select-none overflow-hidden">
            <div className="flex items-center justify-center gap-3 sm:gap-5">
              <span className="inline-flex items-center justify-center px-3 py-1 sm:px-5 sm:py-2 rounded-2xl bg-[#F4825A] text-[#14172E] font-mono font-black text-2xl sm:text-5xl lg:text-6xl">
                &lt;/&gt;
              </span>
              <span className="text-[11vw] sm:text-[9vw] font-extrabold tracking-tighter leading-none text-white font-[family-name:var(--font-dm-sans)]">
                {displayName}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bouton WhatsApp Flottant sur Mobile (PRD §11) */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsappClick("floating_mobile_button")}
        aria-label="Discuter sur WhatsApp"
        className="fixed bottom-5 right-5 z-40 sm:hidden w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl shadow-emerald-600/40 border-2 border-white active:scale-95 transition-transform"
      >
        <MessageCircle className="w-7 h-7 fill-white/15" />
      </a>

      <BriefWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </>
  );
}
