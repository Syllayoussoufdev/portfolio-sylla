import { prisma } from "../lib/prisma";

async function seed() {
  console.log("🌱 Début de l'initialisation des données de démonstration...");

  // 1. Nettoyage des anciennes données pour repartir sur une base propre
  await prisma.subPortfolioProject.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.project.deleteMany();
  await prisma.subPortfolio.deleteMany();

  console.log("🧹 Base de données nettoyée.");

  // 2. Création des 6 projets représentatifs des 6 casquettes
  const p1 = await prisma.project.create({
    data: {
      titre: "Affiches Festives & Identité Kairaba",
      slug: "affiches-kairaba",
      description:
        "Série d'affiches grand format, bannières et déclinaisons visuelles pour un festival culturel et artistique.",
      contenu: `### Contexte & Vision
Création de l'univers visuel pour l'édition 2026 du Festival Kairaba. Le défi consistait à marier tradition culturelle et dynamisme contemporain à travers un langage visuel percutant.

### Démarche Graphique
- Recherche typographique sur-mesure pour titrages monumentaux.
- Élaboration d'une palette vibrante aux contrastes marqués (orange safran, bleu nuit, ivoire).
- Déclinaison sur 15 formats : abribus 4x3, bannières réseaux sociaux, invitations VIP et badges festivaliers.

### Résultats
L'identité a été saluée par les organisateurs et a permis une augmentation de 40% de l'engagement sur les campagnes d'affichage digital.`,
      coverImage:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      tags: ["Design Graphique", "Canva", "Identité Visuelle", "Print"],
      links: {
        canva: "https://canva.com",
        drive: "https://drive.google.com",
      },
      ordre: 1,
      visible: true,
      featured: true,
    },
  });

  const p2 = await prisma.project.create({
    data: {
      titre: "Brand Guidelines & Stratégie NovaPay",
      slug: "brand-guidelines-novapay",
      description:
        "Charte graphique complète, guide de style de marque et stratégie de communication digitale pour une fintech.",
      contenu: `### Problématique
NovaPay avait besoin d'asseoir son autorité et d'instaurer un climat de confiance immédiat auprès des utilisateurs et investisseurs.

### Solution Créative & Stratégique
- Création du logotype géométrique symbole de fluidité financière.
- Rédaction du Brand Book complet : règles d'espacement, typographies système, ton de voix éditorial et iconographie.
- Templates Figma modulaires prêts pour les équipes produit et marketing.

### Livrables
Guide de marque de 48 pages au format interactif Figma et export PDF haute fidélité.`,
      coverImage:
        "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80",
      tags: ["Branding", "Stratégie Com", "Figma", "Guidelines"],
      links: {
        figma: "https://figma.com",
        drive: "https://drive.google.com",
      },
      ordre: 2,
      visible: true,
      featured: true,
    },
  });

  const p3 = await prisma.project.create({
    data: {
      titre: "Spot Promotionnel & Teaser Horizon",
      slug: "teaser-horizon",
      description:
        "Tournage, montage dynamique au rythme sonore, étalonnage cinématique et sound design immersif.",
      contenu: `### Objectif
Concevoir un teaser vidéo de 45 secondes ultra-rythmé pour annoncer le lancement de la nouvelle collection Horizon.

### Réalisation Technique
- Sélection et découpage des séquences caméra haute cadence (120 fps).
- Synchronisation au millième de seconde sur la bande sonore originale.
- Color grading cinématique sous DaVinci Resolve pour accentuer les teintes chaudes et le contraste naturel.

### Diffusion
Format vertical (9:16) pour Instagram Reels/TikTok et format paysage (16:9) pour YouTube et le site officiel.`,
      coverImage:
        "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
      tags: ["Montage Vidéo", "Cadrage", "Premiere Pro", "Sound Design"],
      links: {
        video: "https://youtube.com",
        drive: "https://drive.google.com",
      },
      ordre: 3,
      visible: true,
      featured: false,
    },
  });

  const p4 = await prisma.project.create({
    data: {
      titre: "Application Mobile FinFlow — UI/UX & Motion",
      slug: "app-mobile-finflow",
      description:
        "Recherche utilisateur, wireframing, design system complet et micro-interactions interactives sous Figma.",
      contenu: `### Démarche UX Centrée Utilisateur
Interviews menées auprès de 20 utilisateurs pour identifier les points de friction dans le suivi des dépenses quotidiennes. Simplification du tunnel d'ajout d'une transaction de 4 clics à un seul geste.

### Conception UI & Motion
- Design System complet avec variables Figma (tokens de couleurs, espacements et typographies).
- Micro-interactions fluides et animations de transition d'écrans pour rendre l'expérience gratifiante.
- Prototype haute fidélité entièrement cliquable et testé sur terminaux iOS et Android.`,
      coverImage:
        "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
      tags: ["UI/UX", "Figma", "Design System", "Motion"],
      links: {
        figma: "https://figma.com",
        demo: "https://finflow.example.com",
      },
      ordre: 4,
      visible: true,
      featured: true,
    },
  });

  const p5 = await prisma.project.create({
    data: {
      titre: "Générateur Automatisé de Visuels par IA",
      slug: "ia-visual-generator",
      description:
        "Pipeline complet de génération de visuels publicitaires par intelligence artificielle avec prompts calibrés et scripts automatisés.",
      contenu: `### Le Problème
Les équipes créatives consacrent des heures répétitives à adapter des visuels promotionnels à des dizaines de variations contextuelles.

### Solution IA Déployée
- Structuration de prompts négatifs et positifs avancés pour maintenir la cohérence de marque.
- Automatisation par script Python/Node.js des requêtes de génération, du détourage et du recadrage intelligent.
- Interface d'évaluation rapide permettant d'exporter les créations validées en un clic.`,
      coverImage:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
      tags: ["IA Product Creator", "Midjourney", "Automatisation", "Python"],
      links: {
        github: "https://github.com",
        demo: "https://ia-studio.example.com",
      },
      ordre: 5,
      visible: true,
      featured: false,
    },
  });

  const p6 = await prisma.project.create({
    data: {
      titre: "Plateforme SaaS OmniTask (Next.js 16 & TypeScript)",
      slug: "saas-omnitask",
      description:
        "Application web collaborative moderne développée avec Next.js 16, Prisma ORM, Server Actions et Tailwind CSS.",
      contenu: `### Architecture Fullstack & Performance
Développement d'une application de gestion de projets d'équipe pensée pour la vélocité et l'élégance :
- Rendu hybride (Server Components pour le SEO et Client Components pour l'interactivité dynamique).
- Base de données PostgreSQL Neon avec Prisma 7 et schémas relationnels stricts.
- Authentification sécurisée, protection CSRF et validation Zod sur toutes les entrées utilisateur.

### Fonctionnalités Clés
- Tableau Kanban interactif avec glisser-déposer fluide.
- Filtres temps réel et métriques de productivité d'équipe.
- Temps de chargement inférieur à 300ms et score Lighthouse supérieur à 95.`,
      coverImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      tags: ["Développement Web", "Next.js", "TypeScript", "Tailwind CSS", "Prisma"],
      links: {
        github: "https://github.com",
        demo: "https://omnitask.example.com",
      },
      ordre: 6,
      visible: true,
      featured: true,
    },
  });

  console.log("✅ 6 projets insérés avec succès.");

  // 3. Création des Sous-Portfolios ciblés (/[profil])
  const spDesign = await prisma.subPortfolio.create({
    data: {
      slug: "design",
      label: "Design Graphique & Branding",
      description:
        "Sélection ciblée de mes créations visuelles, chartes graphiques, maquettes et identités de marque.",
      actif: true,
      projects: {
        create: [
          { projectId: p1.id, ordre: 1 },
          { projectId: p2.id, ordre: 2 },
          { projectId: p4.id, ordre: 3 },
        ],
      },
    },
  });

  const spDev = await prisma.subPortfolio.create({
    data: {
      slug: "dev",
      label: "Développement Web & Architecture",
      description:
        "Projets techniques fullstack, plateformes SaaS, prototypes interactifs et code robuste.",
      actif: true,
      projects: {
        create: [
          { projectId: p6.id, ordre: 1 },
          { projectId: p5.id, ordre: 2 },
          { projectId: p4.id, ordre: 3 },
        ],
      },
    },
  });

  const spVideo = await prisma.subPortfolio.create({
    data: {
      slug: "video",
      label: "Cadrage, Montage Vidéo & Motion",
      description:
        "Réalisations audiovisuelles rythmées, montages cinématiques et motion design pour marques.",
      actif: true,
      projects: {
        create: [
          { projectId: p3.id, ordre: 1 },
          { projectId: p4.id, ordre: 2 },
        ],
      },
    },
  });

  console.log(`✅ 3 sous-portfolios créés : /${spDesign.slug}, /${spDev.slug}, /${spVideo.slug}`);

  // 4. Ajout de quelques visites pour alimenter les analytics
  await prisma.visit.createMany({
    data: [
      { path: "/", userAgent: "Mozilla/5.0 Chrome/120.0" },
      { path: "/design", subPortfolioId: spDesign.id, userAgent: "Mozilla/5.0 Safari/17.0" },
      { path: "/dev", subPortfolioId: spDev.id, userAgent: "Mozilla/5.0 Firefox/121.0" },
      { path: `/projets/${p6.slug}`, projectId: p6.id, userAgent: "Mozilla/5.0 Chrome/120.0" },
      { path: `/projets/${p1.slug}`, projectId: p1.id, userAgent: "Mozilla/5.0 Safari/17.0" },
    ],
  });

  console.log("📊 Données d'analytics initialisées.");
  console.log("🎉 Seed terminé avec succès !");
}

seed()
  .catch((e) => {
    console.error("Erreur lors du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
