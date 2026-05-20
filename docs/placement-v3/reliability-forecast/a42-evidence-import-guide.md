# A42 Evidence Import Guide

A42 reads existing evidence and produces forecast summaries. It does not run B1 guardrails, run A33 endurance, alter product behavior, or change Placement V3 flags.

## Accepted Input Sources

A42 resolves each expected B1/A33 summary in this order:

1. Canonical repo paths, such as `docs/placement-v3/reliability/reliability-health-summary.json`.
2. A42 evidence dropbox: `docs/placement-v3/reliability-forecast/evidence-dropbox/`.
3. `reports/agent-runs/`, if present, by matching the expected filename.
4. Blocked-safe missing input state.

## Copied Artifacts

Place copied B1 or A33 JSON summaries in the evidence dropbox using the original filename. For example:

- `endurance-health-summary.json`
- `timeout-risk-forecast.json`
- `reliability-health-summary.json`
- `ci-degradation-forecast.json`

A42 records the selected source path in `a42-evidence-source-manifest.json`.

## Merged Branches

If B1 or A33 evidence is already merged into canonical docs paths, A42 prefers those files over dropbox copies. This keeps canonical repo evidence authoritative.

## CI Artifacts

Download CI artifacts, preserve the original summary filenames, and place them in the evidence dropbox. A42 does not infer provenance from zip names; provenance must be present in the JSON fields or surrounding artifact path.

## Manual Evidence Drops

Manual drops are accepted only as forecast inputs. They do not grant release authority. A42 flags stale, missing, or unsafe evidence and keeps the forecast blocked when needed.

## Future LauncherOps Artifact Routing

If future LauncherOps routes artifacts into `reports/agent-runs/`, A42 can find expected summary filenames there without owning LauncherOps orchestration.

## Safety Validation

A42 rejects or blocks imported evidence that sets any of these fields to `true` without explicit verified evidence:

- `production_safe`
- `placement_v3_enabled`
- `live_provider_validated`
- `real_user_validated`

A42 preserves:

- `production_safe=false`
- `placement_v3_enabled=false`
- `live_provider_validated=false`
