// src/lib/i18n/chromeLanguage.ts
//
// CHROME LANGUAGE — the language the UI *chrome* (navigation, buttons,
// headers, subtitles, page/section labels, settings menus) renders in.
// It follows the learner's NATIVE-language choice (vi | en): a vi-native
// sees Vietnamese-only chrome, an en-native English-only chrome — never
// bilingual side-by-side once the pair is chosen.
//
// WHY A HOOK, NOT A NEW CONTEXT OR i18n LIBRARY:
//   - The native choice is already a reactive single source of truth:
//     NativeLanguageContext (mounted in main.tsx, seeded from the
//     `mercyblade.nativeLang` localStorage cache, hydrated from
//     `profiles.native_language` by the Duolingo-onboarding PRs).
//   - String selection already has one canonical implementation:
//     getNativeContent() in src/components/languages/nativeContent.ts.
//   This module is the thin chrome-facing read of that same axis, so
//   chrome language and pedagogy language can never silently drift, and
//   no new dependency is introduced.
//
// SCOPE: chrome only. Lesson content, content-card descriptions, the
// brand hero, character names/dialogue, and audio are NOT chrome and do
// not flow through here.
//
// ONBOARDING NOTE: inside the onboarding flow the just-picked native
// lives in local draft state, not the context (OnboardingPage does not
// call setNativeLang). Those screens pass the draft value explicitly to
// the pure pickChrome() helper instead of using the hook. Every
// post-onboarding surface reads the persisted value via the hook.

import { useNativeLanguage } from "@/contexts/NativeLanguageContext";
import {
  getNativeContent,
  type NativeLang,
} from "@/components/languages/nativeContent";

export type { NativeLang };

/** A chrome string authored in both UI languages. Unlike pedagogy
 *  slots, BOTH are required — every chrome string has a vi and an en
 *  authored form, so the signature forbids accidental one-sided copy. */
export interface ChromeSlots {
  vi: string;
  en: string;
}

/**
 * Pure: pick the chrome string for `lang`. Delegates to the existing
 * native-content selection semantics so chrome and lesson pedagogy use
 * one selection rule. Both slots are required, so the `?? other` fallback
 * inside getNativeContent never fires here — it always returns a string.
 */
export function pickChrome(slots: ChromeSlots, lang: NativeLang): string {
  return getNativeContent(slots, lang) as string;
}

/** The current chrome language, reactive to the learner's persisted
 *  native-language choice. Must be called inside NativeLanguageProvider
 *  (true for every routed surface — see main.tsx). */
export function useChromeLanguage(): NativeLang {
  return useNativeLanguage().nativeLang;
}

/** Bound picker for render code: `const t = useChromeT(); t({ vi, en })`
 *  → the string in the current chrome language. */
export function useChromeT(): (slots: ChromeSlots) => string {
  const lang = useChromeLanguage();
  return (slots: ChromeSlots) => pickChrome(slots, lang);
}
