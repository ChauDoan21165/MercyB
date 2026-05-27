# Observability (Sentry + monitoring + perf) — Deep Dive

> **Sibling of** [system-overview.md §16](../system-overview.md#16-observability-sentry--monitoring--perf).
>
> Observability is the system that catches problems users don't tell
> us about. It has three load-bearing seams: a **route-gate** that
> keeps the ~156 KB Sentry chunk off static pages, a **platform fork**
> that picks the right SDK init path on web vs native, and a **privacy
> posture** that strips PII out of every event by construction. This
> doc is the reference for all three plus the perf side.
>
> **Read first:**
> - `src/lib/monitoring/sentryInit.ts` (file head — the platform-fork
>   reasoning is load-bearing)
> - `src/lib/monitoring/sentryActivation.ts` (the route-gate — why
>   activation is deferred and how it gets pulled)
> - `src/lib/monitoring/captureException.ts` (pre-init buffering +
>   privacy guards)
> - `docs/OBSERVABILITY.md` (operator-facing handbook)
> - `docs/slo-handbook.md` (SLO targets)

---

## 1. What it does, and why it matters strategically

The observability layer answers three questions:

1. **Did the user just hit a problem we didn't anticipate?** (Sentry
   error capture, both web and native crashes.)
2. **Is the app performing within bounds for this user / cohort?**
   (Web Vitals, route load timing, audio latency, Supabase response
   timing.)
3. **Are the privacy / safety / RLS invariants being respected at
   runtime?** (Custom RLS-denied tagging; alert rules in the Sentry
   dashboard.)

Why it matters strategically:

- **§15 Axis 1 Bar #6 — OPEN.** *"Native crash telemetry confirmed
  on-device"* — wiring shipped (PR #1132), but the bar ticks only
  when Chau sees a test event in the Sentry dashboard from a real
  iOS or Android device. The platform fork in `sentryInit.ts` and the
  `NativeBootstrap.tsx` activation are the code that makes that
  possible. Until Chau's probe lands, this code is *believed-correct
  but unverified*.
- **`STRATEGY.md` §13 (Risks).** *"Vietnamese state cyber attacks"* is
  named; the threat model in `strategic-defenses.md` depends on
  observability to detect a real attack vs. a CI false positive. The
  same telemetry is what tells operators "something is genuinely
  wrong" vs. "browser-injected noise."
- **`PRINCIPLES.md` §5 (Diagnose before patching).** Observability is
  the diagnostic surface the principle depends on. Without good logs
  + sourcemaps + breadcrumbs, every fix is speculation.
- **Memory: [[feedback_sentry_triage]]** — *5-step protocol: source →
  release → impact → fix → verify*. Never code-filter a working
  recovery event (use the dashboard ignore instead). Never code-filter
  browser-injected noise; tighten the dashboard rules first.

---

## 2. The three load-bearing seams

### 2a. The route-gate (`sentryActivation.ts`)

PR #655 deferred `initSentry()` into `requestIdleCallback`, but the
SDK still loaded on every page. That meant a static `/privacy` or
`/terms` visit pulled the ~156 KB Sentry chunk a moment after idle —
a cost paid by every legal-page visitor who would never have
triggered an event anyway. PRs #720 and #740 added a **route-gate**:
the SDK loads only when one of three triggers proves monitoring is
actually needed this session:

1. **A window `error` / `unhandledrejection` lands in the boot buffer.**
   `bootErrorBuffer.onFirstCapture → activateSentry()`.
2. **Auth transitions to an authenticated (email-verified) session.**
   `AuthProvider.applySession → activateSentry()`.
3. **Feature code makes an explicit `captureError()` / `captureMessage()` / …
   call before Sentry is up.** `queueExplicitCapture() → activateSentry()`.

An anonymous, error-free visit to a static page fires none of these,
so Sentry is never fetched there. The gate module
(`sentryActivation.ts`) is intentionally **dependency-free** (no
`@sentry` import, no React) — any layer can pull the gate without
dragging the SDK into its chunk.

