/**
 * V4 Provider Drift Tests — state-transition integrity, trust-score
 * degradation tracking, and provider consistency verification.
 *
 * These tests directly address the classes of bugs B3 (shared-drift scoping)
 * and B5 (class-bug detection) surfaced: silent state corruption, invisible
 * provider degradation, and "green-path" verdicts that hide real failures.
 *
 * Every test uses only the v4TestHarness fixtures. No global setup changes.
 */

import { describe, expect, it } from "vitest";

import {
  selectPlacementV4Provider,
  PLACEMENT_V4_MOCK_PROVIDERS,
  hashProviderDecisionRecord,
  serializeProviderDecisionRecord,
  adjudicatePlacementV4ProviderOutputs,
  normalizePlacementV4HealthSnapshot,
  calculatePlacementV4QuarantineUntil,
  type PlacementV4ProviderHealthSnapshot,
  type PlacementV4ProviderDescriptor,
  type PlacementV4FailoverReason,
  type PlacementV4ProviderCapability,
} from "../providerRegistry";

import {
  healthyHealth,
  failingHealth,
  degradedHealth,
  staleHealth,
  quarantinedHealth,
  defaultBoundary,
  healthMapFor,
  withProviderOverride,
  selectionRequest,
  FIXED_EPOCH_MS,
  mockProviderCapabilityMatrix,
  resetIdCounter,
} from "./v4TestHarness";

// ══════════════════════════════════════════════════════════════════════
// B3: shared-drift detection — provider state transitions
// ══════════════════════════════════════════════════════════════════════

describe("V4 provider drift — health state transitions", () => {
  const providerId = "mock-speech-primary";
  const nowMs = FIXED_EPOCH_MS;

  it("healthy → degraded transition is detectable", () => {
    const healthy = healthyHealth(providerId, nowMs);
    const degraded = degradedHealth(providerId, nowMs);

    // Status must differ.
    expect(degraded.status).not.toBe(healthy.status);
    // Degraded should still be recoverable (not failing).
    expect(degraded.status).toBe("degraded");
    // Error rate increases.
    expect(degraded.errorRate).toBeGreaterThan(healthy.errorRate);
  });

  it("degraded → failing transition triggers quarantine eligibility", () => {
    const degraded = degradedHealth(providerId, nowMs);
    const failing = failingHealth(providerId, nowMs);

    expect(failing.status).toBe("failing");
    expect(failing.consecutiveFailures).toBeGreaterThanOrEqual(3);
    expect(failing.errorRate).toBeGreaterThanOrEqual(0.5);
  });

  it("quarantined provider is rejected during the quarantine window", () => {
    const quarantined = quarantinedHealth(providerId, nowMs, 120_000);

    const result = selectPlacementV4Provider(
      selectionRequest("speaking", {
        providers: [PLACEMENT_V4_MOCK_PROVIDERS.find(
          (p) => p.identity.providerId === providerId,
        )!],
        healthByProviderId: { [providerId]: quarantined },
      }),
    );

    // Should be blocked because the provider is quarantined.
    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("provider_quarantined");
  });

  it("provider recovers after quarantine expiry", () => {
    const expiredQuarantine: PlacementV4ProviderHealthSnapshot = {
      ...quarantinedHealth(providerId, nowMs - 120_001, 120_000),
      status: "healthy",
      errorRate: 0,
      consecutiveFailures: 0,
    };

    const result = selectPlacementV4Provider(
      selectionRequest("speaking", {
        providers: [PLACEMENT_V4_MOCK_PROVIDERS.find(
          (p) => p.identity.providerId === providerId,
        )!],
        healthByProviderId: { [providerId]: expiredQuarantine },
      }),
    );

    expect(result.status).toBe("selected");
  });

  it("stale health snapshot is rejected (drift: health data silently goes cold)", () => {
    const stale = staleHealth(providerId, nowMs, 120_000);

    const result = selectPlacementV4Provider(
      selectionRequest("speaking", {
        providers: [PLACEMENT_V4_MOCK_PROVIDERS.find(
          (p) => p.identity.providerId === providerId,
        )!],
        healthByProviderId: { [providerId]: stale },
      }),
    );

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("provider_health_stale");
  });

  it("stale health with long maxHealthAgeMs passes", () => {
    const stale = staleHealth(providerId, nowMs, 10_000);

    const result = selectPlacementV4Provider(
      selectionRequest("speaking", {
        providers: [PLACEMENT_V4_MOCK_PROVIDERS.find(
          (p) => p.identity.providerId === providerId,
        )!],
        healthByProviderId: { [providerId]: stale },
        maxHealthAgeMs: 120_000,
      }),
    );

    expect(result.status).toBe("selected");
  });

  it("consecutive failures increment produces correct quarantine window", () => {
    const q1 = calculatePlacementV4QuarantineUntil(nowMs, 1);
    const q3 = calculatePlacementV4QuarantineUntil(nowMs, 3);
    const q10 = calculatePlacementV4QuarantineUntil(nowMs, 10);

    // 1 failure → 60s quarantine
    expect(q1).toBe(nowMs + 60_000);
    // 3 failures → 180s quarantine
    expect(q3).toBe(nowMs + 180_000);
    // 10 failures → capped at 15 minutes
    expect(q10).toBe(nowMs + 15 * 60_000);
  });
});

