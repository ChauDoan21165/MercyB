// src/hooks/useFocusAreas.ts
//
// Loads the user's placement weakness tags for the Home focus-areas
// card. Returns a tagged state so the card can render three UX states:
//
//   - "loading"          spinner / nothing yet
//   - "no_placement"     user hasn't taken the placement test
//   - "no_weaknesses"    placement done, balanced profile (positive state)
//   - "weaknesses"       placement done, surface top entries
//
// Persistence model (decided in Phase 1 audit, hybrid per Chau's D1):
//
//   Primary CACHE: profiles.placement_weaknesses (JSONB array).
//     NULL     → user has not completed placement yet
//     []       → placement done, no flags (balanced)
//     [tags]   → placement done, show them
//
//   Fallback SOURCE OF TRUTH: mb_user_weakness_profile rows
//     (select key_pattern by severity_score desc limit 3).
//     Used if the cache is missing/errors (e.g. CC3 hasn't shipped
//     the column yet) OR is empty while the source table has rows
//     (data drift).
//
// The profiles.placement_weaknesses column does not yet exist on main
// (CC3 ships it in Step D). This hook queries it via an untyped select
// so TypeScript doesn't regress against the generated `types.ts`. When
// CC3 adds the column, this code lights up automatically — no change
// required here. See README or Phase 1 audit for details.

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import {
  resolveWeaknessTags,
  type WeaknessEntry,
} from "@/lib/weakness/weakness-catalog";

export type FocusAreasState =
  | { status: "loading" }
  | { status: "no_placement" }
  | { status: "no_weaknesses" }
  | { status: "weaknesses"; entries: WeaknessEntry[] };

export type UseFocusAreasResult = FocusAreasState & {
  /** Max entries returned in the `weaknesses` state. */
  limit: number;
  /** Manually re-run the load (e.g. after taking the test in the same session). */
  refresh: () => void;
};

type CacheRow = { placement_weaknesses: unknown } | null;
type ProfileRowResult = {
  data: CacheRow;
  error: { message: string } | null;
};

/**
 * Load the cache column from profiles. Queried untyped because the
 * column is not yet present in the generated Supabase types. Any error
 * (missing column, RLS, network) resolves to `null` so the caller can
 * fall back to the source-of-truth table.
 */
async function loadCache(userId: string): Promise<string[] | null> {
  try {
    // Untyped selector — `any` scoped to this single call.
    const result: ProfileRowResult = await (
      supabase.from("profiles") as unknown as {
        select: (cols: string) => {
          eq: (col: string, val: string) => {
            maybeSingle: () => Promise<ProfileRowResult>;
          };
        };
      }
    )
      .select("placement_weaknesses")
      .eq("id", userId)
      .maybeSingle();

    if (result.error) return null;
    const raw = result.data?.placement_weaknesses;
    if (raw === null || raw === undefined) return null;
    if (!Array.isArray(raw)) return null;
    // JSONB columns may contain non-string entries if a writer
    // misbehaves; filter defensively.
    return raw.filter((x): x is string => typeof x === "string");
  } catch {
    return null;
  }
}

/**
 * Load up to `limit` weakness tags from mb_user_weakness_profile,
 * ordered by severity descending (nulls last). Returns `null` if the
 * query itself fails (RLS, network, table missing); returns [] if the
 * user simply has no rows.
 */
async function loadSourceOfTruth(
  userId: string,
  limit: number,
): Promise<string[] | null> {
  try {
    const { data, error } = await supabase
      .from("mb_user_weakness_profile")
      .select("key_pattern, severity_score")
      .eq("user_id", userId)
      .order("severity_score", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) return null;
    if (!data) return [];
    return data
      .map((row) => row.key_pattern)
      .filter((k): k is string => typeof k === "string" && k.length > 0);
  } catch {
    return null;
  }
}

export function useFocusAreas(limit = 3): UseFocusAreasResult {
  const { user, isLoading: authLoading } = useAuth();
  const [state, setState] = useState<FocusAreasState>({ status: "loading" });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Gate on auth. Anonymous users: "no_placement" — they can still
    // see the empty-state CTA on Home.
    if (authLoading) {
      setState({ status: "loading" });
      return;
    }
    if (!user?.id) {
      setState({ status: "no_placement" });
      return;
    }

    const userId = user.id;
    let cancelled = false;

    (async () => {
      setState({ status: "loading" });

      const cache = await loadCache(userId);

      // Race-guard: later refresh() or unmount
      if (cancelled) return;

      // Cache hit — non-empty array means weaknesses
      if (cache && cache.length > 0) {
        const entries = resolveWeaknessTags(cache).slice(0, limit);
        if (entries.length > 0) {
          setState({ status: "weaknesses", entries });
          return;
        }
        // All tags unknown (catalog drift): fall through to source of truth
      }

      // Cache hit but empty array → placement done, no flags
      if (cache !== null && Array.isArray(cache) && cache.length === 0) {
        setState({ status: "no_weaknesses" });
        return;
      }

      // Cache miss (null — column absent, RLS, or never populated) → try source
      const source = await loadSourceOfTruth(userId, limit);
      if (cancelled) return;

      if (source === null) {
        // Query failed. Conservative: treat as no placement so we don't
        // show stale/phantom weaknesses. User can still access the empty-
        // state CTA to (re)take the test.
        setState({ status: "no_placement" });
        return;
      }

      if (source.length === 0) {
        // Source table has no rows. Without a dedicated "placement_cefr"
        // column to confirm completion, we cannot distinguish "placement
        // done with zero flags" from "placement never taken" at this
        // layer. Default to no_placement until CC3 provides a completion
        // signal. This is the safer default — prompts user to take the
        // test rather than showing a potentially wrong "balanced" badge.
        setState({ status: "no_placement" });
        return;
      }

      const entries = resolveWeaknessTags(source).slice(0, limit);
      if (entries.length === 0) {
        setState({ status: "no_placement" });
        return;
      }
      setState({ status: "weaknesses", entries });
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user?.id, limit, refreshKey]);

  return useMemo<UseFocusAreasResult>(
    () => ({
      ...state,
      limit,
      refresh: () => setRefreshKey((n) => n + 1),
    }),
    [state, limit],
  );
}
