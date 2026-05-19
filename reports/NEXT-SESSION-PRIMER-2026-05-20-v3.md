# NEXT-SESSION PRIMER — 2026-05-20 — v3

> Read immediately after STRATEGY.md + PRINCIPLES.md. **Supersedes v2**
> (`reports/NEXT-SESSION-PRIMER-2026-05-20-v2.md` @ `8d55ee953`) and v1
> (A46, @ `706983a93`). Author: A9m · branch
> `docs/next-session-primer-may20-v3` · commit-don't-PR (operator
> artifact, B16). **Disagreement order: `origin/main` → this file → v2 →
> A46 → B48 → B45.** tip-of-main at write-time: `29cb0d934`.

---

## 0. DELTAS SINCE V2 (read first — what changed after v2 was written)

v2 was written around the time #826 had just merged. Since then:

- **#789 + #832 BOTH MERGED to `origin/main`** (entitlements table + `recompute_entitlement_tx` RPC). The two prod-apply gates remain — Chau still owes the SQL Editor application of each migration before A18 PR2 can dispatch.
- **#843 OPEN — A18 PR1 IN REVIEW.** `feat/a18-recompute-entitlement-writer` — additive `recomputeAndPersistEntitlement` single writer + exhaustive unit suite, **zero call sites**. **A6h APPROVE** in #855. Logic-only; safe to merge as soon as Chau ships the two prod-applies above (or independently — PR1 doesn't touch call sites).
- **A1 PR1.5 — downgrade-beacon (~25 LOC)** is the smallest forward dependency on PR1; lands after PR1 merges, before PR2 dispatches.
- **#837 OPEN — nullable migration in review** (`feat(db): make user_id nullable on 4 audit tables for anonymize-on-deletion, A4e`). Unblocks A6d retention policy. **#859 A4 self-review** attached.
- **#842 OPEN — GAP A `email_audit` recipient-scrub** (`fix(privacy): scrub email_audit recipient rows on account deletion`). The recipient-side PII leak A4c surfaced in #819. **A6g APPROVE** in #848. The fix scope is the ~15-line recipient-keyed pre-pass A4c §"Out-of-scope follow-up" recommended.
- **#846 OPEN — Android versionCode 12→16 / versionName 1.0.2→1.0.6** (match iOS, per #841).
- **#852 OPEN — iOS build number 16→17** for next TestFlight archive.
- **#854 OPEN — `regenerate-db-types.sh` script fix** (correct output paths + dual-file invariant). Gates type-regen after #789 + #832 prod-apply.
- **#857 DRAFT — Sentry smoke-test scaffold cleanup.** **Do NOT merge until Sentry sourcemap smoke (#808 + manual verify) PASSes on prod.** Cleanup PR is staged to delete the route + lazy import + env var once verification is complete.
- **85 merged branches pruned** by A10e + A10f operator passes. `origin` is now substantially leaner; `git worktree list` is still rich (per A9k archive sweep / A9e red-branch audit), so worktree cleanup remains a separate operator step.
- **My A9 track shipped a documentation rail this session** (all OPEN, none gating critical-path billing): #800 RLS+phantom batch · #806 phantom apply runbook + A94 closure · #814 PENDING-CHAU consolidation (MERGED) · #825 red-branch audit (MERGED) · #831 B53 placeholder-DELETE package · #833 B.2a sibling addendum · #839 reports/ superseded-doc audit · #845 SUPERSEDED/PARTIAL banners applied · #850 A9h UNKNOWN classification · #853 banners + bulk archive · #856 ARCHIVE-CLASS banners on 9 cross-referenced files.

---

## a. State of play (3 bullets)

