/**
 * D2-T14/T16/T18: Zero-provider-call spy tests.
 *
 * Proves blocked requests never reach executeProviderCall.
 */

import { handleRequest, setAllowedRolesForTest } from "../index.ts";

const { providerCallSpy } = vi.hoisted(() => ({
  providerCallSpy: vi.fn(async () => ({
    ok: false as const, code: "provider_disabled" as const,
    messageVi: "stub", retryable: false, retryAfterMs: null, metadata: {},
  })),
}));

vi.mock("../provider.ts", () => ({
  executeProviderCall: providerCallSpy,
  buildProviderRequest: vi.fn(() => ({
    model: "test", messages: [], max_tokens: 100, temperature: 0, stream: false as const,
  })),
}));

function validBody(): Record<string, unknown> {
  return { sessionId: "test", systemPrompt: "t", userPrompt: "t", mode: "general_chat" };
}

function opJwt(): string {
  return btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    + "." + btoa(JSON.stringify({ sub: "u", role: "operator", exp: Date.now() / 1000 + 3600 })).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    + ".sig";
}

// D2-T14: Auth failures
test("D2-T14a: no Authorization header → 401, spy not called", async () => {
  const res = await handleRequest(new Request("https://ai-tutor.edge/", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(validBody()),
  }));
  expect(res.status).toBe(401);
  expect(providerCallSpy).not.toHaveBeenCalled();
});

test("D2-T14b: malformed JWT → 401, spy not called", async () => {
  const res = await handleRequest(new Request("https://ai-tutor.edge/", {
    method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer not.a.jwt" },
    body: JSON.stringify(validBody()),
  }));
  expect(res.status).toBe(401);
  expect(providerCallSpy).not.toHaveBeenCalled();
});

test("D2-T14c: empty allowlist → 401, spy not called", async () => {
  setAllowedRolesForTest([]);
  const res = await handleRequest(new Request("https://ai-tutor.edge/", {
    method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${opJwt()}` },
    body: JSON.stringify(validBody()),
  }));
  expect(res.status).toBe(401);
  expect(providerCallSpy).not.toHaveBeenCalled();
  setAllowedRolesForTest(["operator", "admin"]);
});

// D2-T16: Safety-blocked prompts
test("D2-T16: safety-blocked prompt → 400, spy not called", async () => {
  setAllowedRolesForTest(["operator"]);
  const res = await handleRequest(new Request("https://ai-tutor.edge/", {
    method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${opJwt()}` },
    body: JSON.stringify({ ...validBody(), userPrompt: "Email me at bad@example.com" }),
  }));
  expect(res.status).toBe(400);
  expect(providerCallSpy).not.toHaveBeenCalled();
  setAllowedRolesForTest(["operator", "admin"]);
});

// D2-T18: Input-too-long
test("D2-T18: input-too-long → 400, spy not called", async () => {
  setAllowedRolesForTest(["operator"]);
  const res = await handleRequest(new Request("https://ai-tutor.edge/", {
    method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${opJwt()}` },
    body: JSON.stringify({ ...validBody(), userPrompt: "x".repeat(501) }),
  }));
  expect(res.status).toBe(400);
  expect(providerCallSpy).not.toHaveBeenCalled();
  setAllowedRolesForTest(["operator", "admin"]);
});
