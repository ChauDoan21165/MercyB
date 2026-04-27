// src/lib/pronunciation/audioComparison.ts
//
// Pure audio-shape utilities for the Speak-tab waveform overlay.
//
// What this module does:
//   1. Decode an audio Blob to PCM samples via the Web Audio API.
//   2. Downsample to ~500 points so canvas drawing stays fast on
//      mobile WebViews. We use peak-pair RMS so the reduced waveform
//      preserves the "shape" of the original.
//   3. Time-stretch a comparison waveform to match a target waveform's
//      duration, so the user/Mercy stacks line up on the same X axis.
//   4. Compute an amplitude-difference vector that the canvas uses to
//      paint orange highlight regions where the user diverged from
//      Mercy.
//
// Decode + downsample run only when the user opts into the comparison
// (the brief: "lazy generation: only when user taps to expand"). Module
// is browser-only — guards check for `typeof window === 'undefined'`
// so SSR / vitest jsdom doesn't blow up at import time.
//
// No third-party libs. Web Audio API only. Tone.js is mentioned in the
// brief as "sufficient" — we don't actually need it.

export const DEFAULT_DISPLAY_POINTS = 500;
/** Threshold above which we paint an orange "divergent" highlight. */
export const DIVERGENCE_THRESHOLD = 0.18;

export type Waveform = {
  /** Downsampled non-negative magnitude samples in [0, 1]. */
  samples: Float32Array;
  /** Original audio sample rate (Hz). Useful when you want raw decode. */
  sampleRate: number;
  /** Original duration in milliseconds. */
  durationMs: number;
};

// ─── Web Audio decode ───────────────────────────────────────────────────────

type DecodeContextLike = {
  decodeAudioData: (data: ArrayBuffer) => Promise<AudioBuffer>;
  close?: () => Promise<void>;
};

function createDecodeContext(): DecodeContextLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    AudioContext?: { new (): DecodeContextLike };
    webkitAudioContext?: { new (): DecodeContextLike };
  };
  const Ctor = w.AudioContext || w.webkitAudioContext;
  if (!Ctor) return null;
  return new Ctor();
}

/**
 * Decode an audio Blob into a downsampled non-negative magnitude
 * waveform suitable for canvas rendering.
 *
 * Returns null when:
 *   - We're not in a browser (SSR / test environment).
 *   - The browser has no Web Audio API.
 *   - decodeAudioData rejects (corrupt audio, unsupported codec).
 *
 * The caller treats null as "skip the comparison this attempt".
 */
export async function captureWaveform(
  audioBlob: Blob,
  options?: { displayPoints?: number },
): Promise<Waveform | null> {
  if (!audioBlob || audioBlob.size === 0) return null;

  const ctx = createDecodeContext();
  if (!ctx) return null;

  let buffer: AudioBuffer;
  try {
    const arrayBuffer = await audioBlob.arrayBuffer();
    buffer = await ctx.decodeAudioData(arrayBuffer);
  } catch (err) {
    console.warn("[audioComparison] decodeAudioData failed", err);
    try {
      await ctx.close?.();
    } catch {
      /* ignore */
    }
    return null;
  } finally {
    // We don't call ctx.close() here on the success path because some
    // browsers refuse subsequent decodeAudioData calls on closed
    // contexts; for a one-shot decode this is fine — context is GC'd.
  }

  const points = options?.displayPoints ?? DEFAULT_DISPLAY_POINTS;
  const samples = downsampleAudioBuffer(buffer, points);
  return {
    samples,
    sampleRate: buffer.sampleRate,
    durationMs: Math.round(buffer.duration * 1000),
  };
}

// ─── Pure helpers (testable without a browser) ─────────────────────────────

/**
 * Reduce a multi-channel AudioBuffer to a single mono PCM Float32Array.
 * Stereo / multi-channel sources get averaged. The brief targets short
 * speech clips so we don't worry about phase cancellation.
 */
