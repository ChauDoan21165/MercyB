# Placement V3 Next-Agent Queue

Daily queue for follow-up agent work. Keep agents on their assigned branch/domain.

| Agent | Current branch | Current PR | Last report summary | Exact next task | Task mode | Expected evidence |
|---|---|---:|---|---|---|---|
| Agent A2 (ObservabilityOps) | `feat/a2-placement-v3-observability` | #953 | Draft observability/forensic tooling exists; current capture shows Build and Test in progress/blocked. | Get CI green, then produce a validation report proving which session/grader/provider/token/cost events are emitted and queryable. | simulation-only first, runtime/live after env approval | `pr-953.json`, CI output, event schema, sample query results, dashboard screenshot or saved JSON. |
| Agent A3 (DataQuality) | `feat/a3-placement-v3-data-quality` | #951 | Draft data-quality audit/tooling is clean/green, but not accepted as launch evidence yet. | Finish data-quality audit, list hard data blockers, and mark whether each affects internal/staff/invite/public launch. | report-only plus local audit | Audit logs, integrity report, blocker table, commands run. |
| Agent A33 (Benchmarking) | `feat/a33-placement-benchmarking` | #944 | Benchmark scaffold exists; live run blocked; 0/25 live sessions and 0/3 optimization cycles. | If env is still missing, update blockers. If env exists, run live benchmark matrix and save p95/cost/failover evidence. | runtime/live only after env setup; otherwise report-only | Raw run JSON, latency traces, token/provider logs, failover logs, optimization deltas. |
| Agent A36 (DriftReplay) | `feat/a36-grading-drift-detection` | #943 | Drift replay scaffold exists; no live replay metrics. | Run replay checks if env/corpus exists; otherwise update blocker report and define drift thresholds. | simulation-only or runtime/live depending on env | Replay output, CEFR movement metrics, provider variance, threshold pass/fail. |
| Agent A37 (ShadowReplayOps) | reports/a37-shadow-replay-readiness | #952 | Readiness docs are clean/green; no shadow replay execution evidence. | Keep #952 scoped as readiness docs, then propose implementation or accepted deferral for actual shadow replay. | report-only | Privacy/retention plan, implementation plan, explicit no-runtime-claim language. |
| Agent B1 (ReliabilityGuardrails) | `feat/b1-test-stability-burndown` | #950 | Test/E2E reliability PR is now clean/green at latest capture. | Confirm PR body and docs do not imply Placement V3 production readiness; prepare merge if scoped. | report-only / local verification | CI summary, local verification logs if rerun, scoped PR body. |
| Agent Sentinel (OpsWatch) | TBD | TBD | No dedicated PR captured in #949 evidence. | Monitor Placement V3 PR stack daily and update #949 docs when PR state or evidence changes. | report-only | PR state JSON, changed-gate summary, unsupported-claim scan. |
| Agent Cleaner (DiskCleanupOps) | TBD | TBD | Worktrees and artifacts are accumulating from report/evidence work. | Audit disk/worktrees without deleting dirty work. Propose safe cleanup only. | report-only | `git worktree list`, disk usage report, dirty-worktree inventory, no-deletion confirmation. |

## Queue Rule

No agent should switch branches/domains without explicit instruction. No agent should claim live evidence unless artifacts prove live execution.
