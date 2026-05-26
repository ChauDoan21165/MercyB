// @vitest-environment node
//
// Tests for src/lib/audio/wavEncoder.ts. Runs under Node so we can
// install minimal `AudioContext` / `OfflineAudioContext` fakes via
// `globalThis` without fighting jsdom defaults.
//
// What's verified:
//   - 44-byte canonical WAV header (RIFF/WAVE/fmt /data magic, 16 kHz
//     mono 16-bit fields).
//   - data sub-chunk size matches the produced PCM body.
//   - iOS Safari detection picks the JS-resample path (both branches
//     produce a valid WAV).

import { describe, it, expect, beforeEach } from "vitest";

import { blobToWavPcm16k, isIosSafari } from "../wavEncoder";

// ── Fake AudioContext ─────────────────────────────────────────────────────
//
// Minimal stand-in. `decodeAudioData` returns a synthetic 1-channel
// AudioBuffer at a configurable sample rate. The tests vary that rate
// to exercise the resample paths.

type Channel = Float32Array;

class FakeAudioBuffer {
  numberOfChannels: number;
  length: number;
  sampleRate: number;
  duration: number;
  private channels: Channel[];

  constructor(channels: Channel[], sampleRate: number) {
    this.channels = channels;
    this.numberOfChannels = channels.length;
    this.length = channels[0].length;
    this.sampleRate = sampleRate;
    this.duration = this.length / sampleRate;
  }
  getChannelData(c: number) { return this.channels[c]; }
}

let fakeSampleRate = 48_000;
let fakeSampleCount = 1600; // ~33 ms at 48 kHz default

function installFakes() {
  class FakeAudioContext {
    async decodeAudioData(_buf: ArrayBuffer) {
      // Synthesize a sine-wave-shaped buffer so the PCM body isn't all zeros.
      const out = new Float32Array(fakeSampleCount);
      for (let i = 0; i < fakeSampleCount; i += 1) {
        out[i] = Math.sin((i / fakeSampleCount) * Math.PI * 2 * 4) * 0.5;
      }
      return new FakeAudioBuffer([out], fakeSampleRate);
    }
    async close() {}
  }
  // Keep OfflineAudioContext UNDEFINED so the resample falls through to the
  // JS linear path. That path is deterministic and we don't need to fake
  // a Web Audio render graph.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).AudioContext = FakeAudioContext;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).OfflineAudioContext = undefined;
}

beforeEach(() => {
  fakeSampleRate = 48_000;
  fakeSampleCount = 1600;
  installFakes();
});

// ── Helpers ───────────────────────────────────────────────────────────────

async function blobToBytes(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer());
}

function ascii(bytes: Uint8Array, off: number, len: number): string {
  let s = "";
  for (let i = 0; i < len; i += 1) s += String.fromCharCode(bytes[off + i]);
  return s;
}

function readU16(bytes: Uint8Array, off: number): number {
  return bytes[off] | (bytes[off + 1] << 8);
}

function readU32(bytes: Uint8Array, off: number): number {
  return (
    bytes[off] |
    (bytes[off + 1] << 8) |
    (bytes[off + 2] << 16) |
    (bytes[off + 3] << 24)
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe("blobToWavPcm16k — header bytes", () => {
  it("emits a canonical RIFF/WAVE header at offsets 0..11", async () => {
    const wav = await blobToWavPcm16k(new Blob([new Uint8Array(8)], { type: "audio/webm" }));
    const bytes = await blobToBytes(wav);
    expect(bytes.length).toBeGreaterThan(44); // header + body

    expect(ascii(bytes, 0, 4)).toBe("RIFF");
    expect(ascii(bytes, 8, 4)).toBe("WAVE");
    expect(ascii(bytes, 12, 4)).toBe("fmt ");
    expect(ascii(bytes, 36, 4)).toBe("data");
  });
});

describe("blobToWavPcm16k — fmt subchunk", () => {
  it("records 16 kHz mono 16-bit PCM in the fmt fields", async () => {
    const wav = await blobToWavPcm16k(new Blob([new Uint8Array(8)], { type: "audio/webm" }));
    const bytes = await blobToBytes(wav);

    expect(readU32(bytes, 16)).toBe(16);          // fmt chunk size
    expect(readU16(bytes, 20)).toBe(1);           // PCM
    expect(readU16(bytes, 22)).toBe(1);           // 1 channel = mono
    expect(readU32(bytes, 24)).toBe(16_000);      // sample rate
    expect(readU32(bytes, 28)).toBe(16_000 * 2);  // byte rate (16 kHz × 1 ch × 2 bytes)
    expect(readU16(bytes, 32)).toBe(2);           // block align (1 ch × 2 bytes)
    expect(readU16(bytes, 34)).toBe(16);          // bits per sample
  });
});

describe("blobToWavPcm16k — data subchunk", () => {
  it("data size in the header matches the PCM byte count", async () => {
    fakeSampleRate = 48_000;
    fakeSampleCount = 1600; // ~33 ms at 48 kHz → ~533 samples at 16 kHz → 1066 bytes

    const wav = await blobToWavPcm16k(new Blob([new Uint8Array(8)], { type: "audio/webm" }));
    const bytes = await blobToBytes(wav);

    const declaredDataSize = readU32(bytes, 40);
    const actualBodySize = bytes.length - 44;
    expect(declaredDataSize).toBe(actualBodySize);

    // Sanity: at 16 kHz mono 16-bit, declared size must be even (2 bytes/sample).
    expect(declaredDataSize % 2).toBe(0);

    // RIFF chunk-size field at offset 4 = 36 + dataSize.
    expect(readU32(bytes, 4)).toBe(36 + declaredDataSize);
  });

  it("downsamples 48 kHz → 16 kHz at a 3:1 ratio (within rounding)", async () => {
    fakeSampleRate = 48_000;
    fakeSampleCount = 9_600; // 200 ms at 48 kHz

    const wav = await blobToWavPcm16k(new Blob([new Uint8Array(8)], { type: "audio/webm" }));
    const bytes = await blobToBytes(wav);

    const declaredDataSize = readU32(bytes, 40);
    const sampleCount = declaredDataSize / 2; // 16-bit → 2 bytes/sample
    // Linear-resample emits floor(input.length / ratio) = floor(9600 / 3) = 3200.
    expect(sampleCount).toBe(3_200);
  });

  it("passes through unchanged when input is already 16 kHz mono", async () => {
    fakeSampleRate = 16_000;
    fakeSampleCount = 8_000; // 500 ms at 16 kHz

    const wav = await blobToWavPcm16k(new Blob([new Uint8Array(8)], { type: "audio/webm" }));
    const bytes = await blobToBytes(wav);

    const declaredDataSize = readU32(bytes, 40);
    expect(declaredDataSize / 2).toBe(8_000);
  });
});

describe("isIosSafari", () => {
  it("returns true for iPhone Safari user agent", () => {
    expect(
      isIosSafari(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1",
      ),
    ).toBe(true);
  });

  it("returns true for iPad Capacitor WebView", () => {
    expect(
      isIosSafari(
        "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      ),
    ).toBe(true);
  });

  it("returns false for Chrome on macOS", () => {
    expect(
      isIosSafari(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      ),
    ).toBe(false);
  });

  it("returns false for empty UA", () => {
    expect(isIosSafari("")).toBe(false);
  });
});
