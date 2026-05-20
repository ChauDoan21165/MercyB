# Placement v3 Integration Status

Date: 2026-05-20  
Branch: `feat/placement-v3-integration`

## What Works End-to-End

- `/placement` can be enabled for local smoke runs with `VITE_PLACEMENT_TEST_ENABLED=true` and `VITE_PLACEMENT_V3_UI_ENABLED=true`.
- A30 UI starts a real v3 session through the session client.
- The browser client calls `/functions/v1/placement-v3-session` instead of localStorage mocks.
- The vertical E2E executes the #938 session orchestrator core through a network-level route.
- Writing responses execute the #933 writing grader core through `createHttpWritingGrader`.
- Conversation responses execute the A32 Mercy conversation grader and normalize its assessment shape.
- Session, responses, and final profile are persisted in the E2E persistence adapter using the #935 table-shaped contracts.
- Results render multi-skill CEFR and recommendations.
- Orchestrator prompt selection uses #937 prompt catalog ids.
- Orchestrator recommendation finalization is wired to the #936 recommender adapter in production code.

## What Is Still Stubbed

- A29 speaking/reading/listening graders are not on `origin`; those modalities still use `stubGrade()` in orchestrator fallback.
- The E2E uses an in-memory persistence adapter instead of a real Supabase database because local test credentials/migrations are not available in this environment.
- The E2E seeds a Supabase-js compatible browser session and routes Auth endpoints locally instead of logging into a real Supabase test user.
- The UI client maps real orchestrator prompts into a simplified bilingual task view. Full #937 reading/listening MCQ rendering from prompt metadata remains follow-up work.

## Known Issues

- See `docs/placement-v3-integration-bugs.md`.
- Biggest blocker: A29 grader branch/PR missing from `origin`.
- Deployment packaging for importing app-side recommender code from an edge function needs review before production function deploy.

## Test Results

Passing:

```bash
VITE_PLACEMENT_TEST_ENABLED=true VITE_PLACEMENT_V3_UI_ENABLED=true \
VITE_SUPABASE_URL=https://placeholder.invalid.supabase.co \
VITE_SUPABASE_ANON_KEY=placeholder-anon-key-not-real \
npx playwright test tests/e2e/placement-v3-vertical.spec.ts --config=playwright.smoke.config.ts
# 1 passed (7.9s)
```

Earlier failed runs found:

- route gate ignored env flags until `featureFlags.ts` used direct placement env reads;
- submit race on first task transition until the spec waited for `/placement/test/:sessionId`.

## Observed Performance

- Vertical E2E wall time: 7.9 seconds.
- Writing grader fixture latency reported by mocked AI trace: 240 ms per writing call.
- Conversation grader is deterministic local core in the E2E route; no network latency measured.

## Open Product Questions

- Should v3 launch as a cohort-only feature flag first, or stay staff-only until A29 graders land?
- Should free-tier users get the full multi-skill result once, or a shorter diagnostic with lessons first?
- How much Vietnamese explanation should appear in the result page versus the lesson recommendation reasons?
