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
  // Famille 1 : Conception
  {
    slug: "identite-express",
    famille: "conception",
    titre: "Identité Visuelle Express",
    accroche:
      "Donnez immédiatement une image professionnelle et mémorable à votre activité pour rassurer vos premiers clients.",
    livrables: [
      "Logotype principal + déclinaisons (clair/sombre/icône)",
      "Palette de couleurs & duo typographique calibré",
      "Mini-charte d'utilisation PDF + kit réseaux sociaux",
    ],
    delai: "5 à 7 jours",
    prixDepuis: 100000,
    prixLabel: "dès 100 000 FCFA",
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
    titre: "Identité de Marque Complète",
    accroche:
      "Un système visuel complet sur-mesure pour imposer votre marque face à la concurrence sur tous vos supports.",
    livrables: [
      "Direction artistique complète & Brand Book détaillé",
      "Système d'icônes, illustrations et gabarits print/digital",
      "Fichiers sources vectoriels + guide de déploiement",
    ],
    delai: "10 à 14 jours",
    prixDepuis: 250000,
    prixLabel: "dès 250 000 FCFA",
    unite: "unique",
    phase: 3,
    statut: "BIENTOT",
    projectId: null,
    ordre: 2,
    visible: true,
  },

  // Famille 2 : Stratégie
  {
    slug: "audit-express-reseaux",
    famille: "strategie",
    titre: "Audit Express des Réseaux & Présence",
    accroche:
      "Identifiez précisément pourquoi vos visiteurs ne convertissent pas et repartez avec un plan d'action immédiat.",
    livrables: [
      "Diagnostic complet de vos profils et tunnels actuels",
      "Analyse de 3 concurrents directs sur votre marché",
      "Feuille de route priorisée en 10 actions rapides",
    ],
    delai: "3 à 5 jours",
    prixDepuis: 40000,
    prixLabel: "dès 40 000 FCFA",
    unite: "unique",
    phase: 2,
    statut: "BIENTOT",
    projectId: null,
    ordre: 3,
    visible: true,
  },
  {
    slug: "strategie-communication",
    famille: "strategie",
    titre: "Stratégie de Communication & Acquisition",
    accroche:
      "Structurez votre prise de parole et votre tunnel d'acquisition pour transformer votre audience en demandes de devis.",
    livrables: [
      "Positionnement, piliers éditoriaux et calendrier 90 jours",
      "Scripts de contenus courts (TikTok/Reels/LinkedIn)",
      "Architecture du parcours de conversion vers WhatsApp",
    ],
    delai: "7 à 10 jours",
    prixDepuis: 150000,
    prixLabel: "dès 150 000 FCFA",
    unite: "unique",
    phase: 3,
    statut: "BIENTOT",
    projectId: null,
    ordre: 4,
    visible: true,
  },

  // Famille 3 : Présence en ligne
  {
    slug: "site-vitrine-essentiel",
    famille: "presence-en-ligne",
    titre: "Site Vitrine Essentiel",
    accroche:
      "Une présence en ligne rapide, responsive et pensée pour convertir vos visiteurs en prospects qualifiés sur WhatsApp.",
    livrables: [
      "Design sur-mesure (jusqu'à 4 sections clés + formulaire brief)",
      "Optimisation mobile 4G, SEO local & aperçus WhatsApp/LinkedIn",
      "Mise en ligne sécurisée + formation prise en main (1h)",
    ],
    delai: "7 à 10 jours",
    prixDepuis: 200000,
    prixLabel: "dès 200 000 FCFA",
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
      "Le site de référence pour présenter vos offres en détail, rassurer les décideurs avec vos preuves et capter des leads.",
    livrables: [
      "Jusqu'à 6 pages dédiées (Accueil, Services, Études de cas, Contact)",
      "Animations éditoriales fluides & back-office d'administration",
      "Intégration Analytics, SEO technique complet & suivi des leads",
    ],
    delai: "12 à 15 jours",
    prixDepuis: 350000,
    prixLabel: "dès 350 000 FCFA",
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
    titre: "Plateforme Web Dynamique & Back-Office",
    accroche:
      "Automatisez votre activité avec une application web complète (catalogue, réservations, espace de gestion métier).",
    livrables: [
      "Architecture Next.js + Base PostgreSQL sécurisée",
      "Tableau de bord administrateur complet sur-mesure",
      "Notifications automatisées par email & WhatsApp",
    ],
    delai: "3 à 5 semaines",
    prixDepuis: 600000,
    prixLabel: "dès 600 000 FCFA",
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
    titre: "Gestion de Pages (CM Essentiel / Standard / Premium)",
    accroche:
      "Restez visible chaque semaine avec des visuels cohérents et une animation régulière de vos réseaux sociaux.",
    livrables: [
      "Création des visuels et rédaction des publications",
      "Formules : Essentiel (60k) · Standard (100k) · Premium (150k)",
      "Bilan mensuel des performances et demandes générées",
    ],
    delai: "Mensuel",
    prixDepuis: 60000,
    prixLabel: "60 000 / 100 000 / 150 000 FCFA / mois",
    unite: "mensuel",
    phase: 2,
    statut: "BIENTOT",
    projectId: null,
    ordre: 8,
    visible: true,
  },
  {
    slug: "forfait-maintenance-securite",
    famille: "presence-en-ligne",
    titre: "Maintenance, Sécurité & Sauvegardes",
    accroche:
      "Garantissez la disponibilité permanente, la rapidité et la sécurité de votre site sans vous soucier de la technique.",
    livrables: [
      "Mises à jour de sécurité, monitoring 24/7 & sauvegardes",
      "Modifications mineures de textes ou visuels incluses",
      "Support prioritaire sur WhatsApp en cas d'urgence",
    ],
    delai: "Continu",
    prixDepuis: 30000,
    prixLabel: "30 000 FCFA / mois",
    unite: "mensuel",
    phase: 1,
    statut: "DISPONIBLE",
    projectId: null,
    ordre: 9,
    visible: true,
  },

  // Famille 4 : Plateforme mobile business
  {
    slug: "application-mobile-business",
    famille: "mobile-business",
    titre: "Application Mobile Orientée Activité",
    accroche:
      "Offrez à vos clients une expérience mobile fluide pour commander, suivre leurs opérations et payer simplement.",
    livrables: [
      "Application iOS & Android + interface de gestion web",
      "Parcours de commande, suivi en temps réel & notifications",
      "Déploiement accompagné et maintenance évolutive",
    ],
    delai: "4 à 8 semaines (selon périmètre)",
    prixDepuis: null,
    prixLabel: "Sur devis (selon cahier des charges)",
    unite: "unique",
    phase: 1,
    statut: "DISPONIBLE",
    projectId: null,
    ordre: 10,
    visible: true,
  },

  // Famille 5 : Missions ponctuelles
  {
    slug: "mission-ponctuelle-expertise",
    famille: "missions-ponctuelles",
    titre: "Validation Technique, Revue de Code & Dépannage",
    accroche:
      "Débloquez rapidement un problème technique, sécurisez votre architecture ou accélérez une livraison en cours.",
    livrables: [
      "Audit d'architecture, sécurité ou performance (rapport écrit)",
      "Correction de bugs critiques ou refonte d'interface ciblée",
      "Livrable mesurable validé en fin d'intervention",
    ],
    delai: "1 à 5 jours",
    prixDepuis: null,
    prixLabel: "Forfait ou journée · Sur devis",
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
    titre: "Pack Lancement",
    sousTitre: "Idéal pour lancer une marque ou une activité avec une présence pro immédiate.",
    prix: 270000,
    economie: "Économisez 30 000 FCFA",
    delai: "10 à 14 jours",
    servicesInclus: [
      "Identité visuelle express (Logo, couleurs, typographies, kit réseaux)",
      "Site vitrine essentiel optimisé mobile & conversion WhatsApp",
      "Configuration SEO de base + formulaire de brief qualifié",
    ],
    resultat: "Une marque crédible et un site prêt à recevoir vos premiers clients en 2 semaines.",
    phase: 1,
    statut: "DISPONIBLE",
    misEnAvant: true,
    ordre: 1,
    visible: true,
  },
  {
    slug: "pack-presence",
    titre: "Pack Présence",
    sousTitre: "Pour créer votre identité et animer vos réseaux sociaux pendant 3 mois.",
    prix: 250000,
    economie: "Économisez 30 000 FCFA",
    delai: "Démarrage en 7 jours + 3 mois de suivi",
    servicesInclus: [
      "Identité visuelle express complète",
      "3 mois de Community Management (Formule CM Essentiel)",
      "Gabarits de publications cohérents et calendrier éditorial",
    ],
    resultat: "Une image cohérente et une présence active sur vos réseaux sans y passer vos soirées.",
    phase: 2,
    statut: "LISTE_ATTENTE",
    misEnAvant: false,
    ordre: 2,
    visible: true,
  },
  {
    slug: "pack-croissance",
    titre: "Pack Croissance",
    sousTitre: "La solution complète pour structurer votre acquisition et accélérer vos ventes.",
    prix: 650000,
    economie: "Économisez 100 000 FCFA",
    delai: "3 à 4 semaines",
    servicesInclus: [
      "Identité de marque complète & Brand Book",
      "Stratégie de communication & plan d'acquisition 90 jours",
      "Site vitrine standard multi-pages avec back-office & Analytics",
    ],
    resultat: "Un écosystème digital complet conçu pour générer un flux régulier de demandes qualifiées.",
    phase: 2,
    statut: "LISTE_ATTENTE",
    misEnAvant: false,
    ordre: 3,
    visible: true,
  },
  {
    slug: "pack-marque-complete",
    titre: "Pack Marque Complète",
    sousTitre: "Accompagnement intégral : conception, site web, stratégie et 3 mois de gestion.",
    prix: 900000,
    economie: "Économisez 150 000 FCFA",
    delai: "4 semaines + 3 mois d'accompagnement",
    servicesInclus: [
      "Tout le contenu du Pack Croissance (Identité complète + Stratégie + Site Standard)",
      "3 mois de Community Management (Formule CM Standard)",
      "Suivi mensuel des conversions et optimisation continue",
    ],
    resultat: "Délégation totale de votre présence en ligne avec un interlocuteur unique de A à Z.",
    phase: 3,
    statut: "LISTE_ATTENTE",
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
