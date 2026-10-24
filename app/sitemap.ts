import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://syllayoussouf.com";

  // 1. Pages statiques principales du site
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projets`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/demarrer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/liens`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/confidentialite`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 2. Profils publics actifs (ex: /dev, /video, /design)
  let profileRoutes: MetadataRoute.Sitemap = [];
  try {
    const activeProfiles = await prisma.profile.findMany({
      where: { actif: true, slug: { not: "default" } },
      select: { slug: true, updatedAt: true },
    });

    profileRoutes = activeProfiles.map((p) => ({
      url: `${baseUrl}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  } catch (err) {
    console.warn("[Sitemap] Erreur récupération profils :", err);
  }

  // 3. Projets publics visibles (ex: /projets/blog-wordpress-headless-nextjs)
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const visibleProjects = await prisma.project.findMany({
      where: { visible: true },
      select: { slug: true, updatedAt: true },
    });

    projectRoutes = visibleProjects.map((proj) => ({
      url: `${baseUrl}/projets/${proj.slug}`,
      lastModified: proj.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.warn("[Sitemap] Erreur récupération projets :", err);
  }

  return [...staticRoutes, ...profileRoutes, ...projectRoutes];
}
