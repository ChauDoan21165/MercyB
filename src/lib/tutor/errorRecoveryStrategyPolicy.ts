/**
 * Teacher Mercy — Error Recovery Strategy Selector
 *
 * Decides WHICH pedagogical strategy Teacher Mercy should use to help a
 * learner recover from an error.
 *
 * A strong human teacher doesn't use the same recovery method for every
 * error — they choose the strategy based on the learner's state, the
 * error's nature, and the session context:
 *
 *   DIRECT_CORRECTION       — "You said X, the right way is Y."
 *   GUIDED_RECOVERY         — "Let's think about this. Look at the verb..."
 *   ELICITED_RECOVERY       — "Can you find what needs to change?"
 *   DEFERRED_RECOVERY       — "I noticed something. Let's come back."
 *   PATTERN_BASED_RECOVERY  — "Here's the rule, now try applying it."
 *   NO_RECOVERY             — Not worth interrupting the flow.
 *
 * This module answers a different question than the other policies:
 *   Correction timing  = WHEN to intervene
 *   Suppression rules  = WHAT not to correct
 *   Hint ladder        = WHETHER to hint and HOW STRONG
 *   Drill timing       = WHEN to launch drills
 *   Challenge timing   = WHEN to launch challenges
 *   Encouragement timing = WHEN to deliver encouragement
 *   Error recovery     = WHICH pedagogical METHOD to use
 *
 * Design principles:
 *   1. Method matches learner — shy learners need GUIDED; advanced learners
 *      get ELICITED. The same error at the same time could get different
 *      strategies for different learners.
 *   2. Method escalates with recurrence — first occurrence may get DIRECT;
 *      third occurrence should get PATTERN_BASED because direct didn't stick.
 *   3. Method respects emotional state — frustration blocks all but
 *      DEFERRED_RECOVERY. The relationship matters more than the error.
 *   4. Method considers session arc — early errors get gentler recovery
 *      to build trust; late errors can be more direct.
 *   5. Method is Vietnamese-first — all rationale is produced in Vietnamese
 *      for the learner-facing layer; English rationale is for telemetry.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

import type { ErrorSeverity, LearnerConfidence } from "./teacherMercyCorrectionTiming";

// ─── Error Recovery Strategy Types ──────────────────────────────────────────

/**
 * The six error recovery strategies Teacher Mercy can choose from.
 *
 * DIRECT_CORRECTION       — Show the correct form immediately. Authoritative,
 *                           efficient, unambiguous. Best for fatal errors and
 *                           beginners who need clarity.
 *
 * GUIDED_RECOVERY         — Lead the learner step by step toward the correct
 *                           form. "Let's look at this word... what tense should
 *                           this be?" Preserves learner agency while providing
 *                           structure.
 *
 * ELICITED_RECOVERY       — Ask a question that prompts the learner to find
 *                           the error themselves. "Can you spot what needs to
 *                           change in that sentence?" For confident/advanced
 *                           learners who have the knowledge.
 *
 * DEFERRED_RECOVERY       — Note the error but address it later. "I noticed
 *                           something — let's come back to it after you finish
 *                           your thought." For when correction now would break
 *                           flow, confidence, or momentum.
 *
 * PATTERN_BASED_RECOVERY  — Teach the underlying rule/pattern, then have the
 *                           learner self-apply it. "Remember the third-person
 *                           -s rule: 'he goes', not 'he go'. Try your sentence
 *                           again." Best for recurring errors where direct
 *                           correction didn't stick.
 *
 * NO_RECOVERY             — Don't address this error at all. The pedagogical
 *                           cost of interrupting outweighs any learning benefit.
 *                           Appropriate for minor slips, session overload, or
 *                           advanced-experimentation patterns.
 */
export type ErrorRecoveryStrategy =
  | "DIRECT_CORRECTION"
  | "GUIDED_RECOVERY"
  | "ELICITED_RECOVERY"
  | "DEFERRED_RECOVERY"
  | "PATTERN_BASED_RECOVERY"
  | "NO_RECOVERY";

/**
 * Input context for the error recovery strategy decision.
 */
export type ErrorRecoveryInput = {
  /** The severity of the error under consideration. */
  errorSeverity: ErrorSeverity;
  /** Known CEFR level (null = unknown, treated as beginner). */
  cefrLevel: string | null;
  /** The learner's apparent confidence level. */
  learnerConfidence: LearnerConfidence;
  /** Whether the error is on the current lesson's target skill. */
  isCurrentLessonTarget: boolean;
  /** How many times the same error pattern has appeared in recent turns (1+). */
  recurringErrorCount: number;
  /** Whether the learner showed self-correction awareness (hesitation, pause, retry). */
  hasSelfCorrectionAwareness: boolean;
  /** Whether the learner is showing frustration signals. */
  isShowingFrustration: boolean;
  /** Total conversation turns in this session so far. */
  totalTurnsInSession: number;
  /** Total corrections delivered in this session so far. */
  correctionsThisSession: number;
  /** How many turns since the same error was last addressed (Infinity if first occurrence). */
  turnsSinceLastRecovery: number;
  /** Whether the previous recovery attempt on this error pattern was successful. */
  previousRecoveryWorked: boolean;
  /** The last recovery strategy used (null if no recovery attempted yet on this error). */
  lastRecoveryStrategy: ErrorRecoveryStrategy | null;
};

