// Path: supabase/functions/azure-phoneme/core.ts
//
// Day 1 of the Azure Pronunciation Assessment plan, deps-injection
// core. This module is **Deno-free**: no `Deno.env.get`, no
// `https://…` URL imports, only standard web APIs. Vitest can import
// it directly under Node without booting Deno.
//
// `index.ts` is the Deno entry point. It wires the production `Deps`
// (Supabase admin client, real `fetch`, env-var reads) and calls
// `handleRequest(req, deps)`.
//
// Tests at __tests__/index.test.ts pass fake `Deps` and assert
// behaviour for: missing JWT → 401, rate limit → 429, budget exceeded
// → 402, Azure happy → 200 with unified shape, Azure timeout → 200
// sentinel.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ── Validation constants ──────────────────────────────────────────────────

const MAX_BYTES = 2 * 1024 * 1024;
const MAX_AUDIO_SECONDS = 60;
const AZURE_USD_PER_MINUTE = 1 / 60;
const RATE_LIMIT_MAX_CALLS = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const AZURE_TIMEOUT_MS = 15_000;

// ── Types ─────────────────────────────────────────────────────────────────

export type AuditStatus =
  | "ok"
  | "no_speech"
  | "rate_limited"
  | "budget_exceeded"
  | "invalid_audio"
  | "whisper_error"
  | "auth_required";

export type AuditParams = {
  userId: string;
  status: AuditStatus;
  audioSeconds?: number;
  openaiCostUsd?: number;
  errorMsg?: string;
};

export type LogAttemptParams = {
  userId: string;
  roomId: string;
  lineId: string;
  targetText: string;
  transcript: string;
  overallScore: number;
  wordScores: UnifiedWordScore[];
  phonemeScores: unknown;
  providerCostUsd: number;
};

export type AiBudgetResult = {
  allowed: boolean;
  message?: string | null;
  reset_at?: string | null;
};

export type UnifiedWordScore = {
  word: string;
  heard: string;
  score: number;
  status: "correct" | "close" | "wrong";
  phonemes: { phoneme: string; score: number }[];
};

export type SuccessResponse = {
  ok: true;
  score: number;
  word_scores: UnifiedWordScore[];
  provider: "azure";
  audio_seconds: number;
  cost_usd_cents: number;
};

export type SentinelReason =
  | "trial_expired"
  | "global_daily_cap_reached"
  | "azure_no_match"
  | "azure_timeout"
  | "azure_error"
  | "audio_decode_error";

export type UserProfileRow = {
  trial_expires_at: string | null;
  trial_ends_at: string | null;
  trial_end: string | null;
  tier: number | null;
};

export type TrialAccessResult =
  | { allowed: true }
  | { allowed: false; reason: "trial_expired" };

export type SentinelResponse = {
  ok: false;
  use_local: true;
  reason: SentinelReason;
};

type AzurePhoneme = {
  Phoneme?: string;
  PronunciationAssessment?: { AccuracyScore?: number };
};
type AzureWord = {
  Word?: string;
  Offset?: number;
  Duration?: number;
  PronunciationAssessment?: { AccuracyScore?: number; ErrorType?: string };
  Phonemes?: AzurePhoneme[];
};
type AzureNBest = {
  Display?: string;
  PronunciationAssessment?: { AccuracyScore?: number };
  Words?: AzureWord[];
};
export type AzureResponse = {
  RecognitionStatus?: string;
  DisplayText?: string;
  NBest?: AzureNBest[];
};

