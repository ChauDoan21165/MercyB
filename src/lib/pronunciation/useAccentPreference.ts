// src/lib/pronunciation/useAccentPreference.ts
//
// Hook for the user's selected pronunciation-training accent.
// Storage strategy:
//   - localStorage `mb_preferred_accent` is the primary read. Synchronous,
//     survives reloads, available pre-auth.
//   - profiles.preferred_accent (Supabase) is the long-term store. We
//     write to both; on auth load we hydrate localStorage from the
//     profile row so multi-device settings stay consistent.
//   - Default 'us' for every code path that doesn't have a value yet —
//     matches the migration default + the brief constraint
//     "DO NOT change default for existing users".
//
// `setAccent` updates both stores. The Supabase write is fire-and-forget;
// if the user is signed out it just no-ops (localStorage remains the
// source of truth in that case).

import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";
import { useProfileQuery } from "@/lib/queries/useProfileQuery";
import {
  DEFAULT_ACCENT,
  normaliseAccent,
  type Accent,
} from "@/data/pronunciation/multiAccentReferences";

const LOCAL_STORAGE_KEY = "mb_preferred_accent";

function readLocalAccent(): Accent {
  if (typeof window === "undefined") return DEFAULT_ACCENT;
  try {
    return normaliseAccent(window.localStorage.getItem(LOCAL_STORAGE_KEY));
  } catch {
    return DEFAULT_ACCENT;
  }
}

function writeLocalAccent(accent: Accent): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, accent);
  } catch {
    /* private mode / quota — silently no-op */
  }
}

async function writeSupabaseAccent(userId: string, accent: Accent): Promise<void> {
  try {
    await supabase
      .from("profiles")
      .update({ preferred_accent: accent })
      .eq("id", userId);
  } catch {
    /* surface elsewhere if it matters; this hook stays optimistic */
  }
}

export type UseAccentPreference = {
  accent: Accent;
  setAccent: (next: Accent) => void;
  /** Whether the hook has finished hydrating from Supabase (best-effort). */
  ready: boolean;
};

/**
 * Hydration order:
 *   1. Read localStorage synchronously → initial accent (avoids flash).
 *   2. After mount, fetch the Supabase profile asynchronously. If it
 *      disagrees with localStorage, profile wins (multi-device
 *      consistency) and we re-cache locally.
 *   3. setAccent updates both stores immediately.
 */
export function useAccentPreference(userId?: string | null): UseAccentPreference {
  const [accent, setAccentState] = useState<Accent>(() => readLocalAccent());
  const [ready, setReady] = useState(false);

  const { data: profileRow, isFetched } = useProfileQuery(userId ?? null);

  useEffect(() => {
    if (!userId) {
      setReady(true);
      return;
    }
    if (!isFetched) return;
    const raw =
      (profileRow as { preferred_accent?: string | null } | null | undefined)
        ?.preferred_accent ?? null;
    const remote = raw ? normaliseAccent(raw) : null;
    if (remote && remote !== accent) {
      writeLocalAccent(remote);
      setAccentState(remote);
    }
    setReady(true);
    // Only react to userId / fetch completion. Re-running on every accent
    // change would clobber an in-flight local update with a stale remote
    // value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isFetched, profileRow]);

  const setAccent = useCallback(
    (next: Accent) => {
      const safe = normaliseAccent(next);
      setAccentState(safe);
      writeLocalAccent(safe);
      if (userId) {
        void writeSupabaseAccent(userId, safe);
      }
    },
    [userId],
  );

  return { accent, setAccent, ready };
}
