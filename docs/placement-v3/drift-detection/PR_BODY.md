# Summary

Adds Placement V3 grading drift infrastructure:

- replay harness for calibration samples
- drift math library for CEFR deltas, outliers, provider variance, retry variance, and taxonomy variance
- Supabase persistence schema for replay runs, replay scores, drift alerts, and provider variance
- admin-only drift report edge function
- admin dashboard route for operator visibility
- 40 replay fixtures across reading, listening, and speaking
- methodology, replay history, initial findings, blocker report, and production risk docs
- merge-readiness recommendation for infrastructure/simulation scope
- live replay operational execution package

This PR is finalized as **replay infrastructure complete; live replay blocked**.
It now also supports **deterministic local replay simulation** for pipeline validation without provider or Supabase secrets.
Replay determinism is now guarded by CI-runnable checks so future fixture/order/serialization drift cannot silently change simulated replay output.
Live replay operational execution package added.

Unrelated untracked A35/benchmark/adaptive-generation files were intentionally excluded from this A36 commit.

# Replay Coverage

- Fixtures: 40
- Modalities covered: reading, listening, speaking
- Writing: #942 has merged Placement V3 writing grader infrastructure; A36 adds drift replay infrastructure around available grader endpoints.
- Providers intended: live grader routing via current Supabase edge functions
- Live replay status: blocked before grader calls
- Simulation status: runnable locally with `--simulate`; all simulated artifacts are marked `simulated: true`
- Determinism status: guarded by `npm run check:placement-replay-fixtures`, `npm run check:placement-replay-determinism`, and `replayDeterminism.test.ts`

# Drift Findings

No live drift metrics are claimed.
No provider drift metrics are claimed from simulation mode.

The required baseline command was attempted:

```bash
pnpm tsx scripts/placement-v3/run-grading-replay.ts --batch baseline-01
```

It failed because this shell did not have:

- `SUPABASE_URL` or `PLACEMENT_REPLAY_SUPABASE_URL`
- `SUPABASE_ANON_KEY` or `PLACEMENT_REPLAY_ANON_KEY`

The blocker is documented in:

- `docs/placement-v3/drift-detection/a36-blockers.md`

# Stability Iterations

No prompt/config tuning iterations were performed because live replay was blocked before real grader calls. No fake replay output, fake variance, fake latency, or fake provider disagreement was generated.

# Local Simulation Evidence

Deterministic local replay simulation was run three times:

```bash
npx tsx scripts/placement-v3/run-grading-replay.ts --simulate --batch simulated-01 --outDir docs/placement-v3/drift-detection/simulated-runs --resume=false
npx tsx scripts/placement-v3/run-grading-replay.ts --simulate --batch simulated-02 --outDir docs/placement-v3/drift-detection/simulated-runs --resume=false
npx tsx scripts/placement-v3/run-grading-replay.ts --simulate --batch simulated-03 --outDir docs/placement-v3/drift-detection/simulated-runs --resume=false
```

Simulation artifacts are committed under:

- `docs/placement-v3/drift-detection/simulated-runs/`

Simulation proves replay pipeline integrity only. It is not live provider evidence.

# Determinism Guardrails

Added deterministic replay regression coverage:

- artifact schema validator: `src/lib/placementDrift/validateReplayArtifact.ts`
- fixture integrity checker: `scripts/placement-v3/check-replay-fixtures.ts`
- repeated-run determinism checker: `scripts/placement-v3/check-replay-determinism.ts`
- regression test: `tests/integration/placement-v3-drift-detection/replayDeterminism.test.ts`
- guardrail docs: `docs/placement-v3/drift-detection/determinism-guardrails.md`

Repeated-run logs are committed under:

- `docs/placement-v3/drift-detection/determinism-runs/`

This evidence remains simulated-only. It does not claim live replay metrics or provider drift metrics.

# Merge Readiness

Current recommendation is documented in:

- `docs/placement-v3/drift-detection/merge-readiness.md`

Summary: safe to merge as drift replay infrastructure plus deterministic local simulation guardrails if the accepted scope is simulation/infrastructure. Not ready to claim live replay or provider drift metrics until Supabase credentials are configured and a live replay run is reviewed.

# Live Replay Operations Package

Added operator-facing execution docs and preflight tooling:

