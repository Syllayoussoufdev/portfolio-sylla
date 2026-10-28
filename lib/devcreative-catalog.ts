import type { OfferStatusType } from "./validations/devcreative";

export interface ServiceOfferData {
  id: string;
  slug: string;
  famille: string;
  titre: string;
  accroche: string;
  livrables: string[];
  delai: string;
  prixDepuis: number | null;
  prixLabel: string | null;
  unite: string;
  phase: number;
  statut: OfferStatusType;
  projectId?: string | null;
  project?: { id: string; titre: string; slug: string } | null;
  ordre: number;
  visible: boolean;
}

export interface ServicePackData {
  id: string;
  slug: string;
  titre: string;
  sousTitre: string | null;
  prix: number;
  economie: string | null;
  delai: string;
  servicesInclus: string[];
  resultat: string | null;
  phase: number;
  statut: OfferStatusType;
  misEnAvant: boolean;
  ordre: number;
  visible: boolean;
}

export interface TestimonialData {
  id: string;
  auteur: string;
  role: string;
  entreprise: string;
  citation: string;
  photo: string | null;
  projectId?: string | null;
  accordEcrit: boolean;
  visible: boolean;
  ordre: number;
}

export interface FaqItemData {
  id: string;
  question: string;
  reponse: string;
  categorie: string;
  ordre: number;
  visible: boolean;
}

export function formatFCFA(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "Sur devis";
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
}

// ============================================================================
// DONNÉES DE RÉFÉRENCE DU PRD (Section 3 — Catalogue des 5 familles & 4 packs)
// ============================================================================

