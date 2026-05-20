#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
LOG_DIR="${ROOT}/reports/disk-cleanup-evidence"
LOG_FILE="${LOG_DIR}/safe-cleanup-${STAMP}.log"
MODE="dry-run"
STALE_DAYS="${STALE_DAYS:-14}"

mkdir -p "$LOG_DIR"

usage() {
  cat <<USAGE
Usage: scripts/ops/safe-cleanup.sh [--dry-run|--execute]

Default: --dry-run

Removes only conservative, reinstallable/disposable local artifacts:
  - stale clean temp worktrees whose HEAD is present on origin/main or a remote ref
  - node_modules under /private/tmp and /tmp
  - npm cache, pnpm store packages, Playwright cache, Xcode DerivedData

Never deletes branches, dirty worktrees, env files, reports, archives, or source files.
USAGE
}

case "${1:---dry-run}" in
  --dry-run) MODE="dry-run" ;;
  --execute) MODE="execute" ;;
  -h|--help) usage; exit 0 ;;
  *) usage >&2; exit 2 ;;
esac

log() {
  printf '%s\n' "$*" | tee -a "$LOG_FILE"
}

run_or_print() {
  if [ "$MODE" = "execute" ]; then
    log "+ $*"
    "$@" 2>&1 | tee -a "$LOG_FILE"
  else
    log "DRY-RUN: $*"
  fi
}

is_temp_path() {
  case "$1" in
    /private/tmp/*|/tmp/*) return 0 ;;
    *) return 1 ;;
  esac
}

head_is_remote_backed() {
  local path="$1"
  git -C "$path" merge-base --is-ancestor HEAD origin/main 2>/dev/null && return 0
  [ -n "$(git -C "$path" branch -r --contains HEAD 2>/dev/null | sed '/^[[:space:]]*$/d')" ]
}

clean_stale_worktrees() {
  git -C "$ROOT" worktree list --porcelain |
    awk '/^worktree /{sub(/^worktree /,""); print}' |
    while IFS= read -r path; do
      [ -d "$path" ] || continue
      is_temp_path "$path" || continue
      [ "$path" != "$ROOT" ] || continue

      if [ -n "$(git -C "$path" status --short 2>/dev/null || true)" ]; then
        log "KEEP dirty worktree: $path"
        continue
      fi

      if ! find "$path" -maxdepth 0 -mtime +"$STALE_DAYS" -print 2>/dev/null | grep -q .; then
        log "KEEP not stale: $path"
        continue
      fi

      if ! head_is_remote_backed "$path"; then
        log "KEEP no remote-backed HEAD proof: $path"
        continue
      fi

      size="$(du -sh "$path" 2>/dev/null | awk '{print $1}')"
      log "REMOVE stale clean remote-backed worktree: ${size:-unknown} $path"
      run_or_print git -C "$ROOT" worktree remove "$path"
    done

  run_or_print git -C "$ROOT" worktree prune
}

remove_temp_node_modules() {
  find /private/tmp /tmp -name node_modules -type d -prune 2>/dev/null |
    while IFS= read -r path; do
      case "$path" in
        */reports/*|*/.git/*|*.env*|*/.env*) log "KEEP protected path: $path"; continue ;;
      esac
      size="$(du -sh "$path" 2>/dev/null | awk '{print $1}')"
      log "REMOVE temp node_modules: ${size:-unknown} $path"
      run_or_print rm -rf "$path"
    done
}

clean_caches() {
  if command -v npm >/dev/null 2>&1; then
    run_or_print npm cache clean --force
  else
    log "SKIP npm cache: npm not found"
  fi

  if command -v pnpm >/dev/null 2>&1; then
    run_or_print pnpm store prune
  else
    log "SKIP pnpm store: pnpm not found"
  fi

  if [ -d "$HOME/Library/Caches/ms-playwright" ]; then
    run_or_print rm -rf "$HOME/Library/Caches/ms-playwright"
  else
    log "SKIP Playwright cache: not present"
  fi

  if [ -d "$HOME/Library/Developer/Xcode/DerivedData" ]; then
    run_or_print find "$HOME/Library/Developer/Xcode/DerivedData" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
  else
    log "SKIP Xcode DerivedData: not present"
  fi
}

log "# MercyB Safe Cleanup"
log "Timestamp: $(date -Iseconds)"
log "Repo root: $ROOT"
log "Mode: $MODE"
log "Stale worktree threshold: $STALE_DAYS days"
log "Log file: $LOG_FILE"
log ""
log "## Stale Clean Worktrees"
clean_stale_worktrees
log ""
log "## Temp Node Modules"
remove_temp_node_modules
log ""
log "## Caches"
clean_caches
log ""
log "Safe cleanup complete."