### 2b. The platform fork (`sentryInit.ts` lines 200–257)

`@sentry/capacitor` (the native SDK) calls
`NATIVE.initNativeSdk()` before binding a browser client. Inside a
real Capacitor shell the promise resolves immediately and the SDK
runs. **In a plain web browser there is no Capacitor bridge**, so the
native init promise can hang and the wrapped browser client never
binds — leaving the SDK with no client and silently dropping every
`captureException()`.

The fork:

```text
Capacitor.isNativePlatform() === true  → @sentry/capacitor (wraps @sentry/react + native bridge)
Capacitor.isNativePlatform() === false → @sentry/react directly (no Capacitor wrapper)
```

`Capacitor.getPlatform()` is read at runtime and surfaced as a
**dashboard tag** so the Sentry UI can filter `platform: web | ios |
android`. This is the only path that makes `STRATEGY.md` §15 Bar #6
actually possible — without the fork, native crashes would never make
it to the dashboard.

### 2c. The privacy posture

Three privacy guards apply to every event, layered:

1. **`Sentry.setUser` only ever carries `{ id }`.** No email, no
   username, no IP. Enforced by `tagWithUser` in
   `captureException.ts`.
2. **`beforeSend(event) → scrubEvent`** runs `stripPII`
   (`src/lib/security/piiProtection.ts`) over `event.message`,
   exception messages, request body / query string, and breadcrumb
   messages. `user.*` is stripped down to id only.
3. **`beforeBreadcrumb(crumb) → scrubBreadcrumb`** drops `ui.input`
   breadcrumbs entirely — those capture raw text typed by the user,
   which is the single highest-risk source of PII leakage.

Session Replay (web only — `@sentry/capacitor` does not support
Replay): 10% baseline session sampling, 100% on-error sampling.
`maskAllText: true` and `blockAllMedia: true` are kept at the
Sentry-recommended privacy defaults; **loosening either requires an
explicit privacy review**.

---

## 3. Key files and their roles

### 3a. Sentry monitoring (`src/lib/monitoring/`)

| File                     | Role                                                                                                                                |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `sentryInit.ts`          | The init function. Platform fork (web vs native). `isSentryEnabled`, `getSentryModule`, `whenSentryReady`, `classifyRlsTable`.       |
| `sentryActivation.ts`    | The route-gate. `armSentryActivation` (registers what "init now" means), `activateSentry(trigger)` (pulls init).                     |
| `captureException.ts`    | Public capture surface: `captureError`, `captureMessage`, `captureRlsDenied`, `tagWithUser`, `setTag`, `addBreadcrumb`. Pre-init queue. |
| `sentryContext.ts`       | Helpers to attach typed context (tier cohort, feature flag state, etc.) to scoped events.                                            |
| `bootErrorBuffer.ts`     | Bounded buffer for `error` / `unhandledrejection` events that fire before init. On `onFirstCapture` triggers activation, then flushes when `whenSentryReady` resolves. |
| `breadcrumbs.ts`         | Domain-specific breadcrumb helpers (`breadcrumbMercyPanel`, `breadcrumbAudioPlay`, etc.). Stable category + typed payload.           |
| `__tests__/`             | Per-module unit tests. Activation-state matrix is the most subtle suite.                                                             |

### 3b. Sentry wiring sites

| File                                              | Role                                                                                                                                  |
|---------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `src/main.tsx:108, :141, :143, :168, :181`        | `armSentryActivation(...)` registers `initSentry` + `whenSentryReady → bootBuffer.flush` + a 10s hard-cap flush. Boot trigger (1) wired via `onFirstCapture`. |
| `src/providers/AuthProvider*`                     | Trigger (2): `applySession → activateSentry("auth-verified")` on authenticated transitions.                                          |
| `src/lib/monitoring/captureException.ts`          | Trigger (3): `queueExplicitCapture(error)` on pre-init `captureError`; `activateSentry("explicit-capture")` on `captureMessage` / `captureRlsDenied`. |
| `src/components/native/NativeBootstrap.tsx`       | Native bypass of the route-gate: `activateSentry("native-cold-start")` runs on cold start when `isNativePlatform()` is true. Native cohorts skew anonymous, so the auth trigger rarely fires. |
| `src/components/monitoring/SentryUserBinding.tsx` | Mounts at the router root; calls `tagWithUser({ id })` when the user becomes available, `clearUser()` on logout.                      |

