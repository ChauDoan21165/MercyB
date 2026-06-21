#!/usr/bin/env bash
set -euo pipefail

duration_seconds="${MERCYB_WATCH_DURATION_SECONDS:-21600}"
interval_seconds="${MERCYB_WATCH_INTERVAL_SECONDS:-300}"
log_file="${HOME}/mercyb-6h-watch.log"

if [[ -z "${MERCYB_WATCH_CAFFEINATED:-}" ]] && command -v caffeinate >/dev/null 2>&1; then
  export MERCYB_WATCH_CAFFEINATED=1
  exec caffeinate -dimsu -t "$duration_seconds" "$0" "$@"
fi

deadline=$(( $(date +%s) + duration_seconds ))

log() {
  printf '\n[%s] %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*" >> "$log_file"
}

run_logged() {
  local label="$1"
  shift
  log "$label"
  if "$@" >> "$log_file" 2>&1; then
    return 0
  fi
  printf '[watch] command failed: %s\n' "$*" >> "$log_file"
}

log "MercyB 6-hour factory watch start pid=$$ duration=${duration_seconds}s interval=${interval_seconds}s"
log "Read-only watch: no merge, deploy, push, or retry commands are executed."

while (( $(date +%s) < deadline )); do
  if command -v glab >/dev/null 2>&1; then
    run_logged "open merge requests" glab mr list --state opened --per-page 50
    run_logged "latest main pipeline" glab pipeline list --branch main --per-page 1
    run_logged "recent failed jobs" glab ci list --status failed --per-page 20
  else
    log "glab is not installed; recording local branch/remotes only."
    run_logged "local git status" git status --short
    run_logged "origin/main ref" git ls-remote --heads origin main
  fi

  remaining=$(( deadline - $(date +%s) ))
  (( remaining <= 0 )) && break
  if (( remaining < interval_seconds )); then
    sleep "$remaining"
  else
    sleep "$interval_seconds"
  fi
done

log "MercyB 6-hour factory watch exit"
echo "watch log: $log_file"
