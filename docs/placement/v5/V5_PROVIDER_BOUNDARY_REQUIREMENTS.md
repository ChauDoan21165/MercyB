# V5 Provider Boundary Requirements

**Status:** discovery  
**Owner:** C5  
**Review gate:** C7 boundary review required before any implementation  
**Inherits from:** V4 providerRegistry boundary model (#991)

---

## 1. Boundary Model Inheritance

V5 inherits the V4 boundary model unchanged. The V4 `PlacementV4ValidationBoundary` defines the contract:

```
boundary mode (local | validation | staging | production)
  ├── runtimeApproved
  ├── supabaseApproved
  ├── validationEnvMarkerPresent
  ├── liveValidationApproved
  ├── placementV4GloballyEnabled
  ├── mockProvidersOnly
  ├── requestedRegion
  └── learnerPrivacyTier
```

V5 adds production activation on top of this model — it does not replace or weaken any existing gate.

---

## 2. Boundary Mode Progression

### 2.1 Current (V4)

| Mode | Capabilities | Trust Tiers | Active? |
|---|---|---|---|
| `local` | all 6 | mock only | always |
| `validation` | all 6 | mock, validation_candidate | with env markers |
| `staging` | none | none | blocked |
| `production` | none | none | blocked |

### 2.2 V5 Target (after C7 approval)

| Mode | Capabilities | Trust Tiers | Activation Gate |
|---|---|---|---|
| `local` | all 6 | mock | always |
| `validation` | all 6 | mock, validation_candidate, production_validated | env markers |
| `staging` | all 6 (allowlisted) | production_validated | `V5_STAGING_ENABLED=true` |
| `production` | all 6 (allowlisted) | production_validated | `V5_PRODUCTION_ENABLED=true` + allowlist |

The key principle: **no mode upgrades automatically**. Each boundary mode activation requires an explicit environment variable. Removing a provider from the allowlist takes effect on the next selection request — no restart needed.

---

## 3. Provider Trust Tier Progression

### 3.1 Tier Ladder

```
mock  →  validation_candidate  →  production_validated
```

- `mock`: never makes real API calls. Allowed in all modes.
- `validation_candidate`: makes real API calls in validation mode only. Requires `liveValidationApproved: true`.
- `production_validated`: makes real API calls in staging and production. Requires explicit allowlisting.

### 3.2 Tier Promotion Requirements

To promote a provider from `validation_candidate` to `production_validated`:

1. Provider must have ≥100 consecutive successful invocations in validation mode
2. Provider must have zero `provider_inconsistent` flags in the last 7 days
3. Provider must have `trustScore.total ≥ humanReviewTrustFloor` for its primary capability
4. Provider's `dataResidency` must be verified against vendor SLA
5. Provider's `retention` policy must be verified against vendor terms
6. Manual approval from Chau (operator)

Tier demotion (production_validated → validation_candidate) occurs automatically when:
- `consecutiveFailures ≥ 5` → triggers quarantine + demotion
- `inconsistentWithProviderIds` grows to ≥3 peers → triggers consistency review + demotion

---

## 4. Region and Data Residency

### 4.1 Current V4 Rules

- Allowed regions: `us`, `ca`, `eu`, `global`
- Per-provider `dataResidency.processingRegions` and `storageRegions`
- Region mismatch → `region_mismatch` rejection

### 4.2 V5 Additions

1. **Learner region detection**: The learner's region is determined by their profile or IP geo-lookup (read-only, no new I/O). This feeds `requestedRegion` in the selection request.
2. **Cross-region fallback ordering**: `preferredRegions` array in the selection request, ordered by preference. Selection tries the first region, then the second, etc.
3. **Data residency audit**: Each production provider must document its actual processing and storage regions. This documentation lives in the provider descriptor and is verified during tier promotion.
4. **Region-specific quotas**: A provider may have different `quotaRemaining` per region. The health adapter must track per-region quota separately.

### 4.3 Region-Specific Provider Example

```ts
{
  identity: {
    providerId: "azure-speaking-eastus",
    // ...
  },
  regions: ["us"],
  dataResidency: {
    processingRegions: ["us"],
    storageRegions: ["us"],
  },
  // ...
},
{
  identity: {
    providerId: "azure-speaking-westeurope",
    // ...
  },
  regions: ["eu"],
  dataResidency: {
    processingRegions: ["eu"],
    storageRegions: ["eu"],
  },
  // ...
}
```

---

## 5. Privacy and Retention

### 5.1 Current V4 Rules

```
privacyTier: "standard" | "restricted"

restricted rules:
  maxRetentionDays: 0
  allowPromptLogging: false
  allowOutputLogging: false

standard rules:
  maxRetentionDays: 7
  allowPromptLogging: false
  allowOutputLogging: false
```

### 5.2 V5 Additions

1. **Provider privacy audit**: Each production provider must be audited against its declared `retention` policy before tier promotion. The audit checks:
   - Does the vendor actually delete data within `retentionDays`?
   - Does the vendor log prompts? (Must match `allowPromptLogging`)
   - Does the vendor log outputs? (Must match `allowOutputLogging`)
   - Does the vendor store learner content? (Must match `storesLearnerContent`)

2. **Privacy tier enforcement at invocation**: Before sending a payload to a production provider, the invocation adapter must:
   - Strip learner PII from the payload (learnerKey only; no name/email/handle)
   - Attach a `X-MercyB-Privacy-Tier: restricted` header (or equivalent)
   - Log that a production invocation occurred (decision record only, no payload content if `restricted`)

3. **No cross-tier provider mixing**: A request with `learnerPrivacyTier: "restricted"` must never select a `standard` provider, even as fallback. This is already enforced by V4's `privacy_tier_mismatch` rejection.

---

## 6. Cost Boundary

### 6.1 Current V4 Rules

- `costEstimateFor()` computes `estimatedCostCents = units × centsPerUnit`
- `ceilingCents = min(request max, provider max, policy max)`
- If `estimatedCostCents > ceilingCents` → `cost_ceiling_exceeded` → provider rejected

### 6.2 V5 Additions

1. **Hard cap per request**: `V5_MAX_PRODUCTION_COST_CENTS_PER_REQUEST` (default 0 = no production calls possible). Even if a provider is selected, the invocation adapter must check this cap before making the call.
2. **Cost tracking**: After each production invocation, record:
   - `estimatedCostCents` (pre-flight)
   - `actualCostCents` (from vendor response or billing API)
   - `costDeltaCents = actual - estimated`
   - Emit as telemetry event `provider_invocation_complete.costCents`
3. **Cost overrun alarm**: If `costDeltaCents > 0` for 5 consecutive invocations, flag the provider for cost review.

---

## 7. Security Boundary

### 7.1 No Network in Selection

`selectPlacementV4Provider` must remain a pure synchronous function. It reads provider descriptors, health snapshots, and boundary configuration — all in-memory data. It never:
- Makes HTTP requests
- Reads files
- Reads environment variables
- Accesses browser storage
- Calls vendor SDKs

### 7.2 Credential Isolation

Credentials live in a separate `PlacementV5CredentialStore` injected at the invocation layer, not the selection layer. The selection engine only deals with provider identity — it never sees, stores, or logs credentials.

### 7.3 Redaction at Every Serialization Boundary

Every path that serializes provider-related data must run through `redactSecrets`:
- Decision records → `serializeProviderDecisionRecord` (already redacted)
- Telemetry events → new V5 telemetry types must redact before emit
- Log output → any `console.log` of provider data is forbidden in production; use structured telemetry instead

### 7.4 No Credential in Version Control

Provider descriptors may reference a `credentialVersion` but never contain the credential value. The credential store backend (Supabase Vault, environment variable, or secrets manager) is selected by `V5_PROVIDER_CREDENTIAL_STORE` and must never be checked into git.

---

## 8. Failure Boundary

### 8.1 Fail-Closed at Every Gate

Every gate in the selection pipeline is fail-closed:
- Boundary mismatch → rejected
- Capability mismatch → rejected
- Health failure → rejected
- Cost overrun → rejected
- Privacy violation → rejected
- Region mismatch → rejected
- Trust tier insufficient → rejected

A provider that passes all gates is eligible. A provider that fails any gate is rejected. There is no "warning but proceed" path.

### 8.2 Graceful Degradation

When all production providers are rejected:
1. If mock providers are allowed in the current boundary mode, fall back to mock
2. If no mock providers are allowed (e.g., production mode without mock fallback), return `status: "blocked"` with `no_provider_available`
3. The caller receives a `PlacementV4ProviderSelection` with full rejection details — it can decide to queue, retry, or notify the learner

### 8.3 No Silent Fallback

Every failover from primary to secondary must be recorded in:
- The decision record (`failover.selectedReason = "fallback_selected"`)
- The telemetry event (`provider_failover_activated`)
- The human review flag (`failover.requiresHumanReview = true` if trust tier changed)

Silent fallback is forbidden. The operator must be able to trace every failover decision.

---

## 9. Observability Boundary

### 9.1 What Must Be Observable

See `V5_PROVIDER_OBSERVABILITY.md` for full specification. At minimum:
- Every provider selection → decision record
- Every health transition → telemetry event
- Every quarantine enter/exit → telemetry event
- Every failover → telemetry event
- Every production invocation → telemetry event with cost + latency + error

### 9.2 What Must Not Be Observable

- Raw credentials (redacted at serialization)
- Learner PII in production invocation payloads (learnerKey only)
- Full prompt/output content when `privacyTier = "restricted"` (decision record only; no content logging)

---

## 10. Boundary Approval Checklist (for C7 Review)

Before C7 approves any V5 provider boundary activation:

- [ ] All 5 environment variables default to safe (disabled/zero)
- [ ] No `fetch()` or network call in `selectPlacementV4Provider`
- [ ] No `process.env` read in provider selection logic
- [ ] No credential value in any source file, config file, or decision record
- [ ] Secret redaction runs on every serialization path
- [ ] Privacy tier enforcement runs before any production payload is sent
- [ ] Cost ceiling check runs before any production call is made
- [ ] Failover events are emitted to telemetry
- [ ] Health transitions are emitted to telemetry
- [ ] Provider allowlist is explicit (no wildcard activation)
- [ ] Each production provider has documented data residency and retention verification
- [ ] No silent fallback — every failover is traceable
