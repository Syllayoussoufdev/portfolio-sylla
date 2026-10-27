import test from "node:test";
import assert from "node:assert/strict";
import { buildChatbotSystemPrompt } from "../lib/chatbot-context";
import { POST } from "../app/api/chat/route";
import { NextRequest } from "next/server";

test("Assistant Virtuel & Chatbot Flottant (Groq / Llama 3)", async (t) => {
  await t.test("doit construire un system prompt complet avec le profil et les données métier", async () => {
    const prompt = await buildChatbotSystemPrompt();
    assert.ok(prompt.length > 500, "Le prompt système doit être richement documenté");
    assert.match(prompt, /Sylla Youssouf/i);
    assert.match(prompt, /WhatsApp/i);
    assert.match(prompt, /FCFA/i);
    assert.match(prompt, /CONNAISSANCES/i);
  });

  await t.test("doit retourner un code 503 propre si GROQ_API_KEY est manquante", async () => {
    const originalKey = process.env.GROQ_API_KEY;
    delete process.env.GROQ_API_KEY;

    try {
      const req = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Bonjour" }],
        }),
      });

      const res = await POST(req);
      assert.strictEqual(res.status, 503);
      const data = await res.json();
      assert.match(data.error, /WhatsApp/i);
    } finally {
      if (originalKey) process.env.GROQ_API_KEY = originalKey;
    }
  });

  await t.test("doit refuser une requête avec un corps invalide (messages vides)", async () => {
    const originalKey = process.env.GROQ_API_KEY;
    process.env.GROQ_API_KEY = "dummy-test-key";

    try {
      const req = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [] }),
      });

      const res = await POST(req);
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.match(data.error, /invalide/i);
    } finally {
      if (originalKey) {
        process.env.GROQ_API_KEY = originalKey;
      } else {
        delete process.env.GROQ_API_KEY;
      }
    }
  });
});
