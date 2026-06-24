/**
 * Teacher Mercy — Drill Timing Decision Policy
 *
 * Decides WHEN (not what) Teacher Mercy should launch a focused drill
 * — a short, targeted practice activity that reinforces a specific skill.
 *
 * A drill is different from a correction:
 *   Correction = "You said X wrong, here's the right way."
 *   Drill      = "Let's practice this pattern 5 times to build the habit."
 *
 * This module layers ON TOP of correction timing (teacherMercyCorrectionTiming.ts)
 * and suppression rules (suppressionRules.ts). It answers a different question:
 * "Given the current learner state and session context, is NOW a good time
 *  to launch a drill, or should we wait?"
 *
 * Design principles:
 *   1. Drill as reinforcement, not punishment — drills follow corrections,
 *      they don't replace them.
 *   2. Timing matters — drilling too soon overwhelms; drilling too late
 *      misses the learning window.
 *   3. Learner-aware — shy learners need more space before a drill;
 *      beginners need drills sooner to prevent fossilization.
 *   4. Pattern over instance — a recurring error (≥3) is a drill signal;
 *      a one-off slip is not.
 *   5. Lesson rhythm — drills fit into the natural lesson cadence,
 *      not as interruptions.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

import type { ErrorSeverity, LearnerConfidence } from "./teacherMercyCorrectionTiming";

// ─── Drill Decision Types ─────────────────────────────────────────────────

/**
 * The four drill timing decisions Teacher Mercy can make.
 *
 * DRILL_NOW      — launch a focused drill right now, in this or the next turn.
 * DRILL_SOON      — queue a drill for ~3 turns from now; let the conversation breathe first.
 * DRILL_AT_END    — recommend a drill at the end of the current lesson / review phase.
 * NO_DRILL        — not the right time; continue normal conversation.
 */
export type DrillDecision =
  | "DRILL_NOW"
  | "DRILL_SOON"
  | "DRILL_AT_END"
  | "NO_DRILL";

/**
 * Input context for the drill timing decision.
 */
export type DrillTimingInput = {
  /** How many turns have passed since the last drill was launched (or Infinity if none yet). */
  turnsSinceLastDrill: number;
  /** Total corrections delivered in this session so far. */
  totalCorrectionsInSession: number;
  /** How many times the same error pattern has appeared in recent turns (1+). */
  recurringErrorCount: number;
  /** The severity of the recurring / primary error. */
  errorSeverity: ErrorSeverity;
  /** Known CEFR level (null = unknown, treated as beginner). */
  cefrLevel: string | null;
  /** The learner's apparent confidence. */
  learnerConfidence: LearnerConfidence;
  /** Whether the recurring error is on the current lesson's target skill. */
  isCurrentLessonTarget: boolean;
  /** Total conversation turns in this session so far. */
  totalTurnsInSession: number;
  /** Approximate % through the current lesson (0–100). */
  currentLessonProgress: number;
  /** How many drills have already been launched in this session. */
  drillsThisSession: number;
};

/**
 * The drill timing decision with full rationale.
 */
export type DrillTimingResult = {
  /** The chosen drill decision. */
  decision: DrillDecision;
  /**
   * Human-readable reason for the decision, in English (for telemetry/logging).
   * Vietnamese-facing explanations belong in the response generation layer.
   */
  reason: string;
  /** Machine-readable reason code for telemetry/analytics. */
  reasonCode: string;
  /**
   * For DRILL_SOON: suggested number of turns to wait before launching.
   * undefined for all other decisions.
   */
  suggestAfterTurns?: number;
  /**
   * The skill target suggested for the drill (e.g., "past-tense", "articles").
   * Filled when the decision is DRILL_NOW or DRILL_SOON.
   */
  suggestedDrillTarget?: string;
};

// ─── CEFR Level Utilities ────────────────────────────────────────────────

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

// ─── Core Decision Gates ─────────────────────────────────────────────────

