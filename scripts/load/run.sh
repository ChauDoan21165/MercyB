#!/usr/bin/env bash
# ==============================================================================
# MercyBlade k6 load-test runner
# ==============================================================================
#
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# WARNING: NEVER point --target at mercyblade.com, app.mercyblade.com, or ANY
# production / staging URL without EXPLICIT written approval from Chau.
# 500 VUs against prod WILL degrade real users and may exhaust Netlify's
# concurrent-connection quota.  You have been warned.
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#
# DEFAULT target: http://localhost:4173  (npm run preview — local build)
#
# Usage:
#   ./scripts/load/run.sh                         # all scripts vs localhost:4173
#   ./scripts/load/run.sh --target http://localhost:3107  # Vite dev server
#   ./scripts/load/run.sh --script static-rooms   # one script only
#   ./scripts/load/run.sh --target http://staging.example.com --script api-probes
#
# Options:
#   --target URL    Base URL to test (default: http://localhost:4173)
#   --script NAME   Run only this script (static-rooms | api-probes | spa-shell)
#   --dry-run       Print the k6 commands without executing them
#   -h, --help      Show this message
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── defaults ──────────────────────────────────────────────────────────────────
TARGET="http://localhost:4173"
ONLY_SCRIPT=""
DRY_RUN=false

# ── argument parsing ──────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)   TARGET="$2"; shift 2 ;;
    --script)   ONLY_SCRIPT="$2"; shift 2 ;;
    --dry-run)  DRY_RUN=true; shift ;;
    -h|--help)
      sed -n '3,40p' "${BASH_SOURCE[0]}"
      exit 0
      ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

# ── prod-guard ─────────────────────────────────────────────────────────────────
if echo "$TARGET" | grep -qiE '(mercyblade\.com|netlify\.app|vercel\.app)'; then
  echo ""
  echo "  ╔══════════════════════════════════════════════════════════════════╗"
  echo "  ║  BLOCKED: target looks like a production/staging URL.           ║"
  echo "  ║  Target: $TARGET"
  echo "  ║  Get explicit approval from Chau before load-testing non-local. ║"
  echo "  ╚══════════════════════════════════════════════════════════════════╝"
  echo ""
  exit 1
fi

# ── k6 detection ──────────────────────────────────────────────────────────────
K6_CMD=""
if command -v k6 &>/dev/null; then
  K6_CMD="k6"
elif command -v docker &>/dev/null; then
  K6_CMD="docker run --rm --network=host -v \"${SCRIPT_DIR}:/scripts\" grafana/k6"
  # Rewrite SCRIPT_DIR for docker paths
  SCRIPT_DIR="/scripts"
  echo "INFO: k6 not found locally — using Docker (grafana/k6)"
else
  echo ""
  echo "ERROR: neither k6 nor docker found."
  echo "  Install k6:    brew install k6  (macOS)  or  https://k6.io/docs/get-started/installation/"
  echo "  Install Docker: https://docs.docker.com/get-docker/"
  echo ""
  exit 1
fi

# ── helper ────────────────────────────────────────────────────────────────────
run_script() {
  local name="$1"
  local file="${SCRIPT_DIR}/${name}.js"
  local out_dir="./reports/load"
  local ts; ts="$(date +%Y%m%dT%H%M%S)"
  local summary="${out_dir}/${name}-${ts}.json"

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Script  : ${name}.js"
  echo "  Target  : ${TARGET}"
  echo "  Output  : ${summary}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  local cmd="${K6_CMD} run \
    -e BASE_URL=${TARGET} \
    --summary-export=${summary} \
    ${file}"

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run] $cmd"
    return
  fi

  mkdir -p "$out_dir"
  eval "$cmd"
}

# ── main ──────────────────────────────────────────────────────────────────────
echo ""
echo "MercyBlade k6 load-test runner"
echo "Target: ${TARGET}"
echo ""

if [[ -n "$ONLY_SCRIPT" ]]; then
  run_script "$ONLY_SCRIPT"
else
  run_script "static-rooms"
  run_script "api-probes"
  run_script "spa-shell"
fi

echo ""
echo "Done. Reports written to ./reports/load/"
echo "Tip: open any .json in k6's web dashboard or read docs/load/README.md for interpretation."
