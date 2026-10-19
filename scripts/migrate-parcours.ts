import "dotenv/config";
import { prisma } from "../lib/prisma";

async function runAdditiveMigration() {
  console.log("Exécution de la migration additive sur Neon (branche dev-2bis)...");

  // 1. Enum ParcoursType
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      CREATE TYPE "ParcoursType" AS ENUM ('formation', 'experience', 'certification');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);
  console.log("✔ Type enum ParcoursType vérifié/créé");

  // 2. Colonnes Profile (variants, about)
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "variants" JSONB;
  `);
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "about" JSONB;
  `);
  console.log("✔ Colonnes variants et about vérifiées/créées sur Profile");

  // 3. Colonne SiteSettings (cvUrl)
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "cvUrl" TEXT;
  `);
  console.log("✔ Colonne cvUrl vérifiée/créée sur SiteSettings");

  // 4. Table ParcoursItem
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ParcoursItem" (
      "id" TEXT NOT NULL,
      "type" "ParcoursType" NOT NULL DEFAULT 'formation',
      "titre" TEXT NOT NULL,
      "organisme" TEXT NOT NULL,
      "lieu" TEXT,
      "anneeDebut" INTEGER NOT NULL,
      "moisDebut" INTEGER,
      "anneeFin" INTEGER,
      "moisFin" INTEGER,
      "enCours" BOOLEAN NOT NULL DEFAULT false,
      "description" TEXT,
      "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
      "badge" TEXT,
      "url" TEXT,
      "visible" BOOLEAN NOT NULL DEFAULT true,
      "ordre" INTEGER NOT NULL DEFAULT 0,
      "profilSlugs" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT "ParcoursItem_pkey" PRIMARY KEY ("id")
    );
  `);
  console.log("✔ Table ParcoursItem vérifiée/créée");

  // 5. Index
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "ParcoursItem_type_idx" ON "ParcoursItem"("type");
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "ParcoursItem_visible_idx" ON "ParcoursItem"("visible");
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "ParcoursItem_ordre_idx" ON "ParcoursItem"("ordre");
  `);
  console.log("✔ Index sur ParcoursItem vérifiés/créés");

  console.log("Migration additive terminée avec succès !");
}

runAdditiveMigration()
  .catch((e) => {
    console.error("Erreur migration :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
