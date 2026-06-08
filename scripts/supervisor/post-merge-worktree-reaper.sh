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
BUILDS_DIR="${MERCYB_REAPER_BUILDS_DIR-${CI_BUILDS_DIR:-}}"
CURRENT_PIPELINE_ID="${CI_PIPELINE_ID:-}"
REASON="${MERCYB_REAPER_REASON:-post-merge}"
STALE_MINUTES="${MERCYB_REAPER_STALE_MINUTES:-120}"
REMOVED_COUNT=0
SKIPPED_COUNT=0
REPO_VALID=0

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
    --builds-dir)
      BUILDS_DIR="${2:-}"
      if [[ -z "$BUILDS_DIR" ]]; then
        err "--builds-dir requires a path"
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

is_approved_builds_root() {
  local path="$1"
  [[ "$path" != "/" ]] || return 1
  [[ "$path" != "$HOME" ]] || return 1
  [[ "$(basename "$path")" == "gitlab-runner-builds" || "$path" == */gitlab-runner-builds ]] || return 1
  return 0
}

print_df() {
  local label="$1"
  log "$label df -h /"
  df -h / | sed "s/^/[$SCRIPT_NAME] /"
}

mtime_epoch() {
  local path="$1"
  stat -f '%m' "$path" 2>/dev/null || stat -c '%Y' "$path" 2>/dev/null || printf '0\n'
}

has_active_owner() {
  local path="$1"
  local owner_pids
  # Fail closed: without lsof we cannot prove the worktree is unowned.
  if ! command -v lsof >/dev/null 2>&1; then
    return 0
  fi
  owner_pids="$(lsof -t +D "$path" 2>/dev/null || true)"
  [[ -n "$owner_pids" ]]
}

has_active_process_under() {
  has_active_owner "$1"
}

is_stale_by_mtime() {
  local path="$1"
  local mtime now age threshold
  mtime="$(mtime_epoch "$path")"
  now="$(date +%s)"
  threshold=$((STALE_MINUTES * 60))
  age=$((now - mtime))
  [[ "$age" -ge "$threshold" ]]
}

list_candidate_worktrees() {
  local raw root canonical git_marker path

  if [[ "$REPO_VALID" == "1" ]]; then
    git -C "$REPO_DIR" worktree list --porcelain | awk '$1 == "worktree" { print substr($0, 10) }'
  fi

  IFS=':' read -r -a root_parts <<< "$ROOTS"
  for raw in "${root_parts[@]}"; do
    [[ -n "$raw" ]] || continue
    root="$(canonical_dir "$raw" 2>/dev/null || true)"
    [[ -n "$root" ]] || continue
    while IFS= read -r git_marker; do
      path="$(dirname "$git_marker")"
      canonical="$(canonical_dir "$path" 2>/dev/null || true)"
      [[ -n "$canonical" ]] || continue
      # Linked worktrees have a .git file. Standalone clones have a .git
      # directory and are intentionally ignored by this reaper.
      if grep -q '^gitdir:' "$git_marker" 2>/dev/null; then
        printf '%s\n' "$canonical"
      fi
    done < <(find "$root" -mindepth 2 -maxdepth 4 -type f -name .git -print 2>/dev/null)
  done | awk '!seen[$0]++'
}

need_cmd git

reap_build_dirs() {
  local builds_root canonical_root pipeline_dir canonical_dirname
  builds_root="$1"
  canonical_root="$(canonical_dir "$builds_root" 2>/dev/null || true)"
  if [[ -z "$canonical_root" ]]; then
    log "SKIP build-dirs missing-root path=$builds_root"
    return 0
  fi
  if is_protected_path "$canonical_root" || ! is_approved_builds_root "$canonical_root"; then
    log "SKIP build-dirs unapproved-root path=$canonical_root"
    return 0
  fi

  log "scan build-dirs root=$canonical_root current_pipeline=${CURRENT_PIPELINE_ID:-unknown}"
  while IFS= read -r pipeline_dir; do
    [[ -n "$pipeline_dir" ]] || continue
    canonical_dirname="$(canonical_dir "$pipeline_dir" 2>/dev/null || true)"
    if [[ -z "$canonical_dirname" ]]; then
      SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
      log "SKIP build-dir missing path=$pipeline_dir"
      continue
    fi
    if ! is_under_dir "$canonical_dirname" "$canonical_root"; then
      SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
      log "SKIP build-dir outside-root path=$canonical_dirname"
      continue
    fi
    if [[ -n "$CURRENT_PIPELINE_ID" && "$(basename "$canonical_dirname")" == "$CURRENT_PIPELINE_ID" ]]; then
      SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
      log "SKIP build-dir current-pipeline path=$canonical_dirname"
      continue
    fi
    if has_active_process_under "$canonical_dirname"; then
      SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
      log "SKIP build-dir active-process path=$canonical_dirname"
      continue
    fi

    if [[ "$MODE" == "live" ]]; then
      log "REMOVE build-dir path=$canonical_dirname safe=non-current-runner-pipeline-dir"
      if ! rm -rf -- "$canonical_dirname"; then
        SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
        log "SKIP build-dir remove-failed path=$canonical_dirname"
        continue
      fi
    else
      log "DRY-RUN would-remove build-dir path=$canonical_dirname safe=non-current-runner-pipeline-dir"
    fi
    REMOVED_COUNT=$((REMOVED_COUNT + 1))
  done < <(find "$canonical_root" -mindepth 1 -maxdepth 1 -type d -name '[0-9]*' -print 2>/dev/null | sort)
}

