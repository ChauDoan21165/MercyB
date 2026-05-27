#!/usr/bin/env bash
#
# scripts/supervisor/agent-state.sh
#
# A tiny key-value store for "which agent is doing what right now",
# living in $HOME so it is shared across every worktree on this machine
# and never tracked in git. Each agent dispatch template should call
# this at the start (`mark <self> working`) and end (`mark-idle <self>`)
# of its run, so the supervisor can answer "which terminal is free?"
# without polling 9 terminals by eye.
#
# State file: ~/.mercyb/agent-state.json
#
# Schema:
#   {
#     "agents": {
#       "C1": {
#         "worktree": "/Users/admin/MercyB-c1-supervisor-tools",
#         "branch": "feat/supervisor-tools",
#         "status": "working",
#         "last_dispatch_ts": "2026-05-27T15:00:00Z"
#       },
#       ...
#     }
#   }
#
# Why JSON in $HOME and not the repo: this is private operator state. It
# changes minute by minute, it is per-machine, and it would be noise in
# every diff. Keeping it out of source control also means agents can
# scribble to it freely without fighting for a lock on the index.
#
# Subcommands:
#   mark <agent> <status>     Upsert <agent>.status. Records branch +
#                             worktree from the calling shell's CWD and
#                             current git branch, plus an ISO timestamp.
#                             Valid statuses: idle, working, blocked,
#                             reporting.
#   mark-idle <agent>         Shorthand for `mark <agent> idle`.
#   list                      Pretty-print every agent + its state.
#   idle                      Print just the agents currently idle, one
#                             per line. Useful for "who can I dispatch?".
#   --help, -h                Print this header.
#
# Exit codes:
#   0   ok
#   1   bad subcommand / missing arg / bad status value
#   2   missing required command (jq)

set -euo pipefail

# ── Helpers ────────────────────────────────────────────────────────────

log_err() {
  printf >&2 'ERROR [agent-state] %s\n' "$1"
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    log_err "missing required command: $1"
    exit 2
  fi
}

usage() {
  sed -n '1,/^set -euo pipefail$/p' "$0" | sed -e 's/^# \{0,1\}//' -e '/^#!/d' -e '/^set -euo pipefail$/d'
}

# ── State file setup ───────────────────────────────────────────────────

STATE_DIR="${MERCYB_STATE_DIR:-$HOME/.mercyb}"
STATE_FILE="$STATE_DIR/agent-state.json"

ensure_state_file() {
  mkdir -p "$STATE_DIR"
  if [[ ! -f "$STATE_FILE" ]]; then
    printf '{"agents":{}}\n' > "$STATE_FILE"
  fi
}

iso_ts() {
  date -u +%Y-%m-%dT%H-%M-%SZ
}

current_branch() {
  git rev-parse --abbrev-ref HEAD 2>/dev/null || printf 'unknown'
}

current_worktree() {
  # Caller's CWD captures the worktree path; we don't try to resolve
  # symlinks because the worktree path is the identifier here.
  pwd
}

valid_status() {
  case "$1" in
    idle|working|blocked|reporting) return 0 ;;
    *) return 1 ;;
  esac
}

# Atomic write: stage to a tmp file in the same dir, then rename.
write_state() {
  local new_state="$1"
  local tmp
  tmp="$(mktemp "$STATE_DIR/.agent-state.XXXXXX.json")"
  printf '%s\n' "$new_state" > "$tmp"
  mv "$tmp" "$STATE_FILE"
}

# ── Subcommands ────────────────────────────────────────────────────────

cmd_mark() {
  local agent="$1"
  local status="$2"
  if ! valid_status "$status"; then
    log_err "invalid status: $status (use one of: idle, working, blocked, reporting)"
    exit 1
  fi
  ensure_state_file
  local branch worktree ts
  branch="$(current_branch)"
  worktree="$(current_worktree)"
  ts="$(iso_ts)"
  local new_state
  new_state="$(
    jq --arg a "$agent" \
       --arg s "$status" \
       --arg b "$branch" \
       --arg w "$worktree" \
       --arg t "$ts" \
       '.agents[$a] = {worktree: $w, branch: $b, status: $s, last_dispatch_ts: $t}' \
       "$STATE_FILE"
  )"
  write_state "$new_state"
  printf 'agent-state: %s -> %s (%s on %s)\n' "$agent" "$status" "$branch" "$worktree"
}

cmd_mark_idle() {
  local agent="$1"
  cmd_mark "$agent" idle
}

cmd_list() {
  ensure_state_file
  # Pretty table: agent | status | branch | ts | worktree.
  jq -r '
    .agents
    | to_entries
    | sort_by(.key)
    | .[]
    | [.key, .value.status, (.value.branch // "-"), (.value.last_dispatch_ts // "-"), (.value.worktree // "-")]
    | @tsv
  ' "$STATE_FILE" \
    | awk -F '\t' '{ printf "%-6s | %-10s | %-40s | %-22s | %s\n", $1, $2, $3, $4, $5 }'
}

cmd_idle() {
  ensure_state_file
  jq -r '.agents | to_entries[] | select(.value.status == "idle") | .key' "$STATE_FILE"
}

# ── Argument parsing ───────────────────────────────────────────────────

require_cmd jq

if [[ $# -eq 0 ]]; then
  usage
  exit 1
fi

case "$1" in
  --help|-h)
    usage
    exit 0
    ;;
  mark)
    shift
    if [[ $# -lt 2 ]]; then
      log_err "mark requires <agent> <status>"
      exit 1
    fi
    cmd_mark "$1" "$2"
    ;;
  mark-idle)
    shift
    if [[ $# -lt 1 ]]; then
      log_err "mark-idle requires <agent>"
      exit 1
    fi
    cmd_mark_idle "$1"
    ;;
  list)
    cmd_list
    ;;
  idle)
    cmd_idle
    ;;
  *)
    log_err "unknown subcommand: $1"
    printf >&2 'Run with --help to see usage.\n'
    exit 1
    ;;
esac

exit 0
