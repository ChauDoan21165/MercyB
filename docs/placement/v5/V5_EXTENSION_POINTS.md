# V5 Extension Points

**Author:** C2 — V5 Contract Guardian  
**Date:** 2026-05-21  
**V4 Baseline:** `3be4e6ef16899155b3579aab3660aec89c037c23`  
**Prerequisite:** V5_CONTRACT_INHERITANCE.md

---

## Overview

This document catalogues every safe extension point where V5 can add new behavior
without modifying V4 code. Each extension point includes:

- What V4 provides (the foundation)
- What V5 can add (the extension)
- The contract boundary (what must be preserved)
- Which C-agent is the suggested owner

---

## Extension Point 1: Provider Capabilities

**V4 foundation:** `PLACEMENT_V4_CAPABILITY_DESCRIPTORS` supports `speaking`, `grading`, `feedback`.  
**V5 extension:** Add capabilities like `pronunciation_assessment`, `fluency_tracking`, `comprehension_quiz`, `writing_scoring`.  

**File:** `src/lib/placement/v5/capabilities.ts`

**Pattern:**
```ts
import { PLACEMENT_V4_CAPABILITY_DESCRIPTORS } from "@/lib/placement/v4";
import type { PlacementV4CapabilityDescriptor } from "@/lib/placement/v4";

export const V5_CAPABILITY_DESCRIPTORS: Record<string, PlacementV4CapabilityDescriptor> = {
  ...PLACEMENT_V4_CAPABILITY_DESCRIPTORS,
  pronunciation_assessment: { /* V5-specific */ },
  fluency_tracking:           { /* V5-specific */ },
};
```

**Contract boundary:** Must extend `PlacementV4CapabilityDescriptor` type. Must not remove V4 capabilities.  
**Suggested owner:** C4 (Provider & Capability)

---

## Extension Point 2: Intervention Kinds

**V4 foundation:** `InterventionKind` in `adaptiveTelemetryTypes.ts` defines V4 intervention types.  
**V5 extension:** Add V5-specific intervention kinds (e.g., `pronunciation_drill`, `comprehension_boost`, `fluency_exercise`).  

**File:** `src/lib/placement/v5/interventions.ts`

**Pattern:**
```ts
import { InterventionKind } from "@/lib/placement/v4/telemetry";

export type V5InterventionKind = InterventionKind | "pronunciation_drill" | "comprehension_boost" | "fluency_exercise";

export interface V5InterventionPlan {
  kind: V5InterventionKind;
  priority: /* V5 priority model */;
  /* ... V5-specific fields */
}
```

**Contract boundary:** `InterventionKind` is a union type. V5 extends the union, does not remove members.  
**Suggested owner:** C5 (Intervention & Adaptation)

---

## Extension Point 3: Learner Diagnostics

**V4 foundation:** `DiagnosticKind` and `LearnerDiagnostic` in `adaptiveTelemetryTypes.ts`.  
**V5 extension:** Add V5-specific diagnostic kinds: `pronunciation_pattern`, `hesitation_heatmap`, `comprehension_gap`, `fluency_profile`.  

**File:** `src/lib/placement/v5/diagnostics.ts`

**Pattern:**
```ts
import { DiagnosticKind, LearnerDiagnostic } from "@/lib/placement/v4/telemetry";

export type V5DiagnosticKind = DiagnosticKind | "pronunciation_pattern" | "hesitation_heatmap" | "comprehension_gap" | "fluency_profile";

export interface V5LearnerDiagnostic extends LearnerDiagnostic {
  kind: V5DiagnosticKind;
  v5Metadata?: { /* V5-specific */ };
}

export function buildLearnerDiagnosticsV5(input: BuildDiagnosticsInputV5): V5LearnerDiagnostic[] {
  const v4 = buildLearnerDiagnostics(input); // V4 diagnostics
  const v5 = computeV5Diagnostics(input);    // V5 additions
  return [...v4, ...v5];
}
```

**Contract boundary:** V5 diagnostics include all V4 diagnostics plus V5 additions. Never suppress V4 diagnostics.  
**Suggested owner:** C6 (Diagnostics & Feedback)

---

## Extension Point 4: Adaptive Signals

**V4 foundation:** `computeAdaptiveSignals()` returns `AdaptiveSignalBundle`.  
**V5 extension:** Add V5-specific signals: `pronunciation_decay_rate`, `comprehension_confidence_trend`, `fluency_plateau_detection`.  

**File:** `src/lib/placement/v5/signals.ts`

**Pattern:**
```ts
import { computeAdaptiveSignals, AdaptiveSignalBundle } from "@/lib/placement/v4/telemetry";

export interface V5SignalBundle extends AdaptiveSignalBundle {
  pronunciationDecayRate?: number;
  comprehensionConfidenceTrend?: "rising" | "falling" | "stable";
  fluencyPlateauDetected?: boolean;
}

export function computeAdaptiveSignalsV5(input: ComputeSignalsInputV5): V5SignalBundle {
  const v4Signals = computeAdaptiveSignals(input);
  const v5Signals = extractV5Signals(input);
  return { ...v4Signals, ...v5Signals };
}
```

