#!/usr/bin/env bash
# =============================================================================
#  RUNBOOK-safe-prune-A22.sh  —  Safe git-worktree prune by LIVE predicate
# =============================================================================
#
#   ⚠️  SAFETY PROMPT  —  Run with --dry-run first. Always.
#       (--dry-run is also the DEFAULT. Removal requires explicit --confirm.)
#
#  Why this script exists
#  ----------------------
#  A9's audit (reports/AUDIT-worktree-prune-A9.md) proved the worktree set
#  MUTATES LIVE: 36 -> 38 -> 39 entries within one audit window; 54 by the
#  time A22 wrote this. Any FROZEN path list is stale the moment it is
#  captured and will orphan fresh worktrees / target ones that moved.
#
#  So this script carries NO baked-in list. It RE-EVALUATES the prune
#  predicate against `git worktree list --porcelain` every time it runs.
#  Branches that A9 flagged NOT-SAFE-BRANCH-DEL today (unpushed unique
#  commits) flip to SAFE automatically the moment those branches are pushed
#  to origin (e.g. after A10's remaining-recon push lands) — with ZERO edits
#  to this script. That is the entire point of an execution-time predicate.
#
#  The predicate (a worktree is removed IFF ALL of these hold)
#  -----------------------------------------------------------
#     1. path is NOT the main repository worktree
#     2. worktree is NOT locked  (porcelain `locked` line)
#     3. path is NOT under .claude/worktrees/  (active agent harness)
#     4. `git -C <path> status --porcelain` is EMPTY
#          -> no uncommitted AND no untracked files
#          (this is stricter than `git worktree remove` without --force;
#           we NEVER pass --force, so dirty/untracked work is always safe)
#     5. branch is MERGED to origin/main  OR  branch is FULLY PUSHED to origin
#          merged  := merge-base --is-ancestor <branch> origin/main
#          pushed  := refs/remotes/origin/<branch> exists
#                     AND 0 commits ahead of it
#
#  Branch deletion is deliberately NOT performed and NOT bundled.
#  `git worktree remove` keeps the branch ref — unpushed commits remain
#  recoverable. `git branch -D` is the destructive step. This script only
#  PRINTS branch-deletion candidates as an advisory; Chau decides, later,
#  per branch. (See the "BRANCH DELETION — advisory only" section output.)
#
#  Idempotent: a path already pruned is simply absent from
#  `git worktree list` on the next run -> it is never iterated -> no-op.
#
#  Usage
#  -----
#     ./RUNBOOK-safe-prune-A22.sh                # dry-run (default, safe)
#     ./RUNBOOK-safe-prune-A22.sh --dry-run      # explicit dry-run
#     ./RUNBOOK-safe-prune-A22.sh --confirm      # actually remove worktrees
#     ./RUNBOOK-safe-prune-A22.sh --no-fetch     # skip the pre-fetch
#     ./RUNBOOK-safe-prune-A22.sh --help
#
#  Run from anywhere inside any worktree of this repo. No PR. Operator tool.
# =============================================================================

set -euo pipefail

MODE="dry-run"
DO_FETCH=1

for arg in "$@"; do
  case "$arg" in
    --dry-run)  MODE="dry-run" ;;
    --confirm)  MODE="confirm" ;;
    --no-fetch) DO_FETCH=0 ;;
    -h|--help)
      sed -n '2,60p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      echo "Run: $0 --help" >&2
      exit 2
      ;;
  esac
done

echo "============================================================"
echo "  ⚠️  Run with --dry-run first. Always."
echo "  RUNBOOK-safe-prune-A22  —  mode: ${MODE}"
echo "============================================================"

# Must be inside a work tree of the repo.
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: not inside a git work tree. cd into the repo and re-run." >&2
  exit 1
fi

# Resolve the main worktree (first entry of porcelain output is always main).
MAIN_WT="$(git worktree list --porcelain | awk '/^worktree /{print $2; exit}')"
echo "Main worktree (protected): ${MAIN_WT}"

