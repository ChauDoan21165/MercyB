/**
 * D2-T14: Zero-provider-call spy test.
 *
 * Proves unauthorized auth-failure requests never reach executeProviderCall.
 * Uses vi.mock on provider.ts with a spy; asserts spy is never called.
 */

import { handleRequest, setAllowedRolesForTest } from "../index.ts";

const { providerCallSpy } = vi.hoisted(() => ({
  providerCallSpy: vi.fn(async () => ({
    ok: false as const,
    code: "provider_disabled" as const,
    messageVi: "stub",
    retryable: false,
    retryAfterMs: null,
    metadata: {},
  })),
}));

vi.mock("../provider.ts", () => ({
  executeProviderCall: providerCallSpy,
  buildProviderRequest: vi.fn(() => ({
    model: "test",
    messages: [],
    max_tokens: 100,
    temperature: 0,
    stream: false as const,
  })),
}));

function validBody(): Record<string, unknown> {
  return {
    sessionId: "test",
    systemPrompt: "t",
    userPrompt: "t",
    mode: "general_chat",
  };
}

test("D2-T14a: no Authorization header → 401, executeProviderCall never called", async () => {
  const req = new Request("https://ai-tutor.edge/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validBody()),
  });
  const res = await handleRequest(req);
  expect(res.status).toBe(401);
  expect(providerCallSpy).not.toHaveBeenCalled();
});

test("D2-T14b: malformed JWT → 401, executeProviderCall never called", async () => {
  const req = new Request("https://ai-tutor.edge/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer not.a.jwt",
    },
    body: JSON.stringify(validBody()),
  });
  const res = await handleRequest(req);
  expect(res.status).toBe(401);
  expect(providerCallSpy).not.toHaveBeenCalled();
});

test("D2-T14c: valid JWT with empty allowlist → 401, executeProviderCall never called", async () => {
  setAllowedRolesForTest([]);
  const jwt = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    + "." + btoa(JSON.stringify({ sub: "u", role: "authenticated", exp: Date.now() / 1000 + 3600 })).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    + ".sig";
  const req = new Request("https://ai-tutor.edge/", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${jwt}` },
    body: JSON.stringify(validBody()),
  });
  const res = await handleRequest(req);
  expect(res.status).toBe(401);
  expect(providerCallSpy).not.toHaveBeenCalled();
  setAllowedRolesForTest(["authenticated"]);
});