export interface Deps {
  /** Resolves the JWT and returns the user, or null on failure. */
  getUserFromAuthHeader: (req: Request) => Promise<{ id: string } | null>;
  /** Throws an Error with message "RATE_LIMIT_EXCEEDED" when the bucket is full. */
  rateLimit: (key: string, max: number, windowMs: number) => Promise<void>;
  /** Network call to Azure. Bound to the same shape as the global fetch. */
  fetch: (input: string, init: RequestInit) => Promise<Response>;
  /** AI-budget reservation RPC. */
  checkAiBudget: (userId: string, reserveVnd: number) => Promise<AiBudgetResult>;
  /**
   * Read the trial / tier columns from the `profiles` row for this user.
   * Returns null on missing row or query error so `checkTrialAccess` can
   * decide the conservative thing (allow — local rate-limit + budget
   * still protect us; we don't want to block legitimate users on a
   * Postgres blip).
   */
  fetchUserProfile: (userId: string) => Promise<UserProfileRow | null>;
  /** Sum of today's openai_cost_usd in speech_analysis_logs across all users. */
  sumGlobalCostToday: () => Promise<number>;
  /** Insert one row into speech_analysis_logs. Best-effort; never throws. */
  audit: (params: AuditParams) => Promise<void>;
  /** Insert one row into speech_attempts. Best-effort; never throws. */
  logAttempt: (params: LogAttemptParams) => Promise<void>;
  /** Azure subscription key. Empty string indicates misconfiguration → sentinel. */
  azureKey: string;
  /** Fully-qualified Azure REST URL (region pre-baked in). */
  azureUrl: string;
  /** Hard ceiling in USD/day for Azure spend across all users. */
  globalDailyCapUsd: number;
  /** USD → VND conversion factor for the budget RPC. */
  usdToVnd: number;
  /** Optional injection point for AbortSignal/timer testing. */
  azureTimeoutMs?: number;
}

// ── Public entry ──────────────────────────────────────────────────────────

