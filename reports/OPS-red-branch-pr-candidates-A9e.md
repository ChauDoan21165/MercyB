> **§5 update:** b53 PR-READY classification now landed via PR #831; the other 10 rows stand.

# OPS — Red-branch PR-candidate audit (A10b follow-up, A9e)

> A10b pushed 11 LOCAL-only branches for durability with no PR. This doc
> audits each — what's on it, how it diffs from `main`, and whether it's
> PR-ready, superseded, recon-only, or stale. **Classification only — no
> PRs opened against any of the 11 branches.**
>
> All measurements are `git`-only (`origin/main..origin/<branch>` log + diff
> stat, plus `gh pr list` for existing-PR cross-check). No prod query. No
> code inspection beyond reading file headers where the classification was
> ambiguous.

---

## Headline

| Class | Count | Branches |
|---|---|---|
| **PR-READY** | **1** | b53/price-data-quality-diagnostic |
| **SUPERSEDED (merged)** | **1** | fix/b22-redeem-gift-honest-errors |
| **RECON-ONLY** (live, feeds other PRs) | **5** | b27, b5, b52, b58, b61 |
| **RECON-ONLY** (meta) | **1** | b55 |
| **STALE** (point-in-time snapshots, wave-end superseded) | **3** | b60, b62, b66 |

**The one PR candidate is b53** — it carries a paste-ready DELETE SQL for
2 stale placeholder rows in `billing_price_map` that is **not** covered by
#798's INSERT package. The other 10 are durability-only and should remain
unmerged (recon docs serving their referenced PRs, or stale snapshots).

---

## Per-branch audit

### 1. `fix/b22-redeem-gift-honest-errors` — **SUPERSEDED (merged)**

- **Commits ahead of main:** 1 (`45c600310 fix(billing): redeem-gift-code
  returns honest errors instead of ok:true silent loss (B22 narrow)`).
- **Diff stat:** 3 files, 667 insertions / 149 deletions in
  `supabase/functions/redeem-gift-code/{core.ts,index.ts}` + tests.
- **gh pr cross-check:** **PR #787 MERGED.**
- **Classification:** SUPERSEDED — already on main. The branch is recoverable
  history; safe to prune locally once Chau wants.

### 2. `b27/profile-trigger-audit` — **RECON-ONLY** (feeds #792)

- **Commits ahead of main:** 2 (`2ad771084 B63 verify T2 binding`,
  `c02fd0fa1 B27 diagnostic — profiles.tier sync trigger dormant`).
- **Diff stat:** 1 file, 173 insertions
  (`reports/RECON-profile-trigger-architecture-B27.md`).
- **gh pr cross-check:** no open PR for this branch.
- **Why not PR:** the recon is the evidence behind **#792** (`feat(db):
  retire dormant T2 trigger + dead RPC (per A11 spec)`). The doc is durable
  on origin; PR'ing the recon alone would be redundant with #792's
  description.
- **Recommendation:** leave durable on origin. Cite from #792's body if not
  already linked.

### 3. `b5/mylinh-paid-but-free-diagnostic` — **RECON-ONLY** (feeds #801)

- **Commits ahead of main:** 1 (`245d8ec6d B5 diagnostic — mylinh
  paid-but-free from stale period_end`).
- **Diff stat:** 1 file, 138 insertions
  (`reports/RECON-mylinh-paid-but-free-B5.md`).
- **gh pr cross-check:** no open PR for this branch.
- **Why not PR:** the recon is the source evidence for **#801**'s mylinh
  apply package and the class-fix **#770** (`fix(billing): invoice
  period_end field order in getCurrentPeriodEnd (B5 class bug)`). #801's
  body cites the file by path; #770 cites the class.
- **Recommendation:** leave durable on origin. Already referenced.

### 4. `b52/price-map-autoupsert-scoping` — **RECON-ONLY** (live fallback)

- **Commits ahead of main:** 1 (`20e80c1e9 B52 — billing_price_map
  auto-upsert design (3-option, recommend A fill-gap)`).
- **Diff stat:** 1 file, 253 insertions
  (`reports/RECON-price-map-autoupsert-B52.md`).
- **gh pr cross-check:** no open PR for this branch.
- **Why not PR:** **#798's Block 4** explicitly names B52 Option A as the
  fallback if D4 raw_payload feasibility (#804) returns NO-GO. The design
  doc is a *live* contingency, not stale.
- **Recommendation:** leave durable. If #804 result fires the fallback,
  promote B52 Option A to its own implementation PR at that point.

### 5. `b53/price-data-quality-diagnostic` — **PR-READY** ✅

- **Commits ahead of main:** 1 (`35ef2ea1c B53 price data-quality
  diagnostic — recon + placeholder remediation`).
- **Diff stat:** 2 files, 277 insertions —
  `reports/RECON-price-data-quality-B53.md` +
  **`reports/REMEDIATION-price-map-placeholders-B53.sql`**.
- **gh pr cross-check:** no open PR; no main commit mentions B53 or
  `price_replace`.
- **Why PR-ready:** the SQL is a self-contained `BEGIN; … ROLLBACK;` DELETE
  of two stale `price_replace_*` placeholder rows from `billing_price_map`
  (PR #700's hand patch was never applied). It is **distinct** from #798's
  scope: #798 is the **INSERT** of the new yearly price-map row; B53 is the
  **DELETE** of the two leftover placeholders. Both target
  `billing_price_map`; both are independent operations on disjoint PKs.
  Both have GUARD-BEFORE / GUARD-AFTER blocks proving zero-consumer
  preconditions.
- **Out-of-scope excluded by B53 itself (no collision risk):**
  - `b950361e-…` (wrong yearly id repointing) → **B42's territory** (#798).
  - `a03266db-…` (reviewer comp sub with NULL price_id) → decision-gated
    in the recon doc, not in the executable.
- **One-line PR description:** *"docs(billing): B53 placeholder-row DELETE
  package — billing_price_map (companion to #798)."* The PR would package
  the recon + SQL as an `OPS-` doc like #800, then refer the apply step to
  Chau as a sibling line in PENDING-CHAU-ACTIONS-2026-05-20.md §B.
- **Recommendation:** **open a PR.** Smallest-blast-radius P0-class item
  not yet packaged (zero consumers, GUARD-protected, idempotent DELETE).

### 6. `b55/recon-durability-tradeoff` — **RECON-ONLY** (meta)

- **Commits ahead of main:** 1 (`272b5ee2d docs(meta): recon-doc durability
  tradeoff — recommend Option B (B55)`).
- **Diff stat:** 1 file, 174 insertions
  (`reports/RECON-recon-durability-tradeoff-B55.md`).
- **gh pr cross-check:** no open PR.
- **Why not PR:** meta-recon on convention; informed B16's recon-doc
  convention #768 + B29's SQL-remediation convention #776 (both merged).
- **Recommendation:** leave durable. Historical record of the convention
  decision.

### 7. `b58/gift-write-or-fallback` — **RECON-ONLY** (feeds gift-victim PRs)

- **Commits ahead of main:** 1 (`0dc77e81a B58 — gift→canonical write vs
  read-fallback design answer`).
- **Diff stat:** 1 file, 202 insertions
  (`reports/RECON-gift-write-vs-fallback-design-B58.md`).
- **gh pr cross-check:** no open PR.
- **Why not PR:** design doc feeding **#787** (honest errors), **#799**
  (gift-victim apply package), and **#803** (gift-outreach ops).
- **Recommendation:** leave durable on origin.

### 8. `b60/merge-queue-priority` — **STALE**

- **Commits ahead of main:** 1 (`d392cca31 B60 session-end merge queue
  priority (29 PRs, tiered)`).
- **Diff stat:** 1 file, 128 insertions
  (`reports/RECON-B60-merge-queue-priority.md`).
- **gh pr cross-check:** no open PR.
- **Why STALE:** point-in-time snapshot of the merge queue (29 PRs). The
  queue has drained substantially — most of those 29 are now merged
  (#787, #788, #789, #790, #791, #792, #793, #794, #795, etc.). The
  ordering advice was load-bearing during the drain; it is now history.
- **Recommendation:** leave durable as audit trail. Do not PR.

### 9. `b61/out-of-band-schema-audit` — **RECON-ONLY** (valuable)

- **Commits ahead of main:** 1 (`b51eac418 B61 out-of-band schema audit
  — 3 patch-over-ghost trigger bindings + class gap in A21's drift CI`).
