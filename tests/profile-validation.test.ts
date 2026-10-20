import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isReservedSlug,
  validateProfileSlug,
  RESERVED_SLUGS,
} from "../lib/constants/reserved-slugs";
import {
  HeroSchema,
  SectionsListSchema,
  ProfileSchema,
  SiteSettingsSchema,
} from "../lib/validations/profile";

describe("Validation des Slugs Réservés", () => {
  it("doit identifier correctement les slugs réservés du système", () => {
    assert.equal(isReservedSlug("admin"), true);
    assert.equal(isReservedSlug("api"), true);
    assert.equal(isReservedSlug("projets"), true);
    assert.equal(isReservedSlug("contact"), true);
    assert.equal(isReservedSlug("sitemap.xml"), true);
    assert.equal(isReservedSlug("mon-profil-creatif"), false);
    assert.equal(isReservedSlug("designer-ui"), false);
  });

  it("doit autoriser le slug spécial 'default' pour la page d'accueil", () => {
    const res = validateProfileSlug("default");
    assert.equal(res.valid, true);
  });

  it("doit refuser un slug réservé", () => {
    for (const reserved of RESERVED_SLUGS) {
      const res = validateProfileSlug(reserved);
      assert.equal(res.valid, false, `Le slug réservé ${reserved} aurait dû être refusé`);
    }
  });

  it("doit refuser les formats invalides (majuscules, tirets en bout)", () => {
    assert.equal(validateProfileSlug("-invalide").valid, false);
    assert.equal(validateProfileSlug("invalide-").valid, false);
    assert.equal(validateProfileSlug("MAJUSCULE").valid, false);
    assert.equal(validateProfileSlug("espace interdit").valid, false);
  });

  it("doit valider les slugs valides au format kebab-case", () => {
    assert.equal(validateProfileSlug("developpeur-fullstack").valid, true);
    assert.equal(validateProfileSlug("graphisme-2026").valid, true);
    assert.equal(validateProfileSlug("motion").valid, true);
  });
});

describe("Schéma Zod Hero & Sections", () => {
  it("doit valider un Hero complet conforme aux spécifications", () => {
    const validHero = {
      headline: "DIRECTION ARTISTIQUE & DIGITAL",
      subline: "Expériences mémorables sur-mesure",
      ctaPrimary: { label: "Voir mes projets", href: "#projets" },
      ctaSecondary: { label: "Contact", href: "/contact" },
      media: { kind: "image" as const, alt: "Portrait" },
    };

    const parsed = HeroSchema.safeParse(validHero);
    assert.equal(parsed.success, true);
  });

  it("doit refuser un Hero incomplet", () => {
    const invalidHero = {
      headline: "A", // trop court
      subline: "",
      ctaPrimary: { label: "", href: "" },
    };

    const parsed = HeroSchema.safeParse(invalidHero);
    assert.equal(parsed.success, false);
  });

  it("doit valider un Hero complet avec les outils autorisés (max 8)", () => {
    const validHero = {
      headline: "DIRECTION ARTISTIQUE & DIGITAL",
      subline: "Expériences mémorables sur-mesure",
      ctaPrimary: { label: "Voir mes projets", href: "#projets" },
      ctaSecondary: { label: "Contact", href: "/contact" },
      media: { kind: "image" as const, alt: "Portrait" },
      outils: ["Canva", "Figma", "Next.js", "Laravel", "React"] as const,
    };

    const parsed = HeroSchema.safeParse(validHero);
    assert.equal(parsed.success, true);
  });

  it("doit refuser un outil hors de la liste stricte des 26 outils", () => {
    const heroWithInvalidTool = {
      headline: "DIRECTION ARTISTIQUE",
      subline: "Expériences sur mesure",
      ctaPrimary: { label: "Projets", href: "#projets" },
      ctaSecondary: { label: "Contact", href: "/contact" },
      media: { kind: "image" as const },
      outils: ["FinalCutPro"], // non autorisé dans la liste stricte
    };

    const parsed = HeroSchema.safeParse(heroWithInvalidTool);
    assert.equal(parsed.success, false);
  });

  it("doit refuser plus de 8 outils dans le Hero", () => {
    const heroTooManyTools = {
      headline: "DIRECTION ARTISTIQUE",
      subline: "Expériences sur mesure",
      ctaPrimary: { label: "Projets", href: "#projets" },
      ctaSecondary: { label: "Contact", href: "/contact" },
      media: { kind: "image" as const },
      outils: [
        "Canva", "Figma", "Next.js", "Laravel", "React",
        "PHP", "JavaScript", "Tailwind CSS", "Docker" // 9 outils
      ],
    };

    const parsed = HeroSchema.safeParse(heroTooManyTools);
    assert.equal(parsed.success, false);
  });

  it("doit valider la liste ordonnée des sections autorisées", () => {
    const validSections = [
      { key: "hero" as const, visible: true, order: 0 },
      { key: "projets" as const, visible: true, order: 1 },
      { key: "competences" as const, visible: true, order: 2 },
      { key: "contact" as const, visible: true, order: 3 },
    ];

    const parsed = SectionsListSchema.safeParse(validSections);
    assert.equal(parsed.success, true);
  });

  it("doit refuser une clé de section non autorisée", () => {
    const invalidSections = [
      { key: "section-inventee", visible: true, order: 0 },
    ];

    const parsed = SectionsListSchema.safeParse(invalidSections);
    assert.equal(parsed.success, false);
  });
});

