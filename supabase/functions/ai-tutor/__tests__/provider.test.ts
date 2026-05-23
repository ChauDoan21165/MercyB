/**
 * Phase D1 + PR-REAL-1 — Provider Execution Adapter Tests
 *
 * Validates executeProviderCall: disabled-state invariants (D1),
 * gate behavior (PR-REAL-1), and real execution path with mocked
 * fetch/Deno.env (PR-REAL-1).
 *
 * All tests run without real provider execution, without env reads,
 * without network calls, without Supabase persistence.
 *
 * Uses vitest globals (test, expect) — vitest.config.ts has globals: true.
 */

import {
  executeProviderCall,
  isProviderExecutionEnabled,
  isProviderExecutionDisabled,
  getProviderCapabilities,
  validateProviderExecutionRequest,
  validateProviderExecutionResult,
  buildProviderDisabledResult,
  redactProviderExecutionLog,
  buildProviderErrorResponse,
  buildProviderRequest,
  moderateProviderOutput,
} from "../provider.ts";
import type {
  ProviderExecutionRequest,
  ProviderExecutionResult,
  ProviderExecutionSuccess,
} from "../provider.ts";

// ─── Helpers ───────────────────────────────────────────────────────────

function validRequest(mode = "general_chat"): ProviderExecutionRequest {
  const providerRequest = buildProviderRequest({
    systemPrompt: "You are a helpful English tutor.",
    messages: [{ role: "user", content: "Hello" }],
  });

  return {
    sessionId: "test-session-1",
    providerRequest,
    mode,
    requestId: "req-test-001",
  };
}

function sentenceCorrectionRequest(smokeToken?: string): ProviderExecutionRequest {
  const req = validRequest("sentence_correction");
  if (smokeToken !== undefined) {
    req.smokeToken = smokeToken;
  }
  return req;
}

// ═══════════════════════════════════════════════════════════════════════
// Existing D1 Tests (updated for async executeProviderCall)
// Without Deno, all env reads fail → gates fail → disabled behavior.
// ═══════════════════════════════════════════════════════════════════════

// ─── Test 1: Valid request returns disabled failure ──────────────────

test("D1-T1: valid request returns provider_disabled", async () => {
  const result = await executeProviderCall(validRequest());
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.code).toBe("provider_disabled");
    expect(result.retryable).toBe(false);
    expect(result.retryAfterMs).toBeNull();
  }
});

// ─── Test 2: Invalid request returns safe invalid_request failure ────

test("D1-T2a: missing sessionId returns invalid_request", async () => {
  const req = validRequest();
  (req as Record<string, unknown>).sessionId = "";
  const result = await executeProviderCall(req);
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.code).toBe("invalid_request");
  }
});

test("D1-T2b: missing providerRequest returns invalid_request", async () => {
  const req = validRequest();
  (req as Record<string, unknown>).providerRequest = null;
  const result = await executeProviderCall(req);
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.code).toBe("invalid_request");
  }
});

test("D1-T2c: missing mode returns invalid_request", async () => {
  const req = validRequest();
  (req as Record<string, unknown>).mode = "";
  const result = await executeProviderCall(req);
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.code).toBe("invalid_request");
  }
});

test("D1-T2d: missing requestId returns invalid_request", async () => {
  const req = validRequest();
  (req as Record<string, unknown>).requestId = "";
  const result = await executeProviderCall(req);
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.code).toBe("invalid_request");
  }
});

// ─── Test 3: executeProviderCall does not throw ──────────────────────

test("D1-T3: executeProviderCall does not throw on null input", async () => {
  let threw = false;
  try {
    await executeProviderCall(null as unknown as ProviderExecutionRequest);
  } catch {
    threw = true;
  }
  expect(threw).toBe(false);
});

test("D1-T3b: executeProviderCall does not throw on undefined input", async () => {
  let threw = false;
  try {
    await executeProviderCall(undefined as unknown as ProviderExecutionRequest);
  } catch {
    threw = true;
  }
  expect(threw).toBe(false);
});

