import { describe, expect, it } from "vitest";
import {
  PLACEMENT_V4_MOCK_PROVIDERS,
  PLACEMENT_V4_PROVIDER_POLICY_MATRIX,
  PlacementV4ProviderDescriptor,
  PlacementV4ProviderHealthSnapshot,
  adjudicatePlacementV4ProviderOutputs,
  calculatePlacementV4QuarantineUntil,
  createPlacementV4Boundary,
  hashProviderDecisionRecord,
  normalizePlacementV4HealthSnapshot,
  quarantinePlacementV4Provider,
  selectPlacementV4Provider,
  serializeProviderDecisionRecord,
} from "../providerRegistry";

const nowMs = 1_800_000_000_000;

const provider = (providerId: string): PlacementV4ProviderDescriptor => {
  const found = PLACEMENT_V4_MOCK_PROVIDERS.find(
    (candidate) => candidate.identity.providerId === providerId,
  );
  if (!found) {
    throw new Error(`Missing test provider ${providerId}`);
  }
  return found;
};

const healthy = (providerId: string): PlacementV4ProviderHealthSnapshot => ({
  providerId,
  observedAtMs: nowMs,
  status: "healthy",
  errorRate: 0,
  p95LatencyMs: 100,
  authFailureRate: 0,
  timeoutRate: 0,
  quotaRemaining: 100,
  consecutiveFailures: 0,
});

const healthFor = (providers: readonly PlacementV4ProviderDescriptor[]) =>
  Object.fromEntries(providers.map((candidate) => [candidate.identity.providerId, healthy(candidate.identity.providerId)]));

const baseRequest = {
  nowMs,
  estimatedUnits: 1,
  boundary: createPlacementV4Boundary(),
};

const speechProviders = [
  provider("mock-speech-primary"),
  provider("mock-speech-secondary"),
];

const selectSpeaking = (
  overrides: Partial<Parameters<typeof selectPlacementV4Provider>[0]> = {},
) =>
  selectPlacementV4Provider({
    ...baseRequest,
    capability: "speaking",
    providers: speechProviders,
    healthByProviderId: healthFor(speechProviders),
    ...overrides,
  });

const withProvider = (
  base: PlacementV4ProviderDescriptor,
  override: Partial<PlacementV4ProviderDescriptor>,
): PlacementV4ProviderDescriptor => ({ ...base, ...override });

