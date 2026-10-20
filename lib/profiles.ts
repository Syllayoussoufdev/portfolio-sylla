import { prisma } from "./prisma";
import type { HeroData, SectionItem } from "./validations/profile";

/**
 * Profil de secours (fallback en mémoire) garantissant qu'aucune page publique
 * ne plante si la base est temporairement vide ou en cours de migration.
 */
export const FALLBACK_DEFAULT_PROFILE = {
  id: "fallback-default",
  slug: "default",
  label: "Chargé de communication digitale polyvalent",
  template: "creatif",
  accent: "default",
  hero: {
    headline: "Communication digitale, création visuelle et développement web",
    subline: "Je prends en charge votre présence en ligne de A à Z : identité visuelle, contenus percutants et site web optimisé pour convertir.",
    tagline: "Présence en ligne de A à Z",
    ctaPrimary: {
      label: "Voir mes réalisations",
      href: "#projets",
    },
    ctaSecondary: {
      label: "Discuter d'un projet",
      href: "#contact",
    },
    media: {
      kind: "image",
      alt: "Portrait professionnel de Sylla Youssouf",
    },
  } as HeroData,
  sections: [
    { key: "hero", visible: true, order: 0 },
    { key: "projets", visible: true, order: 1 },
    { key: "competences", visible: true, order: 2 },
    { key: "apropos", visible: true, order: 3 },
    { key: "parcours", visible: true, order: 4 },
    { key: "contact", visible: true, order: 5 },
  ] as SectionItem[],
  variables: {},
  seoTitle: "Sylla Youssouf — Communication Digitale, Création Visuelle & Web",
  seoDescription:
    "Communication digitale, création visuelle et développement web : je prends en charge votre présence en ligne de A à Z.",
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
    label: "Développeur web et mobile",
    template: "developpeur",
    hero: {
      headline: "Je développe des applications web et mobiles, avec un vrai soin du design.",
      subline: "Développeur web et mobile · Laravel · React · Next.js · PostgreSQL. Ma formation en design et en produits IA affine chaque interface.",
      tagline: "Développement web & mobile · Soin du design & IA",
      ctaPrimary: { label: "Discutons de votre projet", href: "#contact" },
      ctaSecondary: { label: "Voir mes projets", href: "#projets" },
      media: { kind: "image", alt: "Sylla Youssouf - Développeur web et mobile" },
    } as HeroData,
    sections: [
      { key: "hero", visible: true, order: 0 },
      { key: "projets", visible: true, order: 1 },
      { key: "competences", visible: true, order: 2 },
      { key: "apropos", visible: true, order: 3 },
      { key: "parcours", visible: true, order: 4 },
      { key: "contact", visible: true, order: 5 },
    ] as SectionItem[],
    seoTitle: "Développeur Web & Mobile — Sylla Youssouf",
    seoDescription: "Développeur web et mobile · Laravel, React, Next.js, PostgreSQL. Rendu soigné appuyé par le design et l'IA.",
  },
  design: {
    ...FALLBACK_DEFAULT_PROFILE,
    id: "fallback-design",
    slug: "design",
    label: "Designer graphique",
    template: "creatif",
    hero: {
      headline: "Je conçois des identités visuelles, des affiches et des supports qui se remarquent.",
      subline: "Designer graphique : chartes graphiques, flyers, maquettes de site et visuels renforcés par l'IA.",
      tagline: "Designer graphique · Identités, affiches & maquettes",
      ctaPrimary: { label: "Voir mes créations", href: "#projets" },
      ctaSecondary: { label: "Me contacter", href: "#contact" },
      media: { kind: "image", alt: "Sylla Youssouf - Designer graphique" },
    } as HeroData,
    sections: [
      { key: "hero", visible: true, order: 0 },
      { key: "projets", visible: true, order: 1 },
      { key: "apropos", visible: true, order: 2 },
      { key: "parcours", visible: true, order: 3 },
      { key: "contact", visible: true, order: 4 },
      { key: "competences", visible: false, order: 5 },
    ] as SectionItem[],
    seoTitle: "Designer Graphique — Sylla Youssouf",
    seoDescription: "Identités visuelles, affiches, chartes graphiques, maquettes de site et visuels renforcés par l'IA.",
  },
  video: {
    ...FALLBACK_DEFAULT_PROFILE,
    id: "fallback-video",
    slug: "video",
    label: "Monteur vidéo débutant",
    template: "immersif",
    hero: {
      headline: "Je monte des vidéos dynamiques, et je cherche à collaborer.",
      subline: "Monteur vidéo débutant : teasers, clips et interviews. Ouvert aux collaborations et aux stages.",
      tagline: "Montage vidéo · Rythme · Projets de films",
      ctaPrimary: { label: "Voir mes montages", href: "#projets" },
      ctaSecondary: { label: "Proposer une collaboration", href: "#contact" },
      media: { kind: "image", alt: "Sylla Youssouf - Monteur Vidéo" },
    } as HeroData,
    sections: [
      { key: "hero", visible: true, order: 0 },
      { key: "projets", visible: true, order: 1 },
      { key: "apropos", visible: true, order: 2 },
      { key: "contact", visible: true, order: 3 },
      { key: "competences", visible: false, order: 4 },
      { key: "parcours", visible: false, order: 5 },
    ] as SectionItem[],
    seoTitle: "Monteur Vidéo Débutant — Sylla Youssouf",
    seoDescription: "Monteur vidéo débutant : teasers, clips et interviews. Ouvert aux collaborations et aux stages.",
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