// ─── Test 4: Determinism ────────────────────────────────────────────

test("D1-T4: executeProviderCall is deterministic", async () => {
  const req = validRequest();
  const r1 = await executeProviderCall(req);
  const r2 = await executeProviderCall(req);
  expect(r1).toEqual(r2);
});

// ─── Test 5: isProviderExecutionEnabled remains false ───────────────

test("D1-T5: isProviderExecutionEnabled returns false", () => {
  expect(isProviderExecutionEnabled()).toBe(false);
});

// ─── Test 6: isProviderExecutionDisabled remains true ────────────────

test("D1-T6: isProviderExecutionDisabled returns true", () => {
  expect(isProviderExecutionDisabled()).toBe(true);
});

// ─── Test 7: Redaction/log helper does not expose raw text ───────────

test("D1-T7: redactProviderExecutionLog excludes raw prompt text", () => {
  const logEntry = redactProviderExecutionLog({
    requestId: "req-test",
    event: "provider_call",
    mode: "general_chat",
    statusCode: 503,
    elapsedMs: 0,
    tokenUsage: { prompt: 10, completion: 0, total: 10 },
    errorCode: "provider_disabled",
  });

  expect(typeof logEntry.provider).toBe("string");
  expect(typeof logEntry.model).toBe("string");
  expect(logEntry.requestId).toBe("req-test");
});

test("D1-T7b: log entry contains only safe metadata", () => {
  const logEntry = redactProviderExecutionLog({
    requestId: "req-test",
    event: "provider_call",
    mode: "general_chat",
    statusCode: 200,
    elapsedMs: 500,
    tokenUsage: { prompt: 100, completion: 50, total: 150 },
    errorCode: null,
  });

  expect(logEntry.requestTokens).toBe(100);
  expect(logEntry.responseTokens).toBe(50);
  expect(logEntry.costUsd).toBeGreaterThan(0);
  expect(logEntry.errorClass).toBeNull();
});

// ─── Test 8: Provider capabilities ───────────────────────────────────

test("D1-T8: getProviderCapabilities supportsStreaming is false", () => {
  const caps = getProviderCapabilities();
  expect(caps.supportsStreaming).toBe(false);
  expect(caps.supportsJsonMode).toBe(true);
  expect(caps.maxInputTokens).toBe(32000);
  expect(caps.maxOutputTokens).toBe(4096);
  expect(caps.pricing.inputPer1M).toBe(0.14);
  expect(caps.pricing.outputPer1M).toBe(0.28);
});

// ─── Test 9: Disabled path never returns ok:true ─────────────────────

test("D1-T9: executeProviderCall never returns ok:true for non-sentence_correction modes", async () => {
  for (const mode of ["general_chat", "writing_feedback", "pronunciation_coaching", "lesson_guidance"]) {
    const req = validRequest(mode);
    const result = await executeProviderCall(req);
    expect(result.ok).toBe(false);
  }
});

// ─── Test 10: D0 validators still behave safely ──────────────────────

test("D1-T10a: validateProviderExecutionRequest passes valid request", () => {
  const error = validateProviderExecutionRequest(validRequest());
  expect(error).toBeNull();
});

test("D1-T10b: validateProviderExecutionResult accepts success shape", () => {
  const success: ProviderExecutionSuccess = {
    ok: true,
    response: {
      id: "1",
      model: "deepseek-chat",
      choices: [{ index: 0, message: { role: "assistant", content: "Hi" }, finish_reason: "stop" }],
      usage: { prompt_tokens: 5, completion_tokens: 3, total_tokens: 8 },
    },
    metadata: {
      provider: "deepseek",
      model: "deepseek-chat",
      requestId: "req-1",
      elapsedMs: 100,
      tokenUsage: { prompt: 5, completion: 3, total: 8 },
      costUsd: 0.001,
      errorClass: null,
    },
  };
  expect(validateProviderExecutionResult(success)).toBe(true);
});

