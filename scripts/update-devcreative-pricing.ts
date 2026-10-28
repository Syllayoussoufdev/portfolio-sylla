import { prisma } from "../lib/prisma";
import {
  INITIAL_SERVICE_OFFERS,
  INITIAL_SERVICE_PACKS,
} from "../lib/devcreative-catalog";

async function main() {
  console.log("==> Mise à jour des offres et packs DevCreative en base de données...");

  // 1. Mise à jour des Offres
  for (const offer of INITIAL_SERVICE_OFFERS) {
    const res = await prisma.serviceOffer.upsert({
      where: { slug: offer.slug },
      update: {
        titre: offer.titre,
        famille: offer.famille,
        accroche: offer.accroche,
        livrables: offer.livrables,
        delai: offer.delai,
        prixDepuis: offer.prixDepuis,
        prixLabel: offer.prixLabel,
        unite: offer.unite,
        phase: offer.phase,
        statut: offer.statut,
        ordre: offer.ordre,
        visible: offer.visible,
      },
      create: {
        slug: offer.slug,
        titre: offer.titre,
        famille: offer.famille,
        accroche: offer.accroche,
        livrables: offer.livrables,
        delai: offer.delai,
        prixDepuis: offer.prixDepuis,
        prixLabel: offer.prixLabel,
        unite: offer.unite,
        phase: offer.phase,
        statut: offer.statut,
        ordre: offer.ordre,
        visible: offer.visible,
      },
    });
    console.log(`[Offre mise à jour] ${res.slug} -> ${res.prixLabel}`);
  }

  // 2. Mise à jour des Packs
  for (const pack of INITIAL_SERVICE_PACKS) {
    const res = await prisma.servicePack.upsert({
      where: { slug: pack.slug },
      update: {
        titre: pack.titre,
        sousTitre: pack.sousTitre,
        prix: pack.prix,
        economie: pack.economie,
        delai: pack.delai,
        servicesInclus: pack.servicesInclus,
        resultat: pack.resultat,
        phase: pack.phase,
        statut: pack.statut,
        misEnAvant: pack.misEnAvant,
        ordre: pack.ordre,
        visible: pack.visible,
      },
      create: {
        slug: pack.slug,
        titre: pack.titre,
        sousTitre: pack.sousTitre,
        prix: pack.prix,
        economie: pack.economie,
        delai: pack.delai,
        servicesInclus: pack.servicesInclus,
        resultat: pack.resultat,
        phase: pack.phase,
        statut: pack.statut,
        misEnAvant: pack.misEnAvant,
        ordre: pack.ordre,
        visible: pack.visible,
      },
    });
    console.log(`[Pack mis à jour] ${res.slug} -> ${res.prix} FCFA (${res.statut})`);
  }

  console.log("==> Synchronisation terminée avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
