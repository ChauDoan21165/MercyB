#!/usr/bin/env bash
#
# fleet-now.sh - summon the MercyBlade robot fleet on demand.
#
# Requirements: glab, curl, and the public Supabase anon key in env or .env*.
# No service_role key is read. R2 defaults to selftest; pass --send for a real
# scan that may alert.
set -euo pipefail

PROJECT_ENC="cd12536%2FmercyB"
SYNTHETIC_SCHEDULE_ID=4336200
PROJECT_REF="buemdfxyhxunzpgdoqin"
DEFAULT_SUPABASE_URL="https://${PROJECT_REF}.supabase.co"
GITLAB_API="https://gitlab.com/api/v4"
OWNER_TOKEN_MESSAGE="R0/R3: needs owner token (GITLAB_TOKEN) - bot identity cannot start pipelines on protected main"

R2_SEND=0
for arg in "$@"; do
  case "$arg" in
    --send)
      R2_SEND=1
      ;;
    --selftest)
      R2_SEND=0
      ;;
    -h|--help)
      cat <<'USAGE'
Usage: bash scripts/fleet-now.sh [--send]

Triggers:
  R0  prod-synthetic-learner schedule now
  R3  prod explorer pipeline on main, when R3 is present on main
  R2  r2-logwatch selftest by default; --send performs a real scan+alert
  R1  passive status only
USAGE
      exit 0
      ;;
    *)
      echo "fleet-now: unknown argument: $arg" >&2
      echo "usage: bash scripts/fleet-now.sh [--send]" >&2
      exit 2
      ;;
  esac
done

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "fleet-now: missing required command: $1" >&2
    exit 1
  fi
}

