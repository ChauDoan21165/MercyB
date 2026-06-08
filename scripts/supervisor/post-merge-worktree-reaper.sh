#!/usr/bin/env bash
#
# scripts/supervisor/post-merge-worktree-reaper.sh
#
# Reap stale runner worktrees after an MR/branch has merged.
#
# Direct use is dry-run by default. Pass --live to remove candidates.
# The supervisor merge path calls this script after a successful
# `glab mr merge`, which makes the cleanup automatic for merged branches.

set -euo pipefail

SCRIPT_NAME="post-merge-worktree-reaper"
MODE="dry-run"
MERGED_REF="${MERCYB_REAPER_MERGED_REF:-origin/main}"
ROOTS="${MERCYB_REAPER_WORKTREE_ROOTS:-/private/tmp}"
REPO_DIR="${MERCYB_REAPER_REPO:-}"
REASON="${MERCYB_REAPER_REASON:-post-merge}"
SKIP_PROCESS_CHECK="${MERCYB_REAPER_SKIP_PROCESS_CHECK:-0}"
REMOVED_COUNT=0
SKIPPED_COUNT=0

log() {
  printf '[%s] %s\n' "$SCRIPT_NAME" "$1"
}

err() {
  printf >&2 'ERROR [%s] %s\n' "$SCRIPT_NAME" "$1"
}

usage() {
  sed -n '1,/^set -euo pipefail$/p' "$0" | sed -e 's/^# \{0,1\}//' -e '/^#!/d' -e '/^set -euo pipefail$/d'
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --live)
      MODE="live"
      shift
      ;;
    --dry-run)
      MODE="dry-run"
      shift
      ;;
    --merged-ref)
      MERGED_REF="${2:-}"
      if [[ -z "$MERGED_REF" ]]; then
        err "--merged-ref requires a ref"
        exit 1
      fi
      shift 2
      ;;
    --roots)
      ROOTS="${2:-}"
      if [[ -z "$ROOTS" ]]; then
        err "--roots requires a colon-separated path list"
        exit 1
      fi
      shift 2
      ;;
    --reason)
      REASON="${2:-}"
      if [[ -z "$REASON" ]]; then
        err "--reason requires a value"
        exit 1
      fi
      shift 2
      ;;
    --repo)
      REPO_DIR="${2:-}"
      if [[ -z "$REPO_DIR" ]]; then
        err "--repo requires a repository path"
        exit 1
      fi
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      err "unknown flag: $1"
      printf >&2 'Run with --help to see usage.\n'
      exit 1
      ;;
  esac
done

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    err "missing required command: $1"
    exit 2
  fi
}

canonical_dir() {
  local path="$1"
  if [[ ! -d "$path" ]]; then
    return 1
  fi
  (cd "$path" 2>/dev/null && pwd -P)
}

