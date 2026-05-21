// Placement v4 telemetry — ingestion adapter for the study-plan / lesson flow.
//
// Purpose:
//   Translate product-flow callbacks (plan generated, lesson started, lesson
//   completed, lesson skipped, speaking retry, adaptive recalculation,
//   checkpoint, burnout indicator, review-debt accumulation) into validated
//   v4 telemetry events the analytical core can aggregate.
//
// Boundaries:
//   - No upstream imports — accepts structural objects defined in
//     adaptiveTelemetryTypes.
//   - No Date.now / no Math.random — callers must pass `nowMs` and the
//     `eventIdPrefix` (a stable, externally-generated string per host call).
//   - Outputs are valid TelemetryEvent[]; callers can feed them directly to
//     aggregateEvents/validateEvents.

import { TELEMETRY_SCHEMA_VERSION } from "./types";
import type {
  CefrCheckpointEvent,
  HesitationLoopEvent,
  LessonCompleteEvent,
  LessonDropoffEvent,
  LessonRetryEvent,
  LessonStartEvent,
  SpeakingRetryEvent,
  StudyStreakEvent,
  TelemetryEvent,
} from "./types";
import type {
  CefrCheckpointModality,
  CefrTransitionRecord,
} from "./types";
import type {
  ProgressionSnapshotLike,
  Skill,
  StudyPlanLike,
} from "./adaptiveTelemetryTypes";
import type { CEFRLevel, PlacementV3Modality } from "../../../../types/placement-v3";

const BASE = { v: TELEMETRY_SCHEMA_VERSION } as const;

const PLACEMENT_MODALITIES: ReadonlySet<PlacementV3Modality> = new Set([
  "writing",
  "speaking",
  "reading",
  "listening",
  "conversation",
]);

/**
 * Map an internal Skill into a PlacementV3Modality the telemetry schema
 * accepts. Vocabulary / grammar / pronunciation collapse to their closest
 * modality so the schema stays narrow.
 */
function skillToModality(skill: Skill): PlacementV3Modality {
  if (PLACEMENT_MODALITIES.has(skill as PlacementV3Modality)) {
    return skill as PlacementV3Modality;
  }
  switch (skill) {
    case "vocabulary":
      return "reading";
    case "grammar":
      return "writing";
    case "pronunciation":
      return "speaking";
    default:
      return "reading";
  }
}

function checkpointModality(skill: Skill | "overall"): CefrCheckpointModality {
  if (skill === "overall") return "overall";
  return skillToModality(skill);
}

export interface IngestionContext {
  /** Pseudonymized learner id (must be already hashed). */
  userIdHash: string;
  /** Session id (already pseudonymized by host). */
  sessionId: string;
  /** Integer ms timestamp the caller treats as "now". */
  nowMs: number;
  /**
   * Prefix the adapter combines with a monotonically-increasing internal
   * counter to mint event ids. The prefix must itself be stable across
   * replays — typically `${sessionId}-${stepIndex}` from the host flow.
   */
  eventIdPrefix: string;
}

interface ContextWithCounter extends IngestionContext {
  __counter: { value: number };
}

function withCounter(ctx: IngestionContext): ContextWithCounter {
  return { ...ctx, __counter: { value: 0 } };
}

function mintEventId(ctx: ContextWithCounter, suffix: string): string {
  ctx.__counter.value += 1;
  return `${ctx.eventIdPrefix}::${ctx.__counter.value.toString().padStart(4, "0")}::${suffix}`;
}

function assertCtx(ctx: IngestionContext): void {
  if (!ctx.userIdHash || typeof ctx.userIdHash !== "string") {
    throw new Error("IngestionContext.userIdHash must be a non-empty string");
  }
  if (!ctx.sessionId || typeof ctx.sessionId !== "string") {
    throw new Error("IngestionContext.sessionId must be a non-empty string");
  }
  if (!Number.isInteger(ctx.nowMs) || ctx.nowMs < 0) {
    throw new Error("IngestionContext.nowMs must be a non-negative integer");
  }
  if (!ctx.eventIdPrefix || typeof ctx.eventIdPrefix !== "string") {
    throw new Error("IngestionContext.eventIdPrefix must be a non-empty string");
  }
}

// ---------------------------------------------------------------------------
// Plan generation
// ---------------------------------------------------------------------------

