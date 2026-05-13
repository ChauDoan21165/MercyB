# A7 — Bundle audit (Step 8 / Performance)

**Date:** 2026-04-25
**Branch:** `feat/a7-bundle-audit-and-splits`
**Goal:** measure the production bundle, identify oversized chunks that hit the home/landing critical path, and apply targeted code-splits without changing feature code.

## TL;DR

| metric (raw bytes)            | before  | after   | Δ           |
|-------------------------------|---------|---------|-------------|
| `vendor` chunk                | 561 KB  | 219 KB  | **−342 KB (−61%)** |
| critical-path JS (every user) | 1021 KB | 679 KB  | **−342 KB (−33%)** |
| largest non-route chunk       | 561 KB  | 466 KB  | (kids-data, route-only) |
| Vite "chunks larger than 500 KB" warnings | 1 (vendor) | 0 | gone |
| total `dist/`                 | 130 MB  | 130 MB  | unchanged (audio/JSON dominates) |

The single change responsible for the win: pulling **recharts + its d3/decimal/immer/redux transitive deps out of the catch-all `vendor` chunk into a separate `charts` chunk** that only loads when an admin analytics page is opened.

No feature code changed. No new bundler plugins installed (`rollup-plugin-visualizer` was already in `devDependencies`).

---

## Method

1. Baseline `npm run build` on `feat/a7-bundle-audit-and-splits` branched off `origin/main`.
2. Inspected the largest chunks by raw byte size with `ls -la`.
3. Enabled `rollup-plugin-visualizer` (already in `devDependencies`, no new install) gated behind `MB_BUNDLE_VIZ=1` so production builds in CI/Vercel don't emit a report.
4. Parsed `dist/bundle-stats.html` to attribute gzipped size per package per chunk.
5. Identified the offender, edited `vite.config.ts → manualChunks`, rebuilt, re-measured.

The visualizer is left in the config but disabled by default. To re-run the audit:

```bash
MB_BUNDLE_VIZ=1 npm run build
open dist/bundle-stats.html
```

---

## Baseline — top chunks (raw bytes)

```
vendor-BNhAfXT-.js          561,487 B   ← over Vite's 500 KB warning
kids-data-BeLmK1AU.js       465,950 B   (only loaded on kids routes)
mercy-guide-BeRducww.js     277,501 B
supabase-m6ku490d.js        191,552 B
index-CDAVuB0G.css          172,388 B
react-DNbdO-KP.js           144,513 B
ui-2mA1AgYW.js              124,534 B
ChatHub-BbiOuoLj.js         102,739 B
SpeechDrillPage-…           97,031 B
Home-jmxje5W_.js            88,994 B
index-CIVayR6x.js           46,958 B    ← Router/AppShell entry
```

Vite warning: `Some chunks are larger than 500 kB after minification`.

## Baseline — `vendor` chunk composition (gzipped, top 12)

| package           | gz bytes |
|-------------------|---------:|
| **recharts**      | **203,200** |
| zod               |   29,161 |
| date-fns          |   26,360 |
| es-toolkit        |   17,472 |
| decimal.js-light  |   13,179 |
| immer             |   11,873 |
| d3-scale          |   10,007 |
| @remix-run/router |    9,753 |
| d3-shape          |    9,705 |
| @reduxjs/toolkit  |    7,307 |
| @floating-ui/dom  |    6,791 |
| @floating-ui/core |    6,341 |

`recharts` plus its transitive d3 / decimal / immer / redux entourage accounted for **~280 KB gzipped** (~430 KB raw) of the 561 KB vendor chunk. **None of those packages are used outside `src/components/analytics/*` and `src/pages/admin/AdminAnalyticsPage.tsx`** — i.e. admin-only code paths shipped to every visitor.

## Baseline — eager imports in `src/main.tsx`

Already optimal — no action taken:

- `React`, `ReactDOM`, `BrowserRouter`, `AppRouter`, `supabaseClient`, `AuthProvider`, `index.css` are critical-path and stay eager.
- `@/lib/iap` (RevenueCat — heavy, native-only) — already lazy-imported in an IIFE.
- `@/services/behaviorTrackingFlag` (UTM/Pixel/GA) — already lazy.
- `@/lib/privateAudioResolver` — already lazy.

## Baseline — non-lazy imports in `src/router/AppRouter.tsx`

- 45 `lazy(() => import("@/pages/…"))` calls. All routes are already code-split.
- Only eager component imports: `AdminRoute`, `AdminLayout`, `TrialExpiredScreen`. Each is a tiny presentational shell; eager is correct so there's no flash before the auth/trial gate decides what to render.

No action needed for AppRouter.

---

## Change applied

