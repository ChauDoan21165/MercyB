# A8 — app-shared chunk extraction (recon-only, abort)

**Date:** 2026-05-13
**Branch:** `perf/extract-app-shared-chunk` (created, then abandoned without code changes)
**Worktree:** `/private/tmp/a-perf-refactor`
**Outcome:** **Aborted per Phase 2 bucket 3 — not resolvable in one PR.** No code changes shipped beyond this report.

## TL;DR

A controlled experimental `manualChunks` rewrite confirmed both prior findings from `reports/a7-bundle-audit.md`:

1. The `Circular chunk: app-shared -> vendor -> app-shared` warning persists even after extracting the most plausible cycle-causing packages (`@tanstack/*` and `sonner`) from `vendor` into their own chunks.
2. Critical-path gzipped goes **UP** in the experimental config, not down, because `mercy-guide` is still statically imported by `AppShell.tsx` — the new `app-shared` chunk piggybacks on the critical path instead of replacing the utilities currently inside `mercy-guide`.

To make this refactor land cleanly we need:

- A precise identification of which module in `vendor` creates the back-edge into `app-shared` (the experimental config eliminated `@tanstack` and `sonner`, but the warning persists, so the cycle source lies elsewhere).
- Coordinated changes across `vite.config.ts` + `AppShell.tsx` + likely 2–3 import-path edits in app code to actually break the cycle without re-introducing duplication.
- Manual verification across auth / Sentry / Supabase / feature-flag / chunk-recovery surfaces.

The brief's gate (≥10 KB gz reduction on critical-path, no circular-chunk warnings) cannot be met in a single PR with the data currently available. Per the brief's Phase 2 bucket 3, work is stopped and this report documents the multi-PR plan below.

## Phase 1 — Dependency map of the 8 candidate files

Top-level imports of each file the brief listed (excluding type-only imports and tests):

| File | Imports from `node_modules` | Imports from `src/` |
|---|---|---|
| `src/lib/monitoring/sentryInit.ts` | (dynamic only: `await import("@sentry/react")`) | `@/lib/security/piiProtection` |
| `src/providers/AuthProvider.tsx` | `react`, `@supabase/supabase-js` (type-only) | `@/lib/supabaseClient`, `@/lib/auth/anonymousBootstrap`, `@/lib/platform`, `@/services/userSessions`, plus several more |
| `src/lib/supabaseClient.ts` | `@supabase/supabase-js` | — |
| `src/lib/authService.ts` | `@supabase/supabase-js` (type-only) | `@/lib/supabaseClient`, `@/lib/constants/tiers`, `@/lib/auth` |
| `src/lib/chunkLoadError.ts` | (none) | (none — pure utility) |
| `src/lib/featureFlags.ts` | (none) | (none — pure constants) |
| `src/services/pointsService.ts` | (none) | `@/lib/supabaseClient`, `@/lib/featureFlags`, `@/lib/streakCache` |
| `src/services/behaviorTrackingFlag.ts` | (none) | `@/lib/supabaseClient` |

**Direct node_modules deps land in:** `supabase` (matched), `sentry` (matched, dynamic), `react` (matched). **None land in `vendor`.** So the cycle isn't from these 8 files importing vendor directly.

The cycle must therefore come from one of the *expanded* candidates A2 included (per a7 line 267: `lib/queries/`, `lib/security/`, `lib/streakCache`, `lib/streakMigration`, `lib/lazyWithRetry`, `lib/utils`, `lib/platform`, `lib/referral/`, `services/`). Or from Rollup's chunk-inlining heuristic moving small modules between buckets to break duplication.

## Phase 2 — Experimental config + measured deltas

I attempted **one** experimental `manualChunks` shape, designed to isolate the cycle source:

```ts
// Pulled the most plausible cycle suspects out of `vendor` so any back-edge
// from those into app-shared would now route through their own chunks.
if (s.includes('/node_modules/@tanstack/')) return 'tanstack';
if (s.includes('/node_modules/sonner/'))    return 'sonner';

// Standard vendor catch-all stays as-is for everything else.
if (s.includes('/node_modules/')) return 'vendor';

// Explicit app-shared rule (superset of A2's enumerated list).
if (
  /\/src\/lib\/(monitoring|auth|queries|security|referral)\//.test(s) ||
  /\/src\/lib\/(featureFlags|supabaseClient|authService|streakCache|streakMigration|chunkLoadError|lazyWithRetry|utils|platform)\.ts$/.test(s) ||
  /\/src\/services\//.test(s) ||
  /\/src\/providers\/AuthProvider\./.test(s)
) {
  return 'app-shared';
}
```

### Build output

```
Circular chunk: app-shared -> vendor -> app-shared.
  Please adjust the manual chunk logic for these chunks.
Circular chunk: mercy-grammar-tab -> mercy-guide -> mercy-grammar-tab.
  Please adjust the manual chunk logic for these chunks.
```

**Two cycles surfaced.** The `mercy-grammar-tab ↔ mercy-guide` one is a separate app-code cycle and not the target of this refactor. The `app-shared ↔ vendor` one is what we're trying to break — and it **persisted** after extracting `@tanstack` + `sonner`.

### Critical-path size delta (gzipped)

