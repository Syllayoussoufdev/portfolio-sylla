"use client";

import React from "react";
import { FloatingToolTile } from "./FloatingToolTile";
import type { HeroAllowedTool } from "@/lib/validations/profile";

interface HeroFloatingToolsProps {
  tools?: (HeroAllowedTool | string)[];
}

const DEFAULT_TOOLS: HeroAllowedTool[] = ["Canva", "Figma", "Next.js", "Laravel", "React"];

// Coordonnées satellites stratégiques ancrées directement autour du portrait
// Garantit un espacement harmonieux sans jamais recouvrir le visage, le texte hero ou les boutons CTA
const SATELLITE_POSITIONS = [
  // Tuile 0 : En haut à droite du portrait (Canva) — visible mobile & desktop
  {
    className: "absolute -top-5 -right-5 sm:-top-7 sm:-right-8 z-30",
    depth: 14,
    floatingDuration: 3.4,
    floatingOffset: 10,
    mobileVisible: true,
  },
  // Tuile 1 : En bas à droite du portrait (Figma) — visible mobile & desktop
  {
    className: "absolute -bottom-5 -right-4 sm:-bottom-7 sm:-right-7 z-30",
    depth: 16,
    floatingDuration: 4.2,
    floatingOffset: 12,
    mobileVisible: true,
  },
  // Tuile 2 : En bas à gauche du portrait (Next.js) — visible mobile & desktop
  {
    className: "absolute -bottom-6 left-3 sm:-bottom-8 sm:left-4 z-30",
    depth: 12,
    floatingDuration: 3.8,
    floatingOffset: 9,
    mobileVisible: true,
  },
  // Tuile 3 : En haut à gauche du portrait (Laravel) — desktop/tablette uniquement
  {
    className: "absolute -top-7 -left-5 sm:-top-9 sm:-left-8 z-25 hidden sm:block",
    depth: 10,
    floatingDuration: 4.5,
    floatingOffset: 11,
    mobileVisible: false,
  },
  // Tuile 4 : Milieu gauche du portrait (React) — desktop/tablette uniquement
  {
    className: "absolute top-1/2 -translate-y-1/2 -left-8 sm:-left-12 z-25 hidden sm:block",
    depth: 15,
    floatingDuration: 3.6,
    floatingOffset: 10,
    mobileVisible: false,
  },
  // Tuile 5 (si 6+ outils sélectionnés dans l'admin)
  {
    className: "absolute top-1/2 -translate-y-1/2 -right-8 sm:-right-12 z-25 hidden md:block",
    depth: 8,
    floatingDuration: 4.0,
    floatingOffset: 9,
    mobileVisible: false,
  },
  // Tuile 6 (si 7+ outils sélectionnés dans l'admin)
  {
    className: "absolute -top-10 left-1/2 -translate-x-1/2 z-20 hidden lg:block",
    depth: 12,
    floatingDuration: 4.4,
    floatingOffset: 11,
    mobileVisible: false,
  },
  // Tuile 7 (si 8 outils sélectionnés dans l'admin)
  {
    className: "absolute -bottom-10 left-1/2 -translate-x-1/2 z-20 hidden lg:block",
    depth: 10,
    floatingDuration: 3.9,
    floatingOffset: 8,
    mobileVisible: false,
  },
];

export function HeroFloatingTools({ tools }: HeroFloatingToolsProps) {
  const activeTools = tools && tools.length > 0 ? tools.slice(0, 8) : DEFAULT_TOOLS;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {activeTools.map((tool, idx) => {
        const pos = SATELLITE_POSITIONS[idx % SATELLITE_POSITIONS.length];
        return (
          <div
            key={`${tool}-${idx}`}
            className={`${pos.className} pointer-events-auto ${
              !pos.mobileVisible ? "hidden sm:block" : ""
            }`}
          >
            <FloatingToolTile
              tool={tool}
              index={idx}
              depth={pos.depth}
              floatingDuration={pos.floatingDuration}
              floatingOffset={pos.floatingOffset}
            />
          </div>
        );
      })}
    </div>
  );
}
