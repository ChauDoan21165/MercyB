// @vitest-environment node
//
// Tests for src/lib/pronunciation/cloudScorer.ts. Mocks
// `blobToWavPcm16k` and the fetch implementation; never touches a real
// AudioContext or network. Runs under Node so multipart FormData
// round-trips cleanly through the WHATWG Request.

import { describe, it, expect, vi, beforeEach } from "vitest";

// `cloudScorer.ts` imports `blobToWavPcm16k` from the audio module —
// stub it module-wide so we don't need a real AudioContext.
vi.mock("@/lib/audio/wavEncoder", () => ({
  blobToWavPcm16k: vi.fn(),
}));

import { scoreCloud } from "../cloudScorer";
import { blobToWavPcm16k } from "@/lib/audio/wavEncoder";

const blobToWavPcm16kMock = vi.mocked(blobToWavPcm16k);

const PRACTICE_TARGET = "I think this is going to work";
const RECORDED_BLOB = new Blob(
  [new Uint8Array([0x00, 0x00, 0x00, 0x00])],
  { type: "audio/webm" },
);
const FAKE_WAV = new Blob([new Uint8Array(44 + 64)], { type: "audio/wav" });
const SUPABASE_URL = "https://test.supabase.co";

beforeEach(() => {
  vi.clearAllMocks();
  blobToWavPcm16kMock.mockResolvedValue(FAKE_WAV);
});

// ── 1. Cloud OK → ScoreResult with cloud scores ──────────────────────────

describe("scoreCloud — cloud success", () => {
  it("returns the projected ScoreResult when the edge function succeeds", async () => {
    const cloudBody = {
      ok: true,
      score: 89,
      provider: "azure",
      audio_seconds: 2.5,
      cost_usd_cents: 0.07,
      word_scores: [
        { word: "I", score: 88, status: "correct", phonemes: [] },
        {
          word: "think",
          score: 67,
          status: "close",
          phonemes: [
            { phoneme: "th", score: 48 },
            { phoneme: "ih", score: 42 },
            { phoneme: "ng", score: 100 },
            { phoneme: "k", score: 53 },
          ],
        },
      ],
    };
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(cloudBody), { status: 200 }));

    const result = await scoreCloud({
      audioBlob: RECORDED_BLOB,
      target: PRACTICE_TARGET,
      userJwt: "test-jwt",
      transcript: "I think this is going to work",
      supabaseUrl: SUPABASE_URL,
      fetchImpl,
    });

    expect(result.overallScore).toBe(89);
    expect(result.wordScores).toHaveLength(2);
    expect(result.wordScores[1].word).toBe("think");
    expect(result.wordScores[1].score).toBe(67);
    expect(result.wordScores[1].status).toBe("close");

    expect(fetchImpl).toHaveBeenCalledOnce();
    const [callUrl, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(callUrl).toBe(`${SUPABASE_URL}/functions/v1/azure-phoneme`);
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer test-jwt");
    expect(init.method).toBe("POST");
  });
});

// ── 2. Cloud sentinel → local fallback ──────────────────────────────────

describe("scoreCloud — use_local sentinel", () => {
  it("falls back to scorePronunciation when the edge function returns ok:false, use_local:true", async () => {
    const sentinel = { ok: false, use_local: true, reason: "daily_cap_reached" };
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(sentinel), { status: 200 }));

    const result = await scoreCloud({
      audioBlob: RECORDED_BLOB,
      target: "hello world",
      userJwt: "test-jwt",
      transcript: "hello world",
      supabaseUrl: SUPABASE_URL,
      fetchImpl,
    });

    // Local scorer with matching target+recognized returns max score.
    expect(result.overallScore).toBe(100);
    expect(fetchImpl).toHaveBeenCalledOnce();
  });
});

// ── 3. Cloud network error → local fallback ─────────────────────────────

describe("scoreCloud — network error", () => {
  it("falls back to scorePronunciation when fetch throws", async () => {
    const fetchImpl = vi
      .fn()
      .mockRejectedValue(new TypeError("fetch failed: ECONNREFUSED"));

    const result = await scoreCloud({
      audioBlob: RECORDED_BLOB,
      target: "hello world",
      userJwt: "test-jwt",
      transcript: "hello world",
      supabaseUrl: SUPABASE_URL,
      fetchImpl,
    });

    expect(result.overallScore).toBe(100);
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("falls back when the response is non-JSON", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response("<!doctype html>...", { status: 200 }));

    const result = await scoreCloud({
      audioBlob: RECORDED_BLOB,
      target: "hello world",
      userJwt: "test-jwt",
      transcript: "hello world",
      supabaseUrl: SUPABASE_URL,
      fetchImpl,
    });

    expect(result.overallScore).toBe(100);
  });

  it("falls back on HTTP 5xx", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response("Bad Gateway", { status: 502 }));

    const result = await scoreCloud({
      audioBlob: RECORDED_BLOB,
      target: "hello world",
      userJwt: "test-jwt",
      transcript: "hello world",
      supabaseUrl: SUPABASE_URL,
      fetchImpl,
    });

    expect(result.overallScore).toBe(100);
  });
});

// ── 4. WAV conversion fails → local fallback ────────────────────────────

describe("scoreCloud — WAV conversion failure", () => {
  it("falls back to scorePronunciation when blobToWavPcm16k throws", async () => {
    blobToWavPcm16kMock.mockRejectedValueOnce(new Error("decodeAudioData failed"));
    const fetchImpl = vi.fn();

    const result = await scoreCloud({
      audioBlob: RECORDED_BLOB,
      target: "hello world",
      userJwt: "test-jwt",
      transcript: "hello world",
      supabaseUrl: SUPABASE_URL,
      fetchImpl,
    });

    expect(result.overallScore).toBe(100);
    // Did NOT attempt the network call once WAV conversion failed.
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

// ── 5. 401 propagates (session broken, NOT a scoring failure) ───────────

describe("scoreCloud — 401 auth required", () => {
  it("throws cloud_scorer_auth_required so the caller can re-auth", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ error: "auth_required" }), { status: 401 }));

    await expect(
      scoreCloud({
        audioBlob: RECORDED_BLOB,
        target: "hello world",
        userJwt: "expired-jwt",
        transcript: "hello world",
        supabaseUrl: SUPABASE_URL,
        fetchImpl,
      }),
    ).rejects.toThrow(/auth_required/);
  });
});
