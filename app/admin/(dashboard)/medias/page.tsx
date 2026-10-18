import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MediasClient, type MediaWithUsage } from "./MediasClient";

export const dynamic = "force-dynamic";

export default async function MediasAdminPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const rawMedias = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      coverForProjects: {
        select: { id: true, titre: true, slug: true },
      },
      projectGalleries: {
        include: {
          project: {
            select: { id: true, titre: true, slug: true },
          },
        },
      },
    },
  });

  const medias: MediaWithUsage[] = rawMedias.map((m) => ({
    id: m.id,
    publicId: m.publicId,
    url: m.url,
    width: m.width,
    height: m.height,
    format: m.format,
    bytes: m.bytes,
    alt: m.alt,
    createdAt: m.createdAt.toISOString(),
    coverForProjects: m.coverForProjects,
    projectGalleries: m.projectGalleries.map((g) => ({
      project: g.project,
    })),
  }));

  return <MediasClient initialMedias={medias} />;
}
