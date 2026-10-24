"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Monitor,
  Smartphone,
  ShoppingBag,
  Sparkles,
  Palette,
  Terminal,
  CheckCircle2,
  MessageCircle,
  ExternalLink,
  X,
} from "lucide-react";
import { BriefWizardModal } from "@/components/devcreative/BriefWizardModal";
import {
  trackWizardStart,
  trackProjectClick,
  trackCategoryFilter,
  trackCtaClick,
  trackWhatsappClick,
} from "@/lib/analytics-client";
import type { ProjectData } from "@/components/ProjectCard";
import type { TestimonialData } from "@/lib/devcreative-catalog";

const SELECTOR_CARDS = [
  {
    id: "saas-plateforme",
    title: "SaaS",
    domain: "app.sylla.ci",
    icon: Terminal,
  },
  {
    id: "presence-en-ligne",
    title: "Vitrine",
    domain: "vitrine.ci",
    icon: Monitor,
  },
  {
    id: "mobile-business",
    title: "Mobile",
    domain: "mobile.app",
    icon: Smartphone,
  },
  {
    id: "saas-plateforme",
    title: "E-commerce",
    domain: "boutique.ci",
    icon: ShoppingBag,
  },
  {
    id: "missions-ponctuelles",
    title: "IA",
    domain: "ai.workflow",
    icon: Sparkles,
  },
  {
    id: "conception-identite",
    title: "Design",
    domain: "brand.studio",
    icon: Palette,
  },
] as const;

interface ProjectsDevCreativeProps {
  projects: ProjectData[];
  testimonials?: TestimonialData[];
}

