import { describe, expect, it } from "vitest";

import { extractF0PitchContour } from "../f0PitchExtractor";
import {
  classifyVietnameseToneContour,
  scoreVietnameseToneAttempt,
  type VietnameseToneTarget,
} from "../vietnameseToneScorer";

const SAMPLE_RATE = 16_000;
const DURATION_SECONDS = 0.72;

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
} satisfies Record<string, VietnameseToneTarget>;

type SupportedContour = "rising" | "falling" | "level";

describe("extractF0PitchContour", () => {
  it("is flag gated and returns no pitch output when disabled", () => {
    const contour = extractF0PitchContour({
      enabled: false,
      sampleRate: SAMPLE_RATE,
      samples: synthTone({ startHz: 180, endHz: 230 }),
    });

    expect(contour.samples).toHaveLength(0);
    expect(contour.extractionConfidence).toBe(0);
    expect(contour.reason).toBe("no-audio");
  });

  it("extracts a usable median f0 from a clean level reference substitute", () => {
    const contour = extractF0PitchContour({
      enabled: true,
      sampleRate: SAMPLE_RATE,
      samples: synthTone({ startHz: 205, endHz: 205 }),
    });

    expect(contour.reason).toBe("ok");
    expect(contour.voicedRatio).toBeGreaterThanOrEqual(0.9);
    expect(contour.extractionConfidence).toBeGreaterThanOrEqual(0.8);
    expect(contour.medianF0Hz).toBeGreaterThan(195);
    expect(contour.medianF0Hz).toBeLessThan(215);
  });

  it("handles microphone gain differences without changing contour direction", () => {
    const quietContour = extractF0PitchContour({
      enabled: true,
      sampleRate: SAMPLE_RATE,
      samples: synthTone({ startHz: 178, endHz: 232, amplitude: 0.08 }),
    });
    const loudContour = extractF0PitchContour({
      enabled: true,
      sampleRate: SAMPLE_RATE,
      samples: synthTone({ startHz: 178, endHz: 232, amplitude: 0.82 }),
    });

    expect(quietContour.reason).toBe("ok");
    expect(loudContour.reason).toBe("ok");
    expect(classifyVietnameseToneContour(quietContour)).toBe("rising");
    expect(classifyVietnameseToneContour(loudContour)).toBe("rising");
  });

  it("keeps a clean tone usable with moderate deterministic background noise", () => {
    const contour = extractF0PitchContour({
      enabled: true,
      sampleRate: SAMPLE_RATE,
      samples: synthTone({ startHz: 232, endHz: 178, noiseAmplitude: 0.018 }),
    });
    const score = scoreVietnameseToneAttempt({
      contour,
      target: TARGETS.huyen,
    });

    expect(contour.reason).toBe("ok");
    expect(classifyVietnameseToneContour(contour)).toBe("falling");
    expect(score).toMatchObject({
      bucket: "close",
      reason: "contour-match",
    });
  });

  it("meets the >=90% contour-bucket threshold on curated deterministic references", () => {
    const fixtures: Array<{ expected: SupportedContour; samples: Float32Array }> = [
      ...Array.from({ length: 8 }, (_, index) => ({
        expected: "rising" as const,
        samples: synthTone({ startHz: 175 + index, endHz: 225 + index }),
      })),
      ...Array.from({ length: 8 }, (_, index) => ({
        expected: "falling" as const,
        samples: synthTone({ startHz: 230 - index, endHz: 180 - index }),
      })),
      ...Array.from({ length: 8 }, (_, index) => {
        const f0Hz = 190 + index * 3;
        return {
          expected: "level" as const,
          samples: synthTone({ startHz: f0Hz, endHz: f0Hz + 1 }),
        };
      }),
    ];

    const results = fixtures.map((fixture) => {
      const contour = extractF0PitchContour({
        enabled: true,
        sampleRate: SAMPLE_RATE,
        samples: fixture.samples,
      });
      return {
        expected: fixture.expected,
        observed: classifyVietnameseToneContour(contour),
        confidence: contour.extractionConfidence,
      };
    });

    const correct = results.filter((result) => result.observed === result.expected).length;
    const accuracy = correct / results.length;

    expect(accuracy).toBeGreaterThanOrEqual(0.9);
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ expected: "rising", observed: "rising" }),
        expect.objectContaining({ expected: "falling", observed: "falling" }),
        expect.objectContaining({ expected: "level", observed: "level" }),
      ]),
    );
    expect(results.every((result) => result.confidence >= 0.75)).toBe(true);
  });

  it("feeds the existing Vietnamese tone scorer without changing its contract", () => {
    const risingContour = extractF0PitchContour({
      enabled: true,
      sampleRate: SAMPLE_RATE,
      samples: synthTone({ startHz: 178, endHz: 232 }),
    });
    const fallingContour = extractF0PitchContour({
      enabled: true,
      sampleRate: SAMPLE_RATE,
      samples: synthTone({ startHz: 232, endHz: 178 }),
    });
    const levelContour = extractF0PitchContour({
      enabled: true,
      sampleRate: SAMPLE_RATE,
      samples: synthTone({ startHz: 205, endHz: 206 }),
    });

    expect(scoreVietnameseToneAttempt({ contour: risingContour, target: TARGETS.sac })).toMatchObject({
      bucket: "close",
      observedContour: "rising",
      reason: "contour-match",
    });
    expect(scoreVietnameseToneAttempt({ contour: fallingContour, target: TARGETS.huyen })).toMatchObject({
      bucket: "close",
      observedContour: "falling",
      reason: "contour-match",
    });
    expect(scoreVietnameseToneAttempt({ contour: levelContour, target: TARGETS.ngang })).toMatchObject({
      bucket: "close",
      observedContour: "level",
      reason: "contour-match",
    });
  });

  it("returns low-confidence evidence for noisy or unvoiced input instead of a wrong confident contour", () => {
    const contour = extractF0PitchContour({
      enabled: true,
      sampleRate: SAMPLE_RATE,
      samples: synthUnvoicedNoise(),
    });
    const score = scoreVietnameseToneAttempt({
      contour,
      target: TARGETS.sac,
    });

    expect(contour.reason).toBe("insufficient-voicing");
    expect(classifyVietnameseToneContour(contour)).toBe("unknown");
    expect(score.bucket).toBe("unclear");
    expect(score.reason).toBe("low-confidence");
  });

  it("returns too-short evidence for clips below the extraction floor", () => {
    const contour = extractF0PitchContour({
      enabled: true,
      sampleRate: SAMPLE_RATE,
      samples: synthTone({ startHz: 200, endHz: 220, durationSeconds: 0.08 }),
    });

    expect(contour.samples).toHaveLength(0);
    expect(contour.reason).toBe("too-short");
    expect(classifyVietnameseToneContour(contour)).toBe("unknown");
  });

  it("abstains on silent utterances", () => {
    const contour = extractF0PitchContour({
      enabled: true,
      sampleRate: SAMPLE_RATE,
      samples: new Float32Array(Math.round(SAMPLE_RATE * DURATION_SECONDS)),
    });
    const score = scoreVietnameseToneAttempt({
      contour,
      target: TARGETS.ngang,
    });

    expect(contour.reason).toBe("insufficient-voicing");
    expect(contour.extractionConfidence).toBeLessThan(0.5);
    expect(classifyVietnameseToneContour(contour)).toBe("unknown");
    expect(score.bucket).toBe("unclear");
  });

  it("abstains on heavily clipped utterances instead of trusting distorted f0", () => {
    const contour = extractF0PitchContour({
      enabled: true,
      sampleRate: SAMPLE_RATE,
      samples: synthTone({ startHz: 178, endHz: 232, amplitude: 1.8, clip: true }),
    });
    const score = scoreVietnameseToneAttempt({
      contour,
      target: TARGETS.sac,
    });

    expect(contour.samples).toHaveLength(0);
    expect(contour.reason).toBe("insufficient-voicing");
    expect(score.bucket).toBe("unclear");
  });

  it("abstains when voiced frames are too sparse", () => {
    const contour = extractF0PitchContour({
      enabled: true,
      sampleRate: SAMPLE_RATE,
      samples: synthSparseVoicing(),
    });
    const score = scoreVietnameseToneAttempt({
      contour,
      target: TARGETS.sac,
    });

    expect(contour.reason).toBe("insufficient-voicing");
    expect(contour.voicedRatio).toBeLessThan(0.45);
    expect(classifyVietnameseToneContour(contour)).toBe("unknown");
    expect(score.bucket).toBe("unclear");
  });

  it("rejects unstable octave-jumping frames instead of returning a confident contour", () => {
    const contour = extractF0PitchContour({
      enabled: true,
      sampleRate: SAMPLE_RATE,
      samples: synthUnstablePitch(),
    });
    const score = scoreVietnameseToneAttempt({
      contour,
      target: TARGETS.sac,
    });

    expect(contour.reason).toBe("insufficient-voicing");
    expect(contour.extractionConfidence).toBeLessThan(0.75);
    expect(classifyVietnameseToneContour(contour)).toBe("unknown");
    expect(score.bucket).toBe("unclear");
  });
});

