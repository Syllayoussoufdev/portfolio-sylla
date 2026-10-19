export type MilestoneType = "experience" | "formation" | "certification";

export interface ExperienceMilestone {
  id: string;
  type: MilestoneType;
  periode: string;
  role: string;
  contexte: string;
  description: string;
  current?: boolean;
}

/**
 * Expériences professionnelles réelles (source : CV actualisé de Sylla Youssouf)
 */
export const EXPERIENCES: ExperienceMilestone[] = [
  {
    id: "exp-freelance",
    type: "experience",
    periode: "Depuis janvier 2026",
    role: "Développeur web full stack (Laravel, React, Next.js)",
    contexte: "Service de Freelance Web (Temps partiel)",
    description:
      "Conception, réalisation et publication de sites web pour des particuliers. Développement d'architectures modernes avec Laravel, React.js et Next.js. Initiation et utilisation de Docker pour faciliter les environnements de développement et les déploiements.",
    current: true,
  },
  {
    id: "exp-muscop",
    type: "experience",
    periode: "Mars 2025 — Mars 2026",
    role: "Assistant technique / déploiement",
    contexte: "MUSCOP-CI (Mutuelle du Corps Préfectoral de Côte d'Ivoire)",
    description:
      "Déploiement opérationnel d'un ERP web d'assurance santé dans les centres médicaux conventionnés sur l'ensemble du territoire national. Conduite du changement et formation pratique des équipes médicales et administratives à l'utilisation de la plateforme.",
    current: false,
  },
  {
    id: "exp-stratos",
    type: "experience",
    periode: "Juillet — Décembre 2024",
    role: "Développeur full stack junior (stage de validation)",
    contexte: "Stratos-conseil",
    description:
      "Participation active au développement de deux applications web en architecture MVC (Symfony, Laravel). Conception d'interfaces responsives avec Vue.js et moteurs de templates. Suivi de projet, résolution d'anomalies, documentation technique et collaboration sous Git/GitHub.",
    current: false,
  },
];

/**
 * Formations académiques et spécialisées
 */
export const FORMATIONS: ExperienceMilestone[] = [
  {
    id: "form-simplon",
    type: "formation",
    periode: "À renseigner",
    role: "Formation « Pratique IA Product Creator »",
    contexte: "Simplon",
    description:
      "Trois projets majeurs d'entreprise (à détailler par Sylla) et développement approfondi des compétences clés : branding, design graphique (logo, identité, illustration), montage vidéo, stratégie de communication digitale, maquettes Figma, développement web et intégration de produits IA.",
    current: false,
  },
  {
    id: "form-licence",
    type: "formation",
    periode: "Année à renseigner",
    role: "Licence professionnelle (spécialité à renseigner)",
    contexte: "PIGIER CI (orthographe à confirmer)",
    description:
      "Formation supérieure en technologies numériques et ingénierie informatique appliquée.",
    current: false,
  },
  {
    id: "form-bts",
    type: "formation",
    periode: "2021 — 2023",
    role: "BTS Informatique, option Développeur d'application (IDA)",
    contexte: "ISFMI, Abidjan (Plateau)",
    description:
      "Apprentissage des fondamentaux du génie logiciel, de l'algorithmique, de la modélisation de bases de données relationnelles et du développement d'applications de gestion.",
    current: false,
  },
  {
    id: "form-bac",
    type: "formation",
    periode: "2020 — 2021",
    role: "Baccalauréat série D",
    contexte: "Lycée municipal 2 de Koumassi",
    description:
      "Formation scientifique générale : mathématiques, sciences de la vie et de la terre, physique-chimie.",
    current: false,
  },
];

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
      "Stratégies de marketing digital, gestion et animation des réseaux sociaux, acquisition de trafic, référencement et optimisation de campagnes en ligne.",
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
      "Conception de prompts avancés et exploitation des modèles génératifs d'IA pour la production de visuels et de campagnes publicitaires.",
  },
  {
    id: "cert-react",
    type: "certification",
    periode: "Date à confirmer",
    role: "Web Development in React.js: Development Basics",
    contexte: "Coursera & Orange Digital Center, Abidjan",
    description:
      "Création d'interfaces web modulaires avec React : state management, cycle de vie, hooks et intégration d'APIs tierces.",
  },
  {
    id: "cert-langchain",
    type: "certification",
    periode: "Date à confirmer",
    role: "LangChain: Application Development Essentials",
    contexte: "Formation certifiante",
    description:
      "Développement d'applications intégrant des modèles de langage, chaînes de traitement, mémoire conversationnelle et RAG.",
  },
  {
    id: "cert-django-migrations",
    type: "certification",
    periode: "Date à confirmer",
    role: "Full-stack Development with Django: Managing Migrations",
    contexte: "Formation certifiante",
    description:
      "Modélisation avancée de schémas de données et gestion pérenne des migrations dans l'écosystème Python/Django.",
  },
  {
    id: "cert-poo-php",
    type: "certification",
    periode: "Date à confirmer",
    role: "Learn Object-Oriented Programming with PHP",
    contexte: "Formation certifiante",
    description:
      "Principes fondamentaux de la programmation orientée objet : encapsulation, héritage, polymorphisme, design patterns et conventions PSR.",
  },
  {
    id: "cert-python-backend",
    type: "certification",
    periode: "Date à confirmer",
    role: "Formation intensive back-end Python/Django",
    contexte: "Programme intensif",
    description:
      "Conception d'architectures backend complètes, développement d'API RESTful et optimisation de bases de données relationnelles.",
  },
];

export const LANGUES = [
  { langue: "Français", niveau: "Natif" },
  { langue: "Anglais", niveau: "Intermédiaire (B1)" },
];

/**
 * Ensemble de tous les jalons chronologiques (expériences, formations, certifications)
 */
export const ALL_MILESTONES: ExperienceMilestone[] = [
  ...EXPERIENCES,
  ...FORMATIONS,
  ...CERTIFICATIONS,
];
