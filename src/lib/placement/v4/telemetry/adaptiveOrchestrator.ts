// Placement v4 — adaptive orchestrator (pure functional reducer).
//
// Activation layer that wires product-flow events into:
//   - telemetry ingestion adapters
//   - learner-memory event accumulation
//   - intervention lifecycle (issued → acknowledged → resolved)
//   - recovery state tracking
//   - forecast history
//
// Contract:
//   - The orchestrator is a PURE reducer: (state, event) -> state. No internal
//     mutable state. Callers persist the returned state.
//   - No Date.now, no Math.random. Every time value comes from the event's
//     IngestionContext.nowMs or the snapshot's snapshotMs.
//   - Events with the same eventId are idempotent — applying the same event
//     twice produces the same state as applying it once.
//   - State is replay-rebuildable: replaying the entire event log from genesis
//     yields a state bit-identical to the live one.

import {
  ingestAdaptiveRecalculation,
  ingestBurnoutIndicator,
  ingestHesitationLoop,
  ingestLessonCompletion,
  ingestLessonRetry,
  ingestLessonSkip,
  ingestLessonStart,
  ingestProgressionCheckpoint,
  ingestReviewDebtAccumulation,
  ingestSpeakingRetry,
  ingestStudyPlanGenerated,
} from "./studyPlanTelemetry";
import { evaluateAdaptiveLoop } from "./adaptiveLoop";
import { aggregateEvents } from "./aggregation";
import type { AdaptiveLoopResult } from "./adaptiveLoop";
import type {
  ForecastLike,
  IneffectiveClusterFlag,
  InterventionPlan,
  InterventionRecommendation,
  LearnerMemoryEventLike,
  ProgressionSnapshotLike,
  StudyPlanLike,
} from "./adaptiveTelemetryTypes";
import type {
  BurnoutIndicatorInput,
  HesitationLoopInput,
  IngestionContext,
  LessonCompletionInput,
  LessonRetryInput,
  LessonSkipInput,
  LessonStartInput,
  ProgressionCheckpointInput,
  RecalculationInput,
  ReviewDebtInput,
  SpeakingRetryInput,
} from "./studyPlanTelemetry";
import type { TelemetryEvent } from "./types";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export const ORCHESTRATOR_SCHEMA_VERSION = 1 as const;

export type RecoveryKind = "none" | "active";

export interface InterventionLifecycleEntry {
  /** Stable id from the original InterventionRecommendation. */
  interventionId: string;
  kind: InterventionRecommendation["kind"];
  /** Issued / acknowledged / resolved status. */
  status: "issued" | "acknowledged" | "resolved";
  /** Issued / acknowledged / resolved timestamps (integer ms). */
  issuedMs: number;
  acknowledgedMs?: number;
  resolvedMs?: number;
  /** Stable reason for resolution if resolved (e.g. "user_returned"). */
  resolutionReason?: string;
}

export interface PlanVersionEntry {
  planVersion: string;
  generatedAtMs: number;
  reasonCode?: string;
}

export interface ForecastHistoryEntry {
  forecastId: string;
  planVersion: string;
  ingestedMs: number;
  horizonDays: number;
}

export interface RecoveryStateEntry {
  kind: RecoveryKind;
  startedMs?: number;
  endedMs?: number;
  reasonCode?: string;
}

export interface OrchestratorState {
  schemaVersion: typeof ORCHESTRATOR_SCHEMA_VERSION;
  /** Pseudonymized learner identifier this state belongs to. */
  userIdHash: string;
  /** Append-only telemetry event log (deduplicated by eventId). */
  telemetryEvents: readonly TelemetryEvent[];
  /** Coarse learner-memory event stream (deduplicated by timestamp+reference). */
  memoryEvents: readonly LearnerMemoryEventLike[];
  /** Intervention lifecycle records, sorted by interventionId. */
  interventions: readonly InterventionLifecycleEntry[];
  /** Plan-version history, oldest first. */
  planVersionHistory: readonly PlanVersionEntry[];
  /** Forecast history, oldest first. */
  forecastHistory: readonly ForecastHistoryEntry[];
  /** Active recovery state. */
  recoveryState: RecoveryStateEntry;
}

