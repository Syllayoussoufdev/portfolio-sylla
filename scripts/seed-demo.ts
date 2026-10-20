import "dotenv/config";
import { prisma } from "../lib/prisma";

/**
 * Script de Seed Idempotent pour la base de DÉVELOPPEMENT
 * Conforme à SEED-DEMO.md
 *
 * Utilisation :
 * - Simulation (défaut) : npx tsx scripts/seed-demo.ts
 * - Écriture réelle :     npx tsx scripts/seed-demo.ts --apply
 */

// ============================================================================
// DÉFINITION DES DONNÉES
// ============================================================================

// 1. Réglages du site (SiteSettings)
const SITE_SETTINGS_DATA = {
  nom: "Sylla Youssouf",
  metier: "Communication digitale · Design · Développement web",
  emailPublic: null,
  whatsapp: null,
  github: null,
  linkedin: null,
  twitter: null,
  instagram: null,
};

const ONLINE_PROJECT_IMAGES: Record<string, string> = {
  "portfolio-cv-personnel": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  "systeme-gestion-recrutements": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  "application-gestion-taches": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80",
  "site-freelance-personnel": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  "blog-wordpress-headless-nextjs": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
  "site-full-services-point-sarl": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  "site-mashar-immobilier": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "demo-identite-cafe-artisanal": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
  "demo-affiches-festival-musique": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
  "demo-illustrations-mascotte-icones": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  "demo-flyers-kakemonos-salon": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
  "demo-packaging-jus-locaux": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=1200&q=80",
  "demo-visuels-reseaux-sociaux": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
  "demo-charte-marque-startup": "https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=1200&q=80",
  "demo-strategie-com-association": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
  "demo-calendrier-editorial-boutique": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  "demo-generateur-visuels-ia": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
  "demo-assistant-redaction-com": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  "demo-teaser-evenement-culturel": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
  "demo-clip-promotionnel-produit": "https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?auto=format&fit=crop&w=1200&q=80",
  "demo-interview-webinaire": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
  "demo-maquette-app-depenses": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
  "demo-design-system-formation": "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
  "entreprise-projet-1": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  "entreprise-projet-2": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  "entreprise-projet-3": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
};

