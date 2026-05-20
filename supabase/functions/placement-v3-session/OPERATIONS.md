# Placement V3 Session Operations

## Signals And Alerts

Alert on:
- `placement_v3.grader_call` fallback rate > 10% over 15 minutes.
- Sessions in `in_progress` with `updated_at < now() - interval '24 hours'`.
- `placement_v3_profiles` insert/upsert failures.
- Duplicate task replay rate spike.
- Median placement completion tasks > 11 or < 5.
- Any modality with zero successful grader calls for 10 minutes during traffic.

First dashboards:
- Completion funnel: start -> first response -> final profile.
- Grader health by modality/version.
- CEFR distribution by native/target language pair.
- L1 interference flag frequency for Vietnamese -> English.
- Resume/abandon rate by platform.

## Runbook: Stuck Session

Find the recent sessions:

```sql
select id, flow_state, current_modality, current_task_index, updated_at, metadata
from placement_v3_sessions
where user_id = '<user-id>'
order by updated_at desc
limit 5;
```

Then inspect response evidence:

```sql
select task_index, modality, prompt_id, ai_assessment_version, graded_at
from placement_v3_responses
where session_id = '<session-id>'
order by task_index;
```

If `metadata.lastPrompt` exists and the response row for
`current_task_index` does not exist, the client should retry `status` or
`resume`. If a response row exists but the index did not advance, check Sentry
for an `updateSession` failure.

## Runbook: Mid-Session Bug

If the bug corrupts prompts or scoring but sessions are still accepting
responses, temporarily disable the UI entry point before changing data. Do not
delete response rows. Evidence rows are append-only debugging material.

For a single user, abandon the active session:

```sql
update placement_v3_sessions
set flow_state = 'abandoned',
    abandoned_at = now(),
    updated_at = now()
where id = '<session-id>'
  and flow_state = 'in_progress';
```

For many users, identify affected session ids first and review with Chau before
bulk updates. This touches learner diagnostic history.

## Runbook: Cost Overrun

Check average tasks per completed session:

```sql
select avg(current_task_index) as avg_tasks
from placement_v3_sessions
where flow_state = 'completed'
  and completed_at > now() - interval '1 day';
```

If average tasks are above 11, the cap is not being respected. If fallback is
low but cost is high, lower `MAX_TASKS_PER_MODALITY` or raise
`CONFIDENCE_STOP_THRESHOLD` only after checking completion quality. If fallback
is high, the cost may be retries or failing graders, not real assessment.

## Runbook: Grader Degradation

Look for fallback versions:

```sql
select modality, ai_assessment_version, count(*)
from placement_v3_responses
where created_at > now() - interval '1 hour'
group by modality, ai_assessment_version
order by count(*) desc;
```

Fallback versions are expected during partial outages, but a sustained spike
means profile confidence is degraded. Check the specific grader logs for
timeout, malformed JSON, rate limit, or HTTP errors. The orchestrator should
continue sessions with low-confidence fallback assessments.

## Runbook: Abandoned-Session Cleanup

Find stale sessions:

```sql
select id, user_id, updated_at
from placement_v3_sessions
where flow_state = 'in_progress'
  and updated_at < now() - interval '24 hours'
order by updated_at asc
limit 100;
```

Mark them abandoned in batches:

```sql
update placement_v3_sessions
set flow_state = 'abandoned',
    abandoned_at = now(),
    updated_at = now()
where flow_state = 'in_progress'
  and updated_at < now() - interval '24 hours';
```

Do not delete sessions or responses. Old placement evidence is useful for
debugging and for future calibration analysis.

## Runbook: Profile Recompute

If aggregation changes, recompute only from persisted response rows. Profiles
are derived data; responses are source evidence.

Check one profile:

```sql
select *
from placement_v3_profiles
where session_id = '<session-id>';
```

If a recompute script is added later, it must mark old profiles
`is_current = false` before inserting the new current profile for the same
user/session pair.
