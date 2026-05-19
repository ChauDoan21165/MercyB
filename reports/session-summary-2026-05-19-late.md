# Session summary — 2026-05-19 late wave (A10d)

**Window:** 2026-05-19T18:00:00Z onward (the "late" wave; the earlier wave that day is summarized by the A46 primer).
**Author:** A10 (operations agent — push-durability + summary tracks).
**Read this alongside:** the A46 next-session primer + STRATEGY v3.1 (#817, pending merge) + PRINCIPLES P17 (#810, pending merge).

## §0 Lessons (reinforced or newly learned this wave)

These join the §0 carry-over block from the A46 primer. Future agents must read these before re-dispatching anything in their topic area.

1. **`subscription_id` ≠ `SUBSCRIPTION_PK`.** Stripe's `sub_…` string is not Supabase's UUID primary key. A2b's Stripe Dashboard pre-flight surfaced this; any cross-system join logic must explicitly state which identifier it uses. *Why this matters:* a SQL fix written against the wrong column will look correct, run cleanly, and produce nothing — a silent miss in the worst place.
2. **The pixel env var is `VITE_FB_PIXEL_ID`, not `VITE_META_PIXEL_ID`.** Caught by A6b reading the codebase rather than the brief. *Why this matters:* the brief is not the source of truth for env var names; the consuming code is. Grep before naming.
3. **"Not in webhook log" ≠ "test data."** The primer §0 carry from the earlier wave; reinforced this session by the mylinh case (real customer, real payment, no webhook row → root cause was *not* "test mode" but a real ingestion gap). *Why this matters:* the absence of a row is a real signal, not a green light to dismiss the customer.
4. **Free agent = immediate next dispatch (P17).** When an agent reports "done" or "blocked-on-Chau," the moderator gives them the next task in the queue right then — don't pool agents idle. Locked in by PR #810.

## §1 PRs shipped to main this wave (merged ≥ 18:00 UTC)

| # | Title | Agent | Track |
|---|---|---|---|
| **#774** | `fix(billing): premium gates read entitlement, not stale profiles.tier` (B17 PR1) | B17 / B25 | tier-gate fix |
| **#787** | `fix(billing): redeem-gift-code honest errors instead of ok:true silent loss` (B22 narrow) | A7 | gift-victim repair |
| **#791** | `cleanup(reports): archive 7 zero-reference legacy a<N>-* files` (Tier-C per A23) | A34 | hygiene |
| **#794** | `perf(bundle): lazy-load MercyGuidePanel — 14.3 KB gz off first paint` (A25 Lever 1) | A30 | bundle perf |
| **#795** | `perf(bundle): split zod/sonner/date-fns into lazy chunks` (~31 KB first paint) | A37 | bundle perf |
| **#802** | `feat(billing): B13ph3 PR-A — _shared/entitlement.ts (additive, zero importers)` | A1 / B13ph3 | entitlement architecture (D1=table executed) |

6 PRs merged to `origin/main` between 20:21 and 21:48 UTC. Tip-of-main is `cff975a5...d4cf1e38`.

## §2 Open PRs from this wave (queued for review/merge)

PRs created in this session and awaiting Chau's merge sequencing (consult #813 for the recommended risk-matrix order):

| # | Title | Agent | Notes |
|---|---|---|---|
| #784 | `docs(money-path): B7 Q1+Q4 SQL Editor monitoring runbook` | A3 | docs-only |
| #785 | `cleanup(b17-pr3): remove dead sign-audio resolver path` | A4 | small cleanup |
| #786 | `fix(billing): formatMoney zero-decimal currency 100× understatement` | A1 | money-path correctness |
| #788 | `docs(recon): B25 numeric tier>=N bypass map — A19 no-op (gated on #774)` | A19 | unblocked by #774 |
| #789 | `feat(db): entitlements table per A5 spec (D1=table)` | A5 / B13ph3 | **CRITICAL PATH — SQL apply required after merge** |
| #790 | `docs: remove stale NORTH_STAR.md references (retired v2.0)` | A24 | docs-only |
| #792 | `feat(db): retire dormant T2 trigger + dead RPC` | A11 | db migration |
| #793 | `fix(webhook): monotonic raw_payload on object quality` | A14 / A29 | webhook hardening |
| #796 | `fix(privacy): guard marketing trackers against native execution` | A41 | **CRITICAL PATH — gates App Store submission** |
| #797 | `ci: wire check-delete-account-coverage to required workflow (B2)` | A7 | CI hardening |
| #798 | `docs(billing): D4 bridge — price-map INSERT + raw_payload feasibility (P0)` | A8 | SQL package |
| #799 | `docs(customer): gift-victim apply-ready package` | A3 | SQL package |
| #800 | `docs(security): P0 SQL batch — anon RLS revoke + phantom rows` | A9 | SQL package |
| #801 | `docs(customer): mylinh apply-ready package` (on b54/pending-chau-actions) | A2 | SQL package |
| #803 | `docs(customer): gift-victim outreach send-side ops` | A3b | ops follow-up to #799 |
| #804 | `docs(billing): D4 raw_payload feasibility — result template + decision tree` | A8b | gates A18 ramp |
| #805 | `docs(customer): mylinh Stripe Dashboard pre-flight checklist` | A2b | applies before #801 |
| #806 | `docs(security): phantom-row apply runbook + A94 loss formalization` | A9b | applies #800; closes A94 |
| #807 | `docs(native): real-device tracker-verify checklist for #796` | A6b | post-#796 verify |
| #808 | `test(sentry): smoke-test route to verify sourcemap upload end-to-end` | A7b | sourcemap discipline |
| #809 | `ci: gzipped bundle-size budget gate (locks in #794+#795 wins)` | A5b | budget gate |
| #810 | `docs(principles): P17 — free agent gets immediate next dispatch` | A6c | **locked decision** |
| #811 | `fix(privacy): add 42 missing user-id tables to delete-account manifest` | B1 | B1 follow-up to #797 |
| #812 | `docs(strategy): STRATEGY drift audit post-2026-05-19 wave` | A3c | feeds #817 |
| #813 | `docs(ops): PR review backlog — sequencing + risk matrix` | A2c | **read first for merge order** |
| #814 | `docs(ops): PENDING-CHAU-ACTIONS consolidation post-2026-05-19 wave` | A9c | **the canonical pending-actions list** |
| #815 | `docs(billing): A18 recompute impl readiness audit` | A8c | A18 prep |
| #816 | `docs(native): Sentry init audit — current state + gap list` | A7c | Sentry gap audit |
| #817 | `docs(strategy): STRATEGY.md v3.1 — §6 + §7 freshness pass` | A3d | **locked: §6 expiry flip** |
| #818 | `docs(privacy): B1 — 42-table classification for delete-account manifest` | A6d | classification for #811 |

A10's two ops PRs (push-durability + audit; this summary) ship on `a10/ops-local-worktree-reports` and `docs/session-summary-2026-05-19-late` — both no-PR-or-trivial.

## §3 Decisions locked this wave (do not re-litigate)

1. **D1 = table (entitlements as a real table, not a derived view).** Confirmed by execution — #802 shipped the additive `_shared/entitlement.ts` module with zero importers, proving the architecture works before any consumer is migrated. #789 then provides the table migration. Together these lock the architecture; no further D1 vs D2 debate.
2. **§6 flip accepted (no grace fudge).** When a subscription expires, the user loses premium immediately. No "grace period" softening. Codified in STRATEGY v3.1 (#817). Reason: grace fudging masks billing bugs and trains users that expiry is negotiable.
3. **A94 formally closed.** Stale-subscription-row cleanup is superseded by B21 (`failed-deletion-events` instrumentation). Formalized in #806's runbook. Don't re-open A94 as a track; B21 owns this.
4. **PRINCIPLES P17 added (#810).** "Free agent gets the next dispatch immediately." Locks the moderator's anti-idle rule.

## §4 Unblocked vs still blocked

**Unblocked, in flight:**
- **B13ph3 PR-B (A1c)** — unblocked by #802; A1c is authoring the second-stage consumer wiring on `a1c/b13ph3-prb` worktree.
- **A19's B25 bypass map** — unblocked by #774 (#788 was gated on it).
- **A8b's D4 feasibility template** — published as #804; waiting on Chau to run the query.

**Still blocked (waiting on Chau):**
- **A18 recompute implementation** — WAIT-FOR #789 merge AND the SQL apply in Supabase SQL Editor. A18 has the impl brief ready; A8c's prep audit (#815) confirms readiness. Cannot ship code until the table physically exists in prod.
- **App-Store submission** — WAIT-FOR #796 merge AND the real-device verify checklist (#807) AND paperwork. The marketing-tracker native guard is the last code gate before paperwork.
- **PR-B (A1c)** — soft-blocked on #802 staying merged + #789 landing for the table to exist before PR-B's consumers wire to it.

## §5 Chau actions — critical-path top 5 (full list in #814)

Ordered by reversibility cost (apply destructive/customer-facing ones first while context is fresh):

1. **Merge #789 → apply A17 migration in Supabase SQL Editor.** Creates the entitlements table that B13ph3 PR-B and A18 both consume. SQL is in the PR diff.
2. **Merge #796 → run device-verify checklist (#807) → paperwork.** Unblocks App Store submission. Tracker-guard fix must be verified on a real device per the §6 lesson "compile ≠ runtime verified."
3. **Apply mylinh SQL** — first the #805 Stripe Dashboard pre-flight (verifies the customer's actual Stripe state), then the #801 SQL package in Supabase SQL Editor. Two-step on purpose.
4. **Apply gift-victim SQL** (#799) → then run the send-side outreach ops (#803). SQL first (data correct), then customer outreach (people informed).
5. **Run D4 feasibility query** using the #804 template. Result tells A18 whether to use raw_payload or join through line_items; A18's impl is blocked on this until you paste the query result back.

The full PENDING-CHAU-ACTIONS index lives in #814 — these 5 are the highest-leverage subset.

## §6 Agents still in flight at session close

Based on `/private/tmp/A*` worktree presence + PR open/closed state:

| Agent | Track | Status hint |
|---|---|---|
| A1c | B13ph3 PR-B (consumer wiring) | worktree `A1c-b13ph3-prb`, no PR yet, gated on #789 |
| A2d | CI re-run after mylinh checklist landed | implied next-step, no worktree yet |
| A3d | STRATEGY v3.1 | **PR #817 OPEN** — ready for review |
| A4c | Anonymize audit | worktree `A4c-anonymize-audit`, no PR yet |
| A5c | Bundle budget tighten | worktree `A5c-bundle-budget-tighten`, polling/threshold work |
| A6d | B1 classify (42-table) | **PR #818 OPEN** — partners with #811 |
| A7d | iOS dSYM upload | worktree `A7d-ios-dsym-upload`, Sentry sourcemap follow-up |
| A8d | #789 migration verify | worktree `A8d-789-migration-verify`, waits for Chau to apply |
| A9d | A94 closure paperwork | worktree `A9d-a94-closure`, paired with #806 |

Per P17 (#810): when each of these reports done, the moderator should immediately dispatch their next item from #813's sequencing matrix.

## §7 Don't-redo list (additions from this wave)

Future sessions: do NOT re-dispatch these. The work is shipped or in-PR; redoing creates duplicates and wastes the agent.

| Topic | Owner branch / PR | Status |
|---|---|---|
| B13ph3 PR-A (additive entitlement module) | `feat/b13ph3-pr-a` / #802 | MERGED |
| Tier-gate read entitlement (B17 PR1) | `b25/tier-gate-fix-pr1` / #774 | MERGED |
| Redeem-gift honest errors | `fix/b22-redeem-gift-honest-errors` / #787 | MERGED |
| MercyGuidePanel lazy-load | `perf/lazy-mercyguide-panel` / #794 | MERGED |
| Vendor split zod/sonner/date-fns | `perf/vendor-split-zod-sonner-datefns` / #795 | MERGED |
| Tier-C legacy report archive | `cleanup/agent-id-tierc-archive` / #791 | MERGED |
| formatMoney zero-decimal fix | `fix/formatmoney-zero-decimal` / #786 | OPEN |
| Entitlements table migration | `feat/entitlements-table-migration` / #789 | OPEN — DO NOT re-spec |
| Marketing-tracker native guard | `fix/native-marketing-tracker-guard` / #796 | OPEN — DO NOT re-recon |
| Webhook monotonic raw_payload | `fix/webhook-monotonic-object-quality` / #793 | OPEN |
| T2 trigger retirement | `feat/t2-retirement-migration` / #792 | OPEN |
| B17 PR3 sign-audio dead code | `cleanup/b17-pr3-sign-audio-dead` / #785 | OPEN |
| B25 bypass map (gated on #774, now unblocked) | `cleanup/delete-b25-numeric-tier-bypass` / #788 | OPEN |
| mylinh apply-ready package | `b54/pending-chau-actions` / #801 | OPEN |
| mylinh Stripe Dashboard pre-flight | `chore/mylinh-stripe-preflight` / #805 | OPEN |
| Gift-victim apply package | `chore/gift-victims-package` / #799 | OPEN |
| Gift-victim outreach ops | `chore/gift-outreach-ops` / #803 | OPEN |
| RLS revoke + phantom rows P0 SQL | `chore/rls-phantom-package` / #800 | OPEN |
| Phantom-row apply runbook (closes A94) | `docs/phantom-row-apply-runbook` / #806 | OPEN |
| Price-map INSERT + raw_payload feasibility | `chore/price-map-insert-package` / #798 | OPEN |
| D4 raw_payload feasibility template | `docs/raw-payload-feasibility-result` / #804 | OPEN |
| B7 Q1+Q4 monitoring runbook | `feat/b7-q1-q4-monitoring` / #784 | OPEN |
| `check-delete-account-coverage` wired to CI | `fix/b2-wire-delete-coverage-ci` / #797 | OPEN |
| B1 manifest 42-table fix | `fix/b1-manifest-42-tables` / #811 | OPEN |
| B1 manifest classification doc | `docs/b1-manifest-table-classification` / #818 | OPEN |
| Real-device tracker-verify checklist | `docs/796-device-verify` / #807 | OPEN |
| Sourcemap upload smoke test | `test/sourcemap-upload-smoke` / #808 | OPEN |
| Bundle-size budget CI gate | `ci/bundle-size-budget` / #809 | OPEN |
| P17 (free agent → immediate dispatch) | `docs/principles-immediate-dispatch` / #810 | OPEN — locked |
| STRATEGY drift audit | `docs/strategy-drift-audit` / #812 | OPEN |
| STRATEGY v3.1 freshness pass | `docs/strategy-v31` / #817 | OPEN — locked decisions |
| PR review backlog sequencing | `docs/pr-review-backlog-sequencing` / #813 | OPEN |
| PENDING-CHAU-ACTIONS consolidation | `docs/pending-actions-consolidation` / #814 | OPEN |
| A18 recompute impl readiness audit | `docs/a18-recompute-impl-prep` / #815 | OPEN |
| Native Sentry init audit | `docs/native-sentry-init-audit` / #816 | OPEN |
| Northstar reference cleanup | `cleanup/northstar-strategy-naming` / #790 | OPEN |
| A10 push-durability sweep + audit | `a10/ops-local-worktree-reports` | PUSHED, no PR |

## §8 Boot sequence for the next agent reading this

1. Read the A46 primer first (covers earlier wave, §0 carry-over).
2. Read this summary §0 lessons.
3. Read STRATEGY v3.1 (#817) before any architectural reasoning.
4. Read PRINCIPLES P17 (#810) before dispatch logic.
5. Check #813 for the merge sequencing; check #814 for Chau's pending-action list.
6. Before any dispatch: confirm the topic isn't on §7's don't-redo list above.