export async function handleRequest(req: Request, deps: Deps): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // 1. Identity from JWT.
  const user = await deps.getUserFromAuthHeader(req);
  if (!user) {
    return json(
      {
        error: "auth_required",
        message: "Sign in to use pronunciation scoring.",
        message_vi: "Vui lòng đăng nhập để dùng tính năng chấm phát âm.",
      },
      401,
    );
  }
  const userId = user.id;

  // 2. Per-user rate limit.
  try {
    await deps.rateLimit(
      `azure-phoneme:${userId}`,
      RATE_LIMIT_MAX_CALLS,
      RATE_LIMIT_WINDOW_MS,
    );
  } catch (err) {
    if (err instanceof Error && err.message === "RATE_LIMIT_EXCEEDED") {
      await deps.audit({
        userId,
        status: "rate_limited",
        errorMsg: `>${RATE_LIMIT_MAX_CALLS} calls in ${
          RATE_LIMIT_WINDOW_MS / 1000
        }s`,
      });
      return json(
        {
          error: "rate_limit_exceeded",
          message:
            "Too many pronunciation checks in the last hour. Try again later.",
          message_vi:
            "Bạn đã thử chấm phát âm quá nhiều trong một giờ qua. Thử lại sau nhé.",
          retry_after_seconds: 3600,
        },
        429,
      );
    }
    console.error("rateLimit subsystem error:", err);
  }

  try {
    const formData = await req.formData();

    const audio = formData.get("audio");
    const roomId = String(formData.get("roomId") ?? "").trim();
    const lineId = String(formData.get("lineId") ?? "").trim();
    const targetText = String(formData.get("target_text") ?? "").trim();

    if (!(audio instanceof File) && !(audio instanceof Blob)) {
      await deps.audit({
        userId,
        status: "invalid_audio",
        errorMsg: "missing_audio_file",
      });
      return json({ error: "Missing audio file" }, 400);
    }
    if (!targetText) {
      await deps.audit({
        userId,
        status: "invalid_audio",
        errorMsg: "missing_target_text",
      });
      return json({ error: "Missing target_text" }, 400);
    }

    const sizeBytes = (audio as Blob).size ?? 0;
    if (sizeBytes <= 0) {
      await deps.audit({ userId, status: "invalid_audio", errorMsg: "empty_audio" });
      return json({ error: "Empty audio file" }, 400);
    }
    if (sizeBytes > MAX_BYTES) {
      await deps.audit({
        userId,
        status: "invalid_audio",
        errorMsg: `oversize:${sizeBytes}b`,
      });
      return json(
        {
          error: "audio_too_large",
          message: "Audio file is too large. Keep it under 2 MB.",
          message_vi: "File âm thanh quá lớn. Vui lòng giữ dưới 2 MB.",
        },
        413,
      );
    }

    const arrayBuffer = await (audio as Blob).arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    const wavInfo = parseWavHeader(fileBuffer);
    if (!wavInfo.isWav) {
      await deps.audit({
        userId,
        status: "invalid_audio",
        errorMsg: `bad_wav_header:${wavInfo.errorReason ?? "unknown"}`,
      });
      return json(
        {
          error: "unsupported_audio_format",
          message:
            "Audio must be WAV PCM 16 kHz mono. Convert before uploading.",
          message_vi:
            "Định dạng âm thanh phải là WAV PCM 16 kHz mono. Vui lòng chuyển đổi trước khi tải lên.",
        },
        415,
      );
    }

    const audioSeconds = wavInfo.durationSeconds;
    if (audioSeconds > MAX_AUDIO_SECONDS) {
      await deps.audit({
        userId,
        status: "invalid_audio",
        errorMsg: `over_60s:${audioSeconds.toFixed(2)}s`,
      });
      return json(
        {
          error: "audio_too_long",
          message: "Recording is too long. Keep it under 60 seconds.",
          message_vi: "Đoạn ghi âm quá dài. Vui lòng giữ dưới 60 giây.",
        },
        413,
      );
    }

    // 3. Trial gating. Cloud is allowed when the user is paid (tier >= 1)
    //    OR their trial has not yet expired. Otherwise fall back to the
    //    local scorer via the use_local sentinel — never a 4xx, since
    //    "scoring still works, just locally" is the user-visible reality.
    //    Profile fetch errors fail-open: rate limit + budget still
    //    protect us; blocking legitimate users on a Postgres blip is the
    //    worse outcome.
    const trialAccess = await checkTrialAccess(
      { fetchUserProfile: deps.fetchUserProfile, audit: deps.audit },
      userId,
    );
    if (!trialAccess.allowed) {
      await deps.audit({
        userId,
        status: "budget_exceeded",
        audioSeconds,
        errorMsg: `trial_expired`,
      });
      return sentinel("trial_expired");
    }

    // 4. Global daily ceiling.
    const todayGlobalUsd = await deps.sumGlobalCostToday();
    if (todayGlobalUsd >= deps.globalDailyCapUsd) {
      await deps.audit({
        userId,
        status: "budget_exceeded",
        audioSeconds,
        errorMsg: `global_cap_reached:${todayGlobalUsd.toFixed(4)}`,
      });
      return sentinel("global_daily_cap_reached");
    }

    // 5. Cost computation only — the AI budget RPC is not used for phoneme
    //    scoring. Phoneme scoring has its own cost controls (per-user rate
    //    limit + global daily cap + trial gating + 2MB/60s audio caps), and
    //    the AI budget RPC was designed for chat models with different
    //    economics. Leaving the call in place rejected legitimate trial
    //    users with "available in paid plans", which contradicts the
    //    trial-gating policy already enforced above.
    const costUsd = computeCostUsd(audioSeconds);

    if (!deps.azureKey) {
      console.error("AZURE_SPEECH_KEY is missing");
      await deps.audit({
        userId,
        status: "whisper_error",
        audioSeconds,
        openaiCostUsd: costUsd,
        errorMsg: "azure_key_missing",
      });
      return sentinel("azure_error");
    }

    // 6. Call Azure with timeout.
    let azureBody: AzureResponse | null = null;
    let azureError: string | null = null;
    let timedOut = false;
    try {
      // Azure rejects ReferenceText that ends with punctuation
      // (".", "?", "!" etc) with HTTP 400 "Bad request". Practice
      // lines in MercySpeakTab routinely end with periods, so strip
      // trailing terminal punctuation + whitespace before sending.
      const referenceText = targetText.replace(/[\s.?!,;:]+$/, "");
      const config = {
        ReferenceText: referenceText,
        GradingSystem: "HundredMark",
        Granularity: "Phoneme",
        EnableMiscue: true,
      };
      // Azure's Pronunciation-Assessment header requires base64url
      // (RFC 4648 §5): no padding, "-" for "+", "_" for "/". Plain btoa()
      // produces standard base64 which Azure silently rejects, falling
      // back to vanilla speech recognition (every score = 0).
      const headerValue = btoa(JSON.stringify(config))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      const controller = new AbortController();
      const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, deps.azureTimeoutMs ?? AZURE_TIMEOUT_MS);

      const response = await deps.fetch(deps.azureUrl, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": deps.azureKey,
          "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
          "Pronunciation-Assessment": headerValue,
          Accept: "application/json",
        },
        // Send the raw ArrayBuffer directly. Deno's fetch will set
        // Content-Length automatically and not chunk. Earlier
        // observation that Uint8Array body chunks may have been
        // wrong; ArrayBuffer reliably sends fixed-length.
        body: arrayBuffer,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        let bodyText = "";
        try {
          bodyText = await response.text();
        } catch {
          bodyText = "<read failed>";
        }
        console.error(
          `azure ${response.status}`,
          "ct=", response.headers.get("content-type"),
          "body=", truncate(bodyText, 500),
        );
        azureError = `azure_${response.status}`;
      } else {
        azureBody = (await response.json()) as AzureResponse;
      }
    } catch (err) {
      if (timedOut) {
        azureError = "azure_timeout";
      } else if (err instanceof Error && err.name === "AbortError") {
        azureError = "azure_timeout";
      } else {
        azureError =
          err instanceof Error
            ? `azure_throw:${truncate(err.message, 100)}`
            : "azure_throw";
      }
    }

    if (azureError) {
      await deps.audit({
        userId,
        status: "whisper_error",
        audioSeconds,
        openaiCostUsd: costUsd,
        errorMsg: azureError,
      });
      return sentinel(azureError === "azure_timeout" ? "azure_timeout" : "azure_error");
    }

    if (!azureBody || azureBody.RecognitionStatus !== "Success") {
      const status = azureBody?.RecognitionStatus ?? "unknown";
      await deps.audit({
        userId,
        status: status === "NoMatch" ? "no_speech" : "whisper_error",
        audioSeconds,
        openaiCostUsd: costUsd,
        errorMsg: `azure_status:${status}`,
      });
      return sentinel(
        status === "NoMatch" ? "azure_no_match" : "azure_error",
      );
    }

    // 7. Project Azure response → unified shape.
    const projection = projectAzureResponse(azureBody);
    if (projection.wordScores.length === 0) {
      await deps.audit({
        userId,
        status: "no_speech",
        audioSeconds,
        openaiCostUsd: costUsd,
        errorMsg: "azure_empty_words",
      });
      return sentinel("azure_no_match");
    }

    // 8. Persist + audit.
    await deps.audit({
      userId,
      status: "ok",
      audioSeconds,
      openaiCostUsd: costUsd,
    });
    await deps.logAttempt({
      userId,
      roomId: roomId || "unknown",
      lineId: lineId || "unknown",
      targetText,
      transcript: azureBody.DisplayText ?? "",
      overallScore: projection.overallScore,
      wordScores: projection.wordScores,
      phonemeScores: projection.phonemeScores,
      providerCostUsd: costUsd,
    });

    const successBody: SuccessResponse = {
      ok: true,
      score: projection.overallScore,
      word_scores: projection.wordScores,
      provider: "azure",
      audio_seconds: Number(audioSeconds.toFixed(2)),
      cost_usd_cents: Math.round(costUsd * 10000) / 100,
    };
    return json(successBody, 200);
  } catch (err) {
    console.error("azure-phoneme error", err);
    const message = err instanceof Error ? err.message : "azure-phoneme failure";
    await deps.audit({
      userId,
      status: "whisper_error",
      errorMsg: truncate(message, 500),
    });
    return sentinel("azure_error");
  }
}

