# V5 Contract Inheritance Map

**Author:** C2 — V5 Contract Guardian  
**Date:** 2026-05-21  
**V4 Baseline:** `3be4e6ef16899155b3579aab3660aec89c037c23`  
**Source:** Verified against V4 CONTRACT_MAP.md, V4 barrel exports, V4 telemetry namespace

---

## Principle

V5 inherits V4's contract surface. It may **consume** V4 exports, **wrap** V4 modules,
and **extend** V4 contracts — but it must **never break** existing V4 contracts.
V4 is frozen on main; V5 is additive.

All V4 runtime boundary rules (determinism, no Date.now, no Math.random, k-anonymity,
no PII, no vendor I/O, idempotent events, barrel-only imports) apply to V5 with equal
force unless explicitly waived in a V5-specific rule document.

---

## 1. V4 Contracts V5 Must Not Break

These are hard invariants. Changing any of these requires C2 re-audit and operator approval.

| Contract | Location | Why Immutable |
|---|---|---|
| `Skill` type definition | `adaptiveTelemetryTypes.ts` | Shared across adapter, curriculum, progression. Breaking it breaks #988 adapter contracts. |
| `BilingualString` type | `adaptiveTelemetryTypes.ts` | Single source of truth for all Vietnamese/English UI strings in telemetry. |
| `LearnerMemorySummaryLike` | `adaptiveTelemetryTypes.ts` | Adapter contract between learnerMemory and telemetry. B5 modules produce this shape. |
| `StudyPlanLike` | `adaptiveTelemetryTypes.ts` | Adapter contract between curriculumSequencer and telemetry. |
| `ProgressionSnapshotLike` | `adaptiveTelemetryTypes.ts` | Adapter contract between progressionSimulator and telemetry. |
| `ForecastLike` | `adaptiveTelemetryTypes.ts` | Wired into forecast analysis and adaptive loop evaluation. |
| `IngestionContext` | `studyPlanTelemetry.ts` | All ingestion adapters accept this. Timestamp injection point. |
| `TelemetryEvent` (and subtypes) | `types.ts` | Core event schema. Breaking it breaks replay, aggregation, and cohort analysis. |
| `OrchestratorState` | `adaptiveOrchestrator.ts` | State container for the adaptive cycle. Breaking it breaks snapshot/restore. |
| `validateEvents()` | `schema.ts` | Validation gate before any telemetry processing. |
| `replayEvents()` | `learnerMemory.ts` | Deterministic replay from event log. Foundation of the replay guarantee. |
| `applyOrchestrationEvents()` | `adaptiveOrchestrator.ts` | Orchestration replay. Same guarantee as learnerMemory replay. |
| `fingerprintLearnerMemory()` | `learnerMemory.ts` | Stable fingerprint for cache invalidation. |
| `snapshotContentHash()` | `orchestrationSnapshot.ts` | Snapshot integrity verification. |
| Runtime boundary rules (all 10) | CONTRACT_MAP.md | Determinism, privacy, and idempotency guarantees. |

---

## 2. V4 Exports V5 May Consume Directly

V5 can import these as-is from `@/lib/placement/v4` or `@/lib/placement/v4/telemetry`.
No wrapping needed — the V4 surface is stable and versioned.

### From V4 barrel (`@/lib/placement/v4`)

| Export | Kind | V5 Use |
|---|---|---|
| `createLearnerMemory()` | function | Construct learner state for V5 scenarios |
| `appendPlacementSnapshotEvent()` | function | Feed V5 placement data into learner memory |
| `buildCefrTimeline()` | function | Read-only projection, safe for V5 dashboards |
| `computeAllSkillTrends()` | function | Read-only analytics, safe for V5 recommendations |
| `selectPlacementV4Provider()` | function | Provider selection — V5 may call as a library |
| `normalizePlacementV4HealthSnapshot()` | function | Health normalization for V5 provider monitoring |
| `simulateProgression()` | function | What-if simulation for V5 planning |
| `generateCurriculumPlan()` | function | Curriculum generation for V5 scenarios |
| `PLACEMENT_V4_CAPABILITY_DESCRIPTORS` | const | Capability metadata, safe for V5 provider UI |
| `PLACEMENT_V4_MOCK_PROVIDERS` | const | Test fixtures, safe for V5 test harnesses |
| `LearnerMemory`, `LearnerKey` | types | Core domain types for V5 state |
| `CurriculumPlan`, `CurriculumActivity` | types | Curriculum types for V5 planning |
| `ProgressionSimulationResult` | types | Simulation results for V5 analysis |

