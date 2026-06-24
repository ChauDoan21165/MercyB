/**
 * Teacher Mercy — Correction Timing Intelligence Layer
 *
 * Decides WHEN (not how) Teacher Mercy corrects a learner error.
 * The output feeds the Teacher Mercy contract (teacherMercyContract.ts)
 * and rubric (teacherMercyRubric.ts) — this module chooses the mode;
 * the contract/rubric validate the resulting response.
 *
 * This module implements the Step 4 requirement:
 *   "decides when to correct immediately, when to continue conversation,
 *    and when to save correction for later"
 *
 * Design principles:
 *   1. Meaning first — fatal meaning errors always get IMMEDIATE attention.
 *   2. One thing at a time — one correction, even in timing decisions.
 *   3. Learner-aware — shy learners need different timing than confident ones.
 *   4. Pattern over instance — repeated mistakes get EXPLAIN_PATTERN, not yet another correction.
 *   5. Self-correction space — when a learner can self-correct, give them room.
 *
 * This file does NOT duplicate the contract or rubric.
 * It produces a CorrectionMode that upstream callers use to shape their response.
 *
 * Pure functions — no I/O, no side effects, no production flags, deterministic.
 */

import type { ContractLearnerInput } from "./teacherMercyContract";

// ─── Correction Modes ────────────────────────────────────────────────────

/**
 * The five correction modes Teacher Mercy can choose from.
 *
 * IMMEDIATE      — correct right now, in this turn.
 * DELAYED        — note the error but correct in a future turn.
 * SUPPRESS       — don't correct; the cost of interrupting outweighs the benefit.
 * FOLLOW_UP_FIRST — ask a follow-up question first; if the learner self-corrects, no explicit correction needed.
 * EXPLAIN_PATTERN — explain the underlying pattern (rule/system), not just this one instance.
 */
export type CorrectionMode =
  | "IMMEDIATE"
  | "DELAYED"
  | "SUPPRESS"
  | "FOLLOW_UP_FIRST"
  | "EXPLAIN_PATTERN";

// ─── Input Types ─────────────────────────────────────────────────────────

/**
 * The severity of an error detected in the learner's text.
 *
 * fatal_meaning  — the meaning is lost or changed (e.g., "head" vs "hat").
 * lesson_target  — the error is on the exact grammar/vocab point being taught.
 * grammar        — a grammar error that doesn't break meaning.
 * fluency        — the sentence is understandable but slightly unnatural.
 * word_choice    — a word is not quite right but meaning is clear.
 * minor          — tiny slip (capitalization, missing article in a long sentence).
 */
export type ErrorSeverity =
  | "fatal_meaning"
  | "lesson_target"
  | "grammar"
  | "fluency"
  | "word_choice"
  | "minor";

/**
 * The learner's apparent confidence/comfort level in this turn.
 *
 * shy       — hesitant, short answers, many pauses/self-edits.
 * normal    — typical learner comfort.
 * confident — flowing, willing to take risks.
 */
export type LearnerConfidence = "shy" | "normal" | "confident";

/**
 * Context for the correction timing decision.
 *
 * Extends ContractLearnerInput with error-specific and session-history fields.
 */
export type CorrectionTimingInput = {
  /** The learner's raw text (from ContractLearnerInput). */
  learnerText: string;
  /** The learner's CEFR level, if known. */
  cefrLevel: string | null;
  /** The severity of the detected error. */
  errorSeverity: ErrorSeverity;
  /** Whether this error is on the current lesson's target skill. */
  isCurrentLessonTarget: boolean;
  /** How many times this exact same mistake has appeared in recent turns (1+). */
  sameMistakeCount: number;
  /** The learner's apparent confidence in this exchange. */
  learnerConfidence: LearnerConfidence;
  /** Whether the learner self-corrected in this turn. */
  didSelfCorrect: boolean;
  /** Total corrections already delivered in this session (not just this turn). */
  previousCorrectionsThisSession: number;
};

// ─── Output Types ────────────────────────────────────────────────────────

/**
 * The timing decision with full rationale.
 */
