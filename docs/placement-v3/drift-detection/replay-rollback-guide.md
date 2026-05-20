# Replay Rollback Guide

Use this guide when a live replay produces corrupted artifacts, bad database rows, unexpected provider behavior, or dashboard instability.

## Disable Replay Runs

Stop new replay commands immediately. Do not start another batch with the same `batchId` until the previous state is classified.

To prevent accidental live calls in the current shell:

```bash
unset PLACEMENT_REPLAY_SUPABASE_URL
unset PLACEMENT_REPLAY_ANON_KEY
unset PLACEMENT_REPLAY_JWT
unset SUPABASE_URL
unset SUPABASE_ANON_KEY
```

## Disable Replay Persistence

Remove service-role credentials from the shell:

```bash
unset PLACEMENT_REPLAY_SERVICE_ROLE_KEY
unset SUPABASE_SERVICE_ROLE_KEY
```

Run future diagnostics without `--persist=true`.

## Clear Replay Artifacts Safely

Do not delete evidence first. Quarantine it:

```bash
mkdir -p docs/placement-v3/drift-detection/raw-runs/quarantine/<run_id>
mv docs/placement-v3/drift-detection/raw-runs/<run_id>* \
  docs/placement-v3/drift-detection/raw-runs/quarantine/<run_id>/
```

Record:

- reason for quarantine
- operator
- timestamp
- original command
- affected `runId`

## Identify Corrupted Replay State

Corruption indicators:

- live artifacts contain `simulated: true`
- successful live rows have `provider = 'none'`
- score count does not match `sample_count`
- duplicate `sample_id` rows for one `run_id`
- `completed_at < started_at`
- missing provider/model metadata for all successful rows
- dashboard reports a different latest run than SQL
- raw artifacts and database rows disagree on `runId` or `batchId`

## Remove Bad Persisted Rows

Export evidence first:

```sql
select * from public.placement_v3_replay_runs where id = '<run_id>';
select * from public.placement_v3_replay_scores where run_id = '<run_id>';
select * from public.placement_v3_drift_alerts where run_id = '<run_id>';
select * from public.placement_v3_provider_variance where run_id = '<run_id>';
```

Then remove by exact run ID:

```sql
delete from public.placement_v3_replay_runs
where id = '<run_id>';
```

The foreign keys use cascade delete for scores, drift alerts, and provider variance.

## Revert Migrations If Needed

Migration rollback should be a last resort and requires human approval. The safer rollback is to stop writing rows and leave tables in place.

If rollback is required:

1. Export affected tables.
2. Confirm no production workflow depends on replay tables.
3. Disable dashboard access to the affected replay data.
4. Drop in dependency order:

```sql
drop table if exists public.placement_v3_provider_variance;
drop table if exists public.placement_v3_drift_alerts;
drop table if exists public.placement_v3_replay_scores;
drop table if exists public.placement_v3_replay_runs;
```

Do not run this without Chau approval.

## Incident Escalation Rules

Escalate immediately if:

- service-role key was exposed in logs or artifacts
- replay writes to unexpected tables
- dashboard exposes replay data to non-admin users
- replay produces repeated provider errors across all samples
- persisted rows cannot be reconciled with raw artifacts
- migration rollback is being considered

## Recovery Before Re-run

Before re-running:

```bash
npm run check:placement-replay-fixtures
npm run check:placement-replay-determinism -- --runs 5
node scripts/placement-v3/verify-live-replay-env.ts
```

Use a new `batchId` unless the previous batch was fully removed and documented.
