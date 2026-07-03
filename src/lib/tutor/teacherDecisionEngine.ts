/**
 * Teacher Mercy — Decision Engine
 *
 * Unified entry point for the complete correction pipeline.
 * One function call → one actionable decision for the UI layer.
 *
 * Layers on top of existing modules (without modifying them):
 *   - correctionEngine.ts — WHAT errors exist (rule-based correction)
 *   - teacherMercyCorrectionTiming.ts — WHEN mode to use (T1-T8 gates)
 *   - correctionTimingIntegration.ts — severity/confidence/self-correction inference
 *   - correctionExperienceEnricher.ts — weakness tags + Vietnamese interference
 *   - suppressionRules.ts — WHY a human teacher would deliberately NOT correct
 *
 * Design principles:
 *   1. One call, one decision — no manual wiring needed.
 *   2. Priority ordering — when multiple rules fire, the most important one wins.
 *   3. Vietnamese rationale — every decision includes a learner-facing VN explanation.
 *   4. Actionable output — the UI gets a single action enum, no ambiguity.
 *   5. Suppression reasoning — every SUPPRESS decision explains WHY not correcting is the right call.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

import { correctWithTutorRules, type CorrectionEngineResult, type TutorCorrectionLanguage } from "./correctionEngine";
import {
  decideCorrectionMode,
  type CorrectionMode,
  type CorrectionTimingInput,
  type CorrectionTimingResult,
  type ErrorSeverity,
  type LearnerConfidence,
} from "./teacherMercyCorrectionTiming";
import {
  inferErrorSeverity,
  inferLearnerConfidence,
  detectSelfCorrectionInText,
} from "./correctionTimingIntegration";
import { enrichCorrectionExperience, type EnrichedCorrectionContext } from "./correctionExperienceEnricher";
import {
  evaluateSuppressions,
  buildSuppressionContext,
  type SuppressionDecision,
} from "./suppressionRules";
import {
  decideHintLadder,
  isHintRecommendedNow,
  isHintQueued,
  type HintLadderDecision,
  type HintLadderResult,
} from "./hintLadderPolicy";
import {
  decideLearnerReadiness,
  isLearnerReady,
  type LearnerReadinessInput,
  type LearnerReadinessResult,
} from "./learnerReadinessPolicy";

// ─── Decision Types ──────────────────────────────────────────────────────

/**
 * What to actually do in the UI layer.
 *
 * CORRECT_NOW      — show the correction immediately in this turn.
 * DEFER            — save the correction for a future turn.
 * SUPPRESS         — don't correct; the cost of interrupting outweighs the benefit.
 * FOLLOW_UP_FIRST  — ask a follow-up question first; let the learner self-correct.
 * EXPLAIN_PATTERN  — explain the underlying pattern, not just this instance.
 */
export type DecisionAction =
  | "CORRECT_NOW"
  | "DEFER"
  | "SUPPRESS"
  | "FOLLOW_UP_FIRST"
  | "EXPLAIN_PATTERN";

/**
 * A single correction candidate produced by the correction engine.
 */
export type CorrectionCandidate = {
  /** The corrected version of the learner's text. */
  correctedText: string;
  /** Which correction rules matched. */
  appliedRuleIds: string[];
  /** The severity of this specific error. */
  severity: ErrorSeverity;
};

/**
 * The unified decision from Teacher Mercy — one decision per learner turn.
 */
export type TeacherDecision = {
  /** What action the UI should take. */
  action: DecisionAction;
  /** The top-priority correction candidate, or null when suppressed / no error. */
  correction: CorrectionCandidate | null;
  /** The underlying timing mode from the correction timing engine. */
  timingMode: CorrectionMode;
  /** Vietnamese rationale for the learner (UI-facing). */
  rationaleVi: string;
  /** English rationale for telemetry / logging. */
  rationaleEn: string;
  /** Machine-readable reason code for analytics. */
  reasonCode: string;
  /** For DEFER: how many turns to wait before surfacing. */
  delayTurns?: number;
  /** For EXPLAIN_PATTERN: the repeated error pattern to explain. */
  patternLabel?: string;
  /** All detected correction candidates (for telemetry/debugging). */
  allCandidates: CorrectionCandidate[];
  /** Enriched context: weakness tags + Vietnamese interference info. */
  enrichment: EnrichedCorrectionContext | null;
  /** Suppression reasoning: which pedagogical rules justify NOT correcting (non-null when action is SUPPRESS). */
  suppressionDecision: SuppressionDecision | null;
  /** Hint ladder decision: whether to use a hint instead of direct correction, and at what level.
   *  Non-null when the hint ladder recommends a hint (HINT_MINIMAL, HINT_MEDIUM, HINT_STRONG)
   *  or queues one for later (HINT_SOON). Null when NO_HINT — use direct correction/suppression. */
  hintLadder: HintLadderResult | null;
  /** Learner readiness: whether the learner is ready for the current lesson content,
   *  or needs prerequisite work / retry later / different approach / skip ahead.
   *  Computed by the R1-R8 readiness gate chain. Always non-null (defaults to READY_NOW). */
  readiness: LearnerReadinessResult;
};

