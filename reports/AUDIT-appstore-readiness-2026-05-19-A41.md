# MercyBlade — App Store / Play Store readiness RE-AUDIT

**Date:** 2026-05-19
**Auditor:** A41 (read-only re-audit; no product behavior changes, no PR — operator artifact)
**Branch / HEAD:** `a41/appstore-reaudit-may19` @ `4fbc3a41f` (origin/main, 2026-05-19)
**Supersedes for currency:** `reports/app-store-readiness-audit-2026-04-27.md` (A10) + `reports/app-store-submission-package-2026-04-26.md` (A6) — both ~3 weeks stale; 844 commits landed since.
**Scope:** Re-verify every prior requirement against current main + surface NEW blockers introduced by work shipped since 2026-04-27. Out of scope: fixing anything.

---

## TL;DR

| # | Requirement | 2026-04 status | **Current status** | Δ |
|---|---|---|---|---|
| 1 | Account deletion (Apple 5.1.1(v) / Google) | ✅ | ✅ **stronger** — `AccountPage.tsx:222/848`, edge fn `delete-account/{index,aal-gate,user-data-manifest}.ts` + tests; aal=2 MFA gate added (#748) | ↑ |
| 2 | Restore Purchases (iOS) | ✅ | ✅ `RestorePurchasesButton.tsx:58` iOS-gated; also on IapPlanCard | = |
| 3 | iOS payment routing (Apple 3.1.1) | ✅ | ✅ `Pricing.tsx:141 isIos`; Stripe hidden `!isIos` (:796); IapPlanCard-only on iOS (:877–880) | = |
| 4 | Sign in with Apple (Apple 4.8) | ✅ | ✅ `LoginPage.tsx:385–399` (`signInWithNativeOAuth({provider:'apple'})`) | = |
| 5 | Privacy policy + Azure disclosure | ✅ | ✅ `/privacy`; expanded — now also discloses Sentry/Clarity/GA4/Pixel (#677, #413) | ↑ |
| 6 | AI feedback caveats | ✅ | ✅ `/legal/content-advisory` route live (`ContentAdvisory.tsx`) | = |
| 7 | Mic + speech permission strings | ✅ | ✅ bilingual `NSMicrophoneUsageDescription` + `NSSpeechRecognitionUsageDescription` (Info.plist:27/31) | = |
| 8 | Photo library permission string | ✅ | ✅ bilingual `NSPhotoLibraryUsageDescription` (Info.plist:29) | = |
| 9 | Export compliance | ✅ | ✅ `ITSAppUsesNonExemptEncryption` present (Info.plist:23) | = |
| 10 | Bundle ID divergence | ⚠️ accept | ✅ accepted/locked — iOS `com.chaudoan.mercyblade`, Android `com.mercyapps.mercyblade`; permanent by design (memory `project_android_urls`) — NOT a blocker | = |
| 11 | Sentry crash gating (web) | ✅ | ✅ DSN-gated, route-gated (#720), PII-scrubbed, web→`@sentry/react` | = |
| 12 | Localization (VI-first bilingual) | ✅ | ✅ `BiLabel` pattern + fully bilingual privacy policy intact | = |
| 13 | Gift "Stripe checkout coming soon." placeholder | 🟡 | ✅ **RESOLVED** — string gone from `src/components/gift/*`; form mints free codes only (no iOS-payment surface) | ✅ |
| 14 | Locked-room "Coming soon" UX | ✅ | ✅ intentional premium preview | = |
| 15 | Touch targets ≥44px | ✅ | ✅ no regression observed | = |
| 16 | aria-labels | ✅ | ✅ no regression observed | = |
| A6 | Support URL (`/support`) | 🟡 "NEEDS CONFIRMATION" | ✅ **RESOLVED** — `/support` route live (`AppRouter.tsx:721 → <Support/>`) | ✅ |
| A38 | **Native crash reporting** (iOS/Android) | — (not audited 04-27) | ✅ **NEW & wired** — `@sentry/capacitor ^4.0.0`; `sentryInit.ts:215` branches native→`SentryCap.init(...)`; Android registration #680 | ✅ |
| **T** | **Marketing trackers on native (GA4 / Clarity / Pixel)** | "None — no tracking SDKs" | 🔴 **NEW BLOCKER** — GA4 + Clarity + Pixel now ship; **no native platform gate**; contradicts privacy policy + stale App Privacy / Data Safety declarations | 🔴 |
| 17 | Sentry crash count last 24h | 🟡 manual | 🟡 manual (Chau checks dashboard) | = |
| 18 | Web Vitals (LCP/FCP) | 🟡 manual | 🟡 manual — **likely still failing**: memory `project_lighthouse_perf_baseline` = onboarding LCP 6.5s pre-#675; re-run after #675+A37 | = |
| 19 | App Privacy questionnaire accuracy | ✅ | 🔴 **now STALE** — see blocker T (Pixel/GA4/Clarity not declared; "Data Used to Track You: None" no longer true if Pixel ships on iOS) | 🔴 |
| 20 | Demo reviewer account | 🟡 manual | 🟡 manual (by design, not auto-created) | = |
| 21 | Listing copy / screenshots (both consoles) | 🟡 manual | 🟡 manual — A6 copy bank still valid; verify room count claim | = |

**Totals:** 14 ✅ · 5 🟡 (operator-manual) · **1 🔴 root cause spanning items T + 19**

**Net since 2026-04-27:** 3 prior 🟡 closed (gift placeholder, support URL, + A38 native crash reporting now wired). **1 new 🔴** introduced by the marketing-tracking stack shipping without a native gate.

---

## BLOCKERS (ranked) — must clear before any TestFlight/Play submission

### 🔴 BLOCKER 1 — Marketing trackers (GA4 / Microsoft Clarity / Meta Pixel) have no native-platform gate; this contradicts the shipped privacy policy and invalidates the App Privacy / Data Safety declarations

**Severity:** High (likely App Store rejection under Apple Guideline 5.1.2 / inaccurate App Privacy "nutrition label"; Google Data Safety mismatch; legal-accuracy gap vs the user-facing privacy policy).

**Evidence:**
- `src/services/behaviorTrackingFlag.ts → initMarketingTracking()` (called unconditionally from `src/main.tsx:592`) gates only on `isMarketingTrackingEnabled()` (a localStorage opt-out, **default ON**). It then calls `initPixel()`, `initGa4()`, `initClarity()` with **no `Capacitor.isNativePlatform()` / platform check anywhere** in that function or in `src/lib/tracking/{pixel,ga4,clarity}.ts`. Each is env-gated (`VITE_FB_PIXEL_ID` / `VITE_GA4_MEASUREMENT_ID` / `VITE_CLARITY_PROJECT_ID`) but **not platform-gated**.
- The shipped privacy policy explicitly promises the opposite: `src/pages/Privacy.tsx:245–246, 263–264` — *"Clarity chỉ chạy trên web — ứng dụng iOS và Android không dùng Clarity / Clarity runs only on the web — the iOS and Android apps do not use Clarity."* **No code enforces this claim.** In a Capacitor build with the env var present and consent default-ON, Clarity (session replay/heatmaps) WILL run inside the iOS/Android WebView.
- Apple App Privacy / Google Data Safety: the 2026-04 audit recorded "Data Used to Track You: None / No FB SDK / no tracking SDKs." That is now inaccurate. GA4 (cookies, analytics), Clarity (session replay = recorded user sessions), and Meta Pixel (cross-app/site tracking → triggers Apple ATT, Guideline 5.1.2) are all present in the bundle.
- `NSUserTrackingUsageDescription` is **absent** from `ios/App/App/Info.plist` (only mic/photo/speech + export compliance present). If Meta Pixel ever loads on iOS, Apple requires an ATT prompt + this key — currently impossible to satisfy.

**Latency / mitigation (why it's not yet on-fire, but is a footgun):** `Privacy.tsx:4d` states *"Hiện tại Meta Pixel chưa được bật / The Meta Pixel is currently not enabled."* Pixel only loads if `VITE_FB_PIXEL_ID` is set in the build. GA4/Clarity load if their env vars are set. None of this is code-verifiable — it's an env/ops fact. The risk is real because (a) the privacy-policy contradiction is true *today* for any native build that has the Clarity/GA4 env vars, and (b) the moment a native build is cut with `VITE_FB_PIXEL_ID` set, an undeclared ATT-class tracker ships to the App Store.

**Recommended fix (do NOT apply — recon only):** add a single native early-return at the top of `initMarketingTracking()` in `src/services/behaviorTrackingFlag.ts`:

```ts
import { Capacitor } from "@capacitor/core"; // already a direct dep (^8.3.0)
// ...inside initMarketingTracking(), before the consent check:
if (Capacitor.isNativePlatform()) {
  return { consent: false, utmCaptured: false, pixelLoaded: false,
           ga4Loaded: false, clarityLoaded: false };
}
```

One guard kills Pixel + GA4 + Clarity + UTM on iOS/Android, makes the privacy-policy promise true, and lets both store privacy questionnaires honestly answer "no tracking / analytics in the app." This is clearly the *intended* design (the privacy policy already promises it) — it was simply never implemented. Alternative (heavier, worse UX, not recommended): keep trackers on native, add `NSUserTrackingUsageDescription` + ATT prompt + a positive Apple App Privacy "Tracking" declaration + corrected Data Safety form + rewritten privacy §4b/4c/4d.

### 🔴 BLOCKER 2 — App Privacy questionnaire & Google Data Safety form are stale (consequence of Blocker 1)

Even after Blocker 1's native gate lands, the **submission paperwork** must be re-derived: the 2026-04 A6 package (`§1.8`, `§2.7`, `§4`) predates Sentry Session Replay (#411/#413), Microsoft Clarity (#677), GA4, and Meta Pixel scaffolding. If the native gate is applied, the app-side answers stay clean ("no analytics/tracking in app") but the web privacy disclosure is what users see — and the SDK list in A6 §4 needs Clarity added. This is operator paperwork, not code, but it is a hard gate on "Submit" and depends on Blocker 1's decision.

---

## Operator-manual items still open (not code blockers, but submission gates)

These cannot be verified or fixed from code; carried forward unchanged:

- **17 — Sentry dashboard:** confirm 0 unhandled `level≥error` issues in last 24h before submit.
- **18 — Web Vitals:** memory `project_lighthouse_perf_baseline` records onboarding LCP **6.5s ❌** (pre-#675 mobile anchor). Re-run Lighthouse mobile on staging after #675 + A37 land; LCP target < 2.5s. Treat as a real risk, not a formality.
- **20 — Demo reviewer account:** provision manually (A6 §5 has verbatim reviewer notes); do not auto-seed.
- **21 — Listing copy / screenshots:** A6 §1–§6 copy bank still valid. Verify the "500+ rooms" claim via `npm run rooms:check` before pasting; capture screenshots against current `MercyGuidePanel` (Teacher Mercy, not "host") + current VND pricing.
- **#341 AI-data-consent surface:** commit `3c719d8e0 feat(ios): add AI data consent screen for App Store compliance` is on main but a grep for an `AiDataConsent`-style mount returned nothing — `/legal/content-advisory` (the AI-caveats requirement, item 6) is live and satisfies the disclosure, but verify the #341 consent gate still mounts on the native first-run before relying on it in reviewer notes. Low priority; not a blocker.

---

## Cross-reference: parked native cap-sync follow-up (memory `project_cat4_n4_capsync_chain`)

Still applicable, but most of the chain has **landed**:

- iOS: `MARKETING_VERSION = 1.0.6`, `CURRENT_PROJECT_VERSION = 16` — the "versionCode 16" the parked memory referenced is already on main.
- Android: `versionCode 12`, `versionName "1.0.2"` (was 3 / 1.0.1 at 2026-04).
- Native plugins shipped since 2026-04: Capacitor CLI v7→v8 + Android Sentry registration (#680), iOS pod sync (#683), status-bar/splash/keyboard N4 (#668), deep-link/OAuth single-owner M2 (#652), Android Back M1 (#650), dead-Push gate N3 (#654), SW/safe-area N7a (#665).
- **Remaining native polish, NOT a store blocker:** N5 brand splash art — `capacitor.config.ts` still ships `SplashScreen.backgroundColor: '#ffffff'` with a comment that N5 swaps it to brand navy "once art ships." Cosmetic; ship can proceed on the white placeholder.
- **The parked item that remains genuinely open is the operator action itself:** running `npx cap sync ios/android`, archiving, and uploading build 16 to TestFlight / AAB to Play. That is gated on Blocker 1 + the operator-manual items above — not on more native code. Per memory `feedback_native_work_phasing`, native store-coupled work is the ~2–4wk pre-submission window; this re-audit is the trigger to open it once Blocker 1 clears.

---

## Recommended dispatch order for next session's app-store push

1. **DISPATCH-1 (code, small, blocking):** native-gate the marketing trackers — one early-return in `initMarketingTracking()` per Blocker 1's diff. Add a unit test asserting `initMarketingTracking()` returns all-false when `Capacitor.isNativePlatform()` is true. Single PR, ~10 lines + test. **This unblocks everything else.**
2. **DISPATCH-2 (paperwork, blocking, depends on 1):** re-derive the Apple App Privacy questionnaire + Google Data Safety form against post-gate reality (app = no analytics/tracking; web disclosure unchanged). Add Microsoft Clarity + GA4 + Sentry Session Replay rows to A6 §4 SDK list. Refresh `reports/app-store-submission-package` numbers. Operator artifact, no code.
3. **DISPATCH-3 (operator-manual, parallel with 2):** provision demo reviewer account (A6 §5); verify Sentry 24h dashboard clean; re-run Lighthouse mobile post-#675/A37 and confirm LCP < 2.5s (or formally accept + document the regression).
4. **DISPATCH-4 (operator, after 1–3 green):** `npx cap sync`, bump build numbers past last submission, archive iOS / build Android AAB, upload to TestFlight / Play internal track, paste reviewer notes, smoke-test IAP buy + restore + account deletion on the TestFlight build, then Submit.

**Top 3 priorities (in order):**
1. **Native-gate GA4/Clarity/Pixel** (Blocker 1) — the only code blocker; everything downstream depends on it; also closes a live privacy-policy contradiction.
2. **Re-derive App Privacy / Data Safety paperwork** (Blocker 2) — stale by 844 commits; hard "Submit" gate.
3. **Lighthouse LCP re-verification** (item 18) — onboarding LCP was 6.5s; the one operator-manual item with a known-bad prior reading rather than just "unverified."

---

## Verified clean since 2026-04 (no action needed — baseline for the next audit)

Account deletion (hardened, #748) · iOS payment routing (`Pricing.tsx`) · Restore Purchases (iOS-gated) · Sign in with Apple · Info.plist mic/photo/speech + export compliance · native crash reporting (`@sentry/capacitor`, A38) · web Sentry gating · gift placeholder removed · `/support` route live · `/legal/content-advisory` live · bilingual localization · bundle-ID divergence (locked, accepted).
