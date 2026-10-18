/**
 * Liste partagée des slugs réservés par l'application Next.js.
 * Aucun profil ou sous-portfolio ne peut utiliser ces slugs pour éviter les conflits de routage avec /[profil].
 * Référence : PRD.md (section 6)
 */
export const RESERVED_SLUGS = [
  "admin",
  "api",
  "projets",
  "contact",
  "competences",
  "a-propos",
  "login",
  "connexion",
  "mentions-legales",
  "confidentialite",
  "sitemap.xml",
  "robots.txt",
  "_next",
  "favicon.ico",
  "design",
  "medias",
] as const;

export type ReservedSlug = (typeof RESERVED_SLUGS)[number];

/**
 * Vérifie si un slug donné est réservé par le système.
 */
export function isReservedSlug(slug: string): boolean {
  if (!slug) return false;
  const normalized = slug.trim().toLowerCase();
  return (RESERVED_SLUGS as readonly string[]).includes(normalized);
}

/**
 * Valide le format et la disponibilité d'un slug de profil.
 */
export function validateProfileSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug || !slug.trim()) {
    return { valid: false, error: "Le slug ne peut pas être vide." };
  }

  const raw = slug.trim();

  // Rejet strict si majuscules présentes
  if (raw !== raw.toLowerCase()) {
    return {
      valid: false,
      error: "Le slug ne doit comporter que des lettres minuscules.",
    };
  }

  // Autoriser "default" explicitement pour la page d'accueil principale
  if (raw === "default") {
    return { valid: true };
  }

  if (isReservedSlug(raw)) {
    return {
      valid: false,
      error: `Le slug "/${raw}" est réservé par le système et ne peut pas être attribué à un profil.`,
    };
  }

  if (!/^[a-z0-9-]+$/.test(raw)) {
    return {
      valid: false,
      error: "Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets.",
    };
  }

  if (raw.startsWith("-") || raw.endsWith("-")) {
    return {
      valid: false,
      error: "Le slug ne peut pas commencer ou se terminer par un tiret.",
    };
  }

  return { valid: true };
}
