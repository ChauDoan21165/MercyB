/**
 * PB5 AI Tutor Service — pure orchestration layer for AI Tutor.
 *
 * Phase B — pure functions only. No I/O, no real provider calls, no network.
 * All functions are deterministic. Orchestrates PB1–PB4 modules without
 * executing side effects — returns effect descriptors for the caller.
 *
 * AI_TUTOR_ENABLED=false — this module is tree-shaken in production.
 */

import type {
  TutorSession,
  TutorEvent,
  TutorResponse,
  TutorConversationMode,
  TutorTier,
  TutorEntryPoint,
  TutorGoal,
} from "./types";
// AI_TUTOR_ENABLED imported from types but checked by caller, not here.

import {
  dispatchTutorEvent,
  buildMercyMessage,
  detectConversationMode,
  deriveGoal,
} from "./sessionRuntime";
import type { TutorEffect } from "./sessionRuntime";

import {
  assemblePrompt,
  parseResponse,
} from "./promptAssembly";
import type { ParseResult } from "./promptAssembly";

import {
  sanitizeInput,
  moderateOutput,
  getRefusalResponse,
  isKidsModeAllowed,
  getCrisisResource,
} from "./safety";
import type { SafetyContext } from "./safety";

import {
  createMockProvider,
  simulateProviderCall,
} from "./mockProvider";
import type { MockProvider } from "./mockProvider";

import {
  checkCostLimit,
  checkRateLimit,
  checkTokenBudget,
  estimateTokens,
  createCostLogEntry,
} from "./costLimits";
import {
  applyEmotionalStateToTutorResponse,
} from "./emotionalResponse";

// ─── Local Types ──────────────────────────────────────────────────────

export type TutorTurnRequest = {
  session: TutorSession;
  userMessage: string;
  entryPoint: TutorEntryPoint | null;
  tier: TutorTier;
  isKidsMode: boolean;
  /** Injected timestamp for determinism — no Date.now() */
  nowMs: number;
  /** Mock provider for deterministic simulation */
  mockProvider: MockProvider;
  /** Request ID for traceability */
  requestId: string;
  /** Running counters for rate/cost checks */
  requestsThisMinute: number;
  requestsToday: number;
  runningDailyCostUsd: number;
};

export type TutorTurnResult = {
  session: TutorSession;
  effects: TutorEffect[];
  response: TutorResponse | null;
  metrics: TurnMetrics;
};

export type TutorTurnErrorKind =
  | "disabled_or_unavailable"
  | "invalid_input"
  | "safety_blocked"
  | "rate_limited"
  | "cost_limited"
  | "token_budget_exceeded"
  | "provider_failed"
  | "parse_failed"
  | "output_moderation_blocked"
  | "unknown_error";

export type TurnMetrics = {
  turnMs: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  safetyCheckPassed: boolean;
  budgetCheckPassed: boolean;
  providerCallSucceeded: boolean;
  parseSucceeded: boolean;
  moderationPassed: boolean;
};

// ─── Happy-Path Orchestration ─────────────────────────────────────────

/**
 * Execute a full tutor turn — input to response.
 *
 * Orchestration order:
 * 1. Feature flag check
 * 2. Input validation
 * 3. Safety precheck (PB3 sanitizeInput)
 * 4. Rate/cost/token prechecks (PB4)
 * 5. Prompt assembly (PB2)
 * 6. Mock provider call (PB4)
 * 7. Response parsing (PB2)
 * 8. Output moderation (PB3)
 * 9. Session dispatch (PB1)
 *
 * Short-circuits on any error. Returns structured result with
 * session, effects, response, and metrics.
 */
