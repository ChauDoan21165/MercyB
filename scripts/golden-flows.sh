#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE_URL="${GOLDEN_FLOW_BASE_URL:-https://mercyblade.com}"

# Anon key — explicit GOLDEN_FLOW_ANON_KEY wins; otherwise reuse the build var.
# The anon key is public (ships in the browser bundle) so either storage is safe.
# If VITE_SUPABASE_ANON_KEY is already a CI variable (it is used by the build),
# no separate GOLDEN_FLOW_ANON_KEY is required.
GOLDEN_FLOW_ANON_KEY="${GOLDEN_FLOW_ANON_KEY:-${VITE_SUPABASE_ANON_KEY:-}}"

readonly _GF_AUTH_ENDPOINT="https://buemdfxyhxunzpgdoqin.supabase.co/auth/v1/token?grant_type=password"

# _mint_jwt <role> <email> <password>
# Mints a fresh Supabase access token via the password grant.
# Prints the token to stdout. On any failure exits 2 with HTTP status only —
# never echoes the password or the token to logs.
# { set +x; } suppresses xtrace (bash -x) around credential operations.
_mint_jwt() {
  local role="$1" email="$2" password="$3"
  { set +x; } 2>/dev/null

  if [[ -z "$GOLDEN_FLOW_ANON_KEY" ]]; then
    printf 'golden-flows: cannot mint %s JWT — GOLDEN_FLOW_ANON_KEY (or VITE_SUPABASE_ANON_KEY) is not set\n' "$role" >&2
    exit 2
  fi

  local tmpfile http_code token
  tmpfile=$(mktemp)
  # -o writes response body to tmpfile; -w emits only the HTTP status code
  http_code=$(curl -s -o "$tmpfile" -w "%{http_code}" \
    -X POST "$_GF_AUTH_ENDPOINT" \
    -H "apikey: $GOLDEN_FLOW_ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$password\"}")

  if [[ "$http_code" != "200" ]]; then
    rm -f "$tmpfile"
    printf 'golden-flows: failed to mint %s JWT — HTTP %s\n' "$role" "$http_code" >&2
    exit 2
  fi

  token=$(python3 -c "import json; d=json.load(open('$tmpfile')); print(d.get('access_token',''), end='')" 2>/dev/null || true)
  rm -f "$tmpfile"

  if [[ -z "$token" ]]; then
    printf 'golden-flows: failed to parse access_token for %s\n' "$role" >&2
    exit 2
  fi

  printf '%s' "$token"
}

# ── Resolve GOLDEN_FLOW_PREMIUM_JWT ─────────────────────────────────────────
# Priority: explicit *_JWT override → mint from email+password → exit 2
if [[ -n "${GOLDEN_FLOW_PREMIUM_JWT:-}" ]]; then
  : # override already set — use as-is (manual escape hatch / fast local run)
elif [[ -n "${GOLDEN_FLOW_PREMIUM_EMAIL:-}" && -n "${GOLDEN_FLOW_PREMIUM_PASSWORD:-}" ]]; then
  { set +x; } 2>/dev/null
  GOLDEN_FLOW_PREMIUM_JWT=$(_mint_jwt "premium" "$GOLDEN_FLOW_PREMIUM_EMAIL" "$GOLDEN_FLOW_PREMIUM_PASSWORD")
  printf 'golden-flows: minted premium JWT\n' >&2
elif [[ "${GOLDEN_FLOW_ALLOW_MISSING_SECRETS:-}" != "1" ]]; then
  printf 'golden-flows: missing GOLDEN_FLOW_PREMIUM_JWT (or GOLDEN_FLOW_PREMIUM_EMAIL + GOLDEN_FLOW_PREMIUM_PASSWORD)\n' >&2
  printf 'Set masked CI vars before deploy verification. For dry-run only: GOLDEN_FLOW_ALLOW_MISSING_SECRETS=1.\n' >&2
  exit 2
fi
export GOLDEN_FLOW_PREMIUM_JWT="${GOLDEN_FLOW_PREMIUM_JWT:-}"

# ── Resolve GOLDEN_FLOW_FREE_JWT ─────────────────────────────────────────────
if [[ -n "${GOLDEN_FLOW_FREE_JWT:-}" ]]; then
  : # override already set
elif [[ -n "${GOLDEN_FLOW_FREE_EMAIL:-}" && -n "${GOLDEN_FLOW_FREE_PASSWORD:-}" ]]; then
  { set +x; } 2>/dev/null
  GOLDEN_FLOW_FREE_JWT=$(_mint_jwt "free" "$GOLDEN_FLOW_FREE_EMAIL" "$GOLDEN_FLOW_FREE_PASSWORD")
  printf 'golden-flows: minted free JWT\n' >&2
elif [[ "${GOLDEN_FLOW_ALLOW_MISSING_SECRETS:-}" != "1" ]]; then
  printf 'golden-flows: missing GOLDEN_FLOW_FREE_JWT (or GOLDEN_FLOW_FREE_EMAIL + GOLDEN_FLOW_FREE_PASSWORD)\n' >&2
  printf 'Set masked CI vars before deploy verification. For dry-run only: GOLDEN_FLOW_ALLOW_MISSING_SECRETS=1.\n' >&2
  exit 2
fi
export GOLDEN_FLOW_FREE_JWT="${GOLDEN_FLOW_FREE_JWT:-}"

# ── DRY_MINT mode — shape-test escape hatch; skips playwright ───────────────
if [[ "${GOLDEN_FLOW_DRY_MINT:-}" == "1" ]]; then
  printf 'golden-flows: dry-mint complete\n'
  exit 0
fi

cd "$ROOT"

GOLDEN_FLOW_BASE_URL="$BASE_URL" \
  npx playwright test -c playwright.golden-flows.config.ts "$@"
