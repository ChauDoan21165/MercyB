# A36 Drift Replay Merge Readiness

Updated: 2026-05-20
Branch: `feat/a36-grading-drift-detection`
PR: `#943`

## What #943 now proves

- The Placement V3 drift replay fixture corpus loads consistently.
- Deterministic local replay simulation runs without provider secrets.
- Simulated replay artifacts are generated with `simulated: true`.
- Drift diffs, local persistence-shaped artifacts, dashboard payloads, and pipeline-integrity artifacts are produced from simulated outputs.
- Replay determinism is guarded by:
  - `tests/integration/placement-v3-drift-detection/replayDeterminism.test.ts`
  - `src/lib/placementDrift/validateReplayArtifact.ts`
  - `scripts/placement-v3/check-replay-determinism.ts`
  - `scripts/placement-v3/check-replay-fixtures.ts`
- Fixture ordering, duplicate fixture IDs, malformed fixture metadata, invalid CEFR labels, missing simulated markers, and nondeterministic normalized replay output now fail locally and can be run in CI.

## What #943 does not prove

- It does not prove live grader replay works against Supabase.
- It does not prove provider drift metrics.
- It does not prove OpenAI/Gemini failover behavior.
- It does not prove production database persistence with service-role credentials.
- It does not prove live dashboard data from production replay tables.
- It does not claim live drift, live latency, live malformed-output rate, or live provider variance.

## Live blockers

Live replay remains blocked unless the runtime has:

- `PLACEMENT_REPLAY_SUPABASE_URL` or `SUPABASE_URL`
- `PLACEMENT_REPLAY_ANON_KEY` or `SUPABASE_ANON_KEY`
- optional persistence: `PLACEMENT_REPLAY_SERVICE_ROLE_KEY` or `SUPABASE_SERVICE_ROLE_KEY`

Without those values, #943 intentionally refuses to fabricate live replay output.

## Simulation evidence

Committed simulation evidence:

- `docs/placement-v3/drift-detection/simulated-runs/`
- `docs/placement-v3/drift-detection/determinism-runs/`

The simulated-run JSON corpus is marked `simulated: true`. The determinism-run directory commits the five simulation logs and five determinism checker logs; generated JSON artifacts from those checker runs were validated locally and omitted from git to keep review size reasonable.

## CI status

`gh pr checks 943` completed green:

- `Build and Test`: pass
- `Build Preview`: pass
- `Comment on PR`: pass
- `Lighthouse Mobile`: pass
- `Lint Code`: pass
- `Module Boundaries`: pass
- `Report deployed-vs-repo drift (non-blocking)`: pass
- `Validate Rooms`: pass
- `Vercel`: pass
- `Vercel Preview Comments`: pass

## Local verification

Final local verification passed:

```bash
npm run typecheck
npm run build
npm run check:placement-replay-fixtures
npm run check:placement-replay-determinism -- --runs 5
npx vitest run tests/integration/placement-v3-drift-detection/drift-detection.test.ts tests/integration/placement-v3-drift-detection/replayDeterminism.test.ts
```

Focused test result:

- `tests/integration/placement-v3-drift-detection/drift-detection.test.ts`: 13 passed
- `tests/integration/placement-v3-drift-detection/replayDeterminism.test.ts`: 1 passed

## Merge recommendation

#943 is safe to merge as **drift replay infrastructure plus deterministic local simulation guardrails**.

It should not be described as live replay validated. If the release gate requires live Supabase replay evidence, keep the PR draft until credentials are configured and a live replay run is persisted and reviewed.

Given current scope, the recommended decision is:

- Merge-ready for simulation/infrastructure: yes.
- Merge-ready for live replay/provider drift claims: no.
- Should remain draft if Chau wants live replay proof before merge: yes.
- Safe to mark ready only if the team accepts infrastructure/simulation as the intended merge scope: yes.

## Next recommendation

Run live replay in an environment with Supabase credentials:

```bash
export PLACEMENT_REPLAY_SUPABASE_URL="https://<project>.supabase.co"
export PLACEMENT_REPLAY_ANON_KEY="<anon-key>"
npx tsx scripts/placement-v3/run-grading-replay.ts --batch baseline-01
```

Then, with service-role persistence configured:

```bash
export PLACEMENT_REPLAY_SERVICE_ROLE_KEY="<service-role-key>"
npx tsx scripts/placement-v3/run-grading-replay.ts --batch baseline-01 --persist=true
```

Only after that should #943 claim live replay metrics or provider drift evidence.
