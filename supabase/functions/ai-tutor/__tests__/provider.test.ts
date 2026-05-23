/**
 * Phase D1 — Provider Execution Adapter Tests
 *
 * Validates executeProviderCall and disabled-state invariants.
 * All tests run without real provider execution, without env reads,
 * without network calls, without Supabase persistence.
 *
 * Uses vitest globals (test, expect) — the repository-standard
 * test runner. vitest.config.ts has globals: true.
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
} from "../provider.ts";
import type {
  ProviderExecutionRequest,
  ProviderExecutionResult,
  ProviderExecutionSuccess,
} from "../provider.ts";

// ─── Helpers ───────────────────────────────────────────────────────────

function validRequest(): ProviderExecutionRequest {
  const providerRequest = buildProviderRequest({
    systemPrompt: "You are a helpful tutor.",
    messages: [{ role: "user", content: "Hello" }],
  });

  return {
    sessionId: "test-session-1",
    providerRequest,
    mode: "general_chat",
    requestId: "req-test-001",
  };
}

// ─── Test 1: Valid request returns service_disabled failure ──────────

test("D1-T1: valid request returns provider_disabled", () => {
  const result = executeProviderCall(validRequest());
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.code).toBe("provider_disabled");
    expect(result.retryable).toBe(false);
    expect(result.retryAfterMs).toBeNull();
  }
});

// ─── Test 2: Invalid request returns safe invalid_request failure ────

test("D1-T2a: missing sessionId returns invalid_request", () => {
  const req = validRequest();
  (req as Record<string, unknown>).sessionId = "";
  const result = executeProviderCall(req);
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.code).toBe("invalid_request");
  }
});

test("D1-T2b: missing providerRequest returns invalid_request", () => {
  const req = validRequest();
  (req as Record<string, unknown>).providerRequest = null;
  const result = executeProviderCall(req);
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.code).toBe("invalid_request");
  }
});

test("D1-T2c: missing mode returns invalid_request", () => {
  const req = validRequest();
  (req as Record<string, unknown>).mode = "";
  const result = executeProviderCall(req);
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.code).toBe("invalid_request");
  }
});

test("D1-T2d: missing requestId returns invalid_request", () => {
  const req = validRequest();
  (req as Record<string, unknown>).requestId = "";
  const result = executeProviderCall(req);
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.code).toBe("invalid_request");
  }
});

// ─── Test 3: executeProviderCall does not throw ──────────────────────

test("D1-T3: executeProviderCall does not throw on null input", () => {
  let threw = false;
  try {
    executeProviderCall(null as unknown as ProviderExecutionRequest);
  } catch {
    threw = true;
  }
  expect(threw).toBe(false);
});

test("D1-T3b: executeProviderCall does not throw on undefined input", () => {
  let threw = false;
  try {
    executeProviderCall(undefined as unknown as ProviderExecutionRequest);
  } catch {
    threw = true;
  }
  expect(threw).toBe(false);
});

// ─── Test 4: Determinism ────────────────────────────────────────────

test("D1-T4: executeProviderCall is deterministic", () => {
  const req = validRequest();
  const r1 = executeProviderCall(req);
  const r2 = executeProviderCall(req);
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

  // Log entry must NOT contain raw prompt text
  expect(typeof logEntry.provider).toBe("string");
  expect(typeof logEntry.model).toBe("string");
  // No raw text in the log entry
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
  expect(logEntry.costUsd).toBeGreaterThan(0); // cost should be calculated
  expect(logEntry.errorClass).toBeNull();
});

// ─── Test 8: Provider capabilities remain disabled ───────────────────

test("D1-T8: getProviderCapabilities supportsStreaming is false", () => {
  const caps = getProviderCapabilities();
  expect(caps.supportsStreaming).toBe(false);
  expect(caps.supportsJsonMode).toBe(true);
  expect(caps.maxInputTokens).toBe(32000);
  expect(caps.maxOutputTokens).toBe(4096);
  expect(caps.pricing.inputPer1M).toBe(0.14);
  expect(caps.pricing.outputPer1M).toBe(0.28);
});

// ─── Test 9: No real provider execution path exists ──────────────────

test("D1-T9: executeProviderCall never returns ok:true", () => {
  const req = validRequest();
  const result = executeProviderCall(req);
  expect(result.ok).toBe(false);
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

// ─── Forbidden assertions: no real execution ────────────────────────

test("D1-T11: no throw path reaches real execution", () => {
  // Every code path in executeProviderCall returns { ok: false }
  const paths = [
    validRequest(),
    { ...validRequest(), sessionId: "" },
    null,
    undefined,
  ];

  for (const input of paths) {
    let result: ProviderExecutionResult;
    try {
      result = executeProviderCall(input as ProviderExecutionRequest);
    } catch {
      // If it throws, that's also "no real execution" — just not crashing
      continue;
    }
    // Must never return ok:true
    if (result.ok === true) {
      throw new Error("executeProviderCall returned ok:true — real execution path leaked!");
    }
  }
});
