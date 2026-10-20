import React from "react";

// ==========================================
// 1. ICÔNES 3D POUR LES 3 PILIERS SERVICES / À PROPOS
// ==========================================

export function Icon3DVisualIdentity({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="palette-wood" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9F43" />
          <stop offset="1" stopColor="#EE5253" />
        </linearGradient>
        <linearGradient id="brush-handle" x1="30" y1="10" x2="60" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#54A0FF" />
          <stop offset="1" stopColor="#2E86DE" />
        </linearGradient>
      </defs>
      {/* Palette Corps */}
      <path
        d="M32 8C18.7 8 8 18.7 8 32c0 10.6 6.9 19.6 16.5 22.8 2.2.7 4.5-1.1 4.5-3.4 0-1.8-.7-3.5-.7-5.4 0-4.4 3.6-8 8-8h3.2c7.5 0 13.5-6 13.5-13.5C53 15.6 43.6 8 32 8z"
        fill="url(#palette-wood)"
      />
      <circle cx="20" cy="24" r="4.5" fill="#FECA57" />
      <circle cx="32" cy="19" r="4.5" fill="#48DBFB" />
      <circle cx="43" cy="26" r="4.5" fill="#1DD1A1" />
      <circle cx="24" cy="38" r="4" fill="#FF6B6B" />
      {/* Pinceau inclinée en Z */}
      <path
        d="M56 12l-18 18 4 4 18-18c1.3-1.3 1.3-3.4 0-4.7l-1.3-1.3c-1.3-1.3-3.4-1.3-4.7 0z"
        fill="url(#brush-handle)"
        filter="drop-shadow(0 2px 3px rgba(0,0,0,0.2))"
      />
      <path d="M38 30l-4 6 6-4-2-2z" fill="#FECA57" />
    </svg>
  );
}

export function Icon3DContentStrategy({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rocket-grad" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A55EEA" />
          <stop offset="1" stopColor="#4B7BEC" />
        </linearGradient>
        <linearGradient id="fire-grad" x1="18" y1="46" x2="28" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FED330" />
          <stop offset="1" stopColor="#FA8231" />
        </linearGradient>
      </defs>
      {/* Flamme de propulsion */}
      <path d="M22 42l-4 12 12-4-8-8z" fill="url(#fire-grad)" />
      {/* Ailerons */}
      <path d="M20 32l-8 8 10 4 2-8-4-4z" fill="#45AAF2" />
      <path d="M32 20l8-8 4 10-8 2-4-4z" fill="#45AAF2" />
      {/* Corps Fusée */}
      <path
        d="M44 12c-7.2 0-18 8-22 18l12 12c10-4 18-14.8 18-22 0-4.4-3.6-8-8-8z"
        fill="url(#rocket-grad)"
      />
      {/* Hublot miroir */}
      <circle cx="38" cy="26" r="4.5" fill="#FFFFFF" fillOpacity="0.9" />
      <circle cx="38" cy="26" r="3" fill="#2D98DA" />
      {/* Étoiles étincelantes */}
      <path d="M14 18l1.5 3.5L19 23l-3.5 1.5L14 28l-1.5-3.5L9 23l3.5-1.5L14 18z" fill="#FED330" />
      <path d="M50 44l1 2.5L53.5 47.5 51 48.5 50 51l-1-2.5-2.5-1 2.5-1L50 44z" fill="#26DE81" />
    </svg>
  );
}

