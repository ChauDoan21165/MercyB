# PROD_AHEAD Schema-Drift Tracking — billing/auth/entitlement priority

**Owner track:** A23 · **Opened:** 2026-05-18 · **Status:** 🔴 BLOCKED on Postgres credentials
**Source audit:** `/private/tmp/db-schema-drift-audit.md` (A21, 2026-05-18, read-only)
**Companion:** RLS audit `/private/tmp/rls-policies-audit.md`

---

## Why this doc exists (and why there are no `.sql` files)

The schema-drift audit found **179 PROD_AHEAD relations** — relations that exist in
production (`buemdfxyhxunzpgdoqin`) with **zero `CREATE` migration** in
`supabase/migrations/`. They were created out-of-band (SQL Editor) and are not
source-controlled.

The correct fix is committed catch-up migrations that match prod **exactly**
(`supabase db pull --schema public` / `pg_dump --schema-only` per object). That
**cannot be done from the unattended agent environment**:

- No `SUPABASE_ACCESS_TOKEN` (so `supabase link` / `supabase db pull` cannot run).
- No DB password / `DATABASE_URL` / pooler string (so `pg_dump` cannot connect).
- The only available credential is the `mb-supabase-service-role` JWT, which
  drives the **PostgREST REST API only** — not a Postgres connection.

Scraping the PostgREST OpenAPI would yield approximate column lists but **not**
real Postgres types (`int` vs `bigint`), defaults, constraints, FKs, indexes,
sequences, or RLS. Committing migrations built from that would write **false
ground truth** into `supabase/migrations/` and become a `supabase db push`
hazard against tables that already exist with the real schema. Per project
strategy (*foundation > shortcut*; *don't solve uncertainty with more code*),
**no fabricated SQL is committed.** This doc is the honest placeholder until a
credentialed run can generate exact migrations.

---

## Unblock procedure

When `SUPABASE_ACCESS_TOKEN` **and** the project DB password are available in
local env or CI:

```bash
# 1. Link the project (one-time, needs SUPABASE_ACCESS_TOKEN)
supabase link --project-ref buemdfxyhxunzpgdoqin

# 2. Pull the full public schema as a faithful baseline migration
supabase db pull --schema public

#    — or, for just the 3 prioritized relations, schema-only:
supabase db dump --schema-only \
  -t public.user_entitlements \
  -t public.payments \
  -t public.billing_customers \
  > supabase/migrations/<UTCstamp>_prod_ahead_billing_entitlement_catchup.sql
```

Review the emitted DDL by hand before commit (the audit warns prod was mutated
out-of-band; treat the dump as the new source of truth, not the repo).
**Do not `supabase db push`** these — the objects already exist in prod; these
files are *catch-up source control only*, never an apply step.

---

## The 3 highest-risk relations (this track's scope)

Chosen for blast radius on **billing / auth / entitlement**. All three are base
tables (not anon-readable views — those are R1, separately owned). They are
distinct from A25's `user_entitlements_raw*` raw-dump quarantine and from the
5 REPO_AHEAD security tables.

| # | Relation | Audit class | Risk | Why it's top-3 |
|---|---|---|---|---|
| 1 | `public.user_entitlements` | §2.1 🚨 CRITICAL | **Access-control source of truth.** Decides which paid tier (`0..N`) a user has. No migration ⇒ no source-controlled definition of the table that gates every paid feature; RLS posture undocumented in repo. A wrong/absent RLS policy here is a direct entitlement-bypass or entitlement-leak. | Highest — this is the entitlement spine. |
| 2 | `public.payments` | §2.2 ⚠️ HIGH | **Financial ledger / PII.** Records money movement. Off-book schema means no review trail for column/constraint changes on financial data; RLS undocumented ⇒ potential cross-user financial-record read if anon/auth policy is loose. | Direct money + PII exposure surface. |
| 3 | `public.billing_customers` | §2.2 ⚠️ HIGH | **User ↔ Stripe identity link.** Maps internal user to Stripe customer id. Joins auth identity to billing identity; an over-permissive policy enables enumeration of who-pays-what and Stripe-id harvesting. | Auth/billing identity linkage. |

### Per-relation follow-up actions (post-unblock)

For **each** of the three, the credentialed pass must:

1. `supabase db dump --schema-only -t public.<relation>` → exact DDL.
2. Diff emitted DDL against any partial repo references (grep
   `supabase/migrations` + `src/` + `supabase/functions/` for the name).
3. Commit the DDL as a catch-up migration (creation only — never an apply).
4. Capture the live RLS state (`pg_policies` for the relation) and assert it
   in the migration or flag a missing-policy follow-up to the RLS-audit track.
5. Confirm `user_entitlements` is **not** anon-readable (cross-check the R1
   anon-readable list — it is a base table, expected RLS-gated; verify).

---

## Cross-track boundaries (do not duplicate)

- **R1 — anon-readable view REVOKE:** separately owned (`fix/revoke-anon-on-internal-views`,
  landed as `20260622000000_revoke_anon_on_internal_views.sql`). Not in scope here.
- **R2 — `user_entitlements_raw` / `user_entitlements_raw_20260301_181303`:** raw-dump
  quarantine, A25's scope. This track tracks the **live** `user_entitlements`,
  a distinct object.
- **R3 — 5 REPO_AHEAD security tables:** resolved (#685 tombstone). Not PROD_AHEAD.
- **R5–R7 — bulk codification (155 remaining):** parked; same credential blocker.
  This doc is the foothold for the billing/auth/entitlement slice when unblocked.

---

## Status log

| Date | Event |
|---|---|
| 2026-05-18 | A21 audit identifies 179 PROD_AHEAD. |
| 2026-05-18 | A23 verifies no unattended Postgres path; doc-only tracking PR opened for the 3 highest-risk billing/auth/entitlement relations. Real migrations blocked on `SUPABASE_ACCESS_TOKEN` + DB password. |
