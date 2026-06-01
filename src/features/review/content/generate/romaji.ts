// src/features/review/content/generate/romaji.ts
//
// Deterministic kana→romaji derivation for vi→ja generation, via wanakana.
//
// wanakana.toRomaji transliterates kana but leaves kanji (and any non-kana) as
// is — so a reading derived from text containing kanji is only a HINT, not a
// certain reading (a kanji can have several valid readings). We surface that
// uncertainty with `certain`, so the generator / gate / human pass can treat an
// uncertain romaji conservatively instead of trusting it blindly.

import { toRomaji, isKana } from "wanakana";

// CJK Unified Ideographs (kanji) — same range the gate uses. Their presence
// makes the kana→romaji mapping ambiguous, so we flag the result uncertain.
const KANJI = /[一-鿿]/;

export function deriveRomaji(japanese: string): {
  romaji: string;
  certain: boolean;
} {
  const romaji = toRomaji(japanese);
  // certain only when the input is PURE kana (no kanji and every char is kana,
  // so wanakana transliterated all of it). `isKana` ignores spaces/punctuation
  // via its `passRomaji`/whitespace handling, so we check kana-ness on the
  // non-whitespace, non-kanji core.
  const hasKanji = KANJI.test(japanese);
  const core = japanese.replace(/\s+/g, "");
  const allKana = core.length > 0 && isKana(core);
  const certain = !hasKanji && allKana;
  return { romaji, certain };
}