describe("Placement V4 provider contract", () => {
  it("selects a provider with an explainable decision record", () => {
    const result = selectSpeaking();

    expect(result.status).toBe("selected");
    expect(result.selectedProviderId).toBe("mock-speech-primary");
    expect(result.decisionRecord.selectedProviderId).toBe("mock-speech-primary");
    expect(result.validationBoundaryDecision.allowed).toBe(true);
  });

  it("returns cost estimates on selected providers", () => {
    const result = selectSpeaking({ estimatedUnits: 7 });

    expect(result.costEstimate).toMatchObject({
      unit: "audio_second",
      units: 7,
      estimatedCostCents: 7,
    });
  });

  it("returns trust score components on selected providers", () => {
    const result = selectSpeaking();

    expect(result.trustScoreComponents).toMatchObject({
      base: 93,
      healthPenalty: 0,
      total: 93,
    });
  });

  it("creates deterministic decision hashes for identical inputs", () => {
    const first = selectSpeaking();
    const second = selectSpeaking();

    expect(hashProviderDecisionRecord(first.decisionRecord)).toBe(
      hashProviderDecisionRecord(second.decisionRecord),
    );
  });

  it("keeps decision hashes independent of provider input order", () => {
    const first = selectSpeaking({ providers: speechProviders });
    const second = selectSpeaking({ providers: [...speechProviders].reverse() });

    expect(first.selectedProviderId).toBe(second.selectedProviderId);
    expect(hashProviderDecisionRecord(first.decisionRecord)).toBe(
      hashProviderDecisionRecord(second.decisionRecord),
    );
  });

  it("serializes decision records in canonical key order", () => {
    const serialized = serializeProviderDecisionRecord(selectSpeaking().decisionRecord);

    expect(serialized.indexOf('"boundary"')).toBeLessThan(serialized.indexOf('"capability"'));
    expect(serialized.indexOf('"capability"')).toBeLessThan(serialized.indexOf('"costEstimate"'));
  });

  it("redacts secret-like keys in decision serialization", () => {
    const record = {
      ...selectSpeaking().decisionRecord,
      apiKey: "sk-test-secret-value",
      nested: { authorization: "Bearer abcdefghijklmnop" },
    };
    const serialized = serializeProviderDecisionRecord(record);

    expect(serialized).toContain("[REDACTED]");
    expect(serialized).not.toContain("sk-test-secret-value");
    expect(serialized).not.toContain("Bearer abcdefghijklmnop");
  });

  it("preserves rejected candidates in decision records", () => {
    const result = selectSpeaking({
      healthByProviderId: {
        "mock-speech-primary": { ...healthy("mock-speech-primary"), status: "failing" },
        "mock-speech-secondary": healthy("mock-speech-secondary"),
      },
    });

    expect(result.decisionRecord.rejectedCandidates).toEqual([
      expect.objectContaining({ providerId: "mock-speech-primary" }),
    ]);
  });

  it("keeps failure reasons stable in rejected candidates", () => {
    const result = selectSpeaking({
      healthByProviderId: {
        "mock-speech-primary": { ...healthy("mock-speech-primary"), status: "failing" },
        "mock-speech-secondary": healthy("mock-speech-secondary"),
      },
    });

    expect(result.rejectedCandidates[0].reasons).toContain("provider_unhealthy");
  });

  it("rejects stale health snapshots", () => {
    const result = selectSpeaking({
      providers: [provider("mock-speech-primary")],
      healthByProviderId: {
        "mock-speech-primary": {
          ...healthy("mock-speech-primary"),
          observedAtMs: nowMs - 120_000,
        },
      },
    });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("provider_health_stale");
  });

  it("rejects active quarantine", () => {
    const result = selectSpeaking({
      providers: [provider("mock-speech-primary")],
      healthByProviderId: {
        "mock-speech-primary": quarantinePlacementV4Provider(
          healthy("mock-speech-primary"),
          nowMs,
          60_000,
        ),
      },
    });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("provider_quarantined");
  });

  it("allows recovery after quarantine expiry", () => {
    const result = selectSpeaking({
      providers: [provider("mock-speech-primary")],
      healthByProviderId: {
        "mock-speech-primary": {
          ...healthy("mock-speech-primary"),
          quarantineUntilMs: nowMs - 1,
        },
      },
    });

    expect(result.status).toBe("selected");
  });

  it("detects flapping by consecutive failures", () => {
    const result = selectSpeaking({
      providers: [provider("mock-speech-primary")],
      healthByProviderId: {
        "mock-speech-primary": {
          ...healthy("mock-speech-primary"),
          consecutiveFailures: 3,
        },
      },
    });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("provider_flapping");
  });

  it("calculates quarantine windows deterministically", () => {
    expect(calculatePlacementV4QuarantineUntil(nowMs, 3)).toBe(nowMs + 180_000);
  });

  it("normalizes health snapshots deterministically", () => {
    const snapshot = normalizePlacementV4HealthSnapshot(
      "mock-speech-primary",
      { errorRate: 5, timeoutRate: -1, quotaRemaining: -3, p95LatencyMs: 19.6 },
      nowMs,
    );

    expect(snapshot).toMatchObject({
      errorRate: 1,
      timeoutRate: 0,
      quotaRemaining: 0,
      p95LatencyMs: 20,
    });
  });

  it("refuses cost ceiling overages", () => {
    const result = selectPlacementV4Provider({
      ...baseRequest,
      capability: "lesson_generation",
      estimatedUnits: 2,
      providers: [provider("mock-lesson-primary")],
      healthByProviderId: { "mock-lesson-primary": healthy("mock-lesson-primary") },
    });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("cost_ceiling_exceeded");
  });

  it("refuses latency ceiling overages", () => {
    const result = selectSpeaking({
      providers: [provider("mock-speech-primary")],
      healthByProviderId: {
        "mock-speech-primary": {
          ...healthy("mock-speech-primary"),
          p95LatencyMs: 3_000,
        },
      },
    });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("latency_ceiling_exceeded");
  });

  it("rejects region mismatches", () => {
    const result = selectSpeaking({ requiredRegion: "eu", providers: [provider("mock-speech-primary")] });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("region_mismatch");
  });

  it("rejects privacy-tier mismatches", () => {
    const result = selectPlacementV4Provider({
      ...baseRequest,
      capability: "translation",
      providers: [provider("mock-language-primary")],
      healthByProviderId: { "mock-language-primary": healthy("mock-language-primary") },
      requiredPrivacyTier: "restricted",
    });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("privacy_tier_mismatch");
  });

  it("rejects retention policy mismatches", () => {
    const unsafe = withProvider(provider("mock-speech-primary"), {
      retention: {
        storesLearnerContent: true,
        retentionDays: 30,
        logsPrompts: false,
        logsOutputs: false,
      },
    });
    const result = selectSpeaking({ providers: [unsafe], healthByProviderId: { [unsafe.identity.providerId]: healthy(unsafe.identity.providerId) } });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("retention_policy_mismatch");
  });

  it("rejects logging policy mismatches", () => {
    const unsafe = withProvider(provider("mock-speech-primary"), {
      retention: {
        storesLearnerContent: false,
        retentionDays: 0,
        logsPrompts: true,
        logsOutputs: false,
      },
    });
    const result = selectSpeaking({ providers: [unsafe], healthByProviderId: { [unsafe.identity.providerId]: healthy(unsafe.identity.providerId) } });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("logging_policy_mismatch");
  });

  it("rejects capability mismatches", () => {
    const result = selectPlacementV4Provider({
      ...baseRequest,
      capability: "pronunciation",
      providers: [provider("mock-grading-primary")],
      healthByProviderId: { "mock-grading-primary": healthy("mock-grading-primary") },
    });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("capability_mismatch");
  });

  it("blocks live-only providers without live validation approval", () => {
    const liveOnly = withProvider(provider("mock-speech-primary"), {
      capabilities: [
        {
          ...provider("mock-speech-primary").capabilities[0],
          liveOnly: true,
        },
      ],
    });
    const result = selectSpeaking({ providers: [liveOnly], healthByProviderId: { [liveOnly.identity.providerId]: healthy(liveOnly.identity.providerId) } });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("live_provider_not_approved");
  });

  it("refuses production runtime mode", () => {
    const result = selectSpeaking({ boundary: createPlacementV4Boundary({ mode: "production" }) });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("validation_boundary_blocked");
  });

  it("refuses missing validation markers", () => {
    const result = selectSpeaking({
      boundary: createPlacementV4Boundary({ validationEnvMarkerPresent: false }),
    });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("validation_boundary_blocked");
  });

  it("refuses production provider endpoints", () => {
    const productionEndpoint = withProvider(provider("mock-speech-primary"), {
      identity: {
        ...provider("mock-speech-primary").identity,
        endpointKind: "production",
        endpointHost: "api.production.example",
      },
    });
    const result = selectSpeaking({
      providers: [productionEndpoint],
      healthByProviderId: { [productionEndpoint.identity.providerId]: healthy(productionEndpoint.identity.providerId) },
    });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("production_endpoint_blocked");
  });

  it("refuses unknown trust tiers", () => {
    const unknown = withProvider(provider("mock-speech-primary"), {
      identity: {
        ...provider("mock-speech-primary").identity,
        trustTier: "unknown",
      },
    });
    const result = selectSpeaking({
      providers: [unknown],
      healthByProviderId: { [unknown.identity.providerId]: healthy(unknown.identity.providerId) },
    });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("trust_tier_blocked");
  });

  it("explains failover from an unhealthy primary to fallback", () => {
    const result = selectSpeaking({
      healthByProviderId: {
        "mock-speech-primary": { ...healthy("mock-speech-primary"), status: "failing" },
        "mock-speech-secondary": healthy("mock-speech-secondary"),
      },
    });

    expect(result.status).toBe("selected");
    expect(result.selectedProviderId).toBe("mock-speech-secondary");
    expect(result.failover.explanation.join("\n")).toContain("mock-speech-primary rejected");
    expect(result.failover.selectedReason).toBe("fallback_selected");
  });

  it("fails closed when no provider remains available", () => {
    const result = selectSpeaking({
      providers: [provider("mock-speech-primary")],
      healthByProviderId: {
        "mock-speech-primary": { ...healthy("mock-speech-primary"), status: "failing" },
      },
    });

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("no_provider_available");
  });

  it("marks fallback trust-tier downgrade for human review", () => {
    const secondary = withProvider(provider("mock-speech-secondary"), {
      identity: {
        ...provider("mock-speech-secondary").identity,
        trustTier: "validation_candidate",
      },
    });
    const result = selectSpeaking({
      boundary: createPlacementV4Boundary({ mockProvidersOnly: false }),
      providers: [provider("mock-speech-primary"), secondary],
      healthByProviderId: {
        "mock-speech-primary": { ...healthy("mock-speech-primary"), status: "failing" },
        "mock-speech-secondary": healthy("mock-speech-secondary"),
      },
    });

    expect(result.status).toBe("selected");
    expect(result.failover.fallbackChangesTrustLevel).toBe(true);
    expect(result.failover.requiresHumanReview).toBe(true);
  });

  it("requires human review for low trust fallback", () => {
    const result = selectSpeaking({
      healthByProviderId: {
        "mock-speech-primary": { ...healthy("mock-speech-primary"), status: "failing" },
        "mock-speech-secondary": { ...healthy("mock-speech-secondary"), status: "degraded" },
      },
    });

    expect(result.status).toBe("selected");
    expect(result.failover.requiresHumanReview).toBe(true);
  });

  it("uses deterministic tie-breaks", () => {
    const a = withProvider(provider("mock-speech-primary"), {
      identity: { ...provider("mock-speech-primary").identity, providerId: "mock-a" },
      priority: 10,
      baseTrustScore: 90,
    });
    const b = withProvider(provider("mock-speech-primary"), {
      identity: { ...provider("mock-speech-primary").identity, providerId: "mock-b" },
      priority: 10,
      baseTrustScore: 90,
    });
    const result = selectSpeaking({
      providers: [b, a],
      healthByProviderId: { "mock-a": healthy("mock-a"), "mock-b": healthy("mock-b") },
    });

    expect(result.selectedProviderId).toBe("mock-a");
  });

  it("records rejected candidate failure classes", () => {
    const result = selectSpeaking({
      providers: [provider("mock-speech-primary")],
      healthByProviderId: {
        "mock-speech-primary": { ...healthy("mock-speech-primary"), status: "failing" },
      },
    });

    expect(result.rejectedCandidates[0].failureClass).toBe("provider");
  });

  it("policy matrix exposes environment capability rules", () => {
    expect(PLACEMENT_V4_PROVIDER_POLICY_MATRIX.allowedCapabilitiesByEnvironment.production).toEqual([]);
    expect(PLACEMENT_V4_PROVIDER_POLICY_MATRIX.allowedCapabilitiesByEnvironment.validation).toContain("speaking");
  });

  it("policy matrix exposes max cost by capability", () => {
    expect(PLACEMENT_V4_PROVIDER_POLICY_MATRIX.maxCostCentsByCapability.lesson_generation).toBe(30);
  });

  it("policy matrix exposes failover allowances", () => {
    expect(PLACEMENT_V4_PROVIDER_POLICY_MATRIX.failoverAllowedByCapability.lesson_generation).toBe(false);
  });

  it("adjudicates agreement as learner-visible", () => {
    const result = adjudicatePlacementV4ProviderOutputs([
      { providerId: "a", outputId: "1", normalizedValue: "A2", confidence: 0.9 },
      { providerId: "b", outputId: "2", normalizedValue: "A2", confidence: 0.8 },
    ]);

    expect(result.reason).toBe("agreement");
    expect(result.learnerVisibleAllowed).toBe(true);
  });

  it("adjudicates soft disagreement with human review", () => {
    const result = adjudicatePlacementV4ProviderOutputs([
      { providerId: "a", outputId: "1", normalizedValue: "A2", confidence: 0.9 },
      { providerId: "b", outputId: "2", normalizedValue: "A2", confidence: 0.8 },
      { providerId: "c", outputId: "3", normalizedValue: "B1", confidence: 0.7 },
    ]);

    expect(result.reason).toBe("soft_disagreement");
    expect(result.humanReviewRequired).toBe(true);
    expect(result.learnerVisibleAllowed).toBe(true);
    expect(result.rejectedOutputs).toHaveLength(1);
  });

  it("blocks learner-visible output for hard contradictions", () => {
    const result = adjudicatePlacementV4ProviderOutputs([
      { providerId: "a", outputId: "1", normalizedValue: "A2", confidence: 0.9 },
      { providerId: "b", outputId: "2", normalizedValue: "B1", confidence: 0.8 },
    ]);

    expect(result.reason).toBe("hard_contradiction");
    expect(result.learnerVisibleAllowed).toBe(false);
  });

  it("blocks malformed provider output", () => {
    const result = adjudicatePlacementV4ProviderOutputs([
      { providerId: "a", outputId: "1", normalizedValue: "A2", malformed: true },
      { providerId: "b", outputId: "2", normalizedValue: "A2" },
    ]);

    expect(result.reason).toBe("malformed_output");
    expect(result.learnerVisibleAllowed).toBe(false);
  });

  it("blocks missing provider output", () => {
    const result = adjudicatePlacementV4ProviderOutputs([
      { providerId: "a", outputId: "1", missing: true },
      { providerId: "b", outputId: "2", normalizedValue: "A2" },
    ]);

    expect(result.reason).toBe("missing_output");
    expect(result.learnerVisibleAllowed).toBe(false);
  });

  it("blocks confidence mismatch", () => {
    const result = adjudicatePlacementV4ProviderOutputs([
      { providerId: "a", outputId: "1", normalizedValue: "A2", confidence: 0.95 },
      { providerId: "b", outputId: "2", normalizedValue: "A2", confidence: 0.3 },
    ]);

    expect(result.reason).toBe("confidence_mismatch");
    expect(result.learnerVisibleAllowed).toBe(false);
  });

  it("blocks provider self-inconsistency", () => {
    const result = adjudicatePlacementV4ProviderOutputs([
      { providerId: "a", outputId: "1", normalizedValue: "A2", selfInconsistent: true },
      { providerId: "b", outputId: "2", normalizedValue: "A2" },
    ]);

    expect(result.reason).toBe("provider_self_inconsistency");
    expect(result.learnerVisibleAllowed).toBe(false);
  });
});
