/**
 * Correction Timing Integration
 *
 * Bridges the correctionEngine (what to correct) with
 * teacherMercyCorrectionTiming (when to correct).
 *
 * This is the wiring layer that makes timing decisions
 * actionable in the real correction/conversation flow.
 *
 * Design:
 *   1. Runs the correction engine on learner text.
 *   2. Infers error severity and learner context from the result.
 *   3. Calls the timing decision engine.
 *   4. Returns the correction + a shouldShowNow / shouldDefer flag.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 * The deferred queue is the only stateful piece and is explicit.
 */

import { correctWithTutorRules, type CorrectionEngineResult } from "./correctionEngine";
import type { TutorCorrectionLanguage } from "./correctionEngine";
import {
  decideCorrectionMode,
  type CorrectionTimingInput,
  type CorrectionTimingResult,
  type ErrorSeverity,
} from "./teacherMercyCorrectionTiming";
import { enrichCorrectionExperience, type EnrichedCorrectionContext } from "./correctionExperienceEnricher";

// ─── Severity Inference ────────────────────────────────────────────────────

/**
 * Infer error severity from the correction engine result.
 *
 * Maps the correction engine's applied rule IDs and status
 * to the ErrorSeverity type that the timing engine expects.
 *
 * Precision: rules that signal meaning-loss or lesson-target
 * grammar get higher severity; fluency/calque rules get lower.
 */
export function inferErrorSeverity(result: CorrectionEngineResult): ErrorSeverity {
  if (result.status === "needs_ai") {
    if (result.semanticHint) return "fatal_meaning";
    return "grammar";
  }

  if (result.status === "unchanged") {
    return "minor";
  }

  const ids = result.appliedRuleIds;

  // Fatal meaning: existential-have errors change meaning structure
  if (ids.some((id) => id.includes("existential"))) {
    return "fatal_meaning";
  }

  // Lesson-target-like: past tense, SVA, third-person, preposition patterns are common lesson targets
  if (
    ids.some(
      (id) =>
        id.includes("past") ||
        id.includes("subject-verb") ||
        id.includes("third-person") ||
        id.includes("preposition") ||
        id.includes("tense"),
    )
  ) {
    return "lesson_target";
  }

  // Word choice / collocation errors (calques, unnatural phrasing)
  if (
    ids.some(
      (id) =>
        id.includes("calque") || id.includes("collocation") || id.includes("natural"),
    )
  ) {
    return "word_choice";
  }

  // Minor: capitalization, punctuation, question-mark formatting
  if (
    ids.some(
      (id) =>
        id.includes("capitalization") ||
        id.includes("punctuation") ||
        id.includes("question-form") ||
        id.includes("runon"),
    )
  ) {
    return "minor";
  }

  // Default for corrected sentences: assume grammar-level severity
  if (
    ids.some(
      (id) =>
        id.includes("article") ||
        id.includes("plural") ||
        id.includes("be-") ||
        id.includes("copula") ||
        id.includes("grammar") ||
        id.includes("third-person") ||
        id.includes("possessive") ||
        id.includes("word-order") ||
        id.includes("do-support") ||
        id.includes("yesno") ||
        id.includes("although") ||
        id.includes("because"),
    )
  ) {
    return "grammar";
  }

  // Fluency is the catch-all for corrected sentences without strong signals
  return "fluency";
}

// ─── Confidence Inference ──────────────────────────────────────────────────

/**
 * Infer learner confidence from the raw input text.
 *
 * Heuristics (lightweight, approximate):
 *   - shy: very short answers, hesitation markers, hedging
 *   - confident: longer flowing sentences, no hesitation
 *   - normal: everything else
 */
