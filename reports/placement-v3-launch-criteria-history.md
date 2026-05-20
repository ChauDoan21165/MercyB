# Placement V3 Launch Criteria History

Canonical changelog for launch criteria. Add entries whenever a gate, blocker, launch stage, or recommendation changes.

## 2026-05-20 — Post-Merge Readiness Record Created

Change:

- Created the post-merge readiness report after #941 and #942 merged.
- Decision set to DO NOT ENABLE.
- Feature flags required to remain off.

Evidence:

- `reports/PLACEMENT-V3-POST-MERGE-READINESS-2026-05-20.md`
- `reports/placement-v3-readiness-evidence/pr-941.json`
- `reports/placement-v3-readiness-evidence/pr-942.json`

Why:

- Placement V3 integration exists behind flags, but live benchmark, drift, native audio, shadow replay, adaptive generation, and production runtime evidence are missing.

## 2026-05-20 — E2E Failure Reclassified

Change:

- Original local vertical E2E failure was reclassified from possible product breakage to local E2E harness/dev-server instability.
- Mocked internal path verified with explicit flags.

Evidence:

- `reports/placement-v3-readiness-evidence/e2e-failure-analysis.md`
- `reports/placement-v3-readiness-evidence/e2e-reruns/run-2-explicit-flags/output.log`
- `reports/placement-v3-readiness-evidence/e2e-reruns/run-3-explicit-flags-trace-on/output.log`

Why:

- Trace showed Vite dev server disconnect and failed lazy fetch of `ResultsPage.tsx`, followed by `chrome-error://chromewebdata/`.
- This does not prove production readiness; it only clears the local mocked path as a product-breakage signal.

## 2026-05-20 — Canonical Release Decision Package Added

Change:

- Added master release gates, known risks, launch scenarios, evidence index, and open questions.
- Kept recommendation unchanged: DO NOT ENABLE.

Evidence:

- `reports/placement-v3-release-gates.md`
- `reports/placement-v3-known-risks.md`
- `reports/placement-v3-launch-scenarios.md`
- `reports/placement-v3-evidence-index.md`
- `reports/placement-v3-open-questions.md`

Why:

- #949 needed to become a durable decision record, not a one-time snapshot.

## 2026-05-20 — Operational Command Center Added

Change:

- Added launch progression tracker, blocker ownership matrix, runtime validation scoreboard, rollback matrix, release evidence manifest, founder decision template, operational cadence, and this criteria history.

Evidence:

- `reports/placement-v3-launch-progression.md`
- `reports/placement-v3-blocker-ownership.md`
- `reports/placement-v3-runtime-validation-scoreboard.md`
- `reports/placement-v3-rollback-matrix.md`
- `reports/placement-v3-release-evidence-manifest.json`
- `reports/placement-v3-founder-decision-template.md`
- `reports/placement-v3-operational-cadence.md`
- `reports/placement-v3-launch-criteria-history.md`

Why:

- Chau needs one operational layer for release readiness, blocker tracking, evidence tracking, runtime validation progress, rollback planning, and future enablement decisions.

## Pending Criteria Changes

Do not mark these cleared without evidence:

- Live benchmark p95/cost/failover metrics.
- Live drift replay metrics.
- Native iOS/Android speaking runtime validation.
- Provider failover recovery evidence.
- A29 speaking/reading/listening grader proof or explicit internal-only fallback acceptance.
- Observability/forensic events proven live.
- Rollback owner and test-session cleanup policy assigned.
