/**
 * Placement V5 — public API surface.
 *
 * V5 is additive to V4. All V5 exports are gated behind V5_ENABLED.
 * Import from this module rather than submodules directly.
 *
 * Current state (V5-004): feature flag + evaluation harness skeleton +
 * persistence layer. No personalization, forecast, or provider-runtime
 * implementation yet.
 */

// Feature flag (always available — determines whether V5 is active)
export {
  V5_ENABLED,
  V5_PERSONALIZATION_ENABLED,
  V5_FORECAST_ENABLED,
  V5_PROVIDER_RUNTIME_ENABLED,
  V5_EVALUATION_HARNESS_ENABLED,
  isV5CapabilityEnabled,
  enabledV5Capabilities,
  requireV5Enabled,
  type V5Capability,
} from "./v5FeatureFlag";

// Evaluation harness (skeleton — returns inert defaults when V5 is disabled)
export {
  V5_HARNESS_VERSION,
  V5_LEARNER_A,
  V5_LEARNER_B,
  V5_LEARNER_C,
  V5_LEARNERS,
  getV5HarnessState,
  generateProgressReport,
  deepFreeze as v5DeepFreeze,
  V5_FIXED_EPOCH_MS,
  V5_FIXED_EPOCH,
  resetV5IdCounter,
  v5NextId,
  v5IsoDaysAfter,
  v5IsoDaysAgo,
  type V5HarnessState,
  type V5ProgressReport,
} from "./v5Harness";

// Persistence layer (V5-004) — typed Supabase helpers, feature-gated
export * as V5Persistence from "./persistence";
export type {
  V5LearnerMemoryRow,
  V5TelemetryEventRow,
  V5OrchestrationSnapshotRow,
  V5ProviderDecisionRow,
  V5CurriculumPlanRow,
  V5SnapshotType,
  V5AdminLearnerMemorySummary,
  V5AdminTelemetryDaily,
  V5AdminProviderDecisionSummary,
  V5AdminCurriculumPlanSummary,
} from "./persistenceTypes";

// Lifecycle wiring (V5-005) — orchestration wrapper over V4 core
export * as V5Lifecycle from "./v5Lifecycle";
export type { V5LifecycleState, V5LifecyclePhase } from "./v5Lifecycle";
