export type PlacementV4ProviderCapability =
  | "speaking"
  | "grading"
  | "translation"
  | "tutoring"
  | "pronunciation"
  | "lesson_generation";

export type PlacementV4BoundaryMode = "local" | "validation" | "staging" | "production";
export type PlacementV4ProviderTrustTier = "mock" | "validation_candidate" | "live_only" | "unknown";
export type PlacementV4Region = "us" | "ca" | "eu" | "global";
export type PlacementV4PrivacyTier = "standard" | "restricted";
export type PlacementV4Modality = "text" | "audio" | "phoneme" | "score" | "lesson_plan";
export type PlacementV4CostUnit = "request" | "audio_second" | "token" | "lesson";
export type PlacementV4ProviderHealthStatus = "healthy" | "degraded" | "failing" | "unknown";
export type PlacementV4EndpointKind = "mock" | "validation" | "production";

export type PlacementV4FailoverReason =
  | "primary_selected"
  | "fallback_selected"
  | "validation_boundary_blocked"
  | "capability_mismatch"
  | "provider_unhealthy"
  | "provider_health_stale"
  | "provider_flapping"
  | "provider_quarantined"
  | "provider_inconsistent"
  | "cost_ceiling_exceeded"
  | "latency_ceiling_exceeded"
  | "privacy_tier_mismatch"
  | "region_mismatch"
  | "retention_policy_mismatch"
  | "logging_policy_mismatch"
  | "trust_tier_blocked"
  | "live_provider_not_approved"
  | "production_endpoint_blocked"
  | "trust_score_below_floor"
  | "no_provider_available";

export type PlacementV4FailureClass =
  | "auth"
  | "timeout"
  | "quota"
  | "provider"
  | "validation_boundary"
  | "privacy"
  | "cost"
  | "consistency"
  | "unknown";

export type PlacementV4ConsistencyReason =
  | "agreement"
  | "soft_disagreement"
  | "hard_contradiction"
  | "missing_output"
  | "malformed_output"
  | "confidence_mismatch"
  | "provider_self_inconsistency";

export interface PlacementV4CapabilityDescriptor {
  capability: PlacementV4ProviderCapability;
  label: string;
  defaultCostUnit: PlacementV4CostUnit;
  defaultMaxCostCents: number;
  minimumTrustScore: number;
  maxHealthAgeMs: number;
  maxP95LatencyMs: number;
  failoverAllowed: boolean;
  humanReviewTrustFloor: number;
}

export interface PlacementV4ProviderIdentity {
  providerId: string;
  displayName: string;
  organization: string;
  trustTier: PlacementV4ProviderTrustTier;
  endpointKind: PlacementV4EndpointKind;
  endpointHost: string;
}

export interface PlacementV4ModelDescriptor {
  capability: PlacementV4ProviderCapability;
  modelFamily: string;
  modelVersion: string;
  deterministic: boolean;
}

export interface PlacementV4CapabilitySupport {
  capability: PlacementV4ProviderCapability;
  liveOnly: boolean;
  inputModalities: readonly PlacementV4Modality[];
  outputModalities: readonly PlacementV4Modality[];
  deterministic: boolean;
}

export interface PlacementV4CostPolicy {
  unit: PlacementV4CostUnit;
  centsPerUnit: number;
  maxUnitsPerRequest: number;
}

export interface PlacementV4RetentionPolicy {
  storesLearnerContent: boolean;
  retentionDays: number;
  logsPrompts: boolean;
  logsOutputs: boolean;
}

export interface PlacementV4ProviderDescriptor {
  identity: PlacementV4ProviderIdentity;
  capabilities: readonly PlacementV4CapabilitySupport[];
  models: readonly PlacementV4ModelDescriptor[];
  regions: readonly PlacementV4Region[];
  dataResidency: {
    processingRegions: readonly PlacementV4Region[];
    storageRegions: readonly PlacementV4Region[];
  };
  latencyBudgetMsByCapability: Partial<Record<PlacementV4ProviderCapability, number>>;
  costByCapability: Partial<Record<PlacementV4ProviderCapability, PlacementV4CostPolicy>>;
  privacyTier: PlacementV4PrivacyTier;
  retention: PlacementV4RetentionPolicy;
  priority: number;
  baseTrustScore: number;
  validation: {
    allowedBoundaryModes: readonly PlacementV4BoundaryMode[];
    requiresRuntimeApproval: boolean;
    requiresSupabaseApproval: boolean;
    requiresValidationEnvMarker: boolean;
    requiresLiveValidationApproval: boolean;
  };
}

export interface PlacementV4ProviderHealthSnapshot {
  providerId: string;
  observedAtMs: number;
  status: PlacementV4ProviderHealthStatus;
  errorRate: number;
  p95LatencyMs: number;
  authFailureRate: number;
  timeoutRate: number;
  quotaRemaining: number;
  quarantineUntilMs?: number;
  consecutiveFailures: number;
  lastFailureReason?: PlacementV4FailoverReason;
  inconsistentWithProviderIds?: readonly string[];
}

export interface PlacementV4ValidationBoundary {
  mode: PlacementV4BoundaryMode;
  runtimeApproved: boolean;
  supabaseApproved: boolean;
  validationEnvMarkerPresent: boolean;
  liveValidationApproved: boolean;
  placementV4GloballyEnabled: boolean;
  mockProvidersOnly: boolean;
  requestedRegion: PlacementV4Region;
  learnerPrivacyTier: PlacementV4PrivacyTier;
}

