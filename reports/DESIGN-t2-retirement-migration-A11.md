# DESIGN — T2 retirement migration spec (A11, 2026-05-19)

**Status:** design only. **NO migration file authored.** This document is the
specification a future Chau-applied SQL-Editor task implements against.
**Branch:** `b70/t2-retirement-design` (off `origin/main` @ `5cfa27e3f`).
**Operator artifact — no PR.**

**Inputs:** `reports/RECON-tier-trigger.md` (live `supabase db dump`
2026-05-17), `reports/RECON-profile-trigger-architecture-B27.md` + B63
binding-verification annotation (`b27/profile-trigger-audit` @ `2ad771084`),
`reports/RECON-billing-target-state-B48.md` (`b48/billing-target-state`).

---

## TL;DR

| Question | Answer |
|---|---|
| What retires? | **T2** trigger `trg_sync_profile_tier_from_payment` + its function `sync_profile_tier_from_payment_transactions()` + the dead sibling RPC `sync_profile_tier_from_latest_payment(uuid)` |
| What stays? | **T1** `profiles_freeze_privileged_columns` (live security control, orthogonal — B27 §1, §3). Untouched. |
| Other callers of the T2 function? | **None.** Only the prod-drift trigger binding calls it. Verified: no repo reference outside the fix migration. |
| Sibling RPC callers? | **Zero** (appears only in generated `types.ts` / `database.types.ts`). Confirmed B48 W6, RECON-tier-trigger §1b. |
| Technical prerequisite? | **None.** T2 is dormant by table-mismatch; both `profiles.tier` readers are already type-broken and consume nothing from T2 → drop is behavior-neutral in isolation (RECON-tier-trigger §4). |
| Planned sequence (B48)? | **P2**, lands **after B17 PR1 / #774 merges** (no gate reads `profiles.tier`). Defense-in-depth ordering, not a technical block. |
| Sequence vs. D2 (`profiles.tier` DROP)? | **T2 retire first (P2), `profiles.tier` DROP later (P3, gated on D2).** Never the same migration. |
| Apply mechanism? | **Chau, SQL Editor.** Schema-drift protocol — no unattended agent catalog/SQL path (memory `project_db_schema_drift_audit`, `project_pg_indexes_preflight`). NOT `supabase db push`. |
| Idempotency? | All `DROP … IF EXISTS`. Safe to re-run; safe if a prior partial apply already removed one object. |
| Reversibility? | One-way by intent (dead-write elimination). Rollback DDL provided for completeness but recreating drift is explicitly **not** recommended. |

---

## 1. What is being retired (and why it is safe)

T2 = `trg_sync_profile_tier_from_payment` on `public.payment_transactions`,
executing `public.sync_profile_tier_from_payment_transactions()`. Its job was
to mirror a paid tier into the `profiles.tier` text cache.

Three independent findings establish that retiring it changes **zero
observable runtime behavior**:

1. **Dormant by table-mismatch (B27 §2–§3).** Neither canonical real-money
   path (Stripe `stripe-webhook`, RevenueCat `revenuecat-webhook`) ever
   `INSERT`s into `payment_transactions`. T2 is reachable *only* by the
   gift/access-code redemption path (`redeem_access_code_atomic`). For every
   Stripe-paying user T2 never fires.
2. **Real binding is wider than INSERT (B63 verification).** The live binding
   is `AFTER INSERT OR UPDATE OF status` (catalog-derived from the 2026-05-17
   `pg_dump`, line 17693), not INSERT-only. This widens the *dormant* surface
   (a `pending → completed` status UPDATE also fired it) but does not change
   the dormancy verdict — the canonical paths still never touch the table.
   The retirement DDL drops the trigger regardless of event list, so the
   wider binding is immaterial to the spec.
3. **Readers already type-broken (RECON-tier-trigger §4).** `profiles.tier`
   is `text` in prod (`DEFAULT 'free'`); the two gates that read it
   (`stories/eligibility.ts` R1, `mock-interview` rate-limit R2) expect a
   *number*. They cannot act on what T2 writes today. So even on the gift
   path where T2 *does* fire, nothing downstream consumes its output.

