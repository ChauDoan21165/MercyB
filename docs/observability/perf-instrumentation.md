# Perf & Observability — Sentry Breadcrumb Catalog

Reference doc for every Sentry breadcrumb category emitted by `src/`. Use this when:

- You need to know what a breadcrumb you're seeing in a Sentry event means.
- You're querying Sentry for a specific category and need the canonical string.
- You're adding a new breadcrumb category — **update this doc in the same PR** (the catalog test at `src/lib/monitoring/__tests__/breadcrumb-catalog.test.ts` will fail until it is).

> **Privacy invariant.** Every category below carries **counts + low-cardinality identifiers only** — never user IDs, never user-content payloads, never dynamic route-param values. Breadcrumbs are client-side only by design; they only travel to Sentry alongside a real `captureException`. The perf-family categories below emit **zero** captureException calls.

## Summary table

| Category | Emitter | Threshold | What it measures |
|---|---|---|---|
| `navigation` | `SentryUserBinding` | none | Route changes (`from` → `to`) |
| `security.mfa` | `mfaTelemetry` | none | MFA enrollment / login events |
| `mercy.panel` | `breadcrumbs.ts → trackMercyPanel` | none | Open / close / collapse of the Mercy panel |
| `mercy.feedback` | `breadcrumbs.ts → trackMercyDownvote` | none | Downvote on a Mercy correction |
| `speak.attempt` | `breadcrumbs.ts → trackSpeakAttempt` | none | Speak-tab attempt phase (`start` / `done` / `fallback`) |
| `web-vital` | `webVitalsTracking` | none (always) | LCP / INP / CLS / TTFB observations, also DB-inserted |
| `stage3a.perf.aggregator` | `stage-3a/perfInstrumentation` | **> 50 ms** | Local-weakness aggregator slow path |
| `stage3a.perf.ui_mount` | `stage-3a/perfInstrumentation` | **> 100 ms** | `<LocalWeaknessMap />` mount-to-first-paint |
| `stage3b.perf.engine` | `stage-3b/perfInstrumentation` | **> 50 ms** | `selectSuggestedPractice` slow path |
| `stage3b.perf.ui_mount` | `stage-3b/perfInstrumentation` | **> 100 ms** | `<SuggestedPracticeList />` mount-to-first-paint |
| `route.perf.mount` | `monitoring/routePerf` | **> 100 ms** | Generic route mount-to-first-paint (`routeName` disambiguates) |

---

## Per-category detail

### `navigation`

- **Emitter:** `src/components/monitoring/SentryUserBinding.tsx`
- **Level:** `info`
- **Threshold:** none — emits on every route change
- **Payload:** `{ from: string, to: string }` — route patterns (not raw paths with params)
- **Sentry query:** `breadcrumbs.category:navigation`
- **What to do with it:** correlate "what page were they on right before the error?" Treat both fields as low-cardinality (pattern strings, e.g. `/room/:roomId`), never raw paths.

### `security.mfa`

- **Emitter:** `src/lib/security/mfaTelemetry.ts → trackMfaEvent(event, data?)`
- **Level:** `warning` when `event === "mfa_login_failed"`, else `info`
- **Threshold:** none
- **Payload:** `data ?? {}` — whatever the call site passes. By policy must not include the OTP code, the secret, or the user ID; the helper is the choke point — keep payloads structural (e.g. `{ method: "totp" }`, never `{ code: 123456 }`).
- **Sentry query:** `breadcrumbs.category:security.mfa`

### `mercy.panel`

- **Emitter:** `src/lib/monitoring/breadcrumbs.ts → trackMercyPanel(action, data?)`
- **Level:** `info`
- **Threshold:** none
- **Payload:** `{ action: string, ...data }` — `action` is one of the panel-state verbs (open / close / collapse / expand)
- **Sentry query:** `breadcrumbs.category:mercy.panel`

### `mercy.feedback`

- **Emitter:** `src/lib/monitoring/breadcrumbs.ts → trackMercyDownvote(data)`
- **Level:** `warning`
- **Threshold:** none
- **Payload:** `{ vote: "down", ...data }` — call sites pass structural context only (e.g. correction kind), never the corrected text.
- **Sentry query:** `breadcrumbs.category:mercy.feedback`

### `speak.attempt`

- **Emitter:** `src/lib/monitoring/breadcrumbs.ts → trackSpeakAttempt(phase, data?)`
- **Level:** `warning` when `phase === "fallback"`, else `info`
- **Threshold:** none
- **Payload:** `{ phase: "start" | "done" | "fallback", ...data }` — `phase = "fallback"` marks the path where `speechSynthesis` declined and we fell through to the pre-recorded mp3 (see CLAUDE.md "Mercy character / Speak tab dual invariant").
- **Sentry query:** `breadcrumbs.category:speak.attempt`

### `web-vital`

- **Emitter:** `src/lib/perf/webVitalsTracking.ts`
- **Level:** `info`
- **Threshold:** none — emits on every recorded vital (deduped per `(metric.id, route)`)
- **Payload:** `{ name, value, route, device_class, rating }` — `name` is one of `"LCP" | "CLS" | "INP" | "TTFB" | "FCP"` (the 5 actually subscribed today; FID is declared in `WebVitalName` but not subscribed — see `web-vitals-audit.md` §6 (1)). `route` is the `bucketRoute()` output. `device_class` is `"mobile" | "desktop"` only — there is **no** `"tablet"` bucket today (`classifyDevice()` splits at `< 768`). `rating` is `"good" | "needs-improvement" | "poor"`. Vitals also land in the `web_vitals_events` table for time-series analysis.
- **Sentry query:** `breadcrumbs.category:web-vital`
- **What to do with it:** for a sustained regression, query Supabase `web_vitals_events` directly — the breadcrumb is a per-event hint, the table is the dataset. The shape is pinned by `src/lib/monitoring/__tests__/web-vital-contract.test.ts`; for the deeper audit (per-metric coverage, alerting gaps, dead code) see `docs/observability/web-vitals-audit.md`.

