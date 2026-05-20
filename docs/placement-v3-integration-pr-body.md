# feat(placement-v3): end-to-end integration + vertical E2E (A33)

## Summary

Draft integration PR for Placement v3. This wires the isolated design, taxonomy,
schema, prompts/calibration, writing grader, recommender, session orchestrator,
Mercy conversation mode, and UI drafts into one working vertical.

## Phase Summary

- Phase 1 audit: added `docs/placement-v3-integration-audit.md` with shipped
  surfaces, dependencies, consumers, stubs, contracts, dependency graph, and
  mismatch list.
- Phase 2 branch/merge: merged the available PR branches in dependency order.
  No file-level conflicts occurred; A29 was not available on `origin`.
- Phase 3 wiring: replaced the UI localStorage client with real session fetches,
  connected orchestrator prompt selection to the #937 catalog, connected
  finalization to the #936 recommender adapter, and bridged A32 conversation
  grading into the orchestrator grader client.
- Phase 4 E2E: added `tests/e2e/placement-v3-vertical.spec.ts`. The test routes
  the browser network call into the real #938 orchestrator core, executes #933
  writing grading and A32 conversation grading, persists through table-shaped
  adapters, completes the UI flow, and verifies multi-skill results plus
  recommendations.
- Phase 5 fixes: documented integration bugs in
  `docs/placement-v3-integration-bugs.md`.
- Phase 6 status: added `docs/placement-v3-integration-status.md` with what
  works, what remains stubbed, known issues, performance notes, and open product
  questions.

## Conflict Resolutions

No file-level merge conflicts were produced by Git. The only setup issue was a
transient `fatal: Unable to write index`, resolved by retrying after recreating
the integration worktree. A29 remains missing from `origin`, so
speaking/reading/listening graders are still orchestrator fallbacks.

## Wirings Made

- `src/lib/placement/v3/clientStub.ts`: real `/functions/v1/placement-v3-session`
  client, with fixture internals kept only for tests.
- `supabase/functions/placement-v3-session/modality.ts`: uses real prompt catalog
  ids from #937.
- `supabase/functions/placement-v3-session/persistence.ts`: adapts completed
  profiles into the #936 recommender.
- `supabase/functions/placement-v3-session/graderClient.ts`: calls the writing
  grader endpoint and routes conversation grading to the A32 Mercy conversation
  function shape.
- `src/lib/featureFlags.ts`, `vite.config.ts`, `src/router/AppRouter.tsx`,
  `playwright.smoke.config.ts`: placement smoke-test flags and E2E auth bypass.
- `src/types/placement-v3.ts`: shared placement v3 assessment/recommender types.
- `src/test/setup.ts`: repairs the shared Vitest localStorage/sessionStorage
  environment for Node 25 so repo tests and Supabase auth storage can run.

## Bugs Found and Fixed

See `docs/placement-v3-integration-bugs.md`. Highlights:

- UI was still completing against localStorage instead of the orchestrator.
- Placement flags could not be enabled in the smoke server.
- Orchestrator prompt ids were generated stubs instead of #937 catalog ids.
- Final recommendations were synthetic stubs instead of #936 adapter output.
- A32 conversation assessments did not match the orchestrator assessment shape.
- Shared Vitest storage was broken under Node 25, causing
  `localStorage.clear/getItem is not a function` and Supabase auth
  `storage.getItem is not a function` failures. This was a pre-existing test
  harness gap, not Placement v3 business logic.

## Test Results

Passing:

```bash
npm run typecheck
npm run typecheck:ci
npm run typecheck:functions
npm run lint
npm test
npm run build
VITE_PLACEMENT_TEST_ENABLED=true VITE_PLACEMENT_V3_UI_ENABLED=true \
VITE_SUPABASE_URL=https://placeholder.invalid.supabase.co \
VITE_SUPABASE_ANON_KEY=placeholder-anon-key-not-real \
npx playwright test tests/e2e/placement-v3-vertical.spec.ts --config=playwright.smoke.config.ts
# 1 passed (7.9s)
```

`npm test` passed: 407 test files, 7070 tests.

## Known Issues

- A29 non-writing graders are unavailable on `origin`; speaking, reading, and
  listening still use orchestrator fallbacks.
- The session edge function imports app-side recommender code. Typecheck and
  build pass, but Supabase deployment packaging needs review.
- The E2E uses in-memory table-shaped persistence rather than a live Supabase
  database because local credentials/migrations were not available here.
- Rich reading/listening prompt metadata is preserved but not fully rendered by
  the A30 simplified task UI.

## Recommended Next Steps

- Land or expose A29, then replace non-writing grader fallbacks.
- Run the vertical against a migrated Supabase test project.
- Review edge-function packaging for the app-side recommender import.
- Fix the shared Vitest localStorage environment separately so `npm test` can be
  a reliable full-repo gate again.
