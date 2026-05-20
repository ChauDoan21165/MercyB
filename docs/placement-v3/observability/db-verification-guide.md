# Placement V3 Forensic DB Verification Guide

Use these queries during staging validation. Replace `<correlation_id>` with the captured correlation ID. Export only redacted results.

## Required Rows

`placement_v3_forensic_events` should contain:
- Session start event.
- Feature flag snapshot.
- Orchestration transition event.
- Provider event when provider path is reached.
- Latency event for provider or orchestration step.
- Retry event when retry path is triggered.
- Fallback event when fallback path is triggered.
- Degraded-result marker when a degraded safe result is returned.
- Recommendation event when recommendation path is reached.
- Taxonomy trigger event when taxonomy path is reached.
- Terminal recoverability state.

`placement_v3_failure_timelines` should contain:
- One timeline row for failed or degraded scenario after replay/build step.
- Ordered event summary.
- Missing-event summary.
- Retry/fallback summary.
- Terminal state.

`placement_v3_runtime_alerts` should contain:
- Alert rows only for actionable anomalies.
- Severity, alert type, reason, and correlation ID.

## Required Columns

```sql
select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name in (
    'placement_v3_forensic_events',
    'placement_v3_failure_timelines',
    'placement_v3_runtime_alerts'
  )
order by table_name, ordinal_position;
```

Pass criteria:
- Tables exist.
- Columns include IDs, timestamps, correlation/session linkage, event/status payloads, severity or state fields.

## Correlation ID Continuity

```sql
select
  correlation_id,
  count(*) as event_count,
  min(created_at) as first_event_at,
  max(created_at) as last_event_at,
  array_agg(distinct event_type order by event_type) as event_types
from placement_v3_forensic_events
where correlation_id = '<correlation_id>'
group by correlation_id;
```

Pass criteria:
- Exactly one row returned.
- Event count matches dashboard and replay export.
- Required event types are present for the scenario.

## Timestamp Verification

```sql
select id, created_at, event_type
from placement_v3_forensic_events
where correlation_id = '<correlation_id>'
order by created_at asc, id asc;
```

Pass criteria:
- Events are ordered from session start to terminal state.
- No future timestamps.
- No impossible negative latency in payload fields.

## Replay Integrity Check

```sql
select *
from placement_v3_failure_timelines
where correlation_id = '<correlation_id>'
order by created_at desc
limit 5;
```

Pass criteria:
- Latest timeline references the same correlation ID.
- Missing-event count is within launch gate.
- Failed/degraded terminal state is explicit.

## Redaction Verification

Run a broad scan before exporting any rows:

```sql
select id, event_type, created_at
from placement_v3_forensic_events
where correlation_id = '<correlation_id>'
  and (
    payload::text ilike '%sk-%'
    or payload::text ilike '%bearer %'
    or payload::text ilike '%service_role%'
    or payload::text ilike '%access_token%'
    or payload::text ilike '%refresh_token%'
    or payload::text ilike '%signed%'
    or payload::text ilike '%@%'
  );
```

Pass criteria:
- Query returns zero rows, or every row is manually reviewed and documented as a false positive.
- No provider keys, Supabase keys, bearer tokens, signed URLs, raw audio, or unnecessary learner PII appear.

## Degraded-Result Verification

```sql
select id, created_at, event_type, payload
from placement_v3_forensic_events
where correlation_id = '<correlation_id>'
  and (
    event_type = 'degraded_result'
    or payload::text ilike '%degraded%'
  )
order by created_at asc;
```

Pass criteria:
- At least one row appears for degraded scenario.
- Payload includes degradation reason and user-safe outcome.
- Dashboard shows the same degraded state.

## Runtime Alert Verification

```sql
select *
from placement_v3_runtime_alerts
where correlation_id = '<correlation_id>'
order by created_at asc;
```

Pass criteria:
- Alert appears for controlled anomaly.
- Normal completed session does not create an alert unless expected.
