# MercyBlade — Project Notes & Outstanding Work

**Owner:** Chau Doan
**Repo:** /Users/admin/MercyB
**Domain:** mercyblade.com
**Supabase project:** buemdfxyhxunzpgdoqin
**User UUID:** 9957f25a-7b58-4a17-a3f2-4b91e63e69ae (admin level 10)
**Last updated:** 2026-04-26 21:50

This file tracks: known issues, deferred work, configuration tasks, and decisions that are pending. Update as you discover things or make decisions.

---

## 🚨 Known issues (investigated, fix deferred)

### Gmail self-sender dedupe (testing only, not production)

**Problem:** Trial-expiry emails from `admin@mercyblade.com` to `cd12536@gmail.com` get deduplicated by Gmail because mercyblade.com is routed via Cloudflare Email Routing back to the same Gmail.

**Impact:** ONLY affects testing with your own admin@mercyblade.com → cd12536@gmail.com flow. Real users get emails fine.

**Workaround for testing:** Use a separate email account (any non-cd12536 Gmail, or Outlook/Yahoo/ProtonMail).

**Long-term fix (defer):** Switch FROM address to `noreply@mercyblade.com` in `supabase/functions/trial-expiry-emails/index.ts`.

---

### Anonymous auth would create runaway profiles rows

**Problem:** A1's audit found that `handle_new_user` trigger fires on every `auth.users` INSERT — including anonymous. At 1k visits/day = 30k anon profile rows/month. Real cost-explosion vector.

**Decision:** Ship anon auth dark (feature flag OFF) in the upcoming PR. Cleanup migration must land BEFORE the flag is flipped on. Per-IP rate limit also needed before flag-on (current 30/h is per user_id, bots cycling anon sessions can bypass).

**Status:** A1 will ship dark-default PR. Cleanup migration = follow-up PR. Per-IP rate limit = follow-up PR.

---

### Trial-emails sending duplicate per invocation

**Problem:** Function reports `sent: 1` on each curl call. Need to verify if `email_sends_log` has a unique constraint preventing duplicates per user per stage.

**To verify:**
```sql
SELECT * FROM email_sends_log
WHERE user_id = '9957f25a-7b58-4a17-a3f2-4b91e63e69ae'
ORDER BY created_at DESC
LIMIT 10;
```

**Status:** Not yet verified. Check tomorrow.

---

### Conversation cost cap not enforced

**Problem:** A4's audit found `$0.05` per-conversation OpenAI cap is logged via `logAiUsageEvent` but not enforced. Runaway conversation could cost real money.

**Status:** Agent dispatched to enforce as 402 Payment Required gate. Branch: `feat/conversation-cost-cap`.

---

### Sentry not configured

**Problem:** `[sentry] disabled — VITE_SENTRY_DSN not set`. Skeleton wired but no DSN.

**Fix:** A8 agent task ready. Chau provisions Sentry account separately.

---

### `profiles.preferred_name` empty for own account

**Problem:** Trial email opened with "Chào bạn" instead of "Chào Chau".

**Fix:**
```sql
UPDATE profiles
SET preferred_name = 'Chau'
WHERE user_id = '9957f25a-7b58-4a17-a3f2-4b91e63e69ae';
```

---

## 🛠️ Configuration tasks (you, not agents)

### Resend / Email deliverability

- ✅ DKIM record verified
- ✅ SPF record verified
- ✅ MX record verified
- ✅ DMARC record set (`p=none` — monitoring mode)
- ⏳ **Gmail "Not Spam" mark** — click "Report not spam" on the trial-expiry email in spam folder
- ⏳ **DMARC tightening** — after weeks of clean sends, upgrade `p=none` → `p=quarantine` → `p=reject`
- ⏳ **Cron schedule for daily trial emails** — pg_cron at 09:00 UTC. Requires service-role JWT in Supabase Vault.

### Supabase Auth (before flipping anon auth flag)

