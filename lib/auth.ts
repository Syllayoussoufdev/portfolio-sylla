import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export const COOKIE_NAME = "admin_session";

/**
 * Norme de sécurité Back-Office Admin (OWASP) :
 * - Expiration après inactivité (Idle Timeout) : 24 heures sans manipulation
 * - Durée maximale absolue (Absolute Timeout) : 48 heures depuis la connexion initiale
 */
export const SESSION_IDLE_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 heures
export const SESSION_ABSOLUTE_MAX_AGE_SECONDS = 60 * 60 * 48; // 48 heures

function getJwtSecret(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Sécurité critique : AUTH_SECRET ou NEXTAUTH_SECRET doit être défini en production avec au moins 32 caractères."
      );
    }
    return new TextEncoder().encode("dev_local_secret_only_for_testing_purposes_min_32_chars");
  }
  if (secret.length < 32 && process.env.NODE_ENV === "production") {
    throw new Error("Sécurité critique : AUTH_SECRET doit comporter au moins 32 caractères.");
  }
  return new TextEncoder().encode(secret);
}

export interface AdminSession {
  email: string;
  role: "admin";
  /** Timestamp Unix (secondes) de la connexion initiale pour l'expiration absolue à 48h */
  loginAt?: number;
  iat?: number;
  exp?: number;
}

/**
 * Signe un jeton de session JWT avec expiration d'inactivité à 24 heures
 * (plafonné par la limite absolue de 48 heures depuis loginAt)
 */
export async function signSessionToken(
  payload: AdminSession,
  customExpirationSeconds?: number
): Promise<string> {
  const nowSec = Math.floor(Date.now() / 1000);
  const loginAt = payload.loginAt ?? nowSec;
  const remainingAbsolute = Math.max(0, loginAt + SESSION_ABSOLUTE_MAX_AGE_SECONDS - nowSec);
  const effectiveMaxAge =
    customExpirationSeconds !== undefined
      ? customExpirationSeconds
      : Math.min(SESSION_IDLE_MAX_AGE_SECONDS, remainingAbsolute);

  return new SignJWT({
    email: payload.email,
    role: payload.role,
    loginAt,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(nowSec)
    .setExpirationTime(nowSec + effectiveMaxAge)
    .sign(getJwtSecret());
}

/**
 * Vérifie l'intégrité, l'expiration d'inactivité (24h) et l'expiration absolue (48h) d'un jeton JWT
 */
export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });

    const session = payload as unknown as AdminSession;
    if (!session || session.role !== "admin" || !session.email) {
      return null;
    }

    // Vérification de la limite absolue de 48 heures depuis la connexion initiale
    // (et révocation immédiate des anciens jetons de 7 jours dépourvus de loginAt)
    const nowSec = Math.floor(Date.now() / 1000);
    if (
      typeof session.loginAt !== "number" ||
      nowSec - session.loginAt >= SESSION_ABSOLUTE_MAX_AGE_SECONDS
    ) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Récupère et valide la session courante à partir des cookies côté serveur
 */
export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Crée le cookie de session sécurisé HttpOnly (valide 24h sans activité, 48h max absolu)
 */
export async function createSession(email: string) {
  const nowSec = Math.floor(Date.now() / 1000);
  const token = await signSessionToken({
    email,
    role: "admin",
    loginAt: nowSec,
  });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_IDLE_MAX_AGE_SECONDS, // 24 heures d'inactivité max
  });
}

/**
 * Supprime la session (déconnexion)
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Vérifie les identifiants admin fournis par rapport aux variables d'environnement
 */
export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || "contact@syllayoussouf.com";
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const rawPassword = process.env.ADMIN_PASSWORD;

  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
    return false;
  }

  // 1. Vérification par hash bcrypt si configuré
  if (passwordHash) {
    const isValid = await bcrypt.compare(password, passwordHash);
    if (isValid) return true;
  }

  // 2. Fallback sur mot de passe brut strictement réservé au développement local
  if (process.env.NODE_ENV !== "production" && rawPassword && password === rawPassword) {
    return true;
  }

  return false;
}
