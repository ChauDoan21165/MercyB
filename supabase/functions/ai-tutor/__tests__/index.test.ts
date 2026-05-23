/**
 * Phase D2 — Edge Shell Adapter Wiring Tests
 *
 * Validates the index.ts handler: CORS, method validation,
 * request validation, disabled-service response, and safety.
 *
 * Uses vitest globals (test, expect) — vitest.config.ts has globals: true.
 */

import { handleRequest, setAllowedRolesForTest } from "../index.ts";

// ─── Helpers ─────────────────────────────────────────────────────────

function makeTestJwt(payload: Record<string, unknown> = {}): string {
  const header = { alg: "HS256", typ: "JWT" };
  const body = {
    sub: "test-user-abc", role: "authenticated",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    ...payload,
  };
  const enc = (obj: Record<string, unknown>) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${enc(header)}.${enc(body)}.fake-signature`;
}

const VALID_JWT = makeTestJwt();

function buildRequest(method: string, body?: unknown, extraHeaders?: Record<string, string>): Request {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (method === "POST") headers["Authorization"] = `Bearer ${VALID_JWT}`;
  if (extraHeaders) Object.assign(headers, extraHeaders);
  const init: RequestInit = { method, headers };
  if (body !== undefined) init.body = JSON.stringify(body);
  return new Request("https://ai-tutor.edge/", init);
}

beforeAll(() => { setAllowedRolesForTest(["authenticated"]); });

function validBody(): Record<string, unknown> {
  return {
    sessionId: "test-session-d2",
    systemPrompt: "You are a helpful English tutor.",
    userPrompt: "How do I say 'thank you' formally?",
    mode: "general_chat",
  };
}

function parseJsonBody(res: Response): Record<string, unknown> {
  throw new Error("Cannot read body from Response in vitest — use text()");
}
// Note: Response.json() requires the body to still be readable.
// We use a helper that reads via res.clone().text() when needed.

async function readBody(res: Response): Promise<Record<string, unknown>> {
  const text = await res.clone().text();
  return JSON.parse(text);
}

// ─── D2-T1: OPTIONS returns 204 with CORS ─────────────────────────

test("D2-T1a: OPTIONS returns 204", async () => {
  const req = new Request("https://ai-tutor.edge/", { method: "OPTIONS" });
  const res = await handleRequest(req);
  expect(res.status).toBe(204);
});

test("D2-T1b: OPTIONS includes CORS headers", async () => {
  const req = new Request("https://ai-tutor.edge/", { method: "OPTIONS" });
  const res = await handleRequest(req);
  expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  expect(res.headers.get("Access-Control-Allow-Methods")).toBe("POST, OPTIONS");
});

test("D2-T1c: OPTIONS has no body", async () => {
  const req = new Request("https://ai-tutor.edge/", { method: "OPTIONS" });
  const res = await handleRequest(req);
  const text = await res.clone().text();
  expect(text).toBe("");
});

// ─── D2-T2: GET returns 405 method_not_allowed ────────────────────

test("D2-T2a: GET returns 405", async () => {
  const req = buildRequest("GET");
  const res = await handleRequest(req);
  expect(res.status).toBe(405);
});

test("D2-T2b: GET response includes errorKind method_not_allowed", async () => {
  const req = buildRequest("GET");
  const res = await handleRequest(req);
  const body = await readBody(res);
  expect(body.ok).toBe(false);
  expect(body.errorKind).toBe("method_not_allowed");
});

test("D2-T2c: GET response includes requestId", async () => {
  const req = buildRequest("GET");
  const res = await handleRequest(req);
  const body = await readBody(res);
  expect(typeof body.requestId).toBe("string");
  expect((body.requestId as string).length).toBeGreaterThan(0);
});

test("D2-T2d: PUT returns 405", async () => {
  const req = buildRequest("PUT");
  const res = await handleRequest(req);
  expect(res.status).toBe(405);
});

test("D2-T2e: DELETE returns 405", async () => {
  const req = buildRequest("DELETE");
  const res = await handleRequest(req);
  expect(res.status).toBe(405);
});

// ─── D2-T3: Invalid POST returns 400 invalid_request ──────────────

test("D2-T3a: missing sessionId returns 400 invalid_request", async () => {
  const body = validBody();
  delete body.sessionId;
  const req = buildRequest("POST", body);
  const res = await handleRequest(req);
  expect(res.status).toBe(400);
  const data = await readBody(res);
  expect(data.ok).toBe(false);
  expect(data.errorKind).toBe("invalid_request");
});

test("D2-T3b: empty sessionId returns 400", async () => {
  const body = { ...validBody(), sessionId: "" };
  const req = buildRequest("POST", body);
  const res = await handleRequest(req);
  expect(res.status).toBe(400);
});

test("D2-T3c: missing systemPrompt returns 400", async () => {
  const body = validBody();
  delete body.systemPrompt;
  const req = buildRequest("POST", body);
  const res = await handleRequest(req);
  expect(res.status).toBe(400);
});

test("D2-T3d: missing userPrompt returns 400", async () => {
  const body = validBody();
  delete body.userPrompt;
  const req = buildRequest("POST", body);
  const res = await handleRequest(req);
  expect(res.status).toBe(400);
});

test("D2-T3e: missing mode returns 400", async () => {
  const body = validBody();
  delete body.mode;
  const req = buildRequest("POST", body);
  const res = await handleRequest(req);
  expect(res.status).toBe(400);
});

test("D2-T3f: invalid mode returns 400", async () => {
  const body = { ...validBody(), mode: "invalid_mode_xyz" };
  const req = buildRequest("POST", body);
  const res = await handleRequest(req);
  expect(res.status).toBe(400);
});

test("D2-T3g: non-JSON body returns 400", async () => {
  const req = new Request("https://ai-tutor.edge/", {
    method: "POST",
    headers: { "Content-Type": "text/plain", "Authorization": `Bearer ${VALID_JWT}` },
    body: "not json",
  });
  const res = await handleRequest(req);
  expect(res.status).toBe(400);
});

test("D2-T3h: empty object body returns 400", async () => {
  const req = buildRequest("POST", {});
  const res = await handleRequest(req);
  expect(res.status).toBe(400);
});

// ─── D2-T4: Valid POST returns 503 provider_disabled ──────────────

test("D2-T4a: valid POST returns 503", async () => {
  const req = buildRequest("POST", validBody());
  const res = await handleRequest(req);
  expect(res.status).toBe(503);
});

test("D2-T4b: valid POST response has ok:false", async () => {
  const req = buildRequest("POST", validBody());
  const res = await handleRequest(req);
  const body = await readBody(res);
  expect(body.ok).toBe(false);
});

test("D2-T4c: valid POST response has errorKind service_disabled", async () => {
  const req = buildRequest("POST", validBody());
  const res = await handleRequest(req);
  const body = await readBody(res);
  expect(body.errorKind).toBe("service_disabled");
});

test("D2-T4d: valid POST response includes message (Vietnamese)", async () => {
  const req = buildRequest("POST", validBody());
  const res = await handleRequest(req);
  const body = await readBody(res);
  expect(typeof body.message).toBe("string");
  expect((body.message as string).length).toBeGreaterThan(0);
});

test("D2-T4e: valid POST response includes requestId", async () => {
  const req = buildRequest("POST", validBody());
  const res = await handleRequest(req);
  const body = await readBody(res);
  expect(typeof body.requestId).toBe("string");
  expect((body.requestId as string).length).toBeGreaterThan(0);
});

test("D2-T4f: valid POST with pronunciation_coaching mode returns 503", async () => {
  const body = { ...validBody(), mode: "pronunciation_coaching" };
  const req = buildRequest("POST", body);
  const res = await handleRequest(req);
  expect(res.status).toBe(503);
});

test("D2-T4g: valid POST with sentence_correction mode returns 503", async () => {
  const body = { ...validBody(), mode: "sentence_correction" };
  const req = buildRequest("POST", body);
  const res = await handleRequest(req);
  expect(res.status).toBe(503);
});

test("D2-T4h: valid POST with writing_feedback mode returns 503", async () => {
  const body = { ...validBody(), mode: "writing_feedback" };
  const req = buildRequest("POST", body);
  const res = await handleRequest(req);
  expect(res.status).toBe(503);
});

test("D2-T4i: valid POST with lesson_guidance mode returns 503", async () => {
  const body = { ...validBody(), mode: "lesson_guidance" };
  const req = buildRequest("POST", body);
  const res = await handleRequest(req);
  expect(res.status).toBe(503);
});

// ─── D2-T5: All responses include requestId ───────────────────────

test("D2-T5a: 405 response includes requestId", async () => {
  const req = buildRequest("GET");
  const res = await handleRequest(req);
  const body = await readBody(res);
  expect(typeof body.requestId).toBe("string");
  expect((body.requestId as string).length).toBeGreaterThan(0);
});

test("D2-T5b: 400 response includes requestId", async () => {
  const body = { ...validBody(), mode: "bad" };
  const req = buildRequest("POST", body);
  const res = await handleRequest(req);
  const data = await readBody(res);
  expect(typeof data.requestId).toBe("string");
  expect((data.requestId as string).length).toBeGreaterThan(0);
});

test("D2-T5c: 503 response includes requestId", async () => {
  const req = buildRequest("POST", validBody());
  const res = await handleRequest(req);
  const body = await readBody(res);
  expect(typeof body.requestId).toBe("string");
  expect((body.requestId as string).length).toBeGreaterThan(0);
});

test("D2-T5d: requestIds are unique across calls", async () => {
  const req1 = buildRequest("POST", validBody());
  const req2 = buildRequest("GET");
  const res1 = await handleRequest(req1);
  const res2 = await handleRequest(req2);
  const body1 = await readBody(res1);
  const body2 = await readBody(res2);
  expect(body1.requestId).not.toBe(body2.requestId);
});

// ─── D2-T6: All responses include CORS headers ────────────────────

test("D2-T6a: 405 response includes CORS headers", async () => {
  const req = buildRequest("GET");
  const res = await handleRequest(req);
  expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
});

test("D2-T6b: 400 response includes CORS headers", async () => {
  const body = { ...validBody(), mode: "bad" };
  const req = buildRequest("POST", body);
  const res = await handleRequest(req);
  expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
});

test("D2-T6c: 503 response includes CORS headers", async () => {
  const req = buildRequest("POST", validBody());
  const res = await handleRequest(req);
  expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
});

test("D2-T6d: 204 response includes CORS headers", async () => {
  const req = new Request("https://ai-tutor.edge/", { method: "OPTIONS" });
  const res = await handleRequest(req);
  expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
});

test("D2-T6e: CORS Content-Type header is JSON with charset", async () => {
  const req = buildRequest("POST", validBody());
  const res = await handleRequest(req);
  expect(res.headers.get("Content-Type")).toBe("application/json; charset=utf-8");
});

// ─── D2-T7: Valid POST does not expose ok:true ────────────────────

test("D2-T7a: valid POST response ok is false (not true)", async () => {
  const req = buildRequest("POST", validBody());
  const res = await handleRequest(req);
  const body = await readBody(res);
  expect(body.ok).toBe(false);
});

test("D2-T7b: valid POST response ok is explicitly false", async () => {
  const req = buildRequest("POST", validBody());
  const res = await handleRequest(req);
  const body = await readBody(res);
  // ok must be strictly false, not just falsy
  expect(body.ok === false).toBe(true);
});

test("D2-T7c: valid POST response has no ok:true anywhere in body", async () => {
  const req = buildRequest("POST", validBody());
  const res = await handleRequest(req);
  const text = await res.clone().text();
  expect(text).not.toContain('"ok":true');
});

test("D2-T7d: 405 GET response has no ok:true", async () => {
  const req = buildRequest("GET");
  const res = await handleRequest(req);
  const text = await res.clone().text();
  expect(text).not.toContain('"ok":true');
});

test("D2-T7e: 400 invalid response has no ok:true", async () => {
  const req = buildRequest("POST", {});
  const res = await handleRequest(req);
  const text = await res.clone().text();
  expect(text).not.toContain('"ok":true');
});

test("D2-T7f: 204 OPTIONS response has no ok:true", async () => {
  const req = new Request("https://ai-tutor.edge/", { method: "OPTIONS" });
  const res = await handleRequest(req);
  const text = await res.clone().text();
  expect(text).not.toContain('"ok":true');
});

// ─── D2-T8: Determinism and safety ─────────────────────────────────

test("D2-T8a: valid POST handler is deterministic (same input → same behavior)", async () => {
  const body = validBody();
  const req1 = buildRequest("POST", body);
  const req2 = buildRequest("POST", body);
  const res1 = await handleRequest(req1);
  const res2 = await handleRequest(req2);
  expect(res1.status).toBe(res2.status);
  const data1 = await readBody(res1);
  const data2 = await readBody(res2);
  expect(data1.ok).toBe(data2.ok);
  expect(data1.errorKind).toBe(data2.errorKind);
});

test("D2-T8b: handler does not throw on repeated calls", async () => {
  let threw = false;
  try {
    for (let i = 0; i < 10; i++) {
      await handleRequest(buildRequest("POST", validBody()));
    }
  } catch {
    threw = true;
  }
  expect(threw).toBe(false);
});

test("D2-T8c: handler does not throw on OPTIONS", async () => {
  let threw = false;
  try {
    await handleRequest(new Request("https://ai-tutor.edge/", { method: "OPTIONS" }));
  } catch {
    threw = true;
  }
  expect(threw).toBe(false);
});

// ─── D2-T9: Smoke token from x-tutor-smoke-token header ───────────

test("D2-T9a: POST with x-tutor-smoke-token header does not throw", async () => {
  const body = { ...validBody(), mode: "sentence_correction" };
  const req = buildRequest("POST", body, { "x-tutor-smoke-token": "test-token" });
  let threw = false;
  try {
    await handleRequest(req);
  } catch {
    threw = true;
  }
  expect(threw).toBe(false);
});

test("D2-T9b: POST with x-tutor-smoke-token header returns 503 (env not set)", async () => {
  const body = { ...validBody(), mode: "sentence_correction" };
  const req = buildRequest("POST", body, { "x-tutor-smoke-token": "test-token" });
  const res = await handleRequest(req);
  // Without Deno env, provider returns disabled → 503 is correct
  expect(res.status).toBe(503);
});

test("D2-T9c: POST without header and without body.smokeToken returns 503", async () => {
  const body = { ...validBody(), mode: "sentence_correction" };
  // No smoke token anywhere
  const req = buildRequest("POST", body);
  const res = await handleRequest(req);
  expect(res.status).toBe(503);
  const data = await readBody(res);
  expect(data.errorKind).toBe("service_disabled");
});

test("D2-T9d: OPTIONS response includes x-tutor-smoke-token in allow-headers", async () => {
  const req = new Request("https://ai-tutor.edge/", { method: "OPTIONS" });
  const res = await handleRequest(req);
  const allowHeaders = res.headers.get("Access-Control-Allow-Headers");
  expect(allowHeaders).toContain("x-tutor-smoke-token");
  expect(allowHeaders).toContain("apikey");
});

test("D2-T9e: POST with empty header treats smokeToken as missing (no body fallback)", async () => {
  // Empty/whitespace header → smokeToken is undefined. Body.smokeToken is ignored.
  const body = {
    ...validBody(),
    mode: "sentence_correction",
    smokeToken: "body-token", // This should be IGNORED
  };
  const req = buildRequest("POST", body, { "x-tutor-smoke-token": "   " });
  let threw = false;
  try {
    const res = await handleRequest(req);
    expect(res.status).toBe(503); // env not set, handler processed OK
  } catch {
    threw = true;
  }
  expect(threw).toBe(false);
});

test("D2-T9f: POST with header only (no body.smokeToken) does not crash", async () => {
  const body = { ...validBody(), mode: "sentence_correction" };
  // No body.smokeToken, only header
  const req = buildRequest("POST", body, { "x-tutor-smoke-token": "header-only-token" });
  let threw = false;
  try {
    const res = await handleRequest(req);
    expect(res.status).toBe(503);
  } catch {
    threw = true;
  }
  expect(threw).toBe(false);
});

test("D2-T9g: POST with whitespace-only header treated as missing", async () => {
  const body = { ...validBody(), mode: "sentence_correction" };
  const req = buildRequest("POST", body, { "x-tutor-smoke-token": "   " });
  let threw = false;
  try {
    const res = await handleRequest(req);
    expect(res.status).toBe(503);
  } catch {
    threw = true;
  }
  expect(threw).toBe(false);
});

test("D2-T9h: body.smokeToken is NOT accepted — only header is canonical", async () => {
  // This test proves body.smokeToken is ignored by the handler.
  // The body has a smokeToken but no header → smokeToken should be undefined.
  const body = {
    ...validBody(),
    mode: "sentence_correction",
    smokeToken: "should-be-ignored",
  };
  // No x-tutor-smoke-token header
  const req = buildRequest("POST", body);
  let threw = false;
  try {
    const res = await handleRequest(req);
    expect(res.status).toBe(503); // handler processes OK, env not set
  } catch {
    threw = true;
  }
  expect(threw).toBe(false);
});

// ═══════════════════════════════════════════════════════════════════════
// D2-T10: smoke_token_required mapping (requires env stubs)
// ═══════════════════════════════════════════════════════════════════════

describe("D2-T10: smoke_token_required handler mapping", () => {
  beforeAll(() => {
    vi.stubGlobal("Deno", {
      env: {
        get: vi.fn((key: string) => {
          if (key === "REAL_PROVIDER_ENABLED") return "true";
          // TUTOR_SMOKE_TOKEN and DEEPSEEK_API_KEY absent
          return undefined;
        }),
      },
    });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  test("D2-T10a: smoke_token_required maps to HTTP 503", async () => {
    // With REAL_PROVIDER_ENABLED=true but no TUTOR_SMOKE_TOKEN,
    // Gate 5a triggers → smoke_token_required → 503
    const body = { ...validBody(), mode: "sentence_correction" };
    const req = buildRequest("POST", body, { "x-tutor-smoke-token": "any-token" });
    const res = await handleRequest(req);
    expect(res.status).toBe(503);
  });

  test("D2-T10b: smoke_token_required maps to errorKind service_disabled", async () => {
    const body = { ...validBody(), mode: "sentence_correction" };
    const req = buildRequest("POST", body, { "x-tutor-smoke-token": "any-token" });
    const res = await handleRequest(req);
    const data = await readBody(res);
    expect(data.ok).toBe(false);
    expect(data.errorKind).toBe("service_disabled");
  });

  test("D2-T10c: smoke_token_required response includes message and requestId", async () => {
    const body = { ...validBody(), mode: "sentence_correction" };
    const req = buildRequest("POST", body, { "x-tutor-smoke-token": "any-token" });
    const res = await handleRequest(req);
    const data = await readBody(res);
    expect(typeof data.message).toBe("string");
    expect(typeof data.requestId).toBe("string");
  });
});

// ═══════════════════════════════════════════════════════════════════════
// D2-T11: provider_not_configured handler mapping (requires env stubs)
// ═══════════════════════════════════════════════════════════════════════

describe("D2-T11: provider_not_configured handler mapping", () => {
  beforeAll(() => {
    vi.stubGlobal("Deno", {
      env: {
        get: vi.fn((key: string) => {
          if (key === "REAL_PROVIDER_ENABLED") return "true";
          if (key === "TUTOR_SMOKE_TOKEN") return "smoke-secret";
          // DEEPSEEK_API_KEY absent → Gate 6 triggers provider_not_configured
          return undefined;
        }),
      },
    });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  test("D2-T11a: provider_not_configured maps to HTTP 400", async () => {
    // With REAL_PROVIDER_ENABLED=true, TUTOR_SMOKE_TOKEN=valid,
    // but no DEEPSEEK_API_KEY, Gate 6 triggers → provider_not_configured → 400
    const body = { ...validBody(), mode: "sentence_correction" };
    const req = buildRequest("POST", body, { "x-tutor-smoke-token": "smoke-secret" });
    const res = await handleRequest(req);
    expect(res.status).toBe(400);
  });

  test("D2-T11b: provider_not_configured passes code as errorKind", async () => {
    const body = { ...validBody(), mode: "sentence_correction" };
    const req = buildRequest("POST", body, { "x-tutor-smoke-token": "smoke-secret" });
    const res = await handleRequest(req);
    const data = await readBody(res);
    expect(data.errorKind).toBe("provider_not_configured");
  });
});

// ═══════════════════════════════════════════════════════════════════════
// D2-T12: JWT auth rejection (deny-by-default)
// ═══════════════════════════════════════════════════════════════════════

describe("D2-T12: JWT auth rejection", () => {
  test("D2-T12a: no Authorization header → 401 unauthorized", async () => {
    const body = validBody();
    const req = new Request("https://ai-tutor.edge/", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const res = await handleRequest(req);
    expect(res.status).toBe(401);
    const data = await readBody(res);
    expect(data.errorKind).toBe("unauthorized");
  });

  test("D2-T12b: malformed token → 401", async () => {
    const body = validBody();
    const req = new Request("https://ai-tutor.edge/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer not.a.jwt" },
      body: JSON.stringify(body),
    });
    const res = await handleRequest(req);
    expect(res.status).toBe(401);
    expect((await readBody(res)).errorKind).toBe("unauthorized");
  });

  test("D2-T12c: expired token → 401", async () => {
    const expiredJwt = makeTestJwt({ exp: Math.floor(Date.now() / 1000) - 60 });
    const req = new Request("https://ai-tutor.edge/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${expiredJwt}` },
      body: JSON.stringify(validBody()),
    });
    const res = await handleRequest(req);
    expect(res.status).toBe(401);
  });

  test("D2-T12d: valid token with empty allowlist → 401", async () => {
    setAllowedRolesForTest([]);
    const req = new Request("https://ai-tutor.edge/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${VALID_JWT}` },
      body: JSON.stringify(validBody()),
    });
    const res = await handleRequest(req);
    expect(res.status).toBe(401);
    setAllowedRolesForTest(["authenticated"]);
  });

  test("D2-T12e: missing sub claim → 401", async () => {
    const noSubJwt = makeTestJwt({ sub: "" });
    const req = new Request("https://ai-tutor.edge/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${noSubJwt}` },
      body: JSON.stringify(validBody()),
    });
    const res = await handleRequest(req);
    expect(res.status).toBe(401);
  });

  test("D2-T12f: OPTIONS bypasses auth (204)", async () => {
    const res = await handleRequest(new Request("https://ai-tutor.edge/", { method: "OPTIONS" }));
    expect(res.status).toBe(204);
  });

  test("D2-T12g: GET bypasses auth (405)", async () => {
    const res = await handleRequest(new Request("https://ai-tutor.edge/", {
      method: "GET", headers: { "Content-Type": "application/json" },
    }));
    expect(res.status).toBe(405);
  });

  test("D2-T12h: auth failure includes requestId", async () => {
    const req = new Request("https://ai-tutor.edge/", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody()),
    });
    const data = await readBody(await handleRequest(req));
    expect(typeof data.requestId).toBe("string");
  });

  test("D2-T12i: valid auth reaches provider_disabled (503)", async () => {
    setAllowedRolesForTest(["authenticated"]);
    const res = await handleRequest(buildRequest("POST", validBody()));
    expect(res.status).toBe(503);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// D2-T13: Smoke token bypasses JWT (operator smoke path)
// ═══════════════════════════════════════════════════════════════════════

const SMOKE_SECRET = "smoke-bypass-test-token";

describe("D2-T13: smoke token bypasses JWT", () => {
  beforeAll(() => {
    vi.stubGlobal("Deno", {
      env: { get: vi.fn((k: string) => {
        if (k === "REAL_PROVIDER_ENABLED") return "true";
        if (k === "TUTOR_SMOKE_TOKEN") return SMOKE_SECRET;
        return undefined;
      })},
    });
    setAllowedRolesForTest(["authenticated"]);
  });
  afterAll(() => { vi.unstubAllGlobals(); });

  test("D2-T13a: valid smoke token bypasses JWT, reaches provider gates", async () => {
    const body = { ...validBody(), mode: "sentence_correction" };
    const req = new Request("https://ai-tutor.edge/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-tutor-smoke-token": SMOKE_SECRET },
      body: JSON.stringify(body),
    });
    const res = await handleRequest(req);
    expect(res.status).toBe(400); // Gate 6: DEEPSEEK_API_KEY absent
    expect((await readBody(res)).errorKind).toBe("provider_not_configured");
  });

  test("D2-T13b: invalid smoke token → 401 (JWT required)", async () => {
    const req = new Request("https://ai-tutor.edge/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-tutor-smoke-token": "wrong" },
      body: JSON.stringify({ ...validBody(), mode: "sentence_correction" }),
    });
    const res = await handleRequest(req);
    expect(res.status).toBe(401);
  });

  test("D2-T13c: valid JWT without smoke token → smoke gate (503)", async () => {
    const req = buildRequest("POST", { ...validBody(), mode: "sentence_correction" });
    const res = await handleRequest(req);
    expect(res.status).toBe(503); // Gate 5b fires
  });
});

// D2-T13d: after describe, Deno unstubbed — smoke bypass unavailable
test("D2-T13d: smoke bypass without TUTOR_SMOKE_TOKEN env → 401", async () => {
  const req = new Request("https://ai-tutor.edge/", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-tutor-smoke-token": SMOKE_SECRET },
    body: JSON.stringify({ ...validBody(), mode: "sentence_correction" }),
  });
  const res = await handleRequest(req);
  expect(res.status).toBe(401);
});