### 3c. Privacy + safety helpers (consumed by Sentry)

| File                                          | Role                                                                                                |
|-----------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `src/lib/security/piiProtection.ts`           | `stripPII(text)` — the canonical scrubber. Email, phone (intl + VN), JWT, API key, IP regexes.       |
| `src/lib/chunkLoadError.ts`                   | `looksLikeChunkLoadFailure(err)` — used by `scrubEvent` to *not* up-rank stale-deploy chunk errors. |
| `src/lib/chunkReload.ts`                      | `CHUNK_EB_RELOAD_KEY` — sessionStorage key for the one-time chunk recovery reload.                  |
| `src/lib/ai-tutor/types.ts:662-669`           | `TUTOR_LOG_REDACTION_RULES` — the canonical regex set; observability borrows the same shapes.       |

### 3d. Performance instrumentation (`src/lib/perf/`, `src/lib/performance/`)

The two directories are unfortunately named almost identically. They
do different things.

`src/lib/perf/` — small, focused:

| File                  | Role                                                                          |
|-----------------------|-------------------------------------------------------------------------------|
| `preload.ts`          | Preload hints for critical chunks.                                            |
| `webVitalsTracking.ts`| Web Vitals capture (LCP, INP, CLS, FCP, TTFB). Reports via emit-only logger.  |
| `__tests__/`          | Web Vitals tracking tests.                                                    |

`src/lib/performance/` — broader perf toolkit:

| File                          | Role                                                                                |
|-------------------------------|-------------------------------------------------------------------------------------|
| `audio-cache.ts`              | Audio cache helpers (Workbox-fronted).                                              |
| `battery-optimization.ts`     | Battery-aware feature toggles for mobile.                                           |
| `bundle-optimization.ts`      | Bundle-splitting helpers.                                                           |
| `memoization-helpers.tsx`     | React memoization wrappers.                                                         |
| `memory-optimization.ts`      | Memory-pressure detection / response.                                               |
| `monitor.ts`                  | Runtime perf monitor.                                                               |
| `profiler.tsx`, `react-profiler.tsx` | React profiling overlays.                                                  |
| `retry-with-backoff.ts`       | Exponential backoff for network retries.                                            |
| `supabase-logger.ts`          | Supabase request logger.                                                            |
| `supabase-optimizer.ts`       | Query batching / coalescing.                                                        |
| `supabase-query-cache.ts`     | In-memory query cache layer.                                                        |
| `virtualization.tsx`          | Virtualized list helpers.                                                           |
| `web-vitals.ts`               | Older Web Vitals path (kept for back-compat with `perf/webVitalsTracking.ts`).      |
| `worker-utils.ts`             | Web worker helpers.                                                                 |

`src/lib/observability/metrics.ts` is a separate, narrow emit-only
surface for domain metrics (`emitRoomLoadMetric`, `emitAudioMetric`,
`emitValidationMetric`). It writes to the logger; the logger is
console + (optionally) Sentry breadcrumbs.

### 3e. Server-side observability (`supabase/functions/_shared/`)

| File                          | Role                                                                                |
|-------------------------------|-------------------------------------------------------------------------------------|
| `sentry.ts`                   | Server-side Sentry init for edge functions. Separate DSN tag space.                 |
| `aiUsage.ts`                  | `logAiUsage` — token/cost metadata for AI calls. Metadata only; never raw text.     |
| `auditLogger.ts`, `audit.ts`  | Audit log writers for admin / billing / security actions.                           |
| `latencyDetection.ts`, `latencyTelemetry.ts` | Per-request latency tracking.                                       |
| `perfDetection.ts`            | Perf anomaly detection (above-baseline latency, etc.).                              |