export function initOrchestratorState(userIdHash: string): OrchestratorState {
  if (!userIdHash || typeof userIdHash !== "string") {
    throw new Error("initOrchestratorState: userIdHash must be a non-empty string");
  }
  return {
    schemaVersion: ORCHESTRATOR_SCHEMA_VERSION,
    userIdHash,
    telemetryEvents: [],
    memoryEvents: [],
    interventions: [],
    planVersionHistory: [],
    forecastHistory: [],
    recoveryState: { kind: "none" },
  };
}

// ---------------------------------------------------------------------------
// Orchestration event types
// ---------------------------------------------------------------------------

export type OrchestrationEvent =
  | { type: "plan_generated"; plan: StudyPlanLike; ctx: IngestionContext }
  | { type: "plan_recalculated"; input: RecalculationInput; ctx: IngestionContext }
  | { type: "lesson_start"; input: LessonStartInput; ctx: IngestionContext }
  | { type: "lesson_complete"; input: LessonCompletionInput; ctx: IngestionContext }
  | { type: "lesson_skip"; input: LessonSkipInput; ctx: IngestionContext }
  | { type: "lesson_retry"; input: LessonRetryInput; ctx: IngestionContext }
  | { type: "speaking_retry"; input: SpeakingRetryInput; ctx: IngestionContext }
  | { type: "hesitation_loop"; input: HesitationLoopInput; ctx: IngestionContext }
  | { type: "burnout_indicator"; input: BurnoutIndicatorInput; ctx: IngestionContext }
  | { type: "review_debt_changed"; input: ReviewDebtInput; ctx: IngestionContext }
  | {
      type: "progression_checkpoint";
      input: ProgressionCheckpointInput;
      ctx: IngestionContext;
    }
  | {
      type: "recovery_started";
      reasonCode: string;
      ctx: IngestionContext;
    }
  | {
      type: "recovery_completed";
      reasonCode: string;
      ctx: IngestionContext;
    }
  | {
      type: "burnout_recovered";
      ctx: IngestionContext;
    }
  | {
      type: "forecast_recalibrated";
      forecast: ForecastLike;
      ctx: IngestionContext;
    }
  | {
      type: "intervention_acknowledged";
      interventionId: string;
      ctx: IngestionContext;
    }
  | {
      type: "intervention_resolved";
      interventionId: string;
      resolutionReason: string;
      ctx: IngestionContext;
    }
  | {
      type: "memory_event";
      event: LearnerMemoryEventLike;
      ctx: IngestionContext;
    };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function applyOrchestrationEvent(
  state: OrchestratorState,
  event: OrchestrationEvent,
): OrchestratorState {
  if (event.ctx.userIdHash !== state.userIdHash) {
    throw new Error(
      `applyOrchestrationEvent: userIdHash mismatch (state=${state.userIdHash}, event=${event.ctx.userIdHash})`,
    );
  }

  switch (event.type) {
    case "plan_generated": {
      const events = ingestStudyPlanGenerated(event.plan, event.ctx);
      const planEntry: PlanVersionEntry = {
        planVersion: event.plan.planVersion,
        generatedAtMs: event.ctx.nowMs,
      };
      return {
        ...state,
        telemetryEvents: dedupeTelemetry([...state.telemetryEvents, ...events]),
        planVersionHistory: dedupePlanHistory([
          ...state.planVersionHistory,
          planEntry,
        ]),
      };
    }
    case "plan_recalculated": {
      const events = ingestAdaptiveRecalculation(event.input, event.ctx);
      const planEntry: PlanVersionEntry = {
        planVersion: event.input.newPlan.planVersion,
        generatedAtMs: event.ctx.nowMs,
        reasonCode: event.input.reasonCode,
      };
      return {
        ...state,
        telemetryEvents: dedupeTelemetry([...state.telemetryEvents, ...events]),
        planVersionHistory: dedupePlanHistory([
          ...state.planVersionHistory,
          planEntry,
        ]),
      };
    }
    case "lesson_start": {
      const ev = ingestLessonStart(event.input, event.ctx);
      return {
        ...state,
        telemetryEvents: dedupeTelemetry([...state.telemetryEvents, ev]),
      };
    }
    case "lesson_complete": {
      const ev = ingestLessonCompletion(event.input, event.ctx);
      const memoryEvent: LearnerMemoryEventLike = {
        timestampMs: event.ctx.nowMs,
        kind: "lesson_completed",
        reference: event.input.lessonId,
      };
      return {
        ...state,
        telemetryEvents: dedupeTelemetry([...state.telemetryEvents, ev]),
        memoryEvents: dedupeMemory([...state.memoryEvents, memoryEvent]),
      };
    }
    case "lesson_skip": {
      const ev = ingestLessonSkip(event.input, event.ctx);
      const memoryEvent: LearnerMemoryEventLike = {
        timestampMs: event.ctx.nowMs,
        kind: "lesson_skipped",
        reference: event.input.lessonId,
      };
      return {
        ...state,
        telemetryEvents: dedupeTelemetry([...state.telemetryEvents, ev]),
        memoryEvents: dedupeMemory([...state.memoryEvents, memoryEvent]),
      };
    }
    case "lesson_retry": {
      const ev = ingestLessonRetry(event.input, event.ctx);
      return {
        ...state,
        telemetryEvents: dedupeTelemetry([...state.telemetryEvents, ev]),
      };
    }
    case "speaking_retry": {
      const ev = ingestSpeakingRetry(event.input, event.ctx);
      const memoryEvent: LearnerMemoryEventLike = {
        timestampMs: event.ctx.nowMs,
        kind: "speaking_struggle",
        reference: event.input.lessonId,
      };
      return {
        ...state,
        telemetryEvents: dedupeTelemetry([...state.telemetryEvents, ev]),
        memoryEvents: dedupeMemory([...state.memoryEvents, memoryEvent]),
      };
    }
    case "hesitation_loop": {
      const ev = ingestHesitationLoop(event.input, event.ctx);
      return {
        ...state,
        telemetryEvents: dedupeTelemetry([...state.telemetryEvents, ev]),
      };
    }
    case "burnout_indicator": {
      const events = ingestBurnoutIndicator(event.input, event.ctx);
      return {
        ...state,
        telemetryEvents: dedupeTelemetry([...state.telemetryEvents, ...events]),
      };
    }
    case "review_debt_changed": {
      const ev = ingestReviewDebtAccumulation(event.input, event.ctx);
      const memoryEvent: LearnerMemoryEventLike = {
        timestampMs: event.ctx.nowMs,
        kind: "review_overdue",
        reference: `debt:${event.input.reviewDebtCount}`,
      };
      return {
        ...state,
        telemetryEvents: dedupeTelemetry([...state.telemetryEvents, ev]),
        memoryEvents: dedupeMemory([...state.memoryEvents, memoryEvent]),
      };
    }
    case "progression_checkpoint": {
      const ev = ingestProgressionCheckpoint(event.input, event.ctx);
      const memoryEvent: LearnerMemoryEventLike = {
        timestampMs: event.ctx.nowMs,
        kind: "checkpoint",
        reference: `${event.input.modality}:${event.input.toLevel}`,
      };
      return {
        ...state,
        telemetryEvents: dedupeTelemetry([...state.telemetryEvents, ev]),
        memoryEvents: dedupeMemory([...state.memoryEvents, memoryEvent]),
      };
    }
    case "recovery_started": {
      const proposed: RecoveryStateEntry = {
        kind: "active",
        startedMs: event.ctx.nowMs,
        reasonCode: event.reasonCode,
      };
      return {
        ...state,
        recoveryState: pickLatestRecovery(state.recoveryState, proposed),
      };
    }
    case "recovery_completed": {
      const proposed: RecoveryStateEntry = {
        kind: "none",
        endedMs: event.ctx.nowMs,
        reasonCode: event.reasonCode,
      };
      return {
        ...state,
        recoveryState: pickLatestRecovery(state.recoveryState, proposed),
      };
    }
    case "burnout_recovered": {
      const proposed: RecoveryStateEntry = {
        kind: "none",
        endedMs: event.ctx.nowMs,
        reasonCode: "burnout_recovered",
      };
      return {
        ...state,
        recoveryState: pickLatestRecovery(state.recoveryState, proposed),
      };
    }
    case "forecast_recalibrated": {
      const entry: ForecastHistoryEntry = {
        forecastId: event.forecast.forecastId,
        planVersion: event.forecast.planVersion,
        ingestedMs: event.ctx.nowMs,
        horizonDays: event.forecast.horizonDays,
      };
      return {
        ...state,
        forecastHistory: dedupeForecast([...state.forecastHistory, entry]),
      };
    }
    case "intervention_acknowledged": {
      const updated = state.interventions.map((iv) =>
        iv.interventionId === event.interventionId && iv.status === "issued"
          ? { ...iv, status: "acknowledged" as const, acknowledgedMs: event.ctx.nowMs }
          : iv,
      );
      return { ...state, interventions: sortInterventions(updated) };
    }
    case "intervention_resolved": {
      const updated = state.interventions.map((iv) =>
        iv.interventionId === event.interventionId && iv.status !== "resolved"
          ? {
              ...iv,
              status: "resolved" as const,
              resolvedMs: event.ctx.nowMs,
              resolutionReason: event.resolutionReason,
            }
          : iv,
      );
      return { ...state, interventions: sortInterventions(updated) };
    }
    case "memory_event": {
      return {
        ...state,
        memoryEvents: dedupeMemory([...state.memoryEvents, event.event]),
      };
    }
  }
}

