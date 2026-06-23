/**
 * Teacher Mercy — Hint Ladder Decision Policy
 *
 * Decides WHEN Teacher Mercy should use a graduated hint instead of a direct
 * correction, and at WHAT LEVEL to pitch the hint — minimal, medium, or strong.
 *
 * A hint ladder is the hallmark of a skilled human teacher: rather than
 * immediately giving the correct answer, the teacher guides the learner
 * toward self-correction through progressively more specific hints.
 *
 * Hint levels:
 *   MINIMAL   — "Look at the verb again." (points at the error area, no rule)
 *   MEDIUM    — "Remember, with 'he' we add -s." (reminds of the rule)
 *   STRONG    — "He goes, not he go." (nearly gives the answer)
 *
 * A hint is different from a correction, drill, challenge, or encouragement:
 *   Correction    = "You said X wrong, here's the right way."
 *   Drill         = "Let's practice this pattern 5 times to build the habit."
 *   Encouragement  = "Nice recovery after that struggle."
 *   Challenge     = "Try saying this in past tense."
 *   Hint          = "Think about the verb form when the subject is 'he'."
 *
 * This module layers ON TOP of the existing decision policies. It answers
 * a different question: "Given the learner's state, error context, and hint
 * history, should Teacher Mercy use a hint now, and if so, how strong?"
 *
 * Design principles:
 *   1. Hints promote self-correction — the goal is for the learner to arrive
 *      at the answer themselves, not to be told the answer.
 *   2. Progressive escalation — start light, get stronger only if needed.
 *      A minimal hint that works is better than a strong hint.
 *   3. Learner-aware — shy learners get gentler entry; advanced learners
 *      get minimal nudges to preserve autonomy.
 *   4. Hint discipline — too many hints create dependency. After a threshold,
 *      switch to direct correction so the learner doesn't learn to wait for hints.
 *   5. Timing matters — a hint too soon after the last hint is noise;
 *      a hint during frustration is counterproductive.
 *   6. Vietnamese-first — all rationale is produced in Vietnamese for the
 *      learner-facing layer; English rationale is for telemetry.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

import type { ErrorSeverity, LearnerConfidence } from "./teacherMercyCorrectionTiming";

// ─── Hint Ladder Decision Types ──────────────────────────────────────────────

/**
 * The five hint ladder decisions Teacher Mercy can make.
 *
 * HINT_MINIMAL   — give a minimal hint (point at the error area, no rule).
 * HINT_MEDIUM    — give a medium hint (remind of the relevant rule/pattern).
 * HINT_STRONG    — give a strong hint (nearly give the answer, narrow gap to one step).
 * HINT_SOON      — queue a hint for 1–2 turns from now; let the learner try first.
 * NO_HINT        — don't use a hint; correct directly or don't intervene.
 */
export type HintLadderDecision =
  | "HINT_MINIMAL"
  | "HINT_MEDIUM"
  | "HINT_STRONG"
  | "HINT_SOON"
  | "NO_HINT";

/**
 * Input context for the hint ladder timing decision.
 */
export type HintLadderInput = {
  /** How many turns have passed since the last hint was delivered (or Infinity if none yet). */
  turnsSinceLastHint: number;
  /** Total hints delivered in this session so far. */
  hintsThisSession: number;
  /** The level of the most recent hint (null if no hint has been given yet). */
  lastHintLevel: HintLadderDecision | null;
  /** How many times the same error pattern has appeared in recent turns (1+). */
  recurringErrorCount: number;
  /** The severity of the error under consideration. */
  errorSeverity: ErrorSeverity;
  /** Known CEFR level (null = unknown, treated as beginner). */
  cefrLevel: string | null;
  /** The learner's apparent confidence. */
  learnerConfidence: LearnerConfidence;
  /** Whether the error is on the current lesson's target skill. */
  isCurrentLessonTarget: boolean;
  /** Whether the learner showed self-correction awareness (hesitation, pause, retry). */
  hasSelfCorrectionAwareness: boolean;
  /** Whether the learner is showing frustration signals. */
  isShowingFrustration: boolean;
  /** Total conversation turns in this session so far. */
  totalTurnsInSession: number;
  /** Whether the previous hint on this same error pattern was acted upon (learner self-corrected). */
  previousHintWorked: boolean;
};