### 3f. Sentry dashboard rules (operator-side)

Memory: [[project_sentry_infra_access]] anchors the operator state.

- Sentry organisation: **`chau-doan`**.
- Project: **`mercyblade-web`**.
- Region host: **`us.sentry.io`**.
- Auth token: macOS Keychain key **`mb-sentry-auth-token`**.
- RLS-denial alert rules: **`17072095`** and **`17072096`** (created
  2026-05-18). These fire on sustained RLS denials — the
  security-monitoring tripwire for the #578 / #562 hardening.
- Auto-fix workflow: fixed in PR **#627**.

---

## 4. Public API / surface contracts

### 4a. Capture API (`captureException.ts`)

```ts
// Account-tier cohort tag. Never PII. Coarse only.
export type SentryTier = "anon" | "trial" | "trial_expired" | "free" | "premium" | "admin";

// Capture an unknown exception. Optional context map is sanitised through stripPII.
export function captureError(error: unknown, context?: Record<string, unknown>): void;

// Capture a free-form message at info / warning / error level.
export function captureMessage(
  message: string,
  levelOrHint?: "info" | "warning" | "error" | { level?: string; extra?: Record<string, unknown> },
): void;

// Specialised capture for RLS-denied events. Tags `rls_table` + `rls_op`.
export function captureRlsDenied(table: string, op: "select" | "insert" | "update" | "delete"): void;

// Identify the current user by id only.
export function tagWithUser(userId: string): void;
export function clearUser(): void;

// Scope tagging.
export function setTag(key: string, value: string): void;

// Domain breadcrumbs (typed wrappers — see breadcrumbs.ts).
export function addBreadcrumb(b: { category?: string; message?: string; level?: "info" | "warning" | "error" | "debug"; data?: Record<string, unknown> }): void;
```

### 4b. Activation API (`sentryActivation.ts`)

```ts
type Activator = () => void;
type Enqueue = (error: unknown) => void;

// One-time registration. Called by main.tsx ONCE, synchronously, after
// the boot buffer is installed and BEFORE any boot IIFE.
export function armSentryActivation(opts: { activate: Activator; enqueue: Enqueue }): void;

// Pull init. Idempotent. The `reason` string is observable as a Sentry
// tag once the SDK is up — useful for dashboard grouping.
export function activateSentry(reason: string): void;

// Test-only: forget the activator (so a re-arm runs cleanly).
export function resetActivation(): void;
```

### 4c. Initialization signal (`sentryInit.ts`)

```ts
// Resolves when initSentry has reached a terminal state (ready OR
// permanently disabled this session). Idempotent. Never rejects.
export function whenSentryReady(): Promise<void>;

// True iff the DSN was non-empty AND init reached "ready" (the SDK
// is bound and accepting events).
export function isSentryEnabled(): boolean;

// Returns the dynamically loaded SDK module (or null if not yet
// loaded). Callers must narrow to a concrete shape — see SentryShape
// in captureException.ts.
export function getSentryModule(): unknown;

// Map a Supabase table name to a coarse "kind" for the rls_table tag.
// (Used by captureRlsDenied to avoid leaking schema details.)
export function classifyRlsTable(name: string): "profiles" | "subscriptions" | "billing" | "user_content" | "admin" | "other";
```

### 4d. Boot buffer API (`bootErrorBuffer.ts`)

```ts
// Install global handlers for window 'error' / 'unhandledrejection'
// that fire before Sentry is up. Bounded (drops on overflow).
export function installBootErrorBuffer(opts: {
  onFirstCapture: () => void;     // fires once on first capture
  maxBuffered: number;
}): { flush: () => void; clear: () => void };
```

When Sentry comes up, `flush()` replays all buffered exceptions
through the normal `captureException` path — `beforeSend` scrub +
dedupe still apply.

### 4e. RLS-denial alert contract

`captureRlsDenied(table, op)` emits a Sentry event with:

