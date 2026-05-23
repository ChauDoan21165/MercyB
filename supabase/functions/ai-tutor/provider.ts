/**
 * AI Tutor Provider Adapter — DeepSeek-V3 request/response transforms.
 *
 * Phase C — data-transform functions for request/response shapes.
 * Phase D1 — disabled execution adapter (always returns provider_disabled).
 * Phase PR-REAL-1 — gated real provider execution for sentence_correction
 *   mode only, via fetch() to DeepSeek-V3, protected by three-layer gate
 *   (REAL_PROVIDER_ENABLED, TUTOR_SMOKE_TOKEN, DEEPSEEK_API_KEY).
 *
 * No SDK imports. No streaming. No persistence. No retries.
 * No learner data. No production traffic.
 */

// ─── Static Provider Metadata ────────────────────────────────────────

/** DeepSeek-V3 API endpoint (static — no env read). */
const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

/** Model identifier for Phase 1. */
const MODEL = "deepseek-chat";

/** Provider descriptor — matches TUTOR_PHASE1_PROVIDER from types.ts. */
const PROVIDER_DESCRIPTOR = {
  provider: "deepseek" as const,
  model: MODEL,
  inputPricePer1M: 0.14,
  outputPricePer1M: 0.28,
  latencyMsP50: 1500,
  vietnameseQuality: "excellent" as const,
};

// ─── Types ────────────────────────────────────────────────────────────

export type ProviderRequest = {
  model: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  max_tokens: number;
  temperature: number;
  stream: false;
};

export type ProviderResponse = {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: "assistant";
      content: string;
    };
    finish_reason: "stop" | "length" | "content_filter" | null;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type ProviderErrorClass =
  | "rate_limit"
  | "server_error"
  | "budget_exceeded"
  | "safety_blocked"
  | "timeout"
  | "network"
  | "empty_response"
  | "unknown";

export type RetryDecision = {
  shouldRetry: boolean;
  delayMs: number;
  maxRetries: number;
  reason: string;
};

export type RedactedLogEntry = {
  provider: string;
  model: string;
  requestTokens: number;
  responseTokens: number;
  costUsd: number;
  errorClass: ProviderErrorClass | null;
  requestId: string;
};

// ─── Redaction Patterns (mirrors TUTOR_LOG_REDACTION_RULES) ───────────

const REDACTION_RULES: Array<{ pattern: RegExp; replacement: string; label: string }> = [
  { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: "[EMAIL]", label: "email" },
  { pattern: /(?:\+84|0)[0-9]{9,10}/g, replacement: "[PHONE]", label: "phone_vn" },
  { pattern: /\b[0-9]{3}[-. ][0-9]{3}[-. ][0-9]{4}\b/g, replacement: "[PHONE]", label: "phone_intl" },
  { pattern: /eyJ[a-zA-Z0-9_-]{8,}/g, replacement: "[JWT]", label: "jwt" },
  { pattern: /sk-[a-zA-Z0-9_-]{8,}/g, replacement: "[API_KEY]", label: "api_key" },
  { pattern: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, replacement: "[IP]", label: "ip" },
];

// ─── 1. buildProviderRequest ──────────────────────────────────────────

/**
 * Build a DeepSeek-V3 compatible request body from structured inputs.
 *
 * Hardcodes stream: false. Uses static model identifier.
 * max_tokens and temperature are configurable but default to
 * provider-safe values.
 */
export function buildProviderRequest(params: {
  systemPrompt: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  maxTokens?: number;
  temperature?: number;
}): ProviderRequest {
  return {
    model: MODEL,
    messages: [
      { role: "system", content: params.systemPrompt },
      ...params.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ],
    max_tokens: params.maxTokens ?? 800,
    temperature: params.temperature ?? 0.7,
    stream: false,
  };
}

// ─── 2. parseProviderResponse ─────────────────────────────────────────

/**
 * Parse a DeepSeek-V3 style response into a structured ProviderResponse.
 * Handles malformed/missing data without crashing.
 */
