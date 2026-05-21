// Placement v4 telemetry — public API surface.
//
// Import from this module rather than the submodules directly so that the
// surface remains intentional and refactorable.

export {
  TELEMETRY_SCHEMA_VERSION,
} from "./types";

export type {
  AgeBucket,
  AggregationSummary,
  CefrCheckpointEvent,
  CefrCheckpointModality,
  CefrTransitionRecord,
  ChurnRiskBucket,
  Cohort,
  CohortAssignment,
  CohortComparisonRow,
  CohortDriftReport,
  CohortGap,
  EffectivenessScore,
  HesitationLoopEvent,
  LessonAggregate,
  LessonCompleteEvent,
  LessonDropoffEvent,
  LessonRetryEvent,
  LessonRetryReason,
  LessonStartEvent,
  RetentionSignal,
  SpeakingRetryEvent,
  StudyStreakEvent,
  StudyStreakState,
  TelemetryEvent,
  TelemetryEventType,
  TelemetrySchemaVersion,
  UserAggregate,
  WeakPatternCluster,
} from "./types";

export { telemetryEventSchema, validateEvents } from "./schema";
export type { RejectedEvent, ValidationResult } from "./schema";

export {
  aggregateEvents,
  canonicalizeEvents,
  mergeAggregations,
} from "./aggregation";

export {
  buildLessonCompletionsByUser,
  computeCefrLiftByLesson,
  scoreAllLessons,
  scoreLessonEffectiveness,
} from "./effectiveness";

export {
  classifyChurnRisk,
  extractRetentionSignals,
  retentionStabilityFingerprint,
} from "./retention";
export type { RetentionOptions } from "./retention";

export { buildCohortDriftReport, cohortKey } from "./cohort";
export type { CohortComparisonOptions } from "./cohort";

export { clusterWeakLessons } from "./clustering";
export type { ClusteringOptions } from "./clustering";

export {
  aggregateForRelease,
  fnv1a64Hex,
  redactForRelease,
} from "./privacy";
export type { PrivacyOptions } from "./privacy";

export {
  buildReplaySnapshot,
  canonicalJSON,
  replayFingerprint,
} from "./replay";
export type {
  BuildSnapshotOptions,
  ReplaySafeSnapshot,
} from "./replay";

export {
  UTC_MS_PER_DAY,
  inclusiveDaySpan,
  longestContiguousRun,
  utcDayOrdinal,
} from "./time";
