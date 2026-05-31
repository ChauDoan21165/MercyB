#!/bin/sh
# Pause the local Mac CI runner intentionally.
#
# Creates the marker file that ci-runner-healthcheck.sh checks first: while the
# marker exists, the monitor exits silently instead of firing "Docker daemon
# down" / "gitlab-runner not started" false alarms. Use this when the cloud
# GitLab runners are primary and the local Mac runner is deliberately stopped.
#
# Resume with scripts/resume-runner-monitor.sh.
set -eu

# Mirror the monitor's defaults; both honour the same env overrides for testing.
PAUSE_MARKER="${MERCYB_RUNNER_PAUSE_MARKER:-$HOME/.mercyb-runner-paused}"
BREW_BIN="${MERCYB_BREW_BIN:-/opt/homebrew/bin/brew}"

touch "$PAUSE_MARKER"
echo "Created pause marker: $PAUSE_MARKER"
echo "ci-runner-healthcheck.sh will now stay silent."

if [ -x "$BREW_BIN" ]; then
  "$BREW_BIN" services stop gitlab-runner
  echo "Stopped gitlab-runner via brew services."
else
  echo "brew not found at $BREW_BIN; skipped stopping gitlab-runner (marker still set)."
fi