export const INITIAL_SERVICE_OFFERS: Omit<ServiceOfferData, "id" | "project">[] = [
  // Famille 1 : Conception & Identité
  {
    slug: "identite-express",
    famille: "conception",
    titre: "Identité Visuelle Express (Tarif d'appel attractif)",
    accroche:
      "Idéal pour démarrer : donnez immédiatement une image professionnelle, crédible et mémorable à votre activité.",
    livrables: [
      "Inclus : Logotype principal haute définition + déclinaison icône/avatar",
      "Inclus : Palette de couleurs de marque & duo typographique calibré",
      "Inclus : Fichiers prêts à l'emploi (PNG transparent, JPG HD & SVG vectoriel)",
      "Annexe / Option : Charte graphique étendue et papeterie print (sur devis)",
    ],
    delai: "3 à 5 jours",
    prixDepuis: 50000,
    prixLabel: "dès 50 000 FCFA",
    unite: "unique",
    phase: 1,
    statut: "DISPONIBLE",
    projectId: null,
    ordre: 1,
    visible: true,
  },
  {
    slug: "identite-complete",
    famille: "conception",
    titre: "Identité de Marque Complète & Brand Book",
    accroche:
      "Un système visuel complet, sur-mesure et distinctif pour installer durablement votre marque face à la concurrence.",
    livrables: [
      "Inclus : Direction artistique complète, logotype & déclinaisons responsive",
      "Inclus : Brand Book complet (règles d'usage, typographies, univers graphique)",
      "Inclus : Kit visuel réseaux sociaux (bannières, gabarits de posts prêts à l'emploi)",
      "Inclus : Fichiers sources vectoriels (Figma / Illustrator) + guide d'export",
      "Annexe / Option : Déclinaisons supports physiques (cartes de visite, packaging, kakémonos)",
    ],
    delai: "7 à 10 jours",
    prixDepuis: 120000,
    prixLabel: "dès 120 000 FCFA",
    unite: "unique",
    phase: 1,
    statut: "DISPONIBLE",
    projectId: null,
    ordre: 2,
    visible: true,
  },

  // Famille 2 : Stratégie Digitale
  {
    slug: "audit-express-reseaux",
    famille: "strategie",
    titre: "Audit Express & Diagnostic de Présence",
    accroche:
      "Identifiez précisément pourquoi vos visiteurs ne convertissent pas et repartez avec un plan d'action immédiat.",
    livrables: [
      "Inclus : Diagnostic complet de vos profils, liens et tunnels actuels",
      "Inclus : Analyse de 3 concurrents directs sur votre secteur",
      "Inclus : Feuille de route priorisée en 10 actions rapides pour booster vos leads",
      "Annexe : 100 % déduit de votre facture si vous commandez ensuite un site ou un pack",
    ],
    delai: "2 à 4 jours",
    prixDepuis: 50000,
    prixLabel: "50 000 FCFA (Offert si commande)",
    unite: "unique",
    phase: 1,
    statut: "DISPONIBLE",
    projectId: null,
    ordre: 3,
    visible: true,
  },
  {
    slug: "strategie-communication",
    famille: "strategie",
    titre: "Stratégie de Communication & Acquisition",
    accroche:
      "Structurez votre prise de parole, vos contenus et votre tunnel pour transformer l'audience en demandes de devis régulières.",
    livrables: [
      "Inclus : Positionnement de marque, cibles prioritaires et piliers éditoriaux",
      "Inclus : Calendrier éditorial opérationnel sur 60 jours (TikTok / Reels / LinkedIn)",
      "Inclus : Architecture du parcours de conversion direct vers WhatsApp",
      "Annexe / Option : Production vidéo ou gestion des campagnes publicitaires (en option)",
    ],
    delai: "5 à 7 jours",
    prixDepuis: 80000,
    prixLabel: "dès 80 000 FCFA",
    unite: "unique",
    phase: 1,
    statut: "DISPONIBLE",
    projectId: null,
    ordre: 4,
    visible: true,
  },

  // Famille 3 : Présence en ligne & Web
  {
    slug: "site-vitrine-essentiel",
    famille: "presence-en-ligne",
    titre: "Site Vitrine Essentiel (Landing Page Conversion)",
    accroche:
      "Une présence web rapide, responsive et moderne pour convertir vos visiteurs en contacts qualifiés sur WhatsApp.",
    livrables: [
      "Inclus : One-Page structurée (jusqu'à 4-5 sections clés : Hero, Services, Preuves, Contact)",
      "Inclus : Intégration bouton WhatsApp flottant avec message pré-rempli & formulaire brief",
      "Inclus : Optimisation mobile ultra-rapide 4G, SEO local & aperçus réseaux sociaux",
      "Inclus : Mise en ligne sécurisée + formation rapide à la prise en main",
      "Annexe / Option : Nom de domaine & hébergement annuel (en sus à prix coûtant ou fourni par vos soins)",
      "Annexe / Option : Rédaction intégrale des textes de présentation (en option)",
    ],
    delai: "5 à 7 jours",
    prixDepuis: 90000,
    prixLabel: "dès 90 000 FCFA",
    unite: "unique",
    phase: 1,
    statut: "DISPONIBLE",
    projectId: null,
    ordre: 5,
    visible: true,
  },
  {
    slug: "site-vitrine-standard",
    famille: "presence-en-ligne",
    titre: "Site Vitrine Standard Multi-Pages",
    accroche:
      "Le site de référence pour asseoir votre autorité, présenter vos offres en détail et rassurer les décideurs.",
    livrables: [
      "Inclus : Jusqu'à 5-6 pages dédiées (Accueil, Services, Réalisations, À propos, Contact)",
      "Inclus : Design haut de gamme avec micro-interactions et animations douces",
      "Inclus : Back-office d'administration pour mettre à jour vos textes, photos et réalisations",
      "Inclus : Intégration Analytics, SEO technique complet & suivi des leads",
      "Annexe / Option : Nom de domaine et hébergement annuel",
      "Annexe / Option : Module multilingue (Français / Anglais) ou blog dynamique",
    ],
    delai: "10 à 14 jours",
    prixDepuis: 180000,
    prixLabel: "dès 180 000 FCFA",
    unite: "unique",
    phase: 1,
    statut: "DISPONIBLE",
    projectId: null,
    ordre: 6,
    visible: true,
  },
  {
    slug: "plateforme-dynamique-backoffice",
    famille: "presence-en-ligne",
    titre: "Plateforme Web Dynamique & Back-Office Métier",
    accroche:
      "Automatisez et digitalisez votre activité avec une application web complète (espace client, réservations, gestion).",
    livrables: [
      "Inclus : Architecture Next.js moderne, base de données sécurisée PostgreSQL & API sur-mesure",
      "Inclus : Tableau de bord administrateur complet avec gestion des utilisateurs et données",
      "Inclus : Notifications automatisées par email & alertes WhatsApp",
      "⚠️ REQUIS : Projet nécessitant obligatoirement un brief détaillé et un devis précis sur-mesure",
      "Annexe / Option : Passerelle de paiement mobile money (Wave, Orange Money) ou carte bancaire",
    ],
    delai: "3 à 5 semaines (selon cahier des charges)",
    prixDepuis: 350000,
    prixLabel: "dès 350 000 FCFA (Sur brief & devis précis)",
    unite: "unique",
    phase: 1,
    statut: "DISPONIBLE",
    projectId: null,
    ordre: 7,
    visible: true,
  },
  {
    slug: "community-management-mensuel",
    famille: "presence-en-ligne",
    titre: "Gestion de Réseaux Sociaux & Community Management",
    accroche:
      "Restez visible chaque semaine avec des visuels cohérents et une animation régulière de vos réseaux sociaux.",
    livrables: [
      "Inclus : Création graphique des visuels et rédaction des publications engageantes",
      "Inclus : Formule Essentiel : 8 publications / mois (dès 50 000 FCFA / mois)",
      "Inclus : Formule Standard : 12 publications / mois + modération (80 000 FCFA / mois)",
      "Inclus : Formule Premium : 16 publications / mois + formats vidéo courts (120 000 FCFA / mois)",
      "Annexe : Budget publicitaire sponsorisé (Facebook/TikTok Ads) à définir séparément selon vos objectifs",
    ],
    delai: "Mensuel (sans engagement longue durée)",
    prixDepuis: 50000,
    prixLabel: "dès 50 000 FCFA / mois",
    unite: "mensuel",
    phase: 1,
    statut: "DISPONIBLE",
    projectId: null,
    ordre: 8,
    visible: true,
  },
  {
    slug: "forfait-maintenance-securite",
    famille: "presence-en-ligne",
    titre: "Maintenance Technique, Sécurité & Sauvegardes",
    accroche:
      "Garantissez la disponibilité permanente, la rapidité et la sécurité de votre site sans vous soucier de la technique.",
    livrables: [
      "Inclus : Mises à jour régulières de sécurité, monitoring 24/7 et sauvegardes automatiques",
      "Inclus : Petites modifications mensuelles de textes ou visuels incluses (jusqu'à 1h)",
      "Inclus : Support prioritaire sur WhatsApp en cas d'urgence technique",
    ],
    delai: "Mensuel ou annuel",
    prixDepuis: 25000,
    prixLabel: "dès 25 000 FCFA / mois",
    unite: "mensuel",
    phase: 1,
    statut: "DISPONIBLE",
    projectId: null,
    ordre: 9,
    visible: true,
  },

  // Famille 4 : Plateforme Mobile Business
  {
    slug: "application-mobile-business",
    famille: "mobile-business",
    titre: "Application Mobile Orientée Activité (iOS & Android)",
    accroche:
      "Offrez à vos clients une expérience mobile fluide pour commander, suivre leurs opérations et payer simplement.",
    livrables: [
      "Inclus : Design UI/UX ergonomique pensé pour l'usage smartphone",
      "Inclus : Application iOS & Android + interface de gestion web connectée",
      "Inclus : Parcours de commande, suivi en temps réel & notifications push",
      "⚠️ REQUIS : Projet nécessitant obligatoirement un brief détaillé et un devis précis selon vos fonctionnalités",
      "Annexe : Comptes développeur Apple Store (99$/an) et Google Play (25$) à la charge du client",
    ],
    delai: "4 à 8 semaines (selon cahier des charges)",
    prixDepuis: 450000,
    prixLabel: "dès 450 000 FCFA (Sur brief & devis précis)",
    unite: "unique",
    phase: 1,
    statut: "DISPONIBLE",
    projectId: null,
    ordre: 10,
    visible: true,
  },

  // Famille 5 : Missions Ponctuelles & Tech
  {
    slug: "mission-ponctuelle-expertise",
    famille: "missions-ponctuelles",
    titre: "Intervention Rapide, Revue de Code & Dépannage",
    accroche:
      "Débloquez rapidement un problème technique, sécurisez votre architecture ou accélérez une livraison en cours.",
    livrables: [
      "Inclus : Diagnostic technique rapide et identification de la source du blocage",
      "Inclus : Correction de bugs critiques ou optimisation de performances",
      "Inclus : Livrable mesurable et rapport d'intervention validé en fin de mission",
      "Tarif : Dès 50 000 FCFA par intervention ciblée ou devis après échange WhatsApp",
    ],
    delai: "1 à 3 jours",
    prixDepuis: 50000,
    prixLabel: "dès 50 000 FCFA / intervention",
    unite: "journee",
    phase: 1,
    statut: "DISPONIBLE",
    projectId: null,
    ordre: 11,
    visible: true,
  },
];

