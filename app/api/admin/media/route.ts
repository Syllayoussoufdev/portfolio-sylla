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

/**
 * POST /api/admin/media
 * Enregistre un média uploadé directement sur Cloudinary
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
    const { publicId, url, width, height, format, bytes, alt } = body;

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { error: "L'URL de l'image est obligatoire" },
        { status: 400 }
      );
    }

    if (!alt || typeof alt !== "string" || !alt.trim()) {
      return NextResponse.json(
        { error: "Le texte alternatif (alt) est obligatoire pour l'accessibilité" },
        { status: 400 }
      );
    }

    const cleanUrl = normalizeImageUrl(url.trim());
    const finalPublicId =
      publicId && typeof publicId === "string" && publicId.trim()
        ? publicId.trim()
        : "url_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);

    // Vérifier si le média existe déjà (par publicId ou par URL)
    const existing = await prisma.media.findFirst({
      where: {
        OR: [{ publicId: finalPublicId }, { url: cleanUrl }],
      },
    });

    if (existing) {
      return NextResponse.json({ media: existing });
    }

    // Détection basique du format depuis l'URL si non fourni
    let detectedFormat = (format && String(format)) || "jpg";
    if (!format && cleanUrl.includes(".")) {
      const ext = cleanUrl.split(".").pop()?.split("?")[0]?.toLowerCase();
      if (ext && ["png", "jpg", "jpeg", "webp", "avif", "gif", "svg"].includes(ext)) {
        detectedFormat = ext;
      }
    }

    const media = await prisma.media.create({
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

    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    console.error("Erreur enregistrement média:", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer le média en base de données" },
      { status: 500 }
    );
  }
}