`revenuecat-webhook` continues to write `profiles.tier` directly after
retirement (RECON-tier-trigger §3) — the column stays an IAP-only,
inconsistently-maintained legacy cache. Retirement does **not** orphan it;
the eventual column DROP is the separate, D2-gated P3 step (§4).

---

## 2. The retirement migration — exact DDL

> **Provenance of every object below: production SQL-Editor drift.** None of
> the trigger binding, the trigger function's *original* `CREATE`, the
> sibling RPC, or the `_col_exists` helper was ever created by a tracked
> migration. The only tracked artifact is
> `20260510010000_fix_sync_profile_tier_trigger.sql`, which is
> `CREATE OR REPLACE FUNCTION` **only** (it relies on the pre-existing drift
> binding by oid; it contains no `CREATE/DROP/ALTER TRIGGER`). **This
> retirement migration is therefore the FIRST tracked migration to touch
> T2's binding — see §6 for why that is correct and intentional.**

### 2a. Drop the trigger binding

```sql
DROP TRIGGER IF EXISTS trg_sync_profile_tier_from_payment
  ON public.payment_transactions;
```

`IF EXISTS` + table-qualified. If the binding was already manually disabled
or dropped in the SQL Editor before this runs, this is a safe no-op.

### 2b. Drop the trigger function

Verified zero non-trigger callers: `grep -rn
sync_profile_tier_from_payment_transactions src/ supabase/ api/ scripts/`
returns **only** the fix-migration file itself. The sole caller is the
binding dropped in 2a — so the function is safe to drop immediately after.

```sql
DROP FUNCTION IF EXISTS public.sync_profile_tier_from_payment_transactions();
```

No-arg function (it is a `RETURNS trigger` function — trigger functions take
no declared args). No `CASCADE` needed: after 2a there are no dependent
objects (RLS policies / views / other triggers do not reference it).
**Do not add `CASCADE`** — if the catalog disagrees and something *does*
depend on it, we want the migration to fail loudly rather than silently
drop an unknown dependent (CLAUDE.md "fail loud", testing-discipline memory).

### 2c. Drop the dead sibling RPC (recommended: same migration — see §3)

```sql
DROP FUNCTION IF EXISTS public.sync_profile_tier_from_latest_payment(uuid);
```

Signature from generated types (`types.ts:10025`):
`sync_profile_tier_from_latest_payment(p_user_id uuid) RETURNS text`. The
DROP matches on arg **type** (`uuid`), not arg name.

> **Catalog-verification gap (honesty caveat).** Agents have no
> `pg_proc`/`\df` path on this project (creds are the PostgREST
> service-role JWT only; no `SUPABASE_ACCESS_TOKEN`; memory
> `project_db_schema_drift_audit`). The `(uuid)` signature is inferred from
> generated types, which are accurate but could lag an overload. **Chau
> must run `\df sync_profile_tier_from_latest_payment` (or the §5 pg_proc
> query) in the SQL Editor before applying** and adjust the signature if an
> overload exists. `IF EXISTS` makes a wrong-signature DROP a no-op (not an
> error), so the failure mode is "RPC not actually dropped", caught by §5
> verification — not a destructive misfire.

### 2d. Recommended migration scaffold

Filename (see §6 + §4 for the timestamp rule):
`supabase/migrations/<TS>_retire_t2_profile_tier_sync.sql` where `<TS>` =
**one step greater than the highest migration timestamp across `main` and
every open billing branch at authoring time** (today: `main` tip is
`20260619000000_placement_sessions.sql`; `b48/billing-target-state`
carries `20260624000000_revoke_anon_residual_views.sql`; so author at
`≥ 20260625000000`). Migration order is filename-lexicographic; a
too-early timestamp would sort *before* its logical predecessors in any
future `supabase db push` reconciliation.

