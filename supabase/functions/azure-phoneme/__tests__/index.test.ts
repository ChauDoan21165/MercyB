// @vitest-environment node
//
// Path: supabase/functions/azure-phoneme/__tests__/index.test.ts
//
// Runs under Node (not jsdom) because jsdom's multipart `Request.formData()`
// is incomplete — it hangs on the multipart boundary parser when audio is
// attached as a Blob. Node 20's native undici handles this natively.
//
// Day 1 — handler tests for `core.ts` via injected `Deps`. Mirrors the
// factSlotting / categorizeUsers test pattern: the Deno-using `index.ts`
// stays untested in CI; the pure-web-API `core.ts` is exercised under
// vitest with fake deps. No real Azure calls. No real Supabase calls.
//
// Five required tests per the Day-1 spec:
//   1. Missing JWT → 401.
//   2. 31 calls in 1h → 429 (rate-limit subsystem throws).
//   3. Budget exceeded → 402 (check_ai_budget returns allowed:false).
//   4. Azure 200 happy path → 200 with unified shape including phonemes.
//   5. Azure timeout → 200 with `use_local: true` sentinel.
//
// Plus a couple of pure-helper tests so changes to the projection
// logic / WAV header parser fail loudly.

import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  AZURE_PHONEME_LIMITS,
  clampScore,
  handleRequest,
  parseWavHeader,
  projectAzureResponse,
  scoreToStatus,
  type AzureResponse,
  type Deps,
  type LogAttemptParams,
} from "../core";

// ── WAV fixture builder ───────────────────────────────────────────────────
//
// Builds a minimal valid 16-bit / mono / 16 kHz WAV with N seconds of
// silence so the file passes the parseWavHeader gate without depending
// on a real recorder.

function buildSilentWav(seconds: number): Uint8Array {
  const sampleRate = 16_000;
  const bitsPerSample = 16;
  const channels = 1;
  const numSamples = Math.max(1, Math.round(seconds * sampleRate));
  const dataSize = numSamples * channels * (bitsPerSample / 8);
  const fileSize = 36 + dataSize;

  const buf = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buf);
  const write4 = (off: number, s: string) => {
    for (let i = 0; i < 4; i++) view.setUint8(off + i, s.charCodeAt(i));
  };

  write4(0, "RIFF");
  view.setUint32(4, fileSize, true);
  write4(8, "WAVE");
  write4(12, "fmt ");
  view.setUint32(16, 16, true);                               // PCM fmt chunk size
  view.setUint16(20, 1, true);                                // format = PCM
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * bitsPerSample / 8, true); // byte rate
  view.setUint16(32, channels * bitsPerSample / 8, true);     // block align
  view.setUint16(34, bitsPerSample, true);
  write4(36, "data");
  view.setUint32(40, dataSize, true);
  // Sample bytes left at zero (silence).

  return new Uint8Array(buf);
}

// ── Deps factory ──────────────────────────────────────────────────────────

function makeDeps(overrides: Partial<Deps> = {}): Deps {
  return {
    getUserFromAuthHeader: vi.fn().mockResolvedValue({ id: "user-1" }),
    rateLimit: vi.fn().mockResolvedValue(undefined),
    fetch: vi.fn(),
    checkAiBudget: vi.fn().mockResolvedValue({ allowed: true }),
    getUserTier: vi.fn().mockResolvedValue(0),
    countOkAttemptsToday: vi.fn().mockResolvedValue(0),
    sumGlobalCostToday: vi.fn().mockResolvedValue(0),
    audit: vi.fn().mockResolvedValue(undefined),
    logAttempt: vi.fn().mockResolvedValue(undefined),
    azureKey: "test-key",
    azureUrl: "https://test.example.com/azure",
    globalDailyCapUsd: 25,
    usdToVnd: 26000,
    azureTimeoutMs: 50,
    ...overrides,
  };
}

