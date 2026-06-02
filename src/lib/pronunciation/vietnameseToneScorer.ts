type VietnameseToneId = "sac" | "huyen" | "ngang" | "hoi" | "nga" | "nang";

type VietnameseToneBucket = "close" | "not_close" | "unclear";

type VietnameseObservedContour = "rising" | "falling" | "level" | "unknown";

interface PitchContourSample {
  timeMs: number;
  f0Hz: number | null;
  confidence: number;
}

export interface ExtractedPitchContour {
  samples: PitchContourSample[];
  durationMs: number;
  voicedRatio: number;
  medianF0Hz: number | null;
  extractionConfidence: number;
  reason?: "ok" | "no-audio" | "decode-failed" | "too-short" | "insufficient-voicing";
}

export interface VietnameseToneTarget {
  syllable: string;
  tone: VietnameseToneId;
  expectedContour: "rising" | "falling" | "level" | "unsupported";
}

interface VietnameseToneScore {
  bucket: VietnameseToneBucket;
  score: number | null;
  confidence: number;
  target: VietnameseToneTarget;
  observedContour: VietnameseObservedContour;
  reason:
    | "contour-match"
    | "contour-mismatch"
    | "low-confidence"
    | "insufficient-pitch-evidence"
    | "unsupported-tone-for-mvp"
    | "audio-unavailable";
  learnerContour: PitchContourSample[];
  normalizedLearnerContour: PitchContourSample[];
}

const MIN_USABLE_SAMPLES = 4;
const MIN_VOICED_RATIO = 0.45;
const MIN_EXTRACTION_CONFIDENCE = 0.5;
const MIN_SAMPLE_CONFIDENCE = 0.45;
const LEVEL_DELTA_RATIO = 0.045;
const CONTOUR_DELTA_RATIO = 0.09;

export function normalizePitchContour(contour: ExtractedPitchContour): ExtractedPitchContour {
  const medianF0Hz = contour.medianF0Hz && contour.medianF0Hz > 0 ? contour.medianF0Hz : null;
  const samples = [...contour.samples]
    .sort((left, right) => left.timeMs - right.timeMs)
    .map((sample) => ({
      timeMs: sample.timeMs,
      f0Hz: sample.f0Hz !== null && medianF0Hz !== null ? sample.f0Hz / medianF0Hz : null,
      confidence: clamp01(sample.confidence),
    }));

  return {
    ...contour,
    samples,
    voicedRatio: clamp01(contour.voicedRatio),
    medianF0Hz: medianF0Hz === null ? null : 1,
    extractionConfidence: clamp01(contour.extractionConfidence),
  };
}

export function classifyVietnameseToneContour(contour: ExtractedPitchContour): VietnameseObservedContour {
  const normalized = normalizePitchContour(contour);
  if (!hasEnoughPitchEvidence(normalized)) {
    return "unknown";
  }

  const voicedSamples = normalized.samples.filter(
    (sample) => sample.f0Hz !== null && sample.confidence >= MIN_SAMPLE_CONFIDENCE,
  ) as Array<PitchContourSample & { f0Hz: number }>;

  if (voicedSamples.length < MIN_USABLE_SAMPLES) {
    return "unknown";
  }

  const splitPoint = Math.max(1, Math.floor(voicedSamples.length / 3));
  const start = averageF0(voicedSamples.slice(0, splitPoint));
  const end = averageF0(voicedSamples.slice(-splitPoint));
  if (start === null || end === null) {
    return "unknown";
  }

  const delta = end - start;
  if (Math.abs(delta) <= LEVEL_DELTA_RATIO) {
    return "level";
  }
  if (delta >= CONTOUR_DELTA_RATIO) {
    return "rising";
  }
  if (delta <= -CONTOUR_DELTA_RATIO) {
    return "falling";
  }

  return "unknown";
}

export function scoreVietnameseToneAttempt(input: {
  contour: ExtractedPitchContour;
  target: VietnameseToneTarget;
}): VietnameseToneScore {
  const normalized = normalizePitchContour(input.contour);
  const observedContour = classifyVietnameseToneContour(input.contour);

  if (input.target.expectedContour === "unsupported") {
    return buildScore(input, normalized, observedContour, "unclear", null, "unsupported-tone-for-mvp");
  }

  if (input.contour.reason === "no-audio" || input.contour.reason === "decode-failed") {
    return buildScore(input, normalized, observedContour, "unclear", null, "audio-unavailable");
  }

  if (input.contour.extractionConfidence < MIN_EXTRACTION_CONFIDENCE) {
    return buildScore(input, normalized, observedContour, "unclear", null, "low-confidence");
  }

  if (observedContour === "unknown") {
    return buildScore(input, normalized, observedContour, "unclear", null, "insufficient-pitch-evidence");
  }

  if (observedContour === input.target.expectedContour) {
    return buildScore(input, normalized, observedContour, "close", contourScore(normalized), "contour-match");
  }

  return buildScore(input, normalized, observedContour, "not_close", contourScore(normalized), "contour-mismatch");
}

function hasEnoughPitchEvidence(contour: ExtractedPitchContour): boolean {
  if (contour.voicedRatio < MIN_VOICED_RATIO || contour.extractionConfidence < MIN_EXTRACTION_CONFIDENCE) {
    return false;
  }

  const usableSamples = contour.samples.filter(
    (sample) => sample.f0Hz !== null && sample.confidence >= MIN_SAMPLE_CONFIDENCE,
  );
  return usableSamples.length >= MIN_USABLE_SAMPLES;
}

function contourScore(contour: ExtractedPitchContour): number {
  const usableConfidence = contour.samples
    .filter((sample) => sample.f0Hz !== null)
    .map((sample) => sample.confidence);
  const sampleConfidence =
    usableConfidence.length === 0
      ? 0
      : usableConfidence.reduce((total, confidence) => total + confidence, 0) / usableConfidence.length;

  return roundToTwoDecimals(
    clamp01(0.45 * contour.extractionConfidence + 0.35 * contour.voicedRatio + 0.2 * sampleConfidence),
  );
}

function buildScore(
  input: { contour: ExtractedPitchContour; target: VietnameseToneTarget },
  normalized: ExtractedPitchContour,
  observedContour: VietnameseObservedContour,
  bucket: VietnameseToneBucket,
  score: number | null,
  reason: VietnameseToneScore["reason"],
): VietnameseToneScore {
  return {
    bucket,
    score,
    confidence: score ?? roundToTwoDecimals(clamp01(input.contour.extractionConfidence)),
    target: input.target,
    observedContour,
    reason,
    learnerContour: input.contour.samples,
    normalizedLearnerContour: normalized.samples,
  };
}

function averageF0(samples: Array<PitchContourSample & { f0Hz: number }>): number | null {
  if (samples.length === 0) {
    return null;
  }

  return samples.reduce((total, sample) => total + sample.f0Hz, 0) / samples.length;
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(1, value));
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
