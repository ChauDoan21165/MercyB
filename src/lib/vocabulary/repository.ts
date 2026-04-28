// Supabase data access for the vocabulary SRS.
//
// All queries are RLS-gated to the calling user — we never pass
// `user_id` filters explicitly here, the auth session does that for us.
// Keep the repository thin: the SRS math lives in `./sm2.ts`, the UI
// lives under `src/pages/vocabulary/`. This module is only the bridge.

import { supabase } from "@/lib/supabaseClient";

import {
  applyReview,
  clampEase,
  type CardState,
  type Rating,
} from "./sm2";

export type VocabularyEntry = {
  id: string;
  user_id: string;
  word: string;
  ipa: string | null;
  definition_vi: string;
  definition_en: string;
  example_sentence: string | null;
  source: string | null;
  repetitions: number;
  interval_days: number;
  ease: number;
  last_rating: number | null;
  next_review_at: string;
  created_at: string;
  updated_at: string;
};

export type DueQueueEntry = VocabularyEntry;

const SELECT_COLS =
  "id, user_id, word, ipa, definition_vi, definition_en, example_sentence, source, repetitions, interval_days, ease, last_rating, next_review_at, created_at, updated_at";

// ── Reads ───────────────────────────────────────────────────────────────

/**
 * Words whose next_review_at has passed. RLS scopes to current user;
 * we sort oldest-due first so the queue surfaces stalest cards.
 */
export async function fetchDueQueue(nowIso: string = new Date().toISOString()): Promise<DueQueueEntry[]> {
  const { data, error } = await supabase
    .from("user_vocabulary")
    .select(SELECT_COLS)
    .lte("next_review_at" as never, nowIso)
    .order("next_review_at" as never, { ascending: true })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as VocabularyEntry[];
}

/** Count alone — drives the Home badge without paying for full rows. */
export async function fetchDueCount(nowIso: string = new Date().toISOString()): Promise<number> {
  const { count, error } = await supabase
    .from("user_vocabulary")
    .select("id", { count: "exact", head: true })
    .lte("next_review_at" as never, nowIso);
  if (error) throw error;
  return count ?? 0;
}

/** Full library — used by the /vocabulary page. */
export async function fetchAllVocabulary(): Promise<VocabularyEntry[]> {
  const { data, error } = await supabase
    .from("user_vocabulary")
    .select(SELECT_COLS)
    .order("created_at" as never, { ascending: false })
    .limit(2000);
  if (error) throw error;
  return (data ?? []) as VocabularyEntry[];
}

/**
 * Soonest scheduled review for the user. Used after the queue empties
 * so we can tell the learner "next review in X hours" instead of just
 * "all done — check back later."
 */
export async function fetchNextScheduledAt(): Promise<string | null> {
  const { data, error } = await supabase
    .from("user_vocabulary")
    .select("next_review_at")
    .order("next_review_at" as never, { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as { next_review_at?: string } | null)?.next_review_at ?? null;
}

// ── Writes ──────────────────────────────────────────────────────────────

/**
 * Apply one review rating to a card and persist both the new state AND
 * an audit row in `review_log`. Two writes are sequential; on RLS / FK
 * error from the log insert, the user_vocabulary update has already
 * landed — we treat that as acceptable degradation (next review is
 * scheduled correctly, audit is best-effort).
 */
export async function recordReview(args: {
  entry: VocabularyEntry;
  rating: Rating;
  nowMs?: number;
}): Promise<VocabularyEntry> {
  const nowMs = args.nowMs ?? Date.now();
  const beforeState: CardState = {
    repetitions: args.entry.repetitions,
    interval_days: args.entry.interval_days,
    ease: clampEase(args.entry.ease),
    next_review_at: new Date(args.entry.next_review_at).getTime(),
  };
  const after = applyReview(beforeState, args.rating, nowMs);

  const nextRow: Partial<VocabularyEntry> = {
    repetitions: after.repetitions,
    interval_days: after.interval_days,
    ease: clampEase(after.ease),
    last_rating: args.rating,
    next_review_at: new Date(after.next_review_at).toISOString(),
  };

  const { data, error } = await supabase
    .from("user_vocabulary")
    .update(nextRow)
    .eq("id", args.entry.id)
    .select(SELECT_COLS)
    .single();
  if (error) throw error;

  // Best-effort audit. We don't surface log-insert errors back to the
  // UI — the review itself is the user-facing action.
  try {
    await supabase.from("review_log").insert({
      user_id: args.entry.user_id,
      vocabulary_id: args.entry.id,
      rating: args.rating,
      prev_repetitions: args.entry.repetitions,
      new_repetitions: after.repetitions,
      prev_interval_days: args.entry.interval_days,
      new_interval_days: after.interval_days,
      prev_ease: args.entry.ease,
      new_ease: clampEase(after.ease),
    });
  } catch (err) {
    console.warn("[vocabulary] review_log insert failed:", err);
  }

  return data as VocabularyEntry;
}

// ── Library bucketing (pure, exported for tests + Library page) ─────────

export type LibraryBucket = "due_now" | "coming_up" | "mastered";

/**
 * Bucket rule:
 *   due_now    → next_review_at <= now
 *   mastered   → repetitions >= 8 AND interval_days >= 30
 *   coming_up  → otherwise
 *
 * "due_now" wins over "mastered": even a mastered card that's slipped
 * past its review needs to be surfaced.
 */
export function bucketFor(entry: VocabularyEntry, nowMs: number): LibraryBucket {
  const due = new Date(entry.next_review_at).getTime();
  if (due <= nowMs) return "due_now";
  if (entry.repetitions >= 8 && entry.interval_days >= 30) return "mastered";
  return "coming_up";
}

/** Days until the next review, rounded up. Used for Library copy. */
export function daysUntil(entry: VocabularyEntry, nowMs: number): number {
  const due = new Date(entry.next_review_at).getTime();
  if (due <= nowMs) return 0;
  return Math.max(1, Math.ceil((due - nowMs) / (24 * 60 * 60 * 1000)));
}