// ── Helpers (exported for tests) ──────────────────────────────────────────

export function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function sentinel(reason: SentinelReason): Response {
  const body: SentinelResponse = { ok: false, use_local: true, reason };
  return json(body, 200);
}

export function parseWavHeader(bytes: Uint8Array): {
  isWav: boolean;
  durationSeconds: number;
  errorReason?: string;
} {
  if (bytes.length < 44) {
    return { isWav: false, durationSeconds: 0, errorReason: "too_short" };
  }
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  if (
    String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) !== "RIFF" ||
    String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]) !== "WAVE"
  ) {
    return { isWav: false, durationSeconds: 0, errorReason: "bad_magic" };
  }

  let offset = 12;
  let formatTag = 0;
  let channels = 0;
  let sampleRate = 0;
  let bitsPerSample = 0;
  let dataSize = 0;
  let sawFmt = false;
  let sawData = false;

  while (offset + 8 <= bytes.length) {
    const chunkId = String.fromCharCode(
      bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3],
    );
    const chunkSize = dv.getUint32(offset + 4, true);
    const bodyOffset = offset + 8;

    if (chunkId === "fmt ") {
      if (bodyOffset + 16 > bytes.length) {
        return { isWav: false, durationSeconds: 0, errorReason: "truncated_fmt" };
      }
      formatTag     = dv.getUint16(bodyOffset, true);
      channels      = dv.getUint16(bodyOffset + 2, true);
      sampleRate    = dv.getUint32(bodyOffset + 4, true);
      bitsPerSample = dv.getUint16(bodyOffset + 14, true);
      sawFmt = true;
    } else if (chunkId === "data") {
      dataSize = chunkSize;
      sawData = true;
      break;
    }
    offset = bodyOffset + chunkSize + (chunkSize % 2);
  }

  if (!sawFmt || !sawData) {
    return { isWav: false, durationSeconds: 0, errorReason: "missing_chunk" };
  }
  if (formatTag !== 1) {
    return { isWav: false, durationSeconds: 0, errorReason: `not_pcm:${formatTag}` };
  }
  if (channels !== 1) {
    return { isWav: false, durationSeconds: 0, errorReason: `not_mono:${channels}` };
  }
  if (sampleRate !== 16_000) {
    return { isWav: false, durationSeconds: 0, errorReason: `not_16khz:${sampleRate}` };
  }
  if (bitsPerSample !== 16) {
    return { isWav: false, durationSeconds: 0, errorReason: `not_16bit:${bitsPerSample}` };
  }

  const bytesPerSecond = sampleRate * channels * (bitsPerSample / 8);
  const durationSeconds = bytesPerSecond > 0 ? dataSize / bytesPerSecond : 0;
  return { isWav: true, durationSeconds };
}