- `level: "warning"`
- `tags: { rls_op: "select|insert|update|delete", rls_table: <classified> }`
- A breadcrumb trail showing the few operations leading up to the
  denial.

Dashboard rules `17072095` / `17072096` group by `rls_table` and alert
when sustained (count > N over T minutes) — sustained, NOT one-off.
The one-off case is the normal "user tried to read someone else's
row" event and is expected.

---

## 5. Invariants

### 5a. The "never" list

- **Never wire `Sentry.setUser` with email / username / phone.** Only
  `{ id }`. The function `tagWithUser` enforces it; bypassing
  `tagWithUser` is the failure mode this guard exists to prevent.
- **Never loosen `maskAllText` or `blockAllMedia` on Session Replay**
  without a privacy review. Defaults are the Sentry-recommended
  privacy posture.
- **Never code-filter a recovery event.** If an error class always
  recovers (e.g. transient network failure with auto-retry succeeding),
  the right place to suppress it is the **dashboard "Ignore"** rule,
  not a `beforeSend` early return. Code filters drop signal during
  real outages too.
- **Never code-filter browser-injected noise.** Same rule. Dashboard
  ignore, not code.
- **Never log raw learner input.** Pass identifiers + structured
  fields to `addBreadcrumb` and `setTag`. The `ui.input` breadcrumb
  category is dropped wholesale by `scrubBreadcrumb` — don't try to
  re-enable it.
- **Never call `Sentry.init` outside `sentryInit.ts`.** Multiple
  inits race, the platform fork would have to be duplicated, and a
  test-mode skip can't be guaranteed.
- **Never import `@sentry/react` or `@sentry/capacitor` statically
  from feature code.** All imports go through `sentryInit.ts`'s
  dynamic loader so the chunk stays splittable.
- **Never hold the boot buffer indefinitely.** `main.tsx` arms a 10s
  hard-cap flush. If Sentry hasn't come up in 10s, the buffer drops
  the queued events and stops collecting. Reusing the buffer for
  long-running event collection is misuse.
- **Never use the dynamic `import.meta.env.DEV` check to gate Sentry
  calls in tests.** Tests set `import.meta.env.MODE === 'test'` and
  `initSentry` already hard-skips in that mode. Adding extra
  test-mode branches in feature code is redundant noise.

### 5b. The "always" list

- **Always go through `captureError` / `captureMessage` / etc.** Never
  call `Sentry.captureException` directly. The wrappers handle the
  pre-init buffer, the activation trigger, the PII scrub, and the
  `isSentryEnabled` guard.
- **Always include a coarse cohort tag.** `setTag("tier", tier)` etc.
  on key surfaces. Errors without cohort context can't be
  prioritised.
- **Always use a typed breadcrumb helper** (`breadcrumbs.ts`) when one
  exists. Free-form `addBreadcrumb` calls are accepted but the typed
  helpers are easier to grep.
- **Always classify the RLS table.** `captureRlsDenied(table, op)`
  goes through `classifyRlsTable` so the dashboard tag never leaks
  raw schema names.

### 5c. Storage / sync boundaries

| Where                            | Local?      | Server (Sentry)? | Notes                                                                          |
|----------------------------------|-------------|------------------|--------------------------------------------------------------------------------|
| Boot error buffer (in-RAM)       | ✓           | —                | Cleared on flush or 10s hard-cap.                                              |
| `CHUNK_EB_RELOAD_KEY` flag       | ✓ sessionSt | —                | One-time chunk-recovery reload.                                                |
| Sentry events                    | —           | ✓                | After scrub + dedupe; user.id only.                                            |
| Session Replays                  | —           | ✓ (web only)     | 10% baseline + 100% on-error; mask/block defaults.                             |
| `logAiUsage` (server)            | —           | Supabase + log   | Metadata only.                                                                 |
| Audit log (server)               | —           | Supabase         | Admin/billing/security actions. Read by ops only.                              |

### 5d. The native bypass contract

