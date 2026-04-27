/**
 * Day 2 of the phoneme scoring plan
 * (reports/plan-phoneme-scoring-azure-2026-04-26.md § 2 Day 2).
 *
 * Client-side wrapper that tries Azure Pronunciation Assessment first
 * and falls back to the local scorer (`./scorer`) on any failure.
 *
 * Single result shape: every path returns `ScoreResult`. The caller
 * (MercySpeakTab — gated by the `azure_phoneme_scoring` feature flag)
 * never has to branch on which provider answered.
 *
 * Failure modes that trigger local fallback:
 *   - WAV conversion error (decoder failure, sample-rate quirk)
 *   - Network error / fetch threw / timeout
 *   - HTTP non-2xx (excluding 401 — that's a session problem, NOT a
 *     scoring problem, so we propagate)
 *   - 200 OK with `ok:false, use_local:true` sentinel from the edge
 *     function (rate limit, daily cap, Azure 5xx, NoMatch)
 */

import { blobToWavPcm16k } from "@/lib/audio/wavEncoder";
import {
  scorePronunciation,
  type ScoreInput,
  type ScoreResult,
  type WordScore,
  type WordStatus,
} from "./scorer";

/** Public input shape — matches the Day 2 spec literally. */
export type CloudScoreInput = {
  /** Raw MediaRecorder blob (WebM/Opus, MP4/AAC, OGG, etc.). */
  audioBlob: Blob;
  /** The sentence the learner was trying to say. */
  target: string;
  /** Bearer JWT for the calling user — passed to the edge function. */
  userJwt: string;
  /**
   * Optional transcript from `webkitSpeechRecognition`. Used when the
   * cloud path falls back to the local scorer (which needs a recognized
   * string). When undefined, the local scorer treats it as an empty
   * recognition.
   */
  transcript?: string;
  /**
   * Optional Supabase URL override — defaults to `VITE_SUPABASE_URL`.
   * Tests pass an explicit URL so they don't depend on Vite env.
   */
  supabaseUrl?: string;
  /**
   * Optional fetch implementation — defaults to `globalThis.fetch`.
   * Tests pass a stub. Bound to the global so signature matches.
   */
  fetchImpl?: typeof fetch;
  /** Network timeout. Defaults to 12s (cloud edge fn caps at 15s upstream). */
  timeoutMs?: number;
};

/** What the edge function's /functions/v1/azure-phoneme returns on success. */
type CloudSuccess = {
  ok: true;
  score: number;
  word_scores: Array<{
    word: string;
    heard?: string;
    score: number;
    status: "correct" | "close" | "wrong";
    phonemes: Array<{ phoneme: string; score: number }>;
  }>;
  provider: "azure";
  audio_seconds: number;
  cost_usd_cents: number;
};

type CloudSentinel = {
  ok: false;
  use_local: true;
  reason: string;
};

const DEFAULT_TIMEOUT_MS = 12_000;

function logTelemetry(
  provider: "azure" | "local",
  latencyMs: number,
  reason?: string,
): void {
  // eslint-disable-next-line no-console
  console.log(
    "[cloudScorer] provider=",
    provider,
    "latency=",
    Math.round(latencyMs),
    "ms",
    reason ? `reason=${reason}` : "",
  );
}

function resolveSupabaseUrl(override?: string): string | null {
  if (override && override.trim()) return override.trim().replace(/\/+$/, "");
  try {
    const env = (import.meta as ImportMeta & { env?: Record<string, string> }).env;
    const url = env?.VITE_SUPABASE_URL ?? "";
    return url.trim() ? url.trim().replace(/\/+$/, "") : null;
  } catch {
    return null;
  }
}

/**
 * Project the cloud response into the local `ScoreResult` shape so the
 * UI consumes a single type.
 */
