# A33 Placement v3 Endurance Initial Audit

Date: 2026-05-20  
Branch: `feat/a33-placement-v3-endurance-burnin`

## Current Benchmark Tooling

- `scripts/placement-v3/run-benchmarks.ts` does not exist on merged `origin/main`.
- `scripts/placement-v3/scenarios/` does not exist on merged `origin/main`.
- `docs/placement-v3/benchmarking/` does not exist on merged `origin/main`.
- Existing executable coverage is mostly unit tests under
  `supabase/functions/placement-v3-session/__tests__/` and the vertical E2E at
  `tests/e2e/placement-v3-vertical.spec.ts`.

Implication: A33 must add the first benchmark/endurance runner rather than
extending an existing runner.

## Current Session Persistence

Production persistence is implemented in
`supabase/functions/placement-v3-session/persistence.ts`.

Tables used by the orchestrator:

- `placement_v3_sessions`
- `placement_v3_responses`
- `placement_v3_profiles`

The main invariants are:

- one session row per placement attempt;
- response rows reference a session and are ordered by `task_index`;
- duplicate task submissions return the current prompt without inserting a new
  response;
- completed sessions receive one current profile through `upsertProfile`;
- previous profiles for a user are marked `is_current = false`;
- abandoned and expired sessions are terminal.

The current local/E2E test harness uses in-memory adapters with table-shaped
contracts, not a migrated Supabase test project.

## Current Retry/Fallback Behavior

- Writing and conversation use `createHttpWritingGrader`.
- Writing timeout, HTTP failure, malformed JSON, network error, and 429 return
  fallback assessments with `ok: false` and `metadata.fallback = true`.
- Conversation timeout, HTTP failure, malformed JSON, and network error return
  fallback assessments similarly.
- Speaking, reading, and listening still use `stubGrade()` because A29 graders
  are not present on `origin`.
- Recoverable grader failures append `metadata.errors[]` on the session and the
  session remains recoverable.
- UI submit retry replays the last payload through `usePlacementSubmit.retry()`.
- Duplicate task submissions are idempotent at the orchestrator layer.

## Current Test Harness

- `tests/e2e/placement-v3-vertical.spec.ts` routes the browser network call to
  the real session orchestrator core.
- The E2E executes writing grading through the writing grader core and
  conversation grading through the Mercy conversation grader.
- The E2E persistence adapter is in-memory but keeps the same session/response
  profile shapes used by the real persistence layer.
- `src/test/setup.ts` now installs explicit in-memory `localStorage` and
  `sessionStorage` because Node 25 exposes an experimental global
  `localStorage` object that lacks Web Storage methods without
  `--localstorage-file`.

## Likely Leak/Race Risk Areas

- Browser session/result caches:
  `mb.placement.v3.session` in localStorage and
  `mb.placement.v3.results.<sessionId>` in sessionStorage.
- `usePlacementAudioCapture` media streams and timers during repeated speaking
  tasks.
- `usePlacementSubmit.retry()` can replay the last payload after a network error;
  duplicate handling must stay idempotent.
- Delayed/timeout grader responses can append recoverable errors repeatedly.
- Expired-session handling marks sessions abandoned on response/resume.
- Results page loads from sessionStorage first and falls back to status fetch;
  stale sessionStorage can hide backend result issues.
- The app-side recommender import inside the edge persistence adapter remains a
  packaging risk for real Supabase function deploys.

## What Can Be Tested Here

- Repeated full orchestrator sessions in local/session-mode.
- Resume, abandon, duplicate submission, retry, timeout, delayed grading,
  fallback grading, partial recommendation failure, and interrupted persistence
  scenarios against the real `handleAction()` core.
- Node process memory trends with `process.memoryUsage()`.
- Browser/client trend checks using Playwright routes and browser-side memory
  monitor APIs where Chromium exposes heap data.
- Integrity audits over raw endurance artifacts.

## What Cannot Be Fully Tested Here

- Real provider latency for OpenAI or other graders without production/staging
  provider keys and a configured Supabase function environment.
- Live Supabase persistence without a migrated test project and service role
  credentials.
- Real microphone/media-stream resource cleanup on iOS/Android devices.
- Real edge deployment packaging behavior for the app-side recommender import.

If provider or Supabase credentials are missing, the campaign must continue in
local/session-mode and document that limitation in `a33-blockers.md`.
