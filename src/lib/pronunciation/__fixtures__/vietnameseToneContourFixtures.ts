import type { ExtractedPitchContour, VietnameseToneTarget } from "../vietnameseToneScorer";

export const vietnameseToneTargets = {
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

export const risingPitchContour: ExtractedPitchContour = buildSyntheticContour([180, 184, 190, 199, 211, 225]);

export const fallingPitchContour: ExtractedPitchContour = buildSyntheticContour([224, 214, 204, 194, 185, 176]);

export const levelPitchContour: ExtractedPitchContour = buildSyntheticContour([199, 201, 200, 202, 200, 201]);

export const sparsePitchContour: ExtractedPitchContour = {
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
};

export const lowVoicingPitchContour: ExtractedPitchContour = {
  ...risingPitchContour,
  voicedRatio: 0.2,
  reason: "insufficient-voicing",
};

export const lowConfidencePitchContour: ExtractedPitchContour = {
  ...risingPitchContour,
  extractionConfidence: 0.25,
};

function buildSyntheticContour(f0HzValues: number[]): ExtractedPitchContour {
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
