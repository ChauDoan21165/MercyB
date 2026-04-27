// Session-scoped attempt history for the Speak tab.
//
// Closes the within-session feedback loop: when a learner practises
// the same sentence multiple times, this module computes the deltas
// (overall + per-phoneme) so the UI can show "you went from 67 to 82,
// these phonemes got better" instead of "you tried 5 times, ¯\_(ツ)_/¯".
//
// Pure functions only — no React, no storage, no I/O. The component
// (MercySpeakTab) owns the state and calls these helpers to derive
// what the comparison panel renders.
//
// Persistence model:
//   - In-memory only. Cleared on practiceText change, on the
//     comparison panel's "Bắt đầu lại" reset button, and naturally on
//     unmount when the user leaves the Speak tab.
//   - DB-backed long-term history is /progress dashboard's concern,
//     out of scope for this module.

import type { PhonemeScore } from "./scorer";

// ── Public types ────────────────────────────────────────────────────────

export type AttemptRecord = {
  /** 1-indexed attempt number within this sentence's session history. */
  attemptNumber: number;
  /** ms since epoch — used for tie-break in best-attempt selection. */
  timestamp: number;
  /** 0..100 overall accuracy. */
  overallScore: number;
  /** Per-phoneme breakdown. Empty when local fallback ran (no phoneme view). */
  phonemes: PhonemeScore[];
  /** Raw recording blob — held for "Replay yours" / replay-best playback.
   *  Nullable so callers can drop it under memory pressure. */
  audioBlob: Blob | null;
  /** Whatever the speech-recognition layer surfaced. Empty when unused. */
  transcript: string;
};

export type Trend = "up" | "down" | "flat";

export type PhonemeDelta = {
  phoneme: string;
  latestScore: number;
  previousScore: number;
  /** latestScore - previousScore. Positive = improved. */
  delta: number;
};

export type HistoryDelta = {
  improved: PhonemeDelta[];
  regressed: PhonemeDelta[];
};

// ── Tunables ────────────────────────────────────────────────────────────

/** Per the spec — last 5 attempts per sentence per session. */
export const ATTEMPT_HISTORY_CAP = 5;
/** Trend threshold: ignore tiny drift to avoid flapping arrows. */
const TREND_THRESHOLD = 3;
/** Improved phoneme: at least this many points up. */
const IMPROVED_MIN_DELTA = 5;
/** Regressed phoneme: at least this many points down (negative). */
const REGRESSED_MAX_DELTA = -10;
/** Top-N for each delta list. */
const MAX_DELTAS = 3;

// ── Pure helpers ────────────────────────────────────────────────────────

/**
 * Append a new attempt to the history, capped to the last N. Returns a
 * NEW array (immutable so React state updates trigger re-render).
 *
 * The new attempt's `attemptNumber` is set by this function — callers
 * pass everything else and let the cap-aware numbering land here. We
 * keep a monotonically-increasing counter so eviction doesn't reset
 * the visible attempt number ("attempt 6" stays "attempt 6" even when
 * attempt 1 has been evicted).
 */
export function appendAttempt(
  history: AttemptRecord[],
  newAttempt: Omit<AttemptRecord, "attemptNumber">,
  cap: number = ATTEMPT_HISTORY_CAP,
): AttemptRecord[] {
  const lastNumber = history.length > 0
    ? history[history.length - 1].attemptNumber
    : 0;
  const next: AttemptRecord = {
    ...newAttempt,
    attemptNumber: lastNumber + 1,
  };
  const grown = [...history, next];
  if (grown.length <= cap) return grown;
  // Evict oldest to maintain the cap. Best-attempt and trend math
  // should accept that — they operate over what's currently in view.
  return grown.slice(grown.length - cap);
}

/**
 * Highest-scoring attempt. Ties broken by most-recent timestamp (the
 * learner's intuition is "what did I do MOST RECENTLY that worked"
 * rather than "the very first time it worked"). Returns null on empty.
 */