/**
 * Emit a synthetic-but-meaningful trace when a study plan is (re)generated.
 *
 * We treat plan generation as a sequence of `lesson_start` events for the
 * lessons scheduled on day 1 — this lets the analytical core see "what the
 * plan promised on day 1" so cohort comparisons can reason about what
 * upstream actually proposed.
 *
 * Critically: we do NOT mint completion/retry events here. Plan generation
 * is hypothetical until the learner actually starts lessons.
 */
export function ingestStudyPlanGenerated(
  plan: StudyPlanLike,
  ctx: IngestionContext,
): TelemetryEvent[] {
  assertCtx(ctx);
  const local = withCounter(ctx);
  const out: TelemetryEvent[] = [];
  const day1 = plan.days.find((d) => d.day === 1);
  if (!day1) return out;
  for (const lesson of day1.lessons) {
    const start: LessonStartEvent = {
      ...BASE,
      type: "lesson_start",
      eventId: mintEventId(local, `plan_gen_${lesson.lessonId}`),
      userIdHash: ctx.userIdHash,
      sessionId: ctx.sessionId,
      timestampMs: ctx.nowMs,
      lessonId: lesson.lessonId,
      cefrTarget: lesson.cefrTarget ?? inferPlanCefr(plan),
      modality: skillToModality(lesson.skill),
    };
    out.push(start);
  }
  return out;
}

function inferPlanCefr(plan: StudyPlanLike): CEFRLevel {
  // Walk every scheduled lesson and pick the lowest declared CEFR target,
  // defaulting to A2 if nothing is declared. The lowest is deliberately
  // chosen so cohort assignments err toward "needs more scaffolding".
  let best: CEFRLevel | null = null;
  for (const day of plan.days) {
    for (const lesson of day.lessons) {
      if (!lesson.cefrTarget) continue;
      if (best === null || cefrRank(lesson.cefrTarget) < cefrRank(best)) {
        best = lesson.cefrTarget;
      }
    }
  }
  return best ?? "A2";
}

function cefrRank(level: CEFRLevel): number {
  return ["A1", "A2", "B1", "B2", "C1", "C2"].indexOf(level);
}

// ---------------------------------------------------------------------------
// Lesson-flow ingestion
// ---------------------------------------------------------------------------

export interface LessonStartInput {
  lessonId: string;
  skill: Skill;
  cefrTarget?: CEFRLevel;
}

export function ingestLessonStart(
  input: LessonStartInput,
  ctx: IngestionContext,
): LessonStartEvent {
  assertCtx(ctx);
  const local = withCounter(ctx);
  return {
    ...BASE,
    type: "lesson_start",
    eventId: mintEventId(local, `start_${input.lessonId}`),
    userIdHash: ctx.userIdHash,
    sessionId: ctx.sessionId,
    timestampMs: ctx.nowMs,
    lessonId: input.lessonId,
    cefrTarget: input.cefrTarget ?? "A2",
    modality: skillToModality(input.skill),
  };
}

export interface LessonCompletionInput {
  lessonId: string;
  durationMs: number;
  scoreRatio: number;
  retries: number;
}

export function ingestLessonCompletion(
  input: LessonCompletionInput,
  ctx: IngestionContext,
): LessonCompleteEvent {
  assertCtx(ctx);
  if (!Number.isInteger(input.durationMs) || input.durationMs < 0) {
    throw new Error("ingestLessonCompletion: durationMs must be a non-negative integer");
  }
  if (input.scoreRatio < 0 || input.scoreRatio > 1 || Number.isNaN(input.scoreRatio)) {
    throw new Error("ingestLessonCompletion: scoreRatio must be a finite 0..1 value");
  }
  if (!Number.isInteger(input.retries) || input.retries < 0) {
    throw new Error("ingestLessonCompletion: retries must be a non-negative integer");
  }
  const local = withCounter(ctx);
  return {
    ...BASE,
    type: "lesson_complete",
    eventId: mintEventId(local, `complete_${input.lessonId}`),
    userIdHash: ctx.userIdHash,
    sessionId: ctx.sessionId,
    timestampMs: ctx.nowMs,
    lessonId: input.lessonId,
    durationMs: input.durationMs,
    scoreRatio: input.scoreRatio,
    retries: input.retries,
  };
}

export type LessonSkipReason =
  | "user_initiated"
  | "timeout"
  | "skipped"
  | "incorrect";

export interface LessonSkipInput {
  lessonId: string;
  progressRatio: number;
  dwellMs: number;
  reason?: LessonSkipReason;
}

