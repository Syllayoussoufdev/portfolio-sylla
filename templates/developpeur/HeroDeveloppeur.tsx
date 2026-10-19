"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  FileText,
  Mail,
  ExternalLink,
  Code2,
  Layers,
  Cpu,
  Terminal,
} from "lucide-react";
import { TechWireframe3D } from "@/components/3d/TechWireframe3D";
import type { HeroData } from "@/lib/validations/profile";
import type { MediaData, SiteSettingsData } from "@/lib/profiles";

interface HeroDeveloppeurProps {
  hero?: HeroData;
  heroMedia?: MediaData | null;
  projectsCount?: number;
  settings?: SiteSettingsData | null;
}

const TECH_MARQUEE = [
  { name: "Next.js", category: "Framework Fullstack" },
  { name: "React", category: "Frontend UI" },
  { name: "TypeScript", category: "Typage Strict" },
  { name: "Laravel", category: "Backend & API" },
  { name: "Tailwind CSS", category: "Design System" },
  { name: "PostgreSQL", category: "Base Relationnelle" },
  { name: "Prisma ORM", category: "Modélisation DB" },
  { name: "React Native", category: "Applications Mobiles" },
  { name: "Flutter", category: "Cross-Platform" },
  { name: "Docker", category: "Conteneurisation" },
  { name: "GSAP", category: "Motion & Animations" },
];

const DEFAULT_STACK = [
  "TypeScript",
  "React",
  "Next.js",
  "Laravel",
  "Tailwind CSS",
  "PostgreSQL",
];

export function HeroDeveloppeur({
  hero,
  heroMedia,
  projectsCount = 25,
  settings,
}: HeroDeveloppeurProps) {
  const headline =
    hero?.headline ||
    "Je conçois des expériences web et mobiles utiles, performantes et soignées.";
  const subline =
    hero?.subline || "Développeur Web & Mobile · Laravel · React · Next.js";

  const primaryCta = hero?.ctaPrimary || {
    label: "Voir mes réalisations",
    href: "#projets",
  };
  const secondaryCta = hero?.ctaSecondary || {
    label: "Me contacter",
    href: "#contact",
  };

  const displayName = settings?.nom || "Sylla Youssouf";
  const displayMetier = settings?.metier || "Fullstack & Mobile Engineer";
  const imageSrc = heroMedia?.url || "/sylla.jpg";
  const imageAlt = heroMedia?.alt || `Portrait de ${displayName}`;

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex flex-col justify-center pt-32 pb-16 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden bg-white text-[#0B132B]"
    >
      {/* Halo lumineux bleu subtil d'ambiance */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-100/60 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] rounded-full bg-slate-100/80 blur-[100px] pointer-events-none -z-10" />

      {/* Grille principale 2 colonnes (Style Image 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16">
        {/* Colonne Gauche : Discours, Stack & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Pastille de disponibilité avec point vert animé */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/90 text-xs font-medium text-[#0B132B] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Disponible pour opportunités &amp; collaborations</span>
          </div>

          {/* Titre Principal avec surbrillance bleue */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-[#0B132B] leading-[1.12]">
            Je conçois des expériences{" "}
            <span className="text-[#2563EB]">web et mobiles</span> utiles,
            performantes et soignées.
          </h1>

          {/* Métier & Technologies */}
          <div className="space-y-3">
            <p className="text-base sm:text-lg font-semibold text-[#0B132B]">
              {subline}
            </p>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl">
              Passionné par l&apos;architecture logicielle, les interfaces soignées et le développement web moderne. J&apos;accompagne les entreprises et créateurs dans la concrétisation de projets numériques performants et pérennes.
            </p>
          </div>

          {/* Badges de Technologies Clés */}
          <div className="flex flex-wrap gap-2 pt-1">
            {DEFAULT_STACK.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-slate-100/80 border border-slate-200 text-[#334155]"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Boutons d'Action */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B132B] hover:bg-slate-800 text-white text-xs font-semibold shadow-md shadow-slate-900/10 transition-all active:scale-[0.98]"
            >
              <span>{primaryCta.label}</span>
              <ArrowRight className="w-4 h-4 text-[#2563EB]" />
            </Link>

            <Link
              href={secondaryCta.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-[#0B132B] text-xs font-semibold border border-slate-200/90 shadow-2xs transition-all active:scale-[0.98]"
            >
              <Mail className="w-4 h-4 text-[#2563EB]" />
              <span>{secondaryCta.label}</span>
            </Link>

            <a
              href="#a-propos"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-[#475569] text-xs font-semibold border border-slate-200/90 shadow-2xs transition-all"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Bio &amp; Approche</span>
            </a>
          </div>

          {/* Mentions de Réassurance (Style Image 1) */}
          <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-[#64748B] font-mono">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Basé à Abidjan, Côte d&apos;Ivoire</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Code propre, typé &amp; structuré</span>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Visuel Portrait avec Anneaux Orbitaux 3D (Style Image 1 & Aquilas Dev) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-[340px] sm:w-[400px] aspect-square flex items-center justify-center">
            {/* Canevas 3D d'anneaux orbitaux en arrière-plan du portrait */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none scale-110">
              <TechWireframe3D />
            </div>

            {/* Cadre du Portrait Stylisé */}
            <div className="relative z-10 w-[280px] sm:w-[320px] aspect-square rounded-3xl overflow-hidden bg-slate-900 border-4 border-white shadow-2xl shadow-blue-500/10 group">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 280px, 320px"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-104"
              />

              {/* Gradient d'ombrage bas pour le badge */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />

              {/* Badge Identité en bas de carte (Style Image 1) */}
              <div className="absolute bottom-3 inset-x-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between gap-2">
                <div className="truncate">
                  <span className="block text-xs font-bold text-[#0B132B] truncate">
                    {displayName}
                  </span>
                  <span className="block text-[10px] font-mono text-[#64748B] truncate">
                    {displayMetier}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                  <Code2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ruban Défilant Marquee des Technologies (Style Aquilas Dev / Image 2) */}
      <div className="mt-8 pt-8 border-t border-slate-200/70">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
            <Terminal className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>ÉCOSYSTÈME TECHNIQUE &amp; ENVIRONNEMENT DE DÉVELOPPEMENT</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-[#0B132B]">
            <span className="font-semibold text-[#2563EB]">25+ Projets livrés</span>
            <span>·</span>
            <span>3+ Années d&apos;expérience</span>
            <span>·</span>
            <span className="text-emerald-600 font-semibold">99% Code typé</span>
          </div>
        </div>

        {/* Marquee en boucle continue */}
        <div className="relative overflow-hidden w-full py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex items-center gap-3 animate-marquee whitespace-nowrap">
            {[...TECH_MARQUEE, ...TECH_MARQUEE].map((tech, idx) => (
              <div
                key={`${tech.name}-${idx}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-[#0B132B] hover:border-[#2563EB]/40 hover:bg-blue-50/50 transition-colors cursor-default"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                <span className="font-bold">{tech.name}</span>
                <span className="text-[10px] text-[#64748B] font-mono">({tech.category})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
