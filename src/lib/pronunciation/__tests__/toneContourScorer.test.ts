import { describe, expect, it } from "vitest";

import {
  flatPitchSamples,
  fallingPitchSamples,
  noisyRisingPitchSamples,
  risingPitchSamples,
  sparsePitchSamples,
} from "../__fixtures__/toneContourFixtures";
import { scoreToneContour } from "../toneContourScorer";

describe("scoreToneContour", () => {
  it("matches rising expected with rising observed pitch", () => {
    const result = scoreToneContour({
      expectedContour: "rising",
      samples: risingPitchSamples,
    });

    expect(result.bucket).toBe("match");
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    expect(result.reason).toBe("rising-contour-match");
  });

  it("mismatches rising expected with falling observed pitch", () => {
    const result = scoreToneContour({
      expectedContour: "rising",
      samples: fallingPitchSamples,
    });

    expect(result.bucket).toBe("mismatch");
    expect(result.score).toBeLessThanOrEqual(35);
    expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    expect(result.reason).toBe("expected-rising-observed-falling");
  });

  it("matches falling expected with falling observed pitch", () => {
    const result = scoreToneContour({
      expectedContour: "falling",
      samples: fallingPitchSamples,
    });

    expect(result.bucket).toBe("match");
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    expect(result.reason).toBe("falling-contour-match");
  });

  it("mismatches falling expected with rising observed pitch", () => {
    const result = scoreToneContour({
      expectedContour: "falling",
      samples: risingPitchSamples,
    });

    expect(result.bucket).toBe("mismatch");
    expect(result.score).toBeLessThanOrEqual(35);
    expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    expect(result.reason).toBe("expected-falling-observed-rising");
  });

  it("keeps flat expected contours uncertain", () => {
    const result = scoreToneContour({
      expectedContour: "flat",
      samples: flatPitchSamples,
    });

    expect(result.bucket).toBe("uncertain");
    expect(result.score).toBe(0);
    expect(result.confidence).toBeLessThan(0.5);
    expect(result.reason).toBe("flat-contour-not-claimed");
  });

  it("keeps sparse and null-heavy pitch evidence uncertain", () => {
    const result = scoreToneContour({
      expectedContour: "rising",
      samples: sparsePitchSamples,
    });

    expect(result.bucket).toBe("uncertain");
    expect(result.score).toBe(0);
    expect(result.confidence).toBeLessThan(0.5);
    expect(result.reason).toBe("insufficient-pitch-evidence");
  });

  it("keeps unknown expected contours uncertain", () => {
    const result = scoreToneContour({
      expectedContour: "unknown",
      samples: risingPitchSamples,
    });

    expect(result.bucket).toBe("uncertain");
    expect(result.score).toBe(0);
    expect(result.confidence).toBe(0);
    expect(result.reason).toBe("expected-contour-unknown");
  });

  it("accepts noisy but trend-correct rising contours", () => {
    const result = scoreToneContour({
      expectedContour: "rising",
      samples: noisyRisingPitchSamples,
    });

    expect(result.bucket).toBe("match");
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.confidence).toBeGreaterThanOrEqual(0.65);
    expect(result.reason).toBe("rising-contour-match");
  });
});
