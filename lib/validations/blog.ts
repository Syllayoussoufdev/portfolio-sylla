import { z } from "zod";

export const BLOG_CATEGORIES = [
  "Intelligence Artificielle",
  "Design UI/UX",
  "Développement Web",
  "Automatisation & n8n",
  "Stratégie Digitale",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BlogPostSchema = z.object({
  titre: z.string().min(3, "Le titre doit comporter au moins 3 caractères"),
  slug: z
    .string()
    .min(3, "Le slug doit comporter au moins 3 caractères")
    .regex(/^[a-z0-9-]+$/, "Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets"),
  description: z.string().min(10, "La description courte / chapeau doit comporter au moins 10 caractères"),
  contenu: z.string().min(20, "Le contenu de l'article doit comporter au moins 20 caractères"),
  coverImage: z.string().optional().or(z.literal("")),
  coverMediaId: z.string().nullable().optional(),
  categorie: z.string().min(2, "La catégorie est obligatoire"),
  tags: z.array(z.string()).default([]),
  tempsLecture: z.coerce.number().int().min(1).default(5),
  statut: z.enum(["PUBLIE", "BROUILLON"]).default("PUBLIE"),
  featured: z.boolean().default(false),
});

export type BlogPostInput = z.infer<typeof BlogPostSchema>;

export interface BlogPostSummary {
  id: string;
  titre: string;
  slug: string;
  description: string;
  coverImage: string | null;
  categorie: string;
  tags: string[];
  tempsLecture: number;
  statut: "PUBLIE" | "BROUILLON";
  featured: boolean;
  vuesCount: number;
  publishedAt: Date;
  createdAt: Date;
}

export interface BlogPostDetail extends BlogPostSummary {
  contenu: string;
  updatedAt: Date;
  coverMedia?: {
    id: string;
    url: string;
    alt: string;
  } | null;
}

/**
 * Calcule une estimation du temps de lecture en minutes (environ 200 mots par minute)
 */
export function estimateReadingTime(content: string): number {
  if (!content) return 1;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}
