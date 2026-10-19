import { verifySessionToken, signSessionToken } from "../lib/auth";
import { checkRateLimit, incrementRateLimit, resetRateLimit } from "../lib/rate-limit";
import { prisma } from "../lib/prisma";

async function runQAChecks() {
  console.log("=== EXÉCUTION DE LA MATRICE QA (ÉTAPE 9) ===");

  // 1. Contrôle des 4 profils en base
  const profiles = await prisma.profile.findMany();
  console.log(`\n1. Profils configurés en base : ${profiles.length}`);
  for (const p of profiles) {
    console.log(` - /${p.slug === "default" ? "" : p.slug} | Template: ${p.template} | Actif: ${p.actif}`);
  }

  // 2. Contrôle du modèle ParcoursItem
  const parcoursCount = await prisma.parcoursItem.count();
  console.log(`\n2. Jalons de parcours en base : ${parcoursCount}`);

  // 3. Contrôle des projets
  const projectsCount = await prisma.project.count({ where: { visible: true } });
  console.log(`\n3. Projets visibles en base : ${projectsCount}`);

  // 4. Test de sécurité Auth
  console.log("\n4. Test de sécurité Auth :");
  const testEmail = "qa-test@syllayoussouf.com";
  const rateLimitKey = `login:${testEmail}`;
  resetRateLimit(rateLimitKey);

  for (let i = 1; i <= 5; i++) {
    incrementRateLimit(rateLimitKey);
  }
  const blocked = checkRateLimit(rateLimitKey);
  console.log(` - Brute-force protection après 5 échecs : ${!blocked.allowed ? "BLOCAGE ACTIF (Succès)" : "ÉCHEC"}`);

  resetRateLimit(rateLimitKey);
  const resetSuccess = checkRateLimit(rateLimitKey);
  console.log(` - Réinitialisation du quota : ${resetSuccess.allowed ? "FONCTIONNEL (Succès)" : "ÉCHEC"}`);

  // 5. Test JWT
  const token = await signSessionToken({ email: "admin@sylla.dev", role: "admin" });
  const verified = await verifySessionToken(token);
  console.log(` - Signature et vérification JWT : ${verified?.email === "admin@sylla.dev" ? "VALIDE (Succès)" : "ÉCHEC"}`);

  const tampered = await verifySessionToken(token + "invalid");
  console.log(` - Rejet de signature falsifiée : ${tampered === null ? "REJETÉ (Succès)" : "ÉCHEC"}`);

  console.log("\n=== FIN DES TESTS DE LA MATRICE QA ===");
}

runQAChecks()
  .catch((e) => console.error(e))
  .finally(() => process.exit(0));
