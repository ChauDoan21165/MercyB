# V5 Release Gate

**C7 deliverable. Companion to V5_BOUNDARY_RULES.md. Baseline: main at 3be4e6ef1.**

Every V5 implementation PR must satisfy all gates below before merge. C7 is the gatekeeper — no V5 code merges without C7 approval.

---

## 1. CI Gate (automated)

All CI checks must be green:

| Check | Command | Required |
|---|---|---|
| Typecheck | `npm run typecheck` | zero errors |
| Typecheck CI | `npm run typecheck:ci` | zero errors |
| Lint | `npm run lint` | zero errors, zero new warnings |
| Test | `npm test` | all passing |
| Build | `npm run build` | success |
| Rooms check | `npm run rooms:check` | zero failures |
| Module boundaries | `npx depcruise src/lib/placement/v5 --config .dependency-cruiser.cjs` | no violations |

---

## 2. File Scope Gate (C7 review)

C7 verifies the PR diff contains ONLY permitted paths:

**Permitted (no C1 approval needed):**
```
src/lib/placement/v5/**        # V5 analytical modules
docs/placement/v5/**            # V5 documentation
```

**Permitted with C1 approval:**
```
src/components/placement/v5/** # V5 UI components
src/lib/placement/v4/telemetry/CONTRACT_MAP.md  # contract map updates
```

**Forbidden (block merge):**
Everything listed in V5_BOUNDARY_RULES.md §2. Any file outside the permitted landing zone blocks merge.

**Verification command:**
```bash
git diff --name-only origin/main...HEAD | grep -v '^src/lib/placement/v5/\|^docs/placement/v5/' | grep -v '^.git'
# Must return empty (or only C1-approved paths)
```

---

## 3. Runtime Boundary Gate (C7 automated check)

C7 runs these grep checks on the V5 source tree:

```bash
# No Date.now in analytical modules
grep -rn 'Date\.now' src/lib/placement/v5/ --include='*.ts' --include='*.tsx'
# Must return empty

# No Math.random in analytical modules
grep -rn 'Math\.random' src/lib/placement/v5/ --include='*.ts' --include='*.tsx'
# Must return empty

# No fetch/XHR in analytical modules
grep -rn 'fetch(' src/lib/placement/v5/ --include='*.ts' --include='*.tsx'
# Must return empty

# No Supabase SDK in analytical modules
grep -rn 'from.*supabase\|require.*supabase' src/lib/placement/v5/ --include='*.ts' --include='*.tsx'
# Must return empty (Supabase access through approved adapters only)

# No Azure SDK in analytical modules
grep -rn 'from.*azure\|require.*azure' src/lib/placement/v5/ --include='*.ts' --include='*.tsx'
# Must return empty

# No localStorage/sessionStorage in analytical modules
grep -rn 'localStorage\|sessionStorage\|IndexedDB' src/lib/placement/v5/ --include='*.ts' --include='*.tsx'
# Must return empty

# No process.env in browser modules (except Vite's import.meta.env)
grep -rn 'process\.env' src/lib/placement/v5/ --include='*.ts' --include='*.tsx'
# Must return empty

# No window/document/navigator in analytical modules
grep -rn 'window\.\|document\.\|navigator\.' src/lib/placement/v5/ --include='*.ts'
# Must return empty (allowed in .tsx UI components only)
```

---

## 4. Type Boundary Gate (C7 review)

C7 verifies no duplicate type definitions:

- Cross-check all V5 `export type` and `export interface` against V4 telemetry types (65 types in `adaptiveTelemetryTypes.ts` + `types.ts`)
- Cross-check against B5 core types (55 types in `curriculumSequencer.ts` + `learnerMemory.ts` + `progressionSimulator.ts` + `providerRegistry.ts`)
- Verify `…Like` suffix convention is honored — structural contracts owned by the layer that consumes them
- Confirm no V5 module imports from `src/lib/placement/v4/` (namespace isolation)

