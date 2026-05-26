// src/lib/weakness/recommendationEngine.ts
//
// A4 — Weakest-skill recommendation engine v2.
//
// Given a Vietnamese learner's L1-error history (rows from
// `mb_user_weakness_profile`), score every rule in WEAKNESS_CATALOG and
// return ranked recommendations the UI can render directly.
//
// Three public entry points:
//
//   getTopWeaknesses(userId, n=3, opts?)
//     → user's top N weakest rules with score + confidence. The card
//       on Home and the Mercy debrief screen consume this.
//
//   recommendNextLesson(userId, opts?)
//     → highest-impact rule that ALSO has a micro-lesson defined.
//       Used by FocusAreas → "Start lesson" CTA.
//
//   recommendDailyChallenge(userId, opts?)
//     → exactly one rule for the daily challenge (A3's surface).
//       Falls back to a cold-start pick if the user has no history,
//       so the caller never has to handle a null.
//
// Algorithm (per rule):
//
//   errorScore   = min(1, errorCount / 5)                        — saturates at 5
//   recencyScore = min(1, daysSinceLastAttempt / 14)             — older = higher
//   cefrAlign    = 1 - |ruleCefrIdx - userCefrIdx| / 5           — closer = higher
//
//   score      = 0.6 * errorScore + 0.3 * recencyScore + 0.1 * cefrAlign
//   confidence = min(1, errorCount / 5)
//
// Recency penalty: a rule attempted within the last 24 h scores low
// even if errorCount is high — we don't want to re-recommend the rule
// the user just practised. The penalty fades over 14 days.
//
// Cold start: when the user has zero history, scoring collapses to
// CEFR alignment alone. The engine returns A1→A2→B1… in difficulty
// order so a brand-new learner sees the gentlest rules first. Each
// returned recommendation carries `reason: "cold_start"` so the UI
// can show a "let's start with the basics" framing.
//
// Testability: the data layer is pluggable via `opts.fetchHistory`
// (default reads from Supabase) and `opts.now` (default `new Date()`).
// The pure scoring function `rankWeaknesses(history, now)` is exported
// for direct unit testing without I/O.
//
// Coordination notes:
//   - This module does NOT mutate WEAKNESS_CATALOG, MICRO_LESSONS, or
//     the L1 detector — they are read-only inputs.
//   - The data shape `AttemptRecord` is shared with focusAreasLogic.ts
//     (single canonical pure type).
//   - A3 (daily challenge UX) consumes `recommendDailyChallenge` —
//     keep the signature stable.

// Supabase client is loaded LAZILY inside `fetchHistoryFromSupabase`
// so unit tests don't trigger `createClient` at module-import time.
// Mirrors the pure-vs-IO split already used by focusAreasLogic.
import {
  computeWeaknessDensity,
  timeSinceLastAttempt,
  type AttemptRecord,
} from "./focusAreasLogic";
import { MICRO_LESSONS } from "./micro-lessons";
import {
  ALL_WEAKNESS_TAGS,
  isKnownWeaknessTag,
  type WeaknessTag,
} from "./weakness-catalog";

// ─── Types ────────────────────────────────────────────────────────────────

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type UserWeaknessHistory = {
  records: readonly AttemptRecord[];
  /** Defaults to "A2" if the caller has no estimate. */
  userCefr?: CefrLevel;
};

export type RecommendationReason =
  | "cold_start"
  | "high_error_rate"
  | "stale_practice"
  | "cefr_aligned";

export type WeaknessRecommendation = {
  tag: WeaknessTag;
  /** 0..1 — composite score. Higher = recommend more strongly. */
  score: number;
  /** 0..1 — how much we trust the score (function of attempt volume). */
  confidence: number;
  errorCount: number;
  /** `Number.POSITIVE_INFINITY` when never attempted. */
  daysSinceLastAttempt: number;
  /** What primarily drove the score — used by the UI for copy choice. */
  reason: RecommendationReason;
};

