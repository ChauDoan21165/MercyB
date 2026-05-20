# Live Replay Evidence Folder

This folder is reserved for the first real Placement V3 replay evidence bundle.

Do not place simulated replay evidence here.

## Naming Convention

Use:

```text
<batchId>/<runId>/
```

Example:

```text
baseline-01/baseline-01-2026-05-20T14-30-00-000Z/
```

## Required Structure

```text
<batchId>/<runId>/
  README.md
  command.log
  env-check.log
  artifact-manifest.txt
  sql/
    replay-run.sql.txt
    replay-scores-summary.sql.txt
    provider-metadata.sql.txt
    drift-alerts.sql.txt
    duplicate-check.sql.txt
  artifacts/
    <runId>.json
    <runId>.summary.json
    <runId>.drift-diff.json
    <runId>.replay.log
    <batchId>.partial.json
  screenshots/
    admin-placement-drift-latest-run.png
    admin-placement-drift-alerts.png
```

## Screenshot Requirements

- Browser URL visible where possible.
- Admin dashboard route: `/admin/placement-drift`.
- Latest run timestamp visible.
- `runId` or enough metadata to correlate with SQL output.
- If `SIMULATED DATA` appears, the screenshot is not live replay evidence.

## Replay Artifact Requirements

- Live artifacts must have `simulated: false`.
- Artifact manifest must include file size and SHA-256 hash.
- Raw grader output must not expose secrets.
- `runId` and `batchId` must match command log and SQL rows.

## Drift Output Requirements

- Include raw drift diff.
- Include summary output.
- Include notes for malformed/error rows.
- Include manual review notes for catastrophic CEFR movement.

## Evidence Classification

Every evidence bundle README must explicitly state one of:

- `simulated-only`
- `local-dry-run`
- `live-provider-dry-run`
- `live-provider-persisted`

The first production-ready evidence bundle must be `live-provider-persisted`.
