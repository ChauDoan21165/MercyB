# Chunk recovery instrumentation audit (A14d)

**Reviewer:** A14d (read-only)
**Worktree:** `/private/tmp/A14d-chunk-instrumentation` off `origin/main` @ `10f0b1533`
**Date:** 2026-05-19 / late session
**Trigger:** A14c (PR #904) classified 4 chunk-load Sentry events as 🟢 HANDLED-BUT-NOISY based on the `chunkRecovery` tag. That classification's correctness depends on the instrumentation actually firing reliably. A14d verifies.

---

## TL;DR

```
╔══════════════════════════════════════════════════════════════╗
║ 📋  NO 🔴 UNHANDLED                                          ║
║      Recovery paths all WORK — telemetry is the gap          ║
║      8 findings: 3 pre-flagged confirmed + 5 new             ║
╚══════════════════════════════════════════════════════════════╝
```

Three layers of chunk-load recovery exist (Tier-1A `lazyWithRetry`, Tier-1B `main.tsx` global handlers, Tier-2 `ErrorBoundary`). **All three actually recover the user.** What they don't do uniformly is leave a Sentry trail — Tier-1A is fully silent, Tier-1B depends on whether Sentry is loaded at the moment of the first chunk-load failure (route-gate dependency), and Tier-2 emits the only explicit `captureError` but the tag-vs-extra split + the `dashboard:real_problems` leak mean the events still pollute the "real problems" dashboard.

---

## 1. Recovery paths (per-tier)

| Tier | Source | What it catches | What it does on catch | Direct Sentry signal? |
|---|---|---|---|---|
| **1A** | `src/lib/lazyWithRetry.ts:64` | `import()` rejection inside any `React.lazy(lazyWithRetry(…))` | `markReloaded()` (sessionStorage `CHUNK_RELOAD_KEY=1`) → `cacheBustingReload()` → returns forever-pending promise so Suspense keeps showing the fallback | **❌ NONE.** The error is caught and swallowed; no `captureError`, no `addBreadcrumb`, no event. |
| **1B** | `src/main.tsx:411-439` | `window.error` / `unhandledrejection` events whose error matches `looksLikeChunkLoadFailure` | `mountFriendlyChunkRecoveryOverlay(err)` → `scheduleOneTimeChunkReload()` → `markChunkRecoveryAttempted()` (sessionStorage `__mb_chunk_reload_once__=1`) → SW unregister → `cacheBustingReload()` | **⚠️ INDIRECT.** Sentry's own `window.error` listener fires only IF Sentry is loaded at that moment. Sentry is route-gated (PR #720) — anonymous users on `/`, `/privacy`, `/terms` may have ZERO Sentry running when the first chunk-load failure fires. |
| **1B'** | `src/main.tsx:442-451` | Preload-failure recovery (`attachPreloadFailureRecovery`) | Calls `scheduleOneTimeChunkReload()` | Same as 1B. |
| **2** | `src/components/ErrorBoundary.tsx:145-188` | React render error when Tier-1A's forever-pending promise approach fails (or wasn't applicable) AND `looksLikeChunkLoadFailure` matches | Explicit `captureError(...)` with `kind: "ChunkLoadRecovered"`, `chunkRecovery: "attempted" \| "exhausted"`, `chunkRecoveryAttempts`. Then either escalates to a SW-unregister + cache-bust (Tier-2 attempt) or shows the manual-retry CTA (exhausted). | **✅ YES.** The only explicit Sentry signal in the chunk-recovery chain. |

---

## 2. Where the `chunkRecovery` tag actually originates

`enrichEventTags` in `src/lib/monitoring/sentryInit.ts:856-868` is the **only** place that sets `tags.chunkRecovery`. It runs server-side inside Sentry's `beforeSend` for **every** event whose exception value matches `looksLikeChunkLoadFailure`. The tag value is derived from:

```ts
function chunkRecoveryExhausted(): boolean {
  // Reads sessionStorage CHUNK_EB_RELOAD_KEY only.
  // Returns false if sessionStorage is unavailable (private mode, etc.).
}
```

So the tag is set whenever the event's message *content* matches the chunk-load pattern, regardless of which Tier caught it. **This is the contract A14c relied on.** Verified working.