### From Telemetry barrel (`@/lib/placement/v4/telemetry`)

| Export | Kind | V5 Use |
|---|---|---|
| `aggregateEvents()` | function | Feed V5 events into existing aggregation |
| `scoreLessonEffectiveness()` | function | Effectiveness scoring for V5 content |
| `classifyChurnRisk()` | function | Churn risk for V5 intervention targeting |
| `buildCohortDriftReport()` | function | Cohort analysis for V5 A/B testing |
| `clusterWeakLessons()` | function | Weak pattern detection for V5 content improvement |
| `ingestStudyPlanGenerated()` | function | Ingest V5-generated plans into telemetry |
| `ingestLessonStart()` / `ingestLessonCompletion()` | functions | Ingest V5 lesson events |
| `computeAdaptiveSignals()` | function | Compute signals from V5 learner data |
| `composeInterventionPlan()` | function | Generate interventions from V5 signals |
| `buildLearnerDiagnostics()` | function | Diagnostics for V5 learner dashboards |
| `evaluateAdaptiveLoop()` | function | Evaluate V5's adaptive loop against V4 baseline |
| `buildOrchestrationSnapshotFull()` | function | Snapshot V5 orchestrator state |
| `mergeDeviceSnapshots()` | function | Cross-device merge for V5 multi-device scenarios |

---

## 3. V4 Exports V5 Should Wrap Instead of Modify

V5 should create thin wrappers around these rather than modifying V4 code.
The V4 implementation stays frozen; V5 adds behavior on top.

| V4 Export | V5 Wrapper Pattern | Reason |
|---|---|---|
| `selectPlacementV4Provider()` | `selectPlacementV5Provider()` adds V5-specific failover logic, calls V4 internally | V5 may introduce new failover reasons, but V4's selection algorithm is the foundation |
| `simulateProgression()` | `simulateProgressionV5()` adds V5 study assumptions, delegates to V4 | V5 may model different study patterns, but the simulator engine is reusable |
| `generateCurriculumPlan()` | `generateCurriculumPlanV5()` adds V5 skill taxonomy, calls V4 | V4's sequencing algorithm is sound; V5 extends the skill space |
| `computeAdaptiveSignals()` | `computeAdaptiveSignalsV5()` adds V5 signals, merges with V4 result | V5 signals are additive; V4 signals must still be produced |
| `composeInterventionPlan()` | `composeInterventionPlanV5()` adds V5 intervention kinds | V4 interventions remain valid; V5 adds new kinds |
| `buildLearnerDiagnostics()` | `buildLearnerDiagnosticsV5()` adds V5 diagnostic kinds | Same pattern — additive |
| `evaluateAdaptiveLoop()` | `evaluateAdaptiveLoopV5()` compares V4 vs V5 loop results | V5 must prove improvement over V4 baseline |

---

## 4. V4 Types V5 Must Not Duplicate

These types are owned by specific V4 modules. V5 must import them, never redefine.

| Type | Owner Module | Import From |
|---|---|---|
| `Skill` | `adaptiveTelemetryTypes.ts` | `@/lib/placement/v4/telemetry` |
| `BilingualString` | `adaptiveTelemetryTypes.ts` | same |
| `RiskLevel`, `BurnoutRisk`, `ChurnRisk` | `adaptiveTelemetryTypes.ts` | same |
| `StagnationAssessment`, `SpeakingAvoidance`, `ReviewOverload` | `adaptiveTelemetryTypes.ts` | same |
| `L1PersistencePattern` | `adaptiveTelemetryTypes.ts` | same |
| `IneffectiveClusterFlag` | `adaptiveTelemetryTypes.ts` | same |
| `AdaptiveSignalBundle` | `adaptiveTelemetryTypes.ts` | same |
| `InterventionKind`, `InterventionPriority`, `InterventionRecommendation`, `InterventionPlan`, `InterventionEvidence` | `adaptiveTelemetryTypes.ts` | same |
| `ForecastDeviationCode`, `ForecastDeviation`, `ForecastDeviationReport` | `adaptiveTelemetryTypes.ts` | same |
| `RecalibrationSuggestionKind`, `RecalibrationSuggestion` | `adaptiveTelemetryTypes.ts` | same |
| `DiagnosticKind`, `LearnerDiagnostic` | `adaptiveTelemetryTypes.ts` | same |
| `IngestionContext` | `studyPlanTelemetry.ts` | same |
| `TelemetryEvent` and all subtypes | `types.ts` | same |
| `OrchestratorState`, `OrchestrationEvent`, `RecoveryKind` | `adaptiveOrchestrator.ts` | same |
| `DeviceSnapshot`, `VectorClock` | `crossDeviceMerge.ts` | same |
| `LearnerMemory`, `LearnerKey`, `LearnerMemoryEvent` | `learnerMemory.ts` | `@/lib/placement/v4` |