/**
 * Input for the teacher decision engine.
 */
export type TeacherDecisionInput = {
  /** The learner's raw text. */
  learnerText: string;
  /** Target language for correction rules. */
  targetLanguage: TutorCorrectionLanguage;
  /** Known CEFR level (optional). */
  cefrLevel: string | null;
  /** Whether this turn relates to the current lesson's target skill. */
  isCurrentLessonTarget: boolean;
  /** How many times this same mistake pattern has appeared in recent turns (1+). */
  sameMistakeCount: number;
  /** The learner's apparent confidence in this exchange. */
  learnerConfidence: LearnerConfidence;
  /** Total corrections already delivered in this session. */
  previousCorrectionsThisSession: number;
  /** Optional: the current lesson focus (e.g., "past-tense") for priority boost. */
  lessonFocus?: string;
  // ── Hint ladder context (optional — defaults are sensible) ──────────
  /** How many turns since the last hint (Infinity if never hinted). Default: Infinity. */
  turnsSinceLastHint?: number;
  /** Total hints delivered this session. Default: 0. */
  hintsThisSession?: number;
  /** The level of the most recent hint (null if none). Default: null. */
  lastHintLevel?: HintLadderDecision | null;
  /** Whether the previous hint led to self-correction. Default: false. */
  previousHintWorked?: boolean;
  /** Whether the learner is showing frustration signals. Default: false. */
  isShowingFrustration?: boolean;
  /** Total conversation turns in this session. Default: 0. */
  totalTurnsInSession?: number;
  // ── Learner readiness context (optional — defaults are sensible) ──
  /** Ratio of prerequisite skills mastered (0.0–1.0). Default: 0.85 (assumes typical readiness). */
  prerequisiteMasteryRatio?: number;
  /** Error rate on prerequisite patterns in recent turns (0.0–1.0). Default: 0.1. */
  prerequisiteErrorRate?: number;
  /** Turns since the last lesson attempt (Infinity if never). Default: Infinity. */
  turnsSinceLastLessonAttempt?: number;
  /** How many times this lesson has been attempted this session. Default: 0. */
  lessonAttemptsThisSession?: number;
  /** Estimated mastery of current lesson target (0.0–1.0). Default: 0.3. */
  lessonTargetMasteryEstimate?: number;
  /** Consecutive correct turns (≥0). Default: 1. */
  consecutiveCorrectTurns?: number;
  /** Specific prerequisite skill IDs where the learner keeps struggling. Default: []. */
  recurringPrerequisiteStruggles?: string[];
  /** Whether the learner showed progress on the last lesson attempt. Default: false. */
  showedProgressOnLastAttempt?: boolean;
};

// ─── Priority Scoring ────────────────────────────────────────────────────

/**
 * Score a correction rule ID by priority.
 * Higher score = higher priority. Used to select the primary rule
 * when multiple rules fire on the same text.
 *
 * Priority hierarchy:
 *   fatal_meaning rules: +100 (always wins)
 *   lesson_target rules: +80 (especially if matches lessonFocus)
 *   grammar/tense rules: +60
 *   word_choice/calque rules: +40
 *   fluency rules: +20
 *   minor/formatting rules: +0
 */
