# V5 Test Harness Plan

> **Author:** C6 — V5 Evaluation / Test Harness Builder  
> **Status:** PLAN — no production code until C1/C2 approve scope  
> **V4 baseline:** `v4TestHarness.ts` (732 lines), `v4TelemetryHarness.ts` (447 lines), `v4HarnessSelfTest.test.ts` (31 tests)  
> **V5 inherits from:** V4 harness patterns, C4 intelligence proposals, C5 provider/runtime proposals.


## 1. Harness Philosophy

The V5 harness extends V4's deterministic, zero-randomness, fixture-first approach. Every V5 test lane gets its own harness file that inherits from V4 fixtures and adds V5-specific scenario builders.

### 1.1 Principles (unchanged from V4)

1. **Zero randomness.** No `Math.random()`, no `Date.now()`, no `crypto.getRandomValues()`. All values are seed-derived or declared inline.
2. **Pure functions.** Factories accept explicit inputs and return fresh objects. No mutable module-level state beyond id counters.
3. **Idempotent.** Same inputs → same outputs (reset id counters first).
4. **No Vitest imports in harness files.** Harness exports plain TS; tests import from `vitest`.
5. **No global test setup.** Harness lives entirely within V5-local test directories. Never touches `src/test/setup.ts`.

### 1.2 New V5 Principles

6. **Contract inheritance.** V5 harness files import V4 harness factories and extend them. V4 fixture behavior is never monkey-patched — only wrapped or composed.
7. **Scenario diversity.** Each V5 test lane gets scenarios spanning at least 3 learner archetypes (steady, irregular, regressing).
8. **Metric collection.** Harness provides lightweight metric-collection helpers (MAE, calibration, directional accuracy) for forecast quality tests.
9. **No brittle snapshots.** Inline assertions preferred over snapshot files. Snapshot testing reserved for serialization format stability only.

## 2. Test Lane Architecture

V5 tests are organized into 6 lanes, each with its own harness file and test suite.

```
src/lib/placement/v5/
├── __tests__/
│   ├── v5Harness.ts                    # Root V5 harness (inherits from v4TestHarness)
│   ├── v5ContractInheritance.test.ts   # Lane 1
│   ├── v5Personalization.test.ts       # Lane 2
│   ├── v5ForecastQuality.test.ts       # Lane 3
│   ├── v5ProviderRuntime.test.ts       # Lane 4
│   ├── v5Integration.test.ts           # Lane 5
│   └── v5RegressionBaseline.test.ts    # Lane 6
├── harness/
│   ├── v5PersonalizationHarness.ts     # Lane 2 fixtures
│   ├── v5ForecastHarness.ts            # Lane 3 fixtures + metric helpers
│   ├── v5ProviderRuntimeHarness.ts     # Lane 4 fixtures
│   └── v5JourneyHarness.ts             # Shared journey scenario builders
└── index.ts                            # V5 barrel exports
```

### 2.1 Lane 1: Contract Inheritance Tests

**File:** `v5ContractInheritance.test.ts`  
**Harness:** `v5Harness.ts` (imports + re-exports from `v4TestHarness`)  
**Purpose:** Verify that V5 modules satisfy V4's type contracts without modification.

**Tests:**
| Test | What it verifies |
|------|-----------------|
| `v5 learnerMemory satisfies LearnerMemorySummaryLike` | V5's learner memory can be passed to any function accepting V4's `LearnerMemorySummaryLike` |
| `v5 curriculumSequencer satisfies StudyPlanLike` | V5's curriculum output matches V4's `StudyPlanLike` contract |
| `v5 progressionSimulator satisfies ForecastLike` | V5's simulator output matches V4's `ForecastLike` contract |
| `v5 providerRegistry satisfies PlacementV4ProviderDescriptor` | V5 providers are valid V4 descriptors |
| `v5 orchestrator state satisfies OrchestratorState` | V5 state is compatible with V4 orchestrator |
| `v5 events satisfy TelemetryEvent` | V5 events pass V4's `telemetryEventSchema` |

### 2.2 Lane 2: Personalization Scenario Tests

**File:** `v5Personalization.test.ts`  
**Harness:** `v5PersonalizationHarness.ts`  
**Purpose:** Verify personalization quality against the metrics defined in the evaluation plan.

**Fixture archetypes:**
| Archetype | Profile | Use in tests |
|-----------|---------|-------------|
| `steadyAdvancer()` | 6 days/week, 90 min/day, high completion | Forecast accuracy, curriculum fit |
| `irregularLearner()` | 2 days/week, variable completion, high dropout variance | Burnout detection, speaking avoidance |
| `plateauLearner()` | Steady study, no skill advancement past 90 days | Stagnation assessment, recalibration |
| `regressingLearner()` | High dropout pressure, declining scores | Regression detection, recovery plans |
| `coldStartLearner()` | No prior data, first session | Cold-start plan generation |

