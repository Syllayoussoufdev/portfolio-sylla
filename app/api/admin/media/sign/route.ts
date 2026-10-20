import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé : session administrateur requise" },
        { status: 401 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error:
            "Configuration Cloudinary incomplète sur le serveur (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).",
        },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const timestamp = Math.round(new Date().getTime() / 1000);
    const allowedFolders = ["portfolio/projets", "portfolio/profils"];
    const folder = allowedFolders.includes(body.folder) ? body.folder : "portfolio/projets";

    const paramsToSign: Record<string, string | number> = {
      folder,
      timestamp,
    };

    // Cloudinary requiert que tous les paramètres soient triés par ordre alphabétique
    const sortedKeys = Object.keys(paramsToSign).sort();
    const stringToSign =
      sortedKeys.map((k) => `${k}=${paramsToSign[k]}`).join("&") + apiSecret;

    const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    });
  } catch (error) {
    console.error("Erreur génération signature Cloudinary:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de la signature Cloudinary" },
      { status: 500 }
    );
  }
}
