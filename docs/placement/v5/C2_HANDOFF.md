# C2 — V5 Contract Guardian Handoff Packet

**Date:** 2026-05-21  
**V4 Baseline:** `3be4e6ef16899155b3579aab3660aec89c037c23`  
**C2 Verdict:** V5 CONTRACT INHERITANCE READY  
**C2 Status:** PARKED — wake on contract trigger only

---

## 1. Final C2 Verdict

V5 contract inheritance is **ready**. All V4 contracts have been catalogued, classified,
and guarded. V5 has a clear namespace (`src/lib/placement/v5/`), 11 extension points
with ownership assigned, and a comprehensive forbidden-change list.

- **C3–C7** may begin parallel discovery from the contract map immediately.
- **C8** may use the contract map for release/operator planning.
- **No production code** until C1 and C2 approve Phase 1 discovery outputs.

---

## 2. Deliverable Ledger

| Document | Path | Lines | Size |
|---|---|---|---|
| V5 Contract Inheritance Map | `docs/placement/v5/V5_CONTRACT_INHERITANCE.md` | 284 | 16.6 KB |
| V5 Extension Points | `docs/placement/v5/V5_EXTENSION_POINTS.md` | 383 | 12.9 KB |
| C2 Handoff Packet | `docs/placement/v5/C2_HANDOFF.md` | this file | — |

No missing required docs. The V4 CONTRACT_MAP.md at `src/lib/placement/v4/telemetry/CONTRACT_MAP.md`
remains the authoritative V4 reference; V5 docs supplement it.

---

## 3. V4 Hard Invariants (14)

V5 must not break any of these. Changes require C2 re-audit + operator approval.

1. `Skill` type — shared across adapter, curriculum, progression
2. `BilingualString` — single source of truth for VI/EN strings
3. `LearnerMemorySummaryLike` — adapter contract for learnerMemory
4. `StudyPlanLike` — adapter contract for curriculumSequencer
5. `ProgressionSnapshotLike` — adapter contract for progressionSimulator
6. `ForecastLike` — wired into forecast analysis + adaptive loop
7. `IngestionContext` — timestamp injection for all ingestion adapters
8. `TelemetryEvent` (and subtypes) — core event schema
9. `OrchestratorState` — state container for adaptive cycle
10. `validateEvents()` — validation gate
11. `replayEvents()` — deterministic replay foundation
12. `applyOrchestrationEvents()` — orchestration replay
13. `fingerprintLearnerMemory()` — stable fingerprint
14. `snapshotContentHash()` — snapshot integrity

Plus all 10 runtime boundary rules (determinism, no Date.now, no Math.random, k-anonymity,
no PII, no vendor I/O, idempotent events, barrel-only imports, etc.).

---

## 4. Direct-Consume Export Ledger (24)

V5 may import these as-is from `@/lib/placement/v4` or `@/lib/placement/v4/telemetry`.

### V4 Barrel (13)
`createLearnerMemory`, `appendPlacementSnapshotEvent`, `buildCefrTimeline`,
`computeAllSkillTrends`, `selectPlacementV4Provider`, `normalizePlacementV4HealthSnapshot`,
`simulateProgression`, `generateCurriculumPlan`, `PLACEMENT_V4_CAPABILITY_DESCRIPTORS`,
`PLACEMENT_V4_MOCK_PROVIDERS`, `LearnerMemory`, `CurriculumPlan`, `ProgressionSimulationResult`

### Telemetry Barrel (11)
`aggregateEvents`, `scoreLessonEffectiveness`, `classifyChurnRisk`, `buildCohortDriftReport`,
`clusterWeakLessons`, `ingestStudyPlanGenerated`, `ingestLessonStart`/`ingestLessonCompletion`,
`computeAdaptiveSignals`, `composeInterventionPlan`, `buildLearnerDiagnostics`,
`evaluateAdaptiveLoop`, `buildOrchestrationSnapshotFull`, `mergeDeviceSnapshots`

---

## 5. Wrap-Don't-Modify Ledger (7)

V5 should create thin wrappers, not modify V4 code.

1. `selectPlacementV4Provider` → `selectPlacementV5Provider`
2. `simulateProgression` → `simulateProgressionV5`
3. `generateCurriculumPlan` → `generateCurriculumPlanV5`
4. `computeAdaptiveSignals` → `computeAdaptiveSignalsV5`
5. `composeInterventionPlan` → `composeInterventionPlanV5`
6. `buildLearnerDiagnostics` → `buildLearnerDiagnosticsV5`
7. `evaluateAdaptiveLoop` → `evaluateAdaptiveLoopV5`

