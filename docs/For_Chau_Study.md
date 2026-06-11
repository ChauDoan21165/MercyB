# For Chau Study

A living reference of important lessons surfaced while building MercyBlade. New entries added at the top so the latest insight is first. Cross-referenced with the MercyBlade session work that produced each lesson.

---

## How to use this file

- Read top-down: newest lesson first.
- Each lesson has: **What it is** (the principle), **Why it matters** (the cost of getting it wrong), **MercyBlade example** (the concrete instance), **Action** (what you do about it).
- When you see something on a re-read that surprises you, write a note in the margin and bring it up in the next session.

---

## Lesson Index

16. [The FOLLOW-403 class — manual grants are invisible until they match the resolver's exact decision input](#16-the-follow-403-class--manual-grants-are-invisible-until-they-match-the-resolvers-exact-decision-input)
15. [When `du` and `df` disagree, look outside the repo](#15-when-du-and-df-disagree-look-outside-the-repo)
14. [Cron files must live on main](#14-cron-files-must-live-on-main)
13. [Test runners need ownership boundaries too](#13-test-runners-need-ownership-boundaries-too)
12. [Do not copy files in Finder inside the repo](#12-do-not-copy-files-in-finder-inside-the-repo)
11. [Stacked Silent Failures Compound, They Don't Combine Linearly](#11-stacked-silent-failures-compound-they-dont-combine-linearly)
6. [Fake-green tests are a failure class](#6-fake-green-tests-are-a-failure-class)
7. [Schema-as-written beats schema-as-assumed](#7-schema-as-written-beats-schema-as-assumed)
8. [Post-merge verification is not optional for critical changes](#8-post-merge-verification-is-not-optional-for-critical-changes)
9. [Agent ground-truth beats brief narrative](#9-agent-ground-truth-beats-brief-narrative)
10. [A recon doc is the commit, not the file](#10-a-recon-doc-is-the-commit-not-the-file)
1. [End-to-end critical-path test inventory (30 tests every serious app needs)](#1-end-to-end-critical-path-test-inventory)
2. [The "1 PR per concern" discipline](#2-the-1-pr-per-concern-discipline)
3. [Restore before redesign](#3-restore-before-redesign)
4. [Verify against current main, not stale audit notes](#4-verify-against-current-main-not-stale-audit-notes)
5. [Silent failures cost more than loud ones](#5-silent-failures-cost-more-than-loud-ones)

---

## 16. The FOLLOW-403 class — manual grants are invisible until they match the resolver's exact decision input

**What it is.** A 403 that looks like a permissions bug is sometimes correct behavior on an empty set. The entitlement resolver returns `is_premium:false` when the `subscriptions` table has zero matching rows — not because the gate is misconfigured, but because there is literally nothing to evaluate. If the grant row was never inserted, the correct answer IS false. The gate did nothing wrong.

**Why it matters.** "The grant exists" is a belief, not evidence. A manual grant applied via SQL can fail silently on any one of: wrong table, wrong `user_id`, wrong `app_id`, wrong `status` value, a `current_period_end` that is NULL, missing NOT NULL columns, or a column name typo (`subscription_id` vs `provider_subscription_id`). The resolver doesn't care how confident the brief was — it runs the query and returns what the query returns.

**MercyBlade example (FOLLOW-403 incident, 2026-06-11).** Test account `golden-premium@mercyblade.test` was supposed to have a paid subscription. It hit a 403 on the Mercy AI endpoint. The first theory was a buggy gate or a caching layer. A3 ran a service-role read and found **zero rows** in `subscriptions`, `user_subscriptions`, and `entitlements` (captured in `/Users/admin/reports/a3-follow403r2b-1445.json`). The resolver (`_shared/entitlement.ts:327–333`) hit the empty-set branch by design and returned `{"is_premium":false,"status":"inactive"}`. The 403 at `netlify/functions/api-mercy-ai.ts:164–166` (gate: `is_premium===true` OR `adminLevel>=9`) was firing correctly — there was nothing wrong with the gate. The v2 grant SQL had simply never landed in prod.

The first fix attempt also carried a hidden failure: it used the nullable `provider_subscription_id` instead of the required `subscription_id`, and omitted four NOT NULL columns — `customer_id`, `subscription_id`, `metadata`, `provider_metadata`. Postgres would have rejected the insert before any entitlement changed. Schema was verified via OpenAPI before the corrected SQL was produced:

```sql
INSERT INTO public.subscriptions
  (user_id, app_id, provider, customer_id, subscription_id, provider_subscription_id,
   status, current_period_end, metadata, provider_metadata, environment)
VALUES
  ('a1be10da-d601-46b3-ab08-a11d189aac19', 'mercy_blade', 'stripe',
   'cus_golden_test', 'sub_golden_test_2030', 'sub_golden_test_2030',
   'active', '2030-01-01 00:00:00+00', '{}'::jsonb, '{}'::jsonb, 'sandbox');
```

**Action.** Before diagnosing a 403 as "the gate is broken," confirm the grant actually exists. Capture **two** artifacts first: (1) the deployed resolver's actual query — file name and line number, not the brief's description of it; (2) the live decision input — the API's JSON response and the raw rows in the exact table the resolver queries. If the decision input is empty, the 403 is correct; fix the data, not the code. When writing a manual grant INSERT, cross-check every column against the current schema (OpenAPI or migration files) before running it — NOT NULL columns with no default will silently reject the whole row and leave the user unchanged.

---

## 15. When `du` and `df` disagree, look outside the repo

**What it is.** `du` answers "how much space does this directory tree use?" while `df` answers "how much space is left on the whole filesystem?" If `du -sh ~` does not explain the disk pressure that `df -h` shows, the missing space is probably outside the home tree or hidden in system-managed caches.

**Why it matters.** A repo cleanup can look successful while the machine is still almost full. Chasing only Git worktrees, `node_modules`, or build folders misses large Apple developer assets that live outside the project but still consume the same disk. The wrong cleanup command can also damage Xcode state.

**MercyBlade example.** The June 9 disk investigation found that the home directory totals did not match the filesystem pressure. The large silent consumer was under `/Library/Developer`, especially iOS simulator runtimes and dyld caches. These can quietly accumulate 30-40 GB even when the MercyBlade repo itself is not the main source of growth.

**Action.** When disk numbers do not add up, compare `df -h /` with targeted `du -sh` checks for `/Users`, `/Library/Developer`, `/Applications/Xcode.app`, and `/private/var`. For simulator runtimes, inspect with `xcrun simctl runtime list` and reclaim old unused runtimes with `xcrun simctl runtime delete <runtime-id>` or Xcode's platform manager. Never `rm -rf` simulator runtime internals by hand. Simulators can be redownloaded on demand, and App Store archive uploads do not need old local simulator runtimes.

---

## 14. Cron files must live on main

**What it is.** A file that a cron job, watchdog, deploy hook, or external scheduler reads must exist on the branch the scheduler actually checks out. A file that only exists in a feature branch, a local worktree, or a copied directory is invisible to the thing that runs later.

**Why it matters.** This failure looks like a mystery because the file is "right there" in one terminal, but the scheduler is looking at a different checkout. Branch switching can make the file appear or disappear without deleting it. If the missing file controls a backup, reminder email, health check, or reaper, the job may fail silently or skip the exact protection it was supposed to provide.

**MercyBlade example.** The June 9 operations pass depended on cron/watchdog files being present on `main`, not just in an agent branch. The dangerous version of the mistake is: an agent creates or edits a cron input file on `a3/some-fix`, verifies it locally, then Chau or another agent checks out `main` and the file vanishes. Nothing was deleted; Git simply showed the truth for that branch. Any cron that runs from `main` now cannot see the file.

**Action.** Treat cron-read files like production code: land them on `main` before relying on them. When a file "disappears," first run `git branch --show-current`, `git status --short`, and `git log --all -- <path>` before recreating it. If the file exists only on another branch, merge or port it deliberately; do not copy it by hand and create a second source of truth.

---

## 13. Test runners need ownership boundaries too

**What it is.** A test file's name and directory decide which runner owns it. Playwright and Vitest can both see TypeScript under `tests/`, but they do not execute it the same way. A Playwright file named like a normal `.spec.ts` can be collected by Vitest, where Playwright's `test()` API is invalid.

**Why it matters.** A new CI lane can be correct in isolation and still break an unrelated shard. That is a confusing failure: the Playwright job passes, but the regular unit-test job fails before assertions run. The fix is not a code change to the product; it is a test ownership boundary.

**MercyBlade example.** MR !641 added a dedicated Playwright performance-budget lane: route DOM interactive under 4 seconds on a throttled profile, and main entry bundle under 250 KiB gzip. The first version used `tests/perf-budget/perfBudgets.spec.ts`. Playwright passed locally and in CI, but Vitest shard `test 1/2` also collected the file because Vitest includes `**/*.{test,spec}.*`. Vitest then failed with "Playwright Test did not expect test() to be called here." Renaming the file to `perfBudgets.pw.ts` and setting Playwright `testMatch` to `*.pw.ts` made ownership explicit: Playwright still ran the budget tests, and Vitest ignored them.

**Action.** When adding a new test runner lane, pick a runner-specific suffix and a dedicated config on day one. For Playwright-only specs under shared test roots, use a suffix like `.pw.ts` and set the Playwright config's `testMatch` accordingly. Always run a quick negative ownership check too, such as `npx vitest run --passWithNoTests tests/perf-budget`, to prove the wrong runner cannot collect the file.

---

## 12. Do not copy files in Finder inside the repo

**What it is.** Finder copy/paste creates duplicate filenames like `index 2.ts`, `file (1).png`, or even names with trailing spaces. Git tracks those as real files, not harmless desktop clutter.

**Why it matters.** Duplicate files can be deployed, uploaded, or matched by broad scripts even when the app never imports them. A trailing-space filename is especially hard to see in reviews and terminals.

**MercyBlade example.** The June 9 cleanup found root `index 2.ts` / `index 5.ts`, a tracked `public/guide.png ` with a trailing space, and duplicate kids media files named `p2_023_come_here (1).*`. None belonged in production source; the audio upload manifest even had duplicate `(1)` entries next to the clean filenames.

**Action.** Never duplicate files in Finder inside the repo. If you need an experiment, make a branch or use `/tmp`. Before adding media, run `git status --short` and look for names ending in spaces, ` (1)`, or numbered copies.

---

## 11. Stacked Silent Failures Compound, They Don't Combine Linearly

**What it is.** Two independent bugs in the same code path don't add — they multiply. Each one masks the other's signature, so the surface symptom looks like one small fault while the real failure is the product of both. Fixing the bug you found leaves the system still broken, and the remaining bug now has *no* visible signature at all, because the act of removing its partner deleted the only evidence it existed.

**Why it matters.** The single-bug mental model is the default, and it is wrong precisely in the code paths that have no test coverage — money paths, edge functions, redemption flows. You fix the obvious bug, the loud symptom disappears, you close the ticket believing it's done. The stacked bug keeps running silently for months. The compounding is the danger: two "harmless" bugs that each pass review can, together, deny paid features to paying users through a path that looks like it works on every read.

**MercyBlade examples tonight:**
- **Period-end field-order + frozen freshness marker** (B5/B11 found the field-order bug; B12 variant B found the stacked one). The period-end field-order bug and a freshness marker frozen at the *same* subscription-period boundary share one root cause but produce two different visible signatures. The second signature would have been missed entirely if B12 had run only my dispatch's narrower query — the broader query is what separated the two faults from one symptom.
- **`profiles.tier` never written + edge functions read it numerically** (B5 found the unwritten column; B17 found the type mismatch). Billing never writes `profiles.tier`, and the edge functions read `tier` as a number off what is actually a text column. *Neither bug alone causes user-visible harm* — an unwritten column is just a default, a type coercion on a never-populated field is a no-op. Stacked, they deny paid features to paying users via a dead-code path that reads green on every probe.
- **`redeem-gift-code`: dropped flag + CHECK rejection + swallowed error** (B22). Three layers stacked: the redeem path drops `is_gift_redemption` from the input (silent input bug), the CHECK constraint then rejects the row (schema rejection), and the function still returns `ok:true` (error swallowing). Any one layer alone is recoverable; all three together make a failed redemption indistinguishable from a successful one for both the user and the logs.

**Action.** When diagnosing a known bug, *assume a second bug is stacked behind it.* In code paths with no test coverage, the single-bug hypothesis is wrong more often than right. Two practical consequences: (1) never narrow the diagnostic query to just the reported symptom — widen it enough to surface a second, independent signature; (2) re-verify the path end-to-end *after* the first fix lands, because removing bug A frequently erases the only evidence of bug B.

---

## 6. Fake-green tests are a failure class

**What it is.** A test that passes without asserting the thing it appears to cover. The suite is green and the coverage number looks healthy, but nothing is actually locked. Counting tests is not counting coverage.

**Why it matters.** A green suite that proves nothing is worse than no suite — it buys false confidence. You stop looking at the area it "covers" because the dashboard says it's safe, and a regression walks straight through.

**MercyBlade examples tonight:**
- **No-op assertions** (A74, PR #752): four `expect(true).toBe(true)` assertions sat in the navigation tests. They passed on every run and proved nothing about navigation.
- **Shape tests masquerading as behavior locks** (A80): `mercyPersona.test.ts` had 32 passing tests. Classifying them showed only 2 actually locked register/identity. The other 30 were array-shape and pure-function checks that would have stayed green through the exact #690-class persona drift that PR #736 had to revert.

**Action.** When you review test coverage, classify by what each test actually asserts, not by the count. A 32-test file is worth its number of real behavioral locks — here, 2. The `fake-green-test` label (created A92) exists to triage this class; apply it whenever you find a test that cannot fail for the reason it claims to exist.

---

## 7. Schema-as-written beats schema-as-assumed

**What it is.** A brief sketched from memory or a stale audit note will get the database shape wrong. The only authority is the current migration files.

**Why it matters.** Designing a fix around an imagined column means the fix is wrong before the first line is written — and if it ships, it silently breaks the columns that actually exist.

**MercyBlade examples tonight:**
- **system_logs** (A72, SECDEF wrappers): the brief sketched `log_system_event(category, level, message, metadata)`. The real table has no `category` column — scope lives in `metadata->>'scope'` — while `route` and `user_id` are first-class columns admins query. A72 reconciled against the real schema and preserved `route` + `user_id`, avoiding exactly the telemetry regression A59 had flagged on PR #744.
- **stripe_webhook_events** (A77): the task assumed `status='canceled'`/`'incomplete'`. The real enum is `active` / `trialing` / `expired` / `revoked`, with cancellation expressed as `canceled_at`.

**Action.** A dispatched agent must read the current migration files before accepting any schema shape the brief asserts. If the brief and the migration disagree, the migration wins — and the divergence goes in the report.

---

## 8. Post-merge verification is not optional for critical changes

**What it is.** The GitHub "Merged" badge is not proof the change reached `origin/main`. A squash commit can fail to land even while the UI reports success.

**Why it matters.** You believe a critical fix is live, the next deploy is built from a main that never received it, and the gap stays invisible until it costs you in production.

**MercyBlade example.** PR #714 (A33's first Sentry sourcemap CI wiring) showed MERGED on GitHub, but the squash commit never reached `origin/main` — `production-deploy.yml` had zero Sentry references after the "merge." It was re-landed via PR #723 only because A33 verified with `git log origin/main -- <file>` instead of trusting the badge. Stacked-PR chains share this failure mode: squash-merging the base orphans the children even when GitHub shows them merged.

**Action.** For any PR touching CI, env, a money path, security, or a migration, run `git log origin/main -- <changed-file>` immediately after clicking merge. Confirm the change is on main before assuming the deploy will carry it.

---

## 9. Agent ground-truth beats brief narrative

**What it is.** Briefs are written from notes that may be stale. The dispatched agent reads the actual current main. When the two disagree, the agent's read is the one that's true.

**Why it matters.** Forcing an agent to execute a brief it has already proven wrong ships the brief's mistake. The whole point of dispatching someone who verifies first is lost if divergence is punished instead of trusted.

**MercyBlade examples tonight:**
- **A31 (PR #717):** the brief asked for a new `email_unsubscribe_tokens` table; A31 found PR #190 had already shipped a permanent token column on `profiles` with 3 wired functions. A new table would have orphaned the existing wiring.
- **A80 register tests:** the brief said the tests already covered the persona drift; A80's classification showed only 2 of 32 actually locked register/identity.
- **A77 webhook attribution:** the brief asked for `[object Object]` orphan-user detection, but the table strips the payload. A77 had to invent an attribution method — Stripe period-end timing against `public.subscriptions` — that the brief could not have specified.
- **A96 webhook forensics:** the brief framed the problem as "the table is too thin." A96 corrected it: the table is deliberately thin on the error path, because persisting on the primary key blocks Stripe's legitimate retry (the N4 idempotency bug). The fix had to be a separate append-only table, not a column added to the existing one.

**Action.** When an agent reports the brief was wrong and explains why, default to trusting them. Reward the correction; don't punish divergence that arrives with evidence.

---

## 10. A recon doc is the commit, not the file

**What it is.** A diagnostic dispatch produces a verdict. That verdict only becomes durable evidence when it is written to a uniquely-named file *and committed to the branch*. Writing the file is not enough — an uncommitted file dies with the worktree exactly like a raw JSON dump.

**Why it matters.** When the verdict is lost, the next agent sent to the same question re-runs the entire investigation from scratch. The diagnostic cost is paid twice, and the second agent may reach a different conclusion with no record of why the first one disagreed. Recon is the most reusable work an agent does and the easiest to throw away.

**MercyBlade examples tonight:**
- **A77 (webhook attribution):** left only two raw JSON data dumps and probe scripts in its `/private/tmp` worktree, no markdown. The worktree was pruned; **A94 had to redo half the webhook-attribution work** to recover what A77 already knew.
- **B5 (`mylinh paid-but-free`):** ran a full diagnostic entirely in the terminal. Nothing on disk, nothing committed — when the worktree is pruned the whole investigation is gone.
- **A91 / B7 (the subtle trap):** *did* write well-named docs (`RECON-monotonic-concurrent-modification-A91.md`, `reports/SCOPING-money-path-…md`). Both were still **uncommitted working files** (`git status` → `??`). A good filename with no commit is exactly as ephemeral as A77's JSON.
- **A91 / A96 done right:** suffixed, in-`reports/`, structured (Verdict → Evidence → Root cause → Impact → Fix → Worktree disposition) — the pattern the convention now codifies.

**Action.** Every diagnostic dispatch writes `reports/RECON-<topic-slug>-<agent-id>.md` with the six required sections and **commits it to the agent's branch** (no PR — recon is exploration, not production; draft PR only if the recon is the spec for a follow-up build). The dispatch report states the path *and the commit SHA*. Full convention: `docs/agent-briefs/recon-doc-convention.md`.

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

*Last updated: June 11, 2026 — 16 lessons total; 16 from the June 11 FOLLOW-403 investigation, 12–15 from the June 9 operations/file-cleanup pass, 11 from the May 19 evening session, 6–10 from the May 19 hardening wave, 1–5 from initial creation.*