function scoreRulePriority(ruleId: string, lessonFocus?: string): number {
  // Fatal meaning rules — the meaning is lost or changed
  if (
    ruleId.includes("existential") ||
    ruleId.includes("semantic") ||
    ruleId.includes("stt-")
  ) {
    return 100;
  }

  // Lesson target rules — especially if matches the current lesson focus
  if (lessonFocus && ruleId.includes(lessonFocus)) return 80;
  if (
    ruleId.includes("past") ||
    ruleId.includes("-tense") ||
    ruleId.includes("subject-verb") ||
    ruleId.includes("third-person") ||
    ruleId.includes("third_person") ||
    ruleId.includes("preposition") ||
    ruleId.includes("-at-clock") ||
    ruleId.includes("-in-month") ||
    ruleId.includes("imperative")
  ) {
    return 80;
  }

  // Grammar / structural rules
  if (
    ruleId.includes("article") ||
    ruleId.includes("plural") ||
    ruleId.includes("be-verb") ||
    ruleId.includes("copula") ||
    ruleId.includes("be-drop") ||
    ruleId.includes("word-order") ||
    ruleId.includes("do-support") ||
    ruleId.includes("yesno") ||
    ruleId.includes("negation") ||
    ruleId.includes("possessive") ||
    ruleId.includes("quantifier") ||
    ruleId.includes("subj-verb") ||
    ruleId.includes("-agreement")
  ) {
    return 60;
  }

  // Word choice / calque rules
  if (
    ruleId.includes("calque") ||
    ruleId.includes("collocation") ||
    ruleId.includes("natural") ||
    ruleId.includes("say-tell") ||
    ruleId.includes("very-") ||
    ruleId.includes("be-agree") ||
    ruleId.includes("go-home") ||
    ruleId.includes("age-have") ||
    ruleId.includes("duration-") ||
    ruleId.includes("discuss-about") ||
    ruleId.includes("marry-with") ||
    ruleId.includes("mention-about") ||
    ruleId.includes("contact-with") ||
    ruleId.includes("research-about") ||
    ruleId.includes("phone-text-to") ||
    ruleId.includes("explain-to-me") ||
    ruleId.includes("word_choice")
  ) {
    return 40;
  }

  // Fluency / run-on rules
  if (
    ruleId.includes("fluency") ||
    ruleId.includes("runon") ||
    ruleId.includes("although") ||
    ruleId.includes("because") ||
    ruleId.includes("double-comparative") ||
    ruleId.includes("double-superlative") ||
    ruleId.includes("discourse")
  ) {
    return 20;
  }

  // Minor / formatting rules
  return 0;
}

/**
 * Compute the severity of a single rule ID.
 * Mirrors inferErrorSeverity from correctionTimingIntegration.ts
 * but operates at the individual rule level for priority-aware decisions.
 */
function severityFromRuleId(ruleId: string): ErrorSeverity {
  if (
    ruleId.includes("existential") ||
    ruleId.includes("stt-")
  ) {
    return "fatal_meaning";
  }

  if (
    ruleId.includes("past") ||
    ruleId.includes("-tense") ||
    ruleId.includes("subject-verb") ||
    ruleId.includes("third-person") ||
    ruleId.includes("third_person") ||
    ruleId.includes("preposition") ||
    ruleId.includes("imperative")
  ) {
    return "lesson_target";
  }

  if (
    ruleId.includes("calque") ||
    ruleId.includes("collocation") ||
    ruleId.includes("natural") ||
    ruleId.includes("word_choice")
  ) {
    return "word_choice";
  }

  if (
    ruleId.includes("fluency") ||
    ruleId.includes("runon") ||
    ruleId.includes("although") ||
    ruleId.includes("because") ||
    ruleId.includes("double-comparative") ||
    ruleId.includes("double-superlative") ||
    ruleId.includes("discourse")
  ) {
    return "fluency";
  }

  if (
    ruleId.includes("capitalization") ||
    ruleId.includes("punctuation") ||
    ruleId.includes("question-form") ||
    ruleId.includes("runon")
  ) {
    return "minor";
  }

  // Default: grammar-level for structural rules
  if (
    ruleId.includes("article") ||
    ruleId.includes("plural") ||
    ruleId.includes("be-verb") ||
    ruleId.includes("copula") ||
    ruleId.includes("be-drop") ||
    ruleId.includes("word-order") ||
    ruleId.includes("do-support") ||
    ruleId.includes("yesno") ||
    ruleId.includes("negation") ||
    ruleId.includes("possessive") ||
    ruleId.includes("quantifier") ||
    ruleId.includes("subj-verb") ||
    ruleId.includes("-agreement") ||
    ruleId.includes("say-tell") ||
    ruleId.includes("very-") ||
    ruleId.includes("be-agree") ||
    ruleId.includes("go-home") ||
    ruleId.includes("age-have") ||
    ruleId.includes("duration-") ||
    ruleId.includes("discuss-about") ||
    ruleId.includes("marry-with") ||
    ruleId.includes("mention-about") ||
    ruleId.includes("contact-with") ||
    ruleId.includes("research-about") ||
    ruleId.includes("phone-text-to") ||
    ruleId.includes("explain-to-me")
  ) {
    return "grammar";
  }

  return "minor";
}

