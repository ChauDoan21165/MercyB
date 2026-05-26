// src/lib/analytics/__tests__/speechProgress.test.ts
//
// Coverage of the pure helpers — the DB-bound functions are thin
// wrappers over the supabase client and depend on RLS, so they're
// exercised by manual /progress smoke tests rather than unit tests.

import { describe, expect, it, vi } from "vitest";

// Pure helpers don't touch the network, but the module imports the
// supabase singleton at top level. Stub it so the test environment
// doesn't need real env vars.
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }),
        gte: () => ({
          lt: () => ({
            order: () => ({
              limit: async () => ({ data: [], error: null }),
            }),
          }),
        }),
        order: () => ({
          limit: async () => ({ data: [], error: null }),
        }),
      }),
    }),
  },
}));

import {
  CANONICAL_PHONEMES,
  aggregatePhonemeStats,
  canonicalizePhoneme,
  extractPhonemeBreakdown,
} from "../speechProgress";

describe("canonicalizePhoneme", () => {
  it("maps IPA aliases to canonical SAPI keys", () => {
    expect(canonicalizePhoneme("θ")).toBe("th");
    expect(canonicalizePhoneme("ð")).toBe("dh");
    expect(canonicalizePhoneme("ʃ")).toBe("sh");
    expect(canonicalizePhoneme("ŋ")).toBe("ng");
    expect(canonicalizePhoneme("æ")).toBe("ae");
  });

  it("strips Azure stress markers", () => {
    expect(canonicalizePhoneme("ah1")).toBe("ah");
    expect(canonicalizePhoneme("ax0")).toBe("ax");
  });

  it("lowercases", () => {
    expect(canonicalizePhoneme("TH")).toBe("th");
  });

  it("returns null for empty input", () => {
    expect(canonicalizePhoneme("")).toBeNull();
    expect(canonicalizePhoneme("   ")).toBeNull();
  });
});

describe("extractPhonemeBreakdown", () => {
  it("reads the Azure raw shape (phoneme_scores)", () => {
    const row = {
      word_scores: null,
      phoneme_scores: [
        {
          Word: "this",
          Phonemes: [
            { Phoneme: "th", AccuracyScore: 80 },
            { Phoneme: "ih", AccuracyScore: 92 },
          ],
        },
      ],
    };
    expect(extractPhonemeBreakdown(row)).toEqual([
      { phoneme: "th", score: 80 },
      { phoneme: "ih", score: 92 },
    ]);
  });

  it("reads the local-scorer shape (word_scores[].phonemes)", () => {
    const row = {
      phoneme_scores: null,
      word_scores: [
        { word: "go", phonemes: [{ phoneme: "g", score: 70 }] },
      ],
    };
    expect(extractPhonemeBreakdown(row)).toEqual([
      { phoneme: "g", score: 70 },
    ]);
  });

  it("clamps scores into 0..100", () => {
    const row = {
      word_scores: null,
      phoneme_scores: [
        { Word: "x", Phonemes: [{ Phoneme: "th", AccuracyScore: 150 }] },
        { Word: "y", Phonemes: [{ Phoneme: "th", AccuracyScore: -20 }] },
      ],
    };
    const out = extractPhonemeBreakdown(row);
    expect(out[0].score).toBe(100);
    expect(out[1].score).toBe(0);
  });

  it("ignores malformed entries instead of throwing", () => {
    const row = {
      word_scores: null,
      phoneme_scores: [
        null,
        "not-an-object",
        { Phonemes: "also-bad" },
        { Phonemes: [{ Phoneme: "", AccuracyScore: 50 }] },
        { Phonemes: [{ Phoneme: "th", AccuracyScore: "high" }] },
        { Phonemes: [{ Phoneme: "th", AccuracyScore: 75 }] },
      ],
    };
    expect(extractPhonemeBreakdown(row)).toEqual([
      { phoneme: "th", score: 75 },
    ]);
  });
});

describe("aggregatePhonemeStats", () => {
  it("rolls multiple attempts up by canonical phoneme", () => {
    const rows = [
      {
        word_scores: null,
        phoneme_scores: [
          { Phonemes: [{ Phoneme: "th", AccuracyScore: 80 }] },
        ],
      },
      {
        word_scores: null,
        phoneme_scores: [
          { Phonemes: [{ Phoneme: "θ", AccuracyScore: 60 }] }, // alias of "th"
        ],
      },
    ];
    const stats = aggregatePhonemeStats(rows);
    const th = stats.find((s) => s.phoneme === "th");
    expect(th).toBeDefined();
    expect(th?.attemptCount).toBe(2);
    expect(th?.averageScore).toBe(70);
  });

  it("returns an empty array for zero rows", () => {
    expect(aggregatePhonemeStats([])).toEqual([]);
  });
});

describe("CANONICAL_PHONEMES", () => {
  it("matches the brief — 32 sounds", () => {
    expect(CANONICAL_PHONEMES.length).toBe(32);
  });

  it("contains the Vietnamese-trouble phonemes", () => {
    for (const expected of ["th", "dh", "r", "l", "ng", "ae"]) {
      expect(CANONICAL_PHONEMES).toContain(expected);
    }
  });
});
