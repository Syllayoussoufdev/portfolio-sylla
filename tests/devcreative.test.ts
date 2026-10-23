import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ProjectLeadWizardSchema,
  WaitlistSchema,
  ServiceOfferSchema,
  ServicePackSchema,
} from "../lib/validations/devcreative";
import { TemplateSchema } from "../lib/validations/profile";
import { isReservedSlug } from "../lib/constants/reserved-slugs";

describe("DevCreative v1.0 — Schémas Zod & Slugs", () => {
  it("doit autoriser le template 'devcreative' dans TemplateSchema", () => {
    const parsed = TemplateSchema.safeParse("devcreative");
    assert.equal(parsed.success, true);
  });

  it("doit réserver les slugs 'demarrer' et 'services'", () => {
    assert.equal(isReservedSlug("demarrer"), true);
    assert.equal(isReservedSlug("services"), true);
  });

  it("doit valider un brief wizard 4 étapes complet", () => {
    const validLead = {
      projectType: "pack-lancement",
      goal: "Nous lançons notre cabinet à Abidjan Cocody et souhaitons un site vitrine rapide avec prise de RDV WhatsApp.",
      budgetRange: "250 000 – 500 000 FCFA",
      deadline: "Dans 2 à 4 semaines",
      name: "Koffi Kouassi",
      email: "koffi@entreprise.ci",
      phone: "+225 07 07 95 45 27",
      message: "Disponible jeudi à 14h pour un point.",
      consent: true as const,
      company_website: "",
    };

    const result = ProjectLeadWizardSchema.safeParse(validLead);
    assert.equal(result.success, true);
  });

  it("doit refuser un brief wizard sans type de projet ou avec objectif trop court", () => {
    const invalidLead = {
      projectType: "",
      goal: "Non",
      budgetRange: "",
      deadline: "",
      name: "K",
      email: "invalide",
      phone: "123",
    };

    const result = ProjectLeadWizardSchema.safeParse(invalidLead);
    assert.equal(result.success, false);
  });

  it("doit valider une inscription Waitlist (Offre Bientôt)", () => {
    const validWaitlist = {
      email: "client@domaine.ci",
      offreVisee: "pack-croissance",
      consentement: true as const,
    };

    const result = WaitlistSchema.safeParse(validWaitlist);
    assert.equal(result.success, true);
  });

  it("doit valider une offre et un pack FCFA du catalogue", () => {
    const offer = ServiceOfferSchema.safeParse({
      slug: "site-vitrine-essentiel",
      famille: "presence-en-ligne",
      titre: "Site Vitrine Essentiel",
      accroche: "Convertissez vos visiteurs en clients sur mobile et desktop.",
      livrables: ["Design sur-mesure", "Optimisation SEO local Abidjan"],
      delai: "7 à 10 jours",
      prixDepuis: 200000,
      prixLabel: "dès 200 000 FCFA",
      statut: "DISPONIBLE",
      ordre: 1,
      visible: true,
    });
    assert.equal(offer.success, true);

    const pack = ServicePackSchema.safeParse({
      slug: "pack-lancement",
      titre: "Pack Lancement",
      sousTitre: "Logo + Charte + Site Vitrine",
      prix: 270000,
      economie: "Économisez 30 000 FCFA",
      delai: "10 à 14 jours",
      servicesInclus: ["Logo professionnel", "Site responsive"],
      resultat: "Une marque prête en 2 semaines",
      phase: 1,
      statut: "DISPONIBLE",
      misEnAvant: true,
      ordre: 1,
      visible: true,
    });
    assert.equal(pack.success, true);
  });
});
