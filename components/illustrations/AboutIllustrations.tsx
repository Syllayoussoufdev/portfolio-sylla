import React from "react";

/**
 * Illustration 1 : Identité visuelle, charte graphique & design system
 */
export function BrandIdentityIllustration({ className = "w-full h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brand-bg" x1="0" y1="0" x2="320" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF7ED" />
          <stop offset="1" stopColor="#FFEDD5" />
        </linearGradient>
        <linearGradient id="brand-card-grad" x1="0" y1="0" x2="100" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F8FAFC" />
        </linearGradient>
        <linearGradient id="brand-accent" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F97316" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
      </defs>

      {/* Fond carte avec motif grille subtil */}
      <rect width="320" height="100" rx="16" fill="url(#brand-bg)" />
      <circle cx="280" cy="20" r="40" fill="#FDBA74" fillOpacity="0.25" />

      {/* Carte Palette de Couleurs */}
      <g transform="translate(18, 14)">
        <rect width="84" height="72" rx="10" fill="url(#brand-card-grad)" stroke="#FED7AA" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(249, 115, 22, 0.08))" />
        <text x="10" y="20" fill="#9A3412" fontSize="9" fontWeight="700" fontFamily="sans-serif">PALETTE</text>
        <circle cx="22" cy="36" r="8" fill="#F97316" />
        <circle cx="42" cy="36" r="8" fill="#0EA5E9" />
        <circle cx="62" cy="36" r="8" fill="#8B5CF6" />
        <rect x="14" y="52" width="56" height="5" rx="2.5" fill="#FED7AA" />
        <rect x="14" y="60" width="36" height="4" rx="2" fill="#FFEDD5" />
      </g>

      {/* Carte Typographie & Logo */}
      <g transform="translate(114, 14)">
        <rect width="96" height="72" rx="10" fill="url(#brand-card-grad)" stroke="#FED7AA" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(249, 115, 22, 0.08))" />
        <text x="12" y="32" fill="#C2410C" fontSize="22" fontWeight="800" fontFamily="serif">Aa</text>
        <rect x="46" y="18" width="38" height="6" rx="3" fill="#FB923C" />
        <rect x="46" y="28" width="28" height="5" rx="2.5" fill="#FED7AA" />
        <line x1="12" y1="44" x2="84" y2="44" stroke="#FFEDD5" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="12" y="60" fill="#9A3412" fontSize="8" fontWeight="600" fontFamily="monospace">GRID 8PX</text>
      </g>

      {/* Badge Vecteur Plume / Précision */}
      <g transform="translate(222, 22)">
        <rect width="80" height="56" rx="10" fill="url(#brand-accent)" filter="drop-shadow(0 6px 12px rgba(249, 115, 22, 0.25))" />
        <path d="M236 40l6-10 10 6-6 10-10-6z" transform="translate(-214, -8)" fill="#FFFFFF" />
        <circle cx="28" cy="28" r="3" fill="#FEF08A" />
        <text x="44" y="26" fill="#FFFFFF" fontSize="9" fontWeight="800" fontFamily="sans-serif">100%</text>
        <text x="44" y="38" fill="#FED7AA" fontSize="8" fontWeight="600" fontFamily="sans-serif">VECTORIEL</text>
      </g>
    </svg>
  );
}

/**
 * Illustration 2 : Stratégie de contenu, visibilité & impact audience
 */
