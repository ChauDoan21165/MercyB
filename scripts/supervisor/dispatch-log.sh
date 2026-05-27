#!/usr/bin/env bash
#
# scripts/supervisor/dispatch-log.sh
#
# Print the rolling dispatch timeline from ~/.mercyb/dispatch-log.jsonl.
#
# The log is populated by `agent-state.sh report-done <agent> <mr>` —
# one JSON line per completed dispatch, schema:
#
#   {
#     "ts": "2026-05-27T22-00-00Z",
#     "agent": "C1",
#     "mr": 78,
#     "branch": "feat/supervisor-tools",
#     "worktree": "/Users/admin/MercyB-c1-supervisor-tools",
#     "action": "done"
#   }
#
# This script does NOT write to the log. It only reads. The log is
# append-only by design; pruning is a manual operation (just rotate or
# delete the file when you don't want it anymore).
#
# Output format (TSV-aligned, one row per matching dispatch, oldest at
# top so the timeline reads chronologically):
#
#   2026-05-27T22-00-00Z  C1     !78    feat/supervisor-tools
#   2026-05-27T22-30-00Z  C3     !79    feat/a11y-fix
#   ...
#
# Usage:
#   scripts/supervisor/dispatch-log.sh                       # last 24h
#   scripts/supervisor/dispatch-log.sh --agent C3            # filter by agent
#   scripts/supervisor/dispatch-log.sh --since 2026-05-27    # since date (ISO or YYYY-MM-DD)
#   scripts/supervisor/dispatch-log.sh --agent C3 --since 2026-05-27
#   scripts/supervisor/dispatch-log.sh --all                 # no time window
#
# Exit codes:
#   0   ok (timeline printed; empty output if no matches)
#   1   bad flag
#   2   missing required command (jq)
#   3   malformed log file (a line that isn't valid JSON)

set -euo pipefail

# ── Helpers ────────────────────────────────────────────────────────────

log_err() {
  printf >&2 'ERROR [dispatch-log] %s\n' "$1"
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

# ── State file ─────────────────────────────────────────────────────────

STATE_DIR="${MERCYB_STATE_DIR:-$HOME/.mercyb}"
LOG_FILE="$STATE_DIR/dispatch-log.jsonl"

# ── Argument parsing ───────────────────────────────────────────────────

AGENT_FILTER=""
SINCE_FILTER=""
ALL_TIME=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h)
      usage
      exit 0
      ;;
    --agent)
      if [[ $# -lt 2 ]]; then
        log_err "--agent requires a value"
        exit 1
      fi
      AGENT_FILTER="$2"
      shift 2
      ;;
    --since)
      if [[ $# -lt 2 ]]; then
        log_err "--since requires a value (ISO timestamp or YYYY-MM-DD)"
        exit 1
      fi
      SINCE_FILTER="$2"
      shift 2
      ;;
    --all)
      ALL_TIME=1
      shift
      ;;
    *)
      log_err "unknown flag: $1"
      printf >&2 'Run with --help to see usage.\n'
      exit 1
      ;;
  esac
done

require_cmd jq

# ── Compute the default --since (24h ago) if not provided ──────────────
#
# We use `date -v-24H` on macOS BSD and fall back to `date -d "24 hours
# ago"` on GNU coreutils, then normalize to the same `YYYY-MM-DDTHH-MM-SSZ`
# format used by agent-state.sh's iso_ts(). The hyphen-form is preserved
# so string comparison against the log's `ts` field works correctly.

iso_24h_ago() {
  if date -u -v-24H +%Y-%m-%dT%H-%M-%SZ >/dev/null 2>&1; then
    date -u -v-24H +%Y-%m-%dT%H-%M-%SZ
  else
    date -u -d "24 hours ago" +%Y-%m-%dT%H-%M-%SZ
  fi
}

# Accept a user-supplied --since that's either a full ISO timestamp or
# a bare YYYY-MM-DD. For the bare-date form, pad to the start of that
# day in UTC.
normalize_since() {
  local raw="$1"
  if [[ "$raw" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    printf '%sT00-00-00Z\n' "$raw"
  else
    # Assume it's already an ISO timestamp; passthrough.
    printf '%s\n' "$raw"
  fi
}

if [[ "$ALL_TIME" -eq 1 ]]; then
  SINCE_TS=""
elif [[ -n "$SINCE_FILTER" ]]; then
  SINCE_TS="$(normalize_since "$SINCE_FILTER")"
else
  SINCE_TS="$(iso_24h_ago)"
fi

# ── Read + filter ──────────────────────────────────────────────────────

if [[ ! -f "$LOG_FILE" ]]; then
  # Empty log is a valid "no dispatches yet" state, not an error.
  exit 0
fi

# Validate first: if any line is not parsable JSON, refuse silently
# coercing — we'd rather flag a corrupt log than show partial data.
if ! jq -e . "$LOG_FILE" >/dev/null 2>&1; then
  log_err "$LOG_FILE contains a malformed JSON line; refusing to read partial data"
  exit 3
fi

# Build the jq filter dynamically. `.ts` is sortable as a string because
# the format zero-pads every component (YYYY-MM-DDTHH-MM-SSZ).
JQ_FILTER='.'
if [[ -n "$AGENT_FILTER" ]]; then
  JQ_FILTER+=' | select(.agent == $agent)'
fi
if [[ -n "$SINCE_TS" ]]; then
  JQ_FILTER+=' | select(.ts >= $since)'
fi
# Tab-separated output ordered by ts ascending. We use a two-pass
# approach: filter first to a JSON stream, then sort + format.
FILTERED="$(
  jq -c \
     --arg agent "$AGENT_FILTER" \
     --arg since "$SINCE_TS" \
     "$JQ_FILTER" \
     "$LOG_FILE"
)"

if [[ -z "$FILTERED" ]]; then
  exit 0
fi

printf '%s\n' "$FILTERED" \
  | jq -rs 'sort_by(.ts) | .[] | [.ts, .agent, ("!" + (.mr | tostring)), (.branch // "-")] | @tsv' \
  | awk -F '\t' '{ printf "%-22s  %-6s  %-7s  %s\n", $1, $2, $3, $4 }'

exit 0
