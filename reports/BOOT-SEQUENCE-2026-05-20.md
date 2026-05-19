# BOOT SEQUENCE — next Claude session (2026-05-20)

> Read STRATEGY.md and PRINCIPLES.md first (they auto-load in Claude Code; in
> web chat see step 0). Then read this. **One file, one copy-paste block, in
> strict order.** Stops at the first failure — do not skip steps.
>
> Author: A3i · branch `docs/next-session-boot-sequence` · supersedes the
> boot-sequence sections scattered across STRATEGY §14, PRINCIPLES §14, the
> A46 primer "boot sequence" §, and #822 §8.

---

## Boot sequence (paste this into a fresh Claude Code terminal)

```bash
set -euo pipefail

# ============================================================================
# STEP 0 — repo present? (web-chat only; Claude Code auto-loads CLAUDE.md)
# ============================================================================
# If running in a fresh web-chat sandbox (no repo on disk), clone first:
#   git clone --depth 1 https://github.com/ChauDoan21165/MercyB.git \
#     /home/claude/MercyB && cd /home/claude/MercyB
# In Claude Code (terminal), CLAUDE.md is already loaded — skip this step.

# ============================================================================
# STEP 1 — sync with origin/main and verify identity
# ============================================================================
git fetch origin --prune --quiet
TIP="$(git rev-parse origin/main)"
echo "tip-of-main: ${TIP}"
git --no-pager log -1 --format='%H %s' "${TIP}"
gh auth status        # confirm gh CLI is authed (any 'not logged in' = STOP)

# ============================================================================
# STEP 2 — required reads, in order. Stop reading code until §c is open.
# ============================================================================

# a. STRATEGY.md (live doc, loads via CLAUDE.md but read it consciously)
#    If #817 has merged, you're reading v3.1. If not, read v3.0 + #812 audit
#    for the v3.1 deltas Chau hasn't landed yet.
git --no-pager show "${TIP}:STRATEGY.md" | less
gh pr view 817 --json state,mergedAt | jq    # → if merged, v3.1 is on main

# b. PRINCIPLES.md (the 17-principle working contract). #810 + #828 + #829
#    may be unmerged; the audit is #823.
git --no-pager show "${TIP}:PRINCIPLES.md" | less
gh pr view 810 --json state,mergedAt | jq    # P17 free-agent immediate dispatch
gh pr view 828 --json state,mergedAt | jq    # P4 coherence sub-clause
gh pr view 829 --json state,mergedAt | jq    # P16 harness-policy sub-clause

# c. The PRIMER v2 — the canonical "what's the state of play" doc.
#    Pinned to its branch (not yet merged; commit-don't-PR per B16).
git --no-pager show \
  origin/docs/next-session-primer-may20-v2:reports/NEXT-SESSION-PRIMER-2026-05-20-v2.md \
  | less
# If the primer has been refreshed again, look for a higher-versioned file in:
git ls-tree -r origin/main reports/ | grep -i NEXT-SESSION-PRIMER

# d. PENDING-CHAU-ACTIONS — the canonical "what Chau owes" list (#814)
gh pr view 814 --json state,mergedAt,body | jq -r .body | less

# e. PR review backlog risk matrix — the canonical merge order (#813)
gh pr view 813 --json state,mergedAt,body | jq -r .body | less

# ============================================================================
# STEP 3 — sanity-check the merge state of the 6 "carry-over" critical PRs
#          before dispatching anything in the billing / customer-remediation
#          / app-store tracks.
# ============================================================================
for pr in 789 796 799 801 803 805 826; do
  printf "%5s  " "#${pr}"
  gh pr view "${pr}" --json state,title \
    | jq -r '"\(.state)\t\(.title)"'
done
# 789 — entitlements table migration (gates A18)
# 796 — native tracker guard (gates App Store)
# 799 — gift-victim apply package (SQL hand-apply)
# 801 — mylinh apply package (SQL hand-apply)
# 803 — gift-victim outreach ops (POST-#799 SQL only)
# 805 — mylinh Stripe pre-flight (PRE-#801)
# 826 — B13ph3 PR-B atomic repoint (the money-path PR)

# ============================================================================
# STEP 4 — list any in-flight worktrees, both shared and your fresh /tmp ones
# ============================================================================
git worktree list
ls -d /private/tmp/A*-* 2>/dev/null | head -20
# If you see worktrees you don't own, leave them alone. Per PRINCIPLES §13:
# parallel agents work in isolated worktrees and do not touch each other's.

# ============================================================================
# STEP 5 — confirm you have NOT been pre-empted on the topic you're about to
#          dispatch. Replace TOPIC with a substring from your brief.
# ============================================================================
TOPIC="REPLACE_ME"     # e.g. "entitlement", "gift-victim", "mylinh", "tracker"
gh pr list --state all --search "${TOPIC} in:title" --limit 10 \
  --json number,state,title,mergedAt
git --no-pager log --all --grep="${TOPIC}" --oneline -20
# If a PR is OPEN/MERGED for your topic, STOP and check the primer §e
# "Don't-redo list" before proceeding. Duplicate dispatch wastes the agent.
```

