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
import { type NativeLang, type TargetLang } from "@/lib/onboarding/types";

// `parseLanguagePair` + the `LanguagePair` interface live in
// ./parseLanguagePair so they can be imported by `anonymousPair.ts`
// without dragging in the React/auth dependencies this module has
// (A13 cycle #8: broke the anonymousPair → languagePair → AuthProvider
// → anonymousPair 3-hop cycle). Re-exported here for backward-compat
// with existing callers (Home, LanguagePairSettings, tests) so their
// import paths stay byte-identical.
export {
  parseLanguagePair,
  type LanguagePair,
} from "./parseLanguagePair";

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