| chunk | baseline gz | experimental gz | Δ |
|---|---:|---:|---:|
| `index-*` (entry) | 29.37 KB | 27.46 KB | −1.91 KB |
| `vendor` | 85.02 KB | 63.72 KB | −21.30 KB |
| `mercy-guide` (still eager) | 35.89 KB | 25.54 KB | −10.35 KB |
| `app-shared` (NEW, eager) | — | ~20 KB (estimated from 65.67 KB raw) | +20.00 KB |
| `tanstack` (NEW, eager) | — | ~12 KB (estimated from 38.49 KB raw) | +12.00 KB |
| `sonner` (NEW, eager) | — | ~10 KB (estimated from 33.83 KB raw) | +10.00 KB |
| `react`, `ui`, `supabase` | (unchanged) | (unchanged) | 0 |
| **Net critical-path** | | | **≈ +8 KB gz** |

The new chunks are statically imported via the existing `import { MercyGuide } from "@/components/MercyGuide"` in `src/components/layout/AppShell.tsx` (line 13), so they all sit on the homepage critical path. The savings inside `vendor` and `mercy-guide` are more than offset by the three new always-eager chunks.

### Cycle source — still undetermined

Extracting `@tanstack/*` and `sonner` from `vendor` did not break the `app-shared ↔ vendor` cycle. The remaining `vendor` bundle (63.72 KB gz) is the back-edge source. Identifying the exact module would require:

- Parsing `dist/bundle-stats.html` and tracing imports module-by-module, OR
- Adding `experimental.preserveSymlinks` style debug output to Rollup, OR
- Manually bisecting `vendor` package-by-package until the cycle disappears.

None of these are 5-minute investigations.

## Why this can't ship in one PR

1. **The cycle isn't resolved.** The brief's "no `Circular chunk` warnings in build output" gate fails. Even with my best-guess fix (extracting `@tanstack` + `sonner`), the warning persists with the same `app-shared → vendor → app-shared` shape, meaning the cycle source is some other `vendor` resident.
2. **Critical-path went up, not down.** The brief's "≥10 KB gz reduction" gate fails in the experimental config. To get a *positive* critical-path delta, `<MercyGuide />` also has to be lazy-imported from `AppShell.tsx` (so the `app-shared` chunk replaces `mercy-guide` on the critical path instead of supplementing it). A7 already verified that lazy-importing `MercyGuide` alone moves zero bytes (line 266) — the lazy import and the chunk split must ship together.
3. **The combined refactor surface is wide.** vite.config.ts (load-bearing — flagged in CLAUDE.md as a "central file") + `AppShell.tsx` + potentially `vite.config.ts`'s `optimizeDeps` + import-path edits to break the cycle source = 3–5 coordinated commits with cross-cutting risk to auth, Sentry init, chunk recovery, and PWA precaching.
4. **The upside is modest.** A7's estimate: ~13–18 KB gz off critical path ≈ ~30–45 ms LCP improvement on Slow 4G. The risk-to-reward ratio doesn't justify a heroic one-PR ship.

## Proposed multi-PR plan

| # | Scope | Risk | Estimated win |
|---|---|---|---|
| **A8-1** | **Recon-deep: identify the cycle source.** Add temporary `console.log` instrumentation to `manualChunks` or write a small Rollup-pre-emit plugin that prints every module's resolved chunk + its parent edges. Build, identify the exact module in `vendor` that imports from `app-shared`. Document. Revert. | Low — no shipped code. | 0 (recon) |
| A8-2 | **Break the cycle at its source.** Once A8-1 identifies the offending module, the fix is one of: (a) move it to a separate manualChunk; (b) move the app-shared symbol it imports into a separate, lower-level chunk; (c) refactor the import path. Build, confirm cycle gone, no critical-path change. | Medium — vite.config.ts edit. | 0 (sets stage) |
| A8-3 | **Extract `app-shared` + lazy-load `MercyGuide` in `AppShell.tsx`.** With the cycle resolved by A8-2, this PR can land the manualChunks rule + the `lazyWithRetry` import in `AppShell.tsx`. | High — touches AuthProvider, Sentry, feature flags, chunk recovery via the new chunk topology. Needs manual smoke testing. | ~13–18 KB gz off critical-path = ~30–45 ms LCP on Slow 4G. |

A8-1 is sequencable today; A8-2 depends on A8-1; A8-3 depends on A8-2.

## Risk assessment per file (if this had shipped)

| File | Risk | Mitigation needed |
|---|---|---|
| `vite.config.ts` | High — central file. A manualChunks edit can silently regress every route's chunk graph. | Bundle-size diff in CI; before/after `bundle-stats.html` comparison; PR review must run the manual smoke list. |
| `src/components/layout/AppShell.tsx` | Medium — top-of-tree component. A lazy boundary here renders nothing until MercyGuide loads; need `<Suspense fallback={null}>` or equivalent. | E2E test for `/` rendering MercyGuide section. |
| `src/providers/AuthProvider.tsx` | High — gates auth state. If moved into `app-shared` and the chunk loads late, `useAuth()` callers race the boot. | Smoke-test sign-in / sign-out / refresh-while-signed-in. |
| `src/lib/monitoring/sentryInit.ts` | High — error capture. If `initSentry()` is delayed by chunk loading, the first error of a session may not be captured. | Verify `[sentry] initialized` log appears before any user interaction; check Sentry dashboard for first-error timestamp regressions. |
| `src/lib/preloadRecovery.ts` (PR #417) | Medium — must keep firing even if `scheduleOneTimeChunkReload` ends up in a different chunk than `preloadRecovery`. | Manual chunk-block test in DevTools. |
| `src/lib/queries/*` | Medium — singleton `QueryClient` from PR #393. If it gets duplicated across chunks, every component gets its own client and the cache is dead. | Module-identity test (singleton check). |

## Files changed

- `reports/a8-app-shared-refactor.md` — this file.

**No code changes shipped.** The experimental `vite.config.ts` was reverted in-worktree before exit.