/**
 * D1 — Fatal Error Recovery Gate
 *
 * If the learner just made a fatal meaning error, launch a quick
 * drill on the corrected pattern immediately — this prevents
 * the error from fossilizing and reinforces the correct form
 * while the context is still fresh.
 *
 * Exception: skip if we just did a drill (< 1 turn ago) —
 * the correction itself serves as the immediate reinforcement.
 */
function checkFatalErrorRecoveryGate(
  input: DrillTimingInput,
): DrillTimingResult | null {
  if (input.errorSeverity !== "fatal_meaning") return null;

  // If we literally just did a drill, let the correction sink in first
  if (input.turnsSinceLastDrill < 1) return null;

  return {
    decision: "DRILL_NOW",
    reason:
      "Fatal meaning error detected — launching immediate drill on the corrected pattern to prevent fossilization while context is fresh.",
    reasonCode: "drill_fatal_error_recovery",
    suggestedDrillTarget: "meaning-clarification",
  };
}

/**
 * D2 — Lesson Target Reinforcement Gate
 *
 * If the error is on the current lesson's target skill AND it has
 * appeared at least twice, drill it now. The lesson is designed
 * around this skill — a drill right now reinforces the lesson's
 * core objective.
 *
 * Single occurrence: let the correction handle it.
 * Repeated (≥2): the learner needs focused practice, not just a correction.
 */
function checkLessonTargetReinforcementGate(
  input: DrillTimingInput,
): DrillTimingResult | null {
  if (!input.isCurrentLessonTarget) return null;
  if (input.recurringErrorCount < 2) return null;

  // Don't drill if we just did one — give at least 1 turn of space
  if (input.turnsSinceLastDrill < 1) return null;

  return {
    decision: "DRILL_NOW",
    reason: `Lesson target error repeated ${input.recurringErrorCount} times — drill now to reinforce the core lesson objective.`,
    reasonCode: "drill_lesson_target_reinforcement",
    suggestedDrillTarget: `lesson-target:${input.errorSeverity}`,
  };
}

/**
 * D3 — Recurring Error Pattern Gate
 *
 * If the same error pattern has appeared ≥3 times AND we haven't
 * drilled recently (≥5 turns since last drill), launch a drill.
 *
 * A recurring pattern is the strongest signal that a correction
 * alone isn't enough — the learner needs focused practice.
 *
 * The 5-turn gap ensures drills are spaced, not back-to-back.
 */
function checkRecurringErrorPatternGate(
  input: DrillTimingInput,
): DrillTimingResult | null {
  if (input.recurringErrorCount < 3) return null;
  if (input.turnsSinceLastDrill < 5) return null;

  return {
    decision: "DRILL_NOW",
    reason: `Same error pattern repeated ${input.recurringErrorCount} times with ${input.turnsSinceLastDrill} turns since last drill — focused drill needed to break the pattern.`,
    reasonCode: "drill_recurring_error_pattern",
    suggestedDrillTarget: input.errorSeverity,
  };
}

/**
 * D4 — Too Soon After Drill Gate
 *
 * If we drilled very recently (< 3 turns ago), don't launch another.
 * Back-to-back drills feel punishing, not helpful.
 *
 * Exception for lesson-target errors: D2 already handles those
 * with its own spacing check.
 */
function checkTooSoonAfterDrillGate(
  input: DrillTimingInput,
): DrillTimingResult | null {
  if (input.turnsSinceLastDrill >= 3) return null;

  return {
    decision: "NO_DRILL",
    reason: `Only ${input.turnsSinceLastDrill} turn(s) since last drill — too soon. Let the learner absorb before more practice.`,
    reasonCode: "drill_too_soon_after_drill",
  };
}

/**
 * D5 — Correction Overload Gate
 *
 * If the session already has many corrections (≥8), the learner
 * is likely fatigued. Don't drill now — queue it for later (DRILL_SOON)
 * so the learner gets a break.
 *
 * At ≥12 corrections, skip the drill entirely (NO_DRILL) —
 * the session is already heavy; a drill would be demotivating.
 */