Pattern: V5 wrapper calls V4 internally, merges V5 additions on top.

---

## 6. No-Duplicate Type Ledger (16)

V5 must import these, never redefine. All from `@/lib/placement/v4/telemetry` unless noted.

| Type | Owner |
|---|---|
| `Skill` | `adaptiveTelemetryTypes.ts` |
| `BilingualString` | `adaptiveTelemetryTypes.ts` |
| `RiskLevel`, `BurnoutRisk`, `ChurnRisk` | `adaptiveTelemetryTypes.ts` |
| `StagnationAssessment`, `SpeakingAvoidance`, `ReviewOverload` | `adaptiveTelemetryTypes.ts` |
| `L1PersistencePattern`, `IneffectiveClusterFlag`, `AdaptiveSignalBundle` | `adaptiveTelemetryTypes.ts` |
| `InterventionKind`, `InterventionPriority`, `InterventionRecommendation`, `InterventionPlan`, `InterventionEvidence` | `adaptiveTelemetryTypes.ts` |
| `ForecastDeviationCode`, `ForecastDeviation`, `ForecastDeviationReport` | `adaptiveTelemetryTypes.ts` |
| `RecalibrationSuggestionKind`, `RecalibrationSuggestion` | `adaptiveTelemetryTypes.ts` |
| `DiagnosticKind`, `LearnerDiagnostic` | `adaptiveTelemetryTypes.ts` |
| `IngestionContext` | `studyPlanTelemetry.ts` |
| `TelemetryEvent` + subtypes | `types.ts` |
| `OrchestratorState`, `OrchestrationEvent`, `RecoveryKind` | `adaptiveOrchestrator.ts` |
| `DeviceSnapshot`, `VectorClock` | `crossDeviceMerge.ts` |
| `LearnerMemory`, `LearnerKey`, `LearnerMemoryEvent` | `learnerMemory.ts` (from `@/lib/placement/v4`) |

**Convention:** V5 types use `V5` prefix. Never use `…Like` suffix (V4 convention).

---

## 7. Contract-Facing Ledgers

### Adapter-Facing (8, from #988)
`StudyPlanLike`, `StudyPlanDayLike`, `StudyPlanLessonLike`, `ProgressionSnapshotLike`,
`SkillProgressLike`, `LearnerMemorySummaryLike`, `ForecastLike`, `CurriculumSignalLike`

### Orchestration-Facing (6, from #989)
`OrchestratorState`, `OrchestrationEvent`, `applyOrchestrationEvents`,
`buildOrchestrationSnapshotFull`, `runAdaptiveCycle`, `mergeDeviceSnapshots`

### Telemetry-Facing (6, from #968)
`ingestLessonStart/Completion`, `ingestStudyPlanGenerated`, `ingestAdaptiveRecalculation`,
`ingestProgressionCheckpoint/Snapshot`, `IngestionContext.nowMs` (no `Date.now`),
`eventId` (idempotent, stable)

### Provider-Facing (5 rules)
1. `selectPlacementV4Provider` — call directly ✅
2. New mock providers — add to V5 array ✅
3. New capabilities — extend via wrapper ✅
4. `normalizePlacementV4HealthSnapshot` — frozen ❌
5. `calculatePlacementV4QuarantineUntil` — frozen ❌ (wrap it)

---

## 8. Forbidden Change Ledger (10)

| Change | Risk |
|---|---|
| Modify any `…Like` type | Breaks all upstream modules |
| Change `Skill` definition | Breaks curriculum, progression, adapter |
| Modify `TelemetryEvent` union | Breaks replay, aggregation, cohorts |
| Change `OrchestratorState` shape | Breaks snapshot + cross-device merge |
| Modify `IngestionContext` | Breaks timestamp injection |
| Remove runtime boundary rules | Breaks determinism/privacy |
| Change barrel import paths | Breaks all consumers |
| Add upstream imports in telemetry | Circular dependency |
| Modify `validateEvents` to accept rejects | Weakens data quality |
| Remove/rename V4 barrel exports | Breaks V5 + all consumers |

---

## 9. Extension Point Routing (11)

| EP | Name | Owner | File |
|---|---|---|---|
| 1 | Provider Capabilities | C4 | `v5/capabilities.ts` |
| 2 | Intervention Kinds | C5 | `v5/interventions.ts` |
| 3 | Learner Diagnostics | C6 | `v5/diagnostics.ts` |
| 4 | Adaptive Signals | C5 | `v5/signals.ts` |
| 5 | Telemetry Events | C3 | `v5/telemetryEvents.ts` |
| 6 | Curriculum Skills | C7 | `v5/skills.ts` |
| 7 | Forecast Models | C7 | `v5/forecast.ts` |
| 8 | Study Assumptions | C7 | `v5/assumptions.ts` |
| 9 | Provider Registry | C4 | `v5/providers.ts` |
| 10 | Orchestrator | C5/C3 | `v5/orchestrator.ts` |
| 11 | Barrel Export | C2 | `v5/index.ts` |

