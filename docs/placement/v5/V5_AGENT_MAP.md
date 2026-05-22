# V5 Agent Map

**Author:** C1 — V5 Planning Captain
**Date:** 2026-05-21

---

## C1 — V5 Architect / Discovery Lead

- **Owns:** V5 plan, agent assignments, dependency graph, merge order
- **Produces:** V5_PLAN.md, V5_SCOPE.md, V5_AGENT_MAP.md, V5_RISKS.md, V5_ROADMAP.md
- **Reviews:** all C2–C7 outputs for scope alignment
- **Does not implement:** delegates all implementation to C2–C7

## C2 — V5 Contract Inheritance Map

- **Owns:** verify all V4 exports V5 will consume, produce import map
- **Produces:** V5_IMPORTS.md — exact import paths and types per V4 module
- **Checks:** no V5 file imports from V4 submodules (barrel only),
  no V5 file duplicates V4 type definitions
- **Depends on:** C1 plan approved

## C3 — V5 Supabase Persistence Layer

- **Owns:** Supabase schema for V4 runtime state
- **Produces:**
  - Migration: v4_learner_memory (user_id, snapshot_json, events_json, updated_at)
  - Migration: v4_telemetry_events (user_id, event_json, ingested_at)
  - Migration: v4_orchestration_snapshots (user_id, snapshot_json, hash, updated_at)
  - Migration: v4_provider_decisions (user_id, decision_json, created_at)
  - Migration: v4_curriculum_plans (user_id, plan_json, generated_at)
  - RLS policies: user-scoped read/write, admin read-all
  - src/lib/placement/v5/persistence.ts — typed helpers for each table
- **Tests:** RLS policy tests, CRUD helpers, serialization round-trip
- **Depends on:** C2 import map (to know exact types for serialization)

## C4 — V5 Activation / Lifecycle Wiring

- **Owns:** wire V4 orchestration into room/lesson lifecycle
- **Produces:**
  - src/hooks/useAdaptiveOrchestration.ts — init orchestrator, emit events
  - src/lib/placement/v5/lifecycle.ts — event source adapters
  - Wiring into RoomRenderer for lesson start/complete/skip/retry events
  - Speaking events source from MercySpeakTab (adult mode: speechSynthesis events)
- **Tests:** hook renders without crash, events flow to orchestrator,
  feature flag OFF → no-op
- **Depends on:** C3 (persistence), C6 (feature flag)

## C5 — V5 Admin Observability

- **Owns:** admin dashboard for V4 analytics
- **Produces:**
  - src/pages/admin/V4Analytics.tsx — tabbed dashboard
  - src/components/admin/V4EffectivenessHeatmap.tsx
  - src/components/admin/V4RetentionCohorts.tsx
  - src/components/admin/V4ProviderHealthPanel.tsx
  - src/components/admin/V4CohortDriftView.tsx
- **Gating:** get_admin_level >= 9
- **Tests:** renders with empty data, renders with mock data,
  admin gate enforced, no data leak between users
- **Depends on:** C3 (reads persisted telemetry)

## C6 — V5 Feature Flag / Migration

- **Owns:** placement_v4_enabled flag, gradual rollout, rollback
- **Produces:**
  - Feature flag definition (profiles.placement_v4_enabled or app_config)
  - Admin toggle UI for per-user enable/disable
  - Migration guide: how to move users from V3 to V4
  - Rollback procedure: disable flag → V3 resumes immediately
- **Tests:** flag OFF → V4 code never executes, flag ON → V4 activates,
  per-user toggle works, rollback is instant
- **Depends on:** nothing (can land first)

## C7 — V5 Mobile / Offline Learner Memory

- **Owns:** offline learner memory persistence and sync
- **Produces:**
  - Local storage adapter for learner_memory (IndexedDB or Capacitor Preferences)
  - Offline event queue with drain-on-reconnect
  - Sync function using V4 crossDeviceMerge + vector clock
  - Conflict resolution logic
- **Tests:** offline writes queue, reconnect drains, merge converges,
  no data loss on concurrent offline edits
- **Depends on:** C3 (persistence schema for sync target format)

---

## Agent Communication Protocol

1. Each C-agent works in its own branch: `c{n}/v5-{feature}`
2. C1 reviews all PRs for scope alignment before B1 merge review
3. Cross-agent dependencies are enforced by merge order, not by rebasing
4. If C{n} finds a V4 contract gap, B2 is woken (not C{n} fixing V4)
5. All PRs target main; no stacked branches unless explicit dependency
