# Placement V3 PR Stack Audit

Date: 2026-05-20

## Merged PRs

| PR | Title | State | Merge time | Merge commit | Operational meaning |
|---:|---|---|---|---|---|
| #941 | `feat(placement-v3): harden native mobile speaking capture` | Merged | 2026-05-20T12:42:36Z | `1f6833a034dd92d6812c97166f91e9b12fa30759` | Adds/static-audits native microphone permission configuration. Runtime validation remains blocked. |
| #942 | `feat(placement-v3): end-to-end integration + vertical E2E (A33)` | Merged | 2026-05-20T12:51:44Z | `de6d31c2825df2c70bf0669e251007e55129710b` | Integrates Placement V3 UI, session orchestrator, writing grader, Mercy conversation, prompt catalog, recommender adapter, feature gates, and vertical E2E scaffold behind default-off flags. |

## Draft / Blocked PRs

| PR | Title | State | Draft? | Current check state from captured evidence | Recommended action |
|---:|---|---|---|---|---|
| #943 | `feat(placement-v3): add grading drift replay harness` | Open | Yes | Checks captured as success, but PR remains draft/blocked operationally because live replay is blocked. | Keep draft until live replay runs produce real drift metrics. |
| #944 | `feat(placement-v3): add benchmarking infrastructure scaffold` | Open | Yes | Checks captured as success in `pr-944.json`; live benchmark hard gates not met. | Keep draft until live benchmark env and admin/test credentials exist, then run 25+ sessions and 3 optimization cycles. |
| #945 | `feat(placement-v3): add shadow session replay infrastructure` | Closed | Yes | Build and Test success, preview/Lighthouse failure before closure. Body says blocker report only. | Park/leave closed unless a new implementation branch is created with real capture/replay evidence. |
| #946 | `feat(placement-v3): add adaptive item generation gauntlet scaffold` | Open | Yes | Build and Test success; Build Preview and Lighthouse failure. Hard gates failed. | Keep draft; do not merge for launch readiness. |
| #947 | `test: stabilize Vitest web storage harness` | Open | No | CI captured green; merge state `CLEAN`. | Merge next. This is test harness infrastructure, not Placement V3 product readiness. |

## Recommended Next Action

1. Keep #943, #944, and #946 draft until live evidence exists.
2. Keep #945 closed/parked unless scope restarts.
3. Merge A38 (#947); CI is green and it stabilizes shared test infrastructure.
4. After A38 merges, run live benchmark and drift replay with real Supabase/provider credentials.
5. Do not enable Placement V3 production flags until native audio, cost/latency/failover, drift replay, and A29 modality limitations are resolved or explicitly accepted for an internal-only test.
