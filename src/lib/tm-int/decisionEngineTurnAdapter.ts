/**
 * Decision-engine turn adapter (WP-000, reworked)
 *
 * Wires teacherDecisionEngine.decideTeacherAction() into the live turn loop by
 * mapping its unified TeacherDecision onto the same three routing outcomes the
 * turn handler already consumes from correctWithTimingAwareness:
 *   - show now      (CORRECT_NOW / EXPLAIN_PATTERN)  → render the correction
 *   - defer         (DEFER / FOLLOW_UP_FIRST)        → enqueue on the deferred
 *                                                       correction queue (which
 *                                                       resurfaces it on a later
 *                                                       turn via advanceTurn())
 *   - suppress      (SUPPRESS)                        → gentle "not now" message
 *
 * This is a THIN, pure mapping. The deferred-correction queue + its
 * advanceTurn() resurfacing (correctionTimingIntegration.ts,
 * createDeferredCorrectionQueue) is unchanged and already live-wired — a
 * deferred decision here flows through that same proven mechanism, so deferred
 * corrections are never silently dropped.
 *
 * Location: this module lives in src/lib/tm-int/ (C2-owned, next to the runtime
 * pipeline work) — deliberately NOT in src/lib/tutor/** (Lane A's exclusive
 * surface). It only READS from src/lib/tutor (engine + timing), never writes it.
 */
import {
  decideTeacherAction,
  isCorrectionVisible,
  isCorrectionDeferred,
  isCorrectionSuppressed,
  type TeacherDecision,
} from "../tutor/teacherDecisionEngine";
import { correctWithTutorRules, type TutorCorrectionLanguage } from "../tutor/correctionEngine";
import type {
  TimingIntegrationInput,
  TimingIntegrationResult,
  DeferredCorrection,
} from "../tutor/correctionTimingIntegration";
import type { CorrectionTimingResult, LearnerConfidence } from "../tutor/teacherMercyCorrectionTiming";

export type TurnCorrectionInput = {
  learnerText: string;
  targetLanguage: TutorCorrectionLanguage;
  cefrLevel: string | null;
  isCurrentLessonTarget: boolean;
  previousCorrectionsThisSession: number;
  /** How many times this same mistake has appeared recently (1+). Default: 1 (first occurrence). */
  sameMistakeCount?: number;
  /** Learner's apparent confidence. Default: "normal". */
  learnerConfidence?: LearnerConfidence;
  /** Current lesson focus, for priority boost (optional). */
  lessonFocus?: string;
};

export type TurnCorrectionOutcome = {
  /** The full underlying decision (rationale, reasonCode, correction candidate, etc.). */
  decision: TeacherDecision;
  /** Render the correction immediately this turn. */
  shouldShowNow: boolean;
  /** Defer: enqueue on the deferred-correction queue to resurface later. */
  shouldDefer: boolean;
  /** Suppress: don't correct; show a gentle "not now" note. */
  shouldSuppress: boolean;
  /** The corrected text, when a correction candidate exists (else null). */
  correctedText: string | null;
  /** Turns to wait before surfacing a deferred correction (≥1). */
  delayTurns: number;
};

/**
 * Run the decision engine for one learner turn and reduce it to the routing
 * outcome the turn handler consumes. Pure — no I/O, no mutation.
 */
export function decideTurnCorrection(input: TurnCorrectionInput): TurnCorrectionOutcome {
  const decision = decideTeacherAction({
    learnerText: input.learnerText,
    targetLanguage: input.targetLanguage,
    cefrLevel: input.cefrLevel,
    isCurrentLessonTarget: input.isCurrentLessonTarget,
    sameMistakeCount: input.sameMistakeCount ?? 1,
    learnerConfidence: input.learnerConfidence ?? "normal",
    previousCorrectionsThisSession: input.previousCorrectionsThisSession,
    lessonFocus: input.lessonFocus,
  });

  return {
    decision,
    shouldShowNow: isCorrectionVisible(decision),
    shouldDefer: isCorrectionDeferred(decision),
    shouldSuppress: isCorrectionSuppressed(decision),
    correctedText: decision.correction ? decision.correction.correctedText : null,
    delayTurns: decision.delayTurns ?? 1,
  };
}

/**
 * Drop-in replacement for `correctWithTimingAwareness`: same TimingIntegrationResult
 * shape (correction / timing / shouldShowNow / shouldDefer / shouldSuppress /
 * enrichment) but the routing is driven by the full decision engine
 * (`decideTeacherAction`). This lets the live turn handler swap in the decision
 * engine with a single call change while its existing suppress/defer/show routing,
 * message builders, and the deferred-correction queue keep working unchanged.
 */
export function decideTurnCorrectionCompat(
  input: TimingIntegrationInput & { learnerConfidence?: LearnerConfidence; lessonFocus?: string },
): TimingIntegrationResult {
  const decision = decideTeacherAction({
    learnerText: input.learnerText,
    targetLanguage: input.targetLanguage,
    cefrLevel: input.cefrLevel ?? null,
    isCurrentLessonTarget: input.isCurrentLessonTarget ?? false,
    sameMistakeCount: input.sameMistakeCount ?? 1,
    learnerConfidence: input.learnerConfidence ?? "normal",
    previousCorrectionsThisSession: input.previousCorrectionsThisSession ?? 0,
    lessonFocus: input.lessonFocus,
  });

  // The raw correction result — same call decideTeacherAction makes internally.
  const correction = correctWithTutorRules(input.learnerText, input.targetLanguage);

  const timing: CorrectionTimingResult = {
    mode: decision.timingMode,
    reason: decision.rationaleEn,
    reasonCode: decision.reasonCode,
    delayTurns: decision.delayTurns,
    patternLabel: decision.patternLabel,
    respectsOneCorrectionMax: true,
  };

  return {
    correction,
    timing,
    shouldShowNow: isCorrectionVisible(decision),
    shouldDefer: isCorrectionDeferred(decision),
    shouldSuppress: isCorrectionSuppressed(decision),
    enrichment: decision.enrichment,
  };
}

/**
 * Build a DeferredCorrection for the queue — persist-and-resurface (Blocker 2).
 *
 * The deferred item ALWAYS carries `localCorrectedText`: the guaranteed-corrected
 * text the turn handler already holds (buildLocalCorrection returned status
 * "corrected" before this seam is reached). It deliberately does NOT use the
 * decision engine's own correction, which is empty/null when its internal
 * correctWithTutorRules returns `needs_ai` (teacherDecisionEngine returns
 * action DEFER / correction null for needs_ai). Enqueuing the engine's needs_ai
 * correction would resurface an EMPTY item; dropping it (the old `&& status ===
 * "corrected"` guard) loses the correction entirely. Carrying the local text
 * resurfaces the REAL correction via the same advanceTurn() path that
 * beginner_minor_delayed already uses.
 */
export function buildDeferredTurnCorrection(
  learnerText: string,
  localCorrectedText: string,
  result: TimingIntegrationResult,
): DeferredCorrection {
  return {
    learnerText,
    correctedText: localCorrectedText,
    timing: result.timing,
    remainingTurns: result.timing.delayTurns ?? 1,
  };
}
