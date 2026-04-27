import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  __clearHeatmapCacheForTests,
  buildHeatmapFromAttempts,
  MIN_HEATMAP_ATTEMPTS,
  phonemeCategory,
  type RawHeatmapAttempt,
} from "../phonemeHeatmap";

const TEST_USER = "user-heatmap-1";
const DAY = 24 * 60 * 60 * 1000;

beforeEach(() => {
  if (typeof sessionStorage !== "undefined") sessionStorage.clear();
});

afterEach(() => {
  __clearHeatmapCacheForTests(TEST_USER);
});

// ── Fixture builders ─────────────────────────────────────────────────────

function attempt(args: {
  daysAgo: number;
  windowEndMs: number;
  phonemes: Array<{ phoneme: string; score: number }>;
  id?: string;
}): RawHeatmapAttempt {
  // windowEndMs is the *exclusive* end of the window; the most-recent
  // in-window day is end - 1. We treat daysAgo=0 as that last day so
  // tests can think in "today, yesterday, …" terms.
  const at = new Date(args.windowEndMs - (args.daysAgo + 1) * DAY);
  return {
    id: args.id ?? `att-${args.daysAgo}-${args.phonemes[0]?.phoneme ?? "x"}`,
    attempted_at: at.toISOString(),
    overall_score: 70,
    target_text: "the cat",
    transcript: "the cat",
    word_scores: null,
    phoneme_scores: [
      {
        Word: "the",
        Phonemes: args.phonemes.map((p) => ({
          Phoneme: p.phoneme,
          AccuracyScore: p.score,
        })),
      },
    ],
  };
}

function makeWindow(): { end: number } {
  // Anchor on a UTC midnight far enough in the past that bucket math
  // is unambiguous regardless of the runner's local TZ.
  return { end: Date.UTC(2026, 3, 27, 0, 0, 0, 0) + DAY };
}

// ── phonemeCategory ──────────────────────────────────────────────────────

describe("phonemeCategory", () => {
  it("classifies canonical vowels as 'vowel'", () => {
    for (const v of ["ae", "ah", "iy", "uw", "ey", "oy", "er"]) {
      expect(phonemeCategory(v)).toBe("vowel");
    }
  });

  it("classifies canonical consonants as 'consonant'", () => {
    for (const c of ["th", "dh", "r", "l", "sh", "ng", "n", "f"]) {
      expect(phonemeCategory(c)).toBe("consonant");
    }
  });

  it("treats unknown symbols as consonants by default", () => {
    expect(phonemeCategory("xyz")).toBe("consonant");
  });
});

// ── buildHeatmapFromAttempts: empty / threshold ─────────────────────────

describe("buildHeatmapFromAttempts — empty signal", () => {
  it("returns null with zero attempts", () => {
    const { end } = makeWindow();
    expect(buildHeatmapFromAttempts([], 30, end)).toBeNull();
  });

  it("returns null when attempts < MIN_HEATMAP_ATTEMPTS", () => {
    const { end } = makeWindow();
    const rows = Array.from({ length: MIN_HEATMAP_ATTEMPTS - 1 }, (_, i) =>
      attempt({
        daysAgo: i,
        windowEndMs: end,
        phonemes: [{ phoneme: "th", score: 70 }],
      }),
    );
    expect(buildHeatmapFromAttempts(rows, 30, end)).toBeNull();
  });

  it("returns null when attempts have no phoneme breakdown", () => {
    const { end } = makeWindow();
    const rows: RawHeatmapAttempt[] = Array.from({ length: 6 }, (_, i) => ({
      id: `r${i}`,
      attempted_at: new Date(end - i * DAY).toISOString(),
      overall_score: 70,
      target_text: "x",
      transcript: "x",
      word_scores: null,
      phoneme_scores: null,
    }));
    expect(buildHeatmapFromAttempts(rows, 30, end)).toBeNull();
  });
});

// ── buildHeatmapFromAttempts: aggregation correctness ───────────────────

