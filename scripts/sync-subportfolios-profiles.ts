import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Synchronisation des Sous-Portfolios et des Profils...");

  const subPortfolios = await prisma.subPortfolio.findMany({
    include: {
      profile: true,
      projects: true,
    },
  });

  for (const sub of subPortfolios) {
    if (sub.profile) {
      console.log(`✔ Le sous-portfolio [${sub.slug}] a déjà un profil associé (${sub.profile.slug}).`);
      continue;
    }

    // Détection du template selon le slug ou le label
    const s = `${sub.slug} ${sub.label}`.toLowerCase();
    const template = s.includes("dev")
      ? "developpeur"
      : s.includes("video") || s.includes("motion")
      ? "immersif"
      : "creatif";

    const heroData = {
      headline: sub.label.charAt(0).toUpperCase() + sub.label.slice(1),
      subline:
        sub.description ||
        "Découvrez une sélection rigoureuse de réalisations et de solutions digitales conçues sur-mesure.",
      tagline: sub.label,
      ctaPrimary: { label: "Voir mes réalisations", href: "#projets" },
      ctaSecondary: { label: "Discuter d'un projet", href: "#contact" },
      media: { kind: "image", alt: `Sylla Youssouf — ${sub.label}` },
      outils: ["Next.js", "React", "Laravel", "PostgreSQL", "Figma", "Canva"],
    };

    const sectionsData = [
      { key: "hero", visible: true, order: 0 },
      { key: "projets", visible: true, order: 1 },
      { key: "competences", visible: true, order: 2 },
      { key: "apropos", visible: true, order: 3 },
      { key: "parcours", visible: true, order: 4 },
      { key: "contact", visible: true, order: 5 },
    ];

    // Vérifier si un profil existe déjà avec ce slug
    const existingWithSlug = await prisma.profile.findUnique({
      where: { slug: sub.slug },
    });

    if (existingWithSlug) {
      await prisma.profile.update({
        where: { id: existingWithSlug.id },
        data: { subPortfolioId: sub.id },
      });
      console.log(`✔ Profil existant [${sub.slug}] rattaché au sous-portfolio [${sub.slug}].`);
    } else {
      const created = await prisma.profile.create({
        data: {
          label: sub.label,
          slug: sub.slug,
          template,
          accent: "default",
          hero: heroData,
          sections: sectionsData,
          variables: {},
          seoTitle: `${sub.label} | Sylla Youssouf`,
          seoDescription: sub.description || `${sub.label} — Portfolio ciblé de Sylla Youssouf.`,
          subPortfolioId: sub.id,
          actif: sub.actif,
        },
      });
      console.log(`🚀 Nouveau profil créé automatiquement pour [${sub.slug}] (ID: ${created.id}).`);
    }
  }

  console.log("Synchronisation terminée !");
}

main()
  .catch((e) => {
    console.error("Erreur sync:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
