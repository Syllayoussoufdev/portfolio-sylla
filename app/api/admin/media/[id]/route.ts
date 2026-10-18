import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/admin/media/[id]
 * Supprime un média dans Cloudinary et en base de données Neon.
 * Refuse la suppression avec HTTP 400 si le média est encore rattaché à un projet.
 */
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé : session administrateur requise" },
        { status: 401 }
      );
    }

    const { id } = await props.params;

    if (!id) {
      return NextResponse.json({ error: "Identifiant média manquant" }, { status: 400 });
    }

    // Récupérer le média avec ses usages
    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        coverForProjects: {
          select: { id: true, titre: true },
        },
        projectGalleries: {
          include: {
            project: {
              select: { id: true, titre: true },
            },
          },
        },
      },
    });

    if (!media) {
      return NextResponse.json({ error: "Média introuvable" }, { status: 404 });
    }

    // Vérifier si le média est utilisé
    const coverCount = media.coverForProjects.length;
    const galleryCount = media.projectGalleries.length;

    if (coverCount > 0 || galleryCount > 0) {
      const usedProjects: string[] = [];
      media.coverForProjects.forEach((p) => {
        if (!usedProjects.includes(p.titre)) usedProjects.push(p.titre);
      });
      media.projectGalleries.forEach((g) => {
        if (!usedProjects.includes(g.project.titre)) usedProjects.push(g.project.titre);
      });

      return NextResponse.json(
        {
          error: `Suppression impossible : ce média est utilisé par ${usedProjects.length} projet(s) (${usedProjects.join(", ")}). Détachez-le d'abord du ou des projets.`,
        },
        { status: 400 }
      );
    }

    // Supprimer dans Cloudinary si configuré
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret && media.publicId) {
      try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const stringToSign = `public_id=${media.publicId}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

        const formData = new URLSearchParams();
        formData.append("public_id", media.publicId);
        formData.append("timestamp", timestamp.toString());
        formData.append("api_key", apiKey);
        formData.append("signature", signature);

        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
          {
            method: "POST",
            body: formData,
          }
        );

        const cloudinaryData = await cloudinaryRes.json();
        if (cloudinaryData.result !== "ok" && cloudinaryData.result !== "not found") {
          console.warn("Avertissement Cloudinary lors de la suppression:", cloudinaryData);
        }
      } catch (err) {
        console.error("Erreur lors de l'appel Cloudinary destroy:", err);
        // On continue la suppression en base pour ne pas bloquer l'admin si Cloudinary a déjà purgé
      }
    }

    // Supprimer de la base Neon
    await prisma.media.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Média supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression média:", error);
    return NextResponse.json(
      { error: "Impossible de supprimer le média" },
      { status: 500 }
    );
  }
}
