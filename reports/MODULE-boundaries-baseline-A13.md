# Module Boundaries Baseline — A13

**Tool:** [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) v17.4.0
**Config:** `.dependency-cruiser.cjs`
**CI job:** `Module Boundaries` (added to `.github/workflows/ci.yml`, NOT in required-checks ruleset yet)
**Scan scope:** `src/` + `supabase/functions/` + `server/`
**Baseline run:** 2026-05-20, against `origin/main @ 10f0b1533`
**Scale:** 1639 modules · 3174 dependencies cruised

---

## TL;DR

| Severity | Count | CI Impact |
|---|---|---|
| **Errors** | **0** (post-grandfather) | Fails the `Module Boundaries` job |
| **Warnings** | **10** | Informational only — never fails CI |

3 ERROR-class violations were found in the raw baseline; all 3 were grandfathered via narrow `pathNot` exceptions on the `no-hooks-to-ui` rule with TODOs pointing to follow-up cleanup. The rule still catches any **new** hook→UI imports going forward.

---

## Forbidden rules (all severity: error)

| Rule | From → To | Status |
|---|---|---|
| `no-ui-to-edge-functions` | `src/components/**` → `supabase/functions/**` | ✅ 0 violations |
| `no-ui-to-server` | `src/components/**` → `server/**` | ✅ 0 violations |
| `no-billing-to-ui` | `src/lib/billing/**` → `src/components/**` | ✅ 0 violations |
| `no-teacher-mercy-to-ui` | `src/lib/teacher-mercy/**` → `src/components/**` | ✅ 0 violations |
| `no-services-to-ui` | `src/services/**` → `src/components/**` | ✅ 0 violations |
| `no-hooks-to-ui` | `src/hooks/**` → `src/components/**` | ⚠️ **3 grandfathered** (see below) |
| `no-src-to-scripts` | `src/**` → `scripts/**` | ✅ 0 violations |
| `no-direct-node-modules` | * → `node_modules/**` | ✅ 0 violations |

## Warning rules (severity: warn)

| Rule | Description | Count |
|---|---|---|
| `no-circular` | Circular dependency cycle detected | **10** |
| `cross-feature-room-to-auth` | room → auth import | 0 |
| `cross-feature-auth-to-room` | auth → room import | 0 |

---

## Grandfathered errors (3) — `no-hooks-to-ui`

These 3 violations are pre-existing in main and grandfathered via the rule's `from.pathNot`. They're real architectural debt but out of scope for this CI-gate PR; each gets a follow-up TODO and a separate cleanup PR can resolve them.

| # | Edge | Why it exists | Suggested fix (separate PR) |
|---|---|---|---|
| 1 | `src/hooks/use-toast.ts` → `src/components/ui/toast.tsx` | shadcn-ui tool-generated pattern — the hook references toast component types | Extract toast types to `src/lib/ui-types.ts` (type-only import) OR refactor the hook to be self-contained |
| 2 | `src/hooks/useTeacherMercy.ts` → `src/components/mercy/MercyAvatar.tsx` | Hook imports component-side avatar types | Move avatar type union to `src/lib/teacher-mercy/types.ts` (already exists) and import from there |
| 3 | `src/hooks/useTeacherMercy.ts` → `src/components/mercy/MercyAnimations.tsx` | Hook imports component-side animation types | Same fix as #2 — move animation type to `src/lib/teacher-mercy/types.ts` |

Grandfather mechanism:

```js
{
  name: 'no-hooks-to-ui',
  severity: 'error',
  from: {
    path: '^src/hooks/',
    pathNot: [
      '^src/hooks/use-toast\\.ts$',         // TODO(A13-followup): #1 above
      '^src/hooks/useTeacherMercy\\.ts$',   // TODO(A13-followup): #2 and #3 above
    ],
  },
  to: { path: '^src/components' },
},
```

Any NEW hook outside this pathNot list that imports from `src/components/` will fail the gate. The grandfather is per-file, not blanket — adding a third grandfathered hook requires explicit editing of this list (i.e., a conscious decision).

---

## Circular dependencies (10 warnings)

Each is informational. They're tracked here so a future refactor PR can pick them off; none gate CI.

| # | Cycle |
|---|---|
| 1 | `supabase/functions/stripe-webhook/core.ts` ↔ `stripe-signature.ts` |
| 2 | `supabase/functions/public-api/handlers/sentenceOfTheDay.ts` ↔ `index.ts` |
| 3 | `supabase/functions/public-api/handlers/publicStats.ts` ↔ `index.ts` |
| 4 | `supabase/functions/public-api/handlers/l1Detect.ts` ↔ `index.ts` |
| 5 | `src/lib/roomLoader.ts` ↔ `roomLoaderSource.ts` |
| 6 | `src/lib/roomLoader.ts` ↔ `roomLoaderNormalize.ts` |
| 7 | `src/lib/roomLoader.ts` ↔ `roomLoaderCache.ts` |
| 8 | `src/lib/languagePair/anonymousPair.ts` → `languagePair.ts` → `providers/AuthProvider.tsx` → back |
| 9 | `src/lib/feedback/l1-error-detector.ts` ↔ `rule-pack-types.ts` |
| 10 | `src/lib/auth.ts` ↔ `authService.ts` |

**Common pattern:** `core.ts` / `index.ts` / `roomLoader.ts` are barrel/orchestrator modules importing their sub-helpers, which in turn import the barrel for types. The standard refactor: extract shared types to a leaf `*-types.ts` file that both ends import from.

**These are pre-existing on main.** The depcruise warning makes them visible without forcing fixes; pick them off opportunistically.

---

## How to extend / tighten

- **Adding a new prohibited edge?** Edit `.dependency-cruiser.cjs` `forbidden[]`, run `npm run depcruise:validate` to confirm clean. New rules ship as a `warn` first, then promote to `error` after 1-week soak.
- **Removing a grandfather exception?** Delete the entry from `pathNot`, run the cleanup refactor in the same PR, confirm `depcruise:validate` is clean, ship.
- **Promoting the CI job to required-check?** After ~1 week of stability:
  1. Verify no recurring false positives in the `Module Boundaries` job over the past week
  2. Add `Module Boundaries` to branch-protection ruleset (`16546337` per memory `project_ci_workflow_consolidation`)
  3. Do NOT rename the job — required-check names are LOCKED once added to the ruleset

---

## Commands cheat-sheet

```bash
# Full graph (text + warnings + errors)
npm run depcruise

# Errors only, CI-style (what the Module Boundaries job runs)
npm run depcruise:validate

# Module-count + per-folder metrics (informational)
npm run depcruise:metrics

# One-off ad-hoc graph for a single directory
npx depcruise --config .dependency-cruiser.cjs --output-type err src/lib/billing
```
