#!/bin/sh
# Resume the local Mac CI runner after an intentional pause.
#
# Removes the marker file so ci-runner-healthcheck.sh resumes alerting on real
# Docker / gitlab-runner failures, and restarts the runner. Inverse of
# scripts/pause-runner-monitor.sh.
set -eu

# Mirror the monitor's defaults; both honour the same env overrides for testing.
PAUSE_MARKER="${MERCYB_RUNNER_PAUSE_MARKER:-$HOME/.mercyb-runner-paused}"
BREW_BIN="${MERCYB_BREW_BIN:-/opt/homebrew/bin/brew}"

if [ -f "$PAUSE_MARKER" ]; then
  rm -f "$PAUSE_MARKER"
  echo "Removed pause marker: $PAUSE_MARKER"
else
  echo "No pause marker at $PAUSE_MARKER (already resumed)."
fi
echo "ci-runner-healthcheck.sh will now alert on real failures again."

if [ -x "$BREW_BIN" ]; then
  "$BREW_BIN" services start gitlab-runner
  echo "Started gitlab-runner via brew services."
else
  echo "brew not found at $BREW_BIN; skipped starting gitlab-runner (marker cleared)."
fi
