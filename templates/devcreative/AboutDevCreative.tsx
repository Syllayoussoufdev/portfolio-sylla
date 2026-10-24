"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  ChevronDown,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Compass,
  PenTool,
  Code2,
  Rocket,
} from "lucide-react";
import { BriefWizardModal } from "@/components/devcreative/BriefWizardModal";
import { INITIAL_FAQ_ITEMS, type FaqItemData } from "@/lib/devcreative-catalog";
import { trackCtaClick, trackWhatsappClick } from "@/lib/analytics-client";
import type { SiteSettingsData } from "@/lib/profiles";

const METHOD_STEPS = [
  {
    num: "01",
    title: "Brief & Cadrage Stratégique",
    timing: "Jour 1 · Validation en 24 h",
    desc: "Analyse de votre activité, de votre cible et de vos objectifs commerciaux. Vous recevez un cahier des charges clair avec livrables, budget fixe en FCFA et planning garanti.",
    deliverable: "Devis détaillé + Feuille de route validée",
    icon: Compass,
  },
  {
    num: "02",
    title: "Maquette UI/UX & Identité",
    timing: "Jours 2 à 5 · Zéro surprise",
    desc: "Conception de l'identité visuelle et des maquettes interactives haute fidélité. Vous visualisez et validez le rendu exact de votre site sur mobile et ordinateur avant le développement.",
    deliverable: "Maquette interactive Figma + Kit de marque",
    icon: PenTool,
  },
  {
    num: "03",
    title: "Build Technique & Back-Office",
    timing: "Jours 6 à 12 · Lien de suivi en direct",
    desc: "Développement en Next.js & PostgreSQL optimisé pour la 4G mobile, le référencement Google et les aperçus de partage WhatsApp/LinkedIn, avec votre espace d'administration.",
    deliverable: "Plateforme rapide, sécurisée & administrable",
    icon: Code2,
  },
  {
    num: "04",
    title: "Mise en Ligne, Formation & Croissance",
    timing: "Livraison finale & Suivi",
    desc: "Déploiement sur votre nom de domaine, configuration des emails professionnels et de Google Analytics, suivi d'une session de prise en main pour vous rendre 100 % autonome.",
    deliverable: "Site en production + Accès complets + Support",
    icon: Rocket,
  },
] as const;

const PILLAR_STORIES = [
  {
    title: "Architecture Web & SaaS",
    tag: "Next.js · Laravel · PostgreSQL",
    image: "/images/projects/plateforme-web-saas.jpg",
    desc: "Applications rapides et évolutives avec back-office sur-mesure.",
  },
  {
    title: "Direction Artistique & Marque",
    tag: "Branding · UI/UX · Print",
    image: "/images/projects/identite-visuelle-branding.jpg",
    desc: "Identités visuelles mémorables qui inspirent confiance dès la première seconde.",
  },
  {
    title: "Présence & Conversion",
    tag: "SEO · Analytics · WhatsApp",
    image: "/images/projects/portfolio-cv-personnel.jpg",
    desc: "Chaque page est structurée pour transformer vos visiteurs en clients.",
  },
];

interface AboutDevCreativeProps {
  settings?: SiteSettingsData | null;
  faqItems?: FaqItemData[];
}

