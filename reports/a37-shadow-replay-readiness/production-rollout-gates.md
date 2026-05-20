# Production Rollout Gates

Date: 2026-05-20

Use this before enabling any production Placement V3 shadow replay capture.

## Minimum Live Replay Count

- [ ] At least 10 real captured sessions in a test environment.
- [ ] At least 30 real captured sessions before production pilot.
- [ ] At least 100 real captured sessions before broad rollout.

## Minimum Replay Success %

- [ ] Test environment: 90% replay completion.
- [ ] Production pilot: 95% replay completion.
- [ ] Broad rollout: 98% replay completion.

Replay failures must be categorized as provider, serialization, sanitization, schema, permission, or unknown.

## Required Drift Thresholds

- [ ] Overall CEFR drift within ±0.5 for at least 80% of replayed sessions.
- [ ] Overall CEFR drift within ±1.0 for at least 95% of replayed sessions.
- [ ] Recommendation top-3 overlap at least 66% unless recommender version changed intentionally.
- [ ] Taxonomy-trigger changes reviewed when high-confidence L1 flags appear/disappear.

## Required Sanitization Checks

- [ ] Emails redacted.
- [ ] Phone numbers redacted.
- [ ] URLs redacted.
- [ ] Secrets/tokens redacted.
- [ ] Raw audio absent from exported artifacts.
- [ ] Raw writing absent from long-lived tables unless explicitly approved.

## Required Privacy Review

- [ ] Retention policy approved.
- [ ] RLS/admin access approved.
- [ ] Raw artifact policy approved.
- [ ] Deletion process tested.
- [ ] Incident response owner assigned.

## Required Rollback Plan

- [ ] Kill switch exists.
- [ ] Capture can be disabled without disabling Placement V3.
- [ ] Shadow tables can be quarantined.
- [ ] Provider replay jobs can be stopped.
- [ ] Secrets can be revoked and rotated.

## Minimum Observability Requirements

- [ ] Capture success/failure rate.
- [ ] Sanitization failure rate.
- [ ] Replay completion rate.
- [ ] Provider error rate.
- [ ] Replay latency.
- [ ] Drift alert count.
- [ ] Admin dashboard access logs.

## DO NOT ENABLE Conditions

Do not enable production shadow replay if any are true:

- Provider or Supabase credentials are missing.
- Service role key would be exposed to the browser.
- Sanitization audit is not implemented.
- RLS/admin access is not reviewed.
- Raw audio or raw writing retention is undefined.
- Replay failures cannot be categorized.
- Capture failures can block the core placement test.
- No rollback/kill switch exists.
