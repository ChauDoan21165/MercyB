# MercyBlade — Project Notes & Outstanding Work

**Owner:** Chau Doan
**Repo:** /Users/admin/MercyB
**Domain:** mercyblade.com
**Supabase project:** buemdfxyhxunzpgdoqin
**User UUID:** 9957f25a-7b58-4a17-a3f2-4b91e63e69ae (admin level 10)
**Last updated:** 2026-04-26

This file tracks: known issues, deferred work, configuration tasks, and decisions that are pending. Update as you discover things or make decisions.

---

## 🚨 Known issues (investigated, fix deferred)

### Gmail self-sender dedupe (testing only, not production)

**Problem:** Trial-expiry emails from `admin@mercyblade.com` to `cd12536@gmail.com` get deduplicated by Gmail because mercyblade.com is routed via Cloudflare Email Routing back to the same Gmail. Gmail sees you sending to yourself and silently drops the duplicate.

**Impact:** ONLY affects testing with your own admin@mercyblade.com → cd12536@gmail.com flow. Real users get emails fine. This is a test-only issue.

**Workaround for testing:** Use a separate email account (any non-cd12536 Gmail, or Outlook/Yahoo/ProtonMail).

**Long-term fix (defer):** Switch FROM address to `noreply@mercyblade.com` (or `mercy@mercyblade.com`) in `supabase/functions/trial-expiry-emails/index.ts`. Requires adding the new sender as verified in Resend. ~30 min agent task.

---

### Trial-emails sending duplicate per invocation

**Problem:** Function reports `sent: 1` on each curl call, even when the user is the same. Need to verify if `email_sends_log` has a unique constraint preventing duplicates per user per stage. If not, when daily cron runs, users could receive the same D-1 email multiple times.

**To verify:**
```sql
SELECT * FROM email_sends_log
WHERE user_id = '9957f25a-7b58-4a17-a3f2-4b91e63e69ae'
ORDER BY created_at DESC
LIMIT 10;
```

If multiple `sent` rows for the same campaign+user exist → bug. Need a unique index on (user_id, campaign_type) where status='sent'.

**Status:** Not yet verified. Check tomorrow.

---

### Sentry not configured

**Problem:** `[sentry] disabled — VITE_SENTRY_DSN not set` in console. Skeleton wired but no DSN provisioned.

**Impact:** Production crashes only surface via user complaints. No analytics on errors.

**Fix:** A8 agent task ready to dispatch (in agent task list). Chau provisions Sentry account separately.

---

### `profiles.preferred_name` empty for own account

**Problem:** Trial email opened with "Chào bạn" instead of "Chào Chau" because preferred_name is null.

**Fix (run in Supabase SQL editor):**
```sql
UPDATE profiles
SET preferred_name = 'Chau'
WHERE user_id = '9957f25a-7b58-4a17-a3f2-4b91e63e69ae';
```

**Note:** Most users won't set this either. The "Chào bạn" fallback is acceptable for now.

---

## 🛠️ Configuration tasks (you, not agents)

### Resend / Email deliverability

- ✅ DKIM record verified
- ✅ SPF record verified
- ✅ MX record verified
- ✅ DMARC record set (`p=none` — monitoring mode)
- ⏳ **Gmail "Not Spam" mark** — click "Report not spam" on the trial-expiry email in your spam folder to teach Gmail this domain is legit
- ⏳ **DMARC tightening** — after a few weeks of clean sends, upgrade `p=none` → `p=quarantine` → `p=reject`
- ⏳ **Cron schedule for daily trial emails** — pg_cron at 09:00 UTC (16:00 ICT). Requires service-role JWT in Supabase Vault. Defer until tomorrow.

### Sentry

- ⏳ Sign up at https://sentry.io
- ⏳ Create project (React + Capacitor)
- ⏳ Copy DSN
- ⏳ Set Vercel env vars: `VITE_SENTRY_DSN`, `VITE_APP_ENV=production`, `SENTRY_AUTH_TOKEN`
- ⏳ Verify first error appears in dashboard

### App Store submission

- ⏳ Capture 5-7 screenshots per device class (iPhone 6.7", iPad 12.9", Android phone) per A6's shot list in `reports/app-store-submission-package-2026-04-26.md`
- ⏳ Add caption overlays to screenshots (Figma / Canva, copy from §6 of A6 report)
- ⏳ Provision demo reviewer account: `appstore-reviewer@mercyblade.com`, tier 2, seeded learning history (do NOT auto-create from code)
- ⏳ TestFlight verification: account deletion path + 3 screenshots
- ⏳ Verify "Restore Purchases" button visible on iOS
- ⏳ RevenueCat dashboard: subscription products configuration
- ⏳ Stripe products for web billing
- ⏳ Apple Developer Console: submit for review
- ⏳ Google Play Console: submit for review

### ElevenLabs TTS (after A5 ships)

- ⏳ Sign up at https://elevenlabs.io (Creator plan ~$22/mo)
- ⏳ Pick Vietnamese voice from Voice Library, copy voice_id
- ⏳ Pick English voice, copy voice_id
- ⏳ Update `src/config/mercyVoices.ts` with the IDs
- ⏳ Set `ELEVENLABS_API_KEY` in Supabase secrets
- ⏳ Toggle `elevenlabs_tts` feature flag to on

---