export function AboutDevCreative({ settings, faqItems = [] }: AboutDevCreativeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const methodStepsRef = useRef<HTMLDivElement[]>([]);
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-0");
  const [wizardOpen, setWizardOpen] = useState(false);

  const displayFaqs: FaqItemData[] =
    faqItems.length > 0
      ? faqItems
      : INITIAL_FAQ_ITEMS.map((f, idx) => ({ ...f, id: `faq-${idx}` }));

  const rawDigits = (settings?.whatsapp || "2250594564993").replace(/[^0-9]/g, "");
  const rawWhatsapp = rawDigits.length === 10 && rawDigits.startsWith("0") ? `225${rawDigits}` : (rawDigits || "2250594564993");
  const whatsappHref = `https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(
    "Bonjour Sylla 👋, j'aimerais échanger sur un projet après avoir consulté votre méthode."
  )}`;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      if (methodStepsRef.current.length > 0) {
        gsap.fromTo(
          methodStepsRef.current,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#methode-4-etapes",
              start: "top 82%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-14 sm:space-y-24">
      {/* =====================================================================
          1. SECTION SOMBRE DE CONTRASTE (#061326 — Style Référence Aquilas Dev)
         ===================================================================== */}
      <section
        id="a-propos"
        className="bg-[#061326] text-white py-14 sm:py-24 px-4 sm:px-6 scroll-mt-20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#2563EB]/15 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#0EA5E9]/15 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Colonne Gauche : Grands Chiffres d'Impact (Blanc & Orange) + Réseaux + CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-baseline gap-8 sm:gap-12">
              <div>
                <div className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-[family-name:var(--font-dm-sans)]">
                  23+
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-white/60 mt-1">
                  Projets &amp; Marques
                </div>
              </div>

              <div>
                <div className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#0EA5E9] font-[family-name:var(--font-dm-sans)]">
                  100%
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-white/60 mt-1">
                  Livrables Mesurables
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Basé à Abidjan et intervenant à l&apos;international, je réunis <strong className="text-white">conception visuelle, stratégie digitale et ingénierie logicielle</strong> pour offrir aux dirigeants et marques un interlocuteur unique, rapide et fiable.
            </p>

            {/* Liens Réseaux Sociaux en pastilles rondes */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-mono text-white/60 mr-1">Me suivre :</span>
              {settings?.linkedin && (
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#0EA5E9] hover:text-[#061326] text-xs font-bold transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {settings?.github && (
                <a
                  href={settings.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#0EA5E9] hover:text-[#061326] text-xs font-bold transition-colors"
                >
                  GitHub
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#0EA5E9] hover:text-[#061326] text-xs font-bold transition-colors"
                >
                  Instagram
                </a>
              )}
            </div>

            {/* Boutons d'action de la section sombre */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  trackCtaClick("Démarrer mon brief", "wizard_modal", "dark_impact_section");
                  setWizardOpen(true);
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white hover:bg-[#0EA5E9] text-[#061326] text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Lancer mon projet</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsappClick("dark_impact_section")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Échanger sur WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Colonne Droite : 3 Cartes Verticales Visuelles (Style Référence Aquilas Dev) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PILLAR_STORIES.map((card, idx) => (
              <div
                key={idx}
                onClick={() => setWizardOpen(true)}
                className="group relative h-[280px] sm:h-[340px] rounded-[24px] overflow-hidden border border-white/15 bg-[#0A1D37] cursor-pointer shadow-xl"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 240px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061326] via-[#061326]/40 to-transparent" />

                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <span className="self-start px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-xs border border-white/15 text-[10px] font-mono text-[#0EA5E9]">
                    {card.tag}
                  </span>

                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-[11px] text-white/75 mt-1 line-clamp-2">
                        {card.desc}
                      </p>
                    </div>

                    <span className="w-8 h-8 rounded-full bg-white text-[#061326] group-hover:bg-[#0EA5E9] flex items-center justify-center shrink-0 transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. MÉTHODE EN 4 ÉTAPES & CADRE DE LIVRAISON (PRD §4 & §10)
         ===================================================================== */}
      <section
        id="methode-4-etapes"
        className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 text-[#0A1D37]"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F2FE]/70 text-[#0A1D37] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#0EA5E9]" />
              Processus Clair &amp; Sans Friction
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-[family-name:var(--font-dm-sans)]">
              Votre projet livré en{" "}
              <span className="italic font-normal text-[#0EA5E9] font-[family-name:var(--font-instrument-serif)] text-[1.12em]">
                4 étapes maîtrisées.
              </span>
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setWizardOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A1D37] hover:bg-[#2563EB] text-white text-xs font-bold transition-all self-start md:self-auto cursor-pointer"
          >
            <span>Démarrer l&apos;étape 1 gratuitement</span>
            <ArrowUpRight className="w-4 h-4 text-[#0EA5E9]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {METHOD_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                ref={(el) => {
                  if (el) methodStepsRef.current[idx] = el;
                }}
                className="bg-white rounded-[24px] border border-[#CBE2FF] p-6 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-xl hover:border-[#2563EB]/50 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold font-mono text-[#0EA5E9]">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#F0F7FF] text-[#2563EB] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-[#526D82] font-semibold">
                      {step.timing}
                    </span>
                    <h3 className="text-lg font-bold text-[#0A1D37] mt-0.5">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#334E68] mt-2 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0F7FF] flex items-center gap-1.5 text-[11px] font-bold text-[#0A1D37]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{step.deliverable}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          3. SECTION FAQ ACCORDÉON & CTA FINAL (PRD §4 & §11)
         ===================================================================== */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 pb-8 space-y-8 text-[#0A1D37]">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#2563EB] font-bold">
            Questions Fréquentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-dm-sans)]">
            Tout savoir avant de{" "}
            <span className="italic font-normal text-[#0EA5E9] font-[family-name:var(--font-instrument-serif)] text-[1.12em]">
              démarrer ensemble
            </span>
          </h2>
        </div>

        <div className="space-y-3">
          {displayFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-[20px] border border-[#CBE2FF] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F0F7FF]/50 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-[#0A1D37]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#0EA5E9] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-[#334E68] leading-relaxed border-t border-[#F0F7FF] pt-3">
                    {faq.reponse}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <BriefWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </div>
  );
}
