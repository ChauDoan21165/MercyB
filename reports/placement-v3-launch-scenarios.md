# Placement V3 Launch Scenarios

Canonical launch scenario map. These scenarios are not approvals. They define the minimum gates required before Chau should consider each level.

## Staff-Only Launch

Scope: named internal staff/test accounts only, explicit flags in a controlled environment, no public navigation or marketing.

Required gates:

- Flags remain default-off globally; access is explicitly scoped.
- #947 test harness stability merged or equivalent green full-test evidence exists.
- Local mocked vertical E2E passes with explicit flags.
- Deployed Supabase `placement-v3-session` start/respond/status works for at least one staff test account.
- Writing and Mercy conversation live calls produce sanitized evidence.
- Rollback owner and kill-switch command are documented.

Unacceptable blockers:

- Missing auth/test credentials.
- Deployed session edge function cannot start/respond/status.
- Any flag accidentally enabled for public users.
- No rollback owner.

Rollback trigger:

- Any staff user is routed into Placement V3 unintentionally.
- Session cannot be completed or abandoned.
- Grader errors block core flow instead of failing softly.

Required monitoring:

- Session start/respond/complete/error events.
- Grader call success/failure.
- Edge-function errors.
- Manual staff feedback log.

## Internal-Only Launch

Scope: broader internal team, still not public users. Used to collect early runtime evidence.

Required gates:

- All staff-only gates.
- Live benchmark baseline has at least 10 completed internal sessions.
- No hard-failing scenario in the internal benchmark subset.
- Native speaking capture tested on at least one iOS and one Android device if speaking is included.
- A29 modality limitation is either fixed or explicitly disabled/accepted for internal-only.
- Privacy handling for transcripts/audio is documented.

Unacceptable blockers:

- No p95 latency estimate from live internal sessions.
- No cost/session estimate.
- Native speaking included without real-device validation.
- Stub/fallback modality scoring presented as real placement accuracy.

Rollback trigger:

- Full-session p95 is obviously unusable for internal testers.
- Cost/session exceeds provisional budget and no cap exists.
- Any transcript/audio privacy concern appears.
- CEFR output is clearly unstable across repeated internal runs.

Required monitoring:

- Session latency by step and modality.
- Token usage and provider.
- Failover/retry events.
- Native audio capture/upload/scoring status.
- Manual scoring-quality notes.

## Invite-Only Launch

Scope: small named external cohort with explicit consent/expectations. Not public discovery.

Required gates:

- All internal-only gates.
- 25+ live benchmark sessions completed.
- 3 benchmark optimization cycles documented or honest-failure blocker accepted.
- Live drift replay completed with thresholds reviewed.
- Native audio validated on real devices or speaking disabled/limited.
- Observability dashboard/events can answer latency, cost, failure, and failover questions.
- Support/rollback plan assigned.

Unacceptable blockers:

- No live p95/cost/failover metrics.
- No live drift replay metrics.
- Provider failover behavior unknown.
- Native audio not validated while speaking is exposed.
- No support owner.

Rollback trigger:

- p95 full-session latency exceeds launch threshold without clear mitigation.
- Average or p95 cost/session exceeds budget.
- Failover recovery is unreliable.
- Drift replay shows unacceptable CEFR movement.
- Invite users hit auth/session loops or cannot complete.

Required monitoring:

- p50/p95 session latency.
- Cost/session by provider path.
- Token counts by modality.
- Failover/retry rates.
- Completion/abandon/error rates.
- Qualitative feedback from invite users.

## Soft Launch

Scope: limited production exposure to a controlled percentage/cohort. No broad announcement.

Required gates:

- All invite-only gates.
- Launch concurrency limit defined.
- Error-budget and alert thresholds live.
- Rollback runbook tested.
- Data cleanup/retention policy documented.
- A29 modality plan finalized.

Unacceptable blockers:

- Any critical release gate remains blocked.
- Observability cannot distinguish grader, auth, Supabase, and frontend failures.
- No tested rollback.
- Cost envelope still unknown.

Rollback trigger:

- Alert threshold breach for latency, cost, failover, completion, or grading drift.
- Any privacy incident or unexpected audio/transcript persistence.
- Support load exceeds owner capacity.
- Public users reach fallback-only scoring without disclosure.

Required monitoring:

- Real-time dashboard for sessions, latency, errors, cost, failover, and completion.
- Daily drift sample review.
- Native audio error dashboard.
- Manual support escalation log.

## Public Launch

Scope: broad user availability and public claims.

Required gates:

- All soft-launch gates.
- Sustained evidence across multiple days/cohorts.
- Public support and incident process ready.
- Production readiness report updated from live evidence, not scaffold claims.
- Marketing/product claims limited to measured facts.

Unacceptable blockers:

- No sustained live benchmark evidence.
- No grading calibration evidence.
- Native speaking reliability unknown while advertised.
- Provider failover unproven.
- Any unresolved critical risk in `placement-v3-known-risks.md`.

Rollback trigger:

- Any critical metric regresses after public exposure.
- User-visible placement accuracy issues create trust risk.
- Cost spikes beyond budget.
- Native audio or privacy issue emerges.

Required monitoring:

- Production observability dashboard.
- Alerting with named DRI.
- Daily cost/latency/drift review.
- Incident and rollback log.
- User support feedback tagged to Placement V3.