function checkCorrectionOverloadGate(
  input: DrillTimingInput,
): DrillTimingResult | null {
  if (input.totalCorrectionsInSession < 8) return null;

  // Very heavy session — skip drill entirely
  if (input.totalCorrectionsInSession >= 12) {
    return {
      decision: "NO_DRILL",
      reason: `Already ${input.totalCorrectionsInSession} corrections in this session — learner is correction-fatigued. Skip drill to avoid demotivation.`,
      reasonCode: "drill_correction_overload_skip",
    };
  }

  // Heavy session — delay the drill
  return {
    decision: "DRILL_SOON",
    reason: `Already ${input.totalCorrectionsInSession} corrections in this session — queue drill for later to give the learner a break.`,
    reasonCode: "drill_correction_overload_delay",
    suggestAfterTurns: 4,
    suggestedDrillTarget: input.errorSeverity,
  };
}

/**
 * D6 — Shy Learner Protection Gate
 *
 * Shy learners need more conversational space between corrections
 * and drills. Don't launch a drill unless ≥8 turns have passed
 * since the last one.
 *
 * This gives shy learners time to rebuild confidence before
 * being asked to do focused practice.
 */
function checkShyLearnerProtectionGate(
  input: DrillTimingInput,
): DrillTimingResult | null {
  if (input.learnerConfidence !== "shy") return null;

  // Shy learners need a longer gap — 8 turns minimum
  if (input.turnsSinceLastDrill < 8) {
    return {
      decision: "NO_DRILL",
      reason: `Shy learner with only ${input.turnsSinceLastDrill} turns since last drill — need ≥8 turns of conversational space to rebuild confidence.`,
      reasonCode: "drill_shy_learner_space",
    };
  }

  // Even after 8 turns, queue it as DRILL_SOON (not NOW) for shy learners
  return {
    decision: "DRILL_SOON",
    reason: `Shy learner — queue drill for 2 turns from now to introduce it gently.`,
    reasonCode: "drill_shy_learner_gentle",
    suggestAfterTurns: 2,
    suggestedDrillTarget: input.errorSeverity,
  };
}

/**
 * D7 — Beginner Priority Gate
 *
 * Beginners (A1–A2) benefit from frequent, short drills to prevent
 * fossilized errors. If a beginner has a recurring grammar or
 * lesson-target error, drill immediately (unless they're shy —
 * D6 handles that case since it fires first).
 *
 * For minor/fluency errors, don't drill — beginners should focus
 * on grammar and meaning first.
 */
function checkBeginnerPriorityGate(
  input: DrillTimingInput,
): DrillTimingResult | null {
  if (!isBeginnerLevel(input.cefrLevel)) return null;

  // For beginners: grammar/lesson_target/word_choice errors → drill now
  // (back-to-back protection is handled by D4 which fires before this gate)
  // (fatal_meaning is caught by D1 before reaching this gate)
  if (
    input.errorSeverity === "grammar" ||
    input.errorSeverity === "lesson_target" ||
    (input.errorSeverity === "word_choice" && input.recurringErrorCount >= 2)
  ) {
    return {
      decision: "DRILL_NOW",
      reason: `Beginner learner (${input.cefrLevel ?? "unknown"}) with ${input.errorSeverity} error — drill now to prevent fossilization.`,
      reasonCode: "drill_beginner_priority",
      suggestedDrillTarget: input.errorSeverity,
    };
  }

  // Minor/fluency: don't drill — focus on grammar first
  return null;
}

/**
 * D8 — Lesson Completion Edge Gate
 *
 * If the learner is near the end of the current lesson (≥75% progress),
 * don't interrupt with a mid-lesson drill. Instead, queue the drill
 * for the end-of-lesson review phase (DRILL_AT_END).
 *
 * Exception: lesson-target errors still get drilled (D2 fires first).
 */
function checkLessonCompletionEdgeGate(
  input: DrillTimingInput,
): DrillTimingResult | null {
  if (input.currentLessonProgress < 75) return null;

  // Near end of lesson — save drill for review phase
  return {
    decision: "DRILL_AT_END",
    reason: `Lesson ${input.currentLessonProgress}% complete — save drill for end-of-lesson review phase to avoid disrupting the lesson flow.`,
    reasonCode: "drill_lesson_completion_edge",
  };
}

