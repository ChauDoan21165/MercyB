#!/usr/bin/env bash
set -euo pipefail

EXPECTED_BRANCH="feat/a2-placement-v3-observability"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || true)"
CI_BRANCH="${GITHUB_HEAD_REF:-${GITHUB_REF_NAME:-}}"

if [ "$CURRENT_BRANCH" != "$EXPECTED_BRANCH" ] && [ "$CI_BRANCH" != "$EXPECTED_BRANCH" ]; then
  echo "Refusing to run A2 automation outside $EXPECTED_BRANCH." >&2
  echo "current_branch=${CURRENT_BRANCH:-detached}" >&2
  if [ -n "$CI_BRANCH" ]; then
    echo "ci_branch=$CI_BRANCH" >&2
  fi
  exit 1
fi
