# MercyBlade — App Store / Play Store readiness audit

**Date:** 2026-04-27
**Auditor:** A10 (read-only audit + this report; no product behavior changes)
**Scope:** Final pre-submission readiness check across all Apple + Google rejection categories.
**Companion docs:** [`docs/app-store-submission/`](../docs/app-store-submission/) (checklists, descriptions, ASO), [`reports/app-store-submission-package-2026-04-26.md`](./app-store-submission-package-2026-04-26.md) (A6's copy bank).

---

## TL;DR

| Category | Status | Notes |
|---|---|---|
| 1. Account deletion | ✅ | In-app at `Account → Delete my account`, wired to `delete-account` edge fn. |
| 2. Restore Purchases | ✅ | iOS-gated button on Account + Pricing. |
| 3. iOS payment routing (Apple 3.1.1) | ✅ | iOS shows ONLY Apple IAP; Stripe + others hidden via `getPlatform() === 'ios'` guard. |
| 4. Sign in with Apple (Apple 4.8) | ✅ | Wired alongside Google + Facebook. Native + web fallback. |
| 5. Privacy policy + Azure disclosure | ✅ | `/privacy` + `/legal/privacy` alias. PR #146 added Azure §4a. |
| 6. AI feedback caveats | ✅ | Disclosed in `/legal/content-advisory` §5 (added by PR #204). |
| 7. Microphone + speech permission strings | ✅ | Bilingual `NSMicrophoneUsageDescription` + `NSSpeechRecognitionUsageDescription` in `Info.plist`. |
| 8. Photo library permission string | ✅ | Bilingual `NSPhotoLibraryUsageDescription`. |
| 9. Export compliance | ✅ | `ITSAppUsesNonExemptEncryption` = false in `Info.plist`. |
| 10. Bundle ID alignment | ⚠️ | **CORRECTED 2026-05-17 — original claim was false.** iOS = `com.chaudoan.mercyblade`; Android `applicationId` = `com.mercyapps.mercyblade` (never changed — PR #152 aligned iOS only). Divergence is permanent + acceptable; Android is locked at first Play publish. Do NOT "align". See `reports/RECON-mobile-build-status.md` §3. |
| 11. Sentry crash gating | ✅ | DSN-gated; PII-scrubbed; `ui.input` breadcrumbs dropped. |
| 12. Localization (VI primary, EN fallback) | ✅ | Bilingual hardcoded `{ vi, en }` pattern across user-facing components. No missing-key risk. |
| 13. Functional completeness — gift purchase placeholder | 🟡 | `/gift` page shows literal text "Stripe checkout coming soon." in `PurchaseGiftForm.tsx:185` and is NOT iOS-gated. |
| 14. Functional completeness — locked rooms "Coming soon" | ✅ | Intentional + correct UX (premium tier preview). Apple accepts this. |
| 15. Accessibility — touch targets | ✅ | Sampled buttons ≥44–52 px minHeight. |
| 16. Accessibility — aria-labels | ✅ | Pricing + Account + RoomGrid have `aria-label` on icon buttons. |
| 17. Sentry crash count last 24h | 🟡 | Cannot verify from code — Chau must check the Sentry dashboard before submit. Wiring is correct. |
| 18. Web Vitals (LCP/FCP) | 🟡 | Cannot measure from code — Chau runs Lighthouse on staging before submit. |
| 19. App Privacy questionnaire | ✅ | Answers in A6 §1.8 still match shipped behavior. |
| 20. Demo reviewer account provisioning | 🟡 | Per A6 §5: must be created manually before submit (DO NOT commit). Runbook has the step. |

**Totals:** 16 ✅ · 4 🟡 · **0 🔴**

**Top 3 risks for first submission:**

1. **Gift purchase placeholder text on iOS** (item 13). "Stripe checkout coming soon." is visible inside an active form on `/gift`. Apple often rejects this under Guideline 4.0 (Design — apps should be complete). Recommended fix is small (delete the placeholder line, keep the free-code minting flow that already works); this audit does not apply the fix per the spec rule "If 🟡, document workaround or accept risk." See §C below for the fix patch.
2. **Sentry / Web Vitals are unverifiable from this audit** (items 17, 18). Submission goes ahead only after Chau confirms a green Sentry dashboard for the last 24h and a Lighthouse run with LCP < 2.5 s, FCP < 1.8 s. Runbook §6 has the exact steps.
3. **Demo reviewer account is not yet provisioned** (item 20). Apple **requires** a working demo account for any login-gated app. A6 §5 has the verbatim reviewer-notes paragraph; runbook §3 has the provisioning script.

---

## A. Apple-specific checklist

### A.1 App Privacy questionnaire (per A6 §1.8 + this audit)

| Apple question | Answer | Where it's wired / Why |
|---|---|---|
| Data Used to Track You | **None** | No advertising / cross-app tracking SDKs. No FB SDK, no AppsFlyer, no Adjust. |
| Data Linked to You | Email, app interactions, purchase history | Privacy.tsx §1, §3; surfaced in account profile. |
| Data Not Linked to You | Crash diagnostics (Sentry, gated) | `src/lib/monitoring/sentryInit.ts` — opt-in via `VITE_SENTRY_DSN`; PII stripped. |
| Audio recordings | "Processed but not retained" | Privacy.tsx §4a (Azure disclosure, PR #146). Audio sent to Azure Cognitive Services, scored, discarded. |
| Tracking domains | None | No third-party tracking SDKs in `package.json`. |
| Children under 13 — directed at? | **No** | A6 §7 Risk 4. Privacy.tsx §7 explicitly excludes under-13. |

### A.2 Demo reviewer account

| Item | Value | Status |
|---|---|---|
| Email | `appstore-reviewer@mercyblade.com` (or `+reviewer` alias on `admin@`) | 🟡 create manually before submit |
| Tier | 2 (premium-equivalent) | 🟡 — set via admin panel after creation |
| Pre-seed | 3–5 completed rooms, 2–3 pronunciation attempts, 1 notebook entry | 🟡 |
| Excluded from analytics + leaderboards | Use `email LIKE 'appstore-reviewer%@mercyblade.com'` filter | 🟡 add to `weekly_leaderboard` view + analytics queries |
| Reviewer-notes paragraph | A6 §5 has verbatim text | 🟡 paste into App Store Connect → App Review Information → Notes |

### A.3 In-App Purchase flow (Apple Guideline 3.1.1)

| Surface | What shows on iOS | Verdict |
|---|---|---|
| `/pricing` | `IapPlanCard` (RevenueCat → Apple IAP) only — Stripe cards hidden via `!isIos` (line 792, 873–880 of `Pricing.tsx`) | ✅ |
| Yearly vs monthly comparison | Hidden on iOS (Stripe-only UI) | ✅ |
| Restore Purchases | Visible on iOS via `RestorePurchasesButton` (Account + Pricing) | ✅ |
| `/gift` (gift purchase) | Page is reachable on iOS; form mints a free code BUT shows literal text "Stripe checkout coming soon." | 🟡 |

**TestFlight pre-submit verification:**
- [ ] Buy a monthly plan via Apple IAP — entitlement appears in Account
- [ ] Tap Restore Purchases — entitlement re-applies on a fresh install
- [ ] No web-payment buttons render on `Pricing.tsx` when running on iOS
- [ ] Account → Delete my account works end-to-end on a TestFlight build

### A.4 Content rating (Apple)

A6 §1.8 answers, re-confirmed by this audit:
- Predicted rating: **4+**
- All violence / sex / drugs / gambling / horror / mature → **None**
- Unrestricted Web Access → **No**
- User Generated Content → confirm `community_messages` posting flow is gated/off in v1; otherwise answer Yes + disclose moderation

### A.5 Screenshot vs reality match

Apple rejects screenshots that don't match shipped UI. Spot-check before submission:
- [ ] Lead screenshot (pronunciation phoneme score) matches `MercyTeacherTab` current rendering
- [ ] Mercy character screenshot matches current `MercyGuidePanel` (NOT the legacy "host" branding — see memory `project_teacher_mercy.md`)
- [ ] Pricing screenshot shows the actual VND tiers currently on `/pricing`
- [ ] No outdated UI elements (e.g., old streak banners, retired feature flags)

### A.6 Description vs functionality match

A6's description (`docs/app-store-submission/descriptions/{vi,en}.md`):
- "500+ guided rooms" — verify current room count via `npm run rooms:check`. If under 500, soften to "500+" → "hundreds of".
- "phoneme-level pronunciation" — verified by code (Azure Speech in `supabase/functions/azure-phoneme/`).
- "IELTS / TOEIC / VSTEP" — all three exam tracks ship.
- "no ads" — verified (no ad SDK in `package.json`).

---

## B. Google-specific checklist

### B.1 Data Safety form (Play Console)

Pre-filled rows from A6 §2.7. Verified by this audit against current code:

| Data type | Collected? | Shared? | Purpose | Encryption in transit | Source |
|---|---|---|---|---|---|
| Email | Yes | No | Account management, support | Yes (TLS) | Supabase auth |
| Name (display) | Yes | No | App functionality | Yes | profiles |
| Voice recordings | Processed, not retained | Yes (Azure, transient only) | Pronunciation scoring | Yes | Privacy.tsx §4a |
| App interactions | Yes | No | Learning analytics | Yes | speech_attempts, ai_usage_logs |
| Crash logs | Yes (when DSN set) | Yes (Sentry) | Diagnostics | Yes | sentryInit.ts |
| Purchase history | Yes | Yes (RevenueCat / Apple / Google / Stripe) | Subscription mgmt | Yes | subscriptions table |
| Device IDs | Yes | Yes (RevenueCat) | Subscription entitlement | Yes | RevenueCat SDK |

Data deletion mechanism declared: **In-app at Account → Delete my account.** ✅

### B.2 Content rating (IARC)

Same answers as Apple. Expected: **PEGI 3 / ESRB Everyone / IARC 3+**.

### B.3 Target audience

- **Children under 13:** No. A6 §7 Risk 4 + Privacy.tsx §7. **Do not opt into Designed for Families** — opting in triggers Play's stricter SDK policy that current Sentry + RevenueCat + Azure pipeline does not meet.

### B.4 Permissions justified in description

- **Microphone** — justified: "phoneme-level pronunciation" in description.
- **Speech recognition** — justified: same.
- **Photo library** — currently used for: attaching a photo to a user story (per `NSPhotoLibraryUsageDescription`). Verify the user-story photo flow ships in v1; if not, **remove the permission string** before submitting (Apple rejects unused permissions).

---

## C. Findings detail

### C.1 — 🟡 Gift purchase placeholder text on iOS

**File:** `src/components/gift/PurchaseGiftForm.tsx:185`
**What's there:** literal `Stripe checkout coming soon.` rendered inside the active gift purchase form.
**Why it's a risk:** Apple Guideline 4.0 (Design) — *"Apps should be complete and free of obvious technical problems."* Reviewer sees a "coming soon" notice mid-form and flags it. The form itself works (mints a free gift code per the file's own comment lines 7–10), so the copy is misleading rather than broken — but reviewers don't always make that distinction.
**Recommended fix (small, do separately or pre-submit):**

```diff
--- a/src/components/gift/PurchaseGiftForm.tsx
+++ b/src/components/gift/PurchaseGiftForm.tsx
@@ -182,7 +182,6 @@
       <div style={{ marginTop: 16, fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
         {/* IMPORTANT: this form mints a free code in beta. Stripe handoff lives behind a TODO. */}
-        Stripe checkout coming soon.
       </div>
```

**Alternative (safer):** gate the entire `/gift` route off on iOS until Stripe handoff is wired:

```tsx
// In AppRouter.tsx, near the /gift routes:
{getPlatform() !== "ios" && (
  <Route path="/gift" element={<LazyPage><PurchaseGiftPage /></LazyPage>} />
)}
```

Either fix is one-line. This audit explicitly **does not apply** the fix per the brief's "🟡 = document, don't change product behavior" rule. If Chau wants to take the safer path and fix before submit, the diff above is ready to paste.

### C.2 — 🟡 Sentry crash count last 24h

Cannot be measured from code. Manual check before submit:
1. Sign in to https://sentry.io with the MercyBlade account.
2. Navigate to the project's Issues view.
3. Filter to the last 24h.
4. Confirm zero `unhandled` issues with `level=error` or higher.
5. If any, fix or downgrade before submitting.

### C.3 — 🟡 Web Vitals (LCP / FCP)

Run Lighthouse against staging before submit:

```bash
npx lighthouse https://staging.mercyblade.com \
  --preset=mobile \
  --only-categories=performance \
  --output=html \
  --output-path=./lighthouse-pre-submit.html
```

Pre-submit thresholds:
- **LCP** < 2.5 s
- **FCP** < 1.8 s
- **CLS** < 0.1
- **TBT** < 200 ms

If LCP > 2.5 s, the most likely cause is room JSON bundle size — see memory `project_bundle_size_deferred.md`. Don't block the launch on this; document the regression for post-launch.

### C.4 — 🟡 Demo reviewer account not yet provisioned

A6 §5 explicitly says **do not auto-create**. Provisioning steps live in `docs/app-store-submission/SUBMISSION_RUNBOOK.md` §3 (this PR).

### C.5 — Verified clean (no action needed)

These were checked and look correct as-shipped. Listed for completeness so future audits can point at this baseline:

- **Account deletion** — `src/pages/AccountPage.tsx:807–986` renders the button; `:302–326` invokes the `delete-account` edge function and signs the user out.
- **Restore Purchases** — `src/components/iap/RestorePurchasesButton.tsx:59` gates render on iOS only; `src/components/pricing/IapPlanCard.tsx:242–249` includes a secondary copy on Pricing.
- **iOS payment routing** — `src/screens/Pricing.tsx:134–137, 792, 873–880` hides Stripe yearly comparison + Stripe cards on `getPlatform() === 'ios'`.
- **Sign in with Apple** — `src/pages/LoginPage.tsx:363–395` wires `signInWithNativeOAuth({ provider: 'apple' })` for iOS + web fallback. Comment at the top references Apple Guideline 4.8.
- **Bundle ID alignment** — ⚠️ **CORRECTED 2026-05-17:** `ios/App/App.xcodeproj/project.pbxproj` declares `com.chaudoan.mercyblade`; `android/app/build.gradle` declares `com.mercyapps.mercyblade`. The original "both declare `com.chaudoan.mercyblade`" was false. Divergence is permanent — Android `applicationId` is locked after first Play publish, do NOT "align". See `reports/RECON-mobile-build-status.md` §3.
- **Permission strings** — `ios/App/App/Info.plist` has bilingual `NSMicrophoneUsageDescription`, `NSSpeechRecognitionUsageDescription`, `NSPhotoLibraryUsageDescription`.
- **Export compliance** — `ITSAppUsesNonExemptEncryption = false` in `Info.plist`.
- **Sentry** — `src/lib/monitoring/sentryInit.ts` is DSN-gated, PII-scrubbed (`stripPII()` at :133), drops `ui.input` breadcrumbs.

---

## D. Pre-submission gate (run this every submit)

A small subset of `docs/app-store-submission/SUBMISSION_RUNBOOK.md`'s pre-submit checklist, surfaced here so reviewers can sanity-check before clicking *Submit*:

- [ ] `npm run typecheck` clean
- [ ] `npm test` green (or only pre-existing `rlsContract.test.ts` flaky)
- [ ] `npm run lint` clean
- [ ] Manual: Sentry dashboard shows 0 critical errors last 24h
- [ ] Manual: Lighthouse mobile run on staging — LCP < 2.5 s, FCP < 1.8 s
- [ ] Manual: TestFlight build verified — IAP buy + restore + account deletion all work
- [ ] Manual: demo reviewer account created with seeded data; credentials pasted in App Store Connect → App Review Information
- [ ] Manual: gift purchase 🟡 — either deleted the placeholder line or gated `/gift` on iOS
- [ ] Manual: bundle ID matches App Store Connect record (`com.chaudoan.mercyblade`)
- [ ] Manual: build number bumped past prior submission
- [ ] Manual: screenshots match current shipped UI (no stale screenshots)

When all 10 boxes are ticked, push **Submit for Review**.