/**
 * Find the highest-priority rule ID from a list.
 * Returns null if the list is empty.
 */
function topPriorityRuleId(ruleIds: string[], lessonFocus?: string): string | null {
  if (ruleIds.length === 0) return null;
  let best = ruleIds[0];
  let bestScore = scoreRulePriority(best, lessonFocus);
  for (let i = 1; i < ruleIds.length; i++) {
    const score = scoreRulePriority(ruleIds[i], lessonFocus);
    if (score > bestScore) {
      bestScore = score;
      best = ruleIds[i];
    }
  }
  return best;
}

// ─── Decision Action Mapping ─────────────────────────────────────────────

/**
 * Map a correction timing mode to a DecisionAction.
 */
function timingModeToAction(mode: CorrectionMode): DecisionAction {
  switch (mode) {
    case "IMMEDIATE":
      return "CORRECT_NOW";
    case "DELAYED":
      return "DEFER";
    case "SUPPRESS":
      return "SUPPRESS";
    case "FOLLOW_UP_FIRST":
      return "FOLLOW_UP_FIRST";
    case "EXPLAIN_PATTERN":
      return "EXPLAIN_PATTERN";
  }
}

// ─── Vietnamese Rationale Generation ─────────────────────────────────────

/**
 * Vietnamese rationale for each reason code.
 *
 * Pattern: "Mercy thấy [error description]. [why this timing choice]. [what happens next]."
 *
 * Each entry is a function so we can interpolate dynamic values
 * (e.g., delayTurns, patternLabel) at call time.
 */
const RATIONALE_VI: Record<string, (ctx: {
  delayTurns?: number;
  patternLabel?: string;
  cefrLevel?: string | null;
  previousCorrections?: number;
  sameMistakeCount?: number;
}) => string> = {
  // T1 — Fatal meaning
  fatal_meaning_must_correct: () =>
    "Mercy thấy câu này có thể bị hiểu sai nghĩa — mình cùng sửa ngay để tránh nhầm lẫn nhé.",

  // T2 — Lesson target
  lesson_target_immediate: () =>
    "Mercy thấy bạn dùng sai điểm đang học trong bài — đây là mục tiêu của bài nên mình sửa ngay nhé.",
  lesson_target_explain_pattern: (ctx) =>
    `Mercy thấy bạn lặp lại lỗi này ${ctx.sameMistakeCount ?? 3} lần ở điểm đang học — thay vì sửa từng câu, mình cùng xem lại quy luật nhé.`,

  // T3 — Repeated mistake
  repeated_explain_pattern: (ctx) =>
    `Mercy thấy bạn lặp lại lỗi này ${ctx.sameMistakeCount ?? 3} lần — thay vì sửa từng lần, mình cùng xem quy luật đằng sau nhé.`,

  // T4 — Self-correction
  self_corrected_minor_suppress: () =>
    "Mercy thấy bạn đã tự sửa rồi — lỗi còn lại rất nhỏ, mình tiếp tục nói tự nhiên nhé.",
  self_correction_follow_up_first: () =>
    "Mercy thấy bạn đã tự sửa — rất tốt! Mình thử nói thêm một câu nữa xem sao nhé.",

  // T5 — Shy learner
  shy_learner_suppress_minor: () =>
    "Mercy thấy câu này có vài điểm nhỏ, nhưng không đáng để sửa ngay — mình tiếp tục nói tự nhiên nhé.",
  shy_learner_follow_up_first: () =>
    "Mercy thấy có một cách nói khác tự nhiên hơn — bạn thử nghĩ xem mình có thể nói lại thế nào không?",
  shy_learner_delayed_grammar: () =>
    "Mercy ghi nhận một điểm ngữ pháp nhỏ — mình sẽ cùng xem lại sau nhé, giờ tiếp tục nói tự nhiên đã.",

  // T6 — Advanced learner
  advanced_learner_suppress_minor: (ctx) =>
    `Ở trình độ ${ctx.cefrLevel ?? "cao"} của bạn, lỗi này chắc là sơ suất thôi — mình tiếp tục nhé.`,
  advanced_learner_follow_up_first: (ctx) =>
    `Ở trình độ ${ctx.cefrLevel ?? "cao"}, Mercy nghĩ bạn có thể tự phát hiện điểm này — bạn thử nói lại xem sao?`,

  // T7 — Session correction load
  session_correction_load_suppress: (ctx) =>
    `Hôm nay mình đã sửa ${ctx.previousCorrections ?? 5} lỗi rồi — lỗi này nhỏ, để dành lần sau nhé.`,
  session_correction_load_delayed: (ctx) =>
    `Hôm nay mình đã sửa khá nhiều rồi (${ctx.previousCorrections ?? 8} lỗi) — lỗi này mình để dành sửa sau, giờ tiếp tục nói nhé.`,

  // T8 — Beginner
  beginner_grammar_immediate: () =>
    "Mercy thấy một lỗi ngữ pháp quan trọng — ở giai đoạn mới học, mình nên sửa ngay để tránh thành thói quen nhé.",
  beginner_minor_delayed: () =>
    "Mercy ghi nhận một điểm nhỏ — nhưng ưu tiên trước mắt là ngữ pháp, mình sẽ xem lại sau nhé.",

  // Default fallbacks
  default_grammar_immediate: () =>
    "Mercy thấy một lỗi ngữ pháp — mình sửa ngay lúc này để bạn nhớ đúng cách dùng nhé.",
  default_word_choice_immediate: () =>
    "Mercy thấy có một từ chưa tự nhiên lắm — mình cùng xem cách nói nào hay hơn nhé.",
  default_fluency_delayed: (ctx) =>
    `Mercy thấy câu này có thể nói tự nhiên hơn — nhưng nghĩa vẫn rõ ràng, mình để dành sửa sau ${ctx.delayTurns ?? 2} lượt nhé.`,
  default_minor_suppress: () =>
    "Mercy thấy câu bạn nói ổn rồi — có vài điểm rất nhỏ nhưng không đáng để dừng lại.",
  default_immediate: () =>
    "Mercy thấy một điểm cần sửa — mình cùng xem ngay nhé.",

  // Decision-engine-specific codes
  no_error_detected: () =>
    "Câu bạn nói ổn rồi — không có lỗi nào cần sửa cả.",
  needs_ai_deferred: () =>
    "Mercy thấy câu này hơi phức tạp, cần suy nghĩ thêm — mình sẽ quay lại sau nhé.",
  empty_text: () =>
    "Mercy chưa thấy bạn nhập gì — bạn gõ một câu để mình cùng luyện tập nhé.",
};

