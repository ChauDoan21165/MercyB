// src/components/home/nativeCopy.ts
//
// SHARED ENGLISH-STUDY SURFACE NATIVE-COPY HELPER — accepts all 12
// NativeLang slots for every visible Home string and resolves via the
// existing nativeContent fallback chain (target → en → vi).
//
// USAGE
//   const nt = useHomeT(); // or pickHomeCopy(slots, effectiveNative)
//   <h1>{nt(TEACHER_MERCY_LABEL)}</h1>
//   <p>{nt({ en: "Hello", vi: "Xin chào", ja: "こんにちは", zh: "你好" })}</p>
//
// ARCHITECTURE
//   Same pattern as src/components/placement/nativeCopy.ts.
//   Vietnamese text renders only when nativeLang === "vi".
//   All other languages see their own slot or English fallback.

import { useNativeLanguage } from "@/contexts/NativeLanguageContext";
import { getNativeContent, type NativeLang } from "@/components/languages/nativeContent";

// Re-export for convenience
export type { NativeLang };

/**
 * All-language slot interface for Home surface copy.
 * Every field is optional; getNativeContent resolves via the fallback
 * chain (target → en → vi) so callers only need to supply the
 * languages they have translations for.
 */
export type HomeNativeSlots = Partial<Record<NativeLang, string>>;

// ── Pure helper ───────────────────────────────────────────────────────

/**
 * Resolve Home-native slots for a given language. Pure function —
 * no React dependency. Returns English fallback if no slot matches.
 */

const ROUTE_NATIVE_SLUGS: Record<string, NativeLang> = {
  english: "en",
  vietnamese: "vi",
  japanese: "ja",
  indonesian: "id",
  thai: "th",
  arabic: "ar",
  hindi: "hi",
  urdu: "ur",
  korean: "ko",
  chinese: "zh",
  portuguese: "pt",
  turkish: "tr",
};

function nativeLangFromCurrentLearnRoute(): NativeLang | null {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/^\/learn\/([^/]+)\/[^/]+(?:\/|$)/);
  if (!match) return null;
  return ROUTE_NATIVE_SLUGS[match[1]] ?? null;
}

export function pickHomeCopy(
  slots: HomeNativeSlots,
  lang: NativeLang,
): string {
  return getNativeContent(slots, lang) ?? slots.en ?? "";
}

// ── Hook ──────────────────────────────────────────────────────────────

/**
 * Hook returning a resolved function bound to the current chrome/native
 * language. Use inside NativeLanguageProvider.
 *
 *   const nt = useHomeT();
 *   <p>{nt({ en: "Hello", vi: "Xin chào", ja: "こんにちは" })}</p>
 */
export function useHomeT(nativeLangOverride?: NativeLang): (slots: HomeNativeSlots) => string {
  const { nativeLang } = useNativeLanguage();
  const routeNativeLang = nativeLangFromCurrentLearnRoute();
  const lang = nativeLangOverride ?? routeNativeLang ?? nativeLang;
  return (slots: HomeNativeSlots) => pickHomeCopy(slots, lang);
}
