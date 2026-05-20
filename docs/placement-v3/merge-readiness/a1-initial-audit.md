# A1 Initial Placement V3 Merge-Readiness Audit

Date: 2026-05-20
Branch: `chore/a1-placement-v3-merge-readiness`
Base: `origin/main` at `1f6833a03` (`#941` already merged)

## Branches / PRs Found

Open Placement V3 draft PRs found through `gh pr list` and local PR refs:

| PR | Branch | Draft | GitHub merge state | Notes |
| --- | --- | --- | --- | --- |
| #932 | `design/A22-placement-v3` | yes | UNKNOWN | Base design doc PR. |
| #933 | `feat/placement-v3-grade-writing` | yes | UNKNOWN | Writing grader. |
| #934 | `feat/placement-v3-vn-l1-taxonomy` | yes | UNKNOWN | Vietnamese L1 taxonomy. |
| #935 | `feat/placement-v3-storage` | yes | UNKNOWN | Storage migrations/RLS. |
| #936 | `feat/placement-v3-recommender` | yes | UNKNOWN | Recommender/lesson index. |
| #937 | `feat/placement-v3-prompts-and-calibration` | yes | UNKNOWN | Prompt library/calibration corpus. |
| #938 | `feat/placement-v3-session-orchestrator` | yes | UNKNOWN | Session orchestrator. |
| #939 | `feat/placement-v3-mercy-conversation` | yes | UNKNOWN | Conversational Mercy assessment. |
| #940 | `feat/placement-v3-ui` | yes | UNKNOWN | Placement V3 UI. |
| #942 | `feat/placement-v3-integration` | yes | BLOCKED | Umbrella integration PR. |
| #943 | `feat/a36-grading-drift-detection` | yes | BLOCKED | Drift replay harness rebased onto #942. |
| #944 | `feat/a33-placement-benchmarking` | yes | UNSTABLE | Benchmark scaffold; contains real benchmark files. |
| #946 | `feat/a35-adaptive-item-generation` | yes | BLOCKED | Adaptive item generation scaffold, remaining active Placement V3 draft. |

Closed but explicitly requested:

| PR | Branch | State | Notes |
| --- | --- | --- | --- |
| #945 | `feat/a37-shadow-session-replay` | CLOSED | Blocker-only A37 doc PR. Still audited for docs-only/claim safety. |

Raw PR metadata is saved under `docs/placement-v3/merge-readiness/raw/*-pr.json`.

## Docs Found

On `origin/main`, the requested Placement V3 stack docs are not present yet:

- missing `docs/placement-v3-integration-status.md`
- missing `docs/placement-v3-integration-pr-body.md`
- missing `docs/placement-v3/benchmarking/pr-body-draft.md`
- missing `docs/placement-v3/drift-detection/PR_BODY.md`
- missing `docs/placement-v3/shadow-replay/a37-blockers.md`

On draft PR refs, the docs are present:

- #942: `docs/placement-v3-integration-status.md`
- #942: `docs/placement-v3-integration-pr-body.md`
- #944: `docs/placement-v3/benchmarking/pr-body-draft.md`
- #943: `docs/placement-v3/drift-detection/PR_BODY.md`
- #945: `docs/placement-v3/shadow-replay/a37-blockers.md`

## Routes Found

On current `origin/main`, only the legacy placement v2 route block exists:

- `/placement`
- `/placement/who`
- `/placement/test`
- `/placement/results`

All are guarded by `FEATURE_FLAGS.PLACEMENT_TEST_ENABLED` and redirect to `/` when disabled.

On #942, the Placement V3 route block exists:

- `/placement` and `/placement/who` use `FEATURE_FLAGS.PLACEMENT_V3_UI_ENABLED` and `PlacementV3Gate`.
- `/placement/test/:sessionId`, `/placement/results/:sessionId`, `/placement/resume`, and `/placement/skip` use `PlacementV3Gate`.
- Legacy v2 fallback remains behind `PLACEMENT_TEST_ENABLED`.

On #943 after the prior cleanup, A36 adds only:

- admin lazy import for `PlacementDriftDashboard`
- `/admin/placement-drift`

On #944, A33 adds benchmark admin route/import for the benchmark dashboard.

## Feature Flags Found

On `origin/main`:

- `FEATURE_FLAGS.PLACEMENT_TEST_ENABLED: false`
- `FEATURE_FLAGS.PLACEMENT_V3_UI_ENABLED` is not present yet.

On #942:

- `PLACEMENT_TEST_ENABLED` reads `VITE_PLACEMENT_TEST_ENABLED` and defaults false.
- `PLACEMENT_V3_UI_ENABLED` reads `VITE_PLACEMENT_V3_UI_ENABLED` and defaults false.

## Known Blockers Found

- #942 documents A29 speaking/reading/listening graders as absent and using orchestrator fallbacks.
- #943 documents live drift replay as blocked by missing Supabase replay credentials.
- #944 documents live benchmark execution as blocked by missing benchmark credentials and no live metrics.
- #945 is closed and intentionally blocker-only; it makes no runtime implementation claim.
- #946 is an additional open Placement V3 draft and must be included in merge-tree/status evidence before final merge planning.
