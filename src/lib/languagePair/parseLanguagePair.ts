// src/lib/languagePair/parseLanguagePair.ts
//
// Pure parser + value-type helpers for the (native, target) language
// pair on `public.profiles`. Extracted from `languagePair.ts` to break
// the 3-hop `anonymousPair → languagePair → AuthProvider → anonymousPair`
// cycle (A13 cycle #8).
//
// The cycle existed because `anonymousPair.ts` only needs the pure
// `parseLanguagePair` function — no React, no auth, no hooks — yet
// it had to import from `languagePair.ts`, which also re-exports a
// React hook (`usePairMutation`) that depends on `useAuth()` from
// `AuthProvider.tsx`. `AuthProvider.tsx` in turn imports
// `readAnonymousPair` / `clearAnonymousPair` from `anonymousPair.ts`,
// closing the loop.
//
// This leaf module:
//   - has ZERO React / auth / hook dependencies
//   - imports only types + constants from `@/lib/onboarding/types`
//   - is safe to re-import from anywhere (no transitive coupling)
//
// `languagePair.ts` re-exports `parseLanguagePair` + `LanguagePair`
// from here, so existing callers (Home, LanguagePairSettings, tests)
// continue to import from the historical path with zero diff.

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
