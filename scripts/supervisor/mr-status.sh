#!/usr/bin/env bash
#
# scripts/supervisor/mr-status.sh
#
# One snapshot line per open MR on this GitLab project, so the supervisor
# can see the whole queue at a glance. Designed to be the body of a
# watch-loop:
#
#   watch -n 30 scripts/supervisor/mr-status.sh
#
# Output format (pipe-delimited, sorted by MR number descending):
#
#   !1234 | cd12536 | feat(supervisor): add merge-clean and mr-status…  | ready
#   !1233 | a47-agent | docs: post-migration realignment                  | draft
#   !1230 | c7-agent | chore: rotate webhook secrets                      | conflicts
#
# Status values (priority-ordered, first match wins):
#   draft               draft / WIP
#   conflicts           has_conflicts=true
#   pipeline-failing    head pipeline is failed/canceled
#   pipeline-running    head pipeline is running/pending/created
#   no-pipeline         no pipeline attached
#   ready               pipeline=success, no conflicts, not draft
#
# Why pipe-delimited and not JSON: this exists for human eyes inside a
# `watch` window. JSON in a watch window is unreadable; piping into
# `column -t` would lose readability on long titles. Pipe-delimited is
# scannable and ugly, which is the right tradeoff for an ops one-liner.
#
# Usage:
#   scripts/supervisor/mr-status.sh [--help]
#
# Exit codes:
#   0   ok (printed status; empty output if no open MRs)
#   1   bad flag
#   2   missing required command
#   3   glab API failure

set -euo pipefail

# ── Helpers ────────────────────────────────────────────────────────────

log_err() {
  printf >&2 'ERROR [mr-status] %s\n' "$1"
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

# ── Preflight ──────────────────────────────────────────────────────────

require_cmd glab
require_cmd jq

# ── Fetch ──────────────────────────────────────────────────────────────

if ! MR_JSON="$(glab mr list --output json 2>/dev/null)"; then
  log_err "glab mr list failed; is glab authenticated for this project?"
  exit 3
fi

MR_COUNT="$(printf '%s' "$MR_JSON" | jq 'length')"
if [[ "$MR_COUNT" == "0" ]]; then
  # No MRs == no output. Useful for watch-loops: silence == quiet queue.
  exit 0
fi

# ── Classify ───────────────────────────────────────────────────────────
#
# We avoid a per-MR `glab mr view` call here unless absolutely necessary
# — `mr list --output json` already returns title, author, draft, and
# state on a single round-trip. The list response does NOT always carry
# pipeline status or conflicts on every GitLab version, so we make ONE
# extra view-call per MR to enrich. For a 30-second watch loop with N≤30
# MRs this is fine; if it ever gets slow, we can drop the view-call and
# downgrade to a "state-only" mode behind a flag.

LINES=()

while IFS= read -r mr_line; do
  iid="$(printf '%s' "$mr_line" | jq -r '.iid')"
  title="$(printf '%s' "$mr_line" | jq -r '.title')"
  author="$(printf '%s' "$mr_line" | jq -r '.author.username // "unknown"')"
  draft="$(printf '%s' "$mr_line" | jq -r '.draft // .work_in_progress // false')"

  # Trim title to 60 chars + ellipsis if longer. Awk handles the count
  # in code-points well enough for our ascii-dominant titles.
  trimmed_title="$(printf '%s' "$title" | awk '{ if (length($0) > 60) print substr($0, 1, 59) "…"; else print $0 }')"

  state_label=""

  if [[ "$draft" == "true" ]]; then
    state_label="draft"
  else
    # Enrich with conflicts + pipeline via view.
    if view_json="$(glab mr view "$iid" --output json 2>/dev/null)"; then
      has_conflicts="$(printf '%s' "$view_json" | jq -r '.has_conflicts // false')"
      pipeline_status="$(printf '%s' "$view_json" | jq -r '.head_pipeline.status // .pipeline.status // "none"')"

      if [[ "$has_conflicts" == "true" ]]; then
        state_label="conflicts"
      else
        case "$pipeline_status" in
          success)
            state_label="ready"
            ;;
          failed|canceled)
            state_label="pipeline-failing"
            ;;
          running|pending|created|preparing|waiting_for_resource)
            state_label="pipeline-running"
            ;;
          none|"")
            state_label="no-pipeline"
            ;;
          *)
            state_label="pipeline-$pipeline_status"
            ;;
        esac
      fi
    else
      state_label="view-failed"
    fi
  fi

  # Tab between iid and trimmed_title lets `sort -k1` sort numerically
  # by !-number. We sort below with a custom key.
  LINES+=("$iid|$author|$trimmed_title|$state_label")
done < <(printf '%s' "$MR_JSON" | jq -c '.[]')

# ── Sort descending by MR number + format ──────────────────────────────

printf '%s\n' "${LINES[@]}" \
  | sort -t '|' -k1,1 -nr \
  | awk -F '|' '{ printf "!%s | %s | %s | %s\n", $1, $2, $3, $4 }'

exit 0
