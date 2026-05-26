// src/lib/weakness/__tests__/recommendationEngine.test.ts
//
// A4 — recommendation engine v2 unit tests. Covers ranking, recency
// penalty, confidence, cold-start, and the public async API contract
// (mocked via `fetchHistory` injection — never hits Supabase).

import { describe, expect, it } from "vitest";

import {
  computeWeaknessDensity,
  timeSinceLastAttempt,
  type AttemptRecord,
} from "../focusAreasLogic";
import {
  getTopWeaknesses,
  rankWeaknesses,
  recommendDailyChallenge,
  recommendNextLesson,
  type UserWeaknessHistory,
} from "../recommendationEngine";
import { ALL_WEAKNESS_TAGS } from "../weakness-catalog";

const NOW = new Date("2026-04-24T12:00:00.000Z");

function daysAgo(n: number): string {
  return new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000).toISOString();
}

function asHistory(
  records: AttemptRecord[],
  userCefr?: UserWeaknessHistory["userCefr"],
): UserWeaknessHistory {
  return { records, userCefr };
}

// ─── Pure ranker ─────────────────────────────────────────────────────────

describe("rankWeaknesses — ordering by composite score", () => {
  it("rule with more errors ranks above one with fewer", () => {
    const history = asHistory([
      { ruleTag: "vi_l1_3rd_person_s", errorCount: 5, lastSeenAt: daysAgo(3) },
      { ruleTag: "vi_l1_past_ed", errorCount: 1, lastSeenAt: daysAgo(3) },
    ]);
    const ranked = rankWeaknesses(history, NOW);
    const past = ranked.findIndex((r) => r.tag === "vi_l1_past_ed");
    const third = ranked.findIndex((r) => r.tag === "vi_l1_3rd_person_s");
    expect(third).toBeLessThan(past);
  });

  it("recently-attempted rule ranks below stale one with same error count", () => {
    const history = asHistory([
      { ruleTag: "vi_l1_3rd_person_s", errorCount: 3, lastSeenAt: daysAgo(0) },
      { ruleTag: "vi_l1_plural_s", errorCount: 3, lastSeenAt: daysAgo(10) },
    ]);
    const ranked = rankWeaknesses(history, NOW);
    const recent = ranked.findIndex((r) => r.tag === "vi_l1_3rd_person_s");
    const stale = ranked.findIndex((r) => r.tag === "vi_l1_plural_s");
    expect(stale).toBeLessThan(recent);
  });

  it("confidence rises with attempt volume and saturates at 1", () => {
    const history = asHistory([
      { ruleTag: "vi_l1_3rd_person_s", errorCount: 100, lastSeenAt: daysAgo(2) },
    ]);
    const ranked = rankWeaknesses(history, NOW);
    const top = ranked.find((r) => r.tag === "vi_l1_3rd_person_s")!;
    expect(top.confidence).toBe(1);
    expect(top.score).toBeLessThanOrEqual(1);
    expect(top.score).toBeGreaterThan(0);
  });

  it("user with one error has confidence well below 1", () => {
    const history = asHistory([
      { ruleTag: "vi_l1_3rd_person_s", errorCount: 1, lastSeenAt: daysAgo(2) },
    ]);
    const top = rankWeaknesses(history, NOW).find(
      (r) => r.tag === "vi_l1_3rd_person_s",
    )!;
    expect(top.confidence).toBeCloseTo(0.2, 5);
  });

  it("daysSinceLastAttempt is Infinity for never-seen rules", () => {
    const history = asHistory([
      { ruleTag: "vi_l1_3rd_person_s", errorCount: 1, lastSeenAt: daysAgo(2) },
    ]);
    const past = rankWeaknesses(history, NOW).find(
      (r) => r.tag === "vi_l1_past_ed",
    )!;
    expect(past.daysSinceLastAttempt).toBe(Number.POSITIVE_INFINITY);
    expect(past.errorCount).toBe(0);
  });

  it("reason is high_error_rate when errors dominate the score", () => {
    const history = asHistory([
      { ruleTag: "vi_l1_3rd_person_s", errorCount: 5, lastSeenAt: daysAgo(0) },
    ]);
    const top = rankWeaknesses(history, NOW)[0];
    expect(top.reason).toBe("high_error_rate");
  });

  it("reason is stale_practice when recency dominates", () => {
    const history = asHistory([
      { ruleTag: "vi_l1_3rd_person_s", errorCount: 1, lastSeenAt: daysAgo(30) },
    ]);
    const target = rankWeaknesses(history, NOW).find(
      (r) => r.tag === "vi_l1_3rd_person_s",
    )!;
    expect(target.reason).toBe("stale_practice");
  });

  it("ordering is deterministic across runs", () => {
    const history = asHistory([
      { ruleTag: "vi_l1_3rd_person_s", errorCount: 2, lastSeenAt: daysAgo(5) },
      { ruleTag: "vi_l1_past_ed", errorCount: 4, lastSeenAt: daysAgo(5) },
      { ruleTag: "vi_l1_plural_s", errorCount: 1, lastSeenAt: daysAgo(5) },
    ]);
    const a = rankWeaknesses(history, NOW).map((r) => r.tag);
    const b = rankWeaknesses(history, NOW).map((r) => r.tag);
    expect(a).toEqual(b);
  });

  it("unknown ruleTag in history is ignored, doesn't crash ranking", () => {
    const history = asHistory([
      { ruleTag: "not_a_real_tag", errorCount: 99, lastSeenAt: daysAgo(0) },
      { ruleTag: "vi_l1_3rd_person_s", errorCount: 1, lastSeenAt: daysAgo(2) },
    ]);
    const ranked = rankWeaknesses(history, NOW);
    expect(ranked.length).toBe(ALL_WEAKNESS_TAGS.length);
    expect(ranked.find((r) => r.tag === "vi_l1_3rd_person_s")!.errorCount).toBe(1);
  });

  it("duplicate records for same tag are summed", () => {
    const history = asHistory([
      { ruleTag: "vi_l1_3rd_person_s", errorCount: 2, lastSeenAt: daysAgo(5) },
      { ruleTag: "vi_l1_3rd_person_s", errorCount: 3, lastSeenAt: daysAgo(1) },
    ]);
    const target = rankWeaknesses(history, NOW).find(
      (r) => r.tag === "vi_l1_3rd_person_s",
    )!;
    expect(target.errorCount).toBe(5);
    // Most-recent timestamp wins → ~1 day, not 5.
    expect(target.daysSinceLastAttempt).toBeLessThan(2);
  });
});

