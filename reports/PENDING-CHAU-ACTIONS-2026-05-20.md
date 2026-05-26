# PENDING CHAU ACTIONS — post-2026-05-19 hardening wave (2026-05-20)

**Auditor:** A9c · **Branch:** `docs/pending-actions-consolidation` ·
**Supersedes:** `reports/PENDING-CHAU-ACTIONS-2026-05-19.md` (B54 inventory —
9 items). **Audit type:** consolidation only. **No writes, no prod re-query.**
Every claim below is sourced to a committed sibling doc or a PR body already
on origin; nothing was re-tested live.
**Labels:** silent-failure, money-path, app-store-blocker, operator-paperwork

> **Why this doc exists.** Between 2026-05-19 evening and now the session
> produced ~40 PRs and a dozen new operator-runbook reports. The 2026-05-19
> doc captured 9 items at the *start* of the wave; this doc captures the
> *end* state, after the wave's outputs are themselves now waiting on Chau.

---

## Cross-reference table — 2026-05-19 items → current status

| 2026-05-19 # | Topic | Status now | Pointer |
|---|---|---|---|
| #1 | mylinh paid-but-free | **packaged** — apply via #801 (preflight #805) | §B.1 |
| #2 | B42 missing price-map row | **packaged** — apply via #798 | §B.2 |
| #3 | anon-readable internal views | **packaged** — apply via #800 §Section 1 | §B.3 |
| #4 | evt_1TUxM5 Stripe Dashboard lookup | unchanged (still 60-s manual) | §B.6 |
| #5 | A94/B21 phantom rows | **packaged** — apply via #800 §Section 2 (Step-0 guard #806) | §B.4 |
| #6 | legacy PUBLIC INSERT policies (#744) | unchanged — latent, no urgency | §B.7 |
| #7 | `user_subscriptions(tier_id)` index (#750) | unchanged — perf, future | §B.8 |
| #8 | SECDEF browser-write wrappers (#754) | unchanged — apply paired with #6 | §B.9 |
| #9 | B7 monitoring queries (instrument vs ad-hoc) | unchanged — process decision | §B.10 |

**Net change vs 2026-05-19:** every "🔴 real impact" item now has a single
paste-ready operator package on origin. The unknowable Stripe-event lookup
(#4) is the only 🔴/🟠 item still requiring fresh investigation.

---

## Headline

| Bucket | Count |
|---|---|
| 🔴 PR merges (gates SQL / paperwork / paying customers) | **12** named below + 27 session-bulk merges = **~39 open** |
| 🔴 SQL hand-applies | **5** P0 packages + **3** unchanged legacy items = **8** |
| 🟠 Email outreach | **2** (mylinh confirmation post-apply · gift-victim batch) |
| 🟠 Real-device verify | **1** (per #796 / #807 checklist) + **1** sourcemap smoke (#808) |
| 🟠 Operator paperwork | **2** (Apple App Privacy redo · Google Data Safety redo) |
| 🟡 30-day re-audits | **3** named below (paying-user count · content inventory · paying-conversion rate) |

**Hard rule** (carried from 2026-05-19, unchanged): no unattended SQL path to
this Supabase. Every block below is hand-applied by Chau in the Supabase SQL
Editor, after reading it. Never `supabase db push`, never an agent.

---

## Section A — PR merges

**Tonight's dispatch-driven PRs** (the ones gating downstream Chau actions —
merge these first):

| # | Title | Gates |
|---|---|---|
| **#796** | fix(privacy): guard marketing trackers against native execution | §D real-device verify · §E paperwork redo |
| **#797** | ci: wire `check-delete-account-coverage` to required workflow (B2) | §A.40 / A.17 self-enforcement |
| **#798** | docs(billing): D4 bridge — price-map INSERT + raw_payload feasibility (P0) | §B.2 SQL apply |
| **#799** | docs(customer): gift-victim apply-ready package | §B.5 SQL · §C.2 email |
| **#800** | docs(security): P0 SQL batch — anon RLS revoke + phantom rows | §B.3 · §B.4 SQL applies |
| **#801** | docs(customer): mylinh apply-ready package | §B.1 SQL · §C.1 email |
| **#803** | docs(customer): gift-victim outreach send-side ops | §C.2 email (must merge before send) |
| **#804** | docs(billing): D4 raw_payload feasibility — result template + decision tree | §B.2 follow-up |
| **#805** | docs(customer): mylinh Stripe Dashboard pre-flight checklist | §B.1 pre-flight (must merge before #801) |
| **#806** | docs(security): phantom-row apply runbook + A94 loss formalization | §B.4 Step-0 (must merge before #800 §Section 2) |
| **#807** | docs(native): real-device tracker-verify checklist for #796 | §D verify (must merge before §E paperwork) |
| **#808** | test(sentry): smoke-test route to verify sourcemap upload end-to-end | §D sourcemap verify |

**Session-bulk merges** (CI-green, no per-PR Chau action beyond approve+merge —
review at convenience; non-blocking for §B/§C/§D/§E):

- Billing/money-path fixes: **#786** (formatMoney zero-decimal), **#766**
  (CAS backoff jitter), **#773** (period_start symmetric fix), **#793**
  (webhook monotonic).
- DB / schema: **#789** (entitlements table, A17 migration — Chau applies via
  SQL Editor post-merge per `project_pg_indexes_preflight`), **#792** (T2
  retire migration).
