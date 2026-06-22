# PENDING CHAU ACTIONS — manual SQL / Dashboard backlog (2026-05-19)

**Auditor:** B54 · **Branch:** `b54/pending-chau-actions` · **No PR** (operator
artifact, recon/runbook convention #768).
**Audit type:** INVENTORY only. **No writes. No re-query of prod.** Every
"applied?" status below is sourced to a committed sibling doc or a verified
read already on disk; nothing was re-tested live.
**Labels:** silent-failure, money-path, stale-audit-note

> **Why this doc exists.** This session repeatedly produced a remediation SQL
> block, handed it to Chau, and the bug stayed live because the block was
> never run. B29's `sql-remediation-convention.md` fixed the *shape* of future
> blocks; this doc is the *backlog* of the ones already outstanding. It is a
> checklist, not new analysis — each row points at the prepared artifact.

---

## Headline — 9 pending actions

| Blast-radius bucket | Count | Items |
|---|---|---|
| 🔴 **REAL customer / revenue / data impact (live now)** | **3** | #1 mylinh paid-but-free · #2 B42 missing price-map row · #3 anon-readable internal views |
| 🟠 **Unknown impact until investigated** | **1** | #4 evt_1TUxM5 Stripe Dashboard lookup |
| 🟡 **Cosmetic / MRR-hygiene / future-prevention** | **5** | #5 A94/B21 phantom rows · #6 legacy PUBLIC INSERT policies · #7 user_subscriptions tier_id index · #8 secdef browser-write wrappers · #9 B7 monitoring queries (read-only decision) |

**Net real-money/customer items still live in prod: 3** (#1, #2, #3).
**Netlify:** checked — no pending Netlify uninstall/disconnect action exists in
session artifacts (prod is Vercel-only per `project_vercel_prod_deploy`). The
brief named it only as an example category; nothing to do.

The hard rule still holds for every SQL item below: **no unattended path to
this Supabase.** Chau applies each block **once**, by hand, in the Supabase
**SQL Editor**, after reading it — never `supabase db push`, never an agent.

---

## 🔴 1. mylinh.nutrition@gmail.com — paying user denied premium (LIVE)

- **Source:** B5 `reports/RECON-mylinh-paid-but-free-B5.md` (branch
  `b5/mylinh-paid-but-free-diagnostic`, tip `245d8ec6d`). Confirmed still live
  by B30 Q4 (`reports/RECON-monitor-query-baseline-B30.md`,
  `b30/monitor-query-validation` tip `98e05a403`).
- **Blast radius:** 🔴 **highest** — **1 confirmed paying customer**
  (`cd9b889c-eb9f-428f-9462-de66d4f92c04`) paid through ≈2026-06-08, receiving
  **no premium** since ≈2026-05-09. Worst money-path mode: silent, user-felt,
  trust + refund risk.
- **Status:** code-fix class **merged** (B11 PR #770 stops *new* occurrences)
  but **her existing stale `current_period_end` row was never backfilled**.
  The per-user remediation SQL B5 wrote is **not on disk** (lost with the
  worktree); B12 bulk-remediation that would carry it is **SILENT-FAIL**
  (never produced). So the bug is still live for her specifically.
- **Time:** ⏱ longer — *blocked*. No paste-ready SQL exists. Needs a one-user
  UPDATE regenerated under human review (re-pull Stripe → recompute
  `current_period_end` ≈2026-06-08 → `recomputeAndPersistEntitlement`).
- **Action:** Re-dispatch a scoped agent (or B12) to regenerate mylinh's
  per-user remediation SQL to the B29 convention, then apply once via SQL
  Editor. **Do not hand-write an UPDATE from the recon doc** (B5 explicitly
  forbids it — status/denying-reader NOT RECOVERABLE).
- **SQL file:** ❌ none committed — must be regenerated first.

## 🔴 2. Missing `billing_price_map` row — 3 paying yearly subs invisible in MRR

- **Source:** B42 `reports/RUNBOOK-price-map-row-B42.md` (branch
  `b42/price-map-missing-row`, tip `202bfffa5`). Same failure class as PR #700.
- **Blast radius:** 🔴 real revenue, **not** access — 3 active yearly subs on
  `price_1TCKSF2K1tPxy04uNeKcQWp5` (≈**6,000,000 VND/yr** real revenue) count
  as **0 MRR**. Entitlement is unaffected (users keep premium), so it is
  revenue-*visibility* harm, not user-felt — ranked below #1 for that reason.
  One affected sub (User C, `115c2ecf…`) has no `profiles` row → real customer
  with a separate data-quality gap.
- **Status:** DIAGNOSED, no writes. INSERT is fully prepared (all values from
  authoritative `raw_payload`). B30 Q5a confirms the row is still missing →
  **not applied.** This is the **2nd** occurrence of the #700 class.
- **Time:** ⏱ 5–30 min — Stripe Dashboard cross-check of one price id (§2 of
  the runbook) + paste the `ON CONFLICT` INSERT + run the 3 verify queries.
- **Action:** Follow `RUNBOOK-price-map-row-B42.md` §2 → §3 → §5; paste the
  prepared idempotent INSERT in SQL Editor.
- **SQL file (prepared, on branch):** the block is §3 of
  `reports/RUNBOOK-price-map-row-B42.md` @ `b42/price-map-missing-row`.

## 🔴 3. Anon-readable internal views (RLS-bypass) — revoke not yet applied

- **Source:** A59/A75 — migrations **merged to `origin/main`** but project
  convention is hand-apply (see #676 lineage,
  `project_rls_audit_2026_05_18`):
  - `supabase/migrations/20260618000000_revoke_anon_on_internal_views.sql` (PR #750, #676 family)
  - `supabase/migrations/20260620000000_revoke_anon_residual_views.sql` (PR #750)
- **Blast radius:** 🔴 real data exposure — `postgres`-owned views over
  RLS-protected base tables **bypass RLS**; with Supabase's default `anon`
  SELECT, billing/admin/analytics **views are anon-readable**. Base tables
  have 0 PII anon leaks; the leak is via these views.
- **Status:** migration FILES merged; **manual SQL-Editor apply unverified**
  (this Supabase has no CI-applied migration path; RLS = SQL-Editor only).
- **⚠️ Caveat (do not over-revoke):** `weekly_digest_data` was a regex
  false-positive — it is intentional public `/blog` content. **Keep the
  migration's own scoping; do not blanket-revoke beyond what the files list.**
- **Time:** ⏱ 5–30 min — paste 2 migration files into SQL Editor, run their
  own verify blocks.
- **Action:** Apply the two `revoke_anon_*` migration files via SQL Editor;
  confirm the `weekly_digest_data` carve-out is honored.
- **SQL files:** the two migration paths above (on `origin/main`).

## 🟠 4. `evt_1TUxM52K1tPxy04udiaKvPJL` — "unknowable" Stripe event lookup

- **Source:** B28 `reports/RUNBOOK-evt-1TUxM5-lookup.md` (branch
  `b28/unknowable-event-lookup`, tip `80be83c3a`). A77 flagged it; B21
  exhausted every DB-side path.
- **Blast radius:** 🟠 **unknown until the 60-second lookup.** A failed
  `customer.subscription.deleted` from the pre-#561 `[object Object]` window.
  Its 2 timing-twin siblings were founder/test (zero impact); this one has no
  DB trace, so it *could* be a real customer — only the Stripe Dashboard knows.
- **Status:** AWAITING the one manual Stripe Dashboard read. Decision tree +
  pre-built SQL kit are ready; only branch (b) writes anything.
- **Time:** ⏱ 5–30 min — ~60 s Dashboard lookup, then 0 SQL (branches a/c),
  or BLOCK 1→2→3 (branch b), or escalate (branch d).
- **Action:** Run `RUNBOOK-evt-1TUxM5-lookup.md` §2 (Dashboard) → §3 decision
  tree → §4 SQL kit only if branch (b). Fill the §5 findings log.
- **SQL file (prepared, on branch):** §4 of
  `reports/RUNBOOK-evt-1TUxM5-lookup.md` @ `b28/unknowable-event-lookup`.

## 🟡 5. A94/B21 phantom subscription rows (U1, U2) — MRR hygiene only

- **Source:** B21 `reports/REMEDIATION-stripe-deletion-events-B21.sql` (branch
  `b21/failed-deletion-events`, tip `a84ace451`; salvaged into the B29
  namespace by B36). Paired recon `RECON-failed-deletion-events-B21.md`.
- **Blast radius:** 🟡 **cosmetic / MRR-hygiene — zero paying impact.**
  U1 `c3496ebe…` = `chaudoanproton@proton.me` (founder/test; has an
  independent gift comp 2030→2031 in `user_subscriptions`, untouched).
  U2 `03fb832c…` = `chaudoan@yahoo.com` (founder/test). Two stale `active`
  rows inflate MRR; no real customer affected.
- **Status:** **NOT applied** — verified 2026-05-19 (both still
  `status='active'`, `updated_at` unchanged since 2026-04-09; B21 header +
  B30 Q2). A94's *canonical* SQL is lost (branch empty); the **B21 file is the
  surviving cross-checked executable** — treat it as the apply candidate.
- **Time:** ⏱ 1–5 min — the file has the B29 BEGIN/ROLLBACK→COMMIT wrapper
  intent; run with ROLLBACK, read verify, flip to COMMIT, re-run.
- **Action:** Apply `reports/REMEDIATION-stripe-deletion-events-B21.sql` once
  via SQL Editor (excludes evt_1TUxM5 by design — that is item #4).
- **SQL file (prepared, on branch):**
  `reports/REMEDIATION-stripe-deletion-events-B21.sql` @
  `b21/failed-deletion-events`.

## 🟡 6. Legacy PUBLIC `WITH CHECK (true)` INSERT policies — latent only

- **Source:** A59 `supabase/migrations/20260621000000_scope_legacy_public_policies.sql`
  (PR #744, **merged to `origin/main`**).
- **Blast radius:** 🟡 **future-prevention / defense-in-depth.** ~8 internal
  tables have PUBLIC `WITH CHECK (true)` INSERT policies but are **inert for
  anon today** (no `GRANT INSERT … TO anon` exists; RLS isn't reached). Risk
  materializes only if a future migration adds a blanket grant. No active
  exploit. `system_logs`/`login_attempts` deliberately excluded (by-design
  anon writes — see #8).
- **Status:** migration FILE merged; **manual SQL-Editor apply unverified**.
  Idempotent (DROP IF EXISTS … CREATE; REVOKE no-op).
- **Time:** ⏱ 1–5 min — paste the one migration file.
- **Action:** Apply `20260621000000_scope_legacy_public_policies.sql` via SQL
  Editor at convenience (no urgency — latent).
- **SQL file:** the migration path above (on `origin/main`).

## 🟡 7. `user_subscriptions(tier_id)` index — perf, future

- **Source:** A75 `supabase/migrations/20260618000000_index_user_subscriptions_tier_id.sql`
  (PR #750; originally PR #673; `project_pg_indexes_preflight` memory).
- **Blast radius:** 🟡 **performance / future** — missing index on a billing
  join column; small table today, no user-visible impact yet.
- **Status:** migration FILE merged; **Chau applies via SQL Editor post-merge,
  NOT db push** (per memory) — apply unverified.
- **Time:** ⏱ 1–5 min — paste one `CREATE INDEX` migration.
- **Action:** Apply the index migration via SQL Editor.
- **SQL file:** the migration path above (on `origin/main`).

## 🟡 8. SECDEF browser-write wrappers (system_logs, login_attempts) — hardening

- **Source:** A72 `supabase/migrations/20260622000000_secdef_browser_write_wrappers.sql`
  (PR #754, **merged to `origin/main`**). Companion to #6 (the two tables #6
  deliberately excluded).
- **Blast radius:** 🟡 **security hardening / future-prevention.** Moves the
  legitimate anon/browser writes (`logger.ts` client logs,
  `securityUtils.ts` login-attempt tracking) behind SECURITY DEFINER RPCs so
  the raw tables can be locked. Not exploited today; *not applying #6 without
  #8 would break client telemetry / lockout* — apply as a pair if/when done.
- **Status:** migration FILE merged; **manual SQL-Editor apply unverified**.
- **Time:** ⏱ 1–5 min — paste one migration; apply together with #6.
- **Action:** Apply `20260622000000_secdef_browser_write_wrappers.sql` via SQL
  Editor, paired with #6.
- **SQL file:** the migration path above (on `origin/main`).

## 🟡 9. B7 money-path monitoring queries — read-only decision (not a fix)

- **Source:** B7 `reports/RECON-money-path-silent-failure-monitoring-B7.md`
  (branch `b7/money-path-monitoring-scoping`). Validated read-only by B30.
- **Blast radius:** 🟡 **future-prevention only** — 5 detection queries that
  would have caught #1/#2/#5 earlier. **Read-only; no prod write.** Listed
  here only because it is an outstanding pending-Chau decision in the same
  family; it does not leave a bug live.
- **Status:** parked — awaiting Chau decision on whether to wire as
  instrumentation (pg_cron / alerting) vs run ad-hoc.
- **Time:** ⏱ 5–30 min to run the 5 queries once; longer if wiring
  instrumentation.
- **Action:** Decide instrument-vs-ad-hoc; if ad-hoc, run B7's 5 queries
  periodically (B30 already validated query #3b needs a
  `provider_subscription_id is not null` refinement).
- **SQL file:** the 5 queries are in
  `reports/RECON-money-path-silent-failure-monitoring-B7.md` @
  `b7/money-path-monitoring-scoping`.

---

## Recommended order for Chau

1. **#4 first** (evt_1TUxM5 Dashboard lookup) — 60 s, and its outcome may add
   or close a real-customer item; do it before deciding effort elsewhere.
2. **#2** (B42 price-map) — prepared, idempotent, ~5–30 min, real revenue.
3. **#3** (anon-view revoke) — real data exposure, prepared.
4. **#1** (mylinh) — needs SQL regenerated first; **dispatch that now** so it
   is ready by the time #2/#3 are done.
5. **#5** (phantom rows) — 1–5 min, cosmetic, prepared.
6. **#6 + #8 together**, then **#7** — latent/hardening/perf, no urgency.
7. **#9** — process decision, no deadline.

## Provenance / conventions

- B29 `docs/agent-briefs/sql-remediation-convention.md` — the shape every
  prepared block above follows (PK-targeting, idempotency guard, gift guard,
  BEGIN/ROLLBACK→COMMIT, header).
- B16 `docs/agent-briefs/recon-doc-convention.md` (#768) — why these
  artifacts are committed-not-PR'd and survive `git worktree prune`.
- Evidence reads: B30 `RECON-monitor-query-baseline-B30.md`, B32
  `RECON-session-agent-inventory-B32.md`, B34
  `RECON-stripe-webhook-failures-A77-retroactive.md`.
- Memory: `project_db_schema_drift_audit`, `project_578_rls_applied`,
  `project_rls_audit_2026_05_18`, `project_pg_indexes_preflight`,
  `project_vercel_prod_deploy` — all confirm: no unattended SQL path; SQL
  Editor + human review only.

*B54 — inventory only. No DB writes. No prod re-query. No PR. The doc is the
deliverable.*
