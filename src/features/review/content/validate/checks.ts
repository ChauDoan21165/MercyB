// src/features/review/content/validate/checks.ts
//
// Pure, synchronous, dependency-free script + reading checks used by the gate.
// Unicode-range based — no external libs, deterministic. Each function answers
// one narrow question so the gate can compose them and attribute reason codes.

import type { ReviewFlowId } from "@/features/review/types";

// ── Script ranges ───────────────────────────────────────────────────────────
const HIRAGANA = /[぀-ゟ]/;
const KATAKANA = /[゠-ヿ]/;
const CJK = /[一-鿿]/; // CJK Unified Ideographs (hanzi / kanji)
const HANGUL_SYLLABLES = /[가-힣]/;
const HANGUL_JAMO = /[ᄀ-ᇿ㄰-㆏ꥠ-꥿ힰ-퟿]/;
const CYRILLIC = /[Ѐ-ӿ]/;
const LATIN = /[A-Za-z]/;

const ANY_JAPANESE = new RegExp(
  `${HIRAGANA.source}|${KATAKANA.source}|${CJK.source}`,
);
const ANY_HANGUL = new RegExp(`${HANGUL_SYLLABLES.source}|${HANGUL_JAMO.source}`);
const ANY_CJK_OR_KANA_OR_HANGUL = new RegExp(
  `${HIRAGANA.source}|${KATAKANA.source}|${CJK.source}|${ANY_HANGUL.source}`,
);

// Pinyin tone marks (combining + precomposed) and numbered-tone fallback.
const PINYIN_TONE_DIACRITIC = /[̀-̌̄́̌̀āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i;
const PINYIN_NUMBERED_TONE = /[a-züÜ][1-5]\b/;

export function hasJapanese(s: string): boolean {
  return ANY_JAPANESE.test(s);
}
export function hasHangul(s: string): boolean {
  return ANY_HANGUL.test(s);
}
export function hasHanzi(s: string): boolean {
  return CJK.test(s);
}
export function hasLatin(s: string): boolean {
  return LATIN.test(s);
}

/**
 * Front must read as Vietnamese: Latin script, and crucially NO target-script
 * characters (a CJK/kana/hangul char on the front signals a mis-mapped card).
 */
export function frontLooksVietnamese(front: string): boolean {
  if (ANY_CJK_OR_KANA_OR_HANGUL.test(front)) return false;
  if (CYRILLIC.test(front)) return false;
  return true;
}

/** Does `back` carry the script the flow's target language requires? */
export function backHasRequiredScript(flow: ReviewFlowId, back: string): boolean {
  switch (flow) {
    case "vi-de":
      // German is Latin; must have Latin letters and NO CJK/kana/hangul/cyrillic.
      return (
        LATIN.test(back) &&
        !ANY_CJK_OR_KANA_OR_HANGUL.test(back) &&
        !CYRILLIC.test(back)
      );
    case "vi-ja":
      return ANY_JAPANESE.test(back);
    case "vi-ko":
      return ANY_HANGUL.test(back);
    case "vi-zh":
      return CJK.test(back);
    default:
      // Not a flow this harness governs.
      return false;
  }
}

/** Flows that require a reading/pronunciation hint to certify. */
export function flowRequiresReading(flow: ReviewFlowId): boolean {
  return flow === "vi-ja" || flow === "vi-ko" || flow === "vi-zh";
}

/** Pinyin must carry tone information (diacritic tones or numbered tones). */
export function pinyinHasTone(pinyin: string): boolean {
  return PINYIN_TONE_DIACRITIC.test(pinyin) || PINYIN_NUMBERED_TONE.test(pinyin);
}

/**
 * Light romaji↔kana consistency check for Japanese. Only decisive when the
 * back is PURE kana (no kanji) — then every kana must map to romaji and the
 * lengths should be coherent. When kanji is present the reading is ambiguous
 * (multiple valid readings), so we return `null` = "can't decide here, don't
 * fail on this axis" and leave deeper validation to the round-trip / human pass.
 */
export function romajiKanaConsistent(
  back: string,
  romaji: string,
): boolean | null {
  if (CJK.test(back)) return null; // kanji present — undecidable cheaply
  if (!(HIRAGANA.test(back) || KATAKANA.test(back))) return null;
  const r = romaji.trim();
  if (!r) return false;
  // Pure-kana romaji must be Latin (allow macrons for long vowels + apostrophe).
  if (!/^[a-zāīūēōâ' .,!?\-]+$/i.test(r)) return false;
  // Coarse length coherence: romaji letters should outnumber kana (each kana →
  // 1–3 Latin chars), guarding against a stray/blank reading.
  const kanaCount = (back.match(/[぀-ヿ]/g) ?? []).length;
  const latinCount = (r.match(/[a-zāīūēōâ]/gi) ?? []).length;
  return latinCount >= kanaCount;
}
