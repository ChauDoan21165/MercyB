# A33 Placement v3 Endurance Final Report

Date: 2026-05-20  
Branch: `feat/a33-placement-v3-endurance-burnin`

## Summary

Placement V3 survived the local/session-mode endurance campaign without
session failures, integrity violations, or deterministic degradation.

This was not a live provider burn-in. The environment had no Supabase/provider
credentials, so the campaign used local/session-mode execution with the real
orchestrator core and deterministic fetch fixtures for grader HTTP behavior.

## Total Executions

- CLI smoke runs: 12
- Main final campaign: 100
- Final uninterrupted stability batch: 25
- Browser endurance E2E flows: 10
- Classifier integration scenarios: 15

Primary gate: 100/100 final campaign executions passed.

## Total Elapsed Runtime

Measured local runner duration:

- 100-run campaign: 408 ms summed session duration
- final 25-run batch: 65 ms summed session duration

This is fast because provider and Supabase network calls were not available.
Do not treat these numbers as production latency.

## Failure Scenarios Tested

All required scenarios were exercised:

- abandoned session
- resumed session
- duplicate submission
- retry storm
- browser refresh mid-session
- interrupted persistence
- delayed grading response
- fallback grading path
- partial recommendation failure
- timeout recovery

## Latency Findings

The final 100-run campaign had p50 1 ms and p95 1 ms in local/session-mode.
The final 25-run stability batch had p50 1 ms and p95 2 ms.

No local latency degradation was observed.

## Memory Findings

The 100-run campaign moved from 13.24 MB heap used to 13.71 MB heap used. The
final 25-run batch moved from 13.40 MB to 17.11 MB. The short final increase is
not enough evidence for a leak because the process did not force GC, but it is
worth watching in a real staging burn-in.

## Retry/Fallback Trends

Final 100-run campaign:

- retries: 8
- fallbacks: 9
- timeouts: 3

These were intentionally injected scenarios. No retry/fallback count increased
outside the planned failure windows.

## Integrity Findings

Integrity audits found 0 violations across the final 100-run campaign and 0
violations across the final 25-run stability batch.

## Verification

Three consecutive verification cycles passed:

- `npm test`: 408 files, 7085 tests passed in each cycle.
- `npm run typecheck`: passed in each cycle.
- `npm run typecheck:ci`: passed in each cycle.
- `npm run build`: passed in each cycle.

Browser endurance E2E also passed: 10/10 flows.

Verification logs are saved under
`docs/placement-v3/endurance/verification-logs/`.

## Deterministic Bugs Found

- E2E helper missed radio/listening response controls.
- E2E helper raced the result-page transition and clicked a stale disabled
  submit button.
- Local timeout fixture counted timeout events without honoring `AbortSignal`.

All three were tooling/harness bugs. Placement V3 business logic was not
changed.

## Remaining Risks

- A29 speaking/reading/listening graders are still absent; fallbacks/stubs
  remain active.
- Feature flags remain default false.
- Real provider latency and Supabase persistence latency were not measured.
- Staging RLS/migration behavior needs a credentialed environment.
- Real mobile browser media cleanup remains unproven.

## Verdict

Placement V3 survives sustained repeated execution in local/session-mode. It is
ready for a credentialed staging burn-in to measure real provider latency,
Supabase persistence behavior, and longer wall-clock browser memory trends.