/**
 * The error recovery strategy decision with full rationale.
 */
export type ErrorRecoveryResult = {
  /** The chosen recovery strategy. */
  strategy: ErrorRecoveryStrategy;
  /**
   * Human-readable reason for the decision, in English (for telemetry/logging).
   * Vietnamese-facing explanations belong in the response generation layer.
   */
  reason: string;
  /** Machine-readable reason code for telemetry/analytics. */
  reasonCode: string;
  /**
   * For DEFERRED_RECOVERY: suggested number of turns to wait before addressing.
   * undefined for all other strategies.
   */
  suggestAfterTurns?: number;
  /**
   * The pedagogical approach card to use (e.g., "show-correct-form",
   * "step-by-step-guide", "elicitation-question").
   * Helps the response generation layer pick the right UI template.
   */
  approachCard?: string;
};

// ─── CEFR Level Utilities ────────────────────────────────────────────────────

function isAdvancedLevel(cefrLevel: string | null): boolean {
  if (!cefrLevel) return false;
  const upper = cefrLevel.toUpperCase();
  return upper === "B2" || upper === "C1" || upper === "C2";
}

function isBeginnerLevel(cefrLevel: string | null): boolean {
  if (!cefrLevel) return true;
  const upper = cefrLevel.toUpperCase();
  return upper === "A1" || upper === "A2";
}

function isIntermediateLevel(cefrLevel: string | null): boolean {
  if (!cefrLevel) return false;
  const upper = cefrLevel.toUpperCase();
  return upper === "B1";
}

// ─── Core Decision Gates ─────────────────────────────────────────────────────

/**
 * R1 — Fatal Meaning Must Correct Gate
 *
 * If the error changes or loses the meaning of the sentence, use
 * DIRECT_CORRECTION immediately. No other strategy is appropriate:
 *   - GUIDED: the learner doesn't know they're wrong — guiding them
 *     to a wrong destination is confusing.
 *   - ELICITED: they can't discover the error if they don't know the
 *     target meaning.
 *   - DEFERRED: the incorrect meaning may fossilize if left unaddressed.
 *   - PATTERN_BASED: fatal errors are often about specific word choice,
 *     not generalizable patterns.
 *
 * This gate is the strongest pedagogical signal — meaning always wins.
 *
 * Exception: if the learner is frustrated AND the fatal error is
 * understandable from context, allow DEFERRED_RECOVERY — correcting
 * a frustrated learner's meaning error can feel like shaming.
 */
function checkFatalMeaningGate(
  input: ErrorRecoveryInput,
): ErrorRecoveryResult | null {
  if (input.errorSeverity !== "fatal_meaning") return null;

  // If learner is frustrated and the meaning is somewhat recoverable
  // from context, defer — relationship > perfect accuracy in this moment
  if (input.isShowingFrustration) {
    return {
      strategy: "DEFERRED_RECOVERY",
      reason:
        "Fatal meaning error detected but learner is frustrated — defer correction to avoid shaming. Recover the relationship first.",
      reasonCode: "recovery_fatal_meaning_but_frustrated",
      suggestAfterTurns: 3,
      approachCard: "defer-with-notice",
    };
  }

  return {
    strategy: "DIRECT_CORRECTION",
    reason:
      "Fatal meaning error — the meaning is lost or changed. Direct correction is the only appropriate strategy to prevent fossilization.",
    reasonCode: "recovery_fatal_meaning_must_correct",
    approachCard: "direct-correction-with-explanation",
  };
}

/**
 * R2 — Frustration Deferral Gate
 *
 * If the learner is showing frustration signals, DO NOT attempt any
 * recovery that requires learner participation (GUIDED, ELICITED,
 * PATTERN_BASED). These strategies ask the learner to think, redo,
 * or self-evaluate — exactly what a frustrated learner cannot do.
 *
 * Options when frustrated:
 *   - OFF (minor/fluency errors): just say nothing, keep talking.
 *   - DEFERRED (grammar/word_choice/lesson_target): note and come back.
 *
 * For fatal_meaning, R1 fires before R2 and handles frustration there.
 * For all other severities, this gate ensures we don't push a frustrated
 * learner into guided/elicited/pattern work.
 *
 * Exception: if this is the very first error in a session and the learner
 * is only mildly frustrated (early session, first error), allow DIRECT
 * — beginning learners sometimes show "frustration" that's really
 * concentration. A gentle direct correction can help them feel supported.
 */
