# For Chau Study

A living reference of important lessons surfaced while building MercyBlade. New entries added at the top so the latest insight is first. Cross-referenced with the MercyBlade session work that produced each lesson.

---

## How to use this file

- Read top-down: newest lesson first.
- Each lesson has: **What it is** (the principle), **Why it matters** (the cost of getting it wrong), **MercyBlade example** (the concrete instance), **Action** (what you do about it).
- When you see something on a re-read that surprises you, write a note in the margin and bring it up in the next session.

---

## Lesson Index

1. [End-to-end critical-path test inventory (30 tests every serious app needs)](#1-end-to-end-critical-path-test-inventory)
2. [The "1 PR per concern" discipline](#2-the-1-pr-per-concern-discipline)
3. [Restore before redesign](#3-restore-before-redesign)
4. [Verify against current main, not stale audit notes](#4-verify-against-current-main-not-stale-audit-notes)
5. [Silent failures cost more than loud ones](#5-silent-failures-cost-more-than-loud-ones)

---

## 1. End-to-end critical-path test inventory

**What it is.** A serious production app has ~30 end-to-end tests that prove the whole journey works for real users — not just that individual functions compile. CI green ≠ user works. These are organized in tiers by user-impact severity.

**Why it matters.** Tonight's session shipped ~25 PRs of foundation work. Every unit test passed. Every type check passed. Every lint check passed. But until A79 (the user-journey smoke), zero tests proved a fresh new user could actually complete the signup → onboarding → first room → first feedback loop. Without end-to-end tests, you find out from a user tomorrow what an agent could have found tonight.

**The 30 tests, by tier:**

### Tier 1 — Money paths (silent failure = revenue loss)

1. **Signup → first paid conversion** — anonymous landing → account → Stripe checkout → entitlement granted → paid features unlocked.
2. **Subscription renewal end-to-end** — Stripe webhook fires on renewal → subscription updated → user keeps access.
3. **Cancellation → re-subscribe** — user cancels, sees correct period_end, returns later, can re-subscribe without orphan state.
4. **Refund / dispute handling** — Stripe dispute webhook → subscription downgraded → access revoked at correct time.

### Tier 2 — Account integrity (data loss = unrecoverable)

5. **Delete account fully removes data** — every table with user_id gets nulled or row-deleted; orphan FK references handled; storage objects purged.
6. **Password reset → login** — token email → reset → can log in with new password → old session revoked.
7. **Email change** — new email verification → old email no longer authenticates.
8. **MFA enroll / unenroll / recovery codes** — including recovery flow when phone lost.

### Tier 3 — Core product loop (the thing users came for)

9. **First-time user journey** — new user → onboarding → first room → first interaction → first feedback. (A79 in MercyBlade.)
10. **Returning user resume** — second login picks up where they left off (placement state, last room, progress).
11. **Cross-device continuity** — sign in on second device, state syncs.
12. **Offline → online recovery** — user loses connection mid-room, comes back, no data lost.

### Tier 4 — Communication channels (silent failure = users feel abandoned)

13. **Transactional email actually arrives** — welcome, verify, reset, receipt. Not just "API returned 200" but inbox-delivered.
14. **Cron emails actually arrive** — scheduled reminders, weekly progress.
15. **Push notifications deliver** — token registration → server send → notification appears on device → tap routes to correct in-app destination.
16. **Unsubscribe actually unsubscribes** — click email link → next cron skips that user.

### Tier 5 — Auth boundaries (security defects = breach)

17. **Anon can't read paid content** — RLS verified at the route level, not just SQL policy level.
18. **One user can't read another's data** — pick two test users, confirm strict isolation across every table.
19. **Expired session prompts reauth** — JWT expiry handled gracefully, not stuck in loop.
20. **Brute-force lockout works** — N failed login attempts → account locked → recovery flow.

### Tier 6 — Localization integrity (Vietnamese-first is your strategic pillar)

21. **Full VI journey** — same as #9 but every screen in Vietnamese, no English leak.
22. **Language toggle mid-session** — switch lang, in-progress content adapts, doesn't crash.
23. **Localized emails arrive in user's language** — actual email body native VI, not translationese.

### Tier 7 — Platform-specific (mobile is real)

24. **iOS native build → smoke run** — Capacitor loads, native SDK init fires, in-app purchase sheet opens.
25. **Android native build → smoke run** — same as iOS.
26. **Deep link from email opens correct in-app screen** — both platforms.
27. **App resume after backgrounding** — state preserved.

### Tier 8 — Resilience (degradation matters)

28. **Slow 3G smoke** — Vietnamese users often on this. Pages still functional, not just "loads eventually."
29. **Supabase outage handling** — DB unreachable for 60 seconds, app degrades gracefully, not crashes.
30. **AI provider outage** — Mercy guide unavailable, surface a graceful "try again" instead of broken UI.

### MercyBlade's current coverage as of May 19, 2026

- Tier 1 (4 tests): Some unit coverage from PRs #709, #715, #726. **Zero end-to-end.**
- Tier 2 (4 tests): PR #748 unit-tested aal=2 enforcement. **Zero end-to-end.**
- Tier 3 (4 tests): A79 dispatched tonight is the first ever. **3 of 4 missing.**
- Tier 4 (4 tests): Cron columns verified. **Inbox delivery never end-to-end tested.**
- Tier 5 (4 tests): RLS verified at SQL level (A32, A59). **No route-level end-to-end.**
- Tier 6 (3 tests): #737 fixes PhoneOtp leak. **No full VI smoke ever run.**
- Tier 7 (4 tests): A60 covered builds. **Zero real-device smoke this session.**
- Tier 8 (3 tests): None.

**Total: ~2 / 30 covered end-to-end.** This is normal for pre-launch apps. The honest gap matters because revenue and reputation start the day you launch.

**Action.** When you invest in test infrastructure (probably post-launch when you have revenue to defend), build out Tier 1 + Tier 2 first — those are the silent-failure-loses-money classes. Tier 3 is the user-experience layer; A79 starts it.

---

## 2. The "1 PR per concern" discipline

**What it is.** Every PR fixes one bug or ships one feature. Never bundle "fix bug + cleanup dead code + add tests + refactor naming" in the same PR.

**Why it matters.** When you bundle, the reviewer (you) has to evaluate everything at once. If one piece is wrong, the whole PR blocks. Small PRs land faster, surface bugs in isolation, and let you roll back surgically.

**MercyBlade example.** A1's 11-PR placement engine series. Each PR was one engine concern (theta estimator → item selector → terminator → session lifecycle → scoring → orchestrator → browser client → UI). Each landed cleanly on its own gates. If PR 8 had bundled scoring + UI + orchestrator, the latent contract bug A1 caught at the finish line (scoring.ts reading resp.correct from a stripped PublicItem) would have shipped silently in a 2000-LOC mega-PR.

**Action.** Default to splitting any PR > 300 lines or > 5 files. Ask "what is the one concern this PR addresses?" If you can't answer in one sentence, split it.

---

## 3. Restore before redesign

**What it is.** When a brief says "build a new system to do X," first check if the existing system already does X with a small gap. Fix the gap. Don't build a parallel system.

**Why it matters.** Parallel systems orphan the existing one. You end up with two implementations, neither owning the responsibility cleanly. Users hit the wrong one in unpredictable ways.

**MercyBlade example.** A31's PR #717 (email unsubscribe). My brief said "add a new email_unsubscribe_tokens table." A31 verified that PR #190 already shipped a permanent `profiles.email_unsubscribe_token` consumed by 3 wired functions. Building a new single-use table would have orphaned the existing system AND broken every email link already sent. A31 extended the existing token instead — restore-before-redesign — and added the missing per-category preferences in the same migration.

**Action.** Before dispatching any "build X" brief, grep for X in the existing code. If a partial implementation exists, the brief should be "extend X to cover Y" not "build new X."

---

## 4. Verify against current main, not stale audit notes

**What it is.** Audit reports go stale. The repo moves while audits sit in `/private/tmp/*.md`. Before acting on any audit finding, re-verify against the actual current state of `origin/main`.

**Why it matters.** Acting on a stale audit means shipping a fix for a problem that no longer exists, or worse, undoing work that was already done by someone else.

**MercyBlade example.** A21 stopped before coding when their brief said "lazy-load mercy-guide in AppRouter:27." A21 checked current main and found AppRouter:27 was actually `LessonUiLangToggle` (a type-only import worth 0 bundle bytes), and the supposed "39KB eager leak" had been closed by PR #636 long before. A21 saved a wasted PR by verifying first. Same pattern: A70 verified there's no `featureFlags.ts` file before "cleaning up" a non-existent flag system.

**Action.** Every agent dispatch should include "verify the brief's premises against current origin/main before coding. If stale, report and stop." This is now memory #23.

---

## 5. Silent failures cost more than loud ones

**What it is.** A system that returns "OK" when it actually failed is more dangerous than one that crashes loudly. Loud failures get fixed; silent ones run for months and cause invisible damage.

**Why it matters.** Users lose trust slowly without knowing why. You lose revenue without knowing why. Debugging is impossible because there's no signal.

**MercyBlade examples tonight:**
- **Stripe price_id MRR undercount** (PR #700): subscriptions worked correctly for users, but `billing_mrr_inputs_v` was LEFT JOINing on stale `provider_price_id`, so 3 live yearly subs matched nothing → ~6M VND/yr invisible in MRR dashboards. Months of orphan revenue if not caught.
- **mercy-feedback widget** (A12 thread, closed via #745): widget showed "thank you" UI on every submission. Every submission actually returned HTTP 500 with `supabase_not_configured`. Real feedback was being silently dropped for months — zero rows in `mercy_feedback_events` before tonight.
- **Email cron silent green** (A47's finding): both reminder crons returned HTTP 200 with `{ok:false}` because the migration columns didn't exist. CI watched the 200 and reported green forever. 0 emails sent.
- **configHealth Sentry leak** (A55 → A56 PR #740): config-failure paths were loading the 156KB Sentry chunk via raw `await import("@sentry/react")`, bypassing the route-gate. Worse, even when loaded, `initSentry()` was never called → no DSN → messages went nowhere. The "telemetry" feature was costing perf without delivering signal.
- **Stripe webhook `[object Object]`** (A57's finding): 4 subscription.deleted webhook failures in 30 days serialized errors as literal "[object Object]" — blinding you to actual subscription-cancellation bugs for ~2 weeks.

**Action.** Every place your code logs a result, ask: "if this silently returned wrong-but-passing, would I notice?" If no, add an assertion. Tests should specifically include negative cases that prove the failure mode triggers an alert.

---

## How to maintain this file

When something happens in a session that taught you a lesson — especially a foundation-level lesson, not a one-off fix — ask: "should this go in For Chau Study?" If yes, I add a numbered section at the top. Old lessons stay; the file grows over time.

Lessons worth adding (general criteria):
- A pattern that surprised you the first time you saw it
- A class of bug that almost shipped
- A discipline that prevented a class of bugs
- An architectural decision with reasoning future-you might forget
- A red flag pattern to watch for

Not worth adding:
- One-off fixes
- Project-specific implementation details (those go in code comments or STRATEGY.md)
- Things already covered by the 30 memory rules

---

*Last updated: May 19, 2026 — initial creation with 5 lessons from tonight's session.*
