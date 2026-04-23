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
// Persistence model (post CC3's migration a90e33c9, April 2026):
//
//   Primary CACHE: profiles row with TWO columns:
//     - `placement_completed_at timestamptz` — nullable, no default.
//       NULL  → user has NEVER taken the placement test.
//       value → completion timestamp; placement_weaknesses is authoritative.
//     - `placement_weaknesses jsonb DEFAULT '[]'::jsonb` — always
//       present on every profile. Only meaningful AFTER completed_at
//       is set.
//
//   The two together disambiguate all three states:
//     completed_at IS NULL                          → no_placement
//     completed_at IS NOT NULL AND weaknesses = []  → no_weaknesses
//     completed_at IS NOT NULL AND weaknesses ≠ []  → weaknesses
//
//   Fallback SOURCE OF TRUTH: mb_user_weakness_profile rows
//     (select key_pattern by severity_score desc limit 3). Used only
//     if the cache query itself errors (RLS, network). The fallback
//     cannot distinguish "taken with zero flags" from "never taken"
//     — so it defaults to no_placement on empty. Safer than showing
//     a wrong "balanced" badge.
//
// The two profiles columns are present in the production DB per CC3's
// migration but have not been added to src/integrations/supabase/types.ts
// yet. The query below uses an untyped select so this file keeps
// building against the current generated types. When types are
// regenerated, nothing here needs to change.
//
// The pure decision logic lives in src/lib/weakness/focusAreasLogic.ts
// so it can be unit-tested without a live Supabase client.

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import {
  deriveStateFromCache,
  deriveStateFromSource,
  type CacheResult,
  type FocusAreasState,
  type SourceResult,
} from "@/lib/weakness/focusAreasLogic";

export type { FocusAreasState } from "@/lib/weakness/focusAreasLogic";

export type UseFocusAreasResult = FocusAreasState & {
  /** Max entries returned in the `weaknesses` state. */
  limit: number;
  /** Manually re-run the load (e.g. after taking the test in the same session). */
  refresh: () => void;
};

// ── Supabase I/O ────────────────────────────────────────────────────────────

type ProfileCacheRow = {
  placement_completed_at: unknown;
  placement_weaknesses: unknown;
} | null;

type ProfileCacheQueryResult = {
  data: ProfileCacheRow;
  error: { message: string } | null;
};

async function loadCache(userId: string): Promise<CacheResult> {
  try {
    const result: ProfileCacheQueryResult = await (
      supabase.from("profiles") as unknown as {
        select: (cols: string) => {
          eq: (col: string, val: string) => {
            maybeSingle: () => Promise<ProfileCacheQueryResult>;
          };
        };
      }
    )
      .select("placement_completed_at, placement_weaknesses")
      .eq("id", userId)
      .maybeSingle();

    if (result.error) return { kind: "error" };
    const row = result.data;
    if (!row) {
      // No profile row at all — treat as never-completed.
      return { kind: "ok", completedAt: null, tags: [] };
    }

    const rawCompletedAt = row.placement_completed_at;
    const completedAt =
      typeof rawCompletedAt === "string" && rawCompletedAt.length > 0
        ? rawCompletedAt
        : null;

    const rawTags = row.placement_weaknesses;
    const tags = Array.isArray(rawTags)
      ? rawTags.filter((x): x is string => typeof x === "string")
      : [];

    return { kind: "ok", completedAt, tags };
  } catch {
    return { kind: "error" };
  }
}

async function loadSourceOfTruth(
  userId: string,
  limit: number,
): Promise<SourceResult> {
  try {
    const { data, error } = await supabase
      .from("mb_user_weakness_profile")
      .select("key_pattern, severity_score")
      .eq("user_id", userId)
      .order("severity_score", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) return { kind: "error" };
    const tags = (data ?? [])
      .map((row) => row.key_pattern)
      .filter((k): k is string => typeof k === "string" && k.length > 0);
    return { kind: "ok", tags };
  } catch {
    return { kind: "error" };
  }
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useFocusAreas(limit = 3): UseFocusAreasResult {
  const { user, isLoading: authLoading } = useAuth();
  const [state, setState] = useState<FocusAreasState>({ status: "loading" });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
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
      if (cancelled) return;

      const cacheVerdict = deriveStateFromCache(cache, limit);
      if (cacheVerdict !== "use_source") {
        setState(cacheVerdict);
        return;
      }

      const source = await loadSourceOfTruth(userId, limit);
      if (cancelled) return;
      setState(deriveStateFromSource(source, limit));
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