Web is route-gated. **Native is not.** `NativeBootstrap.tsx` calls
`activateSentry("native-cold-start")` in the same effect that mounts
the native UX plugins (splash hide, status bar, keyboard resize). The
reasoning:

- Native cohorts skew anonymous, so the auth-verified trigger rarely
  fires.
- The native SDK ships inside the app bundle, so the chunk-fetch cost
  concern doesn't exist.
- Cold start is the right moment because Bar #6 cares about
  *crash* telemetry; a crash that happens before activation would
  otherwise be lost.

This is a deliberate web-vs-native posture difference. Don't add a
parallel native route-gate without first weighing the cost — the
current asymmetry is a working contract.

---

## 6. Known gotchas / pitfalls

### 6a. The activation can be silent — verify Sentry is actually up

`isSentryEnabled()` returns `true` ONLY when init reached the
"ready" state. If the DSN is empty / test mode / dynamic-import
failed, it returns `false` — but `whenSentryReady()` STILL resolves
(it resolves on terminal-state, not success). So pairing
`whenSentryReady()` with a flush requires the flusher to check
`isSentryEnabled()` and choose replay vs. console-drop.

If you're debugging "I called `captureError` and nothing shows up in
the dashboard", check (1) is `VITE_SENTRY_DSN` set in the env the
host uses (Netlify primary post-2026-05-27 migration; Vercel as the
documented recovery host), (2) is `isSentryEnabled()` returning
`true` at the time of the call, (3) is the event being suppressed by
`scrubEvent`'s rules.

### 6b. Pre-init `captureMessage` does NOT round-trip

Per the `captureException.ts` file head:

> The FIRST pre-init call's payload is not replayed (these aren't
> exceptions; the boot buffer only round-trips through
> captureException, and captureRlsDenied's `rls_*` tags can't survive
> a bare-exception replay). This keeps the security RLS alert
> (#578/#562) live for an anonymous user — it keys on SUSTAINED
> denials, which a regression always produces — while a one-off
> pre-init signal is the acceptable cost of the route-gate.

If you depend on a single pre-init `captureMessage` reaching the
dashboard, you'll lose it. The right shape is to either (a) emit a
real exception (which DOES round-trip), or (b) emit the signal again
post-init.

### 6c. Web vs native do NOT share Replay

`@sentry/capacitor` doesn't support Session Replay. On native, only
crash + breadcrumb data lands; on web, the 10% sample of replays
lands too. When you're triaging a native crash and reach for the
replay, it's not there — that's correct, not a bug.

### 6d. `Capacitor.getPlatform()` is read at runtime, not at build time

The platform fork in `sentryInit.ts` lines 200–257 reads the platform
at runtime. This means:

- A native build that doesn't `npx cap sync` after a code change
  ships the OLD bundle to the device, but the platform value is
  still `ios` / `android`. So you can see "native" platform tags in
  Sentry for events that came from stale builds. Use the `release`
  tag (`sentry.release`) to disambiguate.
- A web preview can NEVER produce `platform: ios` / `android` events.
  If you see one, the event came from a real device, not a preview.

### 6e. `scrubEvent` doesn't see `setTag` calls

`beforeSend` runs over `event.message`, exception messages, request
body, query string, and breadcrumb messages. It does **not** scrub
`tags`. So if you `setTag("custom_field", userEmail)`, the email
ships to the dashboard.

The fix: never put PII in a tag. Tags are coarse cohort labels only.
Free-form values go in `context` (which DOES go through scrubbing).

### 6f. `looksLikeChunkLoadFailure` deprioritises a real signal class

Chunk-load failures are usually stale-deploy artefacts and the
one-time auto-reload in `main.tsx` recovers them. So `scrubEvent`
treats them as low-noise — they're tagged but not up-ranked into
alerts.

But the chunk-load class can also fire on a legitimate CDN outage. If
you see a sustained `chunk_load_failure` count, **don't** assume
stale deploy — check the current host's edge-cache status (Netlify
post-2026-05-27 migration; check the Netlify dashboard's Deploys +
edge-cache state), Cloudflare's CDN status, and the `/version.json`
rollout state.

