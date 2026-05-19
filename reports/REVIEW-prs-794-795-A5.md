# Review — PRs #794 + #795 (perf/bundle set, batch 2)

**Reviewer:** A5 (read-only)
**Worktree:** `/private/tmp/A5-review-perf-prs` (`review/perf-prs-readonly`, off `origin/main` @ `6b7d07490`)
**Date:** 2026-05-19

---

## Headline verdicts

| PR | Title | Verdict | Combined first-paint delta claim |
|---|---|---|---|
| **#794** | `perf(bundle): lazy-load MercyGuidePanel — 14.3 KB gz off first paint (A25 Lever 1)` | ✅ **MERGE** | ~14.3 KB gz |
| **#795** | `perf(bundle): split zod/sonner/date-fns into lazy chunks (per A37 evidence, ~31 KB first paint)` | ✅ **MERGE** | ~30.5 KB gz |
| **Stacked total** | | | **~45 KB gz off every first paint** |

Both PRs are minimal, additive, behavior-identical, fully green in CI, independently mergeable, and compose cleanly with each other (different files, no overlap).

---

## PR #794 — lazy-load MercyGuidePanel

### What changed

Two files (+26 / −3):

- **`src/components/MercyGuide.tsx`** —
  - Removed static `import { MercyGuidePanel } from './mercy-guide/MercyGuidePanel'` (was line 15).
  - Added `const MercyGuidePanel = React.lazy(() => import('./mercy-guide/MercyGuidePanel'))`.
  - Wrapped the entire `{isOpen && (<div ref={panelRef}>…</div>)}` render branch in `<React.Suspense fallback={null}>`.
  - `MercyGuidePanelResolved` cast updated to `as unknown as React.ComponentType<any>` (matches pre-existing line-103 cast precedent).
