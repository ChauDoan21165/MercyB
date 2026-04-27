// Drill-room telemetry. Captures four lifecycle events per drill
// session: started, sentence scored, completed, abandoned. Plus the
// before/after delta used to measure drill effectiveness.
//
// Events go through the existing `trackEvent()` helper from
// `src/lib/analytics.ts`. We do NOT write a separate `drill_*` table —
// the per-attempt `speech_attempts` row already carries the phoneme
// + drill_session_id in its `extra` payload, so cohort SQL like
// "average score-delta across drill sessions" can be derived from
// existing data.
//
// All functions are synchronous and side-effect-only. They never
// throw — analytics being off / blocked must not break the drill UI.

import { trackEvent } from "@/lib/analytics";

/**
 * Stable session id minted once per drill open. Same id is attached
 * to every per-sentence telemetry event AND to each
 * `recordSpeechAttempt` extra payload, so analytics can group by it.
 */
export function newDrillSessionId(): string {
  // Crypto.randomUUID is available everywhere we run (jsdom polyfilled);
  // fall back to a Math.random id for the rare environment without it.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `drill-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export type DrillStartedPayload = {
  session_id: string;
  phoneme_slug: string;
  /** "heatmap_cta" | "home_card" | "deep_link" — how the user got here. */
  source: DrillSource;
};

export type DrillSentenceScoredPayload = {
  session_id: string;
  phoneme_slug: string;
  /** 0-indexed; matches the drill pack's sentences[] index. */
  sentence_index: number;
  /** Score 0..100 for THAT sentence's attempt. */
  score: number;
};

export type DrillCompletedPayload = {
  session_id: string;
  phoneme_slug: string;
  /** Sentences attempted (always 10 for a clean completion). */
  attempts: number;
  /** Average of first 3 sentence scores. Null when fewer than 3 attempts. */
  before_avg: number | null;
  /** Average of last 3 sentence scores. Null when fewer than 3 attempts. */
  after_avg: number | null;
  /** after_avg - before_avg (rounded). Null when either side is null. */
  delta: number | null;
  /** Total ms from "started" to last sentence scored. */
  duration_ms: number;
};

export type DrillAbandonedPayload = {
  session_id: string;
  phoneme_slug: string;
  /** Last sentence index the user reached (0..9). */
  reached_index: number;
  /** Total ms before the user left. */
  duration_ms: number;
};

export type DrillSource = "heatmap_cta" | "home_card" | "deep_link";

// ── Public API ──────────────────────────────────────────────────────────

export function trackDrillStarted(payload: DrillStartedPayload): void {
  safeTrack("phoneme_drill_started", payload);
}

export function trackDrillSentenceScored(payload: DrillSentenceScoredPayload): void {
  safeTrack("phoneme_drill_sentence_scored", payload);
}

export function trackDrillCompleted(payload: DrillCompletedPayload): void {
  safeTrack("phoneme_drill_completed", payload);
}

export function trackDrillAbandoned(payload: DrillAbandonedPayload): void {
  safeTrack("phoneme_drill_abandoned", payload);
}

// ── Pure helpers (exported for tests + drill page) ──────────────────────

/**
 * Compute the before/after metrics from the per-sentence scores. The
 * "before" cohort is the first 3 attempts, "after" is the last 3.
 * When fewer than 3 scores exist on either side, returns null for that
 * side — we never report a delta from too-thin data.
 */
export function computeBeforeAfter(scores: ReadonlyArray<number>): {
  before_avg: number | null;
  after_avg: number | null;
  delta: number | null;
} {
  const valid = scores.filter((s) => Number.isFinite(s));
  // Need 6 valid scores total — 3 for "before" and 3 disjoint scores
  // for "after". Below that, both halves stay null so the UI shows
  // the "need 6+ attempts" message rather than a meaningless delta.
  if (valid.length < 6) {
    return { before_avg: null, after_avg: null, delta: null };
  }
  const before_avg = avg(valid.slice(0, 3));
  const after_avg = avg(valid.slice(-3));
  const delta = Math.round(after_avg - before_avg);
  return { before_avg, after_avg, delta };
}

function avg(xs: ReadonlyArray<number>): number {
  return Math.round(xs.reduce((s, n) => s + n, 0) / xs.length);
}

function safeTrack(name: string, payload: unknown): void {
  try {
    // The analytics helper is loosely typed (string-keyed payload).
    // We don't extend its event-name union here to avoid a cross-module
    // type churn — this is a fire-and-forget channel.
    (trackEvent as unknown as (n: string, p: unknown) => void)(name, payload);
  } catch {
    /* analytics off / blocked / SSR — ignore */
  }
}
