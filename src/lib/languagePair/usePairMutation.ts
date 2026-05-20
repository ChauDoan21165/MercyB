// src/lib/languagePair/usePairMutation.ts
//
// React hook for persisting language-pair edits to public.profiles.
// Extracted from src/lib/languagePair/languagePair.ts in A13-circle-8
// to break the 3-hop cycle:
//
//   src/providers/AuthProvider.tsx
//     → src/lib/languagePair/anonymousPair.ts          (readAnonymousPair, clearAnonymousPair)
//   src/lib/languagePair/anonymousPair.ts
//     → src/lib/languagePair/languagePair.ts           (parseLanguagePair — pure)
//   src/lib/languagePair/languagePair.ts
//     → src/providers/AuthProvider.tsx (useAuth)       ← closing edge
//
// After the split:
//   AuthProvider          → anonymousPair               (unchanged)
//   anonymousPair         → languagePair (pure module)  (unchanged; parseLanguagePair still lives there)
//   THIS FILE             → AuthProvider + languagePair (one-way; was the cycle vertex)
//   AuthProvider does NOT import this file              ← cycle broken
//
// The hook signature is preserved verbatim — every existing consumer
// (`const { persist } = usePairMutation()`) continues to work after
// updating only the import path.

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { qk } from "@/lib/queries/keys";
import type { PairPatch } from "./languagePair";

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
