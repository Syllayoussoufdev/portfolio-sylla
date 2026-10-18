import "dotenv/config";
import { prisma } from "../lib/prisma";

/**
 * Script de seed idempotent pour initialiser :
 * 1. Le profil par défaut ("default") pour la page d'accueil "/"
 * 2. Un profil pour chaque sous-portfolio existant (lié 1-to-1 via subPortfolioId)
 * 3. L'entrée unique des réglages du site (SiteSettings)
 *
 * Ce script est idempotent : s'il est relancé, il ne crée aucun doublon.
 */
async function seedProfiles() {
  console.log("=================================================================");
  console.log("   INITIALISATION IDEMPOTENTE DES PROFILS & RÉGLAGES DU SITE     ");
  console.log("=================================================================\n");

  try {
    // 1. Initialisation / Mise à jour du Profil Général par défaut
    console.log("🔹 1. Synchronisation du Profil par défaut (slug: 'default')...");

    const defaultHero = {
      headline: "EXPERT COMMUNICATION DIGITALE & DÉVELOPPEUR WEB",
      subline: "Je conçois des identités mémorables et des applications modernes, performantes et scalables.",
      tagline: "Double casquette Créative & Ingénierie logicielle",
      ctaPrimary: {
        label: "Découvrir mes réalisations",
        href: "#projets",
      },
      ctaSecondary: {
        label: "Me contacter",
        href: "/contact",
      },
      media: {
        kind: "image",
        alt: "Portrait de Sylla Youssouf [à remplacer dans la médiathèque]",
      },
    };

    const defaultSections = [
      { key: "hero", visible: true, order: 0 },
      { key: "projets", visible: true, order: 1 },
      { key: "competences", visible: true, order: 2 },
      { key: "apropos", visible: true, order: 3 },
      { key: "parcours", visible: true, order: 4 },
      { key: "contact", visible: true, order: 5 },
    ];

    const defaultProfile = await prisma.profile.upsert({
      where: { slug: "default" },
      update: {
        isDefault: true,
      },
      create: {
        slug: "default",
        label: "Profil Général (Accueil)",
        template: "creatif",
        accent: "default",
        hero: defaultHero,
        sections: defaultSections,
        variables: {},
        seoTitle: "Sylla Youssouf — Expert Communication & Développeur",
        seoDescription:
          "Portfolio officiel de Sylla Youssouf : communication digitale, direction artistique et développement d'applications.",
        isDefault: true,
        actif: true,
      },
    });

    console.log(`   ✅ Profil par défaut prêt : id=${defaultProfile.id} (slug: ${defaultProfile.slug})`);

    // 2. Synchronisation des profils issus des sous-portfolios existants
    console.log("\n🔹 2. Vérification des sous-portfolios existants...");
    const subPortfolios = await prisma.subPortfolio.findMany();
    console.log(`   Trouvé ${subPortfolios.length} sous-portfolio(s) en base.`);

    for (const sub of subPortfolios) {
      const existingProfile = await prisma.profile.findFirst({
        where: {
          OR: [{ slug: sub.slug }, { subPortfolioId: sub.id }],
        },
      });

      if (existingProfile) {
        console.log(`   ℹ️ Profil existant pour "${sub.label}" (slug: ${sub.slug}) -> Ignoré`);
        // Assurer la liaison si elle manquait
        if (!existingProfile.subPortfolioId) {
          await prisma.profile.update({
            where: { id: existingProfile.id },
            data: { subPortfolioId: sub.id },
          });
        }
      } else {
        // Déterminer le template selon la thématique du sous-portfolio
        const slugLower = sub.slug.toLowerCase();
        let chosenTemplate = "creatif";
        if (slugLower.includes("dev") || slugLower.includes("web") || slugLower.includes("tech")) {
          chosenTemplate = "developpeur";
        } else if (slugLower.includes("video") || slugLower.includes("motion") || slugLower.includes("ia")) {
          chosenTemplate = "immersif";
        }

        const subHero = {
          headline: `PORTFOLIO ${sub.label.toUpperCase()}`,
          subline:
            sub.description ||
            `Sélection ciblée de mes réalisations spécialisées en ${sub.label} [à personnaliser].`,
          tagline: `Spécialisation : ${sub.label}`,
          ctaPrimary: {
            label: "Consulter les projets",
            href: "#projets",
          },
          ctaSecondary: {
            label: "Prendre contact",
            href: "/contact",
          },
          media: {
            kind: "image",
            alt: `Visuel représentatif ${sub.label} [à remplacer]`,
          },
        };

        const created = await prisma.profile.create({
          data: {
            slug: sub.slug,
            label: `Profil ${sub.label}`,
            template: chosenTemplate,
            accent: "default",
            hero: subHero,
            sections: defaultSections,
            variables: {},
            seoTitle: `Sylla Youssouf — Portfolio ${sub.label}`,
            seoDescription: sub.description || `Découvrez les réalisations de Sylla Youssouf en ${sub.label}.`,
            isDefault: false,
            actif: sub.actif,
            subPortfolioId: sub.id,
          },
        });

        console.log(`   ✨ Profil créé pour "${sub.label}" : slug=${created.slug}, template=${created.template}`);
      }
    }

    // 3. Initialisation du Singleton SiteSettings
    console.log("\n🔹 3. Vérification des Réglages du site (SiteSettings)...");
    const existingSettings = await prisma.siteSettings.findFirst();

    if (existingSettings) {
      console.log(`   ℹ️ Réglages existants trouvés (nom: "${existingSettings.nom}") -> Conservés sans modification.`);
    } else {
      const createdSettings = await prisma.siteSettings.create({
        data: {
          nom: "Sylla Youssouf",
          metier: "Expert Communication & Développeur Web",
          emailPublic: null, // Aucun faux e-mail
          whatsapp: null,    // Aucun faux numéro
          github: "https://github.com",
          linkedin: null,
          twitter: null,
          instagram: null,
        },
      });
      console.log(`   ✨ Réglages créés : nom="${createdSettings.nom}"`);
    }

    console.log("\n=================================================================");
    console.log("   SEED DES PROFILS TERMINÉ AVEC SUCCÈS (IDEMPOTENT).            ");
    console.log("=================================================================");
  } catch (error) {
    console.error("❌ Erreur lors du seed des profils :", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProfiles();