export function ContentStrategyIllustration({ className = "w-full h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="strat-bg" x1="0" y1="0" x2="320" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5F3FF" />
          <stop offset="1" stopColor="#EDE9FE" />
        </linearGradient>
        <linearGradient id="strat-card-grad" x1="0" y1="0" x2="100" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FAF5FF" />
        </linearGradient>
        <linearGradient id="curve-grad" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>

      {/* Fond carte */}
      <rect width="320" height="100" rx="16" fill="url(#strat-bg)" />
      <circle cx="290" cy="80" r="35" fill="#C4B5FD" fillOpacity="0.3" />

      {/* Courbe de croissance & Analytics */}
      <g transform="translate(18, 14)">
        <rect width="124" height="72" rx="10" fill="url(#strat-card-grad)" stroke="#DDD6FE" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(139, 92, 246, 0.08))" />
        <text x="12" y="22" fill="#6D28D9" fontSize="9" fontWeight="700" fontFamily="sans-serif">ENGAGEMENT</text>
        {/* Grille interne */}
        <line x1="12" y1="36" x2="112" y2="36" stroke="#EDE9FE" strokeWidth="1" />
        <line x1="12" y1="52" x2="112" y2="52" stroke="#EDE9FE" strokeWidth="1" />
        {/* Courbe ascendante */}
        <path d="M16 60 Q 40 55, 60 42 T 110 24" fill="none" stroke="url(#curve-grad)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="110" cy="24" r="4" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2" />
        <text x="12" y="66" fill="#7C3AED" fontSize="8" fontWeight="800" fontFamily="monospace">+240% PORTÉE</text>
      </g>

      {/* Carte Post Social & Visuel percutant */}
      <g transform="translate(154, 14)">
        <rect width="148" height="72" rx="10" fill="url(#strat-card-grad)" stroke="#DDD6FE" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(139, 92, 246, 0.08))" />
        <circle cx="26" cy="28" r="10" fill="#8B5CF6" />
        <path d="M22 28l3 3 5-5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="44" y="22" width="60" height="6" rx="3" fill="#6D28D9" />
        <rect x="44" y="32" width="40" height="4" rx="2" fill="#C4B5FD" />
        {/* Badges de formats */}
        <rect x="14" y="48" width="38" height="15" rx="5" fill="#EDE9FE" />
        <text x="20" y="59" fill="#6D28D9" fontSize="8" fontWeight="700" fontFamily="sans-serif">REELS</text>
        <rect x="56" y="48" width="40" height="15" rx="5" fill="#FCE7F3" />
        <text x="61" y="59" fill="#BE185D" fontSize="8" fontWeight="700" fontFamily="sans-serif">CARROUSEL</text>
        <rect x="100" y="48" width="36" height="15" rx="5" fill="#E0F2FE" />
        <text x="106" y="59" fill="#0369A1" fontSize="8" fontWeight="700" fontFamily="sans-serif">POST</text>
      </g>
    </svg>
  );
}

/**
 * Illustration 3 : Conception & Développement web moderne orienté conversion
 */
export function WebDevIllustration({ className = "w-full h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="web-bg" x1="0" y1="0" x2="320" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EFF6FF" />
          <stop offset="1" stopColor="#DBEAFE" />
        </linearGradient>
        <linearGradient id="browser-header" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#1E293B" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="cta-btn" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* Fond carte */}
      <rect width="320" height="100" rx="16" fill="url(#web-bg)" />
      <circle cx="280" cy="20" r="45" fill="#93C5FD" fillOpacity="0.25" />

      {/* Mockup Navigateur Web */}
      <g transform="translate(18, 12)">
        <rect width="180" height="76" rx="8" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="1" filter="drop-shadow(0 4px 8px rgba(37, 99, 235, 0.1))" />
        {/* Barre navigateur */}
        <path d="M0 8a8 8 0 0 1 8-8h164a8 8 0 0 1 8 8v12H0V8z" fill="url(#browser-header)" />
        <circle cx="10" cy="10" r="2.5" fill="#EF4444" />
        <circle cx="18" cy="10" r="2.5" fill="#F59E0B" />
        <circle cx="26" cy="10" r="2.5" fill="#10B981" />
        <rect x="42" y="6" width="96" height="8" rx="4" fill="#334155" />
        {/* Contenu page */}
        <rect x="12" y="28" width="70" height="8" rx="3" fill="#1E293B" />
        <rect x="12" y="40" width="100" height="4" rx="2" fill="#94A3B8" />
        <rect x="12" y="48" width="80" height="4" rx="2" fill="#CBD5E1" />
        {/* Bouton CTA conversion */}
        <rect x="12" y="58" width="48" height="12" rx="4" fill="url(#cta-btn)" />
        <text x="18" y="67" fill="#FFFFFF" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">CONVERTIR</text>
        {/* Mini Aperçu Image */}
        <rect x="124" y="28" width="44" height="42" rx="4" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
        <circle cx="146" cy="44" r="8" fill="#60A5FA" fillOpacity="0.4" />
        <path d="M132 62l8-8 6 6 12-12 10 14h-36z" fill="#93C5FD" />
      </g>

      {/* Badge Vitesse / Performance 100/100 */}
      <g transform="translate(210, 16)">
        <rect width="92" height="68" rx="10" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(37, 99, 235, 0.08))" />
        <text x="12" y="20" fill="#1E40AF" fontSize="8" fontWeight="800" fontFamily="sans-serif">SCORE LIGHTHOUSE</text>
        <circle cx="26" cy="42" r="14" fill="#ECFDF5" stroke="#10B981" strokeWidth="2.5" />
        <text x="18" y="46" fill="#047857" fontSize="11" fontWeight="800" fontFamily="sans-serif">99</text>
        <text x="46" y="38" fill="#0F172A" fontSize="9" fontWeight="700" fontFamily="sans-serif">RAPIDE</text>
        <text x="46" y="48" fill="#64748B" fontSize="7.5" fontWeight="500" fontFamily="sans-serif">SEO &amp; Vitals</text>
        <rect x="46" y="54" width="36" height="4" rx="2" fill="#10B981" />
      </g>
    </svg>
  );
}