export function parseProviderResponse(raw: unknown): ProviderResponse | null {
  if (!raw || typeof raw !== "object") return null;

  const r = raw as Record<string, unknown>;

  const id = typeof r.id === "string" ? r.id : "unknown";
  const model = typeof r.model === "string" ? r.model : MODEL;

  // Choices
  const choicesRaw = Array.isArray(r.choices) ? r.choices : [];
  const choices = choicesRaw.map((c: unknown, idx: number) => {
    const choice = (c ?? {}) as Record<string, unknown>;
    const message = (choice.message ?? {}) as Record<string, unknown>;
    return {
      index: typeof choice.index === "number" ? choice.index : idx,
      message: {
        role: "assistant" as const,
        content: typeof message.content === "string" ? message.content : "",
      },
      finish_reason: normalizeFinishReason(choice.finish_reason),
    };
  });

  // Usage
  const usageRaw = (r.usage ?? {}) as Record<string, unknown>;
  const usage = {
    prompt_tokens: typeof usageRaw.prompt_tokens === "number" ? usageRaw.prompt_tokens : 0,
    completion_tokens: typeof usageRaw.completion_tokens === "number" ? usageRaw.completion_tokens : 0,
    total_tokens: typeof usageRaw.total_tokens === "number" ? usageRaw.total_tokens : 0,
  };

  return { id, model, choices, usage };
}

function normalizeFinishReason(
  value: unknown,
): "stop" | "length" | "content_filter" | null {
  if (typeof value === "string") {
    if (value === "stop" || value === "length" || value === "content_filter") {
      return value;
    }
  }
  return null;
}

// ─── 3. classifyProviderError ─────────────────────────────────────────

/**
 * Classify a raw provider error into a ProviderErrorClass.
 * Maps HTTP status codes and error shapes to canonical error classes.
 */
export function classifyProviderError(error: unknown): ProviderErrorClass {
  if (!error || typeof error !== "object") return "unknown";

  const e = error as Record<string, unknown>;
  const status = typeof e.status === "number" ? e.status : 0;
  const code = typeof e.code === "string" ? e.code : "";
  const message = typeof e.message === "string" ? e.message : "";

  // Rate limit
  if (status === 429 || code === "rate_limit_exceeded") return "rate_limit";

  // Budget exceeded
  if (status === 402 || code === "insufficient_quota" || message.includes("quota")) {
    return "budget_exceeded";
  }

  // Safety block
  if (code === "content_filter" || message.includes("content filter") || message.includes("safety")) {
    return "safety_blocked";
  }

  // Server error
  if (status >= 500) return "server_error";

  // Empty response
  if (code === "empty_response" || message.includes("empty")) return "empty_response";

  // Timeout
  if (code === "timeout" || message.includes("timeout") || message.includes("timed out")) {
    return "timeout";
  }

  // Network
  if (code === "network_error" || message.includes("network") || message.includes("ECONNREFUSED")) {
    return "network";
  }

  return "unknown";
}

// ─── 4. buildRetryDecision ────────────────────────────────────────────

/**
 * Build an inert retry decision descriptor.
 * Does NOT execute retry — returns metadata for the caller to use.
 */
export function buildRetryDecision(
  errorClass: ProviderErrorClass,
  retryCount: number,
): RetryDecision {
  const MAX_RETRIES = 2;
  const BASE_DELAY_MS = 1000;

  switch (errorClass) {
    case "server_error":
      return {
        shouldRetry: retryCount < MAX_RETRIES,
        delayMs: BASE_DELAY_MS * Math.pow(2, retryCount),
        maxRetries: MAX_RETRIES,
        reason: `Server error — retry ${retryCount + 1}/${MAX_RETRIES}`,
      };

    case "timeout":
      return {
        shouldRetry: retryCount < 1,
        delayMs: BASE_DELAY_MS * 2,
        maxRetries: 1,
        reason: "Request timed out — one retry allowed",
      };

    case "rate_limit":
      return {
        shouldRetry: retryCount < 1,
        delayMs: 5000,
        maxRetries: 1,
        reason: "Rate limited — retry after fixed delay",
      };

    case "network":
      return {
        shouldRetry: retryCount < MAX_RETRIES,
        delayMs: BASE_DELAY_MS * Math.pow(2, retryCount),
        maxRetries: MAX_RETRIES,
        reason: "Network error — retrying",
      };

    case "budget_exceeded":
    case "safety_blocked":
    case "empty_response":
    default:
      return {
        shouldRetry: false,
        delayMs: 0,
        maxRetries: 0,
        reason: errorClass === "budget_exceeded"
          ? "Budget exceeded — no retry"
          : errorClass === "safety_blocked"
            ? "Content blocked by safety filter"
            : errorClass === "empty_response"
              ? "Provider returned empty response"
              : "Unknown error — no retry",
      };
  }
}

