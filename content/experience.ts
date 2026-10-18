export interface ExperienceMilestone {
  id: string;
  periode: string;
  role: string;
  contexte: string;
  description: string;
  current?: boolean;
}

export const EXPERIENCES: ExperienceMilestone[] = [
  {
    id: "exp-1",
    periode: "2025 — Aujourd'hui",
    role: "Expert Communication Digitale & Développeur Web",
    contexte: "Création indépendante & Projets digitaux",
    description:
      "Allier direction artistique, identités de marque engageantes et développement d'applications web modernes et performantes.",
    current: true,
  },
  {
    id: "exp-2",
    periode: "2024 — 2025",
    role: "Concepteur Développeur Fullstack",
    contexte: "Écosystèmes applicatifs & SaaS",
    description:
      "Architecture logicielle, conception de backends fiables (Laravel, Node.js) et interfaces dynamiques ultra-réactives (React, Next.js).",
    current: false,
  },
  {
    id: "exp-3",
    periode: "2023 — 2024",
    role: "Designer Graphique & Création de Contenu",
    contexte: "Identités visuelles & Médias",
    description:
      "Création de chartes graphiques, maquettage UI/UX sous Figma, montages vidéo et production de supports multimédias.",
    current: false,
  },
];
