/**
 * PB4 Cost Limits — pure cost/rate/token limit enforcement for AI Tutor.
 *
 * Phase B — pure functions only. No I/O, no network, no persistence.
 * All functions are deterministic. No console.log, no side effects.
 *
 * Imports canonical constants from types.ts only:
 *   - TUTOR_TOKEN_BUDGETS, TUTOR_TIER_LIMITS, TUTOR_PHASE1_PROVIDER
 *
 * createCostLogEntry produces inert metadata only — never includes
 * raw learner text, provider response text, or TutorResponse.vi.
 *
 * AI_TUTOR_ENABLED=false — this module is tree-shaken in production.
 */

import {
  TUTOR_TOKEN_BUDGETS,
  TUTOR_TIER_LIMITS,
  TUTOR_PHASE1_PROVIDER,
} from "./types";
import type {
  TutorTier,
} from "./types";

// ─── Types ────────────────────────────────────────────────────────────

export type CostLimitResult =
  | { allowed: true }
  | { allowed: false; reason: string; resetsAt?: string };

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; reason: string; retryAfterMs: number };

export type TokenBudgetResult =
  | { allowed: true }
  | { allowed: false; reason: string; budgetName: string };

export type CostLogEntry = {
  timestamp: number;
  requestId: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
  tier: TutorTier;
};

// ─── Cost Limit Checks ────────────────────────────────────────────────

/**
 * Check if the estimated cost would exceed the tier's daily cost cap.
 * Uses TUTOR_TIER_LIMITS from types.ts for canonical limits.
 */
export function checkCostLimit(
  tier: TutorTier,
  estimatedCostUsd: number,
  runningDailyCostUsd: number,
): CostLimitResult {
  const limits = TUTOR_TIER_LIMITS[tier];
  const projected = runningDailyCostUsd + estimatedCostUsd;

  if (projected > limits.maxCostPerDayUsd) {
    return {
      allowed: false,
      reason: `Daily cost cap exceeded: $${projected.toFixed(4)} > $${limits.maxCostPerDayUsd.toFixed(2)}`,
    };
  }

  return { allowed: true };
}

// ─── Rate Limit Checks ────────────────────────────────────────────────

/**
 * Check if the request rate exceeds per-minute or per-day limits.
 * Uses TUTOR_TIER_LIMITS from types.ts.
 *
 * Returns retryAfterMs deterministically: fixed 5-second retry window
 * for per-minute hits, 60 seconds for per-day hits.
 */
export function checkRateLimit(
  tier: TutorTier,
  requestsThisMinute: number,
  requestsToday: number,
): RateLimitResult {
  const limits = TUTOR_TIER_LIMITS[tier];

  if (requestsThisMinute >= limits.requestsPerMinute) {
    return {
      allowed: false,
      reason: `Rate limit: ${requestsThisMinute}/${limits.requestsPerMinute} requests/minute`,
      retryAfterMs: 5000,
    };
  }

  if (requestsToday >= limits.requestsPerDay) {
    return {
      allowed: false,
      reason: `Rate limit: ${requestsToday}/${limits.requestsPerDay} requests/day`,
      retryAfterMs: 60000,
    };
  }

  return { allowed: true };
}

// ─── Token Budget Checks ──────────────────────────────────────────────

/**
 * Check if estimated input + output tokens exceed the mode's token budget.
 * Uses TUTOR_TOKEN_BUDGETS from types.ts for canonical budgets.
 */
export function checkTokenBudget(
  mode: string,
  estimatedInputTokens: number,
  estimatedOutputTokens: number,
): TokenBudgetResult {
  const budget = TUTOR_TOKEN_BUDGETS[mode] ?? TUTOR_TOKEN_BUDGETS.general_chat;
  const total = estimatedInputTokens + estimatedOutputTokens;

  if (estimatedInputTokens > budget.maxInputTokens) {
    return {
      allowed: false,
      reason: `Input tokens ${estimatedInputTokens} > max ${budget.maxInputTokens}`,
      budgetName: budget.label,
    };
  }

  if (estimatedOutputTokens > budget.maxOutputTokens) {
    return {
      allowed: false,
      reason: `Output tokens ${estimatedOutputTokens} > max ${budget.maxOutputTokens}`,
      budgetName: budget.label,
    };
  }

  if (total > budget.maxTotalTokens) {
    return {
      allowed: false,
      reason: `Total tokens ${total} > max ${budget.maxTotalTokens}`,
      budgetName: budget.label,
    };
  }

  return { allowed: true };
}

// ─── Token Estimation ─────────────────────────────────────────────────

/**
 * Estimate token count using ~4 characters per token heuristic.
 * Deterministic. No ML tokenizer, no API call.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

// ─── Cost Calculation ─────────────────────────────────────────────────

/**
 * Calculate cost for a provider call using TUTOR_PHASE1_PROVIDER pricing.
 * Uses static provider descriptor prices. No API call.
 */
export function calculateCost(
  inputTokens: number,
  outputTokens: number,
): number {
  const { inputPricePer1M, outputPricePer1M } = TUTOR_PHASE1_PROVIDER;
  const inputCost = (inputTokens / 1_000_000) * inputPricePer1M;
  const outputCost = (outputTokens / 1_000_000) * outputPricePer1M;

  return inputCost + outputCost;
}

// ─── Cost Log Entry ───────────────────────────────────────────────────

/**
 * Create an inert cost log entry for audit purposes.
 *
 * MUST NOT include: messages, prompts, learner text, provider response
 * text, or TutorResponse.vi. Only safe metadata (requestId, token counts,
 * cost, tier, provider/model identifiers).
 *
 * No console.log — returns the entry as data for the caller to use.
 */
export function createCostLogEntry(
  requestId: string,
  inputTokens: number,
  outputTokens: number,
  tier: TutorTier,
  timestamp: number,
): CostLogEntry {
  const totalTokens = inputTokens + outputTokens;
  const costUsd = calculateCost(inputTokens, outputTokens);

  return {
    timestamp,
    requestId,
    provider: TUTOR_PHASE1_PROVIDER.provider,
    model: TUTOR_PHASE1_PROVIDER.model,
    inputTokens,
    outputTokens,
    totalTokens,
    costUsd,
    tier,
  };
}

// ─── Public API ───────────────────────────────────────────────────────

export type { TutorTier };
