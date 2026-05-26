# Native Sentry init audit — current state + gap list (A7c)

**Owner:** A7
**Date:** 2026-05-19
**Scope:** read-only audit; no native files touched
**Primer §h:** A38 was recon-only; native Sentry verification still parked

## TL;DR

JS-side fork shipped by PR #271 is **intact** on current `main`. Native SDK pods are installed on iOS. Android has zero Sentry native code — which is **correct** for `@sentry/capacitor` (bridge-mediated, not native-SDK-direct). Web-side Sentry is fully verified (#740, PR #808 smoke-test). **Native is wired but never end-to-end verified on a real device build, and iOS dSYM upload to Sentry has no CI step.** Estimated dispatch: **1 PR (iOS dSYM upload) + 1 manual device verify task**. Android ProGuard map upload is a non-issue today (release build has `minifyEnabled false`).

---

## 1. JS fork — PR #271 intact

**File:** `src/lib/monitoring/sentryInit.ts` (lines 200–256)

The `Capacitor.isNativePlatform()` fork is in place exactly as PR #271 fixed it:

- **Native branch (lines 214–236):** dynamically imports `@sentry/capacitor`, calls `SentryCap.init(nativeOptions, SentryReact.init)` — the documented pattern where the second arg is the browser-client init that `@sentry/capacitor` delegates to **after** native bridge resolution.
- **Web branch (lines 237–257):** skips the Capacitor wrapper entirely, calls `SentryReact.init(webOptions)` directly. This is the bug PR #271 fixed — outside a Capacitor shell, `@sentry/capacitor`'s `NATIVE.initNativeSdk()` promise never resolves and the browser client is never bound, silently dropping every captured exception.

Comment block at lines 14–27 still documents the original failure mode; no drift. A `platform` tag (web / ios / android) is set on every event via `Capacitor.getPlatform()` (line 233), so Sentry's dashboard can already filter web vs native.

**Verdict:** the fork is healthy. No PR needed here.

## 2. Native SDK wiring — installed, never verified

### iOS

- `ios/App/Podfile` line 5: `pod 'SentryCapacitor', :path => '../../node_modules/@sentry/capacitor'`
- `ios/App/Podfile.lock`: `Sentry 9.8.0` + `SentryCapacitor 4.0.0` (current major)
- `ios/App/App/AppDelegate.swift`: **no** `SentrySDK.start(...)` call
- `ios/App/App/Info.plist`: no Sentry keys
- `capacitor.config.ts`: no Sentry plugin block

This is **expected** for `@sentry/capacitor`. The DSN flows from JS (`Sentry.init({dsn})`) through the Capacitor bridge to the native SDK; there is intentionally no `SentrySDK.start()` in `AppDelegate.swift`. **Trade-off:** native crashes that occur **before** the JS bridge has loaded (the first few hundred milliseconds of app launch) are not captured. Mitigation would require a manual `SentrySDK.start()` in `application(_:didFinishLaunchingWithOptions:)` before `return true`. Not a blocker for the gap list; flagged as known limitation.

### Android

- `android/app/src/main/AndroidManifest.xml`: **zero** Sentry references
- `android/app/build.gradle`: no Sentry Android Gradle plugin
- `android/app/src/main/java/com/chaudoan/mercyblade/MainActivity.java`: 5-line `extends BridgeActivity {}`, no `SentryAndroid.init`
- `android/app/build.gradle` release build: `minifyEnabled false` — **no ProGuard / R8** running

Also correct for `@sentry/capacitor`. The Capacitor bridge plugs into the Java SDK auto-init.

**Important consequence of `minifyEnabled false`:** Android release builds today are not minified, so stack traces from Java/Kotlin native code are already readable. **No ProGuard map upload step is needed today.** When we flip `minifyEnabled true` for the Play Store build (we will, for APK size + obfuscation), the Sentry Android Gradle plugin (`io.sentry.android.gradle`) becomes required for map upload. Tracking this as deferred.

## 3. DSN propagation

- Source: `import.meta.env.VITE_SENTRY_DSN` (sentryInit.ts:135)
- Committed: `.env.example` has only the placeholder `VITE_SENTRY_DSN=` (no value)
- Real DSN: lives in Vercel env vars + local `.env.local` (gitignored). Pulled by `vercel pull` during `production-deploy.yml`.
- The DSN reaches **both** iOS and Android targets via JS — `@sentry/capacitor`'s `init()` relays it to the native SDK over the bridge. **No separate native-side DSN registration is required**, and confirming there isn't a hard-coded backup DSN in `Info.plist` or `AndroidManifest.xml` is itself a privacy + correctness win (single source of truth).

## 4. Sourcemap / debug-symbol upload — web only

