// Per-day per-phoneme aggregator backing the /progress heatmap.
//
// Reads `speech_attempts` (RLS gates rows to the calling user), groups
// each attempt's phoneme breakdown by UTC day, and emits a sparse
// `HeatmapData` shape that the SVG component renders without further
// transformation. Returns null when fewer than 5 attempts fall in the
// window — below that, a heatmap is more noise than signal.
//
// All aggregation is pure on (rawAttempts, daysBack, now). The async
// entry point is a thin shell around `buildHeatmapFromAttempts` so
// tests can run the math without a Supabase mock.
//
// Caching: sessionStorage, 5-minute TTL, keyed by user + window. The
// /progress page mounts the heatmap alongside other widgets that hit
// `getWeeklyProgressSummary`; without a cache, opening /progress would
// re-fetch attempts twice. With it, the second read is free.
//
// Privacy: nothing leaves the client. The user's row-level select
// already enforced by RLS — we don't add a user_id filter here, the
// query inherits the authenticated session.

import { supabase } from "@/lib/supabaseClient";
import {
  canonicalizePhoneme,
  extractPhonemeBreakdown,
} from "@/lib/analytics/speechProgress";

/** A single (phoneme, day) cell with its aggregated score + count. */
export type HeatmapCell = {
  phoneme: string;
  /** YYYY-MM-DD UTC bucket. */
  day: string;
  averageScore: number;
  attemptCount: number;
};

export type HeatmapData = {
  /**
   * Phonemes with at least one attempt in the window. Sorted vowels
   * first (alphabetical), then consonants (alphabetical) so the heatmap
   * row order is predictable across renders.
   */
  phonemes: string[];
  /** Day buckets in window, oldest first, YYYY-MM-DD UTC. Always `daysBack` long. */
  days: string[];
  /** Sparse — only (phoneme, day) pairs with data. */
  cells: HeatmapCell[];
  /** Total attempts considered (whole window, not per-cell). */
  totalAttempts: number;
  /** Epoch ms snapshot timestamp; drives the 5-min cache TTL. */
  builtAt: number;
  /** Window size used (clamped). */
  daysBack: number;
};

/** Minimum attempts in the window before we render the heatmap. */
export const MIN_HEATMAP_ATTEMPTS = 5;

/** SessionStorage TTL for the cached snapshot. */
const HEATMAP_SESSION_TTL_MS = 5 * 60 * 1000;
const HEATMAP_SESSION_KEY_PREFIX = "mercy.heatmap.v1.";

/**
 * Vietnamese-relevant vowel set — the 13-symbol canonical vowel inventory
 * `speechProgress.CANONICAL_PHONEMES` uses. Anything else is treated as
 * a consonant for grouping purposes (we don't try to draw the diphthong
 * vs. monophthong distinction in the UI; that's overkill).
 */
const VOWEL_SET: ReadonlySet<string> = new Set([
  "ae", "ah", "eh", "ih", "iy", "uh", "uw", "ey", "ay", "ow", "aw", "oy", "er",
]);

export function phonemeCategory(phoneme: string): "vowel" | "consonant" {
  return VOWEL_SET.has(phoneme) ? "vowel" : "consonant";
}

// ── Public API ──────────────────────────────────────────────────────────

/**
 * Fetch + aggregate the user's heatmap for the last `daysBack` days.
 * Returns null when:
 *   - userId is empty (anonymous),
 *   - the window has fewer than MIN_HEATMAP_ATTEMPTS attempts,
 *   - the upstream fetch failed (we never block /progress on a single widget).
 */
export async function getPhonemeHeatmap(
  userId: string | null,
  daysBack: number = 30,
): Promise<HeatmapData | null> {
  if (!userId) return null;
  const safeDays = clampDays(daysBack);

  const cached = readHeatmapCache(userId, safeDays);
  if (cached) return cached;

  const now = new Date();
  const end = startOfDayUtc(now);
  end.setUTCDate(end.getUTCDate() + 1);
  const start = addDays(end, -safeDays);

  let rows: RawHeatmapAttempt[];
  try {
    rows = await fetchAttemptsForHeatmap(start.toISOString(), end.toISOString());
  } catch (err) {
    console.warn("[phonemeHeatmap] fetch failed:", err);
    return null;
  }

  const data = buildHeatmapFromAttempts(rows, safeDays, end.getTime());
  if (!data) return null;

  writeHeatmapCache(userId, safeDays, data);
  return data;
}

