// Placement v4 telemetry — type contracts.
//
// Browser-safe. Pure types only — no runtime imports beyond placement-v3 type
// re-uses. Runtime validation lives in ./schema; aggregation in ./aggregation.
//
// Invariants this module commits to:
//   1. Events are immutable, append-only facts.
//   2. No PII fields exist anywhere on this surface. `userIdHash` is an
//      opaque string the caller has already pseudonymized.
//   3. All timestamps are integer Unix milliseconds; the analytical core
//      never reads `Date.now()` — it derives time exclusively from events.

import type {
  CEFRLevel,
  PlacementV3Modality,
} from "../../../../types/placement-v3";

export const TELEMETRY_SCHEMA_VERSION = 1 as const;
export type TelemetrySchemaVersion = typeof TELEMETRY_SCHEMA_VERSION;

export type TelemetryEventType =
  | "lesson_start"
  | "lesson_complete"
  | "lesson_retry"
  | "lesson_dropoff"
  | "speaking_retry"
  | "hesitation_loop"
  | "study_streak"
  | "cefr_checkpoint";

interface TelemetryEventBase<T extends TelemetryEventType> {
  /** Schema version. Older versions are rejected by the validator. */
  v: TelemetrySchemaVersion;
  /** Discriminator. */
  type: T;
  /** Caller-generated unique event id (ULID/UUID recommended). */
  eventId: string;
  /** Pseudonymized user identifier. The analytical core never sees raw ids. */
  userIdHash: string;
  /** Stable session identifier so retries/dropoffs can be grouped. */
  sessionId: string;
  /** Unix milliseconds, integer. */
  timestampMs: number;
}

export interface LessonStartEvent extends TelemetryEventBase<"lesson_start"> {
  lessonId: string;
  cefrTarget: CEFRLevel;
  modality: PlacementV3Modality;
}

export interface LessonCompleteEvent
  extends TelemetryEventBase<"lesson_complete"> {
  lessonId: string;
  /** Whole-lesson wall-clock duration in ms. */
  durationMs: number;
  /** 0..1 inclusive. The grader-reported normalized score. */
  scoreRatio: number;
  /** Number of in-lesson retries (>= 0). */
  retries: number;
}

export type LessonRetryReason =
  | "incorrect"
  | "timeout"
  | "skipped"
  | "user_initiated";

export interface LessonRetryEvent extends TelemetryEventBase<"lesson_retry"> {
  lessonId: string;
  /** 1-based ordinal of the attempt that just failed. */
  attemptOrdinal: number;
  reason: LessonRetryReason;
}

export interface LessonDropoffEvent
  extends TelemetryEventBase<"lesson_dropoff"> {
  lessonId: string;
  /** 0..1 inclusive — proportion of lesson completed before dropoff. */
  progressRatio: number;
  /** Total dwell time on the lesson before abandonment. */
  dwellMs: number;
}

export interface SpeakingRetryEvent
  extends TelemetryEventBase<"speaking_retry"> {
  lessonId: string;
  promptId: string;
  attemptOrdinal: number;
  /** 0..1 pronunciation score from the speaking grader. */
  pronunciationScore: number;
}

export interface HesitationLoopEvent
  extends TelemetryEventBase<"hesitation_loop"> {
  lessonId: string;
  /** Duration of the hesitation loop (re-listens, replays, idle). */
  loopDurationMs: number;
  /** Number of silence-or-replay sub-events captured in the loop. */
  silenceCount: number;
}

export type StudyStreakState = "active" | "broken" | "resumed";

export interface StudyStreakEvent extends TelemetryEventBase<"study_streak"> {
  /** Streak length as of this event, in days (>= 0). */
  streakDays: number;
  streakState: StudyStreakState;
}

export type CefrCheckpointModality = PlacementV3Modality | "overall";

export interface CefrCheckpointEvent
  extends TelemetryEventBase<"cefr_checkpoint"> {
  modality: CefrCheckpointModality;
  /** null = first observation for this user/modality. */
  fromLevel: CEFRLevel | null;
  toLevel: CEFRLevel;
  /** Model confidence at the checkpoint (0..1). */
  confidence: number;
}

export type TelemetryEvent =
  | LessonStartEvent
  | LessonCompleteEvent
  | LessonRetryEvent
  | LessonDropoffEvent
  | SpeakingRetryEvent
  | HesitationLoopEvent
  | StudyStreakEvent
  | CefrCheckpointEvent;

// ---------------------------------------------------------------------------
// Aggregation result shapes
// ---------------------------------------------------------------------------

