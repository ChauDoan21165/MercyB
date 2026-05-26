# MercyBlade — App Store + Play Store Submission Package

**Date:** 2026-04-26
**Auditor:** A6 (audit + draft only — no code changes, no PRs)
**Status:** Ready for Chau review and editing

> All copy below is a Chau-editable draft. Numbers in brackets `[X / Y]` are character usage vs Apple's/Google's hard limit. Verify each before pasting into the consoles.

---

## 0. Identity, versions, and a flag worth resolving

| Surface | Value | Source |
|---|---|---|
| Marketing name | **MercyBlade** | `src/config/product.ts:32` |
| Display name (iOS) | "Mercy Blade" (with space) | `capacitor.config.ts:6` |
| Tagline | English for Vietnamese diaspora | `src/config/product.ts:35` |
| iOS bundle ID | `com.chaudoan.mercyblade` | `ios/App/App.xcodeproj/project.pbxproj` |
| Android applicationId | `com.mercyapps.mercyblade` | `android/app/build.gradle` |
| iOS marketing version | `1.0` (build 10) | `project.pbxproj` |
| Android version | `1.0.1` (versionCode 3) | `build.gradle` |

**🚩 Flag for Chau:** iOS uses `com.chaudoan.mercyblade`, Android uses `com.mercyapps.mercyblade`. Bundle IDs **cannot be changed after first submission** to either store. Decide *now* whether to align them (recommended: pick one and update the other) or accept the divergence permanently. Either choice is fine, but pick deliberately. Memory entry `project_android_urls.md` already reflects the Android side.

---

## 1. App Store Connect required fields

### 1.1 App name
- **English:** `MercyBlade — IELTS & English` `[24 / 30]`
- **Vietnamese (vi-VN):** `MercyBlade — Học tiếng Anh` `[26 / 30]`

> Apple's "App Name" is the single most-searched field. Keeping the brand first protects brand equity; the suffix targets Vietnamese learners' top intent (IELTS in EN, "học tiếng Anh" in VI).

### 1.2 Subtitle (30 char)
- **EN:** `Learn English the Vietnamese way` `[31 / 30]` ⚠ 1 over — try `English for Vietnamese learners` `[30 / 30]`
- **VI:** `Học tiếng Anh chuẩn người Việt` `[30 / 30]` ✓

### 1.3 Promotional text (170 char, can be updated without re-review)
- **EN:** `IELTS, TOEIC, VSTEP prep with phoneme-level pronunciation scoring tuned to Vietnamese speakers. Mercy is your patient teacher — bilingual, warm, and always free to start.` `[173 / 170]` ⚠ 3 over
- **VI:** `Luyện IELTS, TOEIC, VSTEP với chấm điểm phát âm theo từng âm vị, tinh chỉnh riêng cho người Việt. Cô Mercy luôn ấm áp, kiên nhẫn — và miễn phí để bắt đầu.` `[160 / 170]` ✓

### 1.4 Description (4000 char) — DRAFT
> Use the bilingual block below verbatim, or split EN-only into the EN locale and VI-only into the vi-VN locale. Apple shows whichever locale matches the user's device.

```
MercyBlade is the English-learning app built for Vietnamese learners — not a generic app translated into Vietnamese.

WHO IT'S FOR
• IELTS, TOEIC, and VSTEP candidates
• Young professionals preparing to work or study abroad
• Vietnamese diaspora wanting fluency that fits their accent
• Anyone tired of one-size-fits-all apps

WHAT MAKES IT DIFFERENT
• Pronunciation graded at the phoneme level — th, r, l, final consonants, the sounds Vietnamese speakers actually struggle with
• Grammar drills targeting Vietnamese transfer errors (articles, verb tenses, plurals)
• 500+ guided rooms with real conversational content, not 30-second snippets
• Mercy — your patient, bilingual teacher who never streak-shames you
• Vietnamese cultural examples (phở, Honda Wave, Tết) so the language feels yours

WHAT YOU GET FREE
50+ rooms, full pronunciation scoring on the day's lessons, and the warm Mercy guidance you'd expect from a real teacher. No ads. Ever.

WHAT PREMIUM UNLOCKS
All 500+ rooms, exam-prep tracks (IELTS / TOEIC / VSTEP), unlimited AI feedback, and offline downloads for the commute or weak Wi-Fi.

PRIVACY-FIRST
We don't store your voice recordings — pronunciation audio goes to Microsoft Azure for scoring, scores come back, audio is gone. Account deletion is one tap (Account → Delete my account) and is immediate.

Built in Vietnam, for Vietnamese learners worldwide.
mercyblade.com
```