/**
 * Generate the Vietnamese rationale for a timing result.
 */
function generateRationaleVi(
  timing: CorrectionTimingResult,
  context: {
    cefrLevel?: string | null;
    previousCorrectionsThisSession?: number;
    sameMistakeCount?: number;
  },
): string {
  const fn = RATIONALE_VI[timing.reasonCode];
  if (!fn) {
    // Fallback: use the English reason as-is
    return timing.reason;
  }
  return fn({
    delayTurns: timing.delayTurns,
    patternLabel: timing.patternLabel,
    cefrLevel: context.cefrLevel,
    previousCorrections: context.previousCorrectionsThisSession,
    sameMistakeCount: context.sameMistakeCount,
  });
}

// ─── Core Decision Engine ────────────────────────────────────────────────

/**
 * Decide what Teacher Mercy should do with a learner's text.
 *
 * This is THE unified entry point for the correction pipeline.
 * It runs the complete pipeline end-to-end:
 *
 *   1. Correction engine — find errors via rule-based correction
 *   2. Priority scoring — pick the most important rule when multiple fire
 *   3. Severity inference — determine how serious the top error is
 *   4. Confidence inference — detect shy/normal/confident from text
 *   5. Self-correction detection — check if the learner already self-corrected
 *   6. Learner readiness — diagnose whether learner is ready for current lesson (R1-R8 gates)
 *   7. Hint ladder decision — decide whether to use a graduated hint (H1-H8 gates)
 *   8. Timing decision — run the T1-T8 gate chain
 *   9. Action mapping — convert timing mode → UI action
 *  10. Experience enrichment — weakness tags + Vietnamese interference context
 *  11. Vietnamese rationale — learner-facing explanation
 *  12. Suppression reasoning — when action is SUPPRESS, explain which pedagogical rules justify it
 *  13. Unified decision — one object with everything the UI needs
 *
 * Learner readiness (step 6) runs AFTER confidence inference because it needs
 * learnerConfidence and isShowingFrustration, but BEFORE the hint ladder because
 * readiness may recommend prerequisite work that makes hints unnecessary.
 * Readiness is computed even for empty/no-error/needs-ai paths — the question
 * "is this learner ready for this content?" is independent of whether the
 * current utterance has errors.
 *
 * Pure function — deterministic, no side effects, no I/O.
 *
 * @returns A TeacherDecision with the action, correction, rationale, enrichment, and hint ladder.
 */
