# Placement V3 Forensic Evidence Requirements

This document defines what evidence is required before forensic persistence can be accepted for production. Local simulation is useful, but it is not proof of live provider behavior or live Supabase persistence.

## Evidence Classes

| Class | Definition | Valid use | Not sufficient for |
| --- | --- | --- | --- |
| Simulated evidence | Output from `run-failure-injection.ts`, fixtures, mocked provider responses, or local replay files | Proving instrumentation shape, replay logic, and operator workflow | Proving live provider calls, live Supabase inserts, production privacy safety |
| Local-only evidence | Runs against local dev server, local Supabase, local Edge Functions, or local test database | Proving local runtime wiring and migration compatibility | Proving hosted Supabase, deployed Edge Functions, production RLS, or real dashboard data |
| Live-provider evidence | Logs and forensic rows from a real provider call using deployed or staging Edge Functions | Proving provider metadata, latency, retry/fallback behavior, and redaction under real responses | Proving production user traffic unless environment and session are production scoped |
| Production evidence | Redacted logs, DB rows, traces, dashboard screenshots, and replay outputs from production infrastructure | Production enablement decisions | Bypassing privacy review, retention policy, or rollback readiness |

## Required Screenshots

| Screenshot | Required contents | Valid evidence criteria |
| --- | --- | --- |
| Dashboard failed-session view | Correlation ID, failed/degraded status, provider, retry count, latency, recoverability state | Must be captured from dashboard reading persisted rows, with matching SQL evidence |
| Dashboard degraded-session view | Degraded marker, fallback reason, user-safe result state | Must show a real or approved staging session, not fixture data |
| Dashboard correlation filter | One correlation ID and all associated event groups | Count must match SQL row count for the same correlation ID |
| Supabase table view or SQL result | `placement_v3_forensic_events`, `placement_v3_failure_timelines`, optional `placement_v3_runtime_alerts` rows | Secrets and learner PII must be redacted before sharing |
| Access control check | Admin access success and non-admin denial | Must show role/account context without exposing credentials |

## Required Logs

| Log | Required fields | Valid evidence criteria |
| --- | --- | --- |
| Edge Function invocation log | ISO timestamp, function name, correlation ID, session ID hash or safe identifier, active feature flags | Must come from deployed or local served Edge Function according to evidence class |
| Provider event log | Provider, model, request start/end, latency, retry attempt, fallback marker, redaction marker | Must not include provider key, bearer token, raw full transcript, or raw full provider response |
| Persistence log | Insert attempt, table name, success/failure, error class, correlation ID | Must prove whether rows were actually inserted or why they failed |
| Replay command log | Command, input file or correlation ID, event count, missing events, anomalies, terminal state | Must be reproducible against saved raw inputs |
| Verification log | Command, timestamp, exit code, test/build result | Must be saved under `docs/placement-v3/observability/raw-runs/` for launch evidence |

## Required DB Rows

| Table | Required rows | Required fields |
| --- | --- | --- |
| `placement_v3_forensic_events` | At least one complete normal session and one failed or degraded session | `id`, `created_at`, `correlation_id`, `session_id`, `event_type`, `severity`, `payload`, redaction metadata |
| `placement_v3_failure_timelines` | At least one reconstructed failed/degraded session | `correlation_id`, ordered events, missing event summary, retry/fallback summary, terminal state |
| `placement_v3_runtime_alerts` | At least one alert from a controlled anomaly before production enablement | `correlation_id`, `severity`, `alert_type`, `reason`, `created_at`, acknowledgement state if available |

## Required Traces

| Trace | Required proof |
| --- | --- |
| Session start to terminal state | Same correlation ID appears from session start through final recoverability state |
| Provider call | Provider event and latency event are linked to the same correlation ID |
| Retry path | Retry events show attempt number, trigger, provider, and final outcome |
| Fallback path | Fallback event shows original failure, selected fallback, and user-visible result |
| Dashboard path | Dashboard row can be traced back to SQL rows and replay output |

## Required Replay Evidence

Replay evidence must include:
- Raw event input or a query export for the correlation ID.
- Replay command and exit code.
- Ordered event timeline.
- Missing-event count.
- Retry consistency result.
- Provider switch result.
- Fallback transition result.
- Recoverability state.
- Terminal decision: completed, degraded, failed recoverably, or failed unrecoverably.

Replay evidence is valid only if the source events are saved and the replay can be repeated with the same result.

## What Counts As Valid Runtime Evidence

Valid runtime evidence must have:
- ISO timestamp.
- Environment label: local, staging, or production.
- Command or operator action that produced the evidence.
- Correlation ID.
- Provider and model when provider work occurred.
- Latency where network or provider work occurred.
- Token usage only when returned by the provider; do not estimate it as proof.
- Redacted raw logs or redacted row exports.
- Matching replay output for failure/degraded scenarios.

## What Does Not Count As Proof

The following do not prove production readiness:
- Fixture-based dashboard screenshots.
- Mocked provider responses.
- Passing unit tests alone.
- Local Supabase rows when production Supabase is the target.
- Edge Function logs without matching forensic DB rows.
- DB rows without a correlation ID.
- Provider logs without latency or provider/model metadata.
- Screenshots with no timestamp or no environment label.
- Any evidence containing secrets or unnecessary learner PII.