```sql
-- Retire T2: the dormant profiles.tier sync trigger on payment_transactions.
--
-- PROVENANCE: T2's trigger binding, the trigger function's original CREATE,
-- and the sibling RPC are PRODUCTION SQL-EDITOR DRIFT — created in no tracked
-- migration. The lone tracked reference,
-- 20260510010000_fix_sync_profile_tier_trigger.sql, is CREATE OR REPLACE
-- FUNCTION only and depends on the pre-existing drift binding by oid.
-- THIS IS THE FIRST TRACKED MIGRATION TO TOUCH T2'S BINDING. That is correct:
-- the retirement migration adopts the untracked object into version control
-- precisely so its removal is recorded. See reports/RECON-tier-trigger.md §1-2,
-- reports/RECON-profile-trigger-architecture-B27.md §1 (T2), and
-- reports/DESIGN-t2-retirement-migration-A11.md §6.
--
-- WHY RETIRE (not fix): dormant by table-mismatch (no real-money path inserts
-- payment_transactions); both profiles.tier readers are type-broken and
-- consume nothing from it; "fixing" it re-entrenches a second entitlement
-- source of truth (B27 §5 — violates one-owner-per-function). Behaviour-
-- neutral: revenuecat-webhook still writes profiles.tier directly; nothing
-- reads T2's output. RECON-tier-trigger §4.
--
-- KEEP T1 (profiles_freeze_privileged_columns) — orthogonal live security
-- control, NOT touched by this migration. B27 §1, §3.
--
-- APPLY: Chau, SQL Editor (schema-drift protocol). NOT supabase db push.

DROP TRIGGER IF EXISTS trg_sync_profile_tier_from_payment
  ON public.payment_transactions;

DROP FUNCTION IF EXISTS public.sync_profile_tier_from_payment_transactions();

-- Dead since inception: zero callers (generated types only). Same dead-write
-- elimination class; bundled to avoid a second near-identical money-path
-- migration. RECON-tier-trigger §1b, B48 W6.
DROP FUNCTION IF EXISTS public.sync_profile_tier_from_latest_payment(uuid);
```

**Not dropped here:** the `public._col_exists(text,text,text)` helper. It is
also untracked drift but is a generic schema-introspection utility — it may
have other callers this audit did not enumerate. Out of scope for T2
retirement; flag for a separate drift sweep, do not bundle.

---

## 3. Sibling RPC: same migration vs. separate — **recommend same**

`sync_profile_tier_from_latest_payment(uuid)` does the same
`update profiles set tier = …` write, has **zero callers** (B48 W6;
RECON-tier-trigger §1b — present only in generated `types.ts` /
`database.types.ts`).

- **RECON-tier-trigger §6 PR3** bundles all three DROPs into one ~10-line
  migration.
- **B48** slots the RPC deletion into the larger P2 consolidation PR
  ("entitlements table + single recomputeEntitlement + delete dead stacks",
  lines 203–204).

**A11 recommendation: include it in this T2 tombstone migration (§2c).**
Rationale: (a) identical dead-write-elimination class — same theme, same
money table neighborhood; (b) it is a zero-caller *pure* `DROP FUNCTION` —
no coupling to the entitlements-table work, nothing in the consolidation PR
depends on *when* it is dropped; (c) splitting it produces a second
near-identical migration touching the same concern for no benefit
(CLAUDE.md "small diffs", "one owner per function"). Keeping it with T2 does
not enlarge blast radius — both are dead. **Caveat:** dropping the RPC
leaves a stale entry in generated `types.ts` / `database.types.ts`; that is
a follow-up *code* regeneration (`supabase gen types`), **not** part of this
SQL migration, and is non-blocking (a type entry for a non-existent function
is inert). Note it in the retirement report so it is not lost.

If Chau prefers strict alignment with B48's PR partitioning, deferring 2c to
the consolidation PR is acceptable and changes nothing functionally — this
is a packaging preference, not a correctness question.

---

## 4. Ordering & sequencing

### 4a. Technical prerequisites: **none**

