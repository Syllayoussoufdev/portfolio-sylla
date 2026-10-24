"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type CursorMode = "default" | "invert" | "drag" | "dark";

export function DevCreativeCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mediaQuery.matches) return;
    setIsDesktop(true);

    const el = cursorRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.18, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.18, ease: "power3.out" });

    const onMouseMove = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const dragTarget = target.closest('[data-cursor="drag"]');
      if (dragTarget) {
        setMode("drag");
        return;
      }

      const darkTarget = target.closest('[data-cursor="dark"]');
      if (darkTarget) {
        setMode("dark");
        return;
      }

      const interactiveTarget = target.closest(
        'a, button, [role="button"], input, select, textarea, [data-cursor="invert"]'
      );
      if (interactiveTarget) {
        setMode("invert");
        return;
      }

      setMode("default");
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [visible]);

  if (!isDesktop) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-[width,height,background-color,opacity,transform] duration-200 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      } ${
        mode === "drag"
          ? "w-22 h-22 bg-[#E83F25] text-[#16121E] mix-blend-normal shadow-xl"
          : mode === "dark"
          ? "w-12 h-12 bg-[#111111] text-white mix-blend-normal shadow-lg"
          : mode === "invert"
          ? "w-12 h-12 bg-white mix-blend-difference"
          : "w-4 h-4 bg-white mix-blend-difference"
      }`}
    >
      {mode === "drag" && (
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#16121E] select-none">
          GLISSER
        </span>
      )}
    </div>
  );
}