`[~1,180 / 4,000]` — leaves headroom. Add testimonials or success stories before submission.

**Vietnamese version** to localize separately — translate the same structure, keep the bullet style.

### 1.5 Keywords (100 char, comma-separated, EN locale)
```
ielts,toeic,vstep,english,vietnamese,phát âm,học tiếng anh,pronunciation,grammar,mercy,speaking
```
`[~98 / 100]` ✓

> Apple ignores words already in the title/subtitle, so don't repeat "MercyBlade". Vietnamese diacritics are searchable. Test with App Store Connect's keyword tool before locking in.

### 1.6 URLs
| Field | URL | Status |
|---|---|---|
| Privacy Policy URL | `https://mercyblade.com/privacy` | Lives at `src/pages/Privacy.tsx`, route `/privacy` ✓ |
| Support URL | `https://mercyblade.com/support` | **NEEDS CONFIRMATION** — no `/support` page found in `src/pages`; create or point to `https://mercyblade.com` + a `mailto:admin@mercyblade.com` |
| Marketing URL (optional) | `https://mercyblade.com` | ✓ |

### 1.7 Category
- **Primary:** Education
- **Secondary:** Reference

### 1.8 Age rating questionnaire (Apple's exact questions, MercyBlade's answer)

| Question | Answer | Why |
|---|---|---|
| Cartoon or Fantasy Violence | None | Reading rooms are educational |
| Realistic Violence | None | — |
| Profanity or Crude Humor | None | — |
| Mature/Suggestive Themes | None | — |
| Horror/Fear Themes | None | — |
| Medical/Treatment Information | None | — |
| Alcohol, Tobacco, Drug Use | None | — |
| Simulated Gambling | None | — |
| Sexual Content or Nudity | None | — |
| Unrestricted Web Access | **No** | In-app browser is sandboxed to MercyBlade content |
| Gambling | None | — |
| Contests | None | — |
| User Generated Content | **No** ⚠ confirm | `community_messages` table exists but if no public posting flow ships in v1, answer No. If public chat exists, answer Yes and disclose moderation. |
| Targeted at Children Under 13 | **No** | Privacy.tsx §7 explicitly says not for under-13. Kids mode is design-only, not COPPA-targeted. |

**Predicted rating:** 4+ (assuming UGC stays gated/off in v1).

---

## 2. Play Store Console required fields

### 2.1 App title (50 char)
- **EN:** `MercyBlade — IELTS & English for Vietnamese` `[44 / 50]` ✓
- **VI:** `MercyBlade — Học tiếng Anh cho người Việt` `[42 / 50]` ✓

### 2.2 Short description (80 char)
- **EN:** `Phoneme-level pronunciation + IELTS prep designed for Vietnamese learners.` `[75 / 80]` ✓
- **VI:** `Chấm điểm phát âm theo âm vị + luyện IELTS, dành cho người Việt.` `[63 / 80]` ✓

### 2.3 Full description (4000 char)
Reuse the description from §1.4 verbatim. Play Store accepts identical copy.

### 2.4 Privacy Policy URL
`https://mercyblade.com/privacy`

### 2.5 Category
- **Category:** Education
- **Tags:** Self-improvement, Test preparation

### 2.6 IARC Content Rating questionnaire
Same answers as Apple §1.8. Expected outcome: **PEGI 3 / ESRB Everyone / IARC 3+**.

### 2.7 Data safety form (Google Play's strictest field)

| Data type | Collected? | Shared? | Purpose | Optional? |
|---|---|---|---|---|
| Email | Yes | No | Account management, support | Required for accounts |
| Name (display only) | Yes | No | App functionality | Optional |
| Voice recordings (audio) | **Processed but not stored** | Yes (Azure, transient only) | Pronunciation scoring | Optional (per-cohort flag, see Privacy.tsx §4a) |
| App interactions / pronunciation scores | Yes | No | Learning analytics, progress tracking | Required |
| Crash logs | Yes | Yes (Sentry, when enabled) | Diagnostics | Required |
| Purchase history | Yes | Yes (RevenueCat / Stripe / Apple / Google) | Subscription management | Required for paid users |
| Device or other IDs | Yes | Yes (RevenueCat) | Subscription entitlement | Required for paid users |

