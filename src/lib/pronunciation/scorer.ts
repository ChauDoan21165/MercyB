/**
 * Pronunciation scorer.
 *
 * Compares a recognised transcript against a target sentence and returns
 * a 0..100 score, per-word statuses, and bilingual feedback.
 *
 * The comparison runs in three passes:
 *
 *   1. Tokenise both strings into lowercase words (punctuation stripped).
 *   2. Word-level alignment using a classic edit-distance DP so
 *      insertions / deletions / substitutions land in their natural slots
 *      rather than misaligning at the first mismatch. This matters for
 *      learner speech where filler words or dropped articles are common.
 *   3. For each alignment pair, grade the match:
 *        - exact             → 100, status "correct"
 *        - known VN variant  → partial credit from vn-phoneme-map,
 *                              status "close"
 *        - unknown word      → 0 from this slot, status "wrong"
 *        - missed target     → 0 from this slot, status "missed"
 *        - extra recognised  → no credit contributed; small penalty
 *                              subtracted from the total (callers treat
 *                              these as filler / misfired ASR tokens)
 *
 * Overall score is the mean credit across target words, minus a fixed
 * small penalty per extra word, clamped to [0, 100].
 *
 * The scorer is deliberately pure: same input → same output, no I/O, no
 * randomness. Easy to unit test, easy to reason about.
 */

import {
  getAcceptedVariants,
  inferPhonemeForWord,
  type PhonemeTip,
} from './vn-phoneme-map';
export type { PhonemeTip } from './vn-phoneme-map';

export type WordStatus = 'correct' | 'close' | 'wrong' | 'missed';

export type PhonemeScore = {
  /** Phoneme symbol as Azure returns it — IPA-flavoured / SAPI mix. */
  phoneme: string;
  /** 0..100 — Azure AccuracyScore for this phoneme. */
  score: number;
};

export type WordScore = {
  /** The target word (or empty string when the recognized token was extra). */
  word: string;
  /** What the learner actually said for this slot, if anything. */
  heard: string;
  /** 0..100 — credit earned for this slot. */
  score: number;
  status: WordStatus;
  /** Human-readable, EN/VN, shown only when status is not "correct". */
  hint?: { en: string; vi: string };
  /**
   * Per-phoneme breakdown when the cloud scorer is the source. Empty /
   * undefined when the local Needleman-Wunsch fallback ran (it has no
   * phoneme view).
   */
  phonemes?: PhonemeScore[];
};

export type ScoreFeedback = { en: string; vi: string };

export type ScoreResult = {
  overallScore: number;
  wordScores: WordScore[];
  feedback: ScoreFeedback;
  /**
   * Up to three actionable pronunciation tips tied to the phonemes
   * the learner struggled with on this attempt. Empty when the overall
   * score is high enough that coaching would feel noisy (>= 85) or
   * when no wrong/close word maps to a known L1-interference pattern.
   */
  phonemeFeedback: PhonemeTip[];
};

export type ScoreInput = {
  target: string;
  recognized: string;
  /** Currently unused; kept for future Azure/Speechace phoneme integration. */
  targetPhonemes?: string[];
};

// ────────────────────────────────────────────────────────────────────────
// Tokenisation
// ────────────────────────────────────────────────────────────────────────

function tokenize(s: string): string[] {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[.,;:!?"'()\[\]{}]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// ────────────────────────────────────────────────────────────────────────
// Word-level alignment (Needleman-Wunsch style, simple variant)
// ────────────────────────────────────────────────────────────────────────

type AlignOp = 'match' | 'sub' | 'del' | 'ins';

type AlignmentStep = {
  op: AlignOp;
  targetWord: string;   // '' when op === 'ins'
  heardWord: string;    // '' when op === 'del'
};

/** Levenshtein edit distance between two strings — used for "closeness". */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[] = new Array(rows * cols);
  for (let i = 0; i < rows; i++) dp[i * cols] = i;
  for (let j = 0; j < cols; j++) dp[j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i * cols + j] = Math.min(
        dp[(i - 1) * cols + j] + 1,         // deletion
        dp[i * cols + (j - 1)] + 1,         // insertion
        dp[(i - 1) * cols + (j - 1)] + cost, // substitution
      );
    }
  }
  return dp[rows * cols - 1];
}

