// Path: supabase/functions/speech-analyze/index.ts
//
// C3 hardening (A4 follow-up to A3 audit). What changed vs. the
// previous version of this file:
//
//   1. IDENTITY: user_id is extracted from the JWT (`getUserFromAuthHeader`),
//      never from form data. The previous version read `userId` out of the
//      multipart body — anyone could claim to be anyone, breaking analytics
//      attribution and giving an attacker free rate-limit headroom.
//
//   2. AUTH GATE: no JWT → 401. The function used to accept anonymous
//      callers and silently skip the audit log, which meant an attacker
//      could drain Whisper budget without any per-user trace.
//
//   3. RATE LIMIT: 30 calls per user per hour, enforced via the
//      `rate_limits` table through `_shared/rateLimit.ts`. 31st call in a
//      rolling hour returns 429. This caps any single user's Whisper spend
//      at 30 × 30s × $0.006/min = ~$0.09/hr — a manageable ceiling.
//
//   4. BUDGET CHECK: estimated Whisper cost (in VND) is reserved against
//      the same `check_ai_budget` RPC that gates `ai-chat`. Users over
//      their daily / monthly budget get 402 (Payment Required) with the
//      RPC's bilingual message.
//
//   5. AUDIO VALIDATION:
//        - hard byte cap: 5 MB (rejects oversize uploads pre-Whisper)
//        - mime type allowlist: webm/mp4/mpeg/wav/ogg
//        - estimated duration: bytes / typical bitrate; reject when the
//          estimate exceeds 30 s with a margin. Strict duration enforcement
//          requires server-side decoding; the byte heuristic is the
//          pragmatic first cut.
//
//   6. AUDIT LOG: every invocation — success, rejection, error — gets a
//      row in `speech_analysis_logs`. Lets us catch abuse patterns and
//      trace OpenAI cost to a specific user.
//
// Success response shape is UNCHANGED; the React caller doesn't need
// updates. New rejection paths return well-known statuses (401 / 402 /
// 413 / 415 / 429 / 500) with bilingual messages where applicable.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { wrapHandler } from "../_shared/sentry.ts";
import {
  createSupabaseAdminClient,
  getUserFromAuthHeader,
} from "../_shared/security.ts";
import { rateLimit } from "../_shared/rateLimit.ts";
import { failureJsonResponse } from "../_shared/failureLog.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Singleton retained for `mb_pronunciation_attempts` writes (the existing
// success-path log; left unchanged so downstream analytics isn't broken).
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const openAiApiKey = Deno.env.get("OPENAI_API_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// ── Validation constants ──────────────────────────────────────────────────

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB hard cap
// Pragmatic 30s heuristic. Vietnamese diaspora users tend to record on
// phones at ~64–128 kbps webm/opus; 30 s ≈ 240–480 KB. We allow up to
// 800 KB to leave headroom for short stereo recordings or higher-bitrate
// browsers, and treat anything beyond that as "longer than 30 s."
const DURATION_HEURISTIC_BYTES = 800 * 1024;
// Average bitrate assumed for the bytes→seconds estimate that gets stored
// in the audit log. ~96 kbps is a reasonable midpoint for webm/opus.
const ESTIMATED_BITRATE_BPS = 96_000;
const ALLOWED_MIME_TYPES = new Set([
  "audio/webm",
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/ogg",
]);

// Whisper pricing (2025-04 OpenAI rates). $0.006 / minute.
const WHISPER_USD_PER_MINUTE = 0.006;
const USD_TO_VND = Number(Deno.env.get("USD_TO_VND") || "26000");

const RATE_LIMIT_MAX_CALLS = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// ── Types ─────────────────────────────────────────────────────────────────

type ComparisonResult = {
  normalizedTranscript: string;
  normalizedTarget: string;
  matchScore: number;
  missingWords: string[];
  extraWords: string[];
};

type AuditStatus =
  | "ok"
  | "no_speech"
  | "rate_limited"
  | "budget_exceeded"
  | "invalid_audio"
  | "whisper_error"
  | "auth_required";

// ── Server ────────────────────────────────────────────────────────────────

serve(wrapHandler("speech-analyze", async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // 1. Identity from JWT — never from body.
  const user = await getUserFromAuthHeader(req);
  if (!user) {
    // No user_id to attach the audit row to. We still return a clean 401.
    return failureJsonResponse(
      req,
      "speech-analyze",
      "speech-analysis",
      401,
      "auth_required",
      {
        error: "auth_required",
        message: "Sign in to use speech analysis.",
        message_vi: "Vui lòng đăng nhập để dùng tính năng phân tích giọng nói.",
      },
      corsHeaders,
    );
  }
  const userId = user.id;

  // 2. Rate limit per user, 30/hour. Fail-open ONLY on infra errors so a
  //    Supabase blip doesn't break the feature for everyone, but a
  //    deliberate 31st call in the same window is rejected.
  try {
    await rateLimit(`speech-analyze:${userId}`, RATE_LIMIT_MAX_CALLS, RATE_LIMIT_WINDOW_MS);
  } catch (err) {
    if (err instanceof Error && err.message === "RATE_LIMIT_EXCEEDED") {
      await audit({
        userId,
        status: "rate_limited",
        errorMsg: `>${RATE_LIMIT_MAX_CALLS} calls in ${RATE_LIMIT_WINDOW_MS / 1000}s`,
      });
      return failureJsonResponse(
        req,
        "speech-analyze",
        "speech-analysis",
        429,
        "rate_limit_exceeded",
        {
          error: "rate_limit_exceeded",
          message: "Too many speech checks in the last hour. Try again later.",
          message_vi: "Bạn đã thử kiểm tra giọng nói quá nhiều trong một giờ qua. Thử lại sau nhé.",
          retry_after_seconds: 3600,
        },
        corsHeaders,
      );
    }
    // Non-rate-limit error from the rate-limit subsystem itself — log
    // and continue. The brief is to fail-open here, matching the
    // existing helper's posture.
    console.error("rateLimit subsystem error:", err);
  }

  try {
    const formData = await req.formData();

    const audio = formData.get("audio");
    const roomId = String(formData.get("roomId") ?? "").trim();
    const lineId = String(formData.get("lineId") ?? "").trim();
    const targetText = String(formData.get("targetText") ?? "").trim();
    // NB: form-data `userId` is intentionally ignored. Identity is JWT-only.

    if (!(audio instanceof File)) {
      await audit({
        userId,
        status: "invalid_audio",
        errorMsg: "missing_audio_file",
      });
      return failureJsonResponse(req, "speech-analyze", "speech-analysis", 400, "missing_audio_file", {
        error: "Missing audio file",
      }, corsHeaders);
    }

    if (!roomId || !lineId || !targetText) {
      await audit({
        userId,
        status: "invalid_audio",
        errorMsg: "missing_metadata",
      });
      return failureJsonResponse(req, "speech-analyze", "speech-analysis", 400, "missing_metadata", {
        error: "Missing roomId, lineId, or targetText",
      }, corsHeaders);
    }

    // 5. Audio validation — pre-Whisper rejection.
    const sizeBytes = audio.size ?? 0;
    if (sizeBytes <= 0) {
      await audit({ userId, status: "invalid_audio", errorMsg: "empty_audio" });
      return failureJsonResponse(req, "speech-analyze", "speech-analysis", 400, "empty_audio", {
        error: "Empty audio file",
      }, corsHeaders);
    }
    if (sizeBytes > MAX_BYTES) {
      await audit({
        userId,
        status: "invalid_audio",
        errorMsg: `oversize:${sizeBytes}b`,
      });
      return failureJsonResponse(
        req,
        "speech-analyze",
        "speech-analysis",
        413,
        "audio_too_large",
        {
          error: "audio_too_large",
          message: "Audio file is too large. Keep it under 5 MB.",
          message_vi: "File âm thanh quá lớn. Vui lòng giữ dưới 5 MB.",
        },
        corsHeaders,
        { sizeBytes, maxBytes: MAX_BYTES },
      );
    }
    if (sizeBytes > DURATION_HEURISTIC_BYTES) {
      // Likely > 30s. Reject with the same 413 so the client surfaces a
      // single "too long / too big" branch.
      await audit({
        userId,
        status: "invalid_audio",
        errorMsg: `likely_over_30s:${sizeBytes}b`,
      });
      return failureJsonResponse(
        req,
        "speech-analyze",
        "speech-analysis",
        413,
        "audio_too_long",
        {
          error: "audio_too_long",
          message: "Recording is too long. Keep it under 30 seconds.",
          message_vi: "Đoạn ghi âm quá dài. Vui lòng giữ dưới 30 giây.",
        },
        corsHeaders,
        { sizeBytes, durationHeuristicBytes: DURATION_HEURISTIC_BYTES },
      );
    }

    const mimeType = (audio.type || "").toLowerCase();
    const baseMime = mimeType.split(";")[0]?.trim() ?? "";
    if (!ALLOWED_MIME_TYPES.has(mimeType) && !ALLOWED_MIME_TYPES.has(baseMime)) {
      await audit({
        userId,
        status: "invalid_audio",
        errorMsg: `bad_mime:${mimeType || "unknown"}`,
      });
      return failureJsonResponse(
        req,
        "speech-analyze",
        "speech-analysis",
        415,
        "unsupported_audio_format",
        {
          error: "unsupported_audio_format",
          message: "Audio format not supported. Use webm, mp3, mp4, wav, or ogg.",
        },
        corsHeaders,
      );
    }

    const estimatedSeconds = estimateAudioSeconds(sizeBytes);
    const estimatedCostUsd = estimateWhisperCostUsd(estimatedSeconds);

    // 3. Budget check — same pattern as ai-chat. Reserve in VND.
    const reserveVnd = Math.max(1, Math.ceil(estimatedCostUsd * USD_TO_VND));
    const budget = await checkAiBudget(userId, reserveVnd);
    if (!budget.allowed) {
      await audit({
        userId,
        status: "budget_exceeded",
        audioSeconds: estimatedSeconds,
        openaiCostUsd: estimatedCostUsd,
        errorMsg: budget.message ?? "budget_exceeded",
      });
      return failureJsonResponse(
        req,
        "speech-analyze",
        "speech-analysis",
        402,
        "budget_exceeded",
        {
          error: "budget_exceeded",
          message: budget.message ?? "Daily AI budget reached. Try again later.",
          reset_at: budget.reset_at ?? null,
        },
        corsHeaders,
      );
    }

    const arrayBuffer = await audio.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    let transcript: string;
    try {
      transcript = await transcribeAudio(fileBuffer, baseMime || mimeType || "audio/webm");
    } catch (whisperErr) {
      const errMsg = whisperErr instanceof Error ? whisperErr.message : String(whisperErr);
      await audit({
        userId,
        status: "whisper_error",
        audioSeconds: estimatedSeconds,
        openaiCostUsd: estimatedCostUsd,
        errorMsg: truncate(errMsg, 500),
      });
      return failureJsonResponse(req, "speech-analyze", "speech-analysis", 500, "whisper_error", {
        error: "Speech analysis failed",
      }, corsHeaders);
    }

    if (!transcript.trim()) {
      const noSpeechResponse = {
        transcript: "",
        normalizedTranscript: "",
        normalizedTarget: normalizeText(targetText),
        matchScore: 0,
        missingWords: tokenize(targetText),
        extraWords: [],
        message:
          "We could not hear the sentence clearly. Try once more, slowly and close to the microphone.",
      };

      await audit({
        userId,
        status: "no_speech",
        audioSeconds: estimatedSeconds,
        openaiCostUsd: estimatedCostUsd,
      });
      await logAttempt({
        userId,
        roomId,
        targetText,
        matchScore: 0,
        missingWords: noSpeechResponse.missingWords,
        extraWords: [],
        transcript: "",
      });

      return json(noSpeechResponse, 200);
    }

    const comparison = compareTargetToTranscript(targetText, transcript);
    const message = buildGentleFeedback({
      score: comparison.matchScore,
      missingWords: comparison.missingWords,
      extraWords: comparison.extraWords,
    });

    await audit({
      userId,
      status: "ok",
      audioSeconds: estimatedSeconds,
      openaiCostUsd: estimatedCostUsd,
    });
    await logAttempt({
      userId,
      roomId,
      targetText,
      matchScore: comparison.matchScore,
      missingWords: comparison.missingWords,
      extraWords: comparison.extraWords,
      transcript,
    });

    return json(
      {
        transcript,
        normalizedTranscript: comparison.normalizedTranscript,
        normalizedTarget: comparison.normalizedTarget,
        matchScore: comparison.matchScore,
        missingWords: comparison.missingWords,
        extraWords: comparison.extraWords,
        message,
      },
      200,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Speech analysis failed";

    // Best-effort audit log on the catch-all branch.
    await audit({
      userId,
      status: "whisper_error",
      errorMsg: truncate(message, 500),
    });

    return failureJsonResponse(req, "speech-analyze", "speech-analysis", 500, "unexpected_error", {
      error: message,
    }, corsHeaders);
  }
}));

// ── JSON / text helpers ──────────────────────────────────────────────────

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function normalizeText(input: string): string {
  return String(input ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(input: string): string[] {
  const normalized = normalizeText(input);
  return normalized ? normalized.split(" ").filter(Boolean) : [];
}

function compareTargetToTranscript(
  targetText: string,
  transcript: string,
): ComparisonResult {
  const normalizedTarget = normalizeText(targetText);
  const normalizedTranscript = normalizeText(transcript);

  const targetTokens = tokenize(targetText);
  const transcriptTokens = tokenize(transcript);

  const transcriptCounts = new Map<string, number>();
  for (const token of transcriptTokens) {
    transcriptCounts.set(token, (transcriptCounts.get(token) ?? 0) + 1);
  }

  const missingWords: string[] = [];
  let matchedCount = 0;

  for (const token of targetTokens) {
    const count = transcriptCounts.get(token) ?? 0;
    if (count > 0) {
      transcriptCounts.set(token, count - 1);
      matchedCount += 1;
    } else {
      missingWords.push(token);
    }
  }

  const extraWords: string[] = [];
  const targetCounts = new Map<string, number>();
  for (const token of targetTokens) {
    targetCounts.set(token, (targetCounts.get(token) ?? 0) + 1);
  }

  for (const token of transcriptTokens) {
    const count = targetCounts.get(token) ?? 0;
    if (count > 0) {
      targetCounts.set(token, count - 1);
    } else {
      extraWords.push(token);
    }
  }

  const denominator = Math.max(targetTokens.length, 1);
  const rawScore = (matchedCount / denominator) * 100;
  const matchScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    normalizedTranscript,
    normalizedTarget,
    matchScore,
    missingWords,
    extraWords,
  };
}

function buildGentleFeedback(params: {
  score: number;
  missingWords: string[];
  extraWords: string[];
}): string {
  const { score, missingWords, extraWords } = params;

  if (score >= 95) return "Excellent. You said the sentence very clearly.";
  if (score >= 80) return "Good job. Try once more to make it even smoother.";

  if (score >= 60) {
    if (missingWords.length > 0) {
      return `Good try. Listen again and include these words: ${missingWords
        .slice(0, 3)
        .join(", ")}.`;
    }
    return "Good try. Say it again slowly and keep the same word order.";
  }

  if (missingWords.length > 0) {
    return `Try again slowly. Focus on these words: ${missingWords
      .slice(0, 4)
      .join(", ")}.`;
  }

  if (extraWords.length > 0) return "Try again using only the target sentence.";
  return "Try once more, slowly and clearly.";
}

// ── Whisper / OpenAI ─────────────────────────────────────────────────────

async function transcribeAudio(
  audioBytes: Uint8Array,
  mimeType: string,
): Promise<string> {
  if (!openAiApiKey) {
    throw new Error("OPENAI_API_KEY is missing for speech-analyze.");
  }

  const fileExtension = getFileExtensionFromMimeType(mimeType);
  const audioBlob = new Blob([audioBytes], { type: mimeType || "audio/webm" });

  const form = new FormData();
  form.append(
    "file",
    new File([audioBlob], `speech-input.${fileExtension}`, {
      type: mimeType || "audio/webm",
    }),
  );
  form.append("model", "whisper-1");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${openAiApiKey}` },
    body: form,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI transcription error: ${errText}`);
  }

  const data = (await response.json()) as { text?: string };
  return String(data?.text ?? "").trim();
}

