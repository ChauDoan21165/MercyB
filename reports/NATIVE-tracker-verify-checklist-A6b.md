# Native Marketing-Tracker Verify Checklist — post-#796 (A6b)

**Purpose:** prove on a real iOS + Android device that `initMarketingTracking()` returns immediately on a Capacitor native shell — **no GA4, no Clarity, no Meta Pixel network traffic**, even with all three tracker env vars set to real production values.

**When to run:** after PR #796 (`fix/native-marketing-tracker-guard`) merges to `main` and before any TestFlight / Play submission. Required by primer §k Blocker #2 (re-derive Apple App Privacy + Google Data Safety paperwork honestly) — the paperwork redo is gated on a clean pass here.

**Operator:** Chau (tethered-device steps require physical hardware + Mac for iOS, Mac/Linux/Windows for Android).

**Estimated time:** ~25 minutes per platform once the build is signed and installed.

---

## 0 — Preflight: env-var name sanity (one-time, before building)

The dispatch named `VITE_META_PIXEL_ID`. Current `main` actually uses **`VITE_FB_PIXEL_ID`** (see `src/lib/tracking/pixel.ts:48`, `__tests__/pixel.test.ts`). Use the codebase name, not the dispatch's name. The three correct names:

| Tracker | Env var (verified on `main`) | Where it's read |
|---|---|---|
| Meta Pixel | `VITE_FB_PIXEL_ID` | `src/lib/tracking/pixel.ts:48` |
| GA4 | `VITE_GA4_MEASUREMENT_ID` | `src/lib/tracking/ga4.ts:36` |
| Microsoft Clarity | `VITE_CLARITY_PROJECT_ID` | `src/lib/tracking/clarity.ts:50` |

**All three must be set to real, non-empty production-shaped values for this test** — empty values would make every tracker no-op for an unrelated reason (env-gate, not platform-gate) and would silently let a fail-open regression slip through. Use the actual prod values, or production-shaped placeholders (e.g. `G-XXXXXXXX`, a 10-digit Pixel ID, an 8-character Clarity ID — these only need to load the loader script, no real reporting account is touched).

---

## 1 — Build a native bundle with all three trackers wired

