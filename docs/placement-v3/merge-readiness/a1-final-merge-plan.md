# A1 Final Placement V3 Merge Plan

Date: 2026-05-20

## Recommended Merge Order

1. #942 umbrella integration.
2. #943 A36 grading drift replay harness, after doc-only PR body correction.
3. #944 A33 benchmark scaffold, rebased/merged onto #942.
4. #946 A35 adaptive item generation, only if Chau accepts partial-run evidence and draft status.
5. Close or leave superseded #932-#940 drafts after #942 lands, because #942 contains their stack.
6. No action on #945; it is closed and blocker-only.

## PR Decisions

| PR | Decision | Reason | Verification | Risk |
| --- | --- | --- | --- | --- |
| #932 | covered by #942 | Design doc included in integration stack. | merge-tree + no-commit merge evidence | low |
| #933 | covered by #942 | Writing grader included in #942. | merge-tree + no-commit merge evidence | low |
| #934 | covered by #942 | VN L1 taxonomy included in #942. | merge-tree + no-commit merge evidence | low |
| #935 | covered by #942 | Storage migrations included in #942. | merge-tree + no-commit merge evidence | medium due migrations |
| #936 | covered by #942 | Recommender included in #942. | merge-tree + no-commit merge evidence | low |
| #937 | covered by #942 | Prompts/calibration included in #942. | merge-tree + no-commit merge evidence | low |
| #938 | covered by #942 | Orchestrator included and wired in #942. | merge-tree + no-commit merge evidence | medium |
| #939 | covered by #942 | Mercy conversation included and wired in #942. | merge-tree + no-commit merge evidence | medium |
| #940 | covered by #942 | UI included and wired in #942. | merge-tree + no-commit merge evidence | medium |
| #942 | merge when Chau accepts draft scope | Full repeated local verification passed. A29 fallbacks documented safe. | 3x `npm test`, 3x typecheck, 3x build, typecheck:ci, lint, vertical E2E | medium-high due broad integration |
| #943 | keep draft until doc fix, then merge after #942 | Code verifies, route resolution safe, but PR body has stale writing-grader claim. | typecheck pass; drift vitest 12 pass; merge onto #942 pass | medium |
| #944 | rebase/merge after #942; do not merge before #942 | Direct merge to main conflicts in #942-owned session files; merge onto #942 passes. | typecheck pass; benchmark vitest 10 pass | medium |
| #945 | no merge action | Closed blocker-only doc PR. | docs-only check pass | low |
| #946 | keep draft unless Chau wants adaptive scaffold next | Verifies locally, but claims partial run/hard gates not met. | typecheck pass; adaptive vitest 30 pass; merge onto #942 pass | medium |

## Conflict Resolution Notes

- #944 direct-to-main conflict files:
  - `supabase/functions/placement-v3-session/graderClient.ts`
  - `supabase/functions/placement-v3-session/modality.ts`
  - `supabase/functions/placement-v3-session/persistence.ts`
- Resolution strategy: merge #942 first, then rebase #944 onto #942. Local no-commit simulation onto #942 passes.
- #943 was already rebased onto #942. Local simulation confirms it merges onto #942 without conflicts.
- #946 also merges onto #942 without conflicts in local simulation.

## Required Manual Actions For Chau

- Decide whether #942 should remain draft until A29 exists, or merge now with documented speaking/reading/listening fallbacks.
- Update #943 PR body to remove the stale claim that the writing grader is absent after the #942 rebase.
- Do not merge #944 before #942.
- Decide whether #946 belongs in the same release train or should remain a separate draft because its own hard gates did not pass.
- After #942 lands, close or supersede #932-#940 to reduce PR stack noise.

## Do Not Merge Until

- #942: do not merge until Chau accepts A29 fallback behavior and edge-function packaging risk.
- #943: do not mark ready until its PR body is corrected for the rebased writing-grader state.
- #944: do not merge until based on #942; direct merge into current main conflicts.
- #946: do not merge as production-ready; only merge as scaffold/evidence if partial-run status is acceptable.

