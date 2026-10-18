import { z } from "zod";
import { isReservedSlug } from "../constants/reserved-slugs";

/**
 * Schéma Zod pour le Hero d'un profil.
 * Référence : PRD.md (section 7)
 */
export const HeroSchema = z.object({
  headline: z.string().min(2, "Le titre principal du Hero est obligatoire"),
  subline: z.string().min(2, "Le sous-titre du Hero est obligatoire"),
  tagline: z.string().optional(),
  ctaPrimary: z.object({
    label: z.string().min(1, "Le libellé du bouton principal est obligatoire"),
    href: z.string().min(1, "Le lien du bouton principal est obligatoire"),
  }),
  ctaSecondary: z.object({
    label: z.string().min(1, "Le libellé du bouton secondaire est obligatoire"),
    href: z.string().min(1, "Le lien du bouton secondaire est obligatoire"),
  }),
  media: z.object({
    kind: z.enum(["image", "abstract"]).default("image"),
    alt: z.string().optional(),
  }),
});

export type HeroData = z.infer<typeof HeroSchema>;

/**
 * Clés autorisées pour les sections d'un profil.
 */
export const SECTION_KEYS = [
  "hero",
  "projets",
  "competences",
  "apropos",
  "parcours",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

/**
 * Schéma pour un élément de section (visibilité et ordre d'affichage).
 */
export const SectionItemSchema = z.object({
  key: z.enum(SECTION_KEYS),
  visible: z.boolean().default(true),
  order: z.number().int().default(0),
});

export type SectionItem = z.infer<typeof SectionItemSchema>;

export const SectionsListSchema = z
  .array(SectionItemSchema)
  .min(1, "Au moins une section doit être définie");

/**
 * Templates officiels supportés (DESIGN.md).
 */
export const TEMPLATES = ["creatif", "developpeur", "immersif"] as const;
export type TemplateName = (typeof TEMPLATES)[number];

export const TemplateSchema = z.enum(TEMPLATES);

/**
 * Schéma complet de validation d'un Profil.
 */
export const ProfileSchema = z.object({
  label: z.string().min(2, "Le libellé du profil doit comporter au moins 2 caractères"),
  slug: z
    .string()
    .min(2, "Le slug doit comporter au moins 2 caractères")
    .regex(/^[a-z0-9-]+$/, "Le slug ne peut contenir que des minuscules, chiffres et tirets")
    .refine(
      (s) => s === "default" || !isReservedSlug(s),
      {
        message: "Ce slug est réservé par le système.",
      }
    ),
  template: TemplateSchema.default("creatif"),
  accent: z.string().default("default"),
  hero: HeroSchema,
  sections: SectionsListSchema,
  variables: z.record(z.string(), z.unknown()).optional().default({}),
  seoTitle: z.string().max(70, "Le titre SEO ne doit pas dépasser 70 caractères").optional().nullable(),
  seoDescription: z
    .string()
    .max(160, "La description SEO ne doit pas dépasser 160 caractères")
    .optional()
    .nullable(),
  heroMediaId: z.string().optional().nullable(),
  isDefault: z.boolean().default(false),
  actif: z.boolean().default(true),
  subPortfolioId: z.string().optional().nullable(),
});

export type ProfileInput = z.infer<typeof ProfileSchema>;

/**
 * Schéma pour les Réglages globaux du site (SiteSettings).
 * Référence : PRD.md (section 7)
 */
export const SiteSettingsSchema = z.object({
  nom: z.string().min(2, "Le nom affiché est obligatoire (au moins 2 caractères)"),
  metier: z.string().optional().nullable().or(z.literal("")),
  emailPublic: z.string().email("Adresse e-mail invalide").optional().nullable().or(z.literal("")),
  whatsapp: z.string().optional().nullable().or(z.literal("")),
  github: z.string().url("URL GitHub invalide").optional().nullable().or(z.literal("")),
  linkedin: z.string().url("URL LinkedIn invalide").optional().nullable().or(z.literal("")),
  twitter: z.string().url("URL Twitter / X invalide").optional().nullable().or(z.literal("")),
  instagram: z.string().url("URL Instagram invalide").optional().nullable().or(z.literal("")),
});

export type SiteSettingsInput = z.infer<typeof SiteSettingsSchema>;
