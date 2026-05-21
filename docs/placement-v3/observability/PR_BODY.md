# Summary

- Added Placement V3 forensic event schemas, persisted tables, shared Edge logger, failure timeline reconstruction, failure injection/replay scripts, and an admin forensic dashboard.
- Instrumented `placement-v3-session` for correlation IDs, feature flag snapshots, session events, orchestration transitions, grader provider/latency events, degraded fallback markers, recommendation events, and failure snapshots.

# Failure Scenarios Tested

Local simulated burn-in `a2-burnin-02` executed all 10 required scenarios before and after instrumentation improvement: provider timeout, malformed JSON grader output, provider fallback, retry exhaustion, recommendation failure, taxonomy parse failure, persistence write failure, feature flag mismatch, interrupted recovery, and partial orchestration corruption.

# Instrumentation Improvements

- Durable forensic event tables and runtime alert table.
- Replay-safe serialization and secret redaction.
- Timeline builder for missing events, retries, provider switches, fallbacks, recoverability, degraded outcomes, and dead ends.
- Admin dashboard route at `/admin/placement-forensics`.

# Reconstruction Quality

- 20 raw scenario files saved.
- 20 in-process reconstructions saved.
- 20 replay reconstructions saved.
- 9/10 after-runs reconstruct without dead ends or retry inconsistencies.
- Persistence write failure remains unrecoverable by design and is documented as a hard stop.

# Remaining Blind Spots

- Live OpenAI/Gemini provider calls were not executed by the failure-injection harness.
- Live Supabase forensic inserts were not validated in this workspace.
- Dashboard E2E is fixture-based and does not prove real admin access with persisted rows.

# Live validation still required before merge/enablement

- Run `docs/placement-v3/observability/live-validation-runbook.md` in an environment with real Supabase and provider credentials.
- Use `scripts/placement-v3/verify-forensics-env.ts` to check required env vars without calling providers.
- Confirm forensic rows are inserted by the real `placement-v3-session` Edge Function.
- Confirm the admin dashboard reads persisted forensic rows, not fixture data.
- Keep this PR draft until live provider calls and live Supabase inserts are validated or explicitly deferred by Chau.

# Forensic production acceptance criteria added

- Added `docs/placement-v3/observability/production-acceptance-checklist.md` with measurable owner, evidence, pass/fail, and missing-severity criteria.
- Added `docs/placement-v3/observability/evidence-requirements.md` to distinguish simulated, local-only, live-provider, and production evidence.
- Added `docs/placement-v3/observability/rollback-runbook.md`, `incident-severity-matrix.md`, `retention-policy.md`, `launch-gates.md`, and `validation-matrix.md`.
- Added operator templates under `docs/placement-v3/observability/templates/`.
- These documents define what must be proven later; they do not claim production acceptance has been achieved.

# Executable staging-validation framework added

- Added `scripts/placement-v3/run-forensics-staging-validation.ts` to verify staging prerequisites, create timestamped evidence folders, check local migration presence, and test Supabase connectivity without faking provider responses.
- Extended `scripts/placement-v3/verify-forensics-env.ts --dry-run-report` to print missing env vars, evidence that would be collected, and blockers without calling providers or Supabase.
- Added staging evidence conventions, checklist, DB verification guide, provider outage simulation guide, dashboard validation guide, and machine-readable evidence manifest schema.
- This framework prepares staging validation; it does not claim live provider calls, live Supabase inserts, dashboard persisted-row validation, or rollback validation have passed.

# Runtime Evidence

- `docs/placement-v3/observability/raw-runs/a2-burnin-02-command.log`
- `docs/placement-v3/observability/raw-runs/a2-burnin-02-replay-command.log`
- `docs/placement-v3/observability/raw-runs/replay-a2-burnin-02/`
- `docs/placement-v3/observability/raw-runs/a2-verify-*-rerun-*.log`
- `docs/placement-v3/observability/raw-runs/a2-verify-integration-*.log`
- `docs/placement-v3/observability/raw-runs/a2-verify-e2e-*.log`

# Verification

- `npm run typecheck`: 3 consecutive reruns passed.
- `npm run typecheck:ci`: 3 consecutive reruns passed.
- `npm run build`: 3 consecutive reruns passed.
- Forensic integration tests: 3 consecutive reruns passed.
- Forensic dashboard E2E: 3 consecutive reruns passed.

# Operational Readiness Assessment

Not ready to claim production-grade burn-in. Placement V3 is more observable and locally replayable, but live provider/database/dashboard verification remains required before soft launch.
