import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  FALLBACK_DEFAULT_PROFILE,
  FALLBACK_SITE_SETTINGS,
  getDefaultProfile,
  getProfileBySlug,
  getSiteSettings,
} from "../lib/profiles";

describe("Fonctions d'accès aux Profils (lib/profiles.ts)", () => {
  it("doit retourner un profil par défaut valide", async () => {
    const profile = await getDefaultProfile();
    assert.ok(profile, "Le profil par défaut ne doit pas être null");
    assert.ok(profile.hero, "Le profil doit comporter un Hero");
    assert.equal(profile.actif, true, "Le profil par défaut doit être actif");
  });

  it("doit retourner le profil correspondant pour un slug existant", async () => {
    const devProfile = await getProfileBySlug("dev");
    if (devProfile) {
      assert.equal(devProfile.slug, "dev");
      assert.ok(["developpeur", "devcreative"].includes(devProfile.template));
    }
  });

  it("doit retourner le profil correspondant pour le sous-portfolio developpeur", async () => {
    const devProfile = await getProfileBySlug("developpeur");
    assert.ok(devProfile, "Le profil /developpeur doit être trouvé");
    assert.equal(devProfile.slug, "developpeur");
    assert.equal(devProfile.template, "developpeur");
  });

  it("doit retourner null pour un slug inexistant ou inactif", async () => {
    const unknown = await getProfileBySlug("slug-completement-inexistant-xyz");
    assert.equal(unknown, null);
  });

  it("doit retourner les réglages du site ou le repli", async () => {
    const settings = await getSiteSettings();
    assert.ok(settings, "SiteSettings ne doit pas être null");
    assert.ok(settings.nom, "Le nom du site doit être défini");
  });

  it("doit fournir les constantes de secours FALLBACK en mémoire", () => {
    assert.equal(FALLBACK_DEFAULT_PROFILE.slug, "default");
    assert.equal(FALLBACK_DEFAULT_PROFILE.isDefault, true);
    assert.equal(FALLBACK_SITE_SETTINGS.nom, "Sylla Youssouf");
    assert.equal(FALLBACK_SITE_SETTINGS.emailPublic, null);
    assert.equal(FALLBACK_SITE_SETTINGS.whatsapp, null);
  });
});
