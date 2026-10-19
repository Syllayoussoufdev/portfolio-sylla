/**
 * Gestionnaire de limitation de débit (Rate Limiting) en mémoire.
 * Utilisé pour protéger les points d'entrée sensibles (authentification admin, formulaires).
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Nettoyage régulier pour éviter les fuites mémoire
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 60000).unref?.();
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Vérifie si une action est autorisée selon une clé et un quota.
 * @param key Identifiant de l'entité (ex: IP, email, action:id)
 * @param maxAttempts Nombre maximum de tentatives autorisées
 * @param windowMs Durée de la fenêtre en millisecondes
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes par défaut
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    return {
      allowed: true,
      remaining: maxAttempts,
      retryAfterSeconds: 0,
    };
  }

  if (record.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    retryAfterSeconds: 0,
  };
}

/**
 * Incrémente le compteur de tentatives échouées.
 */
export function incrementRateLimit(
  key: string,
  windowMs: number = 15 * 60 * 1000
): void {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
  } else {
    record.count += 1;
  }
}

/**
 * Réinitialise le compteur après une tentative réussie.
 */
export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}
