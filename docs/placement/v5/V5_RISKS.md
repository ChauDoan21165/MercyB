# V5 Risk Register

**Author:** C1 — V5 Planning Captain
**Date:** 2026-05-21

---

## Risk 1 — V4 Module Mutation
| Field | Detail |
|-------|--------|
| Severity | HIGH |
| Description | A V5 PR accidentally modifies a V4 source file, breaking the analytical purity contract or introducing side effects. |
| Likelihood | Medium — strong guardrails in place, but refactoring pressure may arise. |
| Mitigation | All V5 PRs are diff-checked for V4 file changes. CI module-boundaries check catches cross-layer imports. C1 review gate. |
| Recovery | Revert the PR. V4 files are immutable from V5 perspective. |

## Risk 2 — Supabase RLS Data Leak
| Field | Detail |
|-------|--------|
| Severity | CRITICAL |
| Description | Misconfigured RLS on v4_learner_memory or v4_telemetry_events exposes one user's placement data to another user. |
| Likelihood | Low — Supabase RLS defaults to deny-all. |
| Mitigation | RLS policies tested with supabase local before merge. Admin-only read-all policies are separate from user-scoped policies. C3 tests verify cross-user isolation. |
| Recovery | Disable V4 flag. Fix RLS. Re-enable. |

## Risk 3 — V3 Placement Regression
| Field | Detail |
|-------|--------|
| Severity | HIGH |
| Description | V5 activation wiring accidentally breaks V3 placement for users with placement_v4_enabled = false. |
| Likelihood | Medium — V3 and V4 share the same RoomRenderer. |
| Mitigation | Feature flag is checked before any V4 code executes. V4 code is in separate hooks/files. Integration tests verify V3 still works with V5 code present and flag OFF. |
| Recovery | Disable flag → V3 resumes. Fix V5 code. |

## Risk 4 — Offline Sync Data Loss
| Field | Detail |
|-------|--------|
| Severity | HIGH |
| Description | Offline learner generates events, reconnects, and sync merge loses or corrupts progress. |
| Likelihood | Medium — cross-device merge is proven deterministic but untested on real mobile connections. |
| Mitigation | C7 uses V4's crossDeviceMerge which is replay-safe and tested. Conflict resolution: latest event wins. Vector clock prevents double-counting. |
| Recovery | Replay from server-side event log. Local events are additive; server can rebuild state. |

## Risk 5 — Feature Flag Bypass
| Field | Detail |
|-------|--------|
| Severity | MEDIUM |
| Description | V4 code executes despite placement_v4_enabled = false due to a code path that misses the flag check. |
| Likelihood | Low — flag is checked at the hook level, not scattered. |
| Mitigation | Single source of truth: useAdaptiveOrchestration checks the flag once and returns no-op if OFF. All V4-dependent hooks gate on this. |
| Recovery | Fix the missed gate. Flag OFF should be a hard no-op. |

## Risk 6 — Admin Dashboard Performance
| Field | Detail |
|-------|--------|
| Severity | LOW |
| Description | Admin dashboard queries unindexed telemetry_events table and times out for large cohorts. |
| Likelihood | Low — initial V4 rollout will have small user counts. |
| Mitigation | Add indexes on (user_id, ingested_at) and (ingested_at) for time-range queries. Paginate dashboard queries. |
| Recovery | Add missing indexes. No data loss. |

## Risk 7 — Provider Registry Config Drift
| Field | Detail |
|-------|--------|
| Severity | MEDIUM |
| Description | V4 provider registry defines mock providers. V5 persistence stores provider decisions. If production providers differ from mocks, stored decisions may reference non-existent providers. |
| Likelihood | Low — provider registry is deterministic and versioned. |
| Mitigation | Provider decisions store provider ID + version. Admin dashboard shows provider health to detect drift. |
| Recovery | Update provider registry in V4. Re-run decisions for affected users. |

## Risk 8 — Premature V3→V4 Migration
| Field | Detail |
|-------|--------|
| Severity | MEDIUM |
| Description | Operator or agent merges a PR that begins V3→V4 migration before V5 is proven stable, causing mass user disruption. |
| Likelihood | Low — migration is explicitly out of V5 scope. |
| Mitigation | V5 scope document explicitly excludes V3→V4 migration. C1 review gate catches scope creep. |
| Recovery | Revert the migration PR. Restore V3 as default. |

---

## Risk Summary

| # | Severity | Status |
|---|----------|--------|
| 1 | HIGH | Mitigated by CI + review |
| 2 | CRITICAL | Mitigated by RLS tests + deny-all default |
| 3 | HIGH | Mitigated by feature flag + integration tests |
| 4 | HIGH | Mitigated by replay-safe merge + event log |
| 5 | MEDIUM | Mitigated by single-gate pattern |
| 6 | LOW | Mitigated by indexes + pagination |
| 7 | MEDIUM | Mitigated by versioned decisions + admin panel |
| 8 | MEDIUM | Mitigated by scope enforcement |
