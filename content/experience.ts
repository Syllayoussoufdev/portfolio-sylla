export type MilestoneType = "experience" | "formation" | "certification";

export interface ExperienceMilestone {
  id: string;
  type: MilestoneType;
  periode: string;
  role: string;
  contexte: string;
  description: string;
  current?: boolean;
  modules?: string[];
  badge?: string;
}

/**
 * Parcours chronologique complet unifié (du plus récent au plus ancien)
 * Intègre les formations académiques, stages de validation et expériences professionnelles.
 */
export const PARCOURS_CHRONOLOGIQUE: ExperienceMilestone[] = [
  {
    id: "exp-freelance",
    type: "experience",
    periode: "Depuis janvier 2026",
    role: "Développeur Web Full Stack & Créatif Digital",
    contexte: "Service de Freelance Web (Temps partiel)",
    badge: "En poste",
    description:
      "Conception, réalisation et publication de solutions numériques et sites web pour particuliers et professionnels. Développement d'architectures modernes avec Laravel, React.js et Next.js. Prise en main de Docker pour les environnements de conteneurisation et déploiement.",
    current: true,
  },
  {
    id: "form-simplon",
    type: "formation",
    periode: "2025 — 2026",
    role: "Formation « Pratique IA Product Creator »",
    contexte: "Simplon CI",
    badge: "Spécialisation IA & Création",
    description:
      "Programme intensif axé sur la création de produits numériques propulsés par l'IA et la maîtrise de la chaîne créative multimédia. Réalisation de trois projets majeurs d'entreprise.",
    modules: [
      "Branding & Identité visuelle",
      "Design graphique & Illustration",
      "Montage vidéo & Motion",
      "Stratégie de communication",
      "Produits IA & Prompts avancés",
      "Maquettes Figma UI/UX",
      "Développement web moderne",
    ],
    current: false,
  },
  {
    id: "exp-muscop",
    type: "experience",
    periode: "Mars 2025 — Mars 2026",
    role: "Assistant Technique & Déploiement ERP",
    contexte: "MUSCOP-CI (Mutuelle du Corps Préfectoral de Côte d'Ivoire)",
    badge: "Mission Nationale (1 an)",
    description:
      "Déploiement opérationnel d'un ERP web d'assurance santé dans les centres médicaux conventionnés sur le territoire ivoirien. Formation pratique des utilisateurs et accompagnement technique de la plateforme.",
    current: false,
  },
  {
    id: "form-licence",
    type: "formation",
    periode: "2024 — 2025",
    role: "Licence Professionnelle Développeur Web",
    contexte: "PIGIER CI",
    badge: "Diplôme Supérieur (Bac+3)",
    description:
      "Approfondissement du génie logiciel, de l'ingénierie web avancée, des architectures applicatives full stack et de la gestion de projets informatiques.",
    current: false,
  },
  {
    id: "exp-stratos",
    type: "experience",
    periode: "Juillet — Décembre 2024",
    role: "Développeur Full Stack Junior",
    contexte: "Stratos-conseil",
    badge: "Stage de validation (6 mois)",
    description:
      "Stage de validation de diplôme. Participation au développement de deux applications web en architecture MVC (Symfony, Laravel) avec interfaces responsives sous Vue.js. Suivi de projet, correction de bugs, documentation et bonnes pratiques Git/GitHub.",
    current: false,
  },
  {
    id: "form-bts",
    type: "formation",
    periode: "2021 — 2023",
    role: "BTS Informatique, option Développeur d'Application (IDA)",
    contexte: "ISFMI, Abidjan (Plateau)",
    badge: "Diplôme d'État (Bac+2)",
    description:
      "Apprentissage approfondi des bases du développement logiciel : algorithmique, programmation orientée objet, modélisation de bases de données relationnelles (Merise/UML) et conception d'applications de gestion.",
    current: false,
  },
  {
    id: "form-bac",
    type: "formation",
    periode: "2020 — 2021",
    role: "Baccalauréat Série D",
    contexte: "Lycée Municipal 2 de Koumassi",
    badge: "Diplôme d'État",
    description:
      "Formation scientifique générale : rigueur analytique, mathématiques, sciences physiques et de la vie.",
    current: false,
  },
];