**Convention for V5:** Use a `V5` prefix for new types that extend V4 concepts (e.g., `V5InterventionPlan` that adds fields to `InterventionPlan`). Never use a `…Like` suffix — that convention belongs to V4's adapter layer. V5 extension types should use `V5…` prefix or live in a `v5/` namespace.

---

## 5. Adapter-Facing Contracts (from #988)

V5 must satisfy the same `…Like` structural contracts that B5 modules satisfy.
The adapter layer (`adaptiveTelemetryTypes.ts`) defines the interface; V5 implements it.

| Contract | What V5 Must Produce | When |
|---|---|---|
| `StudyPlanLike` | V5 curriculum plan serialized to adapter shape | After plan generation |
| `StudyPlanDayLike` | Each day's activities | Per plan version |
| `StudyPlanLessonLike` | Each lesson in a day | Per lesson assignment |
| `ProgressionSnapshotLike` | CEFR snapshot from V5 placement | After placement assessment |
| `SkillProgressLike` | Per-skill progress from V5 tracking | After each lesson completion |
| `LearnerMemorySummaryLike` | Summary of V5 learner state | Before adaptive signal computation |
| `ForecastLike` | V5 progression forecast | After simulation |
| `CurriculumSignalLike` | V5 curriculum adaptation signals | When curriculum needs recalibration |

V5 may add **additional** fields to these shapes via extension types, but the base
`…Like` contract must be fully satisfied. Missing fields → adapter rejects the input.

---

## 6. Orchestration-Facing Contracts (from #989)

V5 may either:
- **Consume** the V4 orchestrator as-is (calling `runAdaptiveCycle()` with V5 inputs), or
- **Replace** it with a V5 orchestrator that satisfies the same state/snapshot contract.

| Contract | V5 Compatibility | Notes |
|---|---|---|
| `OrchestratorState` | V5 must accept this shape if consuming V4 orchestrator | Or define `V5OrchestratorState` with a migration path |
| `OrchestrationEvent` | V5 events must be structurally compatible | Use same event envelope with V5-specific payloads |
| `applyOrchestrationEvents()` | V5 must either call this or provide V5 equivalent | If replacing, must still support replay |
| `buildOrchestrationSnapshotFull()` | V5 must either call this or provide V5 equivalent | Snapshot contract for persistence |
| `runAdaptiveCycle()` | V5 may call with V5 data | V4 cycle operates on `RunAdaptiveCycleInput`; V5 must fill it |
| `mergeDeviceSnapshots()` | V5 may call as-is | Cross-device merge is version-agnostic if snapshots are compatible |

**Recommendation:** V5 should consume the V4 orchestrator initially (call `runAdaptiveCycle()`
with V5-mapped inputs). Replace only if V5 introduces fundamentally different adaptive
semantics that the V4 orchestrator cannot express.

---

## 7. Telemetry-Facing Contracts (from #968)

V5 telemetry must flow through the same ingestion adapters as V4 telemetry.
This ensures V4's aggregation, cohort analysis, and effectiveness scoring
work on V5 data without modification.

| Contract | V5 Requirement |
|---|---|
| All lesson events | Must call `ingestLessonStart()`, `ingestLessonCompletion()`, etc. |
| All plan events | Must call `ingestStudyPlanGenerated()` with `IngestionContext` |
| All recalibration events | Must call `ingestAdaptiveRecalculation()` |
| All progression events | Must call `ingestProgressionCheckpoint()`, `ingestProgressionSnapshot()` |
| Event timestamping | Must use `IngestionContext.nowMs` — no `Date.now()` |
| Event idempotency | Must provide stable `eventId` — same event twice = no duplicate |

V5 may add **new** telemetry event types, but they must:
1. Extend `TelemetryEvent` with a discriminated union
2. Be added to `telemetryEventSchema` (or V5-equivalent schema)
3. Pass through `validateEvents()` (or V5-equivalent validation)
4. Be handled by `aggregateEvents()` (or V5-equivalent aggregation)

---

## 8. Provider-Facing Contracts

V4's `providerRegistry.ts` is a standalone module with no structural contracts to telemetry.
V5 may:

