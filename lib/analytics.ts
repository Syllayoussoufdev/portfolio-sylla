import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

interface TrackVisitOptions {
  projectId?: string;
  subPortfolioId?: string;
  referer?: string;
}

/**
 * Enregistre anonymement une visite (sans cookie tiers, respectueux de la vie privée)
 */
export async function trackVisit(path: string, options?: TrackVisitOptions) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;

    // Ne pas compter les requêtes des bots de crawl évidents ou du prefetch
    if (userAgent && /bot|crawl|spider|slurp|lighthouse/i.test(userAgent)) {
      return;
    }

    await prisma.visit.create({
      data: {
        path,
        projectId: options?.projectId || null,
        subPortfolioId: options?.subPortfolioId || null,
        userAgent: userAgent ? userAgent.slice(0, 500) : null,
      },
    });
  } catch (err) {
    // Échec silencieux pour ne jamais bloquer le rendu de la page
    console.warn("[Analytics] Échec de l'enregistrement de visite :", err);
  }
}
