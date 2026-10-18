import "dotenv/config";
import { prisma } from "../lib/prisma";

/**
 * Script de simulation (DRY-RUN) pour la migration des images existantes vers le modèle Media.
 * IMPORTANT : Ce script est strictement en lecture seule et ne modifie rien en base.
 */
async function dryRunMigration() {
  console.log("=================================================================");
  console.log("   SIMULATION DE MIGRATION DES IMAGES VERS LE MODÈLE MEDIA       ");
  console.log("   (MODE DRY-RUN : STRICTEMENT AUCUNE ÉCRITURE EN BASE)          ");
  console.log("=================================================================\n");

  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        titre: true,
        slug: true,
        coverImage: true,
        coverMediaId: true,
        links: true,
        mediaGallery: {
          select: {
            mediaId: true,
            position: true,
          },
        },
      },
    });

    console.log(`📦 Nombre total de projets analysés : ${projects.length}\n`);

    let projectsWithCover = 0;
    let projectsWithCoverMedia = 0;
    let projectsWithLegacyCoverOnly = 0;
    let projectsWithGallery = 0;
    const legacyImagesToMigrate: Array<{
      projectId: string;
      projectTitle: string;
      type: "cover" | "gallery";
      url: string;
      isCloudinary: boolean;
    }> = [];

    for (const p of projects) {
      if (p.coverImage) {
        projectsWithCover++;
        if (p.coverMediaId) {
          projectsWithCoverMedia++;
        } else {
          projectsWithLegacyCoverOnly++;
          legacyImagesToMigrate.push({
            projectId: p.id,
            projectTitle: p.titre,
            type: "cover",
            url: p.coverImage,
            isCloudinary: p.coverImage.includes("cloudinary.com"),
          });
        }
      }

      const links = (p.links || {}) as Record<string, unknown>;
      if (Array.isArray(links.gallery) && links.gallery.length > 0) {
        projectsWithGallery++;
        for (const url of links.gallery) {
          if (typeof url === "string") {
            legacyImagesToMigrate.push({
              projectId: p.id,
              projectTitle: p.titre,
              type: "gallery",
              url,
              isCloudinary: url.includes("cloudinary.com"),
            });
          }
        }
      }
    }

    console.log("-----------------------------------------------------------------");
    console.log("📊 STATISTIQUES D'INVENTAIRE :");
    console.log(`  • Projets avec coverImage          : ${projectsWithCover}`);
    console.log(`  • Projets déjà liés à un Media     : ${projectsWithCoverMedia}`);
    console.log(`  • Projets avec coverImage héritée  : ${projectsWithLegacyCoverOnly}`);
    console.log(`  • Projets avec links.gallery       : ${projectsWithGallery}`);
    console.log(`  • Total images héritées détectées  : ${legacyImagesToMigrate.length}`);
    console.log("-----------------------------------------------------------------\n");

    if (legacyImagesToMigrate.length > 0) {
      console.log("📋 DÉTAIL DES IMAGES CANDIDATES À UNE MIGRATION :");
      legacyImagesToMigrate.forEach((img, idx) => {
        const cldBadge = img.isCloudinary ? "[CLOUDINARY]" : "[EXTERNE]";
        console.log(`  [${idx + 1}] ${cldBadge} Proj: "${img.projectTitle}" (${img.type})`);
        console.log(`      URL: ${img.url}`);
      });
    } else {
      console.log("✅ Aucune image orpheline ou héritée à migrer.");
    }

    // Médias actuellement enregistrés dans la table Media
    const totalMediaCount = await prisma.media.count();
    console.log(`\n🗂️ Nombre d'entrées dans la table Media : ${totalMediaCount}`);

    console.log("\n=================================================================");
    console.log("   FIN DU DRY-RUN : AUCUNE MODIFICATION EFFECTUÉE EN BASE.       ");
    console.log("=================================================================");
  } catch (error) {
    console.error("❌ Erreur lors de l'exécution du dry-run :", error);
  } finally {
    await prisma.$disconnect();
  }
}

dryRunMigration();
