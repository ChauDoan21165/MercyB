# RECON — Out-of-band schema objects with no creation migration

**Agent:** B61 · **Branch:** `b61/out-of-band-schema-audit` (off `origin/main` @ `5cfa27e3f`)
**Date:** 2026-05-19 · **Scope:** DIAGNOSTIC ONLY — no DB writes, no schema changes, no PR opened.
**Trigger:** B47 found the T2 tier-sync trigger binding has no creation migration (SQL-Editor-made 2026-05-10); the repo carries only a column-drift patch over a ghost.
**Cross-refs:** `RECON-tier-trigger.md`, `RECON-migration-drift.md`, memory `project_db_schema_drift_audit` (A21, 179 PROD_AHEAD), `project_rls_audit_2026_05_18` (PR #676), `project_repo_ahead_reconciliation` (A31).

---

## TL;DR

| Question | Answer |
|---|---|
| Is B47's T2 ghost an isolated case? | **No.** It is one instance of a *class* the existing drift audit (#17) structurally cannot see. |
| New drift category found | **PATCH-OVER-GHOST trigger bindings** — repo `CREATE OR REPLACE`s the trigger *function* (often as a "search_path / pentest" hardening patch) but **no migration ever `CREATE TRIGGER`s the binding**. On a from-scratch migration replay the function exists but is **never wired** → silent behavior loss. |
| How many such trigger-binding ghosts? | **3 confirmed** from static repo analysis: `sync_profile_tier_from_payment_transactions` (= B47/T2, prod binding live-dump-confirmed), `check_feedback_rate_limit`, `update_kids_updated_at_column`. |
| Relation-level patch-over-ghost (repo `ALTER`s a prod-only table, no `CREATE TABLE`) | **≥10** (e.g. `app_feedback`, `kids_entries`, `stripe_events`, `user_room_progress`, `ai_price_catalog`). Repo gives false "tracked" confidence. |
| Wholly out-of-band relations (REST-visible) | **159** prod relations with no repo `CREATE TABLE/VIEW`, ~58 of them views (anon-bypass class — see #676). |
| Has the situation improved since A21 (2026-05-18)? | **No — stable-to-slightly-worse.** 340 REST relations now vs A21's 337 prod relations. PR #676 (anon-view revoke) still unmerged. The trigger-binding subclass is a *new dimension* neither A21's per-relation audit nor the RLS audit measured. |
| Authoritative `pg_trigger`/`pg_proc`/`pg_policies`/`pg_indexes` enumeration | **BLOCKED unattended** (CLI unlinked, Docker down, service-role = PostgREST-only). Paste-ready SQL-Editor confirmation bundle for Chau in §6. |

---

## 1. Methodology + the hard constraint

The brief asks for a service-role read of `pg_trigger`/`pg_proc`/`pg_views`/`pg_policies`/`pg_indexes`. **That path does not exist unattended** — re-verified live this session, consistent with three standing memories (`project_db_schema_drift_audit`, `project_rls_audit_2026_05_18`, `project_repo_ahead_reconciliation`):

- `supabase migration list` / `projects list` → **"Cannot find project ref. Have you run supabase link?"** — CLI is **unlinked** (no `supabase/.temp/project-ref`).
- `docker info` → **down** → `supabase db dump` (the path RECON-tier-trigger / RECON-migration-drift used on 2026-05-17, Docker Chau-started) **cannot run**.
- Keychain `mb-supabase-service-role` → present, works (OpenAPI HTTP 200), but **PostgREST only** — it cannot read `pg_catalog`. Trigger functions are not RPC-exposed; triggers/indexes/policies are invisible to REST.

So this audit triangulates from what *is* reachable, with explicit confidence levels:

1. **Static repo parse** of `supabase/migrations/` (219) + `migrations_manual/` (3) + `_archive/` (6) — 100% reliable for "what does the repo declare".
2. **Service-role PostgREST OpenAPI** — authoritative for "which tables+views+RPCs exist in prod" (340 relations, 147 RPCs). Cannot see triggers/indexes/policies.
3. **Prior live-dump evidence** — RECON-tier-trigger.md captured prod `pg_dump` 2026-05-17 (line 17693 = the live T2 binding). Point-in-time, reused with a staleness note.
4. **Chau SQL-Editor bundle (§6)** — the only authoritative path to close the catalog-enumeration gap (same R4 confirmation-pass pattern as memory #17).

---

## 2. The new category B47 surfaced — PATCH-OVER-GHOST trigger bindings

A21's drift audit (#17) buckets at the **relation** level (IN_SYNC / PROD_AHEAD / REPO_AHEAD via "is there a `CREATE` migration for this relation"). A trigger binding is **not a relation** — so a trigger that lives in prod with no migration is *invisible to that audit by construction*. It is also more dangerous than a plain out-of-band table, because the repo **looks like it tracks the object** (it `CREATE OR REPLACE`s the function), giving false confidence — the binding silently isn't there.

Detection (static, deterministic): functions defined `RETURNS trigger` in the repo **minus** functions named in any repo `CREATE TRIGGER … EXECUTE FUNCTION`. Result — 3, all binding-count `0` confirmed across `migrations` + `migrations_manual` + `_archive`:

| # | Trigger function | Repo artifact | Repo `CREATE TRIGGER`? | Prod binding | Bucket |
|---|---|---|---|---|---|
| G1 | `sync_profile_tier_from_payment_transactions` | `20260510010000_fix_sync_profile_tier_trigger.sql` — `CREATE OR REPLACE` **column-drift patch** (`subscription_tiers.key`→`.vip_key`) | **none** | **LIVE** — `trg_sync_profile_tier_from_payment AFTER INSERT OR UPDATE OF status ON payment_transactions`, confirmed RECON-tier-trigger.md (2026-05-17 `pg_dump` line 17693), SQL-Editor-made 2026-05-10 | **PATCH-OVER-GHOST** (canonical / B47-T2) |
| G2 | `check_feedback_rate_limit` | `20260504010000_feedback_require_auth.sql:13` — `CREATE OR REPLACE`, comment *"Update the rate-limit trigger…"* (assumes binding pre-exists) | **none** | Migration's *policy* sibling (`authenticated users insert own feedback` on `public.feedback`) confirmed in prod by RECON-migration-drift §8 → function patch applied via SQL Editor too; **binding origin = ghost** | **PATCH-OVER-GHOST** (needs §6 confirm) |
| G3 | `update_kids_updated_at_column` | `20251130002025_…sql:6` — `CREATE OR REPLACE … SET search_path` ("Security Fixes from Pentest Report") | **none** | Prod has table `kids_entries` (REST-visible, also out-of-band — no repo `CREATE TABLE`); touch-trigger binding origin = ghost | **PATCH-OVER-GHOST** (needs §6 confirm) |

**Why this is silent-failure risk (CLAUDE.md "core path survives optional failures" / "permissions are product logic"):** replay these migrations onto a clean DB and you get the *function* but never the *trigger*. G1: `profiles.tier` silently stops syncing on payment (RECON-tier-trigger already showed the readers are type-broken, so today's blast radius is low — but the *replay/DR* hazard is real and unrecorded). G2: feedback rate-limit + anti-anonymous guard silently absent → spam/abuse surface. G3: `kids_entries.updated_at` silently stale. None of these would fail loudly; all are invisible to A21's relation audit.

The originating migrations for G2/G3 are explicitly **hardening patches** (`SET search_path`, "pentest report", "skip the anonymous branch"). The repo's relationship to prod's trigger layer is *patch-only*: it hardens functions whose creation **and binding** were both done out-of-band in the SQL Editor.

---

## 3. Relation-level PATCH-OVER-GHOST (false-tracked tables)

Prod relations the repo only ever `ALTER`s / indexes / policies but **never `CREATE TABLE`s** (REST-confirmed present in prod) — the table-level analog of §2. ≥10 high-signal:

`ai_price_catalog`, `app_feedback`, `kids_entries`, `mercy_feedback_daily_rollups`, `mercy_feedback_events`, `mercy_worst_answers_daily`, `stripe_events`, `user_knowledge_profile`, `user_room_progress`, `user_subscription_state`.

These are worse than plain WHOLLY-OUT-OF-BAND because a migration touches them — anyone scanning `git grep` sees a migration and assumes the table is tracked. It is not; only a delta over a ghost is. (Exact RLS-patch-over-ghost sub-count needs the §6 bundle — the unqualified-name `CREATE POLICY` forms defeat static regex; do not trust a static "0".)

---

## 4. Wholly out-of-band + REPO_AHEAD (cross-ref, not re-derived)

- **WHOLLY OUT-OF-BAND:** 159 REST-visible prod relations have no repo `CREATE` (of 340 prod relations vs 193 repo-declared tables+views). ~58 match view patterns — `v_mb_*` telemetry/quality views, `admin_*` dashboards, `billing_customers`, `user_entitlements_v`, `admin_mrr_snapshot`, `admin_users_dashboard_v1`. This is the **anon-readable-view bypass** class already owned by **RLS audit / PR #676** (`fix/revoke-anon-on-internal-views`, *still unmerged*). Not re-derived here per memory directive; B61 confirms it persists.
- **REPO_AHEAD:** the 5 from A31 (`admin_allowlist`, `role_audit_log`, `alert_history`, `alert_pause`, `latency_aggregates`) — already reconciled (memory `project_repo_ahead_reconciliation`); `latency_aggregates` applied, `admin_allowlist`/`role_audit_log` permanently dead. No change.

---

## 5. Step 7 — has it gotten worse since A21 (2026-05-18)?

**Stable-to-slightly-worse. No improvement.**

| Metric | A21 (2026-05-18) | B61 (2026-05-19) | Δ |
|---|---|---|---|
| Prod relations | 337 (full catalog) | 340 (REST-visible subset) | grew; consistent (REST ≤ catalog) |
| PROD_AHEAD relations | 179 (strict no-CREATE) / 169 (RLS map) | 159 REST-visible | consistent, **no reduction** |
| Anon-readable internal views | 16 | persists; PR #676 **unmerged** | unchanged |
| Trigger-binding ghosts | **not measured** (out of audit's frame) | **3 found** | **new exposure dimension** |

The headline: the existing drift audit's numbers didn't worsen, but B61 shows the audit was **measuring the wrong unit** for the B47 class. Per-relation bucketing cannot count trigger-binding, function-binding, or grant-only ghosts. The drift is not "stable" so much as **partly unmeasured**.

---

## 6. Chau SQL-Editor confirmation bundle (the only authoritative close-out)

Run in Supabase SQL Editor (project `buemdfxyhxunzpgdoqin`), read-only, paste results back to a follow-up agent. Closes the catalog gap §1 cannot reach unattended.

```sql
-- A. The 3 ghost-binding triggers: do the bindings exist in prod, on what, firing when?
SELECT t.tgname, c.relname AS table, p.proname AS func,
       pg_get_triggerdef(t.oid) AS def
FROM pg_trigger t
JOIN pg_class c   ON c.oid = t.tgrelid
JOIN pg_proc  p   ON p.oid = t.tgfoid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE NOT t.tgisinternal AND n.nspname = 'public'
  AND p.proname IN ('sync_profile_tier_from_payment_transactions',
                    'check_feedback_rate_limit',
                    'update_kids_updated_at_column');

-- B. EVERY non-internal trigger in public (full ghost enumeration vs repo's 67 CREATE TRIGGER names)
SELECT c.relname AS table, t.tgname, p.proname AS func
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_proc  p ON p.oid = t.tgfoid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE NOT t.tgisinternal AND n.nspname='public'
ORDER BY 1,2;

-- C. All public views + whether anon/authenticated can SELECT (anon-bypass class, cross-ref #676)
SELECT v.viewname,
       has_table_privilege('anon',          'public.'||quote_ident(v.viewname), 'SELECT') AS anon_select,
       has_table_privilege('authenticated', 'public.'||quote_ident(v.viewname), 'SELECT') AS auth_select
FROM pg_views v WHERE v.schemaname='public' ORDER BY 1;

-- D. Tables with RLS disabled OR zero policies (RLS coverage-gap)
SELECT c.relname, c.relrowsecurity AS rls_on,
       (SELECT count(*) FROM pg_policies pl WHERE pl.schemaname='public' AND pl.tablename=c.relname) AS n_policies
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relkind='r'
ORDER BY rls_on, n_policies;

-- E. Indexes (lower priority — perf, not correctness)
SELECT tablename, indexname FROM pg_indexes WHERE schemaname='public' ORDER BY 1,2;
```

Then: diff B against the repo's 67 declared `CREATE TRIGGER` names; any prod trigger not in that list = WHOLLY-OUT-OF-BAND binding. Diff D/C against migrations for policy/view ghosts.

---

## 7. Recommendations (no action taken — diagnostic only)

1. **Reframe the drift CI gate (memory #17 R5–R7) to object-level, not relation-level.** A per-relation PROD_AHEAD counter will *never* catch a trigger-binding, grant-only, or policy-only ghost. Add a "repo CREATEs the function but never the trigger" lint to the #669 edge-fn-drift harness lane.
2. **G1–G3 each need a tracked `CREATE TRIGGER` migration** (idempotent `CREATE OR REPLACE TRIGGER`) so a from-scratch replay reproduces prod. Small, independent, behavior-neutral if prod already has the binding (verify via §6-A first). G1's full disposition is already designed in `RECON-tier-trigger.md` Path A.
3. **PR #676 is the long pole** for the anon-readable-view class — unmerged since 2026-05-18. B61 confirms exposure unchanged.
4. **Do not re-run A21's relation audit** — it is not stale, it is *scoped past* this class. Fix the scope, not the numbers.

*No files modified outside this report. No DB writes. No PR opened. Diagnostic-only.*
