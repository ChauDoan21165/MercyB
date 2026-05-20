# A35 Initial Findings: Adaptive Item Generation

Generated: 2026-05-20

## Required Context Read

- `STRATEGY.md` and `PRINCIPLES.md`: Placement work must stay Vietnamese-first, mobile-first, outcome-focused, and tightly scoped. This A35 task should not change UI, graders, orchestration, recommendations, audio, or admin dashboards.
- `supabase/functions/_shared/aiProvider.ts`: Shared Edge Function AI provider supports JSON, text, and streaming calls with OpenAI first and Gemini failover only for timeout, rate limit, upstream 5xx, or thrown network failures. JSON mode returns raw output, provider, latency, attempts, and parse/error state, but it does not expose provider token usage from API responses.
- `supabase/functions/_shared/aiLogger.ts`: Existing AI usage logging writes to `ai_usage` and estimates cost from model and token counts. Pricing includes `gpt-4o-mini`, but comments say pricing is as of 2024, so A35 reports should label cost as an estimate unless real provider usage is captured.
- `supabase/functions/placement-v3-session/index.ts` and `supabase/functions/placement-v3-session/DESIGN.md`: The session function is the single Placement V3 entry point for `start`, `respond`, `abandon`, `resume`, and `status`. It keeps a fixed modality sequence, bounded adaptive difficulty, soft grader failure recovery, and persistence in `placement_v3_sessions`, `placement_v3_responses`, and `placement_v3_profiles`.
- `supabase/functions/placement-v3-grade-reading/*`, `placement-v3-grade-listening/*`, and `placement-v3-grade-speaking/*`: These graders call `chatJsonWithFailover` with modality-specific CEFR prompts and project model JSON into shared `CEFRAssessment` shapes. They validate inputs strictly and return model trace with estimated token counts.
- `src/data/system/`: Contains system support files, not room data. `mercyblade_moderation_rules.v1.json` defines multilingual moderation categories, severity levels, normalization, and escalation. `cross_topic_recommendations.json` is currently empty support data.
- `docs/placement-v3-calibration/`: Calibration reports document deterministic harness results for speaking, reading, listening, and writing. Live API calibration was blocked in the existing reports because no `OPENAI_API_KEY` or `GEMINI_API_KEY` was exposed locally.
- `docs/placement-vn-l1-interference-taxonomy.md`: The Vietnamese L1 taxonomy is the canonical local reference for transfer patterns such as final consonant loss, `-s/-ed` omission, article omission, question inversion, tense marking, prepositions, literal calques, and pragmatic transfer. A35 validators should explicitly check that item targets connect to useful Vietnamese-L1 diagnostic evidence without stigmatizing Vietnamese-accented English.
- `supabase/functions/_shared/cefr/types.ts` and `rubric.ts`: Shared CEFR types define `A1` through `C2`, modality subskills, `CEFRAssessment`, and modality rubrics for writing, speaking, reading, and listening. Adaptive item validation should judge rubric compatibility against these shapes.

## Missing Or Stale Requested Paths

- `docs/placement-v3/README.md` does not exist in this checkout.
- `docs/placement-v3/calibration/` does not exist; the available calibration directory is `docs/placement-v3-calibration/`.
- `docs/placement-v3/taxonomy/` does not exist; the available taxonomy reference is `docs/placement-vn-l1-interference-taxonomy.md`.
- `supabase/functions/placement-v3-grade-writing/index.ts` does not exist in this checkout. Existing calibration docs refer to a prior writing grader, but it is not present at the requested path.
- `supabase/functions/placement-v3-session-orchestrator/index.ts` does not exist; the available function is `supabase/functions/placement-v3-session/index.ts`.

## Implementation Implications

- A35 should add new generation and validation functions beside the current Placement V3 functions without modifying the session orchestrator or existing graders.
- Raw run evidence must include ISO timestamp, provider, model, latency, estimated token counts, raw model output, final decision, and rejection reasons. Because `aiProvider.ts` currently estimates tokens instead of surfacing provider usage, A35 should persist estimated tokens unless the local script calls provider APIs directly and captures usage.
- Validation must be stricter than generation. An accepted item must have CEFR-fit evidence, Vietnamese-L1 relevance evidence, rubric compatibility evidence, and duplicate-risk evidence.
- The local gauntlet must stop honestly if real model credentials are missing. The existing calibration docs already show this environment has previously blocked live API runs, so A35 must not fabricate raw runs or acceptance metrics.