export interface LessonAggregate {
  lessonId: string;
  starts: number;
  completions: number;
  retries: number;
  dropoffs: number;
  speakingRetries: number;
  hesitationLoops: number;
  totalScoreRatio: number;
  totalScoreSamples: number;
  totalDurationMs: number;
  durationSamples: number;
  uniqueUsers: number;
  /** Sorted set of userIdHashes that interacted with this lesson. */
  userIdHashes: readonly string[];
}

export interface UserAggregate {
  userIdHash: string;
  /** Distinct sessions count (derived from sessionIdHashes.length). */
  sessions: number;
  /** Sorted deduplicated set of pseudonymous session ids. Stripped on release. */
  sessionIdHashes: readonly string[];
  lessonsStarted: number;
  lessonsCompleted: number;
  lessonsDroppedOff: number;
  totalRetries: number;
  totalSpeakingRetries: number;
  totalHesitationLoops: number;
  maxStreakDays: number;
  /** Day-of-year integers in UTC where the user had any event. Sorted, deduped. */
  activeDays: readonly number[];
  firstSeenMs: number;
  lastSeenMs: number;
  cefrTransitions: readonly CefrTransitionRecord[];
}

export interface CefrTransitionRecord {
  modality: CefrCheckpointModality;
  fromLevel: CEFRLevel | null;
  toLevel: CEFRLevel;
  confidence: number;
  timestampMs: number;
}

export interface AggregationSummary {
  /** Number of events processed (post-validation). */
  eventCount: number;
  /** Number of distinct lessons observed. */
  lessonCount: number;
  /** Number of distinct users observed. */
  userCount: number;
  /** Earliest timestamp seen, or null if no events. */
  earliestMs: number | null;
  /** Latest timestamp seen, or null if no events. */
  latestMs: number | null;
  lessons: readonly LessonAggregate[];
  users: readonly UserAggregate[];
}

export interface EffectivenessScore {
  lessonId: string;
  /** 0..1. Completions / starts. */
  completionRate: number;
  /** 0..1. 1 - (dropoffs / starts). 1.0 = nobody dropped. */
  stickiness: number;
  /** Retries per completion. Lower is better. Capped at 10. */
  retryBurden: number;
  /** Mean score among completions. 0..1. */
  meanScore: number;
  /** Net CEFR levels gained across users who hit a checkpoint on this lesson. */
  cefrLift: number;
  /** Composite 0..1 score. Higher = more effective. */
  composite: number;
  /** Number of distinct users this score is computed from. */
  userN: number;
}

export interface RetentionSignal {
  userIdHash: string;
  /** Calendar days between firstSeenMs and lastSeenMs. */
  spanDays: number;
  /** Distinct active days (UTC) within the span. */
  activeDays: number;
  /** activeDays / max(1, spanDays). */
  activityDensity: number;
  /** Longest contiguous run of active days. */
  longestActiveRun: number;
  /** Days since lastSeenMs as of the analysis horizon. */
  daysSinceLastSeen: number;
  /** Coarse risk bucket derived from daysSinceLastSeen + activityDensity. */
  churnRisk: ChurnRiskBucket;
}

export type ChurnRiskBucket = "low" | "medium" | "high" | "lost";

export interface Cohort {
  /** Stable label, e.g. "A2|vi|en|adult". */
  key: string;
  cefrBand: CEFRLevel;
  nativeLang: string;
  targetLang: string;
  ageBucket: AgeBucket;
}

export type AgeBucket = "kid" | "teen" | "adult" | "unknown";

export interface CohortAssignment {
  userIdHash: string;
  cohort: Cohort;
}

export interface CohortComparisonRow {
  cohortKey: string;
  userN: number;
  meanCompletionRate: number;
  meanStickiness: number;
  meanRetryBurden: number;
  meanCefrLift: number;
  meanActivityDensity: number;
}

export interface CohortDriftReport {
  /** Rows in deterministic order, sorted by cohort.key ascending. */
  rows: readonly CohortComparisonRow[];
  /** Pairs with materially different composite outcomes. */
  notableGaps: readonly CohortGap[];
}

export interface CohortGap {
  a: string;
  b: string;
  metric: "completionRate" | "stickiness" | "retryBurden" | "cefrLift";
  delta: number;
}

export interface WeakPatternCluster {
  /** Deterministic id derived from cluster contents. */
  id: string;
  /** Lessons that share a similar failure signature. */
  lessonIds: readonly string[];
  /** Average effectiveness across the cluster. */
  meanComposite: number;
  /** Average retry burden across the cluster. */
  meanRetryBurden: number;
  /** Mean dropoff rate across the cluster. */
  meanDropoffRate: number;
  /** Total users impacted across the lessons in the cluster. */
  totalUserN: number;
}
