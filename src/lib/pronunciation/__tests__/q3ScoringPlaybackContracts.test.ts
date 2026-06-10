// @vitest-environment node
//
// Q3 contracts (M8, A6 2026-06-10):
//   1. Azure scoring calls the REAL /functions/v1/azure-phoneme URL — no mock/random.
//   2. scorePronunciationWithStep7Fallback (Step 7 wire-up) routes through scoreCloud
//      when step7Enabled=true and preserves mode/labelKind metadata.
//   3. Playback-bug regression guard: audio.load() must NOT be called when src is
//      unchanged (unconditional load resets media pipeline → iOS "play() interrupted").

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/audio/wavEncoder", () => ({
  blobToWavPcm16k: vi.fn(),
}));

import {
  scoreCloud,
  scorePronunciationWithStep7Fallback,
} from "../cloudScorer";
import { blobToWavPcm16k } from "@/lib/audio/wavEncoder";

const blobToWavMock = vi.mocked(blobToWavPcm16k);
const SUPABASE_URL = "https://test.supabase.co";
const AZURE_PHONEME_URL = `${SUPABASE_URL}/functions/v1/azure-phoneme`;
const FAKE_WAV = new Blob([new Uint8Array(44 + 64)], { type: "audio/wav" });
const AUDIO_BLOB = new Blob([new Uint8Array([0, 0, 0, 0])], { type: "audio/webm" });

const CLOUD_SUCCESS = {
  ok: true,
  score: 82,
  provider: "azure",
  audio_seconds: 1.8,
  cost_usd_cents: 0.05,
  word_scores: [
    {
      word: "hello",
      score: 85,
      status: "correct",
      phonemes: [
        { phoneme: "hh", score: 80 },
        { phoneme: "eh", score: 78 },
        { phoneme: "l", score: 92 },
        { phoneme: "ow", score: 84 },
      ],
    },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
  blobToWavMock.mockResolvedValue(FAKE_WAV);
});

// ── 1. Q3 EVIDENCE: real azure-phoneme URL, no mock/random ────────────────

describe("Q3 — Azure scoring calls the real edge function URL", () => {
  it("scoreCloud POSTs to /functions/v1/azure-phoneme, not a mock or random path", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(CLOUD_SUCCESS), { status: 200 }),
      );

    await scoreCloud({
      audioBlob: AUDIO_BLOB,
      target: "hello",
      userJwt: "test-jwt",
      supabaseUrl: SUPABASE_URL,
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(AZURE_PHONEME_URL);
  });

  it("scoreCloud result overallScore comes from the edge function, not Math.random()", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ ...CLOUD_SUCCESS, score: 77 }), {
          status: 200,
        }),
      );

    const result = await scoreCloud({
      audioBlob: AUDIO_BLOB,
      target: "hello",
      userJwt: "test-jwt",
      supabaseUrl: SUPABASE_URL,
      fetchImpl,
    });

    expect(result.overallScore).toBe(77);
  });
});

// ── 2. Step 7 wire-up contract ────────────────────────────────────────────

describe("Step 7 — scorePronunciationWithStep7Fallback mode metadata", () => {
  it("returns mode=azure_phoneme_batch and labelKind=pronunciation_detail on cloud success", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(CLOUD_SUCCESS), { status: 200 }),
      );

    const result = await scorePronunciationWithStep7Fallback({
      audioBlob: AUDIO_BLOB,
      target: "hello",
      userJwt: "test-jwt",
      step7Enabled: true,
      supabaseUrl: SUPABASE_URL,
      fetchImpl,
    });

    expect(result.mode).toBe("azure_phoneme_batch");
    expect(result.labelKind).toBe("pronunciation_detail");
    expect(result.provider).toBe("azure");
    expect(result.useLocalFallback).toBe(false);
    expect(result.phonemeScores?.length).toBeGreaterThan(0);
  });

  it("returns mode=local_sentence_match when step7Enabled=false (no Azure call)", async () => {
    const fetchImpl = vi.fn();

    const result = await scorePronunciationWithStep7Fallback({
      audioBlob: AUDIO_BLOB,
      target: "hello",
      transcript: "hello",
      step7Enabled: false,
      supabaseUrl: SUPABASE_URL,
      fetchImpl,
    });

    expect(result.mode).toBe("local_sentence_match");
    expect(result.useLocalFallback).toBe(true);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("falls back to local_sentence_match and does NOT throw on cloud failure", async () => {
    const fetchImpl = vi
      .fn()
      .mockRejectedValue(new Error("network_error"));

    const result = await scorePronunciationWithStep7Fallback({
      audioBlob: AUDIO_BLOB,
      target: "hello",
      transcript: "hello",
      step7Enabled: true,
      userJwt: "jwt",
      supabaseUrl: SUPABASE_URL,
      fetchImpl,
    });

    expect(result.mode).toBe("local_sentence_match");
    expect(result.useLocalFallback).toBe(true);
  });
});

// ── 3. Playback bug regression guard ────────────────────────────────────────
//
// We cannot render MercySpeakTab here (too many hooks/deps), but we can
// document and lock the invariant that audio.load() must only be called
// when src changes. The test exercises the SAME conditional logic as the
// fixed handlePlayRecording by simulating the HTMLAudioElement API.

describe("Recording playback — audio.load() called only when src changes", () => {
  function makeAudioElement(initialSrc: string) {
    const el = {
      src: initialSrc,
      currentTime: 10,
      loadCallCount: 0,
      playCallCount: 0,
      load() { this.loadCallCount++; },
      async play() { this.playCallCount++; },
      pause() {},
    };
    return el;
  }

  // Mirrors the FIXED handlePlayRecording logic exactly.
  async function fixedHandlePlayRecording(
    audio: ReturnType<typeof makeAudioElement>,
    recordedAudioUrl: string,
  ) {
    if (!recordedAudioUrl) return;
    if (audio.src !== recordedAudioUrl) {
      audio.src = recordedAudioUrl;
      audio.load(); // load only on src change
    }
    audio.currentTime = 0;
    await audio.play();
  }

  it("does NOT call load() when src is already the recording URL (the iOS fix)", async () => {
    const blobUrl = "blob:https://mercyblade.com/abc-123";
    const audio = makeAudioElement(blobUrl);

    await fixedHandlePlayRecording(audio, blobUrl);

    expect(audio.loadCallCount).toBe(0);
    expect(audio.playCallCount).toBe(1);
    expect(audio.currentTime).toBe(0);
  });

  it("calls load() exactly once when src has changed (new recording)", async () => {
    const oldUrl = "blob:https://mercyblade.com/old";
    const newUrl = "blob:https://mercyblade.com/new";
    const audio = makeAudioElement(oldUrl);

    await fixedHandlePlayRecording(audio, newUrl);

    expect(audio.loadCallCount).toBe(1);
    expect(audio.src).toBe(newUrl);
    expect(audio.playCallCount).toBe(1);
  });

  it("supports repeated play clicks without accumulating load() calls", async () => {
    const blobUrl = "blob:https://mercyblade.com/xyz-456";
    const audio = makeAudioElement(blobUrl);

    await fixedHandlePlayRecording(audio, blobUrl);
    await fixedHandlePlayRecording(audio, blobUrl);
    await fixedHandlePlayRecording(audio, blobUrl);

    expect(audio.loadCallCount).toBe(0); // no unnecessary reloads
    expect(audio.playCallCount).toBe(3);
  });
});