function synthTone({
  startHz,
  endHz,
  durationSeconds = DURATION_SECONDS,
  amplitude = 0.5,
  noiseAmplitude = 0,
  clip = false,
}: {
  startHz: number;
  endHz: number;
  durationSeconds?: number;
  amplitude?: number;
  noiseAmplitude?: number;
  clip?: boolean;
}): Float32Array {
  const totalSamples = Math.round(SAMPLE_RATE * durationSeconds);
  const samples = new Float32Array(totalSamples);
  let phase = 0;
  let seed = 8675309;

  for (let index = 0; index < totalSamples; index += 1) {
    const progress = totalSamples <= 1 ? 0 : index / (totalSamples - 1);
    const f0Hz = startHz + (endHz - startHz) * progress;
    phase += (2 * Math.PI * f0Hz) / SAMPLE_RATE;
    const envelope = 0.25 + 0.75 * Math.sin(Math.PI * progress);
    seed = (1664525 * seed + 1013904223) >>> 0;
    const noise = (seed / 0xffffffff - 0.5) * noiseAmplitude;
    const value = Math.sin(phase) * amplitude * envelope + noise;
    samples[index] = clip ? Math.max(-1, Math.min(1, value)) : value;
  }

  return samples;
}

function synthUnvoicedNoise(): Float32Array {
  const totalSamples = Math.round(SAMPLE_RATE * DURATION_SECONDS);
  const samples = new Float32Array(totalSamples);
  let seed = 42;

  for (let index = 0; index < totalSamples; index += 1) {
    seed = (1664525 * seed + 1013904223) >>> 0;
    const noise = seed / 0xffffffff - 0.5;
    samples[index] = noise * 0.006;
  }

  return samples;
}

function synthSparseVoicing(): Float32Array {
  const voiced = synthTone({ startHz: 180, endHz: 230, durationSeconds: 0.16 });
  const samples = synthUnvoicedNoise();
  samples.set(voiced, Math.round(SAMPLE_RATE * 0.28));
  return samples;
}

function synthUnstablePitch(): Float32Array {
  const totalSamples = Math.round(SAMPLE_RATE * DURATION_SECONDS);
  const samples = new Float32Array(totalSamples);
  let phase = 0;

  for (let index = 0; index < totalSamples; index += 1) {
    const progress = totalSamples <= 1 ? 0 : index / (totalSamples - 1);
    const segment = Math.floor(progress * 10);
    const f0Hz = segment % 2 === 0 ? 145 : 340;
    phase += (2 * Math.PI * f0Hz) / SAMPLE_RATE;
    const envelope = 0.25 + 0.75 * Math.sin(Math.PI * progress);
    samples[index] = Math.sin(phase) * 0.48 * envelope;
  }

  return samples;
}
