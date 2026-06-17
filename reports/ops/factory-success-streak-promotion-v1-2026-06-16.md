# Factory Success-Streak Promotion v1 - 2026-06-16

## Rule

The testing factory earns more speed only after clean loops.

Level 1 is the default and remains constrained to:

- One worker.
- One open MR.
- One running pipeline.

After 10 clean Level-1 loops, the factory may promote to Level 2:

- Two workers maximum.
- One open MR.
- One running pipeline.

After 10 more clean Level-2 loops, the factory may promote to Level 3:

- Admin plus C2 plus C4.
- One open MR.
- One running pipeline.

Level 3 does not promote further.

## Serious Failure Rule

Any serious failure resets the clean-loop streak. If the factory is above Level 1, capacity downgrades by one level.

Serious failures:

- `runner_system_failure`
- `runner_disk_floor`
- `feeder_leak`
- `duplicate_pipeline`
- `duplicate_mr`
- `scope_violation`
- `failed_job_twice`

`runner_disk_floor` is runner infrastructure failure. It does not count as product-code failure, and it must not advance the success streak. The factory can resume earning clean loops only after the runner disk condition is corrected and a clean retry completes.

## Implementation

The rule is implemented as a pure ops evaluator:

```sh
node scripts/ops/factory-success-streak-promotion.mjs --level 1 --clean-loops 9 --event clean_loop
```

The evaluator returns the next level, the clean-loop count at that level, whether promotion or downgrade occurred, and the allowed capacity for the resulting level.

## Scope Control

This is ops-only. It does not change app product behavior, auth, billing, SQL/RLS, secrets, deploy config, or CI topology.

## Verification

Focused test:

```sh
npx vitest run tests/ops/factory-success-streak-promotion.test.mjs
```