export function executeTutorTurn(req: TutorTurnRequest): TutorTurnResult {
  const startMs = req.nowMs;
  const metrics = emptyMetrics();

  // ─── 1. Feature flag — caller responsibility (tree-shaken when false) ──
  // AI_TUTOR_ENABLED is checked by the caller before invoking this function.
  // When false, this module is never imported.

  // ─── 2. Input validation ───────────────────────────────────────────

  if (!req.userMessage || !req.userMessage.trim()) {
    return errorResult(req, "invalid_input", startMs, metrics);
  }
  const input = req.userMessage.trim();

  // ─── 3. Safety precheck (PB3) ──────────────────────────────────────

  const safetyCtx: SafetyContext = {
    mode: req.session.conversationMode,
    tier: req.tier,
    isKidsMode: req.isKidsMode,
  };

  if (!isKidsModeAllowed(safetyCtx)) {
    return errorResult(req, "safety_blocked", startMs, metrics);
  }

  const safetyResult = sanitizeInput(input, safetyCtx);
  if (!safetyResult.ok) {
    metrics.safetyCheckPassed = false;
    // Dispatch SAFETY_TRIGGERED event
    const event: TutorEvent = {
      type: "SAFETY_TRIGGERED",
      safetyKind: safetyResult.block,
      messageVi: safetyResult.messageVi,
      sessionContinues: safetyResult.block !== "hate_speech",
    };
    const dispatchResult = dispatchTutorEvent(req.session, event);
    if (dispatchResult.ok) {
      return buildResult(dispatchResult.session, dispatchResult.effects, null, metrics, startMs);
    }
    return errorResult(req, "safety_blocked", startMs, metrics);
  }
  metrics.safetyCheckPassed = true;
  const cleanedInput = safetyResult.cleaned;

  // Detect conversation mode
  const mode = detectConversationMode(
    cleanedInput,
    req.session.conversationMode,
    req.entryPoint,
  );

  // ─── 4. Rate/cost/token prechecks (PB4) ─────────────────────────────

  const rateResult = checkRateLimit(req.tier, req.requestsThisMinute, req.requestsToday);
  if (!rateResult.allowed) {
    return errorResult(req, "rate_limited", startMs, metrics);
  }

  // Use original input length for budget estimation (before truncation)
  const estimatedInputTokens = estimateTokens(input);
  const estimatedOutputTokens = 800; // budget check uses mode max output

  const costResult = checkCostLimit(req.tier, 0.001, req.runningDailyCostUsd);
  if (!costResult.allowed) {
    return errorResult(req, "cost_limited", startMs, metrics);
  }

  const budgetResult = checkTokenBudget(mode, estimatedInputTokens, 800);
  if (!budgetResult.allowed) {
    metrics.budgetCheckPassed = false;
    return errorResult(req, "token_budget_exceeded", startMs, metrics);
  }
  metrics.budgetCheckPassed = true;

  // ─── 5. Prompt assembly (PB2) ──────────────────────────────────────

  const goal = deriveGoal(cleanedInput, mode, req.entryPoint ?? req.session.entryPoint, req.session);
  const prompt = assemblePrompt(
    { ...req.session, conversationMode: mode },
    goal,
    req.requestId,
  );

  // ─── 6. Mock provider call (PB4) ───────────────────────────────────

  const providerResult = simulateProviderCall(
    req.mockProvider,
    mode,
    cleanedInput,
    req.requestId,
  );

  if (!providerResult.ok) {
    metrics.providerCallSucceeded = false;
    // Dispatch ERROR_OCCURRED event
    const event: TutorEvent = {
      type: "ERROR_OCCURRED",
      messageVi: providerResult.messageVi,
      retryable: providerResult.errorKind !== "empty_response",
      errorKind: mapProviderErrorKind(providerResult.errorKind),
    };
    const dispatchResult = dispatchTutorEvent(req.session, event);
    if (dispatchResult.ok) {
      return buildResult(dispatchResult.session, dispatchResult.effects, null, metrics, startMs);
    }
    return errorResult(req, "provider_failed", startMs, metrics);
  }
  metrics.providerCallSucceeded = true;
  metrics.inputTokens = providerResult.tokensUsed.input;
  metrics.outputTokens = providerResult.tokensUsed.output;

  // ─── 7. Response parsing (PB2) ─────────────────────────────────────

  const parseResult = parseResponse(providerResult.response.vi, mode);
  if (!parseResult.ok) {
    metrics.parseSucceeded = false;
    return errorResult(req, "parse_failed", startMs, metrics);
  }
  metrics.parseSucceeded = true;
  const parsedResponse = parseResult.response;

  // ─── 8. Output moderation (PB3) ────────────────────────────────────

  const moderationResult = moderateOutput(parsedResponse, safetyCtx);
  if (!moderationResult.ok) {
    metrics.moderationPassed = false;
    // Dispatch SAFETY_TRIGGERED for output moderation block
    const event: TutorEvent = {
      type: "SAFETY_TRIGGERED",
      safetyKind: moderationResult.block,
      messageVi: moderationResult.replacementVi,
      sessionContinues: true,
    };
    const dispatchResult = dispatchTutorEvent(req.session, event);
    if (dispatchResult.ok) {
      return buildResult(dispatchResult.session, dispatchResult.effects, null, metrics, startMs);
    }
    return errorResult(req, "output_moderation_blocked", startMs, metrics);
  }
  metrics.moderationPassed = true;
  const emotionalResponse = applyEmotionalStateToTutorResponse({
    learnerText: cleanedInput,
    response: moderationResult.response,
    turnIndex: req.session.messages.length,
  });
  const finalResponse = emotionalResponse.response;

  // ─── 9. Cost calculation ───────────────────────────────────────────

  metrics.costUsd = 0; // Mock provider is free; real cost tracked by caller

  // ─── 10. Session dispatch (PB1) ────────────────────────────────────

  // First dispatch LEARNER_MESSAGE_SENT to transition to thinking
  const learnerDispatch = dispatchTutorEvent(req.session, {
    type: "LEARNER_MESSAGE_SENT",
    content: cleanedInput,
    entryPoint: req.entryPoint,
    mode,
  });

  let session = req.session;
  let effects: TutorEffect[] = [];
  if (learnerDispatch.ok) {
    session = learnerDispatch.session;
    effects = [...learnerDispatch.effects];
  }
  // Continue even if dispatch fails — deliver response

  // Create mercy message and dispatch RESPONSE_RECEIVED
  const mercyMsg = buildMercyMessage(
    finalResponse,
    "ai-chat",
    req.requestId,
    session,
    req.nowMs,
  );

  const dispatchResult = dispatchTutorEvent(session, {
    type: "RESPONSE_RECEIVED",
    message: mercyMsg,
    turnsRemaining: session.turnsRemaining !== null
      ? Math.max(0, session.turnsRemaining - 1)
      : null,
  });

  if (!dispatchResult.ok) {
    return errorResult(req, "unknown_error", startMs, metrics);
  }

  return buildResult(
    dispatchResult.session,
    [...effects, ...dispatchResult.effects],
    finalResponse,
    metrics,
    startMs,
  );
}

