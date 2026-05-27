/**
 * Stage 3B — Suggested Practice engine unit tests.
 *
 * Pure-function tests — no localStorage, no fake clocks, no adapters.
 * The engine takes a `Stage3AState` (= `LocalWeaknessMap`) literal and
 * returns a deterministic list.
 */

import { describe, expect, it } from "vitest";

import type { LocalWeaknessMap } from "@/lib/stage-3a/aggregator";

import { selectSuggestedPractice } from "../suggestedPractice";

function makeState(overrides: Partial<LocalWeaknessMap> = {}): LocalWeaknessMap {
  return {
    topL1Patterns: [],
    placementWeaknesses: [],
    topPronunciationPainPoints: [],
    isEmpty: true,
    generatedAt: 0,
    ...overrides,
  };
}

describe("selectSuggestedPractice", () => {
  it("returns [] for an empty Stage 3A state", () => {
    const result = selectSuggestedPractice(makeState());
    expect(result).toEqual([]);
  });

  it("returns one item per kind when all three sources have a signal", () => {
    const state = makeState({
      topL1Patterns: [
        { tag: "vi_l1_3rd_person_s", count: 4, lastSeen: 2_000 },
      ],
      placementWeaknesses: [{ tag: "th_stopping_and_fronting", severity: "medium" }],
      topPronunciationPainPoints: [{ axis: "TH_T", errorRate: 0.6, samples: 5 }],
      isEmpty: false,
    });

    const result = selectSuggestedPractice(state);

    expect(result).toHaveLength(3);
    expect(result.map((i) => i.kind)).toEqual(["l1", "placement", "pronunciation"]);
    expect(result.map((i) => i.sourceTag)).toEqual([
      "vi_l1_3rd_person_s",
      "th_stopping_and_fronting",
      "TH_T",
    ]);
    expect(result.map((i) => i.id)).toEqual([
      "l1:vi_l1_3rd_person_s",
      "placement:th_stopping_and_fronting",
      "pronunciation:TH_T",
    ]);
  });

  it("caps L1 at one item even when many L1 patterns are present (v1 rule)", () => {
    const state = makeState({
      topL1Patterns: [
        { tag: "vi_l1_3rd_person_s", count: 7, lastSeen: 5_000 },
        { tag: "vi_l1_past_ed", count: 5, lastSeen: 4_000 },
        { tag: "vi_l1_plural_s", count: 3, lastSeen: 3_000 },
      ],
      isEmpty: false,
    });

    const result = selectSuggestedPractice(state);

    expect(result).toHaveLength(1);
    expect(result[0].kind).toBe("l1");
    expect(result[0].sourceTag).toBe("vi_l1_3rd_person_s");
  });

  it("picks the head of each pre-sorted source (aggregator order is trusted)", () => {
    // Aggregator sorts pronunciation by errorRate desc — the engine
    // must take element [0]. If a future change re-sorts here, the
    // engine and aggregator will disagree.
    const state = makeState({
      topPronunciationPainPoints: [
        { axis: "TH_T", errorRate: 0.7, samples: 6 },
        { axis: "R_L", errorRate: 0.5, samples: 4 },
      ],
      isEmpty: false,
    });

    const result = selectSuggestedPractice(state);

    expect(result).toHaveLength(1);
    expect(result[0].sourceTag).toBe("TH_T");
  });

  it("is deterministic — same input twice returns identical output", () => {
    const state = makeState({
      topL1Patterns: [{ tag: "vi_l1_missing_be", count: 2, lastSeen: 1_000 }],
      placementWeaknesses: [{ tag: "plural_s_omission", severity: "medium" }],
      topPronunciationPainPoints: [
        { axis: "ED_ENDINGS", errorRate: 0.4, samples: 3 },
      ],
      isEmpty: false,
    });

    const first = selectSuggestedPractice(state);
    const second = selectSuggestedPractice(state);

    expect(second).toEqual(first);
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
  });

  it("resolves VI labels from the taxonomy — no raw engineer tags leak into copy", () => {
    const state = makeState({
      topL1Patterns: [{ tag: "vi_l1_3rd_person_s", count: 2, lastSeen: 1_000 }],
      placementWeaknesses: [{ tag: "th_stopping_and_fronting", severity: "medium" }],
      topPronunciationPainPoints: [{ axis: "R_L", errorRate: 0.5, samples: 3 }],
      isEmpty: false,
    });

    const result = selectSuggestedPractice(state);

    for (const item of result) {
      expect(item.viLabel.length).toBeGreaterThan(0);
      expect(item.enLabel.length).toBeGreaterThan(0);
      // Engineer-tag identifiers (snake_case or UPPER_SNAKE_CASE) must
      // not appear in the learner-facing copy.
      expect(item.viLabel).not.toContain(item.sourceTag);
      expect(item.enLabel).not.toContain(item.sourceTag);
      expect(item.rationale).not.toContain(item.sourceTag);
    }
  });

  it("falls back to the taxonomy's neutral copy for an unknown placement tag", () => {
    const state = makeState({
      placementWeaknesses: [{ tag: "totally_unknown_tag_xyz", severity: "medium" }],
      isEmpty: false,
    });

    const result = selectSuggestedPractice(state);

    expect(result).toHaveLength(1);
    expect(result[0].kind).toBe("placement");
    // Fallback copy from `stage-3a/taxonomy.ts` FALLBACK constant.
    expect(result[0].viLabel).toBe("Một mẫu câu bạn còn đang luyện.");
    expect(result[0].enLabel).toBe("A pattern you're still working on.");
  });

  it("rationale strings are Vietnamese (no EN gamification / shame language)", () => {
    const state = makeState({
      topL1Patterns: [{ tag: "vi_l1_3rd_person_s", count: 3, lastSeen: 1_000 }],
      placementWeaknesses: [{ tag: "plural_s_omission", severity: "medium" }],
      topPronunciationPainPoints: [{ axis: "TH_T", errorRate: 0.5, samples: 4 }],
      isEmpty: false,
    });

    const result = selectSuggestedPractice(state);
    const forbiddenEn = /\b(weakness|fail(ed|ure)?|streak|score|points?|level\s*up|bad|wrong)\b/i;

    for (const item of result) {
      expect(item.rationale).not.toMatch(forbiddenEn);
      expect(item.rationale.length).toBeGreaterThan(0);
    }
  });
});