/**
 * Skip = dropoff in v4 telemetry vocabulary. We mint a dropoff event because
 * skip and dropoff are observationally identical from the analytical core's
 * perspective (a started lesson that did not complete).
 */
export function ingestLessonSkip(
  input: LessonSkipInput,
  ctx: IngestionContext,
): LessonDropoffEvent {
  assertCtx(ctx);
  if (input.progressRatio < 0 || input.progressRatio > 1) {
    throw new Error("ingestLessonSkip: progressRatio must be 0..1");
  }
  if (!Number.isInteger(input.dwellMs) || input.dwellMs < 0) {
    throw new Error("ingestLessonSkip: dwellMs must be a non-negative integer");
  }
  const local = withCounter(ctx);
  return {
    ...BASE,
    type: "lesson_dropoff",
    eventId: mintEventId(local, `skip_${input.lessonId}`),
    userIdHash: ctx.userIdHash,
    sessionId: ctx.sessionId,
    timestampMs: ctx.nowMs,
    lessonId: input.lessonId,
    progressRatio: input.progressRatio,
    dwellMs: input.dwellMs,
  };
}

export interface LessonRetryInput {
  lessonId: string;
  attemptOrdinal: number;
  reason: LessonRetryEvent["reason"];
}

export function ingestLessonRetry(
  input: LessonRetryInput,
  ctx: IngestionContext,
): LessonRetryEvent {
  assertCtx(ctx);
  if (!Number.isInteger(input.attemptOrdinal) || input.attemptOrdinal < 1) {
    throw new Error("ingestLessonRetry: attemptOrdinal must be a positive integer");
  }
  const local = withCounter(ctx);
  return {
    ...BASE,
    type: "lesson_retry",
    eventId: mintEventId(local, `retry_${input.lessonId}_${input.attemptOrdinal}`),
    userIdHash: ctx.userIdHash,
    sessionId: ctx.sessionId,
    timestampMs: ctx.nowMs,
    lessonId: input.lessonId,
    attemptOrdinal: input.attemptOrdinal,
    reason: input.reason,
  };
}

export interface SpeakingRetryInput {
  lessonId: string;
  promptId: string;
  attemptOrdinal: number;
  pronunciationScore: number;
}

export function ingestSpeakingRetry(
  input: SpeakingRetryInput,
  ctx: IngestionContext,
): SpeakingRetryEvent {
  assertCtx(ctx);
  if (input.pronunciationScore < 0 || input.pronunciationScore > 1) {
    throw new Error("ingestSpeakingRetry: pronunciationScore must be 0..1");
  }
  if (!Number.isInteger(input.attemptOrdinal) || input.attemptOrdinal < 1) {
    throw new Error("ingestSpeakingRetry: attemptOrdinal must be a positive integer");
  }
  const local = withCounter(ctx);
  return {
    ...BASE,
    type: "speaking_retry",
    eventId: mintEventId(
      local,
      `speaking_${input.lessonId}_${input.promptId}_${input.attemptOrdinal}`,
    ),
    userIdHash: ctx.userIdHash,
    sessionId: ctx.sessionId,
    timestampMs: ctx.nowMs,
    lessonId: input.lessonId,
    promptId: input.promptId,
    attemptOrdinal: input.attemptOrdinal,
    pronunciationScore: input.pronunciationScore,
  };
}

export interface HesitationLoopInput {
  lessonId: string;
  loopDurationMs: number;
  silenceCount: number;
}

export function ingestHesitationLoop(
  input: HesitationLoopInput,
  ctx: IngestionContext,
): HesitationLoopEvent {
  assertCtx(ctx);
  if (!Number.isInteger(input.loopDurationMs) || input.loopDurationMs < 0) {
    throw new Error("ingestHesitationLoop: loopDurationMs must be a non-negative integer");
  }
  if (!Number.isInteger(input.silenceCount) || input.silenceCount < 0) {
    throw new Error("ingestHesitationLoop: silenceCount must be a non-negative integer");
  }
  const local = withCounter(ctx);
  return {
    ...BASE,
    type: "hesitation_loop",
    eventId: mintEventId(local, `hesitation_${input.lessonId}`),
    userIdHash: ctx.userIdHash,
    sessionId: ctx.sessionId,
    timestampMs: ctx.nowMs,
    lessonId: input.lessonId,
    loopDurationMs: input.loopDurationMs,
    silenceCount: input.silenceCount,
  };
}

