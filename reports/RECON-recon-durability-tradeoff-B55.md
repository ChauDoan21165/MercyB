# RECON — Recon-Doc Durability Tradeoff (B55)

**Date:** 2026-05-19
**Branch:** `b55/recon-durability-tradeoff`
**Base:** `origin/main` = `5cfa27e3f`
**Scope:** META + RISK-ASSESSMENT. No code change. No PR. Commit-per-B16, no push.
**Labels:** stale-audit-note

---

## TL;DR

The B16 no-push convention **does** trap recon local-only — B46's "zero, premise not
borne out" finding is **stale**. B46 audited at 22 branches early in the session and
saw an empty population. At **73 local agent branches** now, **19 recon/runbook/primer
docs exist as a single unpushed local commit each** — verified absent from
`origin/main`, no GitHub remote branch, and no working-tree duplicate. Today there is
**no off-device copy of any of them**. **Recommend Option B** (batched session-end
push of the recon-local-only set), because it is the only option whose failure mode is
partial rather than all-or-nothing, and its real cost is ~30s.

---

## Method (independent re-count, not trusting B46)

1. `git for-each-ref refs/heads | grep ^[ab][0-9]+/` → **73** local agent branches.
2. For each: `git rev-list --count origin/main..$b`, resolve `@{upstream}`,
   `git ls-remote --exit-code origin refs/heads/$b`, `git diff --name-only origin/main..$b`.
3. Risk class = `ahead≥1` **AND** upstream `origin/main` (never pushed to own ref)
   **AND** `git ls-remote` confirms no remote branch.
4. Durability cross-check: for each recon artifact, `git cat-file -e origin/main:<path>`
   (on canonical main?) and working-tree existence.

**Result of step 4:** all 12 sampled artifacts → `absent` from `origin/main`,
`no-wt-copy`. `reports/` on `origin/main` is empty (0 files). The sole copy of each
recon doc is one local commit on its branch. Single point of failure confirmed.

---

## Why B46 said "zero" and was right *then*

B46 ran at `origin/main = 5cfa27e3` with **22** branches. At that moment the recon-only
"b" branches (b12/b15/b17/b22) were *empty checkouts* (`ahead=0`) — recon had been
delivered out-of-band, branches never committed to. B46's conclusion ("premise not
borne out, no recon-/ prefix needed") was correct for that snapshot.

It did not survive the session. The same branch names now carry committed recon docs
(`b12 ahead=1`, `b15 ahead=1`, `b22 ahead=1`), plus ~15 more agents have since
committed recon to local-only branches. **The B46 inventory is a `stale-audit-note`:
its bucket counts and its "no recon-durability action needed" recommendation no longer
hold.** This is exactly the failure mode B55 was dispatched to check for.

---

## Recon docs at risk — 19 (sole copy = one unpushed local commit)

All rows verified: not on `origin/main`, no `origin/<branch>` remote, no working-tree copy.

### HIGH (6) — future agents/sessions are *meant* to read these; re-derivation is costly

| Branch | Artifact | Why HIGH |
|---|---|---|
| `b41/next-session-primer` | `reports/NEXT-SESSION-PRIMER-2026-05-19.md` | Next-session continuity primer — its entire purpose is to be read later |
| `b45/billing-architecture-map` | `reports/RECON-billing-architecture-as-built-B45.md` | As-built architecture map (brief-flagged HIGH) |
| `b47/billing-architecture-history` | `reports/RECON-billing-history-B47.md` | Decision history (brief-flagged HIGH) |
| `b48/billing-target-state` | `reports/RECON-billing-target-state-B48.md` | Target-state design (brief-flagged HIGH) |
| `b21/failed-deletion-events` | `RECON-failed-deletion-events-B21.md` + `REMEDIATION-stripe-deletion-events-B21.sql` | Carries an **actionable remediation SQL**, not just scoping |
| `b42/price-map-missing-row` | `reports/RUNBOOK-price-map-row-B42.md` | Operational runbook — actionable |

### MEDIUM (11) — diagnostics that informed/inform a fix

`b12` stripe-deletion-blast-radius · `b15` mrr-view-drift · `b22` gift-entitlement-propagation
(brief-flagged MED) · `b5` mylinh-paid-but-free (brief-flagged MED) · `b27`
profile-trigger-architecture · `b34` stripe-webhook-failures-A77-retroactive · `b28`
RUNBOOK-evt-1TUxM5-lookup · `b13` isentitling-fix-plan · `b19` placement-flag-decision ·
`b7` money-path-monitoring-scoping · `a96` webhook-forensics-scoping

### LOW (2) — scoping, recommendations likely captured elsewhere

`b32` session-agent-inventory (partly superseded by B46) · `b2` vr-baselines-635

> **Caveat on LOW:** "captured elsewhere" was checked and is **not durable elsewhere**.
> None are on `origin/main`. The only other copies are (a) ephemeral terminal
> scrollback and (b) single-drive `~/.claude/.../memory/` files — same MacBook, same
> drive. "Low value to preserve" ≠ "safe to lose tonight."