// ─── Default Fallback ────────────────────────────────────────────────────

/**
 * Default drill timing decision when no specific gate fires.
 *
 * Conservative default: NO_DRILL. Drills should be triggered by
 * specific pedagogical signals, not as a default behavior.
 * The gates above cover all the cases where a drill is justified.
 */
function defaultDrillTiming(input: DrillTimingInput): DrillTimingResult {
  // If we haven't drilled at all this session AND there's a recurring error
  // AND we're mid-session, suggest a drill soon as a gentle nudge.
  if (
    input.drillsThisSession === 0 &&
    input.recurringErrorCount >= 2 &&
    input.totalTurnsInSession >= 6 &&
    input.turnsSinceLastDrill >= 100 // effectively "never drilled"
  ) {
    return {
      decision: "DRILL_SOON",
      reason: `No drills yet this session with recurring errors — suggesting a drill in a few turns to reinforce learning.`,
      reasonCode: "drill_default_first_drill_suggestion",
      suggestAfterTurns: 3,
      suggestedDrillTarget: input.errorSeverity,
    };
  }

  return {
    decision: "NO_DRILL",
    reason: "No specific pedagogical signal justifying a drill at this moment — continue normal conversation.",
    reasonCode: "drill_default_no_drill",
  };
}

// ─── Public API ──────────────────────────────────────────────────────────

/**
 * The ordered list of gates that determine drill timing.
 * Gates are evaluated in order; the first non-null result wins.
 *
 * Priority hierarchy:
 *   1. Fatal error recovery — drill the corrected pattern immediately (D1)
 *   2. Lesson target reinforcement — drill the core lesson skill (D2)
 *   3. Too soon after drill — never drill back-to-back (D4)
 *   4. Correction overload — respect learner fatigue before pattern signals (D5)
 *   5. Shy learner protection — give conversational space before drilling (D6)
 *   6. Recurring error pattern — strong pedagogical signal, but second to learner state (D3)
 *   7. Beginner priority — prevent fossilization (D7)
 *   8. Lesson completion edge — save for review phase (D8)
 *   9. Default — conservative NO_DRILL
 *
 * Design rationale for D4/D5/D6 before D3:
 *   A recurring error pattern is a strong signal to drill, but learner
 *   state (fatigue, confidence, recency) determines whether the drill
 *   will actually be effective. A tired or overwhelmed learner won't
 *   benefit from a drill no matter how recurring the error is.
 */
const GATES: ReadonlyArray<
  (input: DrillTimingInput) => DrillTimingResult | null
> = [
  checkFatalErrorRecoveryGate,
  checkLessonTargetReinforcementGate,
  checkTooSoonAfterDrillGate,
  checkCorrectionOverloadGate,
  checkShyLearnerProtectionGate,
  checkRecurringErrorPatternGate,
  checkBeginnerPriorityGate,
  checkLessonCompletionEdgeGate,
];

/**
 * Decide whether to launch a drill right now, soon, at lesson end, or not at all.
 *
 * Pure function — deterministic, no side effects, no I/O.
 *
 * @returns A DrillTimingResult with the chosen decision and rationale.
 */
export function decideDrillTiming(
  input: DrillTimingInput,
): DrillTimingResult {
  for (const gate of GATES) {
    const result = gate(input);
    if (result !== null) return result;
  }

  return defaultDrillTiming(input);
}

/**
 * Convenience: check whether a drill is recommended now
 * (as opposed to later or not at all).
 */
export function isDrillRecommendedNow(result: DrillTimingResult): boolean {
  return result.decision === "DRILL_NOW";
}

/**
 * Convenience: check whether a drill is queued for later
 * (DRILL_SOON or DRILL_AT_END).
 */
export function isDrillQueued(result: DrillTimingResult): boolean {
  return result.decision === "DRILL_SOON" || result.decision === "DRILL_AT_END";
}

