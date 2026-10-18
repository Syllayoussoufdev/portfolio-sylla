"use client";

import Link from "next/link";
import {
  ExternalLink,
  Globe,
  Video,
  FolderOpen,
  ArrowUpRight,
  Code2,
} from "lucide-react";
import { GithubIcon, FigmaIcon } from "./icons";

export interface ProjectData {
  id: string;
  titre: string;
  slug: string;
  description: string;
  contenu: string | null;
  coverImage: string | null;
  coverMedia?: { url: string; alt?: string | null } | null;
  tags: string[];
  links: unknown;
  ordre: number;
  featured: boolean;
}

export function ProjectCard({ project }: { project: ProjectData }) {
  const links = (project.links || {}) as Record<string, string>;
  const imageSrc = project.coverMedia?.url || project.coverImage;
  const imageAlt = project.coverMedia?.alt || project.titre;

  return (
    <div className="group editorial-card relative overflow-hidden flex flex-col justify-between h-full bg-white border border-slate-200/90 rounded-2xl transition-all duration-300 hover:border-[#2563EB]/40 hover:shadow-xl hover:shadow-slate-900/5">
      {/* 1. Zone Image / Cover (Ratio 16:9 strict) */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-200/70">
        {imageSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-[#2563EB] mb-2 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5 text-[#2563EB]" />
            </div>
            <span className="font-bebas text-lg text-[#0B132B] tracking-wide">
              {project.titre}
            </span>
            <span className="text-[10px] font-mono text-[#64748B]">
              Aperçu en cours d&apos;intégration
            </span>
          </div>
        )}

        {/* Badge À la une sobre */}
        {project.featured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0B132B] text-white font-medium text-[10px] tracking-wider uppercase shadow-xs">
            Sélection
          </div>
        )}

        {/* Lien direct d'ouverture projet */}
        <Link
          href={`/projets/${project.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`Voir le détail du projet ${project.titre}`}
        />
      </div>

      {/* 2. Corps de la carte */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags de compétences */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100/80 border border-slate-200/80 text-[#334155]"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-[10px] font-mono text-[#64748B] self-center">
                +{project.tags.length - 3}
              </span>
            )}
          </div>

          {/* Titre */}
          <Link href={`/projets/${project.slug}`} className="group/title block">
            <h3 className="font-semibold text-lg text-[#0B132B] group-hover/title:text-[#2563EB] transition-colors flex items-center justify-between gap-2">
              <span className="truncate">{project.titre}</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover/title:text-[#2563EB] group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all shrink-0" />
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#475569] mt-2 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* 3. Footer de carte : Liens directs sans rechargement */}
        <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between relative z-20">
          <div className="flex items-center gap-2">
            {links.demo && (
              <a
                href={links.demo}
                target="_blank"
                rel="noopener noreferrer"
                title="Démo Live"
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#2563EB] transition-colors border border-slate-200/60 shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}

            {links.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-200/80 text-slate-600 hover:text-[#0B132B] transition-colors border border-slate-200/60 shadow-2xs"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
            )}

            {links.figma && (
              <a
                href={links.figma}
                target="_blank"
                rel="noopener noreferrer"
                title="Maquette Figma"
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-600 transition-colors border border-slate-200/60 shadow-2xs"
              >
                <FigmaIcon className="w-3.5 h-3.5" />
              </a>
            )}

            {links.video && (
              <a
                href={links.video}
                target="_blank"
                rel="noopener noreferrer"
                title="Vidéo"
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors border border-slate-200/60 shadow-2xs"
              >
                <Video className="w-3.5 h-3.5" />
              </a>
            )}

            {links.drive && (
              <a
                href={links.drive}
                target="_blank"
                rel="noopener noreferrer"
                title="Dossier Assets"
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-600 transition-colors border border-slate-200/60 shadow-2xs"
              >
                <FolderOpen className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <Link
            href={`/projets/${project.slug}`}
            className="text-xs font-semibold text-[#0B132B] hover:text-[#2563EB] flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
          >
            <span>Détails</span>
            <ExternalLink className="w-3 h-3 text-[#2563EB]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