### Not counted — separate hygiene defect (1)

`a98/study-file-update` — `ahead=2`, **~200 changed files** incl. stray literal-named
files `code` and `python3`. Branched off a very dirty tree. This is a branch-hygiene
failure, not recon — flag for **separate deletion review**, do not fold into the
recon-durability fix. (Related: ~6 branches — b13/b19/b5/b7/a96/b2 — carry an identical
~12-file "dirty bundle"; they branched off a dirty local main instead of `origin/main`,
violating the branch-hygiene rule. Pushing them is still safe — the recon doc is the
payload — but the upstream cause is non-clean branch creation.)

---

## Three-option comparison

| | **A — Keep no-push** | **B — Batched session-end push (recon set)** | **C — Session-end snapshot branch** |
|---|---|---|---|
| Cost | 0 | ~30s/session, scriptable loop | A meta-agent step per session (heavier) |
| Durability | None — 19 docs single-drive | Full, off-device on GitHub | Full, off-device on GitHub |
| Failure mode | Total loss on drive failure | **Graceful/partial** — a missed branch loses only itself | **All-or-nothing** — agent skipped/crashed ⇒ zero durability that session |
| Origin noise | None | Many never-PR'd branches | Clean (1 long-running branch) |
| Noise — real cost? | — | Low: PRs are the unit of attention, not branches; `recon/` prefix or B46's post-merge prune handles the read side | Marginal benefit: nobody pages 70 branches |
| Context fidelity | Native (branch + commit + diff) | Native (branch + commit + diff) | **Lossy** — recon copied away from its branch/commit provenance |
| Upstream coupling | — | None | Needs a reliable orchestrated meta-agent that can fail |

Key asymmetry: the cost of mitigation (~30s) is tiny and the loss it prevents (19 docs,
6 HIGH, no off-device copy) is total. Probability of a single-drive failure on a given
night is low but the payoff matrix — not the probability — is what should decide a
~30s insurance premium.

---

## Recommendation — **Option B**, in this refined form

1. **Push the recon-local-only set at session end, under existing branch names.**
   (Renaming local branches mid-session to add a `recon/` prefix is itself risky —
   it can detach active worktrees. The prefix's only benefit, filterability, is
   achievable read-side without the rename.)
2. **Reuse an existing session-end role, don't invent a meta-agent.** A
   `session-summary`-style wrap agent already exists (`b10/session-summary-may19`).
   Folding a `for b in <recon-local-only>; do git push -u origin "$b"; done` into that
   role is ~30s and partial-failure-safe — strictly cheaper and more robust than C's
   dedicated meta-agent.
3. **Noise is a read-side problem already solved by B46.** B46 correctly found the real
   origin-noise source is **squash-orphans of merged PRs** (post-merge prune fixes
   that), not recon branches. Recon branches that never PR never appear in the PR list
   (the surface Chau actually looks at) and are one `git for-each-ref` filter away.
4. **Reject A:** with no enterprise backup (single MacBook / single drive, per
   `project_agent_infra_access`), A is an uninsured total-loss position on 6 HIGH docs
   whose explicit purpose is cross-session reuse.
5. **Reject C:** its only edge over B (clean branch list) is a non-cost, and its
   all-or-nothing failure mode plus loss of branch/commit provenance are real
   regressions vs. B.

### Adjacent fixes worth a separate brief (not this PR)

- `a98/study-file-update` deletion review (broken ~200-file branch).
- Re-issue B46's cleanup policy as **stale** and re-run the inventory — its "zero
  recon-local-only / no action needed" is now false.
- Branch-hygiene enforcement: ~6 branches branched off a dirty local main, not
  `origin/main` (the `feedback_branch_hygiene` rule). Upstream cause of the "dirty
  bundle"; B's push doesn't worsen it but doesn't fix it either.

---

## The self-referential proof

This document — `reports/RECON-recon-durability-tradeoff-B55.md` — is being committed
per B16 and **not pushed**. The moment this commit lands it becomes recon-local-only
doc **#20**: the strongest possible demonstration of the finding. Under Option A it
dies with the laptop alongside the other 19. Under Option B it is one line in the
session-end push loop.

---

## Report data

- **Branch:** `b55/recon-durability-tradeoff`
- **Base SHA:** `origin/main` = `5cfa27e3f` (current; same as B46's audit point, so the
  delta is branch *count* 22→73, not a main advance — B46 is stale by session growth,
  not by rebase)
- **Recon docs at risk:** **19** (HIGH 6 / MEDIUM 11 / LOW 2) + 1 broken-noise branch
  flagged separately
- **Off-device copies today:** **0**
- **Recommendation:** **Option B** — batched session-end push of the recon-local-only
  set, via the existing session-wrap role, under existing branch names
- Commit per B16. No push. No PR. Awaiting Chau go.

*B55 — assessment only. No branches pushed, no branches deleted, no code changed.*