export interface PlacementV4ProviderSelectionRequest {
  capability: PlacementV4ProviderCapability;
  nowMs: number;
  estimatedUnits: number;
  boundary: PlacementV4ValidationBoundary;
  providers?: readonly PlacementV4ProviderDescriptor[];
  healthByProviderId?: Readonly<Record<string, PlacementV4ProviderHealthSnapshot | undefined>>;
  inconsistentProviderIds?: readonly string[];
  requiredInputModalities?: readonly PlacementV4Modality[];
  requiredOutputModalities?: readonly PlacementV4Modality[];
  maxCostCents?: number;
  minimumTrustScore?: number;
  maxHealthAgeMs?: number;
  requiredRegion?: PlacementV4Region;
  requiredPrivacyTier?: PlacementV4PrivacyTier;
}

export interface PlacementV4BoundaryDecision {
  allowed: boolean;
  reasons: readonly PlacementV4FailoverReason[];
}

export interface PlacementV4TrustScoreComponents {
  base: number;
  healthPenalty: number;
  latencyPenalty: number;
  authPenalty: number;
  timeoutPenalty: number;
  quotaPenalty: number;
  consistencyPenalty: number;
  total: number;
}

export interface PlacementV4CostEstimate {
  unit: PlacementV4CostUnit;
  units: number;
  centsPerUnit: number;
  estimatedCostCents: number;
  ceilingCents: number;
}

export interface PlacementV4RejectedCandidate {
  providerId: string;
  reasons: readonly PlacementV4FailoverReason[];
  failureClass: PlacementV4FailureClass;
  trustScore: PlacementV4TrustScoreComponents;
  costEstimate?: PlacementV4CostEstimate;
  validationBoundaryDecision: PlacementV4BoundaryDecision;
  humanReviewRequired: boolean;
}

export interface PlacementV4ProviderSelection {
  status: "selected" | "blocked";
  capability: PlacementV4ProviderCapability;
  selectedProvider?: PlacementV4ProviderDescriptor;
  selectedProviderId?: string;
  rejectedCandidates: readonly PlacementV4RejectedCandidate[];
  exactRejectionReasons: readonly PlacementV4FailoverReason[];
  trustScoreComponents?: PlacementV4TrustScoreComponents;
  costEstimate?: PlacementV4CostEstimate;
  validationBoundaryDecision: PlacementV4BoundaryDecision;
  failover: {
    primaryProviderId?: string;
    selectedProviderId?: string;
    selectedReason?: PlacementV4FailoverReason;
    fallbackChangesTrustLevel: boolean;
    requiresHumanReview: boolean;
    explanation: readonly string[];
  };
  decisionRecord: PlacementV4ProviderDecisionRecord;
}

export interface PlacementV4ProviderDecisionRecord {
  schemaVersion: "placement-v4-provider-decision@1";
  capability: PlacementV4ProviderCapability;
  status: "selected" | "blocked";
  selectedProviderId: string | null;
  requestedRegion: PlacementV4Region;
  learnerPrivacyTier: PlacementV4PrivacyTier;
  boundary: {
    mode: PlacementV4BoundaryMode;
    allowed: boolean;
    reasons: readonly PlacementV4FailoverReason[];
  };
  costEstimate: PlacementV4CostEstimate | null;
  trustScore: PlacementV4TrustScoreComponents | null;
  rejectedCandidates: readonly {
    providerId: string;
    reasons: readonly PlacementV4FailoverReason[];
    failureClass: PlacementV4FailureClass;
    trustScoreTotal: number;
    humanReviewRequired: boolean;
  }[];
  failover: PlacementV4ProviderSelection["failover"];
}

export interface PlacementV4ProviderOutput {
  providerId: string;
  outputId: string;
  normalizedValue?: string | number | boolean | null;
  confidence?: number;
  malformed?: boolean;
  selfInconsistent?: boolean;
  missing?: boolean;
}

export interface PlacementV4ConsistencyAdjudication {
  reason: PlacementV4ConsistencyReason;
  acceptedOutput?: PlacementV4ProviderOutput;
  rejectedOutputs: readonly PlacementV4ProviderOutput[];
  humanReviewRequired: boolean;
  learnerVisibleAllowed: boolean;
}

const REDACTED = "[REDACTED]";
const SECRET_KEY_PATTERN = /(secret|token|key|credential|authorization|password|apikey|api_key|bearer)/i;
const SECRET_VALUE_PATTERN = /(sk-[a-z0-9_-]{8,}|eyJ[a-zA-Z0-9_-]{8,}|bearer\s+[a-z0-9._-]{8,}|service_role|azure.{0,8}key)/i;

export const PLACEMENT_V4_CAPABILITY_DESCRIPTORS: Record<
  PlacementV4ProviderCapability,
  PlacementV4CapabilityDescriptor