- **Diff stat:** 1 file, 145 insertions
  (`reports/RECON-out-of-band-schema-B61.md`).
- **gh pr cross-check:** no open PR.
- **Why not PR (but valuable):** identifies a *new* drift class (PATCH-OVER-
  GHOST trigger bindings — repo `CREATE OR REPLACE`s the function but no
  migration ever `CREATE TRIGGER`s the binding; 3 confirmed: T2 sync,
  feedback-rate-limit, kids-updated-at) plus the structural gap in A21's
  per-relation drift CI. No paste-ready SQL — the §6 confirmation bundle
  is for Chau's manual catalog read.
- **Recommendation:** leave durable. Consider folding into the next drift-CI
  follow-up dispatch (extend A21's audit to enumerate trigger bindings).

### 10. `b62/pr-ci-status` — **STALE**

- **Commits ahead of main:** 1 (`bca42770a docs(recon): open-PR CI +
  merge-gate status snapshot (B62)`).
- **Diff stat:** 1 file, 194 insertions
  (`reports/RECON-pr-ci-status-B62.md`).
- **gh pr cross-check:** no open PR.
- **Why STALE:** point-in-time snapshot of PR CI status. By A9e authoring
  time the merge wave has drained; the snapshot is reference-only.
- **Recommendation:** leave durable as audit trail. Do not PR.

### 11. `b66/session-closeout` — **STALE** (superseded by A9c #814)

- **Commits ahead of main:** 1 (`d5d1b79c9 docs(closeout): single
  session-end action sweep (B66)`).
- **Diff stat:** 1 file, 85 insertions
  (`reports/FINAL-CLOSEOUT-2026-05-19.md`).
- **gh pr cross-check:** no open PR.
- **Why STALE:** B66's session-closeout doc was authored mid-wave and is
  now superseded by **A9c PR #814**
  (`reports/PENDING-CHAU-ACTIONS-2026-05-20.md`), which captures the
  end-state of the same wave.
- **Recommendation:** leave durable as audit trail. Do not PR.

---

## PR-READY queue (for the operator)

**Only one branch** survives the audit as a discrete PR candidate:

| Branch | Suggested PR title |
|---|---|
| `b53/price-data-quality-diagnostic` | `docs(billing): B53 placeholder-row DELETE package — billing_price_map (companion to #798)` |

If Chau wants the PR opened, dispatch a follow-up agent with the brief
*"package b53's RECON + REMEDIATION-price-map-placeholders-B53.sql into a
single hand-apply doc at reports/SQL-p0-price-map-placeholders-B53.md,
matching #800's shape. Add a §B.2a line to
reports/PENDING-CHAU-ACTIONS-2026-05-20.md after #814 merges. PR title as
above."*

The remaining 10 branches do not warrant new PRs: 1 already merged, 5 are
durable recon feeding shipped PRs, 1 is meta-convention history, and 3 are
wave-end snapshots now superseded by A9c #814.

---

*A9e — classification only. No DB writes, no prod query, no PRs opened
against the 11 audited branches. The doc is the deliverable.*
