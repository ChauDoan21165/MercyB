# RECON — mylinh.nutrition@gmail.com paid-but-free (B5)

> Reconstructed retroactively by B24 (2026-05-19) under the recon-doc
> convention (B16, PR #768). **The B5 worktree no longer holds the raw
> terminal transcript.** The original live diagnostic ran from the terminal
> and the output was pasted in chat to Chau; it was never committed. What
> *is* on disk is B5's two read-only probe scripts —
> `b5-diagnostic.mjs` and `b5-deep.mjs` — whose hardcoded constants B5
> lifted from its own first-pass terminal output before the deep pass.
> Evidence below is recovered from those scripts only. **No prod re-query
> was performed** (brief constraint). Sections that cannot be filled from
> the on-disk scripts are marked **NOT RECOVERABLE** rather than guessed.
>
> Branch: `b5/mylinh-paid-but-free-diagnostic` · Labels: stale-audit-note,
> money-path, silent-failure

> **B57 annotation (2026-05-19, additive — original content unchanged):**
> A B29-shaped remediation **skeleton** has been salvaged to
> `reports/REMEDIATION-mylinh-paid-but-free-B5.sql` (branch
> `b57/mylinh-sql-salvage`). It reconstructs the *structure* and the
> *recoverable constants only* (identity, stale period, exact corrected
> epoch); it does **not** reproduce B5's lost verbatim SQL and bakes in no
> guessed figures — every unrecoverable field (incl. `subscriptions.status`
> and any gift expiry) is a marked NOT-RECOVERABLE placeholder. It is a
> HANDOFF SKELETON, NOT executable as-is, NOT applied. The "Do not
> reconstruct or run it" guidance below still stands for B5's *verbatim*
> SQL; the salvaged file is a reviewable spec, not that text.

## Verdict

A paying user (`mylinh.nutrition@gmail.com`) is denied premium because her
`subscriptions.current_period_end` column is stored ~1 month **stale** —
≈`2026-05-09` while Stripe's own payload freshness marker says her paid
period runs to ≈`2026-06-08` — i.e. an instance of the `period_end`
field-order class bug (the same defect B11 fixes; same family B13/B7 map).

## Evidence

All values below are **verbatim from B5's on-disk scripts**, which B5
populated from its first live read. The raw terminal dump itself is gone.

- **Target / identity** (`b5-diagnostic.mjs:7`, `b5-deep.mjs:10`):
  - `TARGET_EMAIL = "mylinh.nutrition@gmail.com"`
  - resolved `user_id = "cd9b889c-eb9f-428f-9462-de66d4f92c04"`
    (hardcoded into the deep pass → confirms the profiles lookup resolved
    a real user in the first pass).
- **The stale period_end** (`b5-deep.mjs:13`), B5's own label verbatim:
  ```js
  console.log("current_period_end col :", dec("2026-05-09T06:16:41+00:00"));
  ```
  → the persisted `subscriptions.current_period_end` column =
  **`2026-05-09T06:16:41+00:00`**.
- **What Stripe actually sent** (`b5-deep.mjs:14`):
  ```js
  console.log("freshness object_time  :", new Date(1780985801000).toISOString(), "(ms 1780985801000)");
  ```
  → `raw_payload.__stripe_freshness.object_time = 1780985801000` ms
  ≈ **`2026-06-08T06:16:41Z`** (computed from the raw epoch constant;
  B5's script decodes it at runtime — the runtime-printed string is not
  on disk, but the constant is exact). Same time-of-day as the stored
  column, ~30 days later → a normal monthly renewal boundary that the
  column failed to advance to.
- **The driving invoice event** (`b5-deep.mjs:15`):
  `event_created 1778311089` (seconds) ≈ **`2026-05-08T07:18:09Z`** —
  i.e. an invoice/renewal event around the *old* period end, after which
  the column should have rolled forward to the freshness date and did not.
- **Diagnostic scope actually run** (from `b5-diagnostic.mjs`): read-only
  reads of `profiles` (by email), `subscriptions` (by `user_id` and by
  `provider_customer_id`), `user_subscriptions` (gift/manual),
  `entitlement_events` (audit trail), and `stripe_webhook_events`
  (`2026-05-06`…`2026-05-20`, plus an errored-events sweep since
  `2026-05-01`). The *results* of these reads are **NOT RECOVERABLE** —
  only the queries survive on disk.

**NOT RECOVERABLE from on-disk scripts (do not infer):**
- `subscriptions.status` for this user (the script selected it; the value
  is not in any hardcoded constant).
- Which of the four entitlement readers (`isEntitlingSubscription` /
  `me-entitlement normalizeStatus` / `_shared/billing toEntitlementResponse`
  / `get-subscription-status`) actually denied her.
- The `entitlement_events` / `stripe_webhook_events` row contents (whether
  a renewal webhook errored, arrived, or never arrived).
- **The remediation SQL.** The brief states B5 produced remediation SQL;
  its text is **not on disk**. Do **not** reconstruct or run it — it must
  come from the chat transcript or a fresh, human-reviewed read.

## Root cause

By CLAUDE.md layer separation this is a **data-shape / write-path** defect,
not loading/rendering/permissions:

- The Stripe payload carried the correct next-period end
  (`__stripe_freshness.object_time` ≈ 2026-06-08) but the persisted
  `subscriptions.current_period_end` column froze at ≈2026-05-09 — the
  prior boundary. This is the **`period_end` field-order class bug**:
  the renewal write put the wrong period field into
  `current_period_end` (B11's branch `b11/period-end-field-order` is the
  in-flight fix; B13 §"Webhook-lag false-negative" notes this bug
  *worsens* every downstream expiry check).
- Downstream, any entitlement reader that consults
  `current_period_end > now()` sees `2026-05-09 < 2026-05-19` → not
  entitled, despite real payment through ≈June. The exact denying reader
  is NOT RECOVERABLE here; the *class* is the one mapped in
  `reports/RECON-isentitling-fix-plan-B13.md` (the family-of-4 status/expiry
  gates) and `reports/SCOPING…`/`RECON-money-path-silent-failure-monitoring-B7.md`.

## Impact

- **Confirmed: 1 paying user** (`mylinh.nutrition@gmail.com`,
  `cd9b889c-eb9f-428f-9462-de66d4f92c04`) — paid through ≈2026-06-08,
  receiving no premium as of 2026-05-19. Direct revenue/trust harm
  (paid-but-free is the worst money-path failure mode: silent, user-felt).
- **Blast radius: not quantified here.** B5 scanned one user. The
  *class* blast radius (how many subs have a stale `current_period_end`)
  is exactly what B11 (fix), B12 (bulk remediation), and B7's Q2/Q4
  detection queries address — see those tracks; this doc does not
  re-derive it (no re-query per brief).
- Severity: **high** — money-path, user-visible, silent (no exception
  thrown; only caught because the user complained / was scanned).

## Fix recommendation

This recon does **not** prescribe a code change — the fix is already
owned by sibling tracks; the smallest safe action is to route this user
into them, not to patch from here:

1. **Land B11** (`b11/period-end-field-order`) so new renewals stop
   writing the stale `current_period_end`.
2. **B12 bulk remediation** must include this user
   (`cd9b889c-eb9f-428f-9462-de66d4f92c04`) — re-pull from Stripe /
   recompute so her column reflects ≈2026-06-08 and `recomputeAnd-
   PersistEntitlement` re-grants premium.
3. **B13 phase-3** family-of-4 expiry+grace fix is the durable guard.
4. **Human decision required:** the per-user remediation SQL B5 wrote is
   not on disk. Either recover it from the chat transcript or have B12
   regenerate it under human review (no unattended SQL path to this
   Supabase — memory: RLS/data migrations are SQL-Editor + human-reviewed).
   Do not hand-write a one-off `UPDATE` from this doc.

## Worktree disposition

`prune` — the live diagnostic is unrepeatable from this worktree (only
the probe scripts and this reconstruction survive; the raw transcript is
gone). Findings are now captured here as far as the on-disk evidence
allows. Anything beyond what is recorded above (subscription status, the
denying reader, the remediation SQL, blast radius) requires a fresh
human-reviewed read and belongs to the B11/B12/B13 tracks, **not** a
revival of this worktree. Cautionary sibling: A77 was fully unrecoverable
(only JSON dumps, worktree pruned) — this case was a near-miss saved only
because B5's probe scripts were left on disk.
