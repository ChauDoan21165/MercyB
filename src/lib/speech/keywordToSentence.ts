/**
 * Wrap a single-word keyword in a natural carrier sentence so the Web Speech
 * API has enough acoustic context to score fairly. Multi-word keywords or
 * phrases are passed through as-is.
 *
 * Example:
 *   keywordToSentence('pronunciation')
 *     → { target_en: 'The word is pronunciation.',
 *         target_vi: 'Từ này là pronunciation.' }
 *   keywordToSentence('I would like coffee')
 *     → { target_en: 'I would like coffee.',
 *         target_vi: 'I would like coffee.' }
 *
 * Used by the in-room "Practice pronunciation" feature to turn the room's
 * keyword pills into a SpeechDrill session.
 */

export type CarrierSentence = {
  target_en: string;
  target_vi: string;
  /** The original keyword, preserved for analytics + persistence context. */
  keyword: string;
};

const PUNCT_END = /[.?!。？！]$/;
const TRAILING_PUNCT = /[\s.?!。？！]+$/;

function trimEnd(s: string): string {
  return s.replace(TRAILING_PUNCT, "");
}

function endsWithSentencePunct(s: string): boolean {
  return PUNCT_END.test(s.trim());
}

/** Counts whitespace-separated tokens. */
function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function keywordToSentence(rawKeyword: string): CarrierSentence | null {
  const keyword = String(rawKeyword ?? "").trim();
  if (!keyword) return null;

  const tokens = wordCount(keyword);

  if (tokens === 1) {
    const cleaned = trimEnd(keyword);
    return {
      target_en: `The word is ${cleaned}.`,
      target_vi: `Từ này là ${cleaned}.`,
      keyword,
    };
  }

  // Multi-word keyword / phrase — use as-is. Add a final period if the
  // user's keyword didn't include one, so the scorer's sentence-shape
  // expectations stay consistent.
  const polishedEn = endsWithSentencePunct(keyword) ? keyword : `${keyword}.`;
  return {
    target_en: polishedEn,
    target_vi: polishedEn,
    keyword,
  };
}

/**
 * Convenience: turn a list of EN keywords into a list of carrier sentences,
 * skipping empty entries. Pairs with the room's `kw.en[]` array.
 */
export function keywordsToSentences(keywords: readonly string[]): CarrierSentence[] {
  if (!Array.isArray(keywords)) return [];
  const out: CarrierSentence[] = [];
  const seen = new Set<string>();
  for (const k of keywords) {
    const sentence = keywordToSentence(k);
    if (!sentence) continue;
    // Dedupe — a room may have repeated keywords across entries.
    const key = sentence.target_en.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(sentence);
  }
  return out;
}
