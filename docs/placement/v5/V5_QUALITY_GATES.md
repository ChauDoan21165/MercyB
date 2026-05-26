# V5 Quality Gates

> **Author:** C6 — V5 Evaluation / Test Harness Builder  
> **Status:** PLAN — no production code until C1/C2 approve scope  
> **V4 baseline:** 345/345 tests pass, 0 skipped, 0 todo, 0 weakened. CI all green.  
> **V5 gates:** Additive — V4 gates remain in force; V5 gates are additional.


## 1. Gate Hierarchy

V5 operates a two-tier gate system:

```
V4 GATES (always enforced)
├── V4 Core Tests (145) — must pass
├── V4 Telemetry Tests (~200) — must pass
├── V4 Typecheck — must pass
├── V4 Lint (0 errors) — must pass
└── V4 Module Boundaries — must pass

V5 GATES (enforced when V5 files are touched)
├── V5 Contract Inheritance (6 tests) — must pass
├── V5 Personalization (12 tests) — must pass
├── V5 Forecast Quality (8 tests) — must pass
├── V5 Provider Runtime (10 tests) — must pass
├── V5 Integration (10 tests) — must pass
├── V5 Regression Baseline (6 tests) — must pass
├── V5 Typecheck — must pass
├── V5 Lint (0 errors) — must pass
└── V5 Personalization Metrics — must meet thresholds
```

## 2. Per-Lane Quality Gates

### 2.1 Contract Inheritance Gate (Lane 1)

**Gate:** V5_CONTRACT_INHERITANCE  
**Blocks merge:** Yes  
**Tests:** 6 minimum

| Contract | Assertion | Failure means |
|----------|-----------|---------------|
| `LearnerMemorySummaryLike` | V5 memory passes type-check against V4 interface | V5 broke the memory contract; V4 telemetry can't consume V5 data |
| `StudyPlanLike` | V5 curriculum output matches V4 interface | V5 broke the plan contract; V4 adapters can't consume V5 plans |
| `ForecastLike` | V5 simulator output matches V4 interface | V5 broke the forecast contract; V4 forecast analysis breaks |
| `PlacementV4ProviderDescriptor` | V5 providers are valid V4 descriptors | V5 broke the provider contract; V4 registry can't select V5 providers |
| `OrchestratorState` | V5 state is compatible with V4 orchestrator | V5 broke the orchestrator contract; V4 snapshots can't rebuild V5 state |
| `TelemetryEvent` | V5 events pass V4 schema validation | V5 broke the event contract; V4 aggregation can't process V5 events |

**Pass threshold:** 6/6 must pass. Any failure blocks merge.

### 2.2 Personalization Gate (Lane 2)

**Gate:** V5_PERSONALIZATION  
**Blocks merge:** Yes  
**Tests:** 12 minimum

| # | Test | Quality dimension | Threshold |
|---|------|-----------------|-----------|
| 1 | Steady advancer pacing | Pacing appropriateness | Plan intensity matches learner profile |
| 2 | Irregular learner burnout | Burnout prevention | Burnout detected by day 45 if completion < 40% |
| 3 | Plateau learner recalibration | Stagnation assessment | Recalibration within 7 days of plateau |
| 4 | Regressing learner recovery | Regression detection | Recovery plan (not accelerated) issued |
| 5 | Cold start plan generation | Curriculum fit | 7-day A1 plan, no missing fields |
| 6 | Weak skill coverage | Curriculum fit | ≥ 70% of lesson slots target weak skills |
| 7 | Speaking equity | Speaking equity | ≥ 3 speaking lessons/week when confidence < 0.4 |
| 8 | Fatigue load reduction | Burnout prevention | ≤ 2 lessons/day when fatigue ≥ 0.72 |
| 9 | No skill starvation | No starvation | ≤ 5 consecutive days without weak-skill lesson |
| 10 | Challenge progression | Challenge progression | ≥ 60% of challenges at next-higher CEFR |
| 11 | Review spacing | Review spacing | 2–7 days between reviews of same skill |
| 12 | Non-contradictory interventions | Intervention quality | No "increase study" + "reduce load" pair |

**Pass threshold:** 12/12 must pass. Any failure blocks merge.

### 2.3 Forecast Quality Gate (Lane 3)

**Gate:** V5_FORECAST_QUALITY  
**Blocks merge:** Yes  
**Tests:** 8 minimum