---

## What each step proves before you let the model dispatch anything

| Step | What it proves |
|---|---|
| 0 | Repo exists on disk (web chat) or trust CLAUDE.md auto-load (terminal). |
| 1 | `gh` is authenticated; you know the exact tip-of-main SHA. |
| 2a | You read STRATEGY before opining on strategy (PRINCIPLES §14). |
| 2b | You read PRINCIPLES before dispatching. P17 / P4-coh / P16-harness state confirmed. |
| 2c | You read the primer — the only doc that synthesizes ~50 in-flight PRs into actionable categories. |
| 2d | You know what Chau owes (so you don't queue dispatches that depend on un-applied SQL). |
| 2e | You know the merge order (so you don't recommend merging #826 before #789). |
| 3 | The 6 carry-over critical PRs' state matches the primer's snapshot, or you flag the drift. |
| 4 | You are aware of parallel-agent worktrees you should not touch. |
| 5 | Your next dispatch is not a duplicate of a shipped or in-flight topic. |

## Read order rationale (PRINCIPLES §14 + STRATEGY §14)

- **STRATEGY.md before PRINCIPLES.md** because strategy bounds what kinds of work are legitimate; principles bound how to do that work. Reverse order works but gives weaker pushback against bad strategic suggestions.
- **PRINCIPLES.md before the primer** because the primer cites principles (esp. P17 dispatch immediacy and the P4/P16 sub-clauses) as load-bearing for how you read it.
- **Primer before #813/#814** because the primer is the synthesis; #813 is the merge-order matrix and #814 is the action ledger — they're the "now what" after the primer's "what's true."
- **Sanity-check PRs (step 3) before any dispatch** because the primer is a snapshot — by the time the next session reads it, some of those 6 carry-overs may have merged or closed. Step 3 is the 10-second drift check.

## What you do NOT need to read before dispatching

- The full `gh pr list` output (~70 open PRs). The primer §j classifies them; if your dispatch topic is not in §e Don't-redo, you're safe.
- Every individual A1–A45 recon report. The primer §e "Don't-redo list" is the union of what's been done; reading individual recons is duplicate research.
- `.claude/roadmap.md`. Compressed into STRATEGY §7 with current % bands.
- The A46 primer (`reports/NEXT-SESSION-PRIMER-2026-05-20.md`). Superseded by primer v2 — read v2 only.
- `reports/session-summary-2026-05-19-late.md` (#822). Folded into primer v2 §0.

## Cold-start failure modes (and how this sequence prevents them)

| Failure | Prevention step |
|---|---|
| "Let me dispatch X" — but X already merged | Step 5 (`gh pr list --search`) |
| "Apply this SQL" — but RPC migration isn't ready | Step 2c (primer §d gates) + step 3 (#789 state) |
| "Refactor STRATEGY" from a chat | Step 2a (read STRATEGY) + PRINCIPLES §14 (strategy is Chau's) |
| Re-recon a topic | Step 5 + primer §e don't-redo |
| Touch another agent's worktree | Step 4 (`git worktree list`) + PRINCIPLES §13 |
| Push without authorization | PRINCIPLES P16 (only when Chau authorizes upfront) + #829 sub-clause for harness denials |
| "Let me update PRINCIPLES" mid-session | PRINCIPLES §14 — surface drift, don't lead pivots |

---

*Author: A3i. Single source of truth for cold-starting a session. If this sequence and the primer disagree, the primer wins (it's the synthesis); if the primer and `origin/main` disagree, `origin/main` wins. STRATEGY.md and PRINCIPLES.md are the canonical living docs.*