/**
 * Drill-down: every attempt for a given (day, phoneme) cell. Returns
 * only attempts whose `phoneme_scores` actually included that phoneme,
 * sorted newest-first. Used by HeatmapDrillDown.
 */
export async function getHeatmapDrillDown(
  userId: string | null,
  day: string,
  phoneme: string,
): Promise<HeatmapDrillDownAttempt[]> {
  if (!userId) return [];
  const target = canonicalizePhoneme(phoneme);
  if (!target) return [];

  const start = day + "T00:00:00.000Z";
  // End is start + 1 day, ISO. We compute via Date so DST edge cases stay
  // sane even though our buckets are UTC.
  const endDate = new Date(start);
  endDate.setUTCDate(endDate.getUTCDate() + 1);
  const end = endDate.toISOString();

  let rows: RawHeatmapAttempt[];
  try {
    rows = await fetchAttemptsForHeatmap(start, end);
  } catch (err) {
    console.warn("[phonemeHeatmap] drill-down fetch failed:", err);
    return [];
  }

  const out: HeatmapDrillDownAttempt[] = [];
  for (const row of rows) {
    const breakdown = extractPhonemeBreakdown(row);
    if (breakdown.length === 0) continue;
    const matches = breakdown.filter((b) => b.phoneme === target);
    if (matches.length === 0) continue;
    const avg = Math.round(
      matches.reduce((s, b) => s + b.score, 0) / matches.length,
    );
    out.push({
      id: row.id,
      attemptedAt: row.attempted_at,
      targetText: row.target_text,
      transcript: row.transcript,
      overallScore: row.overall_score,
      phonemeAverage: avg,
      phonemeAttemptCount: matches.length,
    });
  }
  out.sort((a, b) => (a.attemptedAt < b.attemptedAt ? 1 : -1));
  return out;
}

// ── Pure aggregation (exported for tests) ───────────────────────────────

export function buildHeatmapFromAttempts(
  rows: ReadonlyArray<RawHeatmapAttempt>,
  daysBack: number,
  /** Epoch ms representing the END of today's UTC bucket (exclusive). */
  windowEndMs: number,
): HeatmapData | null {
  const safeDays = clampDays(daysBack);
  const end = new Date(windowEndMs);
  const start = addDays(startOfDayUtc(end), -safeDays);

  const totalAttempts = rows.length;
  if (totalAttempts < MIN_HEATMAP_ATTEMPTS) return null;

  // Bucket: phoneme → day → { sum, count }
  const buckets = new Map<string, Map<string, { sum: number; count: number }>>();
  let cellsContributing = 0;

  for (const row of rows) {
    const breakdown = extractPhonemeBreakdown(row);
    if (breakdown.length === 0) continue;
    const day = row.attempted_at.slice(0, 10);
    if (!isDayInWindow(day, start, safeDays)) continue;

    for (const { phoneme, score } of breakdown) {
      let perDay = buckets.get(phoneme);
      if (!perDay) {
        perDay = new Map();
        buckets.set(phoneme, perDay);
      }
      let cell = perDay.get(day);
      if (!cell) {
        cell = { sum: 0, count: 0 };
        perDay.set(day, cell);
        cellsContributing += 1;
      }
      cell.sum += score;
      cell.count += 1;
    }
  }

  if (cellsContributing === 0) return null;

  const phonemes = Array.from(buckets.keys()).sort(comparePhonemes);
  const days: string[] = [];
  for (let i = 0; i < safeDays; i += 1) {
    days.push(addDays(start, i).toISOString().slice(0, 10));
  }

  const cells: HeatmapCell[] = [];
  for (const phoneme of phonemes) {
    const perDay = buckets.get(phoneme);
    if (!perDay) continue;
    for (const day of days) {
      const c = perDay.get(day);
      if (!c) continue;
      cells.push({
        phoneme,
        day,
        averageScore: Math.round(c.sum / c.count),
        attemptCount: c.count,
      });
    }
  }

  return {
    phonemes,
    days,
    cells,
    totalAttempts,
    builtAt: Date.now(),
    daysBack: safeDays,
  };
}

