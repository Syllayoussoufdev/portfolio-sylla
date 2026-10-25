import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { normalizeImageUrl } from "@/lib/media-url";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/media
 * Récupère tous les médias avec les projets qui les utilisent
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé : session administrateur requise" },
        { status: 401 }
      );
    }

    const medias = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        coverForProjects: {
          select: {
            id: true,
            titre: true,
            slug: true,
          },
        },
        projectGalleries: {
          include: {
            project: {
              select: {
                id: true,
                titre: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ medias });
  } catch (error) {
    console.error("Erreur récupération médias:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer la liste des médias" },
      { status: 500 }
    );
  }
}

interface MediaInputItem {
  publicId?: string;
  url?: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  alt?: string;
}

async function upsertSingleMedia(item: MediaInputItem) {
  const { publicId, url, width, height, format, bytes, alt } = item;

  if (!url || typeof url !== "string" || !url.trim()) {
    throw new Error("L'URL de l'image est obligatoire");
  }

  if (!alt || typeof alt !== "string" || !alt.trim()) {
    throw new Error("Le texte alternatif (alt) est obligatoire pour l'accessibilité");
  }

  const cleanUrl = normalizeImageUrl(url.trim());
  const finalPublicId =
    publicId && typeof publicId === "string" && publicId.trim()
      ? publicId.trim()
      : "url_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);

  // Vérifier si le média existe déjà (par publicId ou par URL)
  const existing = await prisma.media.findFirst({
    where: {
      OR: [{ publicId: finalPublicId }, { url: cleanUrl }],
    },
  });

  if (existing) {
    return existing;
  }

  // Détection basique du format depuis l'URL si non fourni
  let detectedFormat = (format && String(format)) || "jpg";
  if (!format && cleanUrl.includes(".")) {
    const ext = cleanUrl.split(".").pop()?.split("?")[0]?.toLowerCase();
    if (ext && ["png", "jpg", "jpeg", "webp", "avif", "gif", "svg"].includes(ext)) {
      detectedFormat = ext;
    }
  }

  return prisma.media.create({
    data: {
      publicId: finalPublicId,
      url: cleanUrl,
      width: Number(width) || 1200,
      height: Number(height) || 800,
      format: detectedFormat,
      bytes: Number(bytes) || 0,
      alt: alt.trim(),
    },
  });
}

/**
 * POST /api/admin/media
 * Enregistre un ou plusieurs médias (objet unique ou { items: [...] })
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé : session administrateur requise" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Mode lot (Batch) : { items: [...] }
    if (Array.isArray(body.items)) {
      if (body.items.length === 0) {
        return NextResponse.json(
          { error: "Aucun média fourni dans le lot" },
          { status: 400 }
        );
      }

      const createdMedias = [];
      for (const rawItem of body.items) {
        const media = await upsertSingleMedia(rawItem);
        createdMedias.push(media);
      }

      return NextResponse.json(
        { medias: createdMedias, media: createdMedias[0] },
        { status: 201 }
      );
    }

    // Mode unitaire rétrocompatible
    try {
      const media = await upsertSingleMedia(body);
      return NextResponse.json({ media }, { status: 201 });
    } catch (validationErr) {
      return NextResponse.json(
        {
          error:
            validationErr instanceof Error
              ? validationErr.message
              : "Données de média invalides",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erreur enregistrement média:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible d'enregistrer le média en base de données",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/media
 * Suppression groupée de plusieurs médias non utilisés ({ ids: string[] })
 */
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé : session administrateur requise" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const ids: string[] = Array.isArray(body.ids)
      ? body.ids.filter((id: unknown): id is string => typeof id === "string" && id.trim().length > 0)
      : [];

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Aucun identifiant de média fourni pour la suppression" },
        { status: 400 }
      );
    }

    // Vérifier quels médias sont utilisés dans des projets
    const mediasToCheck = await prisma.media.findMany({
      where: { id: { in: ids } },
      include: {
        coverForProjects: { select: { id: true, titre: true } },
        projectGalleries: { select: { projectId: true } },
        profilesHero: { select: { id: true } },
      },
    });

    const deletableIds: string[] = [];
    const skippedCount = { used: 0 };

    for (const m of mediasToCheck) {
      const isUsed =
        m.coverForProjects.length > 0 ||
        m.projectGalleries.length > 0 ||
        m.profilesHero.length > 0;
      if (isUsed) {
        skippedCount.used++;
      } else {
        deletableIds.push(m.id);
      }
    }

    if (deletableIds.length > 0) {
      await prisma.media.deleteMany({
        where: { id: { in: deletableIds } },
      });
    }

    return NextResponse.json({
      deletedIds: deletableIds,
      deletedCount: deletableIds.length,
      skippedUsedCount: skippedCount.used,
    });
  } catch (error) {
    console.error("Erreur suppression groupée médias:", error);
    return NextResponse.json(
      { error: "Impossible de supprimer les médias sélectionnés" },
      { status: 500 }
    );
  }
}
