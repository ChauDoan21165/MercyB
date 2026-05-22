# V5 Deployment Checklist

**C7 deliverable. Companion to V5_BOUNDARY_RULES.md and V5_RELEASE_GATE.md. Baseline: main at 3be4e6ef1.**

This checklist governs the deployment of V5 code from merge to production. Run before any V5 reach main and before any V5-enabled deploy.

---

## 1. Pre-Merge Verification

### 1.1 Branch State
- [ ] Branch is rebased on latest `origin/main`
- [ ] No merge conflicts
- [ ] `git status --short` shows only V5-permitted paths
- [ ] Branch name follows convention: `feat/v5-*` or `fix/v5-*`

### 1.2 CI Gates
- [ ] `npm run typecheck` — zero errors
- [ ] `npm run typecheck:ci` — zero errors
- [ ] `npm run lint` — zero errors, zero new warnings
- [ ] `npm test` — all passing
- [ ] `npm run build` — success
- [ ] `npm run rooms:check` — zero failures
- [ ] `npx depcruise src/lib/placement/v5 --config .dependency-cruiser.cjs` — no violations

### 1.3 C7 Boundary Gates
- [ ] File scope: only `src/lib/placement/v5/` and `docs/placement/v5/` in diff
- [ ] No forbidden files from V5_BOUNDARY_RULES.md §2 touched
- [ ] Runtime boundary checks pass (no Date.now, Math.random, fetch, Supabase/Azure SDK, storage, process.env, DOM)
- [ ] Import direction: zero imports from `src/lib/placement/v4/`
- [ ] No duplicate type definitions with V4 telemetry or B5 core types
- [ ] No package.json or lockfile changes (unless C1-approved)
- [ ] No generated artifacts in diff

### 1.4 V4 Non-Regression
- [ ] All existing V4 tests pass (`npm test -- src/lib/placement/v4/`)
- [ ] V4 telemetry barrel exports unchanged all still resolve
- [ ] V4 contract map (`CONTRACT_MAP.md`) unchanged
- [ ] V4 providerRegistry decision records unchanged
- [ ] B5 module exports unchanged
- [ ] No V4 import paths broken
- [ ] TypeScript paths (`@/lib/placement/*`) still resolve correctly

### 1.5 Determinism
- [ ] New deterministic functions accept time/seed via parameters
- [ ] New "random" behavior uses FNV-1a of sorted input
- [ ] At least one replay test passes (same input → same output)

---

## 2. Merge Gate

### 2.1 Approval Chain
- [ ] C2 contract inheritance approved (if V5 introduces new contracts)
- [ ] C5 provider plan approved (if V5 adds providers)
- [ ] C6 evaluation plan approved (if V5 adds new evaluation paths)
- [ ] C7 boundary audit approved (this checklist, all items checked)
- [ ] C1 final sign-off

### 2.2 PR State
- [ ] PR title describes V5 scope accurately
- [ ] PR body includes completed C7 Boundary Checklist (from V5_RELEASE_GATE.md §9)
- [ ] All PR review comments resolved
- [ ] No outstanding change requests
- [ ] CI all green on latest commit
- [ ] Branch up-to-date with `origin/main`

---

## 3. Post-Merge Verification

### 3.1 Main Integrity
- [ ] Merge commit is clean (no conflicts, no squashed forbidden files)
- [ ] `npm run typecheck` passes on main
- [ ] `npm run build` succeeds on main
- [ ] `npm test` all passing on main

### 3.2 V5 Module Resolution
- [ ] `src/lib/placement/v5/index.ts` barrel exports all V5 public surface
- [ ] All V5 imports resolve at build time (no missing modules)
- [ ] No circular imports between V5 modules
- [ ] No V5 → V4 import paths in the build graph

### 3.3 Bundle Impact
- [ ] V5 does not pull V4 code into new chunks (lazy-loaded boundaries respected)
- [ ] No unexpected bundle size increase from V5 additions
- [ ] V5 code is tree-shakeable (no side-effect imports at module scope)

---

## 4. Pre-Deploy Verification (before enabling V5 in production)

### 4.1 Environment
- [ ] Staging deploy succeeds
- [ ] V5 analytical paths not called in production until explicitly enabled
- [ ] Feature flag (if used) defaults to OFF
- [ ] Supabase/backend changes (if any) deployed to staging first

### 4.2 Smoke Tests
- [ ] V5 analytical functions produce expected output on staging data
- [ ] No runtime errors in V5 code paths when exercised
- [ ] V5 does not mutate V4 state unexpectedly
- [ ] V4 flows continue to work unchanged alongside V5 code

### 4.3 Performance
- [ ] No new long tasks introduced by V5
- [ ] No synchronous blocking operations in V5 modules
- [ ] V5 modules load lazily (dynamic `import()`) if not on critical path

---

## 5. Rollback Criteria

Roll back the V5 deploy if ANY of:

- [ ] V5 code causes a runtime exception in production
- [ ] V4 telemetry/analytics produce different results after V5 activation
- [ ] Bundle size increase exceeds 5% of previous build
- [ ] Build fails or CI goes red after V5 merge
- [ ] V5 introduces a new dependency that breaks mobile builds
- [ ] V5 PII leak detected (userIdHash contains raw identifiers)
- [ ] V5 vendor I/O detected in analytical modules (Supabase/Azure SDK calls)
- [ ] Any V5 module imports from `src/lib/placement/v4/` at runtime

### Rollback Procedure
1. Revert the V5 merge commit on main
2. Verify `npm run typecheck && npm run build` passes
3. Deploy the reverted main
4. Notify C1 and all C-series agents
5. C7 conducts post-rollback boundary audit before re-attempt

---

## 6. Post-Deploy Success Criteria

V5 deployment is successful when ALL of:

- [ ] All CI gates remain green on main for 24+ hours after V5 merge
- [ ] No new Sentry errors attributed to V5 code paths
- [ ] No V4 regression reports within 48 hours
- [ ] Bundle size within acceptable threshold
- [ ] Mobile builds (iOS/Android) succeed with V5 code present
- [ ] V5 analytical functions produce correct output on production data
- [ ] C6 evaluation confirms V5 outcomes match or exceed V4 baseline
- [ ] C7 boundary audit confirms zero runtime violations after 7 days

---

## 7. C7 Post-Deploy Sign-Off

```
C7 STATUS: V5 DEPLOYMENT [PASSED / BLOCKED / ROLLED BACK]
DATE: [YYYY-MM-DD]
BUILD: [commit hash]
VIOLATIONS FOUND: [none / list]
ACTION: [release / rollback / hold]
```
