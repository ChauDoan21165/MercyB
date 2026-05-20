# Placement V3 E2E Command

Date: 2026-05-20

## Discovery

The default Playwright config points at legacy `./e2e` tests and does not discover `tests/e2e/placement-v3-vertical.spec.ts`.

Correct config found: `playwright.smoke.config.ts`

## Command Used

```bash
npx playwright test -c playwright.smoke.config.ts tests/e2e/placement-v3-vertical.spec.ts
```

## Result

Pass.

Evidence: `reports/a37-shadow-replay-readiness/placement-e2e.log`

## Scope Limitation

This verifies the mocked Placement V3 vertical E2E path only. It does not prove real provider grading, Supabase persistence, Azure speech scoring, real shadow capture, or replay determinism.
