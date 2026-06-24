/**
 * Teacher Mercy — Learner Readiness Decision Gate
 *
 * Diagnoses whether a learner is ready for the current lesson content,
 * or needs prerequisite work — mirroring how a skilled human teacher
 * checks readiness before launching into new material.
 *
 * A human teacher doesn't blindly follow the lesson plan. Before
 * starting a new concept, they check:
 *   "Does the student have the foundation for this?"
 *   "Did they struggle with the prerequisite last time?"
 *   "Are they in the right headspace to learn something new?"
 *   "Have they already mastered this and need a skip-ahead?"
 *
 * This module answers those questions algorithmically. It layers
 * ALONGSIDE the existing correction, timing, hint, drill, challenge,
 * encouragement, and error-recovery policies. It answers a different
 * question:
 *   "Given the learner's prerequisite mastery, recent performance,
 *    struggle patterns, and emotional state — should they proceed
 *    with the current lesson, or do they need something else first?"
 *
 * Readiness decisions:
 *   READY_NOW                — proceed with the current lesson.
 *   NOT_READY_PREREQUISITE   — learner needs prerequisite work first.
 *   NOT_READY_TOO_SOON       — learner needs more practice before retrying.
 *   NOT_READY_DIFFERENT_APPROACH — this lesson needs a different teaching angle.
 *   SKIP_AHEAD               — learner already knows this; skip to next.
 *   DEFER_READINESS_CHECK    — check again in a few turns (e.g., during frustration).
 *
 * Design principles:
 *   1. Prerequisite-first — no learner is pushed into content they lack
 *      the foundation for. This prevents the "failing upward" problem.
 *   2. Evidence over guesswork — readiness is computed from concrete
 *      signals (error rates, mastery data, attempt history), not vibes.
 *   3. Learner-aware — beginners get extra scaffolding checks; advanced
 *      learners get acceleration when they've already mastered the target.
 *   4. Frustration-aware — a frustrated learner isn't ready for anything
 *      new. Readiness checks defer until the emotional state recovers.
 *   5. Saturation-aware — repeating the same lesson without progress is
 *      a signal that the approach, not the learner, needs to change.
 *   6. Vietnamese-first — all rationale is produced in Vietnamese for the
 *      learner-facing layer; English rationale is for telemetry.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

// ─── Readiness Decision Types ────────────────────────────────────────────────

/**
 * The six readiness decisions Teacher Mercy can make.
 *
 * READY_NOW                  — learner has the foundation; proceed.
 * NOT_READY_PREREQUISITE     — prerequisite skills not mastered; recommend
 *                              specific prerequisite work.
 * NOT_READY_TOO_SOON         — learner just attempted this lesson and failed;
 *                              need more practice first.
 * NOT_READY_DIFFERENT_APPROACH — same lesson attempted ≥3× without progress;
 *                                the approach needs to change.
 * SKIP_AHEAD                 — learner already shows mastery of this lesson's
 *                              target; accelerate to next content.
 * DEFER_READINESS_CHECK      — not the right moment (e.g., frustration);
 *                              check again in a few turns.
 */
export type ReadinessDecision =
  | "READY_NOW"
  | "NOT_READY_PREREQUISITE"
  | "NOT_READY_TOO_SOON"
  | "NOT_READY_DIFFERENT_APPROACH"
  | "SKIP_AHEAD"
  | "DEFER_READINESS_CHECK";

/**
 * Input context for the learner readiness decision gate.
 */
