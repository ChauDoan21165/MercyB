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
//   3. Budget bypass — denied check_ai_budget no longer short-circuits.
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
  localeForAccent,
  normaliseAccentInput,
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

/**
 * Default profile shape for tests: free tier (0), trial active for the
 * next hour. Override via `makeDeps({ fetchUserProfile: ... })`.
 */
function activeTrialProfile() {
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  return {
    trial_expires_at: oneHourFromNow,
    trial_ends_at: null,
    trial_end: null,
    premium_status: null,
    premium_expires_at: null,
    tier: 0,
  };
}

function makeDeps(overrides: Partial<Deps> = {}): Deps {
  return {
    getUserFromAuthHeader: vi.fn().mockResolvedValue({ id: "user-1" }),
    rateLimit: vi.fn().mockResolvedValue(undefined),
    checkIpRateLimit: vi.fn().mockResolvedValue({ allowed: true }),
    fetch: vi.fn(),
    checkAiBudget: vi.fn().mockResolvedValue({ allowed: true }),
    fetchUserProfile: vi.fn().mockResolvedValue(activeTrialProfile()),
    sumGlobalCostToday: vi.fn().mockResolvedValue(0),
    audit: vi.fn().mockResolvedValue(undefined),
    logAttempt: vi.fn().mockResolvedValue(undefined),
    azureKey: "test-key",
    azureUrlForAccent: (accent) =>
      `https://test.example.com/azure?language=${accent}`,
    globalDailyCapUsd: 25,
    usdToVnd: 26000,
    azureTimeoutMs: 50,
    ...overrides,
  };
}

