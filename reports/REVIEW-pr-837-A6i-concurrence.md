# Concurrence with A4i — PR #837 (nullable audit tables)

**Reviewer:** A6 (A6i, independent eye)
**Concurs with:** A4i's review at `reports/REVIEW-pr-837-A4i.md` on branch `review/837-nullable-audit-tables` (commit on that branch). A4i disclosed it as a self-review by the PR author with a deliberately clean eye; this is the independent second opinion the dispatch asked for.
**Verdict:** ✅ **APPROVE** — concur.

---

## Independent spot-checks (5/5 confirm A4i's findings)

I ran the dispatch's check list against the migration directly via `git show pr-837:supabase/migrations/20260519260000_make_audit_tables_user_id_nullable.sql`:

| Check | A4i said | A6i verified |
|---|---|---|
| `DROP NOT NULL` per table (×4) | ✅ all 4 | ✅ confirmed — `grep -n "DROP NOT NULL"` returns lines 89, 115, 142, 168 (one statement per table; line 35 is a comment). |
| `CASCADE → SET NULL` per table (×4) | ✅ all 4 with correct FK targets | ✅ confirmed — every `ADD CONSTRAINT` block has `ON DELETE SET NULL`; FK targets match the original `CREATE TABLE` statements (3× `auth.users(id)` + `referral_audit_log → public.profiles(id)` — A4i correctly flagged that one, verified against `20260524000000_referral_leaderboard.sql:referral_audit_log`). |
| Timestamp collision | ✅ none | ✅ confirmed — `ls supabase/migrations/ \| grep ^2026051926` returns only this file. The 23/24/25/26 cluster from #789/#792/#832/#837 is intact and lexicographically ordered. |
| Idempotent guards | ✅ all 3 layers | ✅ confirmed — `DROP NOT NULL` is doc'd no-op when already nullable; every `DROP CONSTRAINT` is `IF EXISTS`-guarded; every `ADD CONSTRAINT` is wrapped in a `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = ... AND conrelid = ...) THEN ... END IF; END $$` block. Re-runnable, individually runnable, partial-failure-safe. |
| No extra permissions | ✅ zero | ✅ confirmed — `grep -cE "^GRANT\|^REVOKE\|^CREATE POLICY\|^DROP POLICY\|ROW LEVEL SECURITY"` returns **0**. Pure column-nullability + FK-rule DDL; no role-privilege delta. |

A4i's Caveat 1 (constraint-name assumption + drift risk on manually-recreated FKs) is real and correctly mitigated by the documented post-apply verification SELECT. Caveat 2 (ACCESS EXCLUSIVE locks) is real and negligible at ~100-user scale. Caveat 3 (existing rows untouched) is correct Postgres semantics — confirmed.

A4i's 3-step rollout non-breaking analysis is correct: at every transition (apply → still-delete-manifest → flipped-anonymize-manifest), the delete-account flow produces the right outcome. A6d's retention policy unblocks naturally on the second flip.

## Nothing to add

No defects, no caveats A4i missed, no scope creep, no procedural concerns. The migration is the minimal schema prerequisite for the A6d retention-policy flip — narrow, idempotent, safely Chau-apply-via-SQL-Editor.

**Concur APPROVE.** The follow-up manifest-flip PR (4-line change in `user-data-manifest.ts` per A6f §3 BEFORE/AFTER block) is hard-gated on Chau applying this migration via SQL Editor first.

---

## Cross-references

- [PR #837](https://github.com/ChauDoan21165/MercyB/pull/837) — `feat/audit-tables-nullable-user-id`
- A4i's full review: `reports/REVIEW-pr-837-A4i.md` on branch `review/837-nullable-audit-tables`
- A6f decision record (#834, post-#837-backfill) — the standing policy this migration implements
- A6e crosscheck (#827) — original surfacing of the NOT NULL constraint that this PR removes
