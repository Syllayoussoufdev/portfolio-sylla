import "dotenv/config";
import { prisma } from "../lib/prisma";

async function alignPositionnements() {
  console.log("Alignement des 4 profils selon POSITIONNEMENTS.md sur Neon dev-2bis...");

  // 1. Mise à jour ou création du SubPortfolio "design" (anciennement "referent-digital")
  const oldSub = await prisma.subPortfolio.findUnique({
    where: { slug: "referent-digital" },
  });

  let designSubPortfolioId: string;
  if (oldSub) {
    const updatedSub = await prisma.subPortfolio.update({
      where: { id: oldSub.id },
      data: {
        slug: "design",
        label: "Designer graphique",
        description: "Identités visuelles, affiches, chartes graphiques, maquettes de site et visuels renforcés par l'IA.",
      },
    });
    designSubPortfolioId = updatedSub.id;
    console.log("✔ Sous-portfolio 'referent-digital' migré vers 'design'");
  } else {
    const existingDesign = await prisma.subPortfolio.findUnique({ where: { slug: "design" } });
    if (existingDesign) {
      designSubPortfolioId = existingDesign.id;
    } else {
      const created = await prisma.subPortfolio.create({
        data: {
          slug: "design",
          label: "Designer graphique",
          description: "Identités visuelles, affiches, chartes graphiques, maquettes de site et visuels renforcés par l'IA.",
          actif: true,
        },
      });
      designSubPortfolioId = created.id;
      console.log("✔ Sous-portfolio 'design' créé");
    }
  }

  // 2. Profil "/" (default) — Chargé de communication digitale polyvalent
  await prisma.profile.upsert({
    where: { slug: "default" },
    update: {
      label: "Chargé de communication digitale polyvalent",
      template: "creatif",
      accent: "default",
      hero: {
        headline: "Communication digitale, création visuelle et développement web, au même endroit.",
        subline: "Chargé de communication digitale polyvalent : stratégie, contenus, visuels, et la plateforme web pour les porter.",
        tagline: "Stratégie, contenus & développement web",
        ctaPrimary: {
          label: "Voir mes réalisations",
          href: "#projets",
        },
        ctaSecondary: {
          label: "Me contacter",
          href: "#contact",
        },
        media: {
          kind: "image",
          alt: "Portrait de Sylla Youssouf",
        },
      },
      sections: [
        { key: "hero", visible: true, order: 0 },
        { key: "projets", visible: true, order: 1 },
        { key: "competences", visible: true, order: 2 },
        { key: "apropos", visible: true, order: 3 },
        { key: "parcours", visible: true, order: 4 },
        { key: "contact", visible: true, order: 5 },
      ],
      seoTitle: "Sylla Youssouf — Chargé de communication digitale polyvalent",
      seoDescription: "Communication digitale, création visuelle et développement web au même endroit.",
      isDefault: true,
      actif: true,
    },
    create: {
      slug: "default",
      label: "Chargé de communication digitale polyvalent",
      template: "creatif",
      accent: "default",
      hero: {
        headline: "Communication digitale, création visuelle et développement web, au même endroit.",
        subline: "Chargé de communication digitale polyvalent : stratégie, contenus, visuels, et la plateforme web pour les porter.",
        tagline: "Stratégie, contenus & développement web",
        ctaPrimary: {
          label: "Voir mes réalisations",
          href: "#projets",
        },
        ctaSecondary: {
          label: "Me contacter",
          href: "#contact",
        },
        media: {
          kind: "image",
          alt: "Portrait de Sylla Youssouf",
        },
      },
      sections: [
        { key: "hero", visible: true, order: 0 },
        { key: "projets", visible: true, order: 1 },
        { key: "competences", visible: true, order: 2 },
        { key: "apropos", visible: true, order: 3 },
        { key: "parcours", visible: true, order: 4 },
        { key: "contact", visible: true, order: 5 },
      ],
      isDefault: true,
      actif: true,
    },
  });
  console.log("✔ Profil '/' (default) aligné");

  // 3. Profil "/dev" — Développeur web et mobile
  const devSub = await prisma.subPortfolio.findUnique({ where: { slug: "dev" } });
  await prisma.profile.upsert({
    where: { slug: "dev" },
    update: {
      label: "Développeur web et mobile",
      template: "developpeur",
      accent: "default",
      hero: {
        headline: "Je développe des applications web et mobiles, avec un vrai soin du design.",
        subline: "Développeur web et mobile · Laravel · React · Next.js · PostgreSQL. Ma formation en design et en produits IA affine chaque interface.",
        tagline: "Développement web & mobile · Soin du design & IA",
        ctaPrimary: {
          label: "Discutons de votre projet",
          href: "#contact",
        },
        ctaSecondary: {
          label: "Voir mes projets",
          href: "#projets",
        },
        media: {
          kind: "image",
          alt: "Sylla Youssouf - Développeur web et mobile",
        },
      },
      sections: [
        { key: "hero", visible: true, order: 0 },
        { key: "projets", visible: true, order: 1 },
        { key: "competences", visible: true, order: 2 },
        { key: "apropos", visible: true, order: 3 },
        { key: "parcours", visible: true, order: 4 },
        { key: "contact", visible: true, order: 5 },
      ],
      seoTitle: "Développeur Web & Mobile — Sylla Youssouf",
      seoDescription: "Développeur web et mobile · Laravel, React, Next.js, PostgreSQL. Rendu soigné appuyé par le design et l'IA.",
      actif: true,
      subPortfolioId: devSub?.id || null,
    },
    create: {
      slug: "dev",
      label: "Développeur web et mobile",
      template: "developpeur",
      accent: "default",
      hero: {
        headline: "Je développe des applications web et mobiles, avec un vrai soin du design.",
        subline: "Développeur web et mobile · Laravel · React · Next.js · PostgreSQL. Ma formation en design et en produits IA affine chaque interface.",
        tagline: "Développement web & mobile · Soin du design & IA",
        ctaPrimary: {
          label: "Discutons de votre projet",
          href: "#contact",
        },
        ctaSecondary: {
          label: "Voir mes projets",
          href: "#projets",
        },
        media: {
          kind: "image",
          alt: "Sylla Youssouf - Développeur web et mobile",
        },
      },
      sections: [
        { key: "hero", visible: true, order: 0 },
        { key: "projets", visible: true, order: 1 },
        { key: "competences", visible: true, order: 2 },
        { key: "apropos", visible: true, order: 3 },
        { key: "parcours", visible: true, order: 4 },
        { key: "contact", visible: true, order: 5 },
      ],
      actif: true,
      subPortfolioId: devSub?.id || null,
    },
  });
  console.log("✔ Profil '/dev' aligné");

  // 4. Profil "/design" — Designer graphique (remplace l'ancien profil referent-digital s'il existait)
  const oldProfile = await prisma.profile.findUnique({ where: { slug: "referent-digital" } });
  if (oldProfile) {
    await prisma.profile.update({
      where: { id: oldProfile.id },
      data: {
        slug: "design",
        label: "Designer graphique",
        template: "creatif",
        accent: "default",
        hero: {
          headline: "Je conçois des identités visuelles, des affiches et des supports qui se remarquent.",
          subline: "Designer graphique : chartes graphiques, flyers, maquettes de site et visuels renforcés par l'IA.",
          tagline: "Designer graphique · Identités, affiches & maquettes",
          ctaPrimary: {
            label: "Voir mes créations",
            href: "#projets",
          },
          ctaSecondary: {
            label: "Me contacter",
            href: "#contact",
          },
          media: {
            kind: "image",
            alt: "Sylla Youssouf - Designer graphique",
          },
        },
        sections: [
          { key: "hero", visible: true, order: 0 },
          { key: "projets", visible: true, order: 1 },
          { key: "apropos", visible: true, order: 2 },
          { key: "parcours", visible: true, order: 3 },
          { key: "contact", visible: true, order: 4 },
          { key: "competences", visible: false, order: 5 },
        ],
        seoTitle: "Designer Graphique — Sylla Youssouf",
        seoDescription: "Identités visuelles, affiches, chartes graphiques, maquettes de site et visuels renforcés par l'IA.",
        actif: true,
        subPortfolioId: designSubPortfolioId,
      },
    });
    console.log("✔ Profil 'referent-digital' migré vers 'design'");
  } else {
    await prisma.profile.upsert({
      where: { slug: "design" },
      update: {
        label: "Designer graphique",
        template: "creatif",
        accent: "default",
        hero: {
          headline: "Je conçois des identités visuelles, des affiches et des supports qui se remarquent.",
          subline: "Designer graphique : chartes graphiques, flyers, maquettes de site et visuels renforcés par l'IA.",
          tagline: "Designer graphique · Identités, affiches & maquettes",
          ctaPrimary: {
            label: "Voir mes créations",
            href: "#projets",
          },
          ctaSecondary: {
            label: "Me contacter",
            href: "#contact",
          },
          media: {
            kind: "image",
            alt: "Sylla Youssouf - Designer graphique",
          },
        },
        sections: [
          { key: "hero", visible: true, order: 0 },
          { key: "projets", visible: true, order: 1 },
          { key: "apropos", visible: true, order: 2 },
          { key: "parcours", visible: true, order: 3 },
          { key: "contact", visible: true, order: 4 },
          { key: "competences", visible: false, order: 5 },
        ],
        seoTitle: "Designer Graphique — Sylla Youssouf",
        seoDescription: "Identités visuelles, affiches, chartes graphiques, maquettes de site et visuels renforcés par l'IA.",
        actif: true,
        subPortfolioId: designSubPortfolioId,
      },
      create: {
        slug: "design",
        label: "Designer graphique",
        template: "creatif",
        accent: "default",
        hero: {
          headline: "Je conçois des identités visuelles, des affiches et des supports qui se remarquent.",
          subline: "Designer graphique : chartes graphiques, flyers, maquettes de site et visuels renforcés par l'IA.",
          tagline: "Designer graphique · Identités, affiches & maquettes",
          ctaPrimary: {
            label: "Voir mes créations",
            href: "#projets",
          },
          ctaSecondary: {
            label: "Me contacter",
            href: "#contact",
          },
          media: {
            kind: "image",
            alt: "Sylla Youssouf - Designer graphique",
          },
        },
        sections: [
          { key: "hero", visible: true, order: 0 },
          { key: "projets", visible: true, order: 1 },
          { key: "apropos", visible: true, order: 2 },
          { key: "parcours", visible: true, order: 3 },
          { key: "contact", visible: true, order: 4 },
          { key: "competences", visible: false, order: 5 },
        ],
        isDefault: false,
        actif: true,
        subPortfolioId: designSubPortfolioId,
      },
    });
    console.log("✔ Profil '/design' créé/aligné");
  }

  // 5. Profil "/video" — Monteur vidéo débutant
  const videoSub = await prisma.subPortfolio.findUnique({ where: { slug: "video" } });
  await prisma.profile.upsert({
    where: { slug: "video" },
    update: {
      label: "Monteur vidéo débutant",
      template: "immersif",
      accent: "default",
      hero: {
        headline: "Je monte des vidéos dynamiques, et je cherche à collaborer.",
        subline: "Monteur vidéo débutant : teasers, clips et interviews. Ouvert aux collaborations et aux stages.",
        tagline: "Montage vidéo · Rythme · Projets de films",
        ctaPrimary: {
          label: "Voir mes montages",
          href: "#projets",
        },
        ctaSecondary: {
          label: "Proposer une collaboration",
          href: "#contact",
        },
        media: {
          kind: "image",
          alt: "Sylla Youssouf - Monteur vidéo",
        },
      },
      sections: [
        { key: "hero", visible: true, order: 0 },
        { key: "projets", visible: true, order: 1 },
        { key: "apropos", visible: true, order: 2 },
        { key: "contact", visible: true, order: 3 },
        { key: "competences", visible: false, order: 4 },
        { key: "parcours", visible: false, order: 5 },
      ],
      seoTitle: "Monteur Vidéo Débutant — Sylla Youssouf",
      seoDescription: "Monteur vidéo débutant : teasers, clips et interviews. Ouvert aux collaborations et aux stages.",
      actif: true,
      subPortfolioId: videoSub?.id || null,
    },
    create: {
      slug: "video",
      label: "Monteur vidéo débutant",
      template: "immersif",
      accent: "default",
      hero: {
        headline: "Je monte des vidéos dynamiques, et je cherche à collaborer.",
        subline: "Monteur vidéo débutant : teasers, clips et interviews. Ouvert aux collaborations et aux stages.",
        tagline: "Montage vidéo · Rythme · Projets de films",
        ctaPrimary: {
          label: "Voir mes montages",
          href: "#projets",
        },
        ctaSecondary: {
          label: "Proposer une collaboration",
          href: "#contact",
        },
        media: {
          kind: "image",
          alt: "Sylla Youssouf - Monteur vidéo",
        },
      },
      sections: [
        { key: "hero", visible: true, order: 0 },
        { key: "projets", visible: true, order: 1 },
        { key: "apropos", visible: true, order: 2 },
        { key: "contact", visible: true, order: 3 },
        { key: "competences", visible: false, order: 4 },
        { key: "parcours", visible: false, order: 5 },
      ],
      actif: true,
      subPortfolioId: videoSub?.id || null,
    },
  });
  console.log("✔ Profil '/video' aligné");

  console.log("Les 4 profils sont désormais parfaitement alignés avec POSITIONNEMENTS.md !");
}

alignPositionnements()
  .catch((e) => {
    console.error("Erreur lors de l'alignement :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
