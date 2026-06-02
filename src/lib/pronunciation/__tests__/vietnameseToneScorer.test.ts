import { describe, expect, it } from "vitest";

import {
  fallingPitchContour,
  levelPitchContour,
  lowConfidencePitchContour,
  lowVoicingPitchContour,
  risingPitchContour,
  sparsePitchContour,
  vietnameseToneTargets,
} from "../__fixtures__/vietnameseToneContourFixtures";
import {
  classifyVietnameseToneContour,
  normalizePitchContour,
  scoreVietnameseToneAttempt,
} from "../vietnameseToneScorer";

describe("normalizePitchContour", () => {
  it("sorts samples and normalizes voiced f0 values around the median", () => {
    const normalized = normalizePitchContour({
      samples: [
        { timeMs: 200, f0Hz: 220, confidence: 0.8 },
        { timeMs: 0, f0Hz: 180, confidence: 0.7 },
        { timeMs: 100, f0Hz: null, confidence: 0.1 },
      ],
      durationMs: 200,
      voicedRatio: 0.8,
      medianF0Hz: 200,
      extractionConfidence: 0.9,
      reason: "ok",
    });

    expect(normalized.samples.map((sample) => sample.timeMs)).toEqual([0, 100, 200]);
    expect(normalized.samples.map((sample) => sample.f0Hz)).toEqual([0.9, null, 1.1]);
    expect(normalized.medianF0Hz).toBe(1);
  });
});

describe("classifyVietnameseToneContour", () => {
  it("classifies a synthetic rising contour", () => {
    expect(classifyVietnameseToneContour(risingPitchContour)).toBe("rising");
  });

  it("classifies a synthetic falling contour", () => {
    expect(classifyVietnameseToneContour(fallingPitchContour)).toBe("falling");
  });

  it("classifies a synthetic level contour", () => {
    expect(classifyVietnameseToneContour(levelPitchContour)).toBe("level");
  });

  it("returns unknown for sparse and null-heavy contours", () => {
    expect(classifyVietnameseToneContour(sparsePitchContour)).toBe("unknown");
  });

  it("returns unknown for low voiced ratio contours", () => {
    expect(classifyVietnameseToneContour(lowVoicingPitchContour)).toBe("unknown");
  });

  it("returns unknown for low extraction confidence contours", () => {
    expect(classifyVietnameseToneContour(lowConfidencePitchContour)).toBe("unknown");
  });
});

describe("scoreVietnameseToneAttempt", () => {
  it("scores sac plus a confident rising contour as close", () => {
    const result = scoreVietnameseToneAttempt({
      contour: risingPitchContour,
      target: vietnameseToneTargets.sac,
    });

    expect(result.bucket).toBe("close");
    expect(result.reason).toBe("contour-match");
    expect(result.observedContour).toBe("rising");
    expect(result.score).not.toBeNull();
  });

  it("scores sac plus a confident falling contour as not close", () => {
    const result = scoreVietnameseToneAttempt({
      contour: fallingPitchContour,
      target: vietnameseToneTargets.sac,
    });

    expect(result.bucket).toBe("not_close");
    expect(result.reason).toBe("contour-mismatch");
    expect(result.observedContour).toBe("falling");
  });

  it("scores huyen plus a confident falling contour as close", () => {
    const result = scoreVietnameseToneAttempt({
      contour: fallingPitchContour,
      target: vietnameseToneTargets.huyen,
    });

    expect(result.bucket).toBe("close");
    expect(result.reason).toBe("contour-match");
    expect(result.observedContour).toBe("falling");
  });

  it("scores huyen plus a confident rising contour as not close", () => {
    const result = scoreVietnameseToneAttempt({
      contour: risingPitchContour,
      target: vietnameseToneTargets.huyen,
    });

    expect(result.bucket).toBe("not_close");
    expect(result.reason).toBe("contour-mismatch");
    expect(result.observedContour).toBe("rising");
  });

  it("scores ngang plus a confident level contour as close", () => {
    const result = scoreVietnameseToneAttempt({
      contour: levelPitchContour,
      target: vietnameseToneTargets.ngang,
    });

    expect(result.bucket).toBe("close");
    expect(result.reason).toBe("contour-match");
    expect(result.observedContour).toBe("level");
  });

  it("returns unclear for sparse and null-heavy contour evidence", () => {
    const result = scoreVietnameseToneAttempt({
      contour: sparsePitchContour,
      target: vietnameseToneTargets.sac,
    });

    expect(result.bucket).toBe("unclear");
    expect(result.reason).toBe("insufficient-pitch-evidence");
    expect(result.score).toBeNull();
  });

  it("returns unclear for low voiced ratio", () => {
    const result = scoreVietnameseToneAttempt({
      contour: lowVoicingPitchContour,
      target: vietnameseToneTargets.sac,
    });

    expect(result.bucket).toBe("unclear");
    expect(result.reason).toBe("insufficient-pitch-evidence");
  });

  it("returns unclear for low extraction confidence", () => {
    const result = scoreVietnameseToneAttempt({
      contour: lowConfidencePitchContour,
      target: vietnameseToneTargets.sac,
    });

    expect(result.bucket).toBe("unclear");
    expect(result.reason).toBe("low-confidence");
  });

  it.each(["hoi", "nga", "nang"] as const)(
    "keeps %s unsupported for the MVP and returns unclear",
    (tone) => {
      const result = scoreVietnameseToneAttempt({
        contour: risingPitchContour,
        target: vietnameseToneTargets[tone],
      });

      expect(result.bucket).toBe("unclear");
      expect(result.reason).toBe("unsupported-tone-for-mvp");
      expect(result.score).toBeNull();
    },
  );
});
