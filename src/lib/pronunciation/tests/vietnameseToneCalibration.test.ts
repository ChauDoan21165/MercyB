import { describe, expect, it } from "vitest";

import { type ExtractedPitchContour, type VietnameseToneTarget } from "../vietnameseToneScorer";
import {
  DEFAULT_VIETNAMESE_TONE_CALIBRATION_POLICY,
  type VietnameseToneCalibrationReference,
  runVietnameseToneCalibration,
} from "../vietnameseToneCalibration";

const TARGETS = {
  sac: {
    syllable: "ma",
    tone: "sac",
    expectedContour: "rising",
  },
  huyen: {
    syllable: "ma",
    tone: "huyen",
    expectedContour: "falling",
  },
  ngang: {
    syllable: "ma",
    tone: "ngang",
    expectedContour: "level",
  },
  hoi: {
    syllable: "ma",
    tone: "hoi",
    expectedContour: "unsupported",
  },
  nga: {
    syllable: "ma",
    tone: "nga",
    expectedContour: "unsupported",
  },
  nang: {
    syllable: "ma",
    tone: "nang",
    expectedContour: "unsupported",
  },
} satisfies Record<string, VietnameseToneTarget>;

describe("runVietnameseToneCalibration", () => {
  it("keeps the calibration policy conservative and thresholded", () => {
    expect(DEFAULT_VIETNAMESE_TONE_CALIBRATION_POLICY).toEqual({
      minCleanSupportedAccuracy: 0.9,
      requireAmbiguousAbstention: true,
      requireUnsupportedAbstention: true,
    });
  });

  it("passes clean supported contours when they meet the >=90% accuracy threshold", () => {
    const report = runVietnameseToneCalibration(buildCalibrationReferences());

    expect(report.cleanSupportedTotal).toBe(9);
    expect(report.cleanSupportedAccuracy).toBeGreaterThanOrEqual(0.9);
    expect(report.cleanSupportedCorrect).toBeGreaterThanOrEqual(Math.ceil(9 * 0.9));
    expect(report.passed).toBe(true);
  });

  it("treats ambiguous or low-quality references as passing only when the scorer abstains", () => {
    const report = runVietnameseToneCalibration(buildCalibrationReferences());

    expect(report.ambiguousTotal).toBe(3);
    expect(report.ambiguousAbstained).toBe(report.ambiguousTotal);
    expect(
      report.caseResults
        .filter((result) => result.kind === "ambiguous_or_low_quality")
        .every((result) => result.bucket === "unclear"),
    ).toBe(true);
  });

  it("keeps hoi, nga, and nang unsupported/unclear in calibration runs", () => {
    const report = runVietnameseToneCalibration(buildCalibrationReferences());

    expect(report.unsupportedTotal).toBe(3);
    expect(report.unsupportedAbstained).toBe(3);
    expect(
      report.caseResults
        .filter((result) => result.kind === "unsupported")
        .every((result) => result.reason === "unsupported-tone-for-mvp"),
    ).toBe(true);
  });

  it("fails calibration when a confident wrong supported contour is slotted in", () => {
    const report = runVietnameseToneCalibration([
      {
        id: "wrong-expected-contour",
        kind: "clean_supported",
        target: TARGETS.sac,
        expectedContour: "falling",
        contour: buildContour([180, 186, 194, 205, 218, 232]),
      },
    ]);

    expect(report.cleanSupportedAccuracy).toBe(0);
    expect(report.passed).toBe(false);
    expect(report.caseResults[0]).toMatchObject({
      passed: false,
      bucket: "close",
      observedContour: "rising",
    });
  });
});

