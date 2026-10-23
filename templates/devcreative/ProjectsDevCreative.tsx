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
  Layers,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { BriefWizardModal } from "@/components/devcreative/BriefWizardModal";
import { trackWizardStart, trackProjectClick, trackCategoryFilter } from "@/lib/analytics-client";
import type { ProjectData } from "@/components/ProjectCard";
import type { TestimonialData } from "@/lib/devcreative-catalog";

const SELECTOR_CARDS = [
  {
    id: "saas-plateforme",
    title: "SaaS & App Web",
    subtitle: "Plateforme métier & Back-office",
    icon: Layers,
  },
  {
    id: "presence-en-ligne",
    title: "Vitrine",
    subtitle: "Site rapide & haute conversion",
    icon: Monitor,
  },
  {
    id: "mobile-business",
    title: "Mobile",
    subtitle: "App iOS & Android orientée activité",
    icon: Smartphone,
  },
  {
    id: "saas-plateforme",
    title: "E-commerce",
    subtitle: "Catalogue, commande & suivi",
    icon: ShoppingBag,
  },
  {
    id: "missions-ponctuelles",
    title: "IA & Automatisation",
    subtitle: "Agents, workflows & API",
    icon: Sparkles,
  },
  {
    id: "conception-identite",
    title: "Design & Marque",
    subtitle: "Identité visuelle & UI/UX",
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

  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedWizardType, setSelectedWizardType] = useState<string>("presence-en-ligne");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

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

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      if (quoteCardRef.current) {
        gsap.fromTo(
          quoteCardRef.current,
          { y: 30, opacity: 0, rotate: -2 },
          {
            y: 0,
            opacity: 1,
            rotate: -1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: quoteCardRef.current,
              start: "top 85%",
            },
          }
        );
      }

      if (orangeBlockRef.current) {
        gsap.fromTo(
          orangeBlockRef.current,
          { y: 40, opacity: 0.85, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: orangeBlockRef.current,
              start: "top 85%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
          1. SECTION CITATION & PREUVE SOCIALE ÉDITORIALE (Style Référence)
         ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative py-6 sm:py-10">
          {/* Guillemet géant orange en haut à gauche */}
          <div
            aria-hidden="true"
            className="text-7xl sm:text-8xl font-serif leading-none text-[#F4825A] select-none mb-2 font-[family-name:var(--font-instrument-serif)]"
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
                        ? "border-[#F4825A] bg-[#14172E] text-white scale-110 shadow-md"
                        : "border-[#E2DFF5] bg-white text-[#434975] opacity-70 hover:opacity-100"
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
                className="bg-white rounded-[28px] p-7 sm:p-10 shadow-xl border border-[#E2DFF5] transform -rotate-1"
              >
                <blockquote className="text-xl sm:text-3xl text-[#1E2347] leading-snug font-[family-name:var(--font-instrument-serif)] italic">
                  « {currentTestimonial.citation} »
                </blockquote>
                <div className="mt-4 flex items-center gap-2 text-xs text-[#5C6394] font-medium">
                  <strong className="text-[#1E2347]">{currentTestimonial.auteur}</strong>
                  <span>·</span>
                  <span>{currentTestimonial.role}</span>
                  <span>({currentTestimonial.entreprise})</span>
                </div>
              </div>

              {/* Badge Noir Flottant en bas à droite (Style Référence) */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:right-6 bg-[#14172E] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-white/10 flex items-center justify-between gap-6 max-w-md ml-auto transform rotate-1">
                <div>
                  <div className="text-xs font-bold text-white"> Approche Orientée Résultats</div>
                  <div className="text-[11px] text-white/70">
                    Chaque livrable est conçu pour convertir vos visiteurs.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectProjectType("presence-en-ligne")}
                  className="text-xs font-bold text-[#F4825A] hover:underline shrink-0 cursor-pointer"
                >
                  Lancer un brief →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. BLOC INTERACTIF ORANGE VIF « Et le vôtre ? » (Connecté au Wizard)
         ===================================================================== */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div
          ref={orangeBlockRef}
          className="rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-[#F4825A] via-[#EE602A] to-[#E04F1A] text-[#14172E] p-6 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Titre gauche : "Et le vôtre ?" */}
            <div className="lg:col-span-4 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/15 text-white text-xs font-mono uppercase tracking-wider">
                Configurateur de projet
              </span>
              <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#14172E] font-[family-name:var(--font-dm-sans)] leading-none">
                Et le{" "}
                <span className="italic font-normal underline decoration-[#14172E] decoration-2 underline-offset-8 font-[family-name:var(--font-instrument-serif)]">
                  vôtre
                </span>{" "}
                ?
              </h2>
              <p className="text-sm sm:text-base text-[#14172E]/85 font-medium leading-relaxed">
                Cliquez sur le type de projet que vous souhaitez développer pour ouvrir votre brief guidé en 4 étapes et obtenir votre estimation sous 24 h.
              </p>
            </div>

            {/* Grille des 6 Cartes de Sélection (Style Référence) */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {SELECTOR_CARDS.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={`${card.title}-${i}`}
                      type="button"
                      onClick={() => handleSelectProjectType(card.id)}
                      className="group text-left p-4 sm:p-5 rounded-[24px] bg-white/15 hover:bg-[#14172E] text-[#14172E] hover:text-white border border-black/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between min-h-[125px] sm:min-h-[145px] cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between gap-2 w-full">
                        <div>
                          <div className="font-bold text-sm sm:text-base leading-tight">
                            {card.title}
                          </div>
                          <div className="text-[11px] opacity-75 mt-0.5 line-clamp-1">
                            {card.subtitle}
                          </div>
                        </div>
                        <span className="w-5 h-5 rounded-full border border-current opacity-50 group-hover:opacity-100 flex items-center justify-center text-[10px]">
                          ↗
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <Icon className="w-6 h-6 stroke-[1.75] group-hover:text-[#F4825A] transition-colors" />
                        <span className="text-[10px] font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 text-[#F4825A] transition-opacity">
                          Choisir →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#14172E]/80">
                <CheckCircle2 className="w-4 h-4" />
                <span>Un seul interlocuteur de la conception graphique jusqu&apos;au déploiement serveur.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. ÉTUDES DE CAS & RÉALISATIONS PROUVÉES (Règle « Apport Réel »)
         ===================================================================== */}
      <section id="projets" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#4C5FD7] font-bold">
              Preuves par l&apos;exemple
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#1E2347] mt-1 font-[family-name:var(--font-dm-sans)]">
              Études de cas &amp;{" "}
              <span className="italic font-normal text-[#F4825A] font-[family-name:var(--font-instrument-serif)]">
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
                    ? "bg-[#1E2347] text-white shadow-sm"
                    : "bg-white text-[#434975] border border-[#E2DFF5] hover:border-[#4C5FD7]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des Études de Cas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.slice(0, 6).map((project) => {
            const imgUrl =
              project.coverMedia?.url ||
              project.coverImage ||
              "/images/projects/portfolio-cv-personnel.jpg";
            return (
              <article
                key={project.id}
                className="group bg-white rounded-[24px] border border-[#E2DFF5] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#4C5FD7]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <Link
                    href={`/projets/${project.slug}`}
                    onClick={() =>
                      trackProjectClick(project.slug, project.titre, "devcreative_grid")
                    }
                    className="block relative aspect-16/10 bg-[#14172E] overflow-hidden"
                  >
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
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#14172E]/85 text-white backdrop-blur-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>

                  <div className="p-5 sm:p-6 space-y-2.5">
                    <h3 className="text-lg font-bold text-[#1E2347] group-hover:text-[#4C5FD7] transition-colors">
                      <Link href={`/projets/${project.slug}`}>{project.titre}</Link>
                    </h3>
                    <p className="text-xs text-[#434975] line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#F6F4FF] flex items-center justify-between">
                  <Link
                    href={`/projets/${project.slug}`}
                    onClick={() =>
                      trackProjectClick(project.slug, project.titre, "devcreative_grid")
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4C5FD7] hover:underline"
                  >
                    <span>Lire l&apos;étude de cas</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleSelectProjectType("presence-en-ligne")}
                    className="text-[11px] font-semibold text-[#F4825A] hover:underline cursor-pointer"
                  >
                    Projet similaire ?
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <BriefWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        initialProjectType={selectedWizardType}
      />
    </div>
  );
}