**Encryption in transit:** Yes (HTTPS everywhere, Supabase + Azure + Resend all TLS).
**Data deletion request mechanism:** In-app at Account → Delete my account (`AccountPage.tsx:715`) plus support email at `admin@mercyblade.com`.

---

## 3. Screenshots plan

> Chau captures these on his own iPhone + iPad + Android device. This is the shot list, in order. **The first screenshot drives ~80% of conversion** — lead with the strongest benefit.

### Required device sizes
| Device | Resolution | Apple/Google requires | Notes |
|---|---|---|---|
| iPhone 6.7" | 1290×2796 | Yes | iPhone 15 Pro Max |
| iPhone 6.1" | 1179×2556 | Often OK to skip if 6.7" provided | iPhone 15 |
| iPhone 5.5" | 1242×2208 | Legacy — skip if not supporting iPhone 8 | |
| iPad 12.9" | 2048×2732 | Required if app is iPad-compatible | |
| Android phone | 1080×1920+ | Yes | Any modern phone |
| Android 7" tablet | Optional | | |
| Android 10" tablet | Optional | | |

### Shot list (5–7 screens, in order)

1. **Hero — pronunciation scoring screen.**
   *Capture:* `MercyTeacherTab` mid-pronunciation, with phoneme-level coloring visible (correct sounds green, weak ones red).
   *Caption overlay (bilingual):* `Phát âm chính xác như giáo viên / Pronunciation graded like a teacher`

2. **Mercy character + warmth.**
   *Capture:* `MercyGuidePanel` with Mercy's avatar, a gentle correction message ("Almost! The 'th' in 'three' should buzz a little — try again"), bilingual labels visible.
   *Caption:* `Cô Mercy ở bên bạn từng câu / Mercy is patient with every sentence`

3. **Vietnamese-specific drills.**
   *Capture:* A grammar room targeting articles (a/an/the) — the #1 Vietnamese transfer error.
   *Caption:* `Sửa lỗi người Việt thường mắc / Built for Vietnamese learners`

4. **IELTS / TOEIC / VSTEP track entry.**
   *Capture:* Exam-prep selector (`/exam-prep` route) showing the three tracks.
   *Caption:* `IELTS · TOEIC · VSTEP — đủ ba kỳ thi / Three exams, one app`

5. **500+ rooms / room library.**
   *Capture:* `AllRooms` page with the room grid scrolling.
   *Caption:* `500+ phòng học theo chủ đề / 500+ rooms across every topic`

6. **Account + privacy / control.**
   *Capture:* Account page including the "Delete my account" button visible at the bottom.
   *Caption:* `Toàn quyền với dữ liệu của bạn / Your data, your control`

7. **(Optional) Pricing.**
   *Capture:* `Pricing.tsx` page with the 99k/199k/lifetime tiers in VND.
   *Caption:* `Giá theo người Việt — không phải đô-la / Vietnamese prices, not dollar-translated`

