import "dotenv/config";
import fs from "fs";
import path from "path";
import { prisma } from "../lib/prisma";

interface ProjectImageConfig {
  slug: string;
  unsplashId: string;
  titre: string;
}

const PROJECT_IMAGES: ProjectImageConfig[] = [
  // 1. Projets Réels (Dév & Web)
  {
    slug: "portfolio-cv-personnel",
    unsplashId: "photo-1498050108023-c5249f4df085", // Developer workspace with modern laptop & code
    titre: "Portfolio CV personnel",
  },
  {
    slug: "systeme-gestion-recrutements",
    unsplashId: "photo-1460925895917-afdab827c52f", // Analytics dashboard & recruitment metrics
    titre: "Système de gestion des recrutements",
  },
  {
    slug: "application-gestion-taches",
    unsplashId: "photo-1484480974693-6ca0a78fb36b", // Productivity task planning & notes
    titre: "Application de gestion de tâches",
  },
  {
    slug: "site-freelance-personnel",
    unsplashId: "photo-1517245386807-bb43f82c33c4", // Minimalist modern workspace & creative tech
    titre: "Site de freelance personnel",
  },
  {
    slug: "blog-wordpress-headless-nextjs",
    unsplashId: "photo-1499750310107-5fef28a66643", // Editorial tech blogging setup
    titre: "Blog WordPress headless et Next.js",
  },
  {
    slug: "site-full-services-point-sarl",
    unsplashId: "photo-1486406146926-c627a92ad1ab", // Modern corporate skyscraper architecture
    titre: "Site web Full Services Point SARL, Abidjan",
  },
  {
    slug: "site-mashar-immobilier",
    unsplashId: "photo-1600585154340-be6161a56a0c", // Contemporary luxury villa real estate
    titre: "Site web Mashar Immobilier, Abidjan",
  },

  // 2. Projets de Démonstration (Design, Branding, Com, Vidéo, Motion, IA)
  {
    slug: "demo-identite-cafe-artisanal",
    unsplashId: "photo-1501339847302-ac426a4a7cbb", // Artisanal coffee brewing & aesthetic branding
    titre: "Logo et identité visuelle, marque de café artisanal",
  },
  {
    slug: "demo-affiches-festival-musique",
    unsplashId: "photo-1470225620780-dba8ba36b745", // Vibrant festival concert stage lighting
    titre: "Série d'affiches, festival de musique",
  },
  {
    slug: "demo-illustrations-mascotte-icones",
    unsplashId: "photo-1618005182384-a83a8bd57fbe", // 3D abstract vibrant fluid artwork & shapes
    titre: "Illustrations vectorielles : mascotte et jeu d'icônes",
  },
  {
    slug: "demo-flyers-kakemonos-salon",
    unsplashId: "photo-1540575467063-178a50c2df87", // Professional business expo & conference
    titre: "Flyers et kakémonos, salon professionnel",
  },
  {
    slug: "demo-packaging-jus-locaux",
    unsplashId: "photo-1613478223719-2ab802602423", // Glass bottles of natural fresh juice & fruits
    titre: "Packaging, gamme de jus locaux",
  },
  {
    slug: "demo-visuels-reseaux-sociaux",
    unsplashId: "photo-1611162617474-5b21e879e113", // 3D social media icons & phone screen
    titre: "Visuels pour réseaux sociaux, campagne de lancement",
  },
  {
    slug: "demo-charte-marque-startup",
    unsplashId: "photo-1634942537034-2531766767d1", // Clean brand identity book & business cards
    titre: "Brand book, startup de livraison",
  },
  {
    slug: "demo-strategie-com-association",
    unsplashId: "photo-1531403009284-440f080d1e12", // Strategic brainstorming wireframes & post-its
    titre: "Stratégie de communication digitale, association",
  },
  {
    slug: "demo-calendrier-editorial-boutique",
    unsplashId: "photo-1441986300917-64674bd600d8", // Aesthetic boutique store & retail flat lay
    titre: "Calendrier éditorial, boutique en ligne",
  },
  {
    slug: "demo-teaser-evenement-culturel",
    unsplashId: "photo-1574717024653-61fd2cf4d44d", // Cinematic video editing timeline on dual monitors
    titre: "Teaser de 30 secondes, événement culturel",
  },
  {
    slug: "demo-clip-promotionnel-produit",
    unsplashId: "photo-1579632652768-6cb9dcf85912", // Cinema camera rig shooting in professional studio
    titre: "Clip promotionnel, lancement de produit",
  },
  {
    slug: "demo-interview-webinaire",
    unsplashId: "photo-1590602847861-f357a9332bbc", // Broadcasting microphone & studio recording setup
    titre: "Interview montée et sous-titrée, webinaire",
  },
  {
    slug: "demo-maquette-app-depenses",
    unsplashId: "photo-1563986768609-322da13575f3", // Modern smartphone with financial charts & mobile UI
    titre: "Maquette mobile Figma, application de suivi de dépenses",
  },
  {
    slug: "demo-design-system-formation",
    unsplashId: "photo-1581291518857-4e27b48ff24e", // UI/UX designer structuring component wireframes
    titre: "Design system et prototype, plateforme de formation",
  },
  {
    slug: "demo-generateur-visuels-ia",
    unsplashId: "photo-1620712943543-bcc4688e7485", // Futuristic AI neural network & creative generative art
    titre: "Générateur de visuels publicitaires par IA",
  },
  {
    slug: "demo-assistant-redaction-com",
    unsplashId: "photo-1677442136019-21780ecad995", // AI chatbot & language model conversational interface
    titre: "Assistant de rédaction pour la communication",
  },

  // 3. Projets d'Entreprise Simplon
  {
    slug: "entreprise-projet-1",
    unsplashId: "photo-1552664730-d307ca884978", // Collaborative enterprise tech workshop
    titre: "Projet d'entreprise n°1",
  },
  {
    slug: "entreprise-projet-2",
    unsplashId: "photo-1551288049-bebda4e38f71", // Enterprise data intelligence dashboard
    titre: "Projet d'entreprise n°2",
  },
  {
    slug: "entreprise-projet-3",
    unsplashId: "photo-1519389950473-47ba0277781c", // Agile engineering sprint & digital transformation
    titre: "Projet d'entreprise n°3",
  },
];