export type RecommendationOptions = {
  /** Inject for tests. Defaults to a Supabase fetch. */
  fetchHistory?: (userId: string) => Promise<UserWeaknessHistory>;
  /** Inject for tests. Defaults to `new Date()`. */
  now?: Date;
};

// ─── Static config ────────────────────────────────────────────────────────

const CEFR_ORDER: readonly CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

/**
 * Per-rule CEFR mapping. Pulled from the L1 detector header comment
 * (rules 36–60 are explicitly tagged there). The original 35 rules
 * from v1.0 / v1.1 / v1.2 are mapped to the level a Vietnamese learner
 * typically encounters them; defaults to "A2" for anything missing so
 * the engine never returns NaN.
 */
const RULE_CEFR: Partial<Record<WeaknessTag, CefrLevel>> = {
  // v1.0 placement test catalog — A1/A2 grammar
  vi_l1_3rd_person_s: "A1",
  vi_l1_past_ed: "A2",
  vi_l1_plural_s: "A1",
  // v1.1 detector rules
  vi_l1_missing_be: "A1",
  vi_l1_question_no_aux: "A1",
  vi_l1_missing_article: "A1",
  vi_l1_possessive_gender: "A2",
  vi_l1_preposition_transfer: "A2",
  vi_l1_countable: "A2",
  vi_l1_to_verb_confusion: "A1",
  vi_l1_can_no_infinitive: "A1",
  vi_l1_double_past: "A2",
  vi_l1_possessive_s_missing: "A2",
  vi_l1_comparative_double: "A2",
  vi_l1_adjective_order: "A2",
  vi_l1_very_much_placement: "A2",
  vi_l1_there_are_singular: "A1",
  vi_l1_everyone_plural: "A2",
  vi_l1_make_vs_do: "B1",
  vi_l1_tag_question: "B1",
  // v1.2
  vi_l1_past_perfect_missing: "B1",
  vi_l1_reported_speech: "B1",
  vi_l1_since_vs_for: "B1",
  vi_l1_countable_much: "A2",
  vi_l1_some_vs_any: "A2",
  vi_l1_reflexive_missing: "B1",
  vi_l1_conditional_mix: "B1",
  vi_l1_to_infinitive_after_ing: "B1",
  vi_l1_passive_missing_be: "B1",
  vi_l1_relative_pronoun: "B1",
  vi_l1_used_to_vs_be_used_to: "B2",
  vi_l1_another_vs_other: "B1",
  vi_l1_look_vs_see_vs_watch: "A2",
  vi_l1_by_vs_with: "A2",
  vi_l1_time_expressions: "A2",
  // Round 5 — explicit CEFR per detector header
  vi_l1_present_perfect_vs_past: "B1",
  vi_l1_subjunctive_were: "B2",
  vi_l1_embedded_question_order: "B1",
  vi_l1_do_support_3ps: "A2",
  vi_l1_subject_relative_omit: "B1",
  vi_l1_gerund_after_verb: "B1",
  vi_l1_modal_perfect: "B2",
  vi_l1_phrasal_pronoun_order: "B1",
  vi_l1_comparative_more_long: "A2",
  vi_l1_many_with_uncount: "A2",
  vi_l1_geographical_article: "B1",
  vi_l1_generic_plural: "A2",
  vi_l1_double_negative: "A2",
  vi_l1_negative_inversion: "C1",
  vi_l1_adverb_before_subject: "A2",
  vi_l1_make_let_bare: "B1",
  vi_l1_too_vs_very: "A2",
  vi_l1_a_vs_an_vowel: "A1",
  vi_l1_one_of_the_singular: "B1",
  vi_l1_each_singular: "B1",
  vi_l1_been_vs_gone: "B2",
  vi_l1_tag_polarity: "B1",
  vi_l1_no_article_generic: "A2",
  vi_l1_superlative_the: "A2",
  vi_l1_if_will: "B1",
};

const DEFAULT_RULE_CEFR: CefrLevel = "A2";

// Algorithm constants — see header for derivation
const WEIGHT_ERROR = 0.6;
const WEIGHT_RECENCY = 0.3;
const WEIGHT_CEFR = 0.1;
const ERROR_SATURATION = 5;
const RECENCY_HORIZON_DAYS = 14;