**Tests (minimum 12):**
1. `steady advancer receives challenging plan with appropriate pacing`
2. `irregular learner triggers burnout detection by day 45`
3. `plateau learner receives recalibration suggestion within 7 days of plateau`
4. `regressing learner receives recovery plan (not accelerated plan)`
5. `cold start learner receives 7-day A1 plan with no missing fields`
6. `weak skills receive ≥ 70% of lesson slots`
7. `speaking confidence < 0.4 → ≥ 3 speaking lessons per week`
8. `fatigue score ≥ 0.72 → light intensity plan (≤ 2 lessons/day)`
9. `no skill starved for > 5 consecutive days`
10. `challenge lessons are at next-higher CEFR level ≥ 60% of the time`
11. `review spacing is between 2–7 days for the same skill`
12. `intervention recommendations are non-contradictory`

### 2.3 Lane 3: Forecast Quality Tests

**File:** `v5ForecastQuality.test.ts`  
**Harness:** `v5ForecastHarness.ts` (includes metric-collection helpers)  
**Purpose:** Verify forecast accuracy against the thresholds in the evaluation plan.

**Metric collection helpers:**
```typescript
// In v5ForecastHarness.ts
export function computeMAE(predictions: number[], actuals: number[]): number
export function computeCalibration(predictions: ForecastPoint[], actuals: number[]): number
export function computeDirectionalAccuracy(predictions: number[], actuals: number[]): number
export function computeOverOptimismRate(predictions: number[], actuals: number[]): number
```

**Tests (minimum 8):**
1. `7-day CEFR forecast MAE ≤ 0.5 ordinals`
2. `28-day CEFR forecast MAE ≤ 1.0 ordinals`
3. `90-day CEFR forecast MAE ≤ 1.5 ordinals`
4. `confidence calibration ≥ 80% (actual within predicted interval)`
5. `directional accuracy ≥ 90%`
6. `over-optimism rate ≤ 10%`
7. `forecast degrades gracefully with sparse data (≤ 3 data points)`
8. `forecast returns null/undefined for learners with zero data points`

### 2.4 Lane 4: Provider Runtime Safety Tests

**File:** `v5ProviderRuntime.test.ts`  
**Harness:** `v5ProviderRuntimeHarness.ts`  
**Purpose:** Verify provider selection safety at runtime, extending V4's drift tests.

**Tests (minimum 10):**
1. `healthy → degraded transition triggers failover within 2 cycles`
2. `quarantined provider recovers and is re-selected after expiry`
3. `inconsistent provider is rejected even when healthy`
4. `cost ceiling exceeded → rejection with cost_ceiling_exceeded reason`
5. `latency spike above threshold → rejection with latency_ceiling_exceeded`
6. `auth degradation → trust score drops below minimum within 3 cycles`
7. `quota exhaustion → provider rejected with 30pt quota penalty`
8. `failover explanation includes reason for every rejected candidate`
9. `decision record hash is deterministic and redacts secrets`
10. `snapshot convergence produces matching content hash across device merges`

### 2.5 Lane 5: Integration Tests

**File:** `v5Integration.test.ts`  
**Harness:** `v5Harness.ts`  
**Purpose:** End-to-end journey simulations and cross-module seam verification.

**Tests (minimum 10):**
1. `journey a1→a2 intensive: curriculum → progression → checkpoints match`
2. `journey a2→b1 steady: 180-day simulation reaches B1`
3. `journey b1 maintenance: 90-day plan sustains B1 without regression`
4. `journey cold start: placement → plan → first checkpoint within 14 days`
5. `journey returning learner: confidence decay → re-assessment → recovery plan`
6. `v5 events pass v4 schema validation`
7. `v5 aggregation output is mergeable with v4 aggregation`
8. `v5 replay snapshot is compatible with v4 replay fingerprint`
9. `v5 provider selection honors v4 policy matrix`
10. `v5 orchestrator state can be snapshotted and rebuilt by v4`

### 2.6 Lane 6: Regression Baseline Tests

**File:** `v5RegressionBaseline.test.ts`  
**Harness:** `v5Harness.ts` (re-exports V4 fixtures unchanged)  
**Purpose:** Re-run V4's key assertions against V5 to catch regressions.

**Tests (minimum 6):**
1. `v4 learnerMemory tests pass with v5 module loaded`
2. `v4 providerRegistry boundary tests pass with v5 module loaded`
3. `v4 progressionSimulator replay tests pass with v5 module loaded`
4. `v4 curriculumSequencer determinism tests pass with v5 module loaded`
5. `v4 integration replay order-insensitivity holds with v5`
6. `v4 provider drift health transitions hold with v5`

## 3. Harness File Specifications

### 3.1 `v5Harness.ts` — Root Harness

```typescript
// Re-exports everything from v4TestHarness unchanged
export * from "../../v4/__tests__/v4TestHarness";

// V5-specific identity constants
export const V5_LEARNERS = { ... };
export const V5_PROVIDERS = { ... };

// V5 scenario builder (delegates to V4 factories)
export function v5JourneyScenario(config: JourneyConfig): V5Journey { ... }
```

### 3.2 `v5PersonalizationHarness.ts` — Personalization Fixtures

