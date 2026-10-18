import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "admin_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "default_fallback_secret_change_me_in_env_32chars"
);

export interface AdminSession {
  email: string;
  role: "admin";
  exp?: number;
}

/**
 * Signe un jeton de session JWT avec expiration à 7 jours
 */
export async function signSessionToken(payload: AdminSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

/**
 * Vérifie l'intégrité d'un jeton JWT
 */
export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    return payload as unknown as AdminSession;
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
 * Crée le cookie de session sécurisé HttpOnly
 */
export async function createSession(email: string) {
  const token = await signSessionToken({ email, role: "admin" });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
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

  // 2. Fallback temporaire sur mot de passe brut si configuré pour les tests
  if (rawPassword && password === rawPassword) {
    return true;
  }

  return false;
}
