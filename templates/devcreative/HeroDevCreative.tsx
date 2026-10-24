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
  Hand,
} from "lucide-react";
import { ToolIconRenderer } from "@/components/tools/ToolIconRenderer";
import { BriefWizardModal } from "@/components/devcreative/BriefWizardModal";
import { DevCreativeCursor } from "@/components/devcreative/DevCreativeCursor";
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
  const dragStartXRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [wizardOpen, setWizardOpen] = useState(false);

  const stackProjects: ProjectData[] =
    projects.length > 0
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
  const rawWhatsapp =
    rawDigits.length === 10 && rawDigits.startsWith("0")
      ? `225${rawDigits}`
      : rawDigits || "2250594564993";
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
  const animateCardChange = (newIndex: number, direction: "next" | "prev" = "next") => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setActiveIndex(newIndex);

    if (!isReduced && activeCardRef.current) {
      gsap.fromTo(
        activeCardRef.current,
        {
          scale: 0.92,
          rotate: direction === "next" ? 4 : -4,
          x: direction === "next" ? 36 : -36,
          y: 16,
          opacity: 0.65,
        },
        {
          scale: 1,
          rotate: 0,
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: "expo.out",
        }
      );
    }
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + stackProjects.length) % stackProjects.length;
    animateCardChange(prevIdx, "prev");
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % stackProjects.length;
    animateCardChange(nextIdx, "next");
  };

  // Gestion du glisser-déposer (Drag & Swipe) sur la pile de cartes
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartXRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartXRef.current === null) return;
    const deltaX = e.clientX - dragStartXRef.current;
    dragStartXRef.current = null;

    if (Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const setWordRef = (el: HTMLSpanElement | null, idx: number) => {
    if (el) titleWordsRef.current[idx] = el;
  };

  const projectDomain =
    (currentProject.links as { live?: string; demo?: string } | undefined)?.live
      ?.replace(/^https?:\/\//, "")
      ?.split("/")[0] || `${currentProject.slug.slice(0, 18)}.com`;

  return (
    <>
      <DevCreativeCursor />

      <section
        ref={sectionRef}
        id="hero"
        className="relative pt-24 pb-6 sm:pt-28 sm:pb-10 overflow-hidden bg-[#FBF7F0] text-[#16121E]"
      >
        {/* Halo doux éditorial chaud derrière les cartes empilées */}
        <div className="absolute top-16 right-1/4 w-[420px] h-[420px] rounded-full bg-[#E83F25]/15 blur-[130px] pointer-events-none -z-10" />
        <div className="absolute bottom-12 left-10 w-80 h-80 rounded-full bg-[#FCE7D2]/60 blur-[110px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* COLONNE GAUCHE : Titre Éditorial DM Sans + Instrument Serif, Preuves Chiffrées & Double CTA */}
            <div className="lg:col-span-6 space-y-6">
              {/* Grand Titre Éditorial DM Sans 700 + Instrument Serif Italique Orange (Style Capture 1 & 2) */}
              <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-bold tracking-tight leading-[1.05] text-[#16121E] font-[family-name:var(--font-dm-sans)]">
                <span ref={(el) => setWordRef(el, 0)} className="inline-block mr-2.5">
                  Je
                </span>
                <span ref={(el) => setWordRef(el, 1)} className="inline-block mr-2.5">
                  développe
                </span>
                <br className="hidden sm:block" />
                <span
                  ref={(el) => setWordRef(el, 2)}
                  className="inline-block mr-2.5 italic font-normal text-[#E83F25] font-[family-name:var(--font-instrument-serif)] text-[1.14em]"
                >
                  l&apos;architecture tech
                </span>
                <br className="hidden sm:block" />
                <span ref={(el) => setWordRef(el, 3)} className="inline-block mr-2.5">
                  qui
                </span>
                <span ref={(el) => setWordRef(el, 4)} className="inline-block mr-2.5">
                  propulse
                </span>
                <br className="hidden sm:block" />
                <span ref={(el) => setWordRef(el, 5)} className="inline-block mr-2.5">
                  votre
                </span>
                <span
                  ref={(el) => setWordRef(el, 6)}
                  className="inline-block italic font-normal text-[#E83F25] font-[family-name:var(--font-instrument-serif)] text-[1.14em]"
                >
                  croissance
                </span>
                <span>.</span>
              </h1>

              {/* Sous-titre orienté apport client */}
              <p className="text-sm sm:text-base text-[#3E3552] max-w-xl leading-relaxed">
                {hero?.subline ||
                  "Conception d'identités de marque, sites vitrines haute conversion et plateformes web & mobiles sur-mesure à Abidjan & à l'international."}
              </p>

              {/* Pilules de preuves chiffrées (Style exact Capture 1 & 2) */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <div className="px-4 py-2.5 rounded-full bg-transparent border border-[#16121E]/15 text-xs sm:text-sm font-normal text-[#3E3552]">
                  <strong className="text-[#16121E] font-bold">{projectsCount}</strong> projets
                </div>
                <div className="px-4 py-2.5 rounded-full bg-transparent border border-[#16121E]/15 text-xs sm:text-sm font-normal text-[#3E3552]">
                  <strong className="text-[#16121E] font-bold">dès 100k FCFA</strong> · packs clairs
                </div>
                <div className="px-4 py-2.5 rounded-full bg-transparent border border-[#16121E]/15 text-xs sm:text-sm font-normal text-[#3E3552]">
                  <strong className="text-[#16121E] font-bold">&lt; 24 h</strong> réponse garantie
                </div>
              </div>

              {/* Double CTA : "Démarrer un projet" (bascule Noir -> Orange au survol comme Capture 2) + Bouton WhatsApp vert */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  data-cursor="invert"
                  onClick={() => {
                    trackCtaClick("Démarrer un projet", "wizard_modal", "hero_devcreative");
                    setWizardOpen(true);
                  }}
                  className="group inline-flex items-center gap-4 pl-6 pr-2.5 py-2.5 rounded-full bg-[#16121E] hover:bg-[#E83F25] text-white text-xs sm:text-sm font-bold shadow-xl shadow-[#16121E]/15 transition-colors duration-300 active:scale-95 cursor-pointer"
                >
                  <span>Démarrer un projet</span>
                  <span className="w-10 h-10 rounded-full bg-[#E83F25] group-hover:bg-[#16121E] text-[#16121E] group-hover:text-white flex items-center justify-center transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5] group-hover:rotate-45 transition-transform duration-300" />
                  </span>
                </button>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsappClick("hero_devcreative")}
                  aria-label="Discuter directement sur WhatsApp"
                  title="Discuter sur WhatsApp"
                  className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-[#16121E] flex items-center justify-center shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
                >
                  <MessageCircle className="w-6 h-6 stroke-[2.2]" />
                </a>
              </div>
            </div>

            {/* COLONNE DROITE : Carrousel de Projets en Cartes Empilées 3D avec Curseur "GLISSER" (Capture 1 & 2) */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div
                data-cursor="drag"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                className="relative w-full max-w-[490px] pt-6 pb-4 px-4 sm:px-6 select-none touch-pan-y"
              >
                {/* Carte Arrière 2 (Inclinée à droite +6deg, déborde à droite comme Capture 1) */}
                {stackProjects.length > 2 && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-6 top-6 h-[340px] sm:h-[380px] rounded-[28px] bg-gradient-to-br from-[#2A1810] to-[#140E0C] border border-white/10 shadow-2xl transform rotate-6 translate-x-4 translate-y-2 opacity-90 pointer-events-none transition-all duration-500 overflow-hidden p-3"
                  >
                    <div className="w-full h-full rounded-[20px] opacity-35 relative overflow-hidden">
                      <Image
                        src={
                          nextProject2.coverMedia?.url ||
                          nextProject2.coverImage ||
                          "/images/projects/portfolio-cv-personnel.jpg"
                        }
                        alt=""
                        fill
                        sizes="400px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Carte Arrière 1 (Inclinée à gauche -5deg, déborde à gauche comme Capture 1) */}
                {stackProjects.length > 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-5 top-5 h-[340px] sm:h-[380px] rounded-[28px] bg-gradient-to-br from-[#4A2010] via-[#26140E] to-[#140E0C] border border-white/15 shadow-2xl transform -rotate-5 -translate-x-4 translate-y-2 opacity-95 pointer-events-none transition-all duration-500 overflow-hidden p-3"
                  >
                    <div className="w-full h-full rounded-[20px] opacity-45 relative overflow-hidden">
                      <Image
                        src={
                          nextProject1.coverMedia?.url ||
                          nextProject1.coverImage ||
                          "/images/projects/portfolio-cv-personnel.jpg"
                        }
                        alt=""
                        fill
                        sizes="400px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Carte Principale au premier plan (Style Capture 1 & 2) */}
                <div
                  ref={activeCardRef}
                  onClick={handleNext}
                  className="relative z-10 rounded-[28px] bg-gradient-to-br from-[#4E2210] via-[#23140E] to-[#14100E] p-3.5 sm:p-4 shadow-[0_28px_60px_-15px_rgba(22,18,30,0.55)] border border-white/15 transition-transform duration-300"
                >
                  {/* Barre supérieure macOS + pilule URL centrée */}
                  <div className="relative flex items-center justify-center px-2 pb-3 pt-0.5">
                    <div className="absolute left-2 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    </div>

                    <span className="text-[11px] font-mono text-white/85 bg-white/10 px-4 py-1 rounded-full tracking-wide">
                      {projectDomain}
                    </span>

                    <Link
                      href={`/projets/${currentProject.slug}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        trackProjectClick(currentProject.slug, currentProject.titre, "hero_stack");
                      }}
                      className="absolute right-2 text-[11px] font-semibold text-[#E83F25] hover:underline"
                    >
                      Voir ↗
                    </Link>
                  </div>

                  {/* Aperçu Visuel du Projet (Écran blanc/clair dans le cadre sombre) */}
                  <div className="relative aspect-16/10 w-full rounded-[18px] overflow-hidden bg-white border border-white/10 group">
                    <Image
                      src={
                        currentProject.coverMedia?.url ||
                        currentProject.coverImage ||
                        "/images/projects/portfolio-cv-personnel.jpg"
                      }
                      alt={currentProject.titre}
                      fill
                      draggable={false}
                      sizes="(max-width: 768px) 100vw, 470px"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500 select-none"
                    />
                  </div>

                  {/* Bas de la carte sombre : Catégorie espacée + Grand Titre Blanc (Style exact Capture 1 & 2) */}
                  <div className="pt-3.5 pb-1 px-2 flex items-end justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/60">
                        {currentProject.tags[0] || "ARCHITECTURE WEB & DESIGN"}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mt-0.5 truncate max-w-[320px]">
                        {currentProject.titre}
                      </h3>
                    </div>

                    <Link
                      href={`/projets/${currentProject.slug}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        trackProjectClick(currentProject.slug, currentProject.titre, "hero_stack");
                      }}
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E83F25] text-white flex items-center justify-center shrink-0 transition-colors"
                      title="Ouvrir l'étude de cas"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Contrôles du Carrousel Empilé : ← | ✋ GLISSEZ | → (Style exact Capture 1 & 2) */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Projet précédent"
                  className="w-11 h-11 rounded-full bg-transparent hover:bg-[#16121E] text-[#16121E] hover:text-white border border-[#16121E]/15 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#16121E] hover:bg-[#E83F25] text-white text-[11px] font-bold uppercase tracking-[0.18em] transition-colors cursor-pointer"
                >
                  <Hand className="w-3.5 h-3.5 text-[#E83F25] group-hover:text-white" />
                  <span>GLISSEZ</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Projet suivant"
                  className="w-11 h-11 rounded-full bg-transparent hover:bg-[#16121E] text-[#16121E] hover:text-white border border-[#16121E]/15 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BANDEAU DÉFILANT DE TECHNOLOGIES */}
        <div className="mt-10 sm:mt-14 py-4 bg-white/75 border-y border-[#E5D9C5] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee flex items-center gap-4 sm:gap-6 px-4">
            {[...TECH_RIBBON_TOOLS, ...TECH_RIBBON_TOOLS].map((tool, idx) => (
              <div
                key={`${tool}-${idx}`}
                className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-[#E5D9C5] shadow-2xs shrink-0 hover:border-[#E83F25] transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <ToolIconRenderer name={tool} className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#16121E] whitespace-nowrap">
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
        initialProjectType="pack-lancement"
      />
    </>
  );
}