// ─── 5. estimateProviderCost ──────────────────────────────────────────

/**
 * Estimate cost for a provider call using static pricing.
 * Uses TUTOR_PHASE1_PROVIDER pricing from the provider descriptor.
 */
export function estimateProviderCost(
  inputTokens: number,
  outputTokens: number,
): number {
  const { inputPricePer1M, outputPricePer1M } = PROVIDER_DESCRIPTOR;
  const inputCost = (inputTokens / 1_000_000) * inputPricePer1M;
  const outputCost = (outputTokens / 1_000_000) * outputPricePer1M;
  return inputCost + outputCost;
}

// ─── 6. redactProviderLog ─────────────────────────────────────────────

/**
 * Redact sensitive data from provider log text.
 * Applies canonical redaction rules (email, phone, JWT, API key, IP).
 * Returns a RedactedLogEntry with safe metadata only.
 */
export function redactProviderLog(params: {
  requestId: string;
  rawText: string;
  inputTokens: number;
  outputTokens: number;
  errorClass: ProviderErrorClass | null;
}): RedactedLogEntry {
  let redacted = params.rawText;
  for (const rule of REDACTION_RULES) {
    redacted = redacted.replace(rule.pattern, rule.replacement);
  }

  const costUsd = estimateProviderCost(params.inputTokens, params.outputTokens);

  return {
    provider: PROVIDER_DESCRIPTOR.provider,
    model: PROVIDER_DESCRIPTOR.model,
    requestTokens: params.inputTokens,
    responseTokens: params.outputTokens,
    costUsd,
    errorClass: params.errorClass,
    requestId: params.requestId,
  };
  // Note: redacted text is not stored — only safe metadata is returned.
  // The caller may choose to log the redacted text for debugging.
  void redacted;
}

// ═══════════════════════════════════════════════════════════════════════
// Phase D0 — Provider Execution Interface (additive only)
// Pure types + pure functions. No I/O. No real execution.
// All 14 existing exports preserved unchanged.
// ═══════════════════════════════════════════════════════════════════════

// ─── D0 Types ─────────────────────────────────────────────────────────

/** The request shape passed to the provider executor. */
export type ProviderExecutionRequest = {
  /** Session identifier for traceability. */
  sessionId: string;
  /** The assembled provider request body. */
  providerRequest: ProviderRequest;
  /** Conversation mode (for logging). */
  mode: string;
  /** Unique request ID for correlation. */
  requestId: string;
  /** PR-REAL-1: Operator smoke token for gated real execution. */
  smokeToken?: string;
};

/**
 * Discriminated union: success | failure.
 * Callers narrow on the `ok` discriminant.
 */
export type ProviderExecutionResult =
  | ProviderExecutionSuccess
  | ProviderExecutionFailure;

/** Successful provider execution result. */
export type ProviderExecutionSuccess = {
  ok: true;
  /** The parsed provider response. */
  response: ProviderResponse;
  /** Execution metadata (timing, tokens, cost). */
  metadata: ProviderExecutionMetadata;
};

/** Failed provider execution result. */
export type ProviderExecutionFailure = {
  ok: false;
  /** Machine-readable error code. */
  code: ProviderExecutionErrorCode;
  /** Human-readable error message (Vietnamese). */
  messageVi: string;
  /** Whether the caller should retry. */
  retryable: boolean;
  /** Suggested retry delay in ms, if retryable. */
  retryAfterMs: number | null;
  /** Execution metadata (partial — valid fields populated). */
  metadata: Partial<ProviderExecutionMetadata>;
};