// 2. Projets réels (7 projets web issus de l'ancien portfolio)
const REAL_PROJECTS = [
  {
    slug: "portfolio-cv-personnel",
    titre: "Portfolio CV personnel",
    description: "Portfolio en ligne présentant mes compétences, mon parcours et mes projets.",
    tags: ["Développement Web", "React", "JavaScript", "Git"],
    contenu: `### Contexte & Objectif
Développement d'un portfolio en ligne personnel afin de valoriser mes compétences en ingénierie web, documenter mes projets informatiques et structurer mon parcours académique et professionnel.

### Démarche & Livrables
Conception modulaire avec composants React réutilisables, gestion du responsive et versioning sous Git.

*Statut : Publié.*`,
    featured: false,
    ordre: 101,
    visible: true,
  },
  {
    slug: "systeme-gestion-recrutements",
    titre: "Système de gestion des recrutements",
    description: "Application web pour gérer les processus de recrutement, de la publication des offres au suivi des candidatures.",
    tags: ["Développement Web", "MySQL"],
    contenu: `### Contexte & Objectif
Application web conçue pour structurer et automatiser les processus de recrutement RH, de la diffusion d'offres à l'évaluation méthodique des candidatures reçues.

### Démarche & Livrables
Modélisation de la base de données relationnelle MySQL, suivi des statuts des candidats et génération de tableaux de bord de synthèse pour les recruteurs.

*Statut : Terminé.*`,
    featured: true,
    ordre: 102,
    visible: true,
  },
  {
    slug: "application-gestion-taches",
    titre: "Application de gestion de tâches",
    description: "Application pour aider les utilisateurs à organiser leurs tâches quotidiennes.",
    tags: ["Développement Web", "Laravel", "React", "MySQL"],
    contenu: `### Contexte & Objectif
Conception d'une application web productive pour la planification et l'organisation des tâches quotidiennes individuelles et d'équipe.

### Démarche & Livrables
Architecture full stack associant un backend MVC Laravel robuste, une API RESTful et une interface réactive développée sous React avec persistance MySQL.

*Statut : Terminé.*`,
    featured: false,
    ordre: 103,
    visible: true,
  },
  {
    slug: "site-freelance-personnel",
    titre: "Site de freelance personnel",
    description: "Site pour présenter mes services de freelance et faciliter les échanges avec les clients.",
    tags: ["Développement Web", "Laravel", "JavaScript", "Git"],
    contenu: `### Contexte & Objectif
Création d'une plateforme vitrine pour commercialiser mes prestations de développement web indépendant et fluidifier l'acquisition et le suivi de projets clients.

### Démarche & Livrables
Backend Laravel assurant la gestion des formulaires et des demandes de devis, interface dynamique interactive en JavaScript et suivi Git.

*Statut : En cours.*`,
    featured: false,
    ordre: 104,
    visible: true,
  },
  {
    slug: "blog-wordpress-headless-nextjs",
    titre: "Blog WordPress headless et Next.js",
    description: "Blog dont WordPress est le back-end et Next.js le front-end, pour de meilleures performances.",
    tags: ["Développement Web", "WordPress", "Next.js", "MySQL"],
    contenu: `### Contexte & Objectif
Mise en place d'une architecture headless moderne pour optimiser le temps de chargement, l'expérience utilisateur et l'indexation SEO d'un blog technique.

### Démarche & Livrables
WordPress utilisé exclusivement comme CMS backend de saisie éditoriale, interfacé via API REST à un frontend Next.js ultra-rapide rendu côté serveur.

*Statut : En cours.*`,
    featured: true,
    ordre: 105,
    visible: true,
  },
  {
    slug: "site-full-services-point-sarl",
    titre: "Site web Full Services Point SARL, Abidjan",
    description: "Site web pour une entreprise de services complets basée à Abidjan.",
    tags: ["Développement Web", "Laravel", "React"],
    contenu: `### Contexte & Objectif
Réalisation du site internet institutionnel d'une entreprise multiservices à Abidjan pour présenter ses départements d'activité et asseoir sa notoriété locale.

### Démarche & Livrables
Architecture applicative Laravel, interfaces utilisateur ergonomiques sous React et formulaires de contact opérationnels.

*Statut : Terminé.*`,
    featured: false,
    ordre: 106,
    visible: true,
  },
  {
    slug: "site-mashar-immobilier",
    titre: "Site web Mashar Immobilier, Abidjan",
    description: "Site web pour une entreprise d'immobilier basée à Abidjan.",
    tags: ["Développement Web", "Laravel", "JavaScript"],
    contenu: `### Contexte & Objectif
Conception de la plateforme web d'une agence immobilière à Abidjan pour faciliter la recherche, la consultation et la mise en relation pour des biens locatifs et de vente.

### Démarche & Livrables
Backend Laravel pour le catalogue de biens et gestion dynamique des galeries photos et des filtres de recherche.

*Statut : Terminé.*`,
    featured: false,
    ordre: 107,
    visible: true,
  },
];

