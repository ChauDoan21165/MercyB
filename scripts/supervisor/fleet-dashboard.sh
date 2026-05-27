#!/usr/bin/env bash
#
# scripts/supervisor/fleet-dashboard.sh
#
# Single-screen view for the supervisor: MR queue + agent fleet + a
# one-line derived summary. Designed to be the body of a watch loop in
# a corner terminal:
#
#   watch -n 30 scripts/supervisor/fleet-dashboard.sh
#
# Layout:
#
#   ── MR queue ──────────────────────────────────────────────────────
#   <output of scripts/supervisor/mr-status.sh, unchanged>
#
#   ── Agent fleet ───────────────────────────────────────────────────
#   <output of scripts/supervisor/agent-state.sh list>
#
#   ── Summary ───────────────────────────────────────────────────────
#   N idle agents available · M MRs awaiting merge · K MRs running
#
# Why a single composite script instead of two `watch` windows: the
# operator's primary question is "which agent can I dispatch a new MR
# to, and which open MR is unblocked enough to merge". Both halves of
# that question live in different state, but they're answered together
# in practice. One window keeps the eye in one place.
#
# This script intentionally shells out to the existing supervisor tools
# rather than reimplementing their logic. If `merge-clean.sh` ever gets
# a smarter "ready" definition, the dashboard inherits it for free.
#
# Usage:
#   scripts/supervisor/fleet-dashboard.sh [--help]
#
# Exit codes:
#   0   ok (dashboard printed)
#   1   bad flag
#   2   missing required command (jq, glab) — surfaced from the called scripts
#   3   the called scripts errored out

set -euo pipefail

# ── Helpers ────────────────────────────────────────────────────────────

log_err() {
  printf >&2 'ERROR [fleet-dashboard] %s\n' "$1"
}

usage() {
  sed -n '1,/^set -euo pipefail$/p' "$0" | sed -e 's/^# \{0,1\}//' -e '/^#!/d' -e '/^set -euo pipefail$/d'
}

# Resolve the supervisor/ directory so the dashboard works regardless of
# the caller's CWD.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ANSI color helpers — TTY-aware, CI-safe.
if [[ -t 1 ]] && command -v tput >/dev/null 2>&1; then
  C_BOLD="$(tput bold)"
  C_DIM="$(tput dim)"
  C_RESET="$(tput sgr0)"
else
  C_BOLD=""
  C_DIM=""
  C_RESET=""
fi

# ── Argument parsing ───────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h)
      usage
      exit 0
      ;;
    *)
      log_err "unknown flag: $1"
      printf >&2 'Run with --help to see usage.\n'
      exit 1
      ;;
  esac
done

# ── Section: MR queue ──────────────────────────────────────────────────

printf '%s── MR queue ────────────────────────────────────────────────────%s\n' "$C_BOLD" "$C_RESET"

# Capture so we can re-use the same data for the summary line. mr-status
# prints one MR per line; if the queue is empty it prints nothing.
MR_LINES=""
if MR_LINES="$("$SCRIPT_DIR/mr-status.sh" 2>/dev/null)"; then
  if [[ -z "$MR_LINES" ]]; then
    printf '%s  (no open MRs)%s\n' "$C_DIM" "$C_RESET"
  else
    printf '%s\n' "$MR_LINES"
  fi
else
  log_err "mr-status.sh failed"
  exit 3
fi

printf '\n'

# ── Section: agent fleet ───────────────────────────────────────────────

printf '%s── Agent fleet ─────────────────────────────────────────────────%s\n' "$C_BOLD" "$C_RESET"

AGENT_LINES=""
if AGENT_LINES="$("$SCRIPT_DIR/agent-state.sh" list 2>/dev/null)"; then
  if [[ -z "$AGENT_LINES" ]]; then
    printf '%s  (no agents recorded — agents self-register via agent-state.sh mark)%s\n' "$C_DIM" "$C_RESET"
  else
    printf '%s\n' "$AGENT_LINES"
  fi
else
  log_err "agent-state.sh list failed"
  exit 3
fi

printf '\n'

# ── Section: derived summary ───────────────────────────────────────────
#
# IDLE_COUNT, READY_COUNT, RUNNING_COUNT, TOTAL_OPEN are computed from
# the captured outputs above — no extra glab API call. This keeps the
# dashboard cheap enough to run on a 5-second watch interval if the
# operator wants to.

IDLE_COUNT=0
if [[ -n "$AGENT_LINES" ]]; then
  # agent-state.sh list output is "<agent> | <status> | ..." — count
  # the lines whose 2nd column is "idle".
  IDLE_COUNT="$(printf '%s\n' "$AGENT_LINES" | awk -F '|' '{ gsub(/ /, "", $2); if ($2 == "idle") c++ } END { print c+0 }')"
fi

TOTAL_OPEN=0
READY_COUNT=0
RUNNING_COUNT=0
if [[ -n "$MR_LINES" ]]; then
  TOTAL_OPEN="$(printf '%s\n' "$MR_LINES" | wc -l | tr -d ' ')"
  READY_COUNT="$(printf '%s\n' "$MR_LINES" | awk -F '|' '{ gsub(/ /, "", $4); if ($4 == "ready") c++ } END { print c+0 }')"
  RUNNING_COUNT="$(printf '%s\n' "$MR_LINES" | awk -F '|' '{ gsub(/ /, "", $4); if ($4 == "pipeline-running") c++ } END { print c+0 }')"
fi

printf '%s── Summary ─────────────────────────────────────────────────────%s\n' "$C_BOLD" "$C_RESET"
printf '  %s idle agent(s) · %s MR(s) awaiting merge · %s MR(s) running · %s open total\n' \
  "$IDLE_COUNT" "$READY_COUNT" "$RUNNING_COUNT" "$TOTAL_OPEN"

exit 0
