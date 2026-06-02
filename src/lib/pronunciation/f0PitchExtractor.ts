import type { ExtractedPitchContour } from "./vietnameseToneScorer";

export interface F0PitchExtractionInput {
  samples: Float32Array | readonly number[];
  sampleRate: number;
  enabled: boolean;
  frameDurationMs?: number;
  hopDurationMs?: number;
  minF0Hz?: number;
  maxF0Hz?: number;
  minRms?: number;
}

interface PitchFrame {
  timeMs: number;
  f0Hz: number | null;
  confidence: number;
}

const DEFAULT_FRAME_DURATION_MS = 40;
const DEFAULT_HOP_DURATION_MS = 20;
const DEFAULT_MIN_F0_HZ = 70;
const DEFAULT_MAX_F0_HZ = 450;
const DEFAULT_MIN_RMS = 0.008;
const MIN_DURATION_MS = 120;
const MIN_VOICED_RATIO = 0.45;
const MIN_FRAME_CONFIDENCE = 0.5;
const MIN_STABLE_PITCH_RATIO = 0.62;
const MAX_CLIPPED_SAMPLE_RATIO = 0.08;
const CLIPPED_SAMPLE_ABS_THRESHOLD = 0.985;
const OUTLIER_MAX_MEDIAN_RATIO = 0.42;
const UNSTABLE_PAIR_RATIO = 0.28;

export function extractF0PitchContour(input: F0PitchExtractionInput): ExtractedPitchContour {
  if (!input.enabled) {
    return emptyContour("no-audio");
  }

  const samples = input.samples;
  const sampleRate = input.sampleRate;
  if (!Number.isFinite(sampleRate) || sampleRate <= 0 || samples.length === 0) {
    return emptyContour("no-audio");
  }

  const durationMs = (samples.length / sampleRate) * 1000;
  if (durationMs < MIN_DURATION_MS) {
    return {
      ...emptyContour("too-short"),
      durationMs: round(durationMs),
    };
  }

  const frameSize = Math.max(8, Math.round(sampleRate * ((input.frameDurationMs ?? DEFAULT_FRAME_DURATION_MS) / 1000)));
  const hopSize = Math.max(1, Math.round(sampleRate * ((input.hopDurationMs ?? DEFAULT_HOP_DURATION_MS) / 1000)));
  const minF0Hz = input.minF0Hz ?? DEFAULT_MIN_F0_HZ;
  const maxF0Hz = input.maxF0Hz ?? DEFAULT_MAX_F0_HZ;
  const minLag = Math.max(2, Math.floor(sampleRate / maxF0Hz));
  const maxLag = Math.min(frameSize - 2, Math.ceil(sampleRate / minF0Hz));
  const minRms = input.minRms ?? DEFAULT_MIN_RMS;

  if (maxLag <= minLag || frameSize > samples.length) {
    return {
      ...emptyContour("too-short"),
      durationMs: round(durationMs),
    };
  }

  const clippedRatio = clippedSampleRatio(samples);
  if (clippedRatio > MAX_CLIPPED_SAMPLE_RATIO) {
    return {
      ...emptyContour("insufficient-voicing"),
      durationMs: round(durationMs),
    };
  }

  const frameRmsValues = collectFrameRms(samples, frameSize, hopSize);
  const adaptiveMinRms = Math.max(minRms, estimateNoiseAwareMinRms(frameRmsValues));
  const frames: PitchFrame[] = [];
  for (let offset = 0; offset + frameSize <= samples.length; offset += hopSize) {
    const frame = estimateFramePitch(samples, offset, frameSize, sampleRate, minLag, maxLag, adaptiveMinRms);
    frames.push({
      timeMs: round(((offset + frameSize / 2) / sampleRate) * 1000),
      f0Hz: frame.f0Hz,
      confidence: frame.confidence,
    });
  }

  const rawVoicedFrames = frames.filter(
    (frame): frame is PitchFrame & { f0Hz: number } =>
      frame.f0Hz !== null && frame.confidence >= MIN_FRAME_CONFIDENCE,
  );
  const medianRawF0Hz = rawVoicedFrames.length > 0 ? median(rawVoicedFrames.map((frame) => frame.f0Hz)) : null;
  const stableVoicedFrames =
    medianRawF0Hz === null
      ? []
      : rawVoicedFrames.filter(
          (frame) => Math.abs(frame.f0Hz - medianRawF0Hz) / medianRawF0Hz <= OUTLIER_MAX_MEDIAN_RATIO,
        );
  const stableVoicedFrameKeys = new Set(stableVoicedFrames.map((frame) => `${frame.timeMs}:${frame.f0Hz}`));
  const cleanedFrames = frames.map((frame) => {
    if (frame.f0Hz === null || frame.confidence < MIN_FRAME_CONFIDENCE) return frame;
    return stableVoicedFrameKeys.has(`${frame.timeMs}:${frame.f0Hz}`)
      ? frame
      : { ...frame, f0Hz: null, confidence: roundToTwoDecimals(frame.confidence * 0.35) };
  });
  const pitchStability = pitchStabilityFor(stableVoicedFrames);
  const voicedFrames = stableVoicedFrames.filter((frame) => frame.confidence >= MIN_FRAME_CONFIDENCE);
  const voicedRatio = frames.length === 0 ? 0 : voicedFrames.length / frames.length;
  const medianF0Hz = voicedFrames.length > 0 ? median(voicedFrames.map((frame) => frame.f0Hz)) : null;
  const extractionConfidence = extractionConfidenceFor(cleanedFrames, voicedRatio, pitchStability);

  return {
    samples: cleanedFrames,
    durationMs: round(durationMs),
    voicedRatio: roundToTwoDecimals(voicedRatio),
    medianF0Hz: medianF0Hz === null ? null : round(medianF0Hz),
    extractionConfidence,
    reason:
      voicedRatio >= MIN_VOICED_RATIO &&
      pitchStability >= MIN_STABLE_PITCH_RATIO &&
      extractionConfidence >= MIN_FRAME_CONFIDENCE
        ? "ok"
        : "insufficient-voicing",
  };
}

