# A2 Final Report: Placement V3 Runtime Observability

Generated: 2026-05-20

## Summary

This PR adds Placement V3 forensic event types, a shared Edge Function logger, persisted forensic tables, session instrumentation, timeline reconstruction, local failure injection, replay tooling, an admin dashboard, and focused tests.

## Runtime Executions

- `a2-burnin-02`: 20 local simulated runtime executions.
- 10 required scenarios were executed twice: before and after instrumentation improvement.
- 20 reconstruction outputs were produced in-process.
- 20 replay reconstructions were produced from saved raw JSON files.

## Commands Run

```bash
npm run typecheck
npm run typecheck:ci
npm run typecheck:functions
npm run build
npx tsx scripts/placement-v3/run-failure-injection.ts --run-id a2-burnin-02
npx tsx scripts/placement-v3/replay-failure-timeline.ts --input <raw-run> --output <replay-output>
npx vitest run tests/integration/placement-v3-forensics
npx playwright test tests/e2e/placement-forensics-dashboard.spec.ts --config=playwright.smoke.config.ts
```

## Scenarios Tested

- provider timeout
- malformed JSON grader output
- provider fallback
- retry exhaustion
- recommendation-engine failure
- taxonomy parse failure
- persistence write failure
- feature flag mismatch
- interrupted session recovery
- partial orchestration corruption

## Reconstruction Results

- Reconstructed well after instrumentation: 9/10 scenarios.
- Reconstructed as intentionally unrecoverable: persistence write failure.
- Main improvement from before to after: terminal transitions, recoverability state, degraded-result markers, retry consistency, and fallback visibility.

## Remaining Blind Spots

- Live provider calls were not used for these artifacts.
- Live Supabase persistence was not verified from this workspace.
- Dashboard E2E uses a deterministic operator-flow fixture, not a real admin login with production rows.

## Final Verification

- `npm run typecheck`: 3/3 reruns passed.
- `npm run typecheck:ci`: 3/3 reruns passed.
- `npm run build`: 3/3 reruns passed.
- Forensic integration tests: 3/3 reruns passed, 16 tests each.
- Forensic dashboard E2E: 3/3 reruns passed, 8 tests each.
- `npm run typecheck:functions`: passed once.

The first repeated verification attempt is retained in raw logs and shows local dependency binaries disappearing mid-loop. Dependencies were restored with `npm install`, then the successful reruns were captured under `a2-verify-*-rerun-*.log`.

## Operational Readiness Assessment

Placement V3 is materially more debuggable after this work, but the burn-in evidence is local simulation plus compile/test verification. It is not enough to claim production-grade operational readiness or safe soft launch. A follow-up live-environment burn-in should validate provider metadata, database writes, and dashboard rendering against real persisted rows.
