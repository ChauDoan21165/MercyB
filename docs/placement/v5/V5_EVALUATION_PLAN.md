# V5 Evaluation Plan

> **Author:** C6 — V5 Evaluation / Test Harness Builder  
> **Status:** PLAN — no production code until C1/C2 approve scope  
> **V4 baseline:** 345/345 tests pass (145 core + 200 telemetry). PRs #968, #988, #989, #991 merged.  
> **V5 inherits from:** V4 core modules, V4 telemetry suite, C4 intelligence proposals, C5 provider/runtime proposals.


## 1. What V4 Tests Already Cover

The V4 test suite (345 tests, 0 failures) provides the regression baseline for V5. V5 must not weaken or remove any of these.

### 1.1 V4 Core Module Tests (145 tests)

| Module | Tests | Key coverage |
|--------|-------|-------------|
| `learnerMemory` | 38 | Event normalization, snapshot build, append-only log, replay reconstruction, merge semantics, confidence decay, skill trends, lesson mastery, CEFR timeline, pruning, serialization/fingerprinting, PII rejection |
| `providerRegistry` | 43 | Provider selection, rejection, failover, trust scoring (penalty audit with component-sum verification), output adjudication (7 verdict classes), boundary enforcement, secret redaction, policy matrix |
| `progressionSimulator` | 5 | A1→A2 advance, A2→B1 advance, plateau, regression, deterministic replay/trace |
| `curriculumSequencer` | 6 | Fatigue pacing, review-loop avoidance, weak-skill prevention, speaking pacing, determinism across 7/28/90-day plans, CEFR recalibration |
| `v4Integration` | 21 | Cross-module: replay order-insensitivity, timeline monotonicity, contradictory memory fingerprints, provider determinism, progression byte-identity, plan identity, scenario invariants |
| `v4ProviderDrift` | 32 | Health transitions (6 states), trust monotonic degradation, 50pt consistency penalty, decision record hash/redact/failover, capability coverage matrix, boundary enforcement |
| `v4TestHarness` | — | 732-line fixture library (scenario builders, identity constants, verification helpers) |

### 1.2 V4 Telemetry Tests (~200 tests)

| Category | Test files | Key coverage |
|----------|-----------|-------------|
| Schema | `schema.test.ts` | Event validation, rejection, type safety |
| Aggregation | `aggregation.test.ts` | Event grouping, merge, canonicalization |
| Effectiveness | `effectiveness.test.ts` | Lesson scoring, CEFR lift, user grouping |
| Retention | `retention.test.ts` | Churn risk, retention signals, stability fingerprint |
| Cohort | `cohort.test.ts`, `cohortAdaptive.test.ts`, `cohortHardening.test.ts` | Drift reports, adaptive cohorts, hardening |
| Replay | `replay.test.ts`, `replayChaos.test.ts` | Deterministic replay, chaos resistance |
| Privacy | `privacy.test.ts` | Redaction, k-anonymity, release aggregation |
| Orchestration | `adaptiveOrchestrator.test.ts`, `orchestrationSnapshot.test.ts` | Event application, snapshot/compact/rebuild |
| Cross-device | `crossDeviceMerge.test.ts` | Merge determinism, convergence, corruption detection |
| Speaking | `speakingRuntimeAdapter.test.ts` | Queue, enqueue, flush, drain, translate |
| Diagnostics | `diagnostics.test.ts`, `adaptiveLoop.test.ts` | Learner diagnostics, adaptive cycle |
| Forecast | `forecastAnalysis.test.ts` | Forecast vs actual, learner summary |
| Intervention | `interventionEngine.test.ts`, `studyPlanTelemetry.test.ts` | Signal computation, plan generation, ingestion |
| Harness | `v4HarnessSelfTest.test.ts` | Fixture determinism, scenario ordering, helpers |

### 1.3 V4 Integration Harness

- `v4Integration.test.ts` — 21 cross-module tests
- `v4ProviderDrift.test.ts` — 32 drift detection tests
- `v4TestHarness.ts` — 732-line fixture library

## 2. What V5 Must Not Regress

V5 is an additive layer over V4. Every V4 test must continue to pass. Specific regression targets:

### 2.1 Deterministic Replay

- `replayEvents` must produce byte-identical projections regardless of event arrival order
- `fingerprintLearnerMemory` must be stable for identical construction sequences
- `buildReplaySnapshot` → `replayFingerprint` must be deterministic

### 2.2 Provider Safety

- Provider selection must never silently degrade to a lower-trust provider without recording it
- Trust score component audit (base − penalties = total) must hold for all health states
- Quarantine windows must be mathematically correct
- Secret redaction must cover all known secret key/value patterns

### 2.3 PII / Privacy

- No real PII in any test fixture
- `redactForRelease` must strip userIdHash from all release artifacts
- No email-shaped identifiers in learner keys, source IDs, or room IDs

### 2.4 Boundary Enforcement

- Production mode must block all providers
- Missing validation markers must block providers
- Unknown trust tiers must always be rejected
- Non-mock providers must be gated behind mockProvidersOnly

### 2.5 Curriculum Integrity

