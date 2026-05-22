# V5 Discovery Plan

**Author:** C1 — V5 Planning Captain
**Date:** 2026-05-21
**Baseline:** origin/main 3be4e6ef1 (V4 stack complete)
**Status:** DISCOVERY

---

## Mission Statement

V5 wires the V4 analytical placement system into the live MercyBlade
application with persistence, activation, observability, and a phased
V3→V4 migration path. V5 is the "go live" phase — the bridge from pure
analytical modules to production learner impact.

## Product Goals

1. **Learners get adaptive placement.** V4's intervention engine,
   forecast analysis, and diagnostics reach real learners through the
   lesson lifecycle — not just as analytical functions, but as
   in-app behavior change.
2. **Admins can see V4 analytics.** Effectiveness scores, retention
   signals, cohort drift, and provider health become visible in the
   admin dashboard (admin-level >= 9).
3. **Nothing breaks for existing V3 learners.** V4 is feature-flagged
   OFF by default. Gradual rollout with rollback safety.
4. **Offline learners are not left behind.** Learner memory persists
   through spotty connections and syncs when back online.

## Technical Goals

1. **Supabase persistence layer** for all V4 runtime state:
   learner_memory, telemetry_events, orchestration_snapshots,
   provider_decisions, curriculum_plans.
2. **Activation wiring** that connects V4 orchestration to the
   room/lesson lifecycle without touching V4 module internals.
3. **Admin observability dashboard** that surfaces V4 analytics:
   effectiveness heatmap, retention cohorts, cohort drift, provider
   health, intervention effectiveness.
4. **Feature flag system** (`placement_v4_enabled`) with per-user
   gradual rollout and instant rollback.
5. **Mobile/offline learner memory** via Capacitor plugin with
   sync-on-reconnect using V4's crossDeviceMerge.

## Non-Goals

- New analytical functions (V4 owns analytics)
- New adapter contracts (V4 owns contracts)
- New core modules (V4 owns modules: learnerMemory, curriculumSequencer,
  progressionSimulator, providerRegistry)
- Replacing V3 placement entirely (coexist, then migrate when proven)
- Changing V4 module internals — V5 imports V4, never mutates it
- UI redesign of the placement experience (V5 uses existing components)
- Vendor I/O in analytical paths (V4's deterministic purity is preserved)

## Definition of V5 "Ready to Implement"

All of:
1. This plan reviewed and approved by operator
2. C2 contract inheritance map complete (V5_IMPORTS.md)
3. C3 Supabase schema designed and reviewed
4. C4 lifecycle wiring plan documented
5. C5 admin dashboard wireframes approved
6. C6 feature flag configuration defined
7. C7 offline sync design documented
8. Branch strategy agreed
9. All PRs sequenced with dependency graph

## Definition of V5 "Release Ready"

All of:
1. All V5 PRs merged to main
2. Supabase migrations applied to production
3. placement_v4_enabled = false (safe default)
4. Admin dashboard accessible to level >= 9 admins
5. V4 analytics dashboards show data for opted-in users
6. V3 placement continues serving all non-opted-in users
7. Rollback procedure tested: disable flag → V3 resumes
8. Mobile offline sync tested on iOS + Android
9. No regressions in existing V3 placement
10. CI all-green on main with V5 code present
