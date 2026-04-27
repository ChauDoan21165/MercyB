/**
 * Speech-progress aggregation.
 *
 * Powers the /progress dashboard, the Home weekly widget, and the
 * "download my progress" CSV export. All reads are scoped to the
 * signed-in user via RLS — every query runs under the supabase
 * singleton client, so a stranger's rows are never visible.
 *
 * Source data: `public.speech_attempts`. Columns we touch:
 *   - user_id, attempted_at, overall_score, target_text, transcript
 *   - word_scores  (local scorer payload — may include nested phonemes)
 *   - phoneme_scores (Azure NBest.Words — raw vendor shape)
 *
 * Both column shapes are normalized through `extractPhonemeBreakdown()`
 * so callers see one tidy `PhonemeAccuracy[]` per attempt regardless of
 * which scorer wrote the row.
 *
 * Phoneme symbols come back from Azure in mixed casing / IPA-vs-SAPI
 * flavours. We canonicalize via the same alias map used by
 * `phonemeHints.getPhonemeHint`, so "θ" / "TH" / "th" all collapse to
 * the same bucket.
 */

import { supabase } from "@/lib/supabaseClient";

// ── Normalization helpers ─────────────────────────────────────────────

/**
 * Aliases mirror src/lib/pronunciation/phonemeHints.ts so the chart
 * keys line up with the tooltip dictionary. Kept inline (not imported)
 * to avoid pulling the whole hint table into bundles that only need
 * aggregation logic.
 */
const PHONEME_ALIASES: Record<string, string> = {
  "θ": "th",
  "ð": "dh",
  "ʃ": "sh",
  "ʒ": "zh",
  "tʃ": "ch",
  "dʒ": "jh",
  "ŋ": "ng",
  "æ": "ae",
  "ɑ": "ah",
  "ɛ": "eh",
  "ɪ": "ih",
  "i": "iy",
  "ʊ": "uh",
  "u": "uw",
  "eɪ": "ey",
  "aɪ": "ay",
  "oʊ": "ow",
  "aʊ": "aw",
  "ɔɪ": "oy",
  "ɝ": "er",
  "ɚ": "er",
  "ə": "ax",
};

/**
 * Canonical 32-phoneme set the bar chart renders. Matches the keys
 * in HINTS so every bar can show its coaching hint on hover.
 */
export const CANONICAL_PHONEMES: readonly string[] = [
  "th",
  "dh",
  "r",
  "l",
  "ae",
  "ah",
  "eh",
  "ih",
  "iy",
  "uh",
  "uw",
  "ey",
  "ay",
  "ow",
  "aw",
  "oy",
  "er",
  "sh",
  "zh",
  "ch",
  "jh",
  "ng",
  "n",
  "m",
  "t",
  "d",
  "k",
  "p",
  "b",
  "s",
  "z",
  "f",
];

export function canonicalizePhoneme(symbol: string): string | null {
  const raw = (symbol ?? "").trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();
  // Strip Azure stress markers that sometimes appear: "ah1", "ax0".
  const stripped = lower.replace(/[0-9]+$/, "");
  return PHONEME_ALIASES[raw] ?? PHONEME_ALIASES[lower] ?? stripped;
}

// ── Public types ──────────────────────────────────────────────────────

export type PhonemeAccuracy = {
  /** Canonical phoneme key — matches phonemeHints.HINTS keys. */
  phoneme: string;
  /** 0..100 — Azure AccuracyScore (or local scorer equivalent). */
  score: number;
};

export type PhonemeAggregate = {
  phoneme: string;
  averageScore: number;
  attemptCount: number;
};

export type ProgressWindow = {
  /** Start-of-window in ISO. */
  startIso: string;
  /** End-of-window in ISO (exclusive). */
  endIso: string;
  attempts: number;
  averageScore: number | null;
};

export type WeeklyProgress = {
  thisWeek: ProgressWindow;
  lastWeek: ProgressWindow;
  /** thisWeek.averageScore - lastWeek.averageScore. null if either side is null. */
  scoreDelta: number | null;
  attemptDelta: number;
  /** Top phonemes by score-delta (this week vs last week), best first. */
  mostImproved: Array<PhonemeAggregate & { delta: number }>;
  /** Phonemes with the lowest current-week average, lowest first. */
  weakest: PhonemeAggregate[];
  /** Phoneme averages over the THIS-week window — feeds the bar chart. */
  phonemeAverages: PhonemeAggregate[];
  /** Server-side current streak count (profiles.streak_current). */
  streak: number;
  /** Estimated practice minutes — sum(elapsed_ms) / 60000, rounded. */
  totalMinutes: number;
};