read_env_value() {
  # $1 = env var name. Uses current environment first, then local .env files.
  local key="$1"
  local value="${!key:-}"
  local file line
  if [ -n "$value" ]; then
    printf '%s\n' "$value"
    return 0
  fi
  for file in .env.local .env.production.local .env.production .env; do
    [ -f "$file" ] || continue
    line="$(grep -E "^[[:space:]]*(export[[:space:]]+)?${key}=" "$file" | tail -n 1 || true)"
    [ -n "$line" ] || continue
    value="${line#*=}"
    value="${value%%#*}"
    value="${value%$'\r'}"
    value="${value#"${value%%[![:space:]]*}"}"
    value="${value%"${value##*[![:space:]]}"}"
    value="${value%\"}"
    value="${value#\"}"
    value="${value%\'}"
    value="${value#\'}"
    if [ -n "$value" ]; then
      printf '%s\n' "$value"
      return 0
    fi
  done
  return 1
}

date_to_epoch() {
  local stamp="${1%%.*}"
  stamp="${stamp%Z}"
  if date -u -j -f "%Y-%m-%dT%H:%M:%S" "$stamp" "+%s" >/dev/null 2>&1; then
    date -u -j -f "%Y-%m-%dT%H:%M:%S" "$stamp" "+%s"
    return 0
  fi
  date -u -d "$1" "+%s" 2>/dev/null
}

first_web_url() {
  sed -n 's/.*"web_url"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n 1
}

pipeline_web_url() {
  grep -o 'https://gitlab.com/[^"]*/-/pipelines/[0-9][0-9]*' | head -n 1
}

gitlab_token() {
  printf '%s' "${GITLAB_TOKEN:-${GLAB_TOKEN:-}}"
}

gitlab_get() {
  local path="$1"
  local token
  token="$(gitlab_token)"
  if [ -n "$token" ]; then
    curl -fsS -H "PRIVATE-TOKEN: ${token}" "${GITLAB_API}/${path}"
  else
    glab api "$path"
  fi
}

is_forbidden_response() {
  local status="$1"
  local body="$2"
  [ "$status" = "403" ] || grep -qi '403\|forbidden\|permission denied' "$body"
}

classify_gitlab_post() {
  local status="$1"
  local body="$2"
  if is_forbidden_response "$status" "$body"; then
    echo "needs-owner"
    return 0
  fi
  if [ "$status" != "200" ] && [ "$status" != "201" ]; then
    printf 'error: %s\n' "$(tr '\n' ' ' < "$body" | sed 's/[[:space:]]\{1,\}/ /g')"
    return 0
  fi
  echo "ok"
}

main_has_r3() {
  if git show origin/main:.gitlab-ci.yml 2>/dev/null | grep -q '^prod-r3-explorer:'; then
    return 0
  fi
  if [ "${ALLOW_LOCAL_R3:-0}" = "1" ] && grep -q '^prod-r3-explorer:' .gitlab-ci.yml 2>/dev/null; then
    return 0
  fi
  return 1
}

trigger_r0() {
  local body status token verdict
  body="$(mktemp)"
  token="$(gitlab_token)"
  if [ -n "$token" ]; then
    status="$(curl -sS -o "$body" -w '%{http_code}' -X POST \
      -H "PRIVATE-TOKEN: ${token}" \
      "${GITLAB_API}/projects/${PROJECT_ENC}/pipeline_schedules/${SYNTHETIC_SCHEDULE_ID}/play" || true)"
  else
    if glab api --method POST "projects/${PROJECT_ENC}/pipeline_schedules/${SYNTHETIC_SCHEDULE_ID}/play" >"$body" 2>&1; then
      status="200"
    else
      status="error"
    fi
  fi
  verdict="$(classify_gitlab_post "$status" "$body")"
  if [ "$verdict" != "ok" ]; then
    printf '%s\n' "$verdict"
    rm -f "$body"
    return 0
  fi
  rm -f "$body"
  sleep 3
  gitlab_get "projects/${PROJECT_ENC}/pipelines?source=schedule&per_page=1" | pipeline_web_url
}

trigger_r3() {
  local body status token verdict
  body="$(mktemp)"
  token="$(gitlab_token)"
  if [ -n "$token" ]; then
    status="$(curl -sS -o "$body" -w '%{http_code}' -X POST \
      -H "PRIVATE-TOKEN: ${token}" \
      --form ref=main \
      --form 'variables[][key]=R3_EXPLORER_ENABLED' \
      --form 'variables[][value]=1' \
      "${GITLAB_API}/projects/${PROJECT_ENC}/pipeline" || true)"
  else
    if glab api --method POST "projects/${PROJECT_ENC}/pipeline" \
      -f ref=main \
      -f 'variables[][key]=R3_EXPLORER_ENABLED' \
      -f 'variables[][value]=1' >"$body" 2>&1; then
      status="200"
    else
      status="error"
    fi
  fi
  verdict="$(classify_gitlab_post "$status" "$body")"
  if [ "$verdict" != "ok" ]; then
    printf '%s\n' "$verdict"
    rm -f "$body"
    return 0
  fi
  pipeline_web_url < "$body"
  rm -f "$body"
}

invoke_r2() {
  local supabase_url="$1"
  local anon_key="$2"
  local url="${supabase_url%/}/functions/v1/r2-logwatch"
  if [ "$R2_SEND" -eq 0 ]; then
    url="${url}?selftest=1"
  fi
  curl -fsS "$url" \
    -H "Authorization: Bearer ${anon_key}" \
    -H "apikey: ${anon_key}"
}

r1_status() {
  local supabase_url="$1"
  local anon_key="$2"
  local tmp status
  tmp="$(mktemp)"
  status="$(curl -sS -o "$tmp" -w '%{http_code}' \
    "${supabase_url%/}/rest/v1/client_errors?select=created_at&order=created_at.desc&limit=1" \
    -H "Authorization: Bearer ${anon_key}" \
    -H "apikey: ${anon_key}" \
    -H "Accept: application/json" || true)"
  if [ "$status" = "200" ]; then
    local created created_epoch now_epoch minutes
    created="$(sed -n 's/.*"created_at"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$tmp" | head -n 1)"
    if [ -z "$created" ]; then
      echo "anon read path available; no client_errors rows returned"
    else
      created_epoch="$(date_to_epoch "$created" || true)"
      now_epoch="$(date -u "+%s")"
      if [ -n "$created_epoch" ]; then
        minutes=$(( (now_epoch - created_epoch) / 60 ))
        echo "last client_errors row age: ${minutes} min (${created})"
      else
        echo "last client_errors row: ${created}"
      fi
    fi
  else
    echo "passive, verified via R0/R3 page visits"
  fi
  rm -f "$tmp"
}