### 6g. Canonical Web Vitals path

`src/lib/perf/webVitalsTracking.ts` is the canonical live emitter for
Web Vitals (LCP / CLS / INP / TTFB / FCP). A sibling dead-code file
historically lived at `src/lib/performance/web-vitals.ts` and was a
common source of confusion — same domain, different module, near-
identical name. It was deleted in `chore/remove-dead-web-vitals-
sibling` after a zero-importer audit. When adding a new Vital report
or threshold, edit `src/lib/perf/webVitalsTracking.ts` +
`src/config/perfBudget.ts`. There is no other Web Vitals module.

### 6h. The 10s hard-cap flush is the lower bound, not the upper bound

If Sentry comes up in 200 ms, the buffer flushes in 200 ms. If it
doesn't come up in 10 s, the buffer drops. So an event that fired at
T=0 but Sentry didn't come up until T=11s is lost. This is intentional
— the trade-off is "don't hold a memory leak" vs "catch every event".
On the route-gate path, the boot buffer is precisely the bridge for
"early errors that proved we need monitoring this session".

### 6i. `armSentryActivation` is one-shot

Once armed, you cannot re-arm with a different activator in the same
session. `resetActivation()` exists ONLY for tests. If you find
yourself wanting to re-arm in production, you're probably trying to
swap the SDK at runtime — don't.

### 6j. Privacy posture extends to logs, not just Sentry

The `TUTOR_LOG_REDACTION_RULES` in `src/lib/ai-tutor/types.ts` are
the canonical regex set; the billing layer borrows them; observability
should too. Specifically: `logAiUsage` (server) and any client-side
`logger` call paths must run the same scrub. If you find a log line
in the host's function logs (Netlify Functions tab post-2026-05-27
migration; Vercel's logs apply only on the documented recovery host)
that contains an email or JWT, **that is a bug** — open it.

### 6k. Sentry's `release` tag must match what's deployed

The `release` tag in `sentryInit.ts` is read from `VITE_SENTRY_RELEASE`
(or a fallback). If the release tag doesn't match what's deployed,
sourcemap symbolication fails. Memory:
[[feedback_sentry_triage]] step 2 is "release" precisely because this
is the first thing to check. The `production-deploy.yml` workflow
pushes the right release tag; pre-#657 workflows did not.

---

## 7. Cross-references

