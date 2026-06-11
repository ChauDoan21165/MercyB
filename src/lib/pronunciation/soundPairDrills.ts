/**
 * Sound-pair drill library.
 *
 * Pure logic layer that fronts the PROBLEM_PAIRS_* catalogs in
 * vn-phoneme-map.ts. Responsible for:
 *
 *   - picking a drill set by category (shuffled, size-capped)
 *   - scoring a single attempt against a target phoneme/word
 *   - a stubbed `scoreFromAudio` that returns a mock confidence so the
 *     UI can ship without a committed STT vendor
 *
 * The real audio → phoneme wiring is deferred until after vendor choice
 * (Whisper API / Deepgram / ELSA) — see reports/a7-phoneme-runbook.md.
 *
 * No React, no DOM, no I/O. Trivial to unit test.
 */

import {
  PROBLEM_PAIRS_ED_ENDINGS,
  PROBLEM_PAIRS_INTONATION,
  PROBLEM_PAIRS_R_L,
  PROBLEM_PAIRS_S_PLURALS,
  PROBLEM_PAIRS_STRESS,
  PROBLEM_PAIRS_TH_T,
  type ProblemPair,
} from './vn-phoneme-map';
import { pickF5ByDifficulty } from './f5MinimalPairPicker';

export type DrillCategory =
  | 'th-t'
  | 'r-l'
  | 'ed'
  | 's'
  | 'stress'
  | 'intonation'
  | 'f5-easy'
  | 'f5-medium'
  | 'f5-hard';

export const DRILL_CATEGORIES: readonly DrillCategory[] = [
  'th-t',
  'r-l',
  'ed',
  's',
  'stress',
  'intonation',
  'f5-easy',
  'f5-medium',
  'f5-hard',
] as const;

// F5 categories delegate to the picker; static pools for legacy categories.
const STATIC_POOLS: Partial<Record<DrillCategory, ProblemPair[]>> = {
  'th-t': PROBLEM_PAIRS_TH_T,
  'r-l': PROBLEM_PAIRS_R_L,
  ed: PROBLEM_PAIRS_ED_ENDINGS,
  s: PROBLEM_PAIRS_S_PLURALS,
  stress: PROBLEM_PAIRS_STRESS,
  intonation: PROBLEM_PAIRS_INTONATION,
};

export type DrillOptions = {
  /** How many pairs to return. Defaults to 5; capped by pool size. */
  size?: number;
  /**
   * Deterministic seed for the shuffle. Omit in production (uses
   * Math.random); tests pass a seed so assertions are stable.
   */
  seed?: number;
};

/**
 * Return a shuffled slice of the category's pool. Never mutates the
 * underlying PROBLEM_PAIRS_* arrays.
 *
 * F5 categories ('f5-easy', 'f5-medium', 'f5-hard') delegate to the
 * f5MinimalPairPicker so they draw from the live corpus without a static
 * pool copy.
 */
export function getDrillByCategory(
  cat: DrillCategory,
  opts?: DrillOptions,
): ProblemPair[] {
  if (cat === 'f5-easy') return pickF5ByDifficulty('easy', opts);
  if (cat === 'f5-medium') return pickF5ByDifficulty('medium', opts);
  if (cat === 'f5-hard') return pickF5ByDifficulty('hard', opts);

  const pool = STATIC_POOLS[cat];
  if (!pool || pool.length === 0) return [];
  const size = Math.max(1, Math.min(opts?.size ?? 5, pool.length));
  const rand = opts?.seed === undefined ? Math.random : mulberry32(opts.seed);
  const shuffled = fisherYates(pool.slice(), rand);
  return shuffled.slice(0, size);
}

/**
 * Pure, deterministic scoring between a target phoneme/word and a
 * recognised attempt. Returns a 0..1 confidence.
 *
 * Heuristic:
 *   - exact match (case-insensitive, trimmed) → 1.0
 *   - levenshtein-based similarity for near-misses
 *   - empty inputs → 0
 *
 * This is NOT the production pronunciation scorer — that's scorer.ts
 * with the full alignment DP. This is a lightweight drill-level scorer
 * suitable for single-word attempts.
 */
export function scoreDrillAttempt(target: string, attempt: string): number {
  const t = normalise(target);
  const a = normalise(attempt);
  if (!t || !a) return 0;
  if (t === a) return 1;

  const distance = levenshtein(t, a);
  const span = Math.max(t.length, a.length);
  if (span === 0) return 0;
  const similarity = 1 - distance / span;
  return clamp01(similarity);
}

export type StubScoreResult = {
  /** Mock confidence value so the UI can render a result card. */
  confidence: number;
  /** Recognised transcript — stub returns empty string. */
  transcript: string;
  /** Marker so callers can branch on "we never actually ran STT". */
  mocked: true;
};

/**
 * STT placeholder. Real wiring deferred until vendor picked. Returns a
 * stable mock so drill UI can ship behind this seam — callers should
 * NOT treat the returned confidence as meaningful.
 *
 * @param _audio Accepted for future compatibility; ignored today.
 */
export async function scoreFromAudio(
  _audio: Blob | ArrayBuffer | null,
): Promise<StubScoreResult> {
  return { confidence: 0.72, transcript: '', mocked: true };
}

// ──────────────────────────────────────────────────────────────────────
// Internals
// ──────────────────────────────────────────────────────────────────────

function normalise(s: string): string {
  return String(s ?? '').toLowerCase().trim();
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = new Array<number>(rows * cols);
  for (let i = 0; i < rows; i++) dp[i * cols] = i;
  for (let j = 0; j < cols; j++) dp[j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i * cols + j] = Math.min(
        dp[(i - 1) * cols + j] + 1,
        dp[i * cols + (j - 1)] + 1,
        dp[(i - 1) * cols + (j - 1)] + cost,
      );
    }
  }
  return dp[rows * cols - 1];
}

function fisherYates<T>(arr: T[], rand: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Deterministic seeded PRNG (Mulberry32) — adequate for shuffling.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