export type LearnerReadinessInput = {
  /** Known CEFR level (null = unknown, treated as beginner). */
  cefrLevel: string | null;
  /** Ratio of prerequisite skills the learner has mastered (0.0–1.0).
   *  1.0 = all prerequisites mastered. Lower = more gaps. */
  prerequisiteMasteryRatio: number;
  /** Error rate on prerequisite skill patterns in recent turns (0.0–1.0).
   *  Even if the learner "passed" a prerequisite before, a high error
   *  rate now suggests erosion. */
  prerequisiteErrorRate: number;
  /** How many turns since the learner last attempted this lesson
   *  (Infinity if never attempted). */
  turnsSinceLastLessonAttempt: number;
  /** How many times this same lesson has been attempted this session. */
  lessonAttemptsThisSession: number;
  /** Estimated mastery of the current lesson's target skill (0.0–1.0).
   *  0.0 = no demonstrated knowledge; 1.0 = fully demonstrated. */
  lessonTargetMasteryEstimate: number;
  /** How many turns in a row have been correct (≥0). */
  consecutiveCorrectTurns: number;
  /** Specific prerequisite skill IDs where the learner keeps struggling
   *  (empty = no identified struggle patterns). */
  recurringPrerequisiteStruggles: string[];
  /** The learner's apparent confidence level. */
  learnerConfidence: "shy" | "normal" | "confident";
  /** Whether the learner is showing frustration signals. */
  isShowingFrustration: boolean;
  /** Total conversation turns in this session (≥0). */
  totalTurnsInSession: number;
  /** Whether the learner showed significant progress on the last
   *  lesson attempt (e.g., error rate dropped by ≥50%). */
  showedProgressOnLastAttempt: boolean;
};

/**
 * The learner readiness decision with full rationale.
 */
