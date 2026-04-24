# CC7 — CI Diagnosis (read-only, no fixes applied)

**Author:** CC7
**Date:** 2026-04-24
**Scope:** diagnosis only. No workflow or source file has been modified.
**Sample runs used:** main @ `c4a3103b` (docs) and PR branch `fix/typecheck-test-files` @ `329e91bd` (CC6's in-flight PR #48? — branch tip, not merged).

CI on `main` is fully red. Every push to `main` in the last 18 hours has failed across most workflows. One workflow (`Ensure Package Lock File`) passes; every other workflow that runs JS (tests, build, validators) fails before doing its real work.

This document groups the failures by root cause and ranks them into Tier 1 (must fix to unblock merges / deploys), Tier 2 (important hygiene, not on the hot path), Tier 3 (cosmetic / noise).

---

## Failure inventory (per workflow)

Grouped by what actually went wrong, not by which workflow wrapped it.

### Root cause A — `@rollup/rollup-linux-x64-gnu` missing after `npm ci`

Affected workflows (all jobs that run JS after `npm ci`):

- `Vitest Unit & Integration Tests` (`vitest.yml`) — `npx vitest run --coverage` crashes at startup.
- `Test Suite` (`test.yml`) — `npm test` crashes identically. Downstream `integration-tests` job also inherits the failure.
- `Playwright Visual Regression Tests` (`playwright.yml`) — Playwright `webServer` can't start (`npm run dev` → rollup crash → webServer exit 1 → Playwright aborts).
- `Preview Deployment` (`preview-deployment.yml`) — `npm run build` fails inside `vite build` at the rollup native module load.
- `Production Deployment` (`production-deploy.yml`) — fails earlier in CI Pipeline (TypeScript, root cause B), but would also hit this on build step.
- `Deploy with Auto-Rollback` (`deploy-with-rollback.yml`) — same shape.

Canonical error:
```
Error: Cannot find module @rollup/rollup-linux-x64-gnu.
npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828).
Please try `npm i` again after removing both package-lock.json and node_modules directory.
```

**Diagnosis:** `package-lock.json` *references* `@rollup/rollup-linux-x64-gnu@4.60.1` in the optional-dependencies list of `rollup@4.60.1`, but it has **no `node_modules/@rollup/rollup-linux-x64-gnu` installed-form entry**. Grep confirms: `grep -n "node_modules/@rollup/rollup-linux-x64-gnu" package-lock.json` → zero matches, while other platform variants (arm64, musl, etc.) are present in the declaration list but similarly absent from the installed tree.

This is the classic npm optional-deps-loss bug: someone ran `npm install` on macOS (arm64) — likely during a local dep bump — and the resulting lockfile dropped the Linux-x64 platform installation entries. `npm ci` then faithfully reproduces the broken lockfile on Linux runners, so rollup can't find its native binary.

Local lockfile mtime: `22 Apr 14:26`. First failing CI Pipeline run on main: `24 Apr 01:xx`. Every run since then exhibits the same stack trace — this is not flaky, it's deterministic.

### Root cause B — ~30 TypeScript errors in test files

Affected workflows:
- `CI Pipeline` (`ci.yml`) — fails at `npx tsc --noEmit`.
- `Deploy with Auto-Rollback` / `Production Deployment` — both run `npx tsc --noEmit` before building.
- `Preview Deployment` — same step.

Error shape (all in `src/**/__tests__/`):
- `src/components/speech/__tests__/SpeechDrill.test.tsx:92` — resolver type mismatch (`RecognitionResult` vs `unknown`).
- `src/components/streak/__tests__/StreakHistoryPanel.test.tsx` (3 hits) — `null` not assignable to `string | undefined`.
- `src/services/__tests__/*.test.ts` (behaviorTrackingFlag, featureFlagsAdmin, roomProgress, speechHistory, userBehavior, userSessions) — `TS2556: A spread argument must either have a tuple type or be passed to a rest parameter.` (mock-builder pattern).
- `src/services/__tests__/speechAttempts.test.ts` — ~25 cascading errors: `TS2554`, `TS2741: phonemeFeedback missing` (after Wave 2 phoneme feedback shape change), `TS2493` tuple-at-index-0 on empty tuple, repeated `TS18048: row is possibly undefined`.

**Diagnosis:** CC6's PR `fix/typecheck-test-files` (our current working branch, tip `329e91bd`) exists precisely to fix these. Its TypeScript step on CI Pipeline passes on the PR branch — so the fix is real. It just hasn't merged to `main`. Until it does, every PR built against main inherits the same ~30 errors because CI checks out the merge commit.

### Root cause C — Deprecated GitHub Action versions (`actions/upload-artifact@v3`)

Hard-failing before any real work runs, because GitHub started auto-failing v3 actions in early 2026.

Affected workflows (from `grep -l "upload-artifact@v3\|checkout@v3\|setup-node@v3"`):
- `launch-sim.yml` — uses `checkout@v3`, `setup-node@v3`, `upload-artifact@v3`. Fails at "Prepare all required actions".
- `performance-ci.yml` — uses `checkout@v3` / `setup-node@v3` across all 5 jobs (validate, lint, test, bundle-size, lighthouse).
- `room-validation.yml` — `checkout@v3`, `setup-node@v3`.
- `roommaster.yml` — `checkout@v3`, `setup-node@v3`, `upload-artifact@v3`.
- `validate-single-room.yml` — same pattern.
- `validate-json.yml` — same pattern.

Canonical error:
```
This request has been automatically failed because it uses a deprecated version of
`actions/upload-artifact: v3`. Learn more:
https://github.blog/changelog/2024-04-16-deprecation-notice-v3-of-the-artifact-actions/
```

### Root cause D — `validate-rooms-ci.js` is CommonJS in an ESM package

Workflow: `Validate JSON` (`validate-json.yml`), step "Run node scripts/validate-rooms-ci.js".

Error:
```
ReferenceError: require is not defined in ES module scope, you can use import instead
This file is being treated as an ES module because it has a '.js' file extension and
'/home/runner/work/MercyB/MercyB/package.json' contains "type": "module".
```

`package.json` declares `"type": "module"`, and `scripts/validate-rooms-ci.js` opens with `const fs = require('fs'); const path = require('path');`. The sibling validator `scripts/validate-room-files.js` is correctly written as ESM (`import fs from 'fs'`). This script was missed when the project moved to ESM.

This workflow *also* uses deprecated v3 actions (root cause C), so on main it fails twice — first at action setup, then would fail again at the script load.

### Root cause E — `scripts/validate-room-files.js` rejects kids/legacy filenames

Workflow: `RoomMaster Validation` (`roommaster.yml`), plus `validate-and-update-registry.yml`'s strict step.

Output:
```
❌ VALIDATION FAILED: 1413 error(s) in 473 file(s)
✅ Valid files: 3
🚫 DEPLOYMENT BLOCKED - Fix errors before publishing
```

**Diagnosis:** The script's `validateFilename` regex requires every `public/data/*.json` to end with `_free|_vip\d+|_kidslevel\d+.json`. Real content in the repo ships with other suffixes — `_kids_l1.json`, `_kids_l2.json`, `vip6_*.json` (prefix-style, not suffix), `zhuge_liang_vip9_vols.json`, etc. This is a policy/code mismatch, and the project has explicitly dropped the VIP-tier model (see CLAUDE.md non-negotiable #5: "No VIP tier"). The validator is enforcing a naming convention that the content library abandoned.

Separately, 473 "STRUCTURE] Missing title" / "Too few entries" errors — the validator wants a schema that part of the library doesn't emit. The canonical validator for the build is `scripts/validate-rooms.mjs` (MB_VALIDATE_CORE_ONLY), which passed cleanly on the same commit (0 errors, 475 files). So `validate-room-files.js` is stale — it diverged from the actual shipped room schema.

### Root cause F — Room validation workflow has no Supabase secrets

Workflow: `Room Validation CI` (`room-validation.yml`), step "Validate rooms database":
```
❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables
```

The job passes `${{ secrets.VITE_SUPABASE_URL }}` / `${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}` to `validate-rooms-db.ts`, but both resolve to empty strings at runtime — the secrets aren't set on this repo, or aren't available to pull requests from forks. This workflow has never successfully connected.

### Root cause G — `actions/github-script` 403 "Resource not accessible by integration"

Workflows: `Playwright Visual Regression Tests`, `Mutation Testing` (comment-on-PR step).

Post-failure comment steps try to POST to `/issues/{n}/comments` and get `403 Resource not accessible by integration` because the workflow isn't declared with `permissions: pull-requests: write`. `preview-deployment.yml` gets this right for its comment job; `playwright.yml` and `mutation-testing.yml` don't.

This is purely cosmetic noise — it's the last step, after the *real* failure has already been reported by the earlier step. Fixing it only cleans up the error banner.

### Root cause H — `sync-data.yml` fails with `log not found`

`gh run view 24906365686` returns "failed to get run log". This happened on `push` with a branch name that matches `main|master` but the workflow only triggers on paths matching `public/data/**/*.json` — the commit that triggered it (CC6's tests-only commit) doesn't touch those paths. Run was almost certainly skipped/canceled then mis-surfaced as "failure" in `gh run list`. Not an actual regression — but also not a trustworthy signal right now.

---

## Tier 1 — Unblocks merges, deploys, and every other fix (do first)

These four changes, taken together, get `main` back to green on the critical path (CI Pipeline + Production Deployment + Deploy with Auto-Rollback + Vitest + Test Suite + Preview Deployment).

1. **Regenerate `package-lock.json` to restore Linux-x64 rollup entry.** (Root cause A.)
   Run `rm -rf node_modules package-lock.json && npm install` on a clean checkout, commit the new lockfile. Verify `grep '"node_modules/@rollup/rollup-linux-x64-gnu"' package-lock.json` returns a hit. This single change unblocks six red workflows.

2. **Merge CC6's `fix/typecheck-test-files` PR.** (Root cause B.)
   The fix exists at HEAD of our current branch. Until it lands on `main`, the main branch remains red even if rollup is fixed. No CC7 work needed here — this is just queueing CC6's PR for merge. (Confirm the branch's tsc step actually passes after the rollup fix is applied on top of it — the rollup crash currently masks whether B is fully resolved on the PR branch.)

3. **Upgrade deprecated GitHub Actions (v3 → v4) across the six workflows in root cause C.**
   `checkout@v3` → `@v4`, `setup-node@v3` → `@v4`, `upload-artifact@v3` → `@v4`. Mechanical rename. Six files: `launch-sim.yml`, `performance-ci.yml`, `room-validation.yml`, `roommaster.yml`, `validate-single-room.yml`, `validate-json.yml`. No behavior change.

4. **Decide what `Room Validation CI` does without secrets.** (Root cause F.)
   Either: (a) set `VITE_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` as repo secrets, or (b) skip `validate-rooms-db.ts` on PR runs and only run it on `push` to main, or (c) delete this workflow — `validate-rooms.mjs` (part of `npm run build`'s prebuild hook) already validates every room file locally without Supabase. Recommendation: (c), since it duplicates coverage. **Needs Chau's call — not a pure mechanical fix.**

**After Tier 1:** main's CI pipeline, tests, and deploy workflows all go green. Remaining red workflows are all tier 2/3.

## Tier 2 — Fix the stale validators (code lies about what the library is)

5. **`scripts/validate-rooms-ci.js` — port to ESM.** (Root cause D.) Change `const fs = require('fs'); const path = require('path')` to `import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url'; const __dirname = path.dirname(fileURLToPath(import.meta.url));`. 2-line script-top change. Also remove `module.exports` / CJS-only patterns inside.

6. **`scripts/validate-room-files.js` — retire or realign with shipped schema.** (Root cause E.) It enforces a tier-suffix filename convention the project has moved past (CLAUDE.md rule #5: no VIP tier), and a structure check that's stricter than `validate-rooms.mjs`. Two options:
   - **Recommended:** delete the workflow step that calls it and treat `validate-rooms.mjs` (which passes cleanly on 475 files) as the canonical validator.
   - Or: rewrite the filename regex to match actual content naming (`_kids_l1.json`, `vip6_*.json`, `*_free.json`, etc.) and relax structure checks to match what content agents actually produce.

   Either way, **needs Chau's call** — it's a policy question about which validator is authoritative.

## Tier 3 — Noise reduction, do last

7. **Add `permissions: pull-requests: write` to `playwright.yml` and `mutation-testing.yml`.** (Root cause G.) Eliminates the 403 comment-step spam on failure. Does not change whether the underlying test passed.

8. **Tighten `sync-data.yml` triggers or stop treating its log-less runs as failures.** (Root cause H.) Low priority — this workflow only runs when `public/data/**/*.json` changes, which is rare, and the "failures" don't block anything.

9. **Dependency hygiene (out of scope for unblocking, flag only):** `npm ci` logs 1 low / 14 moderate / 33 high vulnerabilities, `rollup-plugin-visualizer@7.0.1` wants Node ≥22 (CI runs 20), several actions pin `node-version: 18` (Supabase SDK will drop 18). None of these *cause* today's red CI, but they'll bite within weeks.

---

## What CC7 recommends doing next

- Tier 1 items 1, 2, 3 are mechanical. CC7 can land them in one PR (lockfile regen + action version bumps) and unblock everything else.
- Tier 1 item 4 and Tier 2 items 5–6 need a Chau decision before CC7 touches them — they're policy calls about validator ownership and secret management, not bug fixes.
- Tier 3 items can sit in a backlog issue.

CC7 is waiting for Chau's go-ahead on the Tier 1 mechanical PR before writing any workflow change. Per the task brief: **no fixes applied yet.**
