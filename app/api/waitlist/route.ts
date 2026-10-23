import { NextRequest, NextResponse } from "next/server";
import { submitWaitlistAction } from "@/app/actions/devcreative-leads";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await submitWaitlistAction(body);

    if (!res.success) {
      return NextResponse.json(
        { error: res.error || "Erreur de validation" },
        { status: res.statusCode || 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Vous êtes inscrit sur la liste d'attente prioritaire.",
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