export type CorrectionTimingResult = {
  /** The chosen correction mode. */
  mode: CorrectionMode;
  /**
   * Human-readable reason for the decision, in English (for telemetry/logging).
   * Vietnamese-facing explanations belong in the response generation layer.
   */
  reason: string;
  /**
   * Machine-readable reason code for telemetry/analytics.
   */
  reasonCode: string;
  /**
   * For DELAYED mode: how many turns to wait before surfacing the correction.
   * undefined for all other modes.
   */
  delayTurns?: number;
  /**
   * For EXPLAIN_PATTERN mode: the repeated error pattern to explain.
   * undefined for all other modes.
   */
  patternLabel?: string;
  /**
   * Whether this mode is compatible with the "one correction max" contract rule.
   * Always true — this layer enforces it at the decision level.
   */
  respectsOneCorrectionMax: boolean;
};

// ─── CEFR Level Utilities ────────────────────────────────────────────────

/**
 * Whether the learner is at an advanced level (B2+).
 * Advanced learners benefit more from self-correction opportunities
 * and pattern explanations than from explicit corrections.
 */
function isAdvancedLevel(cefrLevel: string | null): boolean {
  if (!cefrLevel) return false;
  const upper = cefrLevel.toUpperCase();
  return upper === "B2" || upper === "C1" || upper === "C2";
}

/**
 * Whether the learner is at a beginner level (A1–A2).
 * Beginners need more explicit, immediate correction to avoid fossilizing errors.
 */
function isBeginnerLevel(cefrLevel: string | null): boolean {
  if (!cefrLevel) return true; // assume beginner when unknown — safer
  const upper = cefrLevel.toUpperCase();
  return upper === "A1" || upper === "A2";
}

// ─── Core Decision Logic ─────────────────────────────────────────────────

/**
 * T1 — Fatal meaning error gate.
 *
 * If the learner's intended meaning is lost or changed, correction is
 * ALWAYS immediate. There is no scenario where misunderstood meaning
 * should be delayed. This is the highest-priority gate.
 *
 * Examples: "I buy a head" (intended: hat), "He is a cooker" (intended: cook).
 */
function checkFatalMeaningGate(input: CorrectionTimingInput): CorrectionTimingResult | null {
  if (input.errorSeverity !== "fatal_meaning") return null;

  return {
    mode: "IMMEDIATE",
    reason: "Fatal meaning error — the learner's intended meaning is lost. Must correct immediately to prevent misunderstanding.",
    reasonCode: "fatal_meaning_must_correct",
    respectsOneCorrectionMax: true,
  };
}

/**
 * T2 — Current lesson target gate.
 *
 * If the error is on the exact skill being taught in this lesson,
 * correction must be immediate. Letting a lesson-target error slide
 * undermines the entire lesson.
 *
 * Example: lesson = past tense, learner says "I go yesterday".
 */
function checkLessonTargetGate(input: CorrectionTimingInput): CorrectionTimingResult | null {
  if (!input.isCurrentLessonTarget) return null;

  // Even for shy learners, lesson-target errors need correction.
  // Use EXPLAIN_PATTERN for repeated mistakes on the lesson target.
  if (input.sameMistakeCount >= 3) {
    return {
      mode: "EXPLAIN_PATTERN",
      reason: `Lesson target error repeated ${input.sameMistakeCount} times — explain the pattern, not just this instance.`,
      reasonCode: "lesson_target_explain_pattern",
      patternLabel: `lesson-target:${input.errorSeverity}`,
      respectsOneCorrectionMax: true,
    };
  }

  return {
    mode: "IMMEDIATE",
    reason: "Error is on the current lesson's target skill — must correct immediately to reinforce the lesson.",
    reasonCode: "lesson_target_immediate",
    respectsOneCorrectionMax: true,
  };
}

/**
 * T3 — Repeated mistake gate.
 *
 * If the same mistake has appeared >= 3 times in recent history,
 * switch from instance-correction to pattern-explanation.
 * Repeated corrections of the same thing are demotivating;
 * explaining the pattern once is more effective.
 */
function checkRepeatedMistakeGate(input: CorrectionTimingInput): CorrectionTimingResult | null {
  if (input.sameMistakeCount < 3) return null;

  return {
    mode: "EXPLAIN_PATTERN",
    reason: `Same mistake repeated ${input.sameMistakeCount} times — explain the underlying pattern instead of correcting again.`,
    reasonCode: "repeated_explain_pattern",
    patternLabel: input.errorSeverity,
    respectsOneCorrectionMax: true,
  };
}

