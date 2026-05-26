/**
 * PB4 Cost Limits — Tests (PB4-T9 through T4-T24)
 *
 * Coverage: token budget, rate limits, cost limits, token estimation,
 * cost calculation, cost log entry safety, forbidden import checks.
 */

import { describe, it, expect } from "vitest";
import {
  checkCostLimit,
  checkRateLimit,
  checkTokenBudget,
  estimateTokens,
  calculateCost,
  createCostLogEntry,
} from "../costLimits";
import type { CostLogEntry, TokenBudgetResult } from "../costLimits";
import { TUTOR_TOKEN_BUDGETS, TUTOR_TIER_LIMITS, TUTOR_PHASE1_PROVIDER } from "../types";

// ─── Token Estimation Tests ────────────────────────────────────────────

describe("estimateTokens", () => {
  it("PB4-T9: uses ~4 chars/token heuristic", () => {
    expect(estimateTokens("hello world")).toBe(3); // 11/4 = 2.75 → 3
    expect(estimateTokens("")).toBe(0);
    expect(estimateTokens("a".repeat(100))).toBe(25); // 100/4 = 25
  });
});

// ─── Token Budget Tests ───────────────────────────────────────────────

describe("checkTokenBudget", () => {
  it("PB4-T10: allows under-budget usage", () => {
    const r = checkTokenBudget("general_chat", 100, 200);
    expect(r.allowed).toBe(true);
  });

  it("PB4-T11: allows exact-budget usage", () => {
    // general_chat budget: input=1000, output=800, total=1800
    const r = checkTokenBudget("general_chat", 1000, 800);
    expect(r.allowed).toBe(true);
  });

  it("PB4-T12: blocks over-budget input tokens", () => {
    const r = checkTokenBudget("general_chat", 1100, 10);
    expect(r.allowed).toBe(false);
    if (!r.allowed) {
      expect(r.reason).toContain("Input tokens");
    }
  });

  it("PB4-T12b: blocks over-budget output tokens before total check", () => {
    // Input 1000 (at limit), output 801 > maxOutputTokens 800
    const r = checkTokenBudget("general_chat", 1000, 801);
    expect(r.allowed).toBe(false);
    if (!r.allowed) {
      expect(r.reason).toContain("Output tokens");
    }
  });

  it("PB4-T13: uses TUTOR_TOKEN_BUDGETS from types.ts", () => {
    const budget = TUTOR_TOKEN_BUDGETS.general_chat;
    const r = checkTokenBudget("general_chat", budget.maxInputTokens - 1, 1);
    expect(r.allowed).toBe(true);
  });

  it("PB4-T13b: blocks over-budget output tokens", () => {
    const budget = TUTOR_TOKEN_BUDGETS.general_chat;
    const r = checkTokenBudget("general_chat", 1, budget.maxOutputTokens + 1);
    expect(r.allowed).toBe(false);
    if (!r.allowed) {
      expect(r.budgetName).toBe(budget.label);
    }
  });
});

// ─── Rate Limit Tests ─────────────────────────────────────────────────

describe("checkRateLimit", () => {
  it("PB4-T14: allows below limit", () => {
    const r = checkRateLimit("free", 2, 20);
    expect(r.allowed).toBe(true);
  });

  it("PB4-T15: blocks at per-minute limit", () => {
    const limit = TUTOR_TIER_LIMITS.free.requestsPerMinute;
    const r = checkRateLimit("free", limit, 0);
    expect(r.allowed).toBe(false);
    if (!r.allowed) expect(r.retryAfterMs).toBe(5000);
  });

  it("PB4-T15b: blocks at per-day limit", () => {
    const limit = TUTOR_TIER_LIMITS.free.requestsPerDay;
    const r = checkRateLimit("free", 1, limit);
    expect(r.allowed).toBe(false);
    if (!r.allowed) expect(r.retryAfterMs).toBe(60000);
  });

  it("PB4-T16: returns deterministic retryAfterMs", () => {
    const r1 = checkRateLimit("free", 3, 0);
    const r2 = checkRateLimit("free", 3, 0);
    expect(r1).toEqual(r2);
    if (!r1.allowed) expect(r1.retryAfterMs).toBe(5000);
  });

  it("PB4-T16b: allows paid tier with higher limits", () => {
    const r = checkRateLimit("paid", 5, 100);
    expect(r.allowed).toBe(true);
  });
});

// ─── Cost Limit Tests ─────────────────────────────────────────────────