`vite.config.ts → manualChunks`: carve out a new `charts` bucket. Recharts has a ~30-package transitive dep graph; missing a single transitive (e.g. `internmap`) leaves it pulling code back into `vendor`, so the matcher is exhaustive:

```ts
if (
  s.includes('/node_modules/recharts/') ||
  s.includes('/node_modules/d3-scale/') ||
  s.includes('/node_modules/d3-shape/') ||
  s.includes('/node_modules/d3-array/') ||
  s.includes('/node_modules/d3-color/') ||
  s.includes('/node_modules/d3-format/') ||
  s.includes('/node_modules/d3-interpolate/') ||
  s.includes('/node_modules/d3-path/') ||
  s.includes('/node_modules/d3-time/') ||
  s.includes('/node_modules/d3-time-format/') ||
  s.includes('/node_modules/internmap/') ||
  s.includes('/node_modules/decimal.js-light/') ||
  s.includes('/node_modules/victory-vendor/') ||
  s.includes('/node_modules/immer/') ||
  s.includes('/node_modules/@reduxjs/') ||
  s.includes('/node_modules/redux/') ||
  s.includes('/node_modules/reselect/')
) {
  return 'charts';
}
```

Critical-path chunks (auth, layout, error boundary) deliberately stay eager. The split affects only what a non-admin user downloads on first paint.

## After — top chunks (raw bytes)

```
kids-data-BeLmK1AU.js       465,950 B   (unchanged; route-only)
charts-Bh-EPhi7.js          342,698 B   ← NEW; only on admin analytics
mercy-guide-BZ3RUBrx.js     277,475 B
vendor-DxRIQpxX.js          218,764 B   ← was 561,487 B
supabase-Cz1vFMbw.js        191,552 B
react-DVw213wK.js           144,513 B
ui-gWqji0Ym.js              124,534 B
ChatHub-CitRjunk.js         102,739 B
```

