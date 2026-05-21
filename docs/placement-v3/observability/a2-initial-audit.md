# A2 Initial Audit: Placement V3 Observability

Generated: 2026-05-20

## Files Read

- `supabase/functions/placement-v3-session/index.ts`
- `supabase/functions/placement-v3-session/core.ts`
- `supabase/functions/placement-v3-session/graderClient.ts`
- `supabase/functions/placement-v3-session/errorRecovery.ts`
- `supabase/functions/placement-v3-session/persistence.ts`
- `supabase/functions/placement-v3-grade-writing/index.ts`
- `supabase/functions/_shared/aiProvider.ts`
- `supabase/functions/_shared/aiLogger.ts`
- `src/lib/featureFlags.ts`
- `src/router/AppRouter.tsx`
- `src/lib/monitoring/sentryInit.ts`
- `supabase/functions/_shared/sentry.ts`
- `docs/placement-v3-integration-status.md`

## Existing Logs Found

- `placement-v3-session/core.ts` emits string console events such as `placement_v3.request`, `placement_v3.transition`, and `placement_v3.grader_call`.
- `placement-v3-session/index.ts` previously attached no durable correlation ID, feature flag snapshot, failure snapshot, or persisted forensic event.
- `aiProvider.ts` logs provider, latency, attempts, and parse/error kind to console for shared JSON and streaming failover paths.
- `aiLogger.ts` can persist generic model usage to `ai_usage`, but it is not Placement V3 session-correlated.
- Edge Sentry wrapping exists through `wrapHandler`, and browser Sentry initialization scrubs PII, but no Placement V3-specific context enrichment existed.

## Existing Provider Metadata

- Shared AI JSON calls can return `provider`, `latencyMs`, `attempts`, `raw`, and optional `errorKind`.
- The session orchestrator calls `placement-v3-grade-writing` through `createHttpWritingGrader`; the orchestrator saw only `grade.ok`, `grade.version`, and optional `errorCode`.
- Writing grader failures return fallback assessments for rate limits, HTTP errors, malformed JSON, timeouts, and network errors.
- Speaking, reading, listening, and conversation paths still include stub or local grader behavior per the integration status.

## Retry Behavior

- Shared `aiProvider.ts` performs OpenAI first, then Gemini failover for timeout, thrown network error, 429, or 5xx. It is not a multi-retry loop.
- `placement-v3-session/graderClient.ts` uses one HTTP attempt per grader call with an abort timeout and fallback assessment.
- The orchestrator has recoverable error metadata for grader fallback but no previous persisted retry event stream.

## Fallback Behavior

- Writing grader fallback allows the session to continue with a low-confidence heuristic assessment.
- `recommendLessons` falls back to a local recommendation generator if importing the app recommender fails.
- Resume can recover sessions in `error` state through `recoverFromError`.
- Database write failures throw and do not safely advance client state.

## Known Blind Spots Before A2

- No persisted Placement V3 forensic event table.
- No per-session correlation ID through request, grading, recommendation, and response.
- No durable feature flag snapshot.
- No persisted recoverability state or degraded-result marker.
- No taxonomy-trigger event type.
- No dashboard for failed/degraded Placement V3 sessions.
- No replay tool to reconstruct event order, provider switches, retries, or fallback transitions.

## Scope Note

`supabase/functions/placement-v3-session-orchestrator/index.ts` does not exist on this branch. The actual runtime entrypoint is `supabase/functions/placement-v3-session/index.ts`, so A2 instrumentation targets that Edge Function.
