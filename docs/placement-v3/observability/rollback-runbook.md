# Placement V3 Forensic Rollback And Kill-Switch Runbook

This runbook defines the required rollback path before forensic persistence can be enabled. Execute in staging first. Do not use this document as evidence that rollback has been validated until commands and logs are saved from the target environment.

## Immediate Decision Tree

| Symptom | Initial action | Escalation |
| --- | --- | --- |
| Secret, transcript, audio, or learner PII appears in forensic rows | Stop forensic inserts, restrict dashboard access, quarantine rows | P0 privacy incident |
| Forensic logging breaks Placement V3 core session flow | Disable forensic logging | P0 operational incident |
| Dashboard exposes data to non-admin | Disable dashboard route/access | P0 access incident |
| Correlation IDs missing across many sessions | Disable broad rollout, keep local/staging validation only | P1 observability incident |
| Replay corruption or missing timelines | Stop relying on replay for decisions | P1 forensic integrity incident |

## Disable Forensic Logging

Required evidence:
- Config change or deploy command.
- Before/after log showing forensic writes stopped.
- Placement V3 core session still completes or fails safely.

Procedure:
1. Set the forensic logging kill switch to disabled in the target environment. If the runtime does not yet have a dedicated flag, block production enablement until one exists.
2. Redeploy or restart the affected Edge Functions.
3. Trigger one non-provider local/staging session.
4. Confirm no new `placement_v3_forensic_events` rows are inserted for the test correlation ID.
5. Confirm Placement V3 still returns a user-safe result or a safe failure response.

Required kill-switch standard:
- The switch must stop forensic persistence without removing Placement V3 retries or fallbacks.
- The switch must not require a database migration during an incident.
- The switch state must be visible in logs or feature flag snapshots.

## Disable Replay Persistence

Procedure:
1. Disable writes to `placement_v3_failure_timelines`.
2. Keep read-only replay from exported event rows available for incident analysis.
3. Confirm timeline inserts stop for new test sessions.
4. Document whether raw forensic events remain enabled.

Pass criteria:
- No new timeline rows are created after the switch.
- Existing timelines remain readable unless privacy cleanup requires quarantine or deletion.

## Disable Dashboard Access

Procedure:
1. Remove route exposure or tighten admin authorization for `/admin/placement-forensics`.
2. Verify an admin account sees the expected maintenance/blocked state if access is intentionally disabled.
3. Verify a non-admin account cannot read forensic rows.
4. Save screenshots and access logs.

Pass criteria:
- Dashboard cannot expose forensic data to unauthorized accounts.
- Direct API/table access remains blocked by policy or service-role isolation.

## Revoke Provider Keys

Procedure:
1. Rotate or revoke the affected provider key in the provider console.
2. Remove or replace the key in Supabase/Vercel/Edge Function secrets.
3. Redeploy or restart affected functions.
4. Run `scripts/placement-v3/verify-forensics-env.ts` to confirm the old key is absent from the local shell used for validation.
5. Trigger a safe validation request only after the new key is installed and approved.

Pass criteria:
- Old key can no longer authenticate.
- Logs and forensic rows do not contain either old or new key material.

## Stop Forensic Inserts

Emergency options, in preferred order:
1. Runtime kill switch for forensic logger.
2. Edge Function redeploy with forensic persistence disabled.
3. Database policy change that rejects new forensic inserts from the application role while preserving admin cleanup access.
4. Last resort: table rename or permission revoke after Chau approval.

Do not drop forensic tables as a first response. Preserve evidence unless privacy exposure requires immediate quarantine or deletion.

## Clean Up Accidental Sensitive Data

Procedure:
1. Treat as P0 if secrets, full transcripts, raw audio, auth tokens, or unnecessary learner PII were persisted.
2. Restrict dashboard and database access to minimum required admins.
3. Export only the minimum metadata required for incident record: row IDs, timestamps, event types, correlation IDs, and contamination category.
4. Quarantine affected rows by access restriction or move to a restricted table if approved.
5. Delete or redact affected payload fields after approval from Chau and Supabase admin.
6. Rotate any exposed credentials.
7. Document exact rows affected, cleanup SQL, operator, timestamp, and verification query.

Verification SQL must prove:
- Affected payload fields no longer contain sensitive values.
- No duplicate rows preserve the sensitive data.
- Runtime logging no longer emits the sensitive fields.

## Incident Escalation Flow

| Severity | Notify | Time target | Required action |
| --- | --- | --- | --- |
| P0 | Chau, engineering owner, Supabase admin | Immediate | Disable affected path, preserve evidence, start incident report |
| P1 | Chau and engineering owner | Same day | Stop rollout, collect evidence, define fix before enablement |
| P2 | Engineering owner | Next working day | Track fix and validation evidence |
| P3 | Engineering owner | Before launch review | Documentation or operator workflow correction |

## Rollback Evidence Package

Every rollback drill or real rollback must save:
- Timestamped command log.
- Config or deploy diff.
- SQL evidence before and after rollback.
- Dashboard access screenshots if dashboard access changed.
- Replay output for affected session if replay remains safe.
- Incident report using `templates/incident-report-template.md`.
