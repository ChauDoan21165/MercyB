/**
 * Stage 3A aggregator — unit tests.
 *
 * Covers the eight scenarios from the Day 3 dispatch plus a handful
 * of boundary cases. Drives `aggregateLocalWeaknesses` end-to-end —
 * i.e. through the real adapters, with localStorage stubbed via
 * vitest's `happy-dom` window. No mocking of the adapters
 * themselves; the contract under test is the composition.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  PRONUNCIATION_RECENT_KEY,
  recordPronunciationPhonemes,
  type PhonemeResult,
} from "../adapters/pronunciationAdapter";
import { recordL1Tag } from "../adapters/l1TagAdapter";
import {
  recordPlacementSnapshot,
  type PlacementSnapshot,
} from "../adapters/placementSnapshotAdapter";
import { aggregateLocalWeaknesses } from "../aggregator";

const L1_KEY = "mb.stage3a.l1.recent";
const PLACEMENT_KEY = "mb.stage3a.placement.snapshot";

function clearAllStage3aKeys(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(L1_KEY);
  window.localStorage.removeItem(PLACEMENT_KEY);
  window.localStorage.removeItem(PRONUNCIATION_RECENT_KEY);
}

beforeEach(() => clearAllStage3aKeys());
afterEach(() => clearAllStage3aKeys());

function buildSnapshot(overrides: Partial<PlacementSnapshot> = {}): PlacementSnapshot {
  return {
    cefr: "B1",
    weaknesses: ["article_omission", "question_no_aux"],
    completedAt: Date.UTC(2026, 4, 1),
    sessionId: "sess-test-1",
    ...overrides,
  };
}

function recordPhonemes(samples: Array<Partial<PhonemeResult>>): void {
  const valid: PhonemeResult[] = samples.map((s, i) => ({
    phoneme: s.phoneme ?? "th",
    accuracy: typeof s.accuracy === "number" ? s.accuracy : 50,
    ts: typeof s.ts === "number" ? s.ts : Date.UTC(2026, 4, 1) + i * 1000,
    ...(s.painPointAxis ? { painPointAxis: s.painPointAxis } : {}),
  }));
  recordPronunciationPhonemes(valid);
}

// ─────────────────────────────────────────────────────────────────────────
// Scenarios 1-5: combinations of populated / empty sources
// ─────────────────────────────────────────────────────────────────────────

describe("aggregateLocalWeaknesses — source-combination matrix", () => {
  it("(1) all three sources populated → returns top-N from each", () => {
    recordL1Tag("vi_l1_3rd_person_s", 1_000);
    recordL1Tag("vi_l1_past_ed", 2_000);
    recordPlacementSnapshot(buildSnapshot());
    recordPhonemes([
      { phoneme: "th", accuracy: 40 },
      { phoneme: "th", accuracy: 50 },
      { phoneme: "th", accuracy: 60 },
    ]);

    const map = aggregateLocalWeaknesses();

    expect(map.topL1Patterns.length).toBe(2);
    expect(map.placementWeaknesses.length).toBe(2);
    expect(map.topPronunciationPainPoints.length).toBe(1);
    expect(map.isEmpty).toBe(false);
    expect(map.generatedAt).toBeGreaterThan(0);
  });

  it("(2) only L1 populated → returns L1 only, others empty arrays", () => {
    recordL1Tag("vi_l1_missing_be", 1_000);
    recordL1Tag("vi_l1_missing_be", 2_000);

    const map = aggregateLocalWeaknesses();

    expect(map.topL1Patterns).toEqual([
      { tag: "vi_l1_missing_be", count: 2, lastSeen: 2_000 },
    ]);
    expect(map.placementWeaknesses).toEqual([]);
    expect(map.topPronunciationPainPoints).toEqual([]);
    expect(map.isEmpty).toBe(false);
  });

  it("(3) only placement populated → returns placement only", () => {
    recordPlacementSnapshot(
      buildSnapshot({ weaknesses: ["past_ed_omission", "plural_s_omission"] }),
    );

    const map = aggregateLocalWeaknesses();

    expect(map.topL1Patterns).toEqual([]);
    expect(map.placementWeaknesses).toEqual([
      { tag: "past_ed_omission", severity: "medium" },
      { tag: "plural_s_omission", severity: "medium" },
    ]);
    expect(map.topPronunciationPainPoints).toEqual([]);
    expect(map.isEmpty).toBe(false);
  });

  it("(4) only pronunciation populated → returns pronunciation only", () => {
    recordPhonemes([
      { phoneme: "r", accuracy: 30 },
      { phoneme: "r", accuracy: 30 },
      { phoneme: "r", accuracy: 30 },
    ]);

    const map = aggregateLocalWeaknesses();

    expect(map.topL1Patterns).toEqual([]);
    expect(map.placementWeaknesses).toEqual([]);
    expect(map.topPronunciationPainPoints).toHaveLength(1);
    expect(map.topPronunciationPainPoints[0]).toMatchObject({
      axis: "r",
      samples: 3,
    });
    expect(map.topPronunciationPainPoints[0].errorRate).toBeCloseTo(0.7, 5);
    expect(map.isEmpty).toBe(false);
  });

  it("(5) all empty → isEmpty=true, all arrays empty", () => {
    const map = aggregateLocalWeaknesses();

    expect(map.topL1Patterns).toEqual([]);
    expect(map.placementWeaknesses).toEqual([]);
    expect(map.topPronunciationPainPoints).toEqual([]);
    expect(map.isEmpty).toBe(true);
    expect(map.generatedAt).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Scenarios 6-7: ranking + min-samples gates
// ─────────────────────────────────────────────────────────────────────────

describe("aggregateLocalWeaknesses — ranking + gating", () => {
  it("(6) L1 sort: 3 tags with counts (5, 2, 8) → returns sorted desc", () => {
    // Build counts deterministically: 5x past_ed, 2x missing_be, 8x plural_s.
    for (let i = 0; i < 5; i++) recordL1Tag("vi_l1_past_ed", 100 + i);
    for (let i = 0; i < 2; i++) recordL1Tag("vi_l1_missing_be", 200 + i);
    for (let i = 0; i < 8; i++) recordL1Tag("vi_l1_plural_s", 300 + i);

    const map = aggregateLocalWeaknesses();

    expect(map.topL1Patterns.map((p) => `${p.tag}:${p.count}`)).toEqual([
      "vi_l1_plural_s:8",
      "vi_l1_past_ed:5",
      "vi_l1_missing_be:2",
    ]);
  });

  it("L1 top-N cap: 6 unique tags → only top 5 returned", () => {
    const tags = [
      "vi_l1_3rd_person_s",
      "vi_l1_past_ed",
      "vi_l1_plural_s",
      "vi_l1_missing_be",
      "vi_l1_question_no_aux",
      "vi_l1_double_negative",
    ] as const;
    tags.forEach((tag, i) => {
      // Make tag i fire (i+1) times so ranking is deterministic.
      for (let k = 0; k <= i; k++) recordL1Tag(tag, i * 100 + k);
    });

    const map = aggregateLocalWeaknesses();

    expect(map.topL1Patterns.length).toBe(5);
    // Lowest-firing tag (`vi_l1_3rd_person_s`, 1 hit) must be excluded.
    expect(map.topL1Patterns.find((p) => p.tag === "vi_l1_3rd_person_s")).toBeUndefined();
  });

  it("(7) pronunciation requires ≥3 samples per axis → axis with 2 samples is excluded", () => {
    recordPhonemes([
      // `th` has 2 samples — should be excluded.
      { phoneme: "th", accuracy: 40 },
      { phoneme: "th", accuracy: 40 },
      // `r` has 3 samples — should be included.
      { phoneme: "r", accuracy: 50 },
      { phoneme: "r", accuracy: 50 },
      { phoneme: "r", accuracy: 50 },
    ]);

    const map = aggregateLocalWeaknesses();

    expect(map.topPronunciationPainPoints).toHaveLength(1);
    expect(map.topPronunciationPainPoints[0].axis).toBe("r");
    expect(map.topPronunciationPainPoints[0].samples).toBe(3);
  });

  it("pronunciation sort: two qualifying axes ranked by errorRate desc", () => {
    recordPhonemes([
      // `th`: mean 30 → errorRate 0.7
      { phoneme: "th", accuracy: 30 },
      { phoneme: "th", accuracy: 30 },
      { phoneme: "th", accuracy: 30 },
      // `r`: mean 80 → errorRate 0.2
      { phoneme: "r", accuracy: 80 },
      { phoneme: "r", accuracy: 80 },
      { phoneme: "r", accuracy: 80 },
    ]);

    const map = aggregateLocalWeaknesses();

    expect(map.topPronunciationPainPoints.map((p) => p.axis)).toEqual(["th", "r"]);
  });

  it("pronunciation groups by painPointAxis when present", () => {
    recordPhonemes([
      // Three samples with painPointAxis TH_T — should aggregate
      // under TH_T even though phoneme varies.
      { phoneme: "θ", accuracy: 40, painPointAxis: "TH_T" },
      { phoneme: "t", accuracy: 40, painPointAxis: "TH_T" },
      { phoneme: "θ", accuracy: 40, painPointAxis: "TH_T" },
    ]);

    const map = aggregateLocalWeaknesses();

    expect(map.topPronunciationPainPoints).toHaveLength(1);
    expect(map.topPronunciationPainPoints[0].axis).toBe("TH_T");
    expect(map.topPronunciationPainPoints[0].samples).toBe(3);
  });

  it("pronunciation top-N cap: 4 qualifying axes → only top 3 returned", () => {
    const phonemes = [
      ["th", 10], // errorRate 0.9
      ["r", 20],  // 0.8
      ["l", 30],  // 0.7
      ["s", 40],  // 0.6 → excluded
    ] as const;
    for (const [ph, acc] of phonemes) {
      for (let i = 0; i < 3; i++) recordPhonemes([{ phoneme: ph, accuracy: acc }]);
    }

    const map = aggregateLocalWeaknesses();

    expect(map.topPronunciationPainPoints.map((p) => p.axis)).toEqual(["th", "r", "l"]);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Scenario 8: malformed-storage tolerance
// ─────────────────────────────────────────────────────────────────────────

describe("aggregateLocalWeaknesses — corrupted-storage tolerance", () => {
  it("(8) malformed L1 JSON → L1 returns [], other sources still work", () => {
    window.localStorage.setItem(L1_KEY, "{not valid json");
    recordPlacementSnapshot(buildSnapshot());

    const map = aggregateLocalWeaknesses();

    expect(map.topL1Patterns).toEqual([]);
    expect(map.placementWeaknesses).toHaveLength(2);
    expect(map.isEmpty).toBe(false);
  });

  it("malformed placement JSON → placement [] , L1 still works", () => {
    window.localStorage.setItem(PLACEMENT_KEY, "<<<corrupt>>>");
    recordL1Tag("vi_l1_3rd_person_s", 1_000);

    const map = aggregateLocalWeaknesses();

    expect(map.placementWeaknesses).toEqual([]);
    expect(map.topL1Patterns).toHaveLength(1);
  });

  it("malformed pronunciation JSON → pronunciation [], L1 still works", () => {
    window.localStorage.setItem(PRONUNCIATION_RECENT_KEY, "garbage");
    recordL1Tag("vi_l1_past_ed", 1_000);

    const map = aggregateLocalWeaknesses();

    expect(map.topPronunciationPainPoints).toEqual([]);
    expect(map.topL1Patterns).toHaveLength(1);
  });

  it("L1 entries with wrong shape are filtered by the adapter, count uses only valid entries", () => {
    // Adapter's safeRead filters malformed entries; the aggregator
    // counts only what comes through. Mix one valid + one invalid.
    const blob = JSON.stringify([
      { tag: "vi_l1_3rd_person_s", ts: 100 },
      { tag: 42, ts: 200 }, // invalid — tag isn't a string
      { tag: "vi_l1_past_ed", ts: 300 },
    ]);
    window.localStorage.setItem(L1_KEY, blob);

    const map = aggregateLocalWeaknesses();

    expect(map.topL1Patterns.map((p) => p.tag).sort()).toEqual([
      "vi_l1_3rd_person_s",
      "vi_l1_past_ed",
    ]);
  });

  it("pronunciation entries with bad accuracy are filtered, count = valid only", () => {
    const blob = JSON.stringify([
      { phoneme: "th", accuracy: 50, ts: 1 },
      { phoneme: "th", accuracy: "bad", ts: 2 }, // invalid
      { phoneme: "th", accuracy: 50, ts: 3 },
      { phoneme: "th", accuracy: 50, ts: 4 },
    ]);
    window.localStorage.setItem(PRONUNCIATION_RECENT_KEY, blob);

    const map = aggregateLocalWeaknesses();

    // 3 valid samples → meets the min-samples gate.
    expect(map.topPronunciationPainPoints).toHaveLength(1);
    expect(map.topPronunciationPainPoints[0].samples).toBe(3);
  });
});