- **`vite.config.ts`** —
  - Added `mercy-guide-panel` to the `modulePreload.resolveDependencies` strip-list (so it can't be preloaded).
  - Added `if (s.includes('/mercy-guide/MercyGuidePanel')) return 'mercy-guide-panel';` **immediately before** the `/mercy-guide/` catch-all in `manualChunks` — same precedent as the existing per-tab rules.

### Lazy boundary placement — verified

Render path on main today (`MercyGuide.tsx`):
- Line 15 — static `import { MercyGuidePanel }` (the leak the PR fixes).
- Line 1255 — `<MercyGuidePanelResolved …/>` mounts inside the `{isOpen && (…)}` block; `isOpen` defaults `false`.

After the PR: that mount is the ONLY consumer of `MercyGuidePanelResolved`, and it now sits inside `<Suspense fallback={null}>`. The bubble path (`{!isOpen && …}`) is byte-identical — it never touches the panel module, so the lazy split cannot regress bubble first-paint. `fallback={null}` is correct because the panel only mounts after a user gesture (bubble open); there is no perceptible flash to fill.

### Chunk-split actually works — verified

The manualChunks rule sits **before** the `/mercy-guide/` catch-all. Without that ordering, the catch-all would re-merge `MercyGuidePanel` back into the eager `mercy-guide` chunk and silently defeat the lazy split — the PR author called this out explicitly and the diff reflects it. The added `modulePreload` strip-list entry then ensures Rollup won't emit a `<link rel="modulepreload">` for the new lazy chunk, which would partially defeat the win.

### Reconciling with the "A46 mercy-guide leak stale" memory

User memory note (`project_a46_mercyguide_leak_stale`): the A46 opp #2 "mercy-guide 39KB eager leak" was closed on the basis that the 39KB was a misread of a misleadingly-named shared-app-core chunk after PR #636 moved a toggle out.

PR #794 is **not a regression of that closure.** Two distinct things were conflated under "39KB":
1. The pre-#636 chunk **name** confusion (closed by A46 — correct closure, no PR needed).
2. The post-#636 measured contents of the `mercy-guide` chunk on `main` today — `MercyGuide.tsx` bubble shell **plus** statically-imported `MercyGuidePanel`. The PR's isolated `npm ci && npm run build` baseline shows that combined chunk at 39.0 KB gz. The split moves the 10.5 KB panel out; the eager bubble-only chunk falls to 24.4 KB gz; net first-paint reduction is ~14.3 KB gz (not the full 14.6 KB delta because the panel chunk has small overhead).

Risk to the closed "AppRouter.tsx:27 is type-only; do NOT regress to thinking that's the lever" finding: **none.** PR #794's lever is at `src/components/MercyGuide.tsx:15` (a real static value import, now lazified), not at `src/router/AppRouter.tsx:27` (a `type` import that compiles to zero bytes). Different file, different lever, different mechanism. The PR author also correctly identified the bubble-shell-vs-panel distinction and honestly downgraded the headline number from the A25 recon's 33–39 KB estimate to a measured ~14.3 KB — good measurement discipline.

### CI evidence

All checks green: Build and Test, Lint Code, Validate Rooms, Build Preview, Lighthouse Mobile, Comment on PR, Vercel Preview Comments. `npm test` 6495/6495 passed. Mergeable: CLEAN.

### Risks

- **Suspense fallback `null` during a slow chunk fetch on flaky VN networks.** Behaviorally: user taps bubble → bubble flips to open state → null content for the chunk's network RTT → panel paints. On 3G/4G with `mercy-guide-panel-*.js` at 10.5 KB gz this is sub-second. No worse than today's "click → render", just a single async hop. Acceptable.
- **Rollup catch-all ordering is now load-bearing.** If a future refactor moves the `mercy-guide-panel` rule below the `/mercy-guide/` catch-all, the lazy split silently defeats. The added comment in `vite.config.ts` makes this explicit, and the per-tab precedent (`mercy-speak-tab`, `mercy-teacher-tab`, `mercy-grammar-tab`, …) already requires this ordering — so the risk is no higher than existing surface area.
- **MercyGuidePanel default export.** The lazy import expects a `default` export. `MercyGuidePanel` exports a default (otherwise the PR's tests wouldn't pass), so this is fine — but worth being aware of if anyone refactors the panel's exports.

### Verdict

✅ **MERGE.** Clean, minimal, measured, well-precedented. The honest premise correction in the PR body is a positive signal.

---

## PR #795 — vendor-split zod / sonner / date-fns

### What changed

One file (+3 / 0):

- **`vite.config.ts`** — three `manualChunks` rules, inserted **immediately before** the `/node_modules/` → `'vendor'` catch-all:
  - `if (s.includes('/node_modules/zod/')) return 'vendor-zod';`
  - `if (s.includes('/node_modules/sonner/')) return 'vendor-sonner';`
  - `if (s.includes('/node_modules/date-fns/')) return 'vendor-datefns';`

That's it. Pure chunk-routing config. Zero source changes, zero behavior changes, zero new tests required.

### Lazy-only premise — sanity-checked

The PR cites A37's measure-then-decide evidence (`reports/RECON-vendor-split-evidence-A37.md` on branch `origin/a37/vendor-split-measure`). Independent verification on this worktree:

- `rg -n "from ['\"]sonner['\"]|from ['\"]zod['\"]|from ['\"]date-fns" src/main.tsx` → **zero hits.** The entry file does not statically import any of the three libraries.
- `Toaster` (sonner's mount surface) at `src/main.tsx:89-93` is wrapped in `lazyWithRetry(() => import("@/components/ui/toaster"))` and `lazyWithRetry(() => import("@/components/a11y/AccessibleToast"))` — both lazy. `<Toaster />` and `<AccessibleToaster />` are rendered inside a `<Suspense>` boundary in the app tree at line 636-637. Sonner is genuinely lazy-only.

Combined with the PR's own evidence (post-split build's `dist/index.html` `modulepreload` set contains only `react / vendor / ui / supabase / mercy-guide` — `vendor-zod / vendor-sonner / vendor-datefns` are confirmed **absent**), the premise holds: Rollup found no static eager path to any of the three, so splitting them off the catch-all defers them to on-demand chunks without creating a duplicate-load hazard.

### Why this works (no byte duplication)

If any of zod/sonner/date-fns had a sneaky eager import path, splitting them would either (a) keep them in `modulepreload` (no win), or (b) cause Rollup to duplicate the module across chunks (a net loss). Neither happened in the PR's measured artifacts — the eager `vendor` chunk shrinks by exactly the sum of the three split chunks (85174 → 53909 gz; sum split = 31781 raw). Bytes moved, not duplicated.

### CI evidence

All checks green: Build and Test (6519/6519), Lint Code, Validate Rooms, Build Preview, Lighthouse Mobile, Comment on PR, Vercel Preview Comments. Mergeable: CLEAN.

### Risks

- **Future eager-import regression.** If any future code adds a static `import … from 'zod'` (or sonner/date-fns) to `src/main.tsx`, `src/components/layout/AppShell.tsx`, `src/router/AppRouter.tsx`, or any eager-shell module, the corresponding `vendor-*` chunk would silently get promoted into `modulepreload` and the win would erode without anyone noticing. Mitigation: A37's measure-then-decide approach should be re-run periodically; ideally a CI guard pin on `modulepreload` set size. Not a blocker for this PR.
- **Chunk-graph proliferation.** Adds 3 more chunks to the manifest. Minor cost (HTTP/2 multiplexing makes this negligible), and the per-tab precedent already establishes that this codebase favors many small chunks over fewer large ones.

### Verdict

✅ **MERGE.** Smallest possible diff for the measured win. Independent of #794 — can ship in any order or in parallel.

---

## Cross-PR risk surface (combined merge)

- **vite.config.ts conflict:** Both PRs edit `vite.config.ts`, but in non-overlapping regions (#794 touches `modulePreload.resolveDependencies` at line ~488 and the `manualChunks` mercy-guide block at line ~640-655; #795 touches `manualChunks` at line ~579-585). Order of merge doesn't matter; trivial rebase if it does conflict.
- **Memory check** (`project_a46_mercyguide_leak_stale`, `project_sentry_route_gate`): no regression. PR #794 is not the same lever as the closed A46 opp #2; PR #720's Sentry route-gate is unrelated.
- **Combined first-paint reduction:** ~45 KB gz off every page's initial paint. STRATEGY §11 reputation work for VN mobile / slow networks — direct hit on the use case.

---

CHAU ↓↓↓ COPY FROM HERE

```
Both PRs: MERGE.

#794 perf/lazy-mercyguide-panel — clean ~14.3 KB gz win, lazy boundary correct,
  honest premise correction in body. Not a regression of the A46 opp #2 closure
  (different lever: MercyGuide.tsx:15 static import, not AppRouter.tsx:27 type-only).
#795 perf/vendor-split-zod-sonner-datefns — 3-line config diff, zero behavior
  change, ~30.5 KB gz win, zod/sonner/date-fns confirmed lazy-only.

Combined ~45 KB gz off first paint. CI green on both; mergeable: CLEAN.
Order doesn't matter, can ship in parallel. vite.config.ts edits don't overlap.
```