- Fatigued learners must receive reduced daily load
- Weak skills must not be starved across plan lengths
- Speaking avoidance must trigger more frequent speaking practice

## 3. New V5 Benchmark Scenarios

V5 introduces personalization quality, forecast accuracy, and provider-runtime safety. Below are the new benchmark scenarios that V5 must pass.

### 3.1 Personalization Quality Benchmarks

| Scenario | Input | Expected behavior |
|----------|-------|-------------------|
| `personalization-steady-advancer` | A2 learner, 6 study-days/week, 90 min/day, 180-day horizon | Forecast predicts B1 within ±15 days of actual CEFR checkpoint; intervention recommendations ≤ 2 per cycle; no false churn-risk flag |
| `personalization-irregular-learner` | A2 learner, 2 study-days/week, highly variable completion | Forecast confidence intervals widen; burnout flag fires by day 45 if completion drops below 40%; speaking avoidance detected by day 30 if speaking lessons skipped 3+ consecutive times |
| `personalization-plateau-learner` | B1 learner, steady study but no skills advancing past 90 days | Stagnation assessment fires for stagnant skills; recalibration suggests targeted review; no false advancement forecast |
| `personalization-regression-learner` | B1 learner, dropout pressure > 0.7 for 60+ days | Regression detected; recovery plan generated; forecast revised downward; no false "on-track" flag |

### 3.2 Forecast Accuracy Benchmarks

| Scenario | Metric | Threshold |
|----------|--------|-----------|
| `forecast-7day-prediction` | Mean absolute error (MAE) of predicted vs actual CEFR ordinal at day 7 | ≤ 0.5 ordinals |
| `forecast-28day-prediction` | MAE at day 28 | ≤ 1.0 ordinals |
| `forecast-90day-prediction` | MAE at day 90 | ≤ 1.5 ordinals |
| `forecast-confidence-calibration` | % of predictions where actual falls within predicted confidence interval | ≥ 80% |
| `forecast-no-false-advancement` | % of forecasts predicting B1→B2 when learner stays at B1 | ≤ 5% |

### 3.3 Provider/Runtime Safety Benchmarks

| Scenario | Input | Expected behavior |
|----------|-------|-------------------|
| `provider-healthy-to-degraded` | Primary provider error rate climbs from 0→0.2 over 7 days | Degraded status by day 3; failover to secondary by day 5 if error rate stays above 0.15 |
| `provider-quarantine-recovery` | Provider quarantined for 180s, then health resumes | Selection resumes after quarantine window expires; stale-health check does not false-reject |
| `provider-consistency-split` | Two providers disagree on CEFR level (A2 vs B1) | Soft disagreement flagged; human review required; learner-visible output allowed |
| `provider-cost-ceiling` | Estimated cost exceeds ceiling by 2x | Provider rejected with `cost_ceiling_exceeded`; no silent cost overrun |
| `runtime-snapshot-convergence` | Two devices submit snapshots 3 days apart | Merge produces convergence hash; no data loss; vector clock reconciliation |

## 4. Learner Journey Simulation Scenarios

V5 must simulate complete learner journeys end-to-end: placement → curriculum → progression → re-assessment.

### 4.1 Journey Scenarios

| Journey | Start | Path | Expected End |
|---------|-------|------|-------------|
| `journey-a1-to-a2-intensive` | A1, 6 days/week, 90 min/day | 180-day intensive curriculum | A2 at day 120±15, B1 aspirational by day 180 |
| `journey-a2-to-b1-steady` | A2, 5 days/week, 45 min/day | 180-day steady curriculum | B1 at day 150±20 |
| `journey-b1-maintenance` | B1, 3 days/week, 30 min/day | 90-day maintenance plan | B1 sustained; no regression below A2 |
| `journey-new-learner-cold-start` | No prior data | Placement assessment → A1 curriculum → first 7 days | 7-day plan generated; first CEFR checkpoint within 14 days |
| `journey-returning-after-hiatus` | B1, 60-day gap | Re-assessment → recovery plan | Confidence decay applied; re-assessment places at A2/B1 boundary; recovery plan generated |

### 4.2 Journey Assertions

Each journey scenario must assert:
1. Curriculum plan is generated without error
2. Progression simulation produces non-empty trace
3. CEFR checkpoints are recorded at expected intervals
4. No intervention recommendations are contradictory (e.g., "increase study" + "reduce load")
5. Forecast deviations are within acceptable bounds
6. No PII leakage in any log output

## 5. Provider/Runtime Drift Scenarios

V5 extends V4's provider drift tests with runtime-specific scenarios.

### 5.1 Runtime Drift Scenarios

| Scenario | Trigger | Detection |
|----------|---------|-----------|
| `drift-latency-spike` | p95 latency jumps from 100ms → 3000ms in one cycle | Latency ceiling exceeded; provider rejected; failover triggered |
| `drift-auth-degradation` | Auth failure rate climbs 0→0.15 over 3 cycles | Auth penalty accumulates; trust score drops below floor by cycle 3 |
| `drift-quota-exhaustion` | Quota remaining drops from 100→0 | Quota penalty applied (30pts); provider rejected if below minimum trust |
| `drift-inconsistency-flag` | Provider marked inconsistent by cross-reference | Consistency penalty applied (50pts); provider rejected regardless of health |
| `drift-recovery-after-failover` | Primary recovers; secondary was in use | Primary re-selected; failover explanation records the transition |

