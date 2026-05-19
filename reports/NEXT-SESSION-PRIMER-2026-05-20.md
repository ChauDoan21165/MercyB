# NEXT-SESSION PRIMER — 2026-05-20

> Read immediately after STRATEGY.md + PRINCIPLES.md. **Replaces ~40 individual A1–A45
> / B-series recons from the May 19 wave.** Author: A27, **refreshed by A46** (late May
> 19) · branch `a46/primer-refresh-may19-late` · commit-don't-PR (operator artifact, B16).
> **This A46 refresh SUPERSEDES A27's original `a27/next-session-primer-may20`.** Also
> supersedes B41 + B66. **Disagreement order: `origin/main` → this file → B48 → B45.**
> Session record: B10 `docs/session-summaries/may-19-2026.md` (PR #765).

---

## 0. DELTAS SINCE A27 (read first — what changed late tonight)

A27 was written mid-session, before wave 3 (A28–A45) and several corrections. Net change:

- **🔓 #774 IS MERGED** (origin/main @ `6b7d07490`, 2026-05-19T20:33). A27 said "still
  OPEN" — it is **not**. The §d HARD GATE point (1) is **CLEARED**. The billing chain
  is now gated only on D1-written-ack + §6 flip-accept + Chau applying A17's migration.
  #787 (redeem-gift-code honest-errors, B22 code fix) also merged.
- **Wave 3 ran (A28–A45)** — see §h. 7 new PRs are CI-green and awaiting Chau merge (§j).
- **Stripe DB is mixed live + test data** (A43 discovery) — see §i. This produced
  **tonight's most important lesson** (below).
- **Customer incidents reclassified by Chau: mylinh + gift-victims are REAL** customer
  work, not test noise. §c corrected.
- **Two app-store submission blockers surfaced** (A40 account-deletion, A41 trackers) — §k.
- **Filename convention changed** (A23): `RECON-<topic>-A<N>.md`, not `a<N>-*` — §l.

> ### ⭐ TONIGHT'S MOST IMPORTANT LESSON FOR FUTURE CLAUDE
> **"Not in `stripe_webhook_events`" does NOT mean "test data."** Live and test Stripe
> events share one DB; the webhook log is **incomplete** (only 3 of 9 real subscriptions
> have a matching event row). Confirm a customer is real via **Stripe Dashboard
> live-mode search**, never by the webhook table alone. mylinh would have been wrongly
> dismissed as test data by that flawed heuristic — she paid 200K VND.

## a. State of play (3 bullets)

- **Accomplished (May 19 wave):** billing/entitlement consolidation **fully designed,
  design phase CLOSED** — B48 / A5 / B68 / A8-D4 / A11 / A12. Plus: mercy-feedback live
  (CLOSED); U3 class bug fixed (#770); gift silent-loss fixed (#787); **#774 merged (the
  gate)**; wave 3 shipped 7 more CI-green PRs (§j).
- **Still parked (needs Chau, not design):** 7-PR review/merge set (§j); three real
  customer incidents un-remediated (§c); P0 SQL-Editor batch (price-map, RLS revoke,
  phantom rows); **two app-store blockers (§k)**. Blocked on **Chau merge + SQL + paperwork**.
- **Now DECIDED (§b):** D1–D6 locked. Execution sequence linearized (§d). With #774
  merged, implementation starts the moment D1-ack + §6-flip-accept clear and Chau
  applies A17.

## b. D1–D6 — FINAL ANSWERS (locked-in; no more "leaning")

| # | Question | **LOCKED ANSWER** | Authority |
|---|---|---|---|
| **D1** | Materialized `entitlements` table vs derive-on-read? | **TABLE.** One row per `(user_id, app_id)`, server-write-only, `is_premium` GENERATED — structurally cannot drift (kills the B13 class). | A5 |
| **D2** | `profiles.tier` (text): DROP vs freeze forever? | **DROP — eventually.** T1 freeze stays. Strict order: T2 retire (P2) → column DROP (P3), never same migration. #774 path **now merged**. | A11 §4c |
| **D3** | Fold gift `user_subscriptions` into `subscriptions` vs keep legacy fallback? | **FOLD-IN** (gifts become `source='gift_code'` rows). Schema is D3-agnostic; B68 isolates gift-read (R2) as a single deletable block. | B68 §2 / A5 §D3 |
| **D4** | MRR truth = `billing_price_map` join vs Stripe amount on the row? | **RETIRE `billing_price_map`** → amount-on-row (`unit_amount` persisted), staged into **P2** after P1. **B52 Option A = DON'T BUILD.** Bridge: B42's 1-row INSERT ships NOW (≈6M VND/yr, B30-validated). Pre-backfill gate: A8's read-only `raw_payload`-completeness query (expect 0). | A8 |
| **D5** | Build B7 monitoring before or after consolidation? | **Q1 + Q4 ONLY, before** (safety net during surgery — A3 `MONITORING-q1-q4.md`, pushed). **Q2/Q3/Q5 NEVER** — consolidation deletes those drift classes. | B48 §D5 |
| **D6** | Confirm "no unattended SQL — Chau hand-applies via SQL Editor"? | **STAYS.** Every migration, INSERT, backfill, tombstone, DDL — **Chau-applied via SQL Editor, never `db push`**. Budget apply-time into every phase. | B48 §D6 |

## c. Customer-incident state (real users underserved NOW — CORRECTED)

> **A46 correction:** Chau reclassified these. mylinh + gift-victims are **REAL**
> customer-incident work, not test data (prior mis-dismissal via the flawed webhook-log
> heuristic — see §0 lesson). Real students, real money.

1. **mylinh.nutrition@gmail.com — REAL, paid 200K VND, stuck at free.** Stripe customer
   `cd9b889c`, wrong-state row. Code class bug fixed (#770). Remediation SQL regenerated;
   A36 added post-apply verify. **Pending Chau SQL Editor**: A26 runbook + B5 SQL/diagnosis
   (@ `a26/mylinh-apply-runbook`, `b5/mylinh-sql-regen`) + A36 verify SQL.
2. **Gift-code redemption victims — REAL, apply once.** Silent-loss code fixed (#787).
   **Apply path:** run **A13 Q1** → transcribe victim list into **A28's repair SQL** →
   run A28 once. Outreach copy ready (`a13/gift-redemption-victims`).
3. **Webhook payload-type bug — fix scoped.** Recon A14 → **PR #793** (A29) — §j.

## d. Execution sequence (LOCKED; gate point (1) now CLEARED)

```
┌─ HARD GATE (A12 §0 — verify in writing before ANY billing code) ───────────┐
│  (1) PR #774 MERGED on origin/main   ✅ MERGED 2026-05-19 (6b7d07490)       │
│  (2) D1 = "table" confirmed by Chau in writing (§b locks the answer; the    │
│      written Chau ack is the gate, not the recommendation)   ⬅ still open   │
│  (3) Chau accepts the mid-deploy entitlement flip (A12 §6 — expired-but-    │
│      'active' users correctly lose premium; NO grace fudge)  ⬅ still open   │
└────────────────────────────────────────────────────────────────────────────┘
        │
A5 schema (DONE) ──▶ A17 migration APPLIED  ── Chau, SQL Editor (D6)
        │              file authored: 20260519230000_create_entitlements_table.sql
        │              @ feat/entitlements-table-migration → **PR #789 (OPEN)**
        ▼
B13 phase 3 PR-A  ── additive `_shared/entitlement.ts` + exhaustive unit suite.
        │             ZERO importers, zero behavior change → trivially revertable.
        │             A31 scoped this (was BLOCKED on #774 — now UNBLOCKED).
        ▼
B13 phase 3 PR-B  ── atomic repoint of R1–R4 + integration/parity tests +
        │             one-time post-merge recompute. THE money-path PR. Real-device
        │             gate (A12 §8). Spec: A12 RECON-b13-phase3-dispatch-spec.
        ▼
A18 recomputeEntitlement single writer  ── needs A5 table live + #766 merged.
        │             Brief: RECON-recompute-entitlement-impl-brief-A18 (B68 design).
        ▼
A11 T2 retirement  ── **PR #792 (OPEN, A33)** + Chau tombstone, SQL Editor.
        │             Apply AFTER #774 (✅ done) — defense-in-depth (A11 §4b).
        ▼
P3  profiles.tier → read-only projection, then DROP (D2). B7 Q2/Q3/Q5 retired.

PARALLEL RAIL — no entitlement coupling, Chau SQL Editor, ship anytime (P0):
  • B42/B64 price-map 1-row INSERT (D4 bridge)   • anon-view RLS revoke (#750 migs)
  • period_end/start backfill (AFTER #773 merges) • A94/B21 phantom-row cleanup
  • A13→A28 gift-victim remediation               • B7 Q1+Q4 (A3, pushed) = safety net
```

**Critical-path note:** Phase 3 is logic-only, zero migrations (A12 §2). D1=table means
A17 migration (#789) lands early to unblock A18. PR-A/PR-B parallel with migration apply.

## e. Don't-redo list (DONE — do not re-dispatch; cite by branch / path)

| Topic | Report | Branch | Push |
|---|---|---|---|
| Billing as-built map | `RECON-billing-architecture-as-built-B45.md` | b45/billing-architecture-map | PUSHED |
| Billing history | `RECON-billing-history-B47.md` | b47/billing-architecture-history | PUSHED |
| Billing target state + D1–D6 framing | `RECON-billing-target-state-B48.md` | b48/billing-target-state | PUSHED |
| Entitlements table schema (D1) | `RECON-entitlements-table-schema-A5.md` | b67/entitlements-schema-spec | PUSHED |
| Entitlements migration FILE | `…/20260519230000_create_entitlements_table.sql` | feat/entitlements-table-migration (**PR #789**) | PUSHED |
| recomputeEntitlement design | `RECON-recompute-entitlement-design-B68.md` | b68/recompute-entitlement-design | **LOCAL** |
| recomputeEntitlement impl brief | `RECON-recompute-entitlement-impl-brief-A18.md` | a18/recompute-impl-brief | **LOCAL** |
| MRR source / D4 / B52-Opt-A go-no-go | `RECON-mrr-source-D4-A8.md` | b69/d4-mrr-source-strategic | **LOCAL** |
| T2 retirement DDL spec | `DESIGN-t2-retirement-migration-A11.md` | b70/t2-retirement-design (**PR #792**) | PUSHED |
| B13 phase-3 file-by-file brief | `RECON-b13-phase3-dispatch-spec-A12.md` | b71/b13-phase3-brief | **LOCAL** |
| B7 Q1+Q4 monitoring | `MONITORING-q1-q4.md` | feat/b7-q1-q4-monitoring | PUSHED |
| Profile-trigger architecture | `RECON-profile-trigger-architecture-B27.md` | b27/profile-trigger-audit | (recon) |
| Gift propagation gap | `RECON-gift-entitlement-propagation-B22.md` / `RECON-gift-write-vs-fallback-design-B58.md` | (B36-committed) / b58/gift-write-or-fallback | (recon) |
| Price-map runbook + repair SQL | `RUNBOOK-price-map-row-B42.md` / `REMEDIATION-price-map-repair-B64.sql` | b42/price-map-missing-row / b64/price-map-repair-sql | (recon) |
| Merge-queue order + PR/CI caveats | `RECON-B60-merge-queue-priority.md` / `RECON-pr-ci-status-B62.md` | b60/merge-queue-priority / b62/pr-ci-status | (recon) |
| Local branch inventory | `reports/RECON-local-branch-inventory-B46.md` | (untracked on disk in main repo) | on-disk |

**Also don't re-recon:** `RECON-isentitling*-B13.md` does not exist anywhere — findings
survive only synthesized into B48. Read B48, don't hunt for B13.

## h. Wave 3 outcomes (A28–A45 — dispatched after A27 was written)

| Agent | Contribution | Status |
|---|---|---|
| **A28** | Gift-victim repair SQL (needs A13-Q1 victim list transcribed in, run once) | LOCAL, pending Chau |
| **A29** | Webhook payload-type fix | **PR #793 OPEN** |
| **A30** | MercyGuidePanel lazy-load (14.3 KB gz off first paint) | **PR #794 OPEN** |
| **A31** | B13ph3 PR-A scope — was BLOCKED on #774, **now UNBLOCKED** (#774 merged) | `reports/B13ph3-PRA-BLOCKED-A31.md` (on disk) |
| **A32** | Currency/interval scope (subscription-amount normalization scope) | recon |
| **A33** | T2 retirement migration | **PR #792 OPEN** |
| **A34** | Namespace Tier-C archive (7 zero-ref legacy `a<N>-*` files) | **PR #791 OPEN** |
| **A35** | b25 post-#774 numeric-tier cleanup — was BLOCKED on #774, **now UNBLOCKED** | `reports/RECON-b25-post774-cleanup-A35-BLOCKED.md` (on disk) |
| **A36** | mylinh post-apply verify SQL | LOCAL, pending Chau |
| **A37** | Vendor-split recon (zod/sonner/date-fns) → shipped by A44 | recon → #795 |
| **A38** | Native Sentry audit | **recon only — no #797 (verified absent via gh)** |
| **A39** | Support-inbox audit | recon |
| **A40** | Account-deletion re-audit → blockers B1 + B2 (§k) | recon, action needed |
| **A41** | App-store re-audit → marketing-tracker blocker (§k) | recon → #796 |
| **A42** | Subscription-amount schema design | design (feeds D4/P2) |
| **A43** | Stripe-env verification → **live+test mixed-DB discovery (§i)** | recon, critical |
| **A44** | Vendor-split SHIP (zod/sonner/date-fns lazy, ~31 KB) | **PR #795 OPEN** |
| **A45** | Native marketing-tracker guard | **PR #796 OPEN** |

## i. Stripe environment reality (NEW — A43, critical)

- **One DB holds BOTH live and test Stripe data.** 38 webhook events total: **20 live,
  18 test**, intermingled in `stripe_webhook_events`.
- **The webhook log has GAPS.** Only **3 of 9** subscriptions have a matching event row.
  The other **6 are still REAL customers** — absence from the log is a logging gap, not
  proof of test data. (mylinh = case in point: real, paid 200K VND, no clean log row.)
- **Verification rule (the §0 lesson, operationalized):** to decide if a subscription is
  real, **search the Stripe Dashboard in live-mode**, not the webhook table.
- **Stripe customers — current snapshot:**
  - `115c2ecf` — active paying, **yearly**
  - `ff198c71` — active paying, **yearly**
  - `ab5a2081` — **trialing**
  - `cd9b889c` (mylinh) — **wrong-state row, needs repair** (§c.1)
  - Remaining rows: **verify via Stripe Dashboard live-mode before any classification.**

## j. PRs awaiting Chau review/merge (NEW — all CI-green, OPEN)

| PR | Branch | What | Origin |
|---|---|---|---|
| **#789** | feat/entitlements-table-migration | Entitlements table migration (D1=table) — unblocks A18 | A17/A5 |
| **#791** | cleanup/agent-id-tierc-archive | Archive 7 zero-ref legacy `a<N>-*` files (Tier-C) | A34/A23 |
| **#792** | feat/t2-retirement-migration | Retire dormant T2 trigger + dead RPC | A33/A11 |
| **#793** | fix/webhook-monotonic-object-quality | Webhook payload-type / monotonic raw_payload fix | A29/A14 |
| **#794** | perf/lazy-mercyguide-panel | Lazy-load MercyGuidePanel (14.3 KB gz) | A30/A25 |
| **#795** | perf/vendor-split-zod-sonner-datefns | Split zod/sonner/date-fns lazy (~31 KB) | A44/A37 |
| **#796** | fix/native-marketing-tracker-guard | Guard marketing trackers vs native execution | A45/A41 |

> **A38 #797 was NOT shipped** — verified absent (`gh pr view 797` → no such PR);
> A38 is recon-only. **Bundle perf combined: #794 + #795 ≈ 45 KB gzip off every first
> paint** — reputation work for VN mobile / slow networks (STRATEGY §11). Merge both.

## k. App-store submission blockers (NEW — A40 + A41)

Native (iOS/Android) submission is **blocked by two items** found in wave 3:

- **Blocker #1 — A40 account-deletion coverage.** Two sub-issues:
  - **B2 (fix FIRST):** `check-delete-account-coverage.mjs` exists but is **not wired
    to CI anywhere**. Wire it into `ci.yml`.
  - **B1 (self-enforces after B2):** A17 entitlements table is **not in
    `user-data-manifest.ts`** — 1-line fix; once B2 is wired, CI catches this class.
- **Blocker #2 — A41 marketing trackers fired on native.** Fixed by **PR #796 (A45)**.
  After #796 merges: **real-device verify** GA4 / Clarity / Pixel make **zero network
  calls** on iOS *and* Android. Then **redo Apple App Privacy + Google Data Safety
  paperwork from scratch** against the corrected tracker reality.
  *(Operator paperwork, not agent work.)*

## f. Highest-leverage next dispatches (first 30 min, priority order)

1. **#774 is merged — pivot the billing chain.** Get D1-written-ack + §6-flip-accept
   from Chau, then have Chau apply A17's migration (**#789**) via SQL Editor → dispatch
   B13 phase-3 **PR-A** (zero-risk additive module, A31 already scoped it) immediately;
   PR-B follows. This is the unblocked critical path now.
2. **Close mylinh / gift-victims (real customers, real money — outcomes > hardening).**
   Hand Chau: A2/A26 mylinh SQL+runbook; and A13-Q1 → transcribe into A28 → run once for
   gift-victims. Don't re-derive — regenerated and waiting (§c).
3. **Review/merge the 7 CI-green PRs (§j).** Prioritize **#794 + #795** (≈45 KB first
   paint, STRATEGY §11) and **#789** (unblocks A18). #791/#792/#793 are low-risk.
4. **Hand Chau the P0 SQL-Editor batch** (all D6, parallel): B42/B64 price-map INSERT ·
   anon-view RLS revoke (#750) · A94/B21 phantom rows · A13→A28 gift-victim remediation ·
   A8 flip-cond #4 read-only `raw_payload` query (D4 backfill feasibility).
5. **App-store track:** wire B2 to `ci.yml` (then B1 self-enforces); after #796 merges,
   schedule the real-device tracker verify + privacy-paperwork redo (§k, operator).

## g. Pushed vs LOCAL — where to fetch (act on this before any prune)

**🚨 SALVAGE WARNING — do NOT `git worktree prune` before pushing.** The billing-impl
design chain and customer-incident remediations are LOCAL-ONLY in `/private/tmp`
worktrees with no `origin` branch. Pruning destroys unrecoverable work.

**PUSHED** (`git show origin/<branch>:<path>`): b45/b47/b48/b67/b70-billing-*, feat/entitlements-table-migration,
feat/b7-q1-q4-monitoring, this primer (`a46/primer-refresh-may19-late`).

**LOCAL-ONLY (worktree paths below — read in place, or push first):**

| Branch | Worktree | Holds |
|---|---|---|
| b68/recompute-entitlement-design | /private/tmp/A6-recompute-design | B68 design |
| b69/d4-mrr-source-strategic | /private/tmp/A8-d4-mrr-source | D4 decision |
| b71/b13-phase3-brief | /private/tmp/A12-b13ph3-brief | B13 ph3 impl brief |
| a18/recompute-impl-brief | /private/tmp/A18-recompute-impl-brief | recompute impl brief |
| b5/mylinh-sql-regen | /private/tmp/A2-mylinh-regen | mylinh SQL + diagnosis |
| a26/mylinh-apply-runbook | /private/tmp/A26-mylinh-apply-runbook | mylinh apply runbook |
| a13/gift-redemption-victims | /private/tmp/A13-gift-victims | gift-victim audit SQL + outreach |
| a14/webhook-payload-type-audit | /private/tmp/A14-webhook-payload-audit | webhook payload-bug recon |
| (A28 worktree) | /private/tmp/A28-* | gift-victim repair SQL (needs A13-Q1 list) |
| (A36 worktree) | /private/tmp/A36-* | mylinh post-apply verify SQL |

**Chau action:** commit-don't-PR per B16, durable *locally* only. Either next session
reads in place, or Chau pushes for durability. Pushing optional; **not pruning is not.**

## l. Conventions & ops lessons (NEW — A23 + tonight)

- **Report-filename convention (A23, Wave-2 docs decision):** going forward, agent
  reports use **`RECON-<topic>-A<N>.md`** — topic is the key, `-A<N>` is provenance only.
  **Do NOT use an `a<N>-*` filename prefix.** (#791 archives the 7 legacy `a<N>-*` files.)
- **RAM / concurrency lesson:** at one point **15 Claude processes ate ~6 GB RAM** and
  wave 3 had to be held briefly. Going forward, **close terminals as agents fully report
  — don't accumulate**. RAM check: `top -l 1 -s 0 | grep PhysMem`.

---

*A27 synthesis, A46 refresh — synthesis only. Status verified via `gh`/`git` (#774
merged, 7 PRs OPEN, #797 absent). `stale-audit-note`.*