- Perf: **#794** (lazy MercyGuidePanel), **#795** (vendor split — zod/sonner/
  date-fns).
- Tests / locks: **#771** (aal=2 deletion smoke), **#762** (mercy-feedback
  regression).
- Docs / process: **#764, #765, #769, #775, #776, #777, #778, #779, #780,
  #781, #782, #783, #785, #788, #790, #791** — process conventions, session
  summaries, lessons, archives.
- Routing: **#761** (/signup → LoginPage alias).

**Merge order recommendation:**

1. **Pre-#800/#801/#807** gates: merge **#805** before #801, **#806** before
   #800, **#807** before §D.1 verify.
2. **#796** ASAP — its merge is the first event in the §D real-device verify
   chain → §E paperwork redo.
3. **#789** (A17 migration) — unblocks the billing-impl PR chain (B13 ph3
   PR-A is staged on top per primer §f).
4. Then **#797 → #794/#795 → docs-bulk** at convenience.

---

## Section B — SQL hand-applies (Supabase SQL Editor)

> All blocks below: `BEGIN; … ROLLBACK;` first, read verify-after, flip to
> `COMMIT;` and re-run. Hard rule: never `supabase db push` for any of these.

### B.1 mylinh paid-but-free — paying customer denied premium (🔴 P0)

- **Package:** `reports/CUSTOMER-mylinh-apply-package.md` (PR #801) +
  pre-flight `reports/CUSTOMER-mylinh-stripe-preflight-A2b.md` (PR #805).
- **Required order:** A2b §1–§5 pre-flight (Stripe Dashboard env + 2 STOP
  gates + Stripe period-end extraction) → #801 Block 1 (read-only state
  check) → #801 Block 2 (BEGIN/ROLLBACK→COMMIT remediation, fill
  `‹SUBSCRIPTION_PK›` + `‹CORRECTED_PERIOD_END›` from Block 1 row 1A and the
  pre-flight) → #801 Block 3 (A36 verify, PART V4 PASS/FAIL matrix).
- **Expected duration:** 15–30 min (Stripe Dashboard lookup + Block 1 + 2
  + 3).
- **STOP gates:**
  - A2b §2 STOP-gate #1: Status pill ≠ `Active` → ROLLBACK or HARD STOP.
  - A2b §2 STOP-gate #2: period-end ≠ Jun 9 expected proxy → STOP.
  - #801 Block 2 PART D: any verify row mismatched → ROLLBACK, don't flip.
  - #801 Block 3 PART V4: any verdict ≠ PASS → don't send §C.1 email.

### B.2 B42 / B64 missing price-map row — 3 yearly subs 0 MRR (🔴 P0)