> = {
  speaking: {
    capability: "speaking",
    label: "Speaking",
    defaultCostUnit: "audio_second",
    defaultMaxCostCents: 20,
    minimumTrustScore: 70,
    maxHealthAgeMs: 60_000,
    maxP95LatencyMs: 1_800,
    failoverAllowed: true,
    humanReviewTrustFloor: 80,
  },
  grading: {
    capability: "grading",
    label: "Grading",
    defaultCostUnit: "request",
    defaultMaxCostCents: 15,
    minimumTrustScore: 75,
    maxHealthAgeMs: 60_000,
    maxP95LatencyMs: 1_500,
    failoverAllowed: true,
    humanReviewTrustFloor: 84,
  },
  translation: {
    capability: "translation",
    label: "Translation",
    defaultCostUnit: "token",
    defaultMaxCostCents: 12,
    minimumTrustScore: 70,
    maxHealthAgeMs: 60_000,
    maxP95LatencyMs: 1_200,
    failoverAllowed: true,
    humanReviewTrustFloor: 78,
  },
  tutoring: {
    capability: "tutoring",
    label: "Tutoring",
    defaultCostUnit: "request",
    defaultMaxCostCents: 25,
    minimumTrustScore: 78,
    maxHealthAgeMs: 60_000,
    maxP95LatencyMs: 1_800,
    failoverAllowed: true,
    humanReviewTrustFloor: 86,
  },
  pronunciation: {
    capability: "pronunciation",
    label: "Pronunciation",
    defaultCostUnit: "audio_second",
    defaultMaxCostCents: 18,
    minimumTrustScore: 72,
    maxHealthAgeMs: 60_000,
    maxP95LatencyMs: 1_600,
    failoverAllowed: true,
    humanReviewTrustFloor: 82,
  },
  lesson_generation: {
    capability: "lesson_generation",
    label: "Lesson generation",
    defaultCostUnit: "lesson",
    defaultMaxCostCents: 30,
    minimumTrustScore: 80,
    maxHealthAgeMs: 60_000,
    maxP95LatencyMs: 2_400,
    failoverAllowed: false,
    humanReviewTrustFloor: 88,
  },
};

export const PLACEMENT_V4_PROVIDER_POLICY_MATRIX: {
  allowedCapabilitiesByEnvironment: Record<PlacementV4BoundaryMode, readonly PlacementV4ProviderCapability[]>;
  allowedProviderTrustTiers: Record<PlacementV4BoundaryMode, readonly PlacementV4ProviderTrustTier[]>;
  allowedRegions: readonly PlacementV4Region[];
  maxCostCentsByCapability: Record<PlacementV4ProviderCapability, number>;
  maxP95LatencyMsByCapability: Record<PlacementV4ProviderCapability, number>;
  privacyRetentionRules: Record<
    PlacementV4PrivacyTier,
    {
      maxRetentionDays: number;
      allowPromptLogging: boolean;
      allowOutputLogging: boolean;
    }
  >;
  failoverAllowedByCapability: Record<PlacementV4ProviderCapability, boolean>;
  humanReviewTrustFloorByCapability: Record<PlacementV4ProviderCapability, number>;
} = {
  allowedCapabilitiesByEnvironment: {
    local: ["speaking", "grading", "translation", "tutoring", "pronunciation", "lesson_generation"],
    validation: ["speaking", "grading", "translation", "tutoring", "pronunciation", "lesson_generation"],
    staging: [],
    production: [],
  },
  allowedProviderTrustTiers: {
    local: ["mock"],
    validation: ["mock", "validation_candidate"],
    staging: [],
    production: [],
  },
  allowedRegions: ["us", "ca", "eu", "global"],
  maxCostCentsByCapability: Object.fromEntries(
    Object.entries(PLACEMENT_V4_CAPABILITY_DESCRIPTORS).map(([capability, descriptor]) => [
      capability,
      descriptor.defaultMaxCostCents,
    ]),
  ) as Record<PlacementV4ProviderCapability, number>,
  maxP95LatencyMsByCapability: Object.fromEntries(
    Object.entries(PLACEMENT_V4_CAPABILITY_DESCRIPTORS).map(([capability, descriptor]) => [
      capability,
      descriptor.maxP95LatencyMs,
    ]),
  ) as Record<PlacementV4ProviderCapability, number>,
  privacyRetentionRules: {
    standard: { maxRetentionDays: 7, allowPromptLogging: false, allowOutputLogging: false },
    restricted: { maxRetentionDays: 0, allowPromptLogging: false, allowOutputLogging: false },
  },
  failoverAllowedByCapability: Object.fromEntries(
    Object.entries(PLACEMENT_V4_CAPABILITY_DESCRIPTORS).map(([capability, descriptor]) => [
      capability,
      descriptor.failoverAllowed,
    ]),
  ) as Record<PlacementV4ProviderCapability, boolean>,
  humanReviewTrustFloorByCapability: Object.fromEntries(
    Object.entries(PLACEMENT_V4_CAPABILITY_DESCRIPTORS).map(([capability, descriptor]) => [
      capability,
      descriptor.humanReviewTrustFloor,
    ]),
  ) as Record<PlacementV4ProviderCapability, number>,
};

const support = (
  capability: PlacementV4ProviderCapability,
  inputModalities: readonly PlacementV4Modality[],
  outputModalities: readonly PlacementV4Modality[],
): PlacementV4CapabilitySupport => ({
  capability,
  liveOnly: false,
  inputModalities,
  outputModalities,
  deterministic: true,
});

const model = (
  capability: PlacementV4ProviderCapability,
  version: string,
): PlacementV4ModelDescriptor => ({
  capability,
  modelFamily: `mock-${capability}`,
  modelVersion: version,
  deterministic: true,
});

const defaultValidation = {
  allowedBoundaryModes: ["local", "validation"] as const,
  requiresRuntimeApproval: true,
  requiresSupabaseApproval: true,
  requiresValidationEnvMarker: true,
  requiresLiveValidationApproval: false,
};

