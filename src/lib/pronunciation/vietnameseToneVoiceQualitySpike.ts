import { normalizePitchContour, type ExtractedPitchContour } from "./vietnameseToneScorer";

export const VIETNAMESE_TONE_VOICE_QUALITY_SPIKE_FEATURE_KEY =
  "pronunciation.en_vn_tone_feedback_mvp";

export type VietnameseUnsupportedTone = "hoi" | "nga" | "nang";

export type VietnameseToneVoiceQualityDecision =
  | "disabled"
  | "insufficient_evidence"
  | "keep_abstention"
  | "candidate_for_review";

export interface VietnameseToneVoiceQualitySpikeInput {
  enabled: boolean;
  tone: VietnameseUnsupportedTone;
  samples: Float32Array | readonly number[];
  sampleRate: number;
  contour: ExtractedPitchContour | null;
  heldOutValidated?: boolean;
}

export interface VietnameseToneVoiceQualitySpikeResult {
  tone: VietnameseUnsupportedTone;
  featureKey: typeof VIETNAMESE_TONE_VOICE_QUALITY_SPIKE_FEATURE_KEY;
  decision: VietnameseToneVoiceQualityDecision;
  confidence: number;
  reasons: string[];
  evidence: {
    dipConfidence: number;
    creakConfidence: number;
    shortLowDropConfidence: number;
    durationMs: number;
    intensityDropRatio: number;
  };
}

const MIN_SAMPLE_RATE = 8_000;
const MIN_DURATION_MS = 120;
const MIN_PROMOTION_CONFIDENCE = 0.86;

export function analyzeVietnameseToneVoiceQualitySpike(
  input: VietnameseToneVoiceQualitySpikeInput,
): VietnameseToneVoiceQualitySpikeResult {
  const base = buildBaseResult(input);
  if (!input.enabled) {
    return {
      ...base,
      decision: "disabled",
      reasons: ["flag-disabled"],
    };
  }

  if (!isUsableAudio(input.samples, input.sampleRate) || !input.contour) {
    return {
      ...base,
      decision: "insufficient_evidence",
      reasons: ["missing-audio-or-contour"],
    };
  }

  const durationMs = (input.samples.length / input.sampleRate) * 1000;
  if (durationMs < MIN_DURATION_MS || input.contour.reason !== "ok") {
    return {
      ...base,
      decision: "insufficient_evidence",
      reasons: ["low-quality-audio"],
      evidence: {
        ...base.evidence,
        durationMs: round(durationMs),
      },
    };
  }

  const evidence = {
    dipConfidence: dipConfidence(input.contour),
    creakConfidence: creakConfidence(input.samples, input.sampleRate),
    shortLowDropConfidence: shortLowDropConfidence(input.samples, input.sampleRate, input.contour),
    durationMs: round(durationMs),
    intensityDropRatio: intensityDropRatio(input.samples),
  };
  const confidence = confidenceForTone(input.tone, evidence);
  const reasons = reasonsForTone(input.tone, evidence);

  if (!input.heldOutValidated) {
    return {
      ...base,
      decision: "keep_abstention",
      confidence,
      reasons: [...reasons, "held-out-validation-required"],
      evidence,
    };
  }

  if (confidence >= MIN_PROMOTION_CONFIDENCE) {
    return {
      ...base,
      decision: "candidate_for_review",
      confidence,
      reasons,
      evidence,
    };
  }

  return {
    ...base,
    decision: "keep_abstention",
    confidence,
    reasons: [...reasons, "below-trust-floor"],
    evidence,
  };
}

function buildBaseResult(input: VietnameseToneVoiceQualitySpikeInput): VietnameseToneVoiceQualitySpikeResult {
  return {
    tone: input.tone,
    featureKey: VIETNAMESE_TONE_VOICE_QUALITY_SPIKE_FEATURE_KEY,
    decision: "keep_abstention",
    confidence: 0,
    reasons: [],
    evidence: {
      dipConfidence: 0,
      creakConfidence: 0,
      shortLowDropConfidence: 0,
      durationMs: 0,
      intensityDropRatio: 0,
    },
  };
}

function isUsableAudio(samples: Float32Array | readonly number[], sampleRate: number): boolean {
  return samples.length > 0 && Number.isFinite(sampleRate) && sampleRate >= MIN_SAMPLE_RATE;
}

function dipConfidence(contour: ExtractedPitchContour): number {
  const normalized = normalizePitchContour(contour);
  const voiced = normalized.samples.filter(
    (sample): sample is typeof sample & { f0Hz: number } =>
      sample.f0Hz !== null && sample.confidence >= 0.55,
  );
  if (voiced.length < 5 || normalized.extractionConfidence < 0.65) return 0;

  const third = Math.max(1, Math.floor(voiced.length / 3));
  const start = average(voiced.slice(0, third).map((sample) => sample.f0Hz));
  const middle = average(voiced.slice(third, voiced.length - third).map((sample) => sample.f0Hz));
  const end = average(voiced.slice(-third).map((sample) => sample.f0Hz));
  const dipDepth = Math.min(start - middle, end - middle);
  const recovery = end - middle;
  if (dipDepth <= 0.06 || recovery <= 0.05) return 0;
  return round01(Math.min(1, (dipDepth / 0.18) * 0.65 + normalized.extractionConfidence * 0.35));
}