/** Build an alignment between target and heard token arrays using DP. */
function alignWords(target: string[], heard: string[]): AlignmentStep[] {
  const T = target.length;
  const H = heard.length;
  const dp: number[] = new Array((T + 1) * (H + 1));
  const W = H + 1;
  for (let i = 0; i <= T; i++) dp[i * W] = i;
  for (let j = 0; j <= H; j++) dp[j] = j;
  for (let i = 1; i <= T; i++) {
    for (let j = 1; j <= H; j++) {
      const cost = target[i - 1] === heard[j - 1] ? 0 : 1;
      dp[i * W + j] = Math.min(
        dp[(i - 1) * W + j] + 1,
        dp[i * W + (j - 1)] + 1,
        dp[(i - 1) * W + (j - 1)] + cost,
      );
    }
  }

  // Backtrack to produce the alignment.
  const steps: AlignmentStep[] = [];
  let i = T;
  let j = H;
  while (i > 0 || j > 0) {
    const here = dp[i * W + j];
    if (i > 0 && j > 0 && dp[(i - 1) * W + (j - 1)] + (target[i - 1] === heard[j - 1] ? 0 : 1) === here) {
      steps.push({
        op: target[i - 1] === heard[j - 1] ? 'match' : 'sub',
        targetWord: target[i - 1],
        heardWord: heard[j - 1],
      });
      i--; j--;
    } else if (i > 0 && dp[(i - 1) * W + j] + 1 === here) {
      steps.push({ op: 'del', targetWord: target[i - 1], heardWord: '' });
      i--;
    } else {
      steps.push({ op: 'ins', targetWord: '', heardWord: heard[j - 1] });
      j--;
    }
  }
  return steps.reverse();
}

// ────────────────────────────────────────────────────────────────────────
// Feedback templates
// ────────────────────────────────────────────────────────────────────────

/** Overall feedback picked from score bands. */
function bandFeedback(score: number): ScoreFeedback {
  if (score >= 90) {
    return {
      en: 'Excellent — clear and natural.',
      vi: 'Tuyệt — phát âm rõ và tự nhiên.',
    };
  }
  if (score >= 75) {
    return {
      en: 'Good — a few sounds need a little polish.',
      vi: 'Tốt — vài âm cần chỉnh lại một chút.',
    };
  }
  if (score >= 55) {
    return {
      en: 'Understandable — work on the words highlighted below.',
      vi: 'Nghe được — luyện thêm những từ được đánh dấu bên dưới.',
    };
  }
  if (score >= 30) {
    return {
      en: 'Keep practising — slow down and focus on each word.',
      vi: 'Tiếp tục luyện — nói chậm lại và tập trung vào từng từ.',
    };
  }
  return {
    en: 'Let\'s try again — listen to the model first, then repeat.',
    vi: 'Thử lại nào — nghe mẫu trước, rồi lặp lại.',
  };
}

// ────────────────────────────────────────────────────────────────────────
// Main scorer
// ────────────────────────────────────────────────────────────────────────

const EXTRA_WORD_PENALTY = 3;  // points off the total per unexpected heard word

/** Overall score at or above this threshold suppresses phoneme coaching. */
const PHONEME_FEEDBACK_THRESHOLD = 85;
/** Hard cap on how many tips we surface in one result. */
const MAX_PHONEME_TIPS = 3;

/**
 * From the per-word scores, pick up to MAX_PHONEME_TIPS distinct
 * PhonemeTips that best explain what went wrong. Prioritises 'wrong'
 * over 'close' (bigger gap first), then preserves ask-order.
 */
function derivePhonemeFeedback(
  overallScore: number,
  wordScores: WordScore[],
): PhonemeTip[] {
  if (overallScore >= PHONEME_FEEDBACK_THRESHOLD) return [];

  const wrong: WordScore[] = [];
  const close: WordScore[] = [];
  for (const w of wordScores) {
    if (w.status === 'wrong' && w.word) wrong.push(w);
    else if (w.status === 'close' && w.word) close.push(w);
  }

  // Walk wrong first, then close, collecting unique phoneme keys.
  const seen = new Set<string>();
  const tips: PhonemeTip[] = [];
  for (const slot of [...wrong, ...close]) {
    if (tips.length >= MAX_PHONEME_TIPS) break;
    const tip = inferPhonemeForWord(slot.word, slot.heard);
    if (!tip) continue;
    if (seen.has(tip.phoneme)) continue;
    seen.add(tip.phoneme);
    tips.push(tip);
  }
  return tips;
}