/**
 * The hint ladder timing decision with full rationale.
 */
export type HintLadderResult = {
  /** The chosen hint decision. */
  decision: HintLadderDecision;
  /**
   * Human-readable reason for the decision, in English (for telemetry/logging).
   * Vietnamese-facing explanations belong in the response generation layer.
   */
  reason: string;
  /** Machine-readable reason code for telemetry/analytics. */
  reasonCode: string;
  /**
   * For HINT_SOON: suggested number of turns to wait before delivering.
   * undefined for all other decisions.
   */
  suggestAfterTurns?: number;
  /**
   * The error area to focus the hint on (e.g., "verb-form", "article-choice").
   * Filled when the decision is HINT_MINIMAL, HINT_MEDIUM, or HINT_STRONG.
   */
  hintFocusArea?: string;
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
 * H1 — Self-Correction Window Gate
 *
 * If the learner showed self-correction awareness (hesitated, paused,
 * re-read their text, attempted a retry), give a MINIMAL hint.
 *
 * A learner who is already trying to self-correct doesn't need a
 * strong hint — a light nudge that points at the error area is enough.
 * Over-hinting a self-aware learner teaches them to wait for hints
 * instead of building their own self-monitoring skill.
 *
 * Exception: if this is a recurring error (≥3) and the learner already
 * got a hint on it before, escalate to MEDIUM — the minimal hint didn't
 * stick last time.
 *
 * Exception: if the learner is frustrated, don't hint — a hint during
 * frustration feels like prodding. Use NO_HINT and let the correction
 * engine decide (likely SUPPRESS or FOLLOW_UP_FIRST).
 */
function checkSelfCorrectionWindowGate(
  input: HintLadderInput,
): HintLadderResult | null {
  if (!input.hasSelfCorrectionAwareness) return null;

  // Don't hint if the learner is frustrated — it feels like pressure
  if (input.isShowingFrustration) return null;

  // If the same error keeps recurring AND we already hinted at it,
  // escalate to MEDIUM — the minimal hint wasn't enough
  if (
    input.recurringErrorCount >= 3 &&
    input.lastHintLevel !== null &&
    input.lastHintLevel === "HINT_MINIMAL"
  ) {
    return {
      decision: "HINT_MEDIUM",
      reason:
        `Self-correction awareness detected but same error repeated ${input.recurringErrorCount} times after minimal hint — escalate to medium hint to reinforce the pattern.`,
      reasonCode: "hint_self_correction_escalate",
      hintFocusArea: input.errorSeverity,
    };
  }

  return {
    decision: "HINT_MINIMAL",
    reason:
      "Learner showed self-correction awareness — minimal hint to guide them to the answer without giving it away.",
    reasonCode: "hint_self_correction_window",
    hintFocusArea: input.errorSeverity,
  };
}

/**
 * H2 — Too Soon After Last Hint Gate
 *
 * If we gave a hint very recently (< 2 turns ago), don't hint again.
 * The learner needs time to process the previous hint. Back-to-back
 * hints feel like nagging and undermine the "self-discovery" value
 * of hints.
 *
 * If the previous hint was STRONG and the error still appears,
 * this gate yields null (passes through) so H4 can handle the
 * escalation to direct correction instead of another hint.
 */
function checkTooSoonAfterHintGate(
  input: HintLadderInput,
): HintLadderResult | null {
  if (input.turnsSinceLastHint >= 2) return null;

  return {
    decision: "NO_HINT",
    reason: `Only ${input.turnsSinceLastHint} turn(s) since last hint — give the learner space to process before more guidance.`,
    reasonCode: "hint_too_soon_after_hint",
  };
}

/**
 * H3 — Hint Saturation Gate
 *
 * If we've given ≥5 hints this session, the learner risks becoming
 * hint-dependent — they learn to wait for the hint instead of
 * self-monitoring.
 *
 * At 5–7 hints: fall back to the most recent hint level that worked,
 * or NO_HINT to prevent dependency.
 *
 * At ≥8 hints: block all further hints this session. Switch the
 * pipeline toward direct correction or suppression.
 *
 * Exception: self-correction awareness still merits a minimal hint
 * (H1 fires before this gate and handles that case).
 */
function checkHintSaturationGate(
  input: HintLadderInput,
): HintLadderResult | null {
  if (input.hintsThisSession < 5) return null;

  // Heavy hint saturation — block further hints
  if (input.hintsThisSession >= 8) {
    return {
      decision: "NO_HINT",
      reason: `Already ${input.hintsThisSession} hints this session — blocking further hints to prevent hint dependency. Use direct correction or suppression.`,
      reasonCode: "hint_saturation_block_all",
    };
  }

  // Moderate saturation — only allow hints if the previous one worked
  if (input.hintsThisSession >= 5) {
    if (!input.previousHintWorked) {
      return {
        decision: "NO_HINT",
        reason: `${input.hintsThisSession} hints already this session and previous hint didn't lead to self-correction — the learner may not be benefiting from hints right now.`,
        reasonCode: "hint_saturation_diminishing_return",
      };
    }
  }

  return null;
}

/**
 * H4 — Recurring Error Escalation Gate
 *
 * If the same error pattern has appeared ≥3 times and we've already
 * given hints on it before, escalate the hint level:
 *   MINIMAL → MEDIUM
 *   MEDIUM  → STRONG
 *   STRONG  → NO_HINT (escalation ceiling — switch to direct correction)
 *
 * This gate implements the core "ladder" metaphor: each rung is
 * progressively more specific until the learner either self-corrects
 * or we switch to direct teaching.
 */
function checkRecurringErrorEscalationGate(
  input: HintLadderInput,
): HintLadderResult | null {
  if (input.recurringErrorCount < 3) return null;
  if (input.lastHintLevel === null) return null;

  // Already at max hint level — don't hint again, pass to direct correction
  if (input.lastHintLevel === "HINT_STRONG") {
    return {
      decision: "NO_HINT",
      reason: `Same error repeated ${input.recurringErrorCount} times even after strong hint — escalation ceiling reached. Recommend direct correction or pattern explanation.`,
      reasonCode: "hint_escalation_ceiling",
    };
  }

  // Escalate: MINIMAL → MEDIUM
  if (input.lastHintLevel === "HINT_MINIMAL") {
    return {
      decision: "HINT_MEDIUM",
      reason: `Same error repeated ${input.recurringErrorCount} times after minimal hint — escalate to medium hint with rule reminder.`,
      reasonCode: "hint_recurring_escalate_to_medium",
      hintFocusArea: input.errorSeverity,
    };
  }

  // Escalate: MEDIUM → STRONG
  if (input.lastHintLevel === "HINT_MEDIUM") {
    return {
      decision: "HINT_STRONG",
      reason: `Same error repeated ${input.recurringErrorCount} times after medium hint — escalate to strong hint (nearly give the answer).`,
      reasonCode: "hint_recurring_escalate_to_strong",
      hintFocusArea: input.errorSeverity,
    };
  }

  return null;
}

/**
 * H5 — Shy Learner Gentle Entry Gate
 *
 * Shy learners need hints delivered gently. Never jump straight to
 * MEDIUM or STRONG with a shy learner — always start at MINIMAL.
 *
 * If we've already given a minimal hint and need to escalate (H4
 * fires first for recurring errors), let H4 handle the escalation.
 *
 * Shy learners also need more space between hints — ensure at least
 * 3 turns have passed since the last hint before offering another.
 *
 * Exception for lesson-target errors: shy learners on the lesson
 * target skill can receive a MEDIUM hint after a minimal one,
 * because the lesson context provides safety ("this is what we're
 * learning right now").
 */
function checkShyLearnerGentleEntryGate(
  input: HintLadderInput,
): HintLadderResult | null {
  if (input.learnerConfidence !== "shy") return null;

  // Shy learner + first hint this session → always start at MINIMAL
  if (input.lastHintLevel === null && input.hintsThisSession === 0) {
    return {
      decision: "HINT_MINIMAL",
      reason: "Shy learner receiving their first hint — start with the gentlest possible nudge to build confidence in self-correction.",
      reasonCode: "hint_shy_first_hint_minimal",
      hintFocusArea: input.errorSeverity,
    };
  }

  // Shy learner + already had a minimal hint + it's the lesson target →
  // allow a careful MEDIUM hint (lesson context provides safety)
  if (
    input.lastHintLevel === "HINT_MINIMAL" &&
    input.isCurrentLessonTarget &&
    input.turnsSinceLastHint >= 3
  ) {
    return {
      decision: "HINT_MEDIUM",
      reason: `Shy learner on lesson target skill — gentle escalation to medium hint, framed within the lesson context for safety.`,
      reasonCode: "hint_shy_lesson_target_medium",
      hintFocusArea: input.errorSeverity,
    };
  }

  // Shy learner + insufficient space since last hint → NO_HINT
  if (input.turnsSinceLastHint < 3) {
    return {
      decision: "NO_HINT",
      reason: `Shy learner with only ${input.turnsSinceLastHint} turn(s) since last hint — need ≥3 turns of conversational space before another hint.`,
      reasonCode: "hint_shy_insufficient_space",
    };
  }

  return null;
}

/**
 * H6 — Lesson Target Scaffolding Gate
 *
 * If the error is on the current lesson's target skill, use a MEDIUM
 * hint that reminds the learner of the rule they just learned.
 *
 * The lesson target is fresh in the learner's mind — a medium hint
 * that references the lesson context ("Remember the rule about past
 * tense we practiced earlier?") is more effective than a minimal
 * hint that makes them guess, and more respectful than a strong
 * hint that doesn't trust their knowledge.
 *
 * Don't hint if the learner is frustrated — lesson-target errors during
 * frustration should be corrected directly or deferred.
 */
function checkLessonTargetScaffoldingGate(
  input: HintLadderInput,
): HintLadderResult | null {
  if (!input.isCurrentLessonTarget) return null;

  // Don't hint during frustration — direct correction is clearer
  if (input.isShowingFrustration) return null;

  return {
    decision: "HINT_MEDIUM",
    reason: "Error is on the current lesson target skill — medium hint that references the lesson context to reinforce the rule the learner just learned.",
    reasonCode: "hint_lesson_target_scaffolding",
    hintFocusArea: `lesson-target:${input.errorSeverity}`,
  };
}

/**
 * H7 — Beginner Structured Support Gate
 *
 * Beginners (A1–A2) benefit from structured hints that won't overwhelm them.
 *
 * Grammar / lesson_target errors: use MEDIUM hints — beginners need
 * the rule reminder to connect the hint to what they learned.
 *
 * Word choice errors: use MINIMAL hints — word choice is about exposure,
 * not rules; a light nudge is more natural.
 *
 * Fatal meaning errors: skip hints entirely — fatal errors need
 * direct correction to prevent fossilization.
 *
 * If the beginner has received ≥3 hints already, reduce to MINIMAL
 * to prevent hint fatigue.
 */
function checkBeginnerStructuredSupportGate(
  input: HintLadderInput,
): HintLadderResult | null {
  if (!isBeginnerLevel(input.cefrLevel)) return null;

  // Fatal meaning — don't hint, correct directly
  if (input.errorSeverity === "fatal_meaning") return null;

  // Beginner hint fatigue — lighten up
  if (input.hintsThisSession >= 3) {
    return {
      decision: "HINT_MINIMAL",
      reason: `Beginner learner (${input.cefrLevel ?? "unknown"}) has received ${input.hintsThisSession} hints — reduce to minimal hints to prevent fatigue.`,
      reasonCode: "hint_beginner_fatigue_lighten",
      hintFocusArea: input.errorSeverity,
    };
  }

  // Grammar / lesson_target → medium hint with rule context
  if (
    input.errorSeverity === "grammar" ||
    input.errorSeverity === "lesson_target"
  ) {
    return {
      decision: "HINT_MEDIUM",
      reason: `Beginner learner (${input.cefrLevel ?? "unknown"}) with ${input.errorSeverity} error — medium hint with rule context to connect to what they're learning.`,
      reasonCode: "hint_beginner_structured_medium",
      hintFocusArea: input.errorSeverity,
    };
  }

  // Word choice / fluency / minor → minimal hint
  return {
    decision: "HINT_MINIMAL",
    reason: `Beginner learner (${input.cefrLevel ?? "unknown"}) with ${input.errorSeverity} error — minimal hint to nudge without overwhelming.`,
    reasonCode: "hint_beginner_structured_minimal",
    hintFocusArea: input.errorSeverity,
  };
}

/**
 * H8 — Advanced Learner Autonomy Gate
 *
 * Advanced learners (B2+) benefit from autonomy. Over-hinting an
 * advanced learner signals that Teacher Mercy doesn't trust their
 * ability — which undermines confidence.
 *
 * Policy:
 *   For all error types: use MINIMAL hint at most.
 *   Never escalate past MINIMAL for B2+ — they already know the
 *   rule; they just need the nudge to apply it.
 *   If the learner is confident + advanced → check if a hint is
 *   even warranted (they might be experimenting, not erring).
 *
 * Exception: self-correction awareness + advanced → still minimal
 * (H1 fires first and returns the minimal hint — this gate acts
 * as a ceiling to prevent H4/H6 from escalating to medium/strong).
 *
 * Note: this gate must fire AFTER H4/H6 so it can override their
 * escalation. Place late in the chain so it caps the ceiling.
 */
function checkAdvancedLearnerAutonomyGate(
  input: HintLadderInput,
): HintLadderResult | null {
  if (!isAdvancedLevel(input.cefrLevel)) return null;

  // Don't hint a confident advanced learner on minor/fluency errors —
  // they're likely experimenting or it's a slip
  if (
    input.learnerConfidence === "confident" &&
    (input.errorSeverity === "minor" || input.errorSeverity === "fluency")
  ) {
    return {
      decision: "NO_HINT",
      reason: `Confident advanced learner (${input.cefrLevel}) with ${input.errorSeverity} error — likely a slip or experiment. Don't undermine autonomy with a hint.`,
      reasonCode: "hint_advanced_autonomy_skip",
    };
  }

  // For recurring grammar/lesson_target errors at B2+: minimal hint only,
  // even if H4/H6 want to escalate. Advanced learners benefit from the
  // lightest touch — they have the knowledge; they need the awareness.
  if (
    input.errorSeverity === "grammar" ||
    input.errorSeverity === "lesson_target" ||
    input.errorSeverity === "word_choice"
  ) {
    return {
      decision: "HINT_MINIMAL",
      reason: `Advanced learner (${input.cefrLevel}) — minimal hint only. They have the knowledge; they need the awareness nudge, not the rule reminder.`,
      reasonCode: "hint_advanced_minimal_only",
      hintFocusArea: input.errorSeverity,
    };
  }

  // For other error types with advanced learners: don't hint
  return {
    decision: "NO_HINT",
    reason: `Advanced learner (${input.cefrLevel}) with ${input.errorSeverity} — hints are for building awareness, and this learner already has it.`,
    reasonCode: "hint_advanced_autonomy_no_hint",
  };
}

// ─── Default Fallback ────────────────────────────────────────────────────────

/**
 * Default hint ladder decision when no specific gate fires.
 *
 * Conservative default: NO_HINT. Hints should be triggered by specific
 * pedagogical signals, not as a default behavior. The gates above cover
 * all the cases where a hint is justified:
 *   - Self-correction awareness (H1)
 *   - Shy learner needs gentle guidance (H5)
 *   - Lesson target scaffolding (H6)
 *   - Beginner structured support (H7)
 *
 * When none of those fire, direct correction or suppression is the
 * better choice — hints without a clear pedagogical purpose feel
 * random and undermine the teacher's authority.
 *
 * One exception: if this is a first-time grammar error mid-session with
 * no hint history, suggest a minimal hint soon. This is the "gentle
 * introduction to hints" — let the learner discover that Teacher Mercy
 * will guide them, not just correct them.
 */
function defaultHintLadderTiming(input: HintLadderInput): HintLadderResult {
  // Gentle introduction to hints: first grammar/word_choice error,
  // mid-session, no hints yet → suggest a minimal hint soon
  if (
    input.hintsThisSession === 0 &&
    input.totalTurnsInSession >= 4 &&
    (input.errorSeverity === "grammar" || input.errorSeverity === "word_choice") &&
    input.recurringErrorCount === 1
  ) {
    return {
      decision: "HINT_SOON",
      reason: "First grammar/word-choice error mid-session with no hint history — suggest a minimal hint soon to introduce the learner to guided self-correction.",
      reasonCode: "hint_default_first_hint_suggestion",
      suggestAfterTurns: 2,
      hintFocusArea: input.errorSeverity,
    };
  }

  return {
    decision: "NO_HINT",
    reason: "No specific pedagogical signal justifying a hint at this moment — use direct correction or suppression based on correction timing policy.",
    reasonCode: "hint_default_no_hint",
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * The ordered list of gates that determine hint ladder timing.
 * Gates are evaluated in order; the first non-null result wins.
 *
 * Priority hierarchy:
 *   1. Too soon after last hint — never hint back-to-back, even for self-correction (H2)
 *   2. Hint saturation — prevent hint dependency, even for self-correction (H3)
 *   3. Self-correction window — a learner trying to self-correct gets a minimal nudge (H1)
 *   4. Recurring error escalation — climb the ladder (H4)
 *   5. Shy learner gentle entry — protect confidence (H5)
 *   6. Lesson target scaffolding — reference the lesson context (H6)
 *   7. Beginner structured support — guide step by step (H7)
 *   8. Advanced learner autonomy — preserve independence (H8)
 *   9. Default — conservative NO_HINT
 *
 * Design rationale for H2/H3 before all pedagogical gates (including H1):
 *   Learner state (recent hint, hint saturation) determines whether ANY
 *   hint is appropriate. A learner showing self-correction awareness after
 *   just receiving a hint (H2) is processing the previous hint — don't interrupt.
 *   A learner at saturation (H3) needs to work independently — even
 *   self-correction awareness doesn't override the need to break dependency.
 *   State gates are prerequisites, not competing signals.
 *
 * Design rationale for H8 last:
 *   Advanced learner autonomy is a ceiling, not a floor. It overrides
 *   escalation from earlier gates to cap hints at MINIMAL for B2+.
 */
const GATES: ReadonlyArray<
  (input: HintLadderInput) => HintLadderResult | null
> = [
  checkTooSoonAfterHintGate,
  checkHintSaturationGate,
  checkSelfCorrectionWindowGate,
  checkRecurringErrorEscalationGate,
  checkShyLearnerGentleEntryGate,
  checkLessonTargetScaffoldingGate,
  checkBeginnerStructuredSupportGate,
  checkAdvancedLearnerAutonomyGate,
];

/**
 * Decide whether to use a hint, and at what level, for a learner error.
 *
 * Pure function — deterministic, no side effects, no I/O.
 *
 * @returns A HintLadderResult with the chosen decision and rationale.
 */
export function decideHintLadder(
  input: HintLadderInput,
): HintLadderResult {
  for (const gate of GATES) {
    const result = gate(input);
    if (result !== null) return result;
  }

  return defaultHintLadderTiming(input);
}

/**
 * Convenience: check whether a hint should be shown now
 * (HINT_MINIMAL, HINT_MEDIUM, or HINT_STRONG).
 */
export function isHintRecommendedNow(result: HintLadderResult): boolean {
  return (
    result.decision === "HINT_MINIMAL" ||
    result.decision === "HINT_MEDIUM" ||
    result.decision === "HINT_STRONG"
  );
}

/**
 * Convenience: check whether a hint is queued for later (HINT_SOON).
 */
export function isHintQueued(result: HintLadderResult): boolean {
  return result.decision === "HINT_SOON";
}

/**
 * Convenience: check whether no hint is recommended at all.
 */
export function isNoHintRecommended(result: HintLadderResult): boolean {
  return result.decision === "NO_HINT";
}

/**
 * Convenience: check whether the hint level is minimal.
 */
export function isMinimalHint(result: HintLadderResult): boolean {
  return result.decision === "HINT_MINIMAL";
}

/**
 * Convenience: check whether the hint level is medium.
 */
export function isMediumHint(result: HintLadderResult): boolean {
  return result.decision === "HINT_MEDIUM";
}

/**
 * Convenience: check whether the hint level is strong.
 */
export function isStrongHint(result: HintLadderResult): boolean {
  return result.decision === "HINT_STRONG";
}

// ─── Catalogs ─────────────────────────────────────────────────────────────────

export const HINT_LADDER_DECISION_CATALOG: ReadonlyArray<{
  decision: HintLadderDecision;
  titleEn: string;
  titleVi: string;
  descriptionVi: string;
}> = [
  {
    decision: "HINT_MINIMAL",
    titleEn: "Minimal hint",
    titleVi: "Gợi ý nhẹ",
    descriptionVi: "Chỉ vào vùng lỗi — để người học tự phát hiện và sửa mà không cần nhắc quy luật.",
  },
  {
    decision: "HINT_MEDIUM",
    titleEn: "Medium hint",
    titleVi: "Gợi ý vừa",
    descriptionVi: "Nhắc lại quy luật liên quan — giúp người học kết nối kiến thức đã học với lỗi hiện tại.",
  },
  {
    decision: "HINT_STRONG",
    titleEn: "Strong hint",
    titleVi: "Gợi ý mạnh",
    descriptionVi: "Gần như đưa ra đáp án — thu hẹp khoảng cách xuống còn một bước cuối cùng.",
  },
  {
    decision: "HINT_SOON",
    titleEn: "Hint soon",
    titleVi: "Gợi ý lát nữa",
    descriptionVi: "Xếp lịch gợi ý sau 1–2 lượt — để người học có cơ hội tự sửa trước.",
  },
  {
    decision: "NO_HINT",
    titleEn: "No hint",
    titleVi: "Không gợi ý",
    descriptionVi: "Không dùng gợi ý — sửa trực tiếp hoặc tiếp tục trò chuyện bình thường.",
  },
];

export const HINT_LADDER_REASON_CODE_CATALOG: ReadonlyArray<{
  reasonCode: string;
  decision: HintLadderDecision;
  descriptionVi: string;
}> = [
  { reasonCode: "hint_self_correction_window", decision: "HINT_MINIMAL", descriptionVi: "Người học đang cố tự sửa — gợi ý nhẹ để dẫn đường." },
  { reasonCode: "hint_self_correction_escalate", decision: "HINT_MEDIUM", descriptionVi: "Đã gợi ý nhẹ nhưng lỗi vẫn lặp — nâng lên gợi ý vừa." },
  { reasonCode: "hint_too_soon_after_hint", decision: "NO_HINT", descriptionVi: "Vừa gợi ý xong — để người học có thời gian xử lý." },
  { reasonCode: "hint_saturation_block_all", decision: "NO_HINT", descriptionVi: "Đã gợi ý quá nhiều (≥8) — chặn để tránh phụ thuộc." },
  { reasonCode: "hint_saturation_diminishing_return", decision: "NO_HINT", descriptionVi: "Gợi ý trước không hiệu quả — tạm dừng để tránh lãng phí." },
  { reasonCode: "hint_escalation_ceiling", decision: "NO_HINT", descriptionVi: "Đã gợi ý mạnh nhất mà vẫn sai — chuyển sang sửa trực tiếp." },
  { reasonCode: "hint_recurring_escalate_to_medium", decision: "HINT_MEDIUM", descriptionVi: "Lỗi lặp ≥3 lần sau gợi ý nhẹ — nâng lên gợi ý vừa." },
  { reasonCode: "hint_recurring_escalate_to_strong", decision: "HINT_STRONG", descriptionVi: "Lỗi lặp ≥3 lần sau gợi ý vừa — nâng lên gợi ý mạnh." },
  { reasonCode: "hint_shy_first_hint_minimal", decision: "HINT_MINIMAL", descriptionVi: "Người học nhút nhát, gợi ý đầu tiên — bắt đầu thật nhẹ nhàng." },
  { reasonCode: "hint_shy_lesson_target_medium", decision: "HINT_MEDIUM", descriptionVi: "Người học nhút nhát, lỗi mục tiêu bài học — gợi ý vừa trong ngữ cảnh an toàn." },
  { reasonCode: "hint_shy_insufficient_space", decision: "NO_HINT", descriptionVi: "Người học nhút nhát — cần thêm không gian trước gợi ý tiếp theo." },
  { reasonCode: "hint_lesson_target_scaffolding", decision: "HINT_MEDIUM", descriptionVi: "Lỗi đúng mục tiêu bài học — gợi ý vừa, nhắc lại quy luật vừa học." },
  { reasonCode: "hint_beginner_structured_medium", decision: "HINT_MEDIUM", descriptionVi: "Người mới học, lỗi ngữ pháp — gợi ý vừa có ngữ cảnh quy luật." },
  { reasonCode: "hint_beginner_structured_minimal", decision: "HINT_MINIMAL", descriptionVi: "Người mới học, lỗi nhẹ — gợi ý nhẹ, không làm quá tải." },
  { reasonCode: "hint_beginner_fatigue_lighten", decision: "HINT_MINIMAL", descriptionVi: "Người mới học đã nhận nhiều gợi ý — giảm nhẹ để tránh mệt." },
  { reasonCode: "hint_advanced_autonomy_skip", decision: "NO_HINT", descriptionVi: "Người học trình độ cao, tự tin — chắc là sơ suất, không cần gợi ý." },
  { reasonCode: "hint_advanced_minimal_only", decision: "HINT_MINIMAL", descriptionVi: "Người học trình độ cao — chỉ cần gợi ý nhẹ nhất, họ đã biết quy luật." },
  { reasonCode: "hint_advanced_autonomy_no_hint", decision: "NO_HINT", descriptionVi: "Người học trình độ cao — tôn trọng khả năng tự học, không gợi ý." },
  { reasonCode: "hint_default_first_hint_suggestion", decision: "HINT_SOON", descriptionVi: "Lỗi đầu tiên, chưa có gợi ý nào — đề xuất gợi ý nhẹ để giới thiệu cách học." },
  { reasonCode: "hint_default_no_hint", decision: "NO_HINT", descriptionVi: "Không có tín hiệu cần gợi ý — dùng sửa trực tiếp hoặc không sửa." },
];
