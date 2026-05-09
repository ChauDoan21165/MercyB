// src/lib/__tests__/vstepScoreEstimator.test.ts

import { describe, it, expect } from "vitest";
import { estimateVstepScore, VSTEP_SKILL_CONFIGS } from "../vstepScoreEstimator";

describe("VSTEP_SKILL_CONFIGS", () => {
  it("defines all 4 skills", () => {
    const keys = Object.keys(VSTEP_SKILL_CONFIGS);
    expect(keys).toContain("listening");
    expect(keys).toContain("reading");
    expect(keys).toContain("writing");
    expect(keys).toContain("speaking");
  });

  it("each skill has a positive maxRaw", () => {
    for (const config of Object.values(VSTEP_SKILL_CONFIGS)) {
      expect(config.maxRaw).toBeGreaterThan(0);
      expect(config.label.length).toBeGreaterThan(0);
      expect(config.label_vi.length).toBeGreaterThan(0);
    }
  });
});

describe("estimateVstepScore", () => {
  it("returns C1 for perfect scores across all skills", () => {
    const result = estimateVstepScore({
      listening: { raw: 35 },
      reading: { raw: 40 },
      writing: { raw: 10 },
      speaking: { raw: 10 },
    });
    expect(result.overallBand).toBe("C1");
    expect(result.skills.listening).toBe("C1");
    expect(result.skills.reading).toBe("C1");
    expect(result.skills.writing).toBe("C1");
    expect(result.skills.speaking).toBe("C1");
  });

  it("returns B2 for solid mid-range scores", () => {
    const result = estimateVstepScore({
      listening: { raw: 25 },
      reading: { raw: 28 },
      writing: { raw: 7 },
      speaking: { raw: 7 },
    });
    expect(result.overallBand).toBe("B2");
  });

  it("returns B1 for moderate scores", () => {
    const result = estimateVstepScore({
      listening: { raw: 18 },
      reading: { raw: 20 },
      writing: { raw: 5 },
      speaking: { raw: 5 },
    });
    expect(result.overallBand).toBe("B1");
  });

  it("returns null for very low scores (below B1)", () => {
    const result = estimateVstepScore({
      listening: { raw: 5 },
      reading: { raw: 5 },
      writing: { raw: 2 },
      speaking: { raw: 2 },
    });
    expect(result.overallBand).toBeNull();
  });

  it("handles mixed skill levels correctly", () => {
    const result = estimateVstepScore({
      listening: { raw: 30 }, // C1-level listening
      reading: { raw: 20 },   // B1-level reading
      writing: { raw: 6 },    // B2-level writing
      speaking: { raw: 8 },   // B2-level speaking
    });
    // Average: (8.5 + 5.0 + 6.0 + 8.0) / 4 = 6.875 → B2
    expect(result.skills.listening).toBe("C1");
    expect(result.skills.reading).toBe("B1");
    expect(result.skills.writing).toBe("B2");
    expect(result.skills.speaking).toBe("B2");
    expect(result.overallBand).toBe("B2");
  });

  it("produces non-empty summaries", () => {
    const result = estimateVstepScore({
      listening: { raw: 25 },
      reading: { raw: 28 },
      writing: { raw: 7 },
      speaking: { raw: 7 },
    });
    expect(result.summary_en.length).toBeGreaterThan(10);
    expect(result.summary_vi.length).toBeGreaterThan(10);
    expect(result.summary_en).toContain("B2");
    expect(result.summary_vi).toContain("B2");
  });
});