test("D1-T10c: validateProviderExecutionResult rejects invalid shape", () => {
  expect(validateProviderExecutionResult(null)).toBe(false);
  expect(validateProviderExecutionResult({})).toBe(false);
  expect(validateProviderExecutionResult({ ok: "maybe" })).toBe(false);
});

test("D1-T10d: buildProviderErrorResponse has required fields", () => {
  const failure = buildProviderDisabledResult("req-err");
  const errorResp = buildProviderErrorResponse(failure);
  expect(errorResp.ok).toBe(false);
  expect(errorResp.errorKind).toBe("provider_disabled");
  expect(typeof errorResp.messageVi).toBe("string");
  expect(errorResp.retryable).toBe(false);
  expect(errorResp.retryAfterMs).toBeNull();
  expect(errorResp.requestId).toBe("req-err");
});

// ─── Test 11: No throw path reaches real execution ───────────────────

test("D1-T11: no throw path reaches real execution (without Deno env)", async () => {
  const paths = [
    validRequest(),
    validRequest("sentence_correction"),
    { ...validRequest(), sessionId: "" },
    null,
    undefined,
  ];

  for (const input of paths) {
    let result: ProviderExecutionResult;
    try {
      result = await executeProviderCall(input as ProviderExecutionRequest);
    } catch {
      continue;
    }
    if (result.ok === true) {
      throw new Error("executeProviderCall returned ok:true — real execution path leaked!");
    }
  }
});

// ═══════════════════════════════════════════════════════════════════════
// M6: moderateProviderOutput Tests
// ═══════════════════════════════════════════════════════════════════════

test("PR-REAL-1-M6a: safe text passes moderation", () => {
  const result = moderateProviderOutput("The corrected sentence is: 'Thank you very much.'");
  expect(result.safe).toBe(true);
});

test("PR-REAL-1-M6b: email in output blocked", () => {
  const result = moderateProviderOutput("Contact user@example.com for help.");
  expect(result.safe).toBe(false);
  expect(result.reason).toContain("email");
});

test("PR-REAL-1-M6c: API key pattern in output blocked", () => {
  const result = moderateProviderOutput("Use key sk-abc123def456 to access.");
  expect(result.safe).toBe(false);
  expect(result.reason).toContain("api_key");
});

test("PR-REAL-1-M6d: jailbreak term in output blocked", () => {
  const result = moderateProviderOutput("Entering DAN mode now.");
  expect(result.safe).toBe(false);
  expect(result.reason).toContain("blocked content");
});

test("PR-REAL-1-M6e: empty output blocked", () => {
  const result = moderateProviderOutput("");
  expect(result.safe).toBe(false);
});

test("PR-REAL-1-M6f: JWT pattern blocked", () => {
  const result = moderateProviderOutput("Token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.");
  expect(result.safe).toBe(false);
  expect(result.reason).toContain("jwt");
});

// ═══════════════════════════════════════════════════════════════════════
// PR-REAL-1 Gate Tests (no env mock — all gates fail → disabled)
// These tests verify that without Deno env, sentence_correction
// requests still return disabled (gates fail cleanly).
// ═══════════════════════════════════════════════════════════════════════

test("PR-REAL-1-G1: sentence_correction without env returns provider_disabled", async () => {
  const result = await executeProviderCall(sentenceCorrectionRequest());
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.code).toBe("provider_disabled");
  }
});

test("PR-REAL-1-G2: non-sentence_correction blocked before env check", async () => {
  const result = await executeProviderCall(validRequest("general_chat"));
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.code).toBe("provider_disabled");
  }
});

test("PR-REAL-1-G3: input over 500 chars rejected", async () => {
  const req = sentenceCorrectionRequest();
  const longContent = "a".repeat(501);
  req.providerRequest = buildProviderRequest({
    systemPrompt: "You are a helpful tutor.",
    messages: [{ role: "user", content: longContent }],
  });
  const result = await executeProviderCall(req);
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.code).toBe("input_too_long");
  }
});

