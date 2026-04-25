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