# The dir this script lives in — never remove the worktree we run from.
SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && git rev-parse --show-toplevel 2>/dev/null || true)"
[ -n "${SELF_DIR}" ] && echo "Script's own worktree (protected): ${SELF_DIR}"

# Execution-time accuracy: refresh remote refs so merged/pushed is correct NOW.
if [ "${DO_FETCH}" -eq 1 ]; then
  echo "Fetching origin (for accurate merged/pushed checks) ..."
  git -C "${MAIN_WT}" fetch origin --quiet --prune || \
    echo "WARN: git fetch failed — predicate uses possibly-stale remote refs."
else
  echo "Skipping fetch (--no-fetch) — predicate uses cached remote refs."
fi

if ! git -C "${MAIN_WT}" rev-parse --verify --quiet origin/main >/dev/null; then
  echo "ERROR: origin/main not found. Cannot evaluate the merged predicate." >&2
  exit 1
fi

echo
printf '%-3s %-52s %s\n' "" "WORKTREE" "VERDICT"
echo "------------------------------------------------------------------------"

# --- parse `git worktree list --porcelain` into records --------------------
cur_path="" ; cur_branch="" ; cur_head="" ; cur_locked=0 ; cur_detached=0
removed=0 ; skipped=0 ; n=0
declare -a REMOVE_PATHS=()
declare -a REMOVE_BRANCHES=()

evaluate_record() {
  [ -z "${cur_path}" ] && return
  n=$((n + 1))
  local label="" verdict="" branch_name=""

  if [ "${cur_branch}" != "" ]; then
    branch_name="${cur_branch#refs/heads/}"
  fi

  # 1. main repo
  if [ "${cur_path}" = "${MAIN_WT}" ]; then
    verdict="SKIP — main repository (protected)"
  # self
  elif [ -n "${SELF_DIR}" ] && [ "${cur_path}" = "${SELF_DIR}" ]; then
    verdict="SKIP — this script's own worktree (protected)"
  # 2. locked
  elif [ "${cur_locked}" -eq 1 ]; then
    verdict="SKIP — locked (active agent harness / pinned)"
  # 3. agent harness dir
  elif [[ "${cur_path}" == *"/.claude/worktrees/"* ]]; then
    verdict="SKIP — under .claude/worktrees/ (agent harness)"
  # path vanished from disk but still registered -> let `git worktree prune` handle
  elif [ ! -d "${cur_path}" ]; then
    verdict="SKIP — path missing on disk (run: git worktree prune)"
  # 4. cleanliness
  elif [ -n "$(git -C "${cur_path}" status --porcelain 2>/dev/null)" ]; then
    verdict="SKIP — DIRTY (uncommitted/untracked work — never --force'd)"
  else
    # 5. merged OR pushed
    local is_merged=0 is_pushed=0
    if [ "${cur_detached}" -eq 1 ] || [ -z "${branch_name}" ]; then
      # detached: safe only if HEAD is already in origin/main
      if git -C "${MAIN_WT}" merge-base --is-ancestor "${cur_head}" origin/main 2>/dev/null; then
        is_merged=1
      fi
    else
      if git -C "${MAIN_WT}" merge-base --is-ancestor \
            "refs/heads/${branch_name}" origin/main 2>/dev/null; then
        is_merged=1
      fi
      if git -C "${MAIN_WT}" rev-parse --verify --quiet \
            "refs/remotes/origin/${branch_name}" >/dev/null; then
        local ahead
        ahead="$(git -C "${MAIN_WT}" rev-list --count \
                  "refs/remotes/origin/${branch_name}..refs/heads/${branch_name}" \
                  2>/dev/null || echo 1)"
        [ "${ahead}" = "0" ] && is_pushed=1
      fi
    fi

    if [ "${is_merged}" -eq 1 ] || [ "${is_pushed}" -eq 1 ]; then
      local why=""
      [ "${is_merged}" -eq 1 ] && why="merged->origin/main"
      [ "${is_pushed}" -eq 1 ] && why="${why:+${why}, }pushed->origin"
      verdict="REMOVE (${why})"
      REMOVE_PATHS+=("${cur_path}")
      REMOVE_BRANCHES+=("${branch_name:-(detached)}|${is_merged}|${is_pushed}")
    else
      verdict="SKIP — branch not merged AND not pushed (unique work would"
      verdict="${verdict} only survive as a local branch ref — keep)"
    fi
  fi

  label="${branch_name:-(detached)}"
  printf '%-3s %-52s %s\n' "${n}" "${cur_path}" "${verdict}"
  printf '%-3s %-52s    ↳ branch: %s\n' "" "" "${label}"

  if [[ "${verdict}" == REMOVE* ]]; then
    if [ "${MODE}" = "confirm" ]; then
      if git -C "${MAIN_WT}" worktree remove "${cur_path}" 2>/dev/null; then
        echo "       ✔ removed: ${cur_path}"
        removed=$((removed + 1))
      else
        echo "       ✗ git refused removal (safety net held) — left intact"
        skipped=$((skipped + 1))
      fi
    else
      removed=$((removed + 1))   # would-remove tally
    fi
  else
    skipped=$((skipped + 1))
  fi
}

