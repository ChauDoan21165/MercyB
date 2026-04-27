// src/lib/pronunciation/__tests__/audioComparison.test.ts
//
// Tests for the pure helpers in audioComparison.ts. The Web Audio API
// pieces (captureWaveform) live behind a runtime guard and aren't
// exercised here — vitest's jsdom doesn't ship a real AudioContext.
// We test the math: downsample, stretch, diff, divergent mask.

import { describe, expect, it } from "vitest";

import {
  DEFAULT_DISPLAY_POINTS,
  DIVERGENCE_THRESHOLD,
  diffWaveforms,
  divergentMask,
  downsamplePcmToBuckets,
  stretchToLength,
} from "../audioComparison";

describe("downsamplePcmToBuckets", () => {
  it("returns an empty array when targetPoints is 0", () => {
    expect(downsamplePcmToBuckets(new Float32Array([0.1, 0.2]), 0).length).toBe(0);
  });

  it("returns a zeroed array of target length when input is empty", () => {
    const out = downsamplePcmToBuckets(new Float32Array(0), 100);
    expect(out.length).toBe(100);
    for (let i = 0; i < out.length; i++) expect(out[i]).toBe(0);
  });

  it("normalises to [0, 1] — peak bucket is exactly 1", () => {
    const pcm = new Float32Array([0.1, -0.5, 0.3, -0.9, 0.2]);
    const out = downsamplePcmToBuckets(pcm, 5);
    let max = 0;
    for (const v of out) if (v > max) max = v;
    expect(max).toBeCloseTo(1, 5);
  });

  it("uses peak (not mean) so plosives are preserved", () => {
    // Two buckets of 5 samples each: first all 0.1, second has a single 1.0 spike.
    const pcm = new Float32Array(
      [0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 1.0, 0.0, 0.0],
    );
    const out = downsamplePcmToBuckets(pcm, 2);
    // After normalisation: bucket 0 = 0.1 / 1.0 = 0.1; bucket 1 = 1.0
    expect(out[0]).toBeCloseTo(0.1, 5);
    expect(out[1]).toBeCloseTo(1.0, 5);
  });

  it("handles negative-only input via absolute value", () => {
    const pcm = new Float32Array([-0.2, -0.4, -0.8]);
    const out = downsamplePcmToBuckets(pcm, 3);
    // After normalisation peak = 0.8 / 0.8 = 1
    expect(Math.max(...Array.from(out))).toBeCloseTo(1, 5);
  });

  it("default DEFAULT_DISPLAY_POINTS is 500", () => {
    expect(DEFAULT_DISPLAY_POINTS).toBe(500);
  });
});

describe("stretchToLength", () => {
  it("returns same array reference when length already matches", () => {
    const src = new Float32Array([0.1, 0.2, 0.3]);
    expect(stretchToLength(src, 3)).toBe(src);
  });

  it("returns empty when target is 0", () => {
    const src = new Float32Array([0.1, 0.2]);
    expect(stretchToLength(src, 0).length).toBe(0);
  });

  it("returns zeroed array of target length when input is empty", () => {
    const out = stretchToLength(new Float32Array(0), 5);
    expect(out.length).toBe(5);
    for (let i = 0; i < out.length; i++) expect(out[i]).toBe(0);
  });

  it("upsamples linearly between known anchors", () => {
    // Two-anchor source [0, 1] → stretched to length 5 → 0, 0.25, 0.5, 0.75, 1
    const out = stretchToLength(new Float32Array([0, 1]), 5);
    expect(out[0]).toBeCloseTo(0, 5);
    expect(out[1]).toBeCloseTo(0.25, 5);
    expect(out[2]).toBeCloseTo(0.5, 5);
    expect(out[3]).toBeCloseTo(0.75, 5);
    expect(out[4]).toBeCloseTo(1, 5);
  });

  it("downsamples (target < source) without crashing", () => {
    const src = new Float32Array([0, 0.25, 0.5, 0.75, 1]);
    const out = stretchToLength(src, 2);
    expect(out.length).toBe(2);
    expect(out[0]).toBeCloseTo(0, 5);
    expect(out[1]).toBeCloseTo(1, 5);
  });
});

describe("diffWaveforms", () => {
  it("returns zeros when both inputs are identical", () => {
    const a = new Float32Array([0.1, 0.5, 0.9]);
    const out = diffWaveforms(a, a);
    expect(Array.from(out)).toEqual([0, 0, 0]);
  });

  it("returns absolute differences", () => {
    const a = new Float32Array([0.0, 0.5, 1.0]);
    const b = new Float32Array([0.5, 0.5, 0.0]);
    const out = diffWaveforms(a, b);
    expect(out[0]).toBeCloseTo(0.5, 5);
    expect(out[1]).toBeCloseTo(0.0, 5);
    expect(out[2]).toBeCloseTo(1.0, 5);
  });

  it("stretches inputs to a common length when they differ", () => {
    const a = new Float32Array([0, 1]);          // short
    const b = new Float32Array([0, 0.5, 1]);     // longer
    const out = diffWaveforms(a, b);
    // Stretched a → [0, 0.5, 1]; identical to b → diff all 0.
    for (const v of out) expect(v).toBeCloseTo(0, 5);
  });

  it("respects an explicit commonLength", () => {
    const a = new Float32Array([0, 1]);
    const b = new Float32Array([0, 1]);
    const out = diffWaveforms(a, b, 10);
    expect(out.length).toBe(10);
  });
});

describe("divergentMask", () => {
  it("flags buckets above the threshold", () => {
    const diff = new Float32Array([0.05, 0.2, 0.5, 0.0]);
    const mask = divergentMask(diff, 0.18);
    expect(Array.from(mask)).toEqual([0, 1, 1, 0]);
  });

  it("uses DIVERGENCE_THRESHOLD as the default", () => {
    const diff = new Float32Array([DIVERGENCE_THRESHOLD - 0.01, DIVERGENCE_THRESHOLD + 0.01]);
    const mask = divergentMask(diff);
    expect(mask[0]).toBe(0);
    expect(mask[1]).toBe(1);
  });

  it("returns empty mask for empty diff", () => {
    expect(divergentMask(new Float32Array(0)).length).toBe(0);
  });
});

describe("integration — user vs reference identical → zero divergence", () => {
  it("two identical recordings produce a zero mask", () => {
    const wave = new Float32Array(50);
    for (let i = 0; i < wave.length; i++) wave[i] = Math.sin(i / 5) * 0.5 + 0.5;
    const diff = diffWaveforms(wave, wave);
    const mask = divergentMask(diff);
    let any = 0;
    for (let i = 0; i < mask.length; i++) any += mask[i];
    expect(any).toBe(0);
  });
});