/** Synthetic Azure happy-path response builder. */
function azureSuccessResponse(): Response {
  return new Response(
    JSON.stringify({
      RecognitionStatus: "Success",
      DisplayText: "I think this is going to work",
      NBest: [{
        AccuracyScore: 89,
        Words: [
          { Word: "I", AccuracyScore: 90, Phonemes: [] },
          { Word: "think", AccuracyScore: 67, Phonemes: [] },
        ],
      }],
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
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

describe("handleRequest — budget bypass (chat-RPC no longer gates phoneme)", () => {
  it("ignores check_ai_budget result and proceeds to Azure", async () => {
    // The chat-models AI-budget RPC (`check_ai_budget`) is no longer
    // consulted by the phoneme scorer — phoneme cost is bounded by the
    // upstream rate limit + global daily cap + trial gate + audio caps.
    // A denied budget should NOT short-circuit the request anymore.
    const deps = makeDeps({
      checkAiBudget: vi
        .fn()
        .mockResolvedValue({ allowed: false, message: "Daily budget reached." }),
      fetch: vi.fn().mockResolvedValue(azureSuccessResponse()),
    });
    const req = makeRequest(buildSilentWav(2));
    const res = await handleRequest(req, deps);

    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; provider: string };
    expect(body.ok).toBe(true);
    expect(body.provider).toBe("azure");
    // Azure WAS called (the budget reject didn't short-circuit).
    expect(deps.fetch).toHaveBeenCalledOnce();
    // No `budget_exceeded` audit row — the path is gone.
    const budgetAudit = (deps.audit as ReturnType<typeof vi.fn>).mock.calls.find(
      (call) =>
        (call[0] as { status: string }).status === "budget_exceeded" &&
        (call[0] as { errorMsg?: string }).errorMsg === "ai_budget_exceeded",
    );
    expect(budgetAudit).toBeUndefined();
  });
});

describe("handleRequest — Azure happy path", () => {
  it("returns 200 with unified shape including per-phoneme scores", async () => {
    const azureBody: AzureResponse = {
      RecognitionStatus: "Success",
      DisplayText: "I think this is going to work",
      NBest: [{
        Display: "I think this is going to work",
        AccuracyScore: 89,
        Words: [
          {
            Word: "I",
            AccuracyScore: 88,
            Phonemes: [{ Phoneme: "ay", AccuracyScore: 88 }],
          },
          {
            Word: "think",
            AccuracyScore: 67,
            Phonemes: [
              { Phoneme: "th", AccuracyScore: 48 },
              { Phoneme: "ih", AccuracyScore: 42 },
              { Phoneme: "ng", AccuracyScore: 100 },
              { Phoneme: "k",  AccuracyScore: 53 },
            ],
          },
          {
            Word: "this",
            AccuracyScore: 94,
            Phonemes: [{ Phoneme: "dh", AccuracyScore: 94 }],
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

describe("handleRequest — Pronunciation-Assessment header format", () => {
  it("sends STANDARD base64 (not base64url) per Microsoft REST API contract", async () => {
    // Microsoft's official REST docs for Pronunciation Assessment use
    // standard base64 (`echo … | base64 | tr -d '\n'`). When this code
    // previously sent base64url ("-"/"_"/no padding), Azure's gateway
    // returned HTTP 400 with the bare string `"Bad request"` — see
    // PR #259 for the full diagnosis. This test locks the contract so
    // a future refactor can't reintroduce base64url.
    let capturedHeaderValue: string | null = null;
    const fetchSpy = vi.fn().mockImplementation((_url: string, init: RequestInit) => {
      const headers = init.headers as Record<string, string>;
      capturedHeaderValue = headers["Pronunciation-Assessment"];
      return Promise.resolve(azureSuccessResponse());
    });
    const deps = makeDeps({ fetch: fetchSpy });
    const req = makeRequest(buildSilentWav(2));
    await handleRequest(req, deps);

    expect(fetchSpy).toHaveBeenCalled();
    expect(capturedHeaderValue).toBeTruthy();
    // Standard base64 alphabet only — base64url substitutions ("-"/"_")
    // would indicate a regression to the old format that Azure 400s on.
    expect(capturedHeaderValue).not.toMatch(/[-_]/);
    // Standard base64 alphabet (A-Z, a-z, 0-9, +, /, =).
    expect(capturedHeaderValue).toMatch(/^[A-Za-z0-9+/=]+$/);
    // Header decodes back to the expected JSON config.
    const decodedJson = atob(capturedHeaderValue!);
    const config = JSON.parse(decodedJson) as Record<string, unknown>;
    expect(config.ReferenceText).toBe("I think this is going to work");
    expect(config.GradingSystem).toBe("HundredMark");
    expect(config.Granularity).toBe("Phoneme");
    expect(config.EnableMiscue).toBe(true);
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

describe("handleRequest — Azure provider auth", () => {
  it.each([401, 403])("returns use_local sentinel when Azure rejects provider credentials with HTTP %i", async (status) => {
    const deps = makeDeps({
      azureKey: "super-secret-azure-key",
      fetch: vi.fn().mockResolvedValue(
        new Response("invalid subscription key", { status }),
      ),
    });

    const res = await handleRequest(makeRequest(buildSilentWav(2)), deps);

    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      ok: boolean;
      use_local: boolean;
      reason: string;
    };
    expect(body.ok).toBe(false);
    expect(body.use_local).toBe(true);
    expect(body.reason).toBe("azure_auth_failed");
    expect(deps.logAttempt).not.toHaveBeenCalled();
    expect(JSON.stringify(body)).not.toContain("super-secret-azure-key");
    expect(deps.audit).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "whisper_error",
        errorMsg: expect.stringContaining(`azure_${status}`),
      }),
    );
  });

  it("keeps Azure auth flapping observable without duplicate persistence", async () => {
    const fetch = vi.fn()
      .mockResolvedValueOnce(new Response("invalid subscription key", { status: 401 }))
      .mockResolvedValueOnce(azureSuccessResponse());
    const deps = makeDeps({ fetch });

    const first = await handleRequest(makeRequest(buildSilentWav(2)), deps);
    const firstBody = (await first.json()) as { ok: boolean; use_local: boolean; reason: string };
    expect(firstBody).toEqual({
      ok: false,
      use_local: true,
      reason: "azure_auth_failed",
    });
    expect(deps.logAttempt).not.toHaveBeenCalled();

    const second = await handleRequest(makeRequest(buildSilentWav(2)), deps);
    const secondBody = (await second.json()) as { ok: boolean; provider: string };
    expect(secondBody.ok).toBe(true);
    expect(secondBody.provider).toBe("azure");
    expect(deps.logAttempt).toHaveBeenCalledOnce();
    expect(deps.audit).toHaveBeenCalledWith(
      expect.objectContaining({ errorMsg: expect.stringContaining("azure_401") }),
    );
    expect(deps.audit).toHaveBeenCalledWith(
      expect.objectContaining({ status: "ok" }),
    );
  });

  it("does not persist attempts on partial provider outage or network failure", async () => {
    const deps = makeDeps({
      fetch: vi.fn().mockRejectedValue(new Error("getaddrinfo ENOTFOUND speech.azure.test")),
    });

    const res = await handleRequest(makeRequest(buildSilentWav(2)), deps);
    const body = (await res.json()) as { ok: boolean; use_local: boolean; reason: string };

    expect(res.status).toBe(200);
    expect(body.ok).toBe(false);
    expect(body.use_local).toBe(true);
    expect(body.reason).toBe("azure_network_failed");
    expect(deps.logAttempt).not.toHaveBeenCalled();
    expect(deps.audit).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "whisper_error",
        errorMsg: expect.stringContaining("azure_throw"),
      }),
    );
  });

  it("keeps alternating 401/timeout/403 failures rejected and non-persistent", async () => {
    const fetch = vi.fn()
      .mockResolvedValueOnce(new Response("invalid subscription key", { status: 401 }))
      .mockImplementationOnce((_url, init) =>
        new Promise((_resolve, reject) => {
          const signal = (init as RequestInit).signal as AbortSignal | null;
          signal?.addEventListener("abort", () => {
            reject(Object.assign(new Error("aborted"), { name: "AbortError" }));
          });
        })
      )
      .mockResolvedValueOnce(new Response("forbidden subscription", { status: 403 }));
    const deps = makeDeps({ fetch });

    const first = await handleRequest(makeRequest(buildSilentWav(2)), deps);
    const second = await handleRequest(makeRequest(buildSilentWav(2)), deps);
    const third = await handleRequest(makeRequest(buildSilentWav(2)), deps);
    const bodies = await Promise.all([first.json(), second.json(), third.json()]) as Array<{ reason: string; use_local: boolean }>;

    expect(bodies.map((body) => body.reason)).toEqual([
      "azure_auth_failed",
      "azure_timeout",
      "azure_auth_failed",
    ]);
    expect(bodies.every((body) => body.use_local === true)).toBe(true);
    expect(deps.logAttempt).not.toHaveBeenCalled();
    expect(deps.audit).toHaveBeenCalledWith(expect.objectContaining({ errorMsg: expect.stringContaining("azure_401") }));
    expect(deps.audit).toHaveBeenCalledWith(expect.objectContaining({ errorMsg: "azure_timeout" }));
    expect(deps.audit).toHaveBeenCalledWith(expect.objectContaining({ errorMsg: expect.stringContaining("azure_403") }));
  });

  it("does not promote partial provider responses into persisted attempts", async () => {
    const deps = makeDeps({
      fetch: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ RecognitionStatus: "Success", NBest: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    });

    const res = await handleRequest(makeRequest(buildSilentWav(2)), deps);
    const body = (await res.json()) as { ok: boolean; use_local: boolean; reason: string };

    expect(res.status).toBe(200);
    expect(body.ok).toBe(false);
    expect(body.use_local).toBe(true);
    expect(body.reason).toBe("azure_no_match");
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
        AccuracyScore: 84.6,
        Words: [
          { Word: "ok", AccuracyScore: 99, Phonemes: [] },
          { Word: "fine", AccuracyScore: 70, Phonemes: [] },
          { Word: "bad", AccuracyScore: 30, Phonemes: [] },
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
    expect(AZURE_PHONEME_LIMITS.RATE_LIMIT_MAX_CALLS).toBe(30);
    expect(AZURE_PHONEME_LIMITS.AZURE_TIMEOUT_MS).toBe(15_000);
  });

  it("does NOT export per-day attempt caps anymore — trial is the gate", () => {
    expect(
      (AZURE_PHONEME_LIMITS as Record<string, unknown>).DAILY_CAP_FREE,
    ).toBeUndefined();
    expect(
      (AZURE_PHONEME_LIMITS as Record<string, unknown>).DAILY_CAP_PAID,
    ).toBeUndefined();
  });
});

// ── Trial gating ──────────────────────────────────────────────────────────

describe("handleRequest — trial gating", () => {
  it("trial-expired free user → 200 use_local:true reason='trial_expired'", async () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const deps = makeDeps({
      fetchUserProfile: vi.fn().mockResolvedValue({
        trial_expires_at: oneHourAgo,
        trial_ends_at: null,
        trial_end: null,
        premium_status: null,
        premium_expires_at: null,
        tier: 0,
      }),
      // Azure fetch should NOT be called when trial is expired.
      fetch: vi.fn(),
    });
    const req = makeRequest(buildSilentWav(2));
    const res = await handleRequest(req, deps);

    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; use_local: boolean; reason: string };
    expect(body.ok).toBe(false);
    expect(body.use_local).toBe(true);
    expect(body.reason).toBe("trial_expired");
    // No Azure call on the trial-expired path.
    expect(deps.fetch).not.toHaveBeenCalled();
    expect(deps.logAttempt).not.toHaveBeenCalled();
    // Audited as budget_exceeded with the trial_expired marker.
    expect(deps.audit).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "budget_exceeded",
        errorMsg: "trial_expired",
      }),
    );
  });

  it("trial-active free user → cloud succeeds (200, ok:true)", async () => {
    const deps = makeDeps({
      // Default makeDeps already gives an active-trial profile.
      fetch: vi.fn().mockResolvedValue(azureSuccessResponse()),
    });
    const req = makeRequest(buildSilentWav(2));
    const res = await handleRequest(req, deps);

    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; provider: string };
    expect(body.ok).toBe(true);
    expect(body.provider).toBe("azure");
    expect(deps.fetch).toHaveBeenCalledOnce();
  });

  // B17 money-path: paid AFTER the trial lapsed (the normal upgrade
  // path — discovered case: "Mylinh"). tier is the useless TEXT '0' it
  // always is in prod; premium_status='active' is what must grant
  // access. Before the fix the dead `tier >= 1` numeric read returned
  // the trial_expired sentinel and the user got no cloud scoring.
  it("paid user (premium_status='active') → cloud succeeds even when all trial dates are in the past", async () => {
    const longExpired = new Date("2020-01-01T00:00:00Z").toISOString();
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const deps = makeDeps({
      fetchUserProfile: vi.fn().mockResolvedValue({
        trial_expires_at: longExpired,
        trial_ends_at: longExpired,
        trial_end: longExpired,
        premium_status: "active",
        premium_expires_at: future,
        tier: "0", // TEXT column — never written by billing (B5)
      }),
      fetch: vi.fn().mockResolvedValue(azureSuccessResponse()),
    });
    const req = makeRequest(buildSilentWav(2));
    const res = await handleRequest(req, deps);

    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; provider: string };
    expect(body.ok).toBe(true);
    expect(body.provider).toBe("azure");
    expect(deps.fetch).toHaveBeenCalledOnce();
  });

  // B13 caveat #3: past_due is the Stripe dunning window — the card
  // just failed and is being retried. The user is still paying and
  // must NOT be downgraded mid-dunning, even with an expired
  // premium_expires_at.
  it("past_due user with expired premium_expires_at → still allowed (dunning window)", async () => {
    const longExpired = new Date("2020-01-01T00:00:00Z").toISOString();
    const deps = makeDeps({
      fetchUserProfile: vi.fn().mockResolvedValue({
        trial_expires_at: longExpired,
        trial_ends_at: longExpired,
        trial_end: longExpired,
        premium_status: "past_due",
        premium_expires_at: longExpired,
        tier: "0",
      }),
      fetch: vi.fn().mockResolvedValue(azureSuccessResponse()),
    });
    const res = await handleRequest(makeRequest(buildSilentWav(2)), deps);

    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
    expect(deps.fetch).toHaveBeenCalledOnce();
  });

  it("defensive: legacy tier '2' string with no premium_status → still allowed", async () => {
    const longExpired = new Date("2020-01-01T00:00:00Z").toISOString();
    const deps = makeDeps({
      fetchUserProfile: vi.fn().mockResolvedValue({
        trial_expires_at: longExpired,
        trial_ends_at: longExpired,
        trial_end: longExpired,
        premium_status: null,
        premium_expires_at: null,
        tier: "2",
      }),
      fetch: vi.fn().mockResolvedValue(azureSuccessResponse()),
    });
    const res = await handleRequest(makeRequest(buildSilentWav(2)), deps);

    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
  });

  // The fix must NOT over-grant: a genuinely free user (inactive
  // status, tier '0') whose trial lapsed still gets the trial_expired
  // sentinel — premium_status being read does not weaken the gate.
  it("truly free user (premium_status='inactive', tier '0', expired trial) → trial_expired sentinel", async () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const deps = makeDeps({
      fetchUserProfile: vi.fn().mockResolvedValue({
        trial_expires_at: oneHourAgo,
        trial_ends_at: null,
        trial_end: null,
        premium_status: "inactive",
        premium_expires_at: null,
        tier: "0",
      }),
      fetch: vi.fn(),
    });
    const res = await handleRequest(makeRequest(buildSilentWav(2)), deps);

    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      ok: boolean;
      use_local: boolean;
      reason: string;
    };
    expect(body.ok).toBe(false);
    expect(body.use_local).toBe(true);
    expect(body.reason).toBe("trial_expired");
    expect(deps.fetch).not.toHaveBeenCalled();
  });

  it("user profile fetch fails → cloud still allowed (don't block on infra error)", async () => {
    const deps = makeDeps({
      fetchUserProfile: vi
        .fn()
        .mockRejectedValue(new Error("postgres_unreachable")),
      fetch: vi.fn().mockResolvedValue(azureSuccessResponse()),
    });
    const req = makeRequest(buildSilentWav(2));
    const res = await handleRequest(req, deps);

    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
    expect(deps.fetch).toHaveBeenCalledOnce();
    // The infra error was logged via audit so we can spot it later.
    const profileAudit = (deps.audit as ReturnType<typeof vi.fn>).mock.calls.find(
      (call) =>
        typeof (call[0] as { errorMsg?: string }).errorMsg === "string" &&
        ((call[0] as { errorMsg: string }).errorMsg.startsWith(
          "trial_check_profile_threw",
        )),
    );
    expect(profileAudit).toBeDefined();
  });

  it("missing profile row (null) → cloud still allowed (legacy users)", async () => {
    const deps = makeDeps({
      fetchUserProfile: vi.fn().mockResolvedValue(null),
      fetch: vi.fn().mockResolvedValue(azureSuccessResponse()),
    });
    const req = makeRequest(buildSilentWav(2));
    const res = await handleRequest(req, deps);

    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
  });

  it("all trial timestamps null → treated as not expired (legacy free users)", async () => {
    const deps = makeDeps({
      fetchUserProfile: vi.fn().mockResolvedValue({
        trial_expires_at: null,
        trial_ends_at: null,
        trial_end: null,
        premium_status: null,
        premium_expires_at: null,
        tier: 0,
      }),
      fetch: vi.fn().mockResolvedValue(azureSuccessResponse()),
    });
    const req = makeRequest(buildSilentWav(2));
    const res = await handleRequest(req, deps);

    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
  });
});

describe("accent locale routing", () => {
  it("localeForAccent maps each accent to its BCP-47 code", () => {
    expect(localeForAccent("us")).toBe("en-US");
    expect(localeForAccent("uk")).toBe("en-GB");
    expect(localeForAccent("au")).toBe("en-AU");
    expect(localeForAccent("ca")).toBe("en-CA");
  });

  it("normaliseAccentInput defaults to 'us' for missing / unknown input", () => {
    expect(normaliseAccentInput(undefined)).toBe("us");
    expect(normaliseAccentInput(null)).toBe("us");
    expect(normaliseAccentInput("")).toBe("us");
    expect(normaliseAccentInput("klingon")).toBe("us");
    expect(normaliseAccentInput("UK")).toBe("uk");
    expect(normaliseAccentInput("  au  ")).toBe("au");
  });

  it("threads the accent into azureUrlForAccent when the form field is present", async () => {
    const seenUrls: string[] = [];
    const deps = makeDeps({
      azureUrlForAccent: (accent) => {
        const url = `https://test.example.com/azure?language=${accent}`;
        return url;
      },
      fetch: vi.fn().mockImplementation((input: string) => {
        seenUrls.push(input);
        return Promise.resolve(azureSuccessResponse());
      }) as unknown as Deps["fetch"],
    });

    const formData = new FormData();
    const blob = new Blob([buildSilentWav(2)], { type: "audio/wav" });
    formData.append("audio", blob, "test.wav");
    formData.append("target_text", "I think this is going to work");
    formData.append("roomId", "room-test");
    formData.append("lineId", "line-test");
    formData.append("accent", "uk");
    const req = new Request("https://test.example.com/azure-phoneme", {
      method: "POST",
      body: formData,
      headers: { Authorization: "Bearer test-jwt" },
    });

    const res = await handleRequest(req, deps);
    expect(res.status).toBe(200);
    expect(seenUrls).toEqual(["https://test.example.com/azure?language=uk"]);
  });
});
