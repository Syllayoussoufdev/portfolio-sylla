import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

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

  let isAuthenticated = false;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, getJwtSecret(), {
        algorithms: ["HS256"],
      });
      if (payload && payload.role === "admin") {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. Protection des routes API /api/admin/* (réponse JSON 401 au lieu d'une redirection HTML)
  if (pathname.startsWith("/api/admin")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Non autorisé : session administrateur requise" },
        { status: 401 }
      );
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

    // Rediriger l'utilisateur non authentifié vers /admin/login
    if (!isLoginPage && !isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