Run from a clean main checkout (post-#796 merge):

```bash
# 1. install deps (skip if your worktree already has node_modules)
npm ci

# 2. set the three env vars in .env.local (gitignored — never commit)
cat >> .env.local <<'EOF'
VITE_FB_PIXEL_ID=1234567890
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXX
VITE_CLARITY_PROJECT_ID=abcd1234
EOF

# 3. produce dist/ that Capacitor will copy
npm run build

# 4. push dist/ into the native projects + reinstall iOS pods
npx cap sync ios       # for the iOS test
npx cap sync android   # for the Android test (can run both at once)

# 5. open each project in its native IDE
npx cap open ios       # → Xcode (always opens ios/App/App.xcworkspace)
npx cap open android   # → Android Studio
```

Build identifiers for sanity:
- iOS bundle id: `com.chaudoan.mercyblade`
- Android applicationId: `com.mercyapps.mercyblade`

These are intentionally divergent and Play-locked — **do not "align" them**.

---

## 2 — iOS: Safari Web Inspector verify

### 2a. Enable Web Inspector on the device

- iPhone: **Settings → Safari → Advanced → Web Inspector → ON**.
- Mac: **Safari → Settings → Advanced → Show features for web developers** (Sequoia) / **Show Develop menu in menu bar** (older). Re-open Safari.

### 2b. Run the app from Xcode onto the tethered iPhone

- Xcode → select **My Mac** is wrong, choose your tethered device under the **target device** dropdown.
- Product → Run (⌘R). Trust-the-developer dance on the iPhone if it's the first build with this signing certificate.
- App launches.

### 2c. Attach the Web Inspector

- On the Mac, **Safari → Develop → \<iPhone name\> → Mercy Blade → localhost** (or the WebView entry that's not blank).
- A standard Safari DevTools window opens, attached to the Capacitor WebView.
- Switch to the **Network** tab. **Clear the log.** Leave the inspector open through every screen below.

### 2d. Apply the filter — capture every tracker network call

In the Network tab's filter field, paste these one at a time (Safari supports one filter at a time; rotate through them) **and screenshot zero rows after each screen**:

| Tracker | Filter string (matches loader + collect endpoints) |
|---|---|
| Meta Pixel | `facebook` |
| GA4 / GTM | `google-analytics\|googletagmanager` |
| Microsoft Clarity | `clarity.ms` |

Domains the trackers would actually hit if they ran (so you know what success looks like — i.e. **what must NOT appear**):

- Pixel loader → `https://connect.facebook.net/en_US/fbevents.js`
- Pixel collect → `https://www.facebook.com/tr/…`
- GA4 loader → `https://www.googletagmanager.com/gtag/js?id=G-…`
- GA4 collect → `https://www.google-analytics.com/g/collect?…`
- Clarity loader → `https://www.clarity.ms/tag/<id>`
- Clarity collect → `https://*.clarity.ms/collect`

### 2e. Exercise the 5 most-trafficked screens (in order, ~30 s each)

After each screen, scan the Network log under all three filters above. Expected: **zero rows for every filter, on every screen.**

1. **Home / `/`** — landing or post-login home, whichever opens first.
2. **A room** — tap into any room (e.g. `/room/english_beginner_1`). Play one audio clip. Tap one keyword.
3. **Profile** — open the account tab / `/account`.
4. **Settings → Privacy** — `/account/privacy`. Toggle the marketing-tracking opt-out OFF then back ON. (This is the worst-case path — consent flipped, in case there's a code path that re-runs init.)
5. **Sign-up flow** — sign out, hit `/auth/signup`, fill the form up to (not through) submit. UTM params: navigate to `mercyblade://?utm_source=verify&utm_campaign=a6b` if the app accepts deep links, otherwise paste the URL into Safari and let it deep-link into the app; this verifies UTM is not silently captured either.

If even one row appears under any filter on any screen — **fail** (see §5).

### 2f. Console probe (belt-and-braces)

In Safari Web Inspector's **Console** tab, run:

```js
typeof window.fbq        // expect: "undefined"
typeof window.gtag       // expect: "undefined"
typeof window.clarity    // expect: "undefined"
window.dataLayer         // expect: undefined OR an empty array
```

All three globals **must be `undefined`**. If any returns `"function"`, a tracker was seeded — fail.

---

## 3 — Android: Chrome DevTools remote verify

### 3a. Enable USB debugging

- Android device: **Settings → About phone → tap Build number 7×** → developer mode on.
- **Settings → System → Developer options → USB debugging → ON**.
- Plug into the Mac/PC, accept the RSA-fingerprint dialog on the phone.

### 3b. Run the app from Android Studio onto the tethered device

- Android Studio → Run (▶). The device appears in the deployment dropdown.
- App launches.

### 3c. Attach Chrome DevTools

- Open Chrome on the host → URL bar: **`chrome://inspect/#devices`**.
- The Mercy Blade WebView shows under the device. Click **inspect**.
- A standard Chrome DevTools window opens, attached to the WebView.
- Network tab → click the 🚫 / **Clear** icon. Leave open through every screen below.

### 3d. Apply the filter

Chrome's Network filter accepts substring match. Use these three (Chrome supports one at a time; rotate):

| Tracker | Filter |
|---|---|
| Meta Pixel | `facebook` |
| GA4 / GTM | `google-analytics` then `googletagmanager` (two passes) |
| Microsoft Clarity | `clarity.ms` |

Or one combined filter: `facebook|google-analytics|googletagmanager|clarity.ms` (Chrome supports this regex via the **Filter** field if you click the regex toggle).

### 3e. Exercise the same 5 screens as §2e

Same expectation: **zero rows under every filter, on every screen.**

### 3f. Console probe (same as §2f)

In the DevTools Console:

```js
typeof window.fbq        // "undefined"
typeof window.gtag       // "undefined"
typeof window.clarity    // "undefined"
window.dataLayer         // undefined or []
```

---

## 4 — Negative test: prove the guard, not env-emptiness, is what's blocking

A clean pass on §2 + §3 is **necessary but not sufficient**. If `VITE_*` were silently empty in the build, trackers also wouldn't fire — and you'd misread that as "guard works."

Run **one** of these to prove the guard is what's responsible:

### Option A (recommended, fastest) — run the same build on the web

The **same dist/** with the same env vars, opened in a desktop browser, **must show the trackers firing**:

```bash
# from the same env.local that built the native bundles
npm run preview     # serves dist/ on http://localhost:4173
```

Open `http://localhost:4173` in desktop Chrome → DevTools Network → apply the same filters from §3d → exercise the same 5 screens. You should see:

- `connect.facebook.net/en_US/fbevents.js` load on first paint
- `www.googletagmanager.com/gtag/js?id=…` load on first paint
- `www.clarity.ms/tag/<id>` load on first paint
- `/tr/`, `/g/collect`, `/collect` POSTs on every screen change

**That's the control:** the env vars are real, the trackers work, the same code on `web` fires them. Then the native results from §2 + §3 are meaningful — same code, same env, only the platform differs, and only the platform-gated path is silent. **That isolates the guard as the cause.**

### Option B (only if web preview unavailable) — temporary `isNativePlatform()` flip

Edit `src/lib/platform.ts` in a throwaway branch:

```ts
export function isNativePlatform(): boolean {
  return false; // TEMP — REVERT
}
```

…rebuild, `cap sync`, run on the device again. Trackers **must now fire** in the WebView (Pixel/GA4/Clarity rows appear in DevTools). Then **revert the file and rebuild** before any other testing.

**Do not commit the flip.** Use `git stash` or branch-throwaway.

---

## 5 — Pass / fail criteria

| Outcome | Threshold |
|---|---|
| **PASS** | iOS §2 + Android §3 each show **zero** rows under every tracker filter, across all 5 screens, AND all three `window.*` globals are `undefined`, AND §4 control proves trackers DO fire on web with the same build. |
| **FAIL** | **Any single network row** matching `facebook` / `google-analytics` / `googletagmanager` / `clarity.ms` on any screen on any device. One row = one leaked tracker = fail, regardless of which tracker. |
| **FAIL** | Any of `window.fbq` / `window.gtag` / `window.clarity` returns `"function"` in the WebView console. |
| **FAIL** | §4 control shows web trackers also silent — means the env vars were empty and §2 + §3 proved nothing. Re-run with real env vars. |

A single leaked call is App-Store-rejection-grade (Apple Guideline 5.1.2) and Google Data Safety mismatch — there is no acceptable threshold above zero.

### If failure

1. Capture the Network row (right-click → Copy as cURL) for triage.
2. **Do not** edit `src/services/behaviorTrackingFlag.ts` to add a second guard — investigate the root cause: a new tracker import bypassing `initMarketingTracking`, a stale dist/ that didn't get re-built post-merge, or a Capacitor plugin emitting analytics on its own.
3. File a Sentry issue with the cURL, the device platform, the offending screen, and stop the TestFlight/Play submission.

---

## 6 — After a clean pass: privacy-paperwork redo (primer §k Blocker #2)

A clean pass unblocks two paperwork updates. Both must be done **before** the next TestFlight build is submitted for review.

### 6a. Apple App Privacy (App Store Connect)

- App Store Connect → **My Apps → Mercy Blade → App Privacy**.
- Re-derive the **Data Collected** section as if the iOS app collects **none** of: Identifiers (Pixel `_fbp`, Clarity user id), Usage Data (page views, screen taps), Diagnostics (session replays via Clarity), Location (UTM source/medium can imply geo).
- Existing declarations that listed any of these for iOS should be **removed** — they referred to web behavior that no longer happens on iOS.
- Cross-check with the user-facing policy at `/privacy` — the VI/EN line **"Clarity chỉ chạy trên web — ứng dụng iOS và Android không dùng Clarity / Clarity runs only on the web"** is now true in code; App Privacy must match.

### 6b. Google Play Data Safety (Play Console)

- Play Console → **Mercy Blade → App content → Data Safety**.
- Re-derive **Data collected and shared**: remove any third-party SDK declarations for Meta, Google Analytics, or Microsoft (Clarity) that were declared "for the Android build".
- The form asks whether data is collected by **third parties via SDKs** — answer **No** for these three for the Android build. (Sentry remains a separate declaration; that's covered by `sentryInit.ts`'s own native handling, not by #796.)
- The "Why is this data collected" answers that mentioned Pixel/GA4/Clarity remarketing or analytics must be removed for the Android scope.

### 6c. User-facing policy (`src/pages/Privacy.tsx`) — no change needed

The shipped policy already promises native-off behavior. #796 + this verify makes the promise true. **Do not edit `Privacy.tsx`** — the verify pass is what proves the existing copy honest, not new copy.

### 6d. Cross-reference

The detailed paperwork checklists already in the repo:

- `docs/app-store-submission/ios-submission-checklist.md`
- `docs/app-store-submission/android-submission-checklist.md`
- `docs/app-store-submission/SUBMISSION_RUNBOOK.md`
- `reports/AUDIT-appstore-readiness-2026-05-19-A41.md` (the audit that surfaced this blocker)

Update the App-Privacy / Data-Safety subsections of those three docs the same day this verify passes, so the next submission round-trip doesn't re-derive from outdated declarations.

---

## Appendix — quick re-run script (after the first full pass)

For future regression checks (e.g. before each TestFlight submission), the abbreviated re-run is:

1. `npm ci && npm run build && npx cap sync ios && npx cap sync android`
2. Run on tethered iOS device → DevTools Network → filter `facebook|google-analytics|googletagmanager|clarity.ms` → home + one room + signup screen → expect 0 rows.
3. Same on Android.
4. Web control: `npm run preview` → same filter → expect rows (sanity).

Five-minute job once the muscle memory is there. If anything fails, fall back to the full §0–§5 procedure to triage.