- ⏳ Enable Anonymous Sign-Ins: Supabase Dashboard → Authentication → Providers → Anonymous → ON
- ⏳ Apply 30-day cleanup migration (after A1's dark PR ships)
- ⏳ Apply per-IP rate limit (follow-up PR)
- ⏳ Flip `anonymous_auth_enabled` feature flag to true via admin panel

### Sentry

- ⏳ Sign up at https://sentry.io
- ⏳ Create project (React + Capacitor)
- ⏳ Copy DSN, set Vercel env vars: `VITE_SENTRY_DSN`, `VITE_APP_ENV=production`, `SENTRY_AUTH_TOKEN`
- ⏳ Verify first error appears in dashboard

### App Store submission

- ⏳ Capture 5-7 screenshots per device class per A6's shot list
- ⏳ Add caption overlays (Figma / Canva)
- ⏳ Provision demo reviewer account: `appstore-reviewer@mercyblade.com`, tier 2, seeded learning history
- ⏳ TestFlight verification: account deletion path
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

| # | Task | Status | Notes |
|---|---|---|---|
| A1 | Anonymous Supabase auth | ⏳ Awaiting "small" reply | Dark-default PR pending |
| A2 | Zalo + Messenger + email floating support | ⏳ Dispatched, working | |
| A3 | Public weekly leaderboard (opt-in) | ✅ Shipped (PR #156) | Migration applied |
| A4 | Mercy multi-turn conversation | ✅ Already shipped | PRs #89/#90/#97/#108 |
| A5 | ElevenLabs Vietnamese TTS | ⏳ Dispatched, working | |
| A6 | Daily 5-minute lesson card | ⏳ Dispatched, working | |
| A7 | IELTS Speaking content pack | ⏳ Awaiting "Path C" reply | Skeleton-only path |
| A8 | Sentry crash monitoring | ⏳ Needs re-dispatch | Got mis-pasted to A7 |
| A9 | Referral system | ⏳ Awaiting "fresh worktree" reply | Avoid A3's old worktree |
| Bonus | Conversation cost cap enforcement | ⏳ Dispatched, working | Branch: feat/conversation-cost-cap |

---

## ✅ Shipped today (2026-04-26)

| PR | Title | Impact |
|---|---|---|
| #148 | Per-phoneme tooltip | THE launch story feature |
| #150 | Facebook share card | Viral acquisition |
| #151 | Share-cards migration cleanup | Post-deploy fix |
| #152 | App Store launch blockers | Submission unblocker |
| #149 | Trial-emails wired to Resend | Trustworthy renewal funnel |
| #154 | Trial-emails schema fix (is_premium → tier) | Runtime fix |
| #155 | Trial-emails 3-day trial fix | Correct funnel cadence |
| #146 | Privacy Azure disclosure | Submission requirement |
| #147 | Privacy section 6 + RTBF cleanup | Hygiene |
| #153 | Onboarding "Try one word" card | Fast magic moment |
| #156 | Weekly public leaderboard | Viral fuel |
| #144 | Stop auto-redirect to placement | Home UX |
| #145 | Remove redundant top placement banner | Home UX |
| - | PROJECT_NOTES.md added | Operational continuity |

---

## ✅ Already shipped earlier (discovered today)

| PR | Title |
|---|---|
| #79 | Streaks v2 (freeze/vacation/insurance) |
| #89 | Mercy multi-turn threading |
| #90 | Mercy episodic memory |
| #97 | Mercy memory prompt slot |
| #107 | Vinglish-friendly Mercy mode |
| #108 | Mercy persona config |

---

## 🧠 Decisions made

| Decision | Why |
|---|---|
| Pricing: 200K/month, 2M/year, no lifetime | Half of ELSA's price, no lifetime to avoid undercutting recurring |
| Use Facebook (220K followers) for share, NOT Zalo | Chau's distribution channel |
| No staging environment | Cohort flag + sentinel + 5-second rollback adequate |
| Push notifications deferred indefinitely | Facebook handles re-engagement |
| 3-day trial (not 7-day) | Decision locked; templates updated to match |
| Drop D-3 email stage | For 3-day trial, D-3 fires on signup day |
| Bundle ID: com.chaudoan.mercyblade (both iOS + Android) | Aligned PR #152 |
| OAuth deep-link scheme stays com.mercyapps.mercyblade | Decoupled from bundle ID, registered with Supabase |
| Anonymous auth ships dark (flag OFF) first | Cleanup migration + rate limit needed before flag-on |
| IELTS Path C: skeleton-only, content TODO | Avoids copyright on Cambridge/IDP/British Council material |
| Mercy v1 (multi-turn + memory + persona) is launch-ready | Already shipped earlier — discovered via A4 audit |

---

## 🚫 Decisions deferred

- Whether to extend trial from 3 days to 7 days based on launch data
- Whether to enable `azure_phoneme_scoring` feature flag globally vs cohort
- When to flip `anonymous_auth_enabled` flag (after cleanup + rate limit ship)
- Sentry sample rate for Performance monitoring (cost vs visibility)
- IELTS sample answers source (licensed prep books vs IELTS examiner contractor)

---

## 📋 Open PRs (currently open)

- #131 — Yesterday's CI cleanup (separate, leave alone)
- (Active agent PRs land here as they open)

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

### Apply migrations to remote
```bash
supabase db push --linked
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