---

## 10. Parallel Discovery Instructions

### C3 — Telemetry & Events
**Consume:** V5_CONTRACT_INHERITANCE.md §7 (Telemetry-Facing), V5_EXTENSION_POINTS.md EP5  
**Deliverable:** `docs/placement/v5/C3_TELEMETRY_EVENTS.md`  
**Scope:** New `V5TelemetryEvent` types, validation wrapper `validateV5Events()`,
ingestion adapter extensions. Map V5 user-facing events to the V4 telemetry pipeline.

### C4 — Provider & Capability
**Consume:** V5_CONTRACT_INHERITANCE.md §8 (Provider-Facing), V5_EXTENSION_POINTS.md EP1, EP9  
**Deliverable:** `docs/placement/v5/C4_PROVIDERS.md`  
**Scope:** `V5_CAPABILITY_DESCRIPTORS`, `V5_MOCK_PROVIDERS`, `selectPlacementV5Provider`.
Extend V4's `speaking`/`grading`/`feedback` with `pronunciation_assessment`,
`fluency_tracking`, `comprehension_quiz`.

### C5 — Intervention & Adaptation
**Consume:** V5_CONTRACT_INHERITANCE.md §5-6, V5_EXTENSION_POINTS.md EP2, EP4, EP10  
**Deliverable:** `docs/placement/v5/C5_INTERVENTIONS.md`  
**Scope:** `V5InterventionKind`, `V5SignalBundle`, `computeAdaptiveSignalsV5`,
`composeInterventionPlanV5`, `runAdaptiveCycleV5`.

### C6 — Diagnostics & Feedback
**Consume:** V5_CONTRACT_INHERITANCE.md §3, V5_EXTENSION_POINTS.md EP3  
**Deliverable:** `docs/placement/v5/C6_DIAGNOSTICS.md`  
**Scope:** `V5DiagnosticKind`, `V5LearnerDiagnostic`, `buildLearnerDiagnosticsV5`.
Test/evaluation inheritance from V4 diagnostic pipeline.

### C7 — Curriculum & Sequencing
**Consume:** V5_CONTRACT_INHERITANCE.md §2-3, V5_EXTENSION_POINTS.md EP6, EP7, EP8  
**Deliverable:** `docs/placement/v5/C7_CURRICULUM.md`  
**Scope:** `V5Skill`, `V5Forecast`, `V5StudyAssumptions`, `generateCurriculumPlanV5`,
`simulateProgressionV5`. Boundary impact: new skill categories must flow through
V4 adapter contracts.

### C8 — Release & Operator
**Consume:** Full V5_CONTRACT_INHERITANCE.md, C2_HANDOFF.md  
**Deliverable:** `docs/placement/v5/C8_RELEASE_PLAN.md`  
**Scope:** Release sequencing for V5 phases, contract boundary enforcement in CI,
operator approval gates for forbidden changes.

---

## 11. C2 Wake Conditions

C2 is parked. C2 wakes **only** when:

| Trigger | Response |
|---|---|
| A V5 PR changes exports or contracts | Re-audit contract surface |
| A C-agent proposes duplicate types | Block + route to correct import |
| Namespace changes away from `v5/` | Re-audit namespace collision risk |
| C3–C8 find contract ambiguity | Clarify + update inheritance map |
| C1 changes V5 PR sequence affecting contracts | Re-sequence extension point routing |
| V4 baseline changes (new commit on main) | Re-verify all invariants against new baseline |
| New adapter/orchestration/telemetry contracts appear | Extend catalog + re-classify |

C2 does not wake for: test-only changes, docs-only changes, non-contract code within V5 modules,
or C-agent discovery documents that don't propose new types.

---

## 12. Final Parked Status

```
C2 FINAL STATUS: PARKED — V5 CONTRACT INHERITANCE READY
C2 REMAINING WORK: NONE UNLESS CONTRACT WAKE CONDITION TRIGGERS
V4 BASELINE: 3be4e6ef16899155b3579aab3660aec89c037c23
V5 NAMESPACE: src/lib/placement/v5/
NEXT: C3 / C4 / C5 / C6 / C7 / C8 PARALLEL DISCOVERY
```
