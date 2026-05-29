#!/bin/sh
set -u

PAUSE_MARKER="${MERCYB_RUNNER_PAUSE_MARKER:-$HOME/.mercyb-runner-paused}"
DOCKER_BIN="${MERCYB_DOCKER_BIN:-/usr/local/bin/docker}"
GITLAB_RUNNER_BIN="${MERCYB_GITLAB_RUNNER_BIN:-/opt/homebrew/bin/gitlab-runner}"
BREW_BIN="${MERCYB_BREW_BIN:-/opt/homebrew/bin/brew}"
OSASCRIPT_BIN="${MERCYB_OSASCRIPT_BIN:-/usr/bin/osascript}"
LOG_FILE="${MERCYB_RUNNER_HEALTH_LOG:-$HOME/Library/Logs/MercyB/ci-runner-healthcheck.log}"
NOTIFY_CMD="${MERCYB_RUNNER_NOTIFY_CMD:-}"

if [ -f "$PAUSE_MARKER" ]; then
  exit 0
fi

failures=""

add_failure() {
  if [ -z "$failures" ]; then
    failures="$1"
  else
    failures="$failures $1"
  fi
}

if ! "$DOCKER_BIN" info >/dev/null 2>&1; then
  add_failure "Docker daemon down on local runner - start Docker Desktop and retry CI."
fi

if ! "$GITLAB_RUNNER_BIN" status >/dev/null 2>&1; then
  if ! "$BREW_BIN" services list | awk '$1=="gitlab-runner" && $2=="started" {found=1} END {exit found ? 0 : 1}'; then
    add_failure "gitlab-runner service is not started."
  fi
fi

if [ -n "$failures" ]; then
  message="$failures"

  if [ -n "$NOTIFY_CMD" ]; then
    "$NOTIFY_CMD" "$message"
  else
    "$OSASCRIPT_BIN" \
      -e 'on run argv' \
      -e 'display notification (item 1 of argv) with title "MercyB CI runner health"' \
      -e 'end run' \
      "$message"
  fi

  mkdir -p "$(dirname "$LOG_FILE")"
  printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$message" >> "$LOG_FILE"
  exit 1
fi
