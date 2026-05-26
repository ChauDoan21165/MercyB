# Placement V3 Forensic Dashboard Validation Guide

Use this guide to prove the dashboard reads real persisted staging data. Fixture-based E2E screenshots are not production acceptance evidence.

## Expected Widgets

Dashboard must expose:
- Failed sessions.
- Degraded sessions.
- Retry counts.
- Provider switches.
- Latency spikes.
- Orchestration dead ends.
- Taxonomy-trigger anomalies.
- Recoverable vs unrecoverable failures.

## Expected Rows

For a sampled correlation ID, dashboard rows should show:
- Correlation ID.
- Session identifier or safe surrogate.
- Event count.
- Provider name/model when available.
- Retry/fallback summary.
- Degraded marker when applicable.
- Recoverability state.
- First and last event timestamps.

Pass criteria:
- Dashboard row count matches SQL query count for the same filter.
- Values match redacted DB exports.

## Expected Degraded Markers

Degraded session view must show:
- Degraded state.
- Reason or category.
- Whether user received a safe result.
- Provider/fallback path when relevant.

Pass criteria:
- Degraded marker appears in dashboard, DB row, and replay output for the same correlation ID.

## Expected Correlation Behavior

Actions:
1. Filter dashboard by one correlation ID.
2. Compare event count to SQL count.
3. Open detail view if available.
4. Confirm provider, retry, fallback, and terminal state all share the same correlation ID.

Pass criteria:
- No unrelated session rows appear.
- No required event row is missing from the dashboard view.

## Replay Expectations

Dashboard should provide enough fields for an operator to run replay:
- Correlation ID.
- Time range.
- Event count.
- Failure/degraded state.
- Provider/retry/fallback summary.

Pass criteria:
- Operator can export or identify the event set needed for replay.
- Replay summary agrees with dashboard state.

## Stale Or Missing Data Detection

Failed observability indicators:
- Dashboard shows old fixture data after staging DB rows are inserted.
- Dashboard event count differs from SQL count.
- Dashboard lacks terminal state for failed/degraded session.
- Dashboard hides degraded markers.
- Dashboard shows provider switch without failed provider.
- Dashboard shows non-admin data access.

Required evidence:
- Screenshot of dashboard filter.
- Matching SQL output.
- Timestamped operator note describing any mismatch.