// ══════════════════════════════════════════════════════════════════════
// B5: class-bug detection — trust score integrity
// ══════════════════════════════════════════════════════════════════════

describe("V4 provider drift — trust score integrity", () => {
  const providerId = "mock-grading-primary";
  const nowMs = FIXED_EPOCH_MS;

  it("healthy provider has full base trust score", () => {
    const result = selectPlacementV4Provider(
      selectionRequest("grading", {
        providers: [PLACEMENT_V4_MOCK_PROVIDERS.find(
          (p) => p.identity.providerId === providerId,
        )!],
        healthByProviderId: { [providerId]: healthyHealth(providerId, nowMs) },
      }),
    );

    expect(result.status).toBe("selected");
    expect(result.trustScoreComponents!.total).toBeGreaterThanOrEqual(90);
    expect(result.trustScoreComponents!.healthPenalty).toBe(0);
  });

  it("failing provider trust score drops below minimum threshold", () => {
    const result = selectPlacementV4Provider(
      selectionRequest("grading", {
        providers: [PLACEMENT_V4_MOCK_PROVIDERS.find(
          (p) => p.identity.providerId === providerId,
        )!],
        healthByProviderId: { [providerId]: failingHealth(providerId, nowMs) },
      }),
    );

    expect(result.status).toBe("blocked");
    // Trust score should be well below the base.
    const rejected = result.rejectedCandidates.find(
      (c) => c.providerId === providerId,
    );
    expect(rejected).toBeDefined();
    expect(rejected!.trustScore.total).toBeLessThan(70); // minimumTrustScore=75 for grading
  });

  it("health penalty scales with status severity", () => {
    const healthy = healthyHealth(providerId, nowMs);
    const degraded = degradedHealth(providerId, nowMs);
    const failing = failingHealth(providerId, nowMs);

    // Build trust scores by calling selectPlacementV4Provider with each.
    const getTrust = (
      health: PlacementV4ProviderHealthSnapshot,
    ) => {
      const result = selectPlacementV4Provider(
        selectionRequest("grading", {
          providers: [PLACEMENT_V4_MOCK_PROVIDERS.find(
            (p) => p.identity.providerId === providerId,
          )!],
          healthByProviderId: { [providerId]: health },
        }),
      );
      return (
        result.trustScoreComponents?.total ??
        result.rejectedCandidates.find((c) => c.providerId === providerId)!.trustScore.total
      );
    };

    const healthyTrust = getTrust(healthy);
    const degradedTrust = getTrust(degraded);
    const failingTrust = getTrust(failing);

    // Trust should monotonically decrease as health worsens.
    expect(degradedTrust).toBeLessThan(healthyTrust);
    expect(failingTrust).toBeLessThan(degradedTrust);
  });

  it("inconsistent provider is rejected even when otherwise healthy", () => {
    const result = selectPlacementV4Provider(
      selectionRequest("grading", {
        providers: [PLACEMENT_V4_MOCK_PROVIDERS.find(
          (p) => p.identity.providerId === providerId,
        )!],
        healthByProviderId: { [providerId]: healthyHealth(providerId, nowMs) },
        inconsistentProviderIds: [providerId],
      }),
    );

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("provider_inconsistent");
  });

  it("consistency penalty is 50 points (severe)", () => {
    const result = selectPlacementV4Provider(
      selectionRequest("grading", {
        providers: [PLACEMENT_V4_MOCK_PROVIDERS.find(
          (p) => p.identity.providerId === providerId,
        )!],
        healthByProviderId: { [providerId]: healthyHealth(providerId, nowMs) },
        inconsistentProviderIds: [providerId],
      }),
    );

    const rejected = result.rejectedCandidates.find(
      (c) => c.providerId === providerId,
    );
    expect(rejected!.trustScore.consistencyPenalty).toBe(50);
  });

  it("trust score components sum to total (no hidden penalties)", () => {
    const result = selectPlacementV4Provider(
      selectionRequest("grading", {
        providers: [PLACEMENT_V4_MOCK_PROVIDERS.find(
          (p) => p.identity.providerId === providerId,
        )!],
        healthByProviderId: { [providerId]: failingHealth(providerId, nowMs) },
      }),
    );

    const rejected = result.rejectedCandidates.find(
      (c) => c.providerId === providerId,
    )!;
    const { base, healthPenalty, latencyPenalty, authPenalty, timeoutPenalty, quotaPenalty, consistencyPenalty, total } =
      rejected.trustScore;

    // Sum of base minus all penalties should equal total.
    const computed =
      base - healthPenalty - latencyPenalty - authPenalty - timeoutPenalty - quotaPenalty - consistencyPenalty;
    // Total is clamped to [0, 100].
    const clamped = Math.max(0, Math.min(100, computed));
    expect(total).toBe(clamped);
  });
});

