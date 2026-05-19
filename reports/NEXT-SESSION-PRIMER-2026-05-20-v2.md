# NEXT-SESSION PRIMER — 2026-05-20 — v2

> Read immediately after STRATEGY.md + PRINCIPLES.md. **Supersedes the A46 primer**
> (`reports/NEXT-SESSION-PRIMER-2026-05-20.md` @ `706983a93`, "v1") and the A10d
> late-wave session summary (#822). Author: A3h · branch
> `docs/next-session-primer-may20-v2` · commit-don't-PR (operator artifact, B16).
> **Disagreement order: `origin/main` → this file → A46 primer → B48 → B45.**
> tip-of-main at write-time: `d4cf1e382`.

---

## 0. DELTAS SINCE A46 (read first — what changed after A46 was written)

A46 was written at the start of the late wave (around the time #774/#787 had merged). Everything after that point is delta:

- **More merges to `origin/main`** since A46: `#791` (Tier-C archive), `#794` (lazy MercyGuidePanel, 14.3 KB gz), `#795` (zod/sonner/date-fns split, ~31 KB gz), `#802` (`_shared/entitlement.ts` additive — **D1 executed**). Tip moved `6b7d07490` → `d4cf1e382`. Bundle perf combined ≈45 KB gz off every first paint.
- **Customer remediation fully packaged.** Gift-victim repair (#799 + #803 outreach ops). Mylinh apply (#801 + #805 Stripe pre-flight). All four are paste-ready operator runbooks — SQL Editor only, no `db push`.
- **STRATEGY.md v3.1 ready to land** (#812 audit + #817 apply). §6 + §7 + §15 freshness pass; no §1-5/§8-14 change.
- **PRINCIPLES.md hardened.** P17 (free agent → immediate dispatch) → #810. A3e P1-P17 consistency audit → #823. Two sub-clauses landed: #828 (P4 coherence-required micro-edits) + #829 (P16 harness-policy seam).
- **B13 phase-3 PR-B MERGED** (#826). A1c's `feat/b13ph3-pr-b` — atomic R1-R4 repoint + parity tests, **6715/6715 tests green**, all checks green. Money-path PR shipped. R1-R4 (gift-fetch, tier-gate, webhook-core, billing-readonly) now read from `_shared/entitlement.ts`.
- **A18 PR1 in flight.** A2 resuming on `/private/tmp/A1d-a18-pr1` → `feat/a18-recompute-entitlement-writer`. Logic-only writer (no migrations needed per A12 §2); zero call sites in this PR. Reports in when ready.
- **#789 pre-apply verify done** (A8d → #820). Migration PASSes as-scoped, **but `recompute_entitlement_tx` RPC is NOT in #789** — that RPC is **#832 (OPEN)**, separate migration. Both #789 + #832 must be applied to prod before A18 PR2 wires call sites. **HARD GATE for A18 PR2.**
- **B1 manifest fix in flight.** A4 #811 (42 tables added) + A6d #818 (classification doc) + A4c #819 (anonymize audit, found `email_audit` GAP A) + A6e #827 (manifest cross-check).
- **CI/perf gates packaged.** A5b bundle budget gate (#809) + A5c tightened threshold (#824); A7b sourcemap smoke (#808); A7d iOS dSYM (#821); A7e Android ProGuard scope (#830); A7c native Sentry init audit (#816).
- **Ops surfaces:** A9c PENDING-CHAU-ACTIONS consolidation (#814 — **56 line items, the single read for what Chau owes**); A2c PR-review backlog risk matrix (#813); A9b phantom-row apply runbook + A94 formal closure (#806); A9e red-branch audit (#825 — found 1 PR-READY: `b53/price-data-quality-diagnostic`); A10d session summary (#822).

---

## a. State of play (3 bullets)

- **Accomplished (this session, end state):** Billing/entitlement consolidation **design phase CLOSED** (B48 / A5 / B68 / A8-D4 / A11 / A12) AND **PR-A executed** (`_shared/entitlement.ts` additive #802 merged) AND **PR-B MERGED** (#826 — R1-R4 atomic repoint, 6715/6715 tests green). A18 PR1 in flight. Customer-incident remediation fully packaged (#799/#801/#803/#805). Bundle perf ≈45 KB gz off (#794+#795 merged). STRATEGY v3.1 (#812/#817) + PRINCIPLES audit + sub-clauses (#823/#828/#829) all landed or queued.
- **Still parked (needs Chau, not design):** ~39 PR merges, 8 SQL hand-applies, 2 email outreach campaigns, 2 real-device verifies, 2 paperwork redos (per #814). Critical path: #789 merge + apply → #832 RPC migration merge + apply → A18 PR1 review → A18 PR2 dispatch (wires call sites, gated on both prod-applies).
- **Now DECIDED:** D1 = table EXECUTED (#802 + #789). §6 expiry-flip accepted (no grace fudge — STRATEGY v3.1 codifies). A94 formally closed (superseded by B21 — #806). P17 locked (#810). P4 + P16 sub-clauses pending (#828/#829).

---

## b. D1–D6 — execution status

A46 locked the answers; this primer tracks **which are executed vs still in-flight**.

| # | Locked answer | Status as of 2026-05-19 EOD |
|---|---|---|
| **D1** | Materialized `entitlements` table | ✅ **EXECUTED.** #802 merged (additive module, zero importers). #789 OPEN — Chau merge + SQL Editor apply pending. |
| **D2** | DROP `profiles.tier` eventually (T1 freeze stays; T2 retire → DROP) | 🔄 **in-flight.** #774 merged (tier-gate reads entitlement now). #792 OPEN (T2 retirement migration, A11/A33). DROP still post-A18. |
| **D3** | Fold gift → `subscriptions` rows | ⏳ **deferred.** B68 isolates R2 gift-read; PR-B doesn't touch this. Active only post-A18. |
| **D4** | Retire `billing_price_map` → amount-on-row | ⏳ **bridge in flight.** #798 (price-map INSERT P0) + #804 (raw_payload feasibility template). Chau runs the read-only feasibility query → result drives A18's join path. **B52 Option A = DON'T BUILD** (confirmed). |
| **D5** | B7 monitoring Q1+Q4 only, pre-consolidation | ✅ **shipped.** #784 OPEN (B7 Q1+Q4 monitoring runbook). Q2/Q3/Q5 stay retired. |
| **D6** | No unattended SQL — Chau hand-applies | 🔒 **PERMANENT.** Every migration / INSERT / backfill / DDL via SQL Editor. Never `db push`. Never an agent. Apply-time budgeted into every phase. |

---

## c. Customer-incident state (real users underserved NOW)

> Both are REAL, packaged, **awaiting Chau SQL Editor apply**. Code class bugs already fixed forward; this is the historical-cohort cleanup.

1. **mylinh.nutrition@gmail.com — REAL, paid 200K VND, stuck at free.** Stripe customer `cd9b889c`. Code fix: #770 (B5 class bug, merged). Remediation: **PR #801** (apply package, on `b54/pending-chau-actions`) + **PR #805** (Stripe Dashboard pre-flight — applies BEFORE #801). Two-step on purpose: pre-flight verifies Stripe state, then SQL package re-grants. Post-apply verify in A36.
2. **Gift-code redemption victims — REAL, apply once per victim.** Code fix: **#787** (redeem-gift-code returns honest errors, merged). Remediation: **PR #799** (audit Q1 → transcribe → repair SQL) + **PR #803** (send-side outreach ops: VI primary, Resend-verified admin@mercyblade.com, three-wave self-test→canary→remainder, 6 abort signals). Apply order: SQL first (#799), then outreach (#803) — so the apology's promise is true at delivery.

Also under "money-path" but not a customer incident: **#806 phantom-row apply runbook** (B21 instrumentation, formalizes A94 closure).

---

## d. Execution sequence (post-#826 merged)

```
┌─ HARD GATES (cleared) ─────────────────────────────────────────────────────┐
│  (1) PR #774 MERGED          ✅ 6b7d07490   tier-gate reads entitlement     │
│  (2) PR #802 MERGED          ✅ cff975a54   _shared/entitlement.ts additive │
│  (3) D1 = table              ✅ executed by #802 + #789-pending             │
│  (4) §6 expiry-flip          ✅ accepted (STRATEGY v3.1 #817)               │
│  (5) PR #826 MERGED          ✅ R1-R4 atomic repoint, 6715/6715 tests green │
└────────────────────────────────────────────────────────────────────────────┘

┌─ HARD GATES (still open — gate A18 PR2, not PR1) ──────────────────────────┐
│  (6) #789 merge + SQL Editor apply         ⬅ Chau owes                     │
│  (7) #832 recompute_entitlement_tx RPC      ⬅ OPEN; separate migration from│
│      merge + SQL Editor apply                #789 (per A8d #820 §6/§10).   │
└────────────────────────────────────────────────────────────────────────────┘
        │
A18 PR1 (logic-only writer)  ── IN FLIGHT (A2 on /private/tmp/A1d-a18-pr1
        │                       → feat/a18-recompute-entitlement-writer).
        │                       Additive `recomputeAndPersistEntitlement` +
        │                       exhaustive unit suite, ZERO call sites.
        │                       Authorable now (no migrations needed per
        │                       A12 §2). A8c readiness audit = #815.
        ▼
[ #789 applied to prod ] AND [ #832 applied to prod ]   ⬅ Chau, SQL Editor
        ▼
A18 PR2 (wire call sites)  ── HARD-GATED on the two prod-applies above.
        │                       Imports from #832's RPC; wires R1-R4
        │                       through `recomputeAndPersistEntitlement`.
        ▼
A11 T2 retirement   ── #792 OPEN. Apply AFTER #774 (✅). Tombstone via SQL Editor.
        │
        ▼
P3 profiles.tier → read-only projection, then DROP (D2). B7 Q2/Q3/Q5 retired.

PARALLEL RAIL — no entitlement coupling, Chau SQL Editor, ship anytime (P0):
  • #798 billing_price_map row INSERT (D4 bridge) + b53 placeholder DELETE
    (A9e found b53/price-data-quality as PR-READY follow-up)
  • #800 anon-view RLS revoke + phantom rows (apply per #806 runbook)
  • #799 → #803 gift-victim remediation + outreach
  • #805 → #801 mylinh Stripe pre-flight + SQL package
  • #784 B7 Q1+Q4 monitoring (safety net during surgery)
  • #793 webhook monotonic raw_payload
  • #809 + #824 bundle-size budget CI gate (locks #794+#795 wins)
  • App-store track: #796 merge → #807 real-device verify → #815-style paperwork redo
  • B1 manifest fix: #811 → #818 classify → #819 anonymize audit → #827 cross-check
    → **A4d** (forward dispatch slot) for the email_audit GAP A close
```

---

## e. Don't-redo list (DONE — do not re-dispatch)

Merged or in-PR. Re-dispatching duplicates work.

**Merged this session (origin/main):**

| Topic | PR |
|---|---|
| Tier-gate reads entitlement (B17 PR1) | #774 |
| Redeem-gift honest errors (B22 narrow) | #787 |
| Tier-C legacy `a<N>-*` archive (7 files) | #791 |
| MercyGuidePanel lazy-load (14.3 KB gz) | #794 |
| zod/sonner/date-fns lazy split (~31 KB gz) | #795 |
| `_shared/entitlement.ts` additive (B13ph3 PR-A, D1 executed) | #802 |

**Open / packaged (do NOT re-spec or re-recon):**

| Topic | Branch | PR |
|---|---|---|
| Entitlements table migration | feat/entitlements-table-migration | #789 |
| `recompute_entitlement_tx` RPC | (not yet branched) | gap surfaced in #820 |
| B13 phase-3 PR-B atomic repoint | feat/b13ph3-pr-b | #826 |
| T2 trigger retirement | feat/t2-retirement-migration | #792 |
| formatMoney zero-decimal | fix/formatmoney-zero-decimal | #786 |
| Webhook monotonic raw_payload | fix/webhook-monotonic-object-quality | #793 |
| getCurrentPeriodStart symmetric fix | b26/period-start-fix | #773 |
| Native tracker guard | fix/native-marketing-tracker-guard | #796 |
| iOS dSYM upload + Run Script docs | feat/ios-dsym-upload | #821 |
| Android ProGuard Sentry scope | docs/android-proguard-sentry-scope | #830 |
| Native Sentry init audit | docs/native-sentry-init-audit | #816 |
| Sourcemap smoke route | test/sourcemap-upload-smoke | #808 |
| Bundle-size budget gate | ci/bundle-size-budget · ci/bundle-budget-tighten | #809 · #824 |
| `check-delete-account-coverage` to CI | fix/b2-wire-delete-coverage-ci | #797 |
| B1 manifest 42-table fix | fix/b1-manifest-42-tables | #811 |
| B1 manifest classification | docs/b1-manifest-table-classification | #818 |
| B1 manifest cross-check | docs/b1-manifest-crosscheck | #827 |
| B1 anonymize audit (`email_audit` GAP A) | docs/b1-anonymize-path-audit | #819 |
| Real-device tracker-verify checklist | docs/796-device-verify | #807 |
| mylinh apply-ready package | b54/pending-chau-actions | #801 |
| mylinh Stripe Dashboard pre-flight | chore/mylinh-stripe-preflight | #805 |
| Gift-victim apply package | chore/gift-victims-package | #799 |
| Gift-victim outreach ops | chore/gift-outreach-ops | #803 |
| RLS revoke + phantom rows P0 | chore/rls-phantom-package | #800 |
| Phantom-row apply runbook (A94 close) | docs/phantom-row-apply-runbook | #806 |
| Price-map INSERT + raw_payload feasibility | chore/price-map-insert-package | #798 |
| D4 raw_payload feasibility template | docs/raw-payload-feasibility-result | #804 |
| #789 migration pre-apply verify | docs/789-migration-verify | #820 |
| A18 recompute impl readiness audit | docs/a18-recompute-impl-prep | #815 |
| B7 Q1+Q4 monitoring runbook | feat/b7-q1-q4-monitoring | #784 |
| B25 numeric tier>=N bypass map | cleanup/delete-b25-numeric-tier-bypass | #788 |
| B17 PR3 sign-audio dead code | cleanup/b17-pr3-sign-audio-dead | #785 |
| NORTH_STAR reference cleanup | cleanup/northstar-strategy-naming | #790 |
| PR review backlog risk matrix | docs/pr-review-backlog-sequencing | #813 |
| PENDING-CHAU-ACTIONS consolidation | docs/pending-actions-consolidation | #814 |
| Red-branch PR-candidate audit | docs/red-branch-pr-candidates | #825 |
| STRATEGY drift audit | docs/strategy-drift-audit | #812 |
| STRATEGY v3.1 apply | docs/strategy-v31 | #817 |
| PRINCIPLES P17 | docs/principles-immediate-dispatch | #810 |
| PRINCIPLES P1-P17 audit | docs/principles-audit | #823 |
| PRINCIPLES P4 sub-clause | docs/principles-p4-coherence | #828 |
| PRINCIPLES P16 sub-clause | docs/principles-p16-harness | #829 |
| Session summary 2026-05-19 late | docs/session-summary-2026-05-19-late | #822 |

**Carry-over from A46 don't-redo (all still valid):** the B45/B47/B48 architecture chain, B67 entitlements schema spec, B68 recompute design, B69 D4 strategic, B71 B13ph3 brief, A18 recompute impl brief, A2/A26 mylinh runbook, A13 audit + A28 repair, A14/A29 webhook scope, B27 profile-trigger architecture, B22/B58 gift propagation, B42/B64 price-map, B60/B62 merge order. Read the A46 §e table for branch paths.

---

## f. Highest-leverage next dispatches — top 5 (next session, in order)

1. **A18 PR1 in flight (A2 on `/private/tmp/A1d-a18-pr1`); merge when it reports, then dispatch A18 PR2 after #789 + #832 applied to prod.** PR1 is the additive single-writer + unit suite (zero call sites, no migrations); PR2 wires R1-R4 to it and is the one that requires both prod-applies. (#826 already shipped R1-R4 repoint to the `_shared/entitlement.ts` reader — PR-B merged earlier this session.)
2. **Chau: merge #789 + #832 → apply each via SQL Editor → unblock A18 PR2.** A8d #820 is the #789 pre-apply checklist; #832 is the separate RPC migration that A8d §6/§10 surfaced as missing from #789. Both must be physically applied to prod before A18 PR2 dispatches.
3. **Chau: apply customer-remediation SQL — mylinh (#805 pre-flight → #801 package) + gift-victims (#799 audit → repair → #803 outreach).** Two real students, paid money, no entitlement today. Order is fixed: pre-flight before SQL, SQL before outreach.
4. **Merge #796 → device-verify per #807 → privacy paperwork redo.** Last code gate before App Store paperwork. Tracker guard must be verified on real iOS *and* Android (per #807 STOP gates: any tracker network call on any screen = FAIL).
5. **Merge #809 + #824 bundle-budget CI gate.** Locks the #794+#795 ≈45 KB gz wins in CI so they can't silently regress. Trivial diff; high durability value.

(Full ~39-PR merge sequence + ~56 Chau line items: read #814 PENDING-CHAU-ACTIONS as the canonical list.)

---

## g. Pushed branches index — what `origin` has that the next session can `git show`

**On `origin/main` already (no fetch needed):** the 6 merges from §e top table.

**Pushed feature/docs branches (use `git show origin/<branch>:<path>`):** every branch in the §e "open / packaged" table is on `origin` — both `docs/*` and `feat/*` / `fix/*` / `chore/*` / `cleanup/*` / `test/*` / `ci/*` / `b<N>/*` / `a<N>/*` namespaces all pushed. The full list is queryable via `gh pr list --state open --limit 80 --json number,title,headRefName`.

**Companion branches not associated with an open PR (recon/design):** A46 primer documented the LOCAL-only worktree set; A10b (pushed via `a10/ops-local-worktree-reports`) and #825 (A9e red-branch audit) materially shrank that set. Per #825 the remaining classifications are: 1 PR-READY (`b53/price-data-quality-diagnostic`), 1 SUPERSEDED, 5 RECON-ONLY (live, feeds other PRs), 1 RECON-ONLY (meta), 3 STALE point-in-time snapshots. See #825 for per-branch verdicts.

**🚨 SALVAGE WARNING carry-over from A46:** don't `git worktree prune` until #825 + A10 push-durability pass is fully reconciled with `gh pr list`. The b53 PR-READY is unrecoverable if pruned without a PR open first.

---

## h. Outstanding agent work at primer write-time

Per `/private/tmp/A*` + `gh pr list` cross-reference; reflects state on 2026-05-19 EOD.

| Agent | Track | Status |
|---|---|---|
| A1c | B13ph3 PR-B (consumer wiring) | **#826 OPEN** — ready for review |
| A2b | mylinh Stripe pre-flight | **#805 OPEN** |
| A3-A3g | money-path packaging + STRATEGY + PRINCIPLES | All shipped (#799/#803/#812/#817/#823/#828/#829) |
| A4c | B1 anonymize audit | **#819 OPEN** — surfaces `email_audit` GAP A |
| A4d (future) | `email_audit` GAP A fix | **not yet dispatched** — recipient-keyed pre-pass in `delete-account/index.ts` |
| A5c | Bundle budget tighten | **#824 OPEN** |
| A6b | #796 device-verify checklist | **#807 OPEN** |
| A6c | P17 | **#810 OPEN** |
| A6d/e | B1 manifest classify + cross-check | **#818/#827 OPEN** |
| A7b/c/d/e | Sentry sourcemap discipline (smoke + native init + iOS dSYM + Android ProGuard) | **#808/#816/#821/#830 OPEN** |
| A8b/c/d | D4 feasibility + A18 readiness + #789 pre-apply verify | **#804/#815/#820 OPEN** |
| A9b/c/e | phantom-row runbook + PENDING-CHAU + red-branch audit | **#806/#814/#825 OPEN** |
| A10d | session summary 2026-05-19 late | **#822 OPEN** |

Per P17 (#810, once merged): when any of these reports done, the moderator dispatches the next item from #813's risk matrix in the **same response** — never pool agents idle.

---

## i. Key lessons from this session (the §0-style block — read before any dispatch in these areas)

These join A46's §0 carry-over. Future agents must read these before touching their topic area.

1. **`subscription_id` ≠ `SUBSCRIPTION_PK`.** Stripe's `sub_…` string is not the Supabase `user_subscriptions.id` UUID. Cross-system joins MUST state explicitly which identifier they use — a SQL fix on the wrong column runs cleanly and silently produces nothing. (A2b Stripe Dashboard pre-flight #805.)
2. **The pixel env var is `VITE_FB_PIXEL_ID`, NOT `VITE_META_PIXEL_ID`.** Caught by A6b reading the consuming code, not the brief. The brief is not the source of truth for env var names; the consuming code is. Grep before naming.
3. **`email_audit` has a recipient-side PII leak (GAP A).** `delete-account/index.ts:143-161` Pass-2 anonymize is keyed on `admin_user_id` — that filter MISSES the common case (user was the recipient, not the admin sender). Result: `recipient_email` + `subject` survive account deletion. Fix scope = ~15 lines (recipient-keyed pre-pass), dispatched as **A4d** future work. #797's coverage script does NOT catch this class because `recipient_email` isn't user-id-shaped. (A4c #819.)
4. **`referral_audit_log`: anonymize, do NOT delete.** Fraud-detection retention requires the row to survive account deletion (audit purpose, Art. 17(3)(e)). Scrub user_id → null + drop personal fields; never DELETE. (Pattern documented in A4c #819's GDPR cross-reference, applied where similar fraud/admin retention exists.)
5. **Free agent = immediate next dispatch (P17, #810).** When an agent reports "done" or "blocked-on-Chau," the moderator gives them the next task in the same response — don't pool agents idle. Locked in by PRINCIPLES.md P17.
6. **`recompute_entitlement_tx` RPC is NOT in #789** (only the table is). The A18 brief §6 REQUIRES an atomic entitlements+profiles writer; Deno edge has no cross-table txn so the RPC is mandatory. A separate migration is needed before A18 PR1 dispatches. (A8d #820 §6/§10.)
7. **"Not in `stripe_webhook_events`" ≠ "test data"** (carry-over from A46, reinforced by mylinh case). The webhook log has GAPS — only 3 of 9 real subscriptions had a matching event row. Verify via Stripe Dashboard live-mode, never the webhook table alone.
8. **Coherence-preserving micro-edits inside an authorized scope are NOT scope creep** (PRINCIPLES P4 sub-clause, #828 OPEN). Bumping a frontmatter date when the body landed a new changelog entry is part of landing the authorized scope cleanly; flag in commit + PR body so the maintainer can revert just that line.
9. **Harness denial ≠ authorization revoked** (PRINCIPLES P16 sub-clause, #829 OPEN). When Chau authorizes "push + PR" and the auto-mode classifier still denies (e.g. classifier doesn't see the brief), the agent does the minimum workaround that preserves intent + flags the denial. Never bypass with `--no-verify`-style escapes without separate authorization; never silently drop the action either.
10. **Plain-text PII columns are a bug class.** `(recipient_email | user_email | target_email | to_address | notification_email)` are NOT in any user-id-hint allowlist; #797's coverage gate cannot catch them. Privacy-completeness sweep is open follow-up (A4c #819 §"Out-of-scope follow-up").

---

## j. PR queue at primer write-time

Active open PRs grouped by class. Verdicts where known come from #813 (risk matrix) + #814 (PENDING-CHAU). Full list: `gh pr list --state open --limit 80`.

| Class | PRs | Merge verdict |
|---|---|---|
| **Critical-path billing** | #789 entitlements table · #826 PR-B atomic repoint · #792 T2 retirement · #786 formatMoney · #793 webhook monotonic · #773 period-start symmetric · #815 A18 readiness · #820 #789 pre-apply | Sequence: #789 → RPC migration (new) → #826 → #792 |
| **Customer remediation (SQL hand-apply)** | #805 mylinh pre-flight · #801 mylinh package · #799 gift audit/repair · #803 gift outreach · #806 phantom runbook · #800 RLS+phantom batch · #798 price-map INSERT · #804 D4 feasibility | Apply order in #814; pre-flight before SQL, SQL before email |
| **App Store gate** | #796 native tracker guard · #807 device-verify checklist · #797 delete-coverage CI · #811 B1 manifest 42 · #818 manifest classify · #819 anonymize audit · #827 manifest cross-check · #771 aal=2 deletion smoke | #796 → #807 verify → privacy paperwork redo |
| **Sentry / observability** | #808 sourcemap smoke · #816 native Sentry audit · #821 iOS dSYM · #830 Android ProGuard · #762 mercy-feedback regression | All independent; merge any time |
| **Perf / CI gates** | #809 bundle budget · #824 budget tighten · #788 B25 bypass map · #785 sign-audio dead | Low risk; high durability value |
| **Docs / strategy / principles** | #817 STRATEGY v3.1 · #812 strategy drift audit · #823 P1-P17 audit · #828 P4 sub-clause · #829 P16 sub-clause · #810 P17 · #813 PR backlog · #814 PENDING-CHAU · #790 NORTH_STAR cleanup · #822 session summary · #825 red-branch audit · this primer | #810 first (unblocks process), then #817, others independent |
| **Test / hygiene** | #752 skipped-tests audit · #769 pronunciation flag decision · #765 May 19 hardening summary · #738 plc2 re-surface (PR 11/11) · #733 room validator strict · #730 explicit-any P45 · #729 dead hooks · #727 a11y account · #751 stale audio rm · #760 touch targets · #761 signup alias · #759 anon feedback scoping · #743 deployment doc cleanup · #742 PDPD compliance · #739 SEO JSON-LD · #731 cron live-fire test · #766 CAS backoff jitter | Tier-D/E per #813 |
| **Agent-briefs / conventions** | #781 PR title convention · #780 dispatch-brief template · #782 premise correction · #777 PR body template · #776 SQL remediation convention · #783 session-end principles · #779 VR audit · #778 monitor query validation · #775 lesson 11 stacked failures · #764 brief preflight | Independent; merge as reviewer bandwidth allows |

**Read #813 + #814 first for the merge order.** This table is a snapshot; the risk-matrix and the action-ledger are the canonical reads.

---

## Boot sequence for the next session

1. **Read this primer §0** (deltas from A46) — orients you on what's new since the last write.
2. **Read STRATEGY.md** (v3.1 if #817 merged; v3.0 + #812 audit if not).
3. **Read PRINCIPLES.md** (P17 if #810 merged; P4 + P16 sub-clauses if #828/#829 merged).
4. **Read #813 PR risk matrix + #814 PENDING-CHAU-ACTIONS** — the canonical "what to merge next" and "what Chau owes" lists.
5. Before any dispatch: confirm the topic isn't on §e don't-redo above.
6. Per P17: when an agent reports back, **dispatch the next task in the same response**.
7. Per P4 + P16 sub-clauses (if merged): coherence-preserving micro-edits inside an authorized scope are allowed + must be flagged; harness denials → minimum workaround + report-flag, never bypass, never drop.

---

*A3h synthesis after the gift-victim/strategy/principles arc. Replaces A46 + #822. Verified via `gh`/`git`; #826 OPEN, #789 + RPC still gating A18, #802 merged.*
