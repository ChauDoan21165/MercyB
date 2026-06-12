/**
 * STT Transcript Sanity Module.
 *
 * Engine-agnostic defense layer against phonetic mishears from Web Speech
 * API (no acoustic biasing available). Catches the "hat"→"head" class of
 * errors before the follow-up generator predicates on a misheard token.
 *
 * Two modes:
 *   READ-BACK  — targetSentence known: correct phonetically-close tokens to
 *                target (e.g. STT heard "hat" but target says "head").
 *   FREE-ANSWER — no target: flag content tokens that are phonetically
 *                 confusable with recentVocab items as lowConfidenceTokens.
 *                 The follow-up generator must ABSTAIN on those tokens
 *                 (S18 abstain-over-guess standard).
 *
 * Abstains cleanly (returns original unchanged) when context is empty.
 *
 * WIRING SPEC (for the 2nd MR — call-site integration):
 *   Import: `import { transcriptSanity } from "@/lib/ai-tutor/transcriptSanity";`
 *
 *   READ-BACK (speak tab with a target line):
 *     const sanity = transcriptSanity(spoken, {
 *       targetSentence: topic.exampleLine,
 *       recentVocab: topic.l1InterferenceNotes.flatMap(n => n.incorrectForms ?? []),
 *     });
 *     // Use sanity.sanitizedTranscript instead of spoken for the follow-up prompt.
 *     // Log sanity.corrections for telemetry.
 *
 *   FREE-ANSWER (open speak, no target):
 *     const sanity = transcriptSanity(spoken, { recentVocab: sessionVocab });
 *     // Append to the follow-up system prompt when lowConfidenceTokens.length > 0:
 *     //   "The learner's transcript may contain STT errors. AVOID predicating a
 *     //    follow-up question on: <lowConfidenceTokens.map(t => t.token).join(', ')>"
 *
 *   Hosts: AiTutor.tsx (speak follow-up path) + MercySpeakTab.tsx (if wired).
 *   Both surfaces use useBrowserStt — no host-mirror divergence in this module.
 */

// ─── Public types ─────────────────────────────────────────────────────────

export interface TranscriptSanityContext {
  /** The sentence the learner was asked to read aloud (READ-BACK mode). */
  targetSentence?: string;
  /** Vocabulary recently seen or practiced this session (FREE-ANSWER mode). */
  recentVocab?: string[];
}

export interface SanityCorrection {
  /** Zero-based token position in the original transcript. */
  position: number;
  /** What STT returned. */
  original: string;
  /** What we corrected it to (the target token). */
  corrected: string;
  /** 0–1 correction confidence (higher = more certain). */
  confidence: number;
}

export interface LowConfidenceToken {
  position: number;
  token: string;
  /** Always "phonetically_confusable" — keeps the shape open for future reasons. */
  reason: "phonetically_confusable";
}

export interface TranscriptSanityResult {
  /** Transcript with corrections applied (READ-BACK) or original (FREE-ANSWER). */
  sanitizedTranscript: string;
  /** Corrections made; empty in FREE-ANSWER mode. */
  corrections: SanityCorrection[];
  /** Tokens the follow-up generator should not predicate on; empty in READ-BACK. */
  lowConfidenceTokens: LowConfidenceToken[];
}

// ─── Vietnamese-speaker phoneme confusion table ───────────────────────────

/**
 * Pairs of characters (consonants) that Vietnamese learners or Vietnamese STT
 * commonly confuse. Used to validate whether a skeleton edit is "phonetically
 * plausible" rather than a random substitution.
 * All pairs are bidirectional.
 *
 * Scope is kept narrow: only confusions that arise from documented VN L1
 * transfer or systematic STT mishear for VN speakers. p/b as initials are
 * NOT confused by VN speakers (both phonemes exist in VN). s/sh as initials
 * are NOT included here because they cause false positives ("saw"/"sheep").
 */
const VN_CONFUSABLE_PAIRS: Array<[string, string]> = [
  // Final-stop assimilation: unreleased stops in VN coda
  ["t", "d"],   // hat / head, cat / cad
  ["t", "k"],   // hat / hak (velar-alveolar stop collapse in VN)
  ["d", "k"],   // dead / deak
  ["d", "g"],   // head / heg
  // Nasal place assimilation (VN dialect areas)
  ["n", "m"],
  // Liquid / rhotic confusion
  ["l", "n"],   // l/n mixing in northern VN dialects
  ["l", "r"],   // rice / lice (some northern speakers)
  // Labial confusion (fricative vs stop — the canonical VN error)
  ["b", "v"],   // very / bery — v→b substitution
  // th / t confusion (th digraph normalized to sentinel T)
  ["T", "t"],   // think / tink
  ["T", "d"],   // the / de
];