**Verification:**
```bash
# List all V5 exported types
grep -rn 'export type\|export interface' src/lib/placement/v5/ --include='*.ts' | sed 's/.*export type //;s/.*export interface //;s/ =.*//;s/ {.*//'

# Compare against V4 telemetry types (must have zero overlaps)
grep -rn 'export type\|export interface' src/lib/placement/v4/telemetry/adaptiveTelemetryTypes.ts src/lib/placement/v4/telemetry/types.ts | sed 's/.*export type //;s/.*export interface //;s/ =.*//;s/ {.*//;s/ extends.*//'
```

---

## 5. Import Direction Gate (C7 automated check)

```bash
# V5 must not import from V4
grep -rn "from.*placement/v4" src/lib/placement/v5/ --include='*.ts' --include='*.tsx'
# Must return empty

# V5 must not import from V4 components
grep -rn "from.*components/placement/v4" src/lib/placement/v5/ --include='*.ts' --include='*.tsx'
# Must return empty
```

---

## 6. Package / Scripts Gate (C7 review)

```bash
# package.json must be unchanged
git diff origin/main...HEAD -- package.json
# Must return empty

# package-lock.json must be unchanged unless npm install was required by approved dep change
git diff origin/main...HEAD -- package-lock.json
# Must be empty or accompanied by C7 + C1 approved dependency change

# No new scripts
git diff origin/main...HEAD -- package.json | grep '^+.*"scripts"'
# Must return empty
```

---

## 7. No Artifact Gate (C7 review)

```bash
# No generated/cache/report artifacts in diff
git diff --name-only origin/main...HEAD | grep -E '\.local-backup|\.cache|generated|audit_tmp|room-audio-fixed'
# Must return empty

# No test report artifacts
git diff --name-only origin/main...HEAD | grep -E 'playwright-report|test-results|playwright-smoke-report'
# Must return empty
```

---

## 8. Determinism Gate (C7 review)

For V5 modules claiming deterministic behavior:

- All functions must accept time/seed via parameters (no wall-clock reads)
- All "randomness" must be FNV-1a hash of sorted, deterministic input
- Replay must produce byte-identical output from the same input event log
- Tests must include at least one determinism assertion (same input → same output)

---

## 9. C7 Approval Checklist (in PR body)

Every V5 PR body must include:

```markdown
## C7 Boundary Checklist

- [ ] CI all green (typecheck, lint, test, build, rooms:check)
- [ ] File scope: only `src/lib/placement/v5/` and `docs/placement/v5/`
- [ ] No forbidden files touched (see V5_BOUNDARY_RULES.md §2)
- [ ] Runtime boundary checks pass (no Date.now, Math.random, fetch, Supabase/Azure SDK, storage, process.env, DOM in analytical modules)
- [ ] Import direction: no imports from `src/lib/placement/v4/`
- [ ] No duplicate type definitions with V4 telemetry or B5 core modules
- [ ] No package.json or lockfile changes
- [ ] No generated artifacts in diff
- [ ] Deterministic functions accept time/seed via parameters
- [ ] Tests include determinism assertion (same input → same output)
```

---

## 10. Gate Decision Matrix

| Gate | Owner | Failure Action |
|---|---|---|
| CI Gate | Automated | Block merge, fix CI |
| File Scope Gate | C7 | Block merge, remove forbidden files |
| Runtime Boundary Gate | C7 | Block merge, remove forbidden calls |
| Type Boundary Gate | C7 | Block merge, rename/remove duplicates |
| Import Direction Gate | C7 | Block merge, fix imports |
| Package/Scripts Gate | C7 | Block merge, revert changes |
| No Artifact Gate | C7 | Block merge, remove artifacts |
| Determinism Gate | C7 | Request changes, add parameterization |
| C7 Approval Checklist | PR author + C7 | Block merge until complete |