export function decideTeacherAction(
  input: TeacherDecisionInput,
): TeacherDecision {
  const {
    learnerText,
    targetLanguage,
    cefrLevel,
    isCurrentLessonTarget,
    sameMistakeCount,
    learnerConfidence,
    previousCorrectionsThisSession,
    lessonFocus,
    // Hint ladder context with defaults
    turnsSinceLastHint = Infinity,
    hintsThisSession = 0,
    lastHintLevel = null,
    previousHintWorked = false,
    isShowingFrustration = false,
    totalTurnsInSession = 0,
    // Learner readiness context with defaults
    prerequisiteMasteryRatio = 0.85,
    prerequisiteErrorRate = 0.1,
    turnsSinceLastLessonAttempt = Infinity,
    lessonAttemptsThisSession = 0,
    lessonTargetMasteryEstimate = 0.3,
    consecutiveCorrectTurns = 1,
    recurringPrerequisiteStruggles = [],
    showedProgressOnLastAttempt = false,
  } = input;

  // Helper: compute learner readiness (used in all return paths, not just the main pipeline)
  const readinessInput: LearnerReadinessInput = {
    cefrLevel,
    prerequisiteMasteryRatio,
    prerequisiteErrorRate,
    turnsSinceLastLessonAttempt,
    lessonAttemptsThisSession,
    lessonTargetMasteryEstimate,
    consecutiveCorrectTurns,
    recurringPrerequisiteStruggles,
    learnerConfidence,
    isShowingFrustration,
    totalTurnsInSession,
    showedProgressOnLastAttempt,
  };
  const readiness = decideLearnerReadiness(readinessInput);

  // ── Step 1: Run correction engine ──────────────────────────────────
  const correction = correctWithTutorRules(learnerText, targetLanguage);

  // ── Handle empty text ──────────────────────────────────────────────
  if (!learnerText.trim()) {
    return {
      action: "SUPPRESS",
      correction: null,
      timingMode: "SUPPRESS",
      rationaleVi: RATIONALE_VI.empty_text({}),
      rationaleEn: "Empty input — nothing to correct.",
      reasonCode: "empty_text",
      allCandidates: [],
      enrichment: null,
      suppressionDecision: null,
      hintLadder: null,
      readiness,
    };
  }

  // ── Handle unchanged text ──────────────────────────────────────────
  if (correction.status === "unchanged") {
    return {
      action: "SUPPRESS",
      correction: null,
      timingMode: "SUPPRESS",
      rationaleVi: RATIONALE_VI.no_error_detected({}),
      rationaleEn: "No errors detected in the learner's text.",
      reasonCode: "no_error_detected",
      allCandidates: [],
      enrichment: null,
      suppressionDecision: null,
      hintLadder: null,
      readiness,
    };
  }

  // ── Handle needs_ai — can't correct locally ────────────────────────
  if (correction.status === "needs_ai") {
    const timingResult: CorrectionTimingResult = {
      mode: "DELAYED",
      reason: "Correction requires AI engine — deferring until AI response is available.",
      reasonCode: "needs_ai_deferred",
      delayTurns: 1,
      respectsOneCorrectionMax: true,
    };

    return {
      action: "DEFER",
      correction: null,
      timingMode: "DELAYED",
      rationaleVi: RATIONALE_VI.needs_ai_deferred({}),
      rationaleEn: timingResult.reason,
      reasonCode: timingResult.reasonCode,
      delayTurns: timingResult.delayTurns,
      allCandidates: [],
      enrichment: null,
      suppressionDecision: null,
      hintLadder: null,
      readiness,
    };
  }

  // ── Step 2: Determine primary correction via priority scoring ──────
  const primaryRuleId = topPriorityRuleId(correction.appliedRuleIds, lessonFocus);
  const primarySeverity = primaryRuleId
    ? severityFromRuleId(primaryRuleId)
    : inferErrorSeverity(correction);

  // ── Step 3-5: Infer confidence, detect self-correction ─────────────
  const confidenceFromText = inferLearnerConfidence(learnerText);
  const didSelfCorrect = detectSelfCorrectionInText(learnerText);

  // ── Step 6: Learner readiness already computed above (R1-R8 gates) ─
  // (readiness is computed before the main pipeline so it's available
  //  in all return paths — see the readinessInput const near the top)

  // ── Step 7: Run hint ladder decision ───────────────────────────────
  const hintLadder = decideHintLadder({
    turnsSinceLastHint,
    hintsThisSession,
    lastHintLevel,
    recurringErrorCount: sameMistakeCount,
    errorSeverity: primarySeverity,
    cefrLevel,
    learnerConfidence,
    isCurrentLessonTarget,
    hasSelfCorrectionAwareness: didSelfCorrect,
    isShowingFrustration,
    totalTurnsInSession,
    previousHintWorked,
  });

  // ── Step 8: Run timing decision engine ─────────────────────────────
  const timingInput: CorrectionTimingInput = {
    learnerText,
    cefrLevel,
    errorSeverity: primarySeverity,
    isCurrentLessonTarget,
    sameMistakeCount,
    learnerConfidence,
    didSelfCorrect,
    previousCorrectionsThisSession,
  };

  const timing = decideCorrectionMode(timingInput);

  // ── Step 9: Map timing mode → DecisionAction ───────────────────────
  const action = timingModeToAction(timing.mode);

  // ── Step 10: Enrich with weakness tags + interference ────────────────
  const enrichment = enrichCorrectionExperience(
    correction.appliedRuleIds,
    correction.corrected,
  );

  // ── Step 11: Generate Vietnamese rationale ──────────────────────────
  const rationaleVi = generateRationaleVi(timing, {
    cefrLevel,
    previousCorrectionsThisSession,
    sameMistakeCount,
  });

  // ── Step 12: Build suppression reasoning when action is SUPPRESS ────
  let suppressionDecision: SuppressionDecision | null = null;
  if (action === "SUPPRESS") {
    const suppressionCtx = buildSuppressionContext({
      learnerText,
      errorSeverity: primarySeverity,
      cefrLevel,
      learnerConfidence,
      didSelfCorrect,
      sameMistakeCount,
      previousCorrectionsThisSession,
      isCurrentLessonTarget,
    });
    suppressionDecision = evaluateSuppressions(suppressionCtx);
  }

  // ── Step 13: Build the unified decision ──────────────────────────────
  const candidate: CorrectionCandidate = {
    correctedText: correction.corrected,
    appliedRuleIds: correction.appliedRuleIds,
    severity: primarySeverity,
  };

  return {
    action,
    correction: candidate,
    timingMode: timing.mode,
    rationaleVi,
    rationaleEn: timing.reason,
    reasonCode: timing.reasonCode,
    delayTurns: timing.delayTurns,
    patternLabel: timing.patternLabel,
    allCandidates: [candidate],
    enrichment,
    suppressionDecision,
    hintLadder: isHintRecommendedNow(hintLadder) || isHintQueued(hintLadder)
      ? hintLadder
      : null,
    readiness,
  };
}

