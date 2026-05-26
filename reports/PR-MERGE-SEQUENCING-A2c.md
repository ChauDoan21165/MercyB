> **SUPERSEDED 2026-05-19/20:** the wave has drained. For current PR state run
> `gh pr list --state open`. This doc is the mid-wave snapshot — keep for audit
> trail, do not act on the sequence.

# PR review backlog — sequencing + risk matrix (A2c)

> **For Chau, single-person reviewer, ~15 min budget.** Live `gh pr view`
> snapshot taken 2026-05-19. The brief said "13 PRs" — live state shows
> **16 open** in the named range (#789, #791–#797, #798–#806, **minus
> #802 which merged after the brief was authored, plus #790 which is in
> the range but the brief didn't enumerate**). All 16 are covered below.
>
> Conventions:
> - **CI** = required-check rollup. GREEN = all pass; RE-RUN = at least
>   one required job failed (typically a flaky `CI Pipeline` step while
>   `Preview Deployment` + `Lighthouse Mobile (PR)` passed); PENDING = a
>   required check is still running.
> - **Risk** 1 (trivial revert) … 5 (requires DB migration rollback).
> - **Post-merge action**: SQL = Chau hand-applies SQL via Supabase SQL
>   Editor (no unattended path); RDV = real-device verify; send =
>   Resend operator action; none = ship-and-forget.

---

## 1 · Live PR matrix (16 PRs, 2026-05-19 snapshot)

| #   | Title (truncated)                                                     | Agent | CI       | Post-merge | Risk | Net Δ        |
|-----|-----------------------------------------------------------------------|------|----------|------------|------|--------------|
| 789 | feat(db): entitlements table per A5 spec (D1=table)                   | A5   | GREEN    | SQL apply  | 4    | +191 / -0    |
| 790 | docs: remove stale NORTH_STAR.md references (retired v2.0)            | —    | GREEN    | none       | 1    | small        |
| 791 | cleanup(reports): archive 7 zero-reference legacy a<N>-* files        | A23  | GREEN    | none       | 1    | +0 / -0 (renames) |
| 792 | feat(db): retire dormant T2 trigger + dead RPC                        | A11  | RE-RUN   | SQL apply  | 4    | +166 / -0    |
| 793 | fix(webhook): monotonic raw_payload on object quality                 | A14  | GREEN    | edge deploy| 3    | +456 / -2    |
| 794 | perf(bundle): lazy-load MercyGuidePanel — 14.3 KB gz off first paint  | A25  | GREEN    | none       | 1    | +26 / -3     |
| 795 | perf(bundle): split zod/sonner/date-fns into lazy chunks (~31 KB)     | A37  | GREEN    | none       | 1    | +3 / -0      |
| 796 | fix(privacy): guard marketing trackers against native execution       | A41  | GREEN    | **RDV**    | 2    | +90 / -0     |
| 797 | ci: wire check-delete-account-coverage to required workflow           | B2 (A4) | RE-RUN | none       | 1    | +10 / -0     |
| 798 | docs(billing): D4 bridge — price-map INSERT + raw_payload feasibility | —    | GREEN    | SQL apply  | 1    | +249 / -0    |
| 799 | docs(customer): gift-victim apply-ready package                       | —    | GREEN    | SQL apply  | 1    | +497 / -0    |
| 800 | docs(security): P0 SQL batch — anon RLS revoke + phantom rows         | —    | GREEN    | SQL apply  | 1    | +346 / -0    |
| 801 | docs(customer): mylinh apply-ready package                            | A2   | GREEN    | SQL apply  | 1    | +1036 / -0   |
| 803 | docs(customer): gift-victim outreach send-side ops                    | A3b  | GREEN    | send       | 1    | +244 / -0    |
| 804 | docs(billing): D4 raw_payload feasibility — result template           | A8b  | GREEN    | none       | 1    | +234 / -0    |
| 805 | docs(customer): mylinh Stripe Dashboard pre-flight checklist          | A2b  | GREEN    | none       | 1    | +205 / -0    |
| 806 | docs(security): phantom-row apply runbook + A94 loss formalization    | A9b  | PENDING¹ | SQL apply  | 1    | +216 / -0    |

¹ #806 `Build and Test` was still queued at snapshot time; rest of its
required checks were already GREEN. Likely re-flips to GREEN within
~5 min — re-check before merging.

**Note on the "13" in the brief:** filtering by "MERGEABLE + no
RE-RUN-NEEDED + no PENDING" leaves exactly **13 PRs** ready to merge as
of snapshot. The 3 RE-RUN/PENDING ones (#792, #797, #806) need a small
action first. That arithmetic may be what the brief meant.

---

## 2 · Dependency graph

```
                   ┌──────────────────────┐
                   │ #800 P0 SQL batch    │
                   │ (anon RLS revoke +   │
                   │  phantom rows pkg)   │
                   └──────────┬───────────┘
                              │ depends-on
                              ▼
                   ┌──────────────────────┐
                   │ #806 phantom-row     │
                   │ apply runbook (A9b)  │   ← runbook references
                   │                      │     PR #800 §Section 2
                   └──────────────────────┘     paste-ready block

   ┌─────────────────────┐
   │ #801 mylinh apply   │
   │ package (Block 1/2/3│
   └──────────┬──────────┘
              │ uses-before-apply (pre-flight)
              ▼
   ┌─────────────────────┐
   │ #805 mylinh Stripe  │
   │ pre-flight (A2b)    │   ← read BEFORE pasting #801 Block 2
   └─────────────────────┘     (companion, not strict dependency)

   ┌─────────────────────┐
   │ #799 gift-victim    │
   │ apply package       │
   └──────────┬──────────┘
              │ feeds (operator workflow)
              ▼
   ┌─────────────────────┐
   │ #803 gift-victim    │
   │ outreach send-side  │   ← email outreach AFTER #799 SQL applies
   └─────────────────────┘     (operational sequence, not build dep)

   ┌─────────────────────┐
   │ #798 D4 bridge      │
   │ price-map INSERT +  │
   │ feasibility probe   │
   └──────────┬──────────┘
              │ produces evidence
              ▼
   ┌─────────────────────┐
   │ #804 D4 raw_payload │
   │ feasibility result  │   ← captures result of #798 probe
   └─────────────────────┘     (soft dep — #804 has placeholder,
                                  #798 fills it; not a hard build dep)

   ┌─────────────────────┐
   │ #797 B2 wire delete │   ← brief noted A4's B1 fix → #797;
   │ -account-coverage   │     not gating any other PR in this batch
   └─────────────────────┘
```

**No PR in this batch hard-blocks another at the code level.** Every
dependency is either *documentation-of-apply-order* (#806→#800,
#805→#801, #803→#799) or *evidence-feeds-result* (#798→#804). That
means **merge order is opportunistic, not topological** — the only
constraint is don't apply #800's SQL before merging #806's runbook,
don't apply #801's SQL before reading #805's pre-flight, etc.

---

## 3 · Recommended merge order

Bias: clear the cheap GREEN ones first (visible backlog reduction),
batch the SQL-apply docs so post-merge actions queue cleanly, leave
the perf wins for "last bite" (auto-deploys with zero follow-up).

| Step | PRs                | Justification (one line) |
|------|--------------------|---------------------------|
| 1    | #791, #790         | Pure cleanup, risk 1, no post-merge — clears 2 from the list immediately. |
| 2    | #804, #805         | Companion docs to in-flight apply packages; merging early prevents stale-reference drift in #798/#801 if those land first. |
| 3    | #806               | Wait for `Build and Test` to flip GREEN (~5 min) — then merge alongside #800. Pairs by intent (phantom-row runbook + the SQL it documents). |
| 4    | #800, #806, #799, #801, #798 | The apply-package bundle. Order **within** this group is the order Chau will apply SQL after merging — not strictly required, but reduces context switching. |
| 5    | #803               | Send-side outreach docs — merge after #799 (so the operator path is internally consistent on `main`). |
| 6    | #794, #795         | Pure perf wins, GREEN, risk 1, no post-merge. Last because they don't unblock anything else and the Vercel auto-deploy can land in its own window. |
| 7    | #796               | GREEN, low risk, but **requires real-device verify** (see #807) — merge only when Chau has the device ready. |
| 8    | #793               | Webhook hot-path change, +456 lines, risk 3 — merge in its own window so any Sentry signal is attributable to this PR alone. |
| 9    | #789               | DB migration (entitlements table). Risk 4. Don't bundle with anything else — apply the SQL via Editor immediately post-merge so on-call cost is bounded. |
| 10   | #792 (after re-run)| Same as #789: DB migration, risk 4, isolate. Re-run CI Pipeline first; if it stays red, diagnose before merging. |
| 11   | #797 (after re-run)| CI plumbing — low blast radius once green, but the CI Pipeline failure itself is informative. Re-run before merge. |

**Hard rules baked into the order:**
- Never merge two DB migrations (#789, #792) in the same window.
- #806 stays paired with #800 (Chau applies them as one operation).
- #796 does **not** ship until RDV is recorded against #807.

---

## 4 · Per-PR post-merge action detail

| #   | Post-merge action                                                                                                                    |
|-----|--------------------------------------------------------------------------------------------------------------------------------------|
| 789 | **SQL apply** — apply `feat/entitlements-table-migration` migration via Supabase SQL Editor (CLAUDE.md: no `db push`). |
| 790 | none.                                                                                                                                |
| 791 | none (file moves).                                                                                                                   |
| 792 | **SQL apply** — apply T2 retirement migration via SQL Editor **after** CI re-runs GREEN. Verify trigger genuinely dormant first.    |
| 793 | **Edge fn deploy** — Supabase webhook redeploy via CI (or `supabase functions deploy stripe-webhook` if CI doesn't auto-handle). |
| 794 | none — Vercel auto-deploys. Watch Lighthouse for the −14.3 KB delta to confirm landed.                                              |
| 795 | none — Vercel auto-deploys. Confirm ~31 KB first-paint reduction in next Lighthouse run.                                            |
| 796 | **RDV** — real-device tracker-verify per the checklist in #807; do not merge until device is in hand.                                |
| 797 | none (CI workflow change) — confirm the new check appears as required on the next PR.                                                |
| 798 | **SQL apply** — price-map INSERT + raw_payload feasibility SQL, via SQL Editor. Result populates #804.                              |
| 799 | **SQL apply** — gift-victim apply-ready package, Chau hand-applies; then #803 sends outreach emails.                                |
| 800 | **SQL apply** — P0 anon RLS revoke + phantom rows, via SQL Editor. Pair with #806 runbook.                                          |
| 801 | **SQL apply** — mylinh repair, Block 1 → Block 2 → Block 3 per the doc; preceded by #805 pre-flight.                                |
| 803 | **send** — Resend operator action: run the outreach SQL → send via configured edge fn → confirm delivery in `email_events`.         |
| 804 | none — captures result of #798's probe.                                                                                              |
| 805 | none — operator reference, used before #801 apply.                                                                                   |
| 806 | **SQL apply** — phantom-row cleanup via SQL Editor (paired with #800).                                                              |

---

## 5 · Per-PR rollback risk

Scale: 1 (revert PR, done) … 5 (requires DB migration rollback + data-loss surgery).

| #   | Risk | Why                                                                                                                     |
|-----|------|--------------------------------------------------------------------------------------------------------------------------|
| 789 | 4    | New table `entitlements` — revert PR + drop table. Data accumulated post-merge needs preservation strategy decided.    |
| 790 | 1    | Docs-only.                                                                                                              |
| 791 | 1    | File moves only.                                                                                                        |
| 792 | 4    | Trigger retirement — if applied SQL turns out to have a live caller, restoring it requires recreating from the migration's `DOWN` (verify present).|
| 793 | 3    | Webhook hot-path — revert + redeploy. Any payloads written during the window have the new shape; downstream readers must tolerate both. |
| 794 | 1    | Lazy chunk; revert restores eager load.                                                                                 |
| 795 | 1    | Vendor split; revert restores single vendor chunk.                                                                      |
| 796 | 2    | Native code-path guard — revert restores prior tracker invocation. Watch Sentry for tracker-related issues after revert.|
| 797 | 1    | CI workflow file.                                                                                                       |
| 798–806 | 1 | All docs-only PRs. The *SQL apply actions they document* carry their own risk (called out in each apply package), but the PR merge itself is a doc revert. |

---

## 6 · 3-PR fast-track set (10-minute budget)

**If Chau only has 10 minutes, merge these three. No SQL to apply, no
device to grab, no operator action queued, real production value.**

| Order | PR  | Why fast-track                                                                                  | Time |
|-------|-----|--------------------------------------------------------------------------------------------------|------|
| 1     | #791 | GREEN, risk 1, 0 net additions (file moves only), clears noise from `reports/` — visible win.  | ~2 min |
| 2     | #795 | GREEN, risk 1, perf — ~31 KB off first paint (zod/sonner/date-fns lazy-split). Vercel auto-deploys. | ~3 min |
| 3     | #794 | GREEN, risk 1, perf — 14.3 KB gz off first paint (MercyGuidePanel lazy-load). Vercel auto-deploys. | ~3 min |

**Total:** ~8 min, ~45 KB first-paint reduction, zero post-merge
operator action, zero rollback ambiguity.

**Excluded from fast-track (and why):**
- #790 — qualifies but pairs naturally with #791; if budget allows, add it (~30 sec).
- #804, #805, #806 — docs-only and GREEN, but they're operator-facing
  references that pair with apply-package PRs; merging them in
  isolation doesn't ship value.
- #796, #793, #789, #792, #797 — each has either RDV / SQL / re-run
  prerequisites that violate the "no post-merge action" rule.

---

## 7 · Artifact pointer

This doc is a snapshot. Live state moves fast — re-run
`gh pr list --state open --json number,mergeable,statusCheckRollup` if
acting on this doc more than ~2 hours after 2026-05-19 21:55 UTC.
