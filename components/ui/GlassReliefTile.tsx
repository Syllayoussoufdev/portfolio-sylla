"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

interface GlassReliefTileProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  glowColor?: string;
  bevelLight?: boolean;
}

const SIZE_CLASSES = {
  sm: "w-10 h-10 rounded-xl",
  md: "w-12 h-12 rounded-2xl",
  lg: "w-14 h-14 rounded-2xl",
  xl: "w-16 h-16 rounded-3xl",
};

export function GlassReliefTile({
  children,
  size = "md",
  className = "",
  glowColor = "rgba(37, 99, 235, 0.15)",
  bevelLight = true,
}: GlassReliefTileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [specular, setSpecular] = useState({ x: 50, y: 30, opacity: 0 });

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (isReduced || !isFinePointer) return;

    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      if (
        e.clientX < rect.left - 20 ||
        e.clientX > rect.right + 20 ||
        e.clientY < rect.top - 20 ||
        e.clientY > rect.bottom + 20
      ) {
        return;
      }

      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotationY: relX * 16,
        rotationX: -relY * 16,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });

      const posX = ((e.clientX - rect.left) / rect.width) * 100;
      const posY = ((e.clientY - rect.top) / rect.height) * 100;
      setSpecular({ x: posX, y: posY, opacity: 0.8 });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.6)",
        overwrite: "auto",
      });
      setSpecular((prev) => ({ ...prev, opacity: 0 }));
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative select-none [perspective:800px] shrink-0 ${className}`}
    >
      <div
        ref={cardRef}
        style={{
          transformStyle: "preserve-3d",
          boxShadow: bevelLight
            ? `inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px 0 rgba(15, 23, 42, 0.08), 0 8px 20px -4px ${glowColor}, 0 2px 6px -1px rgba(15, 23, 42, 0.06)`
            : undefined,
        }}
        className={`relative ${SIZE_CLASSES[size]} bg-gradient-to-b from-white/95 via-white/90 to-slate-100/90 border border-white/95 flex items-center justify-center p-2.5 transition-shadow duration-300 group-hover:shadow-lg`}
      >
        {/* Reflet spéculaire dynamique */}
        <div
          className={`absolute inset-0 ${SIZE_CLASSES[size]} pointer-events-none transition-opacity duration-300`}
          style={{
            opacity: specular.opacity,
            background: `radial-gradient(circle at ${specular.x}% ${specular.y}%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 65%)`,
          }}
        />

        {/* Contenu iconographique décollé en relief */}
        <div
          style={{
            transform: "translateZ(10px)",
            filter: "drop-shadow(0 2px 4px rgba(15, 23, 42, 0.12))",
          }}
          className="relative z-10 flex items-center justify-center w-full h-full transform-gpu transition-transform duration-300 group-hover:scale-110"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
