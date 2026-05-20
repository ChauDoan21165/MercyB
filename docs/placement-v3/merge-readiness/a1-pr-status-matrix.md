# A1 Placement V3 PR Status Matrix

Date: 2026-05-20

Raw evidence:

- PR metadata: `docs/placement-v3/merge-readiness/raw/*-pr.json`
- merge-tree output: `docs/placement-v3/merge-readiness/raw/*-merge-tree.txt`
- no-commit merge simulation: `docs/placement-v3/merge-readiness/raw/*-merge-sim.log`
- focused verification logs: `docs/placement-v3/merge-readiness/raw/*typecheck*.log`, `*vitest.log`, `*e2e.log`, `942-lint.log`

## Active PRs

| PR | Branch | Head SHA | Base | Draft | Changed files | Merge sim vs `origin/main` | Local verification | Status |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| #932 | `design/A22-placement-v3` | `fff69320258b` | `main` | yes | 1 | pass | merge evidence only | covered by #942 |
| #933 | `feat/placement-v3-grade-writing` | `0c7cddee5538` | `main` | yes | 14 | pass | merge evidence only | covered by #942 |
| #934 | `feat/placement-v3-vn-l1-taxonomy` | `2a0283ae78fc` | `main` | yes | 3 | pass | merge evidence only | covered by #942 |
| #935 | `feat/placement-v3-storage` | `5ff6191ebd5b` | `main` | yes | 7 | pass | merge evidence only | covered by #942 |
| #936 | `feat/placement-v3-recommender` | `942a495ba9ae` | `main` | yes | 7 | pass | merge evidence only | covered by #942 |
| #937 | `feat/placement-v3-prompts-and-calibration` | `86ef89f4e464` | `main` | yes | 13 | pass | merge evidence only | covered by #942 |
| #938 | `feat/placement-v3-session-orchestrator` | `6ee012035053` | `main` | yes | 31 | pass | merge evidence only | covered by #942 |
| #939 | `feat/placement-v3-mercy-conversation` | `e4692305d30f` | `main` | yes | 20 | pass | merge evidence only | covered by #942 |
| #940 | `feat/placement-v3-ui` | `d3888d3d7f08` | `main` | yes | 40 | pass | merge evidence only | covered by #942 |
| #942 | `feat/placement-v3-integration` | `7fd5f4cbb78d` | `main` | yes | 100 | pass | full repeated verification pass | umbrella candidate |
| #943 | `feat/a36-grading-drift-detection` | `06334d0d1a63` | `main` | yes | 100 | pass | typecheck + drift tests pass | merge after #942, doc fix needed |
| #944 | `feat/a33-placement-benchmarking` | `c8ce5fdbd84a` | `main` | yes | 60 | fail vs main; pass onto #942 | typecheck + benchmark tests pass | rebase/merge after #942 |
| #946 | `feat/a35-adaptive-item-generation` | `fc692e8608f7` | `main` | yes | 75 | pass | typecheck + adaptive tests pass | keep draft / merge after #942 review |

## Closed Requested PR

| PR | Branch | Head SHA | State | Changed files | Evidence | Status |
| --- | --- | --- | --- | ---: | --- | --- |
| #945 | `feat/a37-shadow-session-replay` | `fb0feef365cb` | closed | 1 | docs-only check pass | no merge action |

## #942 Repeated Verification

Required repeated loop completed three times on `origin/pr/942`.

| Run | `npm test` | `npm run typecheck` | `npm run build` |
| --- | --- | --- | --- |
| 1 | pass: 407 files / 7070 tests | pass | pass |
| 2 | pass: 407 files / 7070 tests | pass | pass |
| 3 | pass: 407 files / 7070 tests | pass | pass |

Additional #942 gates:

| Command | Result |
| --- | --- |
| `npm run typecheck:ci` | pass |
| `npm run lint` | pass, 0 errors / 627 warnings |
| `VITE_PLACEMENT_TEST_ENABLED=true VITE_PLACEMENT_V3_UI_ENABLED=true VITE_SUPABASE_URL=https://placeholder.invalid.supabase.co VITE_SUPABASE_ANON_KEY=placeholder-anon-key-not-real npx playwright test tests/e2e/placement-v3-vertical.spec.ts --config=playwright.smoke.config.ts` | pass, 1 test |

## Conflict Notes

- #944 fails direct no-commit merge into `origin/main` with add/add conflicts in:
  - `supabase/functions/placement-v3-session/graderClient.ts`
  - `supabase/functions/placement-v3-session/modality.ts`
  - `supabase/functions/placement-v3-session/persistence.ts`
- #944 no-commit merge onto #942 passes. Merge order should make #942 the base for #944.
- #943 no-commit merge onto #942 passes.
- #946 no-commit merge onto #942 passes.