/** Canonical provider execution error codes. */
export type ProviderExecutionErrorCode =
  | "provider_disabled"
  | "invalid_request"
  | "api_key_missing"
  | "provider_not_configured"
  | "mode_blocked"
  | "input_too_long"
  | "rate_limited"
  | "server_error"
  | "timeout"
  | "provider_timeout"
  | "provider_unavailable"
  | "provider_invalid_response"
  | "budget_exceeded"
  | "safety_blocked"
  | "empty_response"
  | "parse_failed"
  | "network_error"
  | "unknown";

/** Execution metadata — safe for logging. No raw prompt/response text. */
export type ProviderExecutionMetadata = {
  /** Provider identifier. */
  provider: string;
  /** Model identifier. */
  model: string;
  /** Request ID for correlation. */
  requestId: string;
  /** Total elapsed ms for the provider call. */
  elapsedMs: number;
  /** Token usage from the provider response. */
  tokenUsage: ProviderTokenUsage;
  /** Estimated cost in USD. */
  costUsd: number;
  /** Error class, if the call failed. */
  errorClass: ProviderErrorClass | null;
};

/** Token usage from provider response. */
export type ProviderTokenUsage = {
  prompt: number;
  completion: number;
  total: number;
};

/** Represents the disabled state of the provider. */
export type ProviderDisabledState = {
  enabled: false;
  reason: ProviderDisabledReason;
  since: string; // ISO timestamp
  messageVi: string;
};

/** Reasons the provider may be disabled. */
export type ProviderDisabledReason =
  | "feature_flag_off"
  | "api_key_not_configured"
  | "operator_disabled"
  | "maintenance";

/** Static descriptor of provider capabilities. */
export type ProviderCapabilityDescriptor = {
  provider: string;
  model: string;
  supportsStreaming: false;
  supportsJsonMode: boolean;
  maxInputTokens: number;
  maxOutputTokens: number;
  pricing: {
    inputPer1M: number;
    outputPer1M: number;
  };
};

/** Input payload for the execution log redaction function. */
export type ProviderRedactedLogPayload = {
  requestId: string;
  event: string;
  mode: string;
  statusCode: number;
  elapsedMs: number;
  tokenUsage: ProviderTokenUsage;
  errorCode: ProviderExecutionErrorCode | null;
};

// ─── D0 Functions ─────────────────────────────────────────────────────

/**
 * Validate a provider execution request shape.
 * Returns null if valid, or an error code string if invalid.
 */
export function validateProviderExecutionRequest(
  req: unknown,
): ProviderExecutionErrorCode | null {
  if (!req || typeof req !== "object") return "invalid_request";

  const r = req as Record<string, unknown>;

  if (typeof r.sessionId !== "string" || !r.sessionId.trim()) {
    return "invalid_request";
  }
  if (!r.providerRequest || typeof r.providerRequest !== "object") {
    return "invalid_request";
  }
  if (typeof r.mode !== "string" || !r.mode.trim()) {
    return "invalid_request";
  }
  if (typeof r.requestId !== "string" || !r.requestId.trim()) {
    return "invalid_request";
  }

  return null; // valid
}

/**
 * Validate a provider execution result shape.
 * Returns true if the result has the expected discriminated union shape.
 */
export function validateProviderExecutionResult(
  result: unknown,
): result is ProviderExecutionResult {
  if (!result || typeof result !== "object") return false;

  const r = result as Record<string, unknown>;

  if (r.ok === true) {
    return (
      typeof r.response === "object" &&
      r.response !== null &&
      typeof r.metadata === "object" &&
      r.metadata !== null
    );
  }

  if (r.ok === false) {
    return (
      typeof r.code === "string" &&
      typeof r.messageVi === "string" &&
      typeof r.retryable === "boolean"
    );
  }

  return false;
}

/**
 * Map a ProviderExecutionErrorCode to a ProviderErrorClass.
 * Bridges D0 error codes to the existing Phase C classification.
 */
