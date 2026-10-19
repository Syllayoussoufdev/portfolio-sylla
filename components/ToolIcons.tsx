import React from "react";

export interface ToolItem {
  id: string;
  name: string;
  category: "editing" | "motion" | "design" | "ai" | "audio" | "collab";
  icon: React.ReactNode;
}

export function ToolSquircle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#0D1117] border border-white/10 flex items-center justify-center p-3 sm:p-4 shadow-lg hover:border-[#FF2A14]/70 hover:shadow-red-950/30 hover:scale-105 active:scale-95 transition-all duration-300 group shrink-0 ${className}`}
    >
      {children}
    </div>
  );
}

// 1. Premiere Pro (Pr)
export function PremiereProIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#00005B" />
      <text
        x="12"
        y="42"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize="30"
        fill="#9999FF"
      >
        Pr
      </text>
    </svg>
  );
}

// 2. After Effects (Ae)
export function AfterEffectsIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#00005B" />
      <text
        x="13"
        y="42"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize="30"
        fill="#D291FF"
      >
        Ae
      </text>
    </svg>
  );
}

// 3. DaVinci Resolve
export function DaVinciResolveIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#141416" />
      <path d="M32 10L42 26H22L32 10Z" fill="#E53935" />
      <path d="M52 38L38 48L32 30L52 38Z" fill="#FDD835" />
      <path d="M12 38L32 30L26 48L12 38Z" fill="#1E88E5" />
      <circle cx="32" cy="34" r="5" fill="#43A047" />
    </svg>
  );
}

// 4. Figma
export function FigmaLogoIcon() {
  return (
    <svg viewBox="0 0 38 57" className="w-6 h-9 sm:w-7 sm:h-10" fill="none">
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </svg>
  );
}

// 5. Blender
export function BlenderIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#1E1E24" />
      <circle cx="32" cy="36" r="14" fill="#EA7600" />
      <circle cx="32" cy="36" r="7" fill="#22578E" />
      <circle cx="32" cy="36" r="3.5" fill="#FFFFFF" />
      <path d="M18 20L28 30M32 14V26M46 20L36 30" stroke="#EA7600" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// 6. Photoshop (Ps)
export function PhotoshopIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#001E36" />
      <text
        x="12"
        y="42"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize="30"
        fill="#31A8FF"
      >
        Ps
      </text>
    </svg>
  );
}

// 7. Illustrator (Ai)
export function IllustratorIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#330000" />
      <text
        x="14"
        y="42"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize="30"
        fill="#FF9A00"
      >
        Ai
      </text>
    </svg>
  );
}

// 8. Audition (Au)
export function AuditionIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#002422" />
      <text
        x="12"
        y="42"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize="30"
        fill="#00E5D2"
      >
        Au
      </text>
    </svg>
  );
}

// 9. CapCut
export function CapCutIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#111114" />
      <path
        d="M20 20L44 44M44 20L20 44"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="3" fill="#FF2A14" />
    </svg>
  );
}

// 10. Cinema 4D
export function Cinema4DIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#00102B" />
      <circle cx="32" cy="32" r="16" stroke="#0070FF" strokeWidth="4" />
      <circle cx="32" cy="32" r="8" fill="#00D2FF" />
    </svg>
  );
}

// 11. Final Cut Pro
export function FinalCutIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#1B1C22" />
      <path d="M16 22H48V42H16Z" fill="#2E303B" />
      <path d="M16 22L24 16H32L24 22H16Z" fill="#00D2FF" />
      <path d="M32 22L40 16H48L40 22H32Z" fill="#FF3B30" />
      <path d="M22 28L42 32L34 38Z" fill="#FFD60A" />
    </svg>
  );
}

// 12. Claude / Anthropic
export function ClaudeIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#1C1814" />
      <path
        d="M32 14L35 28L48 24L38 34L48 44L35 40L32 54L29 40L16 44L26 34L16 24L29 28L32 14Z"
        fill="#D97757"
      />
    </svg>
  );
}

// 13. ChatGPT / OpenAI
export function OpenAIIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#0D1117" />
      <path
        d="M32 16a6 6 0 0 1 5.8 4.2l.6 2 2-.5A6 6 0 0 1 48 26v4.6l3.5 2a6 6 0 0 1 2.3 8.1 6 6 0 0 1-5.3 3.3H46l-2 3.5A6 6 0 0 1 36 51h-8a6 6 0 0 1-5.8-4.2l-.6-2-2 .5A6 6 0 0 1 12 41v-4.6l-3.5-2a6 6 0 0 1-2.3-8.1 6 6 0 0 1 5.3-3.3H14l2-3.5A6 6 0 0 1 24 16h8z"
        stroke="#10A37F"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 14. Midjourney