// ─── Convenience Helpers ─────────────────────────────────────────────────

/**
 * Quick check: does the decision recommend showing a correction now?
 */
export function isCorrectionVisible(decision: TeacherDecision): boolean {
  return decision.action === "CORRECT_NOW" || decision.action === "EXPLAIN_PATTERN";
}

/**
 * Quick check: does the decision recommend deferring the correction?
 */
export function isCorrectionDeferred(decision: TeacherDecision): boolean {
  return decision.action === "DEFER" || decision.action === "FOLLOW_UP_FIRST";
}

/**
 * Quick check: does the decision recommend suppressing the correction?
 */
export function isCorrectionSuppressed(decision: TeacherDecision): boolean {
  return decision.action === "SUPPRESS";
}

/**
 * Returns whether there is a correction to show at all
 * (non-null correction and a visible action).
 */
export function hasActionableCorrection(decision: TeacherDecision): boolean {
  return decision.correction !== null && isCorrectionVisible(decision);
}

// ─── Catalog ──────────────────────────────────────────────────────────────

export const TEACHER_DECISION_ACTION_CATALOG: ReadonlyArray<{
  action: DecisionAction;
  titleEn: string;
  titleVi: string;
  descriptionVi: string;
}> = [
  {
    action: "CORRECT_NOW",
    titleEn: "Correct now",
    titleVi: "Sửa ngay",
    descriptionVi: "Hiển thị phần sửa ngay trong lượt này.",
  },
  {
    action: "DEFER",
    titleEn: "Defer",
    titleVi: "Để dành sửa sau",
    descriptionVi: "Ghi nhận lỗi nhưng hiển thị vào lượt sau.",
  },
  {
    action: "SUPPRESS",
    titleEn: "Suppress",
    titleVi: "Không sửa",
    descriptionVi: "Không hiển thị sửa — tiếp tục trò chuyện tự nhiên.",
  },
  {
    action: "FOLLOW_UP_FIRST",
    titleEn: "Follow-up first",
    titleVi: "Hỏi trước, sửa sau",
    descriptionVi: "Hỏi một câu nối tiếp để người học tự sửa trước khi sửa trực tiếp.",
  },
  {
    action: "EXPLAIN_PATTERN",
    titleEn: "Explain pattern",
    titleVi: "Giải thích quy luật",
    descriptionVi: "Giải thích quy luật ngữ pháp thay vì sửa từng lỗi một.",
  },
];

