// src/components/languages/nativeContent.ts
//
// The native-language selection seam (Phase 2 / Option C — see
// RECON-schema-generalize.md §3-§4).
//
// WHY THIS EXISTS: lesson pedagogy prose (cultural notes, tips, intros,
// register notes, roleplay prompts, glosses, idioms) is authored per the
// learner's *native* language — "which L1 the learner thinks in". That is a
// distinct axis from the UI-chrome language.
//
// Japanese-native English pilot + Indonesian-native English schema:
// this seam now supports ja + id + th while preserving legacy vi/en behavior.
// English lesson content stays English; only the explanation/pedagogy
// slot changes.

export type NativeLang = "vi" | "en" | "ja" | "id" | "th";

export type NativeSlots<T> = {
  vi?: T;
  en?: T;
  ja?: T;
  id?: T;
  th?: T;
};

const FALLBACK_ORDER: Record<NativeLang, readonly NativeLang[]> = {
  vi: ["vi", "en"],
  en: ["en", "vi"],
  ja: ["ja", "en", "vi"],
  id: ["id", "en", "vi"],
  th: ["th", "en", "vi"],
};

export function getNativeContent<T>(
  slots: NativeSlots<T>,
  nativeLang: NativeLang,
): T | undefined {
  for (const lang of FALLBACK_ORDER[nativeLang]) {
    const value = slots[lang];
    if (value !== undefined) return value;
  }
  return undefined;
}

export function getNativeFallbackLanguage<T>(
  slots: NativeSlots<T>,
  nativeLang: NativeLang,
): NativeLang | null {
  for (const lang of FALLBACK_ORDER[nativeLang]) {
    const value = slots[lang];
    if (value) return lang === nativeLang ? null : lang;
  }
  return null;
}

export function isNativeFallback<T>(
  slots: NativeSlots<T>,
  nativeLang: NativeLang,
): boolean {
  return getNativeFallbackLanguage(slots, nativeLang) !== null;
}
