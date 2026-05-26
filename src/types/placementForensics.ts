export const PLACEMENT_FORENSIC_EVENT_TYPES = [
  "session_event",
  "provider_event",
  "retry_event",
  "fallback_event",
  "latency_event",
  "orchestration_transition",
  "recoverability_state",
  "degraded_result",
  "feature_flag_snapshot",
  "taxonomy_trigger",
  "recommendation_event",
] as const;

export const PLACEMENT_FORENSIC_SEVERITIES = [
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
] as const;

export const PLACEMENT_RECOVERABILITY_STATES = [
  "unknown",
  "recoverable",
  "degraded_safe",
  "unrecoverable",
  "recovered",
] as const;

export type PlacementForensicEventType =
  (typeof PLACEMENT_FORENSIC_EVENT_TYPES)[number];

export type PlacementForensicSeverity =
  (typeof PLACEMENT_FORENSIC_SEVERITIES)[number];

export type PlacementRecoverabilityState =
  (typeof PLACEMENT_RECOVERABILITY_STATES)[number];

export type PlacementProviderName = "openai" | "gemini" | "heuristic" | "none" | string;

export type PlacementForensicFeatureFlagSnapshot = {
  source: "compile_time" | "database" | "simulation" | string;
  flags: Record<string, boolean | string | number | null>;
};

export type PlacementForensicFailureSnapshot = {
  errorCode: string;
  errorMessage: string;
  deterministic: boolean | "unknown";
  recoverable: PlacementRecoverabilityState;
  stackHash?: string;
  safeUserOutcome?: "normal" | "degraded" | "blocked" | "unknown";
};

export type PlacementForensicBaseEvent = {
  id: string;
  sessionId: string;
  correlationId: string;
  occurredAt: string;
  sequence: number;
  type: PlacementForensicEventType;
  severity: PlacementForensicSeverity;
  step: string;
  message: string;
  featureFlags?: PlacementForensicFeatureFlagSnapshot;
  failureSnapshot?: PlacementForensicFailureSnapshot;
  metadata?: Record<string, unknown>;
};

export type PlacementSessionEvent = PlacementForensicBaseEvent & {
  type: "session_event";
  sessionState: "created" | "in_progress" | "completed" | "abandoned" | "failed" | string;
};

export type PlacementProviderEvent = PlacementForensicBaseEvent & {
  type: "provider_event";
  provider: PlacementProviderName;
  model?: string;
  attempt: number;
  status: "selected" | "success" | "timeout" | "error" | "parse_error" | "skipped";
  latencyMs?: number;
};

export type PlacementRetryEvent = PlacementForensicBaseEvent & {
  type: "retry_event";
  attempt: number;
  maxAttempts: number;
  reason: string;
  nextDelayMs?: number;
};

export type PlacementFallbackEvent = PlacementForensicBaseEvent & {
  type: "fallback_event";
  from: string;
  to: string;
  reason: string;
};

export type PlacementLatencyEvent = PlacementForensicBaseEvent & {
  type: "latency_event";
  latencyMs: number;
  budgetMs?: number;
  exceededBudget: boolean;
};

export type PlacementOrchestrationTransition = PlacementForensicBaseEvent & {
  type: "orchestration_transition";
  fromState: string;
  toState: string;
  action: string;
};

export type PlacementRecoverabilityEvent = PlacementForensicBaseEvent & {
  type: "recoverability_state";
  state: PlacementRecoverabilityState;
  reason: string;
};

export type PlacementDegradedResultEvent = PlacementForensicBaseEvent & {
  type: "degraded_result";
  marker: "heuristic_grade" | "partial_profile" | "safe_default" | "skipped_recommendations" | string;
  userVisible: boolean;
};

export type PlacementFeatureFlagEvent = PlacementForensicBaseEvent & {
  type: "feature_flag_snapshot";
  featureFlags: PlacementForensicFeatureFlagSnapshot;
};

export type PlacementTaxonomyTriggerEvent = PlacementForensicBaseEvent & {
  type: "taxonomy_trigger";
  taxonomy: string;
  triggerId: string;
  status: "matched" | "parse_failed" | "missing" | "skipped";
};

export type PlacementRecommendationEvent = PlacementForensicBaseEvent & {
  type: "recommendation_event";
  status: "selected" | "fallback" | "failed" | "skipped";
  recommendationCount: number;
  reason?: string;
};

export type PlacementForensicEvent =
  | PlacementSessionEvent
  | PlacementProviderEvent
  | PlacementRetryEvent
  | PlacementFallbackEvent
  | PlacementLatencyEvent
  | PlacementOrchestrationTransition
  | PlacementRecoverabilityEvent
  | PlacementDegradedResultEvent
  | PlacementFeatureFlagEvent
  | PlacementTaxonomyTriggerEvent
  | PlacementRecommendationEvent;

export type PlacementFailureTimelineStep = {
  sequence: number;
  occurredAt: string;
  type: PlacementForensicEventType;
  step: string;
  message: string;
  severity: PlacementForensicSeverity;
};

export type PlacementFailureTimeline = {
  sessionId: string;
  correlationId: string;
  startedAt: string | null;
  endedAt: string | null;
  eventCount: number;
  missingSequences: number[];
  providerSwitches: Array<{ atSequence: number; from: string; to: string; reason: string }>;
  retries: Array<{ atSequence: number; attempt: number; maxAttempts: number; reason: string }>;
  fallbacks: Array<{ atSequence: number; from: string; to: string; reason: string }>;
  recoverability: PlacementRecoverabilityState;
  degraded: boolean;
  deterministic: boolean | "unknown";
  inconsistentRetries: string[];
  orchestrationDeadEnds: string[];
  steps: PlacementFailureTimelineStep[];
};

export type PlacementRuntimeAlert = {
  id: string;
  sessionId?: string;
  correlationId?: string;
  severity: "warn" | "error" | "fatal";
  alertType:
    | "latency_spike"
    | "provider_switch"
    | "retry_exhaustion"
    | "orchestration_dead_end"
    | "taxonomy_anomaly"
    | "unrecoverable_failure"
    | string;
  message: string;
  createdAt: string;
};

export function isPlacementForensicEventType(
  value: unknown,
): value is PlacementForensicEventType {
  return (
    typeof value === "string" &&
    (PLACEMENT_FORENSIC_EVENT_TYPES as readonly string[]).includes(value)
  );
}

export function isPlacementRecoverabilityState(
  value: unknown,
): value is PlacementRecoverabilityState {
  return (
    typeof value === "string" &&
    (PLACEMENT_RECOVERABILITY_STATES as readonly string[]).includes(value)
  );
}

export function sortPlacementEvents(
  events: PlacementForensicEvent[],
): PlacementForensicEvent[] {
  return [...events].sort((a, b) => {
    if (a.sequence !== b.sequence) return a.sequence - b.sequence;
    return Date.parse(a.occurredAt) - Date.parse(b.occurredAt);
  });
}