| # | Test | Metric | Threshold |
|---|------|--------|-----------|
| 1 | 7-day CEFR MAE | Mean absolute error | ≤ 0.5 CEFR ordinals |
| 2 | 28-day CEFR MAE | Mean absolute error | ≤ 1.0 CEFR ordinals |
| 3 | 90-day CEFR MAE | Mean absolute error | ≤ 1.5 CEFR ordinals |
| 4 | Confidence calibration | Calibration | ≥ 80% within predicted interval |
| 5 | Directional accuracy | Direction | ≥ 90% correct sign |
| 6 | Over-optimism rate | Over-optimism | ≤ 10% over-predicting |
| 7 | Sparse data degradation | Graceful degradation | Forecast with ≤ 3 points returns wider intervals |
| 8 | Zero-data handling | Edge case | Forecast returns null/undefined for 0 data points |

**Pass threshold:** 8/8 must pass. Thresholds 1–6 are metric-based; thresholds 7–8 are behavioral.

### 2.4 Provider Runtime Safety Gate (Lane 4)

**Gate:** V5_PROVIDER_RUNTIME_SAFETY  
**Blocks merge:** Yes  
**Tests:** 10 minimum

| # | Test | Safety dimension | Failure means |
|---|------|-----------------|---------------|
| 1 | Healthy→degraded failover | Failover timing | Failover not triggered → silent degradation |
| 2 | Quarantine recovery | Recovery safety | Recovered provider not re-selected → permanent degradation |
| 3 | Inconsistency rejection | Consistency safety | Inconsistent provider selected → wrong CEFR placement |
| 4 | Cost ceiling rejection | Cost safety | Cost overrun accepted → billing surprise |
| 5 | Latency spike rejection | Latency safety | Slow provider selected → UX timeout |
| 6 | Auth degradation | Trust degradation | Auth failures ignored → security risk |
| 7 | Quota exhaustion | Quota safety | Exhausted provider selected → runtime error |
| 8 | Failover explanation | Audit trail | No explanation → operator can't diagnose |
| 9 | Decision record hash | Audit integrity | Hash mismatch → record tampered |
| 10 | Snapshot convergence | Cross-device safety | Divergent snapshots → data loss |

**Pass threshold:** 10/10 must pass. Any failure blocks merge.

### 2.5 Integration Gate (Lane 5)

**Gate:** V5_INTEGRATION  
**Blocks merge:** Yes  
**Tests:** 10 minimum

| # | Test | Seam verified |
|---|------|--------------|
| 1 | Journey A1→A2 intensive | curriculumSequencer ↔ progressionSimulator |
| 2 | Journey A2→B1 steady | curriculumSequencer ↔ progressionSimulator (long horizon) |
| 3 | Journey B1 maintenance | curriculumSequencer ↔ learnerMemory (no regression) |
| 4 | Journey cold start | All modules from zero state |
| 5 | Journey returning learner | learnerMemory decay ↔ curriculumSequencer recovery |
| 6 | V5 events → V4 schema | V5 telemetry ↔ V4 schema |
| 7 | V5 aggregation ↔ V4 aggregation | V5 aggregation ↔ V4 aggregation |
| 8 | V5 replay ↔ V4 fingerprint | V5 replay ↔ V4 replay |
| 9 | V5 provider ↔ V4 policy | V5 providerRegistry ↔ V4 policy matrix |
| 10 | V5 orchestrator ↔ V4 snapshot | V5 orchestrator ↔ V4 snapshot/rebuild |

**Pass threshold:** 10/10 must pass. Any failure blocks merge.

### 2.6 Regression Baseline Gate (Lane 6)

**Gate:** V5_REGRESSION_BASELINE  
**Blocks merge:** Yes  
**Tests:** 6 minimum

| # | Test | V4 category verified |
|---|------|---------------------|
| 1 | V4 learnerMemory with V5 loaded | learnerMemory |
| 2 | V4 providerRegistry boundary with V5 loaded | providerRegistry |
| 3 | V4 progressionSimulator replay with V5 loaded | progressionSimulator |
| 4 | V4 curriculumSequencer determinism with V5 loaded | curriculumSequencer |
| 5 | V4 integration replay with V5 loaded | cross-module replay |
| 6 | V4 provider drift health with V5 loaded | provider drift |

**Pass threshold:** 6/6 must pass. Any failure means V5 broke V4 and merge is blocked.

## 3. Metric Threshold Enforcement

### 3.1 Personalization Metrics

| Metric | Min | Max | Enforcement |
|--------|-----|-----|-------------|
| Curriculum fit (% weak skill coverage) | 70% | — | Test assertion |
| Pacing (daily load ≤ fatigue max) | 100% | — | Test assertion |
| Speaking equity (lessons/week, low confidence) | 3 | — | Test assertion |
| Review spacing (days between reviews) | 2 | 7 | Test assertion |
| Challenge progression (% at next CEFR) | 60% | — | Test assertion |
| Burnout prevention (% light plans, fatigued) | 100% | — | Test assertion |
| Skill starvation (max consecutive days) | — | 5 | Test assertion |

