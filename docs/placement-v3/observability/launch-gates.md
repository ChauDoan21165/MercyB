# Placement V3 Forensic Launch Gates

These launch gates define the measurable requirements before enabling Placement V3 forensic persistence in production. Passing local tests or simulation does not satisfy live or production gates.

## Minimum Runtime Gates

| Gate | Required threshold | Required evidence |
| --- | --- | --- |
| Minimum live sessions | At least 20 live-provider sessions in staging or approved production shadow mode | Redacted event exports, Edge logs, dashboard screenshots |
| Failure/degraded coverage | At least 1 provider failure/fallback, 1 retry path, 1 degraded safe result, and 1 recommendation or taxonomy anomaly | Replay outputs and DB rows for each scenario |
| Forensic completeness | At least 98% required event completeness across validation sessions | Completeness report with required event count and missing count |
| Maximum missing-event rate | No more than 2% missing required events; 0 missing terminal recoverability states | Replay summary and SQL event counts |
| Replay success | At least 95% successful replay reconstruction; 100% for failed/degraded sessions used as launch evidence | Replay command logs and summaries |
| Redaction success | 100%: no secrets, auth tokens, signed URLs, raw audio, or unnecessary learner PII in rows/logs/screenshots | Privacy scan output and manual sample review |
| Dashboard verification | 100% dashboard-to-SQL match for sampled correlation IDs | Dashboard screenshots and matching SQL row counts |
| Rollback verification | At least 1 successful staging rollback drill | Rollback log proving forensic writes stopped and core session remained safe |
| Admin access verification | 100% denial for non-admin test account | Screenshot or access log |

## Required Scenario Gates

Each scenario must have persisted forensic events, replay output, and dashboard evidence before production enablement:
- Normal completed session.
- Provider timeout.
- Provider fallback.
- Retry exhaustion.
- Malformed grader/provider output.
- Recommendation failure.
- Taxonomy parse failure.
- Persistence write failure or approved equivalent staging simulation.
- Feature flag mismatch.
- Interrupted session recovery.
- Partial orchestration corruption.
- Degraded-but-safe user result.

## DO NOT ENABLE Conditions

Do not enable production forensic persistence if any of these are true:
- Live provider calls have not been validated.
- Live Supabase forensic inserts have not been validated.
- Any forensic row contains provider keys, Supabase keys, bearer tokens, signed URLs, raw audio, or unnecessary learner PII.
- Dashboard reads fixture data instead of persisted rows during acceptance.
- Non-admin accounts can access forensic dashboard data.
- Correlation IDs are missing from provider, retry, fallback, degraded, or terminal events.
- Degraded results are not visible in DB rows, replay output, and dashboard.
- Replay cannot reconstruct failed/degraded sessions.
- Rollback or kill-switch path has not been verified in staging.
- Missing-event rate exceeds 2% or any terminal recoverability state is missing.
- Chau has not approved the retention and incident response standards.

## Acceptance Decision

Production acceptance requires:
1. Completed `production-acceptance-checklist.md`.
2. Evidence package satisfying `evidence-requirements.md`.
3. Rollback drill evidence from `rollback-runbook.md`.
4. Signed-off privacy review using `privacy-redaction-checklist.md`.
5. Updated `validation-matrix.md` with live and production status.

Until these are complete, PR #953 must remain draft or explicitly marked as not production-ready.
