# V5 Rollout Plan

**Author:** C8 — V5 Ops / Release Intelligence
**Date:** 2026-05-22
**Baseline:** origin/main 3be4e6ef1
**Status:** DRAFT — awaits C1–C7 completion

---

## Recommended Rollout Strategy

V5 deploys as a **hidden feature flag** with **gradual percentage-based
rollout**. This is the safest path for a system that changes learner
placement behavior.

### Stage Sequence

```
Stage 0: Deploy with flag OFF
    │   All users on V3. V5 code deployed but inactive.
    │   Zero learner impact.
    │
    ▼
Stage 1: Internal preview (operator + admins only)
    │   Enable flag for 1–3 internal accounts.
    │   Verify telemetry ingestion, admin dashboard, event flow.
    │   Duration: 1–2 days or until no issues.
    │
    ▼
Stage 2: Limited cohort (5–10 real users)
    │   Enable flag for 5–10 opted-in users (e.g., beta testers).
    │   Monitor placement completion rate, error rate, provider health.
    │   Duration: 2–3 days or until confidence established.
    │
    ▼
Stage 3: Percentage rollout (5% → 25% → 50% → 100%)
    │   Gradual percentage increases with monitoring gate at each step.
    │   Each step: wait 24–48h, verify metrics, then proceed.
    │   Duration: 1–2 weeks total.
    │
    ▼
Stage 4: Full release
    │   Flag enabled for 100% of users.
    │   V3 placement remains available as fallback.
    │   V5 is live.
```

### Stage Criteria

| Stage | Entry Criteria | Exit Criteria | Max Duration |
|-------|---------------|---------------|--------------|
| Stage 0 (deploy) | All V5 PRs merged, CI green, migrations applied | Deployment verified, flag confirmed OFF | 1 day |
| Stage 1 (internal) | Stage 0 complete | 3 internal users active, 0 errors, telemetry flowing | 2 days |
| Stage 2 (cohort) | Stage 1 stable | 5–10 users active, placement completion rate >= V3 baseline, 0 regressions | 3 days |
| Stage 3 (5%) | Stage 2 stable | 24h error-free, placement rate >= baseline, provider health all green | 48h per step |
| Stage 3 (25%) | 5% step passed | Same criteria | 48h |
| Stage 3 (50%) | 25% step passed | Same criteria | 48h |
| Stage 3 (100%) | 50% step passed | Same criteria | 48h |
| Stage 4 (full) | 100% step passed, 48h stable | V5 is the default placement system | Indefinite |

---

## Feature Flag Mechanics

### Flag Definition

```
Flag name:    placement_v4_enabled
Type:         boolean
Default:      false
Scope:        per-user (profiles.placement_v4_enabled)
Rollout:      percentage-based with admin overrides
Persistence:  Supabase profiles table
Cache:        session-scoped (checked once at session start)
```

### Flag Check Pattern

```
On app load / session start:
  1. Read profiles.placement_v4_enabled
  2. If true → bootstrap V4 orchestrator + wire event listeners
  3. If false → use V3 placement (current behavior)
  4. Mid-session flag changes take effect on next session start
```

### Admin Controls

Located in admin dashboard (admin level >= 9):
- Enable/disable per-user (search by email or user ID)
- Set percentage (0–100) for gradual rollout
- View currently enabled user count
- View rollout history (who enabled what, when)

---

## Rollout Monitoring Gates

At each stage transition, verify:

- [ ] `placement_v4_enabled` user count matches expected rollout percentage
- [ ] V4 telemetry events are being ingested for enabled users
- [ ] V3 placement completion rate has not regressed
- [ ] Provider registry health: all mock providers green
- [ ] No Sentry errors originating from V5 code paths
- [ ] Admin dashboard loads and shows data for active users
- [ ] No PII in telemetry (verify random sample of v4_telemetry_events)
- [ ] CI green on main

If any gate fails, pause rollout and investigate before proceeding.

---

## Parallel Rollout vs. Big Bang

**Decision: Gradual Rollout (NOT Big Bang)**

Rationale:
- V5 changes learner placement behavior — high-impact surface
- Feature flag provides instant rollback without redeployment
- Percentage-based rollout limits blast radius of any issue
- V3 remains fully functional as fallback throughout
- Admin dashboard provides real-time observability during rollout

Big Bang (enable for all users at once) is NOT recommended because:
- No rollback safety net (must redeploy to fix)
- All users affected simultaneously if there's an issue
- Harder to isolate cause of any anomaly
- No gradual confidence building

---

## Rollout Schedule (Proposed)

| Date | Stage | Action |
|------|-------|--------|
| T+0 | Stage 0 | Deploy V5 code, migrations, flag OFF |
| T+1 | Stage 1 | Enable for operator + 2 admin accounts |
| T+2 | Stage 1 review | Verify telemetry, dashboard, event flow |
| T+3 | Stage 2 | Enable for 5 beta users |
| T+5 | Stage 2 review | Verify placement rates, error rates |
| T+6 | Stage 3 (5%) | Enable for 5% of users |
| T+8 | Stage 3 review | Verify metrics, proceed to 25% |
| T+9 | Stage 3 (25%) | Enable for 25% of users |
| T+11 | Stage 3 review | Verify metrics, proceed to 50% |
| T+12 | Stage 3 (50%) | Enable for 50% of users |
| T+14 | Stage 3 review | Verify metrics, proceed to 100% |
| T+15 | Stage 3 (100%) | Enable for all users |
| T+17 | Stage 4 | V5 is live, V3 remains fallback |

Schedule can be accelerated if stages pass quickly, or extended if
issues are found.

---

## Rollback Triggers During Rollout

At any stage, roll back (disable flag globally) if:

- Placement completion rate drops > 5% from V3 baseline
- Provider registry shows any provider in "failing" status
- Orchestration error rate exceeds 1% of events
- Any PII detected in telemetry events
- Sentry error spike (> 2x baseline) from V5 code paths
- Feature flag toggle fails (can't disable)
- Admin dashboard shows data corruption
- Operator decides risk is unacceptable

Rollback procedure: see V5_ROLLBACK_PLAN.md.