// ---------------------------------------------------------------------------
// Adaptive recalculation
// ---------------------------------------------------------------------------

export type RecalculationReasonCode =
  | "burnout_detected"
  | "stagnation_detected"
  | "forecast_miss"
  | "user_request"
  | "scheduled_review";

export interface RecalculationInput {
  /** New plan the sequencer settled on. */
  newPlan: StudyPlanLike;
  /** Plan version that was active before recalc — for cohort transition analysis. */
  previousPlanVersion: string;
  /** Reason the sequencer fired. */
  reasonCode: RecalculationReasonCode;
}

/**
 * Recalculations don't have a first-class event type in the v4 schema; we
 * encode them as a `lesson_start` re-emission of day-1 plus a synthetic
 * `study_streak` event that signals the plan boundary. The reasonCode is
 * threaded into the eventIdPrefix so the analytical layer can recover it
 * through string introspection if needed without expanding the schema.
 */
export function ingestAdaptiveRecalculation(
  input: RecalculationInput,
  ctx: IngestionContext,
): TelemetryEvent[] {
  assertCtx(ctx);
  if (input.newPlan.planVersion === input.previousPlanVersion) {
    throw new Error("ingestAdaptiveRecalculation: new plan must differ from previous version");
  }
  // Stamp the reason into the eventIdPrefix used downstream so observers can
  // reconstruct the recalc reason without us adding a new event type.
  const reasonAwareCtx: IngestionContext = {
    ...ctx,
    eventIdPrefix: `${ctx.eventIdPrefix}::recalc_${input.reasonCode}`,
  };
  const events = ingestStudyPlanGenerated(input.newPlan, reasonAwareCtx);
  const local = withCounter(reasonAwareCtx);
  const streakEvent: StudyStreakEvent = {
    ...BASE,
    type: "study_streak",
    eventId: mintEventId(local, `recalc_marker_${input.reasonCode}`),
    userIdHash: ctx.userIdHash,
    sessionId: ctx.sessionId,
    timestampMs: ctx.nowMs,
    streakDays: 0,
    streakState: "resumed",
  };
  return [...events, streakEvent];
}

// ---------------------------------------------------------------------------
// Progression checkpoint
// ---------------------------------------------------------------------------

export interface ProgressionCheckpointInput {
  modality: Skill | "overall";
  fromLevel: CEFRLevel | null;
  toLevel: CEFRLevel;
  confidence: number;
}

export function ingestProgressionCheckpoint(
  input: ProgressionCheckpointInput,
  ctx: IngestionContext,
): CefrCheckpointEvent {
  assertCtx(ctx);
  if (input.confidence < 0 || input.confidence > 1) {
    throw new Error("ingestProgressionCheckpoint: confidence must be 0..1");
  }
  const local = withCounter(ctx);
  return {
    ...BASE,
    type: "cefr_checkpoint",
    eventId: mintEventId(local, `checkpoint_${input.modality}`),
    userIdHash: ctx.userIdHash,
    sessionId: ctx.sessionId,
    timestampMs: ctx.nowMs,
    modality: checkpointModality(input.modality),
    fromLevel: input.fromLevel,
    toLevel: input.toLevel,
    confidence: input.confidence,
  };
}

// ---------------------------------------------------------------------------
// Burnout indicator (synthesized into hesitation + dropoff events)
// ---------------------------------------------------------------------------

export interface BurnoutIndicatorInput {
  /** The lesson the burnout indicator fired on. */
  lessonId: string;
  /** Length of the hesitation loop captured. */
  hesitationDurationMs: number;
  /** Silences observed during the loop. */
  silenceCount: number;
  /** True if the learner actually abandoned the lesson immediately after. */
  abandoned: boolean;
  /** Lesson progress at the moment burnout was detected. */
  progressRatio: number;
  /** Dwell at the time of the indicator. */
  dwellMs: number;
}

/**
 * Burnout indicators show up as a hesitation_loop followed (optionally) by
 * a lesson_dropoff. This shape lets downstream effectiveness scoring already
 * react to them without needing a new event type.
 */