export function computeCostUsd(seconds: number): number {
  if (!seconds || seconds <= 0) return 0;
  return Number(((seconds / 60) * AZURE_USD_PER_MINUTE).toFixed(6));
}

export function projectAzureResponse(body: AzureResponse): {
  overallScore: number;
  wordScores: UnifiedWordScore[];
  phonemeScores: unknown;
} {
  const nbest = body.NBest?.[0];
  const overallRaw = nbest?.PronunciationAssessment?.AccuracyScore ?? 0;
  const overallScore = clampScore(overallRaw);

  const wordScores: UnifiedWordScore[] = (nbest?.Words ?? []).map((w) => {
    const wordText = (w.Word ?? "").trim();
    const wordScore = clampScore(w.PronunciationAssessment?.AccuracyScore ?? 0);
    const phonemes = (w.Phonemes ?? []).map((ph) => ({
      phoneme: (ph.Phoneme ?? "").trim(),
      score: clampScore(ph.PronunciationAssessment?.AccuracyScore ?? 0),
    }));
    return {
      word: wordText,
      heard: wordText,
      score: wordScore,
      status: scoreToStatus(wordScore),
      phonemes,
    };
  });

  return {
    overallScore,
    wordScores,
    phonemeScores: nbest?.Words ?? null,
  };
}

