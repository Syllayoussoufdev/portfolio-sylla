import "dotenv/config";
import { prisma } from "../lib/prisma";
import { SkillType } from "../app/generated/prisma/client";

async function seedSkills() {
  console.log("=================================================================");
  console.log("   INITIALISATION DES COMPÉTENCES & OUTILS PAR GRANDES FAMILLES  ");
  console.log("=================================================================\n");

  try {
    const categoriesData = [
      {
        slug: "dev-frontend",
        titre: "Développement Web & Frontend",
        description: "Interfaces web rapides, accessibles, réactives et typées.",
        icon: "Code",
        ordre: 0,
        skills: [
          // Savoir-faire
          { nom: "Architecture Frontend & SSR", type: SkillType.COMPETENCE, niveau: "Expert", pourcentage: 95, ordre: 0 },
          { nom: "Typage Strict & Clean Code", type: SkillType.COMPETENCE, niveau: "Avancé", pourcentage: 90, ordre: 1 },
          { nom: "Performance & Core Web Vitals", type: SkillType.COMPETENCE, niveau: "Avancé", pourcentage: 88, ordre: 2 },
          { nom: "Responsive & Ergonomie Tactile", type: SkillType.COMPETENCE, niveau: "Expert", pourcentage: 95, ordre: 3 },
          // Outils
          { nom: "Next.js", type: SkillType.OUTIL, niveau: "Expert", pourcentage: 95, ordre: 4 },
          { nom: "React", type: SkillType.OUTIL, niveau: "Expert", pourcentage: 95, ordre: 5 },
          { nom: "TypeScript", type: SkillType.OUTIL, niveau: "Avancé", pourcentage: 90, ordre: 6 },
          { nom: "Tailwind CSS", type: SkillType.OUTIL, niveau: "Expert", pourcentage: 98, ordre: 7 },
          { nom: "HTML5 / CSS3", type: SkillType.OUTIL, niveau: "Expert", pourcentage: 98, ordre: 8 },
        ],
      },
      {
        slug: "dev-backend",
        titre: "Backend & Architectures API",
        description: "Logique serveur robuste, bases relationnelles et sécurité des flux.",
        icon: "Server",
        ordre: 1,
        skills: [
          // Savoir-faire
          { nom: "Modélisation Base de Données", type: SkillType.COMPETENCE, niveau: "Avancé", pourcentage: 90, ordre: 0 },
          { nom: "Architectures REST & Server Actions", type: SkillType.COMPETENCE, niveau: "Expert", pourcentage: 92, ordre: 1 },
          { nom: "Sécurité & Authentification JWT", type: SkillType.COMPETENCE, niveau: "Avancé", pourcentage: 88, ordre: 2 },
          // Outils
          { nom: "Laravel", type: SkillType.OUTIL, niveau: "Avancé", pourcentage: 90, ordre: 3 },
          { nom: "Node.js", type: SkillType.OUTIL, niveau: "Avancé", pourcentage: 85, ordre: 4 },
          { nom: "PostgreSQL", type: SkillType.OUTIL, niveau: "Avancé", pourcentage: 90, ordre: 5 },
          { nom: "Prisma ORM", type: SkillType.OUTIL, niveau: "Avancé", pourcentage: 92, ordre: 6 },
          { nom: "Docker", type: SkillType.OUTIL, niveau: "Intermédiaire", pourcentage: 78, ordre: 7 },
        ],
      },
      {
        slug: "dev-mobile",
        titre: "Mobile & Multiplateforme",
        description: "Applications mobiles fluides, ergonomiques et cross-platform.",
        icon: "Smartphone",
        ordre: 2,
        skills: [
          // Savoir-faire
          { nom: "Expérience Mobile & Ergonomie", type: SkillType.COMPETENCE, niveau: "Avancé", pourcentage: 88, ordre: 0 },
          { nom: "PWA & Offline First", type: SkillType.COMPETENCE, niveau: "Avancé", pourcentage: 85, ordre: 1 },
          // Outils
          { nom: "React Native", type: SkillType.OUTIL, niveau: "Avancé", pourcentage: 85, ordre: 2 },
          { nom: "Flutter", type: SkillType.OUTIL, niveau: "Intermédiaire", pourcentage: 80, ordre: 3 },
        ],
      },
      {
        slug: "design-graphique",
        titre: "Design Graphique, Branding & UI/UX",
        description: "Identités visuelles marquantes, design systems et interfaces sur mesure.",
        icon: "Palette",
        ordre: 3,
        skills: [
          // Savoir-faire
          { nom: "Direction Artistique & Branding", type: SkillType.COMPETENCE, niveau: "Expert", pourcentage: 95, ordre: 0 },
          { nom: "Conception de Design Systems", type: SkillType.COMPETENCE, niveau: "Avancé", pourcentage: 92, ordre: 1 },
          { nom: "Typographie & Colorimétrie", type: SkillType.COMPETENCE, niveau: "Expert", pourcentage: 96, ordre: 2 },
          { nom: "Prototypage Interactif", type: SkillType.COMPETENCE, niveau: "Avancé", pourcentage: 90, ordre: 3 },
          // Outils
          { nom: "Figma", type: SkillType.OUTIL, niveau: "Expert", pourcentage: 98, ordre: 4 },
          { nom: "Adobe Photoshop", type: SkillType.OUTIL, niveau: "Avancé", pourcentage: 92, ordre: 5 },
          { nom: "Adobe Illustrator", type: SkillType.OUTIL, niveau: "Avancé", pourcentage: 90, ordre: 6 },
          { nom: "Canva Pro", type: SkillType.OUTIL, niveau: "Expert", pourcentage: 98, ordre: 7 },
        ],
      },
      {
        slug: "video-motion",
        titre: "Montage Vidéo, Motion Design & 3D",
        description: "Productions audiovisuelles dynamiques, univers animés 2D/3D et sound design.",
        icon: "Film",
        ordre: 4,
        skills: [
          // Savoir-faire
          { nom: "Montage Rythmé & Storytelling", type: SkillType.COMPETENCE, niveau: "Expert", pourcentage: 94, ordre: 0 },
          { nom: "Motion Design 2D & Typographie Animée", type: SkillType.COMPETENCE, niveau: "Avancé", pourcentage: 88, ordre: 1 },
          { nom: "Étalonnage & Color Grading", type: SkillType.COMPETENCE, niveau: "Avancé", pourcentage: 86, ordre: 2 },
          { nom: "Modélisation & Rendu 3D", type: SkillType.COMPETENCE, niveau: "Intermédiaire", pourcentage: 80, ordre: 3 },
          // Outils
          { nom: "Adobe Premiere Pro", type: SkillType.OUTIL, niveau: "Expert", pourcentage: 95, ordre: 4 },
          { nom: "Adobe After Effects", type: SkillType.OUTIL, niveau: "Avancé", pourcentage: 90, ordre: 5 },
          { nom: "DaVinci Resolve", type: SkillType.OUTIL, niveau: "Avancé", pourcentage: 85, ordre: 6 },
          { nom: "Blender 3D", type: SkillType.OUTIL, niveau: "Intermédiaire", pourcentage: 80, ordre: 7 },
          { nom: "CapCut Pro", type: SkillType.OUTIL, niveau: "Expert", pourcentage: 95, ordre: 8 },
        ],
      },
    ];

    const createdCategories: Record<string, string> = {};

    for (const cat of categoriesData) {
      console.log(`🔹 Traitement de la famille : ${cat.titre}...`);
      const categoryRecord = await prisma.skillCategory.upsert({
        where: { slug: cat.slug },
        update: {
          titre: cat.titre,
          description: cat.description,
          icon: cat.icon,
          ordre: cat.ordre,
        },
        create: {
          slug: cat.slug,
          titre: cat.titre,
          description: cat.description,
          icon: cat.icon,
          ordre: cat.ordre,
        },
      });

      createdCategories[cat.slug] = categoryRecord.id;

      // Nettoyer et recréer les compétences pour garantir l'idempotence exacte
      await prisma.skill.deleteMany({
        where: { categoryId: categoryRecord.id },
      });

      for (const skill of cat.skills) {
        await prisma.skill.create({
          data: {
            nom: skill.nom,
            type: skill.type,
            niveau: skill.niveau,
            pourcentage: skill.pourcentage,
            ordre: skill.ordre,
            categoryId: categoryRecord.id,
          },
        });
      }
      console.log(`   ✅ ${cat.skills.length} compétences/outils synchronisés pour "${cat.titre}"`);
    }

    // 2. Attribution automatique selon les sous-portfolios existants
    console.log("\n🔹 2. Attribution automatique aux sous-portfolios existants...");
    const subPortfolios = await prisma.subPortfolio.findMany();

    for (const sub of subPortfolios) {
      const slugLower = sub.slug.toLowerCase();

      // Vider les anciennes liaisons de compétences pour ce sous-portfolio
      await prisma.subPortfolioSkillCategory.deleteMany({
        where: { subPortfolioId: sub.id },
      });

      let targetCategorySlugs: string[] = [];

      if (slugLower.includes("dev") || slugLower.includes("web") || slugLower.includes("tech")) {
        targetCategorySlugs = ["dev-frontend", "dev-backend", "dev-mobile"];
      } else if (slugLower.includes("design") || slugLower.includes("crea")) {
        targetCategorySlugs = ["design-graphique"];
      } else if (slugLower.includes("video") || slugLower.includes("motion") || slugLower.includes("audiovisuel")) {
        targetCategorySlugs = ["video-motion"];
      }

      for (let i = 0; i < targetCategorySlugs.length; i++) {
        const catSlug = targetCategorySlugs[i];
        const catId = createdCategories[catSlug];
        if (catId) {
          await prisma.subPortfolioSkillCategory.create({
            data: {
              subPortfolioId: sub.id,
              categoryId: catId,
              ordre: i,
            },
          });
        }
      }

      console.log(
        `   🔗 Sous-portfolio "${sub.label}" (${sub.slug}) lié à : [${targetCategorySlugs.join(", ") || "toutes par défaut"}]`
      );
    }

    console.log("\n=================================================================");
    console.log("   ✅ INITIALISATION DES COMPÉTENCES TERMINÉE AVEC SUCCÈS        ");
    console.log("=================================================================");
  } catch (error) {
    console.error("❌ Erreur lors du seed des compétences :", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedSkills()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
