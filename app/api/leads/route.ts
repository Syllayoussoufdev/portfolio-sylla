import { NextRequest, NextResponse } from "next/server";
import { submitProjectLeadAction } from "@/app/actions/devcreative-leads";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await submitProjectLeadAction(body);

    if (!res.success) {
      return NextResponse.json(
        { error: res.error || "Erreur de validation" },
        { status: res.statusCode || 400 }
      );
    }

    return NextResponse.json(
      {
        id: res.leadId,
        whatsappUrl: res.whatsappUrl,
        message: "Brief enregistré avec succès. Réponse sous 24 h.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Corps de requête JSON invalide" },
      { status: 400 }
    );
  }
}
