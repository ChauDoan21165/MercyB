# Review — PR #837 (nullable audit tables migration)

**Reviewer:** A4 (self-review of a PR I authored as A4e — applying a deliberately clean eye)
**Branch:** `review/837-nullable-audit-tables` (off `origin/main` @ `424d9080f`)
**Subject:** [PR #837](https://github.com/ChauDoan21165/MercyB/pull/837) — `feat/audit-tables-nullable-user-id`
**Subject head:** `e0cdb5d7f` (single commit on the branch)
**Date:** 2026-05-19

---

## TL;DR — VERDICT: ✅ APPROVE

Migration is clean, idempotent, narrowly scoped (4 tables, one column each), has explicit pre + post-apply verification SELECTs documented inline, and is non-breaking for current behavior. One small caveat (constraint-name assumption) is mitigated by the post-apply verification step.

Apply via SQL Editor only — never `supabase db push` — per the migration's own header + memory `project_db_schema_drift_audit`.

---

## CI status snapshot

At time of review, partial pending:

| Check | Result |
|---|---|
| Lint Code | ✅ pass (1m33s) |
| Build Preview | ✅ pass (1m40s) |
| Lighthouse Mobile | ✅ pass (2m1s) |
| Vercel | ✅ pass |
| Vercel Preview Comments | ✅ pass |
| Build and Test | ⏳ pending |
| Validate Rooms | ⏳ pending |
| Comment on PR | ⏳ pending |

Migration is SQL-only — `Build and Test` runs the edge-fn Deno-check + vitest (irrelevant), `Validate Rooms` is content-side (irrelevant). Both pending → typical CI lag, not a substantive concern. **CI completion is a formality, not a blocker for this review's verdict.**

---

## 1. Per-table verification

All 4 tables follow the identical 3-statement pattern:

```sql
ALTER TABLE public.<t> ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.<t>
  DROP CONSTRAINT IF EXISTS <t>_user_id_fkey;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = '<t>_user_id_fkey'
       AND conrelid = 'public.<t>'::regclass
  ) THEN
    ALTER TABLE public.<t>
      ADD CONSTRAINT <t>_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES <auth.users|public.profiles>(id)
      ON DELETE SET NULL;
  END IF;
END
$$;
```

| Table | (a) DROP NOT NULL | (b) FK CASCADE → SET NULL | (c) Other columns untouched | (d) Idempotent | FK target |
|---|---|---|---|---|---|
| `email_sends_log` | ✅ | ✅ | ✅ | ✅ | `auth.users(id)` |
| `push_send_log` | ✅ | ✅ | ✅ | ✅ | `auth.users(id)` |
| `referral_audit_log` | ✅ | ✅ | ✅ | ✅ | `public.profiles(id)` ← correctly preserved (NOT `auth.users`) |
| `speech_analysis_logs` | ✅ | ✅ | ✅ | ✅ | `auth.users(id)` |

Each block is independent of the others (no shared object, no cross-table dependency). Safe to apply individually, safe to re-run.

### (d) Idempotency proof

- `ALTER COLUMN ... DROP NOT NULL` — Postgres explicitly documents this as a no-op when the column is already nullable. ✅
- `DROP CONSTRAINT IF EXISTS` — explicit `IF EXISTS` clause. ✅
- `ADD CONSTRAINT` is wrapped in `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint ...) THEN ... END IF; END $$` — the catalog check before adding prevents duplicate-add errors on re-runs. ✅

**Net effect of re-running:** zero changes after the first successful run. Safe.

---

## 2. Timestamp collision check

`20260519260000_make_audit_tables_user_id_nullable.sql`. Neighborhood on current main:

| File | Slot | PR |
|---|---|---|
| `20260518000000_latency_events.sql` | 2026-05-18 00:00 | — |
| `20260519000000_mock_interview_rate_limit.sql` | 2026-05-19 00:00 | — |
| `20260519230000_create_entitlements_table.sql` | 2026-05-19 23:00 | #789 |
| `20260519240000_retire_t2_trigger_and_dead_rpc.sql` | 2026-05-19 24:00 | #792 |
| `20260519250000_create_recompute_entitlement_tx_rpc.sql` | 2026-05-19 25:00 | #832 |
| **`20260519260000_make_audit_tables_user_id_nullable.sql`** | **2026-05-19 26:00** | **#837** ← this PR |
| `20260520000000_seed_practice_recommendations_flag.sql` | 2026-05-20 00:00 | — |

✅ **No collision** — slot 26:00 is free, and the coordinated 23:00/24:00/25:00/26:00 cluster keeps tonight's billing + privacy wave together in lexicographic order for the SQL Editor apply log.

---

## 3. GRANT / REVOKE / RLS check

Scanned the full diff (209 lines):

- ✅ Zero `GRANT` statements.
- ✅ Zero `REVOKE` statements.
- ✅ Zero `CREATE POLICY` / `DROP POLICY` statements.
- ✅ Zero `ALTER TABLE ... ENABLE/DISABLE ROW LEVEL SECURITY`.
- ✅ `ALTER COLUMN ... DROP NOT NULL` and `ALTER TABLE ... DROP/ADD CONSTRAINT` are pure DDL — they do not introduce, modify, or remove role privileges.

**Net permission delta: zero.** Existing RLS policies on all 4 tables remain intact. The `authenticated`, `anon`, and `service_role` grants are unchanged.

---

## 4. Runtime behavior verification

### Before this migration applies (current main today)

- `user_id NOT NULL`, FK `ON DELETE CASCADE`
- delete-account flow:
  - Pass 1 (`delete`) on these 4 tables: `DELETE FROM <t> WHERE user_id = $userId` → works, row removed
  - Pass 4 (`auth.users` delete): FK CASCADE has nothing to cascade (Pass 1 cleared the rows)
- Outcome: row is deleted. ✅

### After this migration applies, manifest still says `delete` (transition state)

- `user_id NULLABLE`, FK `ON DELETE SET NULL`
- delete-account flow:
  - Pass 1 still classifies these as `delete` → `DELETE FROM <t> WHERE user_id = $userId` → works, row removed
  - Pass 4: cascade no-op (rows already gone)
- Outcome: row is deleted (same as before). ✅ **Non-breaking.**

### After the follow-up manifest flip PR (target state)

- `user_id NULLABLE`, FK `ON DELETE SET NULL`
- delete-account flow:
  - Pass 1 no longer touches these 4 (re-classified to `anonymize`)
  - Pass 2 (`anonymize`): `UPDATE <t> SET user_id = NULL WHERE user_id = $userId` → ✅ works (NULL no longer rejected)
  - Pass 4: FK SET NULL fires on already-NULL columns (no-op)
- Outcome: row survives with `user_id = NULL`. A6d's retention goal (audit / cost-tracking / fraud-detection memory survives erasure) achieved. ✅

There is no point in the 3-step rollout (migration applies → manifest still `delete` → manifest flips to `anonymize`) at which `delete-account` misbehaves. The flip is order-independent of the existing Pass 1 / Pass 4 logic.

---

## 5. Combined-effect with #811 manifest

`#811` (merged at `dafa9b540`) currently has these 4 tables classified `delete` under a "SCHEMA-BLOCKED" header comment in `user-data-manifest.ts` citing this PR as the unblocker:

```
// ── B1: SCHEMA-BLOCKED → DELETE (target = anonymize per A6d, blocked by FK NOT NULL) ──
// schema-blocked: user_id NOT NULL + ON DELETE CASCADE — anonymize requires
// feat/audit-tables-nullable-user-id migration first (A4e).
// A6d rationale sound; blocked by FK constraint today.
```

Sequencing after this PR merges:

1. **Land this PR** (CI green + Chau review)
2. **Chau applies the migration via SQL Editor** (the pre + post-apply SELECTs documented in the migration header are the verification)
3. **Open a small follow-up manifest PR** that flips the 4 tables in `user-data-manifest.ts` from `delete` → `anonymize` and updates the existing in-file comment block. The unit test in `__tests__/user-data-manifest.test.ts` (from #811) asserts coverage by table name only — the flip is regression-test-safe.

The follow-up manifest PR is NOT in scope here; this PR is the schema prerequisite for it.

---

## 6. Caveats and risks

### Caveat 1 (minor): constraint-name assumption

The migration assumes the existing FK constraint follows Postgres default naming (`<table>_<column>_fkey`). All 4 original `CREATE TABLE` migrations use inline `user_id uuid NOT NULL REFERENCES … ON DELETE CASCADE` with no explicit `CONSTRAINT <name>` clause, so Postgres autogenerates the default name. The assumption holds for tracked-migration tables.

**Edge case:** if any of these 4 tables had its FK manually dropped/recreated in SQL Editor with a different constraint name (per memory `project_db_schema_drift_audit`, this Supabase has 179+ PROD_AHEAD relations from manual SQL-Editor work), the `DROP CONSTRAINT IF EXISTS <t>_user_id_fkey` would no-op. The guarded `ADD CONSTRAINT` would then add a new SET NULL FK alongside the still-present old CASCADE FK — Postgres allows multiple FKs on the same column, and the CASCADE rule would dominate (both rules fire, CASCADE wins for deletes).

**Mitigation already in place:** the migration's documented **post-apply verification SELECT** (the second commented SELECT block at the bottom) checks `delete_rule = 'SET NULL'` — if a stale CASCADE FK remained, the post-check would surface it because `delete_rule` would still report `CASCADE` from the dominant constraint. The migration header explicitly says "If ANY row reports … delete_rule != 'SET NULL': STOP — re-run the relevant ALTER block above; the migration is idempotent so re-running is safe."

This is acceptable for a Chau-applied SQL Editor migration. Not a blocker.

### Caveat 2 (minor): ACCESS EXCLUSIVE locks

Each `ALTER TABLE ... ALTER COLUMN` and `ALTER TABLE ... ADD CONSTRAINT` takes an `ACCESS EXCLUSIVE` lock on the table. For ~100 users with low concurrent writer load on these audit tables, this is trivially safe. If applied during a traffic spike, writers to these 4 tables would briefly block (sub-second). Not a real concern at current scale.

### Caveat 3 (informational): existing-data safety

`ALTER COLUMN DROP NOT NULL` does NOT touch existing rows. All existing rows in these 4 tables have `user_id` set (because the old constraint was NOT NULL). After the migration, the column simply *permits* NULL going forward. Existing data is unchanged. ✅

### Not a caveat: indexes

The FK constraint change doesn't affect indexes. `referral_audit_log` has `CREATE INDEX … ON public.referral_audit_log (user_id, created_at DESC)` from its original migration — this index survives the FK swap. ✅

---

## 7. What this PR does NOT do (intentionally)

- Does NOT flip the manifest — that's the follow-up PR (PRINCIPLES §3 one-bug-per-PR)
- Does NOT change RLS or grants
- Does NOT migrate or transform existing data
- Does NOT touch `delete-account/index.ts`, the manifest, or any tests
- Does NOT modify any other migration file

Scope is correctly narrow.

---

## 8. VERDICT — APPROVE

The migration is:

- ✅ **Per-table verification (1a–1d) all pass** — 4×4 cells in the verification grid
- ✅ **Timestamp 20260519260000 — no collision** with #789/#792/#832
- ✅ **No permission changes** — pure DDL on column nullability + FK ON DELETE behavior
- ✅ **Non-breaking** at every step of the 3-step rollout (apply → still-delete-manifest → flipped-anonymize-manifest)
- ✅ **Idempotent + stage-safe** — re-runnable, individual blocks runnable in isolation
- ✅ **Pre + post-apply verification SELECTs** documented inline — catches the constraint-name edge case
- ✅ **Scope correctly narrow** — schema prerequisite for a future manifest flip, nothing else

CI checks pending (Build and Test, Validate Rooms, Comment on PR) are SQL-only-irrelevant + typical lag, not substantive concerns.

**Apply ordering once approved:** Chau-driven via SQL Editor in the coordinated 2026-05-19 23/24/25/26 band; after the prior 3 PRs (#789, #792, #832) have applied. The migration's own header documents the apply protocol.

---

## References

- [PR #837](https://github.com/ChauDoan21165/MercyB/pull/837) — `feat/audit-tables-nullable-user-id` (this review's subject)
- [PR #811](https://github.com/ChauDoan21165/MercyB/pull/811) — manifest with the 4 schema-blocked tables citing this PR as the unblocker (MERGED at `dafa9b540`)
- `reports/PRIVACY-b1-manifest-classification-A6d.md` — A6d retention policy that drove the anonymize classification
- `reports/PRIVACY-delete-account-pipeline-A4g.md` (#847) — full pipeline map naming this PR as a queued follow-up
- Memory: `project_db_schema_drift_audit`, `project_578_rls_applied` — no unattended SQL path; SQL Editor only
