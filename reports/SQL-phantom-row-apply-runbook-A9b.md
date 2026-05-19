# Phantom-row apply runbook — Step 0 verify + A94 loss formalization (A9b)

> Companion to PR #800 (`docs(security): P0 SQL batch — anon RLS revoke +
> phantom rows`). Treat that PR as the source of truth for the cleanup SQL
> itself; this doc adds (a) a "verify-current-count-before-apply" Step 0 to
> guard against drift between B21's 2026-05-19 read and the moment Chau hand-
> applies, and (b) formal closure of the lost-A94-canonical-SQL question so a
> future agent doesn't re-derive it noisily.
>
> Apply-direction-of-truth chain:
> **A9b (this doc) → A9 PR #800 §Section 2 → `b21/failed-deletion-events`**
> (`reports/REMEDIATION-stripe-deletion-events-B21.sql`, paired recon
> `reports/RECON-failed-deletion-events-B21.md`).

---

## Step 0 — pre-apply count VERIFY (run this first)

B21's row-count measurement (2 phantom rows, both `status='active'`,
`updated_at` unchanged since 2026-04-09) is dated **2026-05-19**. Between
that read and the moment Chau hand-applies, the count can move three ways:

| Δ since 2026-05-19 | Cause | Action |
|---|---|---|
| count == 2, both still `active`, both still `updated_at 2026-04-09` | Nothing has changed — the SQL is still valid as written | **Proceed to Step 1** |
| count == 2 but one/both already `revoked` | Someone (or a delayed Stripe retry) already applied a fix | **STOP — Step 2** (do not re-`UPDATE`; the idempotency guard would no-op safely, but a count drift means our assumptions changed and the verify should be re-read first) |
| count == 0 (rows gone) or count > 2 (new phantoms) | Schema-level change (purge / new failed-delete window) | **STOP — Step 2** (re-diagnose; do NOT auto-apply B21's old SQL) |

**Run this query in the Supabase SQL Editor:**

```sql
-- Step 0 — pre-apply phantom-row VERIFY (verbatim from PR #800 §Section 2)
-- Expect (per B21, 2026-05-19): 2 rows, both status='active', updated_at = 2026-04-09 …
SELECT id, user_id, provider, status, provider_subscription_id,
       current_period_end, canceled_at, ended_at, updated_at
FROM   public.subscriptions
WHERE  id IN ('c3496ebe-e584-4c3c-a92a-1d2a32a69072',   -- U1 chaudoanproton@proton.me
              '03fb832c-81d8-426f-b73c-e899fc4eeaae');  -- U2 chaudoan@yahoo.com
```

**Decision rule:** if Step 0 returns anything **other than** 2 rows, both
`status='active'`, both `updated_at` unchanged from 2026-04-09 — **STOP and
report the actual output to a dispatch**. Do not proceed to Step 1.

---

## Step 1 — proceed (count matches)

If Step 0 matched B21's 2026-05-19 read exactly, apply
**PR #800 § Section 2** as written:

1. `BEGIN;` then the two `UPDATE` statements (PK-targeted, provider/sub-id
   guarded, `AND status='active'` idempotency guard).
2. The "verify after" `SELECT` (expect 2 rows, both `status='revoked'`,
   `canceled_at` + `ended_at` populated, `updated_at = now()`).
3. If verify-after looks right, re-run the same block with `COMMIT;`
   in place of `ROLLBACK;`.

The full block is in `reports/SQL-p0-rls-phantom-A9.md` §Section 2 on
`chore/rls-phantom-package` (PR #800). Do not transcribe it by hand —
paste from the merged file in `main`.

**Out of scope (do NOT extend Step 1 to cover):**
- `evt_1TUxM52K1tPxy04udiaKvPJL` (UNKNOWABLE) → separate pending #4
  (`RUNBOOK-evt-1TUxM5-lookup.md` on `b28/unknowable-event-lookup`).
- `public.user_subscriptions` (different table; U1's gift comp 2030→2031
  is structurally untouched — that table is **not** edited by Step 1).

---

## Step 2 — count changed → re-diagnosis required

If Step 0 didn't match, the assumption set behind PR #800 §Section 2 has
moved. **Do not auto-apply the old SQL.** Instead:

1. **Capture the new Step-0 output verbatim** (PK list, `status` per PK,
   `updated_at` per PK).
2. **Open a new diagnostic dispatch** with a brief like:
   > Phantom-row Step-0 verify diverged from B21's 2026-05-19 read. New
   > output: \<paste\>. Determine whether the divergence is (a) an already-
   > applied fix, (b) a Stripe-side reconciliation, (c) a new
   > failed-delete window, or (d) a row purge. Produce
   > `reports/RECON-phantom-row-step0-divergence-<agent>.md` per the recon
   > convention, then propose updated cleanup SQL if any is still needed.
3. **Block the apply** until that recon lands. The phantom-row item is
   🟡 MRR-hygiene only (zero paying impact); blocking is safe.

---

## A94 loss section — formal closure

### What A94 was

Per `reports/PENDING-CHAU-ACTIONS-2026-05-19.md` §5, A94 was the dispatch
that **owned** the stale-`subscriptions` cleanup scope (branch
`a94/stale-sub-rows-cleanup`). Its job was to produce the canonical
cleanup SQL for the U1/U2 phantom rows from the pre-PR-#561
`[object Object]` failed-delete window. The recon was performed by B21
(read-only forensic, branch `b21/failed-deletion-events`); A94 was meant
to be the **remediation** layer on top.

Adjacent context:

- A94 also picked up part of A77's webhook attribution work because
  A77 left only raw JSON dumps and probe scripts in its `/private/tmp`
  worktree, no markdown — when that worktree was pruned A94 had to redo
  half of A77's attribution to recover what A77 already knew
  (`docs/For_Chau_Study.md:93`, `docs/agent-briefs/recon-doc-convention.md:19`).
  That is the inherited burden A94 carried into the cleanup-SQL step.
- The A94-vs-A77 hazard is named in
  `reports/REMEDIATION-gift-victim-repair-A28-CORRECTED.sql:106`
  ("it is NOT a predicate sweep; A94-vs-A77 hazard avoided") — i.e. the
  A28 author knew enough about A94's scope to deliberately keep their
  own SQL from overstepping it.

### What is lost

`reports/PENDING-CHAU-ACTIONS-2026-05-19.md` §5, lines 133–134, verbatim:

> "A94's *canonical* SQL is lost (branch empty); the **B21 file is the
> surviving cross-checked executable** — treat it as the apply candidate."

The branch `a94/stale-sub-rows-cleanup` exists and its tip
`629a26cb9` (`fix(a11y+i18n): PhoneOtp Vietnamese localization +
ResetPassword live region (#737)`) is just an `origin/main` commit
from the day A94 was dispatched. **No A94-specific commit exists on
the branch.** The worktree at `/private/tmp/A94-stale-sub-cleanup`
contains only three **untracked** `probe*.mjs` files (verified this
run). One `git worktree prune` removes them — same failure mode as
A77's JSON dumps.

### Search log — what A9b grep'd

A9b ran the following on 2026-05-19 in the A9b worktree:

```
git log --all --oneline --grep="A94\|stale.sub"
git log --all --oneline a94/stale-sub-rows-cleanup
grep -rn "A94" /Users/admin/MercyB/reports/ /Users/admin/MercyB/docs/
grep -rn "a94/" /Users/admin/MercyB/reports/ /Users/admin/MercyB/docs/
find /private/tmp/A94-stale-sub-cleanup -maxdepth 3 -name "*A94*" -o -name "*a94*"
find /private/tmp/A94-stale-sub-cleanup -maxdepth 3 -name "*phantom*" -o -name "*stale*sub*"
```

Hits, in their entirety:

- `reports/PENDING-CHAU-ACTIONS-2026-05-19.md` — three mentions
  (header table, §5 title, §5 body "A94's canonical SQL is lost").
- `reports/REMEDIATION-gift-victim-repair-A28-CORRECTED.sql:106` — A28's
  comment about avoiding the A94-vs-A77 hazard.
- `docs/For_Chau_Study.md:93` — A94 had to redo half of A77's attribution.
- `docs/agent-briefs/recon-doc-convention.md:19` — same point.
- `git log --grep` for "A94" or "stale.sub" → **0 commits matched.**
- `git log a94/stale-sub-rows-cleanup` → tip is `629a26cb9` (an `origin/main`
  commit; no A94-authored work above it).
- `find` for any A94-named or phantom-named file in the worktree → only the
  three untracked `probe*.mjs` (`probe.mjs`, `probe2.mjs`, `probe3.mjs`).

**No A94 dispatch brief file was located.** If one existed it was either
in a chat transcript (ephemeral) or in a `/private/tmp/A94-*` working file
that was never committed.

### A9b recommendation: **close A94 as superseded by B21**

The phantom-row scope is now demonstrably covered by:

1. `reports/RECON-failed-deletion-events-B21.md` (committed on
   `b21/failed-deletion-events`, pushed to `origin` by PR #800 work) — the
   recon doc A94 was meant to act on, with the U1/U2 PKs and the gift-safety
   guard.
2. `reports/REMEDIATION-stripe-deletion-events-B21.sql` (same branch) — the
   surviving cross-checked executable cleanup SQL.
3. `reports/SQL-p0-rls-phantom-A9.md` (PR #800) — the paste-ready package
   that re-emits the B21 SQL with attribution, run order, and verify queries.
4. **This doc** — the Step-0 pre-apply guard so the B21 measurement is
   re-confirmed before any UPDATE fires.

Re-dispatching A94 would produce **the same SQL B21 already produced**,
operating on **the same two PKs**, with no new evidence to discover (the
forensic black hole behind the failure path means no DB-side re-derivation
is possible anyway — `RECON-failed-deletion-events-B21.md` §"Root cause"
point 2). The "NON-CANONICAL" banner on the B21 SQL file is precautionary
language about an A94 version that does not exist on disk; the operational
status remains: **B21's file is the apply candidate**, as
PENDING-CHAU-ACTIONS §5 records.

**Closure note (to be added when this runbook merges):** mark the A94
row in the pending index as **CLOSED — superseded by B21** with a link to
this doc. Do not delete the row; the audit trail is more valuable than the
shorter index.

### Reject case: when re-dispatch would be the right call

Re-dispatch A94 only if **all three** of these turn true:

1. Step 0 (this doc) reveals a count divergence that cannot be explained
   by an already-applied fix.
2. The new state of `public.subscriptions` shows phantom-class rows
   **outside** the U1/U2 PK pair.
3. The recon required to scope the new pair exceeds what one B-series
   recon dispatch can deliver in a single read-only sweep.

None of those are true today.

---

## Reference

- **Source-of-truth SQL:** PR #800
  https://github.com/ChauDoan21165/MercyB/pull/800
  → `reports/SQL-p0-rls-phantom-A9.md` §Section 2 once merged.
- **Recon backing the SQL:** `reports/RECON-failed-deletion-events-B21.md` on
  `b21/failed-deletion-events` (pushed to `origin`).
- **Pending index entry:** `reports/PENDING-CHAU-ACTIONS-2026-05-19.md` §5.
- **Out-of-scope sibling event:** `RUNBOOK-evt-1TUxM5-lookup.md` on
  `b28/unknowable-event-lookup` (pending #4).
