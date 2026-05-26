# Placement V3 Forensics Staging Validation Checklist

This checklist is executable only when staging Supabase and provider credentials exist. It does not prove live validation until every command has been run and evidence has been saved.

## 1. Prepare Environment

Command:

```bash
node scripts/placement-v3/verify-forensics-env.ts --dry-run-report
```

Expected output:
- Required Supabase env vars are present and redacted.
- At least one provider key is present and redacted.
- Report states no provider or Supabase network calls were made.

Pass criteria:
- Exit code `0`.
- No secrets printed.
- Missing prerequisite list is empty.

## 2. Run Staging Orchestrator

Command:

```bash
node scripts/placement-v3/run-forensics-staging-validation.ts
```

Expected output:
- Timestamped evidence folder path.
- Supabase connectivity check passes.
- Migration file is present.
- Manual validation steps are printed.

Evidence:
- `logs/env-check.json`
- `logs/migration-check.json`
- `logs/supabase-connectivity.json`
- `evidence-manifest.json`

Pass criteria:
- Exit code `0`.
- Evidence folder exists under `docs/placement-v3/observability/staging-validation-evidence/`.
- Manifest status is `ready_for_manual_steps`.

## 3. Trigger One Real Placement V3 Session

Command:

```bash
# Use the deployed or locally served staging Placement V3 entrypoint.
# Save the exact command or browser action in logs/placement-v3-session-<correlation-id>.log.
```

Expected output:
- A real staging session starts.
- Correlation ID is visible in Edge logs or response metadata.
- Provider event is emitted if provider path is reached.

Screenshots required:
- Session start or browser flow evidence if UI-driven.
- Edge Function invocation log with redacted metadata.

Pass criteria:
- One correlation ID is captured.
- No provider response is fabricated.
- No secret appears in saved logs.

## 4. Verify DB Rows

Run the queries in `docs/placement-v3/observability/db-verification-guide.md`.

Required DB evidence:
- `db-evidence/forensic-events-<correlation-id>.json`
- `db-evidence/failure-timeline-<correlation-id>.json` for failed/degraded scenario.
- `db-evidence/redaction-scan-<timestamp>.txt`

Pass criteria:
- Required event rows exist.
- Correlation ID is continuous.
- Timestamps are ordered.
- Redaction scan finds no secrets or unnecessary learner PII.

## 5. Verify Dashboard

Open:

```text
/admin/placement-forensics
```

Dashboard checks:
- Failed sessions table renders persisted rows.
- Degraded sessions are marked.
- Retry/provider switch indicators appear when relevant.
- Correlation filter returns the same count as SQL.
- Non-admin account cannot access forensic data.

Screenshots required:
- `screenshots/dashboard-failed-session-<correlation-id>.png`
- `screenshots/dashboard-degraded-session-<correlation-id>.png`
- `screenshots/dashboard-correlation-filter-<correlation-id>.png`
- `screenshots/access-denied-non-admin.png`

Pass criteria:
- Dashboard data matches DB evidence for sampled correlation IDs.
- No fixture-only data is used as proof.

## 6. Verify Replay

Command:

```bash
npx tsx scripts/placement-v3/replay-failure-timeline.ts --input <redacted-event-export> --out <evidence-folder>/replay/replay-<correlation-id>.json
```

Expected output:
- Ordered event timeline.
- Missing-event count.
- Retry consistency result.
- Fallback/degraded path result.
- Terminal recoverability state.

Pass criteria:
- Replay reconstructs failed/degraded scenario.
- Missing terminal state count is `0`.
- Replay output is repeatable against the same input.

## 7. Verify Provider Failure

Follow `docs/placement-v3/observability/provider-outage-simulation.md`.

Required evidence:
- Provider outage simulation log.
- Retry event rows.
- Fallback or degraded-result rows.
- Dashboard screenshot showing provider failure/fallback.
- Replay output.

Pass criteria:
- Retry path is visible.
- Provider failure is not mislabeled as success.
- User result is either safe degraded result or safe failure.

## 8. Verify Retry Path

Required observations:
- Retry attempt numbers.
- Retry trigger.
- Provider used per attempt.
- Final retry outcome.

Pass criteria:
- Attempts are ordered and non-duplicated.
- Replay flags no retry inconsistency.

## 9. Verify Degraded Result

Required observations:
- `degraded_result` marker or equivalent event.
- Reason for degradation.
- User-safe final state.
- Dashboard degraded marker.

Pass criteria:
- Degraded result appears in DB rows, dashboard, and replay output.

## 10. Verify Rollback

Follow `docs/placement-v3/observability/rollback-runbook.md`.

Required evidence:
- Before/after forensic insert evidence.
- Kill-switch or disablement log.
- Dashboard access change evidence if access is disabled.
- Core Placement V3 safe behavior after disablement.

Pass criteria:
- New forensic inserts stop.
- Placement V3 core path remains safe.
- Rollback evidence is saved under `rollback/`.