async function downloadAndSeed() {
  const outputDir = path.resolve(process.cwd(), "public/images/projects");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`🚀 Démarrage du téléchargement des images pour ${PROJECT_IMAGES.length} projets...`);

  for (const item of PROJECT_IMAGES) {
    const filePath = path.join(outputDir, `${item.slug}.jpg`);
    const publicUrl = `/images/projects/${item.slug}.jpg`;
    const unsplashUrl = `https://images.unsplash.com/${item.unsplashId}?auto=format&fit=crop&w=1200&q=80`;

    // 1. Télécharger si non présent ou vide
    if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
      console.log(`📥 Téléchargement : ${item.slug} (${item.titre})...`);
      try {
        const res = await fetch(unsplashUrl);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filePath, buffer);
        console.log(`   ✅ Enregistré (${Math.round(buffer.length / 1024)} KB) -> ${filePath}`);
      } catch (err) {
        console.error(`   ❌ Erreur de téléchargement pour ${item.slug}:`, err);
        continue;
      }
    } else {
      console.log(`   ⚡ Déjà présent localement : ${item.slug}.jpg`);
    }

    // 2. Mettre à jour en base de données
    try {
      const updated = await prisma.project.updateMany({
        where: { slug: item.slug },
        data: {
          coverImage: publicUrl,
        },
      });
      console.log(`   💾 DB mise à jour pour '${item.slug}' (matches: ${updated.count}) -> coverImage = ${publicUrl}`);
    } catch (dbErr) {
      console.error(`   ❌ Erreur DB pour ${item.slug}:`, dbErr);
    }
  }

  console.log("\n🎉 Tous les projets ont désormais une image de prévisualisation par défaut !");
}

downloadAndSeed()
  .catch((e) => {
    console.error("FATAL ERROR:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