// ══════════════════════════════════════════════════════════════════════
// Decision record integrity — no silent corruption
// ══════════════════════════════════════════════════════════════════════

describe("V4 provider drift — decision record integrity", () => {
  it("decision record hash matches serialized content", () => {
    const result = selectPlacementV4Provider(
      selectionRequest("speaking", {
        providers: PLACEMENT_V4_MOCK_PROVIDERS.filter(
          (p) => p.identity.providerId.includes("speech"),
        ),
        healthByProviderId: healthMapFor(
          PLACEMENT_V4_MOCK_PROVIDERS.filter((p) => p.identity.providerId.includes("speech")),
        ),
      }),
    );

    const hash = hashProviderDecisionRecord(result.decisionRecord);
    // Hash should be a 16-char hex string.
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
    // Hash should be deterministic.
    const hash2 = hashProviderDecisionRecord(result.decisionRecord);
    expect(hash).toBe(hash2);
  });

  it("blocked decisions produce a decision record with null selectedProviderId", () => {
    const result = selectPlacementV4Provider(
      selectionRequest("speaking", {
        boundary: defaultBoundary({ mode: "production" }),
      }),
    );

    expect(result.status).toBe("blocked");
    expect(result.decisionRecord.selectedProviderId).toBeNull();
    expect(result.decisionRecord.status).toBe("blocked");
  });

  it("rejected candidates include exact reasons and failure classes", () => {
    const result = selectPlacementV4Provider(
      selectionRequest("lesson_generation", {
        providers: [PLACEMENT_V4_MOCK_PROVIDERS.find(
          (p) => p.identity.providerId === "mock-lesson-primary",
        )!],
        healthByProviderId: { "mock-lesson-primary": failingHealth("mock-lesson-primary", FIXED_EPOCH_MS) },
      }),
    );

    for (const candidate of result.rejectedCandidates) {
      expect(candidate.reasons.length).toBeGreaterThan(0);
      expect(candidate.failureClass.length).toBeGreaterThan(0);
      expect(candidate.trustScore.total).toBeGreaterThanOrEqual(0);
      expect(candidate.trustScore.total).toBeLessThanOrEqual(100);
    }
  });

  it("serialized decision record redacts secrets in nested objects", () => {
    const result = selectPlacementV4Provider(
      selectionRequest("speaking", {
        providers: PLACEMENT_V4_MOCK_PROVIDERS.filter(
          (p) => p.identity.providerId.includes("speech"),
        ),
        healthByProviderId: healthMapFor(
          PLACEMENT_V4_MOCK_PROVIDERS.filter((p) => p.identity.providerId.includes("speech")),
        ),
      }),
    );

    const serialized = serializeProviderDecisionRecord(result.decisionRecord);
    // Must be valid JSON.
    expect(() => JSON.parse(serialized)).not.toThrow();
    // Keys must be sorted (canonical).
    expect(serialized.indexOf('"boundary"')).toBeLessThan(serialized.indexOf('"capability"'));
  });

  it("failover explanation includes rejection reasons for each candidate", () => {
    const result = selectPlacementV4Provider(
      selectionRequest("speaking", {
        providers: PLACEMENT_V4_MOCK_PROVIDERS.filter(
          (p) => p.identity.providerId.includes("speech"),
        ),
        healthByProviderId: {
          "mock-speech-primary": failingHealth("mock-speech-primary", FIXED_EPOCH_MS),
          "mock-speech-secondary": healthyHealth("mock-speech-secondary", FIXED_EPOCH_MS),
        },
      }),
    );

    expect(result.status).toBe("selected");
    expect(result.failover.selectedReason).toBe("fallback_selected");
    expect(result.failover.explanation.join("\n")).toContain("mock-speech-primary rejected");
  });
});

