import { afterEach, describe, expect, it, vi } from "vitest";

// Chainable supabase query-builder mock: every method returns the builder, and
// the builder is awaited for { data, error }. limitResult controls the await.
const limitResult = vi.hoisted(() => ({ current: { data: [] as unknown, error: null as unknown } }));
// conversations count query terminates on .eq() → { count, error }
const countResult = vi.hoisted(() => ({ current: { count: 0 as number | null, error: null as unknown } }));
const builder: Record<string, unknown> = {};
for (const m of ["select", "in", "not", "order"]) builder[m] = vi.fn(() => builder);
builder.limit = vi.fn(() => Promise.resolve(limitResult.current));
builder.eq = vi.fn(() => Promise.resolve(countResult.current));
const from = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabaseClient", () => ({ supabase: { from } }));

import {
  loadServerInterferenceTags,
  mergeRecallMemory,
  fetchServerProfileInput,
} from "@/lib/ai-conversation/serverInterferenceMemory";
import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";

function summary(over: Partial<MemorySummary>): MemorySummary {
  return { commonMistakePatterns: [], lastPracticedTopic: "", nextRecommendedFocus: "", ...over } as MemorySummary;
}

afterEach(() => {
  from.mockReset();
  from.mockReturnValue(builder);
  limitResult.current = { data: [], error: null };
  countResult.current = { count: 0, error: null };
});

describe("loadServerInterferenceTags", () => {
  it("returns [] without a userId (no query)", async () => {
    from.mockReturnValue(builder);
    expect(await loadServerInterferenceTags(null)).toEqual([]);
    expect(from).not.toHaveBeenCalled();
  });

  it("aggregates the most frequent interference tags from error_details", async () => {
    from.mockReturnValue(builder);
    limitResult.current = {
      error: null,
      data: [
        { error_details: { errorType: "article omission" } },
        { error_details: { errorType: "article omission" } },
        { error_details: { errorType: "missing copula" } },
        { error_details: { interferencePattern: "word order" } },
        { error_details: null },
        { error_details: { errorType: "" } },
      ],
    };
    const tags = await loadServerInterferenceTags("user-1", 2);
    expect(from).toHaveBeenCalledWith("conversation_events");
    expect(tags).toEqual(["article omission", "missing copula"]);
  });

  it("fail-soft: returns [] on a supabase error", async () => {
    from.mockReturnValue(builder);
    limitResult.current = { data: null, error: { message: "relation does not exist" } };
    expect(await loadServerInterferenceTags("user-1")).toEqual([]);
  });

  it("fail-soft: returns [] when the query throws", async () => {
    from.mockImplementation(() => { throw new Error("network"); });
    expect(await loadServerInterferenceTags("user-1")).toEqual([]);
  });
});

describe("mergeRecallMemory", () => {
  it("returns null when there is nothing to recall", () => {
    expect(mergeRecallMemory([], null)).toBeNull();
    expect(mergeRecallMemory([], summary({ commonMistakePatterns: [] }))).toBeNull();
  });

  it("unions server (leading) + device-local tags, deduped and capped", () => {
    const m = mergeRecallMemory(
      ["article omission", "missing copula"],
      summary({ commonMistakePatterns: ["missing copula", "tense shift"], lastPracticedTopic: "tenses" }),
      3,
    );
    expect(m?.interferencePatterns).toEqual(["article omission", "missing copula", "tense shift"]);
    expect(m?.recentFocus).toBe("tenses");
  });

  it("recalls cross-device from server tags even with no device-local memory", () => {
    const m = mergeRecallMemory(["article omission"], null);
    expect(m).toEqual({ interferencePatterns: ["article omission"], recentFocus: null });
  });

  it("falls back to nextRecommendedFocus when there is no lastPracticedTopic", () => {
    const m = mergeRecallMemory([], summary({ commonMistakePatterns: ["x"], nextRecommendedFocus: "articles" }));
    expect(m?.recentFocus).toBe("articles");
  });
});

describe("fetchServerProfileInput", () => {
  it("returns safe-empty without a userId (no query)", async () => {
    from.mockReturnValue(builder);
    expect(await fetchServerProfileInput(null)).toEqual({ interferenceTagCounts: {}, sessionCount: 0 });
    expect(from).not.toHaveBeenCalled();
  });

  it("aggregates tag counts from events and the session count from conversations", async () => {
    from.mockReturnValue(builder);
    limitResult.current = {
      error: null,
      data: [
        { error_details: { errorType: "article omission" } },
        { error_details: { errorType: "article omission" } },
        { error_details: { errorType: "tense shift" } },
        { error_details: null },
      ],
    };
    countResult.current = { count: 7, error: null };
    const input = await fetchServerProfileInput("user-1");
    expect(input.interferenceTagCounts).toEqual({ "article omission": 2, "tense shift": 1 });
    expect(input.sessionCount).toBe(7);
  });

  it("fail-soft: returns safe-empty when a query throws", async () => {
    from.mockImplementation(() => { throw new Error("network"); });
    expect(await fetchServerProfileInput("user-1")).toEqual({ interferenceTagCounts: {}, sessionCount: 0 });
  });

  it("clamps a null/absent session count to 0", async () => {
    from.mockReturnValue(builder);
    countResult.current = { count: null, error: null };
    const input = await fetchServerProfileInput("user-1");
    expect(input.sessionCount).toBe(0);
  });
});