describe("buildHeatmapFromAttempts — aggregation", () => {
  it("groups by canonical phoneme and UTC day", () => {
    const { end } = makeWindow();
    const rows: RawHeatmapAttempt[] = [
      attempt({
        daysAgo: 1,
        windowEndMs: end,
        phonemes: [
          { phoneme: "th", score: 80 },
          { phoneme: "ih", score: 90 },
        ],
      }),
      attempt({
        daysAgo: 1,
        windowEndMs: end,
        id: "second",
        phonemes: [{ phoneme: "th", score: 60 }],
      }),
      attempt({
        daysAgo: 2,
        windowEndMs: end,
        phonemes: [{ phoneme: "r", score: 50 }],
      }),
      attempt({
        daysAgo: 3,
        windowEndMs: end,
        phonemes: [{ phoneme: "th", score: 70 }],
      }),
      attempt({
        daysAgo: 4,
        windowEndMs: end,
        phonemes: [{ phoneme: "th", score: 70 }],
      }),
    ];
    const data = buildHeatmapFromAttempts(rows, 30, end);
    expect(data).not.toBeNull();
    if (!data) return;
    expect(data.totalAttempts).toBe(5);
    // /th/ on 1-day-ago: avg(80, 60) = 70, count = 2
    const day1 = data.days[data.days.length - 2]; // most-recent-but-one
    const thCell = data.cells.find(
      (c) => c.phoneme === "th" && c.day === day1,
    );
    expect(thCell?.averageScore).toBe(70);
    expect(thCell?.attemptCount).toBe(2);
  });

  it("sorts phonemes vowels-first then consonants alphabetically", () => {
    const { end } = makeWindow();
    const rows: RawHeatmapAttempt[] = [
      attempt({
        daysAgo: 1,
        windowEndMs: end,
        phonemes: [
          { phoneme: "th", score: 70 }, // consonant
          { phoneme: "ah", score: 70 }, // vowel
          { phoneme: "r", score: 70 },  // consonant
          { phoneme: "iy", score: 70 }, // vowel
        ],
      }),
      attempt({ daysAgo: 2, windowEndMs: end, id: "b", phonemes: [{ phoneme: "th", score: 70 }] }),
      attempt({ daysAgo: 3, windowEndMs: end, id: "c", phonemes: [{ phoneme: "th", score: 70 }] }),
      attempt({ daysAgo: 4, windowEndMs: end, id: "d", phonemes: [{ phoneme: "th", score: 70 }] }),
      attempt({ daysAgo: 5, windowEndMs: end, id: "e", phonemes: [{ phoneme: "th", score: 70 }] }),
    ];
    const data = buildHeatmapFromAttempts(rows, 30, end);
    expect(data).not.toBeNull();
    if (!data) return;
    // Vowels first (ah, iy alphabetical), consonants after (r, th alphabetical).
    expect(data.phonemes).toEqual(["ah", "iy", "r", "th"]);
  });

  it("returns days[] of fixed length covering the requested window", () => {
    const { end } = makeWindow();
    const rows = Array.from({ length: 6 }, (_, i) =>
      attempt({
        daysAgo: i,
        windowEndMs: end,
        phonemes: [{ phoneme: "th", score: 70 }],
      }),
    );
    expect(buildHeatmapFromAttempts(rows, 7, end)?.days.length).toBe(7);
    expect(buildHeatmapFromAttempts(rows, 30, end)?.days.length).toBe(30);
    expect(buildHeatmapFromAttempts(rows, 90, end)?.days.length).toBe(90);
  });

  it("clamps daysBack into [1, 180]", () => {
    const { end } = makeWindow();
    const rows = Array.from({ length: 6 }, (_, i) =>
      attempt({
        daysAgo: i,
        windowEndMs: end,
        phonemes: [{ phoneme: "th", score: 70 }],
      }),
    );
    expect(buildHeatmapFromAttempts(rows, 0, end)?.daysBack).toBe(1);
    expect(buildHeatmapFromAttempts(rows, 1000, end)?.daysBack).toBe(180);
  });

  it("ignores attempts that fall outside the requested window", () => {
    const { end } = makeWindow();
    const rows: RawHeatmapAttempt[] = [
      // In-window: 5 attempts on day 1..5
      ...Array.from({ length: 5 }, (_, i) =>
        attempt({
          daysAgo: i,
          windowEndMs: end,
          id: `in-${i}`,
          phonemes: [{ phoneme: "th", score: 70 }],
        }),
      ),
      // Out-of-window: 50 days ago, but daysBack=7
      attempt({
        daysAgo: 50,
        windowEndMs: end,
        id: "out",
        phonemes: [{ phoneme: "th", score: 70 }],
      }),
    ];
    const data = buildHeatmapFromAttempts(rows, 7, end);
    expect(data).not.toBeNull();
    if (!data) return;
    expect(data.cells.length).toBe(5);
  });

  it("only emits cells where the (phoneme, day) pair has data — sparse", () => {
    const { end } = makeWindow();
    const rows = Array.from({ length: 5 }, (_, i) =>
      attempt({
        daysAgo: i * 2,
        windowEndMs: end,
        phonemes: [{ phoneme: "th", score: 70 }],
      }),
    );
    const data = buildHeatmapFromAttempts(rows, 30, end);
    if (!data) throw new Error("expected data");
    // 5 cells (one per attempt, all distinct days), 30 days, 1 phoneme.
    expect(data.cells.length).toBe(5);
    expect(data.days.length).toBe(30);
    expect(data.phonemes).toEqual(["th"]);
  });
});