export const PLACEMENT_V4_MOCK_PROVIDERS: readonly PlacementV4ProviderDescriptor[] = [
  {
    identity: {
      providerId: "mock-grading-primary",
      displayName: "Mock grading primary",
      organization: "MercyB validation",
      trustTier: "mock",
      endpointKind: "mock",
      endpointHost: "mock.local",
    },
    capabilities: [
      support("grading", ["text"], ["score", "text"]),
      support("tutoring", ["text"], ["text"]),
    ],
    models: [model("grading", "2026-05-20"), model("tutoring", "2026-05-20")],
    regions: ["us", "ca"],
    dataResidency: { processingRegions: ["us", "ca"], storageRegions: ["us", "ca"] },
    latencyBudgetMsByCapability: { grading: 1_200, tutoring: 1_700 },
    costByCapability: {
      grading: { unit: "request", centsPerUnit: 8, maxUnitsPerRequest: 1 },
      tutoring: { unit: "request", centsPerUnit: 18, maxUnitsPerRequest: 1 },
    },
    privacyTier: "restricted",
    retention: { storesLearnerContent: false, retentionDays: 0, logsPrompts: false, logsOutputs: false },
    priority: 10,
    baseTrustScore: 94,
    validation: defaultValidation,
  },
  {
    identity: {
      providerId: "mock-speech-primary",
      displayName: "Mock speech primary",
      organization: "MercyB validation",
      trustTier: "mock",
      endpointKind: "mock",
      endpointHost: "mock.local",
    },
    capabilities: [
      support("speaking", ["audio"], ["score", "text"]),
      support("pronunciation", ["audio"], ["phoneme", "score"]),
    ],
    models: [model("speaking", "2026-05-20"), model("pronunciation", "2026-05-20")],
    regions: ["us", "ca"],
    dataResidency: { processingRegions: ["us", "ca"], storageRegions: ["us", "ca"] },
    latencyBudgetMsByCapability: { speaking: 1_400, pronunciation: 1_300 },
    costByCapability: {
      speaking: { unit: "audio_second", centsPerUnit: 1, maxUnitsPerRequest: 14 },
      pronunciation: { unit: "audio_second", centsPerUnit: 1, maxUnitsPerRequest: 12 },
    },
    privacyTier: "restricted",
    retention: { storesLearnerContent: false, retentionDays: 0, logsPrompts: false, logsOutputs: false },
    priority: 10,
    baseTrustScore: 93,
    validation: defaultValidation,
  },
  {
    identity: {
      providerId: "mock-language-primary",
      displayName: "Mock language primary",
      organization: "MercyB validation",
      trustTier: "mock",
      endpointKind: "mock",
      endpointHost: "mock.local",
    },
    capabilities: [
      support("translation", ["text"], ["text"]),
      support("tutoring", ["text"], ["text"]),
    ],
    models: [model("translation", "2026-05-20"), model("tutoring", "2026-05-20")],
    regions: ["us", "eu"],
    dataResidency: { processingRegions: ["us", "eu"], storageRegions: ["us", "eu"] },
    latencyBudgetMsByCapability: { translation: 900, tutoring: 1_600 },
    costByCapability: {
      translation: { unit: "token", centsPerUnit: 1, maxUnitsPerRequest: 8 },
      tutoring: { unit: "request", centsPerUnit: 20, maxUnitsPerRequest: 1 },
    },
    privacyTier: "standard",
    retention: { storesLearnerContent: false, retentionDays: 3, logsPrompts: false, logsOutputs: false },
    priority: 20,
    baseTrustScore: 90,
    validation: defaultValidation,
  },
  {
    identity: {
      providerId: "mock-lesson-primary",
      displayName: "Mock lesson primary",
      organization: "MercyB validation",
      trustTier: "mock",
      endpointKind: "mock",
      endpointHost: "mock.local",
    },
    capabilities: [
      support("lesson_generation", ["text"], ["lesson_plan"]),
      support("tutoring", ["text"], ["text"]),
    ],
    models: [model("lesson_generation", "2026-05-20"), model("tutoring", "2026-05-20")],
    regions: ["us", "ca"],
    dataResidency: { processingRegions: ["us", "ca"], storageRegions: ["us", "ca"] },
    latencyBudgetMsByCapability: { lesson_generation: 2_200, tutoring: 1_700 },
    costByCapability: {
      lesson_generation: { unit: "lesson", centsPerUnit: 24, maxUnitsPerRequest: 1 },
      tutoring: { unit: "request", centsPerUnit: 22, maxUnitsPerRequest: 1 },
    },
    privacyTier: "restricted",
    retention: { storesLearnerContent: false, retentionDays: 0, logsPrompts: false, logsOutputs: false },
    priority: 15,
    baseTrustScore: 92,
    validation: defaultValidation,
  },
  {
    identity: {
      providerId: "mock-speech-secondary",
      displayName: "Mock speech secondary",
      organization: "MercyB validation",
      trustTier: "mock",
      endpointKind: "mock",
      endpointHost: "mock.local",
    },
    capabilities: [
      support("speaking", ["audio"], ["score", "text"]),
      support("pronunciation", ["audio"], ["phoneme", "score"]),
    ],
    models: [model("speaking", "2026-05-20"), model("pronunciation", "2026-05-20")],
    regions: ["us", "ca", "eu"],
    dataResidency: { processingRegions: ["us", "ca", "eu"], storageRegions: ["us", "ca", "eu"] },
    latencyBudgetMsByCapability: { speaking: 1_500, pronunciation: 1_450 },
    costByCapability: {
      speaking: { unit: "audio_second", centsPerUnit: 1, maxUnitsPerRequest: 13 },
      pronunciation: { unit: "audio_second", centsPerUnit: 1, maxUnitsPerRequest: 11 },
    },
    privacyTier: "restricted",
    retention: { storesLearnerContent: false, retentionDays: 0, logsPrompts: false, logsOutputs: false },
    priority: 30,
    baseTrustScore: 88,
    validation: defaultValidation,
  },
];

export const createPlacementV4Boundary = (
  overrides: Partial<PlacementV4ValidationBoundary> = {},
): PlacementV4ValidationBoundary => ({
  mode: "validation",
  runtimeApproved: true,
  supabaseApproved: true,
  validationEnvMarkerPresent: true,
  liveValidationApproved: false,
  placementV4GloballyEnabled: false,
  mockProvidersOnly: true,
  requestedRegion: "us",
  learnerPrivacyTier: "restricted",
  ...overrides,
});

