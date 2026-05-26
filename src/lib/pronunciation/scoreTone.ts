/**
 * §15 Axis 2 Bar #2 — Vietnamese tone production scoring adapter.
 *
 * Thin client over the existing `azure-phoneme` edge function, with
 * two opt-in formdata fields:
 *   - `target_locale: "vi-VN"`  → bypasses the English accent path
 *     and tells Azure to score against Vietnamese.
 *   - `context: "tone-drill"`   → opts out of the `speech_attempts`
 *     writeback (Stage-3 local-only posture per
 *     docs/axis-2/tone-production-design.md §1). Audit + cost
 *     telemetry on the server still run.
 *
 * The adapter accepts a recorder `Blob`, the target syllable, and
 * a JWT. It returns a `ToneScoreResult` whose `bucket` field is the
 * three-bucket score mapping the design promised:
 *   - `pass`                 : AccuracyScore ≥ 70
 *   - `low-confidence-pass`  : AccuracyScore 50..69
 *   - `retry`                : AccuracyScore <  50
 *   - `unavailable`          : scoring failed (network, auth, Azure
 *                              sentinel, etc.) — caller surfaces a
 *                              "scoring unavailable, please try
 *                              again" UI rather than treating it as
 *                              a low score
 *
 * Auth-gated. Anonymous calls return `bucket: 'unavailable',
 * reason: 'auth-required'`; the route guard in PR (b) redirects
 * those callers to sign-in.
 *
 * No localStorage write, no analytics, no recording retention.
 * The session-attempt counter (20-attempt soft cap) lives in a
 * separate small helper module owned by the UI PR.
 */

import { blobToWavPcm16k } from "@/lib/audio/wavEncoder";

/** Bucket boundaries — kept here as constants so the UI can colour-code. */
export const TONE_SCORE_PASS_THRESHOLD = 70;
export const TONE_SCORE_LOW_CONFIDENCE_THRESHOLD = 50;

export type ToneScoreBucket =
  | "pass"
  | "low-confidence-pass"
  | "retry"
  | "unavailable";

export type ToneScoreReason =
  | "auth-required"
  | "wav-encode-failed"
  | "no-supabase-url"
  | "network-error"
  | "timeout"
  | "http-error"
  | "azure-sentinel"
  | "non-json-response";

export interface ToneScoreResult {
  bucket: ToneScoreBucket;
  /** Azure `AccuracyScore` 0..100 when `bucket !== "unavailable"`. */
  score: number | null;
  /** Populated only when `bucket === "unavailable"`. */
  reason: ToneScoreReason | null;
}

export interface ScoreToneInput {
  /** Recorder blob (any codec — gets converted to WAV PCM 16k mono). */
  audioBlob: Blob;
  /** Target syllable with tone marks, e.g. "má" or "mã". */
  targetSyllable: string;
  /** Authenticated Supabase JWT. Required — anon path returns unavailable. */
  userJwt: string | null;
  /** Override the resolved Supabase URL (tests). */
  supabaseUrl?: string;
  /** Inject a fetch implementation (tests). */
  fetchImpl?: typeof fetch;
  /** Override the request timeout (tests). */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 15_000;

interface CloudSuccess {
  ok: true;
  score: number;
  word_scores: Array<{ word: string; score: number }>;
  provider: string;
  audio_seconds: number;
  cost_usd_cents: number;
}

interface CloudSentinel {
  ok: false;
  use_local?: boolean;
  reason?: string;
}

function resolveSupabaseUrl(override?: string): string | null {
  if (override) return override;
  const fromEnv = import.meta.env?.VITE_SUPABASE_URL;
  if (typeof fromEnv === "string" && fromEnv.length > 0) return fromEnv;
  return null;
}

/**
 * Map an Azure `AccuracyScore` into the design's three-bucket model.
 *
 * Boundary semantics:
 *   - Inclusive at the pass threshold (≥ 70 is `pass`).
 *   - Inclusive at the low-confidence threshold (≥ 50 is
 *     `low-confidence-pass`).
 *   - Anything below 50 is `retry`.
 *
 * Tuning these thresholds is a single-file edit; nothing else in the
 * code reads the numeric score.
 */
export function bucketForScore(score: number): Exclude<ToneScoreBucket, "unavailable"> {
  if (score >= TONE_SCORE_PASS_THRESHOLD) return "pass";
  if (score >= TONE_SCORE_LOW_CONFIDENCE_THRESHOLD) return "low-confidence-pass";
  return "retry";
}

function unavailable(reason: ToneScoreReason): ToneScoreResult {
  return { bucket: "unavailable", score: null, reason };
}

export async function scoreTone(input: ScoreToneInput): Promise<ToneScoreResult> {
  // Auth gate — design §1, dispatch question 6.
  if (!input.userJwt) {
    return unavailable("auth-required");
  }

  // 1. Convert recorder blob → WAV PCM 16k mono (matches existing
  //    cloudScorer contract; the edge function rejects other shapes).
  let wavBlob: Blob;
  try {
    wavBlob = await blobToWavPcm16k(input.audioBlob);
  } catch {
    return unavailable("wav-encode-failed");
  }

  // 2. Resolve the edge function URL.
  const supabaseUrl = resolveSupabaseUrl(input.supabaseUrl);
  if (!supabaseUrl) {
    return unavailable("no-supabase-url");
  }

  const url = `${supabaseUrl}/functions/v1/azure-phoneme`;
  const fetchImpl = input.fetchImpl ?? globalThis.fetch;
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  // 3. Build the multipart form. Note `target_locale` + `context`.
  const formData = new FormData();
  formData.append("audio", wavBlob, "recording.wav");
  formData.append("target_text", input.targetSyllable);
  formData.append("target_locale", "vi-VN");
  formData.append("context", "tone-drill");

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
    if (err instanceof Error && err.name === "AbortError") {
      return unavailable("timeout");
    }
    return unavailable("network-error");
  }
  clearTimeout(timer);

  if (response.status === 401) {
    // Session broken — bubble up via the auth-required bucket so the
    // route guard can redirect to sign-in.
    return unavailable("auth-required");
  }

  if (!response.ok) {
    return unavailable("http-error");
  }

  let body: CloudSuccess | CloudSentinel;
  try {
    body = (await response.json()) as CloudSuccess | CloudSentinel;
  } catch {
    return unavailable("non-json-response");
  }

  if (body.ok === false) {
    return unavailable("azure-sentinel");
  }

  const score = clampScore(body.score);
  return {
    bucket: bucketForScore(score),
    score,
    reason: null,
  };
}

function clampScore(raw: number): number {
  if (!Number.isFinite(raw)) return 0;
  if (raw < 0) return 0;
  if (raw > 100) return 100;
  return raw;
}
