# Summary

Adds Placement V3 grading drift infrastructure:

- replay harness for calibration samples
- drift math library for CEFR deltas, outliers, provider variance, retry variance, and taxonomy variance
- Supabase persistence schema for replay runs, replay scores, drift alerts, and provider variance
- admin-only drift report edge function
- admin dashboard route for operator visibility
- 40 replay fixtures across reading, listening, and speaking
- methodology, replay history, initial findings, blocker report, and production risk docs

This PR is finalized as **replay infrastructure complete; live replay blocked**.

Unrelated untracked A35/benchmark/adaptive-generation files were intentionally excluded from this A36 commit.

# Replay Coverage

- Fixtures: 40
- Modalities covered: reading, listening, speaking
- Writing: not included because `placement-v3-grade-writing` is absent in this branch
- Providers intended: live grader routing via current Supabase edge functions
- Live replay status: blocked before grader calls

# Drift Findings

No live drift metrics are claimed.

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

# Risks

- Live replay remains unverified until credentials are present.
- Database persistence remains unverified against production until `--persist=true` is run with a service-role key.
- Provider variance is limited by current grader trace data; current CEFR graders do not expose full failover attempt paths.
- Writing replay is blocked until the writing grader exists.
- `pnpm tsc -p tsconfig.scripts.json --noEmit` still fails only because of existing unrelated script errors, not this PR.

# Evidence

Passing verification exactly as run:

```bash
pnpm vitest run tests/integration/placement-v3-drift-detection/drift-detection.test.ts
pnpm playwright test -c playwright.smoke.config.ts placement-drift-dashboard.spec.ts
pnpm tsc -p tsconfig.typecheck.json --noEmit
pnpm tsc --noEmit
pnpm vite build
pnpm tsc -p tsconfig.functions.json --noEmit
```

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