function estimateFramePitch(
  samples: Float32Array | readonly number[],
  offset: number,
  frameSize: number,
  sampleRate: number,
  minLag: number,
  maxLag: number,
  minRms: number,
): { f0Hz: number | null; confidence: number } {
  const rms = rootMeanSquare(samples, offset, frameSize);
  if (rms < minRms) {
    return { f0Hz: null, confidence: 0 };
  }

  const mean = frameMean(samples, offset, frameSize);
  const yin = new Array<number>(maxLag + 1).fill(1);
  let runningSum = 0;
  for (let lag = 1; lag <= maxLag; lag += 1) {
    let difference = 0;
    const limit = frameSize - lag;
    for (let i = 0; i < limit; i += 1) {
      const left = ((samples[offset + i] ?? 0) - mean) * hann(i, frameSize);
      const right = ((samples[offset + i + lag] ?? 0) - mean) * hann(i + lag, frameSize);
      const delta = left - right;
      difference += delta * delta;
    }
    runningSum += difference;
    yin[lag] = runningSum > 0 ? (difference * lag) / runningSum : 1;
  }

  const threshold = 0.14;
  let bestLag = 0;
  for (let lag = minLag; lag <= maxLag; lag += 1) {
    if (yin[lag] >= threshold) continue;
    while (lag + 1 <= maxLag && yin[lag + 1] < yin[lag]) {
      lag += 1;
    }
    bestLag = lag;
    break;
  }

  if (bestLag === 0) {
    let bestDifference = 1;
    for (let lag = minLag; lag <= maxLag; lag += 1) {
      if (yin[lag] < bestDifference) {
        bestDifference = yin[lag];
        bestLag = lag;
      }
    }
    if (bestDifference > 0.32) {
      return { f0Hz: null, confidence: clamp01(1 - bestDifference) };
    }
  }

  const current = yin[bestLag];
  const refinedLag = refineLagWithParabola(
    bestLag,
    bestLag > minLag ? yin[bestLag - 1] : current,
    current,
    bestLag < maxLag ? yin[bestLag + 1] : current,
  );

  return {
    f0Hz: round(sampleRate / refinedLag),
    confidence: roundToTwoDecimals(clamp01(1 - current)),
  };
}

