/**
 * Pure helper that converts a recorded audio Blob into a WAV PCM
 * 16 kHz mono 16-bit Blob — the exact format Azure Pronunciation
 * Assessment requires (`audio/wav; codecs=audio/pcm; samplerate=16000`).
 *
 * Day 2 of the phoneme scoring plan
 * (reports/plan-phoneme-scoring-azure-2026-04-26.md § 1c).
 *
 * Pipeline:
 *   1. AudioContext.decodeAudioData on the input Blob — handles WebM/Opus,
 *      MP4/AAC, OGG, etc. via browser-native decoders.
 *   2. Mix down to mono (average channels) if multi-channel.
 *   3. Resample to 16 kHz. Two paths:
 *        a. Default — OfflineAudioContext.startRendering on a 1-channel
 *           target. Fast, browser-optimised.
 *        b. iOS Safari fallback — linear-interpolation resample done in
 *           JS. iOS Safari historically had quirks at non-44.1 kHz with
 *           OfflineAudioContext (e.g. silently returns 0-length buffer).
 *           The JS path is slower (~10–20 ms for 5 s of audio) but
 *           predictable.
 *   4. Encode samples as 16-bit signed PCM little-endian, prepend a
 *      44-byte canonical WAV header, return as `audio/wav` Blob.
 *
 * No React, no Supabase, no DOM beyond `navigator.userAgent`. Tests
 * mock `globalThis.AudioContext` + `OfflineAudioContext`.
 */

const TARGET_SAMPLE_RATE = 16_000;
const TARGET_BITS_PER_SAMPLE = 16;
const TARGET_CHANNELS = 1;

type AudioContextLike = {
  decodeAudioData: (buffer: ArrayBuffer) => Promise<AudioBuffer>;
  close?: () => Promise<void>;
};

type OfflineAudioContextCtor = new (
  channels: number,
  length: number,
  sampleRate: number,
) => {
  createBufferSource: () => {
    buffer: AudioBuffer | null;
    connect: (dest: AudioNode) => void;
    start: (when?: number) => void;
  };
  destination: AudioNode;
  startRendering: () => Promise<AudioBuffer>;
};

/**
 * Heuristic for "is this iOS Safari (or any WebKit-on-iOS WebView)?"
 * Used to pick the JS-resample fallback. Conservative — false-positive
 * on desktop Safari is harmless (the JS path still produces correct
 * output, just slower).
 */
export function isIosSafari(ua: string = typeof navigator !== "undefined" ? navigator.userAgent : ""): boolean {
  if (!ua) return false;
  // iPhone / iPad Safari, including Capacitor WebViews.
  // Chrome/Firefox on iOS also use WebKit (CriOS/FxiOS) — same fallback path.
  const isIos = /\b(iPad|iPhone|iPod)\b/.test(ua);
  if (isIos) return true;
  // Desktop Safari (rare but possible). Detect via "Safari" without "Chrome"
  // and without "CriOS".
  return /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Edg/.test(ua);
}

/**
 * Build a 44-byte canonical WAV header. Same byte layout the edge
 * function's `parseWavHeader` expects:
 *   0..3   "RIFF"
 *   4..7   file size - 8  (little-endian)
 *   8..11  "WAVE"
 *   12..15 "fmt "
 *   16..19 16 (fmt chunk size)
 *   20..21 1 (PCM)
 *   22..23 channels
 *   24..27 sampleRate
 *   28..31 byteRate (sampleRate × channels × bitsPerSample/8)
 *   32..33 blockAlign (channels × bitsPerSample/8)
 *   34..35 bitsPerSample
 *   36..39 "data"
 *   40..43 data size
 */
function buildWavHeader(dataSize: number): Uint8Array {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const writeAscii = (off: number, s: string) => {
    for (let i = 0; i < s.length; i += 1) view.setUint8(off + i, s.charCodeAt(i));
  };
  const byteRate = TARGET_SAMPLE_RATE * TARGET_CHANNELS * (TARGET_BITS_PER_SAMPLE / 8);
  const blockAlign = TARGET_CHANNELS * (TARGET_BITS_PER_SAMPLE / 8);

  writeAscii(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(8, "WAVE");
  writeAscii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, TARGET_CHANNELS, true);
  view.setUint32(24, TARGET_SAMPLE_RATE, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, TARGET_BITS_PER_SAMPLE, true);
  writeAscii(36, "data");
  view.setUint32(40, dataSize, true);
  return new Uint8Array(header);
}

/**
 * Mix a multi-channel AudioBuffer down to a single mono Float32Array
 * (sample-by-sample average across channels).
 */