export const normalizePlacementV4HealthSnapshot = (
  providerId: string,
  snapshot: Partial<PlacementV4ProviderHealthSnapshot> | undefined,
  nowMs: number,
): PlacementV4ProviderHealthSnapshot => ({
  providerId,
  observedAtMs: snapshot?.observedAtMs ?? nowMs,
  status: snapshot?.status ?? "unknown",
  errorRate: clampRate(snapshot?.errorRate ?? 0),
  p95LatencyMs: Math.max(0, Math.round(snapshot?.p95LatencyMs ?? 0)),
  authFailureRate: clampRate(snapshot?.authFailureRate ?? 0),
  timeoutRate: clampRate(snapshot?.timeoutRate ?? 0),
  quotaRemaining: Math.max(0, Math.round(snapshot?.quotaRemaining ?? 0)),
  quarantineUntilMs: snapshot?.quarantineUntilMs,
  consecutiveFailures: Math.max(0, Math.round(snapshot?.consecutiveFailures ?? 0)),
  lastFailureReason: snapshot?.lastFailureReason,
  inconsistentWithProviderIds: [...(snapshot?.inconsistentWithProviderIds ?? [])].sort(),
});

export const quarantinePlacementV4Provider = (
  health: PlacementV4ProviderHealthSnapshot,
  nowMs: number,
  durationMs: number,
  reason: PlacementV4FailoverReason = "provider_flapping",
): PlacementV4ProviderHealthSnapshot =>
  normalizePlacementV4HealthSnapshot(
    health.providerId,
    {
      ...health,
      status: "failing",
      consecutiveFailures: Math.max(health.consecutiveFailures, 1),
      quarantineUntilMs: nowMs + Math.max(0, durationMs),
      lastFailureReason: reason,
    },
    nowMs,
  );

export const calculatePlacementV4QuarantineUntil = (
  nowMs: number,
  consecutiveFailures: number,
): number => nowMs + Math.min(15 * 60_000, Math.max(1, consecutiveFailures) * 60_000);

const clampRate = (rate: number): number => Math.max(0, Math.min(1, Number(rate.toFixed(4))));
const clampTrustScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

const providerId = (provider: PlacementV4ProviderDescriptor): string => provider.identity.providerId;

const capabilitySupportFor = (
  provider: PlacementV4ProviderDescriptor,
  capability: PlacementV4ProviderCapability,
): PlacementV4CapabilitySupport | undefined =>
  provider.capabilities.find((candidate) => candidate.capability === capability);

const costEstimateFor = (
  provider: PlacementV4ProviderDescriptor,
  request: PlacementV4ProviderSelectionRequest,
): PlacementV4CostEstimate | undefined => {
  const capabilityDescriptor = PLACEMENT_V4_CAPABILITY_DESCRIPTORS[request.capability];
  const costPolicy = provider.costByCapability[request.capability];

  if (!costPolicy) {
    return undefined;
  }

  const units = Math.max(0, request.estimatedUnits);
  const providerCeiling = costPolicy.centsPerUnit * costPolicy.maxUnitsPerRequest;
  const ceilingCents = Math.min(
    request.maxCostCents ?? capabilityDescriptor.defaultMaxCostCents,
    providerCeiling,
    PLACEMENT_V4_PROVIDER_POLICY_MATRIX.maxCostCentsByCapability[request.capability],
  );

  return {
    unit: costPolicy.unit,
    units,
    centsPerUnit: costPolicy.centsPerUnit,
    estimatedCostCents: Math.round(units * costPolicy.centsPerUnit),
    ceilingCents,
  };
};

const boundaryDecisionFor = (
  provider: PlacementV4ProviderDescriptor,
  request: PlacementV4ProviderSelectionRequest,
): PlacementV4BoundaryDecision => {
  const reasons: PlacementV4FailoverReason[] = [];
  const allowedCapabilities =
    PLACEMENT_V4_PROVIDER_POLICY_MATRIX.allowedCapabilitiesByEnvironment[request.boundary.mode];
  const allowedTrustTiers =
    PLACEMENT_V4_PROVIDER_POLICY_MATRIX.allowedProviderTrustTiers[request.boundary.mode];
  const support = capabilitySupportFor(provider, request.capability);

  if (request.boundary.placementV4GloballyEnabled) {
    reasons.push("validation_boundary_blocked");
  }
  if (request.boundary.mode === "production") {
    reasons.push("validation_boundary_blocked");
  }
  if (!request.boundary.runtimeApproved && provider.validation.requiresRuntimeApproval) {
    reasons.push("validation_boundary_blocked");
  }
  if (!request.boundary.supabaseApproved && provider.validation.requiresSupabaseApproval) {
    reasons.push("validation_boundary_blocked");
  }
  if (!request.boundary.validationEnvMarkerPresent && provider.validation.requiresValidationEnvMarker) {
    reasons.push("validation_boundary_blocked");
  }
  if (!provider.validation.allowedBoundaryModes.includes(request.boundary.mode)) {
    reasons.push("validation_boundary_blocked");
  }
  if (!allowedCapabilities.includes(request.capability)) {
    reasons.push("validation_boundary_blocked");
  }
  if (!allowedTrustTiers.includes(provider.identity.trustTier)) {
    reasons.push("trust_tier_blocked");
  }
  if (provider.identity.trustTier === "unknown") {
    reasons.push("trust_tier_blocked");
  }
  if (request.boundary.mockProvidersOnly && provider.identity.trustTier !== "mock") {
    reasons.push("trust_tier_blocked");
  }
  if (support?.liveOnly && !request.boundary.liveValidationApproved) {
    reasons.push("live_provider_not_approved");
  }
  if (provider.validation.requiresLiveValidationApproval && !request.boundary.liveValidationApproved) {
    reasons.push("live_provider_not_approved");
  }
  if (provider.identity.endpointKind === "production") {
    reasons.push("production_endpoint_blocked");
  }

  return { allowed: reasons.length === 0, reasons: uniqueSorted(reasons) };
};

