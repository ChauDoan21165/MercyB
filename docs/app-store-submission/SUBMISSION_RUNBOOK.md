# MercyBlade — submission runbook

End-to-end steps from "code is ready" to "submitted for review", for both Apple App Store Connect and Google Play Console. Run this in order. Each step is independently re-runnable; if a step fails, fix and re-run that step (don't skip).

> Prerequisites:
> - Apple Developer account active (paid, $99/year)
> - Google Play Developer account active (paid, $25 one-time)
> - Mac with Xcode 15+ (iOS only)
> - JDK 17 + Android Studio with build tools (Android only)
> - `gh` CLI authenticated for the MercyBlade repo
> - `npm` / `npx tsx` working
> - Local `.env` populated with `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

Companion reading:
- [`reports/app-store-submission-package-2026-04-26.md`](../../reports/app-store-submission-package-2026-04-26.md) — copy bank (descriptions, keywords, age-rating answers)
- [`reports/app-store-readiness-audit-2026-04-27.md`](../../reports/app-store-readiness-audit-2026-04-27.md) — final audit + the four 🟡 items
- [`docs/app-store-submission/ios-submission-checklist.md`](./ios-submission-checklist.md) and [`android-submission-checklist.md`](./android-submission-checklist.md) — per-field status

---

## 0. Decision gates (one-time, before first submit)

Decide and lock the following — they're either irreversible or expensive to change later:

- [ ] **Bundle ID:** confirm `com.chaudoan.mercyblade` is what App Store Connect + Play Console will register. Both platforms now agree (audit §10) — do NOT revert this.
- [ ] **Apple App Name:** `MercyBlade — IELTS & English` (24/30) — locked at first submission for ~30 days.
- [ ] **Play App Title:** `MercyBlade — Học tiếng Anh cho người Việt` (42/50) — editable but indexed.
- [ ] **Predicted age rating:** 4+ Apple / 3+ IARC — confirm before answering questionnaire.
- [ ] **Privacy URL:** `https://mercyblade.com/privacy` (or `/legal/privacy` alias from PR #204).
- [ ] **Support URL:** decide between `https://mercyblade.com/support` (build the page first) or `https://mercyblade.com` + `mailto:admin@mercyblade.com` (no code change).

---

## 1. Pre-flight — code & verification gates

```bash
cd /Users/admin/MercyB
git checkout main
git pull origin main

# Sanity checks (run all four; fix before continuing)
npm run typecheck                      # tsc clean
npm test -- --run                      # vitest (rlsContract.test.ts may be flaky — confirm it's pre-existing)
npm run lint                           # eslint clean on touched files
npm run build                          # vite build clean

# Native build prep
npx cap sync                           # copies dist/ → ios/App/App/public + android/app/src/main/assets
```

If any of the above fails, stop and fix. Don't paper over a broken pre-flight.

---

## 2. Manual verifications (must pass before each submission)

### 2a. Sentry dashboard — last 24h must be quiet

1. Open https://sentry.io → MercyBlade project → Issues
2. Filter to last 24 hours
3. Confirm **0 unhandled errors at level=error or higher**
4. If any, fix root cause OR downgrade severity OR document in the audit "accepted risks" section

### 2b. Lighthouse — Web Vitals on staging

```bash
npx lighthouse https://staging.mercyblade.com \
  --preset=mobile \
  --only-categories=performance \
  --output=html \
  --output-path=./lighthouse-pre-submit-$(date +%F).html
open ./lighthouse-pre-submit-*.html
```

Required thresholds (Apple + Google both rank these):
- **LCP** < 2.5 s
- **FCP** < 1.8 s
- **CLS** < 0.1
- **TBT** < 200 ms

### 2c. TestFlight smoke test (iOS only)

Run on a real device, not the simulator. Reviewers test on real hardware.

1. Sign in with the demo reviewer account (provisioned in §3 below)
2. Buy a monthly plan via Apple IAP (sandbox account)
3. Confirm entitlement appears in `Account → Subscription`
4. Tap **Restore Purchases** — entitlement re-applies on a fresh install
5. Open `/pricing` — confirm only Apple IAP card is visible (no Stripe / MoMo / ZaloPay / VNPay / bank transfer / USDT / PayPal)
6. Open `/gift` — confirm the form either no longer says "Stripe checkout coming soon." (audit §C.1 fix applied) OR the route is iOS-gated (audit §C.1 alternative)
7. Run `Account → Delete my account` end-to-end — confirm the account is gone after sign-out
8. Test microphone permission → confirm the bilingual prompt fires

### 2d. Android equivalents (when shipping Android)

1. Install the AAB via internal-testing track on a real device
2. Buy a monthly plan via Google Play Billing (license-test account)
3. Confirm the entitlement and restore flow
4. Run the same delete-account check

---

## 3. Demo reviewer account provisioning (do this BEFORE every fresh review cycle)

Per A6 §5 + readiness audit §A.2, do **not** commit a migration. Steps:

1. Open Supabase Studio for `buemdfxyhxunzpgdoqin` → Auth → Users → **Add user**
   - Email: `appstore-reviewer@mercyblade.com`
   - Password: generated 16-char (paste-buffer it locally; do not commit anywhere)
   - Email confirmed: ✓
2. In SQL Editor, set tier 2 + flag for analytics exclusion:
   ```sql
   UPDATE public.profiles
   SET tier = 2,
       preferred_name = 'App Store Reviewer'
   WHERE email = 'appstore-reviewer@mercyblade.com';
   ```
3. Pre-seed sample data so the dashboard isn't empty:
   - Sign in as the reviewer in a private browser
   - Complete 3 rooms (any tier)
   - Run 2–3 pronunciation attempts
   - Save 1 notebook entry
4. Verify analytics queries exclude this email:
   ```sql
   -- Spot-check — this email should NOT appear in leaderboard
   SELECT email FROM public.weekly_leaderboard
   WHERE email LIKE 'appstore-reviewer%';
   ```
   If it does appear, edit the leaderboard view to filter `email NOT LIKE 'appstore-reviewer%@mercyblade.com'`.
5. Paste credentials into App Store Connect → App Review Information → Notes (and Play Console → App content → App access). Reviewer-notes paragraph: A6 §5 has the verbatim text.
6. **After each review cycle** — rotate the password (step 1 again).

---

## 4. iOS — build, archive, upload

### 4a. One-command build (preferred)

```bash
scripts/build-for-submission.sh ios
# Output: dist/submission/ios/App.ipa
```

The script runs the full pre-flight (§1) before invoking `xcodebuild` so you don't ship past a typecheck error.

### 4b. Manual Xcode path (when the script fails or signing is misconfigured)

1. `npx cap sync ios` — copies the latest web bundle into `ios/App/App/public`.
2. `npx cap open ios` — opens `ios/App/App.xcworkspace` (always the workspace, never the `.xcodeproj`).
3. In Xcode:
   - Select **App** target → **Signing & Capabilities** → confirm "Automatically manage signing" is on with Chau's team selected
   - Bump **Build** number (next integer past the prior submission)
   - Confirm **Marketing version** matches App Store Connect record (`1.0`)
   - Select **Any iOS Device (arm64)** in the toolbar
4. **Product → Archive**. Wait for the build (5–15 minutes the first time).
5. When the Organizer opens, select the new archive → **Distribute App** → **App Store Connect** → **Upload** → keep default options → **Next** → **Upload**.
6. Wait for the email from App Store Connect saying processing is complete (10–60 minutes).

### 4c. App Store Connect metadata (web UI, before clicking Submit)

1. Sign in to https://appstoreconnect.apple.com → My Apps → MercyBlade → the new build
2. Paste **App Information**:
   - Name + subtitle from `docs/app-store-submission/descriptions/{vi,en}.md`
   - Privacy Policy URL + Support URL from §0 above
   - Category: Education (primary), Reference (secondary)
3. Paste **Pricing & Availability**:
   - Tiers from `src/screens/Pricing.tsx` (verify via `cat src/config/pricing.ts` if values feel stale)
   - Region: Worldwide unless legal deferral
4. Paste **App Privacy**:
   - Use the answers in audit §A.1 + A6 §1.8
5. Paste **Version Information** (the per-build fields):
   - Description: `descriptions/en.md` (en-US locale) and `descriptions/vi.md` (vi-VN locale)
   - Promotional text: same files
   - Keywords: from `descriptions/en.md` keyword section (98/100 chars)
   - Support URL: as decided in §0
   - Marketing URL: `https://mercyblade.com`
   - **What's New in this version:** copy from `docs/app-store-submission/whats-new/v1.0.0.md`
   - Screenshots: upload the PNGs from `screenshots/iphone67/...` and `screenshots/ipad13/...`
6. **App Review Information**:
   - Demo account credentials (from §3 above)
   - Notes paragraph from A6 §5
   - **Privacy policy URL**: `https://mercyblade.com/privacy` — also linked from the in-app AI data consent screen shown on first launch (see `src/components/AIConsentModal.tsx`).
   - Contact email: `admin@mercyblade.com`
   - Phone: optional
7. **Version Release**: Manually release after approval (recommended for the first launch).

### 4d. Submit

Click **Save** → **Submit for Review**. Apple's queue is usually 24–48 hours.

---

## 5. Android — build, bundle, upload

### 5a. One-command build (preferred)

```bash
scripts/build-for-submission.sh android
# Output: dist/submission/android/app-release.aab
```

### 5b. Manual gradle path (when the script fails)

1. `npx cap sync android`
2. `cd android && ./gradlew bundleRelease`
3. Output AAB: `android/app/build/outputs/bundle/release/app-release.aab`

### 5c. Play Console upload (web UI)

1. Sign in to https://play.google.com/console → MercyBlade → Production (or Internal testing for first run)
2. **Create new release** → upload the AAB from §5a
3. Paste **Store listing**:
   - Title + short description + full description from `descriptions/{vi,en}.md`
   - Screenshots (phone class minimum)
   - App icon: 512×512 PNG
   - Feature graphic: 1024×500 PNG (design asset, not script-generated)
4. **Data safety**: row-by-row from audit §B.1 + A6 §2.7
5. **Content rating**: complete the IARC questionnaire with answers from audit §B.2
6. **Target audience**: 13+. Do **NOT** opt into Designed for Families (audit §B.3 + A6 §7 Risk 4).
7. **App content**: declare no ads, no government / news / COVID-19 categories.
8. **Pricing & distribution**: free with in-app purchases; worldwide.
9. **Review release** → **Send for review**. Play's queue is usually 1–7 days for first release.

---

## 6. Post-submission

### 6a. While waiting

- [ ] Monitor `admin@mercyblade.com` for App Store Connect / Play Console emails. Apple's "Information Needed" emails have a 7-day response window.
- [ ] Don't push new builds while a build is "Waiting for Review" unless rejected. Stacking builds confuses reviewers.
- [ ] Capture the demo reviewer's session in Supabase auth logs so you can confirm the account works the day Apple actually reviews.

### 6b. If rejected

1. Read the exact guideline number cited (e.g., 4.0, 5.1.1, 3.1.1).
2. Cross-reference audit §C — if the cause is one of the 🟡 items, that's where the fix recipe lives.
3. Fix in a small PR, re-build, re-submit. Apple's resubmission queue is faster (usually <24h).
4. Update this runbook's §A or §B with the new mitigation so the next submission doesn't trip the same rejection.

### 6c. After approval — first 7 days

Per `docs/app-store-submission/aso-strategy.md` §6:
- Daily: watch App Store Connect "Sources" panel — tag downloads by source
- Day 7: if listing → install conversion < 25%, swap the lead screenshot
- Day 14: submit a metadata-only update (subtitle tweak) — Apple ranks fresh listings slightly higher

---

## 7. Per-version "what's new"

Each release:
1. Copy `whats-new/v1.0.0.md` to `whats-new/vX.Y.Z.md`
2. Replace the body with: 1 sentence headline + 3–5 bullets + 1 privacy line
3. Paste into App Store Connect → Version Information → "What's New in this version"
4. Same for Play Console → release notes
5. Tone: warm, no superlatives, no marketing puffery. Apple flags "the best", "amazing", etc.

---

## 8. Emergency rollback

If a shipped build breaks badly (auth wipeout, mass crashes, payment double-charges):

**iOS:** App Store Connect → Phased Release → **Pause Phased Release** stops further rollout instantly. Then submit a fix build at expedited review priority (cite the user impact in the request).

**Android:** Play Console → Production → Halted Rollout → resume after fix. Or use **Staged Rollout** to limit blast radius from the start (recommended for v1.0.x).

For a Sentry-detected regression in production:
1. Halt rollout (above).
2. Open the offending issue in Sentry → identify the commit.
3. Revert the commit, push, build, submit expedited review.
4. After fix is live, write a postmortem in `reports/postmortem-<date>.md`.