**Contract boundary:** V5 signals extend `AdaptiveSignalBundle` — all V4 fields must be present.  
**Suggested owner:** C5 (Intervention & Adaptation)

---

## Extension Point 5: Telemetry Events

**V4 foundation:** `TelemetryEvent` discriminated union in `types.ts`. 12 event types.  
**V5 extension:** Add V5-specific events: `PronunciationAttemptEvent`, `ComprehensionQuizEvent`, `FluencyBenchmarkEvent`.  

**File:** `src/lib/placement/v5/telemetryEvents.ts`

**Pattern:**
```ts
import { TelemetryEvent, validateEvents } from "@/lib/placement/v4/telemetry";

export type V5TelemetryEvent =
  | TelemetryEvent
  | PronunciationAttemptEvent
  | ComprehensionQuizEvent
  | FluencyBenchmarkEvent;

// V5 events must pass validation before entering the telemetry pipeline.
// V4's validateEvents() accepts TelemetryEvent; V5 must ensure its events
// are serialized as valid TelemetryEvent subtypes (via discriminated union
// extension) or use a V5-specific validation wrapper.
export function validateV5Events(events: V5TelemetryEvent[]): ValidationResult {
  // Validate V4 events with V4 validator
  // Validate V5 events with V5-specific schema
  // Merge results
}
```

**Contract boundary:** V5 events must extend `TelemetryEvent`. Must pass through aggregation. Must preserve idempotency.  
**Suggested owner:** C3 (Telemetry & Events)

---

## Extension Point 6: Curriculum Skill Taxonomy

**V4 foundation:** `Skill` = `PlacementV3Modality | "vocabulary" | "grammar" | "pronunciation"`.  
**V5 extension:** Extend with V5-specific skills: `fluency`, `comprehension`, `intonation`, `discourse`.  

**File:** `src/lib/placement/v5/skills.ts`

**Pattern:**
```ts
import { Skill } from "@/lib/placement/v4/telemetry";

export type V5Skill = Skill | "fluency" | "comprehension" | "intonation" | "discourse";

// V5 curriculum plan uses V5Skill
export interface V5CurriculumActivity {
  targetSkill: V5Skill;
  /* ... other V5-specific curriculum fields */
}
```

**Contract boundary:** `Skill` is a union — V5 extends, does not remove.  
**Suggested owner:** C7 (Curriculum & Sequencing)

---

## Extension Point 7: Forecast Models

**V4 foundation:** `simulateProgression()` produces `ProgressionSimulationResult`. `ForecastLike` is the adapter shape.  
**V5 extension:** Add V5-specific forecast models: `pronunciationForecast()`, `comprehensionForecast()`, `fluencyForecast()`.  

**File:** `src/lib/placement/v5/forecast.ts`

**Pattern:**
```ts
import { simulateProgression, ProgressionSimulationResult } from "@/lib/placement/v4";
import { ForecastLike } from "@/lib/placement/v4/telemetry";

export interface V5Forecast extends ForecastLike {
  pronunciationForecast?: { /* V5 */ };
  comprehensionForecast?: { /* V5 */ };
  fluencyForecast?: { /* V5 */ };
}

export function simulateProgressionV5(input: ProgressionInputV5): V5Forecast {
  const v4Result = simulateProgression(input); // V4 baseline
  const v5Forecasts = computeV5Forecasts(input); // V5 additions
  return { ...toForecastLike(v4Result), ...v5Forecasts };
}
```

**Contract boundary:** Must satisfy `ForecastLike`. V5 additions are optional fields on the extended type.  
**Suggested owner:** C7 (Curriculum & Sequencing)

---

## Extension Point 8: Study Assumptions

**V4 foundation:** `StudyPlanAssumptions` type in `progressionSimulator.ts`.  
**V5 extension:** Add V5-specific study patterns: `intensivePronunciationDrill`, `comprehensionHeavySchedule`, `fluencyWorkshop`.  

**File:** `src/lib/placement/v5/assumptions.ts`

**Pattern:**
```ts
import { StudyPlanAssumptions } from "@/lib/placement/v4";

export interface V5StudyAssumptions extends StudyPlanAssumptions {
  pronunciationIntensity?: "light" | "moderate" | "intensive";
  comprehensionFocus?: number; // 0..1, proportion of time
  fluencyWorkshopFrequency?: number; // sessions per week
}

export const V5_DEFAULT_ASSUMPTIONS: V5StudyAssumptions = {
  // ... V4 defaults
  pronunciationIntensity: "moderate",
  comprehensionFocus: 0.3,
  fluencyWorkshopFrequency: 2,
};
```

**Contract boundary:** Extends V4 `StudyPlanAssumptions` — all V4 fields must be present.  
**Suggested owner:** C7 (Curriculum & Sequencing)

---

## Extension Point 9: V5 Provider Registry

**V4 foundation:** `selectPlacementV4Provider()`, `PLACEMENT_V4_MOCK_PROVIDERS`.  
**V5 extension:** Add V5-specific providers and failover logic.  

