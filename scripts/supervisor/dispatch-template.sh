#!/usr/bin/env bash
#
# scripts/supervisor/dispatch-template.sh
#
# Print a starter dispatch brief for a given agent + objective. The
# operator pastes the output into the target agent's terminal, fills in
# the "Read first" list + the concrete deliverables, and sends.
#
# Why this exists: every dispatch brief tonight has the same boilerplate
# at the top (worktree claim, npm ci sleep, mark working) and the same
# closing block (gates, mark-idle, report). Hand-typing that header into
# each new dispatch is the cut-paste bottleneck this whole supervisor
# toolkit is trying to dissolve. This script writes the boilerplate so
# the operator only authors the parts that actually vary.
#
# Usage:
#   scripts/supervisor/dispatch-template.sh <agent> "<one-line objective>"
#
# Example:
#   scripts/supervisor/dispatch-template.sh C3 "fix the next a11y serious finding"
#
# Output goes to stdout. Pipe to `pbcopy` to drop straight onto the
# clipboard:
#
#   scripts/supervisor/dispatch-template.sh C3 "fix a11y" | pbcopy
#
# This script DOES NOT:
#   - Talk to GitLab.
#   - Read or write any state file (agent-state.json, dispatch-log.jsonl).
#   - Decide branch names or worktree paths beyond a sensible default
#     (the operator may edit before sending).
#   - Pick the agent. The agent label is a required argument and is not
#     looked up against ~/.mercyb/agent-state.json — generating a brief
#     for a "busy" agent is the operator's call (e.g. queuing the next
#     job).
#
# Exit codes:
#   0   ok (brief printed to stdout)
#   1   bad / missing argument
#   2   missing required tool (none today; reserved)

set -euo pipefail

# ── Helpers ────────────────────────────────────────────────────────────

log_err() {
  printf >&2 'ERROR [dispatch-template] %s\n' "$1"
}

usage() {
  sed -n '1,/^set -euo pipefail$/p' "$0" | sed -e 's/^# \{0,1\}//' -e '/^#!/d' -e '/^set -euo pipefail$/d'
}

# Lowercase + slugify an agent label for use in branch / worktree names.
# Keeps alphanumerics + dashes, collapses everything else to a dash.
slugify_agent() {
  local raw="$1"
  printf '%s' "$raw" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g'
}

# ── Argument parsing ───────────────────────────────────────────────────

case "${1:-}" in
  --help|-h)
    usage
    exit 0
    ;;
  "")
    log_err "missing required <agent> argument"
    printf >&2 'Usage: %s <agent> "<one-line objective>"\n' "$0"
    exit 1
    ;;
  --*)
    log_err "unknown flag: $1"
    printf >&2 'Usage: %s <agent> "<one-line objective>"\n' "$0"
    exit 1
    ;;
esac

if [[ $# -lt 2 ]]; then
  log_err "missing required <objective> argument"
  printf >&2 'Usage: %s <agent> "<one-line objective>"\n' "$0"
  exit 1
fi

AGENT="$1"
OBJECTIVE="$2"

if [[ -z "$AGENT" || -z "$OBJECTIVE" ]]; then
  log_err "agent and objective must both be non-empty"
  exit 1
fi

AGENT_SLUG="$(slugify_agent "$AGENT")"
if [[ -z "$AGENT_SLUG" ]]; then
  log_err "agent label '$AGENT' slugifies to empty; pick a label with at least one alphanumeric character"
  exit 1
fi

# ── Emit the brief ─────────────────────────────────────────────────────
#
# The brief is one continuous heredoc so the operator gets a single
# pasteable block. We do not wrap it in further structure (no JSON, no
# Markdown front-matter) because it goes straight into a terminal.

cat <<EOF
To Agent $AGENT

Prior constraints active.

Objective: $OBJECTIVE

First, clean any stale worktree on this branch name:
  for w in ~/MercyB-${AGENT_SLUG}-* ; do
    rm -f "\$w/node_modules" 2>/dev/null
  done

Worktree:
  git fetch origin
  git worktree add ~/MercyB-${AGENT_SLUG}-<task-slug> -b feat/<task-slug> origin/main
  sleep \$((RANDOM % 60)) before npm ci   # or: ln -s ~/MercyB/node_modules ~/MercyB-${AGENT_SLUG}-<task-slug>/node_modules

At the START of work:
  scripts/supervisor/agent-state.sh mark $AGENT working

Read first:
  - <fill in: file 1>
  - <fill in: file 2>

Deliverables (single MR):
  1. <fill in>
  2. <fill in>

Constraints:
  - Small diff. One MR.
  - Don't touch anything outside the listed deliverables.
  - <add task-specific constraints>

Gates (all must pass before push):
  - npm run typecheck:ci   # green
  - npm run lint           # zero NEW errors (warnings are baseline)
  - npx vitest run <new-test-file>
  - bash -n on any new shell scripts
  - shellcheck if installed

Push, glab mr create.

At the END of work, after the MR is open:
  scripts/supervisor/agent-state.sh report-done $AGENT <MR_NUMBER>

Report back with the box-banner format:
  ╔══════════════════════════════════════════════════════════╗
  ║  📋  Report from $AGENT — <one-line title>${AGENT:+}            ║
  ╚══════════════════════════════════════════════════════════╝
  Done: <few words>
  Undone: <few words + reason>
  MR: <URL>

Terminal stays open.
EOF

exit 0
