# #789 Migration Pre-Apply Verify (A8d)

**Agent:** A8d (read-only verify) · **Branch:** `docs/789-migration-verify`
**Subject:** `supabase/migrations/20260519230000_create_entitlements_table.sql`
on `origin/feat/entitlements-table-migration` (PR #789) @ `49d6f866e`
**Labels:** money-path, db-migration, pre-apply
**Overall verdict:** **PASS as-scoped** — the migration is safe to apply via the
Supabase SQL Editor. Apply checklist is in §10. **One scope gap (G7):** the
`recompute_entitlement_tx` RPC that A18 brief §6 mandates is **NOT** in this
migration. Apply this migration anyway; the RPC needs a separate migration
before A18 PR1 can dispatch. §7 details and a remediation outline (no
implementation here — separate PR).

---

## 0. Method

Single read pass against the migration file (191 lines, one commit, one PR).
Every claim below is `file:line`-cited against `49d6f866e`. No SQL executed.
No `#789` files touched. No `gh pr` write actions.

Files in #789 vs. its merge-base with `origin/main`:
```
supabase/migrations/20260519230000_create_entitlements_table.sql   (added, 191 lines)
```
**One file, one commit** (`49d6f866e`). No RPC, no test, no docs file.

---

## 1. Check 2a — Table structure matches D1=table decision

**PASS.**

| D1=table requirement | Evidence | Verdict |
|---|---|---|
| One row per `(user_id, app_id)` | `primary key (user_id, app_id)` @ line 98; `app_id text not null default 'mercy_blade'` @ line 63 (single-tenant prod, multi-tenant-capable schema) | ✅ |
| `is_premium` is GENERATED (not written) | `is_premium boolean not null generated always as (status in ('active','trialing','grace_period','past_due')) stored` @ lines 85–88 | ✅ |
| Server-write-only (no client write surface) | RLS section: §3 — no write policy + no write GRANT for `authenticated`; only `grant select on public.entitlements to authenticated` @ line 127 | ✅ |
| Status taxonomy matches `_shared/entitlement.ts` `EntitlementStatus` | CHECK constraint @ lines 69–71 lists exactly: `active, trialing, grace_period, past_due, paused, expired, revoked, inactive` — verbatim match against `entitlement.ts:37-45` | ✅ |
| Source taxonomy matches `_shared/entitlement.ts` `EntitlementSource` | CHECK @ lines 77–78 lists exactly: `stripe, apple, google, gift_code` + nullable. Matches `entitlement.ts:47-53`. **Deliberate omission of `revenuecat`** noted in A5 spec correction (commit body: "NOT 'revenuecat'"). | ✅ |
| `is_premium` GENERATED expression mirrors `ENTITLING_STATUSES` | GENERATED `status in ('active','trialing','grace_period','past_due')` (lines 86–88) matches `entitlement.ts:81-86 ENTITLING_STATUSES` set exactly. Closes the B13 two-derivation class structurally. | ✅ |
| `app_id` default keeps existing `.eq("app_id", …)` call sites working | `default 'mercy_blade'` @ line 63, matches `DEFAULT_APP_ID = "mercy_blade"` used by `stripe-webhook/billing.ts:546` (verified at `cff975a54`) | ✅ |
| `computed_at` / `updated_at` split | Two columns @ lines 92, 96; `computed_at` set explicitly by writer every run (liveness); `updated_at` value-change only via trigger (lines 140–160) | ✅ |
| Cascade on profile delete | `references public.profiles(id) on delete cascade` @ line 59 — entitlement is a derived projection; lossless to drop with its source-of-truth row | ✅ (defensible — audit logs live elsewhere) |

---

## 2. Check 2b — RLS policies present and correct

**PASS.**

| RLS requirement | Evidence | Verdict |
|---|---|---|
| RLS enabled on table | `alter table public.entitlements enable row level security` @ line 119 | ✅ |
| No anon read | `anon` is not in any `grant` statement; no `to anon` policy. anon has no grant → no access at all. | ✅ |
| Authenticated → SELECT only | `grant select on public.entitlements to authenticated` @ line 127, with explicit comment "deliberately NO insert/update/delete grant to authenticated" @ line 128 | ✅ |
| Read scope = own row | `entitlements_select_own` policy `for select to authenticated using (auth.uid() = user_id)` @ lines 131–135 | ✅ |
| Service-role writes bypass RLS | Default Postgres behavior: `service_role` has the `BYPASSRLS` attribute in Supabase projects. Writer (`recomputeEntitlement`) uses the service-role key per A18 brief §3. | ✅ |
| Dual-lock (the profiles-freeze lesson) | Comment @ lines 121–126 explicitly invokes the `20260614000000_profiles_freeze_privileged_columns` lesson: defense-in-depth = (1) no write policy + (2) no write GRANT. **Applied.** | ✅ |
| Pre-existing legacy `grant ... to anon`? | Migration creates a brand-new table; cannot inherit prior grants. anon starts with zero. | ✅ |

---

## 3. Check 2c — Indexes on the hot-path columns

**PASS.**

| Hot path | Index | Evidence | Verdict |
|---|---|---|---|
| `loadEntitlement(userId, appId)` point-get on `(user_id, app_id)` | **PK** itself, leftmost-prefix scan | `primary key (user_id, app_id)` @ line 98; comment @ lines 102–106 explicitly explains why no standalone `user_id` index is needed (would duplicate PK prefix) | ✅ |
| Single-row UPSERT by writer | PK | Same | ✅ |
| "How many users are entitled" / MRR (B7 Q1/Q4) | `entitlements_is_premium_idx on (app_id) where is_premium` @ lines 109–111 | Partial index — small, hot-set only, leftmost-tenant. | ✅ |
| Staleness sweep (B7 safety-net: rows not recomputed in N hours) | `entitlements_computed_at_idx on (computed_at)` @ lines 115–116 | Enables `where computed_at < now() - interval '...'` scans without full table reads. | ✅ |
| `if not exists` on both indexes | Lines 109, 115 | Re-runnable. | ✅ |

**Side note (not a defect):** no index on `expires_at` for a "who is about to lapse in the next 24h" dashboard query. Brief §6 doesn't mandate one; B7 monitoring uses `computed_at` for staleness, not `expires_at` for lapse-soon. If a future dashboard adds that scan it can ship its own index in a follow-up — not a gap in this migration.

---

## 4. Check 2d — No DROP statements (additive-only, per A12 §2 logic-only note)

**PASS — with one footnote on idempotency-only DROPs.**

- **Production-data DROPs:** zero. Nothing drops an existing table, column, index, or grant.
- **Documentation-only rollback DROPs:** lines 44–47 are *commented* DOWN statements (`-- DROP TRIGGER … -- DROP FUNCTION … -- DROP TABLE …`). They are not executed.
- **Idempotency-pair DROPs:** two — `drop policy if exists entitlements_select_own on public.entitlements;` @ line 130 (followed by `create policy …`), and `drop trigger if exists entitlements_touch_updated_at on public.entitlements;` @ line 156 (followed by `create trigger …`). These are the **only** way to make a `CREATE POLICY` / `CREATE TRIGGER` idempotent in any Postgres version (PG16 included — no `CREATE POLICY IF NOT EXISTS` syntax exists). The migration's own comment @ lines 35–38 explicitly cites this and the 17 prior repo migrations that use the same pattern.

**Why this is not a real DROP risk:** the migration creates the entitlements table from scratch (`create table if not exists` @ line 57). Both DROPped objects (policy + trigger) are scoped to that same brand-new table. The DROPs cannot accidentally remove a foreign policy/trigger because:
1. On a first run, the policy/trigger don't exist — `IF EXISTS` is a no-op, the `CREATE` runs.
2. On a re-run, the policy/trigger were created by *this* migration on the previous run — DROP+CREATE just refreshes them to the same shape.

There is no third party that could install a *different* policy or trigger with the same name on a table that did not exist before this migration. ✅

---

## 5. Check 2e — Timestamp `20260519230000` collision check

**PASS.**

Pre-existing May timestamps on `origin/main`:
```
20260517000000_weekly_digest_aggregates.sql
20260518000000_latency_events.sql
20260519000000_mock_interview_rate_limit.sql
```
`#789`'s slot is `20260519230000` — **2026-05-19 23:00:00 UTC**, distinct from all of the above.

Concurrent dispatch banding (verified):
- `#789` (A17 entitlements table) → `20260519230000`
- `#792` (A11 retire T2 trigger + dead RPC, per A11 spec) → `20260519240000` (verified in #792 body)
- Both are distinct slots in a coordinated late-May-19 band; lexicographic order: A17 first, then A11.

Duplicate-timestamp scan across **all** migrations on `origin/main`:
```
ls supabase/migrations/ | awk -F_ '{print $1}' | sort | uniq -d
# → 20260622000000
```
A single pre-existing collision exists between `20260622000000_revoke_anon_on_internal_views.sql` and `20260622000000_secdef_browser_write_wrappers.sql` (June 22). This is a **pre-existing wart on main** unrelated to #789 — flagged for follow-up, not a #789 defect. `#789`'s `20260519230000` slot is unique.

Apply-order risk in `db push` is moot per the migration's own header (lines 21–28): **NOT auto-applied; SQL Editor only**. So even if a future timestamp collision appeared, it would not silently misorder this migration.

---

## 6. Check 2f — `recompute_entitlement_tx` RPC presence

**❌ GAP — RPC is NOT in #789.**

A8c flagged this as "do not know yet" honest flag #1. This verify resolves it: **#789 contains exactly one file** (`20260519230000_create_entitlements_table.sql`), and that file creates **the table only** (lines 57–99) plus its indexes (109–116), RLS (119–135), and `updated_at` trigger (140–160). No `create function public.recompute_entitlement_tx` anywhere in the file. Grep against `origin/main` and the #789 branch confirms zero references to `recompute_entitlement_tx` in any migration.

**Impact on A18 PR1:** A18 brief §6 mandates an atomic two-table write (entitlements UPSERT + `profiles.premium_*` projection) via a single `recompute_entitlement_tx(...)` RPC, because the Deno edge runtime has **no cross-table transaction** primitive. Without this RPC, the writer has two options:

1. Hard-block — refuse to ship A18 PR1 until a follow-up RPC migration lands. (Brief §6's stated stance: "If, at impl time, the RPC is not yet applied: implement against it anyway and block on G1 — do not fall back to two separate edge writes (drift risk; B68 §7 row 5 rates a stale projection 'critical drift').")
2. Ship A18 PR1 calling a not-yet-existing RPC name — it would error 4xx in prod on every invocation until the RPC migration applies. **Not acceptable.**

**Verdict:** the GAP is **on the workflow, not the migration**. #789's job per its own commit message is "the empty table only"; the brief's RPC requirement is downstream. A separate follow-up migration is needed before A18 PR1 dispatches. Suggested artifact name: `20260519231000_create_recompute_entitlement_tx_rpc.sql` (slots cleanly between #789 and #792, no collision).

**This A8d does NOT implement the RPC migration.** Out of scope per the brief.

---

## 7. Per-check PASS/FAIL summary

| # | Check | Verdict | One-line evidence |
|---|---|---|---|
| 2a | Table structure matches D1=table | ✅ **PASS** | PK `(user_id, app_id)` @ L98; `is_premium` GENERATED @ L85–88; server-write-only via RLS §3 |
| 2b | RLS — no anon read, service-role writes | ✅ **PASS** | RLS on @ L119; anon ungranted; authenticated SELECT-only; `entitlements_select_own using (auth.uid() = user_id)` |
| 2c | Indexes on hot paths | ✅ **PASS** | PK covers `loadEntitlement` point-get; partial `(app_id) where is_premium` + `(computed_at)` for B7 monitoring |
| 2d | No production DROPs (additive-only) | ✅ **PASS** | Only idempotency DROP+CREATE pairs on objects this migration owns; rollback DROPs are commented documentation |
| 2e | Timestamp `20260519230000` collision | ✅ **PASS** | Unique slot; banded coordination with #792 (`20260519240000`); the one pre-existing dupe on main is unrelated June 22 |
| 2f | `recompute_entitlement_tx` RPC present | ❌ **GAP** | Not in #789. Brief §6 mandates it. **Separate follow-up migration needed before A18 PR1.** |

**Overall:** the migration as-scoped — **create the empty entitlements table per A5 spec** — is **PASS, safe to apply via SQL Editor**. The §6 gap is a workflow item: A18 PR1 cannot dispatch until the RPC ships, but the table migration itself does not need to wait on the RPC.

---

## 8. Migration safety property summary (so Chau can apply with confidence)

- **Idempotent.** Every statement is `create … if not exists`, `drop … if exists` + `create`, `create or replace`, or an inherently re-runnable `grant`/`alter table … enable row level security`/`comment`. Re-running this migration on a database that already has the table is **zero-change, zero-error**.
- **Stage-safe.** Each block (table, indexes, RLS, trigger fn, trigger, comment) is independent — interrupted mid-apply leaves a valid intermediate state and the next re-run completes the rest.
- **Lossless rollback.** Table is a derived projection of `subscriptions` (+ gift source); dropping it discards no data not re-derivable. Rollback DDL is documented in the file header (lines 44–47).
- **No `supabase db push` path.** File header lines 21–28 forbid it explicitly. Memory anchors: `project_db_schema_drift_audit`, `agent-infra-access`, `project_578_rls_applied` — there is no unattended SQL/catalog path to this Supabase.
- **No prod data is changed.** This migration creates an empty table; backfill is a separate, later step (A5 §"Backfill plan") gated behind A18 PR1.

---

## 9. Pre-apply checklist for Chau's SQL Editor session

> Copy-ready. Same pattern as A2b's mylinh checklist.

### Step 0 — context
Open the migration locally for reference (do NOT paste yet):
```
gh pr view 789 --json files
# Or read on the branch:
# supabase/migrations/20260519230000_create_entitlements_table.sql
```

### Step 1 — pre-apply baseline (Supabase SQL Editor, read-only)
Confirm `public.entitlements` does NOT already exist on prod:
```sql
SELECT to_regclass('public.entitlements') AS exists_before_apply;
-- expect: NULL (table does not exist yet)
```
Confirm `public.profiles(id)` exists (cascade target):
```sql
SELECT to_regclass('public.profiles') AS profiles_table;
-- expect: public.profiles
```

### Step 2 — apply
Paste the **entire** contents of
`supabase/migrations/20260519230000_create_entitlements_table.sql` (PR #789)
into the Supabase SQL Editor and run.
Expected: no errors, no warnings.

### Step 3 — post-apply verification (lines 170–191 of the migration, uncommented for this run)
```sql
-- a) Column shape
SELECT column_name, data_type, is_nullable, column_default,
       is_generated, generation_expression
  FROM information_schema.columns
 WHERE table_schema = 'public' AND table_name = 'entitlements'
 ORDER BY ordinal_position;
-- expect: 7 columns; is_premium row has is_generated=ALWAYS and
--         generation_expression includes "active, trialing, grace_period, past_due"

-- b) RLS enabled
SELECT relrowsecurity AS rls_enabled
  FROM pg_class WHERE oid = 'public.entitlements'::regclass;
-- expect: true

-- c) Policies
SELECT polname, polcmd, polroles::regrole[]
  FROM pg_policy WHERE polrelid = 'public.entitlements'::regclass;
-- expect: 1 row — entitlements_select_own, cmd 'r' (SELECT), to authenticated

-- d) Grants — confirm authenticated has SELECT only, anon has nothing
SELECT grantee, privilege_type
  FROM information_schema.role_table_grants
 WHERE table_schema = 'public' AND table_name = 'entitlements'
 ORDER BY grantee, privilege_type;
-- expect: authenticated → SELECT only (no INSERT/UPDATE/DELETE);
--         no anon row.

-- e) Indexes
SELECT indexname, indexdef
  FROM pg_indexes
 WHERE schemaname = 'public' AND tablename = 'entitlements'
 ORDER BY indexname;
-- expect 3:
--   entitlements_pkey (UNIQUE, on user_id, app_id)
--   entitlements_is_premium_idx (partial, WHERE is_premium)
--   entitlements_computed_at_idx (on computed_at)

-- f) Trigger present
SELECT tgname, tgenabled
  FROM pg_trigger
 WHERE tgrelid = 'public.entitlements'::regclass
   AND NOT tgisinternal;
-- expect: 1 row — entitlements_touch_updated_at, enabled

-- g) Table is empty (backfill is a separate later step)
SELECT count(*) AS row_count FROM public.entitlements;
-- expect: 0
```

### Step 4 — record application
- Note timestamp of apply.
- Confirm to A18-workstream that G1 is now GREEN.
- **Do NOT mark A18 PR1 unblocked yet** — the `recompute_entitlement_tx` RPC (§6 of this report) is still required. Open the follow-up RPC migration scoping dispatch.

### Step 5 — if anything is unexpected
- Stop. Do not re-run.
- Capture the verification output and the exact error/warning text.
- Open an A8d-followup dispatch describing the deviation. Do not attempt corrective DDL unattended.

---

## 10. If any FAIL — fix description (no implementation; flag for separate PR)

The only flagged item is **§6 GAP — RPC missing**. The migration itself is PASS.

**Remediation (separate PR, not implemented here):**

- **Artifact:** new migration `supabase/migrations/20260519231000_create_recompute_entitlement_tx_rpc.sql` (slot between #789 and #792; no collision).
- **Scope:** a single `create or replace function public.recompute_entitlement_tx(p_user_id uuid, p_app_id text, p_status text, p_source text, p_expires_at timestamptz, p_now timestamptz) returns void` (signature TBD by the implementing agent; align with A18 brief §6 inputs).
- **Body:**
  1. `insert into public.entitlements (user_id, app_id, status, source, expires_at, computed_at) values (...) on conflict (user_id, app_id) do update set ... where excluded.computed_at >= entitlements.computed_at;` (monotonic guard — brief §6).
  2. `update public.profiles set premium_status = $3, premium_source = $4, premium_expires_at = $5 where id = $1;` (legacy projection — B48 invariant 1).
  3. Wrapped in a single Postgres transaction implicitly via the function body (`language plpgsql`, no explicit BEGIN needed).
- **Security:** `security definer` with `set search_path = public, pg_temp`. Revoke from `public` + `anon` + `authenticated`; grant only to `service_role`. Defense-in-depth matching #789's RLS design.
- **Idempotency:** `create or replace function …` is inherently re-runnable.
- **Apply mechanism:** same SQL Editor path as #789 (D6).
- **Open question for the RPC dispatch:** does it also need to write `entitlements_events` for audit, or is that a separate writer? Out of A8d scope.

**This A8d does NOT open that PR.** Future dispatch: `D4-followup-recompute-rpc-scoping` (or whatever label fits the tracker).

---

## 11. Summary table — for paste into A18 readiness when #789 applies

| Item | Before #789 applied | After #789 applied |
|---|---|---|
| G1 entitlements table | RED | **GREEN** |
| G2 `_shared/entitlement.ts` | GREEN (via #802) | unchanged |
| G3 casRetry helper | conditional (#766 open) | unchanged |
| G4 no `profiles.tier` reads | GREEN (via #774) | unchanged |
| `recompute_entitlement_tx` RPC | not present | **still not present — separate migration needed** |
| A18 PR1 dispatch-able | NO | **NOT YET** — still gated on the RPC migration above |

---

## Status

- **No SQL executed.** Read-only verify; no `psql`, no SQL Editor paste.
- **No production data touched.**
- **No code edited.** No migration file touched. No #789 branch edited.
- Pure documentation PR.

*A8d — read-only verify. The migration in #789 is PASS-as-scoped; one workflow gap (`recompute_entitlement_tx` RPC) is flagged for a separate follow-up migration before A18 PR1 dispatches.*
