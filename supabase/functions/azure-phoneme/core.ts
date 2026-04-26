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
const DAILY_CAP_FREE = 10;
const DAILY_CAP_PAID = 60;
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
  | "daily_cap_reached"
  | "azure_no_match"
  | "azure_timeout"
  | "azure_error"
  | "audio_decode_error";

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
  /** Profile tier lookup; 0 = free, ≥1 = paid. */
  getUserTier: (userId: string) => Promise<number>;
  /** Count of today's `status='ok'` rows in speech_analysis_logs for this user. */
  countOkAttemptsToday: (userId: string) => Promise<number>;
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

    // 3. Per-user daily attempt cap (free=10, paid=60). Sentinel, NOT 4xx.
    const userTier = await deps.getUserTier(userId);
    const dailyCap = userTier > 0 ? DAILY_CAP_PAID : DAILY_CAP_FREE;
    const todayCount = await deps.countOkAttemptsToday(userId);
    if (todayCount >= dailyCap) {
      await deps.audit({
        userId,
        status: "budget_exceeded",
        audioSeconds,
        errorMsg: `daily_cap_reached:${todayCount}/${dailyCap}`,
      });
      return sentinel("daily_cap_reached");
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
      return sentinel("daily_cap_reached");
    }

    // 5. AI budget reservation.
    const costUsd = computeCostUsd(audioSeconds);
    const reserveVnd = Math.max(1, Math.ceil(costUsd * deps.usdToVnd));
    const budget = await deps.checkAiBudget(userId, reserveVnd);
    if (!budget.allowed) {
      await deps.audit({
        userId,
        status: "budget_exceeded",
        audioSeconds,
        openaiCostUsd: costUsd,
        errorMsg: budget.message ?? "ai_budget_exceeded",
      });
      return json(
        {
          error: "budget_exceeded",
          message:
            budget.message ?? "Daily AI budget reached. Try again later.",
          reset_at: budget.reset_at ?? null,
        },
        402,
      );
    }

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
      const config = {
        ReferenceText: targetText,
        GradingSystem: "HundredMark",
        Granularity: "Phoneme",
        EnableMiscue: true,
      };
      const headerValue = btoa(JSON.stringify(config));
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
        body: fileBuffer,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
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

// Re-exports of the validation constants for tests + Day-2 client agreement.
export const AZURE_PHONEME_LIMITS = {
  MAX_BYTES,
  MAX_AUDIO_SECONDS,
  RATE_LIMIT_MAX_CALLS,
  RATE_LIMIT_WINDOW_MS,
  DAILY_CAP_FREE,
  DAILY_CAP_PAID,
  AZURE_TIMEOUT_MS,
} as const;