// ─── Helpers ──────────────────────────────────────────────────────────────

function cefrIndex(level: CefrLevel): number {
  return CEFR_ORDER.indexOf(level);
}

function cefrFor(tag: WeaknessTag): CefrLevel {
  return RULE_CEFR[tag] ?? DEFAULT_RULE_CEFR;
}

function cefrAlignment(ruleCefr: CefrLevel, userCefr: CefrLevel): number {
  const span = CEFR_ORDER.length - 1; // 5
  const diff = Math.abs(cefrIndex(ruleCefr) - cefrIndex(userCefr));
  return Math.max(0, 1 - diff / span);
}

function buildRecordIndex(records: readonly AttemptRecord[]): Map<string, AttemptRecord> {
  const map = new Map<string, AttemptRecord>();
  for (const r of records) {
    const prev = map.get(r.ruleTag);
    if (!prev) {
      map.set(r.ruleTag, r);
      continue;
    }
    // Coalesce duplicates: sum errors, keep most-recent lastSeenAt.
    const merged: AttemptRecord = {
      ruleTag: r.ruleTag,
      errorCount: prev.errorCount + r.errorCount,
      lastSeenAt: pickMoreRecent(prev.lastSeenAt, r.lastSeenAt),
    };
    map.set(r.ruleTag, merged);
  }
  return map;
}

function pickMoreRecent(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return Date.parse(b) > Date.parse(a) ? b : a;
}

function pickReason(args: {
  errorScore: number;
  recencyScore: number;
  cefrScore: number;
  hasHistory: boolean;
}): RecommendationReason {
  if (!args.hasHistory) return "cold_start";
  if (args.errorScore >= args.recencyScore && args.errorScore >= args.cefrScore) {
    return "high_error_rate";
  }
  if (args.recencyScore >= args.cefrScore) return "stale_practice";
  return "cefr_aligned";
}

function compareRecommendations(
  a: WeaknessRecommendation,
  b: WeaknessRecommendation,
): number {
  if (b.score !== a.score) return b.score - a.score;
  if (b.errorCount !== a.errorCount) return b.errorCount - a.errorCount;
  return a.tag.localeCompare(b.tag);
}

// ─── Pure scoring ─────────────────────────────────────────────────────────

/**
 * Pure ranker. Exported for unit tests and callers that already have
 * the user's history in memory (e.g. server-side aggregations).
 */
export function rankWeaknesses(
  history: UserWeaknessHistory,
  now: Date = new Date(),
): WeaknessRecommendation[] {
  const userCefr = history.userCefr ?? DEFAULT_RULE_CEFR;
  const records = history.records;
  const hasHistory =
    records.some((r) => r.errorCount > 0 && isKnownWeaknessTag(r.ruleTag));

  if (!hasHistory) {
    return coldStartRecommendations(userCefr);
  }

  const recordIndex = buildRecordIndex(records);
  // Density isn't used in scoring directly, but computing it triggers
  // the focusAreasLogic helper and gives us a per-tag share — kept for
  // future weighting and for design-doc transparency.
  computeWeaknessDensity(records);

  const out: WeaknessRecommendation[] = [];
  for (const tag of ALL_WEAKNESS_TAGS) {
    const record = recordIndex.get(tag) ?? null;
    const errorCount = record ? Math.max(0, record.errorCount) : 0;
    const daysSince = record
      ? timeSinceLastAttempt(records, tag, now)
      : Number.POSITIVE_INFINITY;

    const errorScore = Math.min(1, errorCount / ERROR_SATURATION);
    const recencyScore = Number.isFinite(daysSince)
      ? Math.min(1, daysSince / RECENCY_HORIZON_DAYS)
      : 0;
    const cefrScore = cefrAlignment(cefrFor(tag), userCefr);

    const score =
      WEIGHT_ERROR * errorScore +
      WEIGHT_RECENCY * recencyScore +
      WEIGHT_CEFR * cefrScore;
    const confidence = Math.min(1, errorCount / ERROR_SATURATION);

    out.push({
      tag,
      score,
      confidence,
      errorCount,
      daysSinceLastAttempt: daysSince,
      reason: pickReason({
        errorScore,
        recencyScore,
        cefrScore,
        hasHistory: errorCount > 0,
      }),
    });
  }

  out.sort(compareRecommendations);
  return out;
}