// ─── Phonetic skeleton computation ───────────────────────────────────────

/**
 * Convert a word to a consonant skeleton for phoneme-level comparison.
 *
 * Normalizes common English digraphs to single-character sentinels (capital
 * letters not found in normal spelling), then strips all vowels. The result
 * is a compact consonant frame that captures the structural phonetic shape
 * of the word without requiring a full phonemic transcription.
 *
 * Examples:
 *   hat   → ht
 *   head  → hd
 *   ship  → Sp   (sh→S, vowel stripped)
 *   sheep → Sp   (sh→S, vowel stripped) — identical skeleton, so LD=0
 *   think → Tnk  (th→T, vowel stripped)
 *   tink  → tnk
 */
export function toConsonantSkeleton(word: string): string {
  return word
    .toLowerCase()
    .replace(/ck/g, "k")      // back → bk, clock → clk
    .replace(/sh/g, "S")      // ship → Sip (sentinel)
    .replace(/th/g, "T")      // think → Tink (sentinel)
    .replace(/ch/g, "C")      // chair → Cair (sentinel)
    .replace(/ph/g, "f")      // phone → fone
    .replace(/wh/g, "w")      // what → wat
    .replace(/ng$/, "N")      // ring → riN (nasal coda sentinel)
    .replace(/[aeiouäëïöü]/gi, "")   // strip all vowels
    .replace(/[^a-zA-Z]/g, "");      // strip non-alpha leftovers
}

// ─── Levenshtein distance ────────────────────────────────────────────────

/**
 * Standard character-level Levenshtein distance.
 * Pure function, no allocations beyond two O(n) rows.
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const curr = new Array<number>(b.length + 1);

  for (let i = 0; i < a.length; i++) {
    curr[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      curr[j + 1] = Math.min(curr[j] + 1, prev[j + 1] + 1, prev[j] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }

  return prev[b.length];
}

// ─── VN-confusability check ──────────────────────────────────────────────

/**
 * True if two single consonant characters are in a known VN-confusable pair.
 * Bidirectional; identical chars always return true.
 */
function isVnConfusableChar(a: string, b: string): boolean {
  if (a === b) return true;
  return VN_CONFUSABLE_PAIRS.some(
    ([x, y]) => (x === a && y === b) || (x === b && y === a),
  );
}

// ─── Core phonetic proximity ─────────────────────────────────────────────

/**
 * Determine phonetic proximity between a transcript token and a target token.
 * Returns a confidence 0–1 if the pair is phonetically close enough to
 * warrant a correction, or null if the words are clearly different.
 *
 * Threshold:
 *   1. Identical after lowercasing → confidence 1.0
 *   2. Consonant-skeleton Levenshtein ≤ 2 AND first consonant is identical
 *      or VN-confusable AND skeleton lengths differ by ≤ 2 → confidence ≥ 0.5
 *
 * This catches:
 *   hat / head   → ht vs hd, LD=1, h=h ✓ → ~0.67
 *   ship / sheep → Sp vs Sp, LD=0, S=S ✓ → 1.0 (same skeleton)
 *   hat / hak    → ht vs hk, LD=1, h=h, t/k VN-confusable ✓ → ~0.67
 *
 * And rejects:
 *   cat / hat    → ct vs ht, LD=1 but c/h not confusable → null
 *   dog / cat    → dg vs ct, LD=2 but d/c not confusable → null
 *   run / sun    → rn vs sn, LD=1 but r/s not confusable → null
 */
export function phoneticProximity(
  transcript: string,
  target: string,
): number | null {
  const t = transcript.toLowerCase().trim();
  const tgt = target.toLowerCase().trim();

  if (!t || !tgt) return null;
  if (t === tgt) return 1.0;

  const skelT = toConsonantSkeleton(t);
  const skelTgt = toConsonantSkeleton(tgt);

  if (!skelT || !skelTgt) return null;

  // Skeleton length sanity: allow ≤ 2 char difference in consonant frames
  if (Math.abs(skelT.length - skelTgt.length) > 2) return null;

  const ld = levenshtein(skelT, skelTgt);
  if (ld > 2) return null;

  // Initial consonant gate: the opening phoneme must be identical or VN-confusable
  const firstT = skelT[0] ?? "";
  const firstTgt = skelTgt[0] ?? "";
  if (!isVnConfusableChar(firstT, firstTgt)) return null;

  // Confidence: 1 - normalized_ld, floored at 0.5
  const maxLen = Math.max(skelT.length, skelTgt.length) || 1;
  return Math.max(0.5, 1 - ld / maxLen);
}

// ─── Tokeniser ───────────────────────────────────────────────────────────