test("PR-REAL-1-G4: input at exactly 500 chars is not rejected for length", async () => {
  const req = sentenceCorrectionRequest();
  const content500 = "a".repeat(500);
  req.providerRequest = buildProviderRequest({
    systemPrompt: "You are a helpful tutor.",
    messages: [{ role: "user", content: content500 }],
  });
  const result = await executeProviderCall(req);
  // Won't pass env gates, but should NOT be input_too_long
  if (!result.ok) {
    expect(result.code).not.toBe("input_too_long");
  }
});

// ═══════════════════════════════════════════════════════════════════════
// PR-REAL-1 Real Execution Tests (mocked Deno + fetch)
// Dynamic import after stubbing Deno global to provide env values.
// These tests verify the happy path and error paths through fetch.
// ═══════════════════════════════════════════════════════════════════════

const SMOKE_TOKEN = "smoke-test-token-123";

describe("PR-REAL-1 Real Execution Path (mocked env)", () => {
  let mod: typeof import("../provider.ts");
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeAll(async () => {
    // Stub Deno global with env values BEFORE dynamic import
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("Deno", {
      env: {
        get: vi.fn((key: string) => {
          if (key === "REAL_PROVIDER_ENABLED") return "true";
          if (key === "TUTOR_SMOKE_TOKEN") return SMOKE_TOKEN;
          if (key === "DEEPSEEK_API_KEY") return "sk-test-key-123";
          return undefined;
        }),
      },
    });

    // Dynamic import to ensure mocks are in place
    mod = await import("../provider.ts");
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    fetchMock.mockReset();
  });

  function makeReq(): ProviderExecutionRequest {
    const pr = mod.buildProviderRequest({
      systemPrompt: "You are a helpful English tutor.",
      messages: [{ role: "user", content: "I goed to the store." }],
    });
    return {
      sessionId: "test-session",
      providerRequest: pr,
      mode: "sentence_correction",
      requestId: "req-real-001",
      smokeToken: SMOKE_TOKEN,
    };
  }

  function mockFetchSuccess(responseBody: unknown) {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(responseBody),
    });
  }

  function mockFetchError(status: number, body: string) {
    fetchMock.mockResolvedValue({
      ok: false,
      status,
      text: async () => body,
    });
  }

  // ── Happy path ─────────────────────────────────────────────────────

  test("PR-REAL-1-E1: valid sentence_correction with all gates returns ok:true", async () => {
    mockFetchSuccess({
      id: "chatcmpl-123",
      model: "deepseek-chat",
      choices: [{
        index: 0,
        message: { role: "assistant", content: '{"corrected":"I went to the store.","explanation":"Past tense of go is went."}' },
        finish_reason: "stop",
      }],
      usage: { prompt_tokens: 20, completion_tokens: 15, total_tokens: 35 },
    });

    const result = await mod.executeProviderCall(makeReq());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.response.choices[0].message.content).toContain("corrected");
      expect(result.metadata.elapsedMs).toBeGreaterThanOrEqual(0);
      expect(result.metadata.tokenUsage?.prompt).toBe(20);
      expect(result.metadata.tokenUsage?.completion).toBe(15);
      expect(result.metadata.costUsd).toBeGreaterThan(0);
    }
  });

  test("PR-REAL-1-E2: fetch called with correct DeepSeek-V3 model", async () => {
    mockFetchSuccess({
      id: "chatcmpl-456",
      model: "deepseek-chat",
      choices: [{ index: 0, message: { role: "assistant", content: "ok" }, finish_reason: "stop" }],
      usage: { prompt_tokens: 5, completion_tokens: 1, total_tokens: 6 },
    });

    await mod.executeProviderCall(makeReq());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const fetchUrl = fetchMock.mock.calls[0][0] as string;
    expect(fetchUrl).toContain("api.deepseek.com");
    expect(fetchUrl).toContain("chat/completions");

    const fetchInit = fetchMock.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(fetchInit.body as string);
    expect(body.model).toBe("deepseek-chat");
    expect(body.max_tokens).toBe(300);
    expect(body.stream).toBe(false); // ProviderRequest has stream:false hardcoded
  });

  test("PR-REAL-1-E3: retry count is 0 (single fetch call)", async () => {
    mockFetchSuccess({
      id: "chatcmpl-789",
      model: "deepseek-chat",
      choices: [{ index: 0, message: { role: "assistant", content: "ok" }, finish_reason: "stop" }],
      usage: { prompt_tokens: 5, completion_tokens: 1, total_tokens: 6 },
    });

    await mod.executeProviderCall(makeReq());
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  // ── Gate: Missing/invalid smoke token ──────────────────────────────

  test("PR-REAL-1-E4: missing smokeToken returns provider_disabled", async () => {
    const req = makeReq();
    req.smokeToken = undefined;
    const result = await mod.executeProviderCall(req);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("provider_disabled");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("PR-REAL-1-E5: invalid smokeToken returns provider_disabled", async () => {
    const req = makeReq();
    req.smokeToken = "wrong-token";
    const result = await mod.executeProviderCall(req);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("provider_disabled");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  // ── Gate: Missing API key ──────────────────────────────────────────

  test("PR-REAL-1-E6: missing DEEPSEEK_API_KEY returns provider_not_configured", async () => {
    // Temporarily stub Deno without DEEPSEEK_API_KEY
    const prevDeno = (globalThis as Record<string, unknown>).Deno;
    vi.stubGlobal("Deno", {
      env: {
        get: vi.fn((key: string) => {
          if (key === "REAL_PROVIDER_ENABLED") return "true";
          if (key === "TUTOR_SMOKE_TOKEN") return SMOKE_TOKEN;
          return undefined; // DEEPSEEK_API_KEY absent
        }),
      },
    });
    const freshMod = await import("../provider.ts");

    const req = {
      sessionId: "test-session",
      providerRequest: freshMod.buildProviderRequest({
        systemPrompt: "You are a helpful English tutor.",
        messages: [{ role: "user", content: "I goed to the store." }],
      }),
      mode: "sentence_correction" as const,
      requestId: "req-real-api-missing",
      smokeToken: SMOKE_TOKEN,
    };
    const result = await freshMod.executeProviderCall(req);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("provider_not_configured");
    }
    expect(fetchMock).not.toHaveBeenCalled();

    // Restore original Deno stub for remaining tests
    vi.stubGlobal("Deno", prevDeno);
  });

  // ── HTTP error handling ────────────────────────────────────────────

  test("PR-REAL-1-E7: provider 500 returns server_error", async () => {
    mockFetchError(500, "Internal Server Error");
    const result = await mod.executeProviderCall(makeReq());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("server_error");
    }
  });

  test("PR-REAL-1-E8: provider 429 returns rate_limited", async () => {
    mockFetchError(429, "Rate limit exceeded");
    const result = await mod.executeProviderCall(makeReq());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("rate_limited");
    }
  });

  // ── Safety moderation of response ──────────────────────────────────

  test("PR-REAL-1-E9: response with PII is blocked by moderation", async () => {
    mockFetchSuccess({
      id: "chatcmpl-pii",
      model: "deepseek-chat",
      choices: [{
        index: 0,
        message: { role: "assistant", content: "Email me at test@example.com for help." },
        finish_reason: "stop",
      }],
      usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 },
    });

    const result = await mod.executeProviderCall(makeReq());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("safety_blocked");
    }
  });

  // ── Invalid JSON response ──────────────────────────────────────────

  test("PR-REAL-1-E10: unparseable JSON returns provider_invalid_response", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "not valid json {{{",
    });

    const result = await mod.executeProviderCall(makeReq());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("provider_invalid_response");
    }
  });

  // ── Non-sentence_correction blocked even with env ──────────────────

  test("PR-REAL-1-E11: general_chat blocked even when gates would pass", async () => {
    const req = makeReq();
    (req as Record<string, unknown>).mode = "general_chat";
    const result = await mod.executeProviderCall(req);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("provider_disabled");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