function getFileExtensionFromMimeType(mimeType: string): string {
  const type = String(mimeType || "").toLowerCase();
  if (type.includes("ogg")) return "ogg";
  if (type.includes("mp4")) return "mp4";
  if (type.includes("mpeg") || type.includes("mp3")) return "mp3";
  if (type.includes("wav")) return "wav";
  return "webm";
}

// ── Cost / duration estimation ───────────────────────────────────────────

function estimateAudioSeconds(bytes: number): number {
  if (!bytes || bytes <= 0) return 0;
  const seconds = (bytes * 8) / ESTIMATED_BITRATE_BPS;
  return Number(seconds.toFixed(2));
}

function estimateWhisperCostUsd(seconds: number): number {
  if (!seconds || seconds <= 0) return 0;
  const minutes = seconds / 60;
  return Number((minutes * WHISPER_USD_PER_MINUTE).toFixed(6));
}

// ── Budget RPC (mirrors ai-chat) ─────────────────────────────────────────

type AiBudgetResult = {
  allowed: boolean;
  message?: string | null;
  reset_at?: string | null;
};

async function checkAiBudget(userId: string, reserveVnd: number): Promise<AiBudgetResult> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.rpc("check_ai_budget", {
      p_user_id: userId,
      p_request_reserve_vnd: reserveVnd,
    });
    if (error) {
      console.error("check_ai_budget error", error);
      // Fail-open on infra error — same posture as ai-chat would imply
      // by raising; here we keep the call alive but record nothing as
      // "denied" so a Postgres outage doesn't block all speech checks.
      return { allowed: true };
    }
    const budget = Array.isArray(data) ? data[0] : data;
    return {
      allowed: Boolean(budget?.allowed),
      message: budget?.message ?? null,
      reset_at: budget?.reset_at ?? null,
    };
  } catch (err) {
    console.error("check_ai_budget threw", err);
    return { allowed: true };
  }
}