export function ProjectsDevCreative({
  projects,
  testimonials = [],
}: ProjectsDevCreativeProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteCardRef = useRef<HTMLDivElement>(null);
  const orangeBlockRef = useRef<HTMLDivElement>(null);
  const selectorCardsRef = useRef<HTMLButtonElement[]>([]);
  const projectCardsRef = useRef<HTMLElement[]>([]);

  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [hoveredSelectorIdx, setHoveredSelectorIdx] = useState<number | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedWizardType, setSelectedWizardType] = useState<string>("presence-en-ligne");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [activeProjectPrompt, setActiveProjectPrompt] = useState<ProjectData | null>(null);

  const safeTestimonials: TestimonialData[] =
    testimonials.length > 0
      ? testimonials
      : [
          {
            id: "default-1",
            auteur: "Direction Projet Digital",
            role: "Responsable Opérations",
            entreprise: "PME & Services · Abidjan",
            citation:
              "Il ne se contente jamais de ses acquis : chaque interface livrée est pensée pour rassurer nos clients et générer des demandes qualifiées.",
            photo: null,
            accordEcrit: true,
            visible: true,
            ordre: 1,
          },
          {
            id: "default-2",
            auteur: "Fondateur & Créateur",
            role: "Gérant",
            entreprise: "Marque & E-commerce",
            citation:
              "Un interlocuteur unique pour notre identité visuelle et notre plateforme web. Délais tenus et accompagnement réactif sur WhatsApp.",
            photo: null,
            accordEcrit: true,
            visible: true,
            ordre: 2,
          },
        ];

  const currentTestimonial =
    safeTestimonials[activeTestimonialIdx % safeTestimonials.length];

  // Effets de révélation au Scroll GSAP ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      if (quoteCardRef.current) {
        gsap.fromTo(
          quoteCardRef.current,
          { y: 55, opacity: 0, rotate: -3, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            rotate: -1,
            scale: 1,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: {
              trigger: quoteCardRef.current,
              start: "top 86%",
            },
          }
        );
      }

      if (orangeBlockRef.current) {
        gsap.fromTo(
          orangeBlockRef.current,
          { y: 60, opacity: 0.75, scale: 0.93 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.95,
            ease: "expo.out",
            scrollTrigger: {
              trigger: orangeBlockRef.current,
              start: "top 86%",
            },
          }
        );
      }

      if (selectorCardsRef.current.length > 0) {
        gsap.fromTo(
          selectorCardsRef.current,
          { y: 35, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: orangeBlockRef.current,
              start: "top 78%",
            },
          }
        );
      }

      if (projectCardsRef.current.length > 0) {
        gsap.fromTo(
          projectCardsRef.current,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: projectCardsRef.current[0],
              start: "top 88%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [selectedFilter]);

  const handleSelectProjectType = (typeId: string) => {
    setSelectedWizardType(typeId);
    trackWizardStart(typeId, "et_le_votre_block");
    setWizardOpen(true);
  };

  const filteredProjects = projects.filter((p) => {
    if (selectedFilter === "all") return true;
    const tagsStr = p.tags.join(" ").toLowerCase();
    return tagsStr.includes(selectedFilter.toLowerCase());
  });

  return (
    <div ref={sectionRef} className="space-y-12 sm:space-y-20 py-8 sm:py-14">
      {/* =====================================================================
          1. SECTION CITATION & PREUVE SOCIALE ÉDITORIALE
         ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative py-6 sm:py-10">
          <div
            aria-hidden="true"
            className="text-7xl sm:text-8xl font-serif leading-none text-[#0EA5E9] select-none mb-2 font-[family-name:var(--font-dm-sans)]"
          >
            “
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            {/* Sélecteur d'avatars clients en bas à gauche */}
            <div className="lg:col-span-3 flex items-center gap-3 order-2 lg:order-1">
              {safeTestimonials.map((t, idx) => {
                const isActive = idx === activeTestimonialIdx;
                const initials = t.auteur
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTestimonialIdx(idx)}
                    title={`Témoignage de ${t.auteur}`}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer border-2 ${
                      isActive
                        ? "border-[#0EA5E9] bg-[#061326] text-white scale-110 shadow-md"
                        : "border-[#CBE2FF] bg-white text-[#334E68] opacity-70 hover:opacity-100"
                    }`}
                  >
                    {initials}
                  </button>
                );
              })}
            </div>

            {/* Carte de Citation blanche inclinée + Badge noir flottant */}
            <div className="lg:col-span-9 relative order-1 lg:order-2">
              <div
                ref={quoteCardRef}
                className="bg-white rounded-[28px] p-7 sm:p-10 shadow-xl border border-[#CBE2FF] transform -rotate-1"
              >
                <blockquote className="text-xl sm:text-3xl text-[#0A1D37] leading-snug italic font-[family-name:var(--font-instrument-serif)] text-[1.08em]">
                  « {currentTestimonial.citation} »
                </blockquote>
                <div className="mt-4 flex items-center gap-2 text-xs text-[#526D82] font-medium">
                  <strong className="text-[#0A1D37]">{currentTestimonial.auteur}</strong>
                  <span>·</span>
                  <span>{currentTestimonial.role}</span>
                  <span>({currentTestimonial.entreprise})</span>
                </div>
              </div>

              {/* Badge Noir Flottant en bas à droite */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:right-6 bg-[#061326] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-white/10 flex items-center justify-between gap-6 max-w-md ml-auto transform rotate-1">
                <div>
                  <div className="text-xs font-bold text-white">Approche Orientée Résultats</div>
                  <div className="text-[11px] text-white/70">
                    Chaque livrable est conçu pour convertir vos visiteurs.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectProjectType("presence-en-ligne")}
                  className="text-xs font-bold text-[#0EA5E9] hover:underline shrink-0 cursor-pointer"
                >
                  Lancer un brief →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. BLOC INTERACTIF ORANGE VIF « Et le vôtre ? » (Style Capture 3)
         ===================================================================== */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div
          ref={orangeBlockRef}
          className="rounded-[32px] sm:rounded-[44px] bg-gradient-to-br from-[#38BDF8] via-[#0EA5E9] to-[#0284C7] text-[#061326] p-6 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Titre gauche : "Et le vôtre ?" */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#061326] font-[family-name:var(--font-dm-sans)] leading-none">
                Et le{" "}
                <span className="relative inline-block italic font-normal font-[family-name:var(--font-instrument-serif)] text-[1.12em]">
                  vôtre
                  <svg
                    viewBox="0 0 180 20"
                    fill="none"
                    className="absolute -bottom-2 left-0 w-full h-4 text-[#061326]"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 14C45 4 98 18 177 7"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                ?
              </h2>
            </div>

            {/* Grille des 6 Cartes de Sélection avec Mini-Fenêtre Navigateur au Survol (Capture 3) */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
                {SELECTOR_CARDS.map((card, i) => {
                  const Icon = card.icon;
                  const isHovered = hoveredSelectorIdx === i;
                  const previewProject = projects[i % Math.max(projects.length, 1)];
                  const previewImg =
                    previewProject?.coverMedia?.url ||
                    previewProject?.coverImage ||
                    "/images/projects/portfolio-cv-personnel.jpg";

                  return (
                    <button
                      key={`${card.title}-${i}`}
                      ref={(el) => {
                        if (el) selectorCardsRef.current[i] = el;
                      }}
                      type="button"
                      data-cursor="dark"
                      onMouseEnter={() => setHoveredSelectorIdx(i)}
                      onMouseLeave={() => setHoveredSelectorIdx(null)}
                      onFocus={() => setHoveredSelectorIdx(i)}
                      onBlur={() => setHoveredSelectorIdx(null)}
                      onClick={() => handleSelectProjectType(card.id)}
                      style={{
                        backgroundColor: isHovered
                          ? "rgba(20, 18, 16, 0.08)"
                          : "rgba(255, 255, 255, 0.05)",
                      }}
                      className="group relative overflow-hidden text-left p-4 sm:p-5 rounded-[24px] text-[#061326] border border-[#061326]/15 hover:border-[#061326]/35 transition-all duration-300 flex flex-col justify-between min-h-[155px] sm:min-h-[180px] cursor-pointer"
                    >
                      {/* En-tête de la carte : Titre + Cercle radio */}
                      <div className="flex items-start justify-between gap-2 w-full relative z-10">
                        <div className="font-bold text-base sm:text-xl leading-tight">
                          {card.title}
                        </div>
                        <span
                          style={{
                            backgroundColor: isHovered ? "#061326" : "transparent",
                          }}
                          className="w-4 h-4 rounded-full border border-[#061326]/40 transition-colors shrink-0 mt-0.5"
                        />
                      </div>

                      {/* Icône en bas à gauche */}
                      <div
                        style={{ opacity: isHovered ? 0.2 : 1 }}
                        className="mt-4 flex items-center justify-between relative z-10 transition-opacity duration-200"
                      >
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.75] text-[#061326]" />
                      </div>

                      {/* Mini fenêtre navigateur inclinée qui surgit au survol (Pilotée en inline style pour 100% de visibilité) */}
                      <div
                        aria-hidden="true"
                        style={{
                          transform: isHovered
                            ? "translateY(0px) rotate(-4deg) scale(1)"
                            : "translateY(125px) rotate(-8deg) scale(0.9)",
                          opacity: isHovered ? 1 : 0,
                          transition:
                            "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease",
                        }}
                        className="absolute right-2.5 bottom-0 w-[76%] h-[112px] rounded-t-2xl bg-[#F0F7FF] p-1.5 shadow-2xl border border-[#061326]/10 pointer-events-none z-20"
                      >
                        <div className="flex items-center justify-between px-1.5 pb-1">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F56]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F]" />
                          </div>
                          <span className="text-[8px] font-mono text-[#061326]/65 bg-black/5 px-2 py-0.5 rounded-full truncate max-w-[75px]">
                            {card.domain}
                          </span>
                        </div>
                        <div className="relative w-full h-[82px] rounded-lg overflow-hidden bg-white">
                          <Image
                            src={previewImg}
                            alt=""
                            fill
                            sizes="180px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#061326]/80">
                <CheckCircle2 className="w-4 h-4" />
                <span>Survolez une catégorie et cliquez pour configurer votre projet en 4 étapes.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. ÉTUDES DE CAS & RÉALISATIONS PROUVÉES (Avec bouton « Je veux le même »)
         ===================================================================== */}
      <section id="projets" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#2563EB] font-bold">
              Preuves par l&apos;exemple
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#0A1D37] mt-1 font-[family-name:var(--font-dm-sans)]">
              Études de cas &amp;{" "}
              <span className="italic font-normal text-[#0EA5E9] font-[family-name:var(--font-instrument-serif)] text-[1.12em]">
                livrables réels
              </span>
            </h2>
          </div>

          {/* Filtres par spécialité */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "Tout voir" },
              { id: "web", label: "Web & SaaS" },
              { id: "design", label: "Identité & UI/UX" },
              { id: "ia", label: "IA & Mobile" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedFilter(tab.id);
                  trackCategoryFilter(tab.id, "devcreative");
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === tab.id
                    ? "bg-[#0A1D37] text-white shadow-sm"
                    : "bg-white text-[#334E68] border border-[#CBE2FF] hover:border-[#2563EB]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des Études de Cas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.slice(0, 6).map((project, idx) => {
            const imgUrl =
              project.coverMedia?.url ||
              project.coverImage ||
              "/images/projects/portfolio-cv-personnel.jpg";
            return (
              <article
                key={project.id}
                ref={(el) => {
                  if (el) projectCardsRef.current[idx] = el;
                }}
                onClick={() => setActiveProjectPrompt(project)}
                className="group bg-white rounded-[24px] border border-[#CBE2FF] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#0EA5E9]/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="block relative aspect-16/10 bg-[#061326] overflow-hidden">
                    <Image
                      src={imgUrl}
                      alt={project.titre}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#061326]/85 text-white backdrop-blur-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-2.5">
                    <h3 className="text-lg font-bold text-[#0A1D37] group-hover:text-[#0EA5E9] transition-colors">
                      {project.titre}
                    </h3>
                    <p className="text-xs text-[#334E68] line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#F0F7FF] flex items-center justify-between">
                  <Link
                    href={`/projets/${project.slug}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      trackProjectClick(project.slug, project.titre, "devcreative_grid");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#061326] hover:text-[#2563EB] hover:underline"
                  >
                    <span>Voir l&apos;étude de cas</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProjectPrompt(project);
                    }}
                    className="px-3 py-1 rounded-full bg-[#E0F2FE] group-hover:bg-[#0EA5E9] text-[#0EA5E9] group-hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Je veux le même ↗
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* MODALE QUESTION CTA AU CLIC SUR UNE CARTE PROJET (« Je veux le même ») */}
      {activeProjectPrompt && (
        <div
          className="fixed inset-0 z-[120] bg-[#061326]/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveProjectPrompt(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-[32px] bg-[#F0F7FF] text-[#061326] border border-[#CBE2FF] shadow-2xl overflow-hidden"
          >
            <div className="relative aspect-16/9 w-full bg-[#061326]">
              <Image
                src={
                  activeProjectPrompt.coverMedia?.url ||
                  activeProjectPrompt.coverImage ||
                  "/images/projects/portfolio-cv-personnel.jpg"
                }
                alt={activeProjectPrompt.titre}
                fill
                sizes="(max-width: 768px) 100vw, 680px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061326] via-[#061326]/25 to-transparent" />

              <button
                type="button"
                onClick={() => setActiveProjectPrompt(null)}
                aria-label="Fermer"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#061326]/80 hover:bg-[#0EA5E9] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 inset-x-6 text-white">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {activeProjectPrompt.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/20 backdrop-blur-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
                  {activeProjectPrompt.titre}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-sm sm:text-base text-[#334E68] leading-relaxed">
                {activeProjectPrompt.description}
              </p>

              <div className="rounded-2xl bg-[#E0F2FE]/70 border border-[#0EA5E9]/25 p-5 sm:p-6 space-y-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider font-bold text-[#0EA5E9]">
                    <Sparkles className="w-3.5 h-3.5" /> Ce projet vous inspire ?
                  </span>
                  <h4 className="text-xl sm:text-2xl font-bold text-[#061326] mt-1 font-[family-name:var(--font-dm-sans)]">
                    Vous souhaitez{" "}
                    <span className="italic font-normal text-[#0EA5E9] font-[family-name:var(--font-instrument-serif)] text-[1.12em]">
                      le même projet
                    </span>{" "}
                    pour votre activité ?
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const title = activeProjectPrompt.titre;
                      setActiveProjectPrompt(null);
                      trackCtaClick(
                        `Je veux le même : ${title}`,
                        "wizard_modal",
                        "grid_project_modal"
                      );
                      handleSelectProjectType("presence-en-ligne");
                    }}
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#0EA5E9] hover:bg-[#061326] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0EA5E9]/25 transition-all cursor-pointer"
                  >
                    <span>Je veux le même projet</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <a
                    href={`https://wa.me/2250594564993?text=${encodeURIComponent(
                      `Bonjour Sylla 👋, j'ai vu votre réalisation « ${activeProjectPrompt.titre} » et je veux le même type de projet pour mon activité.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackWhatsappClick("grid_modal_same_project", activeProjectPrompt.slug)
                    }
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-[#061326] text-xs sm:text-sm font-bold transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Demander sur WhatsApp</span>
                  </a>

                  <Link
                    href={`/projets/${activeProjectPrompt.slug}`}
                    onClick={() => setActiveProjectPrompt(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-white border border-[#CBE2FF] hover:border-[#061326] text-xs font-bold text-[#061326] transition-all"
                  >
                    <span>Étude de cas complète</span>
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
        initialProjectType={selectedWizardType}
      />
    </div>
  );
}
