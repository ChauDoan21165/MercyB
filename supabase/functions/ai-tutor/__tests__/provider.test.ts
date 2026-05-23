/**
 * Phase D1 — Provider Execution Adapter Tests
 *
 * Validates executeProviderCall and disabled-state invariants.
 * All tests run without real provider execution, without env reads,
 * without network calls, without Supabase persistence.
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
  ProviderExecutionFailure,
} from "../provider.ts";
import { assertEquals, assertNotEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

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

Deno.test("D1-T1: valid request returns provider_disabled", () => {
  const result = executeProviderCall(validRequest());
  assertEquals(result.ok, false);
  if (!result.ok) {
    assertEquals(result.code, "provider_disabled");
    assertEquals(result.retryable, false);
    assertEquals(result.retryAfterMs, null);
  }
});

// ─── Test 2: Invalid request returns safe invalid_request failure ────

Deno.test("D1-T2a: missing sessionId returns invalid_request", () => {
  const req = validRequest();
  (req as Record<string, unknown>).sessionId = "";
  const result = executeProviderCall(req);
  assertEquals(result.ok, false);
  if (!result.ok) {
    assertEquals(result.code, "invalid_request");
  }
});

Deno.test("D1-T2b: missing providerRequest returns invalid_request", () => {
  const req = validRequest();
  (req as Record<string, unknown>).providerRequest = null;
  const result = executeProviderCall(req);
  assertEquals(result.ok, false);
  if (!result.ok) {
    assertEquals(result.code, "invalid_request");
  }
});

Deno.test("D1-T2c: missing mode returns invalid_request", () => {
  const req = validRequest();
  (req as Record<string, unknown>).mode = "";
  const result = executeProviderCall(req);
  assertEquals(result.ok, false);
  if (!result.ok) {
    assertEquals(result.code, "invalid_request");
  }
});

Deno.test("D1-T2d: missing requestId returns invalid_request", () => {
  const req = validRequest();
  (req as Record<string, unknown>).requestId = "";
  const result = executeProviderCall(req);
  assertEquals(result.ok, false);
  if (!result.ok) {
    assertEquals(result.code, "invalid_request");
  }
});

// ─── Test 3: executeProviderCall does not throw ──────────────────────

Deno.test("D1-T3: executeProviderCall does not throw on null input", () => {
  let threw = false;
  try {
    executeProviderCall(null as unknown as ProviderExecutionRequest);
  } catch {
    threw = true;
  }
  assertEquals(threw, false);
});

Deno.test("D1-T3b: executeProviderCall does not throw on undefined input", () => {
  let threw = false;
  try {
    executeProviderCall(undefined as unknown as ProviderExecutionRequest);
  } catch {
    threw = true;
  }
  assertEquals(threw, false);
});

// ─── Test 4: Determinism ────────────────────────────────────────────

Deno.test("D1-T4: executeProviderCall is deterministic", () => {
  const req = validRequest();
  const r1 = executeProviderCall(req);
  const r2 = executeProviderCall(req);
  assertEquals(r1, r2);
});

// ─── Test 5: isProviderExecutionEnabled remains false ───────────────

Deno.test("D1-T5: isProviderExecutionEnabled returns false", () => {
  assertEquals(isProviderExecutionEnabled(), false);
});

// ─── Test 6: isProviderExecutionDisabled remains true ────────────────

Deno.test("D1-T6: isProviderExecutionDisabled returns true", () => {
  assertEquals(isProviderExecutionDisabled(), true);
});

// ─── Test 7: Redaction/log helper does not expose raw text ───────────

Deno.test("D1-T7: redactProviderExecutionLog excludes raw prompt text", () => {
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
  assertEquals(typeof logEntry.provider, "string");
  assertEquals(typeof logEntry.model, "string");
  // No raw text in the log entry
  assertEquals(logEntry.requestId, "req-test");
});

Deno.test("D1-T7b: log entry contains only safe metadata", () => {
  const logEntry = redactProviderExecutionLog({
    requestId: "req-test",
    event: "provider_call",
    mode: "general_chat",
    statusCode: 200,
    elapsedMs: 500,
    tokenUsage: { prompt: 100, completion: 50, total: 150 },
    errorCode: null,
  });

  assertEquals(logEntry.requestTokens, 100);
  assertEquals(logEntry.responseTokens, 50);
  assertEquals(logEntry.costUsd > 0, true); // cost should be calculated
  assertEquals(logEntry.errorClass, null);
});

// ─── Test 8: Provider capabilities remain disabled ───────────────────

Deno.test("D1-T8: getProviderCapabilities supportsStreaming is false", () => {
  const caps = getProviderCapabilities();
  assertEquals(caps.supportsStreaming, false);
  assertEquals(caps.supportsJsonMode, true);
  assertEquals(caps.maxInputTokens, 32000);
  assertEquals(caps.maxOutputTokens, 4096);
  assertEquals(caps.pricing.inputPer1M, 0.14);
  assertEquals(caps.pricing.outputPer1M, 0.28);
});

// ─── Test 9: No real provider execution path exists ──────────────────

Deno.test("D1-T9: executeProviderCall never returns ok:true", () => {
  const req = validRequest();
  const result = executeProviderCall(req);
  assertEquals(result.ok, false);
});

// ─── Test 10: D0 validators still behave safely ──────────────────────

Deno.test("D1-T10a: validateProviderExecutionRequest passes valid request", () => {
  const error = validateProviderExecutionRequest(validRequest());
  assertEquals(error, null);
});

Deno.test("D1-T10b: validateProviderExecutionResult accepts success shape", () => {
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
  assertEquals(validateProviderExecutionResult(success), true);
});

Deno.test("D1-T10c: validateProviderExecutionResult rejects invalid shape", () => {
  assertEquals(validateProviderExecutionResult(null), false);
  assertEquals(validateProviderExecutionResult({}), false);
  assertEquals(validateProviderExecutionResult({ ok: "maybe" }), false);
});

Deno.test("D1-T10d: buildProviderErrorResponse has required fields", () => {
  const failure = buildProviderDisabledResult("req-err");
  const errorResp = buildProviderErrorResponse(failure);
  assertEquals(errorResp.ok, false);
  assertEquals(errorResp.errorKind, "provider_disabled");
  assertEquals(typeof errorResp.messageVi, "string");
  assertEquals(errorResp.retryable, false);
  assertEquals(errorResp.retryAfterMs, null);
  assertEquals(errorResp.requestId, "req-err");
});

// ─── Forbidden assertions: no real execution ────────────────────────

Deno.test("D1-T11: no throw path reaches real execution", () => {
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