```typescript
import { snapshotFixture, populatedMemory } from "../../v4/__tests__/v4TestHarness";

export function steadyAdvancer(): PersonalizationProfile { ... }
export function irregularLearner(): PersonalizationProfile { ... }
export function plateauLearner(): PersonalizationProfile { ... }
export function regressingLearner(): PersonalizationProfile { ... }
export function coldStartLearner(): PersonalizationProfile { ... }
```

### 3.3 `v5ForecastHarness.ts` — Forecast Fixtures + Metrics

```typescript
export interface ForecastPoint {
  day: number;
  predictedOrdinal: number;
  actualOrdinal: number;
  confidence: number;
}

export function computeMAE(predictions: number[], actuals: number[]): number { ... }
export function computeCalibration(points: ForecastPoint[]): number { ... }
export function computeDirectionalAccuracy(predictions: number[], actuals: number[]): number { ... }
export function computeOverOptimismRate(predictions: number[], actuals: number[]): number { ... }

export function forecastScenario7Day(): ForecastPoint[] { ... }
export function forecastScenario28Day(): ForecastPoint[] { ... }
export function forecastScenario90Day(): ForecastPoint[] { ... }
```

### 3.4 `v5ProviderRuntimeHarness.ts` — Provider Runtime Fixtures

```typescript
import {
  healthyHealth, failingHealth, degradedHealth, quarantinedHealth,
  selectionRequest, healthMapFor,
} from "../../v4/__tests__/v4TestHarness";

export function runtimeScenarioHealthyToDegraded(): RuntimeTimeline { ... }
export function runtimeScenarioQuarantineRecovery(): RuntimeTimeline { ... }
export function runtimeScenarioConsistencySplit(): RuntimeTimeline { ... }
export function runtimeScenarioCostCeiling(): RuntimeTimeline { ... }
```

### 3.5 `v5JourneyHarness.ts` — Journey Scenario Builders

```typescript
import {
  snapshotFixture, populatedMemory, emptyMemory,
  placementInput, intenseStudyAssumptions, weakStudyAssumptions,
  freshLearner, experiencedLearner, fatiguedLearner,
} from "../../v4/__tests__/v4TestHarness";

export interface V5Journey {
  label: string;
  learnerKey: string;
  curriculumPlan: StudyPlanLike;
  progressionResult: ProgressionSimulationResult;
  forecastPoints: ForecastPoint[];
  interventions: InterventionRecommendation[];
}

export function journeyA1toA2Intensive(): V5Journey { ... }
export function journeyA2toB1Steady(): V5Journey { ... }
export function journeyB1Maintenance(): V5Journey { ... }
export function journeyColdStart(): V5Journey { ... }
export function journeyReturningAfterHiatus(): V5Journey { ... }
```

## 4. V5 Directory Structure

```
src/lib/placement/v5/
├── index.ts                          # V5 barrel exports
├── v5CurriculumSequencer.ts          # V5 curriculum (extends V4)
├── v5LearnerMemory.ts               # V5 learner memory (extends V4)
├── v5ProgressionSimulator.ts        # V5 progression (extends V4)
├── v5ProviderRegistry.ts            # V5 provider registry (extends V4)
├── v5PersonalizationEngine.ts       # NEW: personalization logic
├── v5ForecastEngine.ts              # NEW: forecast logic
├── v5RuntimeManager.ts              # NEW: runtime provider management
├── __tests__/
│   ├── v5Harness.ts
│   ├── v5ContractInheritance.test.ts
│   ├── v5Personalization.test.ts
│   ├── v5ForecastQuality.test.ts
│   ├── v5ProviderRuntime.test.ts
│   ├── v5Integration.test.ts
│   └── v5RegressionBaseline.test.ts
├── harness/
│   ├── v5PersonalizationHarness.ts
│   ├── v5ForecastHarness.ts
│   ├── v5ProviderRuntimeHarness.ts
│   └── v5JourneyHarness.ts
└── README.md
```

## 5. Forbidden Patterns

V5 must never:

1. **Import from `src/test/setup.ts` or `src/test/storageMock.ts`** — harness is self-contained
2. **Mutate V4 fixtures** — V4 factories are composed, not monkey-patched
3. **Use real PII** — all learner keys are opaque hashes
4. **Use network calls** — all providers are mock; all data is inline
5. **Use `Date.now()` or `Math.random()`** — deterministic seeds only
6. **Add snapshot files without justification** — inline assertions preferred
7. **Skip V4 tests** — V4 suite must pass alongside V5
8. **Add global test setup** — everything is V5-local

## 6. Minimum Test Counts

| Lane | Minimum tests | Rationale |
|------|--------------|-----------|
| Contract Inheritance | 6 | One per V4 contract type |
| Personalization | 12 | Covers all 7 quality metrics + 5 archetypes |
| Forecast Quality | 8 | Covers 6 accuracy metrics + 2 edge cases |
| Provider Runtime | 10 | Covers all 5 drift scenarios + 5 safety checks |
| Integration | 10 | Covers all 5 journey scenarios + 5 seam checks |
| Regression Baseline | 6 | One per V4 test category |
| **Total minimum** | **52** | |

---

**C6 STATUS: V5 TEST HARNESS PLAN READY**  
**NEXT ROUTE: C1 ROADMAP CONSOLIDATION**