### Caption-overlay style guide
- Vietnamese first, English after a slash
- Sans-serif, white-on-dark or dark-on-cream — match brand
- Keep at the top third (Apple's listing UI overlays controls at the bottom)
- One headline per screenshot — no body copy

---

## 4. Third-party SDK disclosure list

For App Store Connect's "App Privacy" section. Each row tells Apple/Google what leaves the device and why.

| SDK | Where | Data sent | Purpose | Privacy policy |
|---|---|---|---|---|
| **Supabase** (`@supabase/supabase-js`) | `src/lib/supabaseClient.ts` | Auth tokens, profile, learning data | Auth + database | https://supabase.com/privacy |
| **Microsoft Azure Cognitive Services (Speech)** | `supabase/functions/azure-phoneme/` | Short audio clip + reference text (NOT retained) | Phoneme-level pronunciation scoring | https://privacy.microsoft.com/privacystatement |
| **OpenAI** (`openai` v6.27) | `supabase/functions/ai-chat/`, `mercy-guide/` | Chat prompts + learner responses | AI feedback / guidance | https://openai.com/policies/privacy-policy |
| **RevenueCat** (`@revenuecat/purchases-capacitor`) | iOS/Android in-app purchases | Device ID, purchase history, entitlement state | Subscription management | https://www.revenuecat.com/privacy |
| **Stripe** (`stripe` v20) | `supabase/functions/stripe*` | Email, payment metadata (no raw card data — Stripe-hosted) | Web/card payments | https://stripe.com/privacy |
| **Sentry** (`@sentry/react`) | `src/lib/monitoring/sentryInit.ts` (gated) | Crash stack traces, breadcrumbs | Error monitoring | https://sentry.io/privacy/ |
| **Resend** | `supabase/functions/email-broadcast/`, `send-redeem-email/` | Email address only | Transactional + marketing email | https://resend.com/legal/privacy-policy |
| **Apple App Store / Google Play Billing** | `supabase/functions/apple-iap-sync/`, `google-webhook/` | Purchase tokens | Subscription validation | Apple/Google ToS |

### NOT used (so Chau can confidently say "no" to Apple's questions)
- ❌ ElevenLabs — referenced as a string in `src/lib/audio/types.ts:94` but no live integration. Pre-recorded kids audio is bundled.
- ❌ PostHog / Mixpanel / Amplitude — no analytics SDK shipping
- ❌ Firebase — none
- ❌ Facebook / Google ad SDKs — none
- ❌ User-tracking SDKs (AppsFlyer, Adjust, Branch) — none

This means MercyBlade can answer **"Data Not Linked to You" → none of those advertising/tracking categories**, which is a strong, clean privacy stance to lead with.

---

## 5. Demo account credentials for reviewers

Apple **requires** a working demo account for any app behind login. Play Store strongly recommends one.

### What to create (Chau does this manually — do NOT auto-create)
- **Email:** `appstore-reviewer@mercyblade.com` (or use a `+reviewer` alias on admin@)
- **Password:** Generated 16-char random; rotate after each app review cycle
- **Account state to seed:**
  - Tier 2 (premium-equivalent) so reviewers see all 500+ rooms unlocked
  - Pre-seeded learning history (3-5 completed rooms, 2-3 pronunciation attempts) so the dashboard isn't empty
  - One saved notebook entry so the notebook surface isn't blank
  - **No** payment information attached — reviewers should not need to pay
- **What to put in App Store Connect "App Review Information" notes:**
  ```
  Demo account: appstore-reviewer@mercyblade.com / [password]
  Path to in-app deletion: Sign in → tap profile icon → Account → scroll
  to "Delete my account" (red button). Type "DELETE" to confirm.
  Pronunciation feature: Tap any room → tap a sentence → tap mic →
  speak → see phoneme-level score.
  ```

### What NOT to do
- Don't ship a hardcoded test user in any client code
- Don't give the reviewer admin (`get_admin_level >= 9`) privileges
- Don't seed data that references real users

---

## 6. Screenshot text overlays — bilingual copy bank

A single, Chau-editable bank of headline candidates. Pick the strongest 5-7 to match the screenshot list above.

| # | Vietnamese | English |
|---|---|---|
| 1 | Phát âm chính xác như giáo viên | Pronunciation graded like a teacher |
| 2 | Cô Mercy luôn kiên nhẫn với bạn | Mercy is patient with every sentence |
| 3 | Sửa lỗi người Việt thường mắc | Built for Vietnamese learners |
| 4 | IELTS · TOEIC · VSTEP — đủ ba kỳ thi | Three exams, one app |
| 5 | 500+ phòng học theo chủ đề | 500+ rooms across every topic |
| 6 | Toàn quyền với dữ liệu của bạn | Your data, your control |
| 7 | Giá theo người Việt — không phải đô-la | Vietnamese prices, not dollar-translated |
| 8 | Học tiếng Anh trong 5 phút mỗi ngày | English in 5 minutes a day |
| 9 | Không streak-shaming, chỉ tiến bộ thực sự | No streak-shaming, just real progress |
| 10 | Bắt đầu miễn phí, không quảng cáo | Free to start, no ads ever |

---

## 7. Rejection risk assessment

Five concrete risks for MercyBlade v1, ranked by likelihood:

### Risk 1 — Microphone permission rationale (Apple Guideline 5.1.1)
- **Status:** ✓ Already strong. `Info.plist` `NSMicrophoneUsageDescription` and `NSSpeechRecognitionUsageDescription` are bilingual and specific (cite practice intent).
- **Action:** None. These are correctly specific.

### Risk 2 — Apple Guideline 3.1.1 (in-app purchase routing)
- **Status:** ⚠ Needs verification. App accepts Stripe (web), MoMo/ZaloPay/VNPay/bank transfer (web). Apple **forbids** in-app links to alternative payment methods for digital goods on iOS.
- **Action:** Confirm that on iOS, the only purchase path visible in the app is RevenueCat → Apple IAP. Web-only payments (MoMo, Stripe direct) must be invisible/disabled in the iOS build, even if active on the web.
- **Files to check:** `src/pages/Pricing.tsx`, anywhere that imports `paypal-payment` / `bank-transfer-orders` / `usdt-payment` edge functions — these must NOT render on `Capacitor.getPlatform() === 'ios'`.

### Risk 3 — Account deletion path (Guideline 5.1.1(v))
- **Status:** ✓ Verified by A6 audit (`reports/account-deletion-audit-2026-04-26.md`). Path is `Account → Delete my account`, fully wired.
- **Action:** Capture screenshot 6 above; mention path in reviewer notes (§5).

### Risk 4 — Children's privacy / kids mode framing
- **Status:** ⚠ Mixed message risk. NORTH_STAR explicitly says "kids mode is sacred" and CLAUDE.md says "non-negotiable #2". Privacy.tsx §7 says NOT for under-13.
- **Action:** When asked "Is your app primarily directed at children?" answer **No**. Kids mode is a sub-feature parents use, not the audience. If you answer Yes, Apple imposes COPPA constraints (no third-party SDKs, no analytics on kids, etc.) that the app's Sentry + RevenueCat + Azure pipeline does not currently meet.

### Risk 5 — Server-side localization of subscriptions / restore purchases
- **Status:** ⚠ Verify. Apple insists on a "Restore Purchases" button accessible without re-login. RevenueCat's `restorePurchases()` is wired in `supabase/functions/billing-restore/`.
- **Action:** Confirm there's a visible "Restore" button in the iOS Pricing/Account flow. Reviewers will look for this and reject if missing.

### Risk 6 — Bundle size on Android (per memory)
- **Status:** Memory says ~21 MB of room JSON could move to Supabase but is deferred. Current bundle should be under Play's 200 MB AAB limit. Verify before submission.

---

## 8. Manual tasks for Chau (the actual TODO list)

1. **Decide bundle ID alignment** — accept divergence between iOS `com.chaudoan.*` and Android `com.mercyapps.*`, or fix one before first submission. *(Code change required if fixing.)*
2. **Create `https://mercyblade.com/support` page** OR confirm support URL is `https://mercyblade.com` with mailto link. *(Code change.)*
3. **Capture 5-7 screenshots per device class** (iPhone 6.7", iPad 12.9", Android phone) using the shot list in §3.
4. **Add caption overlays** to screenshots using copy from §6 (Figma / Canva / similar).
5. **Provision the demo reviewer account** (§5) — DO NOT auto-seed; do it from the admin panel.
6. **Verify iOS hides web-payment options** when running under Capacitor on iOS (§7 Risk 2).
7. **Verify "Restore Purchases" button is visible** on iOS (§7 Risk 5).
8. **Answer "Children under 13?" → No** in both consoles (§7 Risk 4).
9. **Run a test deletion** end-to-end on a TestFlight build (carry-over from A6 audit).
10. **Localize the description** in §1.4 to Vietnamese for the vi-VN locale.

---

╔══════════════════════════════════════════════════════════╗
║  📋 Chau Report from A6 — App Store submission package  ║
╚══════════════════════════════════════════════════════════╝
- File: `reports/app-store-submission-package-2026-04-26.md`
- Length: ~2,650 words
- Manual tasks for Chau: **10**
- Code-side blockers identified: **3** (bundle-ID divergence, support URL page missing, iOS web-payment routing must be platform-gated)
- Status: ready for Chau review
