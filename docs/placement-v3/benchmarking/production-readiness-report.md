# Placement V3 Benchmark Infrastructure Report

Generated: 2026-05-20

Status: benchmark infrastructure only; live benchmark blocked.

## Current Recommendation

Do not publicly roll out Placement V3 from this branch yet.

## Evidence Status

- Benchmark harness: implemented.
- Live benchmark sessions completed here: 0.
- Dry-run harness validation: command path verified locally; no benchmark JSON is committed as evidence.
- Required 25 real full benchmark sessions: not completed.
- Required 3 optimization cycles with before/after live metrics: not completed.

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

## Runtime Bugs / Issues Found

1. `docs/placement-v3/README.md` is missing, even though it is the required architecture entry point for this task.
2. `supabase/functions/placement-v3-session-orchestrator/index.ts` is missing; current code uses `supabase/functions/placement-v3-session/index.ts`.
3. `supabase/functions/placement-v3-grade-writing/index.ts` is missing locally, while the session orchestrator starts with writing and calls an HTTP writing grader.

## Missing Metrics

Live p95 full-session latency, average cost/session by CEFR band, real failover recovery rate, cold-start impact, scoring consistency, and timeout frequency are all missing until real API credentials, test/admin credentials, Deno, and deployed functions are available.

## Launch Limit

Recommended launch concurrency limit: 0 public users until the missing writing grader/orchestrator path mismatch is resolved and at least 25 live benchmark sessions are recorded.

## Anti-Fabrication Note

No production benchmark JSON, screenshots, live p95/cost/failover metrics, optimization wins, or production-readiness claims were generated in this environment.
