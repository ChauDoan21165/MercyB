// src/features/review/content/generate/roundTrip.ts
//
// The back-translation round-trip checker, built around the injected Translator.
//
// A generated card's front (vi) is suspect: it was machine-produced. To certify
// it, we translate the generated front BACK to the target language and check it
// recovers the original authored `back`. High similarity ⇒ the vi gloss is a
// faithful translation; low similarity ⇒ quarantine (ROUNDTRIP_FAILED).
//
// This module is pure aside from the injected async Translator: it owns the
// comparison, not the model. The default similarity metric is a deterministic
// normalized character-bigram Dice coefficient in [0,1] — language-agnostic and
// well-suited to CJK (where token/whitespace splitting is meaningless), since it
// compares on characters.

import type { ReviewCandidate, RoundTripChecker } from "../validate";
import type { Translator, TargetLang } from "./translator";

/** Map a flow id to the target-language code the Translator expects. */
function flowTarget(flow: ReviewCandidate["flow"]): TargetLang | null {
  switch (flow) {
    case "vi-ja":
      return "ja";
    case "vi-ko":
      return "ko";
    case "vi-zh":
      return "zh";
    case "vi-de":
      return "de";
    default:
      return null;
  }
}

/**
 * Normalize for comparison: lowercase, strip whitespace and common punctuation,
 * so trivial formatting differences don't depress similarity. Operates on the
 * raw string (characters), which is what we compare for CJK.
 */
function normalizeForCompare(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\s\u3000]+/g, "")
    .replace(/[.,!?;:。、！？；：「」『』（）()"'`~・…—–-]/g, "");
}

/** Character bigrams of a normalized string. Single-char strings → that char. */
function bigrams(s: string): string[] {
  const chars = Array.from(s); // codepoint-aware (handles surrogate pairs)
  if (chars.length === 0) return [];
  if (chars.length === 1) return [chars[0]];
  const out: string[] = [];
  for (let i = 0; i < chars.length - 1; i++) {
    out.push(chars[i] + chars[i + 1]);
  }
  return out;
}

/**
 * Deterministic normalized character-bigram Dice coefficient in [0,1]. Pure and
 * testable. 1 = identical (after normalization), 0 = no shared bigrams. Uses a
 * multiset intersection so repeated bigrams are matched at most as often as they
 * occur in each string.
 */
export function diceSimilarity(a: string, b: string): number {
  const na = normalizeForCompare(a);
  const nb = normalizeForCompare(b);
  if (na === nb) return na.length === 0 ? 0 : 1;
  const ba = bigrams(na);
  const bb = bigrams(nb);
  if (ba.length === 0 || bb.length === 0) return 0;

  const counts = new Map<string, number>();
  for (const g of ba) counts.set(g, (counts.get(g) ?? 0) + 1);

  let overlap = 0;
  for (const g of bb) {
    const c = counts.get(g);
    if (c && c > 0) {
      overlap++;
      counts.set(g, c - 1);
    }
  }
  return (2 * overlap) / (ba.length + bb.length);
}

/**
 * Build a RoundTripChecker from an injected Translator. The returned checker
 * translates the candidate's generated `front` (vi) back to the flow's target
 * language and compares it to `cand.back` via `sim` (default: diceSimilarity).
 *
 * @param t   injected Translator (real MT, test fake, or static map).
 * @param sim similarity fn returning [0,1]; defaults to diceSimilarity.
 * @returns   a RoundTripChecker: (cand) => Promise<{ ok, similarity }>.
 *            `ok` here only reports similarity > 0 as a coarse sanity flag; the
 *            GATE owns the pass/fail threshold (roundTripThreshold), so this
 *            checker's job is to surface a faithful `similarity` number.
 */
export function makeRoundTripChecker(
  t: Translator,
  sim: (a: string, b: string) => number = diceSimilarity,
): RoundTripChecker {
  return async (cand: ReviewCandidate) => {
    const target = flowTarget(cand.flow);
    if (target === null) {
      return { ok: false, similarity: 0 };
    }
    const back = await t.fromVietnamese(cand.front, target);
    const similarity = sim(back, cand.back);
    return { ok: similarity > 0, similarity };
  };
}