function frameMean(samples: Float32Array | readonly number[], offset: number, frameSize: number): number {
  let total = 0;
  for (let i = 0; i < frameSize; i += 1) {
    total += samples[offset + i] ?? 0;
  }
  return total / frameSize;
}

function refineLagWithParabola(lag: number, previous: number, current: number, next: number): number {
  const denominator = previous - 2 * current + next;
  if (Math.abs(denominator) < 1e-6) return lag;
  const adjustment = 0.5 * (previous - next) / denominator;
  if (!Number.isFinite(adjustment) || Math.abs(adjustment) > 1) return lag;
  return lag + adjustment;
}

function rootMeanSquare(samples: Float32Array | readonly number[], offset: number, frameSize: number): number {
  let total = 0;
  for (let i = 0; i < frameSize; i += 1) {
    const sample = samples[offset + i] ?? 0;
    total += sample * sample;
  }
  return Math.sqrt(total / frameSize);
}

function collectFrameRms(
  samples: Float32Array | readonly number[],
  frameSize: number,
  hopSize: number,
): number[] {
  const values: number[] = [];
  for (let offset = 0; offset + frameSize <= samples.length; offset += hopSize) {
    values.push(rootMeanSquare(samples, offset, frameSize));
  }
  return values;
}

function estimateNoiseAwareMinRms(frameRmsValues: number[]): number {
  if (frameRmsValues.length === 0) return DEFAULT_MIN_RMS;
  const sorted = [...frameRmsValues].sort((left, right) => left - right);
  const lowPercentile = sorted[Math.max(0, Math.floor((sorted.length - 1) * 0.2))] ?? 0;
  const medianRms = median(sorted);
  const hasDistinctNoiseFloor = lowPercentile < medianRms * 0.35;
  const noiseGate = hasDistinctNoiseFloor ? Math.max(lowPercentile * 2.4, medianRms * 0.12) : medianRms * 0.08;
  return round(Math.min(0.08, Math.max(DEFAULT_MIN_RMS, noiseGate)));
}

function clippedSampleRatio(samples: Float32Array | readonly number[]): number {
  let clipped = 0;
  for (const sample of samples) {
    if (Math.abs(sample ?? 0) >= CLIPPED_SAMPLE_ABS_THRESHOLD) clipped += 1;
  }
  return samples.length === 0 ? 0 : clipped / samples.length;
}

function pitchStabilityFor(voicedFrames: Array<PitchFrame & { f0Hz: number }>): number {
  if (voicedFrames.length < 2) {
    return voicedFrames.length === 0 ? 0 : 0.5;
  }

  let unstablePairs = 0;
  for (let index = 1; index < voicedFrames.length; index += 1) {
    const previous = voicedFrames[index - 1].f0Hz;
    const current = voicedFrames[index].f0Hz;
    const midpoint = (previous + current) / 2;
    if (midpoint <= 0 || Math.abs(current - previous) / midpoint > UNSTABLE_PAIR_RATIO) {
      unstablePairs += 1;
    }
  }

  return roundToTwoDecimals(clamp01(1 - unstablePairs / (voicedFrames.length - 1)));
}

function extractionConfidenceFor(frames: PitchFrame[], voicedRatio: number, pitchStability: number): number {
  const voicedConfidence = frames
    .filter((frame) => frame.f0Hz !== null)
    .map((frame) => frame.confidence);
  const meanConfidence =
    voicedConfidence.length === 0
      ? 0
      : voicedConfidence.reduce((total, confidence) => total + confidence, 0) / voicedConfidence.length;

  return roundToTwoDecimals(clamp01(0.45 * voicedRatio + 0.35 * meanConfidence + 0.2 * pitchStability));
}

function emptyContour(reason: ExtractedPitchContour["reason"]): ExtractedPitchContour {
  return {
    samples: [],
    durationMs: 0,
    voicedRatio: 0,
    medianF0Hz: null,
    extractionConfidence: 0,
    reason,
  };
}

function hann(index: number, length: number): number {
  if (length <= 1) return 1;
  return 0.5 * (1 - Math.cos((2 * Math.PI * index) / (length - 1)));
}

function median(values: number[]): number {
  const sorted = [...values].sort((left, right) => left - right);
  const midpoint = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[midpoint - 1] + sorted[midpoint]) / 2;
  }
  return sorted[midpoint];
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