require_cmd glab
require_cmd curl

if [ -z "$(gitlab_token)" ] && ! glab auth status >/dev/null 2>&1; then
  echo "fleet-now: glab is not authenticated. Run glab auth login first." >&2
  exit 1
fi

SUPABASE_URL="${SUPABASE_URL:-${VITE_SUPABASE_URL:-}}"
if [ -z "$SUPABASE_URL" ]; then
  SUPABASE_URL="$(read_env_value VITE_SUPABASE_URL || true)"
fi
SUPABASE_URL="${SUPABASE_URL:-$DEFAULT_SUPABASE_URL}"

ANON_KEY="${SUPABASE_ANON_KEY:-${VITE_SUPABASE_ANON_KEY:-}}"
if [ -z "$ANON_KEY" ]; then
  ANON_KEY="$(read_env_value VITE_SUPABASE_ANON_KEY || read_env_value SUPABASE_ANON_KEY || true)"
fi

R0_URL="$(trigger_r0)"
if [ "$R0_URL" = "needs-owner" ]; then
  R0_STATUS="skipped"
  R0_URL="$OWNER_TOKEN_MESSAGE"
elif [[ "$R0_URL" == error:* ]]; then
  R0_STATUS="skipped"
else
  R0_STATUS="triggered"
fi

if main_has_r3; then
  R3_URL="$(trigger_r3)"
  if [ "$R3_URL" = "needs-owner" ]; then
    R3_STATUS="skipped"
    R3_URL="$OWNER_TOKEN_MESSAGE"
  elif [[ "$R3_URL" == error:* ]]; then
    R3_STATUS="skipped"
  else
    R3_STATUS="triggered"
  fi
else
  R3_STATUS="skipped"
  R3_URL="R3 not on main yet"
fi

R2_URL="${SUPABASE_URL%/}/functions/v1/r2-logwatch"
if [ "$R2_SEND" -eq 0 ]; then
  R2_URL="${R2_URL}?selftest=1"
fi
if [ -n "$ANON_KEY" ]; then
  R2_STATUS="selftest"
  if [ "$R2_SEND" -eq 1 ]; then
    R2_STATUS="sent"
  fi
  R2_BODY="$(invoke_r2 "$SUPABASE_URL" "$ANON_KEY" || echo "error: r2-logwatch invoke failed")"
else
  R2_STATUS="skipped"
  R2_BODY="missing anon key; set VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY"
fi

if [ -n "$ANON_KEY" ]; then
  R1_STATUS="$(r1_status "$SUPABASE_URL" "$ANON_KEY")"
else
  R1_STATUS="passive, verified via R0/R3 page visits"
fi

cat <<SUMMARY

MercyBlade robot fleet run

R0 synthetic learner:
  status: ${R0_STATUS}
  run: ${R0_URL:-Project -> Build -> Pipeline schedules -> Synthetic learner}
  results: prod-synthetic-learner artifact, alert email on failure

R3 explorer:
  status: ${R3_STATUS}
  run: ${R3_URL}
  results: reports/prod-r3-explorer/latest.md artifact, Dispatcher/direct email on failure

R2 logwatch:
  status: ${R2_STATUS}
  run: ${R2_URL}
  results: ${R2_BODY}

R1 client-error-alert:
  status: ${R1_STATUS}
  run: passive pg_cron scanner, no on-demand trigger
  results: client_error_alert_history plus alert email when the scheduled scan fires
SUMMARY
