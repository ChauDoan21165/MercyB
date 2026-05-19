import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Supabase mock (same chain pattern as other service tests) ──────────

const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockRange = vi.fn();
const mockMaybeSingle = vi.fn();

type MockChain = {
  select: (...args: unknown[]) => MockChain;
  order: (...args: unknown[]) => MockChain;
  range: (...args: unknown[]) => Promise<{ data: unknown; error: unknown }>;
  maybeSingle: () => Promise<{ data: unknown; error: unknown }>;
  _mockRangeResult?: unknown;
  _mockRangeError?: unknown;
  _mockSingleResult?: unknown;
  _mockSingleError?: unknown;
};

const chain: MockChain = {
  select: (...args: unknown[]) => {
    mockSelect(...args);
    return chain;
  },
  order: (...args: unknown[]) => {
    mockOrder(...args);
    return chain;
  },
  range: (...args: unknown[]) => {
    mockRange(...args);
    return Promise.resolve({
      data: chain._mockRangeResult ?? [],
      error: chain._mockRangeError ?? null,
    });
  },
  maybeSingle: () =>
    Promise.resolve({
      data: chain._mockSingleResult ?? null,
      error: chain._mockSingleError ?? null,
    }),
};
const mockFrom = vi.fn((..._args: unknown[]) => chain);

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { from: (...a: unknown[]) => mockFrom(...a) },
}));

import {
  EMPTY_STATS,
  getAttempts,
  getUserStats,
} from "../speechHistory";

beforeEach(() => {
  mockSelect.mockReset();
  mockOrder.mockReset();
  mockRange.mockReset();
  mockMaybeSingle.mockReset();
  mockFrom.mockClear();
  chain._mockRangeResult = undefined;
  chain._mockRangeError = undefined;
  chain._mockSingleResult = undefined;
  chain._mockSingleError = undefined;
});

describe("getUserStats", () => {
  it("queries v_user_pronunciation_stats with maybeSingle()", async () => {
    chain._mockSingleResult = null;
    await getUserStats();
    expect(mockFrom).toHaveBeenCalledWith("v_user_pronunciation_stats");
  });

  it("returns EMPTY_STATS when the view has no row for the user", async () => {
    chain._mockSingleResult = null;
    const r = await getUserStats();
    expect(r).toEqual(EMPTY_STATS);
  });

  it("normalizes a populated row to typed numbers", async () => {
    chain._mockSingleResult = {
      attempts_7d: 3,
      attempts_30d: 10,
      attempts_90d: 25,
      avg_score_7d: 82,
      avg_score_30d: 75,
      avg_score_90d: 70,
      last_attempt_at: "2026-04-25T10:00:00Z",
      median_elapsed_ms_90d: 3500,
    };
    const r = await getUserStats();
    expect(r.attempts_7d).toBe(3);
    expect(r.avg_score_7d).toBe(82);
    expect(r.last_attempt_at).toBe("2026-04-25T10:00:00Z");
    expect(r.median_elapsed_ms_90d).toBe(3500);
  });

  it("coerces missing or non-numeric fields safely", async () => {
    chain._mockSingleResult = {
      attempts_7d: null,
      attempts_30d: "5",
      attempts_90d: undefined,
      avg_score_7d: null,
      avg_score_30d: "not a number",
      avg_score_90d: 60,
      last_attempt_at: null,
      median_elapsed_ms_90d: null,
    };
    const r = await getUserStats();
    expect(r.attempts_7d).toBe(0);
    expect(r.attempts_30d).toBe(5);
    expect(r.attempts_90d).toBe(0);
    expect(r.avg_score_7d).toBeNull();
    expect(r.avg_score_30d).toBeNull();
    expect(r.avg_score_90d).toBe(60);
  });

  it("throws on supabase error", async () => {
    chain._mockSingleError = { message: "RLS denied" };
    await expect(getUserStats()).rejects.toEqual({ message: "RLS denied" });
  });
});

describe("getAttempts", () => {
  it("queries speech_attempts ordered by attempted_at descending", async () => {
    chain._mockRangeResult = [];
    await getAttempts();
    expect(mockFrom).toHaveBeenCalledWith("speech_attempts");
    const orderArgs = mockOrder.mock.calls[0];
    expect(orderArgs[0]).toBe("attempted_at");
    expect(orderArgs[1]).toEqual({ ascending: false });
  });

  it("uses the default page size of 20 (range 0..19)", async () => {
    chain._mockRangeResult = [];
    await getAttempts();
    expect(mockRange).toHaveBeenCalledWith(0, 19);
  });

  it("honours custom limit + offset", async () => {
    chain._mockRangeResult = [];
    await getAttempts({ limit: 5, offset: 40 });
    expect(mockRange).toHaveBeenCalledWith(40, 44);
  });

  it("clamps limit upward to 1 and downward to 100", async () => {
    chain._mockRangeResult = [];
    await getAttempts({ limit: 0 });
    expect(mockRange).toHaveBeenLastCalledWith(0, 0);

    await getAttempts({ limit: 999 });
    expect(mockRange).toHaveBeenLastCalledWith(0, 99);
  });

  it("normalizes rows, coerces missing fields to safe defaults", async () => {
    chain._mockRangeResult = [
      {
        id: "attempt-1",
        target_text: "The word is water.",
        transcript: "the word is water",
        overall_score: 88,
        word_scores: [
          { word: "the", score: 95, status: "correct" },
          { word: "word", score: 70, status: "approx" },
          { invalidEntry: true },
          null,
          "junk",
        ],
        attempted_at: "2026-04-25T10:00:00Z",
        elapsed_ms: 2400,
        context: { source: "room_modal" },
        room_id: "room-1",
      },
      {
        id: "attempt-2",
        target_text: "Hello.",
        transcript: null,
        overall_score: null,
        word_scores: null,
        attempted_at: "2026-04-25T09:00:00Z",
        elapsed_ms: null,
        context: null,
        room_id: null,
      },
    ];
    const rows = await getAttempts();
    expect(rows).toHaveLength(2);
    expect(rows[0].id).toBe("attempt-1");
    expect(rows[0].word_scores).toHaveLength(2); // invalid entries dropped
    expect(rows[0].word_scores[0].word).toBe("the");
    expect(rows[0].context).toEqual({ source: "room_modal" });
    expect(rows[1].word_scores).toEqual([]);
    expect(rows[1].overall_score).toBeNull();
    expect(rows[1].context).toBeNull();
  });

  it("throws on supabase error", async () => {
    chain._mockRangeError = { message: "timeout" };
    await expect(getAttempts()).rejects.toEqual({ message: "timeout" });
  });

  it("returns [] when the response has no rows", async () => {
    chain._mockRangeResult = [];
    const rows = await getAttempts();
    expect(rows).toEqual([]);
  });
});