## 🎯 Strategic agent task list (A1-A9)

Dispatch in batches of 3 to avoid file conflicts. Priority order:

| # | Task | Status | Strategic value |
|---|---|---|---|
| A1 | Anonymous Supabase auth for instant Azure scoring | ⏳ Not dispatched | Highest — turns 12s magic moment into real Azure-powered demo |
| A2 | Zalo + Messenger + email floating support | ⏳ Not dispatched | Trust signal, ELSA differentiator |
| A6 | Daily 5-minute lesson card on Home | ⏳ Not dispatched | Engagement loop without notifications |
| A8 | Sentry crash monitoring | ⏳ Not dispatched | Must-have for launch operations |
| A9 | Referral system (revive worktree) | ⏳ Not dispatched | Viral acquisition completion |
| A3 | Public weekly leaderboard (opt-in) | ⏳ Not dispatched | Viral fuel, Vietnamese culture fit |
| A5 | ElevenLabs Vietnamese TTS | ⏳ Not dispatched | Perceived quality lift |
| A7 | IELTS Speaking content pack (20 topics) | ⏳ Not dispatched | High-intent vertical, monetization fuel |
| A4 | Mercy multi-turn conversation (revive 4 worktrees) | ⏳ Not dispatched | Largest scope, defer to v1.1 |

---

## ✅ Shipped today (2026-04-26)

| PR | Title | Impact |
|---|---|---|
| #148 | Per-phoneme tooltip | THE launch story feature |
| #150 | Facebook share card | Viral acquisition |
| #151 | Share-cards migration cleanup | Post-deploy fix |
| #152 | App Store launch blockers (bundle ID + /support + iOS payment) | Submission unblocker |
| #149 | Trial-emails wired to Resend | Trustworthy renewal funnel |
| #154 | Trial-emails schema fix (is_premium → tier) | Runtime fix |
| #155 | Trial-emails 3-day trial fix (drop D-3) | Correct funnel cadence |
| #146 | Privacy Azure Cognitive Services disclosure | Submission requirement |
| #147 | Privacy section 6 + RTBF cleanup | Hygiene |
| #153 | Onboarding "Try one word" card + anon CTA | Fast magic moment |
| #144 | Stop auto-redirect to placement, add Placement card | Home UX |
| #145 | Remove redundant top placement banner | Home UX |

---

## 🧠 Decisions made

| Decision | Why |
|---|---|
| Pricing: 200K/month, 2M/year, no lifetime | Half of ELSA's price, no lifetime to avoid undercutting recurring revenue |
| Use Facebook (220K followers) for share, NOT Zalo | Chau's distribution channel; share button targets Facebook |
| No staging environment | Cohort flag + sentinel + 5-second rollback adequate for solo dev |
| Mercy conversation work defers to v1.1 | Too big to ship cleanly in launch window; 2-4 week post-launch marketing beat |
| Push notifications deferred indefinitely | Facebook handles re-engagement; APNs/FCM complexity not worth it |
| 3-day trial (not 7-day or 14-day) | Decision made; templates updated to match |
| Drop D-3 email stage | For 3-day trial, D-3 fires on signup day; awkward; D-1 + D+1 cleaner |
| Bundle ID: com.chaudoan.mercyblade (both iOS + Android) | Aligned today via PR #152 |
| OAuth deep-link scheme stays com.mercyapps.mercyblade | Decoupled from bundle ID, registered with Supabase, changing breaks signin |

---

## 🚫 Decisions deferred

- Whether to extend trial from 3 days to 7 days based on launch data
- Whether to enable `azure_phoneme_scoring` feature flag globally vs cohort
- Whether to add anonymous Supabase auth (A1 task — leaning yes)
- Whether to ship Mercy conversation in v1.0 or v1.1
- Sentry sample rate for Performance monitoring (cost vs visibility)

---

## 📋 Open PRs (currently open as of last check)

- #131 — Yesterday's CI cleanup (separate, leave alone)

(Other PRs from today are all merged.)

---

## 🔑 Quick reference — useful commands

### Get admin JWT for testing edge functions
In browser console at mercyblade.com:
```js
const session = JSON.parse(localStorage.getItem('mb-supabase-auth-buemdfxyhxunzpgdoqin'));
copy(session.access_token);
```

### Test trial-expiry-emails function
```bash
ADMIN_JWT='paste_token_here'
curl -s -X POST "https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/trial-expiry-emails" \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Force-delete merged branches
```bash
cat /tmp/branches-to-delete.txt | xargs git -C /Users/admin/MercyB branch -D
```

### Verify worktree state
```bash
git worktree list
```

### Deploy edge function
```bash
supabase functions deploy <function-name> --project-ref buemdfxyhxunzpgdoqin
```

### Check Supabase secrets
```bash
supabase secrets list --project-ref buemdfxyhxunzpgdoqin
```

---

## 📝 How to use this file

1. **At the start of each work session:** read top to bottom
2. **When you discover a new issue:** add to "Known issues"
3. **When you make a decision:** add to "Decisions made" or remove from "Decisions deferred"
4. **When you ship a PR:** move from agent task list to "Shipped today/this week"
5. **When you complete a configuration task:** check it off
6. **At the end of each work session:** update "Last updated" at top

The goal is: never lose context, never re-discover something we already knew, never re-do a decision that's been made.
