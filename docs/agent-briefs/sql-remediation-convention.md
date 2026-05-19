# SQL Remediation Convention — for prod-write blocks

> Status: living convention. Established by B29 (2026-05-19) after A94, B5,
> and B21 each produced a one-off prod-write `UPDATE` whose scope,
> gift-safety, and idempotency Chau had to verify by hand-reading the block.
> Sibling of `recon-doc-convention.md`; owns the
> `reports/REMEDIATION-*.sql` namespace.

## The problem this solves

A diagnostic dispatch finds a money-path or data-shape defect, and the
correct next step is a small, targeted prod write — flip two stale
`subscriptions` rows to `revoked`, correct one user's `current_period_end`,
fix a trigger. The agent writes the SQL. Then one of two things goes wrong:

1. **The block dies with the worktree.** B5 produced per-user remediation
   SQL during a live terminal diagnostic; it was pasted to chat, never
   committed, and is now **unrecoverable** (see
   `reports/RECON-mylinh-paid-but-free-B5.md` → "The remediation SQL … is
   not on disk. Do not reconstruct or run it"). A94's U1/U2 cleanup SQL
   had the same fate — it survives **only** because B21 independently
   reconstructed it into `B21-remediation.sql`. The investigation cost is
   paid; the executable output evaporates; the next agent rebuilds it from
   scratch under time pressure. This is the exact failure the recon-doc
   convention fixes for *findings* — it applies identically to *remediation*.

2. **Chau has to audit safety by reading prose.** Every block arrives in a
   different shape. Is it keyed on a primary key or on a predicate that
   might sweep up unintended rows (A94 caught precisely this versus A77)?
   Does it touch a user who is independently entitled — a gift comp,
   a manual grant — that must not be revoked? Is it safe to re-run, or
   does a second paste double-apply? Where's the before/after proof?
   Chau answers all of this by hand, per block, every time.

**The fix is a fixed shape.** A prod-write block that always has the same
seven parts is verifiable in one read, safe to re-run, and survives its
worktree because — like a recon doc — **the commit is the deliverable, not
the file.**

This convention does not change *how* remediation reaches prod. The hard
rule stands: **there is no unattended SQL path to this Supabase.** Every
block is applied by Chau, **once**, via the Supabase **SQL Editor**, after
human review — never `supabase db push`, never an agent (RLS/data
migrations are SQL-Editor + human-reviewed; see CLAUDE.md → Supabase, and
the `project_db_schema_drift_audit` / `project_578_rls_applied` memory).
The convention makes that human review a 60-second eyeball instead of a
forensic re-derivation.

## The convention

### 1. File path

```
reports/REMEDIATION-<topic-slug>-<agent-id>.sql
```

- `reports/` — committed to the agent's branch, not left loose at worktree
  root (B21's `B21-remediation.sql` lived at root, uncommitted — one prune
  from gone). The commit is the load-bearing step.
- `<topic-slug>` — the defect, kebab-case: `stale-sub-rows`,
  `mylinh-period-end`, `failed-deletion-events`.
- `<agent-id>` — the dispatch label (`A94`, `B21`, …). Makes provenance
  readable from `ls` and stops two agents remediating overlapping scope
  from colliding on one file. **Never** write to a generic `remediation.sql`.
- **Pairs with a recon doc.** A `REMEDIATION-*.sql` is the *executable*;
  the matching `reports/RECON-<topic>-<agent>.md` is the *evidence* that
  justifies the exact PK list. The SQL header points at the recon doc; the
  recon doc's "Fix recommendation" points at the SQL. Neither ships alone.

### 2. The seven mandatory parts

A prod-write block missing any of these is not reviewable in one read and
is rejected back to the author.

| # | Part | Why |
|---|---|---|
| 1 | **PK-targeting** | `WHERE id IN ('<uuid>', …)` — the exact primary keys, enumerated. **Not** a predicate (`WHERE status='past_due' AND updated_at < …`). A predicate describes the rows you *think* match; it also matches rows you haven't seen. A94 vs A77: the predicate would have swept unintended rows; the PK list could not. |
| 2 | **Independent-entitlement guard** | An explicit clause (and a header sentence) proving the write cannot revoke a user who is entitled by a *different* mechanism. B21's exemplar: gift comps live in `public.user_subscriptions` (`is_gift_redemption=true`), a different table, structurally untouched — the UPDATE only corrects the stale Stripe mirror row in `public.subscriptions`. State which independent grants exist in scope and why each is unreachable. |
| 3 | **Idempotency guard** | A predicate that the *target state* fails — e.g. `AND status = 'active'` on a block that sets `status='revoked'`. A second run matches 0 rows. Re-pasting is a no-op, not a double-apply. Annotate the expected row count inline (`-- expect 1 row`). |
| 4 | **PREVIEW (verify-before)** | A `SELECT` of the exact PK rows and the columns the UPDATE touches, run *before* any write. The reviewer eyeballs current state and confirms the PK list resolves to exactly the intended rows — no commit yet. |
| 5 | **VERIFY-AFTER** | A `SELECT` of the same PKs confirming the intended rows reached the target state **and** the expected row count, plus a guard `SELECT` showing the independent-entitlement rows (part 2) are unchanged. Proves the write did what it claimed and *only* that. |
| 6 | **BEGIN / ROLLBACK→COMMIT wrapper** | The whole write is wrapped `BEGIN; … ROLLBACK;`. First execution runs with `ROLLBACK` — preview + update + verify all run, nothing persists. The operator reads the verify output, then changes the single final word to `COMMIT;` and re-runs. The wrapper *forces* a manual review gate; it cannot be skipped by a careless paste. |
| 7 | **Header comment block** | Names: producing **agent-id**; the **scope** (which PKs / users / rows); what is **explicitly EXCLUDED** and why (the rows the predicate *would* have caught but are deliberately out — B21 carved out the unattributable `evt_…PJL` event by name); **execution status** (`HANDOFF ONLY — NOT EXECUTED by <agent>`); and the **apply path** (Supabase SQL Editor, human-reviewed, apply **ONCE**, never `db push`). The header is what lets the next reader trust the block without re-deriving it. |

### 3. Commit, do not PR

Identical to the recon-doc rule, for the same reason:

- **Commit the `.sql` to the agent's branch.** `git add
  reports/REMEDIATION-<topic>-<agent>.sql && git commit`. The commit is
  what survives `git worktree prune`. B5's loss is the cautionary case;
  B21-as-root-file was a near-miss.
- **Do not open a PR for a remediation block.** It is an operator artifact
  for Chau to paste into the SQL Editor, not application code that ships
  through review→merge→deploy. A PR invites a code-review cycle on
  something that never enters the build.
- **Exception — remediation as spec.** If the block is the handoff
  specification for a follow-up (e.g. a bulk-remediation dispatch that
  will generalize the one-off), push it as a **draft PR** so the
  implementer has a stable URL. Draft, never a merge candidate.
- This *convention doc itself* ships via a normal docs PR (you are reading
  the artifact of one). Process documentation is shippable; the remediation
  blocks it governs are commit-don't-PR.

### 4. Lifecycle

- `REMEDIATION-*.sql` accumulates in `reports/`. After Chau applies one,
  it is **history, not direction**: add a one-line
  `-- APPLIED via SQL Editor <date> — verified <N> rows; do not re-run`
  banner at the top (mirrors the recon-doc `> SUPERSEDED` banner). The
  idempotency guard (part 3) means a stray re-run is already safe, but the
  banner stops anyone wondering whether it ran.
- Authoring agents never delete another agent's remediation file. The
  periodic cleanup dispatch prunes applied/superseded ones, same as recon
  docs.
- If a block is superseded by a code fix (the defect class is fixed at the
  write path, e.g. B11's `period_end` field-order fix), banner it
  `-- SUPERSEDED by PR #NNN` — keep the row history of what we corrected.

## Template skeleton

Copy this; fill every bracket; delete no part.

```sql
-- ============================================================================
-- <AGENT-ID> — Remediation: <one-line defect description>
--
-- STATUS:    HANDOFF ONLY. NOT EXECUTED by <AGENT-ID>. Read-only diagnostic
--            produced this. Apply ONCE via Supabase SQL Editor, human-reviewed.
--            Never `supabase db push`. No unattended path to this Supabase.
-- EVIDENCE:  reports/RECON-<topic-slug>-<AGENT-ID>.md  (the PK list is
--            justified there; do not trust this file standalone).
-- SCOPE:     <which PKs / users / rows — enumerate>.
-- EXCLUDED:  <rows a predicate WOULD catch but are deliberately out, + why.
--            e.g. "evt_…PJL — unattributable, resolve by hand via Stripe">.
-- INDEPENDENT ENTITLEMENTS: <gift/manual grants in scope and why each is
--            structurally unreachable by the UPDATE below>.
-- ============================================================================

BEGIN;

-- ---- PREVIEW (run first; expect <N> rows in pre-state) ---------------------
SELECT <pk>, <touched cols>
FROM   <schema.table>
WHERE  <pk> IN (<uuid-1>, <uuid-2>);                 -- PK-targeted, part 1

-- ---- UPDATE (idempotency-guarded; expect <N> rows) ------------------------
UPDATE <schema.table>
SET    <col> = <target>,
       updated_at = now()
WHERE  <pk> IN (<uuid-1>, <uuid-2>)                  -- PK, not predicate
  AND  <discriminator> = <expected>                  -- e.g. provider='stripe'
  AND  <col> <> <target>;                            -- idempotency, part 3

-- ---- VERIFY-AFTER: intended rows reached target state ---------------------
SELECT <pk>, <col>, updated_at
FROM   <schema.table>
WHERE  <pk> IN (<uuid-1>, <uuid-2>);                 -- expect all <target>

-- ---- GUARD: independent entitlements untouched ---------------------------
SELECT <pk>, is_gift_redemption, <entitlement cols>
FROM   public.user_subscriptions                     -- the OTHER table
WHERE  user_id IN (<user-1>, <user-2>);              -- expect unchanged

-- First run with ROLLBACK. Read the verify + guard output. Only then change
-- the line below to `COMMIT;` and re-run.
ROLLBACK;
-- ============================================================================
```

## Checklist for a remediation dispatch (paste into the brief)

```
[ ] SQL written to reports/REMEDIATION-<topic-slug>-<agent-id>.sql
[ ] Paired recon doc reports/RECON-<topic>-<agent>.md exists and is
    cross-linked (SQL header → recon; recon "Fix recommendation" → SQL)
[ ] All 7 parts present: PK-targeting, independent-entitlement guard,
    idempotency guard, PREVIEW, VERIFY-AFTER, BEGIN/ROLLBACK→COMMIT
    wrapper, header (agent / scope / EXCLUDED / status / apply path)
[ ] Targeting is PK-based, NOT predicate-based (A94-vs-A77 rule)
[ ] Header states HANDOFF ONLY — NOT EXECUTED; apply path = SQL Editor,
    once, human-reviewed, never `db push`
[ ] Committed to the agent's branch (NOT just written to disk / chat)
[ ] No PR opened — UNLESS the block is a spec for a follow-up dispatch,
    then: draft PR
[ ] Report states the .sql path + commit SHA; does NOT claim it was applied
```

## Related

- `docs/agent-briefs/recon-doc-convention.md` — the sibling. Recon doc =
  evidence; this = the executable derived from it. They ship as a pair,
  both commit-don't-PR.
- `docs/agent-briefs/preflight-checklist.md` (B8) — verifying load-bearing
  brief claims before dispatch; "was this scope already remediated?" is
  one such claim.
- `docs/agent-briefs/INDEX.md` — the process-doc map; this file is row 3
  of the `docs/agent-briefs/` set.
- CLAUDE.md → Supabase ("migrations … human-reviewed before applying";
  `supabase db push` drift caveat) and Operating discipline (small diffs
  over smart diffs; permissions are product logic; checkpoint every risky
  step) are the *policy*; this doc is how a prod-write block is shaped so
  the policy is enforceable in one read.
- Memory: `project_db_schema_drift_audit`, `project_578_rls_applied`,
  `project_agent_infra_access` — all record the same invariant: no
  unattended SQL path; SQL Editor + human review only.
- Labels: `money-path`, `stale-audit-note`. Most remediation blocks are
  money-path; a block whose scope a later read shows is already applied is
  the `stale-audit-note` class — banner it, don't re-run.