export function getBestAttempt(history: AttemptRecord[]): AttemptRecord | null {
  if (history.length === 0) return null;
  let best = history[0];
  for (const a of history) {
    if (a.overallScore > best.overallScore) {
      best = a;
    } else if (a.overallScore === best.overallScore && a.timestamp > best.timestamp) {
      best = a;
    }
  }
  return best;
}

/**
 * Trend between the latest attempt and the one before it. With < 2
 * attempts there's nothing to compare, so we return 'flat'. The
 * threshold suppresses sub-3-point drift so the arrow doesn't flicker.
 */
export function computeTrend(history: AttemptRecord[]): Trend {
  if (history.length < 2) return "flat";
  const latest = history[history.length - 1].overallScore;
  const prev = history[history.length - 2].overallScore;
  const diff = latest - prev;
  if (diff > TREND_THRESHOLD) return "up";
  if (diff < -TREND_THRESHOLD) return "down";
  return "flat";
}

/**
 * Compute improved + regressed phoneme deltas between the latest two
 * attempts. Aggregates by raw phoneme symbol (averaging when the same
 * phoneme appears multiple times in either attempt) so a learner who
 * fixes their /θ/ across both "think" and "thank" sees one entry, not
 * two.
 *
 * Returns empty lists when:
 *   - history < 2
 *   - either attempt has empty phonemes (local-fallback path)
 *
 * Sorted: improved descending by delta; regressed ascending by delta
 * (most-negative first).
 */
export function computePhonemeDeltas(history: AttemptRecord[]): HistoryDelta {
  if (history.length < 2) return { improved: [], regressed: [] };
  const latest = history[history.length - 1];
  const previous = history[history.length - 2];

  if (latest.phonemes.length === 0 || previous.phonemes.length === 0) {
    return { improved: [], regressed: [] };
  }

  const latestByPhoneme = aggregateByPhoneme(latest.phonemes);
  const prevByPhoneme = aggregateByPhoneme(previous.phonemes);

  const deltas: PhonemeDelta[] = [];
  for (const [phoneme, latestScore] of latestByPhoneme) {
    const prevScore = prevByPhoneme.get(phoneme);
    if (prevScore === undefined) continue;
    deltas.push({
      phoneme,
      latestScore: Math.round(latestScore),
      previousScore: Math.round(prevScore),
      delta: Math.round(latestScore - prevScore),
    });
  }

  const improved = deltas
    .filter((d) => d.delta >= IMPROVED_MIN_DELTA)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, MAX_DELTAS);

  const regressed = deltas
    .filter((d) => d.delta <= REGRESSED_MAX_DELTA)
    .sort((a, b) => a.delta - b.delta)
    .slice(0, MAX_DELTAS);

  return { improved, regressed };
}

/**
 * Detect whether the history is comparable at the phoneme level (i.e.
 * both Azure scoring runs succeeded). Used to decide whether to render
 * the per-phoneme delta lists vs only the overall-score timeline.
 */
export function hasPhonemeData(history: AttemptRecord[]): boolean {
  return history.some((a) => a.phonemes.length > 0);
}

// ── Internal ────────────────────────────────────────────────────────────

function aggregateByPhoneme(scores: PhonemeScore[]): Map<string, number> {
  // Sum + count per phoneme so we can return mean. Phoneme symbols are
  // case-insensitive — Azure occasionally varies casing on retries.
  const sums = new Map<string, { total: number; count: number }>();
  for (const ps of scores) {
    const key = (ps.phoneme ?? "").trim().toLowerCase();
    if (!key) continue;
    const cur = sums.get(key) ?? { total: 0, count: 0 };
    cur.total += ps.score;
    cur.count += 1;
    sums.set(key, cur);
  }
  const out = new Map<string, number>();
  for (const [k, v] of sums) {
    if (v.count > 0) out.set(k, v.total / v.count);
  }
  return out;
}
