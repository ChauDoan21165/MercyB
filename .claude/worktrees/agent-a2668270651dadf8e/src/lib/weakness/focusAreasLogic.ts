// src/lib/weakness/focusAreasLogic.ts
//
// Pure decision functions for the focus-areas card. Extracted from
// useFocusAreas so they can be unit-tested without loading the
// Supabase client (which requires VITE_SUPABASE_URL at import time).
//
// State machine — see header of useFocusAreas.ts for the full
// persistence model and three-state UX.

import { resolveWeaknessTags, type WeaknessEntry } from "./weakness-catalog";

export type FocusAreasState =
  | { status: "loading" }
  | { status: "no_placement" }
  | { status: "no_weaknesses" }
  | { status: "weaknesses"; entries: WeaknessEntry[] };

export type CacheResult =
  | { kind: "error" }
  | { kind: "ok"; completedAt: string | null; tags: string[] };

export type SourceResult =
  | { kind: "error" }
  | { kind: "ok"; tags: string[] };

/**
 * Given a cache query result, returns the final FocusAreasState OR
 * the sentinel `"use_source"` meaning "cache didn't give an answer,
 * try the fallback source-of-truth table."
 *
 * Authoritative when the cache query succeeded: completedAt drives
 * the trichotomy — null = no_placement; non-null + empty = balanced;
 * non-null + tags = weaknesses. Only falls back on query error or
 * on catalog drift where all stored tags are unknown.
 */
export function deriveStateFromCache(
  cache: CacheResult,
  limit: number,
): FocusAreasState | "use_source" {
  if (cache.kind === "error") return "use_source";

  if (cache.completedAt === null) {
    return { status: "no_placement" };
  }

  if (cache.tags.length === 0) {
    return { status: "no_weaknesses" };
  }

  const entries = resolveWeaknessTags(cache.tags).slice(0, limit);
  if (entries.length === 0) {
    // Cache had tags but NONE matched the local catalog — possible
    // drift between the engine and the UI catalog. Try the
    // source-of-truth table before declaring "no placement."
    return "use_source";
  }

  return { status: "weaknesses", entries };
}

/**
 * Given a source-of-truth query result (used only when cache errors),
 * returns the final FocusAreasState. Cannot produce `no_weaknesses`
 * because the source table has no completion signal — we default to
 * `no_placement` for both "query failed" and "no rows" so the UI
 * prompts the user to (re)take the test rather than showing a
 * potentially wrong "balanced" badge.
 */
export function deriveStateFromSource(
  source: SourceResult,
  limit: number,
): FocusAreasState {
  if (source.kind === "error") return { status: "no_placement" };
  if (source.tags.length === 0) return { status: "no_placement" };

  const entries = resolveWeaknessTags(source.tags).slice(0, limit);
  if (entries.length === 0) return { status: "no_placement" };

  return { status: "weaknesses", entries };
}

// ─── Pure history primitives (A4 — recommendation engine v2) ───────────────
//
// These small functions operate on a flat history shape so the recommendation
// engine and any future analytics layer can share a single source of truth.
// They do NOT touch Supabase. Tests must cover edge cases (empty history,
// unknown tags, never-seen rules) — see `recommendationEngine.test.ts`.

/**
 * One row of weakness signal for a single rule. Shape is intentionally
 * minimal so it can be hydrated cheaply from `mb_user_weakness_profile`
 * (frequency → errorCount, last_seen → lastSeenAt).
 */
export type AttemptRecord = {
  ruleTag: string;
  errorCount: number;
  lastSeenAt: string | null;
};

/**
 * Returns a map of tag → density (this rule's share of the user's total
 * errors, 0..1). Empty history → empty map. Tags absent from `records`
 * are absent from the result; callers should treat absence as density 0.
 */
export function computeWeaknessDensity(
  records: readonly AttemptRecord[],
): Map<string, number> {
  const out = new Map<string, number>();
  let total = 0;
  for (const r of records) total += Math.max(0, r.errorCount);
  if (total === 0) return out;
  for (const r of records) {
    const n = Math.max(0, r.errorCount);
    if (n === 0) continue;
    const prev = out.get(r.ruleTag) ?? 0;
    out.set(r.ruleTag, prev + n / total);
  }
  return out;
}

/**
 * Days elapsed since the most recent attempt of `ruleTag`. Returns
 * `Number.POSITIVE_INFINITY` when the rule has no recorded attempts —
 * callers should treat that as "never seen, no recency signal."
 */
export function timeSinceLastAttempt(
  records: readonly AttemptRecord[],
  ruleTag: string,
  now: Date = new Date(),
): number {
  let mostRecentMs: number | null = null;
  for (const r of records) {
    if (r.ruleTag !== ruleTag) continue;
    if (!r.lastSeenAt) continue;
    const t = Date.parse(r.lastSeenAt);
    if (Number.isNaN(t)) continue;
    if (mostRecentMs === null || t > mostRecentMs) mostRecentMs = t;
  }
  if (mostRecentMs === null) return Number.POSITIVE_INFINITY;
  const diffMs = now.getTime() - mostRecentMs;
  return Math.max(0, diffMs) / (1000 * 60 * 60 * 24);
}