// ── Audit + analytics ────────────────────────────────────────────────────

async function audit(params: {
  userId: string;
  status: AuditStatus;
  audioSeconds?: number;
  openaiCostUsd?: number;
  errorMsg?: string;
}) {
  try {
    const { error } = await supabase.from("speech_analysis_logs").insert({
      user_id: params.userId,
      audio_seconds: params.audioSeconds ?? null,
      openai_cost_usd: params.openaiCostUsd ?? null,
      status: params.status,
      error_msg: params.errorMsg ?? null,
    });
    if (error) {
      console.error("speech_analysis_logs insert error", error);
    }
  } catch (err) {
    console.error("audit threw", err);
  }
}

async function logAttempt(params: {
  userId: string;
  roomId: string;
  targetText: string;
  matchScore: number;
  missingWords: string[];
  extraWords: string[];
  transcript: string;
}) {
  // Existing analytics log — kept untouched for downstream consumers.
  // Identity is now guaranteed-non-null because we authenticated above.
  const payload = {
    user_id: params.userId,
    room_id: params.roomId,
    sentence: params.targetText,
    overall_score: Number((params.matchScore / 100).toFixed(4)),
    phoneme_accuracy: null,
    corrections_count: params.missingWords.length + params.extraWords.length,
    org_id: params.userId,
    improvement_score: null,
    prompt_text: params.targetText,
  };

  const { error } = await supabase.from("mb_pronunciation_attempts").insert(payload);
  if (error) {
    console.error("insert attempt error", error);
  }
}

function truncate(s: string, max: number): string {
  return s.length <= max ? s : s.slice(0, max);
}