export function MidjourneyIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#0E1322" />
      <path
        d="M20 44C26 46 38 46 44 44M22 41L32 20L42 41M32 20V43"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="32" cy="18" r="2.5" fill="#5865F2" />
    </svg>
  );
}

// 15. Runway ML
export function RunwayIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#111116" />
      <text
        x="13"
        y="42"
        fontFamily="sans-serif"
        fontWeight="black"
        fontSize="30"
        fill="#00F0FF"
      >
        R:
      </text>
    </svg>
  );
}

// 16. Canva
export function CanvaTileIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#00C4CC" />
      <path
        d="M38 38c-2 2-5 3-7 3-6 0-10-4-10-10s4-10 10-10c3 0 5 1 7 3l-3 3c-1-1-2-2-4-2-3 0-6 3-6 6s3 6 6 6c2 0 3-1 4-2l3 3z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// 17. Google Gemini / Copilot AI Spark
export function GeminiSparkIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#0F1424" />
      <path
        d="M32 12C32 23 23 32 12 32C23 32 32 41 32 52C32 41 41 32 52 32C41 32 32 23 32 12Z"
        fill="url(#geminiGrad)"
      />
      <defs>
        <linearGradient id="geminiGrad" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4E82EE" />
          <stop offset="0.5" stopColor="#9B72CB" />
          <stop offset="1" stopColor="#D96570" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 18. Sound / Audio Waveform
export function SoundWaveIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#1A0D15" />
      <path
        d="M16 32V32M22 24V40M28 16V48M34 20V44M40 14V50M46 26V38"
        stroke="#FF2A14"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 19. Slack
export function SlackIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#1E1020" />
      <path d="M22 28h6v-6a3 3 0 1 0-6 0v6z" fill="#E01E5A" />
      <path d="M30 28h6v-6a3 3 0 1 0-6 0v6z" fill="#2EB67D" />
      <path d="M22 36h6v6a3 3 0 1 0-6 0v-6z" fill="#ECB22E" />
      <path d="M36 36h-6v6a3 3 0 1 0 6 0v-6z" fill="#36C5F0" />
    </svg>
  );
}

// 20. Notion
export function NotionIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <rect width="64" height="64" rx="14" fill="#191919" />
      <path
        d="M20 20L28 44L36 20L44 44"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Liste complète rangée 1 (Outils Vidéo & Motion Studio)
export const TOOLS_ROW_1: ToolItem[] = [
  { id: "pr", name: "Premiere Pro", category: "editing", icon: <PremiereProIcon /> },
  { id: "ae", name: "After Effects", category: "motion", icon: <AfterEffectsIcon /> },
  { id: "davinci", name: "DaVinci Resolve", category: "editing", icon: <DaVinciResolveIcon /> },
  { id: "blender", name: "Blender 3D", category: "motion", icon: <BlenderIcon /> },
  { id: "figma", name: "Figma", category: "design", icon: <FigmaLogoIcon /> },
  { id: "c4d", name: "Cinema 4D", category: "motion", icon: <Cinema4DIcon /> },
  { id: "ps", name: "Photoshop", category: "design", icon: <PhotoshopIcon /> },
  { id: "ai", name: "Illustrator", category: "design", icon: <IllustratorIcon /> },
  { id: "fcpx", name: "Final Cut Pro", category: "editing", icon: <FinalCutIcon /> },
  { id: "au", name: "Adobe Audition", category: "audio", icon: <AuditionIcon /> },
];

// Liste complète rangée 2 (IA Générative, Workflow & Motion)
export const TOOLS_ROW_2: ToolItem[] = [
  { id: "gemini", name: "Google Gemini", category: "ai", icon: <GeminiSparkIcon /> },
  { id: "claude", name: "Claude AI", category: "ai", icon: <ClaudeIcon /> },
  { id: "openai", name: "ChatGPT 4o", category: "ai", icon: <OpenAIIcon /> },
  { id: "midjourney", name: "Midjourney", category: "ai", icon: <MidjourneyIcon /> },
  { id: "runway", name: "Runway Gen-3", category: "ai", icon: <RunwayIcon /> },
  { id: "capcut", name: "CapCut Pro", category: "editing", icon: <CapCutIcon /> },
  { id: "audio", name: "Sound Design SFX", category: "audio", icon: <SoundWaveIcon /> },
  { id: "canva", name: "Canva Pro", category: "design", icon: <CanvaTileIcon /> },
  { id: "notion", name: "Notion Workflow", category: "collab", icon: <NotionIcon /> },
  { id: "slack", name: "Slack Collab", category: "collab", icon: <SlackIcon /> },
];