### `stage3a.perf.aggregator`

- **Emitter:** `src/lib/stage-3a/perfInstrumentation.ts → aggregateLocalWeaknessesInstrumented()`
- **Level:** `warning`
- **Threshold:** **> 50 ms** (`AGGREGATOR_SLOW_THRESHOLD_MS`). Emits **only** on the slow path; a healthy run is silent.
- **Payload:** `{ durationMs, l1Count, placementCount, pronunciationCount }` — counts of the three input ring buffers, never the tag strings themselves.
- **Sentry query:** `breadcrumbs.category:stage3a.perf.aggregator`

### `stage3a.perf.ui_mount`

- **Emitter:** `src/lib/stage-3a/perfInstrumentation.ts → reportUiMountPerf(durationMs)`
- **Level:** `warning`
- **Threshold:** **> 100 ms** (`UI_MOUNT_SLOW_THRESHOLD_MS`). Slow path only.
- **Payload:** `{ durationMs }`
- **Sentry query:** `breadcrumbs.category:stage3a.perf.ui_mount`
- **Caller:** `<LocalWeaknessMap />` mount.

### `stage3b.perf.engine`

- **Emitter:** `src/stage-3b/perfInstrumentation.ts → selectSuggestedPracticeInstrumented(state)`
- **Level:** `warning`
- **Threshold:** **> 50 ms** (`ENGINE_SLOW_THRESHOLD_MS`).
- **Payload:** `{ durationMs, itemCount, l1Count, placementCount, pronunciationCount }` — count of returned items + per-kind counts. Never source tags, never rationale strings.
- **Sentry query:** `breadcrumbs.category:stage3b.perf.engine`

### `stage3b.perf.ui_mount`

- **Emitter:** `src/stage-3b/perfInstrumentation.ts → reportUiMountPerf(durationMs)`
- **Level:** `warning`
- **Threshold:** **> 100 ms** (`UI_MOUNT_SLOW_THRESHOLD_MS`).
- **Payload:** `{ durationMs }`
- **Sentry query:** `breadcrumbs.category:stage3b.perf.ui_mount`
- **Caller:** `<SuggestedPracticeList />` mount.

### `route.perf.mount`

- **Emitter:** `src/lib/monitoring/routePerf.ts → reportRouteMountPerf(routeName, durationMs)`
- **Level:** `warning`
- **Threshold:** **> 100 ms** (`ROUTE_MOUNT_SLOW_THRESHOLD_MS`).
- **Payload:** `{ routeName: string, durationMs: number }`. `routeName` is a static, low-cardinality identifier picked by the call site — never a dynamic param value.
- **Sentry query:**
  - All routes: `breadcrumbs.category:route.perf.mount`
  - Specific route: `breadcrumbs.category:route.perf.mount breadcrumbs.data.routeName:home`
- **Known `routeName` values today** (wave by wave):
  - `home`, `ai_tutor`, `practice_phoneme_drill` (MR !34)
  - `placement_welcome`, `placement_who_for`, `placement_test`, `placement_results`, `placement_resume`, `placement_skip_confirm` (MR !39)

When a new route is wired, **append its `routeName` here** so Sentry queriers know the full set without grepping `src/`.

---

## Sentry query cookbook

A few common operating-time queries.

| Question | Query |
|---|---|
| "Anything slow on the diagnostic surface today?" | `breadcrumbs.category:stage3a.perf.*` |
| "Anything slow on the prescriptive surface today?" | `breadcrumbs.category:stage3b.perf.*` |
| "Which routes are slow-mounting?" | `breadcrumbs.category:route.perf.mount` then group by `breadcrumbs.data.routeName` |
| "How did the user get to the crash page?" | `breadcrumbs.category:navigation` in a captured event's breadcrumb trail |
| "MFA login failures right before this support ticket?" | `breadcrumbs.category:security.mfa breadcrumbs.message:mfa_login_failed` |
| "Did the Mercy speak-tab fall back to mp3 before the crash?" | `breadcrumbs.category:speak.attempt breadcrumbs.data.phase:fallback` |

For ad-hoc Sentry MCP queries, see [[reference_sentry_infra_access]] in memory for the auth token + project handles.

---

## Adding a new breadcrumb category

1. Pick a stable, low-cardinality name. Prefer dotted namespaces (`surface.metric`) over flat strings; reuse an existing prefix when extending a family.
2. Decide if you want a constant export (helps with rename-safety + IDE find-usages) or an inline literal. Constants are cheap and recommended for any category emitted more than once.
3. Document it in this file: append a row to the summary table + a per-category detail section.
4. Run `vitest run src/lib/monitoring/__tests__/breadcrumb-catalog.test.ts` locally. The drift guard will fail if the doc and the source don't match — fix the catalog list in the test until both agree.
5. The PR must touch this doc + the test catalog in the same commit as the emitter.

## Adding a new perf threshold

If you wrap a pure function or a UI mount, mirror the Stage 3A / 3B / route-perf pattern:

- Threshold constant exported alongside the helper (`*_SLOW_THRESHOLD_MS`).
- Counts-only payload (no PII, no free text, no dynamic ids).
- Breadcrumb-only — **zero `captureException`**. A slow path is degraded-but-working, not an error.
- Add the threshold value + payload shape to this doc's per-category section.

The three perf-family files (`src/lib/stage-3a/perfInstrumentation.ts`, `src/stage-3b/perfInstrumentation.ts`, `src/lib/monitoring/routePerf.ts`) are the working reference — copy their structure verbatim.
