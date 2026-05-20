# Placement V3 Forensic Production Acceptance Checklist

This checklist defines the evidence required before Placement V3 forensic persistence can be considered production-safe. It does not claim that live provider calls, live Supabase inserts, or production sessions have been validated.

Owners:
- Engineering: implementation, logs, replay, dashboard behavior.
- Chau: launch decision, privacy review, incident response readiness.
- Supabase admin: database access, migrations, RLS/policy review, data cleanup.

Severity:
- P0: must block enablement or require immediate rollback if found after enablement.
- P1: must block broad rollout; limited validation may continue only with Chau approval.
- P2: must be fixed before production enablement but may not block a local validation run.
- P3: documentation or operator usability gap; must be tracked before launch.

## Provider Validation

| Criterion | Required evidence | Pass/fail criteria | Owner | Severity if missing |
| --- | --- | --- | --- | --- |
| Real provider request is captured without secrets | Edge Function log with timestamp, correlation ID, provider name, model, latency, retry count, and redacted metadata | Pass if one real Placement V3 session records provider metadata and no API key, bearer token, or full sensitive payload appears | Engineering | P0 |
| Provider fallback is observable | Live or approved staging run showing primary provider failure and secondary provider selection under the same correlation ID | Pass if provider switch is visible in forensic events and replay output | Engineering | P1 |
| Provider mismatch is detectable | Replay output or dashboard row showing expected provider versus actual provider field | Pass if mismatch creates an alert or replay warning | Engineering | P1 |

## Supabase Persistence Validation

| Criterion | Required evidence | Pass/fail criteria | Owner | Severity if missing |
| --- | --- | --- | --- | --- |
| Forensic events insert into `placement_v3_forensic_events` | SQL screenshot or exported redacted rows for a real session | Pass if rows exist for session start, provider event, latency, transition, recommendation or degraded result, and terminal state | Supabase admin | P0 |
| Failure timelines insert into `placement_v3_failure_timelines` | SQL evidence for at least one reconstructed failed or degraded session | Pass if timeline references the source correlation ID and event count | Engineering | P1 |
| Runtime alerts insert only for actionable anomalies | SQL evidence showing alert rows for injected or real anomaly, plus no alert for normal completion | Pass if alert rows have severity, reason, correlation ID, and timestamp | Engineering | P2 |

## Forensic Event Completeness

| Criterion | Required evidence | Pass/fail criteria | Owner | Severity if missing |
| --- | --- | --- | --- | --- |
| Required event types are present | Event export for at least 10 live or staging sessions | Pass if each session includes session event, feature flag snapshot, orchestration transition, provider or grading-path event, latency event, and terminal recoverability state | Engineering | P0 |
| Failure scenarios produce terminal state | Replay output for each required failure scenario | Pass if no replay ends with unknown terminal state except documented persistence hard stop | Engineering | P1 |
| Missing events are quantified | Completeness report with total required events and missing events | Pass if missing-event rate is at or below launch gate | Engineering | P1 |

## Replay Integrity

| Criterion | Required evidence | Pass/fail criteria | Owner | Severity if missing |
| --- | --- | --- | --- | --- |
| Replay reconstructs event order | Replay JSON and command log for real persisted events | Pass if chronological order matches event timestamps and sequence numbers | Engineering | P1 |
| Replay flags inconsistent retries | Replay output from retry exhaustion or fallback scenario | Pass if retry gaps, duplicate retry numbers, or provider switches are flagged | Engineering | P1 |
| Replay output is reproducible | Two replay runs against the same event set | Pass if reconstruction summary and detected anomalies are identical | Engineering | P2 |

## Correlation ID Continuity

| Criterion | Required evidence | Pass/fail criteria | Owner | Severity if missing |
| --- | --- | --- | --- | --- |
| Correlation ID is created at session boundary | Edge log and DB row for session start | Pass if ID appears before provider/recommendation work begins | Engineering | P0 |
| Correlation ID survives provider/retry/fallback path | DB export across provider, retry, fallback, and terminal events | Pass if all events for a session share one correlation ID or explicitly record parent/child linkage | Engineering | P0 |
| Dashboard links all rows for one session | Dashboard screenshot filtered by correlation ID | Pass if dashboard count matches SQL count for that ID | Engineering | P1 |

## Privacy/Redaction Validation

| Criterion | Required evidence | Pass/fail criteria | Owner | Severity if missing |
| --- | --- | --- | --- | --- |
| Secrets never appear in forensic rows | Redacted SQL scan and string search for known secret prefixes | Pass if no provider keys, service-role keys, bearer tokens, auth tokens, or signed URLs appear | Supabase admin | P0 |
| Learner PII is minimized | Sample row review against privacy checklist | Pass if email, phone, full name, raw transcript, and raw audio URL are absent unless explicitly approved and retention-bound | Chau | P0 |
| Redaction is validated after failure | Failure row export from malformed payload or provider error | Pass if error payload is summarized and sanitized | Engineering | P0 |

## Dashboard Correctness

| Criterion | Required evidence | Pass/fail criteria | Owner | Severity if missing |
| --- | --- | --- | --- | --- |
| Dashboard reads persisted data | Screenshot plus SQL query for the same correlation ID | Pass if dashboard values match persisted rows, not fixture data | Engineering | P1 |
| Failed and degraded sessions are visible | Dashboard screenshot showing both filters populated from persisted rows | Pass if failed, degraded, retry, provider switch, latency spike, and recoverability states render correctly | Engineering | P1 |
| Admin-only access is verified | Access attempt evidence from admin and non-admin accounts | Pass if admin can view and non-admin is denied | Supabase admin | P0 |

## Degraded-Result Visibility

| Criterion | Required evidence | Pass/fail criteria | Owner | Severity if missing |
| --- | --- | --- | --- | --- |
| Degraded result is explicitly marked | DB row and dashboard screenshot for a degraded safe result | Pass if `degraded_result` or equivalent marker is present with reason and user-safe outcome | Engineering | P0 |
| Safe fallback path is reconstructable | Replay output showing original failure, fallback, final user-visible state | Pass if operator can explain whether user received a degraded-but-safe result | Engineering | P1 |

## Rollback Readiness

| Criterion | Required evidence | Pass/fail criteria | Owner | Severity if missing |
| --- | --- | --- | --- | --- |
| Forensic logging can be disabled | Runbook execution log from staging or local env | Pass if new forensic writes stop while Placement V3 core path still runs | Engineering | P0 |
| Dashboard access can be revoked | Admin policy/config evidence | Pass if dashboard becomes inaccessible to non-approved accounts | Supabase admin | P0 |
| Sensitive rows can be quarantined or deleted | Dry-run query and approved deletion workflow | Pass if accidental sensitive data has an owner-approved cleanup path | Supabase admin | P0 |

## Incident Response Readiness

| Criterion | Required evidence | Pass/fail criteria | Owner | Severity if missing |
| --- | --- | --- | --- | --- |
| Severity matrix is accepted | Link to signed-off severity matrix | Pass if P0-P3 definitions are approved by Chau | Chau | P1 |
| Incident templates are ready | Completed tabletop example using templates | Pass if operator can file incident, replay audit, and privacy review without inventing fields | Engineering | P2 |
| Escalation contacts are known | Runbook section with named roles | Pass if P0/P1 owner and fallback contact are identified | Chau | P1 |
