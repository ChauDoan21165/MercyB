# MercyBlade — Product Plan

**Last updated:** May 10, 2026  
**Project:** Mercy Blade Real (`buemdfxyhxunzpgdoqin`, Mumbai)  
**Repo:** /Users/admin/MercyB  
**Admin:** Chau Doan — cd12536@gmail.com / chaudoanproton@proton.me

---

## What MercyBlade Is

English learning app for Vietnamese users. Core features: structured lessons (A1→C2, 536 lessons), VSTEP exam prep (Listening/Reading/Writing/Speaking), pronunciation practice, mock interviews, vocabulary SRS, placement test, gift code subscriptions.

Subscription tiers:
- Free (tier id: e50f166d-...) 
- One Month (vip1)
- One Year (vip9, tier id: a2863250-...) ← gift codes use this

---

## Current State (as of May 10, 2026)

### Recently shipped (last 48h)
- ✅ Gift code redemption — full flow working (PRs #355, #358, #361, #362, #363, #364, #365)
- ✅ Magic link → OTP 6-digit code auth flow (PR #357)
- ✅ Sign-in page UX — email-code default, VI-first heading (PR #359)
- ✅ AbortError lock-steal crash fix (PR #360)
- ✅ Sentry bundle split — vendor −155 KiB gzip (PR #356)
- ✅ Custom SMTP via Resend — noreply@mercyblade.com, branded sender

### Known bugs / backlog
- ⚠️ Admin INSERT RLS bug — /admin/access-codes UI can't create codes via frontend (workaround: SQL Editor). Root cause: frontend JWT not reaching auth.uid() at INSERT time. Undiagnosed.
- ⚠️ Migration drift — ~150 migrations on disk, some future-dated, CLI state diverged from production. Needs formal reconciliation.
- ⚠️ Hard refresh in Safari private window shows only marketing panel (layout bug, low priority)
- ⚠️ Gift code redeem dialog — no success message shown after redemption (closes silently)
- ⚠️ "This access code has been fully redeemed" vs "You have already redeemed" — copy could be friendlier
- ⚠️ Netlify noise — 8 failing checks per PR from 2 stale Netlify projects (cosmetic, not blocking)
- ⚠️ Legacy vip_key / tier column on profiles — schema drift, should read from user_subscriptions
- ⚠️ user_subscriptions vs subscriptions table schism — gift codes write to legacy table, me-entitlement now bridges both but underlying drift remains
- ⚠️ a11y — tablist/aria-selected missing on sign-in tab strip and email/phone tabs

---

## Sprint 1 — Retention Foundation (this week)

Goal: keep the real users Chau just gifted codes to from going inactive in 48 hours.

### 1. Weekly progress email
**What:** Every Monday, each user gets an email showing: lessons completed that week, streak, pronunciation score trend, one encouraging sentence (VI-first bilingual).  
**Stack:** Resend (already configured) + new Edge Function `weekly-progress-email` + cron trigger (Supabase pg_cron or GitHub Actions).  
**Owner:** Tui 1 (has done email Edge Functions before — trial emails, alert emails).  
**Status:** Not started.

### 2. Streak notification
**What:** Daily email or push at the user's usual study time — "Bạn đang có streak X ngày! Đừng để mất hôm nay." Triggers when user hasn't opened the app by their usual hour.  
**Stack:** Resend + Edge Function + user activity timestamps.  
**Owner:** Tui 1 alongside weekly email.  
**Status:** Not started.

### 3. Personalized gift welcome email
**What:** When a gift code is redeemed, send a warm welcome email: "Chào mừng bạn đến với MercyBlade! Bạn vừa nhận được 1 năm học tiếng Anh miễn phí." Triggered by the redeem-access-code Edge Function post-redemption.  
**Stack:** Resend + update to redeem-access-code Edge Function.  
**Owner:** A1 (owns redeem-access-code).  
**Status:** Not started.

---

## Sprint 2 — Growth Surface (next week)

### 4. Gift code sharing page
**What:** mercyblade.com/gift/CODE — beautiful landing page showing "Chau tặng bạn 1 năm học tiếng Anh." One-click Redeem button. No copy-paste needed.  
**Stack:** New route in frontend, reads access_codes table publicly (anon RLS).  
**Status:** Not started.

### 5. Certificate sharing
**What:** When user completes a VSTEP level, generate a shareable certificate image. User posts to Zalo/Facebook/LinkedIn. Free acquisition loop.  
**Stack:** Canvas/SVG certificate generation, Supabase Storage for image hosting.  
**Status:** Not started.

---

## Later (validate with more users first)

- **Zalo Mini App** — daily vocabulary review inside Zalo. Requires Zalo developer account + approval.
- **Parent dashboard** — weekly child progress report for parents paying for kids' English.
- **AI pronunciation coach** — record → compare to native → specific feedback. Infrastructure exists.
- **"Bạn bè đang học"** — social proof count on lessons. Needs concurrent user volume.
- **Placement test → locked learning path** — auto-route user to correct level after test.

---

## Agent Roster

| Agent | Type | Strengths | Watch out for |
|-------|------|-----------|---------------|
| A1 | Claude | Rigorous, scoped, never skips diagnosis, won't ship no-ops | Slower, thorough |
| A2 | Claude | Performance/bundle work, good diagnostics | — |
| A3 | Claude | Auth flows, bilingual copy, test coverage | — |
| Tui 1 | DeepSeek | High output, content/curriculum work, email infra | Scope creep, skips details, needs tight briefs |
| Tui 2 | DeepSeek | Solid diagnosis, respects scope | Committed directly to main once (corrected) |

**Brief rules for DeepSeek agents (Tui 1, Tui 2):**
- Always say "Diagnose first, report back, wait for approval, then code"
- List files they MAY and MUST NOT touch explicitly
- VI-first bilingual on every user-visible string
- One PR, one concern
- No real-device testing — Chau does that

---

## Tech Stack Reference

- **Frontend:** React + Vite + Tailwind + Capacitor (PWA + iOS/Android)
- **Backend:** Supabase (Postgres, Edge Functions Deno, Storage, Auth)
- **Auth:** Email OTP (6-digit code), Apple/Google/Facebook OAuth, Phone OTP
- **Email:** Resend — noreply@mercyblade.com, SMTP via smtp.resend.com:587
- **Error tracking:** Sentry (lazy-loaded, not on critical path)
- **Deployment:** Vercel (frontend), Supabase (backend)
- **CI:** GitHub Actions + Vitest (5,682 tests across 284 files as of May 10)

---

## Key IDs (production)

- **Supabase project:** buemdfxyhxunzpgdoqin (South Asia / Mumbai)
- **Admin user:** 9957f25a-7b58-4a17-a3f2-4b91e63e69ae (cd12536@gmail.com)
- **One Year tier:** a2863250-1798-443e-b1d3-d20e3db06281 (vip_key: vip9)
- **Free tier:** e50f166d-c3dd-41b8-bdb4-c0a8ca58b35d
- **Auth storage key:** mb-supabase-auth-buemdfxyhxunzpgdoqin

