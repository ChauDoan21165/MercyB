# Web Vitals — Coverage Audit

Snapshot of what Core Web Vitals MercyBlade captures today, where the metric data lands, and where the gaps are. **No code changes in this audit** — gap-fill proposals are in §6 and require a separate dispatch to implement.

> **Update (post-`fix/web-vitals-drop-fid`):** gap §6 (1) — *FID declared but never subscribed* — is **shipped**. `WebVitalName` no longer lists FID; the threshold table dropped its entry; the contract test compile-time-asserts FID is excluded from both the upstream `Metric["name"]` union and our local `WebVitalName`. The rest of this audit is unchanged below — §2 / §3 / §6 (1) prose still describes the *pre-fix* state for historical clarity, with a 🟢 line on §6 (1) marking the resolution.

Companion to `docs/observability/perf-instrumentation.md` — that doc catalogs the `web-vital` Sentry breadcrumb category; this doc goes deeper into what's actually behind it.

---

## 1. Live emitter

**File:** `src/lib/perf/webVitalsTracking.ts`. Boot wiring: `src/main.tsx:210` — lazy-imports the module and calls `initializeWebVitals()` from a `requestIdleCallback` (off the critical-path).

```
main.tsx (idle) → initializeWebVitals() → onLCP / onCLS / onINP / onTTFB / onFCP
                                                  ↓
                                            recordVital(metric)
                                                  ↓
                                ┌─────────────────┴─────────────────┐
                                ↓                                   ↓
              Sentry breadcrumb (category "web-vital")      web_vitals_events table
                  — info level, counts-only data            (route + metric_name + value_ms
                                                            + device_class + rating)
```

The `web-vitals` npm package (pinned `^5.1.0` in `package.json`) emits one observation per metric per page-lifecycle, with the package handling its own buffering and bfcache restoration. The emitter additionally dedupes by `(metric.id, route)` so any caller that ignores the once-per-pageload contract still only writes one row.

## 2. Per-metric coverage

