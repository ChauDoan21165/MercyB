# Placement V3 Operational Cadence

Cadence for managing Placement V3 release readiness. This is active only while Placement V3 remains gated or in staged rollout.

## Daily Review Cadence

Run on any day active Placement V3 launch work is happening.

- Review `placement-v3-release-gates.md` for changed statuses.
- Review `placement-v3-blocker-ownership.md` for owner/next-action drift.
- Check open PR state for #943, #944, #946, #950, #951, #952, #953, and successor PRs.
- Confirm both Placement V3 flags remain off unless a signed decision template authorizes a scoped stage.
- Review any new runtime artifacts for unsupported production claims.
- Update `placement-v3-launch-criteria-history.md` when a blocker is added, cleared, or reclassified.

## Weekly Release Review

Run once per week until launch decision changes.

- Re-read the post-merge readiness report.
- Reassess every critical blocker in `placement-v3-release-gates.md`.
- Update the evidence index with newly merged/closed PRs.
- Decide whether the current stage remains `blocked`.
- Confirm whether the next safe target is still internal simulation/local runtime validation.

## When To Rerun Benchmarks

Rerun #944 benchmark suites when any of these changes:

- Grader prompts or models change.
- Provider routing/failover settings change.
- Session orchestration changes.
- Prompt catalog or modality sequence changes.
- Retry/timeout/caching behavior changes.
- Before moving to invite-only, soft launch, or public launch.

Minimum benchmark evidence before external users:

- 25+ live sessions.
- p50/p95 latency by step and modality.
- cost/session for OpenAI-primary and Gemini-failover paths.
- failover recovery rate.
- raw sanitized logs.

## When To Rerun Drift Replay

Rerun #943 drift replay when any of these changes:

- Grader model or prompt changes.
- Scoring rubric/normalization changes.
- Provider routing changes.
- CEFR aggregation logic changes.
- New replay corpus is added.
- Before any external launch stage.

Minimum replay evidence before external users:

- CEFR movement rate.
- unacceptable movement examples.
- provider variance if multiple providers are used.
- pass/fail against approved thresholds.

## When To Rerun Forensic Validation

Rerun forensic/observability validation when any of these changes:

- Session API shape changes.
- Logging schema changes.
- Provider/token/cost logging changes.
- Dashboard/reporting route changes.
- Supabase migrations for placement tables change.
- Before staff-only or broader enablement.

Minimum forensic evidence:

- session start/respond/complete/error events.
- grader call logs.
- provider/model/token logs.
- failover/retry logs.
- queryable dashboard or saved report output.

## When To Reassess Launch Recommendation

Reassess the recommendation only when evidence changes, not when code merely exists.

Reassess after:

- #947 merges and shared test stability is accepted.
- #944 produces live benchmark metrics.
- #943 produces live drift metrics.
- #941 native path is validated on real devices.
- #953 observability is live-verified.
- A29 modality gaps are resolved or explicitly accepted for an internal-only scope.
- A founder decision template is filled with evidence links.

Default recommendation until then: DO NOT ENABLE.