function makeRequest(audio?: Uint8Array, target = "I think this is going to work"): Request {
  const formData = new FormData();
  if (audio) {
    const blob = new Blob([audio], { type: "audio/wav" });
    formData.append("audio", blob, "test.wav");
  }
  formData.append("target_text", target);
  formData.append("roomId", "room-test");
  formData.append("lineId", "line-test");
  return new Request("https://test.example.com/azure-phoneme", {
    method: "POST",
    body: formData,
    headers: { Authorization: "Bearer test-jwt" },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ── Handler-level tests ───────────────────────────────────────────────────

describe("handleRequest — auth", () => {
  it("returns 401 when getUserFromAuthHeader returns null", async () => {
    const deps = makeDeps({
      getUserFromAuthHeader: vi.fn().mockResolvedValue(null),
    });
    const req = makeRequest(buildSilentWav(2));
    const res = await handleRequest(req, deps);
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("auth_required");
    // No downstream side effects.
    expect(deps.rateLimit).not.toHaveBeenCalled();
    expect(deps.audit).not.toHaveBeenCalled();
    expect(deps.fetch).not.toHaveBeenCalled();
  });
});

describe("handleRequest — rate limit", () => {
  it("returns 429 when rateLimit throws RATE_LIMIT_EXCEEDED (the 31st call in an hour)", async () => {
    const deps = makeDeps({
      rateLimit: vi.fn().mockImplementation(() => {
        throw new Error("RATE_LIMIT_EXCEEDED");
      }),
    });
    const req = makeRequest(buildSilentWav(2));
    const res = await handleRequest(req, deps);
    expect(res.status).toBe(429);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("rate_limit_exceeded");
    // Audited as rate_limited.
    expect(deps.audit).toHaveBeenCalledWith(
      expect.objectContaining({ status: "rate_limited" }),
    );
    // Did NOT proceed to Azure.
    expect(deps.fetch).not.toHaveBeenCalled();
  });
});

describe("handleRequest — budget", () => {
  it("returns 402 when check_ai_budget denies the request", async () => {
    const deps = makeDeps({
      checkAiBudget: vi
        .fn()
        .mockResolvedValue({ allowed: false, message: "Daily budget reached." }),
    });
    const req = makeRequest(buildSilentWav(2));
    const res = await handleRequest(req, deps);
    expect(res.status).toBe(402);
    const body = (await res.json()) as { error: string; message: string };
    expect(body.error).toBe("budget_exceeded");
    expect(body.message).toBe("Daily budget reached.");
    expect(deps.audit).toHaveBeenCalledWith(
      expect.objectContaining({ status: "budget_exceeded" }),
    );
    expect(deps.fetch).not.toHaveBeenCalled();
  });
});

describe("handleRequest — Azure happy path", () => {
  it("returns 200 with unified shape including per-phoneme scores", async () => {
    const azureBody: AzureResponse = {
      RecognitionStatus: "Success",
      DisplayText: "I think this is going to work",
      NBest: [{
        Display: "I think this is going to work",
        PronunciationAssessment: { AccuracyScore: 89 },
        Words: [
          {
            Word: "I",
            PronunciationAssessment: { AccuracyScore: 88 },
            Phonemes: [{ Phoneme: "ay", PronunciationAssessment: { AccuracyScore: 88 } }],
          },
          {
            Word: "think",
            PronunciationAssessment: { AccuracyScore: 67 },
            Phonemes: [
              { Phoneme: "th", PronunciationAssessment: { AccuracyScore: 48 } },
              { Phoneme: "ih", PronunciationAssessment: { AccuracyScore: 42 } },
              { Phoneme: "ng", PronunciationAssessment: { AccuracyScore: 100 } },
              { Phoneme: "k",  PronunciationAssessment: { AccuracyScore: 53 } },
            ],
          },
          {
            Word: "this",
            PronunciationAssessment: { AccuracyScore: 94 },
            Phonemes: [{ Phoneme: "dh", PronunciationAssessment: { AccuracyScore: 94 } }],
          },
        ],
      }],
    };
    const deps = makeDeps({
      fetch: vi.fn().mockResolvedValue(
        new Response(JSON.stringify(azureBody), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    });
    const req = makeRequest(buildSilentWav(2));
    const res = await handleRequest(req, deps);
    expect(res.status).toBe(200);

    const body = (await res.json()) as {
      ok: boolean;
      score: number;
      provider: string;
      audio_seconds: number;
      cost_usd_cents: number;
      word_scores: Array<{ word: string; score: number; status: string; phonemes: Array<{ phoneme: string; score: number }> }>;
    };

    expect(body.ok).toBe(true);
    expect(body.provider).toBe("azure");
    expect(body.score).toBe(89);
    expect(body.audio_seconds).toBeCloseTo(2, 1);
    expect(body.word_scores).toHaveLength(3);

    const thinkWord = body.word_scores.find((w) => w.word === "think");
    expect(thinkWord).toBeDefined();
    expect(thinkWord?.score).toBe(67);
    expect(thinkWord?.status).toBe("close");
    expect(thinkWord?.phonemes).toHaveLength(4);
    const thPhoneme = thinkWord?.phonemes.find((p) => p.phoneme === "th");
    expect(thPhoneme?.score).toBe(48);

    // logAttempt called with the projected shape.
    expect(deps.logAttempt).toHaveBeenCalledOnce();
    const logCall = (deps.logAttempt as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as LogAttemptParams;
    expect(logCall.overallScore).toBe(89);
    expect(logCall.userId).toBe("user-1");
    expect(logCall.providerCostUsd).toBeGreaterThan(0);

    // audit called with status='ok'.
    const okAudit = (deps.audit as ReturnType<typeof vi.fn>).mock.calls.find(
      (call) => (call[0] as { status: string }).status === "ok",
    );
    expect(okAudit).toBeDefined();
  });
});

describe("handleRequest — Azure timeout", () => {
  it("returns 200 sentinel use_local:true when fetch aborts past the timeout", async () => {
    const deps = makeDeps({
      // fetch resolves only after 200ms; deps.azureTimeoutMs = 50ms (set
      // in makeDeps default). The handler's AbortController should fire
      // first and the catch branch maps it to use_local sentinel.
      fetch: vi.fn().mockImplementation(
        (_url, init) =>
          new Promise((_resolve, reject) => {
            const signal = (init as RequestInit).signal as AbortSignal | null;
            if (signal) {
              signal.addEventListener("abort", () => {
                reject(
                  Object.assign(new Error("aborted"), { name: "AbortError" }),
                );
              });
            }
            // Never resolve naturally.
          }),
      ),
    });
    const req = makeRequest(buildSilentWav(2));
    const res = await handleRequest(req, deps);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      ok: boolean;
      use_local: boolean;
      reason: string;
    };
    expect(body.ok).toBe(false);
    expect(body.use_local).toBe(true);
    expect(body.reason).toBe("azure_timeout");
    // Azure failure audited as whisper_error with the timeout marker.
    const timeoutAudit = (deps.audit as ReturnType<typeof vi.fn>).mock.calls.find(
      (call) =>
        (call[0] as { errorMsg?: string }).errorMsg === "azure_timeout",
    );
    expect(timeoutAudit).toBeDefined();
    // Did NOT call logAttempt (no successful score to log).
    expect(deps.logAttempt).not.toHaveBeenCalled();
  });
});

// ── Pure-helper tests ─────────────────────────────────────────────────────

describe("parseWavHeader", () => {
  it("parses a valid 16 kHz mono 16-bit WAV and computes duration", () => {
    const wav = buildSilentWav(3);
    const info = parseWavHeader(wav);
    expect(info.isWav).toBe(true);
    expect(info.durationSeconds).toBeCloseTo(3, 1);
  });

  it("rejects non-WAV bytes (random binary)", () => {
    const buf = new Uint8Array([0xff, 0xfb, 0x90, 0x00]); // MP3 magic
    const info = parseWavHeader(buf);
    expect(info.isWav).toBe(false);
    expect(info.errorReason).toBe("too_short");
  });

  it("rejects WAV at 44.1 kHz (not Azure-compatible)", () => {
    const wav = buildSilentWav(1);
    // Patch sample rate to 44100 in-place.
    new DataView(wav.buffer).setUint32(24, 44_100, true);
    const info = parseWavHeader(wav);
    expect(info.isWav).toBe(false);
    expect(info.errorReason).toContain("not_16khz");
  });
});

describe("projectAzureResponse", () => {
  it("clamps and rounds AccuracyScore values, computes statuses", () => {
    const projected = projectAzureResponse({
      RecognitionStatus: "Success",
      NBest: [{
        PronunciationAssessment: { AccuracyScore: 84.6 },
        Words: [
          { Word: "ok", PronunciationAssessment: { AccuracyScore: 99 }, Phonemes: [] },
          { Word: "fine", PronunciationAssessment: { AccuracyScore: 70 }, Phonemes: [] },
          { Word: "bad", PronunciationAssessment: { AccuracyScore: 30 }, Phonemes: [] },
        ],
      }],
    });
    expect(projected.overallScore).toBe(85);
    expect(projected.wordScores[0].status).toBe("correct");
    expect(projected.wordScores[1].status).toBe("close");
    expect(projected.wordScores[2].status).toBe("wrong");
  });
});

describe("scoreToStatus + clampScore", () => {
  it("clamps out-of-range and NaN values to [0, 100]", () => {
    expect(clampScore(150)).toBe(100);
    expect(clampScore(-5)).toBe(0);
    expect(clampScore(Number.NaN)).toBe(0);
    expect(clampScore(72.4)).toBe(72);
  });

  it("status thresholds are 85 / 60 / 0", () => {
    expect(scoreToStatus(85)).toBe("correct");
    expect(scoreToStatus(84)).toBe("close");
    expect(scoreToStatus(60)).toBe("close");
    expect(scoreToStatus(59)).toBe("wrong");
  });
});

describe("AZURE_PHONEME_LIMITS", () => {
  it("exports the constants the Day-2 client needs to align with", () => {
    expect(AZURE_PHONEME_LIMITS.MAX_AUDIO_SECONDS).toBe(60);
    expect(AZURE_PHONEME_LIMITS.MAX_BYTES).toBe(2 * 1024 * 1024);
    expect(AZURE_PHONEME_LIMITS.DAILY_CAP_FREE).toBe(10);
    expect(AZURE_PHONEME_LIMITS.DAILY_CAP_PAID).toBe(60);
  });
});
