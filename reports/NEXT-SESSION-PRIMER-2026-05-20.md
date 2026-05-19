# NEXT-SESSION PRIMER — 2026-05-20

> **Read this immediately after STRATEGY.md + PRINCIPLES.md. This single file replaces
> reading the ~20 individual A1–A26 / B-series recons from the May 19 wave.**
> Author: A27 · branch `a27/next-session-primer-may20` · commit-don't-PR (operator artifact, B16).
> Supersedes: B41 `NEXT-SESSION-PRIMER-2026-05-19.md` and B66 `FINAL-CLOSEOUT-2026-05-19.md`
> (both now stale — they predate the A1–A26 design wave). **Source-of-truth order if anything
> disagrees: current `origin/main` → this file → B48 target-state → B45 as-built. Newer wins.**
> Full session record: B10 `docs/session-summaries/may-19-2026.md` (PR #765, OPEN).

---

## a. State of play (3 bullets)

- **Accomplished (May 19 wave):** the entire billing/entitlement consolidation is now
  **fully designed end-to-end and the design phase is CLOSED** — target state (B48),
  table schema (A5), single-writer design (B68), MRR strategy (A8/D4), T2 retirement DDL
  (A11), and the file-by-file B13-phase-3 implementation brief (A12) are all committed.
  Plus: mercy-feedback verified live e2e (CLOSED — don't reopen); U3 class bug fixed in
  code (#770 merged); ~28 CI-green PRs queued behind B60's merge train.
- **Still parked (needs Chau, not more design):** ~28-PR merge train (Tier-1 = **#774**);
  three real-customer incidents un-remediated (mylinh, gift-code victims, webhook payload
  bug); the P0 SQL-Editor batch (price-map, RLS revoke, phantom rows). No code is blocked
  on analysis anymore — it's blocked on **merge + Chau-applied SQL**.
- **Now DECIDED (locked this session — see §b):** D1–D6 are no longer "recommendations."
  All six are answered. The execution sequence is fully linearized (§d). Implementation
  can start the moment §d's gate (#774 + D1-in-writing + §6-flip-accept) clears.

## b. D1–D6 — FINAL ANSWERS (locked-in; no more "leaning")

| # | Question | **LOCKED ANSWER** | Authority |
|---|---|---|---|
| **D1** | Materialized `entitlements` table vs pure derive-on-read? | **TABLE.** One row per `(user_id, app_id)`, server-write-only, `is_premium` GENERATED (structurally cannot drift — kills the B13 class). Schema fully spec'd, no design decisions left. | A5 `RECON-entitlements-table-schema-A5.md` |
| **D2** | `profiles.tier` (text): DROP vs freeze forever? | **DROP — eventually.** T1 freeze stays. Order is strict: T2 retire (P2) → column DROP (P3), **never the same migration**. Gated on every reader gone (#774 path). | A11 §4c |
| **D3** | Fold gift `user_subscriptions` into `subscriptions` vs keep legacy fallback? | **FOLD-IN** (gifts become `source='gift_code'` rows in `subscriptions`). Schema is D3-agnostic by design; B68 isolates the gift-read (R2) as a single deletable block so fold-in is one localized deletion. | B68 §2, A5 §D3 |
| **D4** | MRR truth = `billing_price_map` join vs Stripe amount on the row? | **RETIRE `billing_price_map`** → amount-on-row (end-state b2, normalized `unit_amount` persisted), staged into **P2** after P1. **B52 Option A = DON'T BUILD** (its value dies with the map). **Bridge:** B42's 1-row INSERT ships NOW (≈6M VND/yr / B30-validated 2 real customers invisible until applied — not wasted). **Pre-backfill gate:** Chau runs A8's read-only `raw_payload`-completeness query (flip-cond #4, expect 0) before any (b2) backfill. | A8 `RECON-mrr-source-D4-A8.md` |
| **D5** | Build B7 monitoring before or after consolidation? | **Q1 + Q4 ONLY, before** (safety net during surgery — already authored, A3 `MONITORING-q1-q4.md`, pushed). **Q2/Q3/Q5 NEVER** — the consolidation deletes those drift classes; building them is wasted work. | B48 §D5 |
| **D6** | Confirm "no unattended SQL — Chau hand-applies via SQL Editor"? | **STAYS.** Every migration, the price-map INSERT, the period_end backfill, the T2 tombstone, the entitlements DDL + backfill are **Chau-applied via SQL Editor, never `db push`**. Budget Chau apply-time into every phase. | B48 §D6, A11 §6, A5 §6 |

## c. Customer-incident state (real users underserved NOW — highest value)

1. **mylinh.nutrition@gmail.com — paid but at free entitlement.** Class bug fixed in
   code (#770 merged). Original remediation SQL was **lost**; **regenerated** under
   human review. Apply runbook + regenerated SQL both ready, **pending Chau SQL Editor**:
   - Runbook: `reports/RUNBOOK-mylinh-apply-A26.md` @ `a26/mylinh-apply-runbook` *(LOCAL-ONLY)*
   - SQL + diagnosis: `reports/REMEDIATION-mylinh-paid-but-free-B5.sql` + `RECON-mylinh-paid-but-free-B5.md` @ `b5/mylinh-sql-regen` *(LOCAL-ONLY)*
2. **Gift-code redemption victims — audit pending.** `redeem-gift-code` dropped
   `is_gift_redemption=false` rows yet returned `ok:true` (B22 silent-failure). Victim
   audit SQL + outreach copy ready, **pending Chau SQL Editor**:
   - `reports/AUDIT-gift-victims-A13.sql` + `reports/OUTREACH-gift-victims-A13.md` @ `a13/gift-redemption-victims` *(LOCAL-ONLY)*
3. **Webhook payload-type bug — recon done, fix not yet scoped to a PR.**
   - `reports/RECON-webhook-payload-type-bug-A14.md` @ `a14/webhook-payload-type-audit` *(LOCAL-ONLY)*

## d. Execution sequence (LOCKED this session)

```
┌─ HARD GATE (A12 §0 — verify in writing before ANY billing code) ───────────┐
│  (1) PR #774 MERGED on origin/main   (still OPEN as of 2026-05-19)          │
│  (2) D1 = "table" confirmed by Chau in writing (§b locks the answer; the    │
│      written Chau ack is the gate, not the recommendation)                  │
│  (3) Chau accepts the mid-deploy entitlement flip (A12 §6 — expired-but-    │
│      'active' users correctly lose premium; NO grace fudge)                 │
└────────────────────────────────────────────────────────────────────────────┘
        │
A5 schema (DONE, b67) ─▶ A17 migration APPLIED  ── Chau, SQL Editor (D6)
        │                  file already authored: 20260519230000_create_entitlements_table.sql
        │                  @ origin/feat/entitlements-table-migration (PUSHED)
        ▼
B13 phase 3 PR-A  ── additive `_shared/entitlement.ts` + exhaustive unit suite.
        │             ZERO importers, zero behavior change → trivially revertable.
        ▼
B13 phase 3 PR-B  ── atomic repoint of R1–R4 + integration/parity tests +
        │             one-time post-merge recompute. THE money-path PR. Real-device
        │             gate (A12 §8). Spec: A12 RECON-b13-phase3-dispatch-spec.
        ▼
A18 recomputeEntitlement single writer  ── needs A5 table live + #766 merged.
        │             Brief: RECON-recompute-entitlement-impl-brief-A18 (B68 design).
        ▼
A11 T2 retirement  ── Chau tombstone migration, SQL Editor. Apply AFTER #774
        │             (defense-in-depth, not a technical block — A11 §4b).
        ▼
P3  profiles.tier → read-only projection, then DROP (D2). B7 Q2/Q3/Q5 formally retired.

PARALLEL RAIL — no entitlement coupling, Chau SQL Editor, ship anytime (P0):
  • B42/B64 price-map 1-row INSERT (D4 bridge)   • anon-view RLS revoke (#750 migs)
  • period_end/start backfill (AFTER #773 merges) • A94/B21 phantom-row cleanup
  • A13 gift-victim remediation                   • B7 Q1+Q4 (A3, pushed) = safety net before PR-B
```

**Critical-path note:** Phase 3 is *logic-only, zero migrations* (A12 §2) — it does NOT
require the table to exist; the table/recompute are downstream. But this session locked
D1=table, so A17 migration lands early to unblock A18. PR-A and PR-B may proceed in
parallel with the migration apply; A18 is the join point that needs the table live.

## e. Don't-redo list (DONE — do not re-dispatch; cite by branch / path)

| Topic | Report | Branch | Push |
|---|---|---|---|
| Billing as-built map | `RECON-billing-architecture-as-built-B45.md` | b45/billing-architecture-map | PUSHED |
| Billing history | `RECON-billing-history-B47.md` | b47/billing-architecture-history | PUSHED |
| Billing target state + D1–D6 framing | `RECON-billing-target-state-B48.md` | b48/billing-target-state | PUSHED |
| Entitlements table schema (D1) | `RECON-entitlements-table-schema-A5.md` | b67/entitlements-schema-spec | PUSHED |
| Entitlements migration FILE | `…/20260519230000_create_entitlements_table.sql` | feat/entitlements-table-migration | PUSHED |
| recomputeEntitlement design | `RECON-recompute-entitlement-design-B68.md` | b68/recompute-entitlement-design | **LOCAL** |
| recomputeEntitlement impl brief | `RECON-recompute-entitlement-impl-brief-A18.md` | a18/recompute-impl-brief | **LOCAL** |
| MRR source / D4 / B52-Opt-A go-no-go | `RECON-mrr-source-D4-A8.md` | b69/d4-mrr-source-strategic | **LOCAL** |
| T2 retirement DDL spec | `DESIGN-t2-retirement-migration-A11.md` | b70/t2-retirement-design | PUSHED |
| B13 phase-3 file-by-file brief | `RECON-b13-phase3-dispatch-spec-A12.md` | b71/b13-phase3-brief | **LOCAL** |
| B7 Q1+Q4 monitoring | `MONITORING-q1-q4.md` | feat/b7-q1-q4-monitoring | PUSHED |
| Profile-trigger architecture | `RECON-profile-trigger-architecture-B27.md` | b27/profile-trigger-audit | (recon) |
| Gift propagation gap | `RECON-gift-entitlement-propagation-B22.md` / `RECON-gift-write-vs-fallback-design-B58.md` | (B36-committed) / b58/gift-write-or-fallback | (recon) |
| Price-map runbook + repair SQL | `RUNBOOK-price-map-row-B42.md` / `REMEDIATION-price-map-repair-B64.sql` | b42/price-map-missing-row / b64/price-map-repair-sql | (recon) |
| Merge-queue order + PR/CI caveats | `RECON-B60-merge-queue-priority.md` / `RECON-pr-ci-status-B62.md` | b60/merge-queue-priority / b62/pr-ci-status | (recon) |
| Local branch inventory | `reports/RECON-local-branch-inventory-B46.md` | (untracked on disk in main repo) | on-disk |

**Also don't re-recon:** `RECON-isentitling*-B13.md` **does not exist as a file anywhere**
(A12 §1) — B13's findings survive only synthesized into B48. Read B48, don't hunt for B13.

## f. Highest-leverage next dispatches (first 30 min, priority order)

1. **Close U3 / mylinh (real customer underserved now — outcomes > hardening).**
   Review/merge #773 (B26 `period_start` symmetric fix), then hand Chau the A2 regenerated
   SQL + A26 runbook for SQL-Editor apply. Don't re-derive — it's regenerated and waiting.
2. **Drain the merge train.** Run B60's `&&`-chained block, **Tier-1 #774 FIRST** — #774
   is both a queued PR *and* the §d HARD gate for the entire billing chain. Heed B62
   caveats: `#782` is NOT in the block (rebase after #764); `#776/#777/#780/#781` edit
   `INDEX.md` and must be merged one-at-a-time after rebase.
3. **Hand Chau the P0 SQL-Editor batch** (all D6, parallel, real money/compliance):
   B42/B64 price-map INSERT · anon-view RLS revoke (#750) · A94/B21 phantom rows ·
   A13 gift-victim remediation · A14 webhook-payload fix scoping · A8 flip-cond #4
   read-only `raw_payload` query (D4 backfill feasibility).
4. **Once #774 merges + D1 ack'd:** kick the billing chain — Chau applies A17 migration,
   then dispatch B13 phase 3 **PR-A** (zero-risk additive module) immediately; PR-B follows.

## g. Pushed vs LOCAL — where to fetch (act on this before any prune)

**🚨 SALVAGE WARNING — do NOT `git worktree prune` / `worktree remove` before pushing.**
The *entire billing-implementation design chain and all three customer-incident
remediations are LOCAL-ONLY* in `/private/tmp` worktrees with **no `origin` branch**.
Pruning these worktrees destroys un-pushed, unrecoverable work.

**PUSHED (next session: `git show origin/<branch>:<path>` — durable):**
b41/next-session-primer · b45/billing-architecture-map · b47/billing-architecture-history ·
b48/billing-target-state · b67/entitlements-schema-spec · b70/t2-retirement-design ·
feat/entitlements-table-migration · feat/b7-q1-q4-monitoring.

**LOCAL-ONLY (only in the `/private/tmp` worktree below — read there, or push first):**

| Branch | Worktree | Holds |
|---|---|---|
| b66/session-closeout | /private/tmp/B66-session-closeout | FINAL-CLOSEOUT (superseded by this) |
| b68/recompute-entitlement-design | /private/tmp/A6-recompute-design | B68 design |
| b69/d4-mrr-source-strategic | /private/tmp/A8-d4-mrr-source | D4 decision |
| b71/b13-phase3-brief | /private/tmp/A12-b13ph3-brief | B13 ph3 impl brief |
| a18/recompute-impl-brief | /private/tmp/A18-recompute-impl-brief | recompute impl brief |
| b5/mylinh-sql-regen | /private/tmp/A2-mylinh-regen | mylinh SQL + diagnosis |
| a26/mylinh-apply-runbook | /private/tmp/A26-mylinh-apply-runbook | mylinh apply runbook |
| a13/gift-redemption-victims | /private/tmp/A13-gift-victims | gift-victim audit SQL + outreach |
| a14/webhook-payload-type-audit | /private/tmp/A14-webhook-payload-audit | webhook payload-bug recon |
| a27/next-session-primer-may20 | /private/tmp/A27-next-session-primer | **this primer** |

**Recommended Chau action:** these recon/impl branches are commit-don't-PR by convention
and durable *locally*, but with no `origin` ref a stray prune is fatal. Either (a) next
session reads them in-place from the worktree paths above, or (b) Chau pushes the 10
branches for durability. Pushing is optional per B16; **not pruning them is not.**

---

*A27 — synthesis only. No code, no DB, no prod query. This doc is the deliverable.
Every status sourced to a committed sibling doc; nothing re-tested live. `stale-audit-note`.*
