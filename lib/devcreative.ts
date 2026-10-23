import { prisma } from "./prisma";
import {
  INITIAL_SERVICE_OFFERS,
  INITIAL_SERVICE_PACKS,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQ_ITEMS,
  formatFCFA,
  type ServiceOfferData,
  type ServicePackData,
  type TestimonialData,
  type FaqItemData,
} from "./devcreative-catalog";

export {
  INITIAL_SERVICE_OFFERS,
  INITIAL_SERVICE_PACKS,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQ_ITEMS,
  formatFCFA,
  type ServiceOfferData,
  type ServicePackData,
  type TestimonialData,
  type FaqItemData,
};

// ============================================================================
// LECTURE SERVEUR AVEC AUTO-SEED RÉSILIENT
// ============================================================================

export async function getDevCreativeCatalog() {
  try {
    const [offersCount, packsCount, testimonialsCount, faqCount] = await Promise.all([
      prisma.serviceOffer.count(),
      prisma.servicePack.count(),
      prisma.testimonial.count(),
      prisma.faqItem.count(),
    ]);

    // Auto-seed initial si les tables viennent d'être créées
    if (offersCount === 0) {
      await prisma.serviceOffer.createMany({
        data: INITIAL_SERVICE_OFFERS,
        skipDuplicates: true,
      });
    }
    if (packsCount === 0) {
      await prisma.servicePack.createMany({
        data: INITIAL_SERVICE_PACKS,
        skipDuplicates: true,
      });
    }
    if (testimonialsCount === 0) {
      await prisma.testimonial.createMany({
        data: INITIAL_TESTIMONIALS,
        skipDuplicates: true,
      });
    }
    if (faqCount === 0) {
      await prisma.faqItem.createMany({
        data: INITIAL_FAQ_ITEMS,
        skipDuplicates: true,
      });
    }

    const [offers, packs, testimonials, faqItems] = await Promise.all([
      prisma.serviceOffer.findMany({
        where: { visible: true },
        include: {
          project: { select: { id: true, titre: true, slug: true } },
        },
        orderBy: { ordre: "asc" },
      }),
      prisma.servicePack.findMany({
        where: { visible: true },
        orderBy: { ordre: "asc" },
      }),
      prisma.testimonial.findMany({
        where: { visible: true, accordEcrit: true },
        orderBy: { ordre: "asc" },
      }),
      prisma.faqItem.findMany({
        where: { visible: true },
        orderBy: { ordre: "asc" },
      }),
    ]);

    return {
      offers: offers as ServiceOfferData[],
      packs: packs as ServicePackData[],
      testimonials: testimonials as TestimonialData[],
      faqItems: faqItems as FaqItemData[],
    };
  } catch (err) {
    console.warn("Repli mémoire pour le catalogue DevCreative :", err);
    return {
      offers: INITIAL_SERVICE_OFFERS.map((o, idx) => ({ ...o, id: `fallback-offer-${idx}` })),
      packs: INITIAL_SERVICE_PACKS.map((p, idx) => ({ ...p, id: `fallback-pack-${idx}` })),
      testimonials: INITIAL_TESTIMONIALS.map((t, idx) => ({ ...t, id: `fallback-testi-${idx}` })),
      faqItems: INITIAL_FAQ_ITEMS.map((f, idx) => ({ ...f, id: `fallback-faq-${idx}` })),
    };
  }
}
