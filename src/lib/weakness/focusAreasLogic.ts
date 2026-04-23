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