/** Clear the cached snapshot for a user (test/admin tool). */
export function __clearHeatmapCacheForTests(userId: string): void {
  if (typeof sessionStorage === "undefined") return;
  for (const days of [7, 30, 90]) {
    try {
      sessionStorage.removeItem(HEATMAP_SESSION_KEY_PREFIX + userId + ".d" + days);
    } catch {
      /* ignore */
    }
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────

export type RawHeatmapAttempt = {
  id: string;
  attempted_at: string;
  overall_score: number | null;
  target_text: string | null;
  transcript: string | null;
  word_scores: unknown;
  phoneme_scores: unknown;
};

export type HeatmapDrillDownAttempt = {
  id: string;
  attemptedAt: string;
  targetText: string | null;
  transcript: string | null;
  overallScore: number | null;
  /** Average score for the requested phoneme across this single attempt. */
  phonemeAverage: number;
  /** How many phoneme samples this attempt produced for the requested phoneme. */
  phonemeAttemptCount: number;
};

const SELECT_COLS =
  "id, attempted_at, overall_score, target_text, transcript, word_scores, phoneme_scores";

async function fetchAttemptsForHeatmap(
  startIso: string,
  endIso: string,
): Promise<RawHeatmapAttempt[]> {
  const { data, error } = await supabase
    .from("speech_attempts")
    .select(SELECT_COLS)
    .gte("attempted_at" as never, startIso)
    .lt("attempted_at" as never, endIso)
    .order("attempted_at" as never, { ascending: false })
    .limit(2000);
  if (error) throw error;
  return (data ?? []).map((raw) => coerceHeatmapRow(raw));
}

function coerceHeatmapRow(raw: unknown): RawHeatmapAttempt {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(r.id ?? ""),
    attempted_at:
      typeof r.attempted_at === "string"
        ? r.attempted_at
        : new Date(0).toISOString(),
    overall_score:
      typeof r.overall_score === "number" && Number.isFinite(r.overall_score)
        ? Math.round(r.overall_score)
        : null,
    target_text: typeof r.target_text === "string" ? r.target_text : null,
    transcript: typeof r.transcript === "string" ? r.transcript : null,
    word_scores: r.word_scores ?? null,
    phoneme_scores: r.phoneme_scores ?? null,
  };
}

function clampDays(d: number): number {
  if (!Number.isFinite(d)) return 30;
  return Math.max(1, Math.min(180, Math.round(d)));
}

function startOfDayUtc(d: Date): Date {
  const out = new Date(d.getTime());
  out.setUTCHours(0, 0, 0, 0);
  return out;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d.getTime());
  out.setUTCDate(out.getUTCDate() + n);
  return out;
}

function isDayInWindow(day: string, start: Date, lengthDays: number): boolean {
  const idx = (Date.parse(day + "T00:00:00.000Z") - start.getTime()) / 86_400_000;
  return Number.isFinite(idx) && idx >= 0 && idx < lengthDays;
}

/**
 * Sort: vowels alphabetical, then consonants alphabetical. Predictable
 * row order makes the heatmap glanceable across reloads — the user's
 * eye learns "th is row 14" and that should not move.
 */
function comparePhonemes(a: string, b: string): number {
  const ca = phonemeCategory(a);
  const cb = phonemeCategory(b);
  if (ca !== cb) return ca === "vowel" ? -1 : 1;
  return a < b ? -1 : a > b ? 1 : 0;
}

// ── Cache ────────────────────────────────────────────────────────────────

function cacheKey(userId: string, daysBack: number): string {
  return HEATMAP_SESSION_KEY_PREFIX + userId + ".d" + daysBack;
}

function readHeatmapCache(userId: string, daysBack: number): HeatmapData | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(cacheKey(userId, daysBack));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HeatmapData;
    if (typeof parsed.builtAt !== "number") return null;
    if (Date.now() - parsed.builtAt > HEATMAP_SESSION_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeHeatmapCache(
  userId: string,
  daysBack: number,
  data: HeatmapData,
): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(cacheKey(userId, daysBack), JSON.stringify(data));
  } catch {
    /* ignore — quota / private mode */
  }
}
