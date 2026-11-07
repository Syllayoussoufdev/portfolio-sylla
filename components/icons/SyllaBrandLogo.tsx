import React from "react";

export type SyllaLogoVariant =
  | "primary"
  | "monochrome"
  | "white"
  | "dark"
  | "squircle"
  | "circle"
  | "color";

interface SyllaBrandLogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: SyllaLogoVariant;
  className?: string;
}

// Les 4 pièces authentiques du monogramme officiel SYLLA YOUSSOUF (S + Y + i)
const P0 =
  "M 43 0 L 91 0 L 92 1 L 92 13 L 89 20 L 86 23 L 78 26 L 44 26 L 41 28 L 39 32 L 39 34 L 42 39 L 85 75 L 88 81 L 88 89 L 85 95 L 72 108 L 66 111 L 11 111 L 10 112 L 6 112 L 5 111 L 4 112 L 1 112 L 0 111 L 0 94 L 1 93 L 1 88 L 3 84 L 8 80 L 11 79 L 61 79 L 64 75 L 64 74 L 59 70 L 34 70 L 32 69 L 17 57 L 10 50 L 7 43 L 7 33 L 10 26 L 34 4 L 40 1 L 42 1 Z";
const P1 =
  "M 150 38 L 159 38 L 160 58 L 157 65 L 138 84 L 137 86 L 137 92 L 136 93 L 136 101 L 133 108 L 130 112 L 122 119 L 116 122 L 112 122 L 111 123 L 79 123 L 78 122 L 101 98 L 102 85 L 105 78 L 143 41 L 149 39 Z";
const P2 =
  "M 89 29 L 91 30 L 94 29 L 123 29 L 126 30 L 126 34 L 124 37 L 101 59 L 98 60 L 71 35 L 71 31 L 72 30 L 88 30 Z";
const P3 =
  "M 136 0 L 155 0 L 159 3 L 160 6 L 160 23 L 158 27 L 152 29 L 143 29 L 142 28 L 133 28 L 132 27 L 131 25 L 131 4 L 133 1 L 135 1 Z";

export function SyllaBrandLogo({
  variant = "monochrome",
  className = "w-8 h-8",
  ...props
}: SyllaBrandLogoProps) {
  // Submark Squircle Monochrome (Icône officielle d'application & Favicon)
  if (variant === "squircle") {
    return (
      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Sylla Youssouf Icon"
        {...props}
      >
        <rect width="512" height="512" rx="115" fill="#0F172A" />
        <rect
          width="508"
          height="508"
          x="2"
          y="2"
          rx="113"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.1"
          strokeWidth="2"
        />
        <g transform="translate(81, 123) scale(2.174)">
          <path d={P0} fill="#FFFFFF" />
          <path d={P1} fill="#FFFFFF" />
          <path d={P2} fill="#FFFFFF" />
          <path d={P3} fill="#FFFFFF" />
        </g>
      </svg>
    );
  }

  // Submark Circle Monochrome
  if (variant === "circle") {
    return (
      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Sylla Youssouf Icon"
        {...props}
      >
        <circle cx="256" cy="256" r="256" fill="#0F172A" />
        <circle
          cx="256"
          cy="256"
          r="254"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.1"
          strokeWidth="2"
        />
        <g transform="translate(81, 123) scale(2.174)">
          <path d={P0} fill="#FFFFFF" />
          <path d={P1} fill="#FFFFFF" />
          <path d={P2} fill="#FFFFFF" />
          <path d={P3} fill="#FFFFFF" />
        </g>
      </svg>
    );
  }

  // Variante Couleur si nécessaire
  if (variant === "color") {
    return (
      <svg
        viewBox="0 0 161 124"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Sylla Youssouf Logo Color"
        {...props}
      >
        <path d={P0} fill="#0022CC" />
        <path d={P1} fill="#0099FF" />
        <path d={P2} fill="#0022CC" />
        <path d={P3} fill="#FF8000" />
      </svg>
    );
  }

  // Monogramme Monochrome (défaut : currentColor ou blanc/anthracite selon la variante)
  const isWhite = variant === "white";
  const isDark = variant === "dark";
  const fillColor = isWhite ? "#FFFFFF" : isDark ? "#0F172A" : "currentColor";

  return (
    <svg
      viewBox="0 0 161 124"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sylla Youssouf Logo"
      {...props}
    >
      <path d={P0} fill={fillColor} />
      <path d={P1} fill={fillColor} />
      <path d={P2} fill={fillColor} />
      <path d={P3} fill={fillColor} />
    </svg>
  );
}
