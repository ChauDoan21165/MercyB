# V5 Incident Routing Map

**Author:** C8 — V5 Ops / Release Intelligence
**Date:** 2026-05-22
**Baseline:** origin/main 3be4e6ef1
**Status:** DRAFT — awaits C1–C7 completion

---

## Routing Principle

When an incident occurs, route to the agent that OWNS the failing
surface. Do not route to the agent that first notices the incident.
Ownership is defined by file boundary, not symptom location.

---

## Incident Routing Table

### C1 — Planning Captain (Scope / Roadmap / Release Decisions)

**Owns:** V5 plan, scope decisions, PR sequencing, release approval

**Route to C1 when:**
- V5 scope needs to change (add/remove feature)
- PR dependency graph is broken (PR B needs PR A which isn't merged)
- Release decision needs escalation (operator blocks, C7 blocks)
- V5 roadmap needs adjustment based on production findings
- Cross-agent coordination is needed for complex incident
- Decision needed on whether to skip a rollout stage
- V5 completion report needs sign-off

**Files owned:** docs/placement/v5/V5_PLAN.md, V5_SCOPE.md

---

### C2 — Contract / Export / Type Ownership

**Owns:** V4→V5 contract inheritance, type exports, barrel files

**Route to C2 when:**
- V5 code imports a type that doesn't exist or has wrong shape
- V4 barrel exports don't include a type V5 needs
- Type mismatch between V4 contract and V5 consumer
- V5 needs a new export from V4 (requires V4 barrel update)
- Import path resolution fails (wrong barrel, circular dependency)
- Contract inheritance map (V5_IMPORTS.md) is outdated

**Files owned:** V5_IMPORTS.md, barrel re-exports in V4/V5 index.ts

---

### C3 — Persistence / Supabase

**Owns:** Supabase schema, RLS policies, typed client helpers,
        data read/write paths for V5

**Route to C3 when:**
- Supabase write errors on v4_* tables
- RLS policy blocks legitimate user access
- Query performance degradation on v4_* tables
- Migration fails to apply or needs rollback
- Data integrity issue (missing rows, duplicate keys)
- Supabase client throws in V5 persistence paths
- Schema needs a new column or index

**Files owned:** src/lib/placement/v5/persistence.ts,
                supabase/migrations/*v5*.sql

---

### C4 — Lifecycle Wiring / Event Flow

**Owns:** V4 orchestration activation, lesson event source,
        room/lesson wiring, speaking event integration

**Route to C4 when:**
- Orchestrator fails to receive lesson events
- Event flow breaks (start → complete → telemetry chain broken)
- Speaking events not reaching orchestrator
- RoomRenderer wiring produces errors
- Lifecycle hook throws unhandled exception
- Placement flow is stuck (learner can't progress)
- Intervention engine not triggered at expected points

**Files owned:** src/lib/placement/v5/lifecycle.ts,
                src/hooks/useAdaptiveOrchestration.ts

---

### C5 — Admin Dashboard / Provider Health

**Owns:** Admin analytics dashboard, provider health panel,
        cohort drift view, admin-gated access

**Route to C5 when:**
- Admin dashboard fails to load or shows errors
- Provider health panel shows incorrect status
- Cohort drift view produces wrong numbers
- Admin access control broken (wrong level required)
- Dashboard query times out on large datasets
- Provider health snapshot is stale or incorrect
- Admin dashboard exposes PII to unauthorized viewers

**Files owned:** src/pages/admin/V4Analytics.tsx,
                src/components/admin/V4ProviderHealthPanel.tsx,
                src/components/admin/V4CohortDriftView.tsx

---

### C6 — Feature Flag / Quality Gates

**Owns:** placement_v4_enabled flag, rollout controls, CI quality gates

**Route to C6 when:**
- Feature flag fails to toggle (enable/disable doesn't work)
- Flag state is inconsistent (user sees V4 when flag is off)
- Percentage rollout produces wrong user count
- Flag persistence fails (value not saved/read)
- CI quality gate blocks merge for V5-related reason
- Test coverage gap discovered in V5 code paths
- Feature flag admin controls malfunction

**Files owned:** Feature flag configuration, admin flag controls,
                CI quality gate configuration

---

### C7 — Boundary / Security / Release Gate

**Owns:** V5 boundary audit, security review, privacy check,
        release gate, offline sync integrity

**Route to C7 when:**
- V5 code imports from forbidden paths (Supabase admin, Azure, etc.)
- PII detected in telemetry or learner memory payloads
- V5 code introduces network/I/O in deterministic paths
- V4 frozen files are modified by V5 PR
- Branch naming or file boundary violation
- Offline sync produces data corruption
- Release gate check fails
- Privacy redaction is incomplete or broken

**Files owned:** V5_RELEASE_GATE.md, offline sync helpers,
                boundary audit artifacts

---

### C8 — Deployment / Monitoring / Rollback / Operator Communications

**Owns:** V5 deployment, post-release monitoring, rollback execution,
        operator communications, release notes

**Route to C8 when:**
- Deployment fails or needs re-execution
- Post-deployment verification fails
- Monitoring alert fires (any category)
- Rollback needs to be executed
- Operator needs status update or decision support
- Release notes need updating
- Rollout stage transition needs approval
- Incident needs stakeholder communication
- Monitoring dashboard or alert configuration needs updates

**Files owned:** docs/placement/v5/V5_RELEASE_NOTES.md,
                V5_OPERATOR_HANDOFF.md, V5_ROLLOUT_PLAN.md,
                V5_MONITORING_PLAN.md, V5_ROLLBACK_PLAN.md,
                V5_INCIDENT_ROUTING.md

---

## Incident Severity Classification

| Severity | Definition | Response Time | Escalation |
|----------|-----------|---------------|------------|
| CRITICAL | User-facing failure: placement broken for any user, PII leak, data corruption | Immediate | Operator + owning C-agent immediately |
| HIGH | Degraded function: placement rate drop, provider failing, orchestration errors | < 1 hour | Owning C-agent, operator informed |
| MEDIUM | Non-blocking anomaly: forecast drift, telemetry rejection rate, dashboard query slow | < 4 hours | Owning C-agent |
| LOW | Cosmetic or informational: dashboard display bug, monitoring alert noise | Next business day | Owning C-agent |

---

## Incident Response Flow

```
Incident detected (alert, user report, operator observation)
        │
        ▼
C8 triages: classify severity, identify owning C-agent
        │
        ├── CRITICAL → Notify operator + owning C-agent immediately
        │               Evaluate rollback triggers (V5_ROLLBACK_PLAN.md)
        │
        ├── HIGH     → Route to owning C-agent, operator informed
        │
        ├── MEDIUM   → Route to owning C-agent
        │
        └── LOW      → Log for next business day
        │
        ▼
Owning C-agent investigates and fixes
        │
        ▼
C8 verifies fix + updates operator
        │
        ▼
Incident closed with root cause documented
```

---

## Cross-Agent Incident Examples

| Incident | Primary Owner | Secondary Owners | Reason |
|----------|--------------|------------------|--------|
| V4 telemetry events not persisting | C3 (persistence) | C4 (event source), C7 (boundary) | Could be Supabase error, event wiring, or boundary block |
| Placement recommendation wrong | C4 (lifecycle) | C2 (contracts), C1 (scope) | Could be wiring, type mismatch, or scope gap |
| Admin dashboard shows PII | C5 (dashboard) | C7 (privacy), C3 (data source) | Could be render bug, privacy gap, or data leak |
| Feature flag toggles but V4 doesn't activate | C6 (flag) | C4 (lifecycle), C3 (persistence) | Could be flag bug, wiring gap, or persistence issue |
| Rollout percentage produces wrong count | C6 (flag) | C3 (persistence), C8 (monitoring) | Could be flag logic, query error, or monitoring miscalibration |
| Offline sync loses learner data | C7 (sync) | C3 (persistence), C4 (lifecycle) | Could be sync bug, persistence gap, or event wiring |

---

## Escalation Path

If owning C-agent cannot resolve within response time:

1. Escalate to C1 (Planning Captain) for cross-agent coordination
2. If C1 unavailable, escalate to Operator (Chau) for decision
3. If CRITICAL and unresolved after 1 hour, initiate rollback
   (V5_ROLLBACK_PLAN.md)

---

## Incident Log Template

```
Date:
Severity:
Incident ID:
Owning C-agent:
Description:
Root cause:
Fix:
Rollback required: YES / NO
Time to resolve:
Lessons learned:
```