export type MonthlyProgress = WeeklyProgress;

export type PhonemeTimelinePoint = {
  /** YYYY-MM-DD bucket (UTC). */
  date: string;
  /** Per-day average accuracy for the requested phoneme, 0..100. */
  averageScore: number | null;
  /** Number of attempts that contributed to this point. */
  attemptCount: number;
};

export type RecentAttempt = {
  id: string;
  attemptedAt: string;
  targetText: string;
  transcript: string | null;
  overallScore: number | null;
};

export type WeeklyTrendPoint = {
  /** Start-of-week ISO (Monday 00:00 UTC). */
  weekStartIso: string;
  averageScore: number | null;
  attemptCount: number;
};

// ── Internal: row shape we care about ─────────────────────────────────

type RawAttempt = {
  id: string;
  attempted_at: string;
  overall_score: number | null;
  elapsed_ms: number | null;
  target_text: string | null;
  transcript: string | null;
  word_scores: unknown;
  phoneme_scores: unknown;
};

const SELECT_COLS =
  "id, attempted_at, overall_score, elapsed_ms, target_text, transcript, word_scores, phoneme_scores";

// ── Phoneme extraction ────────────────────────────────────────────────

/**
 * Pulls a flat `PhonemeAccuracy[]` from a single attempt row, regardless
 * of whether the scorer wrote `phoneme_scores` (Azure raw) or just
 * `word_scores` (local scorer with optional nested phonemes).
 */
export function extractPhonemeBreakdown(row: {
  word_scores: unknown;
  phoneme_scores: unknown;
}): PhonemeAccuracy[] {
  const out: PhonemeAccuracy[] = [];

  // 1. Azure raw shape — array of { Phonemes: [{ Phoneme, AccuracyScore }] }
  if (Array.isArray(row.phoneme_scores)) {
    for (const word of row.phoneme_scores) {
      if (!word || typeof word !== "object") continue;
      const phs = (word as { Phonemes?: unknown }).Phonemes;
      if (!Array.isArray(phs)) continue;
      for (const ph of phs) {
        if (!ph || typeof ph !== "object") continue;
        const symbol = (ph as { Phoneme?: unknown }).Phoneme;
        const score = (ph as { AccuracyScore?: unknown }).AccuracyScore;
        const canonical =
          typeof symbol === "string" ? canonicalizePhoneme(symbol) : null;
        if (!canonical) continue;
        if (typeof score !== "number" || !Number.isFinite(score)) continue;
        out.push({ phoneme: canonical, score: clamp01_100(score) });
      }
    }
  }

  // 2. Local-scorer shape — array of { phonemes: [{ phoneme, score }] }
  if (Array.isArray(row.word_scores)) {
    for (const word of row.word_scores) {
      if (!word || typeof word !== "object") continue;
      const phs = (word as { phonemes?: unknown }).phonemes;
      if (!Array.isArray(phs)) continue;
      for (const ph of phs) {
        if (!ph || typeof ph !== "object") continue;
        const symbol = (ph as { phoneme?: unknown }).phoneme;
        const score = (ph as { score?: unknown }).score;
        const canonical =
          typeof symbol === "string" ? canonicalizePhoneme(symbol) : null;
        if (!canonical) continue;
        if (typeof score !== "number" || !Number.isFinite(score)) continue;
        out.push({ phoneme: canonical, score: clamp01_100(score) });
      }
    }
  }

  return out;
}

function clamp01_100(n: number): number {
  if (n < 0) return 0;
  if (n > 100) return 100;
  return Math.round(n);
}

// ── Window arithmetic ─────────────────────────────────────────────────

function startOfDayUtc(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
  );
}

