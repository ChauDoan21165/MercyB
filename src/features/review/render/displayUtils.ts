// src/features/review/render/displayUtils.ts — Lane D (D7)
//
// Per-language display utilities for the review card UI (D5/D6 consume these).
//
// PURE + framework-agnostic: string/data in, string out. No React, no DOM, no
// audio, no Supabase imports. The only import is the LanguageCode type from the
// module contract.
//
// Why per-language sizing matters: a Vietnamese learner reviews on a 375px
// phone. CJK glyphs (zh/ja) and Hangul (ko) are dense and unreadable at the
// Latin body size, so they get a larger type scale plus comfortable line-height
// and letter-spacing. Latin-with-diacritics languages (vi/de/es/en) keep the
// normal scale but must never clip the stacked Vietnamese diacritics, so they
// use a relaxed line-height.

import type { LanguageCode } from "@/features/review/types";

/**
 * Stable Tailwind class string for rendering a chunk of text in `lang`.
 *
 * - CJK (zh, ja) + Korean (ko): larger base size (`text-2xl`), relaxed
 *   line-height and wider tracking so dense glyphs stay legible at 375px.
 * - Latin-with-diacritics (vi, de, es, en): normal body size (`text-lg`) with
 *   relaxed line-height so stacked Vietnamese diacritics are never clipped.
 *
 * Returns a non-empty, deterministic class string for every LanguageCode.
 */
export function scriptClass(lang: LanguageCode): string {
  switch (lang) {
    case "zh":
    case "ja":
      // CJK: largest comfortable size, loosest spacing.
      return "text-2xl leading-loose tracking-wide";
    case "ko":
      // Hangul: large + comfortable, slightly tighter tracking than CJK.
      return "text-2xl leading-relaxed tracking-wide";
    case "vi":
    case "de":
    case "es":
    case "en":
    default:
      // Latin w/ diacritics: normal size, relaxed line-height to protect
      // stacked diacritics from clipping.
      return "text-lg leading-relaxed tracking-normal";
  }
}

/** A script is CJK or Korean (needs the larger type scale). */
function isLargeScript(lang: LanguageCode): boolean {
  return lang === "zh" || lang === "ja" || lang === "ko";
}

/**
 * Optionally scale the type size DOWN for long strings so a full sentence still
 * fits a 375px card. Deterministic: depends only on `lang` and `text.length`.
 *
 * Two buckets per script family:
 *   - large scripts (zh/ja/ko): >= 12 chars shrinks `text-2xl` → `text-xl`.
 *   - Latin scripts: >= 40 chars shrinks `text-lg` → `text-base`.
 */
export function fontSizeClass(lang: LanguageCode, text: string): string {
  const len = text?.length ?? 0;
  if (isLargeScript(lang)) {
    return len >= 12 ? "text-xl" : "text-2xl";
  }
  return len >= 40 ? "text-base" : "text-lg";
}

/** BCP-47 `lang` attribute value for correct font fallback + a11y. */
export function langTag(lang: LanguageCode): string {
  // ISO-639-1 codes here are already valid BCP-47 primary subtags.
  return lang;
}

/**
 * Vietnamese-facing label for the pronunciation hint, keyed on the ANSWER
 * language of the card. Returns null where a phonetic hint is not meaningful
 * (Vietnamese answers — the learner already reads the script natively).
 *
 *   ja → "Romaji"        ko → "Romaja (phiên âm)"
 *   zh → "Pinyin"        en → "Phiên âm (IPA)"
 *   de → "Phiên âm (IPA)"  es → "Phiên âm (IPA)"
 *   vi → null
 */
export function pronunciationLabel(lang: LanguageCode): string | null {
  switch (lang) {
    case "ja":
      return "Romaji";
    case "ko":
      return "Romaja (phiên âm)";
    case "zh":
      return "Pinyin";
    case "en":
    case "de":
    case "es":
      return "Phiên âm (IPA)";
    case "vi":
    default:
      return null;
  }
}