- `docs/placement-v3/drift-detection/live-replay-runbook.md`
- `docs/placement-v3/drift-detection/live-replay-evidence-checklist.md`
- `docs/placement-v3/drift-detection/persistence-verification.md`
- `docs/placement-v3/drift-detection/replay-rollback-guide.md`
- `docs/placement-v3/drift-detection/replay-launch-gates.md`
- `docs/placement-v3/drift-detection/replay-validation-matrix.md`
- `docs/placement-v3/drift-detection/live-replay-evidence/README.md`
- `scripts/placement-v3/verify-live-replay-env.ts`

The env verifier does not call providers or Supabase. Current saved output is:

- `docs/placement-v3/drift-detection/live-replay-evidence/env-check.log`

It correctly reports live replay as not ready in this shell because Supabase URL and anon key are missing.

# Risks

- Live replay remains unverified until credentials are present.
- Database persistence remains unverified against production until `--persist=true` is run with a service-role key.
- Provider variance is limited by current grader trace data; current CEFR graders do not expose full failover attempt paths.
- Writing replay can use the #942 writing grader infrastructure, but live replay remains blocked unless Supabase/env vars are configured.
- Simulation mode uses deterministic local outputs with `provider: "none"` and cannot validate provider behavior.
- `pnpm tsc -p tsconfig.scripts.json --noEmit` still fails only because of existing unrelated script errors, not this PR.

# Evidence

Passing verification for the simulation follow-up exactly as run:

```bash
npm run typecheck
npx vitest run tests/integration/placement-v3-drift-detection/drift-detection.test.ts
npm run build
```

Passing verification for the determinism guardrail follow-up exactly as run:

```bash
npm run typecheck
npx vitest run tests/integration/placement-v3-drift-detection/drift-detection.test.ts tests/integration/placement-v3-drift-detection/replayDeterminism.test.ts
npm run check:placement-replay-fixtures
npm run check:placement-replay-determinism -- --runs 5
npm run build
```

Passing verification for the operational package exactly as run:

```bash
npm run typecheck
npm run build
npm run check:placement-replay-fixtures
npm run check:placement-replay-determinism -- --runs 5
node scripts/placement-v3/verify-live-replay-env.ts
```

The env check command currently exits non-zero by design because live Supabase env vars are absent. Its output is saved in `docs/placement-v3/drift-detection/live-replay-evidence/env-check.log`.

Repeated evidence generated:

```bash
# 5 simulation run logs under docs/placement-v3/drift-detection/determinism-runs/
npx tsx scripts/placement-v3/run-grading-replay.ts --simulate --batch determinism-sim-01 --outDir docs/placement-v3/drift-detection/determinism-runs/determinism-sim-01 --resume=false

# 5 determinism checker logs under docs/placement-v3/drift-detection/determinism-runs/
npx tsx scripts/placement-v3/check-replay-determinism.ts --runs 3 --outDir docs/placement-v3/drift-detection/determinism-runs/determinism-check-01
```

The generated JSON artifacts were checked for top-level `simulated: true`; only the replay/checker logs are committed in `determinism-runs/` to keep evidence reviewable.

The simulated artifact check also passed:

```bash
node - <<'NODE'
const fs = require('fs');
const dir = 'docs/placement-v3/drift-detection/simulated-runs';
const files = fs.readdirSync(dir).filter((file) => file.endsWith('.json'));
for (const file of files) {
  const json = JSON.parse(fs.readFileSync(`${dir}/${file}`, 'utf8'));
  if (json.simulated !== true) process.exit(1);
}
console.log(`all json artifacts simulated=true: ${files.length}`);
NODE
```

Returned `all json artifacts simulated=true: 21`.

Additional check:

```bash
jq length docs/placement-v3/drift-detection/replay-fixtures/placement-v3-replay-samples.json
```

Returned `40`.

# Reviewer Checklist

To rerun live replay after adding env vars:

1. Set live replay env vars:

```bash
export PLACEMENT_REPLAY_SUPABASE_URL="https://<project>.supabase.co"
export PLACEMENT_REPLAY_ANON_KEY="<anon-key>"
```

2. Run baseline replay without persistence first:

```bash
pnpm tsx scripts/placement-v3/run-grading-replay.ts --batch baseline-01
```

3. Confirm raw output exists under:

```bash
docs/placement-v3/drift-detection/raw-runs/
```

4. To persist replay rows, also set:

```bash
export PLACEMENT_REPLAY_SERVICE_ROLE_KEY="<service-role-key>"
```

5. Then run:

```bash
pnpm tsx scripts/placement-v3/run-grading-replay.ts --batch baseline-01 --persist=true
```

6. Open `/admin/placement-drift` as an admin level 9 account and verify:

- replay success rate
- p95 grading latency
- provider variance
- retry variance
- taxonomy-category instability
- drift alerts