/** Monday 00:00 UTC of the week containing `d`. */
function startOfWeekUtc(d: Date): Date {
  const day = startOfDayUtc(d);
  // getUTCDay: Sun=0, Mon=1, … Sat=6. Shift to Mon-start.
  const dow = day.getUTCDay();
  const back = dow === 0 ? 6 : dow - 1;
  day.setUTCDate(day.getUTCDate() - back);
  return day;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setUTCDate(out.getUTCDate() + n);
  return out;
}

// ── Aggregation primitives (pure, exported for tests + page) ──────────

export function aggregatePhonemeStats(
  rows: ReadonlyArray<{ word_scores: unknown; phoneme_scores: unknown }>,
): PhonemeAggregate[] {
  const buckets = new Map<string, { sum: number; count: number }>();
  for (const row of rows) {
    const breakdown = extractPhonemeBreakdown(row);
    for (const { phoneme, score } of breakdown) {
      const cur = buckets.get(phoneme);
      if (cur) {
        cur.sum += score;
        cur.count += 1;
      } else {
        buckets.set(phoneme, { sum: score, count: 1 });
      }
    }
  }
  const out: PhonemeAggregate[] = [];
  for (const [phoneme, { sum, count }] of buckets) {
    out.push({
      phoneme,
      attemptCount: count,
      averageScore: count > 0 ? Math.round(sum / count) : 0,
    });
  }
  return out.sort((a, b) => a.phoneme.localeCompare(b.phoneme));
}

function averageOverall(rows: ReadonlyArray<RawAttempt>): number | null {
  let sum = 0;
  let count = 0;
  for (const r of rows) {
    if (typeof r.overall_score === "number" && Number.isFinite(r.overall_score)) {
      sum += r.overall_score;
      count += 1;
    }
  }
  return count > 0 ? Math.round(sum / count) : null;
}

function totalMinutes(rows: ReadonlyArray<RawAttempt>): number {
  let ms = 0;
  for (const r of rows) {
    if (typeof r.elapsed_ms === "number" && r.elapsed_ms > 0) ms += r.elapsed_ms;
  }
  // Fall back to a 6-second-per-attempt estimate when elapsed_ms is missing —
  // earlier rows in the table predate the elapsed_ms column.
  if (ms === 0 && rows.length > 0) ms = rows.length * 6000;
  return Math.max(0, Math.round(ms / 60000));
}

function diffPhonemes(
  current: PhonemeAggregate[],
  previous: PhonemeAggregate[],
): Array<PhonemeAggregate & { delta: number }> {
  const prevMap = new Map(previous.map((p) => [p.phoneme, p.averageScore]));
  return current.map((p) => {
    const prev = prevMap.get(p.phoneme);
    const delta =
      typeof prev === "number" && prev !== null ? p.averageScore - prev : 0;
    return { ...p, delta };
  });
}

// ── Database accessors ────────────────────────────────────────────────

async function fetchAttemptsBetween(
  startIso: string,
  endIso: string,
): Promise<RawAttempt[]> {
  const { data, error } = await supabase
    .from("speech_attempts")
    .select(SELECT_COLS)
    // attempted_at is a column added in the speech_attempts persistence
    // migration — not yet in the generated types.
    .gte("attempted_at" as never, startIso)
    .lt("attempted_at" as never, endIso)
    .order("attempted_at" as never, { ascending: false })
    .limit(2000);
  if (error) throw error;
  return (data ?? []).map(coerceRow);
}

function coerceRow(raw: unknown): RawAttempt {
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
    elapsed_ms:
      typeof r.elapsed_ms === "number" && Number.isFinite(r.elapsed_ms)
        ? Math.round(r.elapsed_ms)
        : null,
    target_text: typeof r.target_text === "string" ? r.target_text : null,
    transcript: typeof r.transcript === "string" ? r.transcript : null,
    word_scores: r.word_scores ?? null,
    phoneme_scores: r.phoneme_scores ?? null,
  };
}

