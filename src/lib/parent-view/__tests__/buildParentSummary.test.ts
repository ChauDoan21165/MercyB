import { describe, expect, it } from "vitest";

import type { LocalWeaknessMap } from "@/lib/stage-3a/aggregator";
import { buildParentSummary } from "../buildParentSummary";

function mapFixture(overrides: Partial<LocalWeaknessMap> = {}): LocalWeaknessMap {
  return {
    topL1Patterns: [],
    placementWeaknesses: [],
    topPronunciationPainPoints: [],
    isEmpty: false,
    generatedAt: 0,
    ...overrides,
  };
}

describe("buildParentSummary", () => {
  it("filters grammar patterns below the report-to-parent threshold (X3=B)", () => {
    const map = mapFixture({
      topL1Patterns: [
        { tag: "vi_l1_3rd_person_s", count: 6, lastSeen: 100 },
        { tag: "vi_l1_past_ed", count: 3, lastSeen: 90 },
      ],
    });
    const summary = buildParentSummary(map, { reportThreshold: 5 });
    const grammar = summary.categories.find((c) => c.config.id === "grammar")!;
    const keys = grammar.items.map((i) => i.key);
    expect(keys).toContain("grammar:vi_l1_3rd_person_s");
    expect(keys).not.toContain("grammar:vi_l1_past_ed");
  });

  it("carries both qualitative and numeric payloads (Q5=C)", () => {
    const map = mapFixture({
      topL1Patterns: [{ tag: "vi_l1_3rd_person_s", count: 8, lastSeen: 1 }],
    });
    const summary = buildParentSummary(map, { reportThreshold: 5 });
    const item = summary.categories
      .find((c) => c.config.id === "grammar")!
      .items[0];
    expect(item.qualitativeVi.length).toBeGreaterThan(0);
    expect(item.qualitativeEn.length).toBeGreaterThan(0);
    expect(item.numeric.count).toBe(8);
    expect(item.numeric.severity).toBeDefined();
  });

  it("passes placement weaknesses through (engine-vetted, no count filter)", () => {
    const map = mapFixture({
      placementWeaknesses: [
        { tag: "final_consonant_cluster_reduction", severity: "high" },
      ],
    });
    const summary = buildParentSummary(map, { reportThreshold: 99 });
    const placement = summary.categories.find(
      (c) => c.config.id === "placement",
    )!;
    expect(placement.items).toHaveLength(1);
    expect(placement.items[0].numeric.severity).toBe("high");
  });

  it("thresholds pronunciation on sample count", () => {
    const map = mapFixture({
      topPronunciationPainPoints: [
        { axis: "TH_T", errorRate: 0.4, samples: 6 },
        { axis: "R_L", errorRate: 0.5, samples: 3 },
      ],
    });
    const summary = buildParentSummary(map, { reportThreshold: 5 });
    const pron = summary.categories.find(
      (c) => c.config.id === "pronunciation",
    )!;
    const keys = pron.items.map((i) => i.key);
    expect(keys).toContain("pron:TH_T");
    expect(keys).not.toContain("pron:R_L");
    // error rate rounded to nearest 10% for the drill-in
    expect(pron.items[0].numeric.errorRatePct).toBe(40);
  });

  it("builds a descriptive headline naming the lead pattern (Q9=A)", () => {
    const map = mapFixture({
      topL1Patterns: [{ tag: "vi_l1_3rd_person_s", count: 7, lastSeen: 1 }],
    });
    const summary = buildParentSummary(map, {
      reportThreshold: 5,
      learnerName: "Linh",
    });
    expect(summary.headlineVi).toContain("Linh");
    expect(summary.headlineEn).toContain("Linh");
    // descriptive only — no attribution / forecast clause yet (L5-PENDING)
    expect(summary.attributionClauseVi).toBeNull();
    expect(summary.attributionClauseEn).toBeNull();
  });

  it("reports empty when nothing clears the bar", () => {
    const map = mapFixture({
      topL1Patterns: [{ tag: "vi_l1_past_ed", count: 1, lastSeen: 1 }],
      isEmpty: false,
    });
    const summary = buildParentSummary(map, { reportThreshold: 5 });
    expect(summary.isEmpty).toBe(true);
    expect(summary.headlineVi).toContain("Con bạn");
  });

  it("uses neutral fallback names when none provided", () => {
    const summary = buildParentSummary(mapFixture({ isEmpty: true }));
    expect(summary.headlineVi).toContain("Con bạn");
    expect(summary.headlineEn).toContain("Your learner");
  });
});
