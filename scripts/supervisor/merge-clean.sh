#!/usr/bin/env bash
#
# scripts/supervisor/merge-clean.sh
#
# Iterate every open MR on this GitLab project, classify it, and auto-
# merge the ones that are safe to merge without a human touching them.
#
# What "safe to merge" means here (all must hold):
#   - state == "opened"
#   - draft == false
#   - has_conflicts == false
#   - the head pipeline finished with status "success"
#   - title is NOT case-insensitive matching: REQUIRES_OWNER_DECISION,
#     DROP, REVOKE, or the word "destructive"
#   - description is NOT case-insensitive matching: REQUIRES_OWNER_DECISION
#
# Anything that doesn't meet those gates is skipped with a one-line
# reason. Skips are by design — this script is the conservative path.
# A maintainer can always merge a "skipped" MR by hand from the UI.
#
# Default mode is DRY-RUN: it prints what it WOULD merge. Pass `--yes`
# to actually call `glab mr merge`. This mirrors the destructive-default
# discipline of scripts/db-backup/restore.sh — the safer mode is the one
# you get when you forget a flag.
#
# Usage:
#   scripts/supervisor/merge-clean.sh [--yes] [--help]
#
# Flags:
#   --yes         Actually merge. Without this, nothing on GitLab changes.
#   --help, -h    Print this header.
#
# Exit codes:
#   0   completed normally (merges may or may not have happened)
#   1   bad flag / usage error
#   2   missing required command (glab, jq)
#   3   glab API failure (couldn't list MRs)

set -euo pipefail

# ── Helpers ────────────────────────────────────────────────────────────

log_err() {
  printf >&2 'ERROR [merge-clean] %s\n' "$1"
}

log_info() {
  printf '%s\n' "$1"
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

# ── Argument parsing ───────────────────────────────────────────────────

ASSUME_YES=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --yes)
      ASSUME_YES=1
      shift
      ;;
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

# ── Preflight ──────────────────────────────────────────────────────────

require_cmd glab
require_cmd jq

# ── Fetch open MRs ─────────────────────────────────────────────────────

if ! MR_JSON="$(glab mr list --output json 2>/dev/null)"; then
  log_err "glab mr list failed; is glab authenticated for this project?"
  exit 3
fi

# Empty array is a valid "no open MRs" result.
MR_COUNT="$(printf '%s' "$MR_JSON" | jq 'length')"

if [[ "$MR_COUNT" == "0" ]]; then
  log_info "No open MRs. Nothing to do."
  exit 0
fi

if [[ "$ASSUME_YES" -eq 1 ]]; then
  log_info "merge-clean: $MR_COUNT open MR(s); --yes set, will merge eligible ones."
else
  log_info "merge-clean: $MR_COUNT open MR(s); DRY-RUN (pass --yes to actually merge)."
fi

# ── Classification ─────────────────────────────────────────────────────
#
# We pull a compact summary per MR with jq, one MR per line, fields tab-
# separated so we can `while read` it. We deliberately keep the title and
# description out of the loop body — those go to per-MR `glab mr view`
# calls. List output already includes title and a flag for conflicts on
# most GitLab versions, but pipeline status often requires a view call.

MERGED_COUNT=0
SKIPPED_COUNT=0
SKIPPED_LINES=()

# Banned title patterns (case-insensitive). Each is its own grep so we
# can give a useful skip reason. Order matters: most-specific first.
title_banned_reason() {
  local title="$1"
  if printf '%s' "$title" | grep -qi 'REQUIRES_OWNER_DECISION'; then
    printf 'title contains REQUIRES_OWNER_DECISION'
    return 0
  fi
  if printf '%s' "$title" | grep -qiE '\b(DROP|REVOKE)\b'; then
    printf 'title contains DROP/REVOKE'
    return 0
  fi
  if printf '%s' "$title" | grep -qi 'destructive'; then
    printf 'title contains "destructive"'
    return 0
  fi
  return 1
}

# Iterate. `jq -c` keeps each MR on its own line as a compact object.
while IFS= read -r mr_line; do
  iid="$(printf '%s' "$mr_line" | jq -r '.iid')"
  title="$(printf '%s' "$mr_line" | jq -r '.title')"
  state="$(printf '%s' "$mr_line" | jq -r '.state')"
  draft="$(printf '%s' "$mr_line" | jq -r '.draft // .work_in_progress // false')"

  # Gate 1: state.
  if [[ "$state" != "opened" ]]; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    SKIPPED_LINES+=("!$iid  SKIP  state=$state")
    continue
  fi

  # Gate 2: draft.
  if [[ "$draft" == "true" ]]; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    SKIPPED_LINES+=("!$iid  SKIP  draft")
    continue
  fi

  # Gate 3: title banlist.
  if reason="$(title_banned_reason "$title")"; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    SKIPPED_LINES+=("!$iid  SKIP  $reason")
    continue
  fi

  # Gate 4 + 5: conflicts and pipeline. Need a `view` call for the full
  # picture on most GitLab versions.
  if ! view_json="$(glab mr view "$iid" --output json 2>/dev/null)"; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    SKIPPED_LINES+=("!$iid  SKIP  view-failed")
    continue
  fi

  has_conflicts="$(printf '%s' "$view_json" | jq -r '.has_conflicts // false')"
  description="$(printf '%s' "$view_json" | jq -r '.description // ""')"
  pipeline_status="$(printf '%s' "$view_json" | jq -r '.head_pipeline.status // .pipeline.status // "none"')"

  if [[ "$has_conflicts" == "true" ]]; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    SKIPPED_LINES+=("!$iid  SKIP  conflicts")
    continue
  fi

  # Description banlist.
  if printf '%s' "$description" | grep -qi 'REQUIRES_OWNER_DECISION'; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    SKIPPED_LINES+=("!$iid  SKIP  description contains REQUIRES_OWNER_DECISION")
    continue
  fi

  if [[ "$pipeline_status" != "success" ]]; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    SKIPPED_LINES+=("!$iid  SKIP  pipeline=$pipeline_status")
    continue
  fi

  # All gates passed.
  if [[ "$ASSUME_YES" -eq 1 ]]; then
    if glab mr merge "$iid" --squash --yes >/dev/null 2>&1; then
      MERGED_COUNT=$((MERGED_COUNT + 1))
      log_info "!$iid  MERGED  $title"
    else
      SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
      SKIPPED_LINES+=("!$iid  SKIP  glab mr merge failed")
    fi
  else
    log_info "!$iid  WOULD-MERGE  $title"
    MERGED_COUNT=$((MERGED_COUNT + 1))
  fi
done < <(printf '%s' "$MR_JSON" | jq -c '.[]')

# ── Summary ────────────────────────────────────────────────────────────

log_info ""
if [[ "$ASSUME_YES" -eq 1 ]]; then
  log_info "Summary: merged=$MERGED_COUNT skipped=$SKIPPED_COUNT"
else
  log_info "Summary (dry-run): would-merge=$MERGED_COUNT skipped=$SKIPPED_COUNT"
fi
for line in "${SKIPPED_LINES[@]:-}"; do
  [[ -z "$line" ]] && continue
  log_info "  $line"
done

exit 0
