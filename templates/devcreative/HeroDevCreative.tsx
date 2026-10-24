"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { ToolIconRenderer } from "@/components/tools/ToolIconRenderer";
import { BriefWizardModal } from "@/components/devcreative/BriefWizardModal";
import { trackCtaClick, trackWhatsappClick, trackProjectClick } from "@/lib/analytics-client";
import type { HeroData } from "@/lib/validations/profile";
import type { MediaData, SiteSettingsData } from "@/lib/profiles";
import type { ProjectData } from "@/components/ProjectCard";

const TECH_RIBBON_TOOLS = [
  "Next.js",
  "React",
  "Laravel",
  "Figma",
  "Tailwind CSS",
  "PostgreSQL",
  "Prisma",
  "Docker",
  "GitHub",
  "Git",
  "JavaScript",
  "Python",
  "FastAPI",
  "Canva",
  "Photoshop",
  "Illustrator",
];

interface HeroDevCreativeProps {
  hero?: HeroData;
  heroMedia?: MediaData | null;
  projects?: ProjectData[];
  projectsCount?: number;
  settings?: SiteSettingsData | null;
}

export function HeroDevCreative({
  hero,
  projects = [],
  projectsCount = 23,
  settings,
}: HeroDevCreativeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleWordsRef = useRef<HTMLSpanElement[]>([]);
  const activeCardRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [wizardOpen, setWizardOpen] = useState(false);

  const stackProjects: ProjectData[] = projects.length > 0
    ? projects.slice(0, 6)
    : [
        {
          id: "demo-1",
          titre: "Plateforme Web & Identité de Marque",
          slug: "portfolio-cv-personnel",
          description: "Conception intégrale orientée conversion et prise de commande rapide.",
          coverImage: "/images/projects/portfolio-cv-personnel.jpg",
          tags: ["Next.js", "Design UI/UX", "PostgreSQL"],
          links: {},
          featured: true,
          contenu: null,
          ordre: 1,
        },
      ];

  const currentProject = stackProjects[activeIndex % stackProjects.length];
  const nextProject1 = stackProjects[(activeIndex + 1) % stackProjects.length];
  const nextProject2 = stackProjects[(activeIndex + 2) % stackProjects.length];

  const rawDigits = (settings?.whatsapp || "2250594564993").replace(/[^0-9]/g, "");
  const rawWhatsapp = rawDigits.length === 10 && rawDigits.startsWith("0") ? `225${rawDigits}` : (rawDigits || "2250594564993");
  const whatsappHref = `https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(
    "Bonjour Sylla 👋, je visite votre site et je souhaite discuter d'un projet digital."
  )}`;

  // Animation d'entrée GSAP (Révélation du titre mot par mot — PRD §10 : 0.8s, power3.out, stagger 0.05s)
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      if (titleWordsRef.current.length > 0) {
        gsap.fromTo(
          titleWordsRef.current,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.05,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animation GSAP de changement de carte empilée (0.6s, expo.out)
  const animateCardChange = (newIndex: number) => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setActiveIndex(newIndex);

    if (!isReduced && activeCardRef.current) {
      gsap.fromTo(
        activeCardRef.current,
        { scale: 0.94, rotate: 3, y: 18, opacity: 0.7 },
        {
          scale: 1,
          rotate: -1,
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "expo.out",
        }
      );
    }
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + stackProjects.length) % stackProjects.length;
    animateCardChange(prevIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % stackProjects.length;
    animateCardChange(nextIdx);
  };

  const setWordRef = (el: HTMLSpanElement | null, idx: number) => {
    if (el) titleWordsRef.current[idx] = el;
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="hero"
        className="relative pt-24 pb-6 sm:pt-28 sm:pb-10 overflow-hidden bg-[#FBF7F0] text-[#1F192B]"
      >
        {/* Halo doux éditorial Pêche & Indigo */}
        <div className="absolute top-12 right-1/4 w-96 h-96 rounded-full bg-[#FCE7D2]/45 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-12 left-10 w-80 h-80 rounded-full bg-[#1D4ED8]/10 blur-[110px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* COLONNE GAUCHE : Titre Éditorial, Preuves Chiffrées & Double CTA */}
            <div className="lg:col-span-6 space-y-6">
              {/* Badge de disponibilité Abidjan & International */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5D9C5] shadow-2xs text-xs font-medium text-[#1F192B]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Disponible pour missions · Abidjan &amp; International</span>
              </div>

              {/* Grand Titre Éditorial DM Sans 700 + Instrument Serif Italique Orange */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.08] text-[#1F192B] font-[family-name:var(--font-dev-serif)]">
                <span ref={(el) => setWordRef(el, 0)} className="inline-block mr-2.5">
                  Je
                </span>
                <span ref={(el) => setWordRef(el, 1)} className="inline-block mr-2.5">
                  développe
                </span>
                <span
                  ref={(el) => setWordRef(el, 2)}
                  className="inline-block mr-3 font-normal text-[#E83F25] font-[family-name:var(--font-dev-script)] text-[1.08em]"
                >
                  l&apos;architecture digitale
                </span>
                <span ref={(el) => setWordRef(el, 3)} className="inline-block mr-2.5">
                  qui
                </span>
                <span ref={(el) => setWordRef(el, 4)} className="inline-block mr-2.5">
                  propulse
                </span>
                <span ref={(el) => setWordRef(el, 5)} className="inline-block mr-2.5">
                  votre
                </span>
                <span
                  ref={(el) => setWordRef(el, 6)}
                  className="inline-block font-normal text-[#1D4ED8] font-[family-name:var(--font-dev-script)] text-[1.12em] underline decoration-[#E83F25]/50 decoration-wavy underline-offset-4"
                >
                  croissance.
                </span>
              </h1>

              {/* Sous-titre orienté apport client */}
              <p className="text-sm sm:text-base text-[#3E3552] max-w-xl leading-relaxed">
                {hero?.subline ||
                  "Conception d'identités de marque, sites vitrines haute conversion et plateformes web & mobiles sur-mesure. Transformez chaque visite en demande de devis qualifiée."}
              </p>

              {/* Pilules de preuves chiffrées (Style référence) */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <div className="px-4 py-2 rounded-full bg-white border border-[#E5D9C5] text-xs font-medium text-[#3E3552] shadow-2xs">
                  <strong className="text-[#1F192B] font-bold">{projectsCount}+</strong> réalisations
                </div>
                <div className="px-4 py-2 rounded-full bg-white border border-[#E5D9C5] text-xs font-medium text-[#3E3552] shadow-2xs">
                  <strong className="text-[#1F192B] font-bold">dès 100k FCFA</strong> · tarifs clairs
                </div>
                <div className="px-4 py-2 rounded-full bg-white border border-[#E5D9C5] text-xs font-medium text-[#3E3552] shadow-2xs">
                  <strong className="text-[#1F192B] font-bold">&lt; 24 h</strong> délai de réponse
                </div>
              </div>

              {/* Double CTA : "Démarrer un projet" (sombre + pastille orange) + Bouton WhatsApp vert */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    trackCtaClick("Démarrer un projet", "wizard_modal", "hero_devcreative");
                    setWizardOpen(true);
                  }}
                  className="group inline-flex items-center gap-3.5 pl-6 pr-2.5 py-2.5 rounded-full bg-[#16121E] hover:bg-[#1F192B] text-white text-xs sm:text-sm font-bold shadow-xl shadow-[#16121E]/15 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Démarrer un projet</span>
                  <span className="w-9 h-9 rounded-full bg-[#E83F25] text-[#16121E] flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </span>
                </button>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsappClick("hero_devcreative")}
                  aria-label="Discuter directement sur WhatsApp"
                  title="Discuter sur WhatsApp"
                  className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
                >
                  <MessageCircle className="w-6 h-6 fill-white/15" />
                </a>

                <Link
                  href="#offres-packs"
                  className="text-xs font-bold text-[#1D4ED8] hover:underline px-2 py-2"
                >
                  Voir les offres &amp; packs FCFA →
                </Link>
              </div>
            </div>

            {/* COLONNE DROITE : Carrousel de Projets en Cartes Empilées avec Inclinaison 3D */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full max-w-[470px] pt-6 pb-4 px-2 sm:px-4">
                {/* Carte Arrière 2 (Empilée en profondeur, inclinée +5deg) */}
                {stackProjects.length > 2 && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-6 top-2 h-[320px] sm:h-[360px] rounded-[28px] bg-[#FFB800] border border-[#16121E]/15 shadow-xl transform rotate-5 scale-[0.91] -translate-y-3 opacity-85 pointer-events-none transition-all duration-500"
                  />
                )}

                {/* Carte Arrière 1 (Empilée intermédiaire, inclinée +2.5deg) */}
                {stackProjects.length > 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-4 top-4 h-[320px] sm:h-[360px] rounded-[28px] bg-[#E83F25] border border-[#16121E]/15 shadow-xl transform rotate-2 scale-[0.95] -translate-y-1.5 opacity-90 pointer-events-none transition-all duration-500"
                  />
                )}

                {/* Carte Principale au premier plan */}
                <div
                  ref={activeCardRef}
                  className="relative z-10 rounded-[28px] bg-[#16121E] p-3 sm:p-4 shadow-2xl border border-white/15 transform -rotate-1 hover:rotate-0 transition-transform duration-300"
                >
                  {/* Barre de fenêtre style macOS + badge statut */}
                  <div className="flex items-center justify-between px-2 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    </div>
                    <span className="text-[10px] font-mono text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full">
                      {activeIndex + 1} / {stackProjects.length} · Étude de cas
                    </span>
                    <Link
                      href={`/projets/${currentProject.slug}`}
                      onClick={() =>
                        trackProjectClick(currentProject.slug, currentProject.titre, "hero_stack")
                      }
                      className="text-[11px] font-semibold text-[#E83F25] hover:underline flex items-center gap-1"
                    >
                      <span>Ouvrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Aperçu Visuel du Projet */}
                  <Link
                    href={`/projets/${currentProject.slug}`}
                    onClick={() =>
                      trackProjectClick(currentProject.slug, currentProject.titre, "hero_stack")
                    }
                    className="block relative aspect-16/10 w-full rounded-[20px] overflow-hidden bg-slate-900 border border-white/10 group"
                  >
                    <Image
                      src={
                        currentProject.coverMedia?.url ||
                        currentProject.coverImage ||
                        "/images/projects/portfolio-cv-personnel.jpg"
                      }
                      alt={currentProject.titre}
                      fill
                      sizes="(max-width: 768px) 100vw, 470px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16121E] via-[#16121E]/20 to-transparent opacity-85" />

                    {/* Légende superposée en bas de la carte */}
                    <div className="absolute bottom-3 inset-x-3 flex items-end justify-between gap-2 text-white">
                      <div>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {currentProject.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-white"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold leading-snug">
                          {currentProject.titre}
                        </h3>
                      </div>

                      <span className="w-9 h-9 rounded-full bg-[#E83F25] text-[#16121E] flex items-center justify-center shrink-0 shadow-md">
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                      </span>
                    </div>
                  </Link>

                  {/* Bandeau livrable vérifié sous l'image */}
                  <div className="mt-3 px-2 flex items-center justify-between text-xs text-white/80">
                    <span className="truncate max-w-[260px]">{currentProject.description}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Livré
                    </span>
                  </div>
                </div>
              </div>

              {/* Contrôles du Carrousel Empilé (Flèches rondes gauche / droite) */}
              <div className="flex items-center gap-4 mt-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Projet précédent"
                  className="w-10 h-10 rounded-full bg-white hover:bg-[#1F192B] text-[#1F192B] hover:text-white border border-[#E5D9C5] flex items-center justify-center shadow-xs transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-[#62567A]">
                  Glissez ou cliquez pour parcourir
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Projet suivant"
                  className="w-10 h-10 rounded-full bg-white hover:bg-[#1F192B] text-[#1F192B] hover:text-white border border-[#E5D9C5] flex items-center justify-center shadow-xs transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BANDEAU DÉFILANT DE TECHNOLOGIES (Style référence Aquilas Dev avec tuiles blanches) */}
        <div className="mt-10 sm:mt-14 py-4 bg-white/75 border-y border-[#E5D9C5] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee flex items-center gap-4 sm:gap-6 px-4">
            {[...TECH_RIBBON_TOOLS, ...TECH_RIBBON_TOOLS].map((tool, idx) => (
              <div
                key={`${tool}-${idx}`}
                className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-[#E5D9C5] shadow-2xs shrink-0 hover:border-[#1D4ED8] transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <ToolIconRenderer name={tool} className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#1F192B] whitespace-nowrap">
                  {tool}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BriefWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </>
  );
}
