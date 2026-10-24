"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type CursorMode = "default" | "invert" | "drag" | "dark" | "cta";

export function DevCreativeCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    // Centrer le curseur sur ses coordonnées (x, y) via GSAP sans conflit CSS transform
    gsap.set(el, { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const xTo = gsap.quickTo(el, "x", { duration: 0.16, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.16, ease: "power3.out" });

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;

      document.documentElement.classList.add("devcreative-cursor-ready");
      setIsVisible(true);

      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('[data-cursor="drag"]')) {
        setMode("drag");
      } else if (target.closest('[data-cursor="cta"]')) {
        setMode("cta");
      } else if (target.closest('[data-cursor="dark"]')) {
        setMode("dark");
      } else if (
        target.closest(
          'a, button, [role="button"], input, select, textarea, [data-cursor="invert"]'
        )
      ) {
        setMode("invert");
      } else {
        setMode("default");
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.classList.remove("devcreative-cursor-ready");
    };
  }, []);

  // Dimensions et couleurs explicites en inline style pour éviter toute purge Tailwind v4
  const getCursorStyle = (): React.CSSProperties => {
    switch (mode) {
      case "drag":
        return {
          width: 92,
          height: 92,
          backgroundColor: "#E83F25",
          color: "#16121E",
          mixBlendMode: "normal",
          boxShadow: "0 14px 34px rgba(232, 63, 37, 0.4)",
        };
      case "cta":
        return {
          width: 92,
          height: 92,
          backgroundColor: "#16121E",
          color: "#FFFFFF",
          mixBlendMode: "normal",
          boxShadow: "0 14px 34px rgba(22, 18, 30, 0.45)",
        };
      case "dark":
        return {
          width: 56,
          height: 56,
          backgroundColor: "#111111",
          color: "#FFFFFF",
          mixBlendMode: "normal",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
        };
      case "invert":
        return {
          width: 52,
          height: 52,
          backgroundColor: "#FFFFFF",
          mixBlendMode: "difference",
        };
      default:
        return {
          width: 14,
          height: 14,
          backgroundColor: "#16121E",
          mixBlendMode: "normal",
        };
    }
  };

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        ...getCursorStyle(),
        opacity: isVisible ? 1 : 0,
        transition:
          "width 0.22s cubic-bezier(0.16,1,0.3,1), height 0.22s cubic-bezier(0.16,1,0.3,1), background-color 0.2s ease, opacity 0.15s ease",
      }}
      className="fixed top-0 left-0 z-[99999] pointer-events-none rounded-full flex items-center justify-center select-none"
    >
      {mode === "drag" && (
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#16121E]">
          GLISSER
        </span>
      )}
      {mode === "cta" && (
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white">
          LANCER ↗
        </span>
      )}
      {mode === "dark" && (
        <span className="text-xs font-bold text-white">↗</span>
      )}
    </div>
  );
}