// 3. Projets de démonstration (16 projets, préfixe demo-)
// Chacun rédigé entre 60 et 90 mots, sans métrique ni marque réelle.
const DEMO_PROJECTS = [
  {
    slug: "demo-identite-cafe-artisanal",
    titre: "Logo et identité visuelle, marque de café artisanal (projet test)",
    description: "Logo, palette et charte d'usage pour une marque de café fictive.",
    tags: ["Design Graphique", "Branding & Stratégie Com"],
    contenu: `### Contexte & Objectif
Création globale d'une identité de marque singulière pour une brûlerie de café artisanal souhaitant valoriser l'origine biologique et l'authenticité de ses grains.

### Démarche & Livrables
Recherche de typographies chaleureuses, composition d'un logotype organique et définition d'une palette aux teintes terreuses et torréfiées. Élaboration du guide d'application sur emballages et papeterie.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: true,
    ordre: 1,
    visible: true,
  },
  {
    slug: "demo-affiches-festival-musique",
    titre: "Série d'affiches, festival de musique (projet test)",
    description: "Affiches grand format, déclinaisons pour réseaux sociaux et bannières pour un festival fictif.",
    tags: ["Design Graphique"],
    contenu: `### Contexte & Objectif
Conception de l'univers graphique et de la campagne visuelle pour un festival urbain réunissant musiques électroniques et rythmes traditionnels.

### Démarche & Livrables
Mise au point d'une composition typographique audacieuse, jeux de dégradés vibrants et contrastes tranchés. Déclinaisons en affiches grand format, visuels d'écrans scéniques et bannières pour plateformes sociales.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: true,
    ordre: 2,
    visible: true,
  },
  {
    slug: "demo-illustrations-mascotte-icones",
    titre: "Illustrations vectorielles : mascotte et jeu d'icônes",
    description: "Mascotte illustrée et jeu d'icônes cohérent pour une application fictive.",
    tags: ["Design Graphique"],
    contenu: `### Contexte & Objectif
Développement d'un langage illustratif engageant destiné à humaniser les parcours d'une application mobile grand public.

### Démarche & Livrables
Création pas-à-pas d'une mascotte amicale aux différentes postures émotionnelles et déclinaison d'un set de 24 icônes vectorielles homogènes respectant les règles d'accessibilité visuelle.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: false,
    ordre: 3,
    visible: true,
  },
  {
    slug: "demo-flyers-kakemonos-salon",
    titre: "Flyers et kakémonos, salon professionnel (projet test)",
    description: "Supports imprimés pour un stand : flyer, kakémono, carte de visite.",
    tags: ["Design Graphique"],
    contenu: `### Contexte & Objectif
Conception du kit de communication imprimé pour l'aménagement du stand d'une entreprise innovante lors d'un salon professionnel régional.

### Démarche & Livrables
Mise en page épurée axée sur la lisibilité à distance. Production d'un kakémono vertical haute définition, d'un flyer triptyque informatif et de cartes de visite professionnelles.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: false,
    ordre: 4,
    visible: true,
  },
  {
    slug: "demo-packaging-jus-locaux",
    titre: "Packaging, gamme de jus locaux (projet test)",
    description: "Étiquettes et déclinaison de gamme pour une marque de jus fictive.",
    tags: ["Design Graphique"],
    contenu: `### Contexte & Objectif
Habillage packaging d'une gamme de jus de fruits naturels locaux, associant fraîcheur et ancrage culturel.

### Démarche & Livrables
Création d'étiquettes modulaires avec codes couleurs distincts par saveur. Stylisation d'illustrations de fruits tropicaux et hiérarchisation claire des informations nutritionnelles et de provenance.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: false,
    ordre: 5,
    visible: true,
  },
  {
    slug: "demo-visuels-reseaux-sociaux",
    titre: "Visuels pour réseaux sociaux, campagne de lancement (projet test)",
    description: "Carrousels, stories et publications pour le lancement d'un produit fictif.",
    tags: ["Design Graphique", "Communication digitale"],
    contenu: `### Contexte & Objectif
Élaboration d'une série de contenus digitaux pour orchestrer le compte à rebours et le lancement officiel d'une nouvelle offre de services.

### Démarche & Livrables
Création de carrousels pédagogiques à forte valeur ajoutée, de stories animées interactives et de publications de synthèse au format optimisé pour les canaux sociaux.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: false,
    ordre: 6,
    visible: true,
  },
  {
    slug: "demo-charte-marque-startup",
    titre: "Brand book, startup de livraison (projet test)",
    description: "Positionnement, ton de voix, charte graphique et règles d'usage d'une startup fictive.",
    tags: ["Branding & Stratégie Com"],
    contenu: `### Contexte & Objectif
Formalisation complète de l'identité de marque d'une startup de logistique urbaine durable pour unifier la communication interne et externe.

### Démarche & Livrables
Définition des piliers de marque, du ton de voix éditorial, de la grille typographique et du système d'icônes. Rédaction d'un brand book exhaustif guidant le déploiement multi-support.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: true,
    ordre: 7,
    visible: true,
  },
  {
    slug: "demo-strategie-com-association",
    titre: "Stratégie de communication digitale, association (projet test)",
    description: "Diagnostic, cibles, canaux et plan d'actions sur 90 jours pour une association fictive.",
    tags: ["Branding & Stratégie Com", "Communication digitale"],
    contenu: `### Contexte & Objectif
Accompagnement d'une structure associative pour accroître sa visibilité et mobiliser de nouveaux adhérents et bénévoles.

### Démarche & Livrables
Audit des points de contact existants, cartographie des personas, choix des canaux prioritaires et élaboration d'une feuille de route opérationnelle sur trois mois avec indicateurs qualitatifs.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: false,
    ordre: 8,
    visible: true,
  },
  {
    slug: "demo-calendrier-editorial-boutique",
    titre: "Calendrier éditorial, boutique en ligne (projet test)",
    description: "Plan de contenus mensuel, formats et indicateurs de suivi pour une boutique fictive.",
    tags: ["Communication digitale"],
    contenu: `### Contexte & Objectif
Structuration du rythme de publication éditorial d'un commerce de détail en ligne pour animer sa communauté de clients.

### Démarche & Livrables
Mise en place d'une matrice éditoriale mensuelle segmentée par thématiques, formats (conseils, coulisses, nouveautés) et calendrier prévisionnel des publications.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: false,
    ordre: 9,
    visible: true,
  },
  {
    slug: "demo-teaser-evenement-culturel",
    titre: "Teaser de 30 secondes, événement culturel (projet test)",
    description: "Montage dynamique rythmé par le son pour annoncer un événement fictif.",
    tags: ["Montage Vidéo"],
    contenu: `### Contexte & Objectif
Montage d'une vidéo courte de 30 secondes pour susciter la curiosité et amorcer la billetterie d'une rencontre culturelle.

### Démarche & Livrables
Sélection de plans percutants, synchronisation millimétrée sur les accents d'une bande sonore rythmée, travail des transitions visuelles et titrage soigné en fin de vidéo.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: true,
    ordre: 10,
    visible: true,
  },
  {
    slug: "demo-clip-promotionnel-produit",
    titre: "Clip promotionnel, lancement de produit (projet test)",
    description: "Clip court présentant un produit fictif, avec habillage et titrage.",
    tags: ["Montage Vidéo"],
    contenu: `### Contexte & Objectif
Valorisation des caractéristiques d'un accessoire du quotidien à travers une vidéo promotionnelle épurée et didactique.

### Démarche & Livrables
Montage séquentiel mettant en valeur les détails du produit, étalonnage lumineux naturel, habillage typographique moderne et sound design renforçant les moments forts.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: false,
    ordre: 11,
    visible: true,
  },
  {
    slug: "demo-interview-webinaire",
    titre: "Interview montée et sous-titrée, webinaire (projet test)",
    description: "Montage d'un entretien avec sous-titres et habillage pour un webinaire fictif.",
    tags: ["Montage Vidéo"],
    contenu: `### Contexte & Objectif
Traitement et mise en forme professionnelle d'une interview d'expert pour une diffusion en différé sur les réseaux professionnels.

### Démarche & Livrables
Nettoyage audio, découpage des temps morts, intégration de synthés nominatifs, habillage graphique aux couleurs du webinaire et sous-titrage synchronisé pour lecture sans son.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: false,
    ordre: 12,
    visible: true,
  },
  {
    slug: "demo-maquette-app-depenses",
    titre: "Maquette mobile Figma, application de suivi de dépenses (projet test)",
    description: "Parcours utilisateur, maquettes et prototype interactif d'une application fictive.",
    tags: ["Design UI/UX & Motion"],
    contenu: `### Contexte & Objectif
Conception ergonomique d'une application mobile d'éducation financière et de suivi des dépenses quotidiennes pour jeunes actifs.

### Démarche & Livrables
Définition des flux utilisateurs, wireframing basse fidélité puis réalisation des écrans haute fidélité sous Figma avec prototype cliquable testant la saisie rapide des dépenses.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: true,
    ordre: 13,
    visible: true,
  },
  {
    slug: "demo-design-system-formation",
    titre: "Design system et prototype, plateforme de formation (projet test)",
    description: "Composants, règles d'usage et prototype pour une plateforme fictive.",
    tags: ["Design UI/UX & Motion"],
    contenu: `### Contexte & Objectif
Harmonisation des interfaces et des parcours d'apprentissage d'un espace de formation en ligne.

### Démarche & Livrables
Création d'une bibliothèque complète de composants modulaires (boutons, cartes de cours, formulaires, barres de progression) et assemblage du prototype interactif de tableau de bord.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: false,
    ordre: 14,
    visible: true,
  },
  {
    slug: "demo-generateur-visuels-ia",
    titre: "Générateur de visuels publicitaires par IA (projet test)",
    description: "Pipeline de génération de visuels à partir de prompts calibrés et de scripts.",
    tags: ["IA Product Creator", "Communication digitale"],
    contenu: `### Contexte & Objectif
Expérimentation d'un flux automatisé d'aide à la création visuelle publicitaire respectant des contraintes de charte prédéfinies.

### Démarche & Livrables
Ingénierie de prompts textuels spécialisés, structuration de scripts d'automatisation et retouche de mise en conformité graphique pour tester la vélocité de production créative.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: true,
    ordre: 15,
    visible: true,
  },
  {
    slug: "demo-assistant-redaction-com",
    titre: "Assistant de rédaction pour la communication (projet test)",
    description: "Prototype proposant des textes de publications selon le ton d'une marque fictive.",
    tags: ["IA Product Creator", "Communication digitale"],
    contenu: `### Contexte & Objectif
Développement d'un prototype conversationnel pour accélérer la rédaction de micro-contenus tout en maintenant la cohérence d'un ton de voix spécifique.

### Démarche & Livrables
Configuration d'un modèle d'assistance paramétré avec des exemples types, tests de variation de style et formalisation du guide d'utilisation opérationnel.

*Projet test réalisé dans le cadre de la formation.*`,
    featured: false,
    ordre: 16,
    visible: true,
  },
];

// 4. Projets d'entreprise masqués (Simplon, 3 projets)
const MASKED_SIMPLON_PROJECTS = [
  {
    slug: "entreprise-projet-1",
    titre: "Projet d'entreprise n°1, titre à renseigner",
    description: "Projet réalisé pendant la formation Pratique IA Product Creator (Simplon). Détails à renseigner.",
    tags: ["a-renseigner"],
    contenu: `### Contexte
Projet réalisé pendant la formation « Pratique IA Product Creator » (Simplon).

### Détails à renseigner
Titre exact, rôle, démarches et livrables à compléter par Sylla Youssouf.`,
    featured: false,
    ordre: 201,
    visible: false,
  },
  {
    slug: "entreprise-projet-2",
    titre: "Projet d'entreprise n°2, titre à renseigner",
    description: "Projet réalisé pendant la formation Pratique IA Product Creator (Simplon). Détails à renseigner.",
    tags: ["a-renseigner"],
    contenu: `### Contexte
Projet réalisé pendant la formation « Pratique IA Product Creator » (Simplon).

### Détails à renseigner
Titre exact, rôle, démarches et livrables à compléter par Sylla Youssouf.`,
    featured: false,
    ordre: 202,
    visible: false,
  },
  {
    slug: "entreprise-projet-3",
    titre: "Projet d'entreprise n°3, titre à renseigner",
    description: "Projet réalisé pendant la formation Pratique IA Product Creator (Simplon). Détails à renseigner.",
    tags: ["a-renseigner"],
    contenu: `### Contexte
Projet réalisé pendant la formation « Pratique IA Product Creator » (Simplon).

### Détails à renseigner
Titre exact, rôle, démarches et livrables à compléter par Sylla Youssouf.`,
    featured: false,
    ordre: 203,
    visible: false,
  },
];

// 5. Sous-portfolios ciblés
const SUBPORTFOLIOS_DATA = [
  {
    slug: "dev",
    label: "Développeur web",
    description: "Sélection de projets d'ingénierie web, architectures logicielles et interfaces modernes.",
    actif: true,
    projectSlugs: [
      "blog-wordpress-headless-nextjs",
      "systeme-gestion-recrutements",
      "application-gestion-taches",
      "site-freelance-personnel",
      "site-full-services-point-sarl",
      "site-mashar-immobilier",
      "portfolio-cv-personnel",
    ],
  },
  {
    slug: "referent-digital",
    label: "Référent digital",
    description: "Projets alliant design graphique, branding stratégique, communication digitale et innovation IA.",
    actif: true,
    projectSlugs: [
      // Design Graphique (6)
      "demo-identite-cafe-artisanal",
      "demo-affiches-festival-musique",
      "demo-illustrations-mascotte-icones",
      "demo-flyers-kakemonos-salon",
      "demo-packaging-jus-locaux",
      "demo-visuels-reseaux-sociaux",
      // Branding & Stratégie Com (3)
      "demo-charte-marque-startup",
      "demo-strategie-com-association",
      "demo-calendrier-editorial-boutique",
      // IA Product Creator (2)
      "demo-generateur-visuels-ia",
      "demo-assistant-redaction-com",
    ],
  },
  {
    slug: "video",
    label: "Monteur vidéo",
    description: "Créations audiovisuelles, rythme cinématique, motion design et interfaces interactives.",
    actif: true,
    projectSlugs: [
      // Montage Vidéo (3)
      "demo-teaser-evenement-culturel",
      "demo-clip-promotionnel-produit",
      "demo-interview-webinaire",
      // Design UI/UX & Motion (2)
      "demo-maquette-app-depenses",
      "demo-design-system-formation",
    ],
  },
];

// 6. Profils & Configurations Templates
const PROFILES_DATA = [
  {
    slug: "default",
    label: "Profil Général (Accueil)",
    template: "creatif",
    accent: "default",
    isDefault: true,
    actif: true,
    subPortfolioSlug: null,
    hero: {
      headline: "JE CRÉE DES IDENTITÉS, DES CONTENUS ET DES EXPÉRIENCES NUMÉRIQUES.",
      subline: "Communication digitale, design graphique et développement web, de l'idée à la mise en ligne.",
      tagline: "Double casquette Créative & Ingénierie logicielle",
      ctaPrimary: {
        label: "Voir mes réalisations",
        href: "/projets",
      },
      ctaSecondary: {
        label: "Me contacter",
        href: "/contact",
      },
      media: {
        kind: "abstract",
      },
    },
    sections: [
      { key: "hero", visible: true, order: 0 },
      { key: "apropos", visible: true, order: 1 },
      { key: "projets", visible: true, order: 2 },
      { key: "competences", visible: true, order: 3 },
      { key: "parcours", visible: true, order: 4 },
      { key: "contact", visible: true, order: 5 },
    ],
  },
  {
    slug: "dev",
    label: "Développeur web",
    template: "developpeur",
    accent: "default",
    isDefault: false,
    actif: true,
    subPortfolioSlug: "dev",
    hero: {
      headline: "JE CONÇOIS ET DÉVELOPPE DES APPLICATIONS WEB FIABLES.",
      subline: "Développeur web full stack · Laravel · React · Next.js · PostgreSQL",
      tagline: "Ingénierie logicielle & Architecture robuste",
      ctaPrimary: {
        label: "Voir mes projets",
        href: "#projets",
      },
      ctaSecondary: {
        label: "Me contacter",
        href: "/contact",
      },
      media: {
        kind: "abstract",
      },
    },
    sections: [
      { key: "hero", visible: true, order: 0 },
      { key: "apropos", visible: true, order: 1 },
      { key: "projets", visible: true, order: 2 },
      { key: "competences", visible: true, order: 3 },
      { key: "parcours", visible: true, order: 4 },
      { key: "contact", visible: true, order: 5 },
    ],
  },
  {
    slug: "referent-digital",
    label: "Référent digital",
    template: "creatif",
    accent: "default",
    isDefault: false,
    actif: true,
    subPortfolioSlug: "referent-digital",
    hero: {
      headline: "VOTRE PRÉSENCE DIGITALE, DE LA STRATÉGIE AU VISUEL.",
      subline: "Référent digital : communication digitale, branding, design graphique et usage de l'IA.",
      tagline: "Créativité visuelle & Stratégie d'impact",
      ctaPrimary: {
        label: "Voir mes projets",
        href: "#projets",
      },
      ctaSecondary: {
        label: "Discutons de votre projet",
        href: "/contact",
      },
      media: {
        kind: "abstract",
      },
    },
    sections: [
      { key: "hero", visible: true, order: 0 },
      { key: "apropos", visible: true, order: 1 },
      { key: "projets", visible: true, order: 2 },
      { key: "competences", visible: true, order: 3 },
      { key: "parcours", visible: true, order: 4 },
      { key: "contact", visible: true, order: 5 },
    ],
  },
  {
    slug: "video",
    label: "Monteur vidéo",
    template: "immersif",
    accent: "default",
    isDefault: false,
    actif: true,
    subPortfolioSlug: "video",
    hero: {
      headline: "DES IMAGES QUI BOUGENT, UN RÉCIT QUI TIENT.",
      subline: "Montage vidéo, motion et direction visuelle.",
      tagline: "Narration visuelle & Expérience cinématique",
      ctaPrimary: {
        label: "Voir mes projets",
        href: "#projets",
      },
      ctaSecondary: {
        label: "Me contacter",
        href: "/contact",
      },
      media: {
        kind: "abstract",
      },
    },
    sections: [
      { key: "hero", visible: true, order: 0 },
      { key: "apropos", visible: true, order: 1 },
      { key: "projets", visible: true, order: 2 },
      { key: "competences", visible: true, order: 3 },
      { key: "parcours", visible: true, order: 4 },
      { key: "contact", visible: true, order: 5 },
    ],
  },
];

// ============================================================================
// EXÉCUTION DU SCRIPT
// ============================================================================

async function runSeed() {
  const isApply = process.argv.includes("--apply");

  console.log("=================================================================");
  console.log("   SEED DE DÉPART DE LA BASE DE DÉVELOPPEMENT (SEED-DEMO)        ");
  console.log(`   MODE : ${isApply ? "⚠️ ÉCRITURE RÉELLE (--apply)" : "🔍 SIMULATION (Dry Run)"}`);
  console.log("=================================================================\n");

  if (process.env.NODE_ENV === "production") {
    console.error("❌ ERREUR DE SÉCURITÉ : Ce seed ne doit JAMAIS s'exécuter en environnement de production.");
    process.exit(1);
  }

  // Affichage de l'hôte cible sans secrets
  try {
    const dbUrl = process.env.DATABASE_URL || "";
    const parsed = new URL(dbUrl);
    console.log(`📡 Hôte cible : ${parsed.host} (Base : ${parsed.pathname.replace("/", "")})\n`);
  } catch {
    console.log("📡 Hôte cible : [analyse de l'URL indisponible]\n");
  }

  // Compteurs initiaux en base
  const initialProjectsCount = await prisma.project.count();
  const initialSubPortfoliosCount = await prisma.subPortfolio.count();
  const initialProfilesCount = await prisma.profile.count();
  const initialSiteSettingsCount = await prisma.siteSettings.count();

  console.log("📊 COMPTEURS ACTUELS EN BASE :");
  console.log(`   - Projets : ${initialProjectsCount}`);
  console.log(`   - Sous-portfolios : ${initialSubPortfoliosCount}`);
  console.log(`   - Profils : ${initialProfilesCount}`);
  console.log(`   - Réglages du site (SiteSettings) : ${initialSiteSettingsCount}\n`);

  const allProjectsToUpsert = [
    ...REAL_PROJECTS,
    ...DEMO_PROJECTS,
    ...MASKED_SIMPLON_PROJECTS,
  ];

  console.log("📋 DÉTAIL DES ÉLÉMENTS PRÉVUS :");
  console.log(`   - Projets réels à importer : ${REAL_PROJECTS.length}`);
  console.log(`   - Projets démo à importer ("demo-*") : ${DEMO_PROJECTS.length}`);
  console.log(`   - Projets Simplon masqués : ${MASKED_SIMPLON_PROJECTS.length}`);
  console.log(`   TOTAL PROJETS : ${allProjectsToUpsert.length} (Attendu : 26)`);
  console.log(`   - Sous-portfolios ciblés : ${SUBPORTFOLIOS_DATA.length} (dev, referent-digital, video)`);
  console.log(`   - Profils configurés : ${PROFILES_DATA.length} (default, dev, referent-digital, video)`);
  console.log(`   - Réglages globaux du site : 1 (Nom: "${SITE_SETTINGS_DATA.nom}")\n`);

  if (!isApply) {
    console.log("-----------------------------------------------------------------");
    console.log("🔍 SIMULATION TERMINÉE — AUCUNE MODIFICATION N'A ÉTÉ APPORTÉE.");
    console.log("   Pour appliquer réellement ce seed sur la base de développement :");
    console.log("   npm run seed:demo -- --apply");
    console.log("-----------------------------------------------------------------\n");
    return;
  }

  console.log("🚀 APPLICATION DES MODIFICATIONS SUR LA BASE DE DÉVELOPPEMENT...\n");

  // 1. Réglages du site
  const existingSettings = await prisma.siteSettings.findFirst();
  if (existingSettings) {
    await prisma.siteSettings.update({
      where: { id: existingSettings.id },
      data: SITE_SETTINGS_DATA,
    });
    console.log("   ✅ Réglages du site mis à jour.");
  } else {
    await prisma.siteSettings.create({
      data: SITE_SETTINGS_DATA,
    });
    console.log("   ✅ Réglages du site créés.");
  }

  // 2. Projets (Upsert par slug)
  console.log("\n🔹 Synchronisation des 26 projets...");
  const projectMap = new Map<string, string>(); // slug -> id

  for (const p of allProjectsToUpsert) {
    const upserted = await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        titre: p.titre,
        description: p.description,
        contenu: p.contenu,
        tags: p.tags,
        ordre: p.ordre,
        visible: p.visible,
        featured: p.featured,
        links: {},
        coverImage: ONLINE_PROJECT_IMAGES[p.slug] || `/images/projects/${p.slug}.jpg`,
      },
      create: {
        slug: p.slug,
        titre: p.titre,
        description: p.description,
        contenu: p.contenu,
        tags: p.tags,
        ordre: p.ordre,
        visible: p.visible,
        featured: p.featured,
        links: {},
        coverImage: ONLINE_PROJECT_IMAGES[p.slug] || `/images/projects/${p.slug}.jpg`,
      },
    });
    projectMap.set(upserted.slug, upserted.id);
  }
  console.log("   ✅ 26 projets synchronisés avec succès.");

  // 3. Sous-portfolios et liaisons SubPortfolioProject
  console.log("\n🔹 Synchronisation des 3 sous-portfolios et liaisons...");
  const subPortfolioMap = new Map<string, string>(); // slug -> id

  for (const sp of SUBPORTFOLIOS_DATA) {
    const upsertedSp = await prisma.subPortfolio.upsert({
      where: { slug: sp.slug },
      update: {
        label: sp.label,
        description: sp.description,
        actif: sp.actif,
      },
      create: {
        slug: sp.slug,
        label: sp.label,
        description: sp.description,
        actif: sp.actif,
      },
    });
    subPortfolioMap.set(upsertedSp.slug, upsertedSp.id);

    // Synchronisation ordonnée des liaisons avec les projets
    let orderIndex = 0;
    for (const projectSlug of sp.projectSlugs) {
      const projectId = projectMap.get(projectSlug);
      if (projectId) {
        await prisma.subPortfolioProject.upsert({
          where: {
            subPortfolioId_projectId: {
              subPortfolioId: upsertedSp.id,
              projectId,
            },
          },
          update: {
            ordre: orderIndex,
          },
          create: {
            subPortfolioId: upsertedSp.id,
            projectId,
            ordre: orderIndex,
          },
        });
        orderIndex++;
      }
    }
    console.log(`   ✅ Sous-portfolio "/${sp.slug}" synchronisé (${sp.projectSlugs.length} projets liés).`);
  }

  // 4. Profils & association avec sous-portfolios
  console.log("\n🔹 Synchronisation des 4 profils...");
  for (const prof of PROFILES_DATA) {
    const linkedSubPortfolioId = prof.subPortfolioSlug
      ? subPortfolioMap.get(prof.subPortfolioSlug) || null
      : null;

    await prisma.profile.upsert({
      where: { slug: prof.slug },
      update: {
        label: prof.label,
        template: prof.template,
        accent: prof.accent,
        isDefault: prof.isDefault,
        actif: prof.actif,
        hero: prof.hero,
        sections: prof.sections,
        subPortfolioId: linkedSubPortfolioId,
      },
      create: {
        slug: prof.slug,
        label: prof.label,
        template: prof.template,
        accent: prof.accent,
        isDefault: prof.isDefault,
        actif: prof.actif,
        hero: prof.hero,
        sections: prof.sections,
        subPortfolioId: linkedSubPortfolioId,
      },
    });
    console.log(`   ✅ Profil "${prof.slug}" configuré (template: ${prof.template}, default: ${prof.isDefault}).`);
  }

  // Compteurs finaux en base
  const finalProjectsCount = await prisma.project.count();
  const finalSubPortfoliosCount = await prisma.subPortfolio.count();
  const finalProfilesCount = await prisma.profile.count();
  const finalSiteSettingsCount = await prisma.siteSettings.count();

  console.log("\n=================================================================");
  console.log("   ✅ SEED APPLIQUÉ AVEC SUCCÈS SUR LA BASE DE DÉVELOPPEMENT     ");
  console.log("=================================================================");
  console.log("📊 COMPTEURS FINAUX EN BASE :");
  console.log(`   - Projets : ${finalProjectsCount} (Attendu : 26)`);
  console.log(`   - Sous-portfolios : ${finalSubPortfoliosCount} (Attendu : 3)`);
  console.log(`   - Profils : ${finalProfilesCount} (Attendu : 4)`);
  console.log(`   - Réglages du site : ${finalSiteSettingsCount} (Attendu : 1)`);
  console.log("=================================================================\n");
}

runSeed()
  .catch((e) => {
    console.error("❌ Erreur pendant l'exécution du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