describe("Schéma Zod Profile", () => {
  it("doit valider un profil complet avec slug non réservé", () => {
    const profile = {
      label: "Profil Graphiste",
      slug: "graphisme",
      template: "creatif" as const,
      accent: "default",
      hero: {
        headline: "DIRECTION ARTISTIQUE",
        subline: "Identités de marque percutantes",
        ctaPrimary: { label: "Projets", href: "#projets" },
        ctaSecondary: { label: "Contact", href: "/contact" },
        media: { kind: "image" as const, alt: "Visuel" },
      },
      sections: [{ key: "hero" as const, visible: true, order: 0 }],
      isDefault: false,
      actif: true,
    };

    const parsed = ProfileSchema.safeParse(profile);
    assert.equal(parsed.success, true);
  });

  it("doit refuser un profil dont le slug est réservé", () => {
    const profile = {
      label: "Profil Fake Admin",
      slug: "admin", // réservé !
      template: "creatif" as const,
      hero: {
        headline: "TEST",
        subline: "TEST SUBLINE",
        ctaPrimary: { label: "P", href: "#" },
        ctaSecondary: { label: "S", href: "#" },
        media: { kind: "image" as const },
      },
      sections: [{ key: "hero" as const, visible: true, order: 0 }],
    };

    const parsed = ProfileSchema.safeParse(profile);
    assert.equal(parsed.success, false);
    if (!parsed.success) {
      assert.match(parsed.error.issues[0]?.message || "", /réservé/);
    }
  });
});

describe("Schéma Zod SiteSettings", () => {
  it("doit valider un objet de réglages avec le nom seul", () => {
    const minimal = {
      nom: "Sylla Youssouf",
    };

    const parsed = SiteSettingsSchema.safeParse(minimal);
    assert.equal(parsed.success, true);
  });

  it("doit refuser un format d'email invalide mais autoriser null ou chaîne vide", () => {
    assert.equal(
      SiteSettingsSchema.safeParse({ nom: "Sylla", emailPublic: "faux-email" }).success,
      false
    );
    assert.equal(
      SiteSettingsSchema.safeParse({ nom: "Sylla", emailPublic: "sylla@example.com" }).success,
      true
    );
    assert.equal(
      SiteSettingsSchema.safeParse({ nom: "Sylla", emailPublic: "" }).success,
      true
    );
    assert.equal(
      SiteSettingsSchema.safeParse({ nom: "Sylla", emailPublic: null }).success,
      true
    );
  });
});
