import { describe, expect, it } from "vitest";

import {
  PINNED_FEEDBACK_PROBE,
  ROTATING_CORRECTION_PROBES,
  SEEDED_CORRECTION_PROBES,
  selectSeededCorrectionProbe,
  selectSeededCorrectionProbes,
} from "../prod-synthetic-learner/seededCorrectionProbes";

describe("prod synthetic correction seed rotation", () => {
  it("covers flagship Vietnamese-L1 and generic non-flagship LPI paths", () => {
    expect(SEEDED_CORRECTION_PROBES).toHaveLength(4);

    expect(SEEDED_CORRECTION_PROBES).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sentence: "She happy today.",
          expectedDetector: "en-vn-copula-be-adjective",
          expectedShadowPath: "target_form_correct_now",
        }),
        expect.objectContaining({
          expectedDetector: "en-step6-discuss-about",
          expectedShadowPath: "generic_form_defer",
        }),
        expect.objectContaining({
          expectedDetector: "ai-correction",
          expectedShadowPath: "generic_form_defer",
        }),
      ]),
    );
    expect(new Set(SEEDED_CORRECTION_PROBES.map((probe) => probe.expectedDetector)).size).toBe(4);
  });

  it("pins one immediate-correction seed while rotating the rest", () => {
    expect(PINNED_FEEDBACK_PROBE.id).toBe("vi-l1-missing-be-copula");
    expect(PINNED_FEEDBACK_PROBE.expectedShadowPath).toBe("target_form_correct_now");
    expect(ROTATING_CORRECTION_PROBES).not.toContain(PINNED_FEEDBACK_PROBE);
  });

  it("rotates deterministically by UTC hour bucket and always includes the pinned immediate seed", () => {
    const base = Date.UTC(2026, 6, 12, 0, 0, 0);

    expect(selectSeededCorrectionProbe(new Date(base)).id).toBe(ROTATING_CORRECTION_PROBES[0].id);
    expect(selectSeededCorrectionProbe(new Date(base + 60 * 60 * 1000)).id).toBe(ROTATING_CORRECTION_PROBES[1].id);
    expect(selectSeededCorrectionProbe(new Date(base + 2 * 60 * 60 * 1000)).id).toBe(ROTATING_CORRECTION_PROBES[2].id);
    expect(selectSeededCorrectionProbe(new Date(base + 3 * 60 * 60 * 1000)).id).toBe(ROTATING_CORRECTION_PROBES[0].id);

    for (let hour = 0; hour < 6; hour += 1) {
      const probes = selectSeededCorrectionProbes(new Date(base + hour * 60 * 60 * 1000));
      expect(probes).toHaveLength(2);
      expect(probes[1]).toBe(PINNED_FEEDBACK_PROBE);
      expect(probes.some((probe) => probe.expectedShadowPath === "target_form_correct_now")).toBe(true);
    }
  });
});