T2 is dormant (table-mismatch) and its only downstream readers are already
type-broken (RECON-tier-trigger §4). The trigger drop is behavior-neutral in
isolation **today**, with or without any other change. There is no DDL,
RLS, data backfill, or code change that must land *before* the DROP for it
to be safe.

### 4b. Planned sequence (B48 — defense-in-depth, not a technical block)

B48 classifies "B27 retire T2 + delete B25 numeric `tier>=N` bypass" as
**P2**, depending on **B17 PR1** (PR #774, `b25/tier-gate-fix-pr1`,
"premium gates read entitlement not stale `profiles.tier`", **P1
foundation**):

```
B17 PR1 (#774 merge)  ──▶  [no gate reads profiles.tier]  ──▶  T2 retirement (this spec, P2)
        (P1)                                                          │
                                                                      ▼
                                              D2 decision ──▶ profiles.tier DROP (P3)
```

Why sequence after #774 even though §4a says no technical block: it is
defense-in-depth. #774 makes "no code path reads `profiles.tier`" *true by
construction*; removing T2 *after* that means the dead write is eliminated
only once the (already-broken) reader path is also gone — so there is no
window, even theoretical, where a future "fix" to a reader could start
trusting a T2-populated value. Recommended: **author against this spec now;
apply after #774 merges.** If Chau wants to apply before #774, it is still
*safe* per §4a — document the deviation in the retirement report.

### 4c. Relative to D2 (`profiles.tier` column DROP) — strict order

D2 (B48: "`profiles.tier` text: DROP the column, or freeze forever?") gates
the **P3** `profiles.tier` column DROP. **T2 retirement (P2) must precede
the column DROP (P3), never share a migration with it:**

- Dropping T2 first means the column, once D2 decides DROP, has *no
  remaining writer except `revenuecat-webhook`* — a clean, enumerable
  cutover.