function checkFrustrationDeferralGate(
  input: ErrorRecoveryInput,
): ErrorRecoveryResult | null {
  if (!input.isShowingFrustration) return null;

  // First error of session + early + it's just concentration, not real frustration
  if (
    input.correctionsThisSession === 0 &&
    input.totalTurnsInSession <= 4 &&
    input.recurringErrorCount === 1
  ) {
    return {
      strategy: "DIRECT_CORRECTION",
      reason:
        "First error of session, early turn — likely concentration signals, not true frustration. Gentle direct correction provides clarity.",
      reasonCode: "recovery_frustration_early_session_gentle",
      approachCard: "gentle-direct-correction",
    };
  }

  // Minor/fluency errors during frustration → don't interrupt
  if (input.errorSeverity === "minor" || input.errorSeverity === "fluency") {
    return {
      strategy: "NO_RECOVERY",
      reason:
        `Learner is frustrated with a ${input.errorSeverity} error — minor enough to skip. Preserve flow and confidence.`,
      reasonCode: "recovery_frustration_minor_drop",
      approachCard: "keep-conversation-flowing",
    };
  }

  // Grammar/word_choice/lesson_target → defer for later
  return {
    strategy: "DEFERRED_RECOVERY",
    reason:
      `Learner is frustrated with a ${input.errorSeverity} error — defer recovery to protect learner confidence. Address when the learner is in a better emotional state.`,
    reasonCode: "recovery_frustration_defer",
    suggestAfterTurns: 3,
    approachCard: "defer-with-notice",
  };
}

/**
 * R3 — Self-Correction Awareness Gate
 *
 * If the learner showed self-correction awareness (hesitated, paused,
 * re-read, attempted a retry), use GUIDED_RECOVERY — they're already
 * on the path to the right answer; our job is to provide direction,
 * not to take over.
 *
 * GUIDED_RECOVERY preserves the learner's agency: "Let's look at this
 * word together. What form should it take here?" rather than "You
 * should say X."
 *
 * For advanced learners with self-correction awareness → ELICITED_RECOVERY.
 * They have the knowledge base; they need the prompt, not the guidance.
 *
 * Exception: if the same error has recurred ≥4 times AND the learner
 * has already received GUIDED_RECOVERY on it, escalate to
 * PATTERN_BASED_RECOVERY — the guided approach isn't sticking.
 */
function checkSelfCorrectionGate(
  input: ErrorRecoveryInput,
): ErrorRecoveryResult | null {
  if (!input.hasSelfCorrectionAwareness) return null;

  // Advanced learner with self-correction awareness → trust them
  if (isAdvancedLevel(input.cefrLevel)) {
    return {
      strategy: "ELICITED_RECOVERY",
      reason:
        `Advanced learner (${input.cefrLevel}) showing self-correction awareness — elicit the correction rather than guide it. They have the knowledge.`,
      reasonCode: "recovery_self_correction_advanced_elicit",
      approachCard: "elicitation-question",
    };
  }

  // Error has recurred ≥4 times after GUIDED → escalate to PATTERN
  if (
    input.recurringErrorCount >= 4 &&
    input.lastRecoveryStrategy === "GUIDED_RECOVERY"
  ) {
    return {
      strategy: "PATTERN_BASED_RECOVERY",
      reason:
        `Same error recurring ${input.recurringErrorCount} times after GUIDED recovery — escalate to pattern-based. The learner needs the rule, not more step-by-step guidance.`,
      reasonCode: "recovery_self_correction_escalate_to_pattern",
      approachCard: "pattern-explanation-then-apply",
    };
  }

  return {
    strategy: "GUIDED_RECOVERY",
    reason:
      "Learner showed self-correction awareness — guide them step by step toward the correct form rather than taking over.",
    reasonCode: "recovery_self_correction_guided",
    approachCard: "step-by-step-guide",
  };
}

/**
 * R4 — Pattern Recurrence Escalation Gate
 *
 * If the same error pattern has appeared ≥3 times, the previous
 * recovery strategies (likely DIRECT_CORRECTION or GUIDED_RECOVERY)
 * haven't created lasting change. Switch to PATTERN_BASED_RECOVERY:
 * teach the underlying rule and have the learner apply it.
 *
 * This is the "direct correction didn't work" response. When you
 * correct the same thing three times, you're not teaching — you're
 * just editing. Pattern-based recovery teaches the rule so the
 * learner can generalize beyond this instance.
 *
 * Exception: if the previous recovery on this error was ALREADY
 * pattern-based and it still didn't work, don't repeat. Fall through
 * to let R7 (lesson target) or the default handle it. A pattern
 * explanation that didn't work the first time won't work the second.
 */
function checkPatternRecurrenceGate(
  input: ErrorRecoveryInput,
): ErrorRecoveryResult | null {
  if (input.recurringErrorCount < 3) return null;

  // Already tried PATTERN_BASED and it didn't work → don't repeat
  if (
    input.lastRecoveryStrategy === "PATTERN_BASED_RECOVERY" &&
    !input.previousRecoveryWorked
  ) {
    // Fall through — let other gates handle it
    return null;
  }

  // For fatal_meaning with recurrence, R1 already fired.
  // This gate handles grammar/word_choice/lesson_target/fluency recurrence.
  if (
    input.errorSeverity === "minor" ||
    input.errorSeverity === "fluency"
  ) {
    // Minor/fluency errors even at recurrence aren't pattern-worthy
    return null;
  }

  return {
    strategy: "PATTERN_BASED_RECOVERY",
    reason:
      `Same ${input.errorSeverity} error repeated ${input.recurringErrorCount} times — direct corrections aren't creating lasting change. Teach the underlying pattern.`,
    reasonCode: "recovery_pattern_recurrence_teach_rule",
    approachCard: "pattern-explanation-then-apply",
  };
}