export const TEACHER_DECISION_REASON_CODE_CATALOG: ReadonlyArray<{
  reasonCode: string;
  action: DecisionAction;
  descriptionVi: string;
}> = [
  { reasonCode: "fatal_meaning_must_correct", action: "CORRECT_NOW", descriptionVi: "Lỗi nghĩa nghiêm trọng — phải sửa ngay." },
  { reasonCode: "lesson_target_immediate", action: "CORRECT_NOW", descriptionVi: "Lỗi đúng mục tiêu bài học — sửa ngay." },
  { reasonCode: "lesson_target_explain_pattern", action: "EXPLAIN_PATTERN", descriptionVi: "Lỗi mục tiêu lặp lại — giải thích quy luật." },
  { reasonCode: "repeated_explain_pattern", action: "EXPLAIN_PATTERN", descriptionVi: "Lỗi lặp ≥ 3 lần — giải thích quy luật." },
  { reasonCode: "self_corrected_minor_suppress", action: "SUPPRESS", descriptionVi: "Đã tự sửa, lỗi còn nhỏ — không sửa." },
  { reasonCode: "self_correction_follow_up_first", action: "FOLLOW_UP_FIRST", descriptionVi: "Đã tự sửa — hỏi thêm trước." },
  { reasonCode: "shy_learner_suppress_minor", action: "SUPPRESS", descriptionVi: "Người học nhút nhát, lỗi nhỏ — không sửa." },
  { reasonCode: "shy_learner_follow_up_first", action: "FOLLOW_UP_FIRST", descriptionVi: "Người học nhút nhát — hỏi nhẹ nhàng." },
  { reasonCode: "shy_learner_delayed_grammar", action: "DEFER", descriptionVi: "Người học nhút nhát, lỗi ngữ pháp — để sửa sau." },
  { reasonCode: "advanced_learner_suppress_minor", action: "SUPPRESS", descriptionVi: "Trình độ cao, lỗi nhỏ — chắc là sơ suất." },
  { reasonCode: "advanced_learner_follow_up_first", action: "FOLLOW_UP_FIRST", descriptionVi: "Trình độ cao — để tự phát hiện." },
  { reasonCode: "session_correction_load_suppress", action: "SUPPRESS", descriptionVi: "Đã sửa nhiều — bỏ qua lỗi nhỏ." },
  { reasonCode: "session_correction_load_delayed", action: "DEFER", descriptionVi: "Đã sửa rất nhiều — để dành sửa sau." },
  { reasonCode: "beginner_grammar_immediate", action: "CORRECT_NOW", descriptionVi: "Mới học, lỗi ngữ pháp — sửa ngay." },
  { reasonCode: "beginner_minor_delayed", action: "DEFER", descriptionVi: "Mới học, lỗi nhỏ — ưu tiên ngữ pháp trước." },
  { reasonCode: "default_grammar_immediate", action: "CORRECT_NOW", descriptionVi: "Lỗi ngữ pháp — sửa ngay." },
  { reasonCode: "default_word_choice_immediate", action: "CORRECT_NOW", descriptionVi: "Lỗi chọn từ — sửa ngay." },
  { reasonCode: "default_fluency_delayed", action: "DEFER", descriptionVi: "Lỗi tự nhiên — để sửa sau." },
  { reasonCode: "default_minor_suppress", action: "SUPPRESS", descriptionVi: "Lỗi nhỏ — không sửa." },
  { reasonCode: "default_immediate", action: "CORRECT_NOW", descriptionVi: "Lỗi cần sửa — sửa ngay." },
  { reasonCode: "no_error_detected", action: "SUPPRESS", descriptionVi: "Không có lỗi — không cần sửa." },
  { reasonCode: "needs_ai_deferred", action: "DEFER", descriptionVi: "Cần AI — để dành sửa sau." },
  { reasonCode: "empty_text", action: "SUPPRESS", descriptionVi: "Văn bản trống — không có gì để sửa." },
];