- **[system-overview.md §16](../system-overview.md#16-observability-sentry--monitoring--perf)** — one-paragraph version.
- **[data-flow.md §2e](../data-flow.md#2e-pwa-service-worker--offline-cache)** — the PWA service worker's network-first behavior interacts with chunk-load errors.
- **`docs/OBSERVABILITY.md`** — operator handbook.
- **`docs/slo-handbook.md`** — SLO targets.
- **`docs/PERFORMANCE_NOTES.md`, `docs/REACT_PERFORMANCE_OPTIMIZATION.md`** — perf playbook.
- **`docs/SECURITY_HARDENING_2025.md`** — security side of the
  observability surface (RLS alerts).
- **Sibling deep-dives:**
  - [`native-shells.md`](./native-shells.md) — the platform fork's
    native half lives there.
  - [`ai-tutor.md`](./ai-tutor.md) — `logAiUsage` is the AI Tutor's
    audit surface; same metadata-only posture.
  - [`billing-entitlement.md`](./billing-entitlement.md) — Sentry RLS
    alerts ground the entitlement / profiles / subscriptions hardening
    (#578).

---

## 8. How to extend this — checklist

### 8a. Adding a new captured event class

- [ ] Use the existing `captureError` / `captureMessage` / etc.
      Don't import `@sentry/react` directly.
- [ ] Decide the level: `info` for "noteworthy but normal," `warning`
      for "degraded but recovered," `error` for "user is impacted."
- [ ] Include cohort tags (`tier`, `platform`, `auth_state`) via
      `setTag` BEFORE the capture. The scope binding is what
      makes the dashboard groupable.
- [ ] Add a typed breadcrumb helper in `breadcrumbs.ts` if there
      isn't one for this category.
- [ ] If the event is sensitive (RLS, billing, security), use a
      specialized wrapper (`captureRlsDenied`) and include the
      relevant classification tags.
- [ ] Add a unit test covering: (a) the wrapper is called with the
      expected payload, (b) PII in `context` is scrubbed, (c)
      pre-init path queues / triggers as expected.

### 8b. Adding a new alert rule

Alert rules live in the **Sentry dashboard**, not in the repo.

- [ ] Open the rule UI in the Sentry dashboard.
- [ ] Group by stable dimensions (release, environment, tag, fingerprint),
      not by message string (which changes when copy edits).
- [ ] Set the condition (count > N over T minutes, or rate > X).
- [ ] Route the alert to the right channel (Slack / email / pager).
- [ ] **Document the rule id in `MEMORY.md`** under
      `project_sentry_infra_access` so future agents know it exists.

### 8c. Adding a new perf metric

- [ ] Decide which dir: `src/lib/perf/` for new code; do NOT extend
      `src/lib/performance/`.
- [ ] Emit through `src/lib/observability/metrics.ts` if it's a
      domain metric (room load, audio play, validation).
- [ ] Web Vitals: extend `webVitalsTracking.ts` and update SLO targets
      in `docs/slo-handbook.md`.
- [ ] If the metric should appear in Sentry, emit a `setTag` + an
      `info`-level `captureMessage` from the perf module.
- [ ] Add a unit test.

### 8d. Adding a privacy rule

- [ ] Add the regex to `src/lib/security/piiProtection.ts:stripPII`.
- [ ] Add the mirror to `TUTOR_LOG_REDACTION_RULES` in
      `src/lib/ai-tutor/types.ts` (it's the canonical set).
- [ ] Add a unit test that the new rule scrubs the new shape AND
      doesn't over-match (false positives).
- [ ] If the rule should apply to Session Replay's text masking
      (i.e. a NEW field type to block, beyond `maskAllText`), that
      requires a Sentry dashboard config change, not a code change.

### 8e. Tightening the activation gate

- [ ] Don't loosen by default — the gate is what keeps `/privacy`
      free of the SDK chunk. New triggers cost the legal-page
      visitor.
- [ ] If you must add a trigger, define it in `sentryActivation.ts`
      and document the reason in the file header.
- [ ] Make sure the trigger is *evidence-based* — "this proved
      monitoring is needed this session", not "this might want
      monitoring later".

### 8f. Closing §15 Axis 1 Bar #6 (native crash telemetry)

- [ ] Confirm `NativeBootstrap.tsx` activates Sentry on native cold
      start (it does, today).
- [ ] Build a native release that triggers a crash on demand
      (e.g. a /dev/sentry-smoke route — `src/pages/SentrySmokeTest.tsx`
      exists for the web equivalent).
- [ ] Run on a physical iOS device. Confirm the event lands in
      `chau-doan/mercyblade-web` with `platform: ios`.
- [ ] Same for a physical Android device. Confirm `platform: android`.
- [ ] Pin the Sentry issue IDs in the §15 Bar #6 row of
      `STRATEGY.md`.
- [ ] Tick the bar.

---

## 9. The two-line summary

> Observability is a three-seam system: a **route-gate** that keeps
> the Sentry chunk off static pages until evidence of need fires
> (boot error, auth verification, or explicit capture); a **platform
> fork** that wraps `@sentry/capacitor` inside the native shell but
> uses `@sentry/react` directly on web (otherwise the native init
> promise can hang and silently drop every event); and a **privacy
> posture** of `id`-only user binding, `stripPII` on every event +
> breadcrumb, and dropped `ui.input` breadcrumbs. The perf side is
> `src/lib/perf/` (canonical) plus `src/lib/performance/` (legacy)
> plus server-side `_shared/sentry.ts`. Filter noise via the Sentry
> dashboard, never code.

If you ever need to explain observability in two sentences, those
are them.