const trustScoreFor = (
  provider: PlacementV4ProviderDescriptor,
  health: PlacementV4ProviderHealthSnapshot,
  request: PlacementV4ProviderSelectionRequest,
): PlacementV4TrustScoreComponents => {
  const latencyBudget =
    provider.latencyBudgetMsByCapability[request.capability] ??
    PLACEMENT_V4_CAPABILITY_DESCRIPTORS[request.capability].maxP95LatencyMs;
  const healthPenalty =
    health.status === "healthy" ? 0 : health.status === "degraded" ? 18 : health.status === "failing" ? 50 : 35;
  const latencyPenalty =
    health.p95LatencyMs > latencyBudget ? Math.min(25, Math.ceil((health.p95LatencyMs - latencyBudget) / 100)) : 0;
  const authPenalty = Math.ceil(health.authFailureRate * 40);
  const timeoutPenalty = Math.ceil(health.timeoutRate * 30);
  const quotaPenalty = health.quotaRemaining <= 0 ? 30 : health.quotaRemaining < 5 ? 12 : 0;
  const consistencyPenalty =
    request.inconsistentProviderIds?.includes(providerId(provider)) ||
    (health.inconsistentWithProviderIds?.length ?? 0) > 0
      ? 50
      : 0;
  const total = clampTrustScore(
    provider.baseTrustScore -
      healthPenalty -
      latencyPenalty -
      authPenalty -
      timeoutPenalty -
      quotaPenalty -
      consistencyPenalty,
  );

  return {
    base: provider.baseTrustScore,
    healthPenalty,
    latencyPenalty,
    authPenalty,
    timeoutPenalty,
    quotaPenalty,
    consistencyPenalty,
    total,
  };
};

const rejectionReasonsFor = (
  provider: PlacementV4ProviderDescriptor,
  health: PlacementV4ProviderHealthSnapshot,
  request: PlacementV4ProviderSelectionRequest,
  boundaryDecision: PlacementV4BoundaryDecision,
  trustScore: PlacementV4TrustScoreComponents,
  costEstimate: PlacementV4CostEstimate | undefined,
): PlacementV4FailoverReason[] => {
  const reasons: PlacementV4FailoverReason[] = [...boundaryDecision.reasons];
  const capabilityDescriptor = PLACEMENT_V4_CAPABILITY_DESCRIPTORS[request.capability];
  const support = capabilitySupportFor(provider, request.capability);
  const maxHealthAgeMs = request.maxHealthAgeMs ?? capabilityDescriptor.maxHealthAgeMs;
  const requiredRegion = request.requiredRegion ?? request.boundary.requestedRegion;
  const privacyTier = request.requiredPrivacyTier ?? request.boundary.learnerPrivacyTier;
  const retentionRule = PLACEMENT_V4_PROVIDER_POLICY_MATRIX.privacyRetentionRules[privacyTier];

  if (!support) {
    reasons.push("capability_mismatch");
  }
  if (request.requiredInputModalities?.some((modality) => !support?.inputModalities.includes(modality))) {
    reasons.push("capability_mismatch");
  }
  if (request.requiredOutputModalities?.some((modality) => !support?.outputModalities.includes(modality))) {
    reasons.push("capability_mismatch");
  }
  if (health.quarantineUntilMs && health.quarantineUntilMs > request.nowMs) {
    reasons.push("provider_quarantined");
  }
  if (request.nowMs - health.observedAtMs > maxHealthAgeMs) {
    reasons.push("provider_health_stale");
  }
  if (health.status === "failing") {
    reasons.push("provider_unhealthy");
  }
  if (health.consecutiveFailures >= 3 || health.errorRate >= 0.5 || health.timeoutRate >= 0.35) {
    reasons.push("provider_flapping");
  }
  if (
    request.inconsistentProviderIds?.includes(providerId(provider)) ||
    (health.inconsistentWithProviderIds?.length ?? 0) > 0
  ) {
    reasons.push("provider_inconsistent");
  }
  if (costEstimate && costEstimate.estimatedCostCents > costEstimate.ceilingCents) {
    reasons.push("cost_ceiling_exceeded");
  }
  if (health.p95LatencyMs > PLACEMENT_V4_PROVIDER_POLICY_MATRIX.maxP95LatencyMsByCapability[request.capability]) {
    reasons.push("latency_ceiling_exceeded");
  }
  if (!provider.regions.includes(requiredRegion) || !PLACEMENT_V4_PROVIDER_POLICY_MATRIX.allowedRegions.includes(requiredRegion)) {
    reasons.push("region_mismatch");
  }
  if (privacyTier === "restricted" && provider.privacyTier !== "restricted") {
    reasons.push("privacy_tier_mismatch");
  }
  if (
    provider.retention.retentionDays > retentionRule.maxRetentionDays ||
    provider.retention.storesLearnerContent
  ) {
    reasons.push("retention_policy_mismatch");
  }
  if (
    (provider.retention.logsPrompts && !retentionRule.allowPromptLogging) ||
    (provider.retention.logsOutputs && !retentionRule.allowOutputLogging)
  ) {
    reasons.push("logging_policy_mismatch");
  }
  if (trustScore.total < (request.minimumTrustScore ?? capabilityDescriptor.minimumTrustScore)) {
    reasons.push("trust_score_below_floor");
  }

  return uniqueSorted(reasons);
};

