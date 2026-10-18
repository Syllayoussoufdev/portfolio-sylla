"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const ProjectSchema = z.object({
  titre: z.string().min(2, "Le titre doit comporter au moins 2 caractères"),
  slug: z
    .string()
    .min(2, "Le slug doit comporter au moins 2 caractères")
    .regex(/^[a-z0-9-]+$/, "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets"),
  description: z.string().min(5, "La description est obligatoire"),
  contenu: z.string().optional(),
  coverImage: z.string().url("URL de couverture invalide").optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  links: z.record(z.string(), z.string()).default({}),
  ordre: z.number().int().default(0),
  visible: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export type ProjectActionState = {
  error?: string;
  success?: boolean;
};

/**
 * Création d'un projet
 */
export async function createProjectAction(
  prevState: ProjectActionState | undefined,
  formData: FormData
): Promise<ProjectActionState> {
  const session = await getSession();
  if (!session) {
    return { error: "Non autorisé" };
  }

  const rawTags = formData.get("tags") as string;
  const tagsList = rawTags
    ? rawTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const linksData: Record<string, string> = {
    demo: (formData.get("link_demo") as string) || "",
    github: (formData.get("link_github") as string) || "",
    figma: (formData.get("link_figma") as string) || "",
    drive: (formData.get("link_drive") as string) || "",
    video: (formData.get("link_video") as string) || "",
  };

  const coverMediaId = (formData.get("coverMediaId") as string) || null;
  const rawGalleryIds = formData.get("galleryMediaIds") as string;
  let galleryMediaIds: string[] = [];
  try {
    if (rawGalleryIds) {
      galleryMediaIds = JSON.parse(rawGalleryIds);
    }
  } catch {
    galleryMediaIds = [];
  }

  const parsed = ProjectSchema.safeParse({
    titre: formData.get("titre"),
    slug: (formData.get("slug") as string)?.toLowerCase().trim(),
    description: formData.get("description"),
    contenu: formData.get("contenu") || undefined,
    coverImage: formData.get("coverImage") || "",
    tags: tagsList,
    links: linksData,
    ordre: Number(formData.get("ordre") || 0),
    visible: formData.get("visible") === "on" || formData.get("visible") === "true",
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Champs invalides" };
  }

  const data = parsed.data;

  // Vérifier l'unicité du slug
  const existing = await prisma.project.findUnique({
    where: { slug: data.slug },
  });

  if (existing) {
    return { error: `Le slug "/${data.slug}" est déjà utilisé par un autre projet.` };
  }

  // Rétrocompatibilité : si coverMediaId est défini mais coverImage est vide, synchroniser l'URL
  let resolvedCoverImage = data.coverImage || null;
  if (coverMediaId) {
    const media = await prisma.media.findUnique({ where: { id: coverMediaId } });
    if (media) {
      resolvedCoverImage = media.url;
    }
  }

  // Si des médias de galerie sont renseignés, mettre à jour links.gallery pour rétrocompatibilité
  if (galleryMediaIds.length > 0) {
    const galleryMedias = await prisma.media.findMany({
      where: { id: { in: galleryMediaIds } },
    });
    const mediaMap = new Map(galleryMedias.map((m) => [m.id, m.url]));
    const galleryUrls = galleryMediaIds.map((id) => mediaMap.get(id)).filter(Boolean);
    (data.links as Record<string, unknown>).gallery = galleryUrls;
  }

  try {
    const created = await prisma.project.create({
      data: {
        titre: data.titre,
        slug: data.slug,
        description: data.description,
        contenu: data.contenu || null,
        coverImage: resolvedCoverImage,
        coverMediaId: coverMediaId || null,
        tags: data.tags,
        links: data.links,
        ordre: data.ordre,
        visible: data.visible,
        featured: data.featured,
      },
    });

    // Insérer les entrées ordonnées dans ProjectMedia
    if (galleryMediaIds.length > 0) {
      await prisma.projectMedia.createMany({
        data: galleryMediaIds.map((mediaId, position) => ({
          projectId: created.id,
          mediaId,
          position,
        })),
      });
    }
  } catch (err) {
    console.error("Erreur création projet:", err);
    return { error: "Impossible de créer le projet en base de données." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projets");
  revalidatePath("/projets");
  redirect("/admin/projets");
}

/**
 * Mise à jour d'un projet existant
 */
export async function updateProjectAction(
  id: string,
  prevState: ProjectActionState | undefined,
  formData: FormData
): Promise<ProjectActionState> {
  const session = await getSession();
  if (!session) {
    return { error: "Non autorisé" };
  }

  const rawTags = formData.get("tags") as string;
  const tagsList = rawTags
    ? rawTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const linksData: Record<string, string> = {
    demo: (formData.get("link_demo") as string) || "",
    github: (formData.get("link_github") as string) || "",
    figma: (formData.get("link_figma") as string) || "",
    drive: (formData.get("link_drive") as string) || "",
    video: (formData.get("link_video") as string) || "",
  };

  const coverMediaId = (formData.get("coverMediaId") as string) || null;
  const rawGalleryIds = formData.get("galleryMediaIds") as string;
  let galleryMediaIds: string[] = [];
  try {
    if (rawGalleryIds) {
      galleryMediaIds = JSON.parse(rawGalleryIds);
    }
  } catch {
    galleryMediaIds = [];
  }

  const parsed = ProjectSchema.safeParse({
    titre: formData.get("titre"),
    slug: (formData.get("slug") as string)?.toLowerCase().trim(),
    description: formData.get("description"),
    contenu: formData.get("contenu") || undefined,
    coverImage: formData.get("coverImage") || "",
    tags: tagsList,
    links: linksData,
    ordre: Number(formData.get("ordre") || 0),
    visible: formData.get("visible") === "on" || formData.get("visible") === "true",
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Champs invalides" };
  }

  const data = parsed.data;

  // Vérifier l'unicité du slug s'il a changé
  const existingWithSlug = await prisma.project.findFirst({
    where: {
      slug: data.slug,
      NOT: { id },
    },
  });

  if (existingWithSlug) {
    return { error: `Le slug "/${data.slug}" est déjà utilisé par un autre projet.` };
  }

  // Rétrocompatibilité : synchroniser coverImage avec coverMedia si disponible
  let resolvedCoverImage = data.coverImage || null;
  if (coverMediaId) {
    const media = await prisma.media.findUnique({ where: { id: coverMediaId } });
    if (media) {
      resolvedCoverImage = media.url;
    }
  }

  // Mettre à jour links.gallery pour rétrocompatibilité
  if (galleryMediaIds.length > 0) {
    const galleryMedias = await prisma.media.findMany({
      where: { id: { in: galleryMediaIds } },
    });
    const mediaMap = new Map(galleryMedias.map((m) => [m.id, m.url]));
    const galleryUrls = galleryMediaIds.map((mId) => mediaMap.get(mId)).filter(Boolean);
    (data.links as Record<string, unknown>).gallery = galleryUrls;
  } else {
    // Si la galerie a été vidée
    (data.links as Record<string, unknown>).gallery = [];
  }

  try {
    await prisma.project.update({
      where: { id },
      data: {
        titre: data.titre,
        slug: data.slug,
        description: data.description,
        contenu: data.contenu || null,
        coverImage: resolvedCoverImage,
        coverMediaId: coverMediaId || null,
        tags: data.tags,
        links: data.links,
        ordre: data.ordre,
        visible: data.visible,
        featured: data.featured,
      },
    });

    // Mettre à jour la galerie ProjectMedia (remplacement des jointures)
    await prisma.projectMedia.deleteMany({
      where: { projectId: id },
    });

    if (galleryMediaIds.length > 0) {
      await prisma.projectMedia.createMany({
        data: galleryMediaIds.map((mediaId, position) => ({
          projectId: id,
          mediaId,
          position,
        })),
      });
    }
  } catch (err) {
    console.error("Erreur modification projet:", err);
    return { error: "Impossible de mettre à jour le projet en base de données." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projets");
  revalidatePath("/projets");
  revalidatePath(`/projets/${data.slug}`);
  redirect("/admin/projets");
}

/**
 * Suppression d'un projet
 */
export async function deleteProjectAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  try {
    await prisma.project.delete({
      where: { id },
    });
  } catch (err) {
    console.error("Erreur suppression projet:", err);
    return;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projets");
  revalidatePath("/projets");
}

/**
 * Bascule de visibilité d'un projet
 */
export async function toggleVisibilityAction(id: string, currentVisible: boolean) {
  const session = await getSession();
  if (!session) return;

  await prisma.project.update({
    where: { id },
    data: { visible: !currentVisible },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/projets");
  revalidatePath("/projets");
}
