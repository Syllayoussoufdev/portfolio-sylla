"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BlogPostSchema, estimateReadingTime } from "@/lib/validations/blog";

export type BlogActionState = {
  error?: string;
  success?: boolean;
};

/**
 * Création d'un nouvel article de blog
 */
export async function createBlogPostAction(
  prevState: BlogActionState | undefined,
  formData: FormData
): Promise<BlogActionState> {
  const session = await getSession();
  if (!session) {
    return { error: "Non autorisé" };
  }

  const rawTags = (formData.get("tags") as string) || "";
  const tagsList = rawTags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const contenu = (formData.get("contenu") as string) || "";
  const autoReadingTime = estimateReadingTime(contenu);
  const customReadingTime = formData.get("tempsLecture");
  const tempsLecture = customReadingTime ? Number(customReadingTime) : autoReadingTime;

  const rawData = {
    titre: formData.get("titre"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    contenu,
    coverImage: formData.get("coverImage") || "",
    coverMediaId: formData.get("coverMediaId") || null,
    categorie: formData.get("categorie") || "Intelligence Artificielle",
    tags: tagsList,
    tempsLecture,
    statut: formData.get("statut") || "PUBLIE",
    featured: formData.get("featured") === "true" || formData.get("featured") === "on",
  };

  const parseResult = BlogPostSchema.safeParse(rawData);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues.map((i) => i.message).join(", ");
    return { error: errorMsg };
  }

  const data = parseResult.data;

  try {
    // Vérifier l'unicité du slug
    const existing = await prisma.blogPost.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return { error: "Ce slug est déjà utilisé par un autre article" };
    }

    await prisma.blogPost.create({
      data: {
        titre: data.titre,
        slug: data.slug,
        description: data.description,
        contenu: data.contenu,
        coverImage: data.coverImage || null,
        coverMediaId: data.coverMediaId || null,
        categorie: data.categorie,
        tags: data.tags,
        tempsLecture: data.tempsLecture,
        statut: data.statut as any,
        featured: data.featured,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);
    revalidatePath("/admin/blog");
    revalidatePath("/sitemap.xml");

    return { success: true };
  } catch (err: any) {
    console.error("[Blog Action] Erreur création :", err);
    return { error: err.message || "Erreur interne lors de la création de l'article" };
  }
}

/**
 * Mise à jour d'un article de blog existant
 */
export async function updateBlogPostAction(
  id: string,
  prevState: BlogActionState | undefined,
  formData: FormData
): Promise<BlogActionState> {
  const session = await getSession();
  if (!session) {
    return { error: "Non autorisé" };
  }

  const rawTags = (formData.get("tags") as string) || "";
  const tagsList = rawTags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const contenu = (formData.get("contenu") as string) || "";
  const autoReadingTime = estimateReadingTime(contenu);
  const customReadingTime = formData.get("tempsLecture");
  const tempsLecture = customReadingTime ? Number(customReadingTime) : autoReadingTime;

  const rawData = {
    titre: formData.get("titre"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    contenu,
    coverImage: formData.get("coverImage") || "",
    coverMediaId: formData.get("coverMediaId") || null,
    categorie: formData.get("categorie") || "Intelligence Artificielle",
    tags: tagsList,
    tempsLecture,
    statut: formData.get("statut") || "PUBLIE",
    featured: formData.get("featured") === "true" || formData.get("featured") === "on",
  };

  const parseResult = BlogPostSchema.safeParse(rawData);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues.map((i) => i.message).join(", ");
    return { error: errorMsg };
  }

  const data = parseResult.data;

  try {
    // Vérifier l'unicité du slug en excluant l'article courant
    const existing = await prisma.blogPost.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (existing) {
      return { error: "Ce slug est déjà utilisé par un autre article" };
    }

    await prisma.blogPost.update({
      where: { id },
      data: {
        titre: data.titre,
        slug: data.slug,
        description: data.description,
        contenu: data.contenu,
        coverImage: data.coverImage || null,
        coverMediaId: data.coverMediaId || null,
        categorie: data.categorie,
        tags: data.tags,
        tempsLecture: data.tempsLecture,
        statut: data.statut as any,
        featured: data.featured,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);
    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/${id}`);
    revalidatePath("/sitemap.xml");

    return { success: true };
  } catch (err: any) {
    console.error("[Blog Action] Erreur modification :", err);
    return { error: err.message || "Erreur interne lors de la modification de l'article" };
  }
}

/**
 * Suppression d'un article
 */
export async function deleteBlogPostAction(id: string): Promise<BlogActionState> {
  const session = await getSession();
  if (!session) {
    return { error: "Non autorisé" };
  }

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: { slug: true },
    });

    await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath("/blog");
    if (post?.slug) {
      revalidatePath(`/blog/${post.slug}`);
    }
    revalidatePath("/admin/blog");
    revalidatePath("/sitemap.xml");

    return { success: true };
  } catch (err: any) {
    console.error("[Blog Action] Erreur suppression :", err);
    return { error: err.message || "Erreur interne lors de la suppression" };
  }
}

/**
 * Bascule rapide du statut de publication (PUBLIE <-> BROUILLON)
 */
export async function toggleBlogPostStatusAction(id: string): Promise<BlogActionState> {
  const session = await getSession();
  if (!session) {
    return { error: "Non autorisé" };
  }

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: { statut: true, slug: true },
    });

    if (!post) {
      return { error: "Article introuvable" };
    }

    const nextStatus = post.statut === "PUBLIE" ? "BROUILLON" : "PUBLIE";

    await prisma.blogPost.update({
      where: { id },
      data: { statut: nextStatus },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/blog");
    revalidatePath("/sitemap.xml");

    return { success: true };
  } catch (err: any) {
    console.error("[Blog Action] Erreur bascule statut :", err);
    return { error: err.message || "Erreur lors du changement de statut" };
  }
}