/**
 * T4 — Self-correction opportunity gate.
 *
 * If the learner has shown signs of self-correction (paused, rephrased,
 * or the error is at a level they've previously self-corrected),
 * give them FOLLOW_UP_FIRST space to self-correct.
 *
 * Suppress for very minor errors — the learner might already know.
 */
function checkSelfCorrectionOpportunityGate(
  input: CorrectionTimingInput,
): CorrectionTimingResult | null {
  if (!input.didSelfCorrect) return null;

  // If the learner already self-corrected in this turn and the error
  // is minor, suppress — they've already done the work.
  if (input.errorSeverity === "minor" || input.errorSeverity === "fluency") {
    return {
      mode: "SUPPRESS",
      reason: "Learner self-corrected in this turn and the remaining error is minor — don't interrupt their flow.",
      reasonCode: "self_corrected_minor_suppress",
      respectsOneCorrectionMax: true,
    };
  }

  // For more significant errors after self-correction, use FOLLOW_UP_FIRST
  // to give them another chance before explicit correction.
  return {
    mode: "FOLLOW_UP_FIRST",
    reason: "Learner self-corrected — ask a follow-up first to see if they can also fix this remaining issue.",
    reasonCode: "self_correction_follow_up_first",
    respectsOneCorrectionMax: true,
  };
}

/**
 * T5 — Shy / low-confidence learner gate.
 *
 * Shy learners need encouragement, not correction firehose.
 * Suppress minor corrections entirely. For grammar/fluency errors,
 * use FOLLOW_UP_FIRST to gently guide rather than explicitly correct.
 */
function checkShyLearnerGate(input: CorrectionTimingInput): CorrectionTimingResult | null {
  if (input.learnerConfidence !== "shy") return null;

  // Minor errors: suppress — the confidence cost of correcting > the learning benefit
  if (input.errorSeverity === "minor" || input.errorSeverity === "fluency") {
    return {
      mode: "SUPPRESS",
      reason: "Shy learner with minor/fluency error — suppressing to protect confidence. The error doesn't impede communication.",
      reasonCode: "shy_learner_suppress_minor",
      respectsOneCorrectionMax: true,
    };
  }

  // Word choice errors: use FOLLOW_UP_FIRST — rephrase as a question
  if (input.errorSeverity === "word_choice") {
    return {
      mode: "FOLLOW_UP_FIRST",
      reason: "Shy learner with word choice error — use a follow-up question to model the correct word naturally.",
      reasonCode: "shy_learner_follow_up_first",
      respectsOneCorrectionMax: true,
    };
  }

  // Grammar errors for shy learners: still correct, but DELAYED by 1 turn
  // to avoid the feeling of being jumped on
  if (input.errorSeverity === "grammar") {
    return {
      mode: "DELAYED",
      reason: "Shy learner with grammar error — delay 1 turn so correction feels more conversational.",
      reasonCode: "shy_learner_delayed_grammar",
      delayTurns: 1,
      respectsOneCorrectionMax: true,
    };
  }

  // Fatal meaning and lesson target are already handled by T1/T2 gates.
  return null;
}

/**
 * T6 — Advanced learner gate.
 *
 * Advanced learners (B2+) benefit more from self-discovery than explicit correction.
 * For minor/fluency/word-choice errors, SUPPRESS or FOLLOW_UP_FIRST.
 * For grammar errors they "should" know, FOLLOW_UP_FIRST prompts self-correction.
 */
function checkAdvancedLearnerGate(input: CorrectionTimingInput): CorrectionTimingResult | null {
  if (!isAdvancedLevel(input.cefrLevel)) return null;

  // Minor/fluency — suppress; advanced learners know these are slips
  if (input.errorSeverity === "minor" || input.errorSeverity === "fluency") {
    return {
      mode: "SUPPRESS",
      reason: `Advanced learner (${input.cefrLevel}) with minor/fluency error — likely a slip, not a knowledge gap. Suppressing.`,
      reasonCode: "advanced_learner_suppress_minor",
      respectsOneCorrectionMax: true,
    };
  }

  // Word choice / grammar — use FOLLOW_UP_FIRST to prompt self-correction
  if (input.errorSeverity === "word_choice" || input.errorSeverity === "grammar") {
    return {
      mode: "FOLLOW_UP_FIRST",
      reason: `Advanced learner (${input.cefrLevel}) — use follow-up question to prompt self-correction before explicit correction.`,
      reasonCode: "advanced_learner_follow_up_first",
      respectsOneCorrectionMax: true,
    };
  }

  return null;
}