`vendor` is now **219 KB raw / 65 KB gzipped**. The 500 KB warning is gone. The `charts` chunk (343 KB raw / 100 KB gz) is requested only when the admin analytics route mounts, and is then cached forever (its hash won't change on app code edits — long-term-caching win).

## Critical-path budget (every visitor)

```
react        144 KB
ui           124 KB
supabase     192 KB
vendor       219 KB
─────────────────────
total        679 KB raw   (was 1021 KB, −33%)
```

Plus the per-route entry chunk (Home is 89 KB, Landing/Pricing are smaller).

## What I deliberately did NOT touch

- **Eager imports in `main.tsx`** — already optimal; further splits would add chunk-load latency to first paint without saving bytes.
- **`AdminRoute` / `AdminLayout` / `TrialExpiredScreen`** — eager-by-design layout shells; lazy-loading them would flash a fallback before the gate decides.
- **`zod` (29 KB), `date-fns` (26 KB)** — used widely across multiple feature areas. Carving them out would create awkward async boundaries. Acceptable cost in the shared `vendor` chunk.
- **Splitting `supabase` further** — already its own chunk; reducing it would require switching auth providers, out of scope.
- **`framer-motion`, `sonner`, `@tanstack/react-query`** — these did NOT show up as top contributors to the vendor chunk (each <10 KB gz). No splits needed.
- **Adding new bundler plugins** beyond `rollup-plugin-visualizer` (already in `devDependencies`).

## What's still on the table (future rounds)

- **`mercy-guide` chunk (277 KB raw / 80 KB gz)** — already an isolated chunk; mostly app code, not deps. A future improvement would split MercyGuide tabs (Journey / Grammar / Speak / Logic) into separate route-level lazy imports if any one tab grows further.
- **`kids-data` chunk (466 KB raw)** — fine today since it's only loaded when a kids route mounts. If kids content keeps growing, consider per-grade-level splits.
- **`Home.js` (89 KB)** — large because the Landing page builds on top of marketing imagery + animation primitives. If it grows further, split below-the-fold sections into dynamic imports.
- **CSS (172 KB)** — Tailwind output. PurgeCSS / content config is already on; extra savings would require auditing unused utility classes, low-yield work.

## How to re-run the audit later

```bash
# clean build with the visualizer treemap
MB_BUNDLE_VIZ=1 npm run build

# open the report
open dist/bundle-stats.html
```

The visualizer plugin is conditional in `vite.config.ts` on `MB_BUNDLE_VIZ=1`, so production CI/Vercel builds don't emit `dist/bundle-stats.html`.

## Verification

- `npm run typecheck` — clean
- `npm test` — passes (no test changes; pure config edit)
- `npm run build` — succeeds
- No 500 KB warning
- Vendor chunk: 561 KB → 219 KB raw

## Files changed

- `vite.config.ts` — added `charts` bucket to `manualChunks`; gated `rollup-plugin-visualizer` behind `MB_BUNDLE_VIZ=1`.
- `reports/a7-bundle-audit.md` — this file.

No application code was modified.

---

# 2026-05-13 — re-audit after Session Replay

**Branch:** `perf/bundle-audit-post-replay`
**Trigger:** Homepage LCP at 14.9 s on Slow 4G; PR #415 cut ~2 s via hero image; remaining LCP is JS-bound. Session Replay landed in PR #411; need to confirm it didn't regress critical-path JS.

## TL;DR — what shipped this round

**Recon-only.** No `manualChunks` edit, no lazy-load applied. The plausible easy-win (lazy-import `MercyGuide` from `AppShell.tsx`) was tried in this branch and reverted because it moved zero bytes off the critical path — the `mercy-guide` chunk is anchored by ~18 KB gz of shared utilities (sentryInit, AuthProvider, supabaseClient, etc.) that Rollup absorbed into it. The fix needs a bundler-config refactor that introduced a circular-chunk warning on first attempt; flagged as deferred medium work below.

## Critical-path JS today (every visitor on `/`)

`dist/index.html` modulepreload list:

| chunk           | raw      | gzipped | vs 2026-04-25 |
|-----------------|---------:|--------:|--------------:|
| `index` (entry) | 113 KB   | 33 KB   | (was ~47 KB raw — the entry chunk grew with App router additions) |
| `react`         | 146 KB   | 47 KB   | flat |
| `vendor`        | 282 KB   | 85 KB   | **+63 KB raw / +20 KB gz** (was 219 / 65) |
| `ui`            | 154 KB   | 43 KB   | **+29 KB raw** (was 125) |
| `supabase`      | 192 KB   | 51 KB   | flat |
| `mercy-guide`   | 112 KB   | 36 KB   | **NEW on critical path** (was eagerly imported by `AppShell` last round too, but the previous audit didn't break out per-feature chunks) |
| **TOTAL**       | **999 KB** | **295 KB** | up from 679 KB raw / ~210 KB gz |

`sentry` (473 KB raw / 156 KB gz) is **NOT** in the modulepreload list — it's lazy-loaded after first paint via the existing `await import("@sentry/react")` in `sentryInit.ts`. Session Replay added ~83 KB gz to the sentry chunk; that's fine, it stays off LCP path.

## Vendor regrowth — top contributors (gzipped)

```
gz:  29 KB   zod                   (flat vs 04-25)
gz:  26 KB   date-fns              (flat)
gz:  23 KB   es-toolkit            (was 17 — +6)
gz:  19 KB   @tanstack/query-core  (NEW — landed with React Query infra in PR #393)
gz:  13 KB   sonner                (NEW in top contributors)
gz:  10 KB   @remix-run/router
gz:  18 KB   @floating-ui/{dom,core,utils,react-dom}  (Radix peer dep, falls into vendor)
gz:   9 KB   @revenuecat/{purchases-typescript-internal-esm,capacitor}
gz:   6 KB   @capacitor/core
gz:   3 KB   iceberg-js            (NEW)
```

Biggest growth: `@tanstack/query-core` + `sonner` together account for ~32 KB gz of the vendor regrowth. Both are statically imported and used app-wide; carving them out wouldn't reduce critical-path total bytes (just rename the chunk that owns them).

## The mercy-guide chunk problem

`mercy-guide-CsIjKonf.js` (112 KB raw / 36 KB gz) is in the homepage modulepreload list because the entry chunk has a **static** `import { ... } from "./mercy-guide-CsIjKonf.js"`. Visualizer breakdown of that chunk:

| file                                                | gz     | rendered |
|-----------------------------------------------------|-------:|---------:|
| `components/mercy-guide/MercyGuidePanel.tsx`        | 10 KB  | 52 KB    |
| `components/MercyGuide.tsx`                         |  7 KB  | 36 KB    |
| `components/mercy-guide/UnifiedMercyChat.tsx`       |  4 KB  | 14 KB    |
| `lib/monitoring/sentryInit.ts`                      |  4 KB  | 13 KB    |
| `components/mercy-guide/hooks/useMercyMemory.ts`    |  3 KB  | 11 KB    |
| `lib/mercy/intentDetection.ts`                      |  2 KB  |  6 KB    |
| `components/mercy-guide/tabs/LanguageLessonsView.tsx`| 2 KB  | 10 KB    |
| `hooks/useUserAccess.ts`                            |  2 KB  |  8 KB    |
| `lib/referral/referralClient.ts`                    |  2 KB  |  6 KB    |
| `providers/AuthProvider.tsx`                        |  2 KB  |  6 KB    |
| `lib/streakMigration.ts`, `lib/supabaseClient.ts`,<br>`lib/authService.ts`, `services/pointsService.ts`,<br>`services/behaviorTrackingFlag.ts`, `lib/featureFlags.ts`,<br>`lib/auth/anonymousBootstrap.ts`, `lib/chunkLoadError.ts`, …| ~10 KB combined | |

About **57 KB rendered / 18 KB gz** of the chunk is **shared utilities the entry needs eagerly** (sentryInit + AuthProvider + supabaseClient + authService + featureFlags + chunkLoadError + anonymousBootstrap + pointsService + behaviorTrackingFlag + supplements). Rollup put them here because mercy-guide was the largest static consumer; the manualChunks function returns `undefined` for app code, so Rollup decides the bucket via import-graph weight.

Net: even if `<MercyGuide />` is converted to a dynamic import in `AppShell.tsx`, the chunk stays critical-path because the entry static-imports it for sentryInit/AuthProvider/etc. **Verified empirically** in this branch: lazy-importing MercyGuide kept the same `mercy-guide-CsIjKonf.js` hash and same modulepreload entry.

## Easy wins applied this round

**None.** Two attempts this branch:

1. `AppShell.tsx`: `import { MercyGuide }` → `lazyWithRetry(() => import("@/components/MercyGuide"))` with `Suspense fallback={null}`. Rebuild: identical chunk hashes, modulepreload still lists `mercy-guide`. **Reverted.**
2. `vite.config.ts`: added a manual `app-shared` chunk catching `lib/monitoring/`, `lib/auth/`, `lib/queries/`, `lib/security/`, `lib/{featureFlags,supabaseClient,authService,streakCache,streakMigration,chunkLoadError,lazyWithRetry,utils,platform}.ts`, `lib/referral/`, `services/`, `providers/AuthProvider`. Rebuild surfaced **`Circular chunk: app-shared -> vendor -> app-shared`** warning, and critical-path gz went UP (mercy-guide shrank from 36 → 26 KB gz but the new app-shared added 21 KB gz — net +11 KB gz). **Reverted.**

Both attempts confirmed: this is a structural problem with how `manualChunks` returns `undefined` for app code, not a single-rule fix.

## Deferred work (medium / big — separate PRs)

### Medium

1. **Split `mercy-guide` chunk into `mercy-guide-feature` + `app-shared`.** The right shape: a manualChunks rule that explicitly enumerates the shared utilities AND avoids the circular dep with vendor (probably by also moving the relevant @supabase/@tanstack/sonner usage out of vendor or by changing import order). Estimated win: ~13–18 KB gz off critical path. Risk: circular-chunk warning needs careful resolution; touches a load-bearing config.

2. **Lazy-load MercyGuide from `AppShell.tsx`** — should ship together with the chunk split above. On its own, no effect (proved this round).

3. **Audit `ChatHub.tsx` for its eager `MercyGuide` import** — ChatHub is a route-lazy chunk so this doesn't hit `/` LCP, but ChatHub's chunk is bloated by it. Lazy import inside ChatHub would let the route code load before the panel UI.

4. **`ui` chunk grew 29 KB raw / ~9 KB gz** since 2026-04-25 (125 → 154 KB). Worth checking whether new `@radix-ui/*` packages were pulled in (e.g. by recent feature work) and whether any of them are now used on only one or two non-critical pages — those could be hoisted into per-route chunks.

### Big

1. **Sentry chunk is 473 KB raw / 156 KB gz** — lazy-loaded but as a single 156 KB blob ~600 ms after first paint. Splitting `@sentry-internal/replay` and `@sentry-internal/replay-canvas` into a separate lazy chunk that loads only when an error occurs (not on every session) would shed ~50 KB gz from the post-LCP bundle. Sentry's docs do support a deferred-replay pattern, but it's a refactor of `sentryInit.ts` and needs a careful test-coverage update.

2. **Three feature chunks now exceed 100 KB raw** (route-only, not critical-path):
   - `professional-scenarios` 121 KB
   - `reading-passages` 114 KB
   - `listening-items` 109 KB
   These are content-heavy data files. Per-section split (e.g. one chunk per CEFR level, or one chunk per category) would mean a route-level user only pays for the section they open. Brief discussion with content owners required to know the right split axis.

3. **`charts` chunk is 362 KB raw / 105 KB gz** — admin-only, unchanged since 2026-04-25 baseline. Still acceptable: only loaded when an admin opens analytics.

## Estimated LCP impact of deferred medium item (1) on Slow 4G

Rule of thumb: 100 KB of critical-path JS on Slow 4G ≈ 250 ms parse + download. Removing ~13–18 KB gz from critical path ≈ ~30–45 ms improvement. **Small.** The bigger LCP wins are in the deferred big items, especially Sentry replay deferral.

## Files changed this round

- `reports/a7-bundle-audit.md` — this section.

**No code changes shipped.** The manualChunks experiment + AppShell lazy-import were reverted after empirical measurement showed they didn't deliver wins under the existing chunking shape.