/**
 * Convenience: check whether no drill is recommended at all.
 */
export function isNoDrillRecommended(result: DrillTimingResult): boolean {
  return result.decision === "NO_DRILL";
}

// ─── Catalogs ─────────────────────────────────────────────────────────────

export const DRILL_TIMING_DECISION_CATALOG: ReadonlyArray<{
  decision: DrillDecision;
  titleEn: string;
  titleVi: string;
  descriptionVi: string;
}> = [
  {
    decision: "DRILL_NOW",
    titleEn: "Drill now",
    titleVi: "Luyện tập ngay",
    descriptionVi: "Khởi động bài luyện tập ngắn ngay bây giờ — kỹ năng cần được củng cố lập tức.",
  },
  {
    decision: "DRILL_SOON",
    titleEn: "Drill soon",
    titleVi: "Luyện tập lát nữa",
    descriptionVi: "Xếp lịch luyện tập sau vài lượt — để người học có không gian trò chuyện trước.",
  },
  {
    decision: "DRILL_AT_END",
    titleEn: "Drill at end",
    titleVi: "Luyện tập cuối bài",
    descriptionVi: "Dành bài luyện tập cho phần ôn tập cuối bài — không làm gián đoạn bài học.",
  },
  {
    decision: "NO_DRILL",
    titleEn: "No drill",
    titleVi: "Không luyện tập",
    descriptionVi: "Tiếp tục trò chuyện bình thường — chưa đến lúc phù hợp để luyện tập.",
  },
];

export const DRILL_TIMING_REASON_CODE_CATALOG: ReadonlyArray<{
  reasonCode: string;
  decision: DrillDecision;
  descriptionVi: string;
}> = [
  { reasonCode: "drill_fatal_error_recovery", decision: "DRILL_NOW", descriptionVi: "Lỗi nghĩa nghiêm trọng — luyện tập ngay để tránh thành thói quen sai." },
  { reasonCode: "drill_lesson_target_reinforcement", decision: "DRILL_NOW", descriptionVi: "Lỗi lặp ở mục tiêu bài học — luyện tập để củng cố." },
  { reasonCode: "drill_recurring_error_pattern", decision: "DRILL_NOW", descriptionVi: "Lỗi lặp ≥ 3 lần — cần luyện tập để phá vỡ mẫu sai." },
  { reasonCode: "drill_too_soon_after_drill", decision: "NO_DRILL", descriptionVi: "Vừa luyện tập xong — để người học hấp thụ đã." },
  { reasonCode: "drill_correction_overload_delay", decision: "DRILL_SOON", descriptionVi: "Đã sửa nhiều — để luyện tập sau cho đỡ mệt." },
  { reasonCode: "drill_correction_overload_skip", decision: "NO_DRILL", descriptionVi: "Đã sửa rất nhiều — bỏ qua luyện tập để tránh nản." },
  { reasonCode: "drill_shy_learner_space", decision: "NO_DRILL", descriptionVi: "Người học nhút nhát — cần thêm không gian trò chuyện." },
  { reasonCode: "drill_shy_learner_gentle", decision: "DRILL_SOON", descriptionVi: "Người học nhút nhát — giới thiệu luyện tập nhẹ nhàng." },
  { reasonCode: "drill_beginner_priority", decision: "DRILL_NOW", descriptionVi: "Mới học — luyện tập ngay để tránh thành thói quen sai." },
  { reasonCode: "drill_lesson_completion_edge", decision: "DRILL_AT_END", descriptionVi: "Sắp hết bài — để dành luyện tập cho phần ôn tập." },
  { reasonCode: "drill_default_first_drill_suggestion", decision: "DRILL_SOON", descriptionVi: "Chưa có luyện tập nào — gợi ý nhẹ nhàng." },
  { reasonCode: "drill_default_no_drill", decision: "NO_DRILL", descriptionVi: "Chưa có tín hiệu cần luyện tập — tiếp tục trò chuyện." },
];