is_under_dir() {
  local path="$1"
  local root="$2"
  [[ "$path" == "$root" || "$path" == "$root"/* ]]
}

is_protected_path() {
  local path="$1"
  local home_root="${HOME:-}"
  [[ -n "$home_root" ]] || return 1

  local mercy_root keystore_root
  mercy_root="$(canonical_dir "$home_root/MercyB" 2>/dev/null || true)"
  keystore_root="$(canonical_dir "$home_root/MercyB-keystore" 2>/dev/null || true)"

  if [[ -n "$mercy_root" ]] && is_under_dir "$path" "$mercy_root"; then
    return 0
  fi
  if [[ -n "$keystore_root" ]] && is_under_dir "$path" "$keystore_root"; then
    return 0
  fi
  return 1
}

is_allowed_root() {
  local path="$1"
  local root raw canonical
  IFS=':' read -r -a root_parts <<< "$ROOTS"
  for raw in "${root_parts[@]}"; do
    [[ -n "$raw" ]] || continue
    canonical="$(canonical_dir "$raw" 2>/dev/null || true)"
    [[ -n "$canonical" ]] || continue
    if is_under_dir "$path" "$canonical"; then
      return 0
    fi
  done
  return 1
}

has_active_process_under() {
  local path="$1"
  if [[ "$SKIP_PROCESS_CHECK" == "1" ]]; then
    return 1
  fi
  if ! command -v lsof >/dev/null 2>&1; then
    return 1
  fi
  lsof -t +D "$path" >/dev/null 2>&1
}

print_df() {
  local label="$1"
  log "$label df -h /"
  df -h / | sed "s/^/[$SCRIPT_NAME] /"
}

need_cmd git

if [[ -z "$REPO_DIR" ]]; then
  REPO_DIR="$(pwd)"
fi

if ! git -C "$REPO_DIR" rev-parse --git-dir >/dev/null 2>&1; then
  err "must run inside a git repository"
  exit 3
fi

if ! git -C "$REPO_DIR" rev-parse --verify "$MERGED_REF^{commit}" >/dev/null 2>&1; then
  err "merged ref not found: $MERGED_REF"
  exit 4
fi

current_worktree="$(canonical_dir "$(git -C "$REPO_DIR" rev-parse --show-toplevel)")"
print_df "before"
log "mode=$MODE reason=$REASON repo=$REPO_DIR merged_ref=$MERGED_REF roots=$ROOTS current=$current_worktree"

while IFS= read -r wt_path; do
  [[ -n "$wt_path" ]] || continue
  canonical_path="$(canonical_dir "$wt_path" 2>/dev/null || true)"
  if [[ -z "$canonical_path" ]]; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP missing-worktree path=$wt_path"
    continue
  fi

  branch_line="$(git -C "$REPO_DIR" worktree list --porcelain | awk -v path="$wt_path" '
    $0 == "worktree " path { in_block=1; next }
    $1 == "worktree" && in_block { exit }
    in_block && $1 == "branch" { print $2; exit }
  ')"
  locked_line="$(git -C "$REPO_DIR" worktree list --porcelain | awk -v path="$wt_path" '
    $0 == "worktree " path { in_block=1; next }
    $1 == "worktree" && in_block { exit }
    in_block && $1 == "locked" { print $0; exit }
  ')"
  head_sha="$(git -C "$canonical_path" rev-parse --verify HEAD 2>/dev/null || true)"

  if [[ "$canonical_path" == "$current_worktree" ]]; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP current-worktree path=$canonical_path"
    continue
  fi
  if is_protected_path "$canonical_path"; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP protected-path path=$canonical_path"
    continue
  fi
  if ! is_allowed_root "$canonical_path"; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP outside-approved-roots path=$canonical_path"
    continue
  fi
  if [[ -z "$branch_line" || "$branch_line" == "detached" ]]; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP no-branch path=$canonical_path head=${head_sha:-unknown}"
    continue
  fi
  if [[ -n "$locked_line" ]]; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP locked-worktree path=$canonical_path branch=$branch_line"
    continue
  fi
  if [[ -n "$(git -C "$canonical_path" status --porcelain 2>/dev/null)" ]]; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP dirty-worktree path=$canonical_path branch=$branch_line"
    continue
  fi
  if has_active_process_under "$canonical_path"; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP active-process path=$canonical_path branch=$branch_line"
    continue
  fi
  if ! git -C "$REPO_DIR" merge-base --is-ancestor "$head_sha" "$MERGED_REF"; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP unmerged path=$canonical_path branch=$branch_line head=$head_sha"
    continue
  fi

  if [[ "$MODE" == "live" ]]; then
    log "REMOVE path=$canonical_path branch=$branch_line head=$head_sha safe=clean-and-merged-into-$MERGED_REF"
    git -C "$REPO_DIR" worktree remove "$canonical_path"
  else
    log "DRY-RUN would-remove path=$canonical_path branch=$branch_line head=$head_sha safe=clean-and-merged-into-$MERGED_REF"
  fi
  REMOVED_COUNT=$((REMOVED_COUNT + 1))
done < <(git -C "$REPO_DIR" worktree list --porcelain | awk '$1 == "worktree" { print substr($0, 10) }')

print_df "after"
log "summary mode=$MODE removed=$REMOVED_COUNT skipped=$SKIPPED_COUNT"
