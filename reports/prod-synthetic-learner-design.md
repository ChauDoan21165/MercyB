# Tier 3 — Prod Synthetic Learner (design doc)

**Status:** DESIGN ONLY. No build, no account creation, no cron install until Chau approves this doc.
**Branch:** `c4/prod-synthetic-learner-design` · **Author:** C4 · **Date:** 2026-07-10

## Why this tier exists

SL-001 (Tiers 1–2) is deliberately **isolated** — it runs against a test project or a
local build, with mocked externals, so it can never touch real users or real data.
That isolation is correct, but it means SL-001 is structurally blind to a whole class
of bug: **the app is fine, the deploy/config is not.** Two such bugs were found by hand
today, both invisible to SL-001:

1. **Sink flag absent from Cloudflare env** — `VITE_LEARNING_EVENT_SINK_ENABLED` was not
   set on the Cloudflare Pages production env. Feedback taps looked fine (the "✓ Đã ghi
   nhận · Recorded" label showed) but **no row ever reached `learning_events`.** The code
   was correct; the *deployed build's* inlined flag was false.
2. **Sign-in bounce** — a redirect-loop regression that only manifests on the real
   production auth/redirect wiring.

Neither reproduces in isolation, because both are properties of the **real production
deploy** (Cloudflare env vars, real auth redirects, real edge cold-starts), not of the
code under test. Tier 3 closes that gap: **one dedicated synthetic learner drives real
production and asserts the observable outcomes a real learner would get.**

Tier 3 is the *only* tier that runs against real prod. It is small, single-account, and
read-only except for the taps a journey requires.

---

## 1. Journey list v1

Each journey is a hard pass/fail check against `https://mercyblade.com` using a real
browser (Playwright), driven as the synthetic learner. Anchors are real, current
selectors on `origin/main` (= the live deploy, hash `12ff73c`).

| # | Journey | Concrete check | Pass criteria | Which hand-found bug it would catch |
|---|---------|----------------|---------------|--------------------------------------|
| a | **Sign-in completes, no bounce** | Sign in via `/signin` (password path) as the synthetic account | Final URL is **not** `/signin` (and not `/login`); an authenticated element renders; no redirect loop | Sign-in bounce |
| b | **"Sửa câu" renders a correction** | On `/ai-tutor`, grammar mode ("Sửa câu", `src/pages/AiTutor.tsx:1053`), submit a sentence with a seeded error | A correction card renders **and** exposes the feedback buttons (`data-testid="correction-feedback-helpful"` / `-not-helpful`, `CorrectionFeedbackButtons.tsx`) | Tutor/correction rendering regressions |
| c | **Feedback tap shows the visible label** | Tap `correction-feedback-helpful` | `data-testid="correction-feedback-thanks"` → **"✓ Đã ghi nhận · Recorded"** becomes visible (`CorrectionFeedbackButtons.tsx:120-127`) | UI acknowledgement regressions |
| d | **Feedback row lands in `learning_events`** | After the tap, poll the DB for the row | Within **60 s**, a `learning_events` row exists for the synthetic `user_id` with `event_type ∈ {feedback_helpful, feedback_not_helpful}` **and non-null `rule_or_detector_id`**, `created_at` after the tap | **Sink flag absent** — the exact bug from today |
| e | **placement-v3-session returns (no ERR_FAILED)** | Start a placement-v3 session (drives the `placement-v3-session` edge fn) | An HTTP response is received (any status) — **never** `net::ERR_FAILED` / a dropped request; latency recorded | placement-v3 cold-start / gateway drop (BUG-2026-07-09) |
| f | **Version endpoint matches expected deploy** | `GET /version.json` | `.hash` equals the **expected** deployed SHA (see §4 "expected deploy" source) | Stale/failed deploy, wrong bundle live |

**Why (c) and (d) are separate — this is the crux of the whole tier.** The
"✓ Đã ghi nhận" label is **optimistic UI state**: `vote()` sets `locked` and *queues* the
event to localStorage (`CorrectionFeedbackButtons.tsx:61-76`), then returns. The durable
write to `learning_events` happens later, in the flag-gated sink
(`src/lib/learning/eventSink.ts`). So the label (c) can pass while the row (d) never
lands. **(c) alone is a false green; (d) is the real signal.** See §5.

**Journey (d) DB read uses the synthetic account's own session** — `learning_events` RLS
has a `select_own` policy (`user_id = auth.uid()`, migration
`20260708000000_learning_events.sql:52-56`), so the runner reads back its own row with the
same JWT it signed in with. **No service-role key is required for the happy path.** (A
service key is optional, admin-host-only, for the account-teardown/cleanup step — see §3.)

**Seeded correction input (journey b):** the submitted sentence must reliably trigger a
correction that carries a real `rule_or_detector_id` (the provenance constraint rejects a
`feedback_%` row with a null id). The runner uses a fixed L1-Vietnamese error sentence
known to fire a rule/detector; if a build ever renders **no** buttons (null-provenance
correction), journey (b) fails loudly rather than silently rating nothing.

---

## 2. Synthetic account plan + exclusion convention

### 2.1 The account
- **One** dedicated account, e.g. `synthetic-learner@mercyblade-synthetic.test` (a domain
  that can never be a real user). Created once, manually, by Chau on approval — **not** by
  an agent, **not** self-signed-up (prod signup is 6-digit email OTP; see SL-001 addition).
- It is a normal `profiles` row + `auth.users` row, so it flows through the real app
  exactly like a learner — which is the point. That also means **it leaks into every
  learner metric unless we exclude it.**

### 2.2 The exclusion convention (NEW — none exists today)
The codebase has **no** `is_test` / `is_synthetic` / allowlist convention today (verified).
We invent one, single-source-of-truth:

- Add **`profiles.is_synthetic boolean not null default false`** (migration, human-applied).
  Set `true` for exactly the synthetic account.
- Add one reusable predicate so consumers don't each hand-roll the filter:
  `public.is_synthetic_user(uid uuid) returns boolean` (or a
  `public.synthetic_user_ids` view). Every aggregate excludes with
  `... where not public.is_synthetic_user(user_id)` (or `NOT IN (select id from
  synthetic_user_ids)`).
- **Metric-critical invariant:** the synthetic `user_id` must be excluded **before** any
  `COUNT`, `COUNT(DISTINCT user_id)`, rate, funnel, cohort, or leaderboard rank.

### 2.3 Every consumer that MUST exclude the synthetic account
`learning_events` has **zero aggregate readers today** — its only reader is the per-user
RLS `select_own`, so the synthetic rows are invisible to everyone except the account
itself **right now**. The leak is therefore through **`profiles`/`auth.users` counters and
the feedback surfaces**, plus one **forward-looking** hook on `learning_events`. All of
these currently exclude nothing.

**SQL — views / RPCs / refreshers** (`supabase/migrations/`):
- `20260427000000_admin_analytics_views.sql` — `v_analytics_user_funnel` (L83) + RPC
  `get_user_funnel`; `v_analytics_daily_active_users`, `v_analytics_feature_usage_7d`,
  `v_analytics_room_popularity` (+ their RPCs).
- `20260535000000_cohort_retention.sql` — `get_conversion_funnel()` (signed_up/paid from
  `profiles`), `get_behavioral_metrics()` (new signups + DAU).
- `20260425165003_compounding_analytics.sql` — `v_analytics_user_cohorts`,
  `v_analytics_cohort_retention_daily`, **`v_analytics_l1_rule_effectiveness` (L129; its
  comment L186-187 marks it as the *intended future reader of
  `learning_events.rule_or_detector_id`* — wire the exclusion here when that migrates)**,
  `v_analytics_weakness_trends_weekly` (+ RPCs).
- `20260517000000_weekly_digest_aggregates.sql` — `refresh_weekly_digest()` →
  `total_unique_active_users_this_week` (feeds a **public** number, see client below).
- `20260429000000_leaderboard_weekly.sql` — `leaderboard_weekly_top10()` /
  `leaderboard_weekly_my_rank()` (synthetic could appear on the leaderboard).
- `20260512000000_referral_engagement_gate.sql` — `referral_owner_grants_in_year()`.
- Feedback aggregates: `daily_feedback_summary` view (on `feedback`, latest def
  `20251206055533_*`); `mercy_feedback_prompt_summary` (helpful/unhelpful rate on
  `mercy_feedback_events` — see revoke migration `20260622000000_*:48`). Grouped by
  prompt/model, but underlying rows carry `user_id`, so synthetic thumbs skew the rate.

**Edge functions** (`supabase/functions/`): `admin-stats` (`totalUsers` via
`auth.admin.listUsers` + `profiles`), `system-metrics` (`usersCount` from `profiles`),
`cohort-retention-aggregator` (writes `cohort_retention_daily` from all `profiles`),
`weekly-digest-email` + `parent-weekly-digest` (recipient enumeration + per-learner
counts), `admin-list-users`, `admin-list-registered-users`.

**api/** — `api/mercy-feedback.ts` (producer of `mercy_feedback_events`; the synthetic
account must not thumbs-vote in a way that feeds the helpful-rate — or those rows must be
excluded).

**Client** (`src/`) — render server aggregates that include the synthetic profile:
`hooks/admin/useAdminStats.ts`, `pages/admin/AdminAnalyticsPage.tsx`,
`pages/admin/BehavioralAnalytics.tsx`, `pages/admin/RetentionDashboard.tsx`,
`components/admin/widgets/AdminStatsStrip.tsx`, `lib/admin/cohortRetention.ts`,
`lib/admin/engagementInsights.ts`, `lib/analytics/cohortRetention.ts`,
`lib/analytics/dataMoatReport.ts`, `lib/placement/v5/adminObservability.ts`, and — most
sensitive — **`src/pages/blog/WeeklyDigest.tsx`** (a **public** marketing page rendering
`total_unique_active_users_this_week`: "N người Việt luyện Anh tuần này"). Synthetic
activity must never inflate that public number.

**Because the exclusion touches ~25 consumers, the build phase adds the single
`is_synthetic` predicate first and threads it through each, with a guard test asserting
the synthetic `user_id` is absent from each aggregate's output.** This is the largest
build-side work item and the reason the doc lands before any code.

---

## 3. Credential handling

- The synthetic account's password (and, if used, a service-role key for teardown only)
  live **only** on the **admin host**, in one of:
  - **GitLab CI/CD variables** (masked + protected) scoped to the runner — preferred, since
    the runner is a GitLab scheduled pipeline on the admin host (§4); **or**
  - the admin host **macOS Keychain**, read by the cron script at run time.
- **No credential appears in this repo, in this design doc, in the MR, in the crawler/CI
  logs, or in any agent chat.** The runner reads them from the environment/keychain at
  execution time only. Logs redact them.
- Credentials are provisioned by Chau on approval. An agent never sees them and never
  creates the account.
- Env var names (values never committed): `PROD_SYNTH_EMAIL`, `PROD_SYNTH_PASSWORD`,
  `PROD_SYNTH_SUPABASE_URL`, `PROD_SYNTH_SUPABASE_ANON_KEY`, and optionally
  `PROD_SYNTH_SERVICE_KEY` (teardown/cleanup only, admin-host-only).

---

## 4. Runner

- **Where:** a **GitLab scheduled pipeline** running on the existing **`.local_runner`**
  (`.gitlab-ci.yml:316` — the self-hosted admin-host runner that already runs the nightly
  full suite and the scheduled Postgres backup). This keeps the cron, its creds, and its
  network egress on the admin host Chau controls. (Fallback: a `launchd` job on the admin
  host alongside `scripts/host/*` if a GitLab schedule is undesirable.)
- **Frequency:** every **15 minutes** for the fast journeys (a, c, e, f) + keepalive (§6);
  the full journey including (b)+(d) (which spends up to 60 s waiting for the sink) runs on
  the same 15-min tick but is allowed a longer budget. 15 min balances fast detection of a
  bad deploy against load. Tunable.
- **Report artifact:** `reports/prod-synthetic-learner/latest.md` (+ `latest.json`,
  machine-readable), a per-journey pass/fail map with timestamps, the tested
  `version.json` hash, and per-failure reproduction steps — same artifact shape as the
  Tier-1 path map. Historical runs: `reports/prod-synthetic-learner/history/<ts>.json`
  (git-ignored or pruned; the runner keeps the last N).
- **Alert channel to Chau:** on any journey failure, email to **admin@mercyblade.com**
  (→ Cloudflare Email Routing → Chau's inbox) via the existing Resend path (an
  edge-function invoke, mirroring `admin-daily-digest`/`send-*`). Alert body = the failing
  journey(s) + repro + tested hash. Green runs do **not** email (only update the artifact),
  so an alert always means action. (Second channel, if Chau prefers: an `admin_inbox` row.)

---

## 5. Retroactive proof (the acceptance test of this design)

**Claim:** journey (d) would have **FAILED** against yesterday's bundle
`index-Dys1ZTp7` (sink flag false) and **PASSES** against today's `index-B7A--0jS`
(sink flag true, confirmed live: `version.json` → hash `12ff73c`, `2026-07-10-18`,
`assets/index-B7A--0jS.js`).

**Mechanism (grounded in code):**
1. `VITE_LEARNING_EVENT_SINK_ENABLED` is read as
   `import.meta.env?.VITE_LEARNING_EVENT_SINK_ENABLED === "true"`
   (`src/lib/learning/eventSink.ts:70`). Vite **inlines** this at build time from the
   Cloudflare Pages env. If the var is absent/false when the bundle is built, the compiled
   comparison is constant-`false`.
2. When false, `isEnabled()` is false, so `flush()` short-circuits at
   `if (!enabled) return { flushed: 0, skipped: "disabled" }` (`eventSink.ts:161`) — the
   queued rows are **never inserted** (`insert` at `eventSink.ts:106` is never reached).
3. The feedback tap is **optimistic**: `vote()` sets `locked` and only *queues* the event
   to localStorage (`CorrectionFeedbackButtons.tsx:61-76`); the "✓ Đã ghi nhận · Recorded"
   label renders off `locked` (`:120-127`), independent of any DB confirmation.

**Therefore:**

| Bundle | Sink flag (build-inlined) | Journey (c) label | Journey (d) DB row within 60 s | Synthetic learner verdict |
|--------|---------------------------|-------------------|--------------------------------|---------------------------|
| `index-Dys1ZTp7` (yesterday) | **false** (missing in CF env) | ✅ shows | ❌ **never lands** | 🔴 **FAIL (d)** — catches the bug |
| `index-B7A--0jS` (today, live) | **true** | ✅ shows | ✅ lands, non-null `rule_or_detector_id` | 🟢 PASS |

This is the acceptance test: **run journey (d) against a deploy; expect FAIL on the
flag-false bundle, PASS on the flag-true bundle.** It is exactly the check the runner
performs every 15 min, and it is the check that would have caught today's bug the moment
`index-Dys1ZTp7` went live — instead of a human finding it by hand.

**Honest limitation (stated so the proof isn't overclaimed):** Vite inlines the flag
*value*, not its *name*, into the minified bundle, so you **cannot** grep
`index-*.js` for the flag to prove its state statically. The proof is necessarily
**behavioral** — does a row land within 60 s — which is precisely what journey (d) does.
Yesterday's `index-Dys1ZTp7` is no longer served (superseded by `index-B7A--0jS`), so the
FAIL row above is demonstrated by the mechanism, not by re-fetching the dead bundle; the
runner re-proves PASS against the live bundle on every tick.

---

## 6. Uptime + keepalive folded into the same cron artifact

The Tier-3 cron **is** the uptime monitor and the keepalive — no separate job:
- **Uptime:** journeys (a)–(f) running every 15 min are the uptime signal. A failure of
  (f) (version) or (e) (placement) or (a) (sign-in) is an outage/regression alert.
- **Keepalive:** journey (e) starts a real `placement-v3-session` every 15 min, which keeps
  one edge isolate warm — directly mitigating the placement cold-start `net::ERR_FAILED`
  (BUG-2026-07-09). **This supersedes the standalone pg_cron keepalive proposed in the
  placement-v3 cold-start MR** — do not deploy both; the synthetic runner covers it and
  additionally *verifies* the response instead of blindly pinging.
- One artifact, one alert channel, one schedule: `reports/prod-synthetic-learner/latest.*`.

---

## 7. Constraints (restated) & non-goals

- **No credentials** in this doc, the repo, or this lane. (§3)
- **Synthetic runs NEVER count as a real learner** anywhere — enforced by the
  `is_synthetic` exclusion threaded through every consumer named in §2, with guard tests.
- **Doc only.** No build, no account creation, no cron install until Chau approves. This MR
  contains **only** this document.
- Not a load test; single account; read-only except the taps journeys (b)/(c) require.

## 8. Open questions for Chau (decide before build)

1. **Runner home:** GitLab scheduled pipeline on `.local_runner` (preferred) vs `launchd`
   cron on the admin host?
2. **Exclusion shape:** `profiles.is_synthetic` flag + `is_synthetic_user()` predicate
   (preferred) vs a separate `synthetic_user_ids` table?
3. **Frequency:** 15 min OK, or tighter (5 min) for faster deploy-failure detection?
4. **"Expected deploy" source for journey (f):** compare `version.json.hash` to the
   pipeline's `CI_COMMIT_SHORT_SHA` at deploy time, or to a value the runner pins per run?
5. **Feedback thumbs on `mercy_feedback_events`:** should the synthetic journey avoid Mercy
   thumbs-voting entirely (simplest isolation), or vote-and-exclude?
6. **Account provisioning:** confirm Chau creates the account + sets the CI/keychain creds;
   agents never see them.

---

*On approval, build is one MR that: (1) adds `is_synthetic` + predicate and threads
exclusion through the §2 consumers with guard tests; (2) adds the Playwright journey runner
+ artifact + alert; (3) wires the scheduled pipeline. No account or cron goes live until
Chau provisions creds and flips the schedule on.*
