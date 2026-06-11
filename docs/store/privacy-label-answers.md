# Privacy Label Answers — App Store & Google Play

Generated: 2026-06-11  
Scope: mercyblade.com web app + iOS Capacitor shell + Android Capacitor shell  
Evidence: every claim cites file:line in the repo

---

## Account Deletion Guard Checklist

All steps verified against live code (29 unit tests pass: `npm run check:delete-account-guard`).

| # | Step | Status | Evidence |
|---|------|--------|---------|
| 1 | User can initiate deletion from Settings | ✅ | `src/pages/AccountPage.tsx:829–832` — "Xóa tài khoản" button in account settings |
| 2 | Hard confirmation required before delete | ✅ | `src/pages/AccountPage.tsx:949–970` — user must type "DELETE" in a modal; button disabled otherwise |
| 3 | Session token forwarded to edge function | ✅ | `src/pages/account/deleteAccountFlow.ts:21–28` — `access_token` extracted from session and sent as `Authorization: Bearer <token>` |
| 4 | Edge function validates the caller identity | ✅ | `supabase/functions/delete-account/index.ts:63–77` — `authClient.auth.getUser()` verifies the JWT against Supabase; 401 on any failure |
| 5 | MFA re-auth gate (AAL2) for accounts with TOTP | ✅ | `supabase/functions/delete-account/index.ts:84–116` — lists MFA factors; blocks with `aal2_required` if user has a verified TOTP factor but JWT is AAL1; fail-CLOSED if factor lookup errors |
| 6 | AAL2 UI: user routed to re-auth page | ✅ | `src/pages/account/deleteAccountFlow.ts:39–45` — `aal2_required` → `navigate("/auth/challenge?next=/account")` |
| 7 | Personal learning data deleted (Pass 1) | ✅ | `supabase/functions/delete-account/index.ts:120–136` iterates `getDeleteEntries()` — 97 delete rows across tables including `study_log`, `speech_attempts`, `room_usage_analytics`, `teacher_memory`, `mercy_conversations`, `mercy_user_facts`, `user_notebook_items`, etc. See full manifest at `supabase/functions/delete-account/user-data-manifest.ts:43–432` |
| 8 | Financial/billing rows anonymized, not deleted | ✅ | `supabase/functions/delete-account/index.ts:138–162` iterates `getAnonymizeEntries()` — 47 anonymize rows; `user_id` set to NULL; free-text fields (feedback, messages, Stripe IDs, jsonb payloads) scrubbed via `scrub_columns` spec. Retained for tax/legal audit per GDPR Art. 17(3)(e) |
| 9 | Email audit scrubbed by recipient email (Pass 2b) | ✅ | `supabase/functions/delete-account/index.ts:164–189`; `email-audit-recipient-scrub.ts` — rows where deleted user was the *recipient* of an admin email are scrubbed by email address match (GAP A close from #819) |
| 10 | `profiles` row deleted (Pass 3) | ✅ | `supabase/functions/delete-account/index.ts:191–202` — `admin.from("profiles").delete().eq("id", userId)` |
| 11 | `auth.users` row deleted (Pass 4 — cascade backstop) | ✅ | `supabase/functions/delete-account/index.ts:204–214` — `admin.auth.admin.deleteUser(userId)`; cascades any FK-linked rows the manifest missed |
| 12 | Client signs out and redirects after deletion | ✅ | `src/pages/account/deleteAccountFlow.ts:57–58` — `signOut()` then `navigate("/", { replace: true })` |
| 13 | CI gate: manifest covers all live user-id tables | ✅ | `scripts/check-delete-account-coverage.mjs` — reads `SUPABASE_CI_INTROSPECT_DSN` pg connection; fails build if any user_id table is unclassified. Runs on every MR + main push (`.gitlab-ci.yml:791–803`) |
| 14 | CI gate: unit tests lock manifest structure | ✅ | `supabase/functions/delete-account/__tests__/user-data-manifest.test.ts` — locks structural invariants + 42-table B1 coverage list; `src/pages/__tests__/deleteAccountFlow.test.ts` — locks token flow + AAL2 redirect |

**Gaps found:** None. The flow is end-to-end implemented and tested.

---

## App Store (Apple) — Privacy Nutrition Labels

Answer format follows the App Store Connect questionnaire categories.

### Data Linked to the User

#### Contact Info
| Data | Collected | Linked to user | Used for tracking |
|------|-----------|---------------|-------------------|
| Email address | **Yes** | Yes | No |
| Name | **Yes** (optional `full_name`) | Yes | No |
| Phone number | No | — | — |

- **Email**: written to `profiles.email` via the `handle_new_user()` Supabase trigger on `auth.users INSERT` (`supabase/migrations/20251208225203_*.sql:4–16`). Used for authentication OTP, transactional emails (billing, password reset), and optional marketing/digest emails.
- **Name**: `profiles.full_name` from `raw_user_meta_data->>'full_name'` at signup; user-provided, optional. Used to personalise in-app greeting.

#### Identifiers
| Data | Collected | Linked to user | Used for tracking |
|------|-----------|---------------|-------------------|
| User ID | **Yes** | Yes | No |
| Device ID / advertising ID | No (web only; IDFA never accessed) | — | — |

- **User ID**: Supabase UUID in `profiles.id` (`src/lib/supabaseClient.ts` singleton); scopes all learning data.

#### Usage Data
| Data | Collected | Linked to user | Used for tracking |
|------|-----------|---------------|-------------------|
| Product interaction | **Yes** | Yes | No |
| In-app search history | No | — | — |

- **Product interaction**: `study_log`, `room_usage_analytics`, `study_events`, `user_sessions` (`user-data-manifest.ts:92,88,91,106`). Used to power personal progress dashboard and AI tutor personalisation. Deleted on account deletion.

#### Diagnostics
| Data | Collected | Linked to user | Used for tracking |
|------|-----------|---------------|-------------------|
| Crash data | **Yes** (Sentry) | Yes (Sentry session replay only in web) | No |
| Performance data | No (not linked to user) | — | — |

#### Audio Data
| Data | Collected | Linked to user | Used for tracking |
|------|-----------|---------------|-------------------|
| Voice/Sound recordings | **Yes** | Yes | No |

- **Audio (pronunciation)**: microphone audio is processed by Supabase edge functions for pronunciation scoring and stored as transcripts/scores in `speech_attempts`, `pronunciation_evaluations`, `mb_pronunciation_attempts` (`user-data-manifest.ts:90,82,60`). Raw audio is not persisted — only the scoring result. Deleted on account deletion.

#### Financial Info
| Data | Collected | Linked to user | Used for tracking |
|------|-----------|---------------|-------------------|
| Purchase history | **Yes** | Anonymized on deletion | No |
| Payment info | No (handled by Stripe/Apple IAP; never touches our server) | — | — |

- **Purchase history**: `payments`, `subscriptions`, `payment_transactions`, `apple_iap_events` (`user-data-manifest.ts:175,184,167,123`). `user_id` nulled on deletion; Stripe IDs and raw payloads scrubbed.

#### Health & Fitness
Not collected.

#### Location
Not collected. `profiles.country` is user-entered (optional), not device GPS.

#### Browsing History
Not collected.

---

### Data Used to Track the User (web only; iOS/Android: None)

**iOS and Android apps do NOT collect any tracking data.** The `initMarketingTracking()` function (`src/services/behaviorTrackingFlag.ts:156–175`) short-circuits with an early return on any Capacitor native platform — no consent check, no script injection, no tracker loaded. This satisfies the privacy-policy promise: "the iOS and Android apps do not use Clarity."

For the **web app** only:

| Tracker | Purpose | Consent gate | Script |
|---------|---------|-------------|--------|
| Google Analytics 4 | Usage analytics, conversion | Opt-out via Privacy toggle; opt-in default | `src/lib/tracking/ga4.ts:40–65`; `gtag.js` injected only when `VITE_GA4_MEASUREMENT_ID` set and consent granted; `anonymize_ip: true` (`ga4.ts:58`) |
| Meta Pixel | Ad attribution | Same opt-out gate | `src/lib/tracking/pixel.ts:53–100`; `fbevents.js` injected only when `VITE_FB_PIXEL_ID` set and consent granted |
| Microsoft Clarity | Session replay + heatmaps | Same opt-out gate | `src/lib/tracking/clarity.ts:50–90`; `clarity.ms/tag/…` injected only when `VITE_CLARITY_PROJECT_ID` set and consent granted |

**Consent mechanism**: `localStorage` key `mb_marketing_opt_out` (`src/services/behaviorTrackingFlag.ts:94`). UI toggle at Account → Privacy (`src/components/account/TrackingConsentPanel.tsx:108–114`). Default is tracking-ON (Vietnam + US markets; GDPR EU opt-in swap documented at `reports/a4-tracking-runbook.md`).

**ATT / App Tracking Transparency**: Not required. No tracking on iOS/Android. Apple's ATT requirement triggers only when apps track users *across apps/websites owned by other companies* on-device; MercyBlade iOS does none.

---

## Google Play — Data Safety Section

Fill each answer in the Play Console "Data safety" form as follows.

### Does your app collect or share any of the required user data types?
**Yes** (for the signed-in web app; see below).

### Data collected

| Category | Data type | Required? | How it's used | Encrypted in transit | User can delete? |
|----------|-----------|-----------|---------------|---------------------|-----------------|
| Personal info | Email address | Yes | Account + transactional email | Yes (HTTPS/TLS) | Yes (account deletion) |
| Personal info | Name | No (user-provided optional) | In-app personalisation | Yes | Yes |
| App activity | App interactions | Yes | Analytics, personalisation | Yes | Yes |
| App activity | In-app search history | No | — | — | — |
| Audio files | Voice/audio recordings (pronunciation) | Yes | Core feature: pronunciation scoring | Yes | Yes |
| Financial info | Purchase history | Yes | Subscription management, support | Yes | Anonymized (user_id nulled) |
| App info and performance | Crash logs | Yes (Sentry) | Bug fixing | Yes | Contact support |

### Is all of the user data collected by your app encrypted in transit?
**Yes.** All data is transmitted over HTTPS to Supabase (`supabase.co`) and Resend (`resend.com`). No plaintext HTTP endpoints.

### Does your app allow users to request that their data is deleted?
**Yes.** In-app: Settings → Account → "Xóa tài khoản" (Delete account). Confirmation required. Wipes all personal data in 4 passes and deletes the `auth.users` row. See checklist above for step-by-step evidence.

Deletion web link (for Play Console): `https://mercyblade.com/account` → Delete account section.

### Data shared with third parties

| Third party | Data shared | Why |
|------------|-------------|-----|
| Supabase | All user data (hosting) | Database + auth hosting |
| Stripe | Email, subscription events | Payment processing |
| Apple (IAP) | Transaction IDs, purchase events | In-app purchase processing |
| Resend | Email address | Transactional + marketing email |
| Google Analytics 4 | Anonymised usage events (web only) | Analytics; consent-gated |
| Meta Pixel | Conversion events (web only) | Ad attribution; consent-gated |
| Microsoft Clarity | Session replay (web only) | UX analytics; consent-gated |
| Sentry | Crash reports, session data | Error monitoring |

---

## Email Preferences (supplementary — for Play/App Store "marketing email" question)

Users have granular control over all non-transactional emails via `/account/notifications` (`src/pages/account/NotificationPreferences.tsx`).

| Flag | Default | What it gates |
|------|---------|---------------|
| `email_re_engagement_enabled` | true | Re-engagement emails after 7+ days inactive |
| `email_trial_expiry_enabled` | true | Trial ending/ended reminders |
| `email_weekly_digest_enabled` | true | Weekly summary (Mondays) |
| `email_streak_reminder_enabled` | true | Evening streak reminder if no practice |
| `email_weekly_progress_enabled` | true | Weekly progress recap |

One-click unsubscribe (all marketing/digest emails) at `/unsubscribe?token=<48-hex>` — no login required (`src/pages/Unsubscribe.tsx:75–89`).

Transactional emails (account confirmation, password reset, billing receipts) are always sent regardless of preferences.

---

## Notes for submission

- **iOS App Tracking Transparency prompt**: Not needed. iOS build has zero tracking scripts. No `NSUserTrackingUsageDescription` key needed in `Info.plist`.
- **Android permissions**: `RECORD_AUDIO` (pronunciation feature). `INTERNET`. No `AD_ID` permission (no advertising identifier used).
- **Kids mode**: Kids mode (`/kids`) has no analytics, no login, no third-party scripts. It is offline-capable after first play via Service Worker cache. No COPPA-relevant data collection for child users.
