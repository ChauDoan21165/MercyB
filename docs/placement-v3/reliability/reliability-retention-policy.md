# Placement V3 B1 Reliability Retention Policy

B1 owns reliability evidence retention for test harness stability only. This policy does not enable Placement V3 and does not assert live-provider, production, or real-user readiness.

## Durable Evidence

Durable evidence must be preserved with the PR or long-running reliability record:

- final repeated-run summaries
- final flaky-pattern detector summaries
- merge-readiness raw logs
- sustained burn-in reports under `reports/b1-burnin/`
- health, trend, contention, and retention summaries under `docs/placement-v3/reliability/`
- screenshots, traces, and diagnostic JSON tied to a confirmed or suspected flake

## Ephemeral Runtime Logs

Ephemeral runtime logs are temporary maintenance outputs under `docs/placement-v3/reliability/logs/`.

They may include nightly wrapper logs, dry-run rotation plans, one-off local health runs, and duplicated command output that is already represented by durable summaries.

## Archival Windows

- Merge-readiness evidence: preserve indefinitely unless Chau explicitly archives it elsewhere.
- Sustained burn-in evidence: preserve indefinitely for the PR evidence trail.
- Confirmed or suspected flake diagnostics: preserve until the root cause is fixed, verified, and recorded.
- Ephemeral runtime logs: eligible for rotation after 14 days.
- CI artifacts: use at least 14 days for routine nightly runs and at least 30 days for any failed or unstable run.

## Deletion Safeguards

- Rotation is dry-run by default.
- Deletion requires `--execute`.
- Rotation must print planned actions before deletion.
- Rotation must not target `reports/b1-burnin/`.
- Rotation must not delete logs tied to merge-readiness evidence.
- Rotation must not delete the latest sustained burn-in evidence.

## CI Artifact Retention

Nightly B1 reliability CI should upload:

- `docs/placement-v3/reliability/`
- `reports/b1-e2e-diagnostics/`
- `reports/b1-burnin/` when generated or referenced
- `test-results/`
- `playwright-smoke-report/`

Failed or unstable runs should retain artifacts longer than routine green runs.

## Sustained-Run Preservation Rules

Sustained-run evidence is durable if it is used to support any merge-readiness, flake classification, contention-risk, timeout-risk, or health-confidence statement.

Do not delete sustained-run evidence while PR #950 or any Placement V3 follow-up PR cites it.
