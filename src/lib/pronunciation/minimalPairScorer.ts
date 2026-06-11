import type { EnglishPronunciationWord } from "./englishPronunciationFeedback";

// ─── Corpus types ──────────────────────────────────────────────────────────────

export type MinimalPairCategory =
  | "final_consonants"
  | "th_pairs"
  | "initial_clusters"
  | "final_clusters"
  | "long_short_vowels"
  | "diphthongs"
  | "stress_pairs";

export type MinimalPairDifficulty = "easy" | "medium" | "hard";

export type MinimalPair = {
  id: string;
  category: MinimalPairCategory;
  pair: { target: string; contrast: string };
  ipa: { target: string; contrast: string };
  vi: string;
  examples: { target: string; contrast: string };
  difficulty: MinimalPairDifficulty;
};

// ─── Contrast result types ─────────────────────────────────────────────────────

/**
 * The class of contrast that was (or would have been) failed.
 * Matches the interference patterns documented in each pair's `vi` field.
 */
export type ContrastType =
  | "final_consonant_dropped"           // bit/bid — final voicing or drop failure
  | "th_substitution"                   // think/sink — θ/ð → t/s/d
  | "initial_cluster_simplification"    // stop/top — onset cluster reduced
  | "final_cluster_simplification"      // miss/mist — coda cluster reduced
  | "vowel_length"                      // sheep/ship — tense vs lax / long vs short
  | "diphthong_reduction"               // coat/caught — diphthong → monophthong
  | "word_stress";                      // record NOUN vs VERB — syllable stress shifted

export type ContrastEvidence = {
  /** The ARPAbet/IPA phoneme symbol that drove the failure call. */
  phoneme: string;
  /** Azure accuracy score 0–100. */
  score: number;
};

export type PairContrastResult = {
  pairId: string;
  /** The word the learner was asked to produce. */
  targetWord: string;
  /** The word that the failed contrast would produce instead. */
  contrastWord: string;
  contrastType: ContrastType;
  /** true when phoneme evidence indicates the contrast was not maintained. */
  failed: boolean;
  /** The phoneme that drove the failure decision; null when passing or no data. */
  evidence: ContrastEvidence | null;
  /** Vietnamese explanation from the corpus pair's `vi` field. */
  viExplanation: string;
};

// ─── Internal constants ────────────────────────────────────────────────────────

const FAIL_THRESHOLD = 70;

const VOWEL_PHONEMES = new Set([
  // ARPAbet
  "aa", "ae", "ah", "ao", "aw", "ay", "eh", "er", "ey",
  "ih", "iy", "ow", "oy", "uh", "uw",
  // IPA variants Azure may emit
  "a", "e", "i", "o", "u", "ə", "æ", "ɑ", "ɛ", "ɪ", "ʊ", "ɔ",
]);

const TH_PHONEMES = ["th", "dh", "θ", "ð"];

// ─── Internal helpers ──────────────────────────────────────────────────────────

function isVowelPhoneme(symbol: string): boolean {
  return VOWEL_PHONEMES.has(symbol.toLowerCase());
}

function toScore(raw: number | null | undefined): number | null {
  return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
}

function findPhonemeEvidence(
  word: EnglishPronunciationWord,
  targets: string[],
): ContrastEvidence | null {
  const lowerTargets = targets.map((t) => t.toLowerCase());
  for (const p of word.phonemes ?? []) {
    const sym = String(p.phoneme ?? "").trim().toLowerCase();
    if (!lowerTargets.includes(sym)) continue;
    const score = toScore(p.accuracyScore);
    if (score === null) continue;
    return { phoneme: sym, score };
  }
  return null;
}

/** Returns the last non-vowel phoneme and its score. */
function lastConsonantEvidence(word: EnglishPronunciationWord): ContrastEvidence | null {
  const phonemes = word.phonemes ?? [];
  for (let i = phonemes.length - 1; i >= 0; i--) {
    const sym = String(phonemes[i].phoneme ?? "").trim().toLowerCase();
    if (isVowelPhoneme(sym)) continue;
    const score = toScore(phonemes[i].accuracyScore);
    if (score === null) return null;
    return { phoneme: sym, score };
  }
  return null;
}

/**
 * Returns the weakest phoneme in the initial or final two-phoneme cluster.
 * Returns null when no phoneme in the cluster scores below FAIL_THRESHOLD.
 */
function weakestClusterPhoneme(
  word: EnglishPronunciationWord,
  position: "initial" | "final",
): ContrastEvidence | null {
  const phonemes = word.phonemes ?? [];
  if (phonemes.length < 2) return null;

  const cluster = position === "initial" ? phonemes.slice(0, 2) : phonemes.slice(-2);
  let worst: ContrastEvidence | null = null;
  for (const p of cluster) {
    const sym = String(p.phoneme ?? "").trim().toLowerCase();
    const score = toScore(p.accuracyScore);
    if (score === null) continue;
    if (score < FAIL_THRESHOLD && (worst === null || score < worst.score)) {
      worst = { phoneme: sym, score };
    }
  }
  return worst;
}

