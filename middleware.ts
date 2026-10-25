import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";
const SESSION_IDLE_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 heures d'inactivité max
const SESSION_ABSOLUTE_MAX_AGE_SECONDS = 60 * 60 * 48; // 48 heures max absolu depuis login
const REFRESH_THRESHOLD_SECONDS = 60 * 15; // Rafraîchir le jeton si > 15 min d'activité

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const nowSec = Math.floor(Date.now() / 1000);

  let isAuthenticated = false;
  let sessionPayload: {
    email?: string;
    role?: string;
    loginAt?: number;
    iat?: number;
    exp?: number;
  } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, getJwtSecret(), {
        algorithms: ["HS256"],
      });

      const loginAt = typeof payload.loginAt === "number" ? payload.loginAt : null;
      const iat = typeof payload.iat === "number" ? payload.iat : null;

      // Vérifie :
      // 1. Rôle admin
      // 2. Présence de loginAt (révoque immédiatement les anciens cookies de 7 jours)
      // 3. Moins de 48h depuis la connexion initiale (expiration absolue)
      // 4. Moins de 24h depuis la dernière activité (expiration d'inactivité)
      if (
        payload &&
        payload.role === "admin" &&
        typeof payload.email === "string" &&
        loginAt !== null &&
        nowSec - loginAt < SESSION_ABSOLUTE_MAX_AGE_SECONDS &&
        (iat === null || nowSec - iat < SESSION_IDLE_MAX_AGE_SECONDS)
      ) {
        isAuthenticated = true;
        sessionPayload = {
          email: payload.email,
          role: payload.role,
          loginAt,
          iat: iat ?? nowSec,
          exp: typeof payload.exp === "number" ? payload.exp : undefined,
        };
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. Protection des routes API /api/admin/* (réponse JSON 401 au lieu d'une redirection HTML)
  if (pathname.startsWith("/api/admin")) {
    if (!isAuthenticated) {
      const res = NextResponse.json(
        { error: "Non autorisé : session administrateur expirée ou requise" },
        { status: 401 }
      );
      if (token) {
        res.cookies.delete(COOKIE_NAME);
      }
      return res;
    }
    return NextResponse.next();
  }

  // 2. Protection des pages d'administration /admin/*
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    // Rediriger l'utilisateur authentifié qui tente d'aller sur /admin/login vers /admin
    if (isLoginPage && isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Rediriger l'utilisateur non authentifié (ou dont la session a expiré) vers /admin/login
    if (!isLoginPage && !isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const res = NextResponse.redirect(loginUrl);
      if (token) {
        // Supprime explicitement le cookie expiré ou révoqué
        res.cookies.delete(COOKIE_NAME);
      }
      return res;
    }

    // Si l'utilisateur est authentifié et actif, prolonger la fenêtre d'inactivité de 24h
    // (tout en respectant le plafond absolu de 48h depuis loginAt)
    const response = NextResponse.next();
    if (
      isAuthenticated &&
      sessionPayload &&
      sessionPayload.email &&
      sessionPayload.loginAt &&
      sessionPayload.iat &&
      nowSec - sessionPayload.iat >= REFRESH_THRESHOLD_SECONDS
    ) {
      const remainingAbsolute = Math.max(
        0,
        sessionPayload.loginAt + SESSION_ABSOLUTE_MAX_AGE_SECONDS - nowSec
      );
      const effectiveMaxAge = Math.min(SESSION_IDLE_MAX_AGE_SECONDS, remainingAbsolute);

      if (effectiveMaxAge > 0) {
        const refreshedToken = await new SignJWT({
          email: sessionPayload.email,
          role: "admin",
          loginAt: sessionPayload.loginAt,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt(nowSec)
          .setExpirationTime(nowSec + effectiveMaxAge)
          .sign(getJwtSecret());

        response.cookies.set(COOKIE_NAME, refreshedToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: effectiveMaxAge,
        });
      }
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
