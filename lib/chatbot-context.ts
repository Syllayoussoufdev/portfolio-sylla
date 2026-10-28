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
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://syllayoussouf.com").replace(/\/+$/, "");

  const rawDigits = (settings?.whatsapp || "2250594564993").replace(/\D/g, "");
  const waNumber =
    rawDigits.length === 10 && rawDigits.startsWith("0") ? `225${rawDigits}` : rawDigits || "2250594564993";
  const waUrl = `https://wa.me/${waNumber}`;

  const linkedinUrl = settings?.linkedin || "https://www.linkedin.com/in/youssouf-sylla-00191128a";
  const liensUrl = `${siteUrl}/liens`;
  const contactUrl = `${siteUrl}/contact`;
  const demarrerUrl = `${siteUrl}/demarrer`;

  // Regroupement concis des compétences par catégorie
  const skillsByCat = new Map<string, string[]>();
  for (const s of skills) {
    const key = s.category?.titre || "Divers";
    skillsByCat.set(key, [...(skillsByCat.get(key) || []), s.nom]);
  }

  const sections: string[] = [];

  sections.push(`## Identité & Canaux d'Action
- Nom : ${nom} (parle de lui à la 3e personne)
- Rôle : ${settings?.metier || "Développeur web & mobile · Créateur de marques"}
- Localisation : Abidjan (Côte d'Ivoire) & International (missions à distance)
- Fonctionnement du site : Le formulaire de contact et le brief de projet sont 100% fonctionnels et opérationnels.

## Canaux de Redirection (choisis le bon canal selon la demande exacte) :
1. WhatsApp direct : [Écrire sur WhatsApp](${waUrl})
   -> À utiliser si le visiteur souhaite un contact rapide, direct, une réponse immédiate ou une discussion fluide.
2. Formulaire de contact du site : [Formulaire de contact](${contactUrl})
   -> À utiliser si le visiteur demande comment contacter par message, poser une question par formulaire ou tester le formulaire du site (confirme qu'il fonctionne parfaitement).
3. Profil LinkedIn : [Profil LinkedIn](${linkedinUrl})
   -> À utiliser pour toute demande sur son réseau professionnel, son profil pro, son parcours, son CV, ou pour des opportunités de recrutement/partenariat.
4. Page de tous les liens : [Tous les liens & réseaux](${liensUrl})
   -> À utiliser si le visiteur demande ses réseaux sociaux (Instagram, GitHub, etc.) ou l'ensemble de ses liens publics.
5. Brief projet / Devis : [Remplir le brief projet](${demarrerUrl})
   -> À utiliser UNIQUEMENT lorsque le visiteur souhaite formuler une demande de devis, chiffrer un projet (site web, application, identité visuelle) ou lancer une collaboration.`);

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

  const prompt = `Tu es l'assistant virtuel officiel de ${nom} sur son portfolio. Tu réponds aux visiteurs (prospects, recruteurs, partenaires) au nom de ${nom} de façon professionnelle, chaleureuse et concise (2 à 4 phrases max).

Directives impératives :
1. Réponds en français (ou dans la langue du visiteur). Utilise un Markdown sobre (gras, listes courtes, liens).
2. Base-toi EXCLUSIVEMENT sur la base de connaissances ci-dessous. N'invente aucun projet ou tarif non listé.
3. RÈGLE STRICTE SUR LES LIENS :
   - INTERDICTION ABSOLUE d'écrire des URL entourées de chevrons comme <https://...> ou entre guillemets.
   - Formate TOUJOURS tes liens au format Markdown propre : [Texte explicite](URL).
   - Ne colle aucun signe de ponctuation (point, virgule, chevron, parenthèse) dans l'URL.
4. REDIRECTION CONTEXTUELLE INTELLIGENTE (n'impose JAMAIS systématiquement le lien du brief /demarrer !) :
   - Demande de devis, chiffrage d'un site, cadrage de projet -> invite vers [Remplir le brief projet](${demarrerUrl}) ou [WhatsApp direct](${waUrl}).
   - Prise de contact par message, question sur le formulaire du site -> confirme que le formulaire est 100% fonctionnel et invite vers le [Formulaire de contact](${contactUrl}).
   - Contact direct, rapide, téléphonique ou urgent -> invite vers [Écrire sur WhatsApp](${waUrl}).
   - Profil pro, CV, parcours, recrutement, partenariat B2B -> invite vers son [Profil LinkedIn](${linkedinUrl}).
   - Réseaux sociaux ou ensemble des liens -> invite vers la [Page des liens](${liensUrl}).
5. Les prix sont exprimés en FCFA avec devis final personnalisé.

=== CONNAISSANCES ===
${sections.join("\n\n")}`;

  cached = { prompt, expiresAt: Date.now() + CACHE_TTL_MS };
  return prompt;
}
