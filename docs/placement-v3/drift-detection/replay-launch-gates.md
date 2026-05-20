# Replay Launch Gates

These gates define when Placement V3 drift replay can move from simulation/infrastructure to live operational use.

## Minimum Successful Replay Count

- First live validation: at least 1 complete dry live replay with `--persist=false`.
- Persistence validation: at least 1 complete live replay with `--persist=true`.
- Provider drift baseline: at least 3 successful live replay batches on the same fixture corpus before making provider drift claims.

## Acceptable Replay Failure Rate

Initial live replay gates:

- command exit code: `0`
- fixture load failure: `0%`
- infrastructure error or timeout: less than or equal to `5%`
- malformed output: less than or equal to `10%` for first baseline

Any all-sample provider failure is a blocker.

## Acceptable Drift Variance

For first baseline:

- catastrophic CEFR movement should be reviewed manually, not auto-accepted.
- mean absolute delta should be recorded, not treated as product truth yet.
- provider variance is preliminary until at least 3 live batches exist.

For repeated live replay:

- catastrophic disagreement count should not increase between repeated batches without a fixture or prompt change.
- provider/model changes must be called out separately from learner-signal drift.

## Acceptable Persistence Failure Rate

- replay run row: exactly 1 per `runId`
- replay score rows: `100%` of replayed fixtures
- duplicate `(run_id, sample_id)`: `0`
- orphan rows: `0`
- timestamp ordering violations: `0`

## Replay Determinism Threshold

Simulation determinism must pass before live replay:

```bash
npm run check:placement-replay-determinism -- --runs 5
```

Expected: zero normalized deterministic differences.

Live provider output is not required to be deterministic. Live output must still preserve stable fixture ordering, valid replay IDs, valid timestamps, and complete provider metadata.

## DO NOT ENABLE Conditions

Do not run persisted live replay if:

- Supabase URL or anon key is missing.
- service-role key is missing and `--persist=true` is intended.
- migration `20260520112527_placement_v3_grading_drift.sql` is not applied.
- fixture integrity check fails.
- determinism guardrail fails.
- dashboard admin access cannot be verified.
- successful live rows would be indistinguishable from simulation rows.
- provider credentials or edge-function routing are uncertain.

Do not claim live drift metrics if:

- replay was run with `--simulate`
- artifacts have `simulated: true`
- provider is `none`
- replay did not reach provider-backed edge functions
- replay was not persisted but the claim depends on persisted tables