export function scorePronunciation(input: ScoreInput): ScoreResult {
  const targetTokens = tokenize(input.target);
  const heardTokens = tokenize(input.recognized);

  // Edge case: empty target.
  if (targetTokens.length === 0) {
    return {
      overallScore: 0,
      wordScores: [],
      feedback: {
        en: 'No target sentence provided.',
        vi: 'Chưa có câu mẫu.',
      },
      phonemeFeedback: [],
    };
  }

  // Edge case: nothing recognised.
  if (heardTokens.length === 0) {
    return {
      overallScore: 0,
      wordScores: targetTokens.map((w) => ({
        word: w,
        heard: '',
        score: 0,
        status: 'missed' as WordStatus,
      })),
      feedback: {
        en: 'We didn\'t hear anything — tap Record and try again.',
        vi: 'Chưa nghe thấy gì — bấm Record và thử lại.',
      },
      phonemeFeedback: [],
    };
  }

  const steps = alignWords(targetTokens, heardTokens);
  const wordScores: WordScore[] = [];
  let creditSum = 0;        // sum of 0..1 credits across TARGET words
  let extraCount = 0;

  for (const step of steps) {
    if (step.op === 'match') {
      wordScores.push({
        word: step.targetWord,
        heard: step.heardWord,
        score: 100,
        status: 'correct',
      });
      creditSum += 1;
      continue;
    }
    if (step.op === 'del') {
      // Target word the learner skipped.
      wordScores.push({
        word: step.targetWord,
        heard: '',
        score: 0,
        status: 'missed',
      });
      continue;
    }
    if (step.op === 'ins') {
      // Extra heard word — filler / ASR artefact. Count for penalty but
      // surface it so the UI can show "you also said X".
      wordScores.push({
        word: '',
        heard: step.heardWord,
        score: 0,
        status: 'wrong',
      });
      extraCount++;
      continue;
    }
    // op === 'sub' — closest case: partial credit via vn-phoneme-map.
    const variants = getAcceptedVariants(step.targetWord);
    const hit = variants.find((v) => v.variant === step.heardWord);
    if (hit) {
      const score = Math.round(hit.credit * 100);
      wordScores.push({
        word: step.targetWord,
        heard: step.heardWord,
        score,
        status: 'close',
        hint: hit.rule
          ? { en: hit.rule.labelEn, vi: hit.rule.labelVi }
          : { en: `Close — aim for "${step.targetWord}".`,
              vi: `Gần đúng — hướng đến "${step.targetWord}".` },
      });
      creditSum += hit.credit;
      continue;
    }
    // Fuzzy fallback — single-char Levenshtein still earns a little credit
    // (captures minor mis-recognitions our phoneme map didn't anticipate).
    const dist = levenshtein(step.targetWord, step.heardWord);
    if (dist <= 1 && step.targetWord.length >= 3) {
      const fuzzCredit = 0.5;
      wordScores.push({
        word: step.targetWord,
        heard: step.heardWord,
        score: Math.round(fuzzCredit * 100),
        status: 'close',
        hint: {
          en: `Close — aim for "${step.targetWord}".`,
          vi: `Gần đúng — hướng đến "${step.targetWord}".`,
        },
      });
      creditSum += fuzzCredit;
      continue;
    }
    wordScores.push({
      word: step.targetWord,
      heard: step.heardWord,
      score: 0,
      status: 'wrong',
    });
  }

  const base = (creditSum / targetTokens.length) * 100;
  const overallScore = Math.max(0, Math.min(100, Math.round(base - extraCount * EXTRA_WORD_PENALTY)));

  return {
    overallScore,
    wordScores,
    feedback: bandFeedback(overallScore),
    phonemeFeedback: derivePhonemeFeedback(overallScore, wordScores),
  };
}
