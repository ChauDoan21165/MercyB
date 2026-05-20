#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
LOG_DIR="${ROOT}/reports/disk-cleanup-evidence"
LOG_FILE="${LOG_DIR}/disk-audit-${STAMP}.log"
STALE_DAYS="${STALE_DAYS:-7}"

mkdir -p "$LOG_DIR"

run_section() {
  local title="$1"
  shift
  {
    printf '\n## %s\n' "$title"
    "$@" || printf 'WARN: section command exited nonzero: %s\n' "$*"
  } 2>&1 | tee -a "$LOG_FILE"
}

print_header() {
  {
    printf '# MercyB Disk Audit\n'
    printf 'Timestamp: %s\n' "$(date -Iseconds)"
    printf 'Repo root: %s\n' "$ROOT"
    printf 'Log file: %s\n' "$LOG_FILE"
    printf 'Stale worktree threshold: %s days\n' "$STALE_DAYS"
  } | tee "$LOG_FILE"
}

worktree_usage() {
  git -C "$ROOT" worktree list --porcelain |
    awk '/^worktree /{sub(/^worktree /,""); print}' |
    while IFS= read -r path; do
      [ -d "$path" ] || continue
      size="$(du -sh "$path" 2>/dev/null | awk '{print $1}')"
      branch="$(git -C "$path" branch --show-current 2>/dev/null || true)"
      status="$(git -C "$path" status --short 2>/dev/null || true)"
      last="$(git -C "$path" log -1 --oneline 2>/dev/null || true)"
      if [ -n "$status" ]; then
        clean="dirty"
      else
        clean="clean"
      fi
      printf '%s\t%s\t%s\t%s\t%s\n' "${size:-unknown}" "$clean" "${branch:-detached}" "$path" "$last"
    done | sort -h
}

stale_worktrees() {
  git -C "$ROOT" worktree list --porcelain |
    awk '/^worktree /{sub(/^worktree /,""); print}' |
    while IFS= read -r path; do
      case "$path" in
        /private/tmp/*|/tmp/*) ;;
        *) continue ;;
      esac
      [ -d "$path" ] || continue
      if [ -n "$(git -C "$path" status --short 2>/dev/null || true)" ]; then
        continue
      fi
      if find "$path" -maxdepth 0 -mtime +"$STALE_DAYS" -print 2>/dev/null | grep -q .; then
        branch="$(git -C "$path" branch --show-current 2>/dev/null || true)"
        last="$(git -C "$path" log -1 --oneline 2>/dev/null || true)"
        printf 'stale-clean\t%s\t%s\t%s\n' "${branch:-detached}" "$path" "$last"
      fi
    done
}

repo_count() {
  (find "$HOME" /private/tmp /tmp -name .git -type d -prune 2>/dev/null || true) | wc -l | tr -d ' '
  printf '\n'
}

cache_usage() {
  for path in \
    "$HOME/.npm" \
    "$HOME/Library/pnpm/store" \
    "$HOME/Library/Caches/pnpm" \
    "$HOME/Library/Caches/ms-playwright" \
    "$HOME/Library/Developer/Xcode/DerivedData" \
    "$HOME/Library/Caches" \
    "$HOME/Library/Application Support/Google"; do
    du -sh "$path" 2>/dev/null || true
  done
}

print_header
run_section "Disk Filesystems" df -h
run_section "Top Home Directories" bash -c 'du -sh "$HOME"/* 2>/dev/null | sort -h | tail -40'
run_section "Top Private Temp Directories" bash -c 'du -sh /private/tmp/* 2>/dev/null | sort -h | tail -60'
run_section "Worktree Usage" worktree_usage
run_section "Node Modules Usage" bash -c 'find "$HOME" /private/tmp /tmp -name node_modules -type d -prune -exec du -sh {} \; 2>/dev/null | sort -h | tail -80'
run_section "Cache Usage" cache_usage
run_section "Files Over 500MB" bash -c 'find "$HOME" -type f -size +500M 2>/dev/null | while IFS= read -r f; do du -sh "$f" 2>/dev/null; done | sort -h'
run_section "Repo Count" repo_count
run_section "Stale Clean Worktrees" stale_worktrees

printf '\nAudit complete: %s\n' "$LOG_FILE" | tee -a "$LOG_FILE"
