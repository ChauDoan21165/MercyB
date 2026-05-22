# V5 Scope

**Author:** C1 — V5 Planning Captain
**Date:** 2026-05-21
**Baseline:** V4 complete at origin/main 3be4e6ef1

---

## In Scope

### 1. Supabase Persistence Layer (C3)
- Schema: v4_learner_memory, v4_telemetry_events, v4_orchestration_snapshots,
  v4_provider_decisions, v4_curriculum_plans
- RLS policies: user-scoped read/write, admin read-all
- Typed client helpers: src/lib/placement/v5/persistence.ts
- No changes to existing V3 placement tables

### 2. Activation / Lifecycle Wiring (C4)
- src/hooks/useAdaptiveOrchestration.ts — bootstraps orchestrator per user session
- src/lib/placement/v5/lifecycle.ts — lesson event source (start, complete, skip, retry)
- Wiring into RoomRenderer for event ingestion
- Speaking events from MercySpeakTab
- Feature-gated: placement_v4_enabled must be true

### 3. Admin Observability Dashboard (C5)
- src/pages/admin/V4Analytics.tsx — tabs: effectiveness, retention, cohorts, providers
- src/components/admin/V4ProviderHealthPanel.tsx — provider status + quarantine state
- src/components/admin/V4CohortDriftView.tsx — cohort comparison table
- Admin-gated: get_admin_level >= 9
- Reads from persisted V4 telemetry (C3)

### 4. Feature Flag System (C6)
- Flag: placement_v4_enabled (boolean, default: false)
- Per-user toggle via admin panel
- Gradual rollout: percentage-based or user-list
- Instant rollback: disable flag → V3 resumes all users
- Stored in Supabase app_config or profiles.placement_v4_enabled

### 5. Mobile / Offline Learner Memory (C7)
- Capacitor plugin or local storage adapter for learner_memory
- Offline event queue that drains on reconnect
- Sync-on-reconnect using V4 crossDeviceMerge + vector clock
- Conflict resolution: latest event wins, active-on-tie for recovery state

---

## Out of Scope

### V4 Module Changes
V4 source files (src/lib/placement/v4/) are frozen. V5 never modifies:
- telemetry/* — analytical functions
- adaptiveTelemetryTypes.ts — adapter contracts
- learnerMemory.ts, curriculumSequencer.ts, progressionSimulator.ts,
  providerRegistry.ts — core modules

### V3 Replacement
V3 placement (src/lib/placement/v3/) continues serving all users
until operator explicitly begins V3→V4 migration. That migration is
a future phase, not V5.

### New Analytical Capabilities
No new effectiveness metrics, no new intervention kinds, no new
forecast models. V4 owns the analytical surface.

### UI Redesign
The room/lesson UI, placement test UI, and mercy guide UI are not
redesigned in V5. V5 adds admin panels and wires existing components.

### Vendor Changes
No new Supabase projects, no Azure changes, no provider SDK
integrations. V5 uses existing Supabase project and existing
provider registry.

---

## Dependency Graph

```
C3 (persistence)
├── C4 (lifecycle wiring) — needs C3 for state persistence
├── C5 (admin dashboard)  — needs C3 for data reads
├── C6 (feature flag)     — independent, can land first
└── C7 (offline sync)     — needs C3 for local persistence

Merge order: C6 → C3 → C4 + C5 + C7 (parallel after C3)
```

## File Boundary

All V5 implementation files live in:
- src/lib/placement/v5/ — persistence, lifecycle, sync helpers
- src/hooks/ — useAdaptiveOrchestration
- src/pages/admin/ — V4Analytics dashboard
- src/components/admin/ — V4 admin panel components
- supabase/migrations/ — V5 schema migrations

No V5 code in:
- src/lib/placement/v4/ (frozen)
- src/lib/placement/v3/ (legacy, untouched)
- src/components/room/ (wire from hooks, don't mutate)
