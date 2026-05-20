# Placement V3 Live Replay Runbook

This runbook prepares the first real Placement V3 drift replay. It does not claim live replay has already been validated.

## Required Env Vars

Required for live replay without persistence:

```bash
export PLACEMENT_REPLAY_SUPABASE_URL="https://<project>.supabase.co"
export PLACEMENT_REPLAY_ANON_KEY="<anon-key>"
```

Optional but recommended for authenticated edge-function calls:

```bash
export PLACEMENT_REPLAY_JWT="<admin-or-test-user-jwt>"
```

Required only when persisting replay rows:

```bash
export PLACEMENT_REPLAY_SERVICE_ROLE_KEY="<service-role-key>"
```

Accepted fallback names are `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

## Required Supabase State

- Edge functions for the replayed modalities are deployed and reachable:
  - `placement-v3-grade-reading`
  - `placement-v3-grade-listening`
  - `placement-v3-grade-speaking`
  - `placement-v3-grade-writing` when writing fixtures are enabled later
- Drift report function is deployed:
  - `placement-v3-drift-report`
- Admin dashboard user has `get_admin_level(auth.uid()) >= 9`.
- RLS policies allow admin reads on replay tables.

## Required Migrations

The drift replay migration must be applied:

```text
supabase/migrations/20260520112527_placement_v3_grading_drift.sql
```

Expected tables:

- `public.placement_v3_replay_runs`
- `public.placement_v3_replay_scores`
- `public.placement_v3_drift_alerts`
- `public.placement_v3_provider_variance`

## Required Fixtures

Fixture corpus:

```text
docs/placement-v3/drift-detection/replay-fixtures/placement-v3-replay-samples.json
```

Preflight:

```bash
npm run check:placement-replay-fixtures
npm run check:placement-replay-determinism -- --runs 5
node scripts/placement-v3/verify-live-replay-env.ts
```

## Exact Replay Commands

Dry live replay, no database persistence:

```bash
npx tsx scripts/placement-v3/run-grading-replay.ts \
  --batch baseline-01 \
  --outDir docs/placement-v3/drift-detection/raw-runs \
  --resume=false
```

Persisted live replay:

```bash
npx tsx scripts/placement-v3/run-grading-replay.ts \
  --batch baseline-01 \
  --outDir docs/placement-v3/drift-detection/raw-runs \
  --persist=true \
  --resume=false
```

Resume a partially completed replay:

```bash
npx tsx scripts/placement-v3/run-grading-replay.ts \
  --batch baseline-01 \
  --outDir docs/placement-v3/drift-detection/raw-runs \
  --persist=true
```

## Expected Outputs

Console log:

- `run=<batch timestamped run id>`
- `samples=40`
- one line per fixture with `sample`, `modality`, `status`, `provider`, `cefr`, and `latencyMs`
- final `wrote <raw run artifact>`

Replay artifacts in `raw-runs/`:

- `<runId>.json`
- `<runId>.summary.json`
- `<runId>.drift-diff.json`
- `<runId>.replay.log`
- `<batch>.partial.json`

Live replay artifacts must have `simulated: false`. A live replay artifact with `simulated: true` is not live evidence.

## Expected Drift Outputs

- Summary report with replay success rate, malformed rate, latency, score deltas, provider variance, taxonomy variance, and alerts.
- Drift diff rows keyed by `sampleId`.
- Provider metadata on each score row: `provider`, `model`, `retryPath`, token counts, and latency.

## Expected Persistence Outputs

When `--persist=true` is used:

- One row in `placement_v3_replay_runs`.
- One row per replayed fixture in `placement_v3_replay_scores`.
- Zero or more rows in `placement_v3_drift_alerts`.
- Zero or more rows in `placement_v3_provider_variance`.

## Rollback Steps

1. Stop running replay commands.
2. Unset persistence credential:

```bash
unset PLACEMENT_REPLAY_SERVICE_ROLE_KEY
unset SUPABASE_SERVICE_ROLE_KEY
```

3. Move local artifacts to a quarantine folder instead of deleting immediately:

```bash
mkdir -p docs/placement-v3/drift-detection/raw-runs/quarantine
mv docs/placement-v3/drift-detection/raw-runs/baseline-01* docs/placement-v3/drift-detection/raw-runs/quarantine/
```

4. If bad rows were persisted, delete by exact `run_id` only after exporting evidence:

```sql
delete from public.placement_v3_replay_runs
where id = '<run_id_to_remove>';
```

Cascade delete removes matching score, alert, and provider-variance rows.

## Successful Replay Criteria

A successful first replay requires:

- Preflight env check passes.
- Fixture integrity passes.
- Determinism guardrail passes.
- Live replay command exits `0`.
- Raw artifacts exist with `simulated: false`.
- `sample_count` equals replayed fixture count.
- `success_count + malformed_count + error_count` can be reconciled from score rows.
- Provider metadata is present and not `provider: "none"` for live successful rows.
- Dashboard can load the persisted run for an admin user.

## What Does Not Count

- Simulation output does not count as live replay.
- Local artifact generation without provider calls does not count as provider drift evidence.
- A dry live replay without `--persist=true` does not count as persistence validation.
- Dashboard rendering simulated data does not count as production dashboard validation.