/**
 * T7 — Session correction load gate.
 *
 * If we've already corrected a lot in this session, be more conservative.
 * Too many corrections in one session becomes demotivating.
 */
function checkSessionCorrectionLoadGate(
  input: CorrectionTimingInput,
): CorrectionTimingResult | null {
  // If < 5 corrections so far, no load concern
  if (input.previousCorrectionsThisSession < 5) return null;

  // If already corrected a lot (5+), suppress minor/fluency errors
  if (input.errorSeverity === "minor" || input.errorSeverity === "fluency") {
    return {
      mode: "SUPPRESS",
      reason: `Already ${input.previousCorrectionsThisSession} corrections in this session — suppressing minor error to avoid overcorrection fatigue.`,
      reasonCode: "session_correction_load_suppress",
      respectsOneCorrectionMax: true,
    };
  }

  // If many corrections (8+), delay even word-choice/grammar
  if (
    input.previousCorrectionsThisSession >= 8 &&
    (input.errorSeverity === "word_choice" || input.errorSeverity === "grammar")
  ) {
    return {
      mode: "DELAYED",
      reason: `Already ${input.previousCorrectionsThisSession} corrections — delaying to avoid overcorrection fatigue.`,
      reasonCode: "session_correction_load_delayed",
      delayTurns: 2,
      respectsOneCorrectionMax: true,
    };
  }

  return null;
}

/**
 * T8 — Beginner learner gate.
 *
 * Beginners (A1–A2) need more explicit, immediate feedback to prevent
 * fossilized errors. But still don't overcorrect minor slips.
 */
function checkBeginnerLearnerGate(input: CorrectionTimingInput): CorrectionTimingResult | null {
  if (!isBeginnerLevel(input.cefrLevel)) return null;

  // For beginners, grammar errors should be immediate (unless shy)
  if (input.errorSeverity === "grammar" && input.learnerConfidence !== "shy") {
    return {
      mode: "IMMEDIATE",
      reason: `Beginner learner (${input.cefrLevel ?? "unknown"}) with grammar error — correct immediately to prevent fossilization.`,
      reasonCode: "beginner_grammar_immediate",
      respectsOneCorrectionMax: true,
    };
  }

  // For beginners, minor/fluency errors can be DELAYED — focus on grammar first
  if (input.errorSeverity === "minor" || input.errorSeverity === "fluency") {
    return {
      mode: "DELAYED",
      reason: `Beginner learner — delay minor/fluency correction to focus on grammar and meaning first.`,
      reasonCode: "beginner_minor_delayed",
      delayTurns: 2,
      respectsOneCorrectionMax: true,
    };
  }

  return null;
}

// ─── Default Fallback ────────────────────────────────────────────────────

/**
 * Default timing decision when no specific gate fires.
 * Err on the side of IMMEDIATE for grammar/word_choice (correct while fresh),
 * SUPPRESS for minor (don't interrupt flow).
 */
function defaultTiming(input: CorrectionTimingInput): CorrectionTimingResult {
  switch (input.errorSeverity) {
    case "grammar":
      return {
        mode: "IMMEDIATE",
        reason: "Grammar error — correcting while the context is fresh in the learner's mind.",
        reasonCode: "default_grammar_immediate",
        respectsOneCorrectionMax: true,
      };
    case "word_choice":
      return {
        mode: "IMMEDIATE",
        reason: "Word choice error — offering a more natural alternative right away helps the learner connect it to their intention.",
        reasonCode: "default_word_choice_immediate",
        respectsOneCorrectionMax: true,
      };
    case "fluency":
      return {
        mode: "DELAYED",
        reason: "Fluency issue — the meaning is clear. Delay so the learner can focus on communicating first.",
        reasonCode: "default_fluency_delayed",
        delayTurns: 2,
        respectsOneCorrectionMax: true,
      };
    case "minor":
      return {
        mode: "SUPPRESS",
        reason: "Minor error — not worth interrupting the learner's communication flow.",
        reasonCode: "default_minor_suppress",
        respectsOneCorrectionMax: true,
      };
    default:
      // All fatal_meaning and lesson_target are caught by T1/T2 gates above.
      return {
        mode: "IMMEDIATE",
        reason: "Default: error should be addressed while fresh.",
        reasonCode: "default_immediate",
        respectsOneCorrectionMax: true,
      };
  }
}