- A combined "drop trigger + drop column" migration couples a
  behavior-neutral cleanup to a column removal that requires the D2
  decision *and* a `revenuecat-webhook` write-path change first. Different
  gates, different risk, different review — keep apart (CLAUDE.md "central
  files are dangerous", "small diffs over smart diffs").

T2 retirement is **not** itself gated on D2; only the column DROP is.

### 4d. B25 numeric `tier>=N` bypass deletion

B27 §5 and B48 pair "retire T2" with "delete B25's numeric `tier >= N`
bypass". That bypass deletion is a **code** change (gate logic), not DDL —
out of scope for this *migration* spec. It belongs with the B17/#774
reader-migration workstream. Flag it as the companion code task so the two
are tracked together, but do not fold app code into the SQL migration.

---

## 5. Verification — run in SQL Editor after applying

Agents have no `pg_trigger`/`pg_proc` path on this project (memory
`project_pg_indexes_preflight`, `project_db_schema_drift_audit`).
Verification is Chau-run in the SQL Editor.

**Pre-apply (capture baseline + confirm sibling RPC signature):**

```sql
-- Expect: trg_sync_profile_tier_from_payment row present (it is live drift).
select tgname, tgenabled, tgtype,
       (select proname from pg_proc p where p.oid = t.tgfoid) as fn
from pg_trigger t
where tgrelid = 'public.payment_transactions'::regclass
  and not tgisinternal;

-- Confirm exact arg signature(s) before the DROP in §2c (overload check).
select p.oid::regprocedure as signature, p.prosecdef
from pg_proc p
where p.proname in ('sync_profile_tier_from_payment_transactions',
                    'sync_profile_tier_from_latest_payment');
```

**Post-apply (must return ZERO rows for the retired objects):**

```sql
-- 1. Trigger gone from payment_transactions.
select tgname
from pg_trigger
where tgrelid = 'public.payment_transactions'::regclass
  and tgname = 'trg_sync_profile_tier_from_payment'
  and not tgisinternal;
-- expect: 0 rows

-- 2. Both functions gone.
select proname, oid::regprocedure as signature
from pg_proc
where proname in ('sync_profile_tier_from_payment_transactions',
                  'sync_profile_tier_from_latest_payment');
-- expect: 0 rows

-- 3. T1 freeze trigger STILL present (must NOT have been touched).
select tgname, tgenabled
from pg_trigger
where tgrelid = 'public.profiles'::regclass
  and tgname like '%freeze_privileged_columns%'
  and not tgisinternal;
-- expect: exactly 1 row, tgenabled = 'O' (enabled)
```

Verification (3) is the critical guardrail: it proves the retirement did
**not** collateral-damage the live security control. If (3) returns 0 rows,
**stop** — something dropped T1; do not proceed.

---

## 6. The out-of-band concern — documented

T2 was created **out-of-band**: there is no migration that `CREATE`s its
trigger binding, no migration that `CREATE`s its trigger function's original
definition, and no migration that `CREATE`s the sibling RPC. The lone
tracked reference, `20260510010000_fix_sync_profile_tier_trigger.sql`, is a
`CREATE OR REPLACE FUNCTION` hot-fix that explicitly *depends on* the
pre-existing untracked binding (RECON-tier-trigger §1; B27 §1 T2 row).

**This retirement migration is therefore the first tracked migration to
touch T2's binding — and that is correct and intentional, not a defect:**

- The standard "a DROP migration must pair with the CREATE migration" rule
  does not apply when the object's creation was never tracked. There is no
  CREATE migration to pair with — by definition.
- Adopting an untracked drift object into version control *at the moment of
  its removal* is the correct reconciliation: the migration's comment block
  (§2d) records the object's full provenance, why it existed, why it is
  dormant, and why it is being removed. The version-control history then
  contains a complete account of the object even though its birth was
  out-of-band.
- This matches the established drift protocol on this project: SQL-Editor
  drift is reconciled by Chau-applied, human-reviewed migrations, never by
  an unattended agent path (memory `project_db_schema_drift_audit`,
  `project_578_rls_applied` — #578/#562 applied via SQL Editor, not
  `db push`). The retirement migration is authored into
  `supabase/migrations/` for the record and for future `db push`
  reconciliation ordering (§4), but is **applied by Chau via the SQL
  Editor**, not by `supabase db push`.

The `_col_exists` helper and the trigger binding being untracked also means
a repo-only reviewer cannot see them — the migration comment block must
state this explicitly so future agents do not "rediscover" the drift as a
new finding.

---

## 7. Prerequisites & downstream effects (summary)

**Prerequisites to author this migration:** none (this spec is complete).

**Prerequisites to *apply* it (recommended):**
- B17 PR1 / PR #774 merged (P1) — defense-in-depth, not a technical block
  (§4b). Applying before #774 is *safe* but should be documented as a
  deviation.
- Chau runs the §5 pre-apply pg_proc query to confirm the sibling RPC
  signature (catalog-verification gap, §2c).

**Downstream effects of applying:**
1. `profiles.tier` loses its (dormant) payments-path writer. Net runtime
   behavior change: **none** (RECON-tier-trigger §4 — nothing consumed it).
   `revenuecat-webhook` remains the only writer; the column becomes a clean
   IAP-only legacy cache with a single enumerable writer.
2. Generated `types.ts` / `database.types.ts` carry a stale
   `sync_profile_tier_from_latest_payment` entry until regenerated —
   **follow-up code task**, non-blocking, inert.
3. Unblocks the **D2** decision on `profiles.tier` (P3 column DROP): after
   T2 is gone the column's writer set is trivially enumerable.
4. Companion (separate, code, not this migration): delete B25's numeric
   `tier >= N` bypass (§4d) — tracked with the B17/#774 workstream.
5. The `b27/profile-trigger-audit` worktree's "do not prune until the
   T2-retirement migration is authored" hold (B36 disposition) is **partly
   discharged by this design** but fully discharged only when the migration
   *file* is authored — keep that worktree until then.

**Not affected:** T1 `profiles_freeze_privileged_columns` (kept, verified by
§5 post-check #3), `_col_exists` (out of scope — separate drift sweep),
Stripe/RevenueCat write paths, `me-entitlement` (never read `profiles.tier`).
