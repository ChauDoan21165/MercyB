# PR Title

feat(placement-v3): add benchmarking infrastructure scaffold

## Summary

Adds Placement V3 benchmark infrastructure only. Live benchmark execution is blocked in this environment, so this PR does not claim production benchmark results, production-readiness, latency improvements, cost estimates, or provider reliability.

## What Benchmarking Infrastructure Was Added

- Sequential benchmark runner with resumable raw JSON output.
- Scenario definitions for beginner A1, intermediate B1, advanced C1, speaking-heavy, Mercy conversational, and provider failover flows.
- Benchmark persistence schema for runs, steps, provider usage, failover events, and error events.
- Metrics aggregation utilities for latency, cost, provider usage, and regression warnings.
- Admin dashboard and report Edge Function for persisted benchmark data.
- Integration and dashboard E2E test scaffolding.

## Live Run Blockers

- Missing `PLACEMENT_BENCHMARK_SUPABASE_URL`.
- Missing `PLACEMENT_BENCHMARK_ANON_KEY`.
- Missing `placement-v3-grade-writing` in local tree.
- Missing test/admin credentials.
- `deno` not installed.

## How To Run Live Benchmark After Env Setup

```bash
export PLACEMENT_BENCHMARK_SUPABASE_URL="https://<project-ref>.supabase.co"
export PLACEMENT_BENCHMARK_ANON_KEY="<anon-key>"
export PLACEMENT_BENCHMARK_JWT="<admin-or-test-user-jwt>"
export PLACEMENT_BENCHMARK_SERVICE_ROLE_KEY="<service-role-key>"
pnpm test:e2e placement
pnpm tsx scripts/placement-v3/run-benchmarks.ts --runs=5 --persist=true
```

## Hard Gates Not Met

- 0/25 live sessions
- 0/3 optimization cycles
- no p95/cost/failover metrics

## Benchmark Coverage

Infrastructure coverage exists for six scenarios. Live scenario measurement has not been completed.

## Optimization Iterations

No live optimization iterations were completed. No before/after production metrics are claimed.

## Runtime Bugs Found

1. `docs/placement-v3/README.md` is missing.
2. `supabase/functions/placement-v3-session-orchestrator/index.ts` is missing under the requested name; this branch uses `placement-v3-session`.
3. `supabase/functions/placement-v3-grade-writing/index.ts` is missing locally while the orchestrator starts with writing.

## Production Readiness Assessment

Not ready for rollout from this evidence set. This PR provides the measurement harness; it does not provide live benchmark results.

## Remaining Risks

- Live provider routing and failover behavior unmeasured.
- Live p95 latency unmeasured.
- Live session cost unmeasured.
- Grading consistency under repeated real calls unmeasured.

## Evidence

- No live benchmark JSON, screenshots, or production-readiness evidence were fabricated.
- The PR is infrastructure-only and live run blocked.
