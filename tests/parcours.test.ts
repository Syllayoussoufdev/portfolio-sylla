import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parcoursItemSchema, getParcours } from "../lib/parcours";

describe("Schéma Zod ParcoursItem & Validation", () => {
  it("doit valider un jalon de formation complet et valide", () => {
    const validFormation = {
      type: "formation",
      titre: "Licence professionnelle Développeur Web",
      organisme: "PIGIER CI",
      lieu: "Abidjan, Côte d'Ivoire",
      anneeDebut: 2025,
      anneeFin: 2026,
      enCours: false,
      badge: "Diplôme supérieur (Bac+3)",
      description: "Formation supérieure en conception logicielle et développement full stack.",
      tags: ["Full Stack", "Web Architecture"],
      url: "https://pigier.ci",
      visible: true,
      ordre: 1,
      profilSlugs: ["default", "dev"],
    };

    const parsed = parcoursItemSchema.safeParse(validFormation);
    assert.equal(parsed.success, true);
  });

  it("doit valider un jalon en cours sans date de fin", () => {
    const validEnCours = {
      type: "formation",
      titre: "Formation « Pratique IA Product Creator »",
      organisme: "Simplon CI",
      anneeDebut: 2026,
      moisDebut: 6,
      enCours: true,
      visible: true,
      ordre: 0,
      tags: ["IA", "Prompt Engineering"],
      profilSlugs: [],
    };

    const parsed = parcoursItemSchema.safeParse(validEnCours);
    assert.equal(parsed.success, true);
  });

  it("doit refuser un type de jalon non reconnu", () => {
    const invalidType = {
      type: "stage_inconnu",
      titre: "Stage test",
      organisme: "Entreprise",
      anneeDebut: 2025,
    };

    const parsed = parcoursItemSchema.safeParse(invalidType);
    assert.equal(parsed.success, false);
  });

  it("doit refuser une année de début invalide", () => {
    const invalidYear = {
      type: "formation",
      titre: "Formation test",
      organisme: "École",
      anneeDebut: 1850,
    };

    const parsed = parcoursItemSchema.safeParse(invalidYear);
    assert.equal(parsed.success, false);
  });
});

describe("Accès aux données du Parcours (lib/parcours.ts)", () => {
  it("doit retourner des jalons actifs depuis la base", async () => {
    const items = await getParcours();
    assert.ok(Array.isArray(items));
    assert.ok(items.length > 0, "Le parcours ne doit pas être vide après le seed.");
  });

  it("doit filtrer les jalons selon le slug du profil", async () => {
    const devItems = await getParcours("dev");
    assert.ok(Array.isArray(devItems));
    // Tous les items retournés doivent soit avoir profilSlugs vide, soit contenir "dev"
    for (const item of devItems) {
      assert.ok(
        item.profilSlugs.length === 0 || item.profilSlugs.includes("dev"),
        `L'élément ${item.titre} ne devrait pas apparaître sur /dev`
      );
    }
  });
});
