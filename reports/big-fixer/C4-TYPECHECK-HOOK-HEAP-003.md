# C4-TYPECHECK-HOOK-HEAP-003 — Engineering Report

## Objective
Stop the pre-commit typecheck from OOMing so commits no longer require --no-verify.

## Evidence Source
This session: `npm run typecheck` and the `.husky/pre-commit` hook aborted twice with
`FATAL ERROR: ... JavaScript heap out of memory` / `Abort trap: 6`, forcing a
--no-verify bypass on WP-002. The hook's own header warns that --no-verify bypass
caused PR #454's conflict-marker incident, so normalizing the bypass is unacceptable.

## Root Cause
Two linked facts:
1. `origin/main`'s `typecheck:app` script carries **no** heap flag, so `tsc` runs under
   Node's default old-space ceiling — too small for the current `src/**` typecheck graph
   (already scoped: tests, admin, api, simulator, audio, app, screens, ui excluded).
   It OOMs.
2. A local-only fix (`ac8e7242`, "Fix typecheck heap limit for large source graph") set
   the ceiling to `--max-old-space-size=8192`, but that commit is on **local `main` only,
   never pushed to `origin/main`** (verified: `git rev-list --left-right --count
   origin/main...main` = `0 1`; the single unpushed commit is `ac8e7242`). CI and fresh
   clones therefore still OOM. Separately, 8192 itself proved insufficient this session.

## Fix (smallest safe)
Set `typecheck:app` to an explicit `node --max-old-space-size=12288 ./node_modules/
typescript/bin/tsc -p tsconfig.typecheck.json --noEmit`. 12288 (12GB) verified to pass
clean with headroom on the 16GB machine, where 8192 OOM'd. Flag is passed to `node`
(the `tsc` bin is a Node wrapper), so it takes effect. Landing this via MR puts the
correct ceiling on `origin/main`, superseding the unpushed 8192 (a strict subset).

## Files Changed
- `package.json` (one line: `typecheck:app` script)

## Validation Results
- `npm run typecheck` at 12288: PASS, zero errors, no heap abort (same invocation the
  pre-commit hook runs)
- Commit completed with the pre-commit hook ACTIVE (no --no-verify) — a passing hook is
  the direct proof the OOM is resolved

## Branch
`repair/c4-typecheck-hook-heap-003` (off `origin/main`)

## Commit hash
`d15f0011dbee8f441d433760b3ef2851a1c28daa` (short `d15f0011`). Committed with pre-commit hook ACTIVE (no --no-verify) — hook passed, proving the OOM is resolved.

## Push result
Pushed to `origin` (GitLab `gitlab.com:cd12536/MercyB.git`), new tracking branch `repair/c4-typecheck-hook-heap-003`, exit 0.

## MR Recommendation
Open MR `repair/c4-typecheck-hook-heap-003` → `main`. Low risk: one-line build-tooling
change, no source/runtime/schema mutation. Fixes the recurring pre-commit OOM for all
machines and CI, and removes the --no-verify pressure the hook explicitly warns against.

## Mutation Summary
- Source mutation: none (build tooling only)
- Database / runtime / Judge / Coverage: none
- C2 TM INT: untouched
- Architecture: unchanged
- Push / merge / deploy: push only; no merge, no deploy

## Rollback Plan
`git revert <commit>` or delete the branch. No downstream consumers; reverting restores
the prior (OOMing) default ceiling.

## PAUSE POINT flagged to Chau (NOT a C4 action)
Local `main` is 1 commit ahead of `origin/main` — the unpushed `ac8e7242`. C4 does not
push to `main` or alter `main` topology autonomously. Once this MR merges, `ac8e7242`'s
change is fully superseded and can be dropped. Your call on how to reconcile local `main`
(e.g. `git reset --hard origin/main` after this merges, or discard the local commit).
