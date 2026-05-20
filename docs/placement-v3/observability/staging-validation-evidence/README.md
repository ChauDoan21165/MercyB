# Placement V3 Staging Validation Evidence

This directory is the evidence root for future staging validation of PR #953. Files in this directory must come from actual staging commands, screenshots, database queries, dashboard views, replay outputs, or rollback drills. Do not add fabricated provider responses or invented Supabase rows.

## Folder Layout

Each validation run should use one timestamped folder:

```text
staging-YYYY-MM-DDTHHMMSS-sssZ/
  evidence-manifest.json
  screenshots/
  traces/
  logs/
  db-evidence/
  dashboard/
  replay/
  rollback/
```

The orchestrator creates this structure:

```bash
node scripts/placement-v3/run-forensics-staging-validation.ts
```

## Required Evidence Types

Screenshots:
- `screenshots/dashboard-failed-session-<correlation-id>.png`
- `screenshots/dashboard-degraded-session-<correlation-id>.png`
- `screenshots/dashboard-correlation-filter-<correlation-id>.png`
- `screenshots/access-denied-non-admin.png`

Traces:
- `traces/session-start-to-terminal-<correlation-id>.json`
- `traces/provider-retry-fallback-<correlation-id>.json`
- `traces/degraded-result-<correlation-id>.json`

Logs:
- `logs/env-check.json`
- `logs/migration-check.json`
- `logs/supabase-connectivity.json`
- `logs/placement-v3-session-<correlation-id>.log`
- `logs/provider-outage-simulation-<correlation-id>.log`
- `logs/rollback-drill-<timestamp>.log`

DB evidence:
- `db-evidence/forensic-events-<correlation-id>.json`
- `db-evidence/failure-timeline-<correlation-id>.json`
- `db-evidence/runtime-alerts-<correlation-id>.json`
- `db-evidence/redaction-scan-<timestamp>.txt`

Dashboard evidence:
- `dashboard/failed-sessions-<timestamp>.json`
- `dashboard/degraded-sessions-<timestamp>.json`
- `dashboard/provider-switches-<timestamp>.json`

Replay evidence:
- `replay/replay-<correlation-id>.json`
- `replay/replay-command-<correlation-id>.log`

Rollback evidence:
- `rollback/kill-switch-before-<timestamp>.json`
- `rollback/kill-switch-after-<timestamp>.json`
- `rollback/dashboard-access-revocation-<timestamp>.log`

## Naming Rules

- Use ISO-derived timestamps without colons in folder names.
- Include correlation ID in every session-specific artifact name.
- Label environment in every manifest as `staging`.
- Redact learner identifiers, provider keys, Supabase keys, bearer tokens, signed URLs, raw audio, and unnecessary transcript text before committing evidence.
- If evidence cannot be safely committed, commit a redacted manifest entry that identifies where the restricted evidence is stored and who owns access.