**File:** `src/lib/placement/v5/providers.ts`

**Pattern:**
```ts
import {
  selectPlacementV4Provider,
  PLACEMENT_V4_MOCK_PROVIDERS,
  type PlacementV4ProviderSelection,
} from "@/lib/placement/v4";

export const V5_MOCK_PROVIDERS = [
  ...PLACEMENT_V4_MOCK_PROVIDERS,
  // V5-specific providers
];

export function selectPlacementV5Provider(
  request: PlacementV4ProviderSelectionRequest,
): PlacementV4ProviderSelection {
  // Try V5-specific selection first
  const v5Result = tryV5Providers(request);
  if (v5Result) return v5Result;
  // Fall back to V4
  return selectPlacementV4Provider(request);
}
```

**Contract boundary:** V5 provider selection must return `PlacementV4ProviderSelection`. V4 provider algorithm is the fallback.  
**Suggested owner:** C4 (Provider & Capability)

---

## Extension Point 10: V5 Orchestrator

**V4 foundation:** `runAdaptiveCycle()`, `OrchestratorState`, `OrchestrationEvent`.  
**V5 extension:** Replace or wrap the V4 orchestrator with V5-specific adaptive logic.  

**File:** `src/lib/placement/v5/orchestrator.ts`

**Pattern:**
```ts
import {
  runAdaptiveCycle,
  initOrchestratorState,
  type RunAdaptiveCycleInput,
  type RunAdaptiveCycleResult,
} from "@/lib/placement/v4/telemetry";

export function runAdaptiveCycleV5(input: RunAdaptiveCycleInputV5): RunAdaptiveCycleResult {
  // Phase 1: Run V4 cycle as baseline
  const v4Result = runAdaptiveCycle(input);
  // Phase 2: Apply V5-specific adjustments
  const v5Adjustments = computeV5Adjustments(input, v4Result);
  return mergeResults(v4Result, v5Adjustments);
}
```

**Contract boundary:** Must accept `RunAdaptiveCycleInput` and return `RunAdaptiveCycleResult`. Must support replay via `applyOrchestrationEvents()`.  
**Suggested owner:** C5 (Intervention & Adaptation), C3 (Telemetry)

---

## Extension Point 11: V5 Barrel Export

**V4 foundation:** `src/lib/placement/v4/index.ts` barrel.  
**V5 extension:** V5 public API surface.  

**File:** `src/lib/placement/v5/index.ts`

**Pattern:**
```ts
// Re-export V4 surface (stable, frozen)
export * from "@/lib/placement/v4";

// V5-specific exports
export { selectPlacementV5Provider } from "./providers";
export { simulateProgressionV5 } from "./forecast";
export { generateCurriculumPlanV5 } from "./curriculum";
export { computeAdaptiveSignalsV5 } from "./signals";
export { buildLearnerDiagnosticsV5 } from "./diagnostics";
export { runAdaptiveCycleV5 } from "./orchestrator";

// V5 types
export type { V5Skill } from "./skills";
export type { V5InterventionKind } from "./interventions";
export type { V5DiagnosticKind } from "./diagnostics";
export type { V5SignalBundle } from "./signals";
export type { V5Forecast } from "./forecast";
export type { V5StudyAssumptions } from "./assumptions";
```

**Contract boundary:** Must not shadow or override V4 exports. `V5` prefix prevents collision.  
**Suggested owner:** C2 (Contracts) — reviewed during integration

---

## Summary: C-Agent Ownership

| Extension Point | Owner | File |
|---|---|---|
| EP1: Provider Capabilities | C4 | `v5/capabilities.ts` |
| EP2: Intervention Kinds | C5 | `v5/interventions.ts` |
| EP3: Learner Diagnostics | C6 | `v5/diagnostics.ts` |
| EP4: Adaptive Signals | C5 | `v5/signals.ts` |
| EP5: Telemetry Events | C3 | `v5/telemetryEvents.ts` |
| EP6: Curriculum Skills | C7 | `v5/skills.ts` |
| EP7: Forecast Models | C7 | `v5/forecast.ts` |
| EP8: Study Assumptions | C7 | `v5/assumptions.ts` |
| EP9: Provider Registry | C4 | `v5/providers.ts` |
| EP10: Orchestrator | C5 / C3 | `v5/orchestrator.ts` |
| EP11: Barrel Export | C2 | `v5/index.ts` |

---

## Discovery Phase Rule

During V5 Phase 1 (discovery/planning), C-agents may produce:
- Type definitions
- Interface sketches
- Test harness scaffolds
- Design documents

**No production code** until C1 and C2 approve the scope and inheritance plan.
Each extension point file should start as a `.md` design document in `docs/placement/v5/`,
then graduate to `.ts` in `src/lib/placement/v5/` after Phase 1 approval.

---

**C2 SIGN-OFF:** 11 extension points catalogued with patterns, contract boundaries,
and C-agent ownership. V5 has a clear, safe path to extend V4 without modifying it.
Parallel discovery may begin: C3 (telemetry), C4 (providers), C5 (interventions),
C6 (diagnostics), C7 (curriculum/forecast).
