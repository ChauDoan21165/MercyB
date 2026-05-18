// src/lib/languagePair/languagePair.ts
//
// Shared read/write helpers for the (native, target) language pair on
// public.profiles. Used by the Home pair-aware rendering, the
// multi-target switcher, and the Settings language-pair panel so all
// three agree on parsing + persistence.
//
// The pair columns (native_language, target_languages) were added by
// migration 20260615000000 and are user-writable by the browser
// `authenticated` role — verified in PR 1: they are NOT among the 13
// columns the #578 freeze trigger reverts, and the table-level grant
// already covers them.

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { qk } from "@/lib/queries/keys";
import {
  TARGET_META,
  type NativeLang,
  type TargetLang,
} from "@/lib/onboarding/types";

const NATIVE_VALUES: NativeLang[] = ["vi", "en"];
const TARGET_VALUES = Object.keys(TARGET_META) as TargetLang[];

function isNativeLang(v: unknown): v is NativeLang {
  return typeof v === "string" && (NATIVE_VALUES as string[]).includes(v);
}

function isTargetLang(v: unknown): v is TargetLang {
  return typeof v === "string" && (TARGET_VALUES as string[]).includes(v);
}

export interface LanguagePair {
  /** null until pair-selection onboarding completes. */
  nativeLanguage: NativeLang | null;
  /** Ordered; deduped; only valid codes. May be empty. */
  targets: TargetLang[];
  /** First target = the one Home routes into. null when none. */
  primaryTarget: TargetLang | null;
}

/**
 * Parse the pair off a raw profiles row (the shape useProfileQuery
 * returns). Defensive: tolerates NULLs, non-arrays, and unknown codes
 * (forward-compatible if the column ever holds a code this build
 * doesn't know yet — it is simply ignored, never crashes Home).
 */
export function parseLanguagePair(row: unknown): LanguagePair {
  const r = (row ?? {}) as {
    native_language?: unknown;
    target_languages?: unknown;
  };
  const nativeLanguage = isNativeLang(r.native_language)
    ? r.native_language
    : null;
  const rawTargets = Array.isArray(r.target_languages)
    ? r.target_languages
    : [];
  const targets: TargetLang[] = [];
  for (const t of rawTargets) {
    if (isTargetLang(t) && !targets.includes(t)) targets.push(t);
  }
  return {
    nativeLanguage,
    targets,
    primaryTarget: targets[0] ?? null,
  };
}

/** Move `target` to index 0 (primary), preserving the rest of the
 *  order. No-op if it isn't in the list. */
export function withPrimary(
  targets: TargetLang[],
  target: TargetLang,
): TargetLang[] {
  if (!targets.includes(target)) return targets;
  return [target, ...targets.filter((t) => t !== target)];
}

export interface PairPatch {
  native_language?: NativeLang;
  target_languages?: TargetLang[];
}

/**
 * Persist a partial pair update to the current user's profile and
 * refresh the shared profile cache so every reader (Home gate, Home
 * rendering, switcher, settings) re-renders consistently. Failures are
 * surfaced via the boolean result (callers show inline feedback) and
 * dev-warned — they never throw, so a network blip can't break
 * Settings or trap the user.
 */
export function usePairMutation() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const persist = useCallback(
    async (patch: PairPatch): Promise<{ ok: boolean }> => {
      if (!user?.id) return { ok: false };
      const { error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", user.id);
      if (error) {
        if (import.meta.env.DEV) {
          console.warn("[languagePair] update failed:", error.message);
        }
        return { ok: false };
      }
      await qc.invalidateQueries({ queryKey: qk.profile(user.id) });
      return { ok: true };
    },
    // Whole `user` (not user?.id) — React Compiler infers the object
    // as the dep; a narrower member expression breaks memo preservation.
    [user, qc],
  );

  return { persist };
}