`tags.chunkRecovery` values that can be emitted today:
- `"attempted"` — `CHUNK_EB_RELOAD_KEY` not set in sessionStorage (Tier-1 ran but didn't escalate to Tier-2)
- `"exhausted"` — `CHUNK_EB_RELOAD_KEY === "1"` (Tier-2 also fired and the chunk STILL failed)

Values that are **NOT** emitted today:
- `"succeeded"` — no positive breadcrumb when a chunk loads cleanly post-recovery
- Anything denoting which tier caught it (1A vs 1B vs 2)
- `"tier1a-silent"` — would tell us how often `lazyWithRetry` quietly recovered without any other signal

---

## 3. The 5 audit questions

### Q1 — Where does each failure originate?

- **`import()` inside `React.lazy(lazyWithRetry(…))`:** caught by Tier-1A.
- **`import()` outside `React.lazy`** (any dynamic import in app code): rejects → bubbles to `window.unhandledrejection` → Tier-1B.
- **`<script type="module">` 404** (module preload): fires `window.error` → Tier-1B, OR caught by `attachPreloadFailureRecovery` → Tier-1B'.
- **Workbox/SW activation failure:** handled by `swRecovery.ts` separately; not strictly chunk-load, but `unregisterAllServiceWorkers` is called as a sidecar inside Tier-1B and Tier-2's recovery flows.
- **React Suspense re-throw** when Tier-1A's forever-pending promise tactic doesn't apply (e.g., the chunk failure surfaces during render rather than on initial mount): caught by Tier-2.

### Q2 — Does every path reach the `chunkRecovery` tag-setting code?

**No.** The tag is set inside `enrichEventTags` (Sentry `beforeSend`), so it's set **only if a Sentry event is produced for the failure**. Per-tier:

- **Tier-1A:** swallows the error silently. **No Sentry event → no tag.**
- **Tier-1B:** depends on Sentry being active at the moment `window.error`/`unhandledrejection` fires. Pre-route-gate-activation = no event. Post-activation = event captured, beforeSend runs, tag set.
- **Tier-2:** explicit `captureError` call always produces a Sentry event (subject to Sentry-active state). Tag set by beforeSend.

### Q3 — What states does the tag emit?

Today: `"attempted"`, `"exhausted"`. Two states only. No `"succeeded"`, no per-tier discrimination.

### Q4 — Silent success paths?

**Three.**

1. **Tier-1A success:** `createRetryLoader` retries the `import()` and on success calls `clearReloadMark()` → `clearChunkRecoveryMarks()`. No breadcrumb, no metric.
2. **Tier-1B success:** the `cacheBustingReload` navigates away; the new page loads cleanly with no signal that the prior session's failure happened (the `?_cb=<ts>` URL param is even cleaned by `stripChunkCacheBustParam` on the recovered load).
3. **Tier-2 success:** same — the escalated cache-bust navigates away; no follow-up event.

There is NO way to measure recovery success rate from Sentry data today. Every event in Sentry is a *failure* of recovery (or a not-yet-recovered-but-will-be).

### Q5 — Bypass paths?

**One race + one fallback gap:**

- **Race:** `main.tsx`'s `window.error` listener (registered SYNC at boot) writes `markChunkRecoveryAttempted` BEFORE Sentry's own `window.error` listener processes the event (Sentry loads later via route-gate). In practice main.tsx's listener wins by registration order → sessionStorage is set in time for Sentry's beforeSend. **Works today but is timing-dependent.**
- **Fallback gap:** `main.tsx:262-265` falls back to `window.__MB_CHUNK_RELOAD_ATTEMPTED__` when `sessionStorage` throws (private mode). But `enrichEventTags`'s `chunkRecoveryExhausted` reads sessionStorage only (`sentryInit.ts:769-773`), no window-variable fallback. So in private-mode browsers the `chunkRecovery` tag may not reflect the right state.

---

## 4. Pre-flagged A14c findings — verified

### Finding 1 — `dashboard: real_problems` leaks recovered events ✅ CONFIRMED

`enrichEventTags` (`sentryInit.ts:803`) sets `tags.dashboard = "real_problems"` unconditionally. The chunk-load downgrade block at `sentryInit.ts:856-868` runs LAST and `return`s at line 867 — it overrides `level`, `priority`, `fingerprint`, and the `chunkRecovery` family of tags, but **does not reset `tags.dashboard`**. So a Sentry filter on `dashboard:real_problems` includes recovered chunk-load events alongside genuine bugs.

**Net effect:** the inbox view at `dashboard:real_problems` still shows the 4 chunk-load events Chau triaged in A14c, even though they're already routed to `level:warning`. The dashboard filter doesn't actually isolate "real" problems from "recovered noise."

**Fix sketch:** ~1 line — set `tags.dashboard = "recovered_chunks"` (or simply delete the tag) inside the chunk-load branch.

### Finding 2 — `rootCauseHint` returns `"unknown"` for chunk-load events ✅ CONFIRMED

`rootCauseHint` at `sentryInit.ts:730-742` returns one of seven specific values based on `featureArea` + message-content regex. **None** of its predicates match plain dynamic-import-failure language (`"Failed to fetch dynamically imported module"`, `"Importing a module script failed"`, etc.) UNLESS the message also contains `cache`/`indexeddb`/`service worker`/`sw.js` (in which case it returns `"offline_cache_or_indexeddb"`, which is misleading because the real cause is a stale chunk hash, not the SW per se).

For a typical Tier-1B-routed chunk-load event, the message is purely about the dynamic import and `rootCauseHint` returns `"unknown"` — a wasted column in the Sentry UI.

**Fix sketch:** ~3 lines — add a chunk-load predicate to `rootCauseHint` returning `"stale_deploy"` BEFORE the existing `offline_cache_or_indexeddb` check.

### Finding 3 — `kind: ChunkLoadRecovered` is in extras, not tags ✅ CONFIRMED

`ErrorBoundary.tsx:155-164` calls `captureError(error, { kind: "ChunkLoadRecovered", chunkRecovery: ..., chunkRecoveryAttempts: ..., componentStack: ... })`. The `captureError` wrapper (`src/lib/monitoring/captureException.ts:85`) forwards the second argument as `{ extra: safeContext }` → Sentry's "Additional Data" field. This is visible inside the event detail view but **not filterable/groupable in the Issues list**.

**Important nuance A14c got wrong:** the `chunkRecovery` *tag* IS filterable — but only because `enrichEventTags` re-derives it from sessionStorage (a separate code path). The ErrorBoundary's per-event `kind: ChunkLoadRecovered` extra is the part that's invisible in the Sentry UI list view.

**Fix sketch:** harder. The existing `captureError` API only accepts `extra` context, not tags. Two options:
- (a) Extend `captureError` to accept an optional `{ tags: Record<string, string> }` companion. Modest API surface bump.
- (b) Move the chunk-recovery `kind`/`attempts` enrichment fully into `enrichEventTags` (server-side derivation from sessionStorage) and drop the ErrorBoundary extras entirely. Cleaner long-term — one source of truth.

---

## 5. New findings (5)

### Finding 4 — Tier-1A is fully silent ⚠️

`createRetryLoader` (`lazyWithRetry.ts:56-80`) catches the chunk-load error, marks sessionStorage, navigates away. No `captureError`, no `addBreadcrumb`, no `captureMessage`. **There is no telemetry that Tier-1A ever fires.** A user could be in a steady stream of Tier-1A recoveries (every deploy that flips chunks they have lazy-loaded) and Sentry would have zero record of it. Recovery success/failure rate for Tier-1A is unmeasurable from Sentry today.

**Fix sketch:** add `captureMessage("chunk-load-recovered-tier1a", "info", { kind: "tier1a-attempt" })` inside the catch branch, BEFORE `cacheBustingReload()` navigates away. This makes the event a `level:info` breadcrumb that's filterable but doesn't drown the inbox.

### Finding 5 — Tier-1B telemetry depends on Sentry route-gate activation timing ⚠️

`main.tsx`'s window.error / unhandledrejection handlers fire INDEPENDENTLY of any explicit Sentry capture. Sentry's own listener may or may not be installed depending on whether the route-gate has activated. Concretely: an anonymous user landing on `/privacy` (a non-trigger route per `sentryActivation.ts`) who hits a chunk-load failure → Tier-1B handles it, but the corresponding Sentry event is NEVER produced because Sentry init hasn't been triggered. Recovery happens, user reloads cleanly, no signal.

**Fix sketch:** call `activateSentry("chunk-load-failure")` from inside `scheduleOneTimeChunkReload` before the reload navigates away. This makes chunk-load failures themselves a Sentry-activation trigger (the same way `captureError` already is).

### Finding 6 — No success-path breadcrumb anywhere ⚠️

All three tiers' success paths (`clearReloadMark` in Tier-1A; the post-reload land in Tier-1B/2) are silent. Sentry cannot answer "how often does recovery succeed."

**Fix sketch:** add `addBreadcrumb({ category: "chunk-recovery", message: "chunk loaded cleanly after recovery", level: "info" })` inside `clearReloadMark` when called from a previously-failed retry context. Subtle — needs a flag tracking whether the current `import()` is post-retry.

### Finding 7 — No per-tier discriminator in the tag ⚠️

`chunkRecovery: "attempted" | "exhausted"` tells us WHICH SIDE OF THE TIER-2 LINE we're on but not WHICH TIER caught the failure. Tier-1A and Tier-1B both produce `"attempted"`. Triaging "Tier-1B is firing way more than Tier-1A" or "Tier-2 escalation happens for /room/* but not /onboarding" is impossible from the tag alone.

**Fix sketch:** new tag `tags.chunkRecoveryTier = "1a" | "1b" | "2"` set inside the tier-specific code paths (would require pushing per-tier context through to enrichEventTags, e.g., via sessionStorage write paired with the existing reload mark).

### Finding 8 — Private-mode fallback gap (window-variable not read) ⚠️ NARROW

`main.tsx` writes `window.__MB_CHUNK_RELOAD_ATTEMPTED__` when sessionStorage throws. `enrichEventTags`/`chunkRecoveryExhausted` reads sessionStorage only — never the window fallback. Narrow user base (private-mode browsers + chunk-load failure simultaneously) but worth noting.

**Fix sketch:** widen `chunkRecoveryExhausted` to also check the window variable.

---

## 6. Phase-2 backlog (recommended)

Three small PRs, in priority order:

| PR | Findings | Scope | Severity |
|---|---|---|---|
| **A14d-fix-1** | Findings 1 + 2 — dashboard leak + rootCauseHint gap | ~5 lines in `sentryInit.ts` + 2 test cases | **Medium** — directly affects Chau's triage dashboard. The "real_problems" filter is currently misleading. |
| **A14d-fix-2** | Findings 4 + 5 — Tier-1A silent + Tier-1B route-gate timing | ~10 lines across `lazyWithRetry.ts` + `main.tsx` + Sentry activation pull | Low-medium — without these, the A14c classification is partly evidence-free for some user sessions. |
| **A14d-fix-3** | Finding 3 — kind/attempts as proper tags | API extension to `captureError` (12-15 lines) + ErrorBoundary call-site update + test | Low — already partially filterable via the existing `chunkRecovery` tag; this is full-fidelity per-event detail. |

**Findings 6 + 7 + 8 deferred** — narrow incremental improvements; revisit only after the first 3 PRs land and data shows them being useful.

**None are P1.** The recovery chain WORKS for users. These PRs only improve the engineering view into how often / where / why it fires.

---

## 7. Constraints honored

- **READ-ONLY:** no code touched in this PR.
- **Single markdown file** in `reports/`.
- **A14c constraint preserved:** ErrorBoundary central logic untouched.
- **A17 territory respected:** auth-lock recovery path is separate, not touched.
- **No 🔴 escalation needed:** every recovery path verified to actually recover the user. The gaps are telemetry, not functionality.

---

## 8. References

- A14c production-error triage: PR #904
- A14c-fix-1 DOM-mutation regex widening: PR #906
- `src/lib/lazyWithRetry.ts` (Tier-1A)
- `src/main.tsx:255-292,411-451` (Tier-1B + 1B')
- `src/components/ErrorBoundary.tsx:145-188` (Tier-2)
- `src/lib/chunkReload.ts` (cache-busting reload + Tier-1/Tier-2 keys)
- `src/lib/swRecovery.ts` (SW unregister sidecar)
- `src/lib/monitoring/sentryInit.ts:725-742` (rootCauseHint)
- `src/lib/monitoring/sentryInit.ts:768-774` (chunkRecoveryExhausted)
- `src/lib/monitoring/sentryInit.ts:776-877` (enrichEventTags)
- `src/lib/monitoring/captureException.ts:85` (captureError → extra)
- `src/lib/monitoring/sentryActivation.ts` (route-gate, PR #720)
- `src/lib/preloadRecovery.ts` (Tier-1B' module-preload handler)
