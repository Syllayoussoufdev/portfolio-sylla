export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  iconName: "Code" | "Server" | "Smartphone" | "Palette" | "Terminal";
  skills: string[];
}

export const MASTER_SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "frontend",
    title: "Développement Frontend",
    description: "Interfaces web rapides, accessibles et réactives.",
    iconName: "Code",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5 / CSS3", "State Management"],
  },
  {
    id: "backend",
    title: "Backend & Architectures API",
    description: "Logique serveur robuste, bases relationnelles et sécurité.",
    iconName: "Server",
    skills: ["Laravel", "Node.js", "PostgreSQL", "Prisma ORM", "REST API", "Auth / JWT"],
  },
  {
    id: "mobile",
    title: "Mobile & Multiplateforme",
    description: "Applications mobiles fluides et expériences cross-platform.",
    iconName: "Smartphone",
    skills: ["React Native", "Flutter", "PWA", "Responsive Web Design", "Optimisation tactile"],
  },
  {
    id: "creative",
    title: "UI/UX & Outils Créatifs",
    description: "Prototypage interactif, design systems et médias.",
    iconName: "Palette",
    skills: ["Figma", "Design System", "Canva", "Montage Vidéo", "UI Motion", "Direction Artistique"],
  },
  {
    id: "devops",
    title: "DevOps & Infrastructure",
    description: "Conteneurisation, automatisation et environnements de déploiement.",
    iconName: "Terminal",
    skills: ["Docker", "Git / GitHub", "CI/CD", "Linux", "Vercel / Neon", "Postman"],
  },
];