// ─── Public API ──────────────────────────────────────────────────────────

/**
 * The ordered list of gates that determine correction timing.
 * Gates are evaluated in order; the first non-null result wins.
 * This ordering reflects the priority hierarchy:
 *
 *   1. Fatal meaning — always immediate (T1)
 *   2. Lesson target — always immediate (T2)
 *   3. Repeated mistake — explain pattern (T3)
 *   4. Self-correction opportunity — follow-up or suppress (T4)
 *   5. Shy learner — protect confidence (T5)
 *   6. Advanced learner — prompt self-discovery (T6)
 *   7. Session correction load — avoid fatigue (T7)
 *   8. Beginner learner — prevent fossilization (T8)
 *   9. Default — sensible fallback
 */
const GATES: ReadonlyArray<
  (input: CorrectionTimingInput) => CorrectionTimingResult | null
> = [
  checkFatalMeaningGate,
  checkLessonTargetGate,
  checkRepeatedMistakeGate,
  checkSelfCorrectionOpportunityGate,
  checkShyLearnerGate,
  checkAdvancedLearnerGate,
  checkSessionCorrectionLoadGate,
  checkBeginnerLearnerGate,
];

/**
 * Decide the correction mode for a given learner context.
 *
 * Pure function — deterministic, no side effects, no I/O.
 *
 * @returns A CorrectionTimingResult with the chosen mode and rationale.
 *          The mode always respects the "one correction max" contract rule
 *          at the decision level (upstream callers still validate via the contract).
 */
export function decideCorrectionMode(
  input: CorrectionTimingInput,
): CorrectionTimingResult {
  for (const gate of GATES) {
    const result = gate(input);
    if (result !== null) return result;
  }

  return defaultTiming(input);
}

/**
 * Convenience: build a CorrectionTimingInput from the contract's
 * ContractLearnerInput plus error/session context.
 *
 * This bridges the contract layer (Step 2) to the timing layer (Step 4).
 */
export function buildTimingInput(
  learnerInput: ContractLearnerInput,
  options: {
    errorSeverity: ErrorSeverity;
    isCurrentLessonTarget: boolean;
    sameMistakeCount: number;
    learnerConfidence: LearnerConfidence;
    previousCorrectionsThisSession: number;
  },
): CorrectionTimingInput {
  return {
    learnerText: learnerInput.text,
    cefrLevel: learnerInput.cefrLevel,
    errorSeverity: options.errorSeverity,
    isCurrentLessonTarget: options.isCurrentLessonTarget,
    sameMistakeCount: options.sameMistakeCount,
    learnerConfidence: options.learnerConfidence,
    didSelfCorrect: learnerInput.didSelfCorrect,
    previousCorrectionsThisSession: options.previousCorrectionsThisSession,
  };
}

/**
 * Check whether a given correction mode is compatible with
 * the "meaning first" contract rule (R1).
 *
 * IMMEDIATE: must ensure acknowledgment happens first (contract enforces this).
 * DELAYED: naturally compatible — correction comes after conversation.
 * SUPPRESS: trivially compatible — no correction to position.
 * FOLLOW_UP_FIRST: naturally compatible — question comes before correction.
 * EXPLAIN_PATTERN: requires acknowledgment before explanation.
 */
export function isModeCompatibleWithMeaningFirst(mode: CorrectionMode): boolean {
  // All modes can be made compatible with meaning-first.
  // IMMEDIATE is the only one that requires care — the contract's R1
  // rule validates that acknowledgment precedes correction in the response text.
  return true;
}

/**
 * Report whether the current correction would be the sole correction
 * in this turn. The timing layer always respects the one-correction-max
 * principle at the decision level — it never produces more than one
 * correction decision per invocation.
 */
