# Placement v3 Integration Conflicts

Date: 2026-05-20  
Branch: `feat/placement-v3-integration`

## Merge Order Used

1. `origin/design/A22-placement-v3`
2. `origin/feat/placement-v3-vn-l1-taxonomy`
3. `origin/feat/placement-v3-storage`
4. `origin/feat/placement-v3-prompts-and-calibration`
5. `origin/feat/placement-v3-grade-writing`
6. `origin/feat/placement-v3-recommender`
7. `origin/feat/placement-v3-session-orchestrator`
8. A29 speaking/reading/listening graders: not merged, not available on `origin`
9. `origin/feat/placement-v3-mercy-conversation`
10. `origin/feat/placement-v3-ui`

## Content Conflicts

No Git content conflicts occurred while merging the available branches.

## Operational Notes

- The first attempt to merge `origin/feat/placement-v3-mercy-conversation` failed with `fatal: Unable to write index`.
- `git status` showed no partial merge state and disk space was still available.
- Re-running the merge succeeded cleanly.
- Resolution: no file-level resolution was needed; this was treated as a transient index write failure.

## Missing PR / Branch Gap

- The requested A29 speaking + reading + listening graders PR was not available on `origin`.
- Local branch `feat/placement-v3-multi-modality-calibration` exists, but it points at the same commit as `origin/feat/placement-v3-grade-writing` and does not contain speaking/reading/listening grader functions.
- Resolution: do not recover untracked files from another worktree in this integration branch. The orchestrator keeps thoughtful non-writing grader fallbacks that match `GraderInput -> GraderResult`, and the gap is documented in `placement-v3-integration-status.md` / `placement-v3-integration-bugs.md`.