while IFS= read -r line || [ -n "${line}" ]; do
  if [ -z "${line}" ]; then
    evaluate_record
    cur_path="" ; cur_branch="" ; cur_head="" ; cur_locked=0 ; cur_detached=0
    continue
  fi
  case "${line}" in
    "worktree "*)  cur_path="${line#worktree }" ;;
    "HEAD "*)      cur_head="${line#HEAD }" ;;
    "branch "*)    cur_branch="${line#branch }" ;;
    "detached")    cur_detached=1 ;;
    "locked"*)     cur_locked=1 ;;
  esac
done < <(git worktree list --porcelain)
evaluate_record   # flush final record (porcelain may not end with blank line)

echo "------------------------------------------------------------------------"
if [ "${MODE}" = "confirm" ]; then
  echo "SUMMARY (confirm): removed=${removed}  skipped/kept=${skipped}  total=${n}"
  echo "Tidying stale metadata: git worktree prune"
  git -C "${MAIN_WT}" worktree prune
else
  echo "SUMMARY (dry-run): WOULD-REMOVE=${removed}  KEEP=${skipped}  total=${n}"
  echo "Nothing was changed. Re-run with --confirm to apply."
fi

# --- BRANCH DELETION — advisory only (NOT bundled, NOT executed) -----------
if [ "${#REMOVE_BRANCHES[@]}" -gt 0 ]; then
  echo
  echo "========================================================================"
  echo "  BRANCH DELETION — advisory only. This script DELETES NO BRANCHES."
  echo "  Worktree removal keeps the branch ref; deletion is YOUR separate call."
  echo "  Safe per-branch command (refuses if not merged):  git branch -d <name>"
  echo "  Never use -D in a loop — that is the irreversible step A9 warned about."
  echo "------------------------------------------------------------------------"
  for entry in "${REMOVE_BRANCHES[@]}"; do
    bn="${entry%%|*}"; rest="${entry#*|}"; m="${rest%%|*}"; p="${rest#*|}"
    [ "${bn}" = "(detached)" ] && continue
    tag="review"
    [ "${m}" = "1" ] && tag="merged->origin/main (git branch -d is safe)"
    if [ "${m}" != "1" ] && [ "${p}" = "1" ]; then
      tag="pushed->origin, NOT merged (origin keeps a copy; -d will refuse, use -D only if you are sure)"
    fi
    printf '   %-45s  %s\n' "${bn}" "${tag}"
  done
  echo "  Recommendation: leave branches for now. Decide after the worktree"
  echo "  removals are confirmed and you've eyeballed this list."
  echo "========================================================================"
fi

echo
echo "Done. ⚠️  Reminder: --dry-run first, always. Removal needs --confirm."