export const INITIAL_SERVICE_PACKS: Omit<ServicePackData, "id">[] = [
  {
    slug: "pack-lancement",
    titre: "Pack Starter Lancement",
    sousTitre: "Idéal pour démarrer une activité avec une marque pro et un site prêt à convertir sans exploser son budget.",
    prix: 120000,
    economie: "Économisez 20 000 FCFA vs services séparés",
    delai: "7 à 10 jours",
    servicesInclus: [
      "Inclus : Identité visuelle express (Logo professionnel, palette couleurs, kit réseaux sociaux)",
      "Inclus : Site vitrine essentiel (1 page / landing page) responsive optimisé conversion WhatsApp",
      "Inclus : Formulaire de contact fonctionnel + configuration SEO de base pour Google",
      "Inclus : Formation rapide à la prise en main (30 min) pour gérer vos demandes",
      "Annexe / Option : Nom de domaine et hébergement (non inclus, configurés gratuitement si fournis)",
    ],
    resultat: "Une marque crédible et un site prêt à recevoir vos premiers clients en moins de 10 jours.",
    phase: 1,
    statut: "DISPONIBLE",
    misEnAvant: true,
    ordre: 1,
    visible: true,
  },
  {
    slug: "pack-presence",
    titre: "Pack Présence & Visibilité",
    sousTitre: "Pour asseoir votre présence de marque, détailler vos prestations et convertir sur mobile.",
    prix: 190000,
    economie: "Économisez 30 000 FCFA",
    delai: "10 à 14 jours",
    servicesInclus: [
      "Inclus : Identité de marque complète (Logo, déclinaisons, charte graphique et typographies)",
      "Inclus : Site vitrine multi-pages (jusqu'à 4-5 pages : Accueil, Services, Réalisations, Contact)",
      "Inclus : Kit visuel réseaux sociaux (templates de posts cohérents prêts à publier)",
      "Inclus : Intégration WhatsApp direct, SEO technique et configuration Google Analytics",
      "Annexe / Option : Animation mensuelle des réseaux (formule CM en supplément optionnel)",
    ],
    resultat: "Une image cohérente et un site multi-pages solide pour inspirer confiance aux décideurs.",
    phase: 1,
    statut: "DISPONIBLE",
    misEnAvant: false,
    ordre: 2,
    visible: true,
  },
  {
    slug: "pack-croissance",
    titre: "Pack Croissance & Acquisition",
    sousTitre: "La formule complète pour structurer votre acquisition et accélérer vos demandes de devis.",
    prix: 380000,
    economie: "Économisez 70 000 FCFA",
    delai: "3 à 4 semaines",
    servicesInclus: [
      "Inclus : Identité de marque complète & Brand Book détaillé",
      "Inclus : Site vitrine standard multi-pages avec back-office dynamique d'administration",
      "Inclus : Stratégie de communication & plan de conversion WhatsApp sur 60 jours",
      "Inclus : 1 mois de maintenance technique et support prioritaire offert",
      "Annexe / Option : Campagnes de publicité sponsorisée (budget média client à définir)",
    ],
    resultat: "Un écosystème digital complet conçu pour générer un flux régulier de demandes qualifiées.",
    phase: 1,
    statut: "DISPONIBLE",
    misEnAvant: false,
    ordre: 3,
    visible: true,
  },
  {
    slug: "pack-marque-complete",
    titre: "Pack Plateforme & Sur-Mesure",
    sousTitre: "Accompagnement d'envergure : marque intégrale, plateforme web dynamique ou application métier.",
    prix: 550000,
    economie: "Devis précis sur-mesure",
    delai: "4 à 6 semaines",
    servicesInclus: [
      "Inclus : Identité de marque intégrale + Direction artistique haut de gamme",
      "Inclus : Plateforme web dynamique ou application sur-mesure avec base de données et back-office",
      "Inclus : Architecture sécurisée, notifications automatisées et tableau de bord de gestion",
      "Inclus : 3 mois de maintenance technique, suivi et support prioritaire WhatsApp",
      "⚠️ REQUIS : Projet nécessitant un brief et un devis précis sur-mesure selon votre cahier des charges",
      "Annexe / Option : Passerelles de paiement (Mobile Money, Carte bancaire) selon vos besoins",
    ],
    resultat: "Une infrastructure digitale complète pour automatiser votre activité avec un interlocuteur unique.",
    phase: 1,
    statut: "DISPONIBLE",
    misEnAvant: false,
    ordre: 4,
    visible: true,
  },
];

