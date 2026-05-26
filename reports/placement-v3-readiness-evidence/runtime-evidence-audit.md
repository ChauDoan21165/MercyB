# Placement V3 Runtime Evidence Audit

Date: 2026-05-20

## Evidence Matrix

| Area | PR | Real evidence exists? | Blockers / limits | Production claim supported? |
|---|---:|---|---|---|
| Native audio | #941 | Static native permission evidence only | `native-permission-audit.md` says runtime validation was blocked by missing Azure/Supabase env vars. No real phone audio capture or Azure scoring success evidence is present. | No runtime speaking claim. Only Android/iOS permission configuration can be claimed. |
| Benchmark cost/latency/failover | #944 | Infrastructure-only evidence | PR body states live benchmark blocked by missing `PLACEMENT_BENCHMARK_SUPABASE_URL`, `PLACEMENT_BENCHMARK_ANON_KEY`, missing `placement-v3-grade-writing` in that local tree, missing test/admin credentials, and no `deno`. Hard gates not met: 0/25 sessions, 0/3 optimization cycles, no p95/cost/failover metrics. | No. Do not claim p95 latency, cost/session, provider failover frequency, or production readiness. |
| Grading drift replay | #943 | Replay infrastructure only | PR body says live replay blocked by missing Supabase replay URL/key. No live drift metrics claimed. Writing replay blocked in that branch because writing grader was absent there. | No. Do not claim drift stability or provider variance from live replay. |
| Adaptive generation | #946 | Partial live candidate evidence, but hard gates failed | 59/90 live candidates completed, 4 accepted items, tuned run stopped on `fetch failed`; Build Preview and Lighthouse checks failed. | No launch claim. Evidence supports only that the gauntlet scaffold found quality problems. |
| Shadow replay | #945 | No implementation evidence | PR is closed draft and body says only blocker report was added. Real sessions captured: 0. Replay runs: 0. | No. Do not claim shadow-session replay coverage. |

## Missing Required Local Docs

The task requested these paths, but they are not present on `origin/main`:

- `docs/placement-v3/benchmarking/pr-body-draft.md`
- `docs/placement-v3/drift-detection/PR_BODY.md`
- `docs/placement-v3/adaptive-generation/PR_BODY.md`

The current evidence instead uses GitHub PR bodies saved under:

- `reports/placement-v3-readiness-evidence/pr-943.json`
- `reports/placement-v3-readiness-evidence/pr-944.json`
- `reports/placement-v3-readiness-evidence/pr-945.json`
- `reports/placement-v3-readiness-evidence/pr-946.json`

## Conclusion

Runtime production-readiness evidence is incomplete. The merged code can be verified as integrated behind flags, but the evidence does not support public launch, live cost/latency claims, drift-stability claims, native speaking success claims, or adaptive generation readiness.

