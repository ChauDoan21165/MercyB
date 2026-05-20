# Placement V3 Post-Merge Readiness Report

Date: 2026-05-20
Branch: `reports/placement-v3-post-merge-readiness`
Base: `origin/main` at `de6d31c28` (#942)

## Executive Decision

**DO NOT ENABLE**

Placement V3 is now integrated behind default-off flags, but it is not production-ready for users today. The safe state is merged code dark-launched behind flags. The unsafe state is enabling either public or broad internal user access before live benchmark, drift replay, native speaking, and A29 modality evidence exists.

## What Merged

- #941 `feat(placement-v3): harden native mobile speaking capture`
  - Merged 2026-05-20T12:42:36Z.
  - Adds/static-audits native microphone permission configuration.
  - Does not prove native speaking capture or Azure scoring runtime success.

- #942 `feat(placement-v3): end-to-end integration + vertical E2E (A33)`
  - Merged 2026-05-20T12:51:44Z.
  - Integrates Placement V3 UI, session orchestrator, writing grader, Mercy conversation mode, prompt catalog, recommendation adapter, feature gates, and a vertical E2E scaffold.
  - Keeps `/placement` gated by default-off flags.

## What Is Still Draft

- #943 `feat(placement-v3): add grading drift replay harness`
  - Open draft.
  - Infrastructure only from a launch-readiness standpoint; live replay is blocked and no drift metrics are claimed.

- #944 `feat(placement-v3): add benchmarking infrastructure scaffold`
  - Open draft.
  - Infrastructure only; live benchmark blocked. Hard gates not met: 0/25 live sessions, 0/3 optimization cycles, no p95/cost/failover metrics.

- #945 `feat(placement-v3): add shadow session replay infrastructure`
  - Closed draft.
  - Blocker report only. No shadow capture or replay evidence.

- #946 `feat(placement-v3): add adaptive item generation gauntlet scaffold`
  - Open draft.
  - Hard gates failed. 59/90 live candidates completed, 4 accepted items, tuned run stopped on `fetch failed`; Build Preview and Lighthouse checks failed.

## Current Capability

- Writing grader: wired through `placement-v3-grade-writing` via the session grader client. It has fail-soft fallback behavior on timeout, HTTP error, malformed JSON, rate limit, or network error.
- Mercy conversation: wired through `placement-v3-mercy-conversation` and normalized into the session assessment shape.
- Session orchestrator: `supabase/functions/placement-v3-session` handles start/respond/resume/status/abandon, persists session/response/profile rows, logs grader calls, and finalizes profiles.
- UI: Placement V3 pages exist under `/placement` routes and call the session client; the UI is gated and auth-required when enabled.
- Recommendations: profile finalization calls the Placement V3 recommender adapter, with a local fallback recommendation path.
- Feature gates: `PLACEMENT_TEST_ENABLED` and `PLACEMENT_V3_UI_ENABLED` default to `false`. Production defaults do not accidentally enable Placement V3.
- Missing A29 modalities: speaking, reading, and listening do not have proven real graders in this merged state. Non-writing/non-conversation paths can use `stubGrade()` / fallback scoring, which is safe for dark launch but unsafe for public placement accuracy claims.

## What Is Safe

- Keeping the merged code behind both default-off flags.
- Running local/static verification.
- Running staff-only/local smoke tests with explicit env flags.
- Continuing infrastructure work for benchmark, drift replay, and test harness stability.

## What Is Unsafe

- Enabling Placement V3 for public users today.
- Claiming production p95 latency, provider failover rate, cost/session, drift stability, native speaking success, or adaptive item-generation readiness.
- Treating stubbed speaking/reading/listening fallback as real placement evidence.
- Merging benchmark/drift/adaptive PRs as production-readiness proof without live runs.

## What Is Not Proven Yet

- No live benchmark p95/cost/failover metrics.
- No live drift replay metrics.
- No native speaking runtime validation.
- No shadow-session replay evidence.
- Adaptive generation hard gates failed.
- No production Supabase migrated-session run was verified here.
- Local vertical E2E did not pass in this report run.

## Test Evidence

Evidence folder: `reports/placement-v3-readiness-evidence/`

| Command | Result | Evidence |
|---|---|---|
| `gh pr list --state open ...` | Captured | `open-prs.json` |
| `gh pr view 941 ...` | Captured | `pr-941.json` |
| `gh pr view 942 ...` | Captured | `pr-942.json` |
| `gh pr view 943/944/945/946 ...` | Captured | `pr-943.json` through `pr-946.json` |
| `npm run typecheck` | Passed | `typecheck.log` |
| `npm run typecheck:ci` | Passed | `typecheck-ci.log` |
| `npm run build` | Passed | `build.log` |
| `npm run lint` | Passed with existing warnings | `lint.log` |
| `VITE_PLACEMENT_TEST_ENABLED=true VITE_PLACEMENT_V3_UI_ENABLED=true VITE_SUPABASE_URL=https://placeholder.invalid.supabase.co VITE_SUPABASE_ANON_KEY=placeholder-anon-key-not-real npm run test:e2e -- placement-v3-vertical` | Failed | `placement-v3-vertical-e2e.log` |
| Final rerun: `npm run typecheck` | Passed | `final-typecheck.log` |
| Final rerun: `npm run build` | Passed | `final-build.log` |

Vertical E2E failure details:

- Test: `tests/e2e/placement-v3-vertical.spec.ts`
- Failure: timed out after 60 seconds waiting for the next visible answer control.
- Error: `locator('textarea, input[placeholder*=\\'Short answer\\'], [role=\\'textbox\\'], [role=\\'radio\\']').first()` never became visible.
- Artifacts copied to `reports/placement-v3-readiness-evidence/placement-v3-vertical-failure-artifacts/`.

This failure does not prove product breakage by itself, but it removes the strongest local runtime proof for enabling Placement V3 today.

## Production Risks

- AI grading accuracy is not fully calibrated.
- Speaking/reading/listening fallback is only fallback, not validated A29 grading.
- Native audio is statically permissioned but not runtime validated on a real phone.
- Cost/latency is unknown because #944 has no live p95/cost/failover metrics.
- Drift is unknown because #943 has no live replay metrics.
- Shadow replay is absent because #945 is closed as blocker-only.
- Adaptive item generation is not launch-ready because #946 hard gates failed.
- Feature flags must stay off.
- The session edge function imports app-side recommender code; #942 notes deployment packaging still needs review.
- The merged vertical E2E claim is not reproduced by this report run.

## Recommended Next Merge Order

1. Keep #943, #944, and #946 draft until live evidence exists.
2. Keep #945 closed/parked unless restarted with real implementation and replay evidence.
3. Merge A38 (#947) next; CI is green and shared test harness stability is prerequisite for future Placement V3 work.
4. After A38 merges, run live benchmark and live drift replay with real credentials.
5. Only after live evidence exists, decide whether to enable internal-only testing behind both flags.

## Go/No-Go Checklist

- [x] #941 merged.
- [x] #942 merged.
- [x] Flags default off.
- [x] Static typecheck passed.
- [x] Production build passed.
- [x] Lint exited 0.
- [ ] Local Placement V3 vertical E2E passed in this report run.
- [ ] 25+ live benchmark sessions completed.
- [ ] 3 benchmark optimization cycles completed.
- [ ] p95 session latency measured.
- [ ] session cost measured for OpenAI-primary and Gemini-failover paths.
- [ ] provider failover recovery measured.
- [ ] live drift replay completed.
- [ ] native speaking tested on a real phone.
- [ ] A29 speaking/reading/listening graders merged or fallback limitation explicitly accepted.
- [ ] Supabase deployment packaging reviewed for edge-function imports.

## Chau Action Items

- Keep `VITE_PLACEMENT_TEST_ENABLED=false`.
- Keep `VITE_PLACEMENT_V3_UI_ENABLED=false`.
- Set the benchmark env vars and run #944 live benchmark after A38 merges.
- Set the replay env vars and run #943 live drift replay after A38 merges.
- Test native speaking on a real iOS/Android phone with Azure and Supabase env vars present.
- Verify A29 grader availability, or explicitly accept speaking/reading/listening fallback limitation for internal-only testing.
- Re-run the vertical E2E and treat failure as a blocker until reproduced green.

## Unsupported Claims

Do not claim:

- Placement V3 is production-ready.
- Public users can safely use Placement V3 today.
- p95 session latency is under any target.
- session cost is under any target.
- provider failover recovery is above any target.
- live grading drift is stable.
- native speaking capture and Azure scoring work on device.
- shadow replay validates current behavior.
- adaptive generation is launch-ready.
- speaking/reading/listening have real A29 grading evidence in the merged tree.

## Final Recommendation

Do not enable Placement V3 for users today. The merged state is useful and safe as a dark-launched integration milestone, but production evidence is still missing and the local vertical E2E did not pass during this report run. Keep both flags off, merge A38 next, then collect live benchmark, drift, native audio, and modality-grader evidence before reconsidering an internal-only enablement.
