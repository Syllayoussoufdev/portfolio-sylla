import test from "node:test";
import assert from "node:assert/strict";
import { ContactSchema, escapeHtml } from "../app/actions/contact";
import { checkRateLimit, incrementRateLimit, resetRateLimit } from "../lib/rate-limit";

test("Validation Zod du Formulaire de Contact (Étape 10)", async (t) => {
  await t.test("doit valider un message complet et conforme", () => {
    const validData = {
      nom: "Jean Dupont",
      email: "jean.dupont@example.com",
      message: "Bonjour Sylla, j'aimerais échanger au sujet d'une mission de refonte web.",
    };

    const res = ContactSchema.safeParse(validData);
    assert.strictEqual(res.success, true);
  });

  await t.test("doit refuser une adresse email invalide", () => {
    const invalidData = {
      nom: "Alexandre",
      email: "alexandre-pas-un-email",
      message: "Message de test suffisamment long.",
    };

    const res = ContactSchema.safeParse(invalidData);
    assert.strictEqual(res.success, false);
    if (!res.success) {
      assert.match(res.error.issues[0].message, /email valide/i);
    }
  });

  await t.test("doit refuser un nom trop court (< 2 caractères)", () => {
    const invalidData = {
      nom: "A",
      email: "test@example.com",
      message: "Message de test suffisamment long.",
    };

    const res = ContactSchema.safeParse(invalidData);
    assert.strictEqual(res.success, false);
  });

  await t.test("doit refuser un message trop court (< 10 caractères)", () => {
    const invalidData = {
      nom: "Marie",
      email: "marie@example.com",
      message: "Court",
    };

    const res = ContactSchema.safeParse(invalidData);
    assert.strictEqual(res.success, false);
    if (!res.success) {
      assert.match(res.error.issues[0].message, /au moins 10 caractères/i);
    }
  });
});

test("Sécurité Anti-Injection & Échappement HTML (Étape 10)", async (t) => {
  await t.test("doit neutraliser les balises et caractères sensibles", () => {
    const raw = `<script>alert("hack & steal")</script> 'hello'`;
    const escaped = escapeHtml(raw);

    assert.strictEqual(
      escaped,
      "&lt;script&gt;alert(&quot;hack &amp; steal&quot;)&lt;/script&gt; &#039;hello&#039;"
    );
    assert.strictEqual(escaped.includes("<"), false);
    assert.strictEqual(escaped.includes(">"), false);
  });
});

test("Limitation de Débit du Formulaire de Contact (Étape 10)", async (t) => {
  const testIp = "test-contact-ip-rate-limit";
  resetRateLimit(`contact:${testIp}`);

  await t.test("doit autoriser les 5 premiers messages", () => {
    for (let i = 0; i < 5; i++) {
      const res = checkRateLimit(`contact:${testIp}`, 5, 10000);
      assert.strictEqual(res.allowed, true);
      incrementRateLimit(`contact:${testIp}`, 10000);
    }
  });

  await t.test("doit bloquer la 6ème tentative", () => {
    const res = checkRateLimit(`contact:${testIp}`, 5, 10000);
    assert.strictEqual(res.allowed, false);
    assert.ok(res.retryAfterSeconds > 0);
  });

  // Nettoyage
  resetRateLimit(`contact:${testIp}`);
});