export type LearnerReadinessResult = {
  /** The chosen readiness decision. */
  decision: ReadinessDecision;
  /**
   * Human-readable reason for the decision, in English (for telemetry/logging).
   * Vietnamese-facing explanations belong in the response generation layer.
   */
  reason: string;
  /** Machine-readable reason code for telemetry/analytics. */
  reasonCode: string;
  /**
   * For NOT_READY_PREREQUISITE: the specific prerequisite skills the learner
   * should work on before attempting this lesson.
   */
  prerequisiteGapSkills?: string[];
  /**
   * For NOT_READY_TOO_SOON: suggested number of turns to wait before
   * re-checking readiness.
   */
  suggestWaitTurns?: number;
  /**
   * For SKIP_AHEAD: the suggested next lesson or skill to target.
   */
  suggestedNextTarget?: string;
  /**
   * For DEFER_READINESS_CHECK: suggested number of turns before re-checking.
   */
  deferTurns?: number;
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
 * R1 — Prerequisite Deficiency Gate
 *
 * If prerequisite skills are not sufficiently mastered (< 70%),
 * the learner is NOT ready — they need prerequisite work first.
 *
 * This is the strongest blocking signal. A human teacher would never
 * launch into the present perfect tense with a student who hasn't
 * mastered the past participle forms. Prerequisites exist for a reason.
 *
 * Thresholds:
 *   < 50% mastery → severe prerequisite gap; recommend specific work.
 *   50%–69%      → moderate gap; recommend review, not new content.
 *   ≥ 70%        → sufficient foundation; pass through to subsequent gates.
 */
function checkPrerequisiteDeficiencyGate(
  input: LearnerReadinessInput,
): LearnerReadinessResult | null {
  if (input.prerequisiteMasteryRatio >= 0.7) return null;

  const isSevere = input.prerequisiteMasteryRatio < 0.5;

  return {
    decision: "NOT_READY_PREREQUISITE",
    reason: isSevere
      ? `Severe prerequisite deficiency: only ${Math.round(input.prerequisiteMasteryRatio * 100)}% of prerequisite skills mastered. Block lesson until foundation is rebuilt.`
      : `Moderate prerequisite gap: ${Math.round(input.prerequisiteMasteryRatio * 100)}% prerequisite mastery — recommend focused review before new content.`,
    reasonCode: isSevere
      ? "readiness_severe_prerequisite_gap"
      : "readiness_moderate_prerequisite_gap",
    prerequisiteGapSkills: input.recurringPrerequisiteStruggles.length > 0
      ? [...input.recurringPrerequisiteStruggles]
      : undefined,
    suggestWaitTurns: isSevere ? 6 : 3,
  };
}

/**
 * R2 — Prerequisite Error Spike Gate
 *
 * If the learner's error rate on prerequisite patterns is high (≥50%),
 * block even if they previously "passed" those prerequisites.
 *
 * This catches prerequisite erosion — the learner learned past tense
 * two weeks ago, but they're making mistakes on it again now. A human
 * teacher catches this and pauses the new lesson to re-stabilize the
 * foundation before building on it.
 *
 * CEFR-sensitive: beginners (A1-A2) have a lower threshold (40%)
 * because their foundation is thinner and needs more protection.
 */
function checkPrerequisiteErrorSpikeGate(
  input: LearnerReadinessInput,
): LearnerReadinessResult | null {
  const threshold = isBeginnerLevel(input.cefrLevel) ? 0.4 : 0.5;

  if (input.prerequisiteErrorRate < threshold) return null;

  return {
    decision: "NOT_READY_PREREQUISITE",
    reason: `Prerequisite error spike: ${Math.round(input.prerequisiteErrorRate * 100)}% error rate on prerequisite patterns (threshold: ${Math.round(threshold * 100)}%). Prerequisite erosion detected — stabilize foundation before new content.`,
    reasonCode: "readiness_prerequisite_error_spike",
    prerequisiteGapSkills: input.recurringPrerequisiteStruggles.length > 0
      ? [...input.recurringPrerequisiteStruggles]
      : undefined,
    suggestWaitTurns: 4,
  };
}

/**
 * R3 — Too Soon After Failed Attempt Gate
 *
 * If the learner just attempted this lesson recently (< 4 turns ago)
 * and didn't show progress, don't retry yet. They need more practice
 * and processing time before another attempt.
 *
 * A human teacher doesn't re-teach the same lesson two minutes after
 * the first attempt failed. They give the learner space to absorb,
 * practice related skills, and return when the foundation is stronger.
 *
 * If the learner showed progress on the last attempt (error rate dropped),
 * the gate relaxes to 2 turns — progress means they're getting closer,
 * and a faster retry is appropriate.
 */
function checkTooSoonAfterFailedAttemptGate(
  input: LearnerReadinessInput,
): LearnerReadinessResult | null {
  if (input.lessonAttemptsThisSession === 0) return null;

  const minGapTurns = input.showedProgressOnLastAttempt ? 2 : 4;

  if (input.turnsSinceLastLessonAttempt >= minGapTurns) return null;

  return {
    decision: "NOT_READY_TOO_SOON",
    reason: input.showedProgressOnLastAttempt
      ? `Only ${input.turnsSinceLastLessonAttempt} turn(s) since last attempt — learner showed progress but needs ≥2 turns of practice before retry.`
      : `Only ${input.turnsSinceLastLessonAttempt} turn(s) since last failed attempt — learner needs ≥4 turns of practice and processing before retrying.`,
    reasonCode: input.showedProgressOnLastAttempt
      ? "readiness_too_soon_progressing"
      : "readiness_too_soon_after_failure",
    suggestWaitTurns: minGapTurns - input.turnsSinceLastLessonAttempt,
  };
}

/**
 * R4 — Lesson Attempt Saturation Gate
 *
 * If the learner has attempted this same lesson ≥3 times this session
 * without clear progress, continuing with the same approach is likely
 * counterproductive.
 *
 * This gate prevents the "insanity loop" — trying the same thing
 * repeatedly and expecting different results. After 3+ attempts
 * without progress, a human teacher changes their approach:
 *   - Different explanation style (visual instead of verbal)
 *   - Different examples (concrete instead of abstract)
 *   - Different scaffolding (more granular steps)
 *   - Or skip this lesson and return to it later from a different angle
 *
 * Exception: if the learner is showing clear progress (error rate
 * dropping across attempts), this gate passes through — they're
 * getting closer, just not there yet.
 */
function checkLessonAttemptSaturationGate(
  input: LearnerReadinessInput,
): LearnerReadinessResult | null {
  if (input.lessonAttemptsThisSession < 3) return null;

  // If learner is showing progress across attempts, let them continue
  if (input.showedProgressOnLastAttempt) return null;

  return {
    decision: "NOT_READY_DIFFERENT_APPROACH",
    reason: `Same lesson attempted ${input.lessonAttemptsThisSession} times without clear progress — continuing with the same approach is likely counterproductive. Recommend a different teaching angle or deferring this lesson.`,
    reasonCode: "readiness_lesson_attempt_saturation",
    suggestWaitTurns: 8,
  };
}

/**
 * R5 — Beginner Foundational Gate
 *
 * Beginners (A1-A2) need extra readiness protection. Their foundation
 * is thin, and pushing them into content they're not ready for can
 * create confusion that takes weeks to undo.
 *
 * Extra checks for beginners:
 *   - Prerequisite mastery must be ≥60% (vs. the 70% in R1 for all learners).
 *     Because R1 already handles the main check, this gate adds a tighter
 *     constraint for the "moderate gap" zone (50-69%) by requiring at least
 *     60% for beginners.
 *   - Requires ≥2 consecutive correct turns before attempting new content.
 *     A beginner who just made an error needs to stabilize before moving on.
 *   - If the beginner has specific recurring struggles, those must be
 *     addressed first — no skipping foundational patterns.
 */
function checkBeginnerFoundationalGate(
  input: LearnerReadinessInput,
): LearnerReadinessResult | null {
  if (!isBeginnerLevel(input.cefrLevel)) return null;

  // Beginner-specific: require ≥60% prerequisite mastery
  if (
    input.prerequisiteMasteryRatio >= 0.6 &&
    input.prerequisiteMasteryRatio < 0.7
  ) {
    return {
      decision: "NOT_READY_PREREQUISITE",
      reason: `Beginner learner (${input.cefrLevel ?? "unknown"}) at ${Math.round(input.prerequisiteMasteryRatio * 100)}% prerequisite mastery — requires ≥60% for beginners, but the 50-69% gap zone needs explicit review before new content.`,
      reasonCode: "readiness_beginner_foundational_gap",
      prerequisiteGapSkills: input.recurringPrerequisiteStruggles.length > 0
        ? [...input.recurringPrerequisiteStruggles]
        : undefined,
      suggestWaitTurns: 4,
    };
  }

  // Beginner-specific: require ≥2 consecutive correct turns before new content
  if (
    input.consecutiveCorrectTurns < 2 &&
    input.totalTurnsInSession >= 3 &&
    input.lessonAttemptsThisSession === 0
  ) {
    return {
      decision: "NOT_READY_TOO_SOON",
      reason: `Beginner learner (${input.cefrLevel ?? "unknown"}) with only ${input.consecutiveCorrectTurns} consecutive correct turn(s) — need ≥2 stable turns before attempting new content.`,
      reasonCode: "readiness_beginner_need_stable_turns",
      suggestWaitTurns: 2 - input.consecutiveCorrectTurns,
    };
  }

  return null;
}

/**
 * R6 — Struggle Pattern Gate
 *
 * If the learner has specific recurring struggle patterns on prerequisite
 * skills, block advancement until those specific patterns are addressed.
 *
 * This is the diagnostic precision of a human teacher: "You keep making
 * the same preposition mistake. Before we do the next lesson on phrasal
 * verbs, let's fix that preposition pattern first."
 *
 * A human teacher doesn't ignore a recurring foundational error just
 * because the student technically "passed" the prerequisite quiz.
 * Real mastery means the pattern is stable in production, not just
 * in isolated exercises.
 *
 * Threshold: ≥2 specific prerequisite struggle patterns → targeted
 * prerequisite work needed before new content.
 */
function checkStrugglePatternGate(
  input: LearnerReadinessInput,
): LearnerReadinessResult | null {
  if (input.recurringPrerequisiteStruggles.length < 2) return null;

  const skillList = input.recurringPrerequisiteStruggles.join(", ");

  return {
    decision: "NOT_READY_PREREQUISITE",
    reason: `${input.recurringPrerequisiteStruggles.length} recurring prerequisite struggle patterns detected: [${skillList}]. Address these foundational gaps before attempting new content — a human teacher would pause to fix the recurring pattern first.`,
    reasonCode: "readiness_struggle_pattern_block",
    prerequisiteGapSkills: [...input.recurringPrerequisiteStruggles],
    suggestWaitTurns: 5,
  };
}

/**
 * R7 — Frustration Gate
 *
 * If the learner is showing frustration, don't push new content.
 * A frustrated learner isn't in a learning state — their working
 * memory is consumed by the emotional response, not the material.
 *
 * A human teacher recognizes frustration and shifts gears:
 *   - Acknowledge the feeling ("I can see this is frustrating.")
 *   - Lighten the cognitive load (easier material, review, or a break)
 *   - Return to the challenging content when the learner is ready
 *
 * This gate defers the readiness check entirely — the question of
 * "is the learner ready for this content" is meaningless when the
 * learner is emotionally dysregulated. Wait for the frustration to
 * subside, then re-assess.
 */
function checkFrustrationGate(
  input: LearnerReadinessInput,
): LearnerReadinessResult | null {
  if (!input.isShowingFrustration) return null;

  return {
    decision: "DEFER_READINESS_CHECK",
    reason: "Learner is showing frustration — readiness assessment deferred. A frustrated learner cannot learn new content; address the emotional state first, then re-assess readiness.",
    reasonCode: "readiness_deferred_frustration",
    deferTurns: 4,
  };
}

/**
 * R8 — Advanced Learner Acceleration Gate
 *
 * Advanced learners (B2+) who already demonstrate mastery of the
 * current lesson target (≥85%) should skip ahead. Making an advanced
 * learner sit through content they already know is demotivating and
 * wastes their limited practice time.
 *
 * A human teacher with an advanced student constantly scans for
 * "they already know this" signals and accelerates accordingly.
 * The goal is to keep the learner in their zone of proximal
 * development — not too easy (boredom), not too hard (frustration).
 *
 * This gate only fires when:
 *   - The learner is B2+
 *   - They demonstrate ≥85% mastery of the current lesson target
 *   - They have ≥3 consecutive correct turns (not a fluke)
 *   - They are not frustrated (R7 fires first and would defer)
 *
 * The suggested next target is left to the caller to determine
 * based on curriculum sequencing — this gate only signals that
 * acceleration is appropriate.
 */
function checkAdvancedLearnerAccelerationGate(
  input: LearnerReadinessInput,
): LearnerReadinessResult | null {
  if (!isAdvancedLevel(input.cefrLevel)) return null;

  if (input.lessonTargetMasteryEstimate < 0.85) return null;
  if (input.consecutiveCorrectTurns < 3) return null;

  return {
    decision: "SKIP_AHEAD",
    reason: `Advanced learner (${input.cefrLevel}) demonstrates ${Math.round(input.lessonTargetMasteryEstimate * 100)}% mastery of the current lesson target with ${input.consecutiveCorrectTurns} consecutive correct turns — accelerate to next content to keep the learner in their zone of proximal development.`,
    reasonCode: "readiness_advanced_accelerate",
    suggestedNextTarget: "next-lesson-in-sequence",
  };
}

// ─── Default Fallback ────────────────────────────────────────────────────────

/**
 * Default learner readiness decision when no specific gate fires.
 *
 * Conservative default: READY_NOW. When none of the blocking gates
 * fire, the learner has:
 *   - Sufficient prerequisite mastery (R1 passed)
 *   - No prerequisite error spike (R2 passed)
 *   - Appropriate spacing since last attempt (R3 passed)
 *   - Not saturated on this lesson (R4 passed)
 *   - Beginner foundational checks cleared (R5 passed)
 *   - No recurring struggle patterns (R6 passed)
 *   - Not frustrated (R7 passed)
 *   - No reason to accelerate (R8 didn't fire)
 *
 * One nuance: if the learner has exactly 1 recurring prerequisite
 * struggle AND high overall prerequisite mastery (≥80%), still mark
 * READY_NOW but note the single struggle for targeted attention
 * during the lesson. The teacher can watch that pattern without
 * blocking the entire lesson.
 */
function defaultReadinessDecision(
  input: LearnerReadinessInput,
): LearnerReadinessResult {
  // Single recurring struggle + high overall mastery → ready but note it
  if (
    input.recurringPrerequisiteStruggles.length === 1 &&
    input.prerequisiteMasteryRatio >= 0.8
  ) {
    return {
      decision: "READY_NOW",
      reason: `Learner is ready — ${Math.round(input.prerequisiteMasteryRatio * 100)}% prerequisite mastery. Single struggle pattern [${input.recurringPrerequisiteStruggles[0]}] noted for targeted attention during the lesson, not a blocker.`,
      reasonCode: "readiness_ready_noted_struggle",
      prerequisiteGapSkills: [input.recurringPrerequisiteStruggles[0]],
    };
  }

  return {
    decision: "READY_NOW",
    reason: "Learner is ready — sufficient prerequisite mastery, no error spikes, appropriate spacing, no frustration signals. Proceed with the current lesson.",
    reasonCode: "readiness_ready",
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * The ordered list of gates that determine learner readiness.
 * Gates are evaluated in order; the first non-null result wins.
 *
 * Priority hierarchy:
 *   1. R7 Frustration — learner can't learn if frustrated (DEFER_READINESS_CHECK)
 *   2. R5 Beginner foundational — extra protection for thin foundations, fires
 *      before R1 to give beginners the beginner-specific rationale (NOT_READY_PREREQUISITE/TOO_SOON)
 *   3. R1 Prerequisite deficiency — no foundation, no lesson (NOT_READY_PREREQUISITE)
 *   4. R2 Prerequisite error spike — erosion caught early (NOT_READY_PREREQUISITE)
 *   5. R3 Too soon after failed attempt — processing time needed (NOT_READY_TOO_SOON)
 *   6. R4 Lesson attempt saturation — change approach, not learner (NOT_READY_DIFFERENT_APPROACH)
 *   7. R6 Struggle pattern — recurring gaps must be addressed (NOT_READY_PREREQUISITE)
 *   8. R8 Advanced acceleration — skip when mastery demonstrated (SKIP_AHEAD)
 *   9. Default — READY_NOW
 *
 * Design rationale for R7 first:
 *   Frustration is a state gate, not a skill gate. A frustrated learner
 *   cannot benefit from ANY readiness decision — the emotional state
 *   must be addressed before skill assessment is meaningful.
 *   R7 must fire before R1 because even a learner with 100% prerequisite
 *   mastery isn't "ready" if they're emotionally overwhelmed.
 *
 * Design rationale for R5 before R1:
 *   R5 is the more specific gate (beginners only, 50-69% gap zone).
 *   R1 is the more general gate (all learners, <70%). Specific-before-general
 *   ensures beginners get the beginner-specific rationale code
 *   ("readiness_beginner_foundational_gap") instead of the generic one
 *   ("readiness_moderate_prerequisite_gap"). For beginners below 50%, R5
 *   passes through (its range is 50-69%) and R1 catches the severe gap.
 *
 * Design rationale for R1/R2 before R3/R4:
 *   Prerequisite gaps (R1/R2) are foundational blockers that make the
 *   lesson impossible. Timing/spacing (R3/R4) is about optimal learning
 *   conditions. You can't optimize timing for content the learner lacks
 *   the foundation for.
 *
 * Design rationale for R8 last:
 *   Acceleration is a positive signal that should only fire when ALL
 *   blocking gates have passed. A learner who shows mastery but also
 *   has frustration (R7) or prerequisite gaps (R1) should NOT accelerate —
 *   those issues need resolution regardless of apparent mastery.
 */
const GATES: ReadonlyArray<
  (input: LearnerReadinessInput) => LearnerReadinessResult | null
> = [
  checkFrustrationGate,
  checkBeginnerFoundationalGate,
  checkPrerequisiteDeficiencyGate,
  checkPrerequisiteErrorSpikeGate,
  checkTooSoonAfterFailedAttemptGate,
  checkLessonAttemptSaturationGate,
  checkStrugglePatternGate,
  checkAdvancedLearnerAccelerationGate,
];

/**
 * Decide whether a learner is ready for the current lesson content.
 *
 * Pure function — deterministic, no side effects, no I/O.
 *
 * @returns A LearnerReadinessResult with the chosen decision and rationale.
 */
export function decideLearnerReadiness(
  input: LearnerReadinessInput,
): LearnerReadinessResult {
  for (const gate of GATES) {
    const result = gate(input);
    if (result !== null) return result;
  }

  return defaultReadinessDecision(input);
}

/**
 * Convenience: check whether the learner is ready to proceed now.
 */
export function isLearnerReady(result: LearnerReadinessResult): boolean {
  return result.decision === "READY_NOW" || result.decision === "SKIP_AHEAD";
}

/**
 * Convenience: check whether the learner needs prerequisite work.
 */
export function isPrerequisiteWorkNeeded(result: LearnerReadinessResult): boolean {
  return result.decision === "NOT_READY_PREREQUISITE";
}

/**
 * Convenience: check whether the learner should retry later.
 */
export function isRetryLater(result: LearnerReadinessResult): boolean {
  return result.decision === "NOT_READY_TOO_SOON";
}

/**
 * Convenience: check whether a different approach is needed.
 */
export function isDifferentApproachNeeded(result: LearnerReadinessResult): boolean {
  return result.decision === "NOT_READY_DIFFERENT_APPROACH";
}

/**
 * Convenience: check whether the learner should skip ahead.
 */
export function shouldSkipAhead(result: LearnerReadinessResult): boolean {
  return result.decision === "SKIP_AHEAD";
}

/**
 * Convenience: check whether the readiness check is deferred.
 */
export function isReadinessDeferred(result: LearnerReadinessResult): boolean {
  return result.decision === "DEFER_READINESS_CHECK";
}

// ─── Catalogs ─────────────────────────────────────────────────────────────────

export const LEARNER_READINESS_DECISION_CATALOG: ReadonlyArray<{
  decision: ReadinessDecision;
  titleEn: string;
  titleVi: string;
  descriptionVi: string;
}> = [
  {
    decision: "READY_NOW",
    titleEn: "Ready now",
    titleVi: "Sẵn sàng học",
    descriptionVi: "Người học có đủ nền tảng — tiếp tục với bài học hiện tại.",
  },
  {
    decision: "NOT_READY_PREREQUISITE",
    titleEn: "Not ready — prerequisite work needed",
    titleVi: "Chưa sẵn sàng — cần ôn kiến thức nền",
    descriptionVi: "Người học thiếu kiến thức nền tảng cần thiết — đề xuất ôn tập các kỹ năng tiên quyết trước khi học bài mới.",
  },
  {
    decision: "NOT_READY_TOO_SOON",
    titleEn: "Not ready — too soon to retry",
    titleVi: "Chưa sẵn sàng — cần thêm thời gian",
    descriptionVi: "Người học vừa thử bài này và cần thêm thời gian luyện tập trước khi thử lại.",
  },
  {
    decision: "NOT_READY_DIFFERENT_APPROACH",
    titleEn: "Not ready — different approach needed",
    titleVi: "Chưa sẵn sàng — cần cách dạy khác",
    descriptionVi: "Người học đã thử bài này nhiều lần nhưng chưa tiến bộ — cần thay đổi cách tiếp cận thay vì lặp lại.",
  },
  {
    decision: "SKIP_AHEAD",
    titleEn: "Skip ahead",
    titleVi: "Vượt qua bài này",
    descriptionVi: "Người học đã nắm vững nội dung bài này — đề xuất chuyển sang bài tiếp theo để tiết kiệm thời gian.",
  },
  {
    decision: "DEFER_READINESS_CHECK",
    titleEn: "Defer readiness check",
    titleVi: "Hoãn đánh giá",
    descriptionVi: "Chưa phải lúc thích hợp để đánh giá — kiểm tra lại sau vài lượt khi người học ổn định hơn.",
  },
];

export const LEARNER_READINESS_REASON_CODE_CATALOG: ReadonlyArray<{
  reasonCode: string;
  decision: ReadinessDecision;
  descriptionVi: string;
}> = [
  { reasonCode: "readiness_severe_prerequisite_gap", decision: "NOT_READY_PREREQUISITE", descriptionVi: "Thiếu hụt kiến thức nền nghiêm trọng (<50%) — cần xây lại nền tảng trước khi học bài mới." },
  { reasonCode: "readiness_moderate_prerequisite_gap", decision: "NOT_READY_PREREQUISITE", descriptionVi: "Thiếu hụt kiến thức nền vừa phải (50-69%) — đề xuất ôn tập trọng tâm trước khi học bài mới." },
  { reasonCode: "readiness_prerequisite_error_spike", decision: "NOT_READY_PREREQUISITE", descriptionVi: "Tỉ lệ lỗi kiến thức nền tăng đột biến — kiến thức cũ bị mai một, cần ổn định lại trước." },
  { reasonCode: "readiness_too_soon_after_failure", decision: "NOT_READY_TOO_SOON", descriptionVi: "Vừa thử bài này và chưa tiến bộ — cần ≥4 lượt luyện tập trước khi thử lại." },
  { reasonCode: "readiness_too_soon_progressing", decision: "NOT_READY_TOO_SOON", descriptionVi: "Đang có tiến bộ nhưng cần thêm thời gian — chờ ≥2 lượt trước khi thử lại." },
  { reasonCode: "readiness_lesson_attempt_saturation", decision: "NOT_READY_DIFFERENT_APPROACH", descriptionVi: "Đã thử ≥3 lần mà không tiến bộ — cần thay đổi cách dạy, không nên lặp lại cách cũ." },
  { reasonCode: "readiness_beginner_foundational_gap", decision: "NOT_READY_PREREQUISITE", descriptionVi: "Người mới học, kiến thức nền 50-69% — cần ôn tập kỹ hơn trước khi học bài mới." },
  { reasonCode: "readiness_beginner_need_stable_turns", decision: "NOT_READY_TOO_SOON", descriptionVi: "Người mới học cần ≥2 lượt đúng liên tiếp trước khi bắt đầu bài mới." },
  { reasonCode: "readiness_struggle_pattern_block", decision: "NOT_READY_PREREQUISITE", descriptionVi: "Phát hiện ≥2 mẫu lỗi nền tảng lặp lại — cần giải quyết trước khi học bài mới." },
  { reasonCode: "readiness_deferred_frustration", decision: "DEFER_READINESS_CHECK", descriptionVi: "Người học đang thất vọng — hoãn đánh giá, ưu tiên ổn định cảm xúc trước." },
  { reasonCode: "readiness_advanced_accelerate", decision: "SKIP_AHEAD", descriptionVi: "Người học trình độ cao đã nắm vững bài này (≥85%) — đề xuất bỏ qua để tiết kiệm thời gian." },
  { reasonCode: "readiness_ready", decision: "READY_NOW", descriptionVi: "Người học sẵn sàng — đủ nền tảng, không có tín hiệu chặn nào." },
  { reasonCode: "readiness_ready_noted_struggle", decision: "READY_NOW", descriptionVi: "Sẵn sàng học — có 1 mẫu lỗi nhỏ được ghi nhận để theo dõi trong bài, không đáng chặn." },
];
