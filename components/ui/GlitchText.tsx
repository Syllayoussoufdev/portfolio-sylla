"use client";

import React, { useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchColor1?: string;
  glitchColor2?: string;
}

export function GlitchText({
  text,
  className = "",
  glitchColor1 = "#2563EB",
  glitchColor2 = "#F97316",
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  return (
    <span
      className={`relative inline-block cursor-default select-none font-bold transition-transform duration-200 ${className}`}
      onMouseEnter={() => setIsGlitching(true)}
      onMouseLeave={() => setIsGlitching(false)}
    >
      <span className="relative z-10">{text}</span>

      {/* Couche d'aberration chromatique 1 */}
      {isGlitching && (
        <>
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 -z-10 select-none opacity-80 translate-x-[2px] translate-y-[-1px] animate-pulse"
            style={{ color: glitchColor1, filter: "blur(0.5px)" }}
          >
            {text}
          </span>
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 -z-10 select-none opacity-80 translate-x-[-2px] translate-y-[1px]"
            style={{ color: glitchColor2, filter: "blur(0.5px)" }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}
