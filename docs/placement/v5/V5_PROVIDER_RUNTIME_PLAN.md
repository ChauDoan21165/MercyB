# V5 Provider Runtime Integration Plan

**Status:** discovery  
**Owner:** C5 — V5 Provider / Runtime Integration Builder  
**Depends on:** V4 providerRegistry (#991), V4 telemetry contracts (#968), V4 adapter (#988), V4 orchestration (#989)  
**Next route:** C7 boundary review before any runtime I/O is introduced

---

## 1. Current V4 ProviderRegistry Behavior

The V4 `providerRegistry.ts` (landed in #991, merged to main at `3be4e6ef1`) implements a pure-policy provider selection engine with zero runtime I/O.

### 1.1 Architecture

```
selectPlacementV4Provider(request) → PlacementV4ProviderSelection
  ├── boundaryDecisionFor()     — validation gate (mode, trust tier, env markers)
  ├── trustScoreFor()           — arithmetic trust from health snapshot
  ├── rejectionReasonsFor()     — 20 distinct failover reasons across 6 gates
  ├── costEstimateFor()         — unit × cost ceiling check
  └── adjudicatePlacementV4ProviderOutputs() — multi-provider output consistency
```

### 1.2 Current Provider Set (5 mock providers)

| Provider ID | Capabilities | Trust Tier | Privacy | Priority |
|---|---|---|---|---|
| `mock-grading-primary` | grading, tutoring | mock | restricted | 10 |
| `mock-speech-primary` | speaking, pronunciation | mock | restricted | 10 |
| `mock-language-primary` | translation, tutoring | mock | standard | 20 |
| `mock-lesson-primary` | lesson_generation, tutoring | mock | restricted | 15 |
| `mock-speech-secondary` | speaking, pronunciation | mock | restricted | 30 |

### 1.3 What Is Mock/Policy-Only Today

- **Provider selection**: All providers are `endpointKind: "mock"`, `endpointHost: "mock.local"`
- **Health snapshots**: Caller-supplied `PlacementV4ProviderHealthSnapshot` — no auto-collection
- **Trust scoring**: Purely arithmetic from health snapshot fields; no live data
- **Boundary enforcement**: `production` and `staging` modes have **empty** capability lists — all real providers are blocked by policy
- **Secrets/auth**: Static regex redaction only (`SECRET_KEY_PATTERN`, `SECRET_VALUE_PATTERN`); no real credentials exist
- **Cost estimates**: Declared in provider descriptors; no real billing integration
- **Output adjudication**: Operates on mock provider output objects; no real API responses
- **Quarantine**: Timer-based (`calculatePlacementV4QuarantineUntil`); no real circuit breaker state
- **Failover**: Deterministic tie-breaking between mock providers; no real fallback API calls

### 1.4 What Already Works (Reusable in V5)

- **Trust scoring formula**: health penalty + latency penalty + auth penalty + timeout penalty + quota penalty + consistency penalty → total. This is vendor-agnostic.
- **Failover chain**: priority → trust score → providerId. Deterministic, replay-safe.
- **Quarantine calculus**: `min(15min, consecutiveFailures × 60s)`. Suitable for real circuit breakers.
- **Boundary gate taxonomy**: 20 failover reasons covering validation, capability, health, cost, privacy, region, retention. Extensible for production.
- **Decision record**: `PlacementV4ProviderDecisionRecord` with canonical hash. Audit-ready.
- **Output consistency**: Multi-provider adjudication (agreement/soft_disagreement/hard_contradiction). Works for any provider count.
- **Secret redaction**: Pattern-based, recursive. Extensible to real credential fields.

---

## 2. What Production Provider Integration Would Require

### 2.1 Provider Descriptor Registry (Phase 1 — no I/O)

Extend `PLACEMENT_V4_MOCK_PROVIDERS` with a parallel `PLACEMENT_V5_PRODUCTION_PROVIDERS` array:

```ts
// New trust tier
export type PlacementV5ProviderTrustTier = 
  PlacementV4ProviderTrustTier | "production_validated";

// Production providers carry the same descriptor shape
// but endpointKind = "production" and endpointHost = real URL
export const PLACEMENT_V5_PRODUCTION_PROVIDERS: readonly PlacementV4ProviderDescriptor[] = [
  {
    identity: {
      providerId: "azure-speaking-eastus",
      trustTier: "production_validated",
      endpointKind: "production",
      endpointHost: "azure-speech-eastus.api",  // not a real URL yet
    },
    // ... same shape as mock providers
  },
];
```

The descriptor shape (`PlacementV4ProviderDescriptor`) is already sufficient for production — it declares identity, capabilities, regions, cost, privacy, retention, latency budgets, and validation rules. V5 needs only to **add entries**, not change the shape.

### 2.2 Health Collection Adapter (Phase 2 — read-only telemetry)

Replace caller-supplied health snapshots with a health adapter that reads from V4 telemetry:

```ts
// New: health adapter interface (no I/O yet)
export interface PlacementV5HealthAdapter {
  getHealth(providerId: string, nowMs: number): PlacementV4ProviderHealthSnapshot;
}
```

The adapter would consume telemetry events already flowing through the V4 telemetry pipeline (`LessonCompleteEvent`, `SpeakingRetryEvent`, etc.) to derive error rates, latency, and auth failure rates. This is **read-only from existing telemetry** — no new network calls.

### 2.3 Provider Invocation Adapter (Phase 3 — requires C7 approval)

Bridge from provider selection to actual API calls:

```ts
// New: provider invocation interface (no implementation until C7)
export interface PlacementV5ProviderInvoker {
  invoke(
    provider: PlacementV4ProviderDescriptor,
    capability: PlacementV4ProviderCapability,
    input: PlacementV5ProviderInput,
  ): Promise<PlacementV4ProviderOutput>;
}
```

This is where actual HTTP/gRPC/SDK calls would live. **This interface must not be implemented until C7 boundary review approves it.**

### 2.4 Boundary Mode Activation (Phase 3 — requires C7 approval)

The current policy matrix blocks all production providers:

```ts
allowedCapabilitiesByEnvironment: {
  staging: [],     // ← empty: no providers allowed
  production: [],  // ← empty: no providers allowed
}
```

V5 must add a gated activation path:

```ts
// New: activation config (read from env, not hardcoded)
export interface PlacementV5ActivationConfig {
  stagingEnabled: boolean;      // default: false
  productionEnabled: boolean;   // default: false
  allowedProductionProviders: string[];  // explicit allowlist
}
```

Each activation step requires its own C7 review. No blanket "production = true" toggle.

---

## 3. Runtime Boundary Risks

### 3.1 Risk: Accidental Production Calls in Dev

**Mitigation**: The boundary gate is fail-closed. `production` and `staging` modes have empty capability lists. V5 must preserve this — any activation must be explicit and environment-gated.

### 3.2 Risk: Health Data Staleness in Live Systems

**Mitigation**: V4's `maxHealthAgeMs` (default 60s) already prevents stale-health decisions. V5 health adapter must guarantee freshness or return `status: "unknown"` to trigger the existing `provider_health_stale` rejection.

### 3.3 Risk: Cost Overrun from Production Calls

**Mitigation**: V4's `costEstimateFor()` with `ceilingCents` already gates cost. V5 must enforce this **before** any production call is made — cost estimate is a pre-flight check, not a post-hoc audit.

### 3.4 Risk: Learner Data Leakage to Vendors

**Mitigation**: V4's `privacyTier` + `retentionPolicy` gates already block providers that store learner content or log prompts/outputs when privacy tier is `restricted`. V5 must apply these **before** sending any payload to a vendor.

### 3.5 Risk: Provider Inconsistency Across Regions

**Mitigation**: V4's `dataResidency` check (`processingRegions`, `storageRegions`) is declared per provider. V5 must verify these against actual vendor SLAs before activating a provider.

---

## 4. Secrets/Auth Handling Requirements

### 4.1 Current State

V4 has static secret redaction for decision record serialization. No real secrets exist — all providers are mock.

### 4.2 V5 Requirements (all subject to C7 review)

1. **Credential storage**: Secrets (API keys, tokens, service-account credentials) must never appear in source code, config files, or decision records.
2. **Redaction at serialization boundary**: `serializeProviderDecisionRecord` already redacts secret-patterned fields. V5 must extend the pattern set to cover real credential shapes (e.g., Azure `SpeechKey`, Supabase `service_role` key).
3. **No env-read in provider selection**: `selectPlacementV4Provider` must remain a pure function. Credential injection happens at the invocation layer, not the selection layer.
4. **Credential rotation**: Provider descriptors should carry a `credentialVersion` field so rotation can be tracked without touching selection logic.
5. **No credential in telemetry**: Health snapshots and decision records must never contain raw credentials. Redaction must run before any telemetry event is emitted.

### 4.3 Proposed Secret Model (no implementation until C7)

```ts
export interface PlacementV5ProviderCredential {
  providerId: string;
  credentialVersion: number;
  // credential value is NEVER stored in this struct.
  // It is injected at invocation time from a secure store.
}

export interface PlacementV5CredentialStore {
  getCredential(providerId: string): Promise<string>;  // returns the actual secret
}
```

---

## 5. Provider Health Model

### 5.1 Current Model (V4)

Health snapshots are caller-supplied. The trust scoring formula consumes:
- `status` (healthy/degraded/failing/unknown) → health penalty (0/18/50/35)
- `p95LatencyMs` → latency penalty (up to 25 points)
- `authFailureRate` → auth penalty (up to 40 points)
- `timeoutRate` → timeout penalty (up to 30 points)
- `quotaRemaining` → quota penalty (30 if 0, 12 if <5)
- `consecutiveFailures` → flapping detection (≥3 triggers rejection)
- `quarantineUntilMs` → quarantine enforcement
- `errorRate` → flapping detection (≥0.5 triggers rejection)

### 5.2 V5 Evolution

Phase 2 (read-only telemetry): Derive health snapshots from existing telemetry events:
- `errorRate` ← fraction of `lesson_complete` events with `scoreRatio < threshold` or `lesson_dropoff` events
- `p95LatencyMs` ← from `lesson_complete.durationMs` distribution
- `timeoutRate` ← from explicit timeout telemetry events (new event type if needed)
- `consecutiveFailures` ← running count in orchestrator state
- `quotaRemaining` ← from provider API quota endpoint (Phase 3 only)

Phase 3 (live health): Add a `ProviderHealthCollector` that polls provider status endpoints. This requires C7 approval and must be:
- Read-only (no mutation of provider state)
- Cached with staleness gating (reuse V4's `maxHealthAgeMs`)
- Circuit-broken (if health collector itself fails, fall back to last known good)

---

## 6. Fallback and Quarantine Behavior

### 6.1 Current V4 Behavior

1. Sort providers by `priority asc, providerId asc`
2. Evaluate each provider against boundary + health + cost gates
3. Sort eligible by `trustScore desc, priority asc, providerId asc`
4. Select top eligible; if different from primary, mark as `fallback_selected`
5. If fallback changes trust tier, flag `requiresHumanReview: true`
6. If no provider eligible, return `status: "blocked"` with `no_provider_available`

Quarantine: `calculatePlacementV4QuarantineUntil(nowMs, consecutiveFailures)` → `nowMs + min(15min, max(1, failures) × 60s)`. A quarantined provider is rejected until `nowMs > quarantineUntilMs`.

### 6.2 V5 Preservation

The failover/fallback/quarantine logic is **vendor-agnostic** and should be preserved as-is for V5. The only change is that real providers will appear in the eligible/rejected candidate lists alongside mock providers.

### 6.3 V5 Addition: Cross-Region Failover

When production providers are activated, add a cross-region failover dimension:

```ts
// New: region preference in selection request
export interface PlacementV5ProviderSelectionRequest 
  extends PlacementV4ProviderSelectionRequest {
  preferredRegions?: PlacementV4Region[];  // ordered by preference
}
```

This allows "try us-east, fall back to eu-west" without changing the core selection algorithm.

---

## 7. Observability Requirements

### 7.1 Current V4 Observability

- `PlacementV4ProviderDecisionRecord` with canonical hash — audit trail for every selection
- `rejectedCandidates[]` with per-provider reasons, trust scores, and failure classes
- `failover.explanation[]` with human-readable rejection chain
- Telemetry events for lesson starts/completions/retries (separate pipeline)

### 7.2 V5 Observability Gaps

These must be filled before any production provider is activated:

1. **Provider invocation latency**: Per-request timing → feeds back into `p95LatencyMs`
2. **Provider error categorization**: Map vendor error codes to `PlacementV4FailureClass` (auth, timeout, quota, provider, unknown)
3. **Cost tracking**: Actual cost per invocation vs estimated cost → detects `cost_ceiling_exceeded` drift
4. **Health transition events**: When a provider moves healthy→degraded→failing, emit a telemetry event
5. **Quarantine events**: When a provider enters/exits quarantine, emit a telemetry event with reason
6. **Failover events**: When fallback is selected, emit a telemetry event with `primaryProviderId`, `selectedProviderId`, and `selectedReason`

### 7.3 Telemetry Event Types (new for V5)

```ts
export type PlacementV5TelemetryEventType =
  | "provider_health_transition"    // healthy→degraded, degraded→failing, etc.
  | "provider_quarantine_enter"     // provider entered quarantine
  | "provider_quarantine_exit"      // provider exited quarantine
  | "provider_failover_activated"   // fallback was selected
  | "provider_invocation_complete"; // single invocation result
```

These events flow through the existing V4 telemetry pipeline — no new pipeline needed.

---

## 8. Deployment Configuration Requirements

### 8.1 Environment Variables (read, not set, by V5)

| Variable | Purpose | Default | C7 Gate |
|---|---|---|---|
| `V5_STAGING_ENABLED` | Allow staging boundary providers | `false` | Yes |
| `V5_PRODUCTION_ENABLED` | Allow production boundary providers | `false` | Yes |
| `V5_PRODUCTION_PROVIDER_ALLOWLIST` | Comma-separated provider IDs | `""` | Yes |
| `V5_PROVIDER_CREDENTIAL_STORE` | Which credential store backend to use | `"none"` | Yes |
| `V5_MAX_PRODUCTION_COST_CENTS_PER_REQUEST` | Hard cost cap per invocation | `0` | Yes |

All default to safe (disabled/zero). No production path activates without explicit configuration.

### 8.2 Provider Descriptor Loading

Production provider descriptors should be loaded from a configuration source, not hardcoded:

```ts
// Phase 1: static descriptors (same shape as mock, just different values)
export const PLACEMENT_V5_PRODUCTION_PROVIDERS = [...];

// Phase 2: env-gated merge
export function getActiveProviders(boundary: PlacementV4BoundaryMode): PlacementV4ProviderDescriptor[] {
  const base = PLACEMENT_V4_MOCK_PROVIDERS;
  if (boundary === "production" && isProductionEnabled()) {
    return [...base, ...PLACEMENT_V5_PRODUCTION_PROVIDERS];
  }
  return base;
}
```

---

## 9. Required Approvals Before Any Runtime I/O

| Gate | Owner | What it checks |
|---|---|---|
| C7 boundary review | C7 | No network/fs/env without approval; secret handling audit |
| B4 integration verification | B4 | V5 provider selection feeds orchestration correctly |
| B8 boundary safety | B8 | No mobile/audio/ops/release leakage |
| C1 architecture review | C1 | Provider registry shape extensibility; no regression on V4 invariants |
| Production readiness | Chau (operator) | Manual approval of first production provider activation |

**No `fetch()`, no `require('https')`, no `process.env` read, no SDK import, and no credential in source code until C7 explicitly approves each one.**

---

## 10. Phase Sequencing

| Phase | Deliverable | I/O? | Requires |
|---|---|---|---|
| C5 discovery (this doc) | Plan + boundary requirements + observability spec | No | — |
| C7 boundary review | Approved boundary requirements | No | C5 docs |
| C5 Phase 1 | Production provider descriptors (static) | No | C7 approval |
| C5 Phase 2 | Health adapter (reads telemetry) | Read-only from telemetry | C7 approval |
| C5 Phase 3 | Provider invocation adapter + live health | Yes (network) | C7 + Chau approval |
| B4 integration | Orchestration wires V5 providers | Depends on phase | Phase 2+ |
| B1 merge | Squash to main | — | All gates green |
