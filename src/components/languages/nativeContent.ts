// src/components/languages/nativeContent.ts
//
// The native-language selection seam (Phase 2 / Option C — see
// RECON-schema-generalize.md §3-§4).
//
// WHY THIS EXISTS: lesson pedagogy prose (cultural notes, tips, intros,
// register notes, roleplay prompts, glosses, idioms) is authored per the
// learner's *native* language — "which L1 the learner thinks in". That is a
// distinct axis from the UI-chrome language, even though both happen to be
// "vi"|"en" today and most users keep them aligned. Currently the renderer
// conflates them through pick(uiLanguage,…). This module is the single seam
// that decouples them: every pedagogy selection routes through
// getNativeContent(), so the eventual N-native-language migration (Option B
// — a per-language Record field shape) becomes a localized change *inside
// this file* with zero caller churn.
//
// FORWARD-COMPAT: NativeLang is exactly the two values the data carries
// today; NativeSlots is a record (not positional args) on purpose — Option
// B widens the union and adds slots ("ko", "ja", …) while every call site
// stays unchanged.

/** The learner's native language ("which L1 they think in"). Two values
 *  today; Option B widens this union. */
export type NativeLang = "vi" | "en";

/**
 * Per-native-language content slots for one pedagogy field. Today exactly
 * `vi` + `en` (the only authored audiences). Option B adds `ko`, `ja`, … —
 * callers are unaffected because they construct/read a record, not
 * positional arguments.
 */
export type NativeSlots<T> = {
  vi?: T;
  en?: T;
};

/**
 * Pick the slot matching the learner's native language; fall back to the
 * other authored slot when the preferred one is missing. Returns
 * `undefined` only when no slot has content.
 *
 * Semantics are deliberately byte-identical to the legacy
 * `pick(uiLanguage, en, vi)` in LessonRenderer.tsx (`uiLang === "en" ? en
 * ?? vi : vi ?? en`). This is what lets PR-A2's repoint be provably
 * behavior-preserving while `nativeLang` resolves to "vi" (the old
 * default).
 */
export function getNativeContent<T>(
  slots: NativeSlots<T>,
  nativeLang: NativeLang,
): T | undefined {
  return nativeLang === "en" ? slots.en ?? slots.vi : slots.vi ?? slots.en;
}

/**
 * True when the value `getNativeContent` would return came from a
 * non-native slot — i.e. the learner's native copy was missing and we fell
 * back. Drives the fallback badge. Mirrors the legacy
 * `isFallback(uiLanguage, en, vi)`.
 */
export function isNativeFallback<T>(
  slots: NativeSlots<T>,
  nativeLang: NativeLang,
): boolean {
  return nativeLang === "en"
    ? !slots.en && !!slots.vi
    : !slots.vi && !!slots.en;
}
