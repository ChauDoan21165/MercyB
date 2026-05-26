# V5 Roadmap

**Author:** C1 — V5 Planning Captain
**Date:** 2026-05-21
**Baseline:** origin/main 3be4e6ef1

---

## Phase 0 — Discovery (current)

| Step | Agent | Deliverable | Status |
|------|-------|-------------|--------|
| V5 plan + scope + agents + risks + roadmap | C1 | This document set | DONE |
| V4 contract inheritance map | C2 | V5_IMPORTS.md | NEXT |
| Operator review + approval | — | Approval to begin Phase 1 | PENDING |

## Phase 1 — Foundation (parallel-safe PRs)

| PR | Agent | Title | Depends on | Estimated files |
|----|-------|-------|------------|-----------------|
| PR-1 | C6 | feat(v5): add placement_v4_enabled feature flag | none | ~3 files (flag config, admin toggle) |
| PR-2 | C3 | feat(v5): add Supabase persistence schema for V4 state | C2 import map | ~5 migrations, 1 persistence.ts |
| PR-3 | C7 | feat(v5): add offline learner memory adapter | C3 schema | ~2 files (local adapter, sync queue) |

**Merge order:** C6 → C3 → C7 (C6 independent, C3 needs C2 types, C7 needs C3 schema)

## Phase 2 — Activation (core wiring)

| PR | Agent | Title | Depends on | Estimated files |
|----|-------|-------|------------|-----------------|
| PR-4 | C4 | feat(v5): wire V4 orchestration into lesson lifecycle | C3 + C6 | ~3 files (hook, lifecycle, wire point) |

**Merge order:** after C3 and C6 land

## Phase 3 — Observability (dashboard)

| PR | Agent | Title | Depends on | Estimated files |
|----|-------|-------|------------|-----------------|
| PR-5 | C5 | feat(v5): add V4 analytics admin dashboard | C3 | ~5 files (dashboard + 4 panels) |

**Merge order:** after C3 lands (reads persisted telemetry)

## Phase 4 — Integration Validation

| PR | Agent | Title | Depends on | Estimated files |
|----|-------|-------|------------|-----------------|
| TBD | C1 | feat(v5): add V5 integration test suite | all V5 PRs | ~3 test files |

**Merge order:** after all V5 code lands

---

## Total Estimated Scope

| Phase | PRs | Files | Agents |
|-------|-----|-------|--------|
| 0 — Discovery | 0 | 6 docs | C1, C2 |
| 1 — Foundation | 3 | ~10 | C6, C3, C7 |
| 2 — Activation | 1 | ~3 | C4 |
| 3 — Observability | 1 | ~5 | C5 |
| 4 — Integration | 1 | ~3 | C1 |
| **Total** | **6** | **~21** | **C1–C7** |

---

## Branch Strategy

```
v5/discovery-plan  ─── C1 discovery docs (current branch)
  └── c2/v5-imports ─── C2 contract inheritance map

c6/v5-feature-flag ─── independent, can merge first

c3/v5-persistence   ─── after C2 done, needs import map
  ├── c4/v5-lifecycle    ─── after C3 + C6
  ├── c5/v5-admin        ─── after C3
  └── c7/v5-offline      ─── after C3

c1/v5-integration   ─── after all V5 code lands
```

All branches target `main`. No stacked branches except where explicit
dependency exists (C4 needs C3 and C6 types in main first).

---

## Guardrails Per Phase

**All phases:**
- typecheck + lint + build green before merge
- V4 files untouched (diff-checked)
- No V3 regression (feature flag OFF → V3 works)
- Admin gates enforced (get_admin_level >= 9 for dashboards)

**Phase 1:**
- Supabase migrations are additive, not destructive
- RLS defaults to deny-all, then grants user-scoped access
- Feature flag default: false

**Phase 2–3:**
- All V4-dependent code checks placement_v4_enabled before executing
- Admin dashboard queries are paginated and indexed
- No learner PII exposed in admin views

**Phase 4:**
- Integration tests cover: flag ON → V4 active, flag OFF → V4 no-op
- Cross-user data isolation verified
- Rollback procedure documented and tested
