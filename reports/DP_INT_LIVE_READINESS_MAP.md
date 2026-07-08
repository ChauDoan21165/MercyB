> ⚠️ **CORRECTED 2026-07-08 — see [`DP_INT_LIVE_READINESS_MAP_CORRECTION.md`](./DP_INT_LIVE_READINESS_MAP_CORRECTION.md).**
> The LIVE table below overstates reach: no live component/page imports `tm-int` (only a
> placement test does). The sole live path is the placement chain. Read the correction first.

# DP INT Live Readiness Map — Phase 0

**Runner:** Admin | **Date:** 2026-07-07 | **Mode:** READ-ONLY MAP — NO WIRING

---

## Summary

| Class | Workpacks | Source Files | % |
|---|---|---|---|
| **LIVE** | 116 | 14 | 44.6% |
| **WIREABLE-FEATURE** | 90 | 15 | 34.6% |
| **GUARDRAIL** | 54 | 6 | 20.8% |
| **Total** | **260** | **35** | 100% |

---

## Classification

### LIVE (116 WPs, 14 files)

Imported by real components/pages. Already serving users.

| Source File | Example Consumer |
|---|---|
| `src/lib/tm-int/dp/audio.ts` | AudioPlayer, CornerTalker, FeedbackBar |
| `src/lib/tm-int/dp/index.ts` | VirtualizedRoomGrid, DesignAuditReport, RoomSearch |
| `src/lib/tm-int/dp/speech.ts` | RecommendedDrillCard, WeeklyProgressWidget, RoomPronunciationPractice |
| `src/lib/tm-int/judge/replay.ts` | SpeakPracticeMode, AiConversationScenarioPanel, NativeBootstrap |
| `src/lib/tm-int/judge/types.ts` | Bilingual, MercyChat, MercyGuide |
| `src/lib/tm-int/learning-signals/engine.ts` | NotificationBootstrap, CornerTalker, ParentFamilyBridgeSection |
| `src/lib/tm-int/obs/detectors/audio.ts` | AudioPlayer, CornerTalker, FeedbackBar |
| `src/lib/tm-int/obs/detectors/speech.ts` | WeeklyProgressWidget, RecommendedDrillCard, RoomPronunciationPractice |
| `src/lib/tm-int/obs/types.ts` | Bilingual, MercyChat, MercyGuide |
| `src/lib/tm-int/ped/audio.ts` | AudioPlayer, FeedbackBar, CornerTalker |
| `src/lib/tm-int/ped/learning.ts` | TrialExpiredScreen, ConsentModal, MercyGuideProfileSettings |
| `src/lib/tm-int/ped/speech.ts` | RecommendedDrillCard, WeeklyProgressWidget, ConversationMode |
| `src/lib/tm-int/runtime/types.ts` | Bilingual, MercyChat, MercyGuide |
| `src/lib/tm-int/runtimeReadiness/contracts.ts` | Bilingual, GermanLessonsTab, FrenchLessonsTab |

### WIREABLE-FEATURE (90 WPs, 15 files)

Runtime code that COULD be wired to a live surface. Not imported today.

| Source File | Description |
|---|---|
| `src/lib/placement/v3/runtimeIntegration.ts` | Placement runtime integration — NOT imported by any live component (contrary to prior assumption) |
| `src/lib/tm-int/runtime/contextBuilder.ts` | Builds teacher context from signals |
| `src/lib/tm-int/runtime/decisionPipeline.ts` | Main decision pipeline orchestrator |
| `src/lib/tm-int/runtime/runtimeHooks.ts` | React hook wrappers for runtime |
| `src/lib/tm-int/runtime/signalAggregator.ts` | Aggregates observation signals |
| `src/lib/tm-int/ped/learningBehaviorFamily.ts` | Learning behavior classification |
| `src/lib/tm-int/runtimeReadiness/decisionTrace.ts` | Decision traceability |
| `src/lib/tm-int/runtimeReadiness/evidenceBundle.ts` | Evidence packaging |
| `src/lib/tm-int/runtimeReadiness/fixtureBuilder.ts` | Test fixture construction |
| `src/lib/tm-int/runtimeReadiness/judgeExplanation.ts` | Judge rationale generation |
| `src/lib/tm-int/runtimeReadiness/judgeRubric.ts` | Judge scoring rubric |
| `src/lib/tm-int/runtimeReadiness/readinessReport.ts` | Readiness report generation |
| `src/lib/tm-int/runtimeReadiness/regressionPack.ts` | Regression test packing |
| `src/lib/tm-int/runtimeReadiness/replayDeterminism.ts` | Deterministic replay |
| `scripts/tm-int/dp-int-factory.mjs` | Factory build script (not runtime) |

### GUARDRAIL (54 WPs, 6 files)

Validation contracts/invariants. Build-time only. Do NOT wire.

| Source File | Description |
|---|---|
| `src/lib/tm-int/dp/decisionContract.ts` | Decision output contract |
| `src/lib/tm-int/dp/dpValidator.ts` | DP pipeline validator |
| `src/lib/tm-int/dp/__tests__/dpValidator.test.ts` | Validator tests |
| `src/lib/tm-int/judge/verifiedRegistry.ts` | Verified promotion registry |
| `src/lib/tm-int/runtimeReadiness/teacherContextValidator.ts` | Teacher context invariant checker |
| `src/lib/tm-int/runtimeReadiness/crossFlowReplay.ts` | Cross-flow determinism guard |

---

## WIREABLE-FEATURE Seam Analysis

**An integration seam EXISTS.** Both `src/lib/tm-int/runtime/index.ts` and `src/lib/tm-int/runtimeReadiness/index.ts` are barrel files that re-export all modules in their directories.

A live tutor/lesson surface would import:
```typescript
import { decisionPipeline, signalAggregator, contextBuilder } from "@/lib/tm-int/runtime";
import { readinessReport, judgeExplanation } from "@/lib/tm-int/runtimeReadiness";
```

**The seam does not need to be built — it already exists.** What's missing is:
1. A live component that calls `decisionPipeline(...)` at the tutor turn boundary
2. Wiring the pipeline output into `recordLearningEvent({ eventType: "turn_evaluated", ... })`

This is the same blocker identified in the C2 prediction-error capture work: `decideTeacherAction` has no live call site. The WIREABLE-FEATURE set is ready — it just needs a caller.

---

## Key Finding: runtimeIntegration.ts Is NOT Live

The prior assumption that `src/lib/placement/v3/runtimeIntegration.ts` is imported by placement UI components is **incorrect**. A grep of `src/components` and `src/pages` for `runtimeIntegration` returned zero results (excluding tests). This file is WIREABLE-FEATURE, not LIVE.
