# Placement V3 Forensics Live Validation Runbook

This runbook prepares a future live validation of PR #953. It does not claim that live validation has already happened.

## Required Environment

Required for Edge Function runtime:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` or `GEMINI_API_KEY`

Required for browser/dashboard validation:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- an authenticated admin account with `get_admin_level(auth.uid()) >= 9`

Optional but useful:

- `PLACEMENT_V3_UI_ENABLED=true`
- `PLACEMENT_TEST_ENABLED=true`
- `VITE_PLACEMENT_TEST_ENABLED=true`
- `VITE_PLACEMENT_V3_UI_ENABLED=true`

Check local env without network calls:

```bash
npx tsx scripts/placement-v3/verify-forensics-env.ts
```

## Local Supabase

1. Start local Supabase:

```bash
supabase start
```

2. Apply migrations to the local database:

```bash
supabase db reset
```

3. Confirm the forensic tables exist:

```sql
select to_regclass('public.placement_v3_forensic_events');
select to_regclass('public.placement_v3_failure_timelines');
select to_regclass('public.placement_v3_runtime_alerts');
```

## Serve Edge Functions

Serve the session and grader functions locally with env loaded:

```bash
supabase functions serve placement-v3-grade-writing --env-file .env.local
supabase functions serve placement-v3-mercy-conversation --env-file .env.local
supabase functions serve placement-v3-session --env-file .env.local
```

For deployed validation, deploy only after confirming the migration has been reviewed and applied:

```bash
supabase functions deploy placement-v3-grade-writing
supabase functions deploy placement-v3-mercy-conversation
supabase functions deploy placement-v3-session
```

## Trigger One Placement V3 Session

Use the real app flow with flags enabled, or call the Edge Function with an authenticated user token.

Minimum flow:

1. Start a Placement V3 session.
2. Submit one writing response long enough to invoke `placement-v3-grade-writing`.
3. If testing degradation, induce one controlled grader failure in a non-production environment only.
4. Capture the `x-correlation-id` if supplied, or inspect the generated correlation ID in forensic rows.

Do not use fabricated provider responses for live validation.

## Verify Forensic Inserts

Query by recent time or session ID:

```sql
select
  occurred_at,
  session_id,
  correlation_id,
  sequence,
  event_type,
  severity,
  step,
  message,
  feature_flags,
  failure_snapshot
from public.placement_v3_forensic_events
order by occurred_at desc
limit 50;
```

Minimum expected live evidence:

- one `session_event`
- one `feature_flag_snapshot`
- one `orchestration_transition`
- one `provider_event` for the grader path
- one `latency_event`
- a shared `correlation_id` across the session events

For degraded validation, also expect:

- one `degraded_result`
- a failure snapshot with no secrets or raw learner PII

## Inspect Dashboard Data

1. Sign in as an admin.
2. Open `/admin/placement-forensics`.
3. Confirm the dashboard reads real rows from `placement_v3_forensic_events`.
4. Confirm failed/degraded/retry/provider-switch counts match recent SQL rows.

Dashboard validation only counts if the rows came from a real Placement V3 session path, not from static E2E fixtures.

## What Counts As Live Validated

- A real authenticated Placement V3 session was executed.
- At least one real grader/provider path ran with configured provider credentials.
- Forensic rows were inserted into Supabase through the Edge Function logger.
- The same correlation ID links request, grading, transition, and response events.
- The admin dashboard reads those persisted rows.
- Logs and rows contain no provider keys, service-role keys, auth tokens, email addresses, or raw learner secrets.

## What Does Not Count

- Local failure-injection JSON only.
- Replay utility output only.
- Dashboard fixture E2E only.
- Console logs without persisted forensic rows.
- Provider-key presence without an actual provider-backed grader call.
- Supabase table existence without an Edge Function insert.