function buildCalibrationReferences(): VietnameseToneCalibrationReference[] {
  return [
    ...cleanSupportedReferences(),
    {
      id: "sparse-null-heavy",
      kind: "ambiguous_or_low_quality",
      target: TARGETS.sac,
      contour: {
        samples: [
          { timeMs: 0, f0Hz: null, confidence: 0 },
          { timeMs: 80, f0Hz: 188, confidence: 0.9 },
          { timeMs: 160, f0Hz: null, confidence: 0 },
          { timeMs: 240, f0Hz: 194, confidence: 0.25 },
        ],
        durationMs: 300,
        voicedRatio: 0.25,
        medianF0Hz: 191,
        extractionConfidence: 0.65,
        reason: "insufficient-voicing",
      },
    },
    {
      id: "low-confidence",
      kind: "ambiguous_or_low_quality",
      target: TARGETS.sac,
      contour: {
        ...buildContour([180, 186, 194, 205, 218, 232]),
        extractionConfidence: 0.25,
      },
    },
    {
      id: "no-audio",
      kind: "ambiguous_or_low_quality",
      target: TARGETS.sac,
      contour: {
        samples: [],
        durationMs: 0,
        voicedRatio: 0,
        medianF0Hz: null,
        extractionConfidence: 0,
        reason: "no-audio",
      },
    },
    ...(["hoi", "nga", "nang"] as const).map((tone) => ({
      id: `unsupported-${tone}`,
      kind: "unsupported" as const,
      target: TARGETS[tone],
      contour: buildContour([180, 186, 194, 205, 218, 232]),
    })),
  ];
}

function cleanSupportedReferences(): VietnameseToneCalibrationReference[] {
  return [
    {
      id: "sac-rising-a",
      kind: "clean_supported",
      target: TARGETS.sac,
      expectedContour: "rising",
      contour: buildContour([180, 186, 194, 205, 218, 232]),
    },
    {
      id: "sac-rising-b",
      kind: "clean_supported",
      target: TARGETS.sac,
      expectedContour: "rising",
      contour: buildContour([170, 177, 186, 197, 207, 218]),
    },
    {
      id: "sac-rising-c",
      kind: "clean_supported",
      target: TARGETS.sac,
      expectedContour: "rising",
      contour: buildContour([210, 216, 225, 236, 247, 258]),
    },
    {
      id: "huyen-falling-a",
      kind: "clean_supported",
      target: TARGETS.huyen,
      expectedContour: "falling",
      contour: buildContour([232, 219, 207, 196, 186, 178]),
    },
    {
      id: "huyen-falling-b",
      kind: "clean_supported",
      target: TARGETS.huyen,
      expectedContour: "falling",
      contour: buildContour([218, 208, 198, 188, 178, 170]),
    },
    {
      id: "huyen-falling-c",
      kind: "clean_supported",
      target: TARGETS.huyen,
      expectedContour: "falling",
      contour: buildContour([258, 247, 236, 225, 216, 210]),
    },
    {
      id: "ngang-level-a",
      kind: "clean_supported",
      target: TARGETS.ngang,
      expectedContour: "level",
      contour: buildContour([180, 181, 180, 182, 181, 180]),
    },
    {
      id: "ngang-level-b",
      kind: "clean_supported",
      target: TARGETS.ngang,
      expectedContour: "level",
      contour: buildContour([205, 206, 205, 207, 206, 205]),
    },
    {
      id: "ngang-level-c",
      kind: "clean_supported",
      target: TARGETS.ngang,
      expectedContour: "level",
      contour: buildContour([235, 234, 235, 236, 235, 234]),
    },
  ];
}

function buildContour(f0HzValues: number[]): ExtractedPitchContour {
  return {
    samples: f0HzValues.map((f0Hz, index) => ({
      timeMs: index * 70,
      f0Hz,
      confidence: 0.92,
    })),
    durationMs: (f0HzValues.length - 1) * 70,
    voicedRatio: 1,
    medianF0Hz: median(f0HzValues),
    extractionConfidence: 0.95,
    reason: "ok",
  };
}

function median(values: number[]): number {
  const sorted = [...values].sort((left, right) => left - right);
  const midpoint = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[midpoint - 1] + sorted[midpoint]) / 2;
  }
  return sorted[midpoint];
}
