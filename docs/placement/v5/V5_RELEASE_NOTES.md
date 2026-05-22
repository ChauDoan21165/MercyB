# V5 Release Notes

**Author:** C8 — V5 Ops / Release Intelligence
**Date:** 2026-05-22
**Baseline:** origin/main 3be4e6ef1 (V4 stack complete)
**Status:** DRAFT — awaits C1–C7 completion

---

## User-Facing Summary

MercyBlade placement is getting smarter. We're rolling out a new
adaptive placement system that learns from your progress and adjusts
your lesson path — without changing how you use the app.

What changes for learners:
- Your lesson recommendations may become more personalized over time
- Your progress is saved even when you're offline
- Nothing breaks — the current placement system continues working
- You won't notice the switch; it happens behind the scenes

What changes for admins:
- A new Analytics dashboard shows placement effectiveness, learner
  retention, and provider health
- Gradual rollout controls let you enable the new system for specific
  users or percentages
- Instant rollback if anything goes wrong

---

## Operator-Facing Summary

V5 is the production activation layer for the V4 adaptive placement
analytics stack. It does NOT introduce new analytical capabilities —
those landed in V4 (#968, #988, #989, #991). V5 adds:

1. **Supabase persistence** — learner memory, telemetry events,
   orchestration snapshots, provider decisions, curriculum plans
2. **Lifecycle wiring** — hooks that connect V4 orchestration to the
   room/lesson event stream
3. **Admin observability** — dashboard for effectiveness, retention,
   cohorts, and provider health
4. **Feature flag** — `placement_v4_enabled` (default: false) with
   per-user and percentage-based rollout
5. **Offline learner memory** — Capacitor plugin + cross-device merge
   for mobile learners

**Deployment is zero-risk by default.** The feature flag is OFF.
V3 placement continues serving all users. V4 analytics only activate
for explicitly opted-in users. Rollback is one flag toggle.

---

## Technical Changelog

### New Files (V5 boundary)

```
src/lib/placement/v5/persistence.ts       — Supabase persistence layer
src/lib/placement/v5/lifecycle.ts         — lesson event source + wiring
src/lib/placement/v5/sync.ts              — offline sync helpers
src/lib/placement/v5/types.ts             — V5-specific types
src/hooks/useAdaptiveOrchestration.ts     — React hook for orchestrator
src/hooks/useV4Analytics.ts              — React hook for admin dashboard
src/pages/admin/V4Analytics.tsx           — admin analytics dashboard
src/components/admin/V4ProviderHealthPanel.tsx  — provider status panel
src/components/admin/V4CohortDriftView.tsx      — cohort comparison view
supabase/migrations/<timestamp>_v5_schema.sql   — V5 persistence schema
```

### Modified Files

```
src/components/room/RoomRenderer.tsx      — event source wiring (hooks only)
src/components/mercy-guide/MercySpeakTab.tsx — speaking event wiring (hooks only)
```

### Frozen Files (NOT modified by V5)

```
src/lib/placement/v4/**                   — V4 analytical stack (frozen)
src/lib/placement/v3/**                   — V3 legacy placement (untouched)
```

### Supabase Changes

- New tables: `v4_learner_memory`, `v4_telemetry_events`,
  `v4_orchestration_snapshots`, `v4_provider_decisions`,
  `v4_curriculum_plans`
- New RLS policies: user-scoped read/write, admin read-all
- New column: `profiles.placement_v4_enabled` (boolean, default false)
- No changes to existing V3 placement tables

---

## Risk Notes

| Risk | Severity | Mitigation |
|------|----------|------------|
| Supabase write volume from telemetry events | Medium | Batch inserts, retention policy (7-day standard, 0-day restricted) |
| Orchestration event loop during high activity | Low | Capacity-bounded queues (4096 events), overflow drops without throw |
| Provider registry misconfiguration blocking placements | Medium | Mock providers in validation/staging; live providers require explicit approval |
| Offline sync conflict storms | Low | Vector-clock merge with latest-event-wins and drop-corrupt |
| Admin dashboard query performance on large datasets | Low | Pre-aggregated views, cohort hashes are pre-computed |
| Feature flag toggle during active placement session | Low | Session-scoped flag check at session start; mid-session changes take effect next session |
| V3→V4 co-existence confusion | Low | V3 continues serving all non-opted-in users; no mixed sessions |

---

## Known Limitations

1. **No multi-device real-time sync.** Cross-device merge requires
   explicit sync trigger (app foreground, manual refresh). Not
   real-time collaborative.
2. **Admin dashboard is read-only.** No ability to modify learner
   memory or override interventions from the dashboard in V5.
3. **Provider registry is mock-only in non-production environments.**
   Live provider testing requires explicit validation boundary approval.
4. **No automated V3→V4 migration for existing learners.**
   Migration is a future phase.
5. **Offline sync stores learner memory only.** Telemetry events
   during offline are queued and replayed on reconnect, but may have
   timestamp skew.
6. **Intervention rendering in learner UI is minimal in V5.**
   LearnerDiagnosticsCard renders bilingual VI/EN diagnostics, but
   intervention actions (e.g., "retry this lesson") are wired in a
   future phase.

---

## Rollback Notes

Rollback is a single operation: set `placement_v4_enabled = false`
globally or per-user.

What happens on rollback:
1. V4 orchestration stops receiving events
2. V3 placement resumes for all affected users
3. V4 persisted data (learner memory, telemetry, snapshots) is NOT
   deleted — it remains available for admin inspection
4. Admin dashboard continues showing historical V4 data
5. No learner data is lost; no placement state is corrupted

Rollback command (Supabase SQL Editor):
```sql
UPDATE profiles SET placement_v4_enabled = false WHERE placement_v4_enabled = true;
-- OR globally:
-- This requires a V5-specific mechanism; see V5_ROLLBACK_PLAN.md
```

Post-rollback verification:
- [ ] Confirm V3 placement is serving all users
- [ ] Confirm no V4 orchestration events are being ingested
- [ ] Confirm admin dashboard shows zero new V4 events
- [ ] Confirm no error spikes in Sentry/observability
- [ ] Notify operator that rollback is complete

---

## Deployment Evidence Required

Before declaring V5 production-ready:

- [ ] All V5 PRs merged to main
- [ ] CI all-green on main (Build+Test, Lint, TypeScript, Module Boundaries)
- [ ] Supabase migrations applied to production
- [ ] `placement_v4_enabled = false` confirmed in production
- [ ] Admin dashboard accessible at admin level >= 9
- [ ] V3 placement serving all users (zero regressions)
- [ ] Rollback procedure tested in staging
- [ ] Offline sync tested on iOS + Android physical devices
- [ ] Provider registry mock providers confirmed functional
- [ ] Telemetry event ingestion verified (no dropped events, no PII leaks)
- [ ] C7 release gate: PASS
- [ ] Operator approval: OBTAINED