export function inferLearnerConfidence(
  text: string,
): "shy" | "normal" | "confident" {
  const trimmed = text.trim();
  if (!trimmed) return "normal";

  const words = trimmed.split(/\s+/).length;

  if (words <= 3 || /\.\.\./.test(trimmed) || /\b(?:maybe|perhaps)\b/i.test(trimmed)) {
    return "shy";
  }

  if (words >= 10 && !/[.]{2,}/.test(trimmed)) {
    return "confident";
  }

  return "normal";
}

// ─── Self-Correction Detection ─────────────────────────────────────────────

/**
 * Detect whether the learner likely self-corrected within their input.
 *
 * Signals:
 *   - Word repetition (typing the same word twice suggests an edit)
 *   - Ellipsis (pause mid-edit: "I buy... I bought")
 *   - Explicit markers ("I mean", "sorry", "no wait", "actually")
 */
export function detectSelfCorrectionInText(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  // Word repetition (e.g., "I I bought a hat")
  const words = trimmed.split(/\s+/);
  for (let i = 1; i < words.length; i++) {
    if (words[i].toLowerCase() === words[i - 1].toLowerCase()) return true;
  }

  // Ellipsis suggests mid-edit pause
  if (/\.{2,}/.test(trimmed)) return true;

  // Explicit markers
  if (/\b(?:I mean|sorry|no wait|actually)\b/i.test(trimmed)) return true;

  return false;
}

// ─── Integration Types ─────────────────────────────────────────────────────

export type TimingIntegrationInput = {
  /** The learner's raw text input. */
  learnerText: string;
  /** The target language (must match correctionEngine's TutorCorrectionLanguage). */
  targetLanguage: TutorCorrectionLanguage;
  /** Known CEFR level (optional). */
  cefrLevel?: string | null;
  /** Whether this error is on the current lesson's target skill. */
  isCurrentLessonTarget?: boolean;
  /** How many times this same mistake pattern has appeared recently. */
  sameMistakeCount?: number;
  /** Total corrections delivered in this session so far. */
  previousCorrectionsThisSession?: number;
};

export type TimingIntegrationResult = {
  /** The raw correction engine result. */
  correction: CorrectionEngineResult;
  /** The timing decision. */
  timing: CorrectionTimingResult;
  /** Whether the correction should be shown to the learner now. */
  shouldShowNow: boolean;
  /** Whether the correction should be deferred to a future turn. */
  shouldDefer: boolean;
  /** Whether the correction should be suppressed entirely. */
  shouldSuppress: boolean;
  /**
   * Teacher-quality enrichment context: weakness memory tags and
   * Vietnamese interference category derived from the applied rules.
   * null when no rules fired (unchanged/needs_ai without rule matches).
   */
  enrichment: EnrichedCorrectionContext | null;
};

// ─── Core Integration ──────────────────────────────────────────────────────

/**
 * Run the correction engine with timing awareness.
 *
 * 1. Runs correctionEngine.correctWithTutorRules on the learner text.
 * 2. Infers error severity, confidence, and self-correction from the result.
 * 3. Calls teacherMercyCorrectionTiming.decideCorrectionMode.
 * 4. Returns the correction + display flags.
 *
 * Pure function — deterministic, no side effects.
 */
export function correctWithTimingAwareness(
  input: TimingIntegrationInput,
): TimingIntegrationResult {
  const correction = correctWithTutorRules(input.learnerText, input.targetLanguage);

  const errorSeverity = inferErrorSeverity(correction);
  const learnerConfidence = inferLearnerConfidence(input.learnerText);
  const didSelfCorrect = detectSelfCorrectionInText(input.learnerText);

  const timingInput: CorrectionTimingInput = {
    learnerText: input.learnerText,
    cefrLevel: input.cefrLevel ?? null,
    errorSeverity,
    isCurrentLessonTarget: input.isCurrentLessonTarget ?? false,
    sameMistakeCount: input.sameMistakeCount ?? 1,
    learnerConfidence,
    didSelfCorrect,
    previousCorrectionsThisSession: input.previousCorrectionsThisSession ?? 0,
  };

  const timing = decideCorrectionMode(timingInput);

  // Enrich the correction with weakness memory tags and Vietnamese interference
  // context. Only enrich when rules actually fired and produced a correction —
  // unchanged/needs_ai results get null enrichment (no patterns to tag).
  const enrichment =
    correction.status === "corrected" && correction.appliedRuleIds.length > 0
      ? enrichCorrectionExperience(
          correction.appliedRuleIds,
          correction.corrected,
        )
      : null;

  return {
    correction,
    timing,
    shouldShowNow:
      timing.mode === "IMMEDIATE" || timing.mode === "EXPLAIN_PATTERN",
    shouldDefer:
      timing.mode === "DELAYED" || timing.mode === "FOLLOW_UP_FIRST",
    shouldSuppress: timing.mode === "SUPPRESS",
    enrichment,
  };
}