export function clampScore(raw: number): number {
  if (!Number.isFinite(raw)) return 0;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function scoreToStatus(score: number): "correct" | "close" | "wrong" {
  if (score >= 85) return "correct";
  if (score >= 60) return "close";
  return "wrong";
}

function truncate(s: string, max: number): string {
  return s.length <= max ? s : s.slice(0, max);
}

/**
 * Decide whether the calling user is allowed to use cloud scoring.
 *
 * Allow when EITHER:
 *   - they're paid (`tier >= 1`), OR
 *   - their trial has not yet expired
 *
 * "Trial expired" = `now > <first non-null of trial_expires_at,
 * trial_ends_at, trial_end>`. All three columns null = treat as not
 * expired (legacy users on the new column can still score).
 *
 * Profile-fetch failures fail-OPEN: rate limit (30/h) and the
 * AI-budget RPC still protect the function from runaway abuse, so
 * blocking real users on a Postgres blip is the worse trade.
 */
export async function checkTrialAccess(
  deps: {
    fetchUserProfile: (userId: string) => Promise<UserProfileRow | null>;
    audit?: (params: AuditParams) => Promise<void>;
  },
  userId: string,
): Promise<TrialAccessResult> {
  let profile: UserProfileRow | null;
  try {
    profile = await deps.fetchUserProfile(userId);
  } catch (err) {
    // Fail-open. Note in audit log if available so we can spot a
    // recurring infra problem.
    const msg = err instanceof Error ? err.message : "fetch_profile_threw";
    if (deps.audit) {
      try {
        await deps.audit({
          userId,
          status: "whisper_error",
          errorMsg: `trial_check_profile_threw:${truncate(msg, 80)}`,
        });
      } catch {
        /* audit is best-effort */
      }
    }
    return { allowed: true };
  }

  if (!profile) {
    // Row missing. Same fail-open rationale.
    if (deps.audit) {
      try {
        await deps.audit({
          userId,
          status: "whisper_error",
          errorMsg: "trial_check_profile_missing",
        });
      } catch {
        /* audit is best-effort */
      }
    }
    return { allowed: true };
  }

  const tier = typeof profile.tier === "number" ? profile.tier : 0;
  if (tier >= 1) return { allowed: true };

  const trialIso =
    profile.trial_expires_at ??
    profile.trial_ends_at ??
    profile.trial_end ??
    null;

  if (!trialIso) {
    // No trial timestamp set anywhere. Treat as not-yet-expired —
    // matches the web app's `inferTrialExpired` fallback in
    // src/hooks/useUserAccess.ts.
    return { allowed: true };
  }

  const expiresMs = Date.parse(trialIso);
  if (!Number.isFinite(expiresMs)) {
    // Unparseable timestamp — fail-open same as above.
    return { allowed: true };
  }

  if (Date.now() > expiresMs) {
    return { allowed: false, reason: "trial_expired" };
  }
  return { allowed: true };
}

// Re-exports of the validation constants for tests + Day-2 client agreement.
// Per-user-per-day caps (DAILY_CAP_FREE / DAILY_CAP_PAID) were removed in
// fix/azure-phoneme-trial-gating: trial state is the new gate.
export const AZURE_PHONEME_LIMITS = {
  MAX_BYTES,
  MAX_AUDIO_SECONDS,
  RATE_LIMIT_MAX_CALLS,
  RATE_LIMIT_WINDOW_MS,
  AZURE_TIMEOUT_MS,
} as const;