/** Returns the first vowel phoneme that scores below FAIL_THRESHOLD, or null. */
function weakVowelEvidence(word: EnglishPronunciationWord): ContrastEvidence | null {
  for (const p of word.phonemes ?? []) {
    const sym = String(p.phoneme ?? "").trim().toLowerCase();
    if (!isVowelPhoneme(sym)) continue;
    const score = toScore(p.accuracyScore);
    if (score !== null && score < FAIL_THRESHOLD) return { phoneme: sym, score };
  }
  return null;
}

// ─── Category → ContrastType ───────────────────────────────────────────────────

function categoryToContrastType(category: MinimalPairCategory): ContrastType {
  switch (category) {
    case "final_consonants":  return "final_consonant_dropped";
    case "th_pairs":          return "th_substitution";
    case "initial_clusters":  return "initial_cluster_simplification";
    case "final_clusters":    return "final_cluster_simplification";
    case "long_short_vowels": return "vowel_length";
    case "diphthongs":        return "diphthong_reduction";
    case "stress_pairs":      return "word_stress";
  }
}

// ─── Failure detection per contrast type ──────────────────────────────────────

function detectContrastFailure(
  contrastType: ContrastType,
  targetWord: string,
  azureWord: EnglishPronunciationWord,
): ContrastEvidence | null {
  switch (contrastType) {
    case "final_consonant_dropped": {
      const ev = lastConsonantEvidence(azureWord);
      return ev !== null && ev.score < FAIL_THRESHOLD ? ev : null;
    }

    case "th_substitution": {
      if (/th/i.test(targetWord)) {
        // Practicing the th-word: check the theta/eth phoneme directly.
        const ev = findPhonemeEvidence(azureWord, TH_PHONEMES);
        return ev !== null && ev.score < FAIL_THRESHOLD ? ev : null;
      }
      // Practicing the substitute word (sink, tank, etc.): check the
      // first consonant phoneme — the one that must stay as-is.
      const phonemes = azureWord.phonemes ?? [];
      const firstConsonant = phonemes.find(
        (p) => !isVowelPhoneme(String(p.phoneme ?? "").trim().toLowerCase()),
      );
      if (!firstConsonant) return null;
      const score = toScore(firstConsonant.accuracyScore);
      if (score !== null && score < FAIL_THRESHOLD) {
        return { phoneme: String(firstConsonant.phoneme ?? "").trim().toLowerCase(), score };
      }
      return null;
    }

    case "initial_cluster_simplification":
      return weakestClusterPhoneme(azureWord, "initial");

    case "final_cluster_simplification":
      return weakestClusterPhoneme(azureWord, "final");

    case "vowel_length":
    case "diphthong_reduction":
      return weakVowelEvidence(azureWord);

    case "word_stress": {
      // Phoneme-level scores do not capture stress directly; use the overall
      // word accuracy score as the best available proxy.
      const score = toScore(azureWord.accuracyScore);
      if (score !== null && score < FAIL_THRESHOLD) {
        return { phoneme: "(word)", score };
      }
      return null;
    }
  }
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Build a lookup index from an array of minimal-pair entries.
 *
 * Both words of each pair are keyed (lowercased) so `scorePairContrast` can be
 * called with either side as the practice target.
 */
export function buildPairIndex(corpus: MinimalPair[]): Map<string, MinimalPair> {
  const index = new Map<string, MinimalPair>();
  for (const pair of corpus) {
    index.set(pair.pair.target.toLowerCase(), pair);
    index.set(pair.pair.contrast.toLowerCase(), pair);
  }
  return index;
}

/**
 * Score a single word attempt against the minimal-pair corpus.
 *
 * @param targetWord  The word the learner was asked to produce.
 * @param azureWord   Per-phoneme accuracy data from Azure Pronunciation Assessment.
 * @param index       Index built by `buildPairIndex`.
 *
 * @returns null when `targetWord` is not found in the index.
 *          A result with `failed: false` when phoneme evidence is insufficient
 *          to call a failure (e.g. Azure provided no phoneme-level scores).
 */
export function scorePairContrast(
  targetWord: string,
  azureWord: EnglishPronunciationWord,
  index: Map<string, MinimalPair>,
): PairContrastResult | null {
  const key = targetWord.toLowerCase();
  const pair = index.get(key);
  if (!pair) return null;

  const contrastWord =
    pair.pair.target.toLowerCase() === key
      ? pair.pair.contrast
      : pair.pair.target;

  const contrastType = categoryToContrastType(pair.category);
  const evidence = detectContrastFailure(contrastType, targetWord, azureWord);

  return {
    pairId: pair.id,
    targetWord,
    contrastWord,
    contrastType,
    failed: evidence !== null,
    evidence,
    viExplanation: pair.vi,
  };
}