export function mapProviderError(
  code: ProviderExecutionErrorCode,
): ProviderErrorClass {
  switch (code) {
    case "rate_limited":
      return "rate_limit";
    case "server_error":
      return "server_error";
    case "timeout":
    case "provider_timeout":
      return "timeout";
    case "budget_exceeded":
      return "budget_exceeded";
    case "safety_blocked":
      return "safety_blocked";
    case "empty_response":
      return "empty_response";
    case "network_error":
    case "provider_unavailable":
      return "network";
    case "provider_disabled":
    case "api_key_missing":
    case "provider_not_configured":
    case "mode_blocked":
    case "input_too_long":
    case "provider_invalid_response":
    case "invalid_request":
    case "parse_failed":
    case "unknown":
    default:
      return "unknown";
  }
}

/**
 * Build a disabled-result response when provider execution is not enabled.
 * Returns a ProviderExecutionFailure with code "provider_disabled".
 */
export function buildProviderDisabledResult(
  requestId: string,
): ProviderExecutionFailure {
  return {
    ok: false,
    code: "provider_disabled",
    messageVi: "Tính năng AI Tutor hiện chưa khả dụng. Vui lòng thử lại sau.",
    retryable: false,
    retryAfterMs: null,
    metadata: {
      provider: PROVIDER_DESCRIPTOR.provider,
      model: PROVIDER_DESCRIPTOR.model,
      requestId,
      elapsedMs: 0,
      errorClass: "unknown",
    },
  };
}

/**
 * Redact a provider execution log entry.
 * Returns safe metadata only — no raw prompt or response text.
 */
export function redactProviderExecutionLog(
  payload: ProviderRedactedLogPayload,
): RedactedLogEntry {
  return redactProviderLog({
    requestId: payload.requestId,
    rawText: `event=${payload.event} mode=${payload.mode} status=${payload.statusCode}`,
    inputTokens: payload.tokenUsage.prompt,
    outputTokens: payload.tokenUsage.completion,
    errorClass: payload.errorCode
      ? mapProviderError(payload.errorCode)
      : null,
  });
}

/**
 * Check if provider execution is enabled.
 * ALWAYS returns false — no real provider execution in Phase D0.
 */
export function isProviderExecutionEnabled(): boolean {
  return false;
}

/**
 * Check if provider execution is disabled.
 * Inverse of isProviderExecutionEnabled — ALWAYS returns true.
 */
export function isProviderExecutionDisabled(): boolean {
  return true;
}

/**
 * Return a static descriptor of the provider's capabilities.
 * Pure function — no I/O, no env reads.
 */
export function getProviderCapabilities(): ProviderCapabilityDescriptor {
  return {
    provider: PROVIDER_DESCRIPTOR.provider,
    model: PROVIDER_DESCRIPTOR.model,
    supportsStreaming: false,
    supportsJsonMode: true,
    maxInputTokens: 32000,
    maxOutputTokens: 4096,
    pricing: {
      inputPer1M: PROVIDER_DESCRIPTOR.inputPricePer1M,
      outputPer1M: PROVIDER_DESCRIPTOR.outputPricePer1M,
    },
  };
}

/**
 * Build a stand-alone error response from a ProviderExecutionFailure.
 * Returns a provider-agnostic error shape for the edge function to return.
 */
