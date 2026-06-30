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

import {
  TARGET_META,
  type NativeLang,
  type TargetLang,
} from "@/lib/onboarding/types";

// A13-circle-8: this module is now the pure language-pair surface
// (types + parseLanguagePair + withPrimary). The previous `usePairMutation`
// React hook lived here and brought in `useAuth` from AuthProvider,
// which closed a 3-hop cycle with anonymousPair.ts. The hook moved
// to ./usePairMutation.ts; that file imports from here, and the cycle
// is broken because this module no longer imports AuthProvider.

const NATIVE_VALUES: NativeLang[] = ["vi", "en", "ja", "id", "th", "ar", "hi", "ur", "ko", "zh", "pt", "tr", "es", "fr", "de", "ru", "pa", "sw"];
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

// `usePairMutation` lives in ./usePairMutation.ts (A13-circle-8).
// It's a React hook consuming `useAuth` + `supabase` + `useQueryClient`;
// keeping it out of this pure module is what allows anonymousPair.ts
// to safely import from here without closing the 3-hop cycle through
// AuthProvider.