const failureClassFor = (reasons: readonly PlacementV4FailoverReason[]): PlacementV4FailureClass => {
  if (reasons.some((reason) => reason.includes("boundary") || reason.includes("production") || reason.includes("trust_tier") || reason.includes("live_provider"))) {
    return "validation_boundary";
  }
  if (reasons.some((reason) => reason.includes("privacy") || reason.includes("retention") || reason.includes("logging") || reason.includes("region"))) {
    return "privacy";
  }
  if (reasons.includes("cost_ceiling_exceeded")) {
    return "cost";
  }
  if (reasons.includes("provider_inconsistent")) {
    return "consistency";
  }
  if (reasons.some((reason) => reason.includes("health") || reason.includes("flapping") || reason.includes("quarantined") || reason.includes("unhealthy"))) {
    return "provider";
  }
  return "unknown";
};

const humanReviewRequiredFor = (
  capability: PlacementV4ProviderCapability,
  trustScoreTotal: number,
  reasons: readonly PlacementV4FailoverReason[],
): boolean =>
  trustScoreTotal < PLACEMENT_V4_CAPABILITY_DESCRIPTORS[capability].humanReviewTrustFloor ||
  reasons.some((reason) => reason === "provider_inconsistent" || reason === "fallback_selected");

export const selectPlacementV4Provider = (
  request: PlacementV4ProviderSelectionRequest,
): PlacementV4ProviderSelection => {
  const providers = [...(request.providers ?? PLACEMENT_V4_MOCK_PROVIDERS)].sort((a, b) =>
    a.priority - b.priority || providerId(a).localeCompare(providerId(b)),
  );
  const primaryProviderId = providers[0] ? providerId(providers[0]) : undefined;
  const rejectedCandidates: PlacementV4RejectedCandidate[] = [];
  const eligible: Array<{
    provider: PlacementV4ProviderDescriptor;
    health: PlacementV4ProviderHealthSnapshot;
    trustScore: PlacementV4TrustScoreComponents;
    costEstimate: PlacementV4CostEstimate;
    boundaryDecision: PlacementV4BoundaryDecision;
  }> = [];

  for (const provider of providers) {
    const id = providerId(provider);
    const health = normalizePlacementV4HealthSnapshot(id, request.healthByProviderId?.[id], request.nowMs);
    const costEstimate = costEstimateFor(provider, request);
    const boundaryDecision = boundaryDecisionFor(provider, request);
    const trustScore = trustScoreFor(provider, health, request);
    const reasons = rejectionReasonsFor(provider, health, request, boundaryDecision, trustScore, costEstimate);

    if (!costEstimate || reasons.length > 0) {
      rejectedCandidates.push({
        providerId: id,
        reasons: !costEstimate ? uniqueSorted([...reasons, "capability_mismatch"]) : reasons,
        failureClass: failureClassFor(!costEstimate ? [...reasons, "capability_mismatch"] : reasons),
        trustScore,
        costEstimate,
        validationBoundaryDecision: boundaryDecision,
        humanReviewRequired: humanReviewRequiredFor(request.capability, trustScore.total, reasons),
      });
      continue;
    }

    eligible.push({ provider, health, trustScore, costEstimate, boundaryDecision });
  }

  eligible.sort(
    (a, b) =>
      b.trustScore.total - a.trustScore.total ||
      a.provider.priority - b.provider.priority ||
      providerId(a.provider).localeCompare(providerId(b.provider)),
  );

  const selected = eligible[0];
  const selectedProviderId = selected ? providerId(selected.provider) : undefined;
  const selectedReason: PlacementV4FailoverReason | undefined =
    selectedProviderId && primaryProviderId && selectedProviderId !== primaryProviderId
      ? "fallback_selected"
      : selectedProviderId
        ? "primary_selected"
        : undefined;
  const fallbackChangesTrustLevel =
    Boolean(selected && primaryProviderId && selectedProviderId !== primaryProviderId) &&
    providers.find((provider) => providerId(provider) === primaryProviderId)?.identity.trustTier !==
      selected?.provider.identity.trustTier;
  const requiresHumanReview =
    Boolean(selected) &&
    (selectedReason === "fallback_selected" ||
      humanReviewRequiredFor(request.capability, selected.trustScore.total, []));
  const validationBoundaryDecision = selected?.boundaryDecision ?? {
    allowed: false,
    reasons: uniqueSorted(rejectedCandidates.flatMap((candidate) => candidate.validationBoundaryDecision.reasons)),
  };
  const exactRejectionReasons = uniqueSorted(
    selected ? rejectedCandidates.flatMap((candidate) => candidate.reasons) : [...rejectedCandidates.flatMap((candidate) => candidate.reasons), "no_provider_available"],
  );
  const failover: PlacementV4ProviderSelection["failover"] = {
    primaryProviderId,
    selectedProviderId,
    selectedReason,
    fallbackChangesTrustLevel,
    requiresHumanReview,
    explanation: [
      ...rejectedCandidates.map(
        (candidate) => `${candidate.providerId} rejected: ${candidate.reasons.join(", ")}`,
      ),
      selected
        ? `${selectedProviderId} ${selectedReason === "fallback_selected" ? "chosen as fallback" : "chosen as primary"} with trust ${selected.trustScore.total}`
        : "No provider remained eligible after policy evaluation",
    ],
  };

  const partialSelection = {
    status: selected ? "selected" as const : "blocked" as const,
    capability: request.capability,
    selectedProvider: selected?.provider,
    selectedProviderId,
    rejectedCandidates,
    exactRejectionReasons,
    trustScoreComponents: selected?.trustScore,
    costEstimate: selected?.costEstimate,
    validationBoundaryDecision,
    failover,
  };
  const decisionRecord = createProviderDecisionRecord(partialSelection, request);

  return { ...partialSelection, decisionRecord };
};