/**
 * R5 — Shy Learner Guided Recovery Gate
 *
 * Shy learners need a recovery strategy that builds confidence while
 * providing clear structure. GUIDED_RECOVERY is the sweet spot:
 *   - DIRECT_CORRECTION can feel too blunt → reinforces shyness
 *   - ELICITED_RECOVERY puts them on the spot → anxiety spikes
 *   - PATTERN_BASED_RECOVERY on first error → overwhelming
 *   - GUIDED_RECOVERY → "let's think about this together" feels safe
 *
 * For the first correction in a session with a shy learner, always
 * use GUIDED_RECOVERY regardless of error severity (except fatal_meaning,
 * which R1 handles). The first interaction sets the tone — if it feels
 * safe, the learner opens up.
 *
 * For minor errors with shy learners: NO_RECOVERY. Every correction
 * costs confidence; minor errors aren't worth that cost.
 *
 * For lesson-target errors with shy learners: GUIDED_RECOVERY, even
 * on recurrence — the lesson context provides safety scaffolding.
 */
function checkShyLearnerGuidedGate(
  input: ErrorRecoveryInput,
): ErrorRecoveryResult | null {
  if (input.learnerConfidence !== "shy") return null;

  // Minor errors → don't correct. Shy learner confidence > minor accuracy.
  if (input.errorSeverity === "minor") {
    return {
      strategy: "NO_RECOVERY",
      reason:
        "Shy learner with minor error — every correction costs confidence. Skip this one.",
      reasonCode: "recovery_shy_minor_skip",
      approachCard: "keep-conversation-flowing",
    };
  }

  // First correction of session → set a safe, supportive tone
  if (input.correctionsThisSession === 0) {
    return {
      strategy: "GUIDED_RECOVERY",
      reason:
        "First correction of the session with a shy learner — use GUIDED recovery to establish a safe, supportive correction tone.",
      reasonCode: "recovery_shy_first_correction_guided",
      approachCard: "step-by-step-guide",
    };
  }

  // Fluency/word_choice with shy → also GUIDED (gentle)
  if (
    input.errorSeverity === "fluency" ||
    input.errorSeverity === "word_choice"
  ) {
    return {
      strategy: "GUIDED_RECOVERY",
      reason:
        `Shy learner with ${input.errorSeverity} error — guided recovery feels like collaboration, not criticism.`,
      reasonCode: "recovery_shy_gentle_guided",
      approachCard: "step-by-step-guide",
    };
  }

  // Lesson target with shy → GUIDED (the lesson provides safety)
  if (input.isCurrentLessonTarget) {
    return {
      strategy: "GUIDED_RECOVERY",
      reason:
        "Shy learner on lesson target skill — guided recovery within the lesson context feels safe and expected.",
      reasonCode: "recovery_shy_lesson_target_guided",
      approachCard: "lesson-context-guided-recovery",
    };
  }

  return null;
}

/**
 * R6 — Advanced Learner Elicited Recovery Gate
 *
 * Advanced learners (B2+) benefit from recovery that respects their
 * independence. ELICITED_RECOVERY is the preferred strategy:
 *   - "Can you spot what needs to change?" trusts their knowledge
 *   - DIRECT_CORRECTION can feel patronizing at B2+
 *   - GUIDED_RECOVERY is unnecessary — they don't need step-by-step
 *   - PATTERN_BASED is good for recurring errors at B2+ (handled by R4)
 *
 * For any B2/C1 learner with minor/fluency errors:
 * NO_RECOVERY. At this level, minor errors are slips or stylistic
 * choices, not learning opportunities. Intervening undermines
 * autonomy regardless of the learner's confidence level.
 *
 * For advanced learners with self-correction awareness:
 * R3 (self-correction gate) fires first and already returns
 * ELICITED_RECOVERY — this gate handles the cases where the learner
 * is advanced but not showing active self-correction.
 *
 * Exception for C2 learners: they are effectively fluent. Only
 * fatal_meaning errors warrant recovery; everything else is a
 * stylistic choice or a slip. NO_RECOVERY for all non-fatal errors.
 */
