# V4 Contract Map — B7 deliverable (2026-05-21)

For B3, B4, B5, B6. Verified against origin/main (commits #968, #988, #989 all merged).

---

## #968 Telemetry Core Exports

All in `src/lib/placement/v4/telemetry/`. Import from barrel `index.ts`.

**Event types** (`types.ts`):
`TelemetryEvent`, `LessonStartEvent`, `LessonCompleteEvent`, `LessonRetryEvent`,
`LessonDropoffEvent`, `SpeakingRetryEvent`, `HesitationLoopEvent`, `StudyStreakEvent`,
`CefrCheckpointEvent`, `TelemetryEventType`, `LessonRetryReason`, `StudyStreakState`,
`CefrCheckpointModality`, `CefrTransitionRecord`.

**Aggregation** (`types.ts`):
`AggregationSummary`, `LessonAggregate`, `UserAggregate`, `EffectivenessScore`,
`RetentionSignal`, `ChurnRiskBucket`, `Cohort`, `CohortAssignment`,
`CohortComparisonRow`, `CohortDriftReport`, `CohortGap`, `AgeBucket`,
`WeakPatternCluster`.

**Validation** (`schema.ts`):
`validateEvents()`, `telemetryEventSchema`, `RejectedEvent`, `ValidationResult`.

**Analytics** (`aggregation.ts`, `effectiveness.ts`, `retention.ts`, `cohort.ts`,
`clustering.ts`, `time.ts`):
`aggregateEvents()`, `canonicalizeEvents()`, `mergeAggregations()`,
`scoreLessonEffectiveness()`, `scoreAllLessons()`, `buildLessonCompletionsByUser()`,
`computeCefrLiftByLesson()`, `classifyChurnRisk()`, `extractRetentionSignals()`,
`retentionStabilityFingerprint()`, `buildCohortDriftReport()`, `cohortKey()`,
`clusterWeakLessons()`, `UTC_MS_PER_DAY`, `utcDayOrdinal()`, `inclusiveDaySpan()`,
`longestContiguousRun()`.

**Privacy / Replay** (`privacy.ts`, `replay.ts`):
`aggregateForRelease()`, `fnv1a64Hex()`, `redactForRelease()`,
`buildReplaySnapshot()`, `canonicalJSON()`, `replayFingerprint()`,
`ReplaySafeSnapshot`, `BuildSnapshotOptions`, `PrivacyOptions`.

**Option types**: `RetentionOptions`, `CohortComparisonOptions`, `ClusteringOptions`.

---

## #988 Adapter Exports

**Structural contracts** (`adaptiveTelemetryTypes.ts`) — upstream modules (B3/B4/B5)
must produce objects satisfying these shapes:

- `StudyPlanLike`, `StudyPlanDayLike`, `StudyPlanLessonLike`, `StudyPlanIntensity`
- `ProgressionSnapshotLike`, `SkillProgressLike`
- `LearnerMemorySummaryLike`, `LearnerMemoryEventLike`
- `ForecastLike`, `ForecastSkillTargetLike`
- `CurriculumSignalLike`, `CurriculumSignalKind`
- `Skill` (= `PlacementV3Modality | "vocabulary" | "grammar" | "pronunciation"`)
- `ADAPTIVE_CEFR_RANK` (A1=0..C2=5, zero-based ordinals)

**Intervention types** (`adaptiveTelemetryTypes.ts`):
`InterventionKind`, `InterventionPriority`, `InterventionRecommendation`,
`InterventionPlan`, `InterventionEvidence`, `BilingualString`.

**Risk types**:
`RiskLevel`, `BurnoutRisk`, `ChurnRisk`, `StagnationAssessment`,
`SpeakingAvoidance`, `ReviewOverload`, `L1PersistencePattern`,
`IneffectiveClusterFlag`, `AdaptiveSignalBundle`.

**Forecast types**:
`ForecastDeviationCode`, `ForecastDeviation`, `ForecastDeviationReport`,
`RecalibrationSuggestionKind`, `RecalibrationSuggestion`.

**Diagnostic types**:
`DiagnosticKind`, `LearnerDiagnostic`.

**Ingestion adapters** (`studyPlanTelemetry.ts`):
`ingestStudyPlanGenerated()`, `ingestLessonStart()`, `ingestLessonCompletion()`,
`ingestLessonSkip()`, `ingestLessonRetry()`, `ingestSpeakingRetry()`,
`ingestHesitationLoop()`, `ingestAdaptiveRecalculation()`,
`ingestProgressionCheckpoint()`, `ingestBurnoutIndicator()`,
`ingestReviewDebtAccumulation()`, `ingestProgressionSnapshot()`.

**Ingestion input types**:
`IngestionContext`, `LessonStartInput`, `LessonCompletionInput`, `LessonSkipInput`,
`LessonSkipReason`, `LessonRetryInput`, `SpeakingRetryInput`, `HesitationLoopInput`,
`RecalculationInput`, `RecalculationReasonCode`, `ProgressionCheckpointInput`,
`BurnoutIndicatorInput`, `ReviewDebtInput`, `BatchIngestionInput`.

**Intervention engine** (`interventionEngine.ts`):
`computeAdaptiveSignals()`, `composeInterventionPlan()`, `recommendInterventions()`,
`DEFAULT_THRESHOLDS`, `InterventionThresholds`, `ComputeSignalsInput`, `ComposePlanInput`.

**Forecast + diagnostics**:
`analyzeForecastVsActual()`, `summarizeForecastForLearner()`, `ForecastAnalysisOptions`.
`buildLearnerDiagnostics()`, `BuildDiagnosticsInput`.

**Cohort adaptive** (`cohortAdaptive.ts`):
`comparePlanVersions()`, `analyzeInterventionEffectiveness()`, `burnoutByCefrBand()`,
`churnByWeakSkill()`, `l1ClusterEffectiveness()`, `speakingConfidenceRetention()`.

**Adaptive loop** (`adaptiveLoop.ts`):
`evaluateAdaptiveLoop()`, `AdaptiveLoopInput`, `AdaptiveLoopResult`.

---

## #989 Orchestration Exports (merged)

**Orchestrator** (`adaptiveOrchestrator.ts`):
`ORCHESTRATOR_SCHEMA_VERSION`, `initOrchestratorState()`, `applyOrchestrationEvent()`,
`applyOrchestrationEvents()`, `runAdaptiveCycle()`.
Types: `OrchestratorState`, `OrchestrationEvent`, `RecoveryKind`,
`InterventionLifecycleEntry`, `PlanVersionEntry`, `ForecastHistoryEntry`,
`RecoveryStateEntry`, `RunAdaptiveCycleInput`, `RunAdaptiveCycleResult`.

**Snapshot** (`orchestrationSnapshot.ts`):
`ORCHESTRATION_SNAPSHOT_VERSION`, `buildOrchestrationSnapshotFull()`,
`compactOrchestrationSnapshot()`, `rebuildFullFromCompact()`,
`snapshotContentHash()`, `isSnapshotHashValid()`, `reflowSnapshotForReplay()`.
Types: `OrchestrationSnapshot`, `OrchestrationSnapshotFull`,
`OrchestrationSnapshotCompact`, `BuildSnapshotInput`, `RebuildFromCompactInput`.

**Cross-device merge** (`crossDeviceMerge.ts`):
`mergeDeviceSnapshots()`, `detectCorruption()`, `isConvergent()`,
`convergenceHash()`.
Types: `DeviceSnapshot`, `VectorClock`, `CorruptionReport`, `CorruptionReason`,
`MergeOptions`, `MergeResult`.

**Speaking adapter** (`speakingRuntimeAdapter.ts`):
`createSpeakingQueue()`, `enqueueSpeakingEvent()`, `flushSpeakingQueue()`,
`drainSpeakingQueue()`, `translateSpeakingRuntimeEvent()`.
Types: `SpeakingQueue`, `SpeakingQueueOptions`, `SpeakingRuntimeEvent`,
`SpeakingFlushSink`, `FlushResult`, `DrainResult`, `SpeakingTranslateOptions`.

**Component** (`src/components/placement/v4/LearnerDiagnosticsCard.tsx`):
React component. Imports `LearnerDiagnostic` from `@/lib/placement/v4/telemetry`.

---

## B5 Core Module Contracts

B5 owns `learnerMemory.ts` and `curriculumSequencer.ts` (or delegates to B3).
These modules must satisfy the `…Like` structural contracts in `adaptiveTelemetryTypes.ts`.

**B5 — learnerMemory.ts → telemetry boundary:**
- `LearnerMemory` → produce `LearnerMemorySummaryLike` (extract `recent` events, collect `sessionIds`)
- `LearnerMemoryEvent` → convert to `LearnerMemoryEventLike`:
  - Map `occurredAt` (ISO string) → `timestampMs` (integer ms via `Date.parse`)
  - Map `kind`: `placement_snapshot`→`checkpoint`, `lesson_mastery`→`lesson_completed`, `memory_pruned`→drop
  - Map `payload.snapshot.snapshotId` or `payload.record.roomId` → `reference`
- `LearnerProgressionSnapshot` provides CEFR data to fill `ProgressionSnapshotLike.cefr`

**B3 — curriculumSequencer.ts → telemetry boundary:**
- `CurriculumPlan` → produce `StudyPlanLike` (add `planVersion`, `totalDays`, `intensity`, `generatedAtMs`)
- `CurriculumActivity` → needs `estimatedMinutes` field (not currently on `CurriculumActivity`)
- `SkillProgress.lastPracticedDay` → rename to `SkillProgressLike.lastPracticedDayOrdinal` (UTC ordinal, or convert if different semantics)
- `CurriculumActivity.targetSkill` → `StudyPlanLessonLike.skill` (structurally compatible)
- Call `ingestStudyPlanGenerated()` with `IngestionContext` when plan is generated
- Call `ingestAdaptiveRecalculation()` when plan is regenerated

**B4 — progressionSimulator.ts → telemetry boundary:**
- `ProgressionSimulationResult` → extract `ForecastLike`
  - `forecastId` = `result.inputHash`
  - `horizonDays` = `max(result.assumptions.timelineDays)`
  - `targets` = map `result.final.subskills` → `ForecastSkillTargetLike[]`

**providerRegistry.ts (A6):** No structural contracts to telemetry. Standalone module.

---

## Do-Not-Duplicate Types

| Type | Owned by | Do not redefine in |
|---|---|---|
| `Skill` | `adaptiveTelemetryTypes.ts` | `curriculumSequencer.ts` (use `CurriculumSkill`), `learnerMemory.ts` |
| `CEFR_RANK` / `ADAPTIVE_CEFR_RANK` | `adaptiveTelemetryTypes.ts` (0-based) | `curriculumSequencer.ts` (has 1-based — keep, do not unify) |
| `SkillProgressLike` | `adaptiveTelemetryTypes.ts` | `curriculumSequencer.ts` (`SkillProgress.lastPracticedDay` ≠ `SkillProgressLike.lastPracticedDayOrdinal` — rename/convert field) |
| `BilingualString` | `adaptiveTelemetryTypes.ts` | any other file (single source of truth) |
| `InterventionRecommendation` | `adaptiveTelemetryTypes.ts` | any core module |
| `LearnerDiagnostic` | `adaptiveTelemetryTypes.ts` | any other file |
| `IneffectiveClusterFlag` | `adaptiveTelemetryTypes.ts` | `progressionSimulator.ts` |
| `IngestionContext` | `studyPlanTelemetry.ts` | upstream modules (import, don't redefine) |
| `TelemetryEvent` (and sub-types) | `types.ts` | any adapter or core module |
| `OrchestratorState`, `OrchestrationEvent` | `adaptiveOrchestrator.ts` | any other file |
| `DeviceSnapshot`, `VectorClock` | `crossDeviceMerge.ts` | any other file |

**Convention:** `…Like` suffix = structural contract (telemetry owns). No suffix = concrete
type owned by its module. Never define a `…Like` type in an upstream module — that's
the telemetry's job.

---

## Runtime Boundary Rules

1. **No `Date.now`** in any telemetry/adapter/orchestration function. All timestamps arrive via `IngestionContext.nowMs` or `snapshot.snapshotMs`.
2. **No `Math.random`**. All non-determinism comes from FNV-1a hashes of sorted, deterministic input.
3. **k-anonymity**. All cohort rollups gated by `kAnonThreshold`. Below threshold → row dropped, never blurred.
4. **No PII in telemetry**. `userIdHash` is pre-pseudonymized. Session ids are opaque strings.
5. **No upstream imports in telemetry**. The adapter layer imports NOTHING from `curriculumSequencer.ts`, `learnerMemory.ts`, `progressionSimulator.ts`, or `providerRegistry.ts`.
6. **Core path survives optional failures**. Speaking adapter's `enqueueSpeakingEvent` is synchronous and exception-free. Adaptive processing CANNOT delay first audible output.
7. **Import from barrel only**. All consumers import from `@/lib/placement/v4/telemetry` (the `index.ts` barrel). Never import from submodules directly.
8. **Deterministic replay**. All state is rebuildable from event logs. `replayEvents()` in learnerMemory, `applyOrchestrationEvents()` in orchestrator. Every function with state must accept a seed/hash input, never read wall-clock time.
9. **No Supabase, no Azure, no vendor I/O** in any telemetry/adapter/orchestration function. These are pure analytical modules.
10. **Idempotent events**. Duplicate `eventId` in the orchestrator → no state change. Same event applied twice = same result as once.

---

## Validation

```
npm run typecheck   # passes (zero errors on origin/main)
npm run lint        # passes (no warnings in V4 files)
```
