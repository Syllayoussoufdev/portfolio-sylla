import { prisma } from "./prisma";
import { getSiteSettings } from "./profiles";
import { formatFCFA } from "./devcreative-catalog";

/**
 * Construit un prompt système compact, dense et riche en contexte métier.
 * Optimisé pour le quota gratuit Groq (environ 800 à 1 000 tokens)
 * pour éviter d'atteindre le plafond de Tokens Par Minute (TPM).
 * Mis en cache en mémoire pendant 10 minutes.
 */

const CACHE_TTL_MS = 10 * 60 * 1000;
let cached: { prompt: string; expiresAt: number } | null = null;

function truncate(text: string | null | undefined, max = 120): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.warn("[chatbot-context] lecture partielle impossible :", err);
    return fallback;
  }
}

export async function buildChatbotSystemPrompt(): Promise<string> {
  if (cached && cached.expiresAt > Date.now()) return cached.prompt;

  const [settings, projects, skills, parcours, offers, packs, faqs] = await Promise.all([
    safe(() => getSiteSettings(), null),
    safe(
      () =>
        prisma.project.findMany({
          where: { visible: true },
          select: {
            titre: true,
            slug: true,
            description: true,
            tags: true,
            client: true,
            secteur: true,
          },
          orderBy: [{ featured: "desc" }, { ordre: "asc" }],
          take: 12,
        }),
      []
    ),
    safe(
      () =>
        prisma.skill.findMany({
          where: { visible: true },
          select: {
            nom: true,
            category: { select: { titre: true } },
          },
          orderBy: [{ ordre: "asc" }],
        }),
      []
    ),
    safe(
      () =>
        prisma.parcoursItem.findMany({
          where: { visible: true },
          select: {
            type: true,
            titre: true,
            organisme: true,
            anneeDebut: true,
            anneeFin: true,
            enCours: true,
          },
          orderBy: [{ anneeDebut: "desc" }],
          take: 6,
        }),
      []
    ),
    safe(
      () =>
        prisma.serviceOffer.findMany({
          where: { visible: true },
          orderBy: [{ phase: "asc" }, { ordre: "asc" }],
          select: {
            titre: true,
            accroche: true,
            delai: true,
            prixDepuis: true,
            prixLabel: true,
          },
          take: 6,
        }),
      []
    ),
    safe(
      () =>
        prisma.servicePack.findMany({
          where: { visible: true },
          select: {
            titre: true,
            prix: true,
            delai: true,
            servicesInclus: true,
          },
          orderBy: [{ ordre: "asc" }],
          take: 4,
        }),
      []
    ),
    safe(
      () =>
        prisma.faqItem.findMany({
          where: { visible: true },
          select: { question: true, reponse: true },
          orderBy: [{ ordre: "asc" }],
          take: 4,
        }),
      []
    ),
  ]);

  const nom = settings?.nom || "Sylla Youssouf";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://syllayoussouf.com";

  // Regroupement concis des compétences par catégorie
  const skillsByCat = new Map<string, string[]>();
  for (const s of skills) {
    const key = s.category?.titre || "Divers";
    skillsByCat.set(key, [...(skillsByCat.get(key) || []), s.nom]);
  }

  const sections: string[] = [];

  sections.push(`## Identité & Contact
- Nom : ${nom} (parle de lui à la 3e personne)
- Rôle : ${settings?.metier || "Développeur web & mobile · Créateur de marques"}
- Localisation : Abidjan (Côte d'Ivoire) & International (missions à distance)
- WhatsApp direct : ${settings?.whatsapp || "+225 05 94 56 49 93"}
- Brief projet : ${siteUrl}/demarrer
- Réseaux : ${siteUrl}/liens`);

  if (skillsByCat.size > 0) {
    sections.push(
      `## Compétences\n` +
        [...skillsByCat.entries()]
          .map(([cat, list]) => `- ${cat} : ${list.slice(0, 6).join(", ")}`)
          .join("\n")
    );
  }

  if (offers.length > 0) {
    sections.push(
      `## Offres & Tarifs indicatifs (en FCFA)\n` +
        offers
          .map((o) => {
            const prix = o.prixLabel || (o.prixDepuis ? `dès ${formatFCFA(o.prixDepuis)}` : "Sur devis");
            return `- ${o.titre} (${prix}, délai ${o.delai}) : ${truncate(o.accroche, 90)}`;
          })
          .join("\n")
    );
  }

  if (packs.length > 0) {
    sections.push(
      `## Packs clés en main\n` +
        packs
          .map((p) => `- ${p.titre} : ${formatFCFA(p.prix)} (${p.delai}) — Inclus : ${p.servicesInclus.slice(0, 3).join(", ")}`)
          .join("\n")
    );
  }

  if (projects.length > 0) {
    sections.push(
      `## Réalisations phares (liens : ${siteUrl}/projets/<slug>)\n` +
        projects
          .map((p) => `- ${p.titre} (${siteUrl}/projets/${p.slug}) : ${truncate(p.description, 100)} [${p.tags.slice(0, 3).join(", ")}]`)
          .join("\n")
    );
  }

  if (parcours.length > 0) {
    sections.push(
      `## Parcours\n` +
        parcours
          .map((p) => {
            const annee = p.enCours ? `${p.anneeDebut}-en cours` : `${p.anneeDebut}`;
            return `- [${p.type}] ${p.titre} — ${p.organisme} (${annee})`;
          })
          .join("\n")
    );
  }

  if (faqs.length > 0) {
    sections.push(`## FAQ\n` + faqs.map((f) => `- Q : ${f.question}\n  R : ${truncate(f.reponse, 140)}`).join("\n"));
  }

  const prompt = `Tu es l'assistant virtuel officiel de ${nom} sur son portfolio. Tu réponds aux visiteurs (prospects, recruteurs, partenaires) au nom de ${nom} de façon professionnelle, bienveillante et concise (2 à 5 phrases max).

Directives :
1. Réponds en français (ou dans la langue du visiteur). Utilise du Markdown sobre (gras, listes courtes, liens).
2. Base-toi EXCLUSIVEMENT sur la base de connaissances ci-dessous. N'invente aucun projet, tarif ou promesse non listée. Si une info manque, invite cordialement à échanger avec Youssouf sur WhatsApp ou via le brief ${siteUrl}/demarrer.
3. Oriente vers l'action : invite à démarrer un projet ou à écrire sur WhatsApp.
4. Les prix sont exprimés en FCFA avec devis final personnalisé.

=== CONNAISSANCES ===
${sections.join("\n\n")}`;

  cached = { prompt, expiresAt: Date.now() + CACHE_TTL_MS };
  return prompt;
}
