import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit, incrementRateLimit, resetRateLimit } from "../lib/rate-limit";
import { signSessionToken, verifySessionToken } from "../lib/auth";

describe("Sécurité Authentification & Limitation de débit (Étape 9)", () => {
  it("doit autoriser les premières tentatives de connexion", () => {
    const key = `test-ip-${Date.now()}`;
    const status = checkRateLimit(key, 5, 60000);
    assert.equal(status.allowed, true);
    assert.equal(status.remaining, 5);
  });

  it("doit verrouiller après 5 échecs consécutifs", () => {
    const key = `test-brute-force-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      incrementRateLimit(key, 60000);
    }
    const status = checkRateLimit(key, 5, 60000);
    assert.equal(status.allowed, false);
    assert.equal(status.remaining, 0);
    assert.ok(status.retryAfterSeconds > 0);
  });

  it("doit réinitialiser les quotas en cas de succès", () => {
    const key = `test-reset-${Date.now()}`;
    incrementRateLimit(key, 60000);
    incrementRateLimit(key, 60000);
    resetRateLimit(key);
    const status = checkRateLimit(key, 5, 60000);
    assert.equal(status.allowed, true);
    assert.equal(status.remaining, 5);
  });

  it("doit signer et vérifier un jeton de session valide", async () => {
    const token = await signSessionToken({
      email: "contact@syllayoussouf.com",
      role: "admin",
    });
    assert.ok(token && typeof token === "string");

    const session = await verifySessionToken(token);
    assert.ok(session !== null);
    assert.equal(session?.email, "contact@syllayoussouf.com");
    assert.equal(session?.role, "admin");
  });

  it("doit refuser un jeton corrompu ou falsifié", async () => {
    const token = await signSessionToken({
      email: "admin@test.com",
      role: "admin",
    });
    const tampered = token.slice(0, -6) + "xxxxxx";
    const session = await verifySessionToken(tampered);
    assert.equal(session, null);
  });
});
