import { describe, expect, it } from "vitest";

import {
  computePatternTrend,
  LEARNER_PATTERN_TREND_EVIDENCE_FLOOR,
} from "../trend";

describe("learner-profile-write pattern trend", () => {
  it("abstains below the evidence floor", () => {
    expect(computePatternTrend(1, 0, 2, 0)).toBe("insufficient");
    expect(LEARNER_PATTERN_TREND_EVIDENCE_FLOOR).toBe(5);
  });

  it("marks worsening only once enough evidence exists", () => {
    expect(computePatternTrend(4, 1, 5, 1)).toBe("worsening");
  });
});
