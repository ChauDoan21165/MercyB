import { describe, expect, it } from "vitest";

import {
  VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
  generateToneReferenceAudio,
} from "../__fixtures__/vietnameseToneReferenceAudioFixtures";
import {
  VIETNAMESE_TONE_VOICE_QUALITY_SPIKE_FEATURE_KEY,
  analyzeVietnameseToneVoiceQualitySpike,
} from "../vietnameseToneVoiceQualitySpike";
import type { ExtractedPitchContour } from "../vietnameseToneScorer";

describe("analyzeVietnameseToneVoiceQualitySpike", () => {
  it("is flag-gated and uses the existing dark pronunciation funnel key", () => {
    const result = analyzeVietnameseToneVoiceQualitySpike({
      enabled: false,
      tone: "hoi",
      samples: generateToneReferenceAudio({ startHz: 190, endHz: 220 }),
      sampleRate: VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
      contour: dipContour(),
    });

    expect(result.featureKey).toBe(VIETNAMESE_TONE_VOICE_QUALITY_SPIKE_FEATURE_KEY);
    expect(result.featureKey).toBe("pronunciation.en_vn_tone_feedback_mvp");
    expect(result.decision).toBe("disabled");
  });

  it("detects hỏi-like dip evidence but keeps abstention without held-out validation", () => {
    const result = analyzeVietnameseToneVoiceQualitySpike({
      enabled: true,
      tone: "hoi",
      samples: generateToneReferenceAudio({ startHz: 210, endHz: 215 }),
      sampleRate: VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
      contour: dipContour(),
    });

    expect(result.evidence.dipConfidence).toBeGreaterThanOrEqual(0.8);
    expect(result.decision).toBe("keep_abstention");
    expect(result.reasons).toContain("held-out-validation-required");
  });

  it("keeps ngã abstained when the creak proxy remains below the trust floor", () => {
    const result = analyzeVietnameseToneVoiceQualitySpike({
      enabled: true,
      tone: "nga",
      samples: generateCreakyAudio(),
      sampleRate: VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
      contour: levelContour(),
    });

    expect(result.evidence.creakConfidence).toBeLessThan(0.5);
    expect(result.decision).toBe("keep_abstention");
    expect(result.reasons).toContain("held-out-validation-required");
  });

  it("detects nặng-like short-low intensity drop evidence but keeps abstention without held-out validation", () => {
    const result = analyzeVietnameseToneVoiceQualitySpike({
      enabled: true,
      tone: "nang",
      samples: generateShortDropAudio(),
      sampleRate: VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
      contour: shortLowContour(),
    });

    expect(result.evidence.shortLowDropConfidence).toBeGreaterThanOrEqual(0.55);
    expect(result.evidence.durationMs).toBeLessThan(520);
    expect(result.decision).toBe("keep_abstention");
    expect(result.reasons).toContain("held-out-validation-required");
  });

  it("abstains on missing or low-quality evidence instead of producing a candidate", () => {
    const result = analyzeVietnameseToneVoiceQualitySpike({
      enabled: true,
      tone: "nang",
      samples: new Float32Array(0),
      sampleRate: VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
      contour: null,
      heldOutValidated: true,
    });

    expect(result.decision).toBe("insufficient_evidence");
    expect(result.confidence).toBe(0);
  });

  it("requires held-out validation before a synthetic probe can become reviewable", () => {
    const unvalidated = analyzeVietnameseToneVoiceQualitySpike({
      enabled: true,
      tone: "hoi",
      samples: generateToneReferenceAudio({ startHz: 210, endHz: 215 }),
      sampleRate: VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
      contour: dipContour(),
      heldOutValidated: false,
    });
    const validated = analyzeVietnameseToneVoiceQualitySpike({
      enabled: true,
      tone: "hoi",
      samples: generateToneReferenceAudio({ startHz: 210, endHz: 215 }),
      sampleRate: VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
      contour: dipContour(),
      heldOutValidated: true,
    });

    expect(unvalidated.decision).toBe("keep_abstention");
    expect(validated.decision).toBe("candidate_for_review");
  });
});

function dipContour(): ExtractedPitchContour {
  return contour([220, 214, 180, 170, 182, 214, 226], 490);
}

function levelContour(): ExtractedPitchContour {
  return contour([198, 200, 199, 201, 199, 200, 198], 490);
}

function shortLowContour(): ExtractedPitchContour {
  return contour([205, 198, 188, 176, 164], 300);
}

function contour(values: number[], durationMs: number): ExtractedPitchContour {
  return {
    samples: values.map((f0Hz, index) => ({
      timeMs: index * Math.round(durationMs / Math.max(1, values.length - 1)),
      f0Hz,
      confidence: 0.9,
    })),
    durationMs,
    voicedRatio: 0.95,
    medianF0Hz: median(values),
    extractionConfidence: 0.9,
    reason: "ok",
  };
}

function generateCreakyAudio(): Float32Array {
  const sampleRate = VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE;
  const durationSeconds = 0.42;
  const totalSamples = Math.round(sampleRate * durationSeconds);
  const samples = new Float32Array(totalSamples);
  let phase = 0;

  for (let index = 0; index < totalSamples; index += 1) {
    const pulse = Math.floor(index / 160) % 2 === 0 ? 0.45 : 0.08;
    const f0Hz = Math.floor(index / 320) % 2 === 0 ? 82 : 128;
    phase += (2 * Math.PI * f0Hz) / sampleRate;
    samples[index] = Math.sin(phase) * pulse;
  }

  return samples;
}

function generateShortDropAudio(): Float32Array {
  const sampleRate = VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE;
  const durationSeconds = 0.28;
  const totalSamples = Math.round(sampleRate * durationSeconds);
  const samples = new Float32Array(totalSamples);
  let phase = 0;

  for (let index = 0; index < totalSamples; index += 1) {
    const progress = index / Math.max(1, totalSamples - 1);
    const f0Hz = 205 - progress * 48;
    const amplitude = 0.52 * (1 - progress * 0.86);
    phase += (2 * Math.PI * f0Hz) / sampleRate;
    samples[index] = Math.sin(phase) * amplitude;
  }

  return samples;
}

function median(values: number[]): number {
  const sorted = [...values].sort((left, right) => left - right);
  const midpoint = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[midpoint - 1] + sorted[midpoint]) / 2
    : sorted[midpoint];
}
