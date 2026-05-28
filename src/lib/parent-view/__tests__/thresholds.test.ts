import { describe, expect, it } from "vitest";

import {
  L4_INTERVENTION_THRESHOLD,
  L6_REPORT_TO_PARENT_THRESHOLD,
} from "../thresholds";

describe("parent-view thresholds (X3=B)", () => {
  it("keeps the report-to-parent bar at or above the L4 intervention bar", () => {
    // L6 must be the quieter knob — a parent never hears about a pattern
    // below the engine's own intervention threshold.
    expect(L6_REPORT_TO_PARENT_THRESHOLD).toBeGreaterThanOrEqual(
      L4_INTERVENTION_THRESHOLD,
    );
  });

  it("exposes both knobs as positive integers", () => {
    for (const v of [L4_INTERVENTION_THRESHOLD, L6_REPORT_TO_PARENT_THRESHOLD]) {
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThan(0);
    }
  });
});