function creakConfidence(samples: Float32Array | readonly number[], sampleRate: number): number {
  const frameSize = Math.max(80, Math.round(sampleRate * 0.025));
  const hopSize = Math.max(40, Math.round(sampleRate * 0.0125));
  const rmsValues: number[] = [];
  const zeroCrossingValues: number[] = [];

  for (let offset = 0; offset + frameSize <= samples.length; offset += hopSize) {
    rmsValues.push(rms(samples, offset, frameSize));
    zeroCrossingValues.push(zeroCrossingRate(samples, offset, frameSize));
  }
  if (rmsValues.length < 4) return 0;

  const rmsVariation = coefficientOfVariation(rmsValues);
  const zcrVariation = coefficientOfVariation(zeroCrossingValues);
  const lowZcrRatio = zeroCrossingValues.filter((value) => value < 0.06).length / zeroCrossingValues.length;
  const score = rmsVariation * 0.42 + zcrVariation * 0.38 + lowZcrRatio * 0.2;
  return round01(Math.min(1, score));
}

function shortLowDropConfidence(
  samples: Float32Array | readonly number[],
  sampleRate: number,
  contour: ExtractedPitchContour,
): number {
  const durationMs = (samples.length / sampleRate) * 1000;
  const normalized = normalizePitchContour(contour);
  const voiced = normalized.samples.filter(
    (sample): sample is typeof sample & { f0Hz: number } =>
      sample.f0Hz !== null && sample.confidence >= 0.55,
  );
  if (voiced.length < 4 || durationMs > 520) return 0;

  const finalThird = voiced.slice(-Math.max(1, Math.floor(voiced.length / 3)));
  const finalF0 = average(finalThird.map((sample) => sample.f0Hz));
  const lowEnding = finalF0 < 0.96 ? Math.min(1, (0.96 - finalF0) / 0.18) : 0;
  const drop = intensityDropRatio(samples);
  const durationScore = Math.max(0, Math.min(1, (520 - durationMs) / 320));
  return round01(Math.min(1, lowEnding * 0.4 + drop * 0.38 + durationScore * 0.22));
}

function confidenceForTone(
  tone: VietnameseUnsupportedTone,
  evidence: VietnameseToneVoiceQualitySpikeResult["evidence"],
): number {
  if (tone === "hoi") return evidence.dipConfidence;
  if (tone === "nga") return evidence.creakConfidence;
  return evidence.shortLowDropConfidence;
}

function reasonsForTone(
  tone: VietnameseUnsupportedTone,
  evidence: VietnameseToneVoiceQualitySpikeResult["evidence"],
): string[] {
  if (tone === "hoi") return evidence.dipConfidence > 0 ? ["dip-contour-evidence"] : ["no-dip-contour-evidence"];
  if (tone === "nga") return evidence.creakConfidence > 0 ? ["creak-proxy-evidence"] : ["no-creak-proxy-evidence"];
  return evidence.shortLowDropConfidence > 0 ? ["short-low-drop-evidence"] : ["no-short-low-drop-evidence"];
}

function intensityDropRatio(samples: Float32Array | readonly number[]): number {
  const windowSize = Math.max(1, Math.floor(samples.length / 4));
  const early = rms(samples, 0, windowSize);
  const late = rms(samples, samples.length - windowSize, windowSize);
  if (early <= 0) return 0;
  return round01(Math.max(0, Math.min(1, (early - late) / early)));
}

function rms(samples: Float32Array | readonly number[], offset: number, frameSize: number): number {
  let total = 0;
  for (let index = 0; index < frameSize; index += 1) {
    const sample = samples[offset + index] ?? 0;
    total += sample * sample;
  }
  return Math.sqrt(total / frameSize);
}

function zeroCrossingRate(samples: Float32Array | readonly number[], offset: number, frameSize: number): number {
  let crossings = 0;
  let previous = samples[offset] ?? 0;
  for (let index = 1; index < frameSize; index += 1) {
    const current = samples[offset + index] ?? 0;
    if ((previous < 0 && current >= 0) || (previous >= 0 && current < 0)) crossings += 1;
    previous = current;
  }
  return crossings / Math.max(1, frameSize - 1);
}

function coefficientOfVariation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = average(values);
  if (mean <= 0) return 0;
  const variance = values.reduce((total, value) => total + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance) / mean;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function round01(value: number): number {
  return Math.round(Math.max(0, Math.min(1, value)) * 100) / 100;
}
