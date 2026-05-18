// src/lib/languagePair/anonymousPair.ts
//
// localStorage-backed (native, target) language pair for ANONYMOUS
// visitors — the people who land on mercyblade.com before signing up.
//
// The Duolingo-style picker (OnboardingPage) is the entry point for an
// anonymous visitor (locked #14 — Chau-confirmed doctrine). They have no
// profiles row, so the pair can't live in Supabase yet. It lives here
// instead, so:
//   - a returning anonymous visitor skips the picker (AppRouter `/` gate)
//   - Home renders the right surface for their pair (Home.tsx)
//   - if they sign up later, the pair is read back and written to their
//     profile (Phase 3 / PR 3 — one-time sync, no re-picking)
//
// Parsing/validation is delegated to parseLanguagePair (the single
// owner of pair parsing — one-owner-per-function), so an unknown or
// tampered code is silently ignored, never crashes Home.
//
// We also mirror the native code into `mercyblade.nativeLang`
// (NativeLanguageContext's cache key) so the pedagogy-axis context
// hydrates for anonymous users with no extra wiring — same defensive
// try/catch + SSR guards that context uses.

import { parseLanguagePair } from "@/lib/languagePair/languagePair";
import type { NativeLang, TargetLang } from "@/lib/onboarding/types";

/** JSON blob: {"native":"vi","targets":["en","ja"]}. */
const PAIR_KEY = "mercyblade.languagePair";
/** Mirror — kept byte-compatible with NativeLanguageContext's cache. */
const NATIVE_MIRROR_KEY = "mercyblade.nativeLang";

export interface AnonymousPair {
  native: NativeLang;
  /** Ordered, deduped, valid codes. Index 0 = primary. */
  targets: TargetLang[];
}

/**
 * Read + validate the stored anonymous pair. Returns null when nothing
 * is stored, storage is unavailable, the blob is malformed, or it
 * carries no valid native — i.e. "this visitor still owes the picker".
 */
export function readAnonymousPair(): AnonymousPair | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(PAIR_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const blob = (parsed ?? {}) as {
    native?: unknown;
    targets?: unknown;
  };
  // Reuse the canonical parser: it tolerates NULLs / non-arrays /
  // unknown codes and returns clean, validated, deduped values.
  const pair = parseLanguagePair({
    native_language: blob.native,
    target_languages: blob.targets,
  });
  if (!pair.nativeLanguage) return null;
  return { native: pair.nativeLanguage, targets: pair.targets };
}

/** True when a returning anonymous visitor already picked a pair. */
export function hasAnonymousPair(): boolean {
  return readAnonymousPair() !== null;
}

/**
 * Persist the picked pair for an anonymous visitor. Native must be
 * valid; targets are stored as-is (parseLanguagePair re-validates on
 * read, so a future bad code can never poison Home). Storage failures
 * (private mode / quota) are swallowed — the session still works
 * in-memory, the user is just asked again next cold load.
 */
export function writeAnonymousPair(
  native: NativeLang,
  targets: TargetLang[],
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      PAIR_KEY,
      JSON.stringify({ native, targets }),
    );
    // Keep the pedagogy-axis context's cache in sync (no auth needed).
    window.localStorage.setItem(NATIVE_MIRROR_KEY, native);
  } catch {
    // ignore — see doc above
  }
}

/**
 * Forget the stored pair so the next visit to `/` shows the picker
 * again. The "Đổi ngôn ngữ / Change language" re-entry point (PR 2)
 * calls this. Native mirror is cleared too so the picker starts clean.
 */
export function clearAnonymousPair(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PAIR_KEY);
    window.localStorage.removeItem(NATIVE_MIRROR_KEY);
  } catch {
    // ignore
  }
}