## 6. Personalization Quality Metrics

V5 must define and measure these quality dimensions:

| Dimension | Metric | Target |
|-----------|--------|--------|
| **Curriculum fit** | % of lessons matching learner's weak skills | ≥ 70% |
| **Pacing appropriateness** | % of plans where daily load ≤ fatigue-adjusted max | 100% |
| **Speaking equity** | Speaking lessons per week for learners with speaking confidence < 0.4 | ≥ 3 |
| **Review spacing** | Mean days between review of same skill | 2–7 days |
| **Challenge progression** | % of challenge lessons at next-higher CEFR level | ≥ 60% |
| **Burnout prevention** | % of fatigued learners receiving light-intensity plans | 100% |
| **No starvation** | Max consecutive days without a weak-skill lesson | ≤ 5 |

## 7. Forecast Accuracy Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| **CEFR MAE (7d)** | mean(abs(predicted_ordinal − actual_ordinal)) | ≤ 0.5 |
| **CEFR MAE (28d)** | as above, 28-day horizon | ≤ 1.0 |
| **CEFR MAE (90d)** | as above, 90-day horizon | ≤ 1.5 |
| **Confidence calibration** | % of actuals within predicted [mean ± 1σ] | ≥ 80% |
| **Directional accuracy** | % of predictions where sign matches actual direction | ≥ 90% |
| **Over-optimism rate** | % of predictions ≥ 1 ordinal above actual | ≤ 10% |

## 8. UX Acceptance Tests

These tests verify that V5's outputs are usable by real learners, not just technically correct.

| Test | Description | Pass criteria |
|------|-------------|---------------|
| `ux-plan-is-readable` | Generated curriculum plan renders without truncation, garbled text, or missing fields | All plans have title, skill, estimated minutes, reason |
| `ux-intervention-is-actionable` | Intervention recommendations include concrete action (not just "improve speaking") | Each recommendation has a suggested lesson or practice type |
| `ux-forecast-is-honest` | Forecast does not claim certainty when confidence is low | Confidence < 0.5 → display as range, not point estimate |
| `ux-no-jargon-leak` | Learner-facing output uses plain language (A1-compatible Vietnamese) | No terms like "ordinal," "penalty," "adjudication" in learner output |
| `ux-deterministic-on-reload` | Same learner state → same plan on page reload | Plan identity matches; no random lesson shuffle |

## 9. Boundary Regression Tests

V5 must not break V4's boundary enforcement. Run these against every V5 build:

| Test | V4 origin | V5 requirement |
|------|-----------|----------------|
| `boundary-production-blocks-all` | `v4ProviderDrift` | Must still pass — production mode blocks all providers |
| `boundary-missing-markers-block` | `v4ProviderDrift` | Must still pass — missing validation markers block providers |
| `boundary-unknown-tier-blocked` | `v4ProviderDrift` | Must still pass — unknown trust tier always rejected |
| `boundary-mock-only-gate` | `v4ProviderDrift` | Must still pass — non-mock blocked when mockProvidersOnly |
| `boundary-privacy-tier-mismatch` | `v4ProviderDrift` | Must still pass — restricted learner + standard provider = blocked |
| `boundary-retention-policy` | `v4ProviderDrift` | Must still pass — storesLearnerContent = blocked for restricted |

## 10. CI Gating Plan

V5 tests run in CI as an additional lane alongside V4:

```
CI Pipeline
├── V4 Core Tests (145 tests) — must always pass
├── V4 Telemetry Tests (~200 tests) — must always pass
├── V5 Contract Inheritance Tests — new lane
├── V5 Personalization Tests — new lane
├── V5 Forecast Quality Tests — new lane
├── V5 Provider Runtime Safety Tests — new lane
├── V5 Integration Tests — new lane
├── V5 Regression Suite (V4 baseline) — new lane
├── Typecheck (tsc --noEmit) — must always pass
├── Lint — 0 errors
└── Module Boundaries — must always pass
```

### Gate Rules

| Gate | Blocks merge? | Rationale |
|------|--------------|-----------|
| V4 regression (any V4 test fails) | **Yes** | V5 must not break V4 |
| V5 contract inheritance (any test fails) | **Yes** | V5 must honor V4 contracts |
| V5 personalization (any test fails) | **Yes** | Core V5 feature |
| V5 forecast quality below threshold | **Yes** | Forecast is safety-critical |
| V5 provider safety (any test fails) | **Yes** | Provider selection is billing-adjacent |
| V5 integration (any test fails) | **Yes** | Cross-module seams must hold |
| Typecheck | **Yes** | Type safety |
| Lint errors (not warnings) | **Yes** | Code quality |
| Module boundaries | **Yes** | Architecture enforcement |

---

**C6 STATUS: V5 EVALUATION PLAN READY**  
**NEXT ROUTE: C1 ROADMAP CONSOLIDATION**
