import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { recordPronunciationPhonemes, type PronunciationRecentEntry } from "../pronunciation-recent";

const KEY = "mb.stage3a.pronunciation.recent";

describe("recordPronunciationPhonemes", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => window.localStorage.clear());

  it("writes per-phoneme entries with the expected shape", () => {
    recordPronunciationPhonemes(
      [{ phoneme: "th", score: 65 }, { phoneme: "r", score: 82 }],
      1_779_700_000_000,
    );
    const stored = JSON.parse(window.localStorage.getItem(KEY)!) as PronunciationRecentEntry[];
    expect(stored).toEqual([
      { phoneme: "th", score: 65, t: 1_779_700_000_000 },
      { phoneme: "r", score: 82, t: 1_779_700_000_000 },
    ]);
  });

  it("appends across attempts and trims to cap (30)", () => {
    for (let i = 0; i < 18; i++) {
      recordPronunciationPhonemes(
        [{ phoneme: `p${i}_a`, score: 70 }, { phoneme: `p${i}_b`, score: 80 }],
        1_779_700_000_000 + i,
      );
    }
    const stored = JSON.parse(window.localStorage.getItem(KEY)!) as PronunciationRecentEntry[];
    expect(stored).toHaveLength(30);
    // First 36 - 30 = 6 evicted → entry 0 has p3_a (3*2=6th total entry).
    expect(stored[0].phoneme).toBe("p3_a");
    expect(stored[29].phoneme).toBe("p17_b");
  });

  it("ignores empty or malformed input", () => {
    recordPronunciationPhonemes([]);
    expect(window.localStorage.getItem(KEY)).toBeNull();
    recordPronunciationPhonemes([
      { phoneme: "", score: 50 },                            // rejected: empty phoneme
      { phoneme: "good", score: 75 },                        // kept
      { phoneme: "bad", score: NaN as unknown as number },   // rejected: NaN not finite
    ] as Array<{ phoneme: string; score: number }>);
    const stored = JSON.parse(window.localStorage.getItem(KEY)!) as PronunciationRecentEntry[];
    expect(stored.map((e) => e.phoneme)).toEqual(["good"]);
  });
});
