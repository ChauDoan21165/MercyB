#!/usr/bin/env bash
set -euo pipefail

include_reconciler=0
min_age_seconds="${MERCYB_STALE_WORKER_MIN_AGE_SECONDS:-3600}"
if [[ "${1:-}" == "--include-reconciler" ]]; then
  include_reconciler=1
elif [[ $# -gt 0 ]]; then
  echo "Usage: $0 [--include-reconciler]" >&2
  exit 2
fi

collect_targets() {
  ps -axo pid=,etimes=,args= | awk -v include_reconciler="$include_reconciler" -v self="$$" -v min_age_seconds="$min_age_seconds" '
    function target(cmd) {
      if (cmd ~ /gitlab-runner/) return 0
      if (!include_reconciler && cmd ~ /reconciler/) return 0
      if (cmd ~ /(^|[[:space:]/])codex([[:space:]]|$)/) return 1
      if (cmd ~ /(^|[[:space:]/])claude([[:space:]]|$)/) return 1
      if (cmd ~ /vite preview/) return 1
      if (cmd ~ /esbuild --service/) return 1
      if (cmd ~ /npm exec vite preview/) return 1
      return 0
    }
    {
      pid=$1
      age=$2
      $1=""
      $2=""
      sub(/^ +/, "", $0)
      if (pid != self && age >= min_age_seconds && target($0)) print pid "\tage=" age "s\t" $0
    }
  '
}

print_summary() {
  local title="$1"
  local rows="$2"
  echo "== $title =="
  if [[ -z "$rows" ]]; then
    echo "No stale factory worker processes found."
  else
    printf '%s\n' "$rows"
  fi
}

before="$(collect_targets || true)"
print_summary "before" "$before"

if [[ -n "$before" ]]; then
  while IFS=$'\t' read -r pid _cmd; do
    [[ -z "$pid" ]] && continue
    kill -TERM "$pid" 2>/dev/null || true
  done <<< "$before"

  sleep 2

  remaining="$(collect_targets || true)"
  if [[ -n "$remaining" ]]; then
    while IFS=$'\t' read -r pid _cmd; do
      [[ -z "$pid" ]] && continue
      kill -KILL "$pid" 2>/dev/null || true
    done <<< "$remaining"
  fi
fi

after="$(collect_targets || true)"
print_summary "after" "$after"
