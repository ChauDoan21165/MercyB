#!/usr/bin/env bash
set -euo pipefail

AGENT="${1:-}"

if [ -z "$AGENT" ]; then
  echo "Usage: scripts/agents/start-agent.sh A36"
  exit 1
fi

ROOT="$HOME/MercyB"
WORKTREE="/private/tmp/agent-$AGENT"

case "$AGENT" in
  A36) BRANCH="feat/a36-grading-drift-detection" ;;
  A37) BRANCH="reports/a37-shadow-replay-readiness" ;;
  A3)  BRANCH="feat/a3-placement-v3-data-quality" ;;
  A2)  BRANCH="feat/a2-placement-v3-observability" ;;
  B1)  BRANCH="feat/b1-test-stability-burndown" ;;
  *) echo "Unknown agent: $AGENT"; exit 1 ;;
esac

cd "$ROOT"
git fetch origin

WORKTREE="$(scripts/agents/resolve-agent-worktree.sh "$AGENT" "$BRANCH")"

cd "$WORKTREE"
echo "Agent: $AGENT"
echo "Branch: $BRANCH"
echo "Worktree: $WORKTREE"
git status --short
echo
echo "Now run: codex"
