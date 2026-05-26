# V5 Rollback Plan

**Author:** C8 — V5 Ops / Release Intelligence
**Date:** 2026-05-22
**Baseline:** origin/main 3be4e6ef1
**Status:** DRAFT — awaits C1–C7 completion

---

## Rollback Philosophy

V5 rollback is designed to be **instant, safe, and complete**.
One action (disable the feature flag) immediately returns all
learners to V3 placement. No deployment, no data loss, no
downtime.

---

## Rollback Triggers

Initiate rollback if ANY of the following occurs:

### Production Error Spike
- V5-related Sentry errors exceed 2x baseline for > 5 minutes
- Any unhandled exception in V5 lifecycle or persistence paths
- Supabase RLS 403 errors on v4_* tables in production

### Placement Flow Failure
- Placement completion rate drops > 5% from V3 baseline
- Learners report being stuck in placement flow
- Orchestrator enters unrecoverable state (event loop, OOM)
- Recommendation generation fails for > 1% of sessions

### Provider Runtime Instability
- Any provider in "failing" health status in production
- Provider failover rate exceeds 5% in any 1-hour window
- Provider quarantine triggered in production
- Provider trust score drops below minimum for capability

### Telemetry Ingestion Regression
- Telemetry event rejection rate exceeds 5%
- Telemetry events fail to persist (Supabase write errors)
- Event queue overflow detected (dropped > 0 in production)

### Learner Memory Corruption Risk
- Snapshot content hash mismatch detected in production
- Learner memory replay produces different fingerprint from original
- Cross-device merge produces corruption reports
- Offline sync produces data loss (events missing after sync)

### Orchestration Decision Regression
- Intervention engine produces contradictory recommendations
- Forecast analysis detects systematic optimistic bias (> 50% of skills)
- Adaptive loop fails to produce valid LoopResult
- Cohort adaptive produces inconsistent cohort assignments

### Privacy / Boundary Violation
- PII detected in telemetry event payloads
- Admin dashboard exposes learner PII to unauthorized admins
- V5 code imports from forbidden paths (Supabase admin SDK in browser bundle)
- Feature flag leaks between users (user A's flag affects user B)

### Failed Deployment Verification
- Post-deployment smoke test fails
- Supabase migrations fail to apply or roll back
- Vercel deployment produces build with errors
- CI goes red on main after merge

---

## Rollback Procedure

### Step 1: Disable Feature Flag (IMMEDIATE)

Execute in Supabase SQL Editor:

```sql
-- Instant global rollback: disable V4 for all users
UPDATE profiles SET placement_v4_enabled = false WHERE placement_v4_enabled = true;

-- Verify
SELECT count(*) FROM profiles WHERE placement_v4_enabled = true;
-- Expected: 0
```

Effect: All users immediately return to V3 placement on their next
session start. Existing sessions continue until page refresh/app restart.

### Step 2: Verify V3 Restoration

- [ ] Spot-check: 3 random users complete a lesson — V3 placement works
- [ ] Admin dashboard: V4 analytics show zero new events
- [ ] Sentry: V5-related error rate returns to zero
- [ ] Provider health: mock providers remain healthy (V4 not consuming them)

### Step 3: Notify Stakeholders

```
Template:
"V5 placement has been rolled back. All users are now on V3 placement.
Root cause: [BRIEF DESCRIPTION].
Rollback time: [TIMESTAMP].
Next steps: [INVESTIGATION PLAN].
V4 data preserved for analysis. No learner data lost."
```

Notify: Operator (Chau), all C-agents, any affected admins.

### Step 4: Investigate Root Cause

- Review Sentry errors leading to rollback
- Check Supabase logs for v4_* table errors
- Review provider health history
- Check telemetry event schema for rejected events
- Run V4 test suite to verify analytical functions intact
- Review CI logs for the deployed commit

### Step 5: Fix and Re-Deploy

- Fix identified in V5 code (NOT V4 — V4 is frozen)
- PR with fix, CI green, operator approval
- Merge to main, deploy
- Resume rollout from Stage 1 (internal preview)
- Do NOT skip stages — full rollout sequence from V5_ROLLOUT_PLAN.md

---

## Rollback Impact Assessment

### What Rollback Does NOT Affect
- V4 analytical code (src/lib/placement/v4/) — remains intact
- V3 placement — continues functioning normally
- V4 persisted data (learner memory, telemetry, snapshots) — preserved
- Admin dashboard — continues showing historical V4 data
- Supabase schema — v4_* tables remain, no migration rollback needed
- V4 test suite — all tests continue passing

### What Rollback DOES Affect
- Users who had V4 enabled return to V3 placement
- No new V4 telemetry events are ingested
- V4 orchestrator stops processing events
- V4 provider registry stops being queried
- Offline learner memory sync pauses for V4-enabled users

### Data Integrity
- V4 learner memory for enabled users is preserved in Supabase
- When V5 is re-enabled, learner memory is restored from last snapshot
- No placement progress is lost — V3 placement state is separate from V4
- Telemetry events during rollback period are NOT backfilled

---

## Rollback Testing

Before V5 reaches Stage 2 (limited cohort), the rollback procedure
must be tested in staging:

### Test Scenario 1: Global Rollback
1. Enable V4 for 3 test users in staging
2. Verify V4 activates (telemetry events appear)
3. Execute global rollback (UPDATE profiles SET placement_v4_enabled = false)
4. Verify all 3 users return to V3
5. Verify zero new V4 telemetry events
6. Verify admin dashboard shows historical data only

### Test Scenario 2: Partial Rollback
1. Enable V4 for 3 test users, leave 2 on V3
2. Disable V4 for 1 of the 3 V4 users
3. Verify that user returns to V3
4. Verify other 2 V4 users continue with V4
5. Verify V3 users unaffected throughout

### Test Scenario 3: Re-Enable After Rollback
1. Roll back globally (all users to V3)
2. Wait 1 hour
3. Re-enable V4 for 1 test user
4. Verify V4 activates correctly (fresh session start)
5. Verify learner memory is intact from before rollback
6. Verify telemetry events resume

---

## Emergency Contacts

| Role | Who | When to Contact |
|------|-----|-----------------|
| Rollback decision | Operator (Chau) | Any rollback trigger |
| Rollback execution | C8 | After operator approval |
| Root cause investigation | C4 (lifecycle) + C3 (persistence) | After rollback |
| V4 analytical integrity | B-series (parked, wake if needed) | Only if V4 modules suspected |
| Supabase issues | Operator (project owner) | If migrations or RLS broken |
| Communication | C8 | All stakeholder notifications |

---

## Rollback Decision Log

| Date | Trigger | Decision | Rollback Time | Re-Deploy Date | Root Cause |
|------|---------|----------|---------------|----------------|------------|
| (template) | (what triggered) | (rollback/continue) | (timestamp) | (when re-deployed) | (what was fixed) |