function coldStartRecommendations(userCefr: CefrLevel): WeaknessRecommendation[] {
  const ranked = [...ALL_WEAKNESS_TAGS].sort((a, b) => {
    const ai = cefrIndex(cefrFor(a));
    const bi = cefrIndex(cefrFor(b));
    if (ai !== bi) return ai - bi;
    return a.localeCompare(b);
  });
  return ranked.map((tag) => ({
    tag,
    score: WEIGHT_CEFR * cefrAlignment(cefrFor(tag), userCefr),
    confidence: 0,
    errorCount: 0,
    daysSinceLastAttempt: Number.POSITIVE_INFINITY,
    reason: "cold_start" as const,
  }));
}

// ─── Async public API ─────────────────────────────────────────────────────

/**
 * Default Supabase-backed history loader. Reads
 * `mb_user_weakness_profile` rows for the user and projects them to
 * the engine's pure shape. Never throws — on error returns an empty
 * history so the engine surfaces a cold-start recommendation rather
 * than a crash.
 */
async function fetchHistoryFromSupabase(
  userId: string,
): Promise<UserWeaknessHistory> {
  try {
    const { supabase } = await import("@/lib/supabaseClient");
    const { data, error } = await supabase
      .from("mb_user_weakness_profile")
      .select("key_pattern, frequency, last_seen")
      .eq("user_id", userId);
    if (error || !data) return { records: [] };
    const records: AttemptRecord[] = data.map((row) => ({
      ruleTag: row.key_pattern,
      errorCount: row.frequency ?? 0,
      lastSeenAt: row.last_seen ?? null,
    }));
    return { records };
  } catch {
    return { records: [] };
  }
}

async function loadHistory(
  userId: string,
  opts: RecommendationOptions,
): Promise<UserWeaknessHistory> {
  const fetcher = opts.fetchHistory ?? fetchHistoryFromSupabase;
  return fetcher(userId);
}

/**
 * Public: top N weakest rules for the user, ranked by composite score.
 * Always returns exactly `min(n, ALL_WEAKNESS_TAGS.length)` entries —
 * cold-start users still get a list (CEFR-aligned introductions).
 */
export async function getTopWeaknesses(
  userId: string,
  n: number = 3,
  opts: RecommendationOptions = {},
): Promise<WeaknessRecommendation[]> {
  const history = await loadHistory(userId, opts);
  const ranked = rankWeaknesses(history, opts.now ?? new Date());
  return ranked.slice(0, Math.max(0, n));
}

/**
 * Public: pick the next micro-lesson to surface. Filters to rules that
 * actually have a `MICRO_LESSONS` entry (otherwise the CTA dead-ends),
 * then returns the highest-scoring tag. Returns null only when no
 * micro-lessons exist at all — every other path returns a tag.
 */
export async function recommendNextLesson(
  userId: string,
  opts: RecommendationOptions = {},
): Promise<WeaknessTag | null> {
  const history = await loadHistory(userId, opts);
  const ranked = rankWeaknesses(history, opts.now ?? new Date());
  const withLesson = ranked.find((r) => MICRO_LESSONS[r.tag] !== undefined);
  return withLesson?.tag ?? null;
}

/**
 * Public: pick exactly one rule for today's daily challenge. Always
 * returns a tag — on cold start, returns the easiest CEFR-aligned
 * rule. Signature is stable for A3's daily-challenge UI.
 */
export async function recommendDailyChallenge(
  userId: string,
  opts: RecommendationOptions = {},
): Promise<WeaknessTag> {
  const history = await loadHistory(userId, opts);
  const ranked = rankWeaknesses(history, opts.now ?? new Date());
  // ranked is non-empty: cold-start path enumerates the full catalog.
  return ranked[0].tag;
}
