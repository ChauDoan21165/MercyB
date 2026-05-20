# Placement V3 Drift Replay Simulation Mode

Generated: 2026-05-20

## What Simulation Mode Is

`scripts/placement-v3/run-grading-replay.ts --simulate` runs the drift replay pipeline locally with deterministic, non-provider grading outputs.

It:

- loads the replay fixture corpus;
- generates deterministic local CEFR outputs from fixture IDs and expected CEFR levels;
- writes replay output, summary, drift diff, replay log, dashboard payload, local persistence, and pipeline-integrity artifacts;
- marks every JSON artifact with `simulated: true`;
- uses `provider: "none"` and `model: "local-drift-simulator-v1"`;
- avoids Supabase, OpenAI, Gemini, Azure, and service-role credentials.

Default output path:

```bash
docs/placement-v3/drift-detection/simulated-runs/
```

Example:

```bash
npx tsx scripts/placement-v3/run-grading-replay.ts \
  --simulate \
  --batch simulated-01 \
  --outDir docs/placement-v3/drift-detection/simulated-runs \
  --resume=false
```

## What Simulation Proves

Simulation proves local pipeline integrity:

- fixture loading works;
- replay score normalization works;
- malformed/success status handling works;
- CEFR drift diff generation works;
- local persistence-shaped rows can be produced;
- dashboard-shaped payloads can be produced;
- the dashboard has a visible `SIMULATED DATA` indicator when simulated rows are supplied;
- replay artifacts are generated with timestamps and `simulated: true`.

## What Simulation Does Not Prove

Simulation does not prove:

- live grader correctness;
- live provider drift;
- OpenAI/Gemini routing or failover behavior;
- real latency, token counts, or cost;
- production Supabase persistence;
- production dashboard data freshness;
- any launch readiness claim.

## Why Live Replay Is Still Blocked

Live replay still requires Supabase/env configuration:

- `PLACEMENT_REPLAY_SUPABASE_URL` or `SUPABASE_URL`;
- `PLACEMENT_REPLAY_ANON_KEY` or `SUPABASE_ANON_KEY`;
- optional `PLACEMENT_REPLAY_JWT` for user-authenticated grader calls;
- optional `PLACEMENT_REPLAY_SERVICE_ROLE_KEY` or `SUPABASE_SERVICE_ROLE_KEY` for persistence.

Without those values, live replay still refuses to fabricate provider output. Simulation mode exists only to prove local replay plumbing.