// ─── Deferred Correction Queue ─────────────────────────────────────────────

export type DeferredCorrection = {
  /** The learner's original text. */
  learnerText: string;
  /** The corrected text (when available). */
  correctedText: string;
  /** The timing decision that led to deferral. */
  timing: CorrectionTimingResult;
  /** Turns remaining before surfacing this correction. */
  remainingTurns: number;
};

export type DeferredCorrectionQueue = {
  /** Enqueue a correction for later display. */
  enqueue: (item: DeferredCorrection) => void;
  /**
   * Advance by one turn. Returns corrections whose remainingTurns has
   * reached 0 — these are now due to be shown.
   */
  advanceTurn: () => DeferredCorrection[];
  /** All currently pending (not yet due) deferred corrections. */
  pending: () => DeferredCorrection[];
  /** Number of pending deferred corrections. */
  size: () => number;
  /** Clear all deferred corrections. */
  clear: () => void;
};

/**
 * Create a deferred correction queue.
 *
 * Corrections whose timing decision says DELAYED or FOLLOW_UP_FIRST
 * are enqueued here. Each call to advanceTurn() decrements their
 * remaining turns; those reaching 0 are returned as "due."
 *
 * The caller (page/component) owns when to advance turns and how
 * to surface due corrections.
 */
export function createDeferredCorrectionQueue(): DeferredCorrectionQueue {
  let queue: DeferredCorrection[] = [];

  return {
    enqueue(item: DeferredCorrection) {
      queue.push(item);
    },

    advanceTurn(): DeferredCorrection[] {
      for (const item of queue) {
        item.remainingTurns -= 1;
      }
      const due = queue.filter((item) => item.remainingTurns <= 0);
      queue = queue.filter((item) => item.remainingTurns > 0);
      return due;
    },

    pending(): DeferredCorrection[] {
      return [...queue];
    },

    size(): number {
      return queue.length;
    },

    clear() {
      queue = [];
    },
  };
}

// ─── Page-Level Convenience ────────────────────────────────────────────────

/**
 * Build a human-readable message for suppressed corrections.
 * Shown instead of the correction card when timing says SUPPRESS.
 */
export function buildSuppressMessage(
  timing: CorrectionTimingResult,
  explainLanguage: "vi" | "en",
): string {
  if (explainLanguage === "vi") {
    return "Mercy thấy câu này có vài điểm nhỏ, nhưng không đáng để sửa ngay — mình tiếp tục nói tự nhiên nhé.";
  }
  return "I noticed a small thing in that sentence, but it's not important enough to correct right now — let's keep the conversation going.";
}

/**
 * Build a human-readable message for a deferred correction
 * that is now being surfaced after its delay period.
 */
export function buildDeferredSurfacingMessage(
  correctedText: string,
  explainLanguage: "vi" | "en",
): string {
  if (explainLanguage === "vi") {
    return `Mercy có một gợi ý nhỏ từ câu trước: "${correctedText}" — bạn thấy cách nói này tự nhiên hơn không?`;
  }
  return `A quick note from earlier: "${correctedText}" — does that sound more natural?`;
}
