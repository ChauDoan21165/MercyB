import { describe, expect, it } from "vitest";

import {
  SEEDED_CORRECTION_PROBES,
  selectSeededCorrectionProbe,
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

  it("rotates deterministically by UTC hour bucket", () => {
    const base = Date.UTC(2026, 6, 12, 0, 0, 0);

    expect(selectSeededCorrectionProbe(new Date(base)).id).toBe(SEEDED_CORRECTION_PROBES[0].id);
    expect(selectSeededCorrectionProbe(new Date(base + 60 * 60 * 1000)).id).toBe(SEEDED_CORRECTION_PROBES[1].id);
    expect(selectSeededCorrectionProbe(new Date(base + 2 * 60 * 60 * 1000)).id).toBe(SEEDED_CORRECTION_PROBES[2].id);
    expect(selectSeededCorrectionProbe(new Date(base + 3 * 60 * 60 * 1000)).id).toBe(SEEDED_CORRECTION_PROBES[3].id);
    expect(selectSeededCorrectionProbe(new Date(base + 4 * 60 * 60 * 1000)).id).toBe(SEEDED_CORRECTION_PROBES[0].id);
  });
});
