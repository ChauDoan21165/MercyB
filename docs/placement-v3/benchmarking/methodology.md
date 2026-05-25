# Placement V3 Benchmark Methodology

Status: benchmark infrastructure only; live benchmark blocked.

The benchmark suite measures end-to-end Placement V3 readiness across five scenario families: A1 beginner, B1 intermediate, C1 advanced, speaking-heavy, Mercy conversational, and provider failover.

Live runs use `scripts/placement-v3/run-benchmarks.ts` against Supabase Edge Functions. Each step records ISO timestamps, duration, provider, model, estimated token counts, estimated cost, failover attempts, status, and sanitized raw responses. Results are written to `docs/placement-v3/benchmarking/raw-runs/` and can optionally persist to `placement_v3_benchmark_*` tables.

Dry-run mode exists only to validate the harness and dashboard wiring without spending API money:

```bash
pnpm tsx scripts/placement-v3/run-benchmarks.ts --mode=dry-run --runs=1
```

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

Metrics are aggregated as p50/p95/p99 latency, average tokens/session, estimated USD/session, provider distribution, failover rate, error rate, worst steps, and regression warnings. Cost estimates use explicit benchmark pricing constants for `gpt-4o-mini`, `gpt-4o`, `gemini-2.5-flash`, and Azure pronunciation.

Real production-readiness claims require live artifacts. Dry-run artifacts are not evidence of latency, cost, provider reliability, or grading consistency.

## Hard Gates Not Met

- 0/25 live sessions
- 0/3 optimization cycles
- no p95/cost/failover metrics
