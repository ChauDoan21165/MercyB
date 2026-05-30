export type ExpectedToneContour = "rising" | "falling" | "flat" | "unknown";

export interface PitchSample {
  t: number;
  pitchHz: number | null;
}

export type ToneContourBucket = "match" | "mismatch" | "uncertain";

export interface ToneContourScoreResult {
  score: number;
  confidence: number;
  bucket: ToneContourBucket;
  reason: string;
}

export interface ScoreToneContourInput {
  expectedContour: ExpectedToneContour;
  samples: PitchSample[];
}

type ObservedContour = "rising" | "falling" | "flat" | "unknown";

interface ValidPitchSample {
  t: number;
  pitchHz: number;
}

const MIN_VALID_SAMPLES = 4;
const MIN_VOICED_RATIO = 0.6;
const MIN_TREND_RATIO = 0.08;
const FLAT_TREND_RATIO = 0.04;
const MIN_RANGE_RATIO = 0.05;

export function scoreToneContour(input: ScoreToneContourInput): ToneContourScoreResult {
  if (input.expectedContour === "unknown") {
    return uncertain("expected-contour-unknown", 0);
  }

  if (input.expectedContour === "flat") {
    return uncertain("flat-contour-not-claimed", 0.25);
  }

  const validSamples = normalizeSamples(input.samples);
  const voicedRatio =
    input.samples.length === 0 ? 0 : validSamples.length / input.samples.length;

  if (validSamples.length < MIN_VALID_SAMPLES || voicedRatio < MIN_VOICED_RATIO) {
    return uncertain("insufficient-pitch-evidence", confidenceFromVoicing(voicedRatio));
  }

  const observed = inferObservedContour(validSamples);
  if (observed.contour === "flat" || observed.contour === "unknown") {
    return uncertain(observed.reason, observed.confidence);
  }

  const matches = observed.contour === input.expectedContour;
  if (matches) {
    return {
      bucket: "match",
      score: scoreForMagnitude(observed.trendMagnitude, true),
      confidence: observed.confidence,
      reason: `${input.expectedContour}-contour-match`,
    };
  }

  return {
    bucket: "mismatch",
    score: scoreForMagnitude(observed.trendMagnitude, false),
    confidence: observed.confidence,
    reason: `expected-${input.expectedContour}-observed-${observed.contour}`,
  };
}

function normalizeSamples(samples: PitchSample[]): ValidPitchSample[] {
  return samples
    .filter((sample): sample is ValidPitchSample =>
      Number.isFinite(sample.t) &&
      typeof sample.pitchHz === "number" &&
      Number.isFinite(sample.pitchHz) &&
      sample.pitchHz > 0,
    )
    .sort((a, b) => a.t - b.t);
}

function inferObservedContour(samples: ValidPitchSample[]): {
  contour: ObservedContour;
  confidence: number;
  reason: string;
  trendMagnitude: number;
} {
  const pitchValues = samples.map((sample) => sample.pitchHz);
  const baseline = median(pitchValues);
  if (baseline <= 0) {
    return {
      contour: "unknown",
      confidence: 0,
      reason: "invalid-pitch-baseline",
      trendMagnitude: 0,
    };
  }

  const edgeCount = Math.max(2, Math.ceil(samples.length / 3));
  const start = median(samples.slice(0, edgeCount).map((sample) => sample.pitchHz));
  const end = median(samples.slice(-edgeCount).map((sample) => sample.pitchHz));
  const trendRatio = (end - start) / baseline;
  const trendMagnitude = Math.abs(trendRatio);
  const rangeRatio = (Math.max(...pitchValues) - Math.min(...pitchValues)) / baseline;

  if (trendMagnitude < FLAT_TREND_RATIO || rangeRatio < MIN_RANGE_RATIO) {
    return {
      contour: "flat",
      confidence: confidenceFromTrend(trendMagnitude, rangeRatio),
      reason: "flat-or-weak-contour",
      trendMagnitude,
    };
  }

  if (trendMagnitude < MIN_TREND_RATIO) {
    return {
      contour: "unknown",
      confidence: confidenceFromTrend(trendMagnitude, rangeRatio),
      reason: "ambiguous-contour",
      trendMagnitude,
    };
  }

  return {
    contour: trendRatio > 0 ? "rising" : "falling",
    confidence: confidenceFromTrend(trendMagnitude, rangeRatio),
    reason: trendRatio > 0 ? "observed-rising-contour" : "observed-falling-contour",
    trendMagnitude,
  };
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const midpoint = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[midpoint];
  return (sorted[midpoint - 1] + sorted[midpoint]) / 2;
}

function confidenceFromVoicing(voicedRatio: number): number {
  return clamp01(voicedRatio * 0.45);
}

function confidenceFromTrend(trendMagnitude: number, rangeRatio: number): number {
  const trendConfidence = (trendMagnitude - FLAT_TREND_RATIO) / 0.14;
  const rangeConfidence = (rangeRatio - MIN_RANGE_RATIO) / 0.18;
  return clamp01(0.45 + Math.min(trendConfidence, rangeConfidence) * 0.5);
}

function scoreForMagnitude(trendMagnitude: number, matches: boolean): number {
  const scaled = clamp01((trendMagnitude - MIN_TREND_RATIO) / 0.18);
  if (matches) return Math.round(82 + scaled * 16);
  return Math.round(30 - scaled * 18);
}

function uncertain(reason: string, confidence: number): ToneContourScoreResult {
  return {
    bucket: "uncertain",
    score: 0,
    confidence: clamp01(confidence),
    reason,
  };
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Number(value.toFixed(3));
}
