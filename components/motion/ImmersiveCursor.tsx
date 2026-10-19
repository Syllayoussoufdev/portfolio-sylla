"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function ImmersiveCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Désactivation stricte au tactile et en mouvement réduit (Contrat de mouvement immersif #6)
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || isReduced) return;

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Positionnement initial centré
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const xDotTo = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const yDotTo = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });
    const xRingTo = gsap.quickTo(ring, "x", { duration: 0.28, ease: "power3.out" });
    const yRingTo = gsap.quickTo(ring, "y", { duration: 0.28, ease: "power3.out" });

    let isVisible = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        isVisible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }

      xDotTo(e.clientX);
      yDotTo(e.clientY);
      xRingTo(e.clientX);
      yRingTo(e.clientY);

      // Détection de survol interactif
      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest(
        'a, button, [role="button"], input, textarea, select, .group, [data-cursor-expand]'
      );

      if (interactiveEl) {
        gsap.to(ring, {
          scale: 1.85,
          borderColor: "#FF2A14",
          backgroundColor: "rgba(255, 42, 20, 0.12)",
          duration: 0.25,
          overwrite: "auto",
        });
        gsap.to(dot, {
          scale: 0.6,
          duration: 0.2,
          overwrite: "auto",
        });
      } else {
        gsap.to(ring, {
          scale: 1,
          borderColor: "rgba(255, 42, 20, 0.45)",
          backgroundColor: "transparent",
          duration: 0.25,
          overwrite: "auto",
        });
        gsap.to(dot, {
          scale: 1,
          duration: 0.2,
          overwrite: "auto",
        });
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.25 });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none" aria-hidden="true">
      {/* Point central précis rouge vermillon */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FF2A14] pointer-events-none"
        style={{ willChange: "transform" }}
      />

      {/* Anneau extérieur fluide avec amortissement */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#FF2A14]/50 pointer-events-none transition-[border-color,background-color]"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
