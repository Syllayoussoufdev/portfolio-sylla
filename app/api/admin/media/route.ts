import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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

    if (!publicId || typeof publicId !== "string") {
      return NextResponse.json(
        { error: "Le publicId Cloudinary est obligatoire" },
        { status: 400 }
      );
    }

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "L'URL Cloudinary est obligatoire" },
        { status: 400 }
      );
    }

    if (!alt || typeof alt !== "string" || !alt.trim()) {
      return NextResponse.json(
        { error: "Le texte alternatif (alt) est obligatoire pour l'accessibilité" },
        { status: 400 }
      );
    }

    // Vérifier si le média existe déjà
    const existing = await prisma.media.findUnique({
      where: { publicId },
    });

    if (existing) {
      return NextResponse.json({ media: existing });
    }

    const media = await prisma.media.create({
      data: {
        publicId,
        url,
        width: Number(width) || 0,
        height: Number(height) || 0,
        format: String(format || "jpg"),
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
