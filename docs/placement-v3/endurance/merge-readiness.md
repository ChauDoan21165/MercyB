# A33 Placement V3 Endurance Merge Readiness

Date: 2026-05-20
PR: #954
Branch: `feat/a33-placement-v3-endurance-burnin`

## What #954 Proves

- Placement V3 local/session-mode endurance tooling can execute repeated complete placement sessions without deterministic crash patterns.
- The final 100-run endurance campaign passed 100/100 executions.
- The final stability batch passed 25/25 uninterrupted executions.
- The endurance browser smoke suite passed all 10 required flows against the app through Playwright.
- The classifier integration suite covers 15 failure-clustering scenarios.
- The final local/session-mode integrity checks reported 0 violations for the final 100-run campaign and 0 violations for the final 25-run batch.
- The admin dashboard builds with persisted endurance metric shapes.

## What #954 Does Not Prove

- It does not prove live provider grading latency, cost, quota behavior, or provider retry characteristics.
- It does not prove production Supabase persistence latency under real network conditions.
- It does not prove A29 speaking/reading/listening grader behavior because those graders are still absent and documented fallbacks remain active.
- It does not prove production rollout readiness with feature flags enabled for real users.

## Endurance Evidence Summary

- 100/100 final endurance runs passed.
- 25/25 final stability runs passed.
- 10/10 Playwright endurance flows passed.
- 3 consecutive `npm test` runs passed before this merge-readiness follow-up: 408 files, 7085 tests passed each time.
- 3 consecutive `npm run typecheck`, `npm run typecheck:ci`, and `npm run build` cycles passed before this merge-readiness follow-up.
- `npm run lint` passed with 0 errors and existing warnings.

## Live Provider, Cost, And Latency Blockers

Live provider metrics remain blocked in this environment because provider credentials and production-like Supabase credentials were not available. The endurance evidence is local/session-mode evidence only. No live provider cost, quota, or external latency claims should be made from #954.

## CI Status

`gh pr checks 954` reached terminal green before this merge-readiness update:

- Build Preview: pass
- Build and Test: pass
- Comment on PR: pass
- Lighthouse Mobile: pass
- Lint Code: pass
- Module Boundaries: pass
- Validate Rooms: pass
- Vercel: pass
- Vercel Preview Comments: pass

## Local Verification

Final merge-readiness verification was rerun after the smoke harness fix:

- `npm run typecheck`: pass
- `npm run typecheck:ci`: pass
- `npm run build`: pass
- `npm run lint`: pass, 0 errors and 627 existing warnings
- `npm test`: pass, 408 files and 7085 tests
- `npx playwright test tests/e2e/placement-v3-endurance.spec.ts --config=playwright.smoke.config.ts`: pass, 10/10 tests

Logs are saved under `docs/placement-v3/endurance/verification-logs/merge-readiness-*.log`.

## Merge-Readiness Harness Fix

The merge-readiness Playwright command initially depended on local machine environment because `playwright.smoke.config.ts` did not force deterministic placeholder Supabase env vars for its dev server. On machines with real local `.env` Supabase values, the app derived a different Supabase auth storage key than the endurance test seeded, so the adult-start action stayed on the audience picker.

The fix sets placeholder `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` inside the smoke config web server command. This is a shared test harness fix, not Placement V3 business logic.

## Merge Recommendation

Technically merge-ready for the local/session-mode endurance tooling and regression evidence once post-update CI is green.

Keep PR #954 as draft unless Chau explicitly approves ready-for-review and accepts the local/session-mode evidence boundary. Live provider cost/latency burn-in should be run separately before enabling Placement V3 for real cohorts.
