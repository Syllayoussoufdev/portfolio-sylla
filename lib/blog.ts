import { prisma } from "@/lib/prisma";
export {
  estimateReadingTime,
  type BlogPostSummary,
  type BlogPostDetail,
} from "@/lib/validations/blog";
import type { BlogPostSummary, BlogPostDetail } from "@/lib/validations/blog";

/**
 * Récupère les articles de blog publiés avec filtrage optionnel
 */
export async function getPublishedBlogPosts(options?: {
  categorie?: string;
  tag?: string;
  limit?: number;
  skip?: number;
}): Promise<BlogPostSummary[]> {
  try {
    const where: any = { statut: "PUBLIE" };

    if (options?.categorie && options.categorie !== "Tous") {
      where.categorie = options.categorie;
    }

    if (options?.tag) {
      where.tags = { has: options.tag };
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      take: options?.limit,
      skip: options?.skip,
      select: {
        id: true,
        titre: true,
        slug: true,
        description: true,
        coverImage: true,
        categorie: true,
        tags: true,
        tempsLecture: true,
        statut: true,
        featured: true,
        vuesCount: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    return posts;
  } catch (error) {
    console.error("[Blog] Erreur récupération articles publiés :", error);
    return [];
  }
}

/**
 * Récupère l'article phare (featured) le plus récent
 */
export async function getFeaturedBlogPost(): Promise<BlogPostSummary | null> {
  try {
    const featured = await prisma.blogPost.findFirst({
      where: { statut: "PUBLIE", featured: true },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        titre: true,
        slug: true,
        description: true,
        coverImage: true,
        categorie: true,
        tags: true,
        tempsLecture: true,
        statut: true,
        featured: true,
        vuesCount: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    if (featured) return featured;

    // Si aucun article n'est explicitement marqué "featured", prendre le tout dernier publié
    return await prisma.blogPost.findFirst({
      where: { statut: "PUBLIE" },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        titre: true,
        slug: true,
        description: true,
        coverImage: true,
        categorie: true,
        tags: true,
        tempsLecture: true,
        statut: true,
        featured: true,
        vuesCount: true,
        publishedAt: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("[Blog] Erreur récupération article phare :", error);
    return null;
  }
}

/**
 * Récupère un article complet par son slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        coverMedia: {
          select: { id: true, url: true, alt: true },
        },
      },
    });

    return post;
  } catch (error) {
    console.error(`[Blog] Erreur récupération article '${slug}' :`, error);
    return null;
  }
}

/**
 * Récupère les articles similaires / recommandés
 */
export async function getRelatedBlogPosts(
  currentSlug: string,
  categorie: string,
  limit = 3
): Promise<BlogPostSummary[]> {
  try {
    const related = await prisma.blogPost.findMany({
      where: {
        statut: "PUBLIE",
        slug: { not: currentSlug },
        categorie,
      },
      take: limit,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        titre: true,
        slug: true,
        description: true,
        coverImage: true,
        categorie: true,
        tags: true,
        tempsLecture: true,
        statut: true,
        featured: true,
        vuesCount: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    // Si on n'a pas assez d'articles dans la même catégorie, compléter avec les plus récents
    if (related.length < limit) {
      const remaining = limit - related.length;
      const additional = await prisma.blogPost.findMany({
        where: {
          statut: "PUBLIE",
          slug: { notIn: [currentSlug, ...related.map((p) => p.slug)] },
        },
        take: remaining,
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          titre: true,
          slug: true,
          description: true,
          coverImage: true,
          categorie: true,
          tags: true,
          tempsLecture: true,
          statut: true,
          featured: true,
          vuesCount: true,
          publishedAt: true,
          createdAt: true,
        },
      });
      return [...related, ...additional];
    }

    return related;
  } catch (error) {
    console.error("[Blog] Erreur récupération articles similaires :", error);
    return [];
  }
}

/**
 * Incrémente le compteur de vues d'un article de façon atomique
 */
export async function incrementBlogPostViews(slug: string): Promise<void> {
  try {
    await prisma.blogPost.update({
      where: { slug },
      data: {
        vuesCount: { increment: 1 },
      },
    });
  } catch (error) {
    // Ignorer silencieusement pour ne pas bloquer l'affichage de l'article
  }
}

/**
 * Récupère tous les articles pour le dashboard d'administration (brouillons inclus)
 */
export async function getAllBlogPostsAdmin(): Promise<BlogPostSummary[]> {
  try {
    return await prisma.blogPost.findMany({
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        titre: true,
        slug: true,
        description: true,
        coverImage: true,
        categorie: true,
        tags: true,
        tempsLecture: true,
        statut: true,
        featured: true,
        vuesCount: true,
        publishedAt: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("[Blog] Erreur récupération admin articles :", error);
    return [];
  }
}