if [[ -z "$REPO_DIR" ]]; then
  REPO_DIR="$(pwd)"
fi

if git -C "$REPO_DIR" rev-parse --git-dir >/dev/null 2>&1; then
  REPO_VALID=1
  REPO_DIR="$(canonical_dir "$(git -C "$REPO_DIR" rev-parse --show-toplevel)")"
else
  log "repo path is not a git repository; falling back to direct root scan: $REPO_DIR"
fi

if [[ "$REPO_VALID" == "1" ]] && ! git -C "$REPO_DIR" rev-parse --verify "$MERGED_REF^{commit}" >/dev/null 2>&1; then
  git -C "$REPO_DIR" fetch origin main --prune >/dev/null 2>&1 || true
fi

if [[ "$REPO_VALID" == "1" ]]; then
  current_worktree="$REPO_DIR"
else
  current_worktree="$(canonical_dir "$(pwd)" 2>/dev/null || pwd -P)"
fi
print_df "before"
log "mode=$MODE reason=$REASON repo=$REPO_DIR repo_valid=$REPO_VALID merged_ref=$MERGED_REF roots=$ROOTS builds_dir=${BUILDS_DIR:-none} current=$current_worktree"

while IFS= read -r wt_path; do
  [[ -n "$wt_path" ]] || continue
  canonical_path="$(canonical_dir "$wt_path" 2>/dev/null || true)"
  if [[ -z "$canonical_path" ]]; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP missing-worktree path=$wt_path"
    continue
  fi

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
  if has_active_owner "$canonical_path"; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP active-owner path=$canonical_path"
    continue
  fi
  if ! git -C "$canonical_path" rev-parse --git-dir >/dev/null 2>&1; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP not-git-worktree path=$canonical_path"
    continue
  fi

  branch_line="$(git -C "$canonical_path" symbolic-ref -q HEAD 2>/dev/null || true)"
  head_sha="$(git -C "$canonical_path" rev-parse --verify HEAD 2>/dev/null || true)"
  if [[ -z "$branch_line" ]]; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP no-branch path=$canonical_path head=${head_sha:-unknown}"
    continue
  fi

  git -C "$canonical_path" fetch origin main --prune >/dev/null 2>&1 || true
  if ! git -C "$canonical_path" rev-parse --verify "$MERGED_REF^{commit}" >/dev/null 2>&1; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP merged-ref-unavailable path=$canonical_path branch=$branch_line merged_ref=$MERGED_REF"
    continue
  fi
  if ! git -C "$canonical_path" merge-base --is-ancestor "$branch_line" "$MERGED_REF"; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP unmerged path=$canonical_path branch=$branch_line head=${head_sha:-unknown}"
    continue
  fi
  if ! is_stale_by_mtime "$canonical_path"; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    log "SKIP not-stale path=$canonical_path branch=$branch_line stale_minutes=$STALE_MINUTES"
    continue
  fi

  if [[ "$MODE" == "live" ]]; then
    common_dir="$(git -C "$canonical_path" rev-parse --git-common-dir 2>/dev/null || true)"
    log "REMOVE path=$canonical_path branch=$branch_line head=${head_sha:-unknown} safe=branch-merged-into-$MERGED_REF"
    git -C "$canonical_path" worktree remove --force --force "$canonical_path"
    if [[ -n "$common_dir" ]]; then
      git --git-dir="$common_dir" worktree prune -v 2>/dev/null || true
    fi
  else
    log "DRY-RUN would-remove path=$canonical_path branch=$branch_line head=${head_sha:-unknown} safe=branch-merged-into-$MERGED_REF"
  fi
  REMOVED_COUNT=$((REMOVED_COUNT + 1))
done < <(list_candidate_worktrees)

if [[ -n "$BUILDS_DIR" ]]; then
  reap_build_dirs "$BUILDS_DIR"
fi

if [[ "$MODE" == "live" && "$REPO_VALID" == "1" ]]; then
  git -C "$REPO_DIR" worktree prune -v
fi

print_df "after"
log "summary mode=$MODE removed=$REMOVED_COUNT skipped=$SKIPPED_COUNT"
