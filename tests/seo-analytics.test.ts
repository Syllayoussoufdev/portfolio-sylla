import test from "node:test";
import assert from "node:assert/strict";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { trackEvent, updateGtagConsent } from "../lib/analytics-client";

test("SEO Technique — Génération du fichier robots.txt", () => {
  const robotsConfig = robots();
  assert.ok(robotsConfig.rules, "Les règles de robots doivent être définies");

  const mainRule = Array.isArray(robotsConfig.rules)
    ? robotsConfig.rules[0]
    : robotsConfig.rules;

  assert.strictEqual(mainRule.userAgent, "*");
  assert.strictEqual(mainRule.allow, "/");

  const disallowList = Array.isArray(mainRule.disallow)
    ? mainRule.disallow
    : [mainRule.disallow];

  assert.ok(
    disallowList.includes("/admin/"),
    "L'administration /admin/ doit être exclue des moteurs"
  );
  assert.ok(
    disallowList.includes("/api/admin/"),
    "L'API d'administration /api/admin/ doit être exclue"
  );

  assert.match(
    robotsConfig.sitemap as string,
    /sitemap\.xml$/,
    "Le sitemap doit être référencé dans robots.txt"
  );
});

test("SEO Technique — Génération dynamique du sitemap.xml", async () => {
  const routes = await sitemap();
  assert.ok(Array.isArray(routes), "Le sitemap doit renvoyer une liste d'URLs");
  assert.ok(routes.length >= 5, "Le sitemap doit contenir au moins les 5 pages statiques");

  const urls = routes.map((r) => r.url);

  // Vérifier la présence des pages clés
  assert.ok(urls.some((u) => u.endsWith("/projets")));
  assert.ok(urls.some((u) => u.endsWith("/contact")));
  assert.ok(urls.some((u) => u.endsWith("/mentions-legales")));
  assert.ok(urls.some((u) => u.endsWith("/confidentialite")));

  // Vérifier les propriétés obligatoires
  for (const item of routes) {
    assert.ok(item.url.startsWith("http"), `L'URL ${item.url} doit être absolue`);
    assert.ok(item.priority !== undefined, "La priorité doit être définie");
  }
});

test("Google Analytics Client & Consent Mode (GA4)", () => {
  // Simuler window et dataLayer
  const mockGtagCalls: unknown[][] = [];
  (global as unknown as { window: unknown }).window = {
    dataLayer: [],
    gtag: (...args: unknown[]) => mockGtagCalls.push(args),
  };

  // Test du Consent Mode
  updateGtagConsent("granted");
  assert.strictEqual(mockGtagCalls.length, 1);
  assert.strictEqual(mockGtagCalls[0][0], "consent");
  assert.strictEqual(mockGtagCalls[0][1], "update");
  assert.deepStrictEqual(mockGtagCalls[0][2], {
    analytics_storage: "granted",
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });

  // Test de l'envoi d'événement
  trackEvent("test_kpi", { value: 42 });
  assert.strictEqual(mockGtagCalls.length, 2);
  assert.strictEqual(mockGtagCalls[1][0], "event");
  assert.strictEqual(mockGtagCalls[1][1], "test_kpi");
});
