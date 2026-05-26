// Placement V4 — public API surface.
//
// Import from this module rather than the submodules directly so the
// surface stays intentional and refactorable. The orchestration layer
// (PR #970) wires these core modules together; this barrel keeps the
// individual module boundaries clean.

// ---------------------------------------------------------------------------
// Core V4 modules
// ---------------------------------------------------------------------------

export {
  LEARNER_MEMORY_SCHEMA_VERSION,
  DEFAULT_CONFIDENCE_HALF_LIFE_DAYS,
  DEFAULT_TREND_WINDOW_DAYS,
  DEFAULT_SNAPSHOT_RETENTION_DAYS,
  DEFAULT_SNAPSHOT_RETENTION_COUNT,
  DEFAULT_EVENT_RETENTION_DAYS,
  DEFAULT_EVENT_RETENTION_COUNT,
} from "./learnerMemory";

export type {
  LearnerKey,
  LearnerProgressionSnapshot,
  SkillTrendBucket,
  LessonMasteryRecord,
  LessonMasteryLevel,
  CefrTimelinePoint,
  LearnerMemoryEventKind,
  LearnerMemoryEventPayload,
  LearnerMemoryEvent,
  LearnerMemory,
} from "./learnerMemory";

export {
  // Construction
  createLearnerMemory,
  buildPlacementSnapshot,
  // Identity
  normalizeLearnerKey,
  normalizeSourceId,
  normalizeRoomId,
  normalizeIsoTimestamp,
  normalizeCefr,
  snapshotId,
  cefrOrdinal,
  ordinalToCefr,
  // Merge
  compareSnapshots,
  mergeSnapshots,
  // Decay
  decayConfidence,
  // Trends
  computeSkillTrend,
  computeAllSkillTrends,
  // Lesson mastery
  recordLessonAttempt,
  // Timeline
  buildCefrTimeline,
  cefrAt,
  // Events
  nextEventSequence,
  appendPlacementSnapshotEvent,
  appendLessonMasteryEvent,
  appendSkillTrendRecomputeEvent,
  // Pruning
  pruneMemory,
  // Replay
  replayEvents,
  // Serialization
  serializeLearnerMemory,
  deserializeLearnerMemory,
  fingerprintLearnerMemory,
} from "./learnerMemory";

export type {
  CurriculumPlanLength,
  CurriculumActivityKind,
  CurriculumSkill,
  CompletedCurriculumLesson,
  SkillProgress,
  CurriculumLearnerState,
  CurriculumActivity,
  CurriculumDayPlan,
  CurriculumPlan,
} from "./curriculumSequencer";

export { generateCurriculumPlan } from "./curriculumSequencer";

export { PROGRESSION_SIMULATOR_VERSION } from "./progressionSimulator";

export type {
  ProgressionCefrLevel,
  ProgressionSubskill,
  PlacementV3ProgressionInput,
  StudyPlanAssumptions,
  ProgressionSubskillState,
  ProgressionSnapshot,
  ProgressionTraceEvent,
  ProgressionSimulationResult,
} from "./progressionSimulator";

export { simulateProgression, exportProgressionTrace } from "./progressionSimulator";

export type {
  PlacementV4ProviderCapability,
  PlacementV4BoundaryMode,
  PlacementV4ProviderTrustTier,
  PlacementV4Region,
  PlacementV4PrivacyTier,
  PlacementV4Modality,
  PlacementV4CostUnit,
  PlacementV4ProviderHealthStatus,
  PlacementV4EndpointKind,
  PlacementV4FailoverReason,
  PlacementV4FailureClass,
  PlacementV4ConsistencyReason,
  PlacementV4CapabilityDescriptor,
  PlacementV4ProviderIdentity,
  PlacementV4ModelDescriptor,
  PlacementV4CapabilitySupport,
  PlacementV4CostPolicy,
  PlacementV4RetentionPolicy,
  PlacementV4ProviderDescriptor,
  PlacementV4ProviderHealthSnapshot,
  PlacementV4ValidationBoundary,
  PlacementV4ProviderSelectionRequest,
  PlacementV4BoundaryDecision,
  PlacementV4TrustScoreComponents,
  PlacementV4CostEstimate,
  PlacementV4RejectedCandidate,
  PlacementV4ProviderSelection,
  PlacementV4ProviderDecisionRecord,
  PlacementV4ProviderOutput,
  PlacementV4ConsistencyAdjudication,
} from "./providerRegistry";

export {
  PLACEMENT_V4_CAPABILITY_DESCRIPTORS,
  PLACEMENT_V4_PROVIDER_POLICY_MATRIX,
  PLACEMENT_V4_MOCK_PROVIDERS,
  createPlacementV4Boundary,
  normalizePlacementV4HealthSnapshot,
  quarantinePlacementV4Provider,
  calculatePlacementV4QuarantineUntil,
  selectPlacementV4Provider,
  createProviderDecisionRecord,
  hashProviderDecisionRecord,
  serializeProviderDecisionRecord,
  adjudicatePlacementV4ProviderOutputs,
} from "./providerRegistry";

// ---------------------------------------------------------------------------
// Telemetry sub-module (re-exported as a namespaced path)
// ---------------------------------------------------------------------------

export * as Telemetry from "./telemetry";
