// WP-001 — lookup-table predictor: deterministic, bounded, versioned, no ML.
import { describe, it, expect } from "vitest";
import { predictOutcome, predictionRowId } from "@/lib/tm-int/pred/predictor";
import { PREDICTOR_VERSION, type TurnFeatures } from "@/lib/tm-int/pred/types";

const base: TurnFeatures = { correctionStatus: "corrected", issueCount: 0, ruleId: "l1:x", cefrBucket: "C", isCurrentLessonTarget: false };

describe("WP-001: lookup-table predictor", () => {
  it("is deterministic and versioned", () => {
    const a = predictOutcome(base);
    const b = predictOutcome(base);
    expect(a).toStrictEqual(b);
    expect(a.predictorVersion).toBe(PREDICTOR_VERSION);
  });

  it("bounds pResolve and confidence to [0,1] and derives label from pResolve", () => {
    const cases: TurnFeatures[] = [
      base,
      { ...base, correctionStatus: "unchanged", issueCount: 5, cefrBucket: "A" },
      { ...base, correctionStatus: "needs_ai", issueCount: 2, cefrBucket: "B" },
      { ...base, correctionStatus: "abstained", issueCount: 3, cefrBucket: "A" },
    ];
    for (const features of cases) {
      const p = predictOutcome(features);
      expect(p.outcome.pResolve).toBeGreaterThanOrEqual(0);
      expect(p.outcome.pResolve).toBeLessThanOrEqual(1);
      expect(p.confidence).toBeGreaterThanOrEqual(0);
      expect(p.confidence).toBeLessThanOrEqual(1);
      expect(p.outcome.label).toBe(p.outcome.pResolve >= 0.5 ? "resolve" : "repeat");
    }
  });

  it("current-lesson-target nudges resolution up but stays bounded", () => {
    const off = predictOutcome({ ...base, isCurrentLessonTarget: false });
    const on = predictOutcome({ ...base, isCurrentLessonTarget: true });
    expect(on.outcome.pResolve).toBeGreaterThanOrEqual(off.outcome.pResolve);
    expect(on.outcome.pResolve).toBeLessThanOrEqual(1);
  });

  it("row id is stable per turn address + predictor version", () => {
    const addr = { sessionId: "s", turnIndex: 3, msgId: "m3" };
    expect(predictionRowId(addr, PREDICTOR_VERSION)).toBe(predictionRowId(addr, PREDICTOR_VERSION));
    expect(predictionRowId(addr, PREDICTOR_VERSION)).not.toBe(predictionRowId({ ...addr, turnIndex: 4 }, PREDICTOR_VERSION));
  });
});
