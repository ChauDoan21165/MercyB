# RECON — Native Sentry initialization audit (A38)

**Date:** 2026-05-19
**Branch:** `a38/native-sentry-audit` (off `origin/main` @ 4fbc3a41f)
**Scope:** Determine whether iOS/Android Sentry initializes correctly; recommend fix shape. Recon only — no code shipped.
**Trigger:** Memory #24 follow-up — web Sentry fully route-gated (#720/#740); native side unverified.

---

## TL;DR

The native SDK is **correctly registered and the platform fork is correct** — the
old "web hang" failure mode (memory's `NATIVE.initNativeSdk()` concern) was
already fixed by **PR #271** and is not the issue.

**There IS a real code-level gap, introduced later:** the web-perf route-gate
(**PR #720/#740**) defers `initSentry()` behind 3 JS-side triggers on **all**
platforms, with **no native carve-out**. On iOS/Android this means the native
crash handler is not armed until a JS error / verified-auth / explicit capture
occurs. A **native crash in an anonymous session before any of those** — the
single highest-value native signal — **is silently lost**. The route-gate's
*benefit* (skip the ~156 KB `@sentry/react` network chunk) **does not exist on
native** (SDK is compiled into the app binary), so native pays the gate's full
cost for zero gain.

**Recommended fix:** ~2-line native bypass in `main.tsx` — eagerly
`activateSentry()` at boot when `Capacitor.isNativePlatform() === true`; leave
web route-gating untouched. Then a **real-device smoke test (Chau's job)**.

---

## 1. Current native init state — what works

### 1a. Platform fork — CORRECT (PR #271, commit `38463c882`)

`src/lib/monitoring/sentryInit.ts:200–257` forks at runtime:

- **Native** (`window.Capacitor?.isNativePlatform?.() === true`):
  `await import("@sentry/capacitor")` → `SentryCap.init(nativeOptions, SentryReact.init)`.
  This is the documented `@sentry/capacitor` v4 API (options + the React
  `init` fn as 2nd arg). Native crash handler + JS layer both wired.
- **Web:** `SentryReact.init(webOptions)` directly — bypasses the Capacitor
  wrapper whose `sdkInit` awaits a native-bridge promise that never resolves
  in a plain browser. **The memory's "promise hangs / no client bound" failure
  mode is already fixed here.** Not a live bug.

`platform` tag is set from `Capacitor.getPlatform()` (ios/android/native) so
the dashboard can filter web vs ios vs android.

### 1b. Native module registration — PRESENT on both platforms

- **iOS:** `ios/App/Podfile:20` → `pod 'SentryCapacitor'`;
  `Podfile.lock` pins `SentryCapacitor 4.0.0` + `Sentry 9.8.0` (Core).
  (Tracked in git even though `ios/` is gitignored — Podfile/Podfile.lock are
  force-added per repo convention.)
- **Android:** PR **#680** (`606fab76d`, Cat-4 N7b) registered it —
  `android/capacitor.settings.gradle:23` `include ':sentry-capacitor'` +
  `android/app/capacitor.build.gradle:18` `implementation project(':sentry-capacitor')`.
  Confirmed present on `origin/main`. Before #680 Android native crash
  reporting was OFF (JS init had no Android native module to bridge to); iOS
  always worked via the pod.

**So: the native SDK is installed and the fork is correct. If `initSentry()`
runs on a real device, native crash reporting works.** The open question is
*whether `initSentry()` runs in time* — see §2.

---

## 2. Code-level issue — route-gate has no native carve-out

### 2a. The only `initSentry()` call site is route-gated

`grep` across `src/` confirms the **sole** runtime caller is
`src/main.tsx:184`, inside:

```
armSentryActivation({
  activate: () => { initSentry(); void whenSentryReady().then(() => bootErrors.flush()); setTimeout(() => bootErrors.flush(), 10000); },
  enqueue: bootErrors.capture,
});
```

`initSentry()` is **NOT** called at boot. It runs only when `activateSentry()`
fires, via exactly 3 triggers (`sentryActivation.ts`):

| # | Trigger | Source | Fires on native pre-auth crash? |
|---|---------|--------|----------------------------------|
| 1 | boot error buffer `onFirstCapture` | `bootErrorBuffer.ts:106-107` — `window.addEventListener('error'\|'unhandledrejection', …, true)` | **No** — JS-only. A Swift/ObjC/Kotlin/NDK crash produces no `window` error event. |
| 2 | `AuthProvider.applySession` | `src/providers/AuthProvider.tsx:292` — `if (verified) activateSentry("auth")` | **No** — verified (email-confirmed) sessions only. Anonymous users (the dominant MercyBlade cohort) never reach it. |
| 3 | explicit capture | `captureException.ts:107/145` — app code calls `captureError/Message/Rls` | Only if app JS code explicitly captures first. |

### 2b. Why this is wrong on native specifically

- **The gate's purpose is web-only.** Its rationale (`sentryActivation.ts:1-19`,
  `#720/#740`) is to avoid fetching the **~156 KB `@sentry/react` network
  chunk** on anonymous static-page visits. On native there is **no network
  chunk** — `@sentry/capacitor` + the native Sentry SDK are compiled into the
  `.ipa` / `.apk`. Deferring init saves **zero bytes** on native.
- **The gate's cost is real on native.** `SentryCap.init()` is what installs
  the **native** crash handler (uncaught Swift/ObjC exceptions, Kotlin/Java,
  NDK signals, OOM). Until it runs, native crashes are not recorded. A
  cold-start native crash, or any native crash for an anonymous (not-signed-in)
  user, occurs **before** triggers 1–3 → **lost**. That cold-start / hard-crash
  case is precisely the highest-value reason `@sentry/capacitor` exists.
- **Net:** native inherited a web performance optimization that, on native, only
  removes coverage.

### 2c. Not a regression in #271/#680 — a gap opened by #720/#740

#271 (fork) and #680 (Android reg) are sound. The route-gate (#720 → #740)
was layered on top for web LCP wins without a native exception. This is a
*design omission*, not broken init code. Severity: **medium** — native crash
reporting is partially blind (works only post-trigger), silently.

---

## 3. Recommended fix scope (do NOT ship — recon recommendation only)

**Smallest safe diff (preferred, ~2 lines, reuses all existing plumbing):**

In `src/main.tsx`, immediately **after** the `armSentryActivation({...})` call,
add a boot-time native bypass using the same guard already used inside
`sentryInit.ts`:

```ts
// Native: no chunk-fetch cost (SDK is in the app binary) and the native
// crash handler must be armed before a pre-auth/cold-start native crash.
// Bypass the web route-gate; keep web fully gated.
try {
  const w = window as { Capacitor?: { isNativePlatform?: () => boolean } };
  if (w.Capacitor?.isNativePlatform?.() === true) activateSentry("native-eager");
} catch { /* never block boot on the probe */ }
```

Why this shape:
- `activateSentry` is idempotent and one-time; the `activate` closure already
  wires `initSentry()` + `whenSentryReady → bootErrors.flush` + the 10 s
  hard-cap. The bypass reuses **all** existing terminal-state plumbing — no new
  code paths, no duplicate flush logic. Aligns with CLAUDE.md "small diffs over
  smart diffs" and "central files are dangerous."
- Web path is **completely unchanged** → #720/#740 LCP win preserved; no new
  Sentry bytes on anonymous web static pages.
- Optionally wrap in `requestIdleCallback` / post-first-paint so native TTI
  isn't delayed by the dynamic `@sentry/capacitor` import — but it must NOT be
  behind triggers 1–3.

**Out of scope / explicitly not recommended:** touching the platform fork,
`sentryInit.ts` internals, Podfile/gradle (already correct), or `capacitor.config.ts`
(N4 owns plugins; Sentry needs no plugin config). No `ios/`/`android/` edits —
this is a `src/`-pure change (consistent with the "native work phasing" rule:
zero-decision src-only native PRs are allowed now).

---

## 4. Real-device test requirements (Chau's job — agents cannot do this)

Code review cannot prove the native handler actually fires or that the build
carries a DSN. Required on a **real iOS device AND a real Android device**
(not simulator/web preview — native crash signals and the Capacitor bridge
behave differently there):

1. **DSN sanity:** confirm the `dist/` that was `cap sync`'d was built with a
   non-empty `VITE_SENTRY_DSN` (it's inlined at `vite build` time). Empty DSN ⇒
   `initSentry()` no-ops on every platform regardless of this fix. Check the
   `[sentry] initialized (env=…, platform=ios|android)` console line via Safari
   Web Inspector (iOS) / `chrome://inspect` (Android).
2. **Test A — pre-trigger native crash (confirms the bug, current code):**
   fresh install, do **not** sign in, force an early **native** crash before any
   JS error. **Expected with current main: NOT captured.** Confirms §2.
3. **Test B — JS error on native:** trigger a JS exception on native; confirm it
   reaches Sentry with `platform:ios`/`android` (validates the fork end-to-end).
4. **Test C — post-fix re-run of Test A:** after the §3 bypass lands, repeat
   Test A; the anonymous pre-auth native crash must now appear, tagged
   `platform:ios`/`android` (not `web` / fallback `native`).
5. Confirm `platform` tag resolves to `ios`/`android` (not the `"native"`
   fallback string), i.e. `Capacitor.getPlatform()` returns the real platform.

---

## 5. Verdict

- **Fix needed: YES.** One small, web-safe, `src/`-only change (§3).
- Native SDK registration and the platform fork are correct — do not touch them.
- The actual defect is the route-gate covering native with no carve-out, costing
  native crash coverage for anonymous / cold-start sessions and gaining nothing.
- After the fix, the **real-device smoke test (§4) is the verification gate** and
  belongs to Chau, not an agent.

— A38, recon only, operator artifact (no PR).