// ─── Cold start ──────────────────────────────────────────────────────────

describe("rankWeaknesses — cold start", () => {
  it("user with zero history returns top-CEFR rules in difficulty order", () => {
    const ranked = rankWeaknesses(asHistory([]), NOW);
    expect(ranked.length).toBe(ALL_WEAKNESS_TAGS.length);
    expect(ranked.every((r) => r.reason === "cold_start")).toBe(true);
    expect(ranked.every((r) => r.confidence === 0)).toBe(true);
    // First entries should be A1-level rules.
    expect(["vi_l1_3rd_person_s", "vi_l1_plural_s"]).toContain(ranked[0].tag);
  });

  it("cold start treats all-zero error history as empty", () => {
    const history = asHistory([
      { ruleTag: "vi_l1_3rd_person_s", errorCount: 0, lastSeenAt: daysAgo(2) },
    ]);
    const ranked = rankWeaknesses(history, NOW);
    expect(ranked[0].reason).toBe("cold_start");
  });
});

// ─── Pure helpers re-exported from focusAreasLogic ───────────────────────

describe("computeWeaknessDensity", () => {
  it("returns empty map for empty history", () => {
    expect(computeWeaknessDensity([]).size).toBe(0);
  });

  it("computes share of total errors per rule", () => {
    const m = computeWeaknessDensity([
      { ruleTag: "a", errorCount: 3, lastSeenAt: null },
      { ruleTag: "b", errorCount: 1, lastSeenAt: null },
    ]);
    expect(m.get("a")).toBeCloseTo(0.75, 5);
    expect(m.get("b")).toBeCloseTo(0.25, 5);
  });

  it("ignores zero-error rows", () => {
    const m = computeWeaknessDensity([
      { ruleTag: "a", errorCount: 2, lastSeenAt: null },
      { ruleTag: "b", errorCount: 0, lastSeenAt: null },
    ]);
    expect(m.get("a")).toBeCloseTo(1, 5);
    expect(m.has("b")).toBe(false);
  });
});

