# A2 Runtime Findings

Generated: 2026-05-20

## Burn-In Summary

Run ID: `a2-burnin-02`

| Metric | Result |
| --- | ---: |
| Required scenarios | 10 |
| Scenario executions | 20 |
| Raw run files | 20 |
| In-process reconstructions | 20 |
| Replay reconstructions | 20 |
| After-runs with no reconstruction dead end or retry inconsistency | 9/10 |

The one after-run still reporting an orchestration dead end is `persistence-write-failure`. That is expected: a write failure before state advancement is unrecoverable and should remain visible as a hard stop.

## Instrumentation Fix Found During Burn-In

The first clean-room run attempt used an `after` terminal event with sequence `20`. The timeline builder correctly interpreted the jump as missing forensic evidence. The harness was fixed to append terminal events with the next contiguous sequence number, and `a2-burnin-02` was rerun.

## Reconstruction Quality

- Provider fallback: reconstructed provider switch and explicit fallback.
- Retry exhaustion: reconstructed impossible before-state retry attempt and clean after-state retry sequence.
- Malformed grader output: reconstructed deterministic parse failure plus degraded fallback outcome.
- Interrupted recovery: reconstructed unknown before-state recovery and recovered after-state recovery.
- Partial orchestration corruption: reconstructed stuck before-state transition and clean failed-state after transition.

## Evidence Paths

- Command log: `docs/placement-v3/observability/raw-runs/a2-burnin-02-command.log`
- Replay log: `docs/placement-v3/observability/raw-runs/a2-burnin-02-replay-command.log`
- Replay outputs: `docs/placement-v3/observability/raw-runs/replay-a2-burnin-02/`

## Verification Runs

- `npm run typecheck`: passed 3 consecutive reruns after dependency reinstall.
- `npm run typecheck:ci`: passed 3 consecutive reruns after dependency reinstall.
- `npm run build`: passed 3 consecutive reruns after dependency reinstall.
- `npx vitest run tests/integration/placement-v3-forensics`: passed 3 consecutive runs, 16 tests each.
- `npx playwright test tests/e2e/placement-forensics-dashboard.spec.ts --config=playwright.smoke.config.ts`: passed 3 consecutive runs, 8 tests each.

An earlier verification loop is preserved in `a2-verify-*.log`; it became invalid after local `node_modules/.bin/tsc` and `node_modules/.bin/tsx` disappeared mid-loop. Dependencies were restored with `npm install`, then the `*-rerun-*` logs were produced with `set -o pipefail`.
