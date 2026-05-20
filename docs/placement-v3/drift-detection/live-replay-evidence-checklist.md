# Live Replay Evidence Checklist

Use this checklist for the first real Placement V3 replay. Do not mix simulated, local-only, and live-provider evidence.

## Replay Logs

- [ ] Terminal output saved with command, operator, timestamp, and exit code.
- [ ] `<runId>.replay.log` saved.
- [ ] `runId` recorded exactly.
- [ ] `batchId` recorded exactly.
- [ ] Start and completion timestamps recorded.

## Replay Artifacts

- [ ] `<runId>.json`
- [ ] `<runId>.summary.json`
- [ ] `<runId>.drift-diff.json`
- [ ] `<runId>.replay.log`
- [ ] `<batchId>.partial.json`
- [ ] Artifact manifest listing file names, sizes, timestamps, and SHA-256 checksums.
- [ ] Every live artifact has `simulated: false`.

## Database Rows

- [ ] `placement_v3_replay_runs` row exists for `runId`.
- [ ] `placement_v3_replay_scores` count equals `sample_count`.
- [ ] `placement_v3_drift_alerts` rows recorded or explicitly verified as empty.
- [ ] `placement_v3_provider_variance` rows recorded or explicitly verified as empty.
- [ ] `batch_id` matches across all persisted rows.
- [ ] Timestamps are ordered: `started_at <= completed_at <= created_at + expected lag`.

## Provider Metadata

- [ ] Successful live score rows include provider metadata.
- [ ] Successful live score rows are not `provider = 'none'`.
- [ ] `model` values are captured when graders expose them.
- [ ] `retry_path` is captured, even if it contains one provider.
- [ ] Token counts and latency values are captured.

## Replay Diff Evidence

- [ ] Drift diff file exists.
- [ ] Diff rows have stable `sampleId` ordering.
- [ ] Any catastrophic deltas are listed with sample IDs.
- [ ] Malformed outputs are listed and linked to raw evidence.
- [ ] Provider variance is summarized separately from simulated evidence.

## Replay Persistence Evidence

- [ ] SQL query output exported for run row.
- [ ] SQL query output exported for score counts by status.
- [ ] SQL query output exported for provider counts.
- [ ] SQL query output exported for drift alerts.
- [ ] SQL query output exported for duplicate replay detection.

## Dashboard Evidence

- [ ] Screenshot of `/admin/placement-drift` as admin level 9.
- [ ] Screenshot shows the correct `runId` or latest replay timestamp.
- [ ] Screenshot does not show `SIMULATED DATA` for live replay evidence.
- [ ] Any error state screenshot is included if dashboard fails.

## Evidence Categories

### Simulated Evidence

Valid for pipeline and determinism only:

- `docs/placement-v3/drift-detection/simulated-runs/`
- `docs/placement-v3/drift-detection/determinism-runs/`
- `simulated: true`
- `provider: "none"`

### Local-Only Evidence

Valid for local command behavior only:

- env preflight output
- fixture integrity logs
- determinism checker logs
- local dry-run artifacts without persistence

### Live-Provider Evidence

Valid only when all are true:

- env vars point to Supabase.
- replay command ran without `--simulate`.
- artifacts have `simulated: false`.
- successful rows have provider metadata not equal to `none`.
- raw logs and SQL evidence are attached.

## Required Bundle Before Claiming Live Replay

- [ ] replay logs
- [ ] replay artifacts
- [ ] artifact manifest
- [ ] SQL evidence
- [ ] dashboard screenshots
- [ ] written summary of failures/malformed outputs
- [ ] explicit statement that provider drift metrics are preliminary until repeated live replays exist
