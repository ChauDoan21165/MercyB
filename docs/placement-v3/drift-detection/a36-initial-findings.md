# A36 Initial Findings — Placement V3 Grading Drift Detection

Generated: 2026-05-20T11:25:00-06:00

## Required Context Read

- `STRATEGY.md` and `PRINCIPLES.md`: A36 supports outcome accuracy, Vietnamese-first diagnostics, and evidence-before-patching discipline.
- `docs/placement-v3/README.md`: not present in this branch. Placement V3 context currently lives in `docs/placement-v3-calibration/*`, `docs/placement-v3/adaptive-generation/*`, and function docs under `supabase/functions/placement-v3-session/`.
- `supabase/functions/placement-v3-grade-writing/index.ts`: present after the #942 integration rebase. #942 has merged Placement V3 writing grader infrastructure; A36 adds drift replay infrastructure and does not claim live replay metrics.
- `supabase/functions/_shared/aiProvider.ts`: OpenAI-primary with Gemini failover. JSON parse errors do not fail over; timeouts, thrown network failures, HTTP 429, and HTTP 5xx can fail over.
- `supabase/functions/_shared/aiLogger.ts`: writes AI usage entries to `ai_usage`, but current Placement V3 CEFR graders expose per-call trace data directly from grader responses instead of using this logger.
- `docs/placement-v3/calibration/`: not present under that exact path. Current calibration reports are under `docs/placement-v3-calibration/`.
- `docs/placement-v3/taxonomy/`: not present under that exact path. Current Vietnamese-L1 taxonomy is `docs/placement-vn-l1-interference-taxonomy.md`.
- `supabase/functions/placement-v3-session-orchestrator/index.ts`: not present under that name. Current orchestrator-equivalent is `supabase/functions/placement-v3-session/index.ts`.
- `docs/placement-v3/prompt-library/`: not present. Current prompt source of truth is `supabase/functions/_shared/cefr/promptBuilder.ts`.

## Existing Grading Surface

Placement V3 currently has real CEFR graders for:

- `placement-v3-grade-reading`
- `placement-v3-grade-listening`
- `placement-v3-grade-speaking`

All three share:

- CEFR output schema through `projectAssessmentForSubskills`
- Vietnamese-L1 interference flags in `l1InterferenceFlags`
- `modelTrace` with provider, model, latency, and token estimates
- strict JSON-output prompts from `promptBuilder.ts`

## Drift Risks Found

1. Provider attempts are not included in CEFR `modelTrace`, so retry-path variance cannot be fully measured from current grader responses.
2. The benchmark runner’s `extractTrace` expects `assessment.overall_cefr`, but current graders return `assessment.overall.level`; existing benchmark CEFR extraction will miss real scores.
3. Writing grader infrastructure is present from #942, but A36 live replay still requires Supabase/env configuration before any writing replay metrics can be claimed.
4. Taxonomy labels in prompt output are free-form pattern names; drift detection needs normalization because docs use kebab-case taxonomy IDs while prompts include underscore examples.
5. Gemini failover is observable only when OpenAI fails under current shared provider routing; forced cross-provider replay is not supported by the deployed grader contract yet.

## Implementation Direction

- Build replay fixtures for the modalities that exist now: reading, listening, speaking.
- Persist raw outputs and parsed metrics separately so reviewer evidence can be audited without trusting summaries.
- Fail closed when live Supabase/API credentials are unavailable.
- Keep drift analysis pure TypeScript in `src/lib/placementDrift` so tests can exercise the math without live providers.
- Add operator dashboard/report function over persisted replay tables.
