# Placement V3 Provider Outage Simulation Guide

This guide explains how to safely simulate provider outage in staging without fabricating provider responses. Use only staging credentials and staging sessions.

## Safe Simulation Options

Preferred options:
1. Temporarily point provider configuration to an invalid staging-only model name.
2. Temporarily remove one provider key in staging while keeping fallback provider configured.
3. Use a staging-only network block or timeout setting if available.
4. Use provider console test limits only if it cannot affect production traffic.

Do not:
- Modify production provider keys.
- Fake a successful provider response.
- Edit forensic rows by hand to look like an outage.
- Disable retries/fallbacks to make logs simpler.

## Expected Logs And Events

Required logs:
- Provider request start.
- Provider error, timeout, or malformed response category.
- Retry attempt with attempt number.
- Fallback provider selection when configured.
- Degraded-result marker if safe fallback returns degraded result.
- Terminal recoverability state.

Required DB events:
- `provider_event`
- `retry_event` for retry scenario.
- `fallback_event` when fallback occurs.
- `latency_event`
- `degraded_result` when degraded result occurs.
- Terminal session or recoverability event.

## Expected Retry Behavior

Pass criteria:
- Retry attempts are ordered.
- Attempt numbers are not duplicated.
- Each attempt records provider, trigger, and outcome.
- Retry exhaustion records terminal state.
- Provider fallback records both failed provider and selected provider.

## Expected Degraded Result Behavior

Pass criteria:
- User receives either a degraded-but-safe result or a safe failure response.
- DB row includes degradation reason.
- Dashboard marks session as degraded.
- Replay reconstructs the original failure and final user-safe path.

## What Counts As Failed Observability

The outage simulation fails observability if:
- No correlation ID is captured.
- Provider failure is logged without provider name/model.
- Retry attempts are missing or unordered.
- Fallback occurs but no fallback event is persisted.
- Degraded result is visible to user but not visible in DB/dashboard/replay.
- Logs contain provider keys, Supabase keys, bearer tokens, signed URLs, raw audio, or unnecessary learner PII.
- Replay cannot reconstruct terminal state.
- Dashboard shows fixture data instead of persisted outage rows.

## Evidence To Save

Save under the timestamped staging evidence folder:
- `logs/provider-outage-simulation-<correlation-id>.log`
- `db-evidence/forensic-events-<correlation-id>.json`
- `db-evidence/runtime-alerts-<correlation-id>.json`
- `screenshots/dashboard-failed-session-<correlation-id>.png`
- `screenshots/dashboard-degraded-session-<correlation-id>.png` when applicable
- `replay/replay-<correlation-id>.json`
