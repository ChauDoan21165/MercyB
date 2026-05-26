# Placement V3 Forensic Incident Severity Matrix

Use this matrix for forensic logging, replay, dashboard, and data-retention incidents. Severity is based on learner impact, privacy exposure, and whether operators can still reconstruct failures safely.

| Example incident | Severity | User impact | Rollback requirement | Notification requirement |
| --- | --- | --- | --- | --- |
| Provider key, Supabase service-role key, bearer token, or signed URL appears in logs or forensic rows | P0 | Direct credential exposure; may allow unauthorized access or provider abuse | Immediately stop forensic inserts, restrict dashboard, rotate key, quarantine/delete affected rows | Notify Chau, engineering owner, Supabase admin immediately |
| Leaked transcript or raw learner response containing personal content | P0 | Learner privacy breach; may expose sensitive educational or personal data | Disable forensic persistence until redaction is fixed; quarantine/delete affected rows | Notify Chau immediately; determine external notification requirement after scope review |
| Leaked audio or raw audio URL | P0 | Learner privacy breach if audio contains learner voice or sensitive content | Disable affected capture path and revoke URLs/keys where possible | Notify Chau immediately; review retention and storage exposure |
| Missing redaction for provider error payloads | P0 if sensitive data present; P1 otherwise | Could expose prompts, learner responses, or internal provider metadata | Disable forensic persistence for failing path until sanitized | P0 immediate; P1 same day |
| Dashboard exposes forensic data to non-admin | P0 | Unauthorized access to operational or learner-adjacent data | Disable dashboard route/access immediately | Notify Chau, engineering owner, Supabase admin immediately |
| Broken correlation IDs across provider/retry/fallback events | P1 | Operators cannot reconstruct failures reliably; degraded production debugging | Stop rollout or disable production reliance on forensics | Notify Chau and engineering owner same day |
| Replay corruption changes event order or hides failures | P1 | Operators may draw wrong conclusions during incident response | Stop using replay output for decisions until fixed | Notify Chau and engineering owner same day |
| Provider mismatch between selected provider and logged provider | P1 | Incorrect operational diagnosis; provider failures may be misattributed | Block enablement until mismatch detection works | Notify engineering owner and Chau before launch decision |
| Missing forensic rows for required session events | P1 if frequent; P2 if isolated and explained | Failed sessions may lack enough evidence for recovery or debugging | Block broad rollout if above launch threshold | Notify engineering owner; include in launch gate review |
| Degraded-result invisibility | P1 | User may receive degraded result with no operator evidence | Block enablement until degraded markers are persisted and visible | Notify Chau and engineering owner |
| Retry events missing attempt numbers | P2 | Retry behavior is harder to audit but may still be reconstructable | Fix before production enablement | Notify engineering owner |
| Runtime alert not created for known anomaly | P2 | Operators may miss issues unless manually reviewing timelines | Fix before production enablement | Notify engineering owner |
| Dashboard count differs from SQL count for one correlation ID | P2 | Operator confusion; dashboard not trustworthy for that view | Block dashboard-based acceptance until fixed | Notify engineering owner |
| Evidence screenshot lacks timestamp or environment label | P3 | Evidence may be rejected during review | Re-capture evidence before launch review | Notify evidence owner |
| Template incomplete or missing owner field | P3 | Incident process slower but runtime safety unaffected | Fix before launch review | Notify engineering owner |

## Severity Definitions

P0:
- Privacy, secret, access-control, or core-session safety incident.
- Requires immediate rollback or disablement of affected forensic path.

P1:
- Forensic integrity incident that prevents reliable production debugging.
- Blocks launch or broad rollout until fixed or explicitly deferred by Chau.

P2:
- Measurable observability gap with workaround.
- Must be fixed before production enablement.

P3:
- Documentation, evidence quality, or operator workflow issue.
- Must be resolved before final acceptance review.
