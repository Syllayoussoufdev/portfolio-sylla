"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ToolIconRenderer } from "./ToolIconRenderer";
import type { HeroAllowedTool } from "@/lib/validations/profile";

interface FloatingToolTileProps {
  tool: HeroAllowedTool | string;
  index: number;
  depth?: number; // 4 à 16 px de parallaxe
  className?: string;
  floatingDuration?: number; // 3 à 5 s
  floatingOffset?: number; // ±8 à 12 px
}

export function FloatingToolTile({
  tool,
  index,
  depth = 10,
  className = "",
  floatingDuration,
  floatingOffset,
}: FloatingToolTileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);

  const [specular, setSpecular] = useState({ x: 50, y: 30, opacity: 0 });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (isReduced) {
      return;
    }

    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return;

    // 1. Entrée échelonnée en ressort (≤ 1.2s au total)
    gsap.fromTo(
      container,
      { scale: 0, opacity: 0, y: 30 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay: 0.15 + index * 0.12,
        ease: "back.out(1.6)",
      }
    );

    // 2. Flottement continu lent (±8 à 12 px, ±2°, cycles de 3 à 5s, phase aléatoire)
    const dur = floatingDuration || 3.2 + (index % 3) * 0.8; // 3.2s, 4.0s, 4.8s
    const yOff = floatingOffset || 8 + (index % 3) * 2; // 8px, 10px, 12px
    const rot = (index % 2 === 0 ? 1 : -1) * (1.5 + (index % 3) * 0.4);

    const floatTween = gsap.to(card, {
      y: `-=${yOff}`,
      rotation: `+=${rot}`,
      duration: dur,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: (index * 0.35) % 1.5,
    });

    // Pause de l'animation quand hors de l'écran pour préserver les performances
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => floatTween.resume(),
      onLeave: () => floatTween.pause(),
      onEnterBack: () => floatTween.resume(),
      onLeaveBack: () => floatTween.pause(),
    });

    // 3. Inclinaison de ±12° et parallaxe spéculaire au pointeur (souris précise uniquement)
    const handleMouseMove = (e: MouseEvent) => {
      if (!isFinePointer) return;

      const rect = card.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (
        clientX < rect.left - 40 ||
        clientX > rect.right + 40 ||
        clientY < rect.top - 40 ||
        clientY > rect.bottom + 40
      ) {
        return;
      }

      const relX = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      const tiltX = Math.max(-1, Math.min(1, relY)) * -12; // max ±12°
      const tiltY = Math.max(-1, Math.min(1, relX)) * 12;

      // Parallaxe de profondeur
      const shiftX = relX * depth;
      const shiftY = relY * depth;

      gsap.to(card, {
        rotationX: tiltX,
        rotationY: tiltY,
        x: shiftX,
        y: shiftY,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Reflet spéculaire
      const posX = ((clientX - rect.left) / rect.width) * 100;
      const posY = ((clientY - rect.top) / rect.height) * 100;
      setSpecular({ x: posX, y: posY, opacity: 0.75 });
    };

    const handleMouseLeave = () => {
      if (!isFinePointer) return;

      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.6)",
        overwrite: "auto",
      });
      setSpecular((prev) => ({ ...prev, opacity: 0 }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      floatTween.kill();
      trigger.kill();
      window.removeEventListener("mousemove", handleMouseMove);
      if (card) {
        card.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [depth, index, floatingDuration, floatingOffset]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none [perspective:1000px] will-change-transform ${className}`}
      aria-label={`Outil ${tool}`}
    >
      {/* Tuile 3D en relief avec transform-style: preserve-3d */}
      <div
        ref={cardRef}
        style={{
          transformStyle: "preserve-3d",
          boxShadow:
            "inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px 0 rgba(15, 23, 42, 0.08), 0 14px 28px -6px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(37, 99, 235, 0.08)",
        }}
        className="relative w-14 h-14 sm:w-[76px] sm:h-[76px] md:w-[84px] md:h-[84px] rounded-[18px] sm:rounded-[22px] md:rounded-[24px] bg-gradient-to-b from-white/95 via-white/88 to-slate-100/90 border border-white/95 flex items-center justify-center p-2 sm:p-3 cursor-pointer group transition-shadow duration-300 hover:shadow-[0_20px_35px_-8px_rgba(37,99,235,0.22),inset_0_1.5px_2px_rgba(255,255,255,1)]"
      >
        {/* Couche 2 : Reflet spéculaire dynamique suivant la position du pointeur */}
        <div
          className="absolute inset-0 rounded-[18px] sm:rounded-[22px] md:rounded-[24px] pointer-events-none transition-opacity duration-300"
          style={{
            opacity: specular.opacity,
            background: `radial-gradient(circle at ${specular.x}% ${specular.y}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 60%)`,
          }}
        />

        {/* Couche 3 : Logo centré avancé en Z avec sa propre ombre portée */}
        <div
          ref={logoWrapperRef}
          style={{
            transform: "translateZ(16px)",
            filter: "drop-shadow(0 4px 6px rgba(15, 23, 42, 0.16))",
          }}
          className="relative z-10 flex items-center justify-center w-full h-full transform-gpu transition-transform duration-300 group-hover:scale-108"
        >
          <ToolIconRenderer
            name={tool}
            className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300"
          />
        </div>

        {/* Info-bulle / Nom de l'outil discret au survol */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30">
          <span className="px-2.5 py-0.5 rounded-md bg-[#0F172A] text-white text-[10px] font-mono font-bold tracking-wide shadow-md whitespace-nowrap">
            {tool}
          </span>
        </div>
      </div>
    </div>
  );
}