### 3.2 Forecast Metrics

| Metric | Max | Enforcement |
|--------|-----|-------------|
| CEFR MAE (7-day) | 0.5 ordinals | Numeric assertion |
| CEFR MAE (28-day) | 1.0 ordinals | Numeric assertion |
| CEFR MAE (90-day) | 1.5 ordinals | Numeric assertion |
| Confidence calibration | ≥ 80% | Numeric assertion |
| Directional accuracy | ≥ 90% | Numeric assertion |
| Over-optimism rate | ≤ 10% | Numeric assertion |

### 3.3 Provider Safety Metrics

| Metric | Threshold | Enforcement |
|--------|-----------|-------------|
| Failover latency | ≤ 2 cycles | Behavioral assertion |
| Quarantine window correctness | Exact math | Numeric assertion |
| Trust score component audit | base − penalties = total | Numeric assertion |
| Decision record hash stability | Deterministic | Equality assertion |
| Secret redaction completeness | All patterns covered | String assertion |

## 4. CI Enforcement Rules

### 4.1 When Gates Run

| Trigger | Gates run |
|---------|-----------|
| Push to any branch touching `src/lib/placement/v5/**` | V4 gates + V5 gates |
| Push to any branch touching `src/lib/placement/v4/**` | V4 gates only |
| Push to any branch touching neither | V4 gates only |
| PR targeting `main` | V4 gates + V5 gates (if V5 files present) |

### 4.2 Gate Failure Actions

| Gate | Action on failure |
|------|------------------|
| V4 Core Tests | ❌ Block merge, notify B-series |
| V4 Telemetry Tests | ❌ Block merge, notify B-series |
| V5 Contract Inheritance | ❌ Block merge, notify C6 |
| V5 Personalization | ❌ Block merge, notify C4/C6 |
| V5 Forecast Quality | ❌ Block merge, notify C4/C6 |
| V5 Provider Runtime | ❌ Block merge, notify C5/C6 |
| V5 Integration | ❌ Block merge, notify C6 |
| V5 Regression Baseline | ❌ Block merge, notify B6/C6 |
| Typecheck | ❌ Block merge |
| Lint (errors) | ❌ Block merge |

### 4.3 Gate Override Policy

No gate may be bypassed without:
1. A documented reason in the PR body
2. Approval from the gate owner (B6 for V4, C6 for V5)
3. A tracking issue for the override expiration

Overrides without all three are invalid and block merge.

## 5. Phase Progression Gates

V5 development proceeds through phases. Each phase has a quality gate that must pass before the next phase begins.

### Phase 1: Discovery (current)
- **Gate:** V5_CONTRACT_INHERITANCE must be designed (tests may be TODO)
- **Blocks:** Phase 2 (implementation)

### Phase 2: Core Implementation
- **Gate:** V5_CONTRACT_INHERITANCE must pass (all 6 tests)
- **Gate:** V5_REGRESSION_BASELINE must pass (all 6 tests)
- **Blocks:** Phase 3 (personalization)

### Phase 3: Personalization
- **Gate:** V5_PERSONALIZATION must pass (all 12 tests)
- **Gate:** V5_INTEGRATION must pass (all 10 tests)
- **Blocks:** Phase 4 (forecast)

### Phase 4: Forecast + Provider Runtime
- **Gate:** V5_FORECAST_QUALITY must pass (all 8 tests)
- **Gate:** V5_PROVIDER_RUNTIME_SAFETY must pass (all 10 tests)
- **Blocks:** Merge to main

## 6. Acceptance Criteria Summary

V5 is accepted for merge when:

- [ ] V4 gates: all pass (345/345 tests)
- [ ] V5 Contract Inheritance: 6/6 pass
- [ ] V5 Personalization: 12/12 pass
- [ ] V5 Forecast Quality: 8/8 pass
- [ ] V5 Provider Runtime: 10/10 pass
- [ ] V5 Integration: 10/10 pass
- [ ] V5 Regression Baseline: 6/6 pass
- [ ] Typecheck: clean
- [ ] Lint: 0 errors
- [ ] Module boundaries: pass
- [ ] No skipped/todo tests in V5 suite
- [ ] No weakened V4 assertions
- [ ] No global test setup changes

**Total minimum V5 tests: 52**  
**Total minimum combined (V4 + V5): 397**

---

**C6 STATUS: V5 QUALITY GATES READY**  
**NEXT ROUTE: C1 ROADMAP CONSOLIDATION**
