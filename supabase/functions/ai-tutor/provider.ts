/**
 * AI Tutor Provider Adapter — DeepSeek-V3 request/response transforms.
 *
 * Phase C — pure data-transform functions only. No live provider execution.
 * No fetch, no network, no API keys, no Deno.env, no process.env.
 * No serve(), no createClient, no Supabase persistence.
 *
 * Builds and parses provider-agnostic shapes that the caller
 * (a future edge function handler) uses to execute real calls.
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
  | "rate_limited"
  | "server_error"
  | "timeout"
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
      return "timeout";
    case "budget_exceeded":
      return "budget_exceeded";
    case "safety_blocked":
      return "safety_blocked";
    case "empty_response":
      return "empty_response";
    case "network_error":
      return "network";
    case "provider_disabled":
    case "api_key_missing":
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

// ─── Public API ───────────────────────────────────────────────────────

export { PROVIDER_DESCRIPTOR, MODEL, DEEPSEEK_BASE_URL };