async function fetchStreakCurrent(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("profiles")
    .select("streak_current")
    .eq("id", userId)
    .maybeSingle();
  if (error) return 0;
  const v = (data as { streak_current?: number } | null)?.streak_current;
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

// ── Public API ────────────────────────────────────────────────────────

/**
 * "This week vs last week" — bar-chart phonemes, deltas, weak phonemes.
 *
 * `userId` is required only to fetch the streak field; the attempt
 * rows are scoped by RLS to the signed-in user regardless.
 */
export async function getWeeklyProgressSummary(
  userId: string,
): Promise<WeeklyProgress> {
  const now = new Date();
  const thisStart = startOfWeekUtc(now);
  const thisEnd = addDays(thisStart, 7);
  const lastStart = addDays(thisStart, -7);
  const lastEnd = thisStart;

  const [thisWeekRows, lastWeekRows, streak] = await Promise.all([
    fetchAttemptsBetween(thisStart.toISOString(), thisEnd.toISOString()),
    fetchAttemptsBetween(lastStart.toISOString(), lastEnd.toISOString()),
    fetchStreakCurrent(userId),
  ]);

  return buildSummary({
    thisStart,
    thisEnd,
    lastStart,
    lastEnd,
    thisRows: thisWeekRows,
    lastRows: lastWeekRows,
    streak,
  });
}

/**
 * "This 30 days vs prior 30 days" — same shape as the weekly summary.
 */
export async function getMonthlyProgressSummary(
  userId: string,
): Promise<MonthlyProgress> {
  const now = new Date();
  const thisEnd = startOfDayUtc(now);
  thisEnd.setUTCDate(thisEnd.getUTCDate() + 1);
  const thisStart = addDays(thisEnd, -30);
  const lastEnd = thisStart;
  const lastStart = addDays(lastEnd, -30);

  const [thisRows, lastRows, streak] = await Promise.all([
    fetchAttemptsBetween(thisStart.toISOString(), thisEnd.toISOString()),
    fetchAttemptsBetween(lastStart.toISOString(), lastEnd.toISOString()),
    fetchStreakCurrent(userId),
  ]);

  return buildSummary({
    thisStart,
    thisEnd,
    lastStart,
    lastEnd,
    thisRows,
    lastRows,
    streak,
  });
}

function buildSummary(input: {
  thisStart: Date;
  thisEnd: Date;
  lastStart: Date;
  lastEnd: Date;
  thisRows: RawAttempt[];
  lastRows: RawAttempt[];
  streak: number;
}): WeeklyProgress {
  const { thisStart, thisEnd, lastStart, lastEnd, thisRows, lastRows, streak } =
    input;

  const thisAvg = averageOverall(thisRows);
  const lastAvg = averageOverall(lastRows);

  const thisPhonemes = aggregatePhonemeStats(thisRows);
  const lastPhonemes = aggregatePhonemeStats(lastRows);

  const diffs = diffPhonemes(thisPhonemes, lastPhonemes);
  const mostImproved = [...diffs]
    .filter((d) => d.delta > 0 && d.attemptCount > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3);
  const weakest = [...thisPhonemes]
    .filter((p) => p.attemptCount > 0)
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, 3);

  return {
    thisWeek: {
      startIso: thisStart.toISOString(),
      endIso: thisEnd.toISOString(),
      attempts: thisRows.length,
      averageScore: thisAvg,
    },
    lastWeek: {
      startIso: lastStart.toISOString(),
      endIso: lastEnd.toISOString(),
      attempts: lastRows.length,
      averageScore: lastAvg,
    },
    scoreDelta:
      thisAvg !== null && lastAvg !== null ? thisAvg - lastAvg : null,
    attemptDelta: thisRows.length - lastRows.length,
    mostImproved,
    weakest,
    phonemeAverages: thisPhonemes,
    streak,
    totalMinutes: totalMinutes(thisRows),
  };
}

/**
 * Per-day timeline of a single phoneme's accuracy over the last `days`
 * days. Empty days return `averageScore: null` so chart libraries can
 * draw a gap rather than a zero dip.
 */