- `.github/workflows/production-deploy.yml` lines 41–43, 70–85: JS sourcemaps upload to Sentry org `chau-doan`, project `mercyblade-web` via `@sentry/vite-plugin` during `vercel build`. Status step is non-blocking + visible. Verified end-to-end by PR #808 smoke test.
- **iOS dSYMs:** no upload step exists in any CI workflow or Xcode build phase. After a TestFlight or App Store build runs, the dSYMs sit in Xcode's local archive folder and never reach Sentry. Native iOS crashes will arrive in Sentry as raw memory addresses (`0x100abcdef`) — unreadable.
- **Android maps:** non-issue while `minifyEnabled false`. Flips to "needed" when we minify.

## 5. What "native Sentry init verified" would mean

Three independent things, in increasing order of effort:

**(a) JS-on-native init succeeds.** Open a TestFlight build, observe the `[sentry] initialized (env=production, platform=ios)` console log (visible via Safari → Develop → device → Web Inspector). Proves `SentryCap.init(opts, SentryReact.init)` resolved. Trigger the existing smoke-test route (`/__sentry-smoke-test?confirm=throw`, PR #808) inside the WebView — event should arrive in Sentry with `platform: ios` tag. This is **manual, one-time, no PR needed** — repeat once for iOS, once for Android.

**(b) Native crash makes it to Sentry.** Force-crash the iOS app (e.g., a deliberate `fatalError()` in a debug-only menu item, or call a non-existent Capacitor plugin method). Confirm an event arrives. **Without dSYM upload (gap #2 above), the stack frames will be raw addresses — capture works, but symbolication doesn't.**

**(c) Symbolicated native crash.** Same as (b) but with iOS dSYMs uploaded so frames resolve to `AppDelegate.swift:42` etc. Requires the iOS dSYM upload pipeline below.

## 6. Gap list (5 bullets)

1. **iOS dSYM upload to Sentry has zero pipeline.** Native iOS crashes will arrive with raw memory addresses, not source frames. Fix: add `scripts/upload-ios-dsyms.sh` invoking `sentry-cli debug-files upload`, run from an Xcode "Run Script" build phase (Release config only) or post-archive in CI. **Single PR.**
2. **No device-build verification of (a)+(b) has ever happened.** Distinct from (1) — even without dSYMs, we don't know if events arrive at all on native. Web's PR #808 smoke test gives us the route to use; we just need one TestFlight build and one Android Internal Testing build. **Manual task, no PR.**
3. **Pre-bridge native init window.** Crashes in the first ~hundred ms before JS loads aren't captured (intentional `@sentry/capacitor` trade-off). Mitigation = adding `SentrySDK.start()` in `AppDelegate.swift` + `SentryAndroid.init` in `MainApplication.java` (or `MainActivity.java`). **Deferred** — no evidence today that pre-bridge crashes are a real source of lost data.
4. **Android ProGuard map upload is not wired**, but `minifyEnabled false` means it's not needed today. **Deferred** until the Play Store minified build is enabled. When that flip happens, this becomes a hard blocker. Track as a coupled item with the minify flip.
5. **Sentry project naming.** Workflow uses `SENTRY_PROJECT=mercyblade-web`. Native events under the same project work fine, but if we ever want separate triage queues / alert rules for web vs native, that's a Sentry-dashboard task (create a `mercyblade-ios` + `mercyblade-android` project, route platform tag accordingly). **Cosmetic, no code change.** Flag only.

## 7. Dispatch size estimate

- **1 PR**: `chore(ios): wire sentry-cli dSYM upload to release builds` — adds the upload script + Xcode build phase. Estimated ~30 lines code + small README. Self-contained, no `src/` touches.
- **1 manual device verify task** (not a PR): TestFlight build + Internal Testing APK, hit the smoke-test route from inside each shell, screenshot the Sentry event. Probably 30 min once a build is ready.
- **Deferred** (do not dispatch until evidence): Android ProGuard upload, pre-bridge native `SentrySDK.start()`, native project split in Sentry dashboard.

**Total active scope tonight: 1 PR. Native-Sentry "init verified" is mostly a verification problem, not a wiring problem.**

## References

- `src/lib/monitoring/sentryInit.ts` (lines 14–27, 200–256)
- `src/lib/monitoring/sentryActivation.ts` (route-gate, PR #720)
- `capacitor.config.ts` (no Sentry plugin block — correct)
- `ios/App/Podfile` line 5; `ios/App/Podfile.lock` (Sentry 9.8.0 + SentryCapacitor 4.0.0)
- `ios/App/App/AppDelegate.swift` (no `SentrySDK.start`, intentional)
- `android/app/src/main/AndroidManifest.xml` (no Sentry meta-data, intentional)
- `android/app/build.gradle` (release `minifyEnabled false`)
- `.github/workflows/production-deploy.yml` lines 41–43, 70–85 (web sourcemap upload)
- PR #271 — native/web fork
- PR #720 — Sentry route-gate
- PR #740 — web Sentry full gate
- PR #808 — sourcemap smoke-test route (this branch's predecessor)