function checkAdvancedLearnerElicitedGate(
  input: ErrorRecoveryInput,
): ErrorRecoveryResult | null {
  if (!isAdvancedLevel(input.cefrLevel)) return null;

  // C2 — effectively fluent. Only fatal errors matter.
  if (input.cefrLevel?.toUpperCase() === "C2") {
    // R1 already handles fatal_meaning. Everything else → no recovery.
    return {
      strategy: "NO_RECOVERY",
      reason:
        "C2 learner — effectively fluent. Non-fatal errors are stylistic choices or slips, not learning opportunities.",
      reasonCode: "recovery_c2_no_recovery_stylistic",
      approachCard: "keep-conversation-flowing",
    };
  }

  // B2/C1 with minor/fluency → no recovery (any confidence level)
  // Minor slips and fluency choices at B2+ are not learning opportunities —
  // they're either slips (which the learner already knows) or stylistic
  // choices. Intervening undermines autonomy regardless of confidence.
  if (
    input.errorSeverity === "minor" || input.errorSeverity === "fluency"
  ) {
    return {
      strategy: "NO_RECOVERY",
      reason:
        `${input.cefrLevel} learner with ${input.errorSeverity} error — minor slips at this level are not learning opportunities. Preserve autonomy.`,
      reasonCode: "recovery_advanced_autonomy_no_recovery",
      approachCard: "keep-conversation-flowing",
    };
  }

  // B2/C1 with grammar/word_choice → ELICITED (they know the rule)
  return {
    strategy: "ELICITED_RECOVERY",
    reason:
      `${input.cefrLevel} learner — elicit the correction rather than providing it. They have the knowledge; they need the awareness prompt.`,
    reasonCode: "recovery_advanced_elicit",
    approachCard: "elicitation-question",
  };
}

/**
 * R7 — Lesson Target Scaffolding Gate
 *
 * If the error is on the current lesson's target skill, use
 * PATTERN_BASED_RECOVERY — the lesson provides the perfect context
 * to teach the rule, not just fix the instance.
 *
 * When a learner makes an error on the exact thing they're learning,
 * it's a teaching moment, not just a correction moment. Pattern-based
 * recovery says: "Remember the rule from this lesson? Let's walk
 * through it and then apply it to your sentence."
 *
 * This gate fires before the beginner gate (R8) because lesson-target
 * scaffolding is more specific than general beginner support.
 *
 * Exception: if the learner is struggling (recurring ≥3), R4 already
 * fires and returns PATTERN_BASED_RECOVERY. If the error is first-time
 * on a lesson target, this gate provides the appropriate scaffold.
 */
function checkLessonTargetScaffoldingGate(
  input: ErrorRecoveryInput,
): ErrorRecoveryResult | null {
  if (!input.isCurrentLessonTarget) return null;

  // If R4 already handled recurrence, this doesn't fire.
  // This gate is for first/second occurrence on lesson target.

  return {
    strategy: "PATTERN_BASED_RECOVERY",
    reason:
      "Error is on the current lesson target skill — use pattern-based recovery to connect the error to the lesson's rule. This is a teaching moment, not just a correction.",
    reasonCode: "recovery_lesson_target_pattern",
    approachCard: "lesson-context-pattern-explanation",
  };
}

/**
 * R8 — Early Session Trust Building Gate
 *
 * In the first 4 turns of a session, use GUIDED_RECOVERY for grammar
 * and word_choice errors (unless a more specific gate fires first).
 *
 * Starting a session with direct corrections feels clinical and
 * evaluative. Starting with guided recovery ("Let's figure this
 * out together") establishes Teacher Mercy as a collaborator, not
 * a judge. This builds the trust that makes later direct corrections
 * feel helpful rather than critical.
 *
 * This gate only fires for intermediate learners (B1) or unknown CEFR
 * — beginners are handled by default (DIRECT for clarity) and
 * advanced learners are handled by R6 (ELICITED).
 *
 * After turn 4, direct corrections are normal and expected. The
 * trust is already established.
 */
function checkEarlySessionTrustGate(
  input: ErrorRecoveryInput,
): ErrorRecoveryResult | null {
  if (input.totalTurnsInSession > 4) return null;

  // Only intermediate or unknown CEFR — beginners get DIRECT for clarity
  if (!isIntermediateLevel(input.cefrLevel) && input.cefrLevel !== null) {
    return null;
  }

  // Only grammar/word_choice — fatal handled by R1, minor doesn't need this
  if (
    input.errorSeverity !== "grammar" &&
    input.errorSeverity !== "word_choice"
  ) {
    return null;
  }

  // First or second occurrence only — recurrence handled by R4
  if (input.recurringErrorCount >= 3) return null;

  return {
    strategy: "GUIDED_RECOVERY",
    reason:
      `Early session (turn ${input.totalTurnsInSession}) with ${input.cefrLevel ?? "unknown"} learner — use GUIDED recovery to build trust before switching to more direct modes.`,
    reasonCode: "recovery_early_session_trust_building",
    approachCard: "step-by-step-guide",
  };
}

// ─── Default Fallback ────────────────────────────────────────────────────────

