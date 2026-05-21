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

// ---------------------------------------------------------------------------
// Adapter layer — structural integration surfaces for upstream V4 agents
// ---------------------------------------------------------------------------

export type {
  AdaptiveSignalBundle,
  BilingualString,
  BurnoutRisk,
  ChurnRisk,
  CurriculumSignalKind,
  CurriculumSignalLike,
  DiagnosticKind,
  ForecastDeviation,
  ForecastDeviationCode,
  ForecastDeviationReport,
  ForecastLike,
  ForecastSkillTargetLike,
  IneffectiveClusterFlag,
  InterventionEvidence,
  InterventionKind,
  InterventionPlan,
  InterventionPriority,
  InterventionRecommendation,
  L1PersistencePattern,
  LearnerDiagnostic,
  LearnerMemoryEventLike,
  LearnerMemorySummaryLike,
  ProgressionSnapshotLike,
  RecalibrationSuggestion,
  RecalibrationSuggestionKind,
  ReviewOverload,
  RiskLevel,
  Skill,
  SkillProgressLike,
  SpeakingAvoidance,
  StagnationAssessment,
  StudyPlanDayLike,
  StudyPlanIntensity,
  StudyPlanLessonLike,
  StudyPlanLike,
} from "./adaptiveTelemetryTypes";

export { CEFR_RANK as ADAPTIVE_CEFR_RANK } from "./adaptiveTelemetryTypes";

export {
  ingestAdaptiveRecalculation,
  ingestBurnoutIndicator,
  ingestHesitationLoop,
  ingestLessonCompletion,
  ingestLessonRetry,
  ingestLessonSkip,
  ingestLessonStart,
  ingestProgressionCheckpoint,
  ingestProgressionSnapshot,
  ingestReviewDebtAccumulation,
  ingestSpeakingRetry,
  ingestStudyPlanGenerated,
} from "./studyPlanTelemetry";
export type {
  BatchIngestionInput,
  BurnoutIndicatorInput,
  HesitationLoopInput,
  IngestionContext,
  LessonCompletionInput,
  LessonRetryInput,
  LessonSkipInput,
  LessonSkipReason,
  LessonStartInput,
  ProgressionCheckpointInput,
  RecalculationInput,
  RecalculationReasonCode,
  ReviewDebtInput,
  SpeakingRetryInput,
} from "./studyPlanTelemetry";

export {
  DEFAULT_THRESHOLDS,
  composeInterventionPlan,
  computeAdaptiveSignals,
  recommendInterventions,
} from "./interventionEngine";
export type {
  ComposePlanInput,
  ComputeSignalsInput,
  InterventionThresholds,
} from "./interventionEngine";

export {
  analyzeForecastVsActual,
  summarizeForecastForLearner,
} from "./forecastAnalysis";
export type { ForecastAnalysisOptions } from "./forecastAnalysis";

export {
  analyzeInterventionEffectiveness,
  burnoutByCefrBand,
  churnByWeakSkill,
  comparePlanVersions,
  l1ClusterEffectiveness,
  speakingConfidenceRetention,
} from "./cohortAdaptive";
export type {
  AdaptiveCohortOptions,
  BurnoutByCefrRow,
  CefrBandAssignment,
  ChurnByWeakSkillRow,
  InterventionEffectivenessRow,
  InterventionOutcome,
  L1ClusterAssignment,
  L1ClusterEffectivenessRow,
  PlanVersionAssignment,
  PlanVersionComparisonReport,
  PlanVersionRow,
  SpeakingRetentionAssignment,
  SpeakingRetentionRow,
  WeakSkillProfile,
} from "./cohortAdaptive";

export { buildLearnerDiagnostics } from "./diagnostics";
export type { BuildDiagnosticsInput } from "./diagnostics";

export { evaluateAdaptiveLoop } from "./adaptiveLoop";
export type { AdaptiveLoopInput, AdaptiveLoopResult } from "./adaptiveLoop";
