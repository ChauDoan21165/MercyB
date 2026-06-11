import type { EnglishPronunciationWord } from "../englishPronunciationFeedback";

function w(
  word: string,
  accuracyScore: number,
  phonemes: Array<[string, number]>,
): EnglishPronunciationWord {
  return {
    word,
    accuracyScore,
    phonemes: phonemes.map(([phoneme, score]) => ({ phoneme, accuracyScore: score })),
  };
}

// ─── final_consonants: bit / bid ──────────────────────────────────────────────

/** "bid" — final /d/ produced correctly (high voicing score). */
export const BID_PASS = w("bid", 91, [["b", 93], ["ih", 90], ["d", 88]]);

/** "bid" — final /d/ dropped or devoiced (heard as "bit"). */
export const BID_FAIL = w("bid", 64, [["b", 92], ["ih", 89], ["d", 28]]);

/** "bid" — Azure returned a word score but no phoneme breakdown. */
export const BID_NO_PHONEMES: EnglishPronunciationWord = {
  word: "bid",
  accuracyScore: 50,
  phonemes: [],
};

// ─── th_pairs: think / sink ────────────────────────────────────────────────────

/** "think" — /θ/ produced correctly. */
export const THINK_PASS = w("think", 88, [["th", 91], ["ih", 87], ["ng", 84], ["k", 82]]);

/** "think" — /θ/ substituted (th→s or th→t; heard as "sink" or "tink"). */
export const THINK_FAIL = w("think", 55, [["th", 22], ["ih", 85], ["ng", 80], ["k", 78]]);

// ─── initial_clusters: stop / top ─────────────────────────────────────────────

/** "stop" — /st/ cluster fully realised. */
export const STOP_PASS = w("stop", 89, [["s", 88], ["t", 85], ["aa", 92], ["p", 87]]);

/** "stop" — /s/ and /t/ both weak; cluster simplified to "top". */
export const STOP_FAIL = w("stop", 60, [["s", 18], ["t", 25], ["aa", 91], ["p", 86]]);

// ─── final_clusters: mist / miss ──────────────────────────────────────────────

/** "mist" — final /st/ cluster fully realised. */
export const MIST_PASS = w("mist", 90, [["m", 92], ["ih", 88], ["s", 86], ["t", 83]]);

/** "mist" — final /t/ dropped from /st/ (heard as "miss"). */
export const MIST_FAIL = w("mist", 62, [["m", 91], ["ih", 87], ["s", 85], ["t", 19]]);

// ─── long_short_vowels: sheep / ship ──────────────────────────────────────────

/** "sheep" — /iː/ vowel long and tense. */
export const SHEEP_PASS = w("sheep", 92, [["sh", 90], ["iy", 93], ["p", 88]]);

/** "sheep" — /iː/ laxed to /ɪ/ (heard as "ship"). */
export const SHEEP_FAIL = w("sheep", 61, [["sh", 89], ["iy", 40], ["p", 87]]);

// ─── diphthongs: coat / caught ────────────────────────────────────────────────

/** "coat" — /oʊ/ diphthong fully realised. */
export const COAT_PASS = w("coat", 91, [["k", 90], ["ow", 92], ["t", 87]]);

/** "coat" — /oʊ/ monophthongized to /ɔː/ (heard as "caught"). */
export const COAT_FAIL = w("coat", 59, [["k", 89], ["ow", 38], ["t", 84]]);

// ─── stress_pairs: record (noun) / record (verb) ──────────────────────────────

/** "record" noun /ˈrɛkərd/ — word-level accuracy high (stress correct). */
export const RECORD_NOUN_PASS = w("record", 88, [
  ["r", 91], ["eh", 90], ["k", 87], ["er", 85], ["d", 84],
]);

/** "record" noun — low overall accuracy indicating stress on wrong syllable. */
export const RECORD_NOUN_FAIL = w("record", 54, [
  ["r", 85], ["eh", 82], ["k", 75], ["er", 70], ["d", 65],
]);