/**
 * Default error recovery strategy when no specific gate fires.
 *
 * The default strategy depends on the learner's CEFR level and the
 * error severity. This is the "standard operating procedure" for
 * Teacher Mercy's error recovery:
 *
 *   Beginners (A1–A2): DIRECT_CORRECTION for everything except minor.
 *     Beginners need clarity, not nuance. They don't have the
 *     knowledge base to self-correct or discover patterns — they
 *     need to be shown the right form.
 *
 *   Intermediate (B1): DIRECT_CORRECTION for grammar/lesson_target;
 *     GUIDED_RECOVERY for word_choice/fluency. Intermediate learners
 *     have enough knowledge for guided work on meaning-level errors
 *     but still benefit from direct correction on structural errors.
 *
 *   Advanced (B2+): Should be caught by R6 before reaching default.
 *     But as a safety net: ELICITED_RECOVERY. They have the knowledge.
 *
 *   All levels — minor errors: NO_RECOVERY unless it's the lesson target.
 *
 * The default also handles one edge case: first-time grammar error
 * in an early session with a B1 learner who shows no special signals.
 * This is the "nothing special" scenario — default to DIRECT_CORRECTION
 * because it's the most reliable recovery method.
 */
function defaultErrorRecoveryStrategy(
  input: ErrorRecoveryInput,
): ErrorRecoveryResult {
  // Minor errors → no recovery (unless lesson target)
  if (input.errorSeverity === "minor" && !input.isCurrentLessonTarget) {
    return {
      strategy: "NO_RECOVERY",
      reason:
        "Minor error — the pedagogical cost of interrupting outweighs the learning benefit. Keep the conversation flowing.",
      reasonCode: "recovery_default_minor_skip",
      approachCard: "keep-conversation-flowing",
    };
  }

  // Beginners → DIRECT for clarity
  if (isBeginnerLevel(input.cefrLevel)) {
    return {
      strategy: "DIRECT_CORRECTION",
      reason:
        `Beginner learner (${input.cefrLevel ?? "unknown"}) — direct correction provides the clarity beginners need to build correct mental models.`,
      reasonCode: "recovery_default_beginner_direct",
      approachCard: "direct-correction-with-explanation",
    };
  }

  // Advanced safety net → ELICITED (should be caught by R6)
  if (isAdvancedLevel(input.cefrLevel)) {
    return {
      strategy: "ELICITED_RECOVERY",
      reason:
        `${input.cefrLevel} learner — elicit self-correction. They have the knowledge to discover the right form.`,
      reasonCode: "recovery_default_advanced_elicit",
      approachCard: "elicitation-question",
    };
  }

  // Intermediate grammar/lesson_target → DIRECT (structural errors)
  if (
    input.errorSeverity === "grammar" ||
    input.errorSeverity === "lesson_target"
  ) {
    return {
      strategy: "DIRECT_CORRECTION",
      reason:
        `Intermediate learner with ${input.errorSeverity} error — direct correction is efficient and clear for structural errors at this level.`,
      reasonCode: "recovery_default_intermediate_direct",
      approachCard: "direct-correction-with-explanation",
    };
  }

  // Intermediate word_choice/fluency → GUIDED (meaning-level nuance)
  return {
    strategy: "GUIDED_RECOVERY",
    reason:
      `Intermediate learner with ${input.errorSeverity} error — guided recovery helps the learner develop intuition for meaning-level choices.`,
    reasonCode: "recovery_default_intermediate_guided",
    approachCard: "step-by-step-guide",
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * The ordered list of gates that determine the error recovery strategy.
 * Gates are evaluated in order; the first non-null result wins.
 *
 * Priority hierarchy:
 *   1. Fatal meaning must correct — meaning always wins (R1)
 *   2. Frustration deferral — protect emotional state (R2)
 *   3. Self-correction awareness — guide learners who are already trying (R3)
 *   4. Pattern recurrence escalation — teach the rule when direct didn't stick (R4)
 *   5. Shy learner guided — protect confidence, build safety (R5)
 *   6. Advanced learner elicited — trust autonomy, prompt awareness (R6)
 *   7. Lesson target scaffolding — connect to the lesson context (R7)
 *   8. Early session trust building — set a collaborative tone (R8)
 *   9. Default — CEFR-aware fallback
 *
 * Design rationale for R1 first:
 *   Fatal meaning errors that change/lose meaning are the most damaging.
 *   Letting one go unaddressed can fossilize wrong meaning. R1 is the
 *   strongest gate because meaning is the foundation — everything else
 *   (grammar, fluency, word choice) builds on shared meaning.
 *
 * Design rationale for R2 before R3:
 *   A learner showing self-correction awareness AND frustration should
 *   get DEFERRED_RECOVERY, not GUIDED_RECOVERY. Frustration means the
 *   learner's emotional state blocks learning — guiding them through a
 *   recovery they're not emotionally ready for backfires. R2 fires first
 *   to protect the learner.
 *
 * Design rationale for R5 before R6:
 *   Shy and advanced are not opposites — a learner can be both shy and
 *   at B2. Shy state matters more than CEFR level for recovery strategy
 *   because the social-emotional risk of the wrong strategy (eliciting a
 *   shy learner) is higher than the autonomy risk (guiding an advanced
 *   learner). A shy B2 learner still needs GUIDED more than ELICITED.
 *
 * Design rationale for R7 before R8:
 *   Lesson-target scaffolding is a more specific signal than early-session
 *   trust building. If the error is on the lesson target in early session,
 *   pattern-based scaffolding is more effective than general trust building.
 *
 * Design rationale for R8 after advanced/beginner gates:
 *   Early-session trust building is a soft signal — it only fires for
 *   intermediate learners who haven't been caught by other gates. It fills
 *   the gap between beginner-direct and advanced-elicited defaults.
 */
const GATES: ReadonlyArray<
  (input: ErrorRecoveryInput) => ErrorRecoveryResult | null
> = [
  checkFatalMeaningGate,
  checkFrustrationDeferralGate,
  checkSelfCorrectionGate,
  checkPatternRecurrenceGate,
  checkShyLearnerGuidedGate,
  checkAdvancedLearnerElicitedGate,
  checkLessonTargetScaffoldingGate,
  checkEarlySessionTrustGate,
];

/**
 * Select the error recovery strategy for a learner error.
 *
 * Pure function — deterministic, no side effects, no I/O.
 *
 * @returns An ErrorRecoveryResult with the chosen strategy and rationale.
 */
export function decideErrorRecoveryStrategy(
  input: ErrorRecoveryInput,
): ErrorRecoveryResult {
  for (const gate of GATES) {
    const result = gate(input);
    if (result !== null) return result;
  }

  return defaultErrorRecoveryStrategy(input);
}

/**
 * Convenience: check whether the recovery strategy is DIRECT_CORRECTION.
 */
export function isDirectCorrection(result: ErrorRecoveryResult): boolean {
  return result.strategy === "DIRECT_CORRECTION";
}

/**
 * Convenience: check whether the recovery strategy is GUIDED_RECOVERY.
 */
export function isGuidedRecovery(result: ErrorRecoveryResult): boolean {
  return result.strategy === "GUIDED_RECOVERY";
}

/**
 * Convenience: check whether the recovery strategy is ELICITED_RECOVERY.
 */
export function isElicitedRecovery(result: ErrorRecoveryResult): boolean {
  return result.strategy === "ELICITED_RECOVERY";
}

/**
 * Convenience: check whether the recovery strategy is DEFERRED_RECOVERY.
 */
export function isDeferredRecovery(result: ErrorRecoveryResult): boolean {
  return result.strategy === "DEFERRED_RECOVERY";
}

/**
 * Convenience: check whether the recovery strategy is PATTERN_BASED_RECOVERY.
 */
export function isPatternBasedRecovery(result: ErrorRecoveryResult): boolean {
  return result.strategy === "PATTERN_BASED_RECOVERY";
}

/**
 * Convenience: check whether no recovery action is recommended.
 */
export function isNoRecovery(result: ErrorRecoveryResult): boolean {
  return result.strategy === "NO_RECOVERY";
}

// ─── Catalogs ─────────────────────────────────────────────────────────────────

export const ERROR_RECOVERY_STRATEGY_CATALOG: ReadonlyArray<{
  strategy: ErrorRecoveryStrategy;
  titleEn: string;
  titleVi: string;
  descriptionVi: string;
}> = [
  {
    strategy: "DIRECT_CORRECTION",
    titleEn: "Direct correction",
    titleVi: "Sửa trực tiếp",
    descriptionVi: "Đưa ra cách nói đúng ngay lập tức — rõ ràng, hiệu quả, phù hợp với người mới học và lỗi nghiêm trọng.",
  },
  {
    strategy: "GUIDED_RECOVERY",
    titleEn: "Guided recovery",
    titleVi: "Dẫn dắt từng bước",
    descriptionVi: "Dẫn người học từng bước đến cách nói đúng — bảo vệ sự tự tin và khuyến khích tự sửa.",
  },
  {
    strategy: "ELICITED_RECOVERY",
    titleEn: "Elicited recovery",
    titleVi: "Gợi mở tự phát hiện",
    descriptionVi: "Đặt câu hỏi để người học tự phát hiện lỗi — tôn trọng khả năng độc lập của người học trình độ cao.",
  },
  {
    strategy: "DEFERRED_RECOVERY",
    titleEn: "Deferred recovery",
    titleVi: "Để dành sửa sau",
    descriptionVi: "Ghi nhận lỗi nhưng quay lại sau — khi người học đang mệt hoặc cần giữ mạch nói.",
  },
  {
    strategy: "PATTERN_BASED_RECOVERY",
    titleEn: "Pattern-based recovery",
    titleVi: "Dạy quy luật",
    descriptionVi: "Giải thích quy luật đằng sau rồi để người học tự áp dụng — hiệu quả với lỗi lặp lại nhiều lần.",
  },
  {
    strategy: "NO_RECOVERY",
    titleEn: "No recovery",
    titleVi: "Không can thiệp",
    descriptionVi: "Bỏ qua lỗi này — chi phí gián đoạn cao hơn lợi ích học tập. Giữ mạch trò chuyện tự nhiên.",
  },
];

export const ERROR_RECOVERY_REASON_CODE_CATALOG: ReadonlyArray<{
  reasonCode: string;
  strategy: ErrorRecoveryStrategy;
  descriptionVi: string;
}> = [
  { reasonCode: "recovery_fatal_meaning_must_correct", strategy: "DIRECT_CORRECTION", descriptionVi: "Lỗi sai nghĩa nghiêm trọng — phải sửa trực tiếp để tránh hình thành thói quen sai." },
  { reasonCode: "recovery_fatal_meaning_but_frustrated", strategy: "DEFERRED_RECOVERY", descriptionVi: "Lỗi sai nghĩa nhưng người học đang mệt — để dành sửa sau, giữ quan hệ trước." },
  { reasonCode: "recovery_frustration_early_session_gentle", strategy: "DIRECT_CORRECTION", descriptionVi: "Dấu hiệu căng thẳng đầu buổi — có thể là tập trung, sửa nhẹ nhàng." },
  { reasonCode: "recovery_frustration_minor_drop", strategy: "NO_RECOVERY", descriptionVi: "Người học đang mệt, lỗi nhỏ — bỏ qua để giữ mạch trò chuyện." },
  { reasonCode: "recovery_frustration_defer", strategy: "DEFERRED_RECOVERY", descriptionVi: "Người học đang mệt — để dành sửa sau, bảo vệ tâm lý." },
  { reasonCode: "recovery_self_correction_guided", strategy: "GUIDED_RECOVERY", descriptionVi: "Người học đang cố tự sửa — dẫn dắt từng bước thay vì làm thay." },
  { reasonCode: "recovery_self_correction_advanced_elicit", strategy: "ELICITED_RECOVERY", descriptionVi: "Người học trình độ cao đang tự sửa — gợi mở thay vì dẫn dắt." },
  { reasonCode: "recovery_self_correction_escalate_to_pattern", strategy: "PATTERN_BASED_RECOVERY", descriptionVi: "Đã dẫn dắt nhiều lần mà vẫn sai — chuyển sang dạy quy luật." },
  { reasonCode: "recovery_pattern_recurrence_teach_rule", strategy: "PATTERN_BASED_RECOVERY", descriptionVi: "Lỗi lặp ≥3 lần — sửa trực tiếp không hiệu quả, dạy quy luật đằng sau." },
  { reasonCode: "recovery_shy_minor_skip", strategy: "NO_RECOVERY", descriptionVi: "Người học nhút nhát, lỗi nhỏ — mỗi lần sửa tốn tự tin, bỏ qua." },
  { reasonCode: "recovery_shy_first_correction_guided", strategy: "GUIDED_RECOVERY", descriptionVi: "Lần sửa đầu tiên với người nhút nhát — dẫn dắt nhẹ nhàng để tạo cảm giác an toàn." },
  { reasonCode: "recovery_shy_gentle_guided", strategy: "GUIDED_RECOVERY", descriptionVi: "Người học nhút nhát — dẫn dắt như cùng hợp tác, không phải phê bình." },
  { reasonCode: "recovery_shy_lesson_target_guided", strategy: "GUIDED_RECOVERY", descriptionVi: "Người học nhút nhát, lỗi mục tiêu bài học — dẫn dắt trong ngữ cảnh bài học an toàn." },
  { reasonCode: "recovery_advanced_elicit", strategy: "ELICITED_RECOVERY", descriptionVi: "Người học trình độ cao — gợi mở để họ tự phát hiện lỗi." },
  { reasonCode: "recovery_advanced_autonomy_no_recovery", strategy: "NO_RECOVERY", descriptionVi: "Người học trình độ cao, tự tin — chắc là sơ suất, không cần can thiệp." },
  { reasonCode: "recovery_c2_no_recovery_stylistic", strategy: "NO_RECOVERY", descriptionVi: "Trình độ C2 — lỗi không nghiêm trọng là lựa chọn phong cách, không cần sửa." },
  { reasonCode: "recovery_lesson_target_pattern", strategy: "PATTERN_BASED_RECOVERY", descriptionVi: "Lỗi đúng mục tiêu bài học — dạy quy luật trong ngữ cảnh bài học." },
  { reasonCode: "recovery_early_session_trust_building", strategy: "GUIDED_RECOVERY", descriptionVi: "Đầu buổi học — dẫn dắt để xây dựng lòng tin trước khi sửa trực tiếp." },
  { reasonCode: "recovery_default_minor_skip", strategy: "NO_RECOVERY", descriptionVi: "Lỗi nhỏ — chi phí gián đoạn cao hơn lợi ích, giữ mạch hội thoại." },
  { reasonCode: "recovery_default_beginner_direct", strategy: "DIRECT_CORRECTION", descriptionVi: "Người mới học — sửa trực tiếp để xây dựng mô hình ngôn ngữ đúng." },
  { reasonCode: "recovery_default_advanced_elicit", strategy: "ELICITED_RECOVERY", descriptionVi: "Người học trình độ cao — gợi mở tự sửa." },
  { reasonCode: "recovery_default_intermediate_direct", strategy: "DIRECT_CORRECTION", descriptionVi: "Người học trung cấp, lỗi cấu trúc — sửa trực tiếp hiệu quả và rõ ràng." },
  { reasonCode: "recovery_default_intermediate_guided", strategy: "GUIDED_RECOVERY", descriptionVi: "Người học trung cấp, lỗi từ vựng/độ tự nhiên — dẫn dắt để phát triển trực giác." },
];
