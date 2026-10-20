import "dotenv/config";
import { prisma } from "../lib/prisma";

const ONLINE_PROJECT_IMAGES: Record<string, string> = {
  // Projets Web & Dév
  "portfolio-cv-personnel": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  "systeme-gestion-recrutements": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  "application-gestion-taches": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80",
  "site-freelance-personnel": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  "blog-wordpress-headless-nextjs": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
  "site-full-services-point-sarl": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  "site-mashar-immobilier": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",

  // Projets Design, Branding, Com, IA
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

  // Projets Vidéo, Motion, UI/UX
  "demo-teaser-evenement-culturel": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
  "demo-clip-promotionnel-produit": "https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?auto=format&fit=crop&w=1200&q=80",
  "demo-interview-webinaire": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
  "demo-maquette-app-depenses": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
  "demo-design-system-formation": "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",

  // Projets Entreprise Simplon
  "entreprise-projet-1": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  "entreprise-projet-2": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  "entreprise-projet-3": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
};

async function run() {
  console.log("🌐 Mise à jour des projets avec les URLs d'images en ligne directes...");

  for (const [slug, url] of Object.entries(ONLINE_PROJECT_IMAGES)) {
    const res = await prisma.project.updateMany({
      where: { slug },
      data: { coverImage: url },
    });
    console.log(`  ✓ ${slug} -> ${url} (mis à jour: ${res.count})`);
  }

  console.log("✅ Tous les 26 projets possèdent désormais un lien direct en ligne pour coverImage.");
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