function audioBufferToMonoFloat32(buffer: AudioBuffer): Float32Array {
  const length = buffer.length;
  const channelCount = buffer.numberOfChannels;
  if (channelCount === 1) return buffer.getChannelData(0).slice();

  const out = new Float32Array(length);
  const channels: Float32Array[] = [];
  for (let c = 0; c < channelCount; c += 1) {
    channels.push(buffer.getChannelData(c));
  }
  for (let i = 0; i < length; i += 1) {
    let sum = 0;
    for (let c = 0; c < channelCount; c += 1) sum += channels[c][i];
    out[i] = sum / channelCount;
  }
  return out;
}

/**
 * Linear-interpolation resampler. Input mono Float32 at `srcRate`,
 * output mono Float32 at `dstRate`. iOS Safari fallback path.
 */
function resampleLinear(
  input: Float32Array,
  srcRate: number,
  dstRate: number,
): Float32Array {
  if (srcRate === dstRate) return input.slice();
  const ratio = srcRate / dstRate;
  const dstLength = Math.floor(input.length / ratio);
  const out = new Float32Array(dstLength);
  for (let i = 0; i < dstLength; i += 1) {
    const srcPos = i * ratio;
    const lo = Math.floor(srcPos);
    const hi = Math.min(lo + 1, input.length - 1);
    const frac = srcPos - lo;
    out[i] = input[lo] * (1 - frac) + input[hi] * frac;
  }
  return out;
}

/**
 * OfflineAudioContext-based resample. Faster than the JS path on
 * Chromium/Firefox; skipped on iOS Safari.
 *
 * Returns null if the env doesn't expose OfflineAudioContext (Node test
 * runners) — caller falls through to the JS path.
 */
async function resampleViaOfflineCtx(
  buffer: AudioBuffer,
): Promise<Float32Array | null> {
  if (typeof OfflineAudioContext === "undefined") return null;
  const Ctor =
    (globalThis as unknown as { OfflineAudioContext?: OfflineAudioContextCtor })
      .OfflineAudioContext;
  if (!Ctor) return null;

  const length = Math.floor(
    (buffer.duration * TARGET_SAMPLE_RATE) / 1,
  );
  if (length <= 0) return new Float32Array(0);

  const offline = new Ctor(TARGET_CHANNELS, length, TARGET_SAMPLE_RATE);
  const source = offline.createBufferSource();
  source.buffer = buffer;
  source.connect(offline.destination);
  source.start(0);

  const rendered = await offline.startRendering();
  return rendered.getChannelData(0).slice();
}

/**
 * Float32 [-1, 1] samples → 16-bit signed little-endian PCM bytes.
 * Out-of-range samples are clamped (defensive — most decoders return
 * already-clamped values, but a buggy decoder could give us > 1).
 */
function floatToInt16Pcm(samples: Float32Array): Uint8Array {
  const out = new Uint8Array(samples.length * 2);
  const view = new DataView(out.buffer);
  for (let i = 0; i < samples.length; i += 1) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const v = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(i * 2, v | 0, true);
  }
  return out;
}

/**
 * Public entry point. Convert the input Blob (typically MediaRecorder
 * output — WebM/Opus on Chrome, MP4/AAC on iOS Safari) into a fresh
 * Blob containing a self-contained WAV file at 16 kHz mono 16-bit PCM.
 *
 * Throws on decode failure so the caller can fall back to local scoring.
 */
export async function blobToWavPcm16k(input: Blob): Promise<Blob> {
  const Ctor =
    (globalThis as unknown as {
      AudioContext?: new () => AudioContextLike;
      webkitAudioContext?: new () => AudioContextLike;
    }).AudioContext ??
    (globalThis as unknown as {
      webkitAudioContext?: new () => AudioContextLike;
    }).webkitAudioContext;

  if (!Ctor) {
    throw new Error("AudioContext is not available in this environment");
  }

  const ctx = new Ctor();
  let monoSamples: Float32Array;
  try {
    const arrayBuffer = await input.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
    const mono = audioBufferToMonoFloat32(audioBuffer);

    if (audioBuffer.sampleRate === TARGET_SAMPLE_RATE) {
      monoSamples = mono;
    } else if (isIosSafari()) {
      // iOS path — JS resample, predictable.
      monoSamples = resampleLinear(mono, audioBuffer.sampleRate, TARGET_SAMPLE_RATE);
    } else {
      const offlineResult = await resampleViaOfflineCtx(audioBuffer);
      monoSamples =
        offlineResult ??
        resampleLinear(mono, audioBuffer.sampleRate, TARGET_SAMPLE_RATE);
    }
  } finally {
    try {
      await ctx.close?.();
    } catch {
      /* close() is best-effort */
    }
  }

  const pcmBytes = floatToInt16Pcm(monoSamples);
  const header = buildWavHeader(pcmBytes.length);
  // Cast to BlobPart[] to satisfy strict TS — Uint8Array typed as
  // `Uint8Array<ArrayBufferLike>` doesn't structurally match
  // `BlobPart`'s `ArrayBufferView<ArrayBuffer>` constraint despite
  // being identical at runtime.
  return new Blob([header, pcmBytes] as BlobPart[], { type: "audio/wav" });
}