| Action | Allowed? | Notes |
|---|---|---|
| Call `selectPlacementV4Provider()` directly | Yes | Library call, no side effects |
| Add new providers to the mock registry | Yes | `PLACEMENT_V4_MOCK_PROVIDERS` is a const; V5 can define its own array |
| Add new capability descriptors | Yes, via wrapper | V5 defines `V5_CAPABILITY_DESCRIPTORS` that merges with V4's |
| Modify V4 health snapshot normalization | No | `normalizePlacementV4HealthSnapshot()` is frozen |
| Change quarantine algorithm | No | `calculatePlacementV4QuarantineUntil()` is frozen — wrap it |

---

## 9. V5 Extension Points

These are the safe places where V5 can add new behavior without touching V4.

| Extension Point | Location | What V5 Can Add |
|---|---|---|
| New capability types | `src/lib/placement/v5/capabilities.ts` | V5-specific provider capabilities beyond speaking/grading/feedback |
| New intervention kinds | `src/lib/placement/v5/interventions.ts` | V5-specific intervention types, extending `InterventionKind` |
| New diagnostic kinds | `src/lib/placement/v5/diagnostics.ts` | V5-specific learner diagnostics |
| New signal types | `src/lib/placement/v5/signals.ts` | V5-specific adaptive signals |
| New telemetry event types | `src/lib/placement/v5/telemetry.ts` | V5-specific events in the telemetry pipeline |
| New curriculum skill taxonomy | `src/lib/placement/v5/skills.ts` | V5-specific skill categories beyond the V4 skill set |
| New forecast models | `src/lib/placement/v5/forecast.ts` | V5-specific progression forecasting |
| New study assumptions | `src/lib/placement/v5/assumptions.ts` | V5-specific study pattern models |
| V5 provider registry | `src/lib/placement/v5/providers.ts` | Thin wrapper around V4 with V5 additions |
| V5 orchestrator | `src/lib/placement/v5/orchestrator.ts` | Replacement or wrapper for V4 orchestrator |
| V5 barrel export | `src/lib/placement/v5/index.ts` | Public API surface for V5 consumers |

---

## 10. Forbidden Contract Changes Without Explicit Approval

The following require C2 re-audit AND operator approval before any code change:

| Change | Impact |
|---|---|
| Modifying any `…Like` type in `adaptiveTelemetryTypes.ts` | Breaks all upstream modules (B5, V5) that produce these shapes |
| Changing `Skill` type definition | Breaks curriculum, progression, and adapter contracts |
| Modifying `TelemetryEvent` discriminated union | Breaks replay, aggregation, and cohort analysis |
| Changing `OrchestratorState` shape | Breaks snapshot persistence and cross-device merge |
| Modifying `IngestionContext` | Changes timestamp injection contract for all ingestion adapters |
| Removing any runtime boundary rule | Breaks determinism/privacy guarantees |
| Changing the import barrel paths | Breaks all consumers (barrel-only rule) |
| Adding upstream imports in telemetry | Creates circular dependencies, violates adapter isolation |
| Modifying `validateEvents()` to accept previously-rejected events | Weakens data quality gate |
| Removing or renaming any exported function from V4 barrel | Breaks V5 and all other V4 consumers |

---

## Namespace Recommendation

**Use `src/lib/placement/v5/` as a sibling namespace to `v4/`.**

Rationale:
- Follows the existing `v2/` → `v3/` → `v4/` versioning pattern
- Prevents namespace shadowing (V5 types won't collide with V4 types)
- Allows V5 to import from `../v4` and `../v4/telemetry` without ambiguity
- Keeps V4 frozen — no risk of accidental modification
- Clean separation for future V6, V7, etc.

V5 barrel: `@/lib/placement/v5`  
V5 telemetry: `@/lib/placement/v5/telemetry` (or import V4 telemetry directly)  
V5 tests: `src/lib/placement/v5/__tests__/`

---

## Audit Results

| Check | Result |
|---|---|
| Duplicate type risk | None detected — V5 namespace prevents collision |
| Namespace shadowing risk | None — `v5/` is a sibling, not a child of `v4/` |
| Circular import risk | None — V5 imports from V4, never vice versa |
| Adapter isolation preserved | Yes — V5 must satisfy same `…Like` contracts without modifying them |
| Replay determinism preserved | Yes — V5 inherits all runtime boundary rules |
| Barrel-only import rule preserved | Yes — V5 barrel at `v5/index.ts` |

---

**C2 SIGN-OFF:** V5 contract inheritance map complete. V4 contracts are catalogued,
classified, and guarded. V5 has a clear namespace, extension points, and forbidden-change
list. Ready for C3/C4/C5/C6/C7 parallel discovery.