- **Accomplished this session, end state:** Billing/entitlement consolidation design phase CLOSED + PR-A executed (#802) + PR-B merged (#826) + #789 entitlements table + #832 RPC **both merged**. A18 PR1 **in review (#843, A6h APPROVE)**. Customer-incident remediation fully packaged (#799/#801/#803/#805) + B53 placeholder DELETE companion (#831). Bundle perf ≈45 KB gz off (#794+#795 merged); CI gates packaged (#809/#824). STRATEGY v3.1 (#817) + PRINCIPLES audit + P4/P16/P17 sub-clauses (#810/#823/#828/#829) all landed or queued. Reports/ housekeeping shipped (banners + archive sweep). 85 merged branches pruned.
- **Still parked (needs Chau, not design):** ~40 PR merges, **2 critical SQL applies** (#789 + #832), 4 more SQL hand-applies (customer + B53 + RLS+phantom + price-map), 2 email outreach campaigns, 2 real-device verifies, 2 paperwork redos, 1 Sentry sourcemap verify → cleanup. Critical path: Chau apply #789 SQL → #832 SQL → #854 types regen → merge #843 → dispatch A18 PR2 (wires call sites).
- **Now DECIDED:** D1 = table EXECUTED (#802 + #789 merged). §6 expiry-flip accepted (STRATEGY v3.1 codifies). A94 formally closed (superseded by B21 — #806). P17 locked (#810). P4 + P16 sub-clauses (#828/#829) pending merge. b53 PR-READY = #831 packaged (per #825 audit).

---

## b. D1–D6 — execution status

| # | Locked answer | Status as of 2026-05-19/20 EOD |
|---|---|---|
| **D1** | Materialized `entitlements` table | ✅ **EXECUTED + MIGRATION MERGED.** #802 (additive module) + #789 (table migration) both on `origin/main`. **Chau still owes SQL Editor apply of #789** before A18 PR2 dispatches. |
| **D2** | DROP `profiles.tier` eventually (T1 freeze stays; T2 retire → DROP) | 🔄 **in-flight.** #774 merged (tier-gate reads entitlement). **#792 MERGED** (T2 retirement migration). DROP still post-A18. |
| **D3** | Fold gift → `subscriptions` rows | ⏳ **deferred.** B68 isolates R2 gift-read; PR-B doesn't touch this. Active only post-A18. |
| **D4** | Retire `billing_price_map` → amount-on-row | ⏳ **bridge packaged.** #798 (price-map INSERT P0) + #804 (raw_payload feasibility template) + **#831** (B53 placeholder DELETE companion). Chau runs the read-only feasibility query → result drives A18's join path. B52 Option A = DON'T BUILD. |
| **D5** | B7 monitoring Q1+Q4 only | ✅ **shipped.** #784 OPEN (B7 Q1+Q4 monitoring runbook). |
| **D6** | No unattended SQL — Chau hand-applies | 🔒 **PERMANENT.** Every migration / INSERT / backfill / DDL via SQL Editor. Never `db push`. Never an agent. |

**New gate item — `recompute_entitlement_tx` RPC:** #832 **MERGED** (was OPEN in v2). Chau still owes the SQL Editor apply. **HARD GATE for A18 PR2 (along with #789 apply).** Source: A8d #820 §6/§10 surfaced the gap → A18b authored → #832 shipped.

---

## c. Customer-incident state (real users underserved NOW)

> Both are REAL, packaged, **awaiting Chau SQL Editor apply**. Code class bugs already fixed forward.

1. **mylinh.nutrition@gmail.com — REAL, paid 200K VND, stuck at free.** Stripe customer `cd9b889c`. Code fix: #770 merged. Remediation: **#805 Stripe Dashboard pre-flight → #801 apply package**. Two-step on purpose. Post-apply verify in A36's V4 PASS/FAIL matrix.
2. **Gift-code redemption victims — REAL, apply once per victim.** Code fix: **#787 merged**. Remediation: **#799 audit/repair package → #803 outreach ops**. Apply order: SQL first, then outreach — so the apology's promise is true at delivery.

Adjacent hygiene (not customer incidents, but money-path):

- **#806 phantom-row apply runbook** (Step-0 guard for #800 §Section 2; A94 formal closure).
- **#831 b53 placeholder DELETE** (`billing_price_map`; companion to #798).

---

## d. Execution sequence (post-#789/#832 merged; pre-prod-apply)

```
┌─ HARD GATES (cleared) ─────────────────────────────────────────────────────┐
│  (1) #774 MERGED          ✅   tier-gate reads entitlement                  │
│  (2) #802 MERGED          ✅   _shared/entitlement.ts additive (D1 exec)    │
│  (3) #826 MERGED          ✅   R1-R4 atomic repoint, 6715/6715 tests green  │
│  (4) #789 MERGED          ✅   entitlements table migration                 │
│  (5) #832 MERGED          ✅   recompute_entitlement_tx RPC migration       │
│  (6) §6 expiry-flip       ✅   STRATEGY v3.1 (#817) codifies                │
└────────────────────────────────────────────────────────────────────────────┘

┌─ HARD GATES (still open — Chau SQL Editor) ────────────────────────────────┐
│  (7) #789 applied to prod via SQL Editor   ⬅ Chau owes                     │
│  (8) #832 applied to prod via SQL Editor   ⬅ Chau owes                     │
└────────────────────────────────────────────────────────────────────────────┘
        │
        ▼  (typecheck + types-regen sanity)
[ #854 db-types script fix ] merge — gates the post-apply `npm run gen:types`
        │
        ▼
A18 PR1 (#843, A6h APPROVE) — review + merge.
   Logic-only writer; zero call sites; merging does NOT require the
   prod-applies above (those gate PR2). PR1 is independently safe.
        │
        ▼
A1 PR1.5 (downgrade beacon, ~25 LOC) — small forward dependency on PR1.
        │
        ▼
A18 PR2 (wire call sites) — HARD-GATED on prod-applies (7) + (8).
   Imports from #832's RPC; wires R1-R4 through recomputeAndPersistEntitlement.
        │
        ▼
A11 T2 retirement   ── #792 MERGED. Tombstone via SQL Editor at convenience.
        │
        ▼
P3 profiles.tier → read-only projection, then DROP (D2).

PARALLEL RAIL — no entitlement coupling, Chau SQL Editor, ship anytime:
  • #798 billing_price_map row INSERT (D4 bridge)
  • #831 b53 placeholder DELETE  (companion to #798)
  • #800 anon-view RLS revoke + phantom rows (apply per #806 Step-0 runbook)
  • #799 → #803 gift-victim remediation + outreach
  • #805 → #801 mylinh Stripe pre-flight + SQL package
  • #784 B7 Q1+Q4 monitoring (safety net)
  • #793 webhook monotonic raw_payload (MERGED — note carry-over)
  • #809 + #824 bundle-size budget CI gate
  • App-store track: #796 MERGED → #807 device-verify → paperwork redo
  • #821 iOS dSYM upload (MERGED; #816 native init audit OPEN)
  • #842 email_audit GAP A fix (A6g APPROVE)
  • #837 nullable migration (A4e, A4i self-review #859)
  • #846 Android versionCode bump · #852 iOS build 17 bump
  • #857 Sentry smoke cleanup (DRAFT — do not merge until verify)
```

---

## e. Don't-redo list (DONE — do not re-dispatch)

**Newly merged since v2 (origin/main):**

| Topic | PR |
|---|---|
| Entitlements table migration | #789 |
| `recompute_entitlement_tx` RPC | #832 |
| Native tracker guard | #796 |
| Sourcemap smoke route | #808 |
| iOS dSYM upload script | #821 |
| T2 trigger retirement | #792 |
| B1 manifest 42-table fix | #811 |
| Webhook monotonic raw_payload | #793 |
| aal=2 deletion smoke | #771 |
| Mercy-feedback regression | #762 |
| Deployment doc Vercel-only | #743 |
| explicit-any P45 sweep | #730 |
| Dead mercy-guide hooks | #729 |
| Brief preflight checklist | #764 |
| Audit defect-masking guards | #752 |
| Stale audio rm (28.3 MB) | #751 |
| Stacked-failures study | #775 |
| Anon feedback scoping | #759 |
| Pronunciation flag decision | #769 |
| Hardening wave summary | #765 |
| SQL remediation convention | #776 |
| PENDING-CHAU consolidation | #814 |
| Red-branch PR-candidate audit | #825 |

**Carry-over open / packaged from v2** (do NOT re-spec or re-recon): all the entries in v2 §e "Open / packaged" that are not in the freshly-merged table above remain valid. Notable still-OPEN: #786 formatMoney · #773 period-start symmetric · #815 A18 readiness · #820 #789 pre-apply verify · #816 native Sentry init audit · #830 Android ProGuard · #809/#824 bundle budgets · #797 delete-coverage CI · #818/#827 B1 manifest classify+crosscheck · #819 anonymize audit · #807 device verify · #801/#805/#799/#803 customer-remediation · #806 phantom runbook · #800 RLS+phantom · #798/#804 price-map+D4 · #831 B53 placeholder DELETE · #784 B7 monitor · #788/#785/#790 cleanups · #810/#812/#813/#817/#823/#828/#829 strategy/principles · #822 session summary · #835 boot sequence · #839/#845/#850/#853/#856 reports housekeeping · #833 §B.2a addendum.

**New since v2** (don't re-spec — already PR'd): #842 (email_audit GAP A) · #837 (nullable migration) · #843 (A18 PR1) · #846 (Android bump) · #852 (iOS build 17) · #854 (types script fix) · #855 (A6h approve #843) · #848 (A6g approve #842) · #847 (delete-account pipeline map) · #858 (submission blockers CLEAR-TO-ARCHIVE) · #859 (A4i self-review of #837) · #857 (Sentry cleanup DRAFT).

---

## f. Highest-leverage next dispatches — top 5

1. **Chau: apply #789 SQL + #832 SQL via SQL Editor.** Both merged; both still need the SQL Editor hand-apply (D6 permanent rule). Use #820 as the #789 pre-apply checklist; #832 is the RPC migration A8d §6/§10 surfaced. **These two applies unblock A18 PR2 dispatch.**
2. **Merge #843 (A18 PR1) + dispatch A18 PR2 after the two prod-applies above land.** PR1 has A6h APPROVE (#855); logic-only, zero call sites, mergeable independently of the apply gate. PR2 wires R1-R4 to the new RPC and is hard-gated on (1) above. A1 PR1.5 (downgrade beacon, ~25 LOC) lands between PR1 merge and PR2 dispatch.
3. **Chau: apply customer-remediation SQL — mylinh (#805 pre-flight → #801 package) + gift-victims (#799 audit → repair → #803 outreach).** Two real students, paid money, no entitlement today. Order is fixed: pre-flight before SQL, SQL before outreach.
4. **Real-device verify for #796 per #807 → privacy paperwork redo.** #796 already merged; the verify run is Chau-only (real iOS + real Android, 5 highest-traffic screens, zero tracker network rows). PASS unblocks the Apple App Privacy + Google Data Safety paperwork redo. FAIL blocks Section §E.
5. **Sentry sourcemap smoke verify → merge #857 cleanup.** Add `VITE_SENTRY_SMOKE_TEST_ENABLED=true` to Vercel prod env, trigger one redeploy, hit `https://mercyblade.com/__sentry-smoke-test?confirm=throw`, confirm the Sentry event's stack frame is `src/pages/SentrySmokeTest.tsx:33` (PASS) vs `assets/index-<hash>.js:1:NNNN` (FAIL). On PASS: remove the env var + merge **#857** to delete the route. On FAIL: investigate `@sentry/vite-plugin` before merging cleanup.

(Full ~40-PR merge sequence + ~56 Chau line items: read **#814 PENDING-CHAU-ACTIONS-2026-05-20.md** + **#833 §B.2a addendum** + **#853 archive sweep** as the canonical lists.)

---

## g. Pushed branches index — what `origin` has

**On `origin/main` already (no fetch needed):** all entries in §e "Newly merged" + v2's §e merged set.

**Pushed feature/docs branches** (`git show origin/<branch>:<path>`): every branch in the open-PR set is on `origin`. Use `gh pr list --state open --limit 80 --json number,title,headRefName` for the live list.

**Cleanup status:** A10e + A10f pruned **85 merged branches** from origin. `git worktree list` is still rich (per A9k archive sweep / A9e red-branch audit). Worktree cleanup remains a separate operator step — do **NOT** `git worktree prune` before reconciling with `gh pr list` (`b53/price-data-quality-diagnostic` is unrecoverable if pruned without its PR; A9e's other 10 verdicts also hold).

---

## h. Outstanding agent work at primer write-time

Per `/private/tmp/A*` + `gh pr list` cross-reference; reflects state on 2026-05-19/20 EOD.

| Agent | Track | Status |
|---|---|---|
| A1 | A18 PR1 + PR1.5 + onward | **#843 OPEN** (PR1, A6h APPROVE #855); PR1.5 downgrade beacon staged |
| A2/A2b | mylinh package + Stripe pre-flight | **#801/#805 OPEN** |
| A3/A3a–A3h | customer copy + STRATEGY + PRINCIPLES + boot | Most shipped; **#835 OPEN** boot sequence |
| A4/A4c/A4d/A4e/A4g/A4i | B1 manifest + anonymize + email_audit + nullable + pipeline + self-review | **#811 MERGED · #819/#842/#837/#847/#859 OPEN** |
| A5b/A5c/A5h | Bundle budgets + native CLEAR-TO-ARCHIVE | **#809/#824/#858 OPEN** |
| A6b/A6c/A6d/A6e/A6g/A6h | Device verify + P17 + B1 classify + cross-check + #842/#843 reviews | **#807/#810/#818/#827/#848/#855 OPEN** |
| A7b/A7c/A7d/A7e | Sourcemap + native Sentry + iOS dSYM + Android ProGuard | **#808 MERGED · #816/#830 OPEN · #821 MERGED · #857 DRAFT** |
| A8b/A8c/A8d/A18b | D4 + A18 readiness + #789 verify + RPC | **#804/#815/#820 OPEN · #832 MERGED** |
| A9b/A9c/A9e/A9f/A9g/A9h/A9i/A9j/A9k/A9l/A9m | Phantom + PENDING + red-branch + B53 + addendum + reports audit + banners + archive + this primer | **#806/#825/#831/#833/#839/#845/#850/#853/#856 OPEN; #814/#825 MERGED; this primer COMMIT-only** |
| A10d/A10e/A10f | Session summary + branch prune | **#822 OPEN; 85 branches pruned** |

Per P17 (#810): when any of these agents reports done, the moderator dispatches the next item from #813's risk matrix in the **same response** — never pool agents idle.

---

## i. Key lessons from this session (carry-over + new)

Carry-over from v2 §i still valid (re-read before any topic-aligned dispatch):

1. `subscription_id` ≠ `SUBSCRIPTION_PK`.
2. Pixel env is `VITE_FB_PIXEL_ID`, not `VITE_META_PIXEL_ID`.
3. `email_audit` recipient-side leak (GAP A) — **fix now in #842**.
4. `referral_audit_log` — anonymize, do NOT delete.
5. Free agent = immediate next dispatch (P17).
6. `recompute_entitlement_tx` RPC was a separate migration from #789 — **shipped via #832**.
7. "Not in `stripe_webhook_events`" ≠ "test data" — verify Stripe live mode.
8. P4 coherence-preserving micro-edits (#828).
9. P16 harness denial ≠ authorization revoked (#829).
10. Plain-text PII columns are a bug class.

**New since v2:**

11. **Premise verification before stacked-edit dispatches.** A9d (a planned A94-closure edit) was halted when the target file (`PENDING-CHAU-ACTIONS-2026-05-19.md`) turned out to live only on PR #801's branch, not `origin/main`. The dispatch would have either created a squash-orphan stack or required a content edit in another agent's territory. Always `git log origin/main -- <path>` and `git ls-remote origin <branch>` before assuming a brief's file premise.
12. **Substring-match greps are not semantic references.** A9k's archive sweep grepped each candidate filename across the repo; many "REF-OUTSIDE" hits were self-references (`reports/X.md` matching `X.md`) or substring matches of unrelated tokens. Always verify each grep hit's line context before refusing to archive. 11 of 20 were safely archivable; the 9 with real load-bearing cross-references (code/config/HTML pointers) stayed in place with ARCHIVE-CLASS banners (#856).
13. **Headline counts can disagree with body content.** A9h's table reported "11 UNKNOWN" but the per-file body explicitly tagged only 7. A9j flagged the discrepancy honestly rather than retrofitting. The lesson generalizes: when authoring summary tables, count from the per-row evidence, not from memory.
14. **Two-prod-apply gates aren't a single ceremony.** #789 + #832 are *separate* migrations; A18 PR2 dispatch requires both to be physically applied via SQL Editor. The merge-state of the PR ≠ the prod state of the DB; the gap between them is the operator's hand.

---

## j. PR queue at primer write-time

Live count: ~40 open. Grouped:

| Class | PRs | Merge verdict |
|---|---|---|
| **Critical-path billing** | #843 A18 PR1 (A6h approve) · #786 formatMoney · #773 period-start · #815 A18 readiness · #820 #789 pre-apply · #837 nullable migration · #854 types script fix | #843 first (independent of apply gate); rest sequence by dependency |
| **Customer remediation (SQL hand-apply)** | #805/#801 mylinh · #799/#803 gift · #806 phantom · #800 RLS+phantom · #798/#804 price-map+D4 · #831 B53 placeholder · #833 §B.2a addendum | Apply order in #814 §B; pre-flight before SQL, SQL before email |
| **App Store gate** | #807 device-verify · #797 delete-coverage CI · #818 B1 classify · #827 B1 cross-check · #819 anonymize audit · #842 email_audit GAP A (A6g approve) · #846 Android bump · #852 iOS build 17 · #847 delete-account pipeline · #858 CLEAR-TO-ARCHIVE | #807 verify → paperwork redo |
| **Sentry / observability** | #816 native init · #830 Android ProGuard · #857 cleanup DRAFT | #857 NOT before sourcemap verify PASSes |
| **Perf / CI gates** | #809 budget · #824 budget tighten · #788 B25 bypass · #785 sign-audio dead | Low risk, high durability |
| **Docs / strategy / principles** | #810 P17 · #817 STRATEGY v3.1 · #812 strategy drift · #823 P1-P17 · #828 P4 · #829 P16 · #813 PR backlog · #790 NORTH_STAR · #822 session summary · #835 boot sequence | #810 first |
| **Reports housekeeping (A9 track)** | #839 reports audit · #845 banners · #850 UNKNOWN classify · #853 archive sweep · #856 archive-class banners | All independent; merge any time |
| **Reviews** | #855 A6h approve #843 · #848 A6g approve #842 · #859 A4i self-review #837 | Merge with their target PRs |
| **Test / hygiene** | broad tail per v2 §j | Tier-D/E per #813 |

**Read #813 + #814 first for merge order.** This table is a snapshot; the risk-matrix and the action-ledger are the canonical reads.

---

## k. App-store submission blockers (NEW state — carry-over from v1 §k + v2)

Per primer v1 §k carry-over + updates:

- **Blocker #1 — A40 account-deletion coverage.** **B2 WIRED (#797 OPEN)** + B1 manifest 42 **MERGED (#811)**. Email_audit GAP A fix in #842 (A6g APPROVE). Nullable audit-tables migration in #837 (A4i self-review). Once all three merge + #842/#837 apply, B1 self-enforces.
- **Blocker #2 — A41 marketing trackers on native.** **#796 MERGED**. Awaiting Chau's real-device verify per #807 (operator paperwork; not agent work). Then Apple App Privacy + Google Data Safety redo from scratch (`docs/app-store-submission/` checklists need same-day update). #858 (A5h) audits the submission blockers and notes CLEAR-TO-ARCHIVE pre-conditions.

---

## Boot sequence for the next session

1. **Read this primer §0** (deltas from v2).
2. **Read STRATEGY.md** (v3.1 if #817 merged; v3.0 + #812 audit if not).
3. **Read PRINCIPLES.md** (P17 if #810 merged; P4 + P16 sub-clauses if #828/#829 merged).
4. **Read #813 PR risk matrix + #814 PENDING-CHAU-ACTIONS** — the canonical "what to merge next" and "what Chau owes" lists. (#833 adds §B.2a B53 sibling; treat as part of #814.)
5. **Read A9k archive disposition** (#853) before assuming any `reports/aN-*` file is live; the 9 ARCHIVE-CLASS files (#856) carry banners but are kept in place for code references.
6. Before any dispatch: confirm the topic isn't on §e don't-redo above.
7. Per P17: when an agent reports back, **dispatch the next task in the same response**.
8. Per P4 + P16 sub-clauses (if merged): coherence-preserving micro-edits inside an authorized scope allowed + must be flagged; harness denials → minimum workaround + report-flag, never bypass, never drop.

---

*A9m synthesis after the late wave. Replaces v2 + v1. Verified via `gh`/`git`: #789 MERGED · #832 MERGED · #843 OPEN (A6h approve) · #842 OPEN (A6g approve) · #837 OPEN (A4i self-review) · #846/#852/#854/#857 OPEN · 85 merged branches pruned.*