// ─── Metrics ──────────────────────────────────────────────────────────

/**
 * Build turn metrics from the orchestration result.
 * All fields are safe metadata — no raw learner text or provider output.
 */
export function buildTurnMetrics(
  inputTokens: number,
  outputTokens: number,
  costUsd: number,
  safetyPassed: boolean,
  budgetPassed: boolean,
  providerSucceeded: boolean,
  parseSucceeded: boolean,
  moderationPassed: boolean,
  turnMs: number,
): TurnMetrics {
  return {
    turnMs,
    inputTokens,
    outputTokens,
    costUsd,
    safetyCheckPassed: safetyPassed,
    budgetCheckPassed: budgetPassed,
    providerCallSucceeded: providerSucceeded,
    parseSucceeded,
    moderationPassed,
  };
}

/**
 * Build a stand-alone error response for caller-side handling.
 * Returns a TutorResponse with a Vietnamese fallback message.
 */
export function getErrorResponse(kind: TutorTurnErrorKind): TutorResponse {
  const messages: Record<TutorTurnErrorKind, string> = {
    disabled_or_unavailable: "Tính năng trò chuyện với Mercy hiện chưa khả dụng. Bạn vui lòng thử lại sau nhé.",
    invalid_input: "Bạn muốn luyện gì hôm nay? Mình có thể giúp bạn sửa câu, giải thích ngữ pháp, hoặc luyện nói.",
    safety_blocked: getRefusalResponse("off_topic"),
    rate_limited: "Mình đang hơi bận. Bạn đợi một chút rồi thử lại nhé.",
    cost_limited: "Bạn đã dùng hết lượt trò chuyện với Mercy hôm nay. Lượt mới sẽ có sau 0h.",
    token_budget_exceeded: "Câu hỏi của bạn hơi dài. Bạn có thể viết ngắn gọn hơn không?",
    provider_failed: "Xin lỗi, mình gặp chút trục trặc. Bạn thử lại nhé?",
    parse_failed: "Mình chưa hiểu rõ ý bạn lắm. Bạn có thể diễn đạt cách khác không?",
    output_moderation_blocked: "Xin lỗi, mình cần thử lại. Bạn gửi lại câu hỏi nhé?",
    unknown_error: "Có lỗi xảy ra. Bạn vui lòng thử lại sau.",
  };

  return {
    vi: messages[kind] ?? messages.unknown_error,
    nextSteps: [
      { labelVi: "Thử lại", action: "write", payload: "" },
    ],
    saveTargets: [],
  };
}

// ─── Internal Helpers ─────────────────────────────────────────────────

function emptyMetrics(): TurnMetrics {
  return {
    turnMs: 0,
    inputTokens: 0,
    outputTokens: 0,
    costUsd: 0,
    safetyCheckPassed: false,
    budgetCheckPassed: false,
    providerCallSucceeded: false,
    parseSucceeded: false,
    moderationPassed: false,
  };
}

function errorResult(
  req: TutorTurnRequest,
  kind: TutorTurnErrorKind,
  startMs: number,
  metrics: TurnMetrics,
): TutorTurnResult {
  metrics.turnMs = req.nowMs - startMs;
  const errorResponse = getErrorResponse(kind);
  return {
    session: req.session,
    effects: [],
    response: errorResponse,
    metrics,
  };
}

function buildResult(
  session: TutorSession,
  effects: TutorEffect[],
  response: TutorResponse | null,
  metrics: TurnMetrics,
  startMs: number,
): TutorTurnResult {
  metrics.turnMs = 0; // Caller computes actual elapsed
  return { session, effects, response, metrics };
}

function mapProviderErrorKind(
  errorKind: string,
): "provider_5xx" | "provider_timeout" | "empty_response" | "unknown" {
  switch (errorKind) {
    case "provider_5xx": return "provider_5xx";
    case "provider_timeout": return "provider_timeout";
    case "provider_rate_limited": return "provider_timeout"; // map to timeout
    case "empty_response": return "empty_response";
    default: return "unknown";
  }
}

// ─── Public API ───────────────────────────────────────────────────────

export type { TutorSession, TutorEffect };