export async function getPhonemeProgressOverTime(
  ipa: string,
  days: number,
): Promise<PhonemeTimelinePoint[]> {
  const safeDays = Math.max(1, Math.min(180, Math.round(days)));
  const target = canonicalizePhoneme(ipa);
  if (!target) return [];

  const now = new Date();
  const end = startOfDayUtc(now);
  end.setUTCDate(end.getUTCDate() + 1);
  const start = addDays(end, -safeDays);

  const rows = await fetchAttemptsBetween(start.toISOString(), end.toISOString());

  // Bucket by YYYY-MM-DD (UTC).
  const buckets = new Map<string, { sum: number; count: number }>();
  for (const row of rows) {
    const breakdown = extractPhonemeBreakdown(row);
    if (breakdown.length === 0) continue;
    const day = row.attempted_at.slice(0, 10);
    let bucket = buckets.get(day);
    if (!bucket) {
      bucket = { sum: 0, count: 0 };
      buckets.set(day, bucket);
    }
    for (const { phoneme, score } of breakdown) {
      if (phoneme !== target) continue;
      bucket.sum += score;
      bucket.count += 1;
    }
  }

  const out: PhonemeTimelinePoint[] = [];
  for (let i = 0; i < safeDays; i += 1) {
    const day = addDays(start, i).toISOString().slice(0, 10);
    const bucket = buckets.get(day);
    out.push({
      date: day,
      averageScore:
        bucket && bucket.count > 0 ? Math.round(bucket.sum / bucket.count) : null,
      attemptCount: bucket?.count ?? 0,
    });
  }
  return out;
}

/**
 * 4-week trajectory: returns 4 buckets ending on this week, oldest
 * first. Drives the trend line on /progress.
 */
export async function getWeeklyTrend(
  weeks: number = 4,
): Promise<WeeklyTrendPoint[]> {
  const safeWeeks = Math.max(1, Math.min(26, Math.round(weeks)));
  const now = new Date();
  const thisStart = startOfWeekUtc(now);
  const start = addDays(thisStart, -7 * (safeWeeks - 1));
  const end = addDays(thisStart, 7);

  const rows = await fetchAttemptsBetween(start.toISOString(), end.toISOString());

  const points: WeeklyTrendPoint[] = [];
  for (let i = 0; i < safeWeeks; i += 1) {
    const wkStart = addDays(start, i * 7);
    const wkEnd = addDays(wkStart, 7);
    const slice = rows.filter((r) => {
      const t = new Date(r.attempted_at).getTime();
      return t >= wkStart.getTime() && t < wkEnd.getTime();
    });
    points.push({
      weekStartIso: wkStart.toISOString(),
      averageScore: averageOverall(slice),
      attemptCount: slice.length,
    });
  }
  return points;
}

/**
 * Recent attempts feed — used by the /progress "Recent attempts" card.
 * Limit defaults to 10 to match the brief.
 */
export async function getRecentAttempts(
  limit: number = 10,
): Promise<RecentAttempt[]> {
  const safe = Math.max(1, Math.min(50, Math.round(limit)));
  const { data, error } = await supabase
    .from("speech_attempts")
    .select("id, attempted_at, overall_score, target_text, transcript")
    .order("attempted_at" as never, { ascending: false })
    .limit(safe);
  if (error) throw error;
  return (data ?? []).map((raw) => {
    const r = raw as Record<string, unknown>;
    return {
      id: String(r.id ?? ""),
      attemptedAt:
        typeof r.attempted_at === "string"
          ? r.attempted_at
          : new Date(0).toISOString(),
      overallScore:
        typeof r.overall_score === "number" && Number.isFinite(r.overall_score)
          ? Math.round(r.overall_score)
          : null,
      targetText: typeof r.target_text === "string" ? r.target_text : "",
      transcript: typeof r.transcript === "string" ? r.transcript : null,
    };
  });
}

/**
 * CSV export of the user's full attempt history. Newest first.
 * Returns a string suitable for `Blob([csv], { type: 'text/csv' })`.
 */
export async function exportAttemptsCsv(): Promise<string> {
  const { data, error } = await supabase
    .from("speech_attempts")
    .select(
      "id, attempted_at, overall_score, elapsed_ms, target_text, transcript, room_id",
    )
    .order("attempted_at" as never, { ascending: false })
    .limit(10000);
  if (error) throw error;

  const header = [
    "id",
    "attempted_at",
    "overall_score",
    "elapsed_ms",
    "target_text",
    "transcript",
    "room_id",
  ];
  const lines = [header.join(",")];
  for (const raw of data ?? []) {
    const r = raw as Record<string, unknown>;
    lines.push(
      [
        csvField(r.id),
        csvField(r.attempted_at),
        csvField(r.overall_score),
        csvField(r.elapsed_ms),
        csvField(r.target_text),
        csvField(r.transcript),
        csvField(r.room_id),
      ].join(","),
    );
  }
  return lines.join("\n");
}

function csvField(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