export function applyOrchestrationEvents(
  state: OrchestratorState,
  events: readonly OrchestrationEvent[],
): OrchestratorState {
  let acc = state;
  for (const ev of events) acc = applyOrchestrationEvent(acc, ev);
  return acc;
}

// ---------------------------------------------------------------------------
// Adaptive cycle — runs evaluateAdaptiveLoop and appends issued interventions
// ---------------------------------------------------------------------------

export interface RunAdaptiveCycleInput {
  snapshot: ProgressionSnapshotLike;
  state: OrchestratorState;
  forecast?: ForecastLike;
  ineffectiveClusters?: readonly IneffectiveClusterFlag[];
}

export interface RunAdaptiveCycleResult {
  state: OrchestratorState;
  loopResult: AdaptiveLoopResult;
  newlyIssuedInterventions: readonly InterventionRecommendation[];
}

export function runAdaptiveCycle(
  input: RunAdaptiveCycleInput,
): RunAdaptiveCycleResult {
  if (input.state.userIdHash !== input.snapshot.userIdHash) {
    throw new Error(
      `runAdaptiveCycle: userIdHash mismatch (state=${input.state.userIdHash}, snapshot=${input.snapshot.userIdHash})`,
    );
  }
  const aggregation = aggregateEvents(input.state.telemetryEvents);
  const loopResult = evaluateAdaptiveLoop({
    snapshot: input.snapshot,
    aggregation,
    memory: {
      userIdHash: input.state.userIdHash,
      sessionIds: [input.snapshot.sessionId],
      recent: input.state.memoryEvents,
    },
    forecast: input.forecast,
    ineffectiveClusters: input.ineffectiveClusters,
  });

  // Append newly-issued interventions whose id is not already tracked.
  const existing = new Set(input.state.interventions.map((iv) => iv.interventionId));
  const newlyIssued: InterventionRecommendation[] = [];
  const newLifecycle: InterventionLifecycleEntry[] = [];
  for (const rec of loopResult.plan.recommendations) {
    if (existing.has(rec.id)) continue;
    newlyIssued.push(rec);
    newLifecycle.push({
      interventionId: rec.id,
      kind: rec.kind,
      status: "issued",
      issuedMs: input.snapshot.snapshotMs,
    });
  }
  const interventions = sortInterventions([
    ...input.state.interventions,
    ...newLifecycle,
  ]);
  const state: OrchestratorState = {
    ...input.state,
    interventions,
  };
  return {
    state,
    loopResult,
    newlyIssuedInterventions: newlyIssued,
  };
}