export function assertOneCorrectionPerDecision(
  result: CorrectionTimingResult,
): boolean {
  return result.respectsOneCorrectionMax;
}

// ─── Catalog ─────────────────────────────────────────────────────────────

export const CORRECTION_TIMING_MODE_CATALOG: ReadonlyArray<{
  mode: CorrectionMode;
  titleEn: string;
  titleVi: string;
  descriptionVi: string;
  examples: string;
}> = [
  {
    mode: "IMMEDIATE",
    titleEn: "Immediate correction",
    titleVi: "Sửa ngay",
    descriptionVi: "Sửa lỗi ngay trong lượt này — lỗi làm thay đổi nghĩa hoặc đúng mục tiêu bài học.",
    examples: "fatal meaning error, lesson target error, beginner grammar error",
  },
  {
    mode: "DELAYED",
    titleEn: "Delayed correction",
    titleVi: "Sửa sau",
    descriptionVi: "Ghi nhận lỗi nhưng để dành sửa trong lượt sau — giữ cuộc trò chuyện tự nhiên.",
    examples: "minor fluency issue, high session correction load, shy learner grammar",
  },
  {
    mode: "SUPPRESS",
    titleEn: "Suppress correction",
    titleVi: "Không sửa",
    descriptionVi: "Không sửa lỗi này — lợi ích sửa không đáng để cắt ngang hoặc làm giảm tự tin.",
    examples: "minor slip, shy learner minor error, advanced learner fluency slip, already many corrections",
  },
  {
    mode: "FOLLOW_UP_FIRST",
    titleEn: "Follow-up first",
    titleVi: "Hỏi trước, sửa sau",
    descriptionVi: "Hỏi một câu nối tiếp trước khi sửa — cho người học cơ hội tự sửa.",
    examples: "self-correction opportunity, advanced learner word choice, shy learner word choice",
  },
  {
    mode: "EXPLAIN_PATTERN",
    titleEn: "Explain pattern",
    titleVi: "Giải thích quy luật",
    descriptionVi: "Không sửa từng lỗi một — giải thích quy luật ngữ pháp/từ vựng đằng sau.",
    examples: "same mistake repeated ≥ 3 times, lesson target error repeated",
  },
];

export const CORRECTION_TIMING_ERROR_SEVERITY_CATALOG: ReadonlyArray<{
  severity: ErrorSeverity;
  titleVi: string;
  titleEn: string;
  defaultMode: CorrectionMode;
  descriptionVi: string;
}> = [
  {
    severity: "fatal_meaning",
    titleVi: "Lỗi nghĩa nghiêm trọng",
    titleEn: "Fatal meaning error",
    defaultMode: "IMMEDIATE",
    descriptionVi: "Nghĩa bị thay đổi hoàn toàn — phải sửa ngay không chần chừ.",
  },
  {
    severity: "lesson_target",
    titleVi: "Lỗi mục tiêu bài học",
    titleEn: "Lesson target error",
    defaultMode: "IMMEDIATE",
    descriptionVi: "Lỗi đúng vào điểm ngữ pháp/từ vựng đang học — sửa ngay để củng cố bài học.",
  },
  {
    severity: "grammar",
    titleVi: "Lỗi ngữ pháp",
    titleEn: "Grammar error",
    defaultMode: "IMMEDIATE",
    descriptionVi: "Lỗi ngữ pháp không làm thay đổi nghĩa — sửa khi phù hợp với người học.",
  },
  {
    severity: "fluency",
    titleVi: "Lỗi tự nhiên",
    titleEn: "Fluency error",
    defaultMode: "DELAYED",
    descriptionVi: "Câu hiểu được nhưng chưa tự nhiên — để dành sửa sau, ưu tiên giao tiếp trước.",
  },
  {
    severity: "word_choice",
    titleVi: "Lỗi chọn từ",
    titleEn: "Word choice error",
    defaultMode: "IMMEDIATE",
    descriptionVi: "Từ chưa chính xác nhưng nghĩa vẫn rõ — sửa nhẹ nhàng.",
  },
  {
    severity: "minor",
    titleVi: "Lỗi nhỏ",
    titleEn: "Minor error",
    defaultMode: "SUPPRESS",
    descriptionVi: "Lỗi rất nhỏ không ảnh hưởng giao tiếp — thường không cần sửa.",
  },
];