| Metric | Subscribed today? | Type | Threshold (good / poor) | Notes |
|---|---|---|---|---|
| **LCP** — Largest Contentful Paint | ✅ `onLCP` | ms | 2500 / 4000 | Also the **only** vital that fires `perf-alert` cron alerts (`PERF_ALERT_RULES.LCP_ALERT_MS = 4000`). |
| **CLS** — Cumulative Layout Shift | ✅ `onCLS` | score | 0.10 / 0.25 | Unitless. Captured per-session (one summary per page-load via the web-vitals package's buffering). |
| **INP** — Interaction to Next Paint | ✅ `onINP` | ms | 200 / 500 | Replaces FID since web-vitals v4. **No alert wired** today — see gap §6 (2). |
| **TTFB** — Time to First Byte | ✅ `onTTFB` | ms | 800 / 1800 | |
| **FCP** — First Contentful Paint | ✅ `onFCP` | ms | 1800 / 3000 | |
| ~~**FID** — First Input Delay~~ | 🟢 **dropped** | — | — | Removed from `WebVitalName` in `fix/web-vitals-drop-fid` (this MR). INP is the official Core Web Vital for interactivity since 2024. See §6 (1) for the resolution. |

**5 / 5** declared vitals flow. FID is no longer in the union.

## 3. Sentry breadcrumb shape (`web-vital`)

Emitted by `webVitalsTracking.ts:135–141`. Pinned by `src/lib/monitoring/__tests__/web-vital-contract.test.ts` — any drift fails CI.

```ts
{
  category: "web-vital",
  level:    "info",
  message:  `${name}=${value.toFixed(2)} on ${route}`,
  data: {
    name:         "LCP" | "CLS" | "INP" | "TTFB" | "FCP",
    value:        number,                  // ms (CLS unitless)
    route:        string,                  // bucketRoute() output
    device_class: "mobile" | "desktop",    // see §4 — NOT "tablet"
    rating:       "good" | "needs-improvement" | "poor",
  },
}
```

Never carries user id, session id, free text, or dynamic route params (the `route` field is `bucketRoute()` output, which collapses ids).

## 4. `device_class` — mobile / desktop binary

`classifyDevice(innerWidth)` in `src/config/perfBudget.ts:125` returns **`"mobile" | "desktop"`** only, with the breakpoint at `< 768`. **There is no `"tablet"` bucket today** — iPads, Android tablets, and other 768–1024 viewports all land in `"desktop"`.

This was previously mis-documented in `perf-instrumentation.md` (the category catalog) — that doc is corrected in the same MR as this audit. See gap §6 (3) for the policy question.

## 5. DB schema — `web_vitals_events`

Each row corresponds to one (metric.id, route) observation:

```
route         text          -- bucketRoute() output
metric_name   text          -- "LCP" | "CLS" | "INP" | "TTFB" | "FCP"
value_ms      numeric       -- rounded to 2 decimal places via Math.round(value * 100) / 100
device_class  text          -- "mobile" | "desktop"
rating        text | null   -- "good" | "needs-improvement" | "poor" | null
```

Note that the DB column is **`value_ms`** for every metric, including CLS — which is unitless. The number is still stored, just semantically mislabeled for CLS specifically. Not a bug for current dashboards (they group by `metric_name` and apply the right axis label), but a future contributor querying `value_ms` for `metric_name = 'CLS'` could be surprised. See gap §6 (5).

Inserts are fire-and-forget — the `try/catch` swallows insert failures with a `console.warn`. Telemetry errors must never affect UX (per the canonical "core path survives optional failures" rule).

## 6. Gaps + proposals (do not implement here — separate dispatch)

Listed roughly by impact, highest first.

### (1) `FID` declared but never subscribed — 🟢 SHIPPED in `fix/web-vitals-drop-fid`

`WebVitalName` previously included `"FID"` and `WEB_VITAL_THRESHOLDS["FID"]` carried a threshold, but no `onFID` call existed. **Resolution:** option **(1a)** taken — FID dropped from `WebVitalName` and the threshold table; package-side `Metric["name"]` already excluded it. Comment scrub: `src/main.tsx`, `src/lib/perf/webVitalsTracking.ts`, `src/pages/admin/FrontendPerformance.tsx`, and this audit's §2 / §3 / §7 prose. Contract test (`src/lib/monitoring/__tests__/web-vital-contract.test.ts`) pins the exclusion at compile time for both the upstream `Metric["name"]` and the local `WebVitalName`. No behavior change to live metric capture (FID was never subscribed).

Dead-code candidates *not* touched here (separate dispatches): the deprecated `fid` field + `(webVitals as any).onFID` guard in `src/simulator/perf/WebVitalsCollector.ts`, and the sibling dead-code file in §6 (4).

### (2) Alert coverage is LCP-only

`PERF_ALERT_RULES` in `src/config/perfBudget.ts:109–118` defines `LCP_ALERT_MS = 4000` and the `supabase/functions/perf-alert/` cron alerts on routes whose P95 LCP breaches it. **INP regressions never alert**, even though INP is the Core Web Vital for interactivity. A jank-on-tap regression on `/ai-tutor` would only surface via the dashboard.

Proposal: add an `INP_ALERT_MS` (default 500 ms = the "poor" cutoff) and extend the perf-alert cron to fire on whichever of LCP or INP breaches.

### (3) `device_class` binary vs Apple's tablet share

`< 768` → mobile, else desktop. **Vietnam's iPad install base ≈ small but non-zero**; landing them in "desktop" means we can't see iPad-specific regressions. Two options:
- **(3a)** Add a `"tablet"` bucket at `768 ≤ innerWidth < 1024` (or use `navigator.userAgentData` if available).
- **(3b)** Leave as binary and rename `device_class` to `viewport_class` to make the model explicit.

Recommendation: **(3a)** is more useful long-term, but it's a schema/dashboard change that should land alongside a dashboard refactor.

### (4) Dead code — `src/lib/performance/web-vitals.ts`

Sibling file at `src/lib/performance/web-vitals.ts` (note the `performance/` vs `perf/` path collision) is **zero-importer dead code**: ~110 lines that re-implement `getRating`, hold a private `vitalsData[]` array, expose `initWebVitals()` / `getVitalsData()` / `getVitalsSummary()`, and contain a `// TODO: Send to analytics service in production` comment that has never been wired. The thresholds inside it (CLS / INP / LCP / FCP / TTFB) **duplicate** `src/config/perfBudget.ts`.

Proposal: delete the file. The "Restore before redesign" rule from CLAUDE.md says check before deletion — `grep -rn 'lib/performance/web-vitals\|initWebVitals\|getVitalsData\|getVitalsSummary' src/` returns zero hits (verified at this audit's land). Safe to retire in a small follow-up PR.

### (5) `value_ms` column is mislabeled for CLS

DB column is `value_ms` but CLS is unitless (a score). Two options:
- **(5a)** Rename the column to `value` (breaks dashboards; migration).
- **(5b)** Leave the column name, add a doc note (this audit's §5 already does that).

Recommendation: **(5b)** — semantics live with the metric name, not the column.

### (6) No build-time vital gate

Bundle-size is gated at build time via `scripts/track-bundle-size.ts`, but there is no synthetic Lighthouse / web-vitals gate on PRs. A regression has to land + show up in real-user data before alerts fire. Lighthouse CI on key routes (Home / `/placement` / `/ai-tutor` / `/weak-at` / `/practice/phoneme/th`) would catch the regression at PR time.

Out of scope for monitoring; this is a CI design decision.

### (7) `metric.delta` and `metric.navigationType` not captured

`web-vitals`'s `Metric` object also carries `delta` (per-observation delta — useful for CLS to see if it's still accumulating) and `navigationType` (reload vs navigate vs back-forward — useful for distinguishing BFCache restorations). Today the emitter discards both.

Proposal: add `delta` and `navigation_type` to both the breadcrumb payload AND the DB schema. Low cost, high signal — call it out before any deeper triage of CLS noise.

## 7. Reference

- **Live emitter:** `src/lib/perf/webVitalsTracking.ts`
- **Thresholds + classifier:** `src/config/perfBudget.ts`
- **Boot wiring:** `src/main.tsx:210`
- **Breadcrumb category catalog:** `docs/observability/perf-instrumentation.md`
- **Breadcrumb contract pin:** `src/lib/monitoring/__tests__/web-vital-contract.test.ts`
- **Existing bucket-route unit tests:** `src/lib/perf/__tests__/webVitalsTracking.test.ts`
- **Dashboard:** `src/pages/admin/FrontendPerformance.tsx`
- **Alert cron:** `supabase/functions/perf-alert/`
- **Dead-code candidate:** `src/lib/performance/web-vitals.ts`
- **Test/simulator (not live):** `src/simulator/perf/WebVitalsCollector.ts`
