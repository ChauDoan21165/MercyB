# DP-LEARNER-SIGNAL-WP-000016 Recovery Artifact

## Workpack

- `wp_id`: `DP-LEARNER-SIGNAL-WP-000016`
- `semantic_key`: `dp.dp.learner.signal.productive_struggle_integration_01`
- Worker: `F-DP-INT-W1`

## Recovery

- Inspected the stale worktree diff.
- Kept the productive-struggle DP/PED/LM regression and fixed its stale ordering assumption by selecting records by `signal_key`.
- No unsafe learner-weakness inference or mastery reduction is introduced.

## Validation

- `npm test -- --run src/lib/tm-int/learning-signals src/lib/tm-int` PASS: 25 files, 166 tests.
- `npm run typecheck` PASS.
- `npm exec eslint -- scripts src --format json` PASS: 4,931 files, 0 errors, 0 warnings.

## Anti-Fake Checks

- Source/test diff is scoped to the claimed productive-struggle invariant.
- No Judge ledger write in this worktree.
- No `verified` update.
