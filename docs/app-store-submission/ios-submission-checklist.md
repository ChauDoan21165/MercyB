# iOS — App Store Connect submission checklist

**Source-of-truth copy bank:** [`reports/app-store-submission-package-2026-04-26.md`](../../reports/app-store-submission-package-2026-04-26.md) (A6's package). Sections referenced as `A6 §N`.

Status legend: ✅ complete · 🟡 pending (needs Chau action) · 🔴 blocked (needs code change first)

---

## 1. App identity

| Item | Value | Status | Notes |
|---|---|---|---|
| Bundle ID | `com.chaudoan.mercyblade` | ✅ | Locked at first submission. |
| Marketing version | `1.0` | ✅ | `ios/App/App.xcodeproj/project.pbxproj` |
| Build number | `10` | ✅ | Bump per upload. |
| Bundle ID alignment with Android (`com.mercyapps.mercyblade`) | divergent | 🟡 | A6 §0 flag — accept divergence permanently or fix before first submission. |
| App name (EN, ≤30) | `MercyBlade — IELTS & English` `[24/30]` | ✅ | `descriptions/en.md` |
| App name (VI, ≤30) | `MercyBlade — Học tiếng Anh` `[26/30]` | ✅ | `descriptions/vi.md` |
| Subtitle (EN, ≤30) | `English for Vietnamese learners` `[30/30]` | ✅ | A6 §1.2 |
| Subtitle (VI, ≤30) | `Học tiếng Anh chuẩn người Việt` `[30/30]` | ✅ | A6 §1.2 |
| Promotional text (≤170) | See `descriptions/{vi,en}.md` | ✅ | EN draft was 173/170; trimmed copy in this folder. |

---

## 2. Description, keywords, URLs

| Item | Source | Status |
|---|---|---|
| Description (≤4000) — EN | `descriptions/en.md` | ✅ |
| Description (≤4000) — VI | `descriptions/vi.md` | ✅ |
| Keywords (≤100, comma-separated, EN) | `ielts,toeic,vstep,english,vietnamese,phát âm,học tiếng anh,pronunciation,grammar,mercy,speaking` `[~98/100]` | ✅ A6 §1.5 |
| Privacy Policy URL | `https://mercyblade.com/privacy` | ✅ existing route + this PR adds `/legal/privacy` alias |
| Support URL | `https://mercyblade.com/support` | ✅ existing route renders `src/pages/Support.tsx` |
| Marketing URL (optional) | `https://mercyblade.com` | ✅ |
| What's New in this version | `whats-new/v1.0.0.md` | ✅ template ready |

---

## 3. Screenshots (5–7 per device class)

Run `scripts/generate-screenshots.ts` against staging the day of submission.

| Device class | Resolution | Required? | Status |
|---|---|---|---|
| iPhone 6.7" (15 Pro Max) | 1290×2796 | Yes | 🟡 capture day-of |
| iPhone 6.1" (15) | 1179×2556 | Often skippable if 6.7" provided | 🟡 |
| iPhone 5.5" (legacy 8 Plus) | 1242×2208 | Skip — drop iPhone 8 support | ✅ N/A |
| iPad 12.9" | 2048×2732 | Required if iPad-compatible | 🟡 |

Caption-overlay copy bank: A6 §6. Shot list: A6 §3.

---

## 4. App privacy

| Question | Answer | Where it's wired |
|---|---|---|
| Data Linked to You | Email, app interactions, purchase history | `src/pages/Privacy.tsx` §1, §3 |
| Data Not Linked to You | Crash diagnostics (Sentry, gated) | `src/lib/monitoring/sentryInit.ts` |
| Data Used to Track You | None | No advertising / tracking SDKs |
| Third-party SDK disclosure | A6 §4 (full table) | One row per SDK |

Pre-flight: confirm none of the "rejected" SDKs in A6 §4 (Firebase, FB, etc.) snuck in. Run `grep -rE "firebase|fbsdk|amplitude|mixpanel|posthog" package.json`.

---

## 5. Age rating

| Question | Answer | Source |
|---|---|---|
| Targeted at Children Under 13 | **No** | A6 §1.8 + Privacy.tsx §7 |
| User-Generated Content | Confirm before submit | A6 §1.8 — depends on whether v1 ships any public posting flow |
| All other content categories | None | A6 §1.8 |
| Predicted rating | 4+ | A6 §1.8 |

**Action:** verify UGC answer matches what's actually shipped in the iOS build.

---

## 6. Demo account for reviewers

Apple **requires** a working demo account for any login-gated app.

- **Do NOT** auto-seed. See A6 §5: "DO NOT auto-create; do it from the admin panel."
- **Do** create manually via the Supabase dashboard or admin panel before submission.
- **Email:** `appstore-reviewer@mercyblade.com`
- **Tier:** 2 (premium-equivalent) — reviewers see all 500+ rooms unlocked
- **Pre-seed:** 3-5 completed rooms, 2-3 pronunciation attempts, 1 notebook entry
- **Status flag:** mark in profiles so the analytics + leaderboard pipelines exclude it. (Cheapest implementation: `email LIKE 'appstore-reviewer%@mercyblade.com'` in the existing analytics filters.)

Reviewer-notes paragraph (paste in App Store Connect → App Review Information → Notes): A6 §5 has the verbatim text.

---

## 7. Compliance

| Field | Answer | Status |
|---|---|---|
| Export Compliance — uses encryption | Yes (HTTPS only, no proprietary crypto) | 🟡 — set `ITSAppUsesNonExemptEncryption = NO` in `Info.plist` if not already; A6 audit will confirm |
| Content Rights — own/license all content | Yes | ✅ — content authored in-house |
| In-App Purchase routing (Guideline 3.1.1) | iOS shows ONLY Apple IAP path | 🔴 A6 §7 Risk 2 — verify `Pricing.tsx` hides MoMo/ZaloPay/Stripe-direct on `Capacitor.getPlatform() === 'ios'` |
| Restore Purchases button (Guideline 3.1.1) | Visible in iOS pricing/account flow | 🔴 A6 §7 Risk 5 — verify before submit |
| Account Deletion (Guideline 5.1.1(v)) | In-app at Account → Delete my account | ✅ A6 §7 Risk 3 (already audited) |
| Microphone permission rationale | Bilingual NSMicrophoneUsageDescription | ✅ A6 §7 Risk 1 |

---

## 8. Final pre-submit gates

- [ ] `npm run typecheck` clean
- [ ] `npm test` green
- [ ] `scripts/build-for-submission.sh ios` produces an IPA without warnings
- [ ] Screenshots captured + caption overlays applied
- [ ] Demo reviewer account created + credentials pasted in App Review Notes
- [ ] Bundle-ID divergence decision made (A6 §0)
- [x] Support URL decision made (this checklist §2)
- [ ] iOS build hides web-payment routes (this checklist §7 + A6 §7 Risk 2)
- [ ] "Restore Purchases" button visible in iOS Pricing (§7 + A6 §7 Risk 5)
- [ ] Test deletion run end-to-end on TestFlight build (A6 §8 task 9)

When all 10 boxes are ticked, push **Submit for Review**.