export function buildProviderErrorResponse(
  failure: ProviderExecutionFailure,
): {
  ok: false;
  errorKind: string;
  messageVi: string;
  retryable: boolean;
  retryAfterMs: number | null;
  requestId: string;
} {
  return {
    ok: false,
    errorKind: failure.code,
    messageVi: failure.messageVi,
    retryable: failure.retryable,
    retryAfterMs: failure.retryAfterMs,
    requestId: failure.metadata.requestId ?? "unknown",
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Phase D1 — Disabled Execution Adapter
// Phase PR-REAL-1 — Gated real provider execution (sentence_correction only)
// executeProviderCall is the SINGLE entry point for provider execution.
// ═══════════════════════════════════════════════════════════════════════

// ─── PR-REAL-1 Helpers ────────────────────────────────────────────────

/** Maximum input characters for PR-REAL-1 smoke execution. */
const MAX_INPUT_CHARS = 500;

/** Provider call timeout in ms. */
const PROVIDER_TIMEOUT_MS = 15_000;

/** Maximum output tokens for PR-REAL-1. */
const MAX_OUTPUT_TOKENS = 300;

/** Read a Deno environment variable. Returns undefined outside Deno. */
function readEnvVar(key: string): string | undefined {
  if (typeof Deno !== "undefined" && typeof (Deno as unknown as Record<string, unknown>).env === "object") {
    const env = (Deno as unknown as { env: { get(k: string): string | undefined } }).env;
    if (typeof env.get === "function") {
      return env.get(key);
    }
  }
  return undefined;
}

/**
 * Extract the last user message content from a provider request.
 * Returns empty string if no user message found.
 */
function getLastUserMessage(pr: ProviderRequest): string {
  for (let i = pr.messages.length - 1; i >= 0; i--) {
    if (pr.messages[i].role === "user") {
      return pr.messages[i].content;
    }
  }
  return "";
}

// ─── M6: moderateProviderOutput ───────────────────────────────────────

/**
 * Safety-check raw provider output before parsing/returning.
 * Returns { safe: true } if output passes moderation, or
 * { safe: false, reason } if blocked.
 *
 * Checks for: PII patterns (email, phone, API key, IP, JWT),
 * harmful content indicators. Never returns raw text to caller.
 */
export function moderateProviderOutput(text: string): { safe: boolean; reason?: string } {
  if (!text || typeof text !== "string") {
    return { safe: false, reason: "empty output" };
  }

  // PII redaction patterns (mirrors REDACTION_RULES)
  const piiPatterns: Array<{ pattern: RegExp; label: string }> = [
    { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, label: "email" },
    { pattern: /(?:\+84|0)[0-9]{9,10}/g, label: "phone_vn" },
    { pattern: /\b[0-9]{3}[-. ][0-9]{3}[-. ][0-9]{4}\b/g, label: "phone_intl" },
    { pattern: /sk-[a-zA-Z0-9_-]{8,}/g, label: "api_key" },
    { pattern: /eyJ[a-zA-Z0-9_-]{8,}/g, label: "jwt" },
    { pattern: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, label: "ip" },
  ];

  for (const { pattern, label } of piiPatterns) {
    if (pattern.test(text)) {
      return { safe: false, reason: `output contains ${label}` };
    }
  }

  // Harmful content indicators (basic smoke-level check)
  const blockedTerms = [
    "DAN mode", "ignore previous", "bypass safety",
    "jailbreak", "developer mode", "system override",
  ];
  const lower = text.toLowerCase();
  for (const term of blockedTerms) {
    if (lower.includes(term.toLowerCase())) {
      return { safe: false, reason: "output contains blocked content" };
    }
  }

  return { safe: true };
}

// ─── PR-REAL-1: executeProviderCall ───────────────────────────────────

/**
 * Execute a provider call.
 *
 * This is the SINGLE entry point for all provider execution.
 *
 * Gate order (server-side, layers 2-3):
 *   1. Validate request shape (D1)
 *   2. Block non-sentence_correction modes (M1)
 *   3. Reject input over MAX_INPUT_CHARS (M1)
 *   4. Check REAL_PROVIDER_ENABLED === "true" (M7)
 *   5. Validate TUTOR_SMOKE_TOKEN against request.smokeToken (M5)
 *   6. Require DEEPSEEK_API_KEY
 *   7. Execute fetch() to DeepSeek-V3 (no retries — M4)
 *   8. Moderate output (M6)
 *   9. Parse and return
 *
 * Any gate failure returns a safe disabled/config error.
 * No ok:true is returned unless ALL gates pass and provider succeeds.
 */
export async function executeProviderCall(
  request: ProviderExecutionRequest,
): Promise<ProviderExecutionResult> {
  const startTime = Date.now();

  // ── Gate 1: Validate request shape (D1) ──────────────────────────
  const validationError = validateProviderExecutionRequest(request);
  if (validationError) {
    return {
      ok: false,
      code: validationError,
      messageVi: "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại.",
      retryable: false,
      retryAfterMs: null,
      metadata: {
        requestId: request?.requestId ?? "unknown",
        errorClass: mapProviderError(validationError),
      },
    };
  }

  // ── Gate 2: Block non-sentence_correction modes (M1) ─────────────
  if (request.mode !== "sentence_correction") {
    return buildProviderDisabledResult(request.requestId);
  }

  // ── Gate 3: Reject input over MAX_INPUT_CHARS (M1) ───────────────
  const userContent = getLastUserMessage(request.providerRequest);
  if (userContent.length > MAX_INPUT_CHARS) {
    return {
      ok: false,
      code: "input_too_long",
      messageVi: "Văn bản đầu vào vượt quá giới hạn cho phép.",
      retryable: false,
      retryAfterMs: null,
      metadata: {
        requestId: request.requestId,
        errorClass: "unknown",
      },
    };
  }

  // ── Gate 4: REAL_PROVIDER_ENABLED (M7) ───────────────────────────
  const realEnabled = readEnvVar("REAL_PROVIDER_ENABLED");
  if (realEnabled !== "true") {
    return buildProviderDisabledResult(request.requestId);
  }

  // ── Gate 5: TUTOR_SMOKE_TOKEN (M5) ───────────────────────────────
  const expectedSmokeToken = readEnvVar("TUTOR_SMOKE_TOKEN");
  if (!expectedSmokeToken) {
    return buildProviderDisabledResult(request.requestId);
  }
  if (!request.smokeToken || request.smokeToken !== expectedSmokeToken) {
    return buildProviderDisabledResult(request.requestId);
  }

  // ── Gate 6: DEEPSEEK_API_KEY ─────────────────────────────────────
  const apiKey = readEnvVar("DEEPSEEK_API_KEY");
  if (!apiKey) {
    return {
      ok: false,
      code: "provider_not_configured",
      messageVi: "Cấu hình AI Tutor chưa hoàn tất. Vui lòng thử lại sau.",
      retryable: false,
      retryAfterMs: null,
      metadata: {
        provider: PROVIDER_DESCRIPTOR.provider,
        model: PROVIDER_DESCRIPTOR.model,
        requestId: request.requestId,
        elapsedMs: Date.now() - startTime,
        errorClass: "unknown",
      },
    };
  }

  // ── Gate 7: Execute real provider call (M4: zero retries) ────────
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ...request.providerRequest,
        max_tokens: MAX_OUTPUT_TOKENS,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const isTimeout = (err as Error)?.name === "AbortError" ||
      (err as Error)?.name === "TimeoutError";
    if (isTimeout) {
      return {
        ok: false,
        code: "provider_timeout",
        messageVi: "Yêu cầu đã hết thời gian chờ. Vui lòng thử lại sau.",
        retryable: false,
        retryAfterMs: null,
        metadata: {
          provider: PROVIDER_DESCRIPTOR.provider,
          model: PROVIDER_DESCRIPTOR.model,
          requestId: request.requestId,
          elapsedMs: Date.now() - startTime,
          errorClass: "timeout",
        },
      };
    }
    return {
      ok: false,
      code: "provider_unavailable",
      messageVi: "Không thể kết nối đến máy chủ AI. Vui lòng thử lại sau.",
      retryable: false,
      retryAfterMs: null,
      metadata: {
        provider: PROVIDER_DESCRIPTOR.provider,
        model: PROVIDER_DESCRIPTOR.model,
        requestId: request.requestId,
        elapsedMs: Date.now() - startTime,
        errorClass: "network",
      },
    };
  }
  clearTimeout(timeoutId);

  const elapsedMs = Date.now() - startTime;

  // ── Gate 8: Moderate raw provider response (M6) ──────────────────
  let rawText: string;
  try {
    rawText = await response.text();
  } catch {
    return {
      ok: false,
      code: "provider_invalid_response",
      messageVi: "Phản hồi từ máy chủ AI không hợp lệ.",
      retryable: false,
      retryAfterMs: null,
      metadata: {
        provider: PROVIDER_DESCRIPTOR.provider,
        model: PROVIDER_DESCRIPTOR.model,
        requestId: request.requestId,
        elapsedMs,
        errorClass: "empty_response",
      },
    };
  }

  // Check HTTP status
  if (!response.ok) {
    const errorClass = classifyProviderError({ status: response.status, message: rawText });
    return {
      ok: false,
      code: errorClass === "rate_limit" ? "rate_limited"
        : errorClass === "server_error" ? "server_error"
        : errorClass === "safety_blocked" ? "safety_blocked"
        : errorClass === "budget_exceeded" ? "budget_exceeded"
        : "provider_unavailable",
      messageVi: "Máy chủ AI tạm thời không khả dụng. Vui lòng thử lại sau.",
      retryable: false,
      retryAfterMs: null,
      metadata: {
        provider: PROVIDER_DESCRIPTOR.provider,
        model: PROVIDER_DESCRIPTOR.model,
        requestId: request.requestId,
        elapsedMs,
        errorClass,
      },
    };
  }

  // M6: Moderate raw output before parsing
  const moderation = moderateProviderOutput(rawText);
  if (!moderation.safe) {
    return {
      ok: false,
      code: "safety_blocked",
      messageVi: "Phản hồi từ AI không đạt yêu cầu an toàn.",
      retryable: false,
      retryAfterMs: null,
      metadata: {
        provider: PROVIDER_DESCRIPTOR.provider,
        model: PROVIDER_DESCRIPTOR.model,
        requestId: request.requestId,
        elapsedMs,
        errorClass: "safety_blocked",
      },
    };
  }

  // ── Gate 9: Parse and validate response ──────────────────────────
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawText);
  } catch {
    return {
      ok: false,
      code: "provider_invalid_response",
      messageVi: "Phản hồi từ AI không đúng định dạng.",
      retryable: false,
      retryAfterMs: null,
      metadata: {
        provider: PROVIDER_DESCRIPTOR.provider,
        model: PROVIDER_DESCRIPTOR.model,
        requestId: request.requestId,
        elapsedMs,
        errorClass: "unknown",
      },
    };
  }

  const parsed = parseProviderResponse(parsedJson);
  if (!parsed) {
    return {
      ok: false,
      code: "provider_invalid_response",
      messageVi: "Phản hồi từ AI không hợp lệ.",
      retryable: false,
      retryAfterMs: null,
      metadata: {
        provider: PROVIDER_DESCRIPTOR.provider,
        model: PROVIDER_DESCRIPTOR.model,
        requestId: request.requestId,
        elapsedMs,
        errorClass: "empty_response",
      },
    };
  }

  // M6 (re-check): Also moderate parsed content
  const assistantContent = parsed.choices[0]?.message?.content ?? "";
  const contentModeration = moderateProviderOutput(assistantContent);
  if (!contentModeration.safe) {
    return {
      ok: false,
      code: "safety_blocked",
      messageVi: "Phản hồi từ AI không đạt yêu cầu an toàn.",
      retryable: false,
      retryAfterMs: null,
      metadata: {
        provider: PROVIDER_DESCRIPTOR.provider,
        model: PROVIDER_DESCRIPTOR.model,
        requestId: request.requestId,
        elapsedMs,
        errorClass: "safety_blocked",
      },
    };
  }

  // ── Success — all gates passed ───────────────────────────────────
  return {
    ok: true,
    response: parsed,
    metadata: {
      provider: PROVIDER_DESCRIPTOR.provider,
      model: PROVIDER_DESCRIPTOR.model,
      requestId: request.requestId,
      elapsedMs,
      tokenUsage: {
        prompt: parsed.usage.prompt_tokens,
        completion: parsed.usage.completion_tokens,
        total: parsed.usage.total_tokens,
      },
      costUsd: estimateProviderCost(
        parsed.usage.prompt_tokens,
        parsed.usage.completion_tokens,
      ),
      errorClass: null,
    },
  };
}

// ─── Public API ───────────────────────────────────────────────────────

export { PROVIDER_DESCRIPTOR, MODEL, DEEPSEEK_BASE_URL };