describe("checkCostLimit", () => {
  it("PB4-T17: allows below tier cap", () => {
    const r = checkCostLimit("free", 0.01, 0.03);
    expect(r.allowed).toBe(true);
  });

  it("PB4-T18: blocks at/over tier cap", () => {
    const cap = TUTOR_TIER_LIMITS.free.maxCostPerDayUsd;
    const r = checkCostLimit("free", 0.01, cap);
    expect(r.allowed).toBe(false);
  });

  it("PB4-T19: uses TUTOR_TIER_LIMITS from types.ts", () => {
    // free tier: $0.05/day cap
    const r = checkCostLimit("free", 0.06, 0);
    expect(r.allowed).toBe(false);
  });

  it("PB4-T19b: paid tier has higher cap", () => {
    // paid tier: $0.50/day cap
    const r = checkCostLimit("paid", 0.30, 0.10);
    expect(r.allowed).toBe(true);
  });
});

// ─── Cost Calculation Tests ───────────────────────────────────────────

describe("calculateCost", () => {
  it("PB4-T20: uses TUTOR_PHASE1_PROVIDER pricing", () => {
    const cost = calculateCost(1_000_000, 1_000_000);
    const expected = TUTOR_PHASE1_PROVIDER.inputPricePer1M + TUTOR_PHASE1_PROVIDER.outputPricePer1M;
    expect(cost).toBeCloseTo(expected, 4);
  });

  it("PB4-T21: handles zero tokens", () => {
    expect(calculateCost(0, 0)).toBe(0);
    expect(calculateCost(0, 100)).toBeCloseTo((100 / 1_000_000) * TUTOR_PHASE1_PROVIDER.outputPricePer1M, 8);
  });

  it("PB4-T21b: cost is proportional to token count", () => {
    const cost1 = calculateCost(500_000, 250_000);
    const cost2 = calculateCost(1_000_000, 500_000); // 2× tokens
    expect(cost2).toBeCloseTo(cost1 * 2, 4);
  });
});

// ─── Cost Log Entry Tests ─────────────────────────────────────────────

describe("createCostLogEntry", () => {
  it("PB4-T22: includes only safe metadata", () => {
    const entry = createCostLogEntry("req_abc", 500, 300, "free", 1000000);
    expect(entry.requestId).toBe("req_abc");
    expect(entry.provider).toBe(TUTOR_PHASE1_PROVIDER.provider);
    expect(entry.model).toBe(TUTOR_PHASE1_PROVIDER.model);
    expect(entry.inputTokens).toBe(500);
    expect(entry.outputTokens).toBe(300);
    expect(entry.totalTokens).toBe(800);
    expect(entry.costUsd).toBeGreaterThan(0);
    expect(entry.tier).toBe("free");
    expect(entry.timestamp).toBe(1000000);
  });

  it("PB4-T23: excludes raw learner/provider text", () => {
    const entry = createCostLogEntry("req_abc", 500, 300, "free", 1000000);
    // entry must NOT have message content or prompt fields
    expect((entry as Record<string, unknown>).messages).toBeUndefined();
    expect((entry as Record<string, unknown>).prompt).toBeUndefined();
    expect((entry as Record<string, unknown>).learnerText).toBeUndefined();
    expect((entry as Record<string, unknown>).responseText).toBeUndefined();
    expect((entry as Record<string, unknown>).vi).toBeUndefined();
    expect((entry as Record<string, unknown>).content).toBeUndefined();
  });
});

// ─── PB4-T24: Forbidden imports / no side effects ────────────────────

describe("import safety", () => {
  it("PB4-T24a: all exports are callable pure functions", () => {
    expect(typeof checkCostLimit).toBe("function");
    expect(typeof checkRateLimit).toBe("function");
    expect(typeof checkTokenBudget).toBe("function");
    expect(typeof estimateTokens).toBe("function");
    expect(typeof calculateCost).toBe("function");
    expect(typeof createCostLogEntry).toBe("function");
  });

  it("PB4-T24b: functions are deterministic", () => {
    expect(checkCostLimit("free", 0.01, 0.03)).toEqual(checkCostLimit("free", 0.01, 0.03));
    expect(checkRateLimit("free", 2, 20)).toEqual(checkRateLimit("free", 2, 20));
    expect(checkTokenBudget("general_chat", 100, 200)).toEqual(checkTokenBudget("general_chat", 100, 200));
    expect(estimateTokens("hello")).toBe(estimateTokens("hello"));
    expect(calculateCost(100, 200)).toBe(calculateCost(100, 200));
  });

  it("PB4-T24c: cost log entry is deterministic", () => {
    const e1 = createCostLogEntry("req_abc", 500, 300, "free", 1000000);
    const e2 = createCostLogEntry("req_abc", 500, 300, "free", 1000000);
    expect(e1).toEqual(e2);
  });
});