/** Lowercase word tokens with punctuation stripped. Preserves position. */
function tokenize(sentence: string): string[] {
  return sentence
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[^a-z']/g, "").trim())
    .filter(Boolean);
}

// ─── Function-word filter for FREE-ANSWER mode ────────────────────────────

/**
 * Common English function words that carry no content-phoneme information.
 * FREE-ANSWER mode skips these — a misheard "the" is never flagged.
 */
const FUNCTION_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "must", "can", "i", "you", "he", "she", "it",
  "we", "they", "my", "your", "his", "her", "its", "our", "their",
  "this", "that", "these", "those", "not", "no", "so", "as", "if",
  "then", "just", "up", "out", "more", "like", "about", "also", "here",
]);

// ─── READ-BACK mode ──────────────────────────────────────────────────────

function readBackSanity(
  transcript: string,
  targetSentence: string,
): TranscriptSanityResult {
  const tTokens = tokenize(transcript);
  const tgtTokens = tokenize(targetSentence);

  const corrections: SanityCorrection[] = [];
  const resultTokens = [...tTokens];

  // Positional alignment: compare token i of transcript to token i of target.
  // In READ-BACK mode the learner reads aloud a fixed sentence, so positional
  // alignment is appropriate (insertions/deletions shift at most 1-2 slots and
  // the phonetic guard prevents cross-slot false corrections).
  const alignLen = Math.min(tTokens.length, tgtTokens.length);

  for (let i = 0; i < alignLen; i++) {
    const tToken = tTokens[i];
    const tgtToken = tgtTokens[i];
    if (!tToken || !tgtToken || tToken === tgtToken) continue;

    const conf = phoneticProximity(tToken, tgtToken);
    if (conf !== null) {
      corrections.push({
        position: i,
        original: tToken,
        corrected: tgtToken,
        confidence: conf,
      });
      resultTokens[i] = tgtToken;
    }
  }

  return {
    sanitizedTranscript: resultTokens.join(" "),
    corrections,
    lowConfidenceTokens: [],
  };
}

// ─── FREE-ANSWER mode ────────────────────────────────────────────────────

function freeAnswerSanity(
  transcript: string,
  recentVocab: string[],
): TranscriptSanityResult {
  const tokens = tokenize(transcript);
  const vocabLower = recentVocab
    .map((v) => v.toLowerCase().trim())
    .filter(Boolean);

  const lowConfidenceTokens: LowConfidenceToken[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token || FUNCTION_WORDS.has(token)) continue;

    // If the token exactly matches a vocab word, the learner said it correctly.
    // Never flag an exact match as low-confidence, even if it is phonetically
    // close to another vocab word (e.g. "sheep" is close to "ship" — but if
    // "sheep" is in the vocab and the transcript says "sheep", trust it).
    if (vocabLower.includes(token)) continue;

    // A token is low-confidence if it is phonetically close to a vocab word
    // that it is NOT equal to — i.e. the learner may have said the vocab word
    // and STT returned something slightly different.
    const isConfusable = vocabLower.some(
      (vocab) => vocab !== token && phoneticProximity(token, vocab) !== null,
    );

    if (isConfusable) {
      lowConfidenceTokens.push({
        position: i,
        token,
        reason: "phonetically_confusable",
      });
    }
  }

  return {
    sanitizedTranscript: transcript,  // no changes in free-answer mode
    corrections: [],
    lowConfidenceTokens,
  };
}

// ─── Main entry point ─────────────────────────────────────────────────────

/**
 * Sanitize an STT transcript against a known context.
 *
 * READ-BACK mode (context.targetSentence present):
 *   Corrects tokens that are phonetically close to the target token at the
 *   same position. Fixes the live "hat"→"head" bug: when the learner says
 *   "head" and STT returns "hat", the sanitized transcript says "head" and
 *   the follow-up prompt is never "What color is your hat?"
 *
 * FREE-ANSWER mode (no targetSentence, optional recentVocab):
 *   Flags content tokens phonetically confusable with recentVocab items.
 *   The follow-up generator must not predicate on flagged tokens — abstain
 *   rather than guess (S18 standard).
 *
 * Abstains cleanly when context is empty: returns the original transcript
 * with no corrections and no low-confidence flags.
 */
export function transcriptSanity(
  transcript: string,
  context: TranscriptSanityContext,
): TranscriptSanityResult {
  const passThrough: TranscriptSanityResult = {
    sanitizedTranscript: transcript,
    corrections: [],
    lowConfidenceTokens: [],
  };

  if (!transcript || !transcript.trim()) return passThrough;

  // ── READ-BACK mode ──
  if (context.targetSentence?.trim()) {
    return readBackSanity(transcript, context.targetSentence);
  }

  // ── FREE-ANSWER mode ──
  const vocab = context.recentVocab ?? [];
  if (vocab.length === 0) return passThrough; // abstain: no context to compare against

  return freeAnswerSanity(transcript, vocab);
}
