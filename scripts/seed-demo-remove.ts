import "dotenv/config";
import { prisma } from "../lib/prisma";

/**
 * Script de suppression sécurisée des projets de démonstration ("demo-*")
 *
 * Règles absolues :
 * 1. Par défaut, mode SIMULATION uniquement (affiche ce qui serait supprimé sans toucher à la base).
 * 2. N'exécute la suppression réelle que si le drapeau "--apply" est présent.
 * 3. Ne cible QUE les projets dont le slug commence strictement par "demo-".
 * 4. Ne touche JAMAIS aux projets réels, aux profils ni aux réglages SiteSettings.
 * 5. Refuse de s'exécuter si NODE_ENV=production.
 */
async function removeDemoData() {
  const isApply = process.argv.includes("--apply");

  console.log("=================================================================");
  console.log("   SUPPRESSION SÉCURISÉE DES DONNÉES DE DÉMONSTRATION (DEMO-*)   ");
  console.log(`   MODE : ${isApply ? "⚠️ ÉCRITURE RÉELLE (--apply)" : "🔍 SIMULATION (Dry Run)"}`);
  console.log("=================================================================\n");

  if (process.env.NODE_ENV === "production") {
    console.error("❌ ERREUR DE SÉCURITÉ : Ce script ne doit JAMAIS être exécuté en environnement de production.");
    process.exit(1);
  }

  // Affichage de l'hôte sans révéler d'identifiants
  try {
    const dbUrl = process.env.DATABASE_URL || "";
    const parsed = new URL(dbUrl);
    console.log(`📡 Hôte cible : ${parsed.host} (Base: ${parsed.pathname.replace("/", "")})\n`);
  } catch {
    console.log("📡 Hôte cible : [analyse de l'URL indisponible]\n");
  }

  // Recherche des projets commençant par "demo-"
  const demoProjects = await prisma.project.findMany({
    where: {
      slug: {
        startsWith: "demo-",
      },
    },
    include: {
      subPortfolios: {
        include: {
          subPortfolio: {
            select: { slug: true, label: true },
          },
        },
      },
    },
  });

  console.log(`🔎 Projets de démonstration trouvés ("demo-*") : ${demoProjects.length}`);

  if (demoProjects.length === 0) {
    console.log("✅ Aucun projet de démonstration à supprimer.");
    return;
  }

  console.log("\nListe des éléments ciblés :");
  demoProjects.forEach((p, idx) => {
    const linkedPortfolios = p.subPortfolios.map((sp) => sp.subPortfolio.slug).join(", ");
    console.log(`   ${idx + 1}. [${p.slug}] "${p.titre}" (Liaisons : ${linkedPortfolios || "aucune"})`);
  });

  const demoProjectIds = demoProjects.map((p) => p.id);

  if (!isApply) {
    console.log("\n-----------------------------------------------------------------");
    console.log("ℹ️  MODE SIMULATION ACTIF : Aucune modification n'a été apportée.");
    console.log("    Pour effectuer la suppression réelle, exécutez :");
    console.log("    npm run seed:demo:remove -- --apply");
    console.log("-----------------------------------------------------------------\n");
    return;
  }

  console.log("\n⚠️  Exécution de la suppression réelle...");

  // 1. Suppression des liaisons SubPortfolioProject
  const deletedLinks = await prisma.subPortfolioProject.deleteMany({
    where: {
      projectId: { in: demoProjectIds },
    },
  });
  console.log(`   🗑️ Liaisons sous-portfolios supprimées : ${deletedLinks.count}`);

  // 2. Suppression des projets de démonstration
  const deletedProjects = await prisma.project.deleteMany({
    where: {
      id: { in: demoProjectIds },
    },
  });
  console.log(`   🗑️ Projets "demo-*" supprimés : ${deletedProjects.count}`);

  console.log("\n=================================================================");
  console.log("   ✅ SUPPRESSION DES DONNÉES DE DÉMONSTRATION ACHEVÉE           ");
  console.log("=================================================================\n");
}

removeDemoData()
  .catch((e) => {
    console.error("❌ Erreur pendant l'exécution :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