function audioBufferToMono(buffer: AudioBuffer): Float32Array {
  const length = buffer.length;
  const channels = buffer.numberOfChannels;
  if (channels === 1) return buffer.getChannelData(0);
  const out = new Float32Array(length);
  for (let c = 0; c < channels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) out[i] += data[i];
  }
  for (let i = 0; i < length; i++) out[i] /= channels;
  return out;
}

/**
 * Bucket a PCM array into `targetPoints` non-negative magnitude
 * samples. Each bucket = peak absolute value over the bucket's window.
 * We use peak (not RMS) because peaks track the visual "shape" of
 * speech better — RMS smooths plosives away.
 *
 * Output is normalised to [0, 1] so colour-mapped highlight thresholds
 * stay comparable across recordings of different volume.
 */
export function downsamplePcmToBuckets(
  pcm: Float32Array,
  targetPoints: number,
): Float32Array {
  if (targetPoints <= 0) return new Float32Array(0);
  if (pcm.length === 0) return new Float32Array(targetPoints);

  const out = new Float32Array(targetPoints);
  const windowSize = pcm.length / targetPoints;
  let max = 0;

  for (let i = 0; i < targetPoints; i++) {
    const start = Math.floor(i * windowSize);
    const end = Math.min(pcm.length, Math.floor((i + 1) * windowSize) || start + 1);
    let peak = 0;
    for (let j = start; j < end; j++) {
      const a = pcm[j];
      const v = a < 0 ? -a : a;
      if (v > peak) peak = v;
    }
    out[i] = peak;
    if (peak > max) max = peak;
  }

  if (max > 0) {
    for (let i = 0; i < targetPoints; i++) out[i] /= max;
  }
  return out;
}

function downsampleAudioBuffer(buffer: AudioBuffer, targetPoints: number): Float32Array {
  return downsamplePcmToBuckets(audioBufferToMono(buffer), targetPoints);
}

/**
 * Stretch (or compress) a sample array to `targetLength` via linear
 * interpolation. Used when the user clip and Mercy clip have different
 * durations — they get drawn on the same X axis after time-stretch
 * alignment. This is a coarse-grained alignment, NOT phoneme-level
 * dynamic time warping; the brief is "instant intuitive understanding,"
 * not forensic alignment.
 */
export function stretchToLength(
  src: Float32Array,
  targetLength: number,
): Float32Array {
  if (targetLength <= 0) return new Float32Array(0);
  if (src.length === 0) return new Float32Array(targetLength);
  if (src.length === targetLength) return src;

  const out = new Float32Array(targetLength);
  const ratio = (src.length - 1) / Math.max(1, targetLength - 1);
  for (let i = 0; i < targetLength; i++) {
    const t = i * ratio;
    const lo = Math.floor(t);
    const hi = Math.min(src.length - 1, lo + 1);
    const frac = t - lo;
    out[i] = src[lo] * (1 - frac) + src[hi] * frac;
  }
  return out;
}

/**
 * Compute per-bucket absolute amplitude differences between two
 * waveforms after time-stretching them to a common length. Output
 * length matches `commonLength` (or both inputs if they're already
 * the same length).
 *
 * Result values are in [0, 1] because both inputs are normalised.
 */
export function diffWaveforms(
  user: Float32Array,
  reference: Float32Array,
  commonLength?: number,
): Float32Array {
  const len = commonLength ?? Math.max(user.length, reference.length);
  if (len === 0) return new Float32Array(0);
  const u = stretchToLength(user, len);
  const r = stretchToLength(reference, len);
  const diff = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const d = u[i] - r[i];
    diff[i] = d < 0 ? -d : d;
  }
  return diff;
}

/**
 * Returns `true` for buckets where the user diverged from Mercy by
 * more than `threshold`. Canvas uses these to paint orange overlay
 * stripes.
 */
export function divergentMask(
  diff: Float32Array,
  threshold = DIVERGENCE_THRESHOLD,
): Uint8Array {
  const out = new Uint8Array(diff.length);
  for (let i = 0; i < diff.length; i++) out[i] = diff[i] > threshold ? 1 : 0;
  return out;
}
