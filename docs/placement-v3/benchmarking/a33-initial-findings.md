# A33 Initial Findings

Generated: 2026-05-20

## Required Files Read

- `STRATEGY.md` and `PRINCIPLES.md`: current product doctrine is Vietnamese-first, outcomes over engagement, small diffs, and evidence before patching.
- `docs/placement-v3/README.md`: missing in this worktree.
- `supabase/functions/placement-v3-session-orchestrator/index.ts`: missing under that name. Closest active implementation is `supabase/functions/placement-v3-session/index.ts`.
- `supabase/functions/placement-v3-session/index.ts` and `core.ts`: authenticated Edge Function, action-based session API, starts at writing, calls a writing grader through `createHttpWritingGrader`, persists responses, then aggregates a final profile.
- `supabase/functions/_shared/aiProvider.ts`: OpenAI-first, Gemini failover on timeout, thrown network errors, 429, and 5xx. JSON mode and text mode expose provider, latency, attempts, and raw response. Streaming failover only happens before bytes begin.
- `supabase/functions/_shared/aiLogger.ts`: existing cost helper is older and OpenAI-heavy; it does not include Gemini 2.5 pricing and is not wired into the placement graders read in this pass.
- `supabase/functions/placement-v3-grade-writing/index.ts`: missing in this worktree. This is a runtime blocker because the session orchestrator references a writing grader function URL.
- `supabase/functions/placement-v3-grade-reading`, `placement-v3-grade-listening`, `placement-v3-grade-speaking`: all call `chatJsonWithFailover`, use `gpt-4o-mini` primary and `gemini-2.5-flash` failover, timeout at 20 seconds, and return `modelTrace` with provider, model, latency, and estimated token counts.
- `supabase/functions/azure-phoneme/index.ts`: Azure Pronunciation Assessment path is authenticated, rate-limited, budget-checked, audited to speech tables, and already emits latency telemetry around the Azure REST call.
- `src/lib/featureFlags.ts`: placement test UI is currently hidden by compile-time `PLACEMENT_TEST_ENABLED: false`; benchmark work should avoid re-exposing placement UX.
- `tests/e2e/`: smoke suite uses Playwright, local Vite, test Supabase credentials, and stubs third-party AI APIs in browser-level flows.
- `src/lib/monitoring/sentryInit.ts`: Sentry is gated by DSN, privacy-scrubbed, and disabled in tests.

## Architecture Findings

1. Placement V3 is partly present but path names in the task do not match this branch. The active session function is `placement-v3-session`, not `placement-v3-session-orchestrator`.
2. Reading, listening, and speaking graders are production-shaped and expose the metric fields needed for latency, token, provider, and cost benchmarking.
3. Writing is the largest integration gap: the session orchestrator starts with writing and calls a writing grader client, but the `placement-v3-grade-writing` function directory is absent locally.
4. Provider failover evidence can be captured from `modelTrace.provider` and `attempts` when callers expose attempts. Current grader core returns provider/model/latency/token estimates but not always attempts, so the harness must preserve raw responses and infer failover conservatively.
5. Azure pronunciation benchmarking is available as a separate modality, but live execution requires Azure and Supabase credentials.
6. Dashboard data should be admin-only. Benchmark tables need RLS because they live in `public`.

## Runtime Risks To Verify

- Missing writing grader may make full orchestrated placement sessions fail before any adaptive flow can complete.
- Feature flag keeps current placement UI hidden, so E2E placement smoke may skip or redirect unless the flag is enabled in the test environment.
- `aiLogger.calculateCost` pricing is stale for Gemini and newer OpenAI pricing; A33 needs its own explicit estimator until the shared logger is updated.
- No raw provider routing table exists yet for benchmark-specific failover events.

## Initial Implementation Decision

Build a benchmark harness that can run live against Supabase Edge Functions when credentials are present, and can run deterministic dry-run validation locally without fabricating production metrics. Raw dry-run artifacts must be labeled as dry-run and cannot satisfy the hard gate for real API runs.
