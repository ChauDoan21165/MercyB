// src/components/placement/nativeCopy.ts
//
// SHARED PLACEMENT NATIVE-COPY HELPER — accepts all 12 NativeLang slots
// and resolves to the correct string via the existing nativeContent fallback
// chain (target → en → vi).  Vietnamese text renders only when nativeLang
// === "vi"; all other languages see their own slot or English fallback.
//
// USAGE
//   const t = usePlacementT(); // or usePlacementT(lang) for explicit lang
//   <h1>{t(COPY_HEADING)}</h1>

import { useNativeLanguage } from "@/contexts/NativeLanguageContext";
import { getNativeContent, type NativeLang } from "@/components/languages/nativeContent";

// Re-export for convenience
export type { NativeLang };

/**
 * All-language slot interface for placement copy.  Every field is optional;
 * getNativeContent resolves via the fallback chain (target → en → vi) so
 * callers only need to supply the languages they have translations for.
 */
export type PlacementNativeSlots = Partial<Record<NativeLang, string>>;

/**
 * Resolve placement-native slots for a given language.  Pure function —
 * no React dependency.  Returns English fallback if no slot matches.
 */
export function pickPlacementCopy(
  slots: PlacementNativeSlots,
  lang: NativeLang,
): string {
  return getNativeContent(slots, lang) ?? slots.en ?? "";
}

/**
 * Hook returning a resolved function bound to the current chrome/native
 * language.  Use inside NativeLanguageProvider.
 *
 *   const t = usePlacementT();
 *   <p>{t({ en: "Hello", vi: "Xin chào", ja: "こんにちは" })}</p>
 */
export function usePlacementT(): (slots: PlacementNativeSlots) => string {
  const { nativeLang } = useNativeLanguage();
  return (slots: PlacementNativeSlots) => pickPlacementCopy(slots, nativeLang);
}

/** Convenience: get the current language and resolve one slot set. */
export function usePlacementCopy(slots: PlacementNativeSlots): string {
  return usePlacementT()(slots);
}