/**
 * Rétro-compatibilité : export de EXPERIENCES utilisé par d'anciens composants
 */
export const EXPERIENCES: ExperienceMilestone[] = PARCOURS_CHRONOLOGIQUE.filter(
  (m) => m.type === "experience"
);

/**
 * Formations et Diplômes uniquement
 */
export const FORMATIONS: ExperienceMilestone[] = PARCOURS_CHRONOLOGIQUE.filter(
  (m) => m.type === "formation"
);

/**
 * Certifications obtenues (dates à confirmer)
 */
export const CERTIFICATIONS: ExperienceMilestone[] = [
  {
    id: "cert-marketing-digital",
    type: "certification",
    periode: "Date à confirmer",
    role: "Certificat en marketing digital",
    contexte: "AJNV (Association des Jeunes pour la Nouvelle Vision), Abidjan",
    description:
      "Stratégies de marketing digital, réseaux sociaux, référencement et optimisation de campagnes en ligne.",
  },
  {
    id: "cert-php-laravel",
    type: "certification",
    periode: "Date à confirmer",
    role: "Certificat PHP – Laravel",
    contexte: "OpenClassrooms & Orange Digital Center, Abidjan",
    description:
      "Maîtrise du langage PHP objet et du framework MVC Laravel : routage, migrations, ORM Eloquent, authentification et API REST.",
  },
  {
    id: "cert-genai-marketing",
    type: "certification",
    periode: "Date à confirmer",
    role: "Prompt Engineering Generative AI for Marketing & Advertising",
    contexte: "Orange Digital Center, Abidjan",
    description:
      "Conception de prompts avancés et exploitation des modèles génératifs d'IA pour la production publicitaire.",
  },
  {
    id: "cert-react",
    type: "certification",
    periode: "Date à confirmer",
    role: "Web Development in React.js: Development Basics",
    contexte: "Coursera & Orange Digital Center, Abidjan",
    description:
      "Création d'interfaces web modulaires avec React : state management, composants, hooks et intégration d'APIs.",
  },
  {
    id: "cert-langchain",
    type: "certification",
    periode: "Date à confirmer",
    role: "LangChain: Application Development Essentials",
    contexte: "Formation certifiante",
    description:
      "Développement d'applications intégrant des modèles de langage, chaînes de traitement et RAG.",
  },
  {
    id: "cert-django-migrations",
    type: "certification",
    periode: "Date à confirmer",
    role: "Full-stack Development with Django: Managing Migrations",
    contexte: "Formation certifiante",
    description:
      "Modélisation avancée de schémas de données et gestion pérenne des migrations sous Python/Django.",
  },
  {
    id: "cert-poo-php",
    type: "certification",
    periode: "Date à confirmer",
    role: "Learn Object-Oriented Programming with PHP",
    contexte: "Formation certifiante",
    description:
      "Principes fondamentaux de la programmation orientée objet : encapsulation, héritage, polymorphisme.",
  },
  {
    id: "cert-python-backend",
    type: "certification",
    periode: "Date à confirmer",
    role: "Formation intensive back-end Python/Django",
    contexte: "Programme intensif",
    description:
      "Conception d'architectures backend complètes, développement d'API RESTful et optimisation relationnelle.",
  },
];

export const LANGUES = [
  { langue: "Français", niveau: "Natif" },
  { langue: "Anglais", niveau: "Intermédiaire (B1)" },
];

export const ALL_MILESTONES: ExperienceMilestone[] = [
  ...PARCOURS_CHRONOLOGIQUE,
  ...CERTIFICATIONS,
];
