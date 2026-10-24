"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Hand,
  X,
  Sparkles,
  ExternalLink,
  CheckCircle2,
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
  const leftColRef = useRef<HTMLDivElement>(null);
  const stackWrapRef = useRef<HTMLDivElement>(null);
  const titleWordsRef = useRef<HTMLSpanElement[]>([]);
  const activeCardRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef<number | null>(null);
  const didDragRef = useRef<boolean>(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardPresetType, setWizardPresetType] = useState<string>("pack-lancement");
  const [selectedProjectModal, setSelectedProjectModal] = useState<ProjectData | null>(null);

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

  // La pile contient tous les projets + 1 dernière carte spéciale CTA « Le vôtre ? »
  const totalSlides = stackProjects.length + 1;
  const isLastCtaCard = activeIndex === stackProjects.length;
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

  // Animations GSAP d'entrée + Effet Parallaxe au Scroll sur le Hero
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      if (titleWordsRef.current.length > 0) {
        gsap.fromTo(
          titleWordsRef.current,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.05,
          }
        );
      }

      if (stackWrapRef.current) {
        gsap.fromTo(
          stackWrapRef.current,
          { y: 40, opacity: 0, scale: 0.94, rotate: 3 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.95,
            delay: 0.15,
            ease: "expo.out",
          }
        );

        // Effet parallaxe fluide au scroll sur la pile de cartes 3D
        gsap.to(stackWrapRef.current, {
          yPercent: -10,
          rotate: -1.5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }

      if (leftColRef.current) {
        gsap.to(leftColRef.current, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animation GSAP de changement de carte empilée (0.65s, expo.out)
  const animateCardChange = (newIndex: number, direction: "next" | "prev" = "next") => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setActiveIndex(newIndex);

    if (!isReduced && activeCardRef.current) {
      gsap.fromTo(
        activeCardRef.current,
        {
          scale: 0.9,
          rotate: direction === "next" ? 5 : -5,
          x: direction === "next" ? 45 : -45,
          y: 18,
          opacity: 0.6,
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
    const prevIdx = (activeIndex - 1 + totalSlides) % totalSlides;
    animateCardChange(prevIdx, "prev");
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % totalSlides;
    animateCardChange(nextIdx, "next");
  };

  // Gestion du glisser-déposer (Drag & Swipe) vs Clic sur la carte
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartXRef.current = e.clientX;
    didDragRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartXRef.current === null) return;
    if (Math.abs(e.clientX - dragStartXRef.current) > 18) {
      didDragRef.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartXRef.current === null) return;
    const deltaX = e.clientX - dragStartXRef.current;
    dragStartXRef.current = null;

    if (Math.abs(deltaX) > 30) {
      didDragRef.current = true;
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const handleCardClick = () => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    if (isLastCtaCard) {
      trackCtaClick("Carte Hero Le vôtre ?", "wizard_modal", "hero_stack_last_card");
      setWizardPresetType("presence-en-ligne");
      setWizardOpen(true);
    } else {
      trackProjectClick(currentProject.slug, currentProject.titre, "hero_stack_modal");
      setSelectedProjectModal(currentProject);
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
        className="relative pt-24 pb-6 sm:pt-28 sm:pb-10 overflow-hidden bg-[#F0F7FF] text-[#061326]"
      >
        {/* Halo doux éditorial chaud derrière les cartes empilées */}
        <div className="absolute top-16 right-1/4 w-[420px] h-[420px] rounded-full bg-[#0EA5E9]/15 blur-[130px] pointer-events-none -z-10" />
        <div className="absolute bottom-12 left-10 w-80 h-80 rounded-full bg-[#E0F2FE]/60 blur-[110px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* COLONNE GAUCHE : Titre Éditorial DM Sans + Instrument Serif, Preuves Chiffrées & Double CTA */}
            <div ref={leftColRef} className="lg:col-span-6 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-bold tracking-tight leading-[1.05] text-[#061326] font-[family-name:var(--font-dm-sans)]">
                <span ref={(el) => setWordRef(el, 0)} className="inline-block mr-2.5">
                  Je
                </span>
                <span ref={(el) => setWordRef(el, 1)} className="inline-block mr-2.5">
                  développe
                </span>
                <br className="hidden sm:block" />
                <span
                  ref={(el) => setWordRef(el, 2)}
                  className="inline-block mr-2.5 italic font-normal text-[#0EA5E9] font-[family-name:var(--font-instrument-serif)] text-[1.14em]"
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
                  className="inline-block italic font-normal text-[#0EA5E9] font-[family-name:var(--font-instrument-serif)] text-[1.14em]"
                >
                  croissance
                </span>
                <span>.</span>
              </h1>

              {/* Sous-titre orienté apport client */}
              <p className="text-sm sm:text-base text-[#334E68] max-w-xl leading-relaxed">
                {hero?.subline ||
                  "Conception d'identités de marque, sites vitrines haute conversion et plateformes web & mobiles sur-mesure à Abidjan & à l'international."}
              </p>

              {/* Pilules de preuves chiffrées */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <div className="px-4 py-2.5 rounded-full bg-transparent border border-[#061326]/15 text-xs sm:text-sm font-normal text-[#334E68]">
                  <strong className="text-[#061326] font-bold">{projectsCount}</strong> projets
                </div>
                <div className="px-4 py-2.5 rounded-full bg-transparent border border-[#061326]/15 text-xs sm:text-sm font-normal text-[#334E68]">
                  <strong className="text-[#061326] font-bold">dès 100k FCFA</strong> · packs clairs
                </div>
                <div className="px-4 py-2.5 rounded-full bg-transparent border border-[#061326]/15 text-xs sm:text-sm font-normal text-[#334E68]">
                  <strong className="text-[#061326] font-bold">&lt; 24 h</strong> réponse garantie
                </div>
              </div>

              {/* Double CTA : "Démarrer un projet" (bascule Noir -> Orange au survol) + Bouton WhatsApp vert */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  data-cursor="invert"
                  onClick={() => {
                    trackCtaClick("Démarrer un projet", "wizard_modal", "hero_devcreative");
                    setWizardPresetType("pack-lancement");
                    setWizardOpen(true);
                  }}
                  className="group inline-flex items-center gap-4 pl-6 pr-2.5 py-2.5 rounded-full bg-[#061326] hover:bg-[#0EA5E9] text-white text-xs sm:text-sm font-bold shadow-xl shadow-[#061326]/15 transition-colors duration-300 active:scale-95 cursor-pointer"
                >
                  <span>Démarrer un projet</span>
                  <span className="w-10 h-10 rounded-full bg-[#0EA5E9] group-hover:bg-[#061326] text-[#061326] group-hover:text-white flex items-center justify-center transition-all duration-300">
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
                  className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-[#061326] flex items-center justify-center shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all"
                >
                  <MessageCircle className="w-6 h-6 stroke-[2.2]" />
                </a>
              </div>
            </div>

            {/* COLONNE DROITE : Carrousel de Projets en Cartes Empilées 3D + Dernière Carte « Le vôtre ? » */}
            <div ref={stackWrapRef} className="lg:col-span-6 flex flex-col items-center">
              <div
                data-cursor={isLastCtaCard ? "cta" : "drag"}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="relative w-full max-w-[490px] pt-6 pb-4 px-4 sm:px-6 select-none touch-pan-y"
              >
                {/* Carte Arrière 2 (Inclinée à droite +5deg) */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-6 top-6 h-[340px] sm:h-[380px] rounded-[28px] bg-gradient-to-br from-[#0284C7] to-[#061326] border border-white/10 shadow-2xl transform rotate-5 translate-x-3 translate-y-2 opacity-90 pointer-events-none transition-all duration-500 overflow-hidden p-3"
                >
                  <div className="w-full h-full rounded-[20px] opacity-30 relative overflow-hidden">
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

                {/* Carte Arrière 1 (Inclinée à gauche -4deg) */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-5 top-4 h-[340px] sm:h-[380px] rounded-[28px] bg-gradient-to-br from-[#0EA5E9] via-[#0B2545] to-[#061326] border border-white/15 shadow-2xl transform -rotate-4 -translate-x-3 translate-y-1 opacity-95 pointer-events-none transition-all duration-500 overflow-hidden p-3"
                >
                  <div className="w-full h-full rounded-[20px] opacity-40 relative overflow-hidden">
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

                {/* CARTE AU PREMIER PLAN : Soit un Projet, soit la Dernière Carte Orange « Le vôtre ? » */}
                <div ref={activeCardRef} onClick={handleCardClick} className="relative z-10">
                  {isLastCtaCard ? (
                    /* DERNIÈRE CARTE DU CARROUSEL : « Le vôtre ? » (Style exact de la Capture envoyée) */
                    <div className="group relative h-[350px] sm:h-[395px] w-full rounded-[30px] bg-gradient-to-br from-[#38BDF8] via-[#0EA5E9] to-[#0284C7] p-7 sm:p-10 shadow-[0_28px_60px_-15px_rgba(14,165,233,0.4)] flex flex-col justify-between overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.01]">
                      {/* Point d'interrogation géant dessiné en arrière-plan à droite */}
                      <svg
                        viewBox="0 0 220 340"
                        fill="none"
                        aria-hidden="true"
                        className="absolute -right-6 top-6 w-52 sm:w-60 h-auto text-[#061326]/20 pointer-events-none select-none"
                      >
                        <path
                          d="M42 84C42 40 78 14 124 14C172 14 204 44 204 88C204 126 178 148 146 168C118 186 108 204 106 236"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="104"
                          cy="296"
                          r="24"
                          stroke="currentColor"
                          strokeWidth="3.5"
                        />
                      </svg>

                      {/* Haut : Espace vide à gauche + Grand cercle noir avec flèche orange ↗ à droite */}
                      <div className="flex items-start justify-between relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/10 text-[#061326] text-xs font-mono uppercase tracking-wider">
                          Prochain projet
                        </span>

                        <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#061326] text-[#38BDF8] flex items-center justify-center shadow-2xl group-hover:scale-105 group-hover:rotate-12 transition-all duration-300">
                          <ArrowUpRight className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2]" />
                        </div>
                      </div>

                      {/* Bas : Titre géant « Le vôtre ? » */}
                      <div className="relative z-10 mt-auto">
                        <div className="text-5xl sm:text-6xl font-bold tracking-tight text-[#061326] leading-none font-[family-name:var(--font-dm-sans)]">
                          Le{" "}
                          <span className="italic font-normal font-[family-name:var(--font-instrument-serif)] text-[1.08em]">
                            vôtre
                          </span>{" "}
                          ?
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-[#061326]/80 mt-2">
                          Cliquez ici pour lancer votre brief en 4 étapes →
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* CARTE PROJET CLASSIQUE */
                    <div className="rounded-[28px] bg-gradient-to-br from-[#0D3B66] via-[#081C38] to-[#051020] p-3.5 sm:p-4 shadow-[0_28px_60px_-15px_rgba(22,18,30,0.55)] border border-white/15 transition-transform duration-300 cursor-pointer">
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

                        <span className="absolute right-2 text-[10px] font-mono text-[#0EA5E9]">
                          {activeIndex + 1}/{stackProjects.length}
                        </span>
                      </div>

                      {/* Aperçu Visuel du Projet */}
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

                      {/* Bas de la carte sombre : Catégorie espacée + Grand Titre Blanc */}
                      <div className="pt-3.5 pb-1 px-2 flex items-end justify-between gap-3">
                        <div>
                          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/60">
                            {currentProject.tags[0] || "ARCHITECTURE WEB & DESIGN"}
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mt-0.5 truncate max-w-[310px]">
                            {currentProject.titre}
                          </h3>
                        </div>

                        <span
                          className="px-3 py-1.5 rounded-full bg-[#0EA5E9] text-white text-[11px] font-bold shrink-0 shadow-md"
                          title="Cliquer pour voir les options"
                        >
                          Détails ↗
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contrôles du Carrousel Empilé : ← | ✋ GLISSEZ | → */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Carte précédente"
                  className="w-11 h-11 rounded-full bg-transparent hover:bg-[#061326] text-[#061326] hover:text-white border border-[#061326]/15 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {!isLastCtaCard && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#061326] hover:bg-[#0EA5E9] text-white text-[11px] font-bold uppercase tracking-[0.18em] transition-colors cursor-pointer"
                  >
                    <Hand className="w-3.5 h-3.5 text-[#0EA5E9]" />
                    <span>GLISSEZ</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Carte suivante"
                  className="w-11 h-11 rounded-full bg-transparent hover:bg-[#061326] text-[#061326] hover:text-white border border-[#061326]/15 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BANDEAU DÉFILANT DE TECHNOLOGIES */}
        <div className="mt-10 sm:mt-14 py-4 bg-white/75 border-y border-[#CBE2FF] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee flex items-center gap-4 sm:gap-6 px-4">
            {[...TECH_RIBBON_TOOLS, ...TECH_RIBBON_TOOLS].map((tool, idx) => (
              <div
                key={`${tool}-${idx}`}
                className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-[#CBE2FF] shadow-2xs shrink-0 hover:border-[#0EA5E9] transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <ToolIconRenderer name={tool} className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#061326] whitespace-nowrap">
                  {tool}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODALE INTERACTIVE AU CLIC SUR UNE CARTE PROJET (« Je veux le même ») */}
      {selectedProjectModal && (
        <div
          className="fixed inset-0 z-[120] bg-[#061326]/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedProjectModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-[32px] bg-[#F0F7FF] text-[#061326] border border-[#CBE2FF] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Aperçu image en haut */}
            <div className="relative aspect-16/9 w-full bg-[#061326]">
              <Image
                src={
                  selectedProjectModal.coverMedia?.url ||
                  selectedProjectModal.coverImage ||
                  "/images/projects/portfolio-cv-personnel.jpg"
                }
                alt={selectedProjectModal.titre}
                fill
                sizes="(max-width: 768px) 100vw, 680px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061326] via-[#061326]/25 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedProjectModal(null)}
                aria-label="Fermer"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#061326]/80 hover:bg-[#0EA5E9] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 inset-x-6 flex flex-wrap items-end justify-between gap-3 text-white">
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selectedProjectModal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/20 backdrop-blur-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
                    {selectedProjectModal.titre}
                  </h3>
                </div>
              </div>
            </div>

            {/* Contenu & Question d'Appel à l'Action (« Je veux le même ») */}
            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-sm sm:text-base text-[#334E68] leading-relaxed">
                {selectedProjectModal.description}
              </p>

              {/* Encart Question CTA « Ce projet vous inspire ? Je veux le même » */}
              <div className="rounded-2xl bg-[#E0F2FE]/70 border border-[#0EA5E9]/25 p-5 sm:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider font-bold text-[#0EA5E9]">
                      <Sparkles className="w-3.5 h-3.5" /> Ce projet vous inspire ?
                    </span>
                    <h4 className="text-xl sm:text-2xl font-bold text-[#061326] mt-1 font-[family-name:var(--font-dm-sans)]">
                      Vous souhaitez{" "}
                      <span className="italic font-normal text-[#0EA5E9] font-[family-name:var(--font-instrument-serif)] text-[1.12em]">
                        le même résultat
                      </span>{" "}
                      pour votre activité ?
                    </h4>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const projTitle = selectedProjectModal.titre;
                      setSelectedProjectModal(null);
                      trackCtaClick(
                        `Je veux le même : ${projTitle}`,
                        "wizard_modal",
                        "project_card_modal"
                      );
                      setWizardPresetType("presence-en-ligne");
                      setWizardOpen(true);
                    }}
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#0EA5E9] hover:bg-[#061326] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0EA5E9]/25 transition-all cursor-pointer"
                  >
                    <span>Je veux le même projet</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <a
                    href={`https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(
                      `Bonjour Sylla 👋, j'ai vu votre réalisation « ${selectedProjectModal.titre} » sur votre site et je voudrais concevoir un projet similaire pour mon activité.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackWhatsappClick("project_modal_same_project", selectedProjectModal.slug)
                    }
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-[#061326] text-xs sm:text-sm font-bold transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Demander sur WhatsApp</span>
                  </a>

                  <Link
                    href={`/projets/${selectedProjectModal.slug}`}
                    onClick={() => setSelectedProjectModal(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-white border border-[#CBE2FF] hover:border-[#061326] text-xs font-bold text-[#061326] transition-all"
                  >
                    <span>Voir l&apos;étude de cas</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <BriefWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        initialProjectType={wizardPresetType}
      />
    </>
  );
}