function recoveryEffectiveTs(entry: RecoveryStateEntry): number {
  return entry.endedMs ?? entry.startedMs ?? -1;
}

/**
 * Order-insensitive transition: the proposed recovery state wins only when
 * its effective timestamp is strictly newer than the current one. Ties tie
 * toward "active" so a concurrent burnout signal beats a stale completion.
 */
function pickLatestRecovery(
  current: RecoveryStateEntry,
  proposed: RecoveryStateEntry,
): RecoveryStateEntry {
  const curTs = recoveryEffectiveTs(current);
  const propTs = recoveryEffectiveTs(proposed);
  if (propTs > curTs) return proposed;
  if (propTs < curTs) return current;
  // Tie: prefer the active state if either party is active.
  if (current.kind === "active" || proposed.kind === "active") {
    return current.kind === "active" ? current : proposed;
  }
  return current;
}

// ---------------------------------------------------------------------------
// Dedup + sort helpers — keep state deterministic
// ---------------------------------------------------------------------------

function dedupeTelemetry(
  events: readonly TelemetryEvent[],
): readonly TelemetryEvent[] {
  const seen = new Set<string>();
  const out: TelemetryEvent[] = [];
  for (const ev of events) {
    if (seen.has(ev.eventId)) continue;
    seen.add(ev.eventId);
    out.push(ev);
  }
  // Stable order: (timestampMs, eventId).
  out.sort((a, b) => {
    if (a.timestampMs !== b.timestampMs) return a.timestampMs - b.timestampMs;
    if (a.eventId < b.eventId) return -1;
    if (a.eventId > b.eventId) return 1;
    return 0;
  });
  return out;
}