export const INITIAL_TESTIMONIALS: Omit<TestimonialData, "id">[] = [
  {
    auteur: "Responsable Projet Digital",
    role: "Direction & Opérations",
    entreprise: "Structure accompagnée à Abidjan",
    citation:
      "Il ne se contente jamais de livrer un simple visuel ou du code : chaque écran est pensé pour rassurer nos clients et générer des prises de contact concrètes.",
    photo: null,
    projectId: null,
    accordEcrit: true,
    visible: true,
    ordre: 1,
  },
  {
    auteur: "Fondateur PME",
    role: "Gérant",
    entreprise: "Commerce & Services",
    citation:
      "Avoir un seul interlocuteur capable de concevoir notre identité visuelle et de développer toute notre plateforme web nous a fait gagner un temps précieux.",
    photo: null,
    projectId: null,
    accordEcrit: true,
    visible: true,
    ordre: 2,
  },
];

export const INITIAL_FAQ_ITEMS: Omit<FaqItemData, "id">[] = [
  {
    question: "Comment se déroule un projet du premier contact jusqu'à la mise en ligne ?",
    reponse:
      "Tout se passe en 4 étapes claires : 1) Brief & Cadrage (définition de vos objectifs, livrables et planning), 2) Maquette & Direction artistique (validation visuelle avant de coder), 3) Développement & Tests (création rapide sur serveur de prévisualisation), 4) Mise en ligne & Prise en main (déploiement et formation pour gérer votre contenu).",
    categorie: "Méthode",
    ordre: 1,
    visible: true,
  },
  {
    question: "Quels sont les délais moyens de livraison ?",
    reponse:
      "Comptez 5 à 7 jours pour une Identité Express, 7 à 10 jours pour un Site Vitrine Essentiel, et 12 à 15 jours pour un Site Standard ou un Pack Lancement. Chaque devis inclut une date de livraison ferme.",
    categorie: "Délais",
    ordre: 2,
    visible: true,
  },
  {
    question: "Comment fonctionnent les règlements et les tarifs en FCFA ?",
    reponse:
      "Les tarifs affichés sont transparents. Après validation du devis sur WhatsApp ou par email, le projet démarre avec un acompte d'engagement, puis le solde à la validation finale avant mise en production.",
    categorie: "Tarifs & Paiement",
    ordre: 3,
    visible: true,
  },
  {
    question: "Pourquoi certaines offres affichent le statut « Bientôt » ou « Liste d'attente » ?",
    reponse:
      "Pour garantir une qualité irréprochable et respecter chaque délai annoncé, j'ouvre mes prestations par phases. Les offres de Phase 1 sont immédiatement réservables ; vous pouvez rejoindre la liste d'attente des Phases 2 et 3 pour être prévenu en priorité dès l'ouverture d'un créneau.",
    categorie: "Disponibilité",
    ordre: 4,
    visible: true,
  },
  {
    question: "Serai-je autonome pour modifier mes textes, tarifs ou réalisations après la livraison ?",
    reponse:
      "Oui, à 100 %. Chaque site ou plateforme dynamique est livré avec un back-office d'administration sécurisé et intuitif qui vous permet de mettre à jour vos contenus sans toucher une seule ligne de code.",
    categorie: "Autonomie",
    ordre: 5,
    visible: true,
  },
];
