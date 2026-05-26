# V5 Monitoring Plan

**Author:** C8 — V5 Ops / Release Intelligence
**Date:** 2026-05-22
**Baseline:** origin/main 3be4e6ef1
**Status:** DRAFT — awaits C1–C7 completion

---

## Monitoring Architecture

V5 monitoring has three layers:

1. **CI/CD pipeline** — automated checks on every commit/PR
2. **Runtime observability** — production metrics from V5 code paths
3. **Operator dashboards** — human-readable views for decision-making

---

## 1. CI/CD Pipeline Monitoring

### Required Checks (every PR and main commit)

| Check | What It Verifies | Failure Action |
|-------|-----------------|----------------|
| Build and Test | All tests pass (V3 + V4 + V5) | Block merge |
| TypeScript (tsc) | Zero type errors | Block merge |
| Lint | Zero new warnings | Block merge |
| Module Boundaries | No forbidden imports | Block merge |
| Validate Rooms | Room JSON integrity | Block merge |
| Lighthouse Mobile | Mobile performance | Warn (non-blocking) |

### V5-Specific CI Checks (proposed)

| Check | What It Verifies |
|-------|-----------------|
| V5 import boundary | V5 imports from V4, never mutates V4 |
| Feature flag default | placement_v4_enabled defaults to false in all paths |
| PII-lint | No PII patterns in telemetry event payloads |
| Provider registry integrity | All mock providers have valid configurations |

---

## 2. Runtime Observability

### Metrics to Track

#### Placement Health

| Metric | Source | Baseline | Alert Threshold |
|--------|--------|----------|-----------------|
| Placement completion rate | V3/V4 lesson completion events | V3 current rate | < 95% of baseline |
| Recommendation acceptance rate | V4 intervention engine | TBD after Stage 2 | < 80% |
| Placement flow time (start → recommendation) | V4 orchestration events | TBD after Stage 2 | > 2x baseline |

#### Provider Health

| Metric | Source | Alert Threshold |
|--------|--------|-----------------|
| Provider failover rate | V4 provider decision records | > 5% failover |
| Provider health status | V4 provider health snapshots | Any "failing" |
| Provider quarantine events | V4 provider registry | > 0 in production |
| Provider latency (p95) | V4 provider health snapshots | > capability maxP95LatencyMs |

#### Orchestration Health

| Metric | Source | Alert Threshold |
|--------|--------|-----------------|
| Orchestration error rate | V4 orchestrator error events | > 1% of total events |
| Event queue overflow rate | V4 speaking queue dropped count | > 0 |
| Intervention resolution rate | V4 intervention lifecycle | < 90% resolved |
| Snapshot replay consistency | V4 orchestration snapshot hash | Hash mismatch > 0 |

#### Learner Memory Health

| Metric | Source | Alert Threshold |
|--------|--------|-----------------|
| Memory replay consistency | V4 learner memory fingerprint | Fingerprint mismatch > 0 |
| Sync conflict rate | V4 cross-device merge corruption reports | > 1% of syncs |
| Offline queue backlog | V5 sync queue depth | > 100 events |

#### Forecast Health

| Metric | Source | Alert Threshold |
|--------|--------|-----------------|
| Forecast deviation rate | V4 forecast analysis | Deviation > 0.15 for > 10% of skills |
| Optimistic bias prevalence | V4 forecast analysis | > 20% optimistic predictions |
| Recalibration recommendation rate | V4 forecast analysis | > 5 recalibrations/day |

#### Data Quality

| Metric | Source | Alert Threshold |
|--------|--------|-----------------|
| Telemetry event rejection rate | V4 schema validation | > 1% rejected |
| PII in telemetry | V4 privacy redaction audit | > 0 PII instances |
| Retention signal completeness | V4 retention extraction | < 100% of active users |

---

## 3. Operator Dashboards

### Admin Analytics Dashboard (C5)

Accessible at admin level >= 9. Tabs:

1. **Effectiveness** — lesson effectiveness heatmap, CEFR lift by lesson,
   weak pattern clusters
2. **Retention** — churn risk distribution, active days histogram,
   activity density, longest active runs
3. **Cohorts** — cohort comparison table, cohort drift report,
   cohort gap analysis
4. **Providers** — provider health status, failover history,
   quarantine log, trust score history

### Sentry / Error Monitoring

Existing Sentry integration captures:
- Unhandled exceptions in V5 code paths
- Supabase query errors from V5 persistence layer
- Provider registry validation failures
- Orchestration event processing errors

### Supabase Observability

- Query performance for v4_* tables
- RLS policy violations (403 errors)
- Storage bucket access patterns
- Auth session stability (placement session continuity)

---

## 4. Alert Routing

| Alert Category | Severity | Notify | Action |
|---------------|----------|--------|--------|
| Provider failing | CRITICAL | Operator + C5 | Investigate provider health, consider failover |
| PII in telemetry | CRITICAL | Operator + C7 | Immediate investigation, pause V4 ingestion |
| Placement rate drop | HIGH | Operator + C4 | Pause rollout, investigate cause |
| Orchestration error spike | HIGH | Operator + C4 | Check event flow, consider rollback |
| Snapshot hash mismatch | HIGH | Operator + C4 | Investigate determinism regression |
| Forecast deviation spike | MEDIUM | C1 (informational) | Review forecast model calibration |
| Feature flag toggle failure | HIGH | Operator + C6 | Fix flag mechanism before proceeding |
| CI failure on main | HIGH | All C-agents | Block merges until green |
| Telemetry rejection rate | MEDIUM | C3 (informational) | Review event schema, data quality |
| Sync conflict storm | MEDIUM | C7 (informational) | Review merge logic, device clock skew |

---

## 5. Monitoring Cadence

| Window | Check Frequency | Owner |
|--------|----------------|-------|
| First 2h post-deploy | Continuous (every 5 min) | C8 |
| 2–24h post-deploy | Every 30 min | Operator |
| 24–48h post-deploy | Every 2 hours | C1 |
| 48h+ post-deploy (Stage 1–2) | Daily | Operator |
| Stage 3 (percentage rollout) | Daily at each step | Operator |
| Stage 4 (full release) | Weekly | Operator |

---

## 6. Dashboard / Alert Configuration

### Required Alerts (pre-deployment)

- [ ] Sentry alert: V5 error rate > 2x baseline
- [ ] Sentry alert: Supabase RLS 403 on v4_* tables
- [ ] Custom metric: provider health status != healthy
- [ ] Custom metric: placement completion rate < 95% of V3 baseline
- [ ] Custom metric: telemetry PII detection (if automated)

### Required Dashboards (pre-deployment)

- [ ] V5 admin analytics dashboard (C5) deployed and accessible
- [ ] Supabase query performance dashboard for v4_* tables
- [ ] Vercel deployment history with commit SHA tracking
- [ ] CI status dashboard (GitHub Actions)

---

## 7. Post-Release Monitoring Exit Criteria

V5 exits active monitoring when ALL of:

- [ ] 48 hours elapsed since full release (Stage 4)
- [ ] Placement completion rate >= V3 baseline for 48h
- [ ] Zero CRITICAL alerts in 48h
- [ ] Provider health: all green for 48h
- [ ] Orchestration error rate < 1% for 48h
- [ ] Zero snapshot hash mismatches in 48h
- [ ] Zero PII incidents in 48h
- [ ] Operator signs off on monitoring exit

After exit, routine monitoring continues at weekly cadence.
