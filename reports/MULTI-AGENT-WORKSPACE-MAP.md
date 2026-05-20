# Multi-Agent Workspace Map

Snapshot generated: 2026-05-20

Full active worktree inventory:

- `reports/disk-cleanup-evidence/worktree-map-20260520-072053.tsv`

## Current Shape

- Total registered worktrees in the snapshot: `179`.
- Clean worktrees: `160`.
- Dirty worktrees: `19`.
- Worktrees whose HEAD is associated with at least one `origin/pr/*` ref: `117`.
- Main checkout at snapshot time: `/Users/admin/MercyB`, dirty, branch `reports/a37-shadow-replay-readiness`.
- Report worktree for this task: `/private/tmp/mercyb-disk-cleanup-audit`, branch `reports/disk-cleanup-audit`.

The machine is still in a high-worktree state. That is acceptable as a recovery snapshot, but it is above the recommended operational ceiling in `reports/WORKTREE-LIFECYCLE-POLICY.md`.

## Cleanup Status Categories

| Category | Rule | Cleanup status |
| --- | --- | --- |
| Dirty worktrees | `git status --short` has output | Keep. Commit, stash, archive, or classify before deletion. |
| PR-backed clean worktrees | HEAD appears under `origin/pr/*` | Candidate after PR is merged, closed, or explicitly parked. |
| Remote-branch-backed clean worktrees | HEAD appears on a named remote branch | Candidate after owner confirms branch is not needed locally. |
| Main-contained clean worktrees | HEAD is ancestor of `origin/main` | Highest-priority removal candidates if no local evidence exists. |
| Detached clean worktrees | Detached HEAD, PR-backed or main-contained | Remove after PR/evidence disposition is confirmed. |
| Reports/evidence worktrees | Paths or branches beginning with `reports/`, `docs/`, or containing evidence files | Keep until report is committed/pushed and evidence is durable. |

## Active Worktree Examples

The full active list is in the TSV evidence file. Representative high-signal entries:

| Size | Status | Branch | PRs | Path | Purpose |
| --- | --- | --- | --- | --- | --- |
| `7.8G` | dirty | `reports/a37-shadow-replay-readiness` | none | `/Users/admin/MercyB` | Main checkout with unrelated local report/docs work. Keep. |
| `1.3G` | dirty | `feat/a3-placement-v3-data-quality` | none | `/private/tmp/a3-placement-v3-data-quality` | Dirty placement audit tooling. Keep until classified. |
| `443M` | dirty | `test/A12-billing-client-coverage-ratchet` | `922` | `/private/tmp/A12-billing-client` | Coverage work with generated files. Keep until classified. |
| `443M` | dirty | `test/A12-billing-coverage-ratchet` | `894` | `/private/tmp/A12-billing-tests` | Coverage work with generated files. Keep until classified. |
| `435M` | clean | `ci/A12-coverage-gate` | `884` | `/private/tmp/A12-coverage` | PR-backed CI coverage work. Candidate after PR disposition. |
| `421M` | clean | `feat/a18-recompute-entitlement-writer` | `843,864` | `/private/tmp/A1d-a18-pr1` | Billing PR branch. Keep until PR queue decision. |
| `421M` | clean | `feat/b13ph3-pr-a` | `802` | `/private/tmp/A1-b13ph3-pra` | Billing PR branch. Candidate after PR disposition. |
| `423M` | clean | `a25/bundle-audit-fresh` | none | `/private/tmp/A25-bundle-audit` | Report/audit branch with no PR ref. Keep until report disposition is verified. |
| `380M` | dirty at prior audit | `reports/placement-v3-post-merge-readiness` | none | `/private/tmp/mercyb-placement-v3-report` | Report evidence worktree. Keep until evidence is durable. |
| `367M` | clean | `detached` | main-contained | `/private/tmp/a37-readiness-main` | Main snapshot worktree. Candidate after current reporting work no longer needs it. |

## Associated PR Handling

Associated PRs are inferred from:

```bash
git -C <worktree> branch -r --contains HEAD
```

A worktree can map to multiple PR refs. In that case, use the newest active PR disposition, not the oldest ref, before removing it.

## Recommended Removal Order

1. Clean detached worktrees whose HEAD is already in `origin/main`.
2. Clean PR verification worktrees for merged or closed PR refs.
3. Clean remote-branch-backed worktrees where the branch is intentionally parked on remote.
4. Clean report worktrees only after the report and evidence are committed/pushed.
5. Dirty worktrees only after a human resolves each dirty file.

Never remove dirty worktrees as part of automated cleanup.

## Draft Vs Merged Vs Archived

Use these labels during manual review:

- `merged`: HEAD is contained in `origin/main`; usually removable if clean.
- `draft`: branch has an active PR or active owner; keep unless owner releases it.
- `archived`: durable report/evidence has landed; local worktree can be removed if clean.
- `unknown`: no PR ref and not main-contained; keep until branch owner or report lineage is known.

The snapshot intentionally does not mark all 179 worktrees as final `merged/draft/archived`; it provides enough live branch, PR, clean/dirty, path, size, and last-commit data for a safe review pass without deleting anything.