function projectCloudToScoreResult(cloud: CloudSuccess): ScoreResult {
  const wordScores: WordScore[] = cloud.word_scores.map((w) => ({
    word: w.word,
    heard: w.heard ?? w.word,
    score: w.score,
    status: w.status as WordStatus,
    phonemes: Array.isArray(w.phonemes) ? w.phonemes : [],
  }));
  return {
    overallScore: cloud.score,
    wordScores,
    feedback: buildBilingualFeedback(cloud.score),
    phonemeFeedback: [],
  };
}

function buildBilingualFeedback(score: number): { en: string; vi: string } {
  if (score >= 90) {
    return { en: "Excellent — that was very clear.", vi: "Rất rõ — bạn nói rất tốt!" };
  }
  if (score >= 75) {
    return { en: "Nice work. A few sounds to polish next time.", vi: "Tốt lắm. Còn vài âm cần luyện thêm." };
  }
  if (score >= 60) {
    return { en: "Almost there — slow down and try once more.", vi: "Gần được rồi — bạn thử chậm lại một lần nữa nhé." };
  }
  return { en: "Try again, slowly and clearly.", vi: "Thử lại nhé — nói chậm và rõ ràng." };
}

/**
 * Fall back to the local Needleman-Wunsch scorer. Used on any cloud
 * failure path. Pure, synchronous, no I/O.
 */
function fallback(input: CloudScoreInput): ScoreResult {
  const localInput: ScoreInput = {
    target: input.target,
    recognized: input.transcript ?? "",
  };
  return scorePronunciation(localInput);
}

/**
 * Main entry. Single-await happy path; everything else falls through
 * to the local scorer. Never throws (except on 401 — see below).
 *
 * 401 is the one case we DO surface: the user's session is broken,
 * not the scoring path. Caller signs them out / re-auths.
 */
export async function scoreCloud(input: CloudScoreInput): Promise<ScoreResult> {
  const startedAt = Date.now();

  // 1. Convert the raw recorder blob to WAV PCM 16k mono.
  let wavBlob: Blob;
  try {
    wavBlob = await blobToWavPcm16k(input.audioBlob);
  } catch (err) {
    const reason = err instanceof Error ? err.message : "wav_decode_failed";
    logTelemetry("local", Date.now() - startedAt, `wav_decode_error:${reason}`);
    return fallback(input);
  }

  // 2. Resolve the edge function URL.
  const supabaseUrl = resolveSupabaseUrl(input.supabaseUrl);
  if (!supabaseUrl) {
    logTelemetry("local", Date.now() - startedAt, "no_supabase_url");
    return fallback(input);
  }

  const url = `${supabaseUrl}/functions/v1/azure-phoneme`;
  const fetchImpl = input.fetchImpl ?? globalThis.fetch;
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  // 3. POST WAV to the edge function.
  const formData = new FormData();
  formData.append("audio", wavBlob, "recording.wav");
  formData.append("target_text", input.target);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetchImpl(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${input.userJwt}` },
      body: formData,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    const reason =
      err instanceof Error && err.name === "AbortError"
        ? "timeout"
        : err instanceof Error
          ? `fetch_threw:${err.message.slice(0, 80)}`
          : "fetch_threw";
    logTelemetry("local", Date.now() - startedAt, reason);
    return fallback(input);
  }
  clearTimeout(timer);

  // 4. Auth failure — propagate. Don't silently fall back; the user's
  //    session is broken and they need to re-auth.
  if (response.status === 401) {
    throw new Error("cloud_scorer_auth_required");
  }

  if (!response.ok) {
    logTelemetry("local", Date.now() - startedAt, `http_${response.status}`);
    return fallback(input);
  }

  let body: CloudSuccess | CloudSentinel;
  try {
    body = (await response.json()) as CloudSuccess | CloudSentinel;
  } catch {
    logTelemetry("local", Date.now() - startedAt, "non_json_response");
    return fallback(input);
  }

  if (body.ok === false) {
    logTelemetry("local", Date.now() - startedAt, `sentinel:${body.reason}`);
    return fallback(input);
  }

  // 5. Project cloud → ScoreResult.
  const result = projectCloudToScoreResult(body);
  logTelemetry("azure", Date.now() - startedAt);
  return result;
}
