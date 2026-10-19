"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  maxDistance?: number; // max 8px selon DESIGN.md section 6
}

export function MagneticButton({
  children,
  className = "",
  maxDistance = 8,
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respecter prefers-reduced-motion et écrans tactiles
    const isTouch = window.matchMedia("(hover: none)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || isReduced) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Limiter à maxDistance (<= 8px)
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (dist === 0) return;

      const factor = Math.min(dist / 60, 1);
      const clampedX = (deltaX / dist) * maxDistance * factor;
      const clampedY = (deltaY / dist) * maxDistance * factor;

      xTo(clampedX);
      yTo(clampedY);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      gsap.killTweensOf(el);
    };
  }, [maxDistance]);

  return (
    <div ref={containerRef} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}