describe("timeSinceLastAttempt", () => {
  it("returns Infinity when rule never appears", () => {
    expect(timeSinceLastAttempt([], "anything", NOW)).toBe(
      Number.POSITIVE_INFINITY,
    );
  });

  it("returns most-recent across duplicate rows", () => {
    const days = timeSinceLastAttempt(
      [
        { ruleTag: "x", errorCount: 1, lastSeenAt: daysAgo(10) },
        { ruleTag: "x", errorCount: 1, lastSeenAt: daysAgo(2) },
      ],
      "x",
      NOW,
    );
    expect(days).toBeGreaterThan(1.9);
    expect(days).toBeLessThan(2.1);
  });

  it("ignores rows with null lastSeenAt", () => {
    const days = timeSinceLastAttempt(
      [
        { ruleTag: "x", errorCount: 1, lastSeenAt: null },
        { ruleTag: "x", errorCount: 1, lastSeenAt: daysAgo(7) },
      ],
      "x",
      NOW,
    );
    expect(days).toBeCloseTo(7, 1);
  });
});

// ─── Async API (mocked fetchHistory) ─────────────────────────────────────

describe("getTopWeaknesses (async)", () => {
  it("returns N entries via injected fetchHistory", async () => {
    const fetchHistory = async (): Promise<UserWeaknessHistory> =>
      asHistory([
        { ruleTag: "vi_l1_3rd_person_s", errorCount: 4, lastSeenAt: daysAgo(2) },
        { ruleTag: "vi_l1_past_ed", errorCount: 2, lastSeenAt: daysAgo(7) },
      ]);
    const top = await getTopWeaknesses("user-1", 2, { fetchHistory, now: NOW });
    expect(top.length).toBe(2);
    expect(top[0].tag).toBe("vi_l1_3rd_person_s");
  });

  it("cold-start user still gets a non-empty top-N", async () => {
    const fetchHistory = async (): Promise<UserWeaknessHistory> =>
      asHistory([]);
    const top = await getTopWeaknesses("user-1", 3, { fetchHistory, now: NOW });
    expect(top.length).toBe(3);
    expect(top.every((r) => r.reason === "cold_start")).toBe(true);
  });
});

describe("recommendNextLesson", () => {
  it("returns a tag that has a micro-lesson defined", async () => {
    const fetchHistory = async (): Promise<UserWeaknessHistory> =>
      asHistory([
        // High-scoring rule WITHOUT a micro-lesson should be skipped in
        // favor of a lower-scoring one that has a lesson.
        { ruleTag: "vi_l1_negative_inversion", errorCount: 5, lastSeenAt: daysAgo(0) },
        { ruleTag: "vi_l1_3rd_person_s", errorCount: 1, lastSeenAt: daysAgo(2) },
      ]);
    const tag = await recommendNextLesson("user-1", { fetchHistory, now: NOW });
    expect(tag).toBe("vi_l1_3rd_person_s");
  });
});

describe("recommendDailyChallenge", () => {
  it("returns the top-scoring tag", async () => {
    const fetchHistory = async (): Promise<UserWeaknessHistory> =>
      asHistory([
        { ruleTag: "vi_l1_3rd_person_s", errorCount: 5, lastSeenAt: daysAgo(2) },
      ]);
    const tag = await recommendDailyChallenge("user-1", {
      fetchHistory,
      now: NOW,
    });
    expect(tag).toBe("vi_l1_3rd_person_s");
  });

  it("cold-start user still receives a tag (never throws)", async () => {
    const fetchHistory = async (): Promise<UserWeaknessHistory> =>
      asHistory([]);
    const tag = await recommendDailyChallenge("user-1", {
      fetchHistory,
      now: NOW,
    });
    expect(typeof tag).toBe("string");
    expect(tag.length).toBeGreaterThan(0);
  });
});
