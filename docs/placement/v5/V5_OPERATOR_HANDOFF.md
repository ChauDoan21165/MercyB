# V5 Operator Handoff

**Author:** C8 — V5 Ops / Release Intelligence
**Date:** 2026-05-22
**Baseline:** origin/main 3be4e6ef1
**Status:** DRAFT — awaits C1–C7 completion

---

## 1. Operator Release Model

### Decision Flow

```
C1–C7 complete their phases
        │
        ▼
C7 runs release gate (V5_RELEASE_GATE.md)
        │
        ├── FAIL → block deployment, return blockers to owning C-agent
        │
        ▼
      PASS
        │
        ▼
C8 verifies deployment evidence checklist (this document)
        │
        ├── MISSING EVIDENCE → block deployment, request evidence
        │
        ▼
   ALL EVIDENCE PRESENT
        │
        ▼
OPERATOR REVIEW
        │
        ├── REJECT → document reason, return to C1 for scope fix
        │
        ▼
      APPROVE
        │
        ▼
   DEPLOY (C8 executes deployment plan)
        │
        ▼
   POST-DEPLOY MONITORING (C8, 48h initial window)
        │
        ├── ANOMALY → follow V5_ROLLBACK_PLAN.md
        │
        ▼
   STABLE → V5 is live
```

### Required Approvals

| Role | Approval | Evidence |
|------|----------|----------|
| C1 (Planning Captain) | V5 scope complete | V5_PLAN.md signed off |
| C2 (Contracts) | Inheritance map complete | V5_IMPORTS.md signed off |
| C3 (Persistence) | Schema applied, RLS verified | Migration applied + RLS test pass |
| C4 (Lifecycle) | Wiring tested, event flow verified | E2E smoke test pass |
| C5 (Admin Dashboard) | Dashboard accessible, no PII leaks | Admin access verified |
| C6 (Feature Flag) | Flag functional, toggle tested | Flag toggle test pass |
| C7 (Release Gate) | Boundary/security/privacy check pass | V5_RELEASE_GATE.md PASS |
| C8 (Ops) | Deployment evidence complete | This document signed off |
| Operator | Final deploy approval | Explicit approval recorded |

### Required Evidence from C1–C7

| Agent | Evidence Artifact |
|-------|------------------|
| C1 | V5_PLAN.md (signed), V5 completion report |
| C2 | V5_IMPORTS.md (contract inheritance map) |
| C3 | Migration SQL applied + RLS policy verification log |
| C4 | E2E smoke test log (lesson start → complete → telemetry → snapshot) |
| C5 | Admin dashboard accessibility + PII-free screenshot |
| C6 | Feature flag test: enable → verify V4 activates, disable → verify V3 resumes |
| C7 | V5_RELEASE_GATE.md with all gates PASS |

---

## 2. Operator Commands

### Pre-Deployment

```bash
# Verify target commit
git fetch origin --prune
git log -1 origin/main --oneline

# Confirm CI status
gh pr checks <V5_PR_number>

# Confirm all V5 PRs merged
gh pr list --state merged --base main --search "V5 OR v5" --limit 20

# Confirm V4 stack intact
git diff --name-only origin/main~4..origin/main | grep "src/lib/placement/v4"
```

### Deployment

```bash
# V5 deploys via standard Vercel + Supabase pipeline
# 1. Supabase migrations are applied via CI or manual SQL Editor
# 2. Vercel auto-deploys main branch
# 3. No manual deployment steps required beyond migration application

# Confirm deployment
curl -s https://mercyblade.com/api/health | jq .version
```

### Post-Deployment Verification

```bash
# 1. Confirm feature flag is OFF
# Check Supabase: SELECT count(*) FROM profiles WHERE placement_v4_enabled = true;
# Expected: 0

# 2. Enable for test user
# UPDATE profiles SET placement_v4_enabled = true WHERE id = '<test_user_id>';

# 3. Verify V4 activates for test user
# Check: test user completes lesson → telemetry event appears in v4_telemetry_events

# 4. Verify V3 continues for non-opted-in user
# Check: non-opted-in user completes lesson → V3 placement functions normally

# 5. Disable for test user
# UPDATE profiles SET placement_v4_enabled = false WHERE id = '<test_user_id>';
```

### Rollback

```bash
# Instant rollback: disable feature flag globally
# See V5_ROLLBACK_PLAN.md for full procedure

# Emergency rollback (Supabase SQL Editor):
UPDATE profiles SET placement_v4_enabled = false WHERE placement_v4_enabled = true;
```

---

## 3. Environment/Config Assumptions

| Assumption | Expected Value | Verified By |
|------------|---------------|-------------|
| Supabase project | buemdfxyhxunzpgdoqin.supabase.co | C3 |
| Vercel project | mercyblade | C8 |
| Node.js version | >= 20.x (CI) | CI Build step |
| Supabase anon key | Standard public key (browser-safe) | C3 |
| Feature flag default | `false` in profiles.placement_v4_enabled | C6 |
| V4 mock providers | PLACEMENT_V4_MOCK_PROVIDERS in providerRegistry | C7 |
| Admin access level | get_admin_level >= 9 | C5 |
| RLS enabled | All v4_* tables user-scoped | C3 |
| Audio source | Supabase room-audio bucket (public) | C4 |
| Offline storage | Capacitor Preferences or local adapter | C7 |

---

## 4. Monitoring Handoff

After deployment, the operator owns monitoring for the first 48 hours.
C8 provides the initial monitoring dashboard and alert configuration
(see V5_MONITORING_PLAN.md).

Key metrics to watch in the first 48h:
- `placement_v4_enabled` user count (should grow only by deliberate rollout)
- `v4_telemetry_events` row count and growth rate
- V3 placement completion rate (must not regress)
- Provider health status (all mock providers should be healthy)
- Sentry error rate (no spike from V5 code paths)
- CI status on main (must remain green)

---

## 5. Owner Rotation

| Window | Owner | Responsibility |
|--------|-------|----------------|
| First 0–2h post-deploy | C8 | Active monitoring, immediate rollback if anomaly |
| 2–24h post-deploy | Operator (Chau) | Periodic checks, rollback decision authority |
| 24–48h post-deploy | C1 (with operator oversight) | Stability confirmation, rollout progression |
| 48h+ post-deploy | Operator | Routine monitoring, V5 is live |

---

## 6. Communication Plan

| Event | Audience | Channel | Timing |
|-------|----------|---------|--------|
| V5 deployment start | Operator (Chau) | Direct message | At deployment |
| V5 deployment complete | Operator | Direct message | At completion |
| Feature flag enabled for first user | Operator | Direct message | At first activation |
| 24h stability report | Operator | Direct message | 24h post-deploy |
| 48h stability confirmation | C1 + Operator | Direct message | 48h post-deploy |
| Rollback (if needed) | Operator + all C-agents | Direct message | Immediately |
| V5 live announcement | All stakeholders | Email/chat | After 48h stable |

---

## Handoff Dependencies

C8 cannot complete this handoff until:

- [ ] C1 final V5 scope and PR sequence delivered
- [ ] C2 contract inheritance map (V5_IMPORTS.md) delivered
- [ ] C3 Supabase schema applied and verified
- [ ] C4 lifecycle wiring tested (E2E smoke)
- [ ] C5 admin dashboard accessible and PII-free
- [ ] C6 feature flag functional and tested
- [ ] C7 release gate passed (V5_RELEASE_GATE.md)
- [ ] CI all-green on the target release commit
- [ ] Operator approves deployment

Once all dependencies are met, C8 executes deployment and begins
the 48-hour monitoring window.
