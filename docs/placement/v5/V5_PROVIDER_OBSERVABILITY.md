# V5 Provider Observability

**Status:** discovery  
**Owner:** C5  
**Inherits from:** V4 telemetry pipeline (#968), V4 providerRegistry decision records (#991)

---

## 1. Observability Inheritance

V5 inherits the V4 observability surface:

- `PlacementV4ProviderDecisionRecord` — canonical audit record for every provider selection
- `rejectedCandidates[]` — per-provider rejection reasons, trust scores, failure classes
- `failover.explanation[]` — human-readable rejection chain
- V4 telemetry pipeline — `aggregateEvents`, `canonicalizeEvents`, `buildReplaySnapshot`
- V4 telemetry event types — `lesson_start`, `lesson_complete`, `lesson_retry`, `speaking_retry`, `cefr_checkpoint`, etc.

V5 adds provider-specific observability on top of this foundation. No new pipeline; new event types flow through the existing V4 telemetry infrastructure.

---

## 2. New Telemetry Event Types

### 2.1 Provider Health Transition

```ts
export interface ProviderHealthTransitionEvent {
  type: "provider_health_transition";
  v: 2;  // telemetry schema version
  providerId: string;
  fromStatus: PlacementV4ProviderHealthStatus;
  toStatus: PlacementV4ProviderHealthStatus;
  reason: string;  // e.g., "consecutive_failures_threshold", "error_rate_spike", "manual_override"
  trustScoreBefore: number;
  trustScoreAfter: number;
  timestampMs: number;
}
```

Emitted when a provider's `status` field changes value. Captures the before/after trust score so operators can correlate health transitions with trust degradation.

### 2.2 Provider Quarantine Enter

```ts
export interface ProviderQuarantineEnterEvent {
  type: "provider_quarantine_enter";
  v: 2;
  providerId: string;
  reason: PlacementV4FailoverReason;  // e.g., "provider_flapping", "provider_unhealthy"
  consecutiveFailures: number;
  quarantineUntilMs: number;
  trustScoreAtEntry: number;
  timestampMs: number;
}
```

Emitted when `quarantinePlacementV4Provider` is called. The `quarantineUntilMs` lets operators know when the provider becomes eligible again.

### 2.3 Provider Quarantine Exit

```ts
export interface ProviderQuarantineExitEvent {
  type: "provider_quarantine_exit";
  v: 2;
  providerId: string;
  quarantineDurationMs: number;  // actual time spent in quarantine
  trustScoreAtExit: number;
  consecutiveFailuresAtExit: number;  // should be 0 after recovery
  timestampMs: number;
}
```

Emitted when a previously-quarantined provider passes selection again. Operators can use `quarantineDurationMs` to tune the quarantine formula.

### 2.4 Provider Failover Activated

```ts
export interface ProviderFailoverActivatedEvent {
  type: "provider_failover_activated";
  v: 2;
  capability: PlacementV4ProviderCapability;
  primaryProviderId: string;
  selectedProviderId: string;
  selectedReason: PlacementV4FailoverReason;  // "fallback_selected"
  primaryTrustScore: number;
  fallbackTrustScore: number;
  trustTierChanged: boolean;
  requiresHumanReview: boolean;
  timestampMs: number;
}
```

Emitted when `failover.selectedReason === "fallback_selected"`. Lets operators track how often the primary provider is unavailable and whether fallback quality is acceptable.

### 2.5 Provider Invocation Complete

```ts
export interface ProviderInvocationCompleteEvent {
  type: "provider_invocation_complete";
  v: 2;
  providerId: string;
  capability: PlacementV4ProviderCapability;
  invocationId: string;  // unique per invocation
  latencyMs: number;
  status: "success" | "error";
  failureClass?: PlacementV4FailureClass;  // present on error
  estimatedCostCents: number;
  actualCostCents?: number;  // from vendor response
  costDeltaCents?: number;   // actual - estimated
  quotaRemainingAfter?: number;
  region: PlacementV4Region;
  timestampMs: number;
}
```

Emitted after every production provider invocation. This is the primary observability surface for cost, latency, and error tracking. **This event type must not contain raw credentials, learner PII, or prompt/output content when privacy tier is `restricted`.**

---

## 3. Decision Record Enhancements

### 3.1 Current V4 Decision Record

```ts
export interface PlacementV4ProviderDecisionRecord {
  schemaVersion: "placement-v4-provider-decision@1";
  capability: PlacementV4ProviderCapability;
  status: "selected" | "blocked";
  selectedProviderId: string | null;
  requestedRegion: PlacementV4Region;
  learnerPrivacyTier: PlacementV4PrivacyTier;
  boundary: { mode, allowed, reasons };
  costEstimate: PlacementV4CostEstimate | null;
  trustScore: PlacementV4TrustScoreComponents | null;
  rejectedCandidates: [{ providerId, reasons, failureClass, trustScoreTotal, humanReviewRequired }];
  failover: { primaryProviderId, selectedProviderId, selectedReason, fallbackChangesTrustLevel, requiresHumanReview, explanation };
}
```

### 3.2 V5 Additions (schemaVersion bump to @2)

```ts
export interface PlacementV5ProviderDecisionRecord {
  schemaVersion: "placement-v5-provider-decision@1";
  // ... all V4 fields preserved ...
  
  // New V5 fields
  invocationSummary?: {
    invocationId: string;
    latencyMs: number;
    actualCostCents: number;
    failureClass?: PlacementV4FailureClass;
  };
  healthSnapshotAgeMs?: number;  // how old was the health data at selection time
  regionPreferenceApplied?: PlacementV4Region[];  // which regions were tried in order
}
```

The `invocationSummary` field is populated after the invocation completes — it links the selection decision to the actual invocation result. This creates a closed loop: selection → invocation → result → audit.

---

## 4. Health Dashboard Signals

### 4.1 Provider Health Aggregate

Operators need a real-time view of provider health. V5 must emit aggregates that can feed a dashboard:

```ts
export interface PlacementV5ProviderHealthAggregate {
  providerId: string;
  windowStartMs: number;
  windowEndMs: number;
  
  // Invocation stats
  totalInvocations: number;
  successRate: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  
  // Error breakdown
  authErrors: number;
  timeoutErrors: number;
  quotaErrors: number;
  providerErrors: number;
  unknownErrors: number;
  
  // Cost
  totalEstimatedCostCents: number;
  totalActualCostCents: number;
  costDeltaCents: number;
  
  // Health
  currentStatus: PlacementV4ProviderHealthStatus;
  trustScore: number;
  consecutiveFailures: number;
  quarantineRemainingMs: number;  // 0 if not quarantined
  
  // Consistency
  inconsistentPeerCount: number;
}
```

This aggregate can be computed from telemetry events by the existing `aggregateEvents` function — no new aggregation infrastructure needed.

### 4.2 Alert Thresholds

| Metric | Threshold | Severity |
|---|---|---|
| `successRate < 0.95` | 5-minute window | warning |
| `successRate < 0.80` | 5-minute window | critical |
| `p95LatencyMs > maxP95LatencyMs` | 5-minute window | warning |
| `consecutiveFailures ≥ 3` | immediate | warning (triggers flapping rejection) |
| `consecutiveFailures ≥ 5` | immediate | critical (triggers quarantine) |
| `costDeltaCents > 20% of estimated` | 10-invocation window | warning |
| `quarantineRemainingMs > 0` | immediate | info (provider is quarantined) |
| `inconsistentPeerCount ≥ 3` | 24-hour window | critical |

These thresholds should be configurable per capability, not hardcoded.

---

## 5. Audit Trail Requirements

### 5.1 Selection Audit

Every call to `selectPlacementV4Provider` produces a `PlacementV4ProviderDecisionRecord` with a canonical hash. These records must be:
- **Immutable**: Hashed with FNV-1a-64; tampering is detectable via hash mismatch
- **Replayable**: Same inputs → same hash (deterministic selection)
- **Complete**: Includes all rejected candidates with reasons — no "mystery rejection"

### 5.2 Invocation Audit

Every production invocation links to its selection decision via `invocationId`. The chain is:
```
selection decision (decisionRecord) 
  → invocation (invocationSummary.invocationId)
    → telemetry event (provider_invocation_complete)
      → health aggregate update
```

Each link is traceable forward and backward.

### 5.3 Health Transition Audit

Every health status change is recorded as a `provider_health_transition` event with before/after trust scores. This creates a timeline of provider reliability that operators can replay.

### 5.4 Quarantine Audit

Every quarantine enter/exit is recorded with duration and reason. Operators can answer: "How often was provider X quarantined in the last 30 days, and for how long each time?"

---

## 6. Privacy-Aware Observability

### 6.1 What Is Never Logged

- Raw API keys, tokens, or credentials (redacted at serialization)
- Learner names, emails, or handles (learnerKey only)
- Full prompt text when `privacyTier = "restricted"`
- Full provider output content when `privacyTier = "restricted"`
- Audio data (never stored in telemetry)

### 6.2 What Is Always Logged

- Provider ID, capability, region
- Latency, cost, error classification
- Trust score components and total
- Rejection reasons and failure classes
- Health status transitions
- Quarantine enter/exit timestamps

### 6.3 Retention of Observability Data

Observability data (decision records, telemetry events, health aggregates) follows the same retention policy as V4 telemetry — governed by the existing telemetry pruning rules. No separate retention policy for provider observability.

---

## 7. Integration with Existing V4 Telemetry

### 7.1 Event Validation

New V5 event types must pass through `validateEvents` (from V4 telemetry schema) with strict mode. Unknown event types must be rejected — no silent passthrough.

### 7.2 Event Aggregation

New V5 event types are aggregated by the existing `aggregateEvents` function. The aggregation summary gains new fields for provider-level stats:

```ts
export interface AggregationSummary {
  // ... existing V4 fields ...
  
  // V5 additions
  providerInvocations: Map<string, {
    total: number;
    successRate: number;
    p95LatencyMs: number;
    totalCostCents: number;
  }>;
}
```

### 7.3 Replay Safety

New V5 event types must be replay-safe:
- Timestamps are caller-supplied (`timestampMs`), not `Date.now()`
- Event IDs are deterministic (FNV-1a hash of content)
- Replaying the same event sequence produces the same aggregates

---

## 8. Operator Commands (future, not implemented now)

These are operator-facing queries that the observability surface should support. They are documented here for C7 and B4 awareness; implementation is post-V5 discovery.

```
# Show current health of all providers
> placement-v5 provider health

# Show selection history for a capability
> placement-v5 provider history --capability speaking --last 50

# Show quarantine timeline for a provider
> placement-v5 provider quarantine --provider azure-speaking-eastus

# Show cost summary by provider
> placement-v5 provider cost --since 7d

# Force quarantine a provider
> placement-v5 provider quarantine --provider azure-speaking-eastus --reason manual_override --duration 30m
```

These commands would read from telemetry aggregates and decision records — no new data sources needed.

---

## 9. Observability Readiness Checklist (for C7 Review)

Before C7 approves V5 provider observability:

- [ ] All 5 new event types are defined with schema validation
- [ ] `provider_invocation_complete` event redacts credentials and PII before emit
- [ ] Decision record schema version bumps to `@2` with backward-compatible additions
- [ ] Health aggregate can be computed from existing `aggregateEvents`
- [ ] Alert thresholds are configurable per capability
- [ ] Audit chain (selection → invocation → telemetry → health) is traceable end-to-end
- [ ] Replay safety is verified for all new event types
- [ ] Privacy tier enforcement is verified for all observability paths