export function ingestBurnoutIndicator(
  input: BurnoutIndicatorInput,
  ctx: IngestionContext,
): TelemetryEvent[] {
  assertCtx(ctx);
  const local = withCounter(ctx);
  const out: TelemetryEvent[] = [];
  const hesitation: HesitationLoopEvent = {
    ...BASE,
    type: "hesitation_loop",
    eventId: mintEventId(local, `burnout_hesitation_${input.lessonId}`),
    userIdHash: ctx.userIdHash,
    sessionId: ctx.sessionId,
    timestampMs: ctx.nowMs,
    lessonId: input.lessonId,
    loopDurationMs: input.hesitationDurationMs,
    silenceCount: input.silenceCount,
  };
  out.push(hesitation);
  if (input.abandoned) {
    const dropoff: LessonDropoffEvent = {
      ...BASE,
      type: "lesson_dropoff",
      eventId: mintEventId(local, `burnout_dropoff_${input.lessonId}`),
      userIdHash: ctx.userIdHash,
      sessionId: ctx.sessionId,
      timestampMs: ctx.nowMs,
      lessonId: input.lessonId,
      progressRatio: input.progressRatio,
      dwellMs: input.dwellMs,
    };
    out.push(dropoff);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Review debt accumulation
// ---------------------------------------------------------------------------

export interface ReviewDebtInput {
  /** New review-debt count after the accumulation event. */
  reviewDebtCount: number;
  /** True if the learner has been skipping review days. */
  reviewSkippedRecently: boolean;
  /** Current streak. */
  streakDays: number;
}

/**
 * Review-debt accumulation is encoded as a study_streak event with
 * `streakState=broken` when debt crosses 5 items, so cohort drift can pick
 * up "users with 5+ overdue review items churn faster" without any extra
 * schema work.
 */
export function ingestReviewDebtAccumulation(
  input: ReviewDebtInput,
  ctx: IngestionContext,
): StudyStreakEvent {
  assertCtx(ctx);
  if (!Number.isInteger(input.reviewDebtCount) || input.reviewDebtCount < 0) {
    throw new Error("ingestReviewDebtAccumulation: reviewDebtCount must be a non-negative integer");
  }
  if (!Number.isInteger(input.streakDays) || input.streakDays < 0) {
    throw new Error("ingestReviewDebtAccumulation: streakDays must be a non-negative integer");
  }
  const local = withCounter(ctx);
  const streakState: StudyStreakEvent["streakState"] =
    input.reviewSkippedRecently && input.reviewDebtCount >= 5
      ? "broken"
      : input.streakDays === 0
        ? "broken"
        : "active";
  return {
    ...BASE,
    type: "study_streak",
    eventId: mintEventId(local, `review_debt_${input.reviewDebtCount}`),
    userIdHash: ctx.userIdHash,
    sessionId: ctx.sessionId,
    timestampMs: ctx.nowMs,
    streakDays: input.streakDays,
    streakState,
  };
}

// ---------------------------------------------------------------------------
// Convenience: full-batch ingestion from a progression snapshot
// ---------------------------------------------------------------------------

export interface BatchIngestionInput {
  snapshot: ProgressionSnapshotLike;
  /** Stable id prefix the host derives, e.g. `${sessionId}-snap-${seq}`. */
  eventIdPrefix: string;
}

/**
 * Convenience helper for upstream agents: ingest the most-recent state of a
 * learner as a set of events that match how the analytical core expects the
 * world. Cheap, deterministic, no-side-effect.
 */
export function ingestProgressionSnapshot(
  input: BatchIngestionInput,
): TelemetryEvent[] {
  const ctx: IngestionContext = {
    userIdHash: input.snapshot.userIdHash,
    sessionId: input.snapshot.sessionId,
    nowMs: input.snapshot.snapshotMs,
    eventIdPrefix: input.eventIdPrefix,
  };
  const out: TelemetryEvent[] = [];
  out.push(...ingestStudyPlanGenerated(input.snapshot.plan, ctx));
  if (
    typeof input.snapshot.streakDays === "number" &&
    Number.isInteger(input.snapshot.streakDays)
  ) {
    const streakCtx: IngestionContext = {
      ...ctx,
      eventIdPrefix: `${ctx.eventIdPrefix}::snap_streak`,
    };
    const local = withCounter(streakCtx);
    out.push({
      ...BASE,
      type: "study_streak",
      eventId: mintEventId(local, "snapshot"),
      userIdHash: ctx.userIdHash,
      sessionId: ctx.sessionId,
      timestampMs: ctx.nowMs,
      streakDays: input.snapshot.streakDays,
      streakState: input.snapshot.streakDays > 0 ? "active" : "broken",
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Re-export for callers that want to consult the CEFR transition shape
// ---------------------------------------------------------------------------

export type { CefrTransitionRecord };
