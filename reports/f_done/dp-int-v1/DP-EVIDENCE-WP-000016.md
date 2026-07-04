# DP-EVIDENCE-WP-000016 F evidence

## Scope

- Workpack: DP-EVIDENCE-WP-000016
- Source anchor: `src/lib/tm-int/runtime/signalAggregator.ts` / `aggregateLearningSignals`
- Objective: preserve aggregated learning signals from the runtime pipeline for DP evidence intake.

## Implementation

- Added `evidenceReferences` to aggregated Teacher Context learning signals.
- Each reference is derived from the source OBS fact type plus task/route/time anchor, for example `AssessmentAnswerSubmitted:transfer::item-1`.
- Extended runtime pipeline coverage to prove alternatives remain visible and evidence references match evidence counts.

## Validation

- `npm test -- --run src/lib/tm-int/runtimeReadiness src/lib/tm-int/runtime`
  - PASS: 13 files, 79 tests.
- `npm run typecheck`
  - PASS: `tsc -p tsconfig.typecheck.json --noEmit`.
- `npm exec eslint -- scripts src --format json`
  - PASS: exit 0; JSON report contained zero errors and zero warnings.

## Anti-fake checks

- Source diff exists in `src/lib/tm-int/runtime/signalAggregator.ts` and `src/lib/tm-int/runtime/types.ts`.
- Test diff exists in `src/lib/tm-int/runtime/__tests__/teacherContextPipeline.test.ts`.
- The test asserts preserved alternatives and OBS evidence references; it does not infer learner weakness from a single event.
- No Judge ledger was written.
- F queue `verified` remains locked to 0 by factory schema.
