# Replay Persistence Verification

Run these SQL checks after a live replay with `--persist=true`. Replace `<run_id>` and `<batch_id>` with exact values from the replay log.

## Expected Tables

- `public.placement_v3_replay_runs`
- `public.placement_v3_replay_scores`
- `public.placement_v3_drift_alerts`
- `public.placement_v3_provider_variance`

## Run Row

```sql
select *
from public.placement_v3_replay_runs
where id = '<run_id>';
```

Expected:

- exactly one row
- `status in ('success', 'error')`
- `sample_count > 0`
- `metadata->>'simulated'` is not `true` for live replay

## Score Rows

```sql
select
  run_id,
  batch_id,
  count(*) as score_count,
  count(*) filter (where status = 'success') as success_count,
  count(*) filter (where status = 'malformed') as malformed_count,
  count(*) filter (where status = 'error') as error_count,
  count(*) filter (where status = 'timeout') as timeout_count
from public.placement_v3_replay_scores
where run_id = '<run_id>'
group by run_id, batch_id;
```

Expected:

- `score_count = placement_v3_replay_runs.sample_count`
- status counts reconcile to `score_count`

## Provider Metadata

```sql
select
  provider,
  model,
  retry_path,
  count(*) as rows,
  min(latency_ms) as min_latency_ms,
  max(latency_ms) as max_latency_ms,
  sum(tokens_input) as tokens_input,
  sum(tokens_output) as tokens_output
from public.placement_v3_replay_scores
where run_id = '<run_id>'
group by provider, model, retry_path
order by rows desc;
```

Expected:

- successful live rows should not all be `provider = 'none'`
- retry path is present
- latency is non-negative

## Drift Rows

```sql
select
  severity,
  scope,
  metric,
  count(*) as rows
from public.placement_v3_drift_alerts
where run_id = '<run_id>'
group by severity, scope, metric
order by severity, metric;
```

Zero rows is acceptable if no alert threshold was crossed. Record the query output either way.

## Provider Variance Rows

```sql
select *
from public.placement_v3_provider_variance
where run_id = '<run_id>'
order by provider, model nulls last;
```

Expected:

- zero or more rows
- `sample_count >= 0`
- rates are between `0` and `1`

## Correlation Checks

```sql
select s.run_id, count(*) as orphan_scores
from public.placement_v3_replay_scores s
left join public.placement_v3_replay_runs r on r.id = s.run_id
where s.batch_id = '<batch_id>' and r.id is null
group by s.run_id;
```

Expected: zero rows.

```sql
select
  r.id,
  r.sample_count,
  count(s.id) as persisted_scores
from public.placement_v3_replay_runs r
left join public.placement_v3_replay_scores s on s.run_id = r.id
where r.id = '<run_id>'
group by r.id, r.sample_count;
```

Expected: `sample_count = persisted_scores`.

## Timestamp Ordering Checks

```sql
select
  id,
  started_at,
  completed_at,
  created_at,
  completed_at < started_at as completed_before_started
from public.placement_v3_replay_runs
where id = '<run_id>';
```

Expected: `completed_before_started = false`.

```sql
select sample_id, created_at
from public.placement_v3_replay_scores
where run_id = '<run_id>'
order by created_at asc, sample_id asc;
```

Expected: rows are created during the replay window and sample IDs correspond to the fixture corpus.

## Replay Determinism Checks

Before and after live replay, run:

```bash
npm run check:placement-replay-fixtures
npm run check:placement-replay-determinism -- --runs 5
```

These commands validate the local deterministic simulation guardrail. They do not validate live provider determinism.

## Duplicate Replay Detection

```sql
select batch_id, count(*) as runs
from public.placement_v3_replay_runs
where batch_id = '<batch_id>'
group by batch_id;
```

Expected for first baseline: one run unless the batch was intentionally repeated.

```sql
select run_id, sample_id, count(*) as duplicates
from public.placement_v3_replay_scores
where run_id = '<run_id>'
group by run_id, sample_id
having count(*) > 1;
```

Expected: zero rows.
