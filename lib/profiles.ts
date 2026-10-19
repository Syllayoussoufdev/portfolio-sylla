import { prisma } from "./prisma";
import type { HeroData, SectionItem } from "./validations/profile";

/**
 * Profil de secours (fallback en mémoire) garantissant qu'aucune page publique
 * ne plante si la base est temporairement vide ou en cours de migration.
 */
export const FALLBACK_DEFAULT_PROFILE = {
  id: "fallback-default",
  slug: "default",
  label: "Profil par défaut",
  template: "creatif",
  accent: "default",
  hero: {
    headline: "EXPERT COMMUNICATION DIGITALE & DÉVELOPPEUR WEB",
    subline: "Je conçois des identités mémorables et des applications modernes, performantes et scalables.",
    tagline: "Double casquette Créative & Ingénierie logicielle",
    ctaPrimary: {
      label: "Découvrir mes réalisations",
      href: "#projets",
    },
    ctaSecondary: {
      label: "Me contacter",
      href: "/contact",
    },
    media: {
      kind: "image",
      alt: "Portrait professionnel de Sylla Youssouf",
    },
  } as HeroData,
  sections: [
    { key: "hero", visible: true, order: 0 },
    { key: "apropos", visible: true, order: 1 },
    { key: "projets", visible: true, order: 2 },
    { key: "competences", visible: true, order: 3 },
    { key: "parcours", visible: true, order: 4 },
    { key: "contact", visible: true, order: 5 },
  ] as SectionItem[],
  variables: {},
  seoTitle: "Sylla Youssouf — Portfolio & Réalisations",
  seoDescription:
    "Portfolio de Sylla Youssouf, expert en création numérique, design et développement d'applications web & mobiles.",
  heroMediaId: null,
  heroMedia: null,
  isDefault: true,
  actif: true,
  subPortfolioId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export interface SiteSettingsData {
  id: string;
  nom: string;
  metier: string | null;
  emailPublic: string | null;
  whatsapp: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  updatedAt: Date;
}

export interface MediaData {
  id?: string;
  url: string;
  alt: string;
  largeur?: number | null;
  hauteur?: number | null;
  poids?: number | null;
  format?: string | null;
}

/**
 * Réglages du site de secours (fallback)
 * Note : aucun faux e-mail ni faux numéro WhatsApp n'est inventé.
 */
export const FALLBACK_SITE_SETTINGS: SiteSettingsData = {
  id: "fallback-settings",
  nom: "Sylla Youssouf",
  metier: "Expert Communication & Développeur",
  emailPublic: null,
  whatsapp: null,
  github: null,
  linkedin: null,
  twitter: null,
  instagram: null,
  updatedAt: new Date(),
};

/**
 * Récupère le profil principal par défaut (affiché sur la racine "/").
 * Tente d'abord le profil avec isDefault=true, sinon le premier profil actif,
 * et enfin le fallback sécurisé si aucun profil n'est en base.
 */
export async function getDefaultProfile() {
  try {
    const profile = await prisma.profile.findFirst({
      where: {
        isDefault: true,
        actif: true,
      },
      include: {
        heroMedia: true,
      },
    });

    if (profile) return profile;

    // Si aucun profil n'a isDefault=true, récupérer le premier actif
    const firstActive = await prisma.profile.findFirst({
      where: { actif: true },
      include: { heroMedia: true },
    });

    if (firstActive) return firstActive;
  } catch (error) {
    console.warn("Avertissement lors de la lecture du profil par défaut (utilisation du repli) :", error);
  }

  return FALLBACK_DEFAULT_PROFILE;
}

export const FALLBACK_PROFILES_BY_SLUG: Record<string, typeof FALLBACK_DEFAULT_PROFILE> = {
  dev: {
    ...FALLBACK_DEFAULT_PROFILE,
    id: "fallback-dev",
    slug: "dev",
    label: "Développeur Fullstack & Mobile",
    template: "developpeur",
    hero: {
      headline: "Je conçois des expériences web et mobiles utiles, performantes et soignées.",
      subline: "Développeur Web & Mobile · Laravel · React · Next.js",
      tagline: "Architecture logicielle & Interfaces réactives",
      ctaPrimary: { label: "Voir mes réalisations", href: "#projets" },
      ctaSecondary: { label: "Me contacter", href: "#contact" },
      media: { kind: "image", alt: "Sylla Youssouf - Développeur" },
    } as HeroData,
    seoTitle: "Développeur Web & Mobile — Sylla Youssouf",
    seoDescription: "Réalisations et expertise logicielle de Sylla Youssouf : applications SaaS, web et mobiles.",
  },
  design: {
    ...FALLBACK_DEFAULT_PROFILE,
    id: "fallback-design",
    slug: "design",
    label: "Design Graphique & Branding",
    template: "creatif",
    hero: {
      headline: "ALLIER LA BEAUTÉ VISUELLE À LA RIGUEUR LOGICIELLE.",
      subline: "Direction artistique, chartes graphiques mémorables et typographies tranchées.",
      tagline: "Design d'impact & Identités singulières",
      ctaPrimary: { label: "Explorer les créations", href: "#projets" },
      ctaSecondary: { label: "Me contacter", href: "#contact" },
      media: { kind: "image", alt: "Sylla Youssouf - Design" },
    } as HeroData,
    seoTitle: "Design Graphique & Branding — Sylla Youssouf",
    seoDescription: "Créations graphiques et identités visuelles conçues par Sylla Youssouf.",
  },
  video: {
    ...FALLBACK_DEFAULT_PROFILE,
    id: "fallback-video",
    slug: "video",
    label: "Production Audiovisuelle & Motion",
    template: "immersif",
    hero: {
      headline: "Turning Ideas Into Beautiful Digital Experiences.",
      subline: "Direction créative, motion design, univers 3D immersifs et production visuelle d'impact.",
      tagline: "Studio Showcase · Direction Artistique & Motion",
      ctaPrimary: { label: "Explorer le Showreel & Réalisations", href: "#projets" },
      ctaSecondary: { label: "Lancer un projet créatif", href: "#contact" },
      media: { kind: "image", alt: "Sylla Youssouf - Motion" },
    } as HeroData,
    seoTitle: "Production Vidéo & Motion 3D — Sylla Youssouf",
    seoDescription: "Showreel, vidéos et univers 3D immersifs de Sylla Youssouf.",
  },
};

/**
 * Récupère un profil par son slug URL (ex: /[profil]).
 * Retourne null si le profil n'existe pas ou est inactif.
 */
export async function getProfileBySlug(slug: string) {
  if (!slug) return null;
  const normalized = slug.trim().toLowerCase();

  if (normalized === "default") {
    return getDefaultProfile();
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        slug: normalized,
        actif: true,
      },
      include: {
        heroMedia: true,
        subPortfolio: {
          include: {
            projects: {
              include: {
                project: {
                  include: {
                    coverMedia: true,
                  },
                },
              },
              orderBy: { ordre: "asc" },
            },
          },
        },
      },
    });

    if (profile) return profile;
  } catch (error) {
    console.warn(`Avertissement récupération profil [${normalized}] (utilisation du repli) :`, error);
  }

  return FALLBACK_PROFILES_BY_SLUG[normalized] || null;
}

/**
 * Récupère le singleton SiteSettings depuis la base de données.
 */
export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (settings) return settings;
  } catch (error) {
    console.warn("Avertissement lors de la lecture des SiteSettings (utilisation du repli) :", error);
  }

  return FALLBACK_SITE_SETTINGS;
}