- **Package:** `reports/SQL-p0-price-map-bridge-A8.md` (PR #798). Companion
  feasibility-result template: `reports/…` (PR #804).
- **Required order:** #798 Block 1 (B30 Q5a evidence review) → #798 Block 2
  (1-row `INSERT … ON CONFLICT DO UPDATE` with BEGIN/ROLLBACK; PART D
  verifies: D1=0, D2=1 NULL, D3=3 rows, D4=1 row) → flip to COMMIT only
  if PART D matches → #798 Block 3 (read-only `raw_payload` completeness
  query — fills #804 §1 result).
- **Expected duration:** 10–20 min.
- **STOP gates:**
  - Pre-flight: Stripe Dashboard live-mode confirm on
    `price_1TCKSF2K1tPxy04uNeKcQWp5` + its product.
  - PART D any mismatch → ROLLBACK, don't flip.
  - Block 3 result feeds §B.10-class decision via #804's bucket tree:
    0 = GO D4 backfill; 1–100 = conditional GO; >100 = NO-GO (B52 Option A
    stop-gap stays).

### B.2a B53 placeholder-row DELETE (🟡 hygiene; companion to §B.2)

- **Package:** `reports/SQL-p0-price-map-placeholders-B53.md` (PR #831).
- **Apply order:** #798 INSERT first, then B53 DELETE. Disjoint PKs, two
  separate transactions, can run back-to-back in one SQL Editor session.

### B.3 Anon-view RLS revoke (🔴 real data exposure)

- **Package:** `reports/SQL-p0-rls-phantom-A9.md` (PR #800) §Section 1.
- **Required order:** #800 §Section 1A
  (`20260622000000_revoke_anon_on_internal_views.sql`) → §Section 1B
  (`20260624000000_revoke_anon_residual_views.sql`) → §Section 1 verify
  query (must return 0 rows; anon SELECT on no public views except the
  allowlist).
- **Expected duration:** 5–15 min.
- **STOP gates:** verify query non-zero → investigate which view leaked
  past the dynamic catch-all; do not paper over with a manual REVOKE.
- **DO NOT over-revoke:** `weekly_digest_data` is intentional public
  `/blog` content; the catch-all allowlist is load-bearing.

### B.4 Phantom subscription rows U1/U2 (🟡 MRR hygiene, zero paying impact)

- **Package:** `reports/SQL-p0-rls-phantom-A9.md` (PR #800) §Section 2 +
  Step-0 guard `reports/SQL-phantom-row-apply-runbook-A9b.md` (PR #806).
- **Required order:** #806 Step 0 pre-apply count query — **if not 2 rows
  with `status='active'` and `updated_at` unchanged from 2026-04-09,
  STOP** (drift → re-diagnose, don't auto-apply B21's old SQL). If match:
  proceed to #800 §Section 2 BEGIN/ROLLBACK→verify-after→COMMIT.
- **Expected duration:** 1–5 min.
- **STOP gates:** #806's three-direction drift table; A94 closure means no
  re-dispatch on `a94/stale-sub-rows-cleanup` (superseded by B21).
- **Out of scope:** `evt_1TUxM52K1tPxy04udiaKvPJL` — §B.6.

### B.5 Gift-victim repair (🔴 user-felt — paid users denied gift)

- **Package:** `reports/CUSTOMER-gift-victim-apply-package.md` (PR #799),
  Blocks 1–4. PR #787 already stops the forward bleed; this is
  historical-victim repair + apology.
- **Required order:** #799 Block 1 (A13 read-only audit Query 1) → Block 2
  (manual transcribe Block 1 rows → A28 VALUES list, routed by
  `failure_mode`) → Block 3 (A28 transactional repair, defaults to
  `ROLLBACK;` and an all-zero sentinel VALUES — un-edited paste writes
  nothing) → flip to COMMIT after sentinel-protected preview → §C.2 email
  send (only after COMMIT).
- **Expected duration:** 30–60 min depending on victim count.
- **STOP gates:**
  - Block 2: any row whose `failure_mode` isn't in the routing table →
    stop, flag a follow-up; do not force-route.
  - Block 3: any `‹SENTINEL_…›` left in the VALUES list = abort (Block 3
    refuses to write sentinel rows).
  - Block 3 preview verify rows ≠ Block 1 victim count → ROLLBACK.

### B.6 evt_1TUxM5 Stripe Dashboard lookup (🟠 unknown until checked)

- **Package:** `reports/RUNBOOK-evt-1TUxM5-lookup.md` @
  `b28/unknowable-event-lookup` (unchanged from 2026-05-19 #4).
- **Required order:** §2 Dashboard read (≈60 s) → §3 decision tree
  (branches a/c → 0 SQL; b → SQL kit §4; d → escalate) → §5 findings log.
- **Expected duration:** 5–30 min (depends on branch).

### B.7 Legacy PUBLIC `WITH CHECK (true)` INSERT policies (🟡 latent)

- **Source:** `supabase/migrations/20260621000000_scope_legacy_public_policies.sql` (PR #744, on `main`).
- **Required order:** apply once; idempotent.
- **Pair with §B.9** so client telemetry / lockout don't break.

### B.8 `user_subscriptions(tier_id)` index (🟡 perf, future)

- **Source:** `supabase/migrations/20260618000000_index_user_subscriptions_tier_id.sql` (PR #750, on `main`).
- **Required order:** apply standalone.
- **Expected duration:** 1–5 min.

### B.9 SECDEF browser-write wrappers (🟡 hardening; pair with §B.7)

- **Source:** `supabase/migrations/20260622000000_secdef_browser_write_wrappers.sql` (PR #754, on `main`).
- **Required order:** apply paired with §B.7; otherwise client logger /
  login-attempt tracking break.

### B.10 B7 money-path monitoring queries (🟡 decision, not write)

- **Source:** `reports/RECON-money-path-silent-failure-monitoring-B7.md` @
  `b7/money-path-monitoring-scoping`.
- **Required order:** Chau decides instrument-vs-ad-hoc; if ad-hoc, run
  B7's 5 queries periodically (B30 noted Q#3b needs a
  `provider_subscription_id is not null` refinement).

---

## Section C — Email outreach (Resend, `admin@mercyblade.com`)

### C.1 mylinh post-apply confirmation (🔴, gates by §B.1)

- **Prerequisite:** §B.1 fully applied (Block 3 PART V4 all PASS).
- **Source:** `reports/CUSTOMER-mylinh-apply-package.md` (PR #801)
  post-apply confirmation template.
- **Send order:** one email, single recipient (`mylinh.nutrition@gmail.com`).
  No batch.
- **Tone:** Vietnamese primary (per memory `feedback_email_vietnamese_only`);
  short acknowledgment + period-end restoration + offer Chau-personal reply
  channel.

### C.2 Gift-victim apology batch (🔴, gates by §B.5 + #803 merge)

- **Prerequisite:** §B.5 Block 3 COMMITted; #803 merged (the ops procedure).
- **Source:** `reports/CUSTOMER-gift-victim-apply-package.md` Block 4 (copy)
  + #803 send-side ops doc.
- **Send order (verbatim from #803 §2):**
  - **Wave 0** — self-test (Chau's own email).
  - **Wave 1** — single canary (smallest exposure), 24-hour pause to read
    reply / bounce / spam-flag.
  - **Wave 2** — one-at-a-time, **30 s spacing**. Never auto-loop.
- **Abort signals (verbatim from #803 §6):** legal threat, media pickup,
  hard bounces ≥3, Resend domain unverified, double-charge surfaces, wrong
  recipient → stop the send loop, surface to Chau.
- **Tracking:** append-only `reports/CUSTOMER-gift-outreach-log.md`,
  sha256 recipient hash (first 12 chars), `gift_code_value` + `intended_tier`
  + Resend message id + reply summary. **No raw email / PII / reply
  contents logged.**
- **Reply handling:** Chau personal replies only; STRATEGY §1
  outcomes-first ladder; +90 d max concession without explicit Chau decision;
  Stripe refund last resort.

---

## Section D — Real-device verify (operator)

### D.1 Native marketing-tracker verify (per #796 + #807)

- **Prerequisite:** #796 + #807 merged. Real iOS device + real Android
  device + Safari Web Inspector / `chrome://inspect/#devices`.
- **Source:** `reports/NATIVE-tracker-verify-checklist-A6b.md` (PR #807).
- **Order:** §0 env-var name sanity (codebase uses `VITE_FB_PIXEL_ID`, not
  `VITE_META_PIXEL_ID`) → §1 build prereqs (`npm ci` → `.env.local` with
  real non-empty tracker IDs → `npm run build` → `npx cap sync ios` +
  `npx cap sync android`) → §2 iOS verify (5 highest-traffic screens, 3
  filters) → §3 Android verify (same procedure) → §4 negative-test control
  on `npm run preview` desktop (trackers **must** fire — without this
  control, a clean §2/§3 pass proves nothing) → §5 pass/fail thresholds
  (any tracker row on any screen = fail; App Store 5.1.2 has no tolerance
  band) → §6 paperwork links.
- **Expected duration:** 60–120 min for a thorough first run; §appendix
  abbreviated 5-min re-run for future TestFlight cycles.
- **STOP gates:** any single tracker network row under any filter on any
  screen → FAIL, do not advance to §E paperwork redo. Negative-test fail
  (preview desktop also silent) → root-cause is env emptiness, not the
  guard — investigate before claiming pass.

### D.2 Sentry sourcemap smoke (per #808)

- **Prerequisite:** #808 merged + Vercel prod env var
  `VITE_SENTRY_SMOKE_TEST_ENABLED=true` + a redeploy.
- **Source:** `src/pages/SentrySmokeTest.tsx` + PR #808 body manual-verify
  path.
- **Trigger URL:** `https://mercyblade.com/__sentry-smoke-test?confirm=throw`
- **PASS criterion:** Sentry event search for
  `SENTRY_SOURCEMAP_SMOKE_TEST_v1` shows stack frame
  `src/pages/SentrySmokeTest.tsx:33` (or close).
- **FAIL criterion:** stack frame shows
  `assets/index-<hash>.js:1:NNNN` — `@sentry/vite-plugin` config needs
  investigation.
- **After verify (either outcome):** remove the env var from Vercel; one-
  commit cleanup PR follow-up deletes the route + lazy import.
- **Why it matters:** until this passes, the parked `/tiers` crash and
  every future production crash is undiagnosable.

---

## Section E — Operator paperwork (App Store redo, gated by §D.1)

> Per primer §k Blocker #2 — operator paperwork, not agent work.

- **Prerequisite:** §D.1 PASSED on both iOS and Android (all five screens
  on both devices, zero tracker network rows, negative-test desktop
  confirmed firing). **Do not begin §E if §D.1 is FAIL or skipped.**
- **E.1 Apple App Privacy:** redo from scratch in App Store Connect →
  App Privacy → Data Collected. The corrected tracker reality (zero on
  native) materially changes which data-collection categories are checked.
- **E.2 Google Data Safety:** redo from scratch in Play Console → App
  content → Data Safety. Same reasoning.
- **Same-day update of existing submission docs in
  `docs/app-store-submission/`** — three checklists there reference the
  pre-fix tracker behavior and need a same-day pass to stay accurate.
- **Source pointers:** #807 §6 has the concrete sub-page paths and the
  cross-reference list.

---

## Section F — 30-day re-audit reminders (early June 2026)

Things to re-check ~30 days from now even if no issue surfaces — these are
the metrics that decay silently:

1. **Paying-user count.** Today's known impacted set is U1/U2 (founder/test)
   + mylinh + the 3 yearly subs in §B.2 + the gift-victim batch from §B.5.
   In 30 days, re-run B7 monitoring queries (§B.10) ad-hoc to confirm no
   new phantom-row / 0-MRR / 0-entitlement victims have accumulated.
2. **Content inventory.** Bundle-size remains deferred per memory
   `project_bundle_size_deferred` — 475 rooms / 21 MB. After 30 days of
   real room-visit analytics, decide whether the "top-N bundled, rest
   Supabase-served" cut-line is now data-justified.
3. **Paying-conversion rate.** Per primer §a: outcomes > engagement. In
   30 days, compute conversion from `profiles` → paying
   (`public.subscriptions` `status='active'`) baseline now vs +30 days; if
   flat or down, that supersedes any hardening backlog as the next focus.

These are reminders, not pending actions. Schedule a check-in for
~2026-06-19.

---

## "Do not lose" appendix — LOCAL-only worktrees

> Pending A10b output — A10b worktree audit not located in `reports/` at
> A9c authoring time. The list below is **inherited verbatim from primer
> §g** (A46 refresh of A27, `a46/primer-refresh-may19-late`). If A10b
> finishes after this doc, supersede this appendix from A10b's output.

🚨 **SALVAGE WARNING — do NOT `git worktree prune` before pushing.** The
billing-impl design chain and customer-incident remediation worktrees below
are recorded as LOCAL-ONLY in `/private/tmp` at primer-write time. A9's
PR #800 work already pushed `b21/failed-deletion-events`. A10's
`OPS-local-worktree-push-A10.md` (on `main`) confirms the 5 billing-design
branches were already pushed. The list below is the **un-superseded**
remainder per primer §g + spot-checks; verify with
`git ls-remote origin <branch>` before pruning anything.

| Branch | Worktree | Holds | Push status (A9c spot check) |
|---|---|---|---|
| b68/recompute-entitlement-design | /private/tmp/A6-recompute-design | B68 design | pushed (A10 OPS doc) |
| b69/d4-mrr-source-strategic | /private/tmp/A8-d4-mrr-source | D4 decision | pushed (A10 OPS doc) |
| b71/b13-phase3-brief | /private/tmp/A12-b13ph3-brief | B13 ph3 impl brief | pushed (A10 OPS doc) |
| a18/recompute-impl-brief | /private/tmp/A18-recompute-impl-brief | recompute impl brief | pushed (A10 OPS doc) |
| a14/webhook-payload-type-audit | /private/tmp/A14-webhook-payload-audit | webhook payload-bug recon | pushed (A10 OPS doc) |
| b5/mylinh-sql-regen | /private/tmp/A2-mylinh-regen | mylinh SQL + diagnosis | verify before prune |
| a26/mylinh-apply-runbook | /private/tmp/A26-mylinh-apply-runbook | mylinh apply runbook | verify before prune |
| a13/gift-redemption-victims | /private/tmp/A13-gift-victims | gift-victim audit SQL + outreach | verify before prune |
| a28/gift-victim-repair-sql | /private/tmp/A28-gift-victim-repair | gift-victim repair SQL | verify before prune |
| a36/mylinh-postapply-verify | /private/tmp/A36-mylinh-postapply-verify | mylinh post-apply verify SQL | verify before prune |
| a94/stale-sub-rows-cleanup | /private/tmp/A94-stale-sub-cleanup | (CLOSED — superseded by B21 per PR #806) | branch empty; safe to prune |

**Action on this appendix:**

- Before any `git worktree prune`, run `git ls-remote origin <branch>` for
  every worktree above and only prune those whose local HEAD matches
  origin or whose branch is now formally closed (a94/stale-sub-rows-cleanup).
- Do not assume any unmarked row above is pushed; A9c did not re-verify
  beyond the A10 OPS doc's 5 entries.
- When A10b finishes, supersede this appendix wholesale.

---

## Provenance / conventions

- Supersedes `reports/PENDING-CHAU-ACTIONS-2026-05-19.md` (B54).
- Inherits B29 SQL-remediation convention
  (`docs/agent-briefs/sql-remediation-convention.md`) and B16 recon-doc
  convention (`docs/agent-briefs/recon-doc-convention.md`).
- Primer source: `a46/primer-refresh-may19-late`
  `reports/NEXT-SESSION-PRIMER-2026-05-20.md` (commit `706983a93`).
- LOCAL-worktree salvage: `reports/OPS-local-worktree-push-A10.md` (on
  `main`).
- Tonight's package PRs cited inline by `#NNN`; all on origin at A9c
  authoring time.

*A9c — consolidation only. No DB writes. No prod re-query. No code touched.
The doc is the deliverable.*