function dedupeMemory(
  events: readonly LearnerMemoryEventLike[],
): readonly LearnerMemoryEventLike[] {
  const seen = new Set<string>();
  const out: LearnerMemoryEventLike[] = [];
  for (const ev of events) {
    const key = `${ev.timestampMs}::${ev.kind}::${ev.reference}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(ev);
  }
  out.sort((a, b) => {
    if (a.timestampMs !== b.timestampMs) return a.timestampMs - b.timestampMs;
    if (a.kind < b.kind) return -1;
    if (a.kind > b.kind) return 1;
    if (a.reference < b.reference) return -1;
    if (a.reference > b.reference) return 1;
    return 0;
  });
  return out;
}

function dedupePlanHistory(
  entries: readonly PlanVersionEntry[],
): readonly PlanVersionEntry[] {
  const seen = new Set<string>();
  const out: PlanVersionEntry[] = [];
  for (const e of entries) {
    const key = `${e.planVersion}::${e.generatedAtMs}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  out.sort((a, b) => {
    if (a.generatedAtMs !== b.generatedAtMs) return a.generatedAtMs - b.generatedAtMs;
    if (a.planVersion < b.planVersion) return -1;
    if (a.planVersion > b.planVersion) return 1;
    return 0;
  });
  return out;
}

function dedupeForecast(
  entries: readonly ForecastHistoryEntry[],
): readonly ForecastHistoryEntry[] {
  const seen = new Set<string>();
  const out: ForecastHistoryEntry[] = [];
  for (const e of entries) {
    if (seen.has(e.forecastId)) continue;
    seen.add(e.forecastId);
    out.push(e);
  }
  out.sort((a, b) => {
    if (a.ingestedMs !== b.ingestedMs) return a.ingestedMs - b.ingestedMs;
    if (a.forecastId < b.forecastId) return -1;
    if (a.forecastId > b.forecastId) return 1;
    return 0;
  });
  return out;
}

function sortInterventions(
  entries: readonly InterventionLifecycleEntry[],
): readonly InterventionLifecycleEntry[] {
  return [...entries].sort((a, b) => {
    if (a.interventionId < b.interventionId) return -1;
    if (a.interventionId > b.interventionId) return 1;
    return 0;
  });
}
