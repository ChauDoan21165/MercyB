# V5 Intelligence Architecture Plan

**Author:** C4 — V5 Intelligence / Personalization Builder
**Date:** 2026-05-21
**Baseline:** `3be4e6ef1` (V4 stack complete: #968 + #988 + #989 + #991)
**Status:** DISCOVERY — no production code

---

## 1. What V4 Already Does Well

V4 provides a deterministic, replay-safe analytical core that transforms learner events into outcome signals. It is the foundation V5 builds on.

### 1.1 Telemetry + Aggregation (#968)

- 8 discriminated event types covering the full lesson lifecycle
- Deterministic aggregation with associative merge (supports sharded/batched ingestion)
- Effectiveness scoring per lesson (completion rate, stickiness, retry burden, CEFR lift)
- Retention signal extraction with churn risk bucketing
- Cohort drift reports with k-anonymity gating
- Weak-pattern clustering for ineffective lesson detection
- Privacy: FNV-1a pseudonymization, k-anon redaction
- Replay: canonical-JSON snapshots with stable fingerprints

### 1.2 Adapter Integration (#988)

- Structural contracts (StudyPlanLike, ProgressionSnapshotLike, LearnerMemorySummaryLike) decouple upstream modules from telemetry internals
- Study plan ingestion adapters (12 functions covering full lifecycle)
- Intervention engine: burnout, churn, stagnation, speaking avoidance, review overload, L1 persistence, ineffective clusters → bilingual, prioritized, evidence-tagged recommendations
- Forecast-vs-actual deviation analysis with recalibration suggestions
- Cohort-adaptive analytics (plan-version comparison, intervention effectiveness, burnout-by-CEFR, churn-by-weak-skill, L1 cluster, speaking-confidence retention)
- Learner-readable diagnostics with non-judgmental language
- `evaluateAdaptiveLoop()` — single entrypoint composing signals + plan + diagnostics

### 1.3 Adaptive Orchestration (#989)

- Pure functional reducer: 18 event kinds covering full lesson lifecycle
- Intervention lifecycle: issued → acknowledged → resolved
- Recovery state machine: none ↔ active
- Orchestration snapshots with FNV-1a content hash (FULL + COMPACT)
- Cross-device merge with vector clocks and corruption detection
- Speaking runtime adapter: queue-based enqueue/flush decoupling
- Replay chaos tested: 16-shuffle determinism, duplicate idempotency, compaction round-trip
- LearnerDiagnosticsCard: mountable React component with bilingual VI/EN, FORBIDDEN_VOCAB guard

### 1.4 Core Modules (#991)

| Module | Lines | Capability |
|--------|-------|-----------|
| curriculumSequencer | 401 | 7/28/90-day plans, fatigue-adjusted activity kinds, weak-skill targeting, speaking pacing, plan recalibration |
| learnerMemory | 806 | Snapshots, skill trends, confidence decay (30-day half-life), lesson mastery records, CEFR timeline, replay reconstruction, deterministic fingerprinting |
| progressionSimulator | 598 | Multi-day simulation, study assumptions, subskill tracking, trace export |
| providerRegistry | 1115 | Provider selection, health monitoring, quarantine/failover, trust scoring, output adjudication, boundary enforcement |

### 1.5 V4 Design Invariants (Must Preserve in V5)

1. **Determinism**: No `Date.now`, no `Math.random`, no network I/O in analytical functions
2. **Replay safety**: All state derivable from event log alone
3. **Privacy**: k-anonymity gating, pseudonymization, no PII in analytics
4. **Pure functions**: No mutable global state, no side effects in decision modules
5. **Layered architecture**: Core → Adapter → Orchestration (upward dependency only)
6. **Vietnamese-first**: All learner-facing output bilingual (VI/EN), non-judgmental

---

## 2. Gaps V5 Should Address

### 2.1 Personalization Depth

| Gap | Current V4 State | V5 Opportunity |
|-----|-----------------|----------------|
| Learner archetypes | None — all learners treated with same intervention thresholds | Introduce learner profiles (fast-learner, steady-builder, struggling-reviewer, speaking-avoider) that modulate thresholds and plan intensity |
| Goal-aware planning | Plans ignore learner goals (IELTS vs. daily conversation vs. academic) | Goal templates that shift skill weighting and CEFR targets |
| Age-band adaptation | None in curriculum sequencer | Kids/adult differentiated activity pacing, review frequency, challenge density |
| L1-transfer personalization | Only L1 persistence detection (binary flag) | L1-pattern library with Vietnamese-specific interference maps, targeted drill injection |

### 2.2 Forecasting Maturity

| Gap | Current V4 State | V5 Opportunity |
|-----|-----------------|----------------|
| Single-forecast comparison | `analyzeForecastVsActual` compares one forecast to actuals | Multi-forecast ensemble: compare 2-3 forecasting strategies, select best-performing |
| No confidence bands | Forecast is point estimate only | Confidence intervals (p10/p50/p90) around CEFR projection |
| No "what-if" simulation | No counterfactual analysis | Scenario comparison: "if learner studies 30 min/day vs 15 min/day" |
| Static recalibration | Recalibration suggestions are binary (rerun_placement, drop_speaking_acceleration) | Continuous recalibration with decay-weighted history |

### 2.3 Intervention Quality

| Gap | Current V4 State | V5 Opportunity |
|-----|-----------------|----------------|
| Single recommendation per signal | One intervention per risk signal | Ranked recommendation list with confidence scores, allowing upstream to pick top-N |
| No intervention outcome tracking | Intervention lifecycle (issued→ack→resolved) but no outcome measurement | Track whether resolved interventions actually improved the target metric |
| No explanation scoring | Recommendations carry evidence tags but no quality score | Score explanations by specificity, actionability, and learner-appropriateness |
| Fixed thresholds | `DEFAULT_THRESHOLDS` hardcoded | Per-archetype threshold overrides, learned from cohort outcomes |

### 2.4 Learner Memory Depth

| Gap | Current V4 State | V5 Opportunity |
|-----|-----------------|----------------|
| No skill decay modeling beyond confidence | Confidence decay is exponential with fixed half-life | Skill-specific decay rates (speaking decays faster than reading), practice-recovery curves |
| No interleaving/spacing awareness | Plans don't model spacing effects | Spaced-repetition scheduling integrated into curriculum sequencer |
| No error-type categorization | Lesson mastery records track attempts/scores but not error patterns | Error taxonomy: L1-transfer errors, overgeneralization, fossilized errors |
| Flat timeline | CEFR timeline is chronological list of observations | Longitudinal learner state summaries with trend direction and acceleration |

---

## 3. Personalization Candidates

### 3.1 Learner Archetype Profiles

```
Profile            | Intensity | Review Freq | Challenge Freq | Speaking Push
-------------------|-----------|-------------|----------------|---------------
fast_learner       | intense   | low         | high           | normal
steady_builder     | balanced  | normal      | normal         | normal
struggling_reviewer| gentle    | high        | low            | gentle
speaking_avoider   | balanced  | normal      | low            | high (targeted)
```

**Design:** `LearnerProfile` extends `CurriculumLearnerState` with an `archetype` field. The curriculum sequencer reads archetype to modulate plan parameters. Archetype is computed from telemetry signals (completion rate trend, speaking avoidance score, review debt trajectory) — not manually assigned.

### 3.2 Goal Templates

```
Goal              | Primary Skills              | Target CEFR | Timeline
------------------|-----------------------------|-------------|----------
ielts_academic    | reading, writing, listening | B2-C1       | 90-day
daily_conversation| speaking, listening        | A2-B1       | 28-day
business_english  | speaking, writing          | B1-B2       | 90-day
kids_foundation   | vocabulary, pronunciation  | A1-A2       | flexible
```

**Design:** `GoalTemplate` injected into `CurriculumLearnerState`. Shifts skill weighting in plan generation. Does NOT change the sequencer algorithm — only the input weights.

### 3.3 L1-Pattern Library (Vietnamese-Specific)

Vietnamese learners exhibit predictable interference patterns:
- **Tense omission**: Vietnamese lacks grammatical tense → English past/future tense errors
- **Article drop**: No definite/indefinite articles in Vietnamese → "a"/"the" errors
- **Final consonant deletion**: Vietnamese phonotactics → English final consonants dropped
- **Tone-to-intonation transfer**: Vietnamese tones mapped to English intonation incorrectly
- **Pronoun avoidance**: Vietnamese kinship-term pronoun system → avoidance of English pronouns

**Design:** `VnL1PatternMap` as a static lookup. Curriculum sequencer queries it when generating review/reinforce activities for learners with L1=vi. Intervention engine references it when firing `inject_l1_drill`.

---

## 4. Learner Memory Improvements

### 4.1 Skill-Specific Decay Rates

Current: single `DEFAULT_CONFIDENCE_HALF_LIFE_DAYS = 30` for all skills.

Proposed: per-skill half-life constants:
```typescript
const SKILL_HALF_LIFE_DAYS: Record<Skill, number> = {
  vocabulary: 14,    // fast decay without practice
  grammar: 21,
  pronunciation: 10, // fastest decay — motor skill
  listening: 28,
  speaking: 10,      // fast decay — production skill
  reading: 35,       // slowest decay — recognition skill
  writing: 21,
};
```

**Implementation:** `decayConfidence(skill, confidence, daysSinceLastPractice)` — backward-compatible, defaults to current 30-day when skill not specified.

### 4.2 Practice-Recovery Curves

Current: decay is exponential only. No modeling of how quickly a skill recovers after practice.

Proposed: `computeSkillRecovery(skill, daysSinceLastPractice, practiceCount)` returns a recovery multiplier (0..1) applied after decay. A skill practiced 5 times in the last 7 days recovers faster than one practiced once.

### 4.3 Longitudinal Learner State Summary

Current: `LearnerMemory` is raw snapshots + events + timeline. No aggregated summary.

Proposed: `summarizeLearnerState(memory): LearnerStateSummary` producing:
- Current CEFR estimates per skill with confidence
- Trend direction per skill (improving, stable, declining) over a configurable window
- Total study hours, active days, streak length
- Weak-skill ranking (bottom-3 skills by confidence)
- Speaking avoidance score
- Review debt score
- Recommended archetype

This summary feeds the intervention engine as a richer `LearnerMemorySummaryLike`.

### 4.4 Error-Type Taxonomy

Proposed: extend `LessonMasteryRecord` with optional `errorTags: string[]` — categories like `l1_transfer`, `overgeneralization`, `fossilized`, `careless`. The curriculum sequencer queries error patterns when selecting review activities.

---

## 5. Curriculum Sequencing Improvements

### 5.1 Archetype-Aware Plan Modulation

Current: `generateCurriculumPlan(state, length)` uses fixed rules for activity distribution.

Proposed: Accept optional `profile: LearnerProfile`. Profile modulates:
- `reviewsPerWeek`: struggling_reviewer gets 2x review slots
- `challengesPerWeek`: fast_learner gets 2x challenges
- `speakingPushMultiplier`: speaking_avoider gets extra speaking slots with lower difficulty
- `maxDailyMinutes`: adjusted per profile

**Contract change required:** Add `profile?: LearnerProfile` to `CurriculumLearnerState`. Backward-compatible — defaults to `steady_builder`.

### 5.2 Spaced Repetition Scheduling

Current: review activities are scheduled daily if review debt exists. No spacing model.

Proposed: `computeNextReviewDay(lessonId, masteryRecord, profile): number` returns the optimal day for next review based on:
- Current mastery level
- Days since last review
- Skill-specific decay rate
- Learner profile (struggling_reviewer reviews sooner)

Uses a simplified SM-2 algorithm variant adapted for language learning.

### 5.3 Goal-Weighted Skill Selection

Current: weak skills are targeted equally.

Proposed: `getSkillWeights(goal: GoalTemplate): Record<Skill, number>` that biases plan generation toward goal-relevant skills. An IELTS academic learner gets 3x reading/writing weight; a daily conversation learner gets 3x speaking/listening.

**Contract change required:** Add `goal?: GoalTemplate` to `CurriculumLearnerState`.

---

## 6. Forecasting Improvements

### 6.1 Multi-Forecast Ensemble

Current: single `ForecastLike` compared to actuals.

Proposed: `ForecastEnsemble` containing 2-3 forecasting strategies:
1. **Linear projection**: constant CEFR gain per study hour
2. **Skill-weighted projection**: gain weighted by skill difficulty and learner profile
3. **Cohort-benchmarked projection**: gain based on similar learners (k-anonymized)

`evaluateForecastEnsemble(ensemble, actuals): EnsembleReport` selects the best-performing strategy and explains why.

### 6.2 Confidence Bands

Proposed: each forecast skill target carries `p10` and `p90` estimates alongside `p50`. The deviation analysis checks whether actuals fall within the confidence band rather than a point estimate. A miss outside the band is flagged; a miss within the band is expected variance.

### 6.3 What-If Simulation

Proposed: `simulateScenario(memory, assumptions): ProgressionSimulationResult` — reuse the progression simulator with different study assumptions. Returns a diffable projection showing "if you study 30 min/day you reach B1 in 90 days; if 15 min/day, 140 days."

### 6.4 Continuous Recalibration

Current: recalibration is triggered on forecast deviation. Binary suggestions.

Proposed: `recalibrateForecast(history, actuals): ForecastLike` that continuously adjusts forecast parameters using a decay-weighted error history. Rather than replacing the forecast entirely, it nudges parameters (gain rate, plateau threshold) toward observed values.

---

## 7. Intervention/Recommendation Improvements

### 7.1 Ranked Recommendation Lists

Current: `composeInterventionPlan` returns a flat list sorted by priority. All recommendations are "issued."

Proposed: Return top-N ranked by a composite score factoring:
- **Urgency**: how severe is the signal (burnout > review debt)
- **Expected impact**: cohort-measured effectiveness of this intervention kind
- **Learner readiness**: is the learner in a state to receive this intervention (not during recovery)
- **Diversity**: avoid issuing 3 review-related interventions at once

Upstream can pick top-2 or top-3 rather than all.

### 7.2 Intervention Outcome Tracking

Current: lifecycle is issued → acknowledged → resolved. No measurement of whether resolution improved the target.

Proposed: extend `InterventionLifecycleEntry` with `preMetric` and `postMetric` snapshots. When an intervention is resolved, compare pre/post to compute `effectivenessScore`. Feed this back into `analyzeInterventionEffectiveness` for cohort learning.

**Contract change required:** Add optional `preMetric`/`postMetric` to `InterventionLifecycleEntry`. Backward-compatible (optional fields).

### 7.3 Explanation Scoring

Current: recommendations carry `InterventionEvidence[]` but no quality score.

Proposed: `scoreExplanation(rec: InterventionRecommendation, profile: LearnerProfile): number` scoring:
- **Specificity**: does the evidence reference concrete numbers (completion rate, days, scores)?
- **Actionability**: can the learner act on this without external help?
- **Tone appropriateness**: is the language non-judgmental for this learner profile?
- **VI quality**: does the Vietnamese text read naturally?

Low-scoring explanations are flagged for content review. High-scoring ones are promoted in the recommendation list.

### 7.4 Per-Archetype Thresholds

Proposed: `getThresholdsForProfile(profile: LearnerProfile): InterventionThresholds` — struggling_reviewer has lower burnout threshold (intervene earlier), fast_learner has higher stagnation threshold (let them push through plateaus).

---

## 8. Confidence Scoring Improvements

### 8.1 Multi-Source Confidence

Current: confidence is a single number per skill snapshot.

Proposed: `ConfidenceDecomposition { observedConfidence, decayedConfidence, peerConfidence, finalConfidence }` — decompose confidence into:
- **observed**: from direct assessment events
- **decayed**: time-based decay from last observation
- **peer**: cohort-benchmarked (k-anonymized)
- **final**: weighted blend of the above

### 8.2 Confidence-Aware Plan Adjustments

Proposed: when confidence for a skill drops below a threshold, the curriculum sequencer automatically increases review frequency for that skill and decreases challenge frequency. When confidence is high and stable, challenge frequency increases.

---

## 9. Evaluation Metrics

### 9.1 V5-Specific Metrics

| Metric | Definition | Baseline (V4) | V5 Target |
|--------|-----------|---------------|-----------|
| Personalization lift | % improvement in CEFR gain rate for archetype-matched vs. unmatched plans | N/A (no archetypes) | +15% min |
| Forecast accuracy | Mean absolute error between forecast p50 and actual CEFR at 30/60/90 days | Current deviation codes only | MAE < 0.3 CEFR levels |
| Intervention effectiveness | % of resolved interventions where target metric improved within 14 days | N/A (no outcome tracking) | > 60% |
| Recommendation diversity | avg. unique intervention kinds per learner per month | N/A | > 3 kinds |
| Explanation quality score | avg. specificity + actionability + tone score | N/A | > 0.7 composite |
| Replay safety regression | % of V4 replay tests that still pass after V5 changes | 100% | 100% (non-negotiable) |

### 9.2 Evaluation Harness Requirements (C6 alignment)

- A/B framework: compare V4 baseline vs. V5-enhanced plans on identical learner states
- Replay comparison: run V4 and V5 on the same event log, diff the outputs
- Cohort simulation: replay historical learner data through V5 and compare to V4 outcomes
- Determinism gate: V5 must pass all V4 determinism tests
- Privacy gate: V5 must pass all V4 k-anonymity and pseudonymization tests

---

## 10. Implementation Risk Ranking

| # | Feature | Risk | Rationale |
|---|---------|------|-----------|
| 1 | Learner archetype profiles | **Low** | Extends existing `CurriculumLearnerState`; backward-compatible optional field |
| 2 | Goal templates | **Low** | Static lookup tables; no algorithm changes |
| 3 | L1-pattern library | **Low** | Static data; queried by existing `inject_l1_drill` pathway |
| 4 | Skill-specific decay rates | **Low** | Replaces single constant with lookup; existing `decayConfidence` signature extended |
| 5 | Longitudinal state summary | **Medium** | New aggregation function; must preserve determinism |
| 6 | Archetype-aware plan modulation | **Medium** | Modifies `generateCurriculumPlan` parameter space; needs thorough determinism testing |
| 7 | Ranked recommendation lists | **Medium** | Changes intervention engine output shape; upstream consumers must adapt |
| 8 | Spaced repetition scheduling | **Medium** | New algorithm in curriculum sequencer; must not break existing plan determinism |
| 9 | Multi-forecast ensemble | **High** | New analytical surface; requires cohort data for strategy #3 |
| 10 | Confidence bands (p10/p50/p90) | **High** | Changes forecast data model; all downstream consumers affected |
| 11 | What-if simulation | **High** | New UI surface; may require provider calls for scenario generation |
| 12 | Intervention outcome tracking | **High** | Requires persistent state changes; touches orchestrator state shape |
| 13 | Error-type taxonomy | **High** | Requires grading pipeline changes to emit error tags; spans beyond V4/V5 boundary |

### Recommended Phase Order

- **Phase 1 (low risk):** #1, #2, #3, #4 — profiles, goals, L1 patterns, skill decay
- **Phase 2 (medium risk):** #5, #6, #7 — state summary, plan modulation, ranked recs
- **Phase 3 (high risk):** #8, #9, #10 — spaced repetition, forecast ensemble, confidence bands
- **Phase 4 (cross-cutting):** #11, #12, #13 — simulation, outcome tracking, error taxonomy

---

## V4 Contract Changes Required (for C2 Review)

| Change | Module | Breaking? | Justification |
|--------|--------|-----------|---------------|
| Add `profile?: LearnerProfile` to `CurriculumLearnerState` | curriculumSequencer | No (optional) | Enables archetype-aware plan modulation |
| Add `goal?: GoalTemplate` to `CurriculumLearnerState` | curriculumSequencer | No (optional) | Enables goal-weighted skill selection |
| Add `skill?: Skill` parameter to `decayConfidence` | learnerMemory | No (default parameter) | Enables skill-specific decay rates |
| Add `preMetric`/`postMetric` to `InterventionLifecycleEntry` | adaptiveOrchestrator | No (optional fields) | Enables intervention outcome tracking |
| Add `errorTags?: string[]` to `LessonMasteryRecord` | learnerMemory | No (optional) | Enables error-type categorization |

**All proposed changes are backward-compatible (optional fields or default parameters). No existing V4 function signature is narrowed or removed.**

---

**C4 STATUS: V5 INTELLIGENCE DISCOVERY READY**

**NEXT ROUTE: C2 CONTRACT REVIEW → C6 EVALUATION HARNESS ALIGNMENT**
