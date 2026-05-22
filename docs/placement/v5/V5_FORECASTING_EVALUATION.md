# V5 Forecasting & Evaluation Framework

**Author:** C4 — V5 Intelligence / Personalization Builder
**Date:** 2026-05-21
**Baseline:** `3be4e6ef1` (V4 stack complete)
**Status:** DISCOVERY — no production code

---

## 1. Current V4 Forecasting Capability

V4's `forecastAnalysis.ts` provides:

- `analyzeForecastVsActual(forecast, actuals, options)` → `ForecastDeviationReport`
  - Single forecast compared to observed actuals
  - Deviation codes: `forecast_error_above_tolerance`, `false_acceleration`, `stagnation_against_forecast`, `weak_skill_prediction_miss`
  - Recalibration suggestions: `rerun_placement`, `drop_speaking_acceleration`
- `summarizeForecastForLearner(report)` → learner-readable summary string

**Limitations:**
- Point estimate only (no confidence intervals)
- Single forecast strategy (no ensemble)
- Binary recalibration (no continuous adjustment)
- No what-if / scenario analysis
- No cohort-benchmarked baseline for comparison

---

## 2. V5 Forecasting Architecture

### 2.1 Multi-Strategy Ensemble

```
Learner State
    │
    ├──► Strategy 1: Linear Projection
    │         gain = studyHours * avgCefrGainPerHour
    │
    ├──► Strategy 2: Skill-Weighted Projection
    │         gain = Σ(skillWeight × skillGainRate × practiceCount)
    │
    └──► Strategy 3: Cohort-Benchmarked Projection
              gain = average gain of k-anonymized similar learners
```

**Ensemble report:**
```typescript
interface ForecastEnsembleReport {
  strategies: ForecastStrategyReport[];
  /** Best-performing strategy by historical error */
  bestStrategy: string;
  /** Blended forecast using inverse-error-weighted average */
  blendedForecast: ForecastLike;
  /** Agreement score — how well the strategies agree (0..1) */
  strategyAgreement: number;
}

interface ForecastStrategyReport {
  strategyId: string;
  forecast: ForecastLike;
  /** Mean absolute error on historical data (if available) */
  historicalMae: number | null;
  /** Weight in the blend (higher = more trusted) */
  blendWeight: number;
}
```

### 2.2 Forecasting Strategies

#### Strategy 1: Linear Projection

```
cefrAtDay(day) = currentCefr + (day / 30) * gainRatePerMonth
gainRatePerMonth = 0.15  // default: ~1 CEFR level per 6-7 months of steady study
```

- Fastest to compute
- Ignores skill-level variation
- Good baseline; poor for learners with uneven skill profiles

#### Strategy 2: Skill-Weighted Projection

```
cefrAtDay(skill, day) = currentCefr(skill) +
  Σ(practiceCount[skill] * gainPerPractice[skill][cefrBand])
```

- Accounts for per-skill practice history
- Accounts for CEFR-band-specific difficulty (A1→A2 is faster than B2→C1)
- Requires per-skill gain rate lookup table (seeded from cohort data, then adjusted per-learner)

#### Strategy 3: Cohort-Benchmarked Projection

```
cefrAtDay(day) = currentCefr + medianCohortGain(cohort, day)
cohort = learners with same: targetLang, nativeLang, startingCefrBand, ageBucket
```

- Requires k-anonymized cohort data (k >= 10)
- Most accurate for learners matching a well-populated cohort
- Degrades gracefully: if cohort size < k, falls back to Strategy 2

### 2.3 Confidence Bands

Each forecast target carries a confidence interval:

```typescript
interface ForecastSkillTargetLike {
  skill: Skill;
  targetCefr: CEFRLevel;
  /** 50th percentile (best estimate) */
  targetDayP50: number;
  /** 10th percentile (optimistic — reaches target faster) */
  targetDayP10: number;
  /** 90th percentile (pessimistic — reaches target slower) */
  targetDayP90: number;
  /** Confidence in this target (0..1, derived from historical accuracy) */
  confidence: number;
}
```

**Band width** is proportional to:
- Days into the future (wider for longer horizons)
- Learner variability (wider for inconsistent study patterns)
- Cohort size (wider for small cohorts)

**Deviation detection:**
- Actuals inside [p10, p90]: expected variance — no alert
- Actuals outside [p10, p90]: flagged as significant deviation
- Actuals outside [p5, p95]: flagged as severe deviation — triggers recalibration

---

## 3. Evaluation Framework

### 3.1 Evaluation Metrics

| Metric | Formula | Target | Measurement Cadence |
|--------|---------|--------|---------------------|
| **MAE** (Mean Absolute Error) | `mean(abs(forecast - actual))` across all skills at day 30/60/90 | < 0.3 CEFR levels | Per learner, per plan cycle |
| **RMSE** (Root Mean Square Error) | `sqrt(mean((forecast - actual)²))` | < 0.5 CEFR levels | Per cohort, monthly |
| **Coverage** | % of actuals falling within [p10, p90] band | > 80% | Per strategy, monthly |
| **Calibration Error** | `abs(observedCoverage - expectedCoverage)` where expected = 0.80 | < 0.10 | Per strategy, monthly |
| **Strategy Win Rate** | % of learners where this strategy had lowest MAE | N/A (informational) | Per cohort, monthly |
| **Ensemble Improvement** | `(bestSingleMAE - blendedMAE) / bestSingleMAE` | > 5% | Per learner, per plan cycle |

### 3.2 A/B Evaluation Design

```
Group A (control):  V4 linear forecast only
Group B (variant):  V5 ensemble forecast with confidence bands
```

