# Native Shells (Capacitor — iOS + Android) — Deep Dive

> **Sibling of** [system-overview.md §20](../system-overview.md#20-native-shells-capacitor--ios--android).
>
> The native shells are how MercyBlade ships to the App Store and
> Google Play. There is **one shared web bundle** wrapped by **two
> divergent native projects** — divergent intentionally, because Apple
> and Google bundle-ID conventions diverged at first publish and
> "alignment" later would require re-registering with both stores.
> This doc is the reference for everything that has to know it's
> running natively (or has to know it isn't).
>
> **Read first:**
> - `capacitor.config.ts` (the shared Capacitor config — plugin opts)
> - `src/lib/platform.ts` (the `getPlatform` / `isNativePlatform`
>   wrapper — every native-only path goes through here)
> - `src/components/native/` (the four native-only React shells)
> - `src/lib/nativeOAuth.ts` (deep-link auth, the most subtle native
>   path)
> - `docs/app-store-submission/SUBMISSION_RUNBOOK.md`,
>   `docs/app-store-submission/ios-submission-checklist.md`,
>   `docs/app-store-submission/android-submission-checklist.md`

---

## 1. What it does, and why it matters strategically

The native shells:

1. **Package the web bundle as a real app** — the SPA in `dist/` is
   copied into the iOS app's resource bundle and the Android APK's
   assets at `npx cap sync` time. A user installs an app from the
   App Store or Google Play; behind the WebView it's our `dist/`.
2. **Bridge native-only capabilities** — splash screen, status bar,
   keyboard resize, deep-link handling, in-app browser for OAuth,
   StoreKit / Google Play Billing via RevenueCat for IAP, native
   Sentry SDK for crash reporting.
3. **Satisfy store guidelines** — Apple guideline 3.1.1 (iOS
   subscriptions go through IAP, not Stripe), 4.0 (OAuth stays
   in-app, not in external Safari).

Why it matters strategically:

- **ROADMAP Step 1 (iOS + Android in Stores — ~60%).** The native
  shells are the gating work. Last builds: Apple Build 8 (April 25)
  and Google Play Build 4 (April 25). `STRATEGY.md` §6 explicitly
  marks no fresh upload since.
- **§15 Axis 1 Bar #6 (native crash telemetry, open).** Bar #6 cares
  about *crashes from real devices*, not from CI emulators. The
  native shells are the surface that produces those crashes; the
  `NativeBootstrap.tsx` activation of Sentry on cold start is what
  makes them reportable. See
  [`observability.md` §2b](./observability.md#2b-the-platform-fork-sentryinitts-lines-200257).
- **Memory: [[feedback_native_work_phasing]]** — "Web-only today; do
  only zero-decision `src/`-pure native PRs now, defer store-coupled
  native-file work to ~2–4 weeks pre-submission." Hard stop if a
  `src/` fix needs `ios/` or `android/` edits.
- **`STRATEGY.md` §9 (Distribution).** Web is the live distribution
  surface today (mercyblade.com). The native shells are the next
  distribution multiplier when the store-side push resumes.

---

## 2. Bundle-ID and OAuth scheme divergence (permanently asymmetric)

This is the most-misunderstood fact about the native shells.

| Property              | iOS                          | Android                          |
|-----------------------|------------------------------|----------------------------------|
| Application ID        | `com.chaudoan.mercyblade`    | `com.mercyapps.mercyblade`       |
| OAuth scheme          | `com.mercyapps.mercyblade://`| `com.mercyapps.mercyblade://`    |
| App Store / Play tile | Mercy Blade                  | MercyBlade                       |
| First publish locked  | yes                          | yes                              |

The iOS bundle id is `com.chaudoan.mercyblade`. The Android
application id is `com.mercyapps.mercyblade`. They were registered
divergently at first publish and the store conventions effectively
locked them — re-aligning would require a new bundle id (a fresh
app listing) on at least one side.

**The OAuth scheme is `com.mercyapps.mercyblade://` on BOTH
platforms.** The iOS bundle id is `com.chaudoan.mercyblade` but the
URL scheme it registers is the Android-style one — that's so the same
Supabase redirect URL works for both, and so a deep link arriving on
either platform's `App.appUrlOpen` event matches the same prefix in
`nativeOAuth.ts`.

Memory: [[project_android_urls]] — *"Android applicationId
`com.mercyapps.mercyblade` (locked at first Play publish, permanently
divergent from iOS `com.chaudoan.mercyblade` — do NOT 'align'); OAuth
scheme `com.mercyapps.mercyblade://`; all Android user-facing URLs
use mercyapps."*

If you see a brief that says "align the bundle ids" — refuse. The
asymmetry is intentional and load-bearing.

---

## 3. Key files and their roles

### 3a. Configuration

| File                                 | Role                                                                                                                                                          |
|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `capacitor.config.ts`                | Shared Capacitor config (TS, not JSON, because parts are dynamic). `appId: 'com.chaudoan.mercyblade'`, `appName: 'Mercy Blade'`, `webDir: 'dist'`. Plugin opts for SplashScreen / StatusBar / Keyboard / Browser. |
| `ios/App/App/capacitor.config.json`  | Generated at `npx cap sync ios` time. Mirrors the `.ts` file. Includes `packageClassList` for native plugin registration (AppPlugin, CAPBrowserPlugin, PurchasesPlugin, SentryCapacitorPlugin). |
| `android/`                           | The Android project. `applicationId` lives in `android/app/build.gradle` (NOT in capacitor.config.ts — Android takes its app id from gradle).                 |
| `ios/App/App/Info.plist`             | iOS Info plist. **Don't touch** unless a new permission is required (memory: [[feedback_ios_info_plist_stability]] — readiness floor in place as of PR #217). |
| `ios/App/App/AppRelease.entitlements`| iOS entitlements (Sign in with Apple, IAP, etc.).                                                                                                             |

### 3b. The four native-only React shells (`src/components/native/`)

| File                          | Role                                                                                                                                                          |
|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `NativeBootstrap.tsx`         | One-shot cold-start bootstrap. (1) Hide the splash. (2) Set iOS status-bar style. (3) Lock Android keyboard resize mode. (4) Pull Sentry init early. Mounted once at router root. |
| `AndroidBackButton.tsx`       | Android-only hardware Back handler. Without it, Capacitor's default kills the app from history-empty; with it, Escape-dispatch → in-app back → press-twice-to-exit-from-home. |
| `NativeDeepLinkListener.tsx`  | App-level `App.appUrlOpen` listener. Routes OAuth callbacks (Google / Facebook / Apple) into `handleDeepLink` regardless of which screen the user is on.       |
| `__tests__/`                  | Unit tests for the three shells.                                                                                                                              |

All four follow the **headless, single-owner, platform-gated** pattern:

- Mounted once at the router root in `main.tsx` / `AppRouter.tsx`.
- Render nothing.
- Plugin packages are dynamically imported inside the native branch so
  they never enter the web bundle.
- Every native call is wrapped in try/catch so a missing / failed
  plugin can never break app boot — "the core path survives optional
  failures" (`CLAUDE.md` operating discipline).

### 3c. Native lib glue

| File                              | Role                                                                                                                                                          |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/lib/platform.ts`             | `getPlatform(): "ios" \| "android" \| "web"` and `isNativePlatform(): boolean`. Every native-only branch routes through here.                                  |
| `src/lib/nativeOAuth.ts`          | `signInWithNativeOAuth({ provider })`, `handleDeepLink(url)`, `registerDeepLinkListener(onSession)`. The in-app OAuth contract (Apple App Review guideline 4.0). |
| `src/lib/iap.ts`                  | RevenueCat-backed IAP wrapper. iOS subscriptions flow through StoreKit via RevenueCat (Apple guideline 3.1.1). Android uses Stripe today.                      |
| `src/lib/audio/` (native-aware)   | Audio paths use the same `roomAudioResolver` on web and native; the PWA service worker is skipped on native (the SPA is bundled into the app, so its assets are local). |

### 3d. Native-aware components

| File                              | Role                                                                                                                                                          |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `src/components/iap/`             | IAP UI surfaces. Show different copy on iOS (Apple language requirement) vs. Android (Stripe).                                                                |
| `src/components/payment/`         | Payment UI. Platform-gated price display, button copy, "restore purchases" entry on iOS.                                                                       |
| `src/screens/Pricing.tsx`         | The platform switch lives here — Stripe on web/Android, IAP on iOS. See [`billing-entitlement.md`](./billing-entitlement.md).                                  |

### 3e. Capacitor plugin set

The native projects register a fixed plugin set (from
`ios/App/App/capacitor.config.json:packageClassList`):

- **AppPlugin** — `@capacitor/app` (lifecycle, deep links, hardware back).
- **CAPBrowserPlugin** — `@capacitor/browser` (in-app Safari /
  Chrome Custom Tabs for OAuth).
- **PurchasesPlugin** — `react-native-purchases` (RevenueCat).
- **SentryCapacitorPlugin** — `@sentry/capacitor` (native crash
  reporting, fed through the platform fork in
  [`observability.md`](./observability.md)).

Plus the UX-only plugins gated by `NativeBootstrap`:
`@capacitor/splash-screen`, `@capacitor/status-bar`,
`@capacitor/keyboard`.

### 3f. Build & submission tooling (`scripts/`)

| File                              | Role                                                                                                                                                          |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `scripts/build-for-submission.sh` | Bundles web → `dist/`, runs `npx cap sync ios && cap sync android`, prepares both projects for store upload.                                                  |
| `scripts/upload-ios-dsyms.sh`     | Uploads iOS dSYMs to Sentry post-build for symbolication. See `docs/IOS-DSYM-UPLOAD.md`.                                                                       |
| `scripts/upload-android-mapping.sh.draft` | Android ProGuard mapping upload (DRAFT — not in production use yet).                                                                                   |
| `scripts/build-audio-manifest.ts` | Generates `public/audio/manifest.json` for the room audio resolver. Gitignored output.                                                                         |

### 3g. Store-submission documentation (`docs/app-store-submission/`)

| File                                 | Role                                                                                          |
|--------------------------------------|-----------------------------------------------------------------------------------------------|
| `SUBMISSION_RUNBOOK.md`              | Top-level runbook for a store submission cycle.                                               |
| `ios-submission-checklist.md`        | iOS-specific checklist (TestFlight → App Review → release).                                   |
| `android-submission-checklist.md`    | Android-specific checklist (Internal → Closed → Production).                                  |
| `aso-strategy.md`                    | ASO (App Store Optimization) — keyword research, screenshot strategy.                          |
| `descriptions/`                      | App-store descriptions in EN + VI per asset.                                                  |
| `whats-new/`                         | What's-new notes per release.                                                                 |

---

## 4. Public API / surface contracts

### 4a. Platform detection

```ts
// src/lib/platform.ts
export type Platform = "ios" | "android" | "web";
export function getPlatform(): Platform;
export function isNativePlatform(): boolean;
```

Routing rule: every native-only code path goes through one of these
two functions. **Do not** import `Capacitor` directly in feature
code — `src/lib/platform.ts` is the canonical wrapper.

### 4b. Native OAuth (`src/lib/nativeOAuth.ts`)

```ts
type SupportedProvider = "google" | "facebook" | "apple";

interface NativeOAuthOptions {
  provider: SupportedProvider;
  returnTo?: string;  // optional in-app path post-auth
}

// Start an in-app OAuth flow. Opens the provider URL in
// SFSafariViewController (iOS) or Chrome Custom Tabs (Android) via
// @capacitor/browser.
export function signInWithNativeOAuth(opts: NativeOAuthOptions): Promise<void>;

// Parse a deep-link URL and exchange its tokens for a Supabase
// session. Idempotent on the same URL — the PKCE code is single-use.
export function handleDeepLink(url: string): Promise<Session | null>;

// Register the App.appUrlOpen listener at the router root.
// `onSession(session)` fires when handleDeepLink succeeds.
// Returns the unsubscribe handle.
export function registerDeepLinkListener(
  onSession: (s: Session | null) => void,
): Promise<() => void>;
```

Contract:

- The redirect URL is **always** `com.mercyapps.mercyblade://auth/callback`
  (Android-style scheme on BOTH platforms — see §2).
- Tokens arrive in the URL fragment: `#access_token=…&refresh_token=…`.
- `handleDeepLink` calls `supabase.auth.setSession()`; every consumer
  reacts via `supabase.auth.onAuthStateChange` (AuthProvider, LoginPage,
  ConvertAccount).
- **Single listener at the router root.** Per-screen listeners would
  double-exchange the PKCE code on screens that mounted right when
  the deep link arrived.

### 4c. Native bootstrap contract (`NativeBootstrap.tsx`)

```ts
// Cold-start lifecycle (native only):
//
// 1. Pull Sentry init NOW via activateSentry("native-cold-start")
//    (sentryActivation.ts; the @sentry/capacitor branch in
//    sentryInit.ts boots).
// 2. await Promise.all([
//      import("@capacitor/splash-screen"),
//      import("@capacitor/status-bar"),
//      import("@capacitor/keyboard"),
//    ]);
// 3. SplashScreen.hide()  (capacitor.config has launchAutoHide:false)
// 4. StatusBar.setStyle({ style: Style.Dark })  (iOS)
// 5. Keyboard.setResizeMode({ mode: KeyboardResize.Body })  (Android)
//
// All in a single useEffect. Hard no-op on web.
```

Each plugin call is independently try/catch'd so a missing plugin
doesn't break boot.

### 4d. Android Back handler contract (`AndroidBackButton.tsx`)

```ts
// On hardware Back:
// 1. If an overlay is open  → dispatch Escape (closes Radix
//    Dialog/AlertDialog/Sheet + MercyGuide).
// 2. Else if not at home    → history -1.
// 3. Else (at home)         → press-twice-to-exit within 2s window;
//    show a toast on first press.
//
// Single app-level listener via App.addListener('backButton', …).
// Android-only — explicitly gated; the listener never registers on
// iOS or web.
```

### 4e. IAP / Pricing platform switch (`src/screens/Pricing.tsx` + `src/lib/iap.ts`)

```ts
// In Pricing.tsx (paraphrased — the actual switch lives in-file):
if (getPlatform() === "ios") {
  // Open the RevenueCat-backed paywall (StoreKit under the hood).
  // App Store guideline 3.1.1 — iOS subscriptions must go through IAP.
} else {
  // Stripe checkout (web + Android today).
  // Note: Android Stripe is the *current* state; a future Play Billing
  // migration is a separate dispatch (memory: [[project_android_urls]]).
}
```

### 4f. Sync command contract (`npx cap sync`)

```bash
npm run build         # produces dist/
npx cap sync ios      # copies dist/ → ios/App/App/public, reinstalls pods
npx cap sync android  # copies dist/ → android/app/src/main/assets/public
```

Memory: [[feedback_cap_sync_ios_mechanics]] — *"`cap sync ios` needs
a throwaway gitignored `dist/index.html` placeholder; `ios/` is mostly
gitignored but `Podfile`/`Podfile.lock` are tracked → `git add -f`;
in-worktree `npm ci` not symlink (PR #683 / A28)."*

---

## 5. Invariants

### 5a. The "never" list

- **Never edit `ios/App/App/Info.plist`** unless a new feature
  requires a new permission. Readiness floor PR #217 (memory:
  [[feedback_ios_info_plist_stability]]).
- **Never align the bundle ids.** They are divergent at first
  publish, locked forever, and that's correct. iOS:
  `com.chaudoan.mercyblade`. Android: `com.mercyapps.mercyblade`.
  OAuth scheme is the Android style on BOTH.
- **Never register a per-screen `App.appUrlOpen` listener.** One
  app-level listener in `NativeDeepLinkListener.tsx` only. PKCE
  codes are single-use; a double-listener double-exchanges and the
  second exchange fails.
- **Never make iOS subscriptions go through Stripe.** Apple guideline
  3.1.1 will reject the build. iOS = RevenueCat / StoreKit. The
  platform switch in `Pricing.tsx` enforces this.
- **Never open an OAuth provider URL in `window.open` on native.**
  Apple guideline 4.0 requires the in-app browser (SFSafariViewController
  on iOS, Chrome Custom Tabs on Android). Use
  `@capacitor/browser` via `signInWithNativeOAuth`.
- **Never call `Capacitor.getPlatform()` directly in feature code.**
  Use `src/lib/platform.ts` (`getPlatform` / `isNativePlatform`).
- **Never import a Capacitor plugin at module top-level** if it
  could run on web. Import dynamically inside a native-only branch
  so it never enters the web bundle.
- **Never assume `npx cap sync` ran.** If your change requires a
  new plugin or a config update, **say so explicitly** in the PR
  body — Chau runs `cap sync` and confirms.
- **Never edit `ios/`-prefixed files (other than `Podfile` /
  `Podfile.lock`) in an agent-authored PR** when the brief is
  src-pure. Hard stop, request a re-scope. Native-file work is
  ~2–4 weeks pre-submission and Chau-led (memory:
  [[feedback_native_work_phasing]]).

### 5b. The "always" list

- **Always gate native code with `isNativePlatform()` first.** Even
  when the call is "safe to run on web" (e.g. a Capacitor no-op
  shim), the gate keeps the dependency out of the web bundle's
  module graph.
- **Always try/catch native plugin calls.** The core path must
  survive a missing or failed plugin. Boot must never block on a
  splash hide failing.
- **Always update the submission checklist if you change a permission
  or capability.** Apple's privacy nutrition labels and Google Play's
  Data Safety form must reflect what the code does.
- **Always upload dSYMs to Sentry post-iOS-build** via
  `scripts/upload-ios-dsyms.sh`. Without dSYMs, native iOS crashes
  in Sentry are not symbolicated and Bar #6 evidence is useless.
- **Always test deep-link arrival on a real device.** Capacitor's
  web shim does not exercise `App.appUrlOpen`. Memory:
  [[project_sentry_infra_access]] anchors the Sentry side; the
  device side is Chau-confirmed manually.

### 5c. Storage / sync boundaries

| Where                                  | Local? | Native? | Web? |
|----------------------------------------|--------|---------|------|
| Supabase JWT (after OAuth)             | ✓      | ✓       | ✓    |
| `mb.lang.pair`, `mercyblade.nativeLang`| ✓      | ✓       | ✓    |
| `mb.stage3a.*` ring buffers            | ✓      | ✓       | ✓    |
| Workbox runtime cache                  | ✓      | —       | ✓    |
| PWA service worker                     | —      | —       | ✓    |
| Capacitor preferences (`@capacitor/preferences`) | ✓ | ✓ (on disk) | — |

The PWA service worker is registered **only on web** (`src/main.tsx`
guards the registration). On native, the SPA's assets are already in
the bundle, so SW caching is redundant.

### 5d. The pre-submission native-work window

Memory: [[feedback_native_work_phasing]]. Hard rule:

- Web-only today; do only **zero-decision `src/`-pure native PRs**
  now.
- **Defer store-coupled native-file work** to ~2–4 weeks
  pre-submission.
- **Hard stop** if a `src/` fix needs `ios/` or `android/` edits.

If a brief lands that requires `ios/` or `android/` file changes
outside the pre-submission window, refuse and request a re-scope.
The reason: native-file changes need a full `cap sync` + native
build + device test cycle, which is Chau's wall-clock budget, not
mine.

---

## 6. Known gotchas / pitfalls

### 6a. The OAuth scheme is Android-style on BOTH platforms

Half the people who see `com.mercyapps.mercyblade://` in
`nativeOAuth.ts` assume it's an Android-only scheme. It is **the
scheme used by both platforms**. The iOS bundle id is
`com.chaudoan.mercyblade`; the iOS URL scheme it registers is the
Android-style `com.mercyapps.mercyblade://`. That asymmetry is what
lets the same Supabase redirect URL work on both.

If you see a brief saying "fix the iOS OAuth scheme to match the
bundle id" — refuse. That's a regression to the pre-2026 state.

### 6b. `App.appUrlOpen` doesn't fire on the web shim

The `@capacitor/app` web shim no-ops `App.appUrlOpen`. So OAuth deep
links on web go through the **Supabase auth callback URL**
(`/auth/callback`) handled by `AuthRedirect`. Native deep links go
through `App.appUrlOpen` → `handleDeepLink`. The two paths are
intentionally separate; don't try to merge them.

### 6c. `Capacitor.isNativePlatform()` is reliable; `getPlatform()` is what to tag

Both come from `@capacitor/core`. `isNativePlatform()` returns the
boolean fork; `getPlatform()` returns the string for Sentry tags
and per-platform UI copy. Use `isNativePlatform()` for branching,
`getPlatform()` for tagging and copy switches.

### 6d. The splash screen has `launchAutoHide: false` deliberately

Without that, Capacitor auto-hides the native splash before React
commits — which gives the user a cold-start blank flash between the
splash and the first web paint. `NativeBootstrap.tsx`'s
`SplashScreen.hide()` call AFTER React commits is what closes that
gap. If you set `launchAutoHide: true` "for simplicity," you re-open
the flash.

### 6e. Sentry on native requires dSYMs to be uploaded post-build

A native iOS crash that lands in Sentry without dSYMs uploaded is a
stack of memory addresses. Bar #6 closure requires *human-readable*
crash data. The `scripts/upload-ios-dsyms.sh` runs **after** the
archive is built; if you skip it, the bar evidence is incomplete.

Memory: [[project_sentry_infra_access]] — Sentry auth token in
Keychain `mb-sentry-auth-token`. The script reads it.

### 6f. Android does Stripe today, NOT Google Play Billing

Per `STRATEGY.md` §6 and `Pricing.tsx`, Android subscriptions
currently flow through Stripe. A future migration to Google Play
Billing is a separate dispatch. Reasons:

- Play Billing is required *only* for digital goods consumed inside
  the app. Vietnamese learners often prefer bank transfer / MoMo,
  which Stripe supports natively; Google Play Billing does not.
- The bundle-id rotation for "in-app purchase products" registered
  with the wrong app would require re-listing on Play.

Don't propose the Play Billing migration as a "small fix" — it's a
multi-PR scope with store-side coordination.

### 6g. iOS subscriptions can refund-revoke unexpectedly

Apple's StoreKit can revoke a subscription mid-period (refund,
chargeback). The webhook (`apple-server-notifications`) emits a
`REFUND` event; the recompute marks the user's row `status:
"revoked"`. The entitlement derivation in
[`billing-entitlement.md`](./billing-entitlement.md) downgrades them
to inactive immediately. **This is correct** — don't add a grace
period.

### 6h. `ios/` and `android/` are mostly gitignored

`ios/App/Pods/` and `android/app/build/` are gitignored; the
`Podfile` / `Podfile.lock` are tracked. Memory:
[[feedback_cap_sync_ios_mechanics]] — when a PR genuinely needs an
`ios/`-side change (e.g. Podfile bump), use `git add -f` on the
specific files; don't try to add all of `ios/`.

### 6i. Keyboard resize differs by platform

`capacitor.config.ts` declaratively sets the iOS keyboard resize
mode. `NativeBootstrap.tsx` programmatically sets the Android one at
runtime. There's no "shared" config — Android's resize behavior is a
plugin call, iOS's is a config flag. If you find Android's resize
broken, check `NativeBootstrap`'s effect; if iOS's is broken, check
`capacitor.config.ts`.

### 6j. The version field in `package.json` is a code shape, not a release

`package.json:4` has a top-level `version: "MB-BLUE-101.12c"` field
that is **not** the npm-style `version`. The actual npm
`version: "0.0.0"` at line 10 is the package version (unused for
publish — this isn't an npm package). The store-side version names
live in `ios/App/App/AppRelease.entitlements` (iOS) and
`android/app/build.gradle` (Android — `versionName`, `versionCode`).
Don't bump `package.json:10` expecting a store version change.

### 6k. RevenueCat is the IAP middleware, not StoreKit directly

`react-native-purchases` is RevenueCat's client. It wraps StoreKit
(iOS) and Play Billing (Android). The entitlement flows through
RevenueCat's webhook → MercyBlade's `apple-iap-sync` /
`apple-webhook` → `subscriptions` table. If you're debugging "the
user paid but their entitlement didn't update," check RevenueCat's
dashboard FIRST, then our webhook handler.

---

## 7. Cross-references

- **[system-overview.md §20](../system-overview.md#20-native-shells-capacitor--ios--android)** — one-paragraph version.
- **[observability.md](./observability.md)** — the platform fork's
  native half lives in `sentryInit.ts:200-257`; `NativeBootstrap`
  pulls Sentry on native cold start.
- **[billing-entitlement.md](./billing-entitlement.md)** — iOS IAP
  via RevenueCat → `apple-iap-sync` / `apple-webhook` → entitlement.
  Android currently uses Stripe.
- **`docs/app-store-submission/`** — submission runbook + iOS/Android
  checklists + ASO strategy + per-asset descriptions.
- **`docs/IOS-DSYM-UPLOAD.md`** — dSYM upload runbook.
- **`docs/ICON_REGEN.md`** — app icon regeneration steps.
- **`docs/APPLE_SIGNIN_CONFIG.md`** — Sign in with Apple wiring.
- **`docs/push-notification-setup.md`** — push notification setup.
- **`CLAUDE.md`** — operating discipline ("Core path survives optional
  failures") which the native components enforce.

---

## 8. How to extend this — checklist

### 8a. Adding a new native plugin

- [ ] Run `npm install @capacitor/<plugin>` (and any iOS Pod / Android
      gradle dependency the plugin requires).
- [ ] Add an entry to `capacitor.config.ts:plugins.<PluginName>` if
      the plugin needs config.
- [ ] Add a native-only `useEffect` in a new component under
      `src/components/native/<Name>.tsx`. Mount it once at the
      router root. Renders nothing.
- [ ] Dynamic-import the plugin inside the native branch so it never
      enters the web bundle.
- [ ] Wrap every plugin call in try/catch.
- [ ] Add a unit test exercising the web no-op path + a mocked native
      path.
- [ ] Run `npx cap sync ios && npx cap sync android` locally to
      confirm the plugin registers.
- [ ] **Chau runs the device test** post-merge.
- [ ] Update `ios/App/App/capacitor.config.json:packageClassList` if
      the plugin requires explicit registration (most don't, but
      a few do — see the existing four).
- [ ] If the plugin requires a new permission, update Info.plist /
      AndroidManifest.xml AND the privacy nutrition labels in the
      submission checklist.

### 8b. Adding a new deep-link path

- [ ] Add the prefix to `nativeOAuth.ts` (or a parallel handler if
      it's not OAuth — e.g. a magic-link / share / referral).
- [ ] Register the URL scheme in iOS Info.plist's `CFBundleURLTypes`
      AND in Android's `AndroidManifest.xml` `<intent-filter>` with
      `android:scheme`. **Don't change the existing
      `com.mercyapps.mercyblade://` scheme** — it's load-bearing.
- [ ] Add the route to the listener in `NativeDeepLinkListener.tsx`.
- [ ] Test on a real device (the web shim won't fire).

### 8c. Bumping the iOS / Android version

- [ ] iOS: `ios/App/App/AppRelease.entitlements` is unchanged; the
      version is in `ios/App/App.xcodeproj/project.pbxproj`
      (`MARKETING_VERSION` + `CURRENT_PROJECT_VERSION`). Chau bumps
      via Xcode.
- [ ] Android: `android/app/build.gradle` — `versionName` (display)
      + `versionCode` (incrementing integer Play requires).
- [ ] Update `docs/app-store-submission/whats-new/<release>.{en,vi}.md`.
- [ ] Update the submission checklist's "Version name" / "Version code"
      / "Build number" rows.

### 8d. Closing §15 Axis 1 Bar #6

See [`observability.md` §8f](./observability.md#8f-closing-15-axis-1-bar-6-native-crash-telemetry).
The native shells provide the cold-start activation; the bar closes
when Chau confirms a real-device Sentry event lands in the dashboard
for both iOS and Android.

### 8e. Removing a deprecated native path

- [ ] Confirm no remaining `App.appUrlOpen` listener still depends
      on the path.
- [ ] Confirm no Info.plist `CFBundleURLTypes` / AndroidManifest
      intent-filter still claims the path.
- [ ] If the path was a Capacitor plugin, remove from
      `packageClassList` + the dynamic import + the
      `capacitor.config.ts` plugin entry.
- [ ] Run `npx cap sync` to regenerate the native config.

### 8f. Adding a new platform-aware UI surface

- [ ] Use `getPlatform()` for the switch — `"ios" | "android" | "web"`.
- [ ] Default to the web path; native paths are the additions.
- [ ] If the native path requires a plugin, dynamic-import it
      inside the native branch.
- [ ] Add a unit test exercising each branch.
- [ ] If the UI affects monetization (e.g. iOS-only IAP), confirm
      the entitlement derivation in
      [`billing-entitlement.md`](./billing-entitlement.md) still
      treats the resulting source correctly.

---

## 9. The two-line summary

> The native shells wrap the single SPA build in two divergent
> native projects: iOS (`com.chaudoan.mercyblade`) and Android
> (`com.mercyapps.mercyblade`), with a shared
> `com.mercyapps.mercyblade://` OAuth scheme on both. Every
> native-only behavior — splash, status bar, keyboard, deep links,
> Back button, IAP, native Sentry — flows through one of four headless
> React components under `src/components/native/`, dynamically
> imports its Capacitor plugins so they never enter the web bundle,
> and is gated by `isNativePlatform()`. Native work is
> ~2–4 weeks pre-submission and Chau-led; web-only PRs are the
> default mode today.

If you ever need to explain the native side in two sentences, those
are them.
