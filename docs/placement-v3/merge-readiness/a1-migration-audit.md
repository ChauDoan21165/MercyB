# A1 Placement V3 Migration Audit

Date: 2026-05-20

Evidence:

- migration grep output from PR refs in the shell transcript
- merge-tree logs under `docs/placement-v3/merge-readiness/raw/*-merge-tree*.txt`

## Migration Sets

| PR | Migration files | Scope |
| --- | --- | --- |
| #935 / #942 | `20260627000000_placement_v3_sessions.sql`, `20260627000001_placement_v3_responses.sql`, `20260627000002_placement_v3_profiles.sql`, `20260627000003_placement_v3_rls.sql` | Core placement session/response/profile storage |
| #943 | `20260520112527_placement_v3_grading_drift.sql` plus inherited #942 core migrations | Drift replay evidence tables |
| #944 | `20260520111844_placement_v3_benchmarks.sql` | Benchmark evidence tables |
| #946 | `20260520112524_placement_v3_adaptive_items.sql` | Adaptive generated item evidence tables |

## Timestamp Order

Chronological order if all merge:

1. `20260520111844_placement_v3_benchmarks.sql`
2. `20260520112524_placement_v3_adaptive_items.sql`
3. `20260520112527_placement_v3_grading_drift.sql`
4. `20260627000000_placement_v3_sessions.sql`
5. `20260627000001_placement_v3_responses.sql`
6. `20260627000002_placement_v3_profiles.sql`
7. `20260627000003_placement_v3_rls.sql`

No timestamp duplicates found.

## Table Isolation

- Core: `placement_v3_sessions`, `placement_v3_responses`, `placement_v3_profiles`.
- Benchmark: `placement_v3_benchmark_*`.
- Drift: `placement_v3_replay_*`, `placement_v3_drift_alerts`, `placement_v3_provider_variance`.
- Adaptive: `placement_v3_generated_items`, `placement_v3_item_validation_runs`, `placement_v3_item_rejection_reasons`.

No duplicate table names found across benchmark, drift, adaptive, and core migrations.

## RLS

- Core placement tables enable RLS and define owner-scoped policies.
- Benchmark tables enable RLS and define admin-read policies.
- Drift tables enable RLS and define admin-read policies.
- Adaptive tables enable RLS and define admin-read policies with authenticated select grants.

## Destructive Changes

No `drop table`, `drop column`, `truncate`, or destructive data deletion was found in the audited migrations.

## Independence

- #943 includes #942 core migrations in its branch history, so it should merge after #942 or be rebased to avoid duplicate stack review.
- #944's benchmark migration is isolated, but its branch conflicts with #942-owned session orchestrator files if merged directly to main. It merges cleanly onto #942.
- #946's adaptive migration is isolated and merges cleanly onto #942 in local simulation.

