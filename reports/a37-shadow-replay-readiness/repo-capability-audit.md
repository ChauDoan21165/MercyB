# A37 Repo Capability Audit

Date: 2026-05-20  
Baseline checked: `origin/main` at `de6d31c28 feat(placement-v3): end-to-end integration + vertical E2E (A33) (#942)`

## Evidence Checked

This audit was run from a clean worktree at `/private/tmp/a37-readiness-main`, not from the dirty shared working tree.

Files and directories checked:

- `src/router/AppRouter.tsx`
- `src/lib/featureFlags.ts`
- `supabase/functions/placement-v3-session/`
- `supabase/functions/placement-v3-grade-writing/`
- `supabase/functions/placement-v3-mercy-conversation/`
- `src/pages/placement/v3/`
- `src/hooks/placement/v3/`
- `src/lib/placement/v3/`
- `docs/placement-v3-integration-status.md`
- `docs/placement-v3-integration-pr-body.md`

Required-reading paths not present on `origin/main`:

- `docs/placement-v3/README.md`
- `docs/placement-v3/shadow-replay/a37-blockers.md` is only visible on `origin/feat/a37-shadow-session-replay`
- `docs/placement-v3/benchmarking/` is only visible on `origin/feat/a33-placement-benchmarking`
- `docs/placement-v3/drift-detection/` is only visible on `origin/feat/a36-grading-drift-detection`
- `docs/placement-v3/adaptive-generation/` is only visible on `origin/feat/a35-adaptive-item-generation`

## Placement V3 Systems Now Present

#942 merged enough Placement V3 runtime surface to make shadow replay architecturally discussable:

- V3 SPA routes are present under `src/pages/placement/v3/`.
- V3 hooks are present under `src/hooks/placement/v3/`.
- V3 browser client code exists under `src/lib/placement/v3/`.
- V3 routes are wired in `src/router/AppRouter.tsx`.
- V3 route access is gated by `PLACEMENT_TEST_ENABLED` and `PLACEMENT_V3_UI_ENABLED`, both default false in `src/lib/featureFlags.ts`.
- `supabase/functions/placement-v3-session/` exists with action handling for start, response submission, abandon, resume, and status.
- `supabase/functions/placement-v3-session/persistence.ts` persists sessions, responses, and profiles.

## Grader Systems Present

- `supabase/functions/placement-v3-grade-writing/` exists and returns assessment, raw provider response, provider, model, and latency.
- `supabase/functions/placement-v3-mercy-conversation/` exists.
- `_shared/aiProvider.ts` supports OpenAI/Gemini routing and failover.
- Provider execution still requires real `OPENAI_API_KEY` and/or `GEMINI_API_KEY`.

## Persistence Systems Present

Current Placement V3 persistence stores operational placement state:

- `placement_v3_sessions`
- `placement_v3_responses`
- `placement_v3_profiles`

That is not enough for shadow replay. The current persistence does not appear to store a replay-safe ordered event stream, prompt hashes, code versions, retry history, token usage, replay batches, replay diffs, sanitization status, or privacy audit state.

## Replay-Related Systems Already Present

No production shadow replay system exists on `origin/main`.

Pieces that could be reused later:

- Placement session action boundaries in `placement-v3-session/core.ts`.
- Provider metadata returned by the writing grader edge function.
- Recommendation output from `src/lib/placement/v3/recommender.ts`.
- L1 interference trigger data in prompt/task definitions.

## Is Session Replay Technically Possible Yet?

Not safely.

The codebase now has enough Placement V3 runtime shape to design capture points, but replay is not technically complete because there is no shadow capture middleware, no replay schema, no deterministic replay engine, no sanitization audit, no replay diff storage, and no real provider/Supabase environment available in this shell.

## Replay-Risk Areas

- AI provider nondeterminism across OpenAI/Gemini, model versions, latency, and failover.
- Missing token usage in the public placement response path.
- Existing persistence is session-state oriented, not event-sourced.
- Retry and timeout behavior is not yet captured as first-class replay data.
- Conversation and writing outputs may drift even with identical inputs.

## Determinism-Risk Areas

- Provider routing can change if one provider fails.
- Model upgrades can change CEFR judgments.
- Timestamps and ordering need monotonic sequence numbers, not only wall-clock time.
- Recommendation ordering may drift if lesson indexes or scoring weights change.
- Prompt/task version hashes are required before replay comparisons are meaningful.

## Privacy-Risk Areas

- User writing responses can contain names, email addresses, phone numbers, URLs, workplace details, immigration details, or secrets.
- Speaking assessment may create audio, transcripts, pronunciation metadata, and provider raw output.
- Raw provider responses may echo personal data.
- Shadow replay data must be admin-only, retention-limited, sanitized, and auditable before any production capture.