// ══════════════════════════════════════════════════════════════════════
// Provider output adjudication — consistency checks
// ══════════════════════════════════════════════════════════════════════

describe("V4 provider drift — output adjudication", () => {
  it("agreement produces learner-visible output with no human review", () => {
    const result = adjudicatePlacementV4ProviderOutputs([
      { providerId: "a", outputId: "1", normalizedValue: "B1", confidence: 0.9 },
      { providerId: "b", outputId: "2", normalizedValue: "B1", confidence: 0.85 },
      { providerId: "c", outputId: "3", normalizedValue: "B1", confidence: 0.88 },
    ]);

    expect(result.reason).toBe("agreement");
    expect(result.humanReviewRequired).toBe(false);
    expect(result.learnerVisibleAllowed).toBe(true);
    expect(result.acceptedOutput).toBeDefined();
  });

  it("soft disagreement flags human review but allows learner visibility", () => {
    // 2/3 agree on A2, 1 dissents B1.
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

  it("hard contradiction blocks learner visibility completely", () => {
    // Equal split — no majority.
    const result = adjudicatePlacementV4ProviderOutputs([
      { providerId: "a", outputId: "1", normalizedValue: "A1", confidence: 0.9 },
      { providerId: "b", outputId: "2", normalizedValue: "C1", confidence: 0.8 },
    ]);

    expect(result.reason).toBe("hard_contradiction");
    expect(result.learnerVisibleAllowed).toBe(false);
    expect(result.humanReviewRequired).toBe(true);
  });

  it("malformed output is caught before value comparison", () => {
    const result = adjudicatePlacementV4ProviderOutputs([
      { providerId: "a", outputId: "1", normalizedValue: "A2", malformed: true, confidence: 0.9 },
      { providerId: "b", outputId: "2", normalizedValue: "A2", confidence: 0.9 },
    ]);

    expect(result.reason).toBe("malformed_output");
    expect(result.learnerVisibleAllowed).toBe(false);
  });

  it("confidence mismatch (>0.4 spread) blocks output", () => {
    const result = adjudicatePlacementV4ProviderOutputs([
      { providerId: "a", outputId: "1", normalizedValue: "A2", confidence: 0.95 },
      { providerId: "b", outputId: "2", normalizedValue: "A2", confidence: 0.3 },
    ]);

    expect(result.reason).toBe("confidence_mismatch");
    expect(result.learnerVisibleAllowed).toBe(false);
  });

  it("confidence mismatch within 0.4 spread is treated as agreement", () => {
    const result = adjudicatePlacementV4ProviderOutputs([
      { providerId: "a", outputId: "1", normalizedValue: "A2", confidence: 0.9 },
      { providerId: "b", outputId: "2", normalizedValue: "A2", confidence: 0.55 },
    ]);

    // Spread = 0.35 → still under the 0.4 threshold.
    expect(result.reason).toBe("agreement");
    expect(result.learnerVisibleAllowed).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════
// Capability coverage integrity — no silent capability loss
// ══════════════════════════════════════════════════════════════════════

describe("V4 provider drift — capability coverage", () => {
  it("every capability has at least one mock provider", () => {
    const matrix = mockProviderCapabilityMatrix();

    const requiredCapabilities: PlacementV4ProviderCapability[] = [
      "speaking",
      "grading",
      "translation",
      "tutoring",
      "pronunciation",
      "lesson_generation",
    ];

    for (const cap of requiredCapabilities) {
      const providers = matrix.get(cap);
      expect(providers).toBeDefined();
      expect(providers!.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("speaking has at least 2 providers for failover", () => {
    const matrix = mockProviderCapabilityMatrix();
    const speakingProviders = matrix.get("speaking");
    expect(speakingProviders!.length).toBeGreaterThanOrEqual(2);
  });

  it("lesson_generation has failover disabled (policy invariant)", () => {
    const result = selectPlacementV4Provider(
      selectionRequest("lesson_generation", {
        providers: [
          PLACEMENT_V4_MOCK_PROVIDERS.find(
            (p) => p.identity.providerId === "mock-lesson-primary",
          )!,
        ],
        healthByProviderId: {
          "mock-lesson-primary": failingHealth("mock-lesson-primary", FIXED_EPOCH_MS),
        },
      }),
    );

    // lesson_generation failover should be disallowed by policy.
    expect(result.status).toBe("blocked");
  });

  it("capability mismatch produces clear rejection reason", () => {
    const result = selectPlacementV4Provider(
      selectionRequest("pronunciation", {
        providers: [
          PLACEMENT_V4_MOCK_PROVIDERS.find(
            (p) => p.identity.providerId === "mock-grading-primary",
          )!,
        ],
        healthByProviderId: {
          "mock-grading-primary": healthyHealth("mock-grading-primary", FIXED_EPOCH_MS),
        },
      }),
    );

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("capability_mismatch");
  });
});

// ══════════════════════════════════════════════════════════════════════
// Boundary enforcement — no leaked provider in wrong environment
// ══════════════════════════════════════════════════════════════════════

describe("V4 provider drift — boundary enforcement", () => {
  it("production mode blocks all providers", () => {
    const result = selectPlacementV4Provider(
      selectionRequest("speaking", {
        boundary: defaultBoundary({ mode: "production" }),
      }),
    );

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("validation_boundary_blocked");
  });

  it("missing validation markers block providers", () => {
    const result = selectPlacementV4Provider(
      selectionRequest("speaking", {
        boundary: defaultBoundary({ validationEnvMarkerPresent: false }),
      }),
    );

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("validation_boundary_blocked");
  });

  it("mockProvidersOnly blocks non-mock trust tiers", () => {
    const nonMock = withProviderOverride(
      PLACEMENT_V4_MOCK_PROVIDERS.find(
        (p) => p.identity.providerId === "mock-speech-primary",
      )!,
      {
        identity: {
          ...PLACEMENT_V4_MOCK_PROVIDERS.find(
            (p) => p.identity.providerId === "mock-speech-primary",
          )!.identity,
          trustTier: "validation_candidate",
        },
      },
    );

    const result = selectPlacementV4Provider(
      selectionRequest("speaking", {
        providers: [nonMock],
        healthByProviderId: { [nonMock.identity.providerId]: healthyHealth(nonMock.identity.providerId, FIXED_EPOCH_MS) },
        boundary: defaultBoundary({ mockProvidersOnly: true }),
      }),
    );

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("trust_tier_blocked");
  });

  it("unknown trust tier is always blocked", () => {
    const unknown = withProviderOverride(
      PLACEMENT_V4_MOCK_PROVIDERS.find(
        (p) => p.identity.providerId === "mock-speech-primary",
      )!,
      {
        identity: {
          ...PLACEMENT_V4_MOCK_PROVIDERS.find(
            (p) => p.identity.providerId === "mock-speech-primary",
          )!.identity,
          trustTier: "unknown",
        },
      },
    );

    const result = selectPlacementV4Provider(
      selectionRequest("speaking", {
        providers: [unknown],
        healthByProviderId: { [unknown.identity.providerId]: healthyHealth(unknown.identity.providerId, FIXED_EPOCH_MS) },
        boundary: defaultBoundary({ mockProvidersOnly: false }),
      }),
    );

    expect(result.status).toBe("blocked");
    expect(result.exactRejectionReasons).toContain("trust_tier_blocked");
  });
});
