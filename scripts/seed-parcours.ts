import "dotenv/config";
import { prisma } from "../lib/prisma";

const PARCOURS_SEED_DATA = [
  // --- FORMATIONS ---
  {
    type: "formation" as const,
    titre: "Formation « Pratique IA Product Creator »",
    organisme: "Simplon CI",
    lieu: "Abidjan, Côte d'Ivoire",
    anneeDebut: 2026,
    moisDebut: 6,
    enCours: true,
    badge: "En cours",
    description: "3 projets d'entreprise concrets. Modules : branding et identité visuelle, design graphique et illustration, montage vidéo et motion, stratégie de communication, produits IA et prompts avancés, maquettes Figma UI/UX, développement web moderne.",
    tags: ["IA Générative", "Prompt Engineering", "Branding", "UI/UX Figma", "Montage Vidéo", "Next.js"],
    profilSlugs: [], // Tous les profils (universel)
    ordre: 1,
  },
  {
    type: "formation" as const,
    titre: "Licence professionnelle Développeur Web",
    organisme: "PIGIER CI",
    lieu: "Abidjan, Côte d'Ivoire",
    anneeDebut: 2025,
    anneeFin: 2026,
    enCours: false,
    badge: "Diplôme supérieur (Bac+3)",
    description: "Formation approfondie en conception d'architectures logicielles, développement full stack moderne, sécurité et gestion de bases de données relationnelles.",
    tags: ["Architecture Web", "Full Stack", "Génie Logiciel", "Bases de Données"],
    profilSlugs: [], // Tous les profils (universel)
    ordre: 2,
  },
  {
    type: "formation" as const,
    titre: "BTS Informatique, option Développeur d'application (IDA)",
    organisme: "ISFMI, Abidjan",
    lieu: "Abidjan, Côte d'Ivoire",
    anneeDebut: 2021,
    anneeFin: 2023,
    enCours: false,
    badge: "Diplôme d'État (Bac+2)",
    description: "Fondamentaux de l'algorithmique, développement orienté objet, modélisation Merise/UML et conception de systèmes d'information.",
    tags: ["Algorithmique", "POO", "Merise", "Systèmes d'Information"],
    profilSlugs: [], // Tous les profils (universel)
    ordre: 3,
  },
  {
    type: "formation" as const,
    titre: "Baccalauréat série D",
    organisme: "Lycée municipal 2 de Koumassi",
    lieu: "Abidjan, Côte d'Ivoire",
    anneeDebut: 2020,
    anneeFin: 2021,
    enCours: false,
    description: "Enseignement scientifique généraliste (Mathématiques, Sciences Physiques et Sciences de la Vie et de la Terre).",
    tags: ["Sciences", "Rigueur Analytique"],
    profilSlugs: [], // Tous les profils (universel)
    ordre: 4,
  },

  // --- EXPÉRIENCES ---
  {
    type: "experience" as const,
    titre: "Développeur web full stack (temps partiel)",
    organisme: "Freelance",
    lieu: "Abidjan, Côte d'Ivoire",
    anneeDebut: 2026,
    moisDebut: 1,
    enCours: true,
    badge: "Actuel",
    description: "Conception et déploiement d'applications web et de plateformes sur-mesure avec Laravel, React et Next.js. Intégration de maquettes soignées et accompagnement client.",
    tags: ["Laravel", "React", "Next.js", "PostgreSQL", "Tailwind CSS"],
    profilSlugs: [], // Tous les profils (universel)
    ordre: 1,
  },
  {
    type: "experience" as const,
    titre: "Assistant technique / déploiement",
    organisme: "MUSCOP-CI",
    lieu: "Abidjan, Côte d'Ivoire",
    anneeDebut: 2025,
    moisDebut: 3,
    anneeFin: 2026,
    moisFin: 3,
    enCours: false,
    description: "Déploiement opérationnel d'un ERP web d'assurance santé, formation pratique des utilisateurs et accompagnement technique de transition numérique.",
    tags: ["ERP Santé", "Déploiement", "Support Utilisateur", "Conduite du Changement"],
    profilSlugs: [], // Tous les profils (universel)
    ordre: 2,
  },
  {
    type: "experience" as const,
    titre: "Développeur full stack junior (stage de validation)",
    organisme: "Stratos-conseil",
    lieu: "Abidjan, Côte d'Ivoire",
    anneeDebut: 2024,
    moisDebut: 7,
    anneeFin: 2024,
    moisFin: 12,
    enCours: false,
    description: "Développement de modules applicatifs, intégration d'interfaces web responsives et maintenance de fonctionnalités en méthodologie agile.",
    tags: ["Développement Web", "PHP", "JavaScript", "Agile"],
    profilSlugs: [], // Tous les profils (universel)
    ordre: 3,
  },

  // --- CERTIFICATIONS ---
  {
    type: "certification" as const,
    titre: "Les principes fondamentaux du marketing digital",
    organisme: "Google Digital Garage",
    anneeDebut: 2026,
    moisDebut: 4,
    enCours: false,
    badge: "ID: 444960682",
    description: "Stratégie de contenu, référencement naturel (SEO), acquisition de trafic, présence sur les réseaux sociaux et analyse d'audience.",
    url: "https://learndigital.withgoogle.com/digitalgarage",
    tags: ["Marketing Digital", "Stratégie de Contenu", "SEO", "Réseaux Sociaux"],
    profilSlugs: [], // Tous les profils (universel)
    ordre: 1,
  },
  {
    type: "certification" as const,
    titre: "Introduction à l'IA moderne",
    organisme: "Cybastion IT Academy & Cisco Networking Academy",
    anneeDebut: 2026,
    moisDebut: 4,
    enCours: false,
    badge: "ID: 60ffa166",
    description: "Fondamentaux de l'intelligence artificielle, des modèles de langage (LLM) et des outils d'IA appliquée à la productivité et aux produits modernes.",
    tags: ["IA Moderne", "LLM", "Prompting", "Cisco Academy"],
    profilSlugs: [], // Tous les profils (universel)
    ordre: 2,
  },
  {
    type: "certification" as const,
    titre: "Introduction to Data Science",
    organisme: "Cisco Networking Academy",
    anneeDebut: 2026,
    moisDebut: 4,
    enCours: false,
    badge: "Cisco Verified",
    description: "Compréhension du rôle des données dans l'apprentissage automatique (Machine Learning), analyse de données et opportunités en Data Analytics.",
    tags: ["Data Science", "Machine Learning", "Data Analytics"],
    profilSlugs: [], // Tous les profils (universel)
    ordre: 3,
  },
  {
    type: "certification" as const,
    titre: "Prompt Engineering Generative AI for Marketing & Advertising",
    organisme: "Coursera Project Network",
    anneeDebut: 2025,
    moisDebut: 10,
    enCours: false,
    badge: "Coursera Verified",
    description: "Ingénierie de prompts avancée et création de contenus percutants assistés par l'IA générative pour le marketing et la publicité.",
    url: "https://coursera.org/verify/4TC256C839K6",
    tags: ["Prompt Engineering", "IA Générative", "Marketing", "Copywriting"],
    profilSlugs: [], // Tous les profils (universel)
    ordre: 4,
  },
  {
    type: "certification" as const,
    titre: "LangChain: Application Development Essentials",
    organisme: "Coursera Instructor Network",
    anneeDebut: 2025,
    moisDebut: 10,
    enCours: false,
    badge: "Coursera Verified",
    description: "Développement d'applications basées sur des modèles de langage (LLM) avec le framework LangChain, gestion de chaînes et d'agents.",
    url: "https://coursera.org/verify/KV0KAMESKPYK",
    tags: ["LangChain", "LLMs", "Python", "IA Agents"],
    profilSlugs: [], // Tous les profils (universel)
    ordre: 5,
  },
  {
    type: "certification" as const,
    titre: "Full-stack Development with Django: Managing Migrations",
    organisme: "Coursera Project Network",
    anneeDebut: 2025,
    moisDebut: 11,
    enCours: false,
    badge: "Coursera Verified",
    description: "Gestion avancée des schémas de bases de données, ORM Django et contrôle des migrations en production.",
    url: "https://coursera.org/verify/HVMURDPKMI1N",
    tags: ["Django", "Python", "Migrations", "Bases de Données"],
    profilSlugs: [], // Tous les profils (universel)
    ordre: 6,
  },
  {
    type: "certification" as const,
    titre: "Learn Object-Oriented Programming with PHP",
    organisme: "Coursera Project Network",
    anneeDebut: 2025,
    moisDebut: 10,
    enCours: false,
    badge: "Coursera Verified",
    description: "Programmation orientée objet en PHP moderne : classes, héritage, interfaces, encapsulation et conception modulaire.",
    url: "https://coursera.org/verify/SNRCAZYIKJ65",
    tags: ["PHP", "POO", "Architecture Modulaire"],
    profilSlugs: [], // Tous les profils (universel)
    ordre: 7,
  },
  {
    type: "certification" as const,
    titre: "ADICOM DAYS 2026 — Nouvelles Tendances & Nouveaux Leaders",
    organisme: "Totem Experience",
    lieu: "Sofitel Abidjan Hotel Ivoire",
    anneeDebut: 2026,
    moisDebut: 4,
    enCours: false,
    badge: "Sommet Professionnel",
    description: "Participation au grand sommet de la communication digitale africaine : nouvelles tendances de contenu, marques et stratégies d'influence.",
    tags: ["Communication Digitale", "Événement Pro", "Networking", "Tendances"],
    profilSlugs: [], // Tous les profils (universel)
    ordre: 8,
  },
];

async function seedParcours() {
  console.log("Seeding des jalons du Parcours dans Neon dev-2bis...");

  for (const item of PARCOURS_SEED_DATA) {
    const existing = await prisma.parcoursItem.findFirst({
      where: {
        titre: item.titre,
        organisme: item.organisme,
      },
    });

    if (existing) {
      await prisma.parcoursItem.update({
        where: { id: existing.id },
        data: item,
      });
      console.log(`✔ Mis à jour : [${item.type}] ${item.titre}`);
    } else {
      await prisma.parcoursItem.create({
        data: item,
      });
      console.log(`✔ Créé : [${item.type}] ${item.titre}`);
    }
  }

  console.log("Seeding du parcours terminé avec succès !");
}

seedParcours()
  .catch((e) => {
    console.error("Erreur seeding parcours :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