Both groups receive identical curriculum plans. Only the forecast presented to the learner (and used for deviation alerts) differs.

**Metrics compared:**
- Forecast MAE at 30/60/90 days
- Intervention rate (does better forecasting reduce unnecessary interventions?)
- Learner engagement (do confidence bands increase trust/retention?)

### 3.3 Replay-Based Backtesting

Before deploying V5 forecasting to live learners, backtest on historical data:

1. **Input**: 90-day event history for N learners (k-anonymized)
2. **Window**: sliding 30-day forecast window, advance 7 days, repeat
3. **Compare**: V4 point forecast vs. V5 ensemble forecast vs. V5 blended forecast
4. **Output**: per-strategy MAE, coverage, calibration error across all windows

**Pass criteria:**
- V5 blended MAE < V4 MAE for > 80% of learners
- V5 coverage > 70% (may be lower for backtest due to smaller cohort pools)
- Zero determinism regressions (all V4 replay tests still pass)

### 3.4 Cohort Simulation

```typescript
function simulateCohortForecast(
  learnerStates: LearnerStateSummary[],
  strategy: ForecastStrategy,
  horizonDays: number,
): CohortForecastReport {
  // Group learners by cohort key
  // For each learner, run the forecast strategy
  // Compare against actual outcomes (from event log)
  // Report per-cohort MAE, coverage, calibration
}
```

---

## 4. Continuous Recalibration

### 4.1 Error-Weighted Parameter Adjustment

Rather than binary recalibration (V4 approach), V5 uses continuous parameter adjustment:

```typescript
function recalibrateForecast(
  currentParams: ForecastParams,
  errorHistory: ForecastError[],
): ForecastParams {
  // Error history: array of (forecast, actual, day) tuples
  // Recent errors weighted more heavily (exponential decay, half-life = 30 days)

  const weightedError = errorHistory
    .map((e) => ({
      error: e.actual - e.forecast,
      weight: Math.pow(0.5, (today - e.day) / 30),
    }));

  const totalWeight = weightedError.reduce((s, e) => s + e.weight, 0);
  const adjustment = weightedError.reduce((s, e) => s + e.error * e.weight, 0) / totalWeight;

  return {
    ...currentParams,
    gainRatePerMonth: currentParams.gainRatePerMonth + adjustment * 0.3, // nudge factor
  };
}
```

### 4.2 Recalibration Triggers

Recalibration fires when:
1. Coverage drops below 70% (actuals consistently outside [p10, p90])
2. MAE exceeds 0.5 CEFR levels over a 30-day window
3. Strategy win rate shifts (a previously-best strategy becomes worst)
4. Cohort size changes significantly (new learners join/drop)

---

## 5. Integration with V4

### 5.1 Forecast Adapter Extension

V5 extends the V4 `ForecastLike` contract with optional confidence band fields:

```typescript
// V4 contract (unchanged)
interface ForecastLike {
  planVersion: string;
  generatedAtMs: number;
  skillTargets: ForecastSkillTargetLike[];
}

// V5 extension (backward-compatible via optional fields)
interface V5ForecastSkillTargetLike extends ForecastSkillTargetLike {
  targetDayP10?: number;
  targetDayP90?: number;
  confidence?: number;
  strategyId?: string;
}
```

### 5.2 AdaptiveLoop Extension

```typescript
// V4 (unchanged)
interface AdaptiveLoopInput {
  snapshot: ProgressionSnapshotLike;
  aggregation: AggregationSummary;
  memory?: LearnerMemorySummaryLike;
  forecast?: ForecastLike;
  // ...
}

// V5 extension
interface V5AdaptiveLoopInput extends AdaptiveLoopInput {
  forecastEnsemble?: ForecastEnsemble;       // replaces single forecast
  forecastStrategyPreference?: string;       // "blended" | "linear" | "weighted" | "cohort"
}
```

### 5.3 Evaluation Harness Interface (for C6)

```typescript
interface V5EvaluationHarness {
  /** Compare V4 vs V5 forecast on identical learner state */
  compareForecast(
    state: LearnerStateSummary,
    horizonDays: number,
  ): ForecastComparison;

  /** Replay historical event log through both V4 and V5 forecasting */
  backtestForecast(
    events: TelemetryEvent[],
    horizonDays: number,
  ): BacktestResult;

  /** Simulate cohort-level forecast accuracy */
  simulateCohort(
    learnerStates: LearnerStateSummary[],
    strategyId: string,
    horizonDays: number,
  ): CohortForecastReport;
}
```

---

## 6. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Ensemble reduces to linear projection (Strategy 2/3 never outperform) | Medium | Low — baseline unchanged | Gate: if ensemble MAE > linear MAE for 30 days, fall back to linear-only |
| Confidence bands too wide to be useful | Medium | Low — learner trust | Calibrate band width against historical coverage; target 80% |
| Cohort-benchmarked strategy has cold-start problem (no cohort data for new learners) | High | Medium — inaccurate early forecasts | Fall back to Strategy 2 for first 14 days until cohort data accumulates |
| Continuous recalibration over-corrects on noisy data | Medium | Medium — forecast oscillation | Use decay-weighted error with nudge factor (0.3); cap adjustment at ±0.1 CEFR/month |
| What-if simulation creates unrealistic learner expectations | Low | High — trust damage | Always label simulations as "ước tính" / "estimate"; show confidence bands |

---

**C4 STATUS: V5 INTELLIGENCE DISCOVERY READY**

**NEXT ROUTE: C2 CONTRACT REVIEW → C6 EVALUATION HARNESS ALIGNMENT**
