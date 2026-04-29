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

// ── Accent → Azure locale mapping ────────────────────────────────────────
//
// Mirrors src/data/pronunciation/multiAccentReferences.ts ACCENT_METADATA.
// Inlined here because core.ts must stay Deno-free (no @ aliases) and the
// edge function deploys without the src/ tree. Keep these two in sync —
// dropping a locale here would silently fall back to en-US.

export type Accent = "us" | "uk" | "au" | "ca";
const ALL_ACCENTS: readonly Accent[] = ["us", "uk", "au", "ca"] as const;
const ACCENT_LOCALE: Record<Accent, string> = {
  us: "en-US",
  uk: "en-GB",
  au: "en-AU",
  ca: "en-CA",
};
const DEFAULT_ACCENT: Accent = "us";

export function localeForAccent(accent: Accent): string {
  return ACCENT_LOCALE[accent] ?? ACCENT_LOCALE[DEFAULT_ACCENT];
}

export function normaliseAccentInput(raw: unknown): Accent {
  if (typeof raw !== "string") return DEFAULT_ACCENT;
  const v = raw.trim().toLowerCase();
  return (ALL_ACCENTS as readonly string[]).includes(v)
    ? (v as Accent)
    : DEFAULT_ACCENT;
}

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
  /** Generic Azure failure — kept as catch-all for unexpected paths
   *  (the outer try/catch + Azure 5xx). Specific sub-categories below
   *  exist so the client can distinguish recoverable / actionable
   *  failures (auth/payload/env/network) from genuine server errors. */
  | "azure_error"
  | "audio_decode_error"
  /** AZURE_SPEECH_KEY env var is missing or empty. Ops issue —
   *  redeploy with the secret set. Client should surface this as
   *  "scoring temporarily unavailable" and not retry locally. */
  | "azure_missing_env"
  /** Azure rejected our subscription key (HTTP 401 / 403). Either
   *  the key is wrong or has been revoked. Same UX as missing_env
   *  from the learner's perspective, but distinct in logs / metrics. */
  | "azure_auth_failed"
  /** Azure returned HTTP 400 or a non-Success RecognitionStatus that
   *  isn't NoMatch (BadRequest, InvalidArgument, etc.). Means the
   *  audio / config / reference text was malformed. */
  | "azure_payload_failed"
  /** Network / DNS / TLS failure reaching Azure (fetch threw, not a
   *  timeout). Distinct from azure_timeout so we can monitor these
   *  separately. */
  | "azure_network_failed"
  /** Azure HTTP 200 but the JSON body failed to parse or was missing
   *  required fields. Indicates a contract drift on Azure's side. */
  | "azure_response_invalid";

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
  AccuracyScore?: number;
};
type AzureWord = {
  Word?: string;
  Offset?: number;
  Duration?: number;
  AccuracyScore?: number;
  ErrorType?: string;
  Phonemes?: AzurePhoneme[];
};
type AzureNBest = {
  Display?: string;
  AccuracyScore?: number;
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
  /**
   * Per-IP rate-limit gate. Second layer above the per-user `rateLimit`
   * — closes the bypass where a bot cycles anon sessions to reset its
   * per-user quota. Returns `{ allowed: true }` on pass; on block,
   * `{ allowed: false, response }` where `response` is the fully-built
   * 429 the handler must return as-is. Production wires this from
   * `_shared/ipRateLimit.ts` with admin-level bypass folded in.
   */
  checkIpRateLimit: (
    req: Request,
    userId: string,
  ) => Promise<{ allowed: boolean; response?: Response }>;
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
  /**
   * Build the fully-qualified Azure REST URL for a given accent. Production
   * wires this with the region pre-baked in and `?language=<bcp47>` chosen
   * via `localeForAccent(accent)` (en-US/en-GB/en-AU/en-CA). Accept-Language
   * is also set on the request below — the URL param drives recognition,
   * the header is belt-and-braces.
   */
  azureUrlForAccent: (accent: Accent) => string;
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

  // 1.5 Per-IP rate limit. Sits ABOVE the per-user rate limit so a bot
  //     that rotates anonymous sessions can't reset its quota by spawning
  //     fresh user_ids — the IP cap stays sticky. Helper fails-OPEN on
  //     missing IP / RPC error; admin level >= 9 bypasses entirely.
  try {
    const ipResult = await deps.checkIpRateLimit(req, userId);
    if (!ipResult.allowed && ipResult.response) {
      return ipResult.response;
    }
  } catch (err) {
    console.error("checkIpRateLimit threw:", err);
    // Fail open — never block legitimate traffic on a telemetry blip.
  }

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
    // Optional accent ('us'|'uk'|'au'|'ca'). Falls back to 'us' for any
    // missing / unknown value — matches the migration default and keeps
    // legacy callers (no accent field) working.
    const accent = normaliseAccentInput(formData.get("accent"));

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
      console.error("[azure-phoneme] AZURE_SPEECH_KEY env var is missing");
      await deps.audit({
        userId,
        status: "whisper_error",
        audioSeconds,
        openaiCostUsd: costUsd,
        errorMsg: "azure_key_missing",
      });
      return sentinel("azure_missing_env");
    }

    // 6. Call Azure with timeout.
    let azureBody: AzureResponse | null = null;
    let sentinelReason: SentinelReason | null = null;
    let auditMsg: string | null = null;
    let timedOut = false;
    try {
      // Azure rejects ReferenceText that ends with punctuation
      // (".", "?", "!" etc) with HTTP 400 "Bad request". Practice
      // lines in MercySpeakTab routinely end with periods, so strip
      // trailing terminal punctuation + whitespace before sending.
      const referenceText = targetText.replace(/[\s.?!,;:]+$/, "");

      // Azure also 400s on empty / whitespace-only ReferenceText.
      // Catch this before the network call so we don't waste an
      // Azure quota on a guaranteed-fail and we get a precise audit
      // reason instead of a generic 400.
      if (referenceText.length === 0) {
        await deps.audit({
          userId,
          status: "invalid_audio",
          audioSeconds,
          openaiCostUsd: costUsd,
          errorMsg: `empty_reference_text:original_len=${targetText.length}`,
        });
        console.error(
          `[azure-phoneme] Reference text empty after punctuation strip — input was '${truncate(targetText, 60)}'`,
        );
        return sentinel("azure_payload_failed");
      }

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

      const response = await deps.fetch(deps.azureUrlForAccent(accent), {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": deps.azureKey,
          "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
          "Pronunciation-Assessment": headerValue,
          Accept: "application/json",
          "Accept-Language": localeForAccent(accent),
        },
        body: arrayBuffer,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        // Categorise HTTP failures so the client can distinguish
        // ops issues (auth) from input issues (payload) from server
        // hiccups. The audit-log message keeps the precise status
        // code AND the response body so we can grep
        // speech_analysis_logs and see WHY Azure rejected the call,
        // not just that it did.
        // Read Azure's response body BEFORE returning so the actual
        // rejection reason (e.g. "ReferenceText length must be > 0",
        // "InvalidAudioFormat", "Pronunciation-Assessment header
        // is invalid") lands in audit + console logs. This block
        // runs for EVERY non-OK status, including 400, before any
        // sentinel is emitted.
        let azureBodyText = "";
        try {
          azureBodyText = await response.text();
        } catch {
          // Body may already be consumed or the connection may have
          // closed mid-read; record the truncation reason and move on.
          azureBodyText = "<body_read_failed>";
        }
        // Audit digest: 300 chars max, whitespace collapsed. Lands in
        // speech_analysis_logs.error_msg as `azure_<status>:<digest>`.
        const bodyDigest = truncate(
          azureBodyText.replace(/\s+/g, " ").trim(),
          300,
        );
        auditMsg = `azure_${response.status}:${bodyDigest}`;
        // Diagnostic context — request shape that Azure rejected.
        // Helps spot reference-text encoding / audio-size issues.
        const requestContext = {
          status: response.status,
          referenceTextLength: referenceText.length,
          referenceTextSample: truncate(referenceText, 80),
          audioBytes: arrayBuffer.byteLength,
          audioSeconds: Number(audioSeconds.toFixed(2)),
          accent,
          locale: localeForAccent(accent),
          configHeaderBase64UrlLength: headerValue.length,
        };
        // Always log the FULL untruncated body to Supabase function
        // logs alongside the digest. The digest hits 300 chars; the
        // raw body may be longer (Azure error pages with stack traces).
        console.error(
          `[azure-phoneme] Azure rejected request: HTTP ${response.status}. Full body:`,
          azureBodyText,
        );
        console.error(
          "[azure-phoneme] Request context:",
          requestContext,
        );
        if (response.status === 401 || response.status === 403) {
          sentinelReason = "azure_auth_failed";
        } else if (response.status === 400) {
          sentinelReason = "azure_payload_failed";
        } else {
          sentinelReason = "azure_error";
        }
      } else {
        try {
          azureBody = (await response.json()) as AzureResponse;
        } catch (parseErr) {
          sentinelReason = "azure_response_invalid";
          auditMsg =
            parseErr instanceof Error
              ? `azure_json_parse:${truncate(parseErr.message, 80)}`
              : "azure_json_parse";
          console.error(
            "[azure-phoneme] Azure 200 but JSON parse failed:",
            auditMsg,
          );
        }
      }
    } catch (err) {
      if (timedOut || (err instanceof Error && err.name === "AbortError")) {
        sentinelReason = "azure_timeout";
        auditMsg = "azure_timeout";
        console.error("[azure-phoneme] Azure call timed out");
      } else {
        sentinelReason = "azure_network_failed";
        auditMsg =
          err instanceof Error
            ? `azure_throw:${truncate(err.message, 100)}`
            : "azure_throw";
        console.error("[azure-phoneme] Network failure reaching Azure:", auditMsg);
      }
    }

    if (sentinelReason) {
      await deps.audit({
        userId,
        status: "whisper_error",
        audioSeconds,
        openaiCostUsd: costUsd,
        errorMsg: auditMsg ?? sentinelReason,
      });
      return sentinel(sentinelReason);
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
      // NoMatch = silence / unintelligible audio. Anything else
      // (BadRequest, InvalidArgument, etc.) means we sent a
      // malformed request, not a learner audio problem.
      if (status === "NoMatch") return sentinel("azure_no_match");
      console.error(
        `[azure-phoneme] Azure RecognitionStatus=${status} (treating as payload failure)`,
      );
      return sentinel("azure_payload_failed");
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
  const overallRaw = nbest?.AccuracyScore ?? 0;
  const overallScore = clampScore(overallRaw);

  const wordScores: UnifiedWordScore[] = (nbest?.Words ?? []).map((w) => {
    const wordText = (w.Word ?? "").trim();
    const wordScore = clampScore(w.AccuracyScore ?? 0);
    const phonemes = (w.Phonemes ?? []).map((ph) => ({
      phoneme: (ph.Phoneme ?? "").trim(),
      score: clampScore(ph.AccuracyScore ?? 0),
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