export const createProviderDecisionRecord = (
  selection: Omit<PlacementV4ProviderSelection, "decisionRecord">,
  request: PlacementV4ProviderSelectionRequest,
): PlacementV4ProviderDecisionRecord => ({
  schemaVersion: "placement-v4-provider-decision@1",
  capability: selection.capability,
  status: selection.status,
  selectedProviderId: selection.selectedProviderId ?? null,
  requestedRegion: request.requiredRegion ?? request.boundary.requestedRegion,
  learnerPrivacyTier: request.requiredPrivacyTier ?? request.boundary.learnerPrivacyTier,
  boundary: {
    mode: request.boundary.mode,
    allowed: selection.validationBoundaryDecision.allowed,
    reasons: [...selection.validationBoundaryDecision.reasons].sort(),
  },
  costEstimate: selection.costEstimate ?? null,
  trustScore: selection.trustScoreComponents ?? null,
  rejectedCandidates: [...selection.rejectedCandidates]
    .map((candidate) => ({
      providerId: candidate.providerId,
      reasons: [...candidate.reasons].sort(),
      failureClass: candidate.failureClass,
      trustScoreTotal: candidate.trustScore.total,
      humanReviewRequired: candidate.humanReviewRequired,
    }))
    .sort((a, b) => a.providerId.localeCompare(b.providerId)),
  failover: {
    ...selection.failover,
    explanation: [...selection.failover.explanation].sort(),
  },
});

export const hashProviderDecisionRecord = (record: PlacementV4ProviderDecisionRecord): string => {
  const canonical = canonicalJSONStringify(redactSecrets(record));
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;

  for (let index = 0; index < canonical.length; index += 1) {
    hash ^= BigInt(canonical.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * prime);
  }

  return hash.toString(16).padStart(16, "0");
};

export const serializeProviderDecisionRecord = (
  record: PlacementV4ProviderDecisionRecord,
): string => canonicalJSONStringify(redactSecrets(record));

export const adjudicatePlacementV4ProviderOutputs = (
  outputs: readonly PlacementV4ProviderOutput[],
): PlacementV4ConsistencyAdjudication => {
  const normalized = [...outputs].sort((a, b) => a.providerId.localeCompare(b.providerId));
  const rejectedOutputs: PlacementV4ProviderOutput[] = [];
  const malformed = normalized.filter((output) => output.malformed);
  const missing = normalized.filter((output) => output.missing || output.normalizedValue === undefined);
  const selfInconsistent = normalized.filter((output) => output.selfInconsistent);

  if (malformed.length > 0) {
    return consistencyResult("malformed_output", undefined, normalized, true, false);
  }
  if (missing.length > 0) {
    return consistencyResult("missing_output", undefined, normalized, true, false);
  }
  if (selfInconsistent.length > 0) {
    return consistencyResult("provider_self_inconsistency", undefined, normalized, true, false);
  }

  const values = new Map<string, PlacementV4ProviderOutput[]>();
  for (const output of normalized) {
    const key = String(output.normalizedValue);
    values.set(key, [...(values.get(key) ?? []), output]);
  }

  const confidenceValues = normalized
    .map((output) => output.confidence)
    .filter((confidence): confidence is number => typeof confidence === "number");
  const confidenceMismatch =
    confidenceValues.length > 1 && Math.max(...confidenceValues) - Math.min(...confidenceValues) > 0.4;

  if (confidenceMismatch) {
    return consistencyResult("confidence_mismatch", undefined, normalized, true, false);
  }

  if (values.size === 1) {
    return consistencyResult("agreement", normalized[0], rejectedOutputs, false, true);
  }

  const groups = [...values.values()].sort((a, b) => b.length - a.length || a[0].providerId.localeCompare(b[0].providerId));
  const topGroup = groups[0];

  if (topGroup.length > normalized.length / 2) {
    rejectedOutputs.push(...normalized.filter((output) => !topGroup.includes(output)));
    return consistencyResult("soft_disagreement", topGroup[0], rejectedOutputs, true, true);
  }

  return consistencyResult("hard_contradiction", undefined, normalized, true, false);
};

const consistencyResult = (
  reason: PlacementV4ConsistencyReason,
  acceptedOutput: PlacementV4ProviderOutput | undefined,
  rejectedOutputs: readonly PlacementV4ProviderOutput[],
  humanReviewRequired: boolean,
  learnerVisibleAllowed: boolean,
): PlacementV4ConsistencyAdjudication => ({
  reason,
  acceptedOutput,
  rejectedOutputs: [...rejectedOutputs].sort((a, b) => a.providerId.localeCompare(b.providerId)),
  humanReviewRequired,
  learnerVisibleAllowed,
});

const uniqueSorted = <T extends string>(values: readonly T[]): T[] => [...new Set(values)].sort();

const redactSecrets = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(redactSecrets);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, SECRET_KEY_PATTERN.test(key) ? REDACTED : redactSecrets(child)]),
    );
  }
  if (typeof value === "string" && SECRET_VALUE_PATTERN.test(value)) {
    return REDACTED;
  }
  return value;
};

const canonicalJSONStringify = (value: unknown): string => {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJSONStringify).join(",")}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries.map(([key, child]) => `${JSON.stringify(key)}:${canonicalJSONStringify(child)}`).join(",")}}`;
};
