# Placement V3 Rollback Matrix

Rollback planning matrix. These are operational triggers, not current incidents.

| Scenario | Detection method | Rollback action | Severity | User impact | Communication requirement |
|---|---|---|---|---|---|
| provider outage | Provider errors, timeout spikes, failover logs, benchmark failover scenario. | Disable Placement V3 flags; route users back to existing flows; pause benchmark/live sessions. | critical | Users cannot complete grading or receive delayed results. | Internal incident note; external notice only if users were exposed. |
| grading corruption | Drift replay failure, impossible CEFR outputs, repeated user/support reports, human review mismatch. | Disable Placement V3 flags; preserve affected session IDs; stop using generated profiles for recommendations. | critical | Incorrect placement and lesson recommendations. | Internal incident plus user follow-up if external users received bad profiles. |
| drift spike | Drift replay exceeds approved CEFR movement threshold. | Stop launch progression; keep flags off or roll back to prior grader config. | critical | Users may receive unstable CEFR results. | Release-owner summary with affected bands/modalities. |
| replay corruption | Replay corpus contains malformed/private/unredacted data or replay outputs are incomplete. | Stop replay jobs; quarantine artifacts; revoke access if needed. | high | Internal evidence invalid; possible privacy exposure. | Privacy/ops escalation; external notice only if policy requires. |
| privacy incident | Unredacted transcript/audio in logs, wrong retention, unauthorized access, support report. | Disable flags; stop capture/replay; preserve audit logs; start privacy incident process. | critical | Trust and compliance risk. | Immediate Chau/privacy owner escalation; user communication per incident policy. |
| runaway cost | Token/cost dashboard exceeds budget threshold or benchmark cost/session exceeds target. | Disable flags; lower concurrency to zero; stop adaptive generation/benchmark loops. | critical | Financial exposure; possible degraded service. | Internal cost incident note; no user notice unless service is interrupted. |
| native audio failure | Device test failure, capture/upload/Azure error rate, mobile support reports. | Disable speaking path or keep Placement V3 off; force typed fallback only if explicitly approved. | high | Speaking placement unavailable or unreliable. | Internal mobile incident; user-facing notice if exposed. |
| recommendation corruption | Profiles map to wrong lessons, empty recommendations, unrelated content. | Disable use of Placement V3 profile recommendations; preserve profile/session data for review. | high | Learners may be routed to wrong learning path. | Internal product note; user correction if external users affected. |
| missing forensic events | Expected session/grader/provider/cost events absent from logs/dashboard. | Halt progression beyond staff-only; keep flags off for external cohorts. | high | Operators cannot diagnose failures or prove readiness. | Internal release blocker update. |
| benchmark regression | p95 latency/cost/failover worsens against prior baseline. | Pause launch progression; roll back last optimization or config change; rerun benchmark. | high | Slow or expensive sessions if exposed. | Benchmark owner summary with before/after metrics. |

## Minimum Rollback Controls Before Any User Enablement

- Confirm both `VITE_PLACEMENT_TEST_ENABLED` and `VITE_PLACEMENT_V3_UI_ENABLED` can be turned off quickly.
- Assign rollback owner.
- Define session/test-data cleanup process.
- Verify observability can identify affected sessions.
- Record rollback decision in `placement-v3-launch-criteria-history.md`.