export function Icon3DWebDev({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="screen-grad" x1="8" y1="12" x2="56" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      {/* Moniteur 3D */}
      <rect x="8" y="10" width="48" height="34" rx="8" fill="url(#screen-grad)" />
      <rect x="12" y="14" width="40" height="26" rx="4" fill="#0F172A" />
      {/* Base du support */}
      <path d="M26 44h12l2 8H24l2-8z" fill="#64748B" />
      <rect x="20" y="52" width="24" height="4" rx="2" fill="#334155" />
      {/* Code Chevrons & Slash */}
      <path d="M22 23l-4 4 4 4" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 33l4-12" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 23l4 4-4 4" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ==========================================
// 2. ICÔNES 3D POUR LES CATÉGORIES DE COMPÉTENCES
// ==========================================

export function Icon3DWebFrontendCategory({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fe-grad" x1="8" y1="10" x2="56" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <rect x="8" y="12" width="48" height="38" rx="8" fill="url(#fe-grad)" />
      <rect x="12" y="20" width="40" height="26" rx="4" fill="#F8FAFC" />
      <circle cx="16" cy="16" r="1.5" fill="#EF4444" />
      <circle cx="21" cy="16" r="1.5" fill="#F59E0B" />
      <circle cx="26" cy="16" r="1.5" fill="#10B981" />
      <path d="M24 28l-5 5 5 5M40 28l5 5-5 5M34 26l-4 14" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Icon3DBackendCategory({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="be-grad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
      </defs>
      {/* 3 Baies Serveurs empilées en 3D */}
      <rect x="10" y="10" width="44" height="12" rx="4" fill="url(#be-grad)" />
      <circle cx="16" cy="16" r="2" fill="#6EE7B7" />
      <line x1="22" y1="16" x2="48" y2="16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />

      <rect x="10" y="26" width="44" height="12" rx="4" fill="url(#be-grad)" />
      <circle cx="16" cy="32" r="2" fill="#6EE7B7" />
      <line x1="22" y1="32" x2="48" y2="32" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />

      <rect x="10" y="42" width="44" height="12" rx="4" fill="url(#be-grad)" />
      <circle cx="16" cy="48" r="2" fill="#6EE7B7" />
      <line x1="22" y1="48" x2="48" y2="48" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
    </svg>
  );
}

export function Icon3DMobileCategory({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mob-grad" x1="16" y1="8" x2="48" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      <rect x="18" y="8" width="28" height="48" rx="7" fill="url(#mob-grad)" />
      <rect x="21" y="14" width="22" height="34" rx="4" fill="#0F172A" />
      <circle cx="32" cy="51" r="2" fill="#FFFFFF" fillOpacity="0.8" />
      <rect x="28" y="10" width="8" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.6" />
      {/* Symbole application mobile */}
      <circle cx="32" cy="31" r="6" fill="#A78BFA" />
      <circle cx="32" cy="31" r="3" fill="#FFFFFF" />
    </svg>
  );
}

export function Icon3DDesignCategory({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="des-grad" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316" />
          <stop offset="1" stopColor="#C2410C" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="44" height="44" rx="12" fill="url(#des-grad)" />
      <circle cx="24" cy="24" r="5" fill="#FEF08A" />
      <circle cx="40" cy="24" r="5" fill="#67E8F9" />
      <circle cx="24" cy="40" r="5" fill="#F472B6" />
      <circle cx="40" cy="40" r="5" fill="#BBF7D0" />
      <path d="M28 28l8 8" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Icon3DVideoCategory({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vid-grad" x1="8" y1="12" x2="56" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EC4899" />
          <stop offset="1" stopColor="#BE185D" />
        </linearGradient>
      </defs>
      {/* Clap cinéma 3D */}
      <rect x="8" y="24" width="48" height="30" rx="6" fill="url(#vid-grad)" />
      {/* Haut du clap articulé */}
      <path d="M8 12h48v10H8V12z" fill="#0F172A" />
      <path d="M14 12l6 10h-6l-6-10h6zm14 0l6 10h-6l-6-10h6zm14 0l6 10h-6l-6-10h6z" fill="#FFFFFF" />
      {/* Triangle lecture vidéo */}
      <path d="M28 34l12 6-12 6v-12z" fill="#FFFFFF" />
    </svg>
  );
}

// ==========================================
// 3. ICÔNES 3D POUR LA SECTION PARCOURS (TIMELINE)
// ==========================================

export function Icon3DAIFormation({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#0D9488" />
      <circle cx="24" cy="24" r="8" fill="#5EEAD4" />
      <circle cx="24" cy="24" r="4" fill="#042F2E" />
      <path d="M24 8v6M24 34v6M8 24h6M34 24h6M12 12l4 4M32 32l4 4M12 36l4-4M32 16l4-4" stroke="#CCFBF1" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Icon3DUniversityDegree({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#4F46E5" />
      <path d="M24 12l16 8-16 8-16-8 16-8z" fill="#C7D2FE" />
      <path d="M14 24v8c0 4 4.5 7 10 7s10-3 10-7v-8l-10 5-10-5z" fill="#818CF8" />
      <circle cx="40" cy="22" r="2" fill="#FCD34D" />
      <path d="M40 24v7" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Icon3DSoftwareEngineer({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#2563EB" />
      <rect x="10" y="14" width="28" height="20" rx="3" fill="#0F172A" />
      <path d="M17 21l-3 3 3 3M31 21l3 3-3 3M26 19l-4 10" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 36h12" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Icon3DScientificBac({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#D97706" />
      {/* Livre ouvert & Laurier */}
      <path d="M12 18c4-2 9-2 12 1 3-3 8-3 12-1v16c-4-2-9-2-12 1-3-3-8-3-12-1V18z" fill="#FEF3C7" />
      <path d="M24 19v17" stroke="#D97706" strokeWidth="2" />
      <circle cx="24" cy="14" r="3" fill="#FDE68A" />
    </svg>
  );
}

export function Icon3DExperiencePro({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#0284C7" />
      <rect x="11" y="18" width="26" height="18" rx="4" fill="#E0F2FE" />
      <path d="M19 18v-3a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v3" stroke="#BAE6FD" strokeWidth="2.5" />
      <path d="M11 25h26" stroke="#0284C7" strokeWidth="2" />
      <rect x="22" y="23" width="4" height="4" rx="1" fill="#0369A1" />
    </svg>
  );
}

export function Icon3DCertificationBadge({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#059669" />
      <circle cx="24" cy="22" r="10" fill="#FBBF24" />
      <path d="M21 22l2 2 4-4" stroke="#78350F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 31l-3 7 8-3 8 3-3-7" fill="#F59E0B" />
    </svg>
  );
}
