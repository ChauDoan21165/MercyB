#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE_URL="${GOLDEN_FLOW_BASE_URL:-https://mercyblade.com}"

if [[ "${GOLDEN_FLOW_ALLOW_MISSING_SECRETS:-}" != "1" ]]; then
  missing=()
  [[ -n "${GOLDEN_FLOW_PREMIUM_JWT:-}" ]] || missing+=("GOLDEN_FLOW_PREMIUM_JWT")
  [[ -n "${GOLDEN_FLOW_FREE_JWT:-}" ]] || missing+=("GOLDEN_FLOW_FREE_JWT")

  if (( ${#missing[@]} > 0 )); then
    printf 'golden-flows: missing required env var(s): %s\n' "${missing[*]}" >&2
    printf 'Set masked prod test tokens before deploy verification. For local syntax/dry-run only, set GOLDEN_FLOW_ALLOW_MISSING_SECRETS=1.\n' >&2
    exit 2
  fi
fi

cd "$ROOT"

GOLDEN_FLOW_BASE_URL="$BASE_URL" \
  npx playwright test -c playwright.golden-flows.config.ts "$@"
