#!/usr/bin/env bash
#
# synth-now.sh — fire an on-demand prod synthetic-learner run, right now.
#
# One command, no GitLab UI. Plays the "Synthetic learner" pipeline schedule
# (id 4336200) via the API, which fires IMMEDIATELY (bypassing the ~hourly
# schedule-worker cadence), then prints the resulting pipeline URL. Repeatable
# as often as you like.
#
#   • Runs the FULL synthetic suite (journeys a–f) against PROD
#     (PROD_SYNTH_BASE_URL, default https://mercyblade.com).
#   • The synthetic job is pinned to the mac-c2 runner (tags: [local, mac-c2]),
#     so it always lands on Chau's always-on Air.
#
# Token: NOT hardcoded. Uses, in order:
#   1. glab's stored auth if you've run `glab auth login` (recommended — nothing to manage)
#   2. $MERCYB_SYNTH_TOKEN env var
#   3. macOS keychain item `mercyb-synth-token`
#      add once with:
#        security add-generic-password -s mercyb-synth-token -a "$USER" -w <TOKEN>
#      (token needs `api` scope; a project access token on cd12536/mercyB is enough)
#
# Usage:  bash scripts/synth-now.sh
# Alias:  alias synth-now='bash ~/MercyB/scripts/synth-now.sh'   # then just: synth-now
set -euo pipefail

PROJECT_ENC="cd12536%2FmercyB"
SCHEDULE_ID=4336200
API="https://gitlab.com/api/v4"

newest_schedule_pipeline_url() {
  # $1 = fetch command prefix that emits the pipelines JSON on stdout
  "$@" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d[0]["web_url"] if d else "")'
}

if command -v glab >/dev/null 2>&1 && glab auth status >/dev/null 2>&1; then
  glab api --method POST "projects/${PROJECT_ENC}/pipeline_schedules/${SCHEDULE_ID}/play" >/dev/null
  sleep 3
  URL=$(newest_schedule_pipeline_url glab api "projects/${PROJECT_ENC}/pipelines?source=schedule&per_page=1")
else
  TOKEN="${MERCYB_SYNTH_TOKEN:-$(security find-generic-password -s mercyb-synth-token -w 2>/dev/null || true)}"
  if [ -z "${TOKEN}" ]; then
    echo "synth-now: no credential found." >&2
    echo "  Fix ONE of these, then rerun:" >&2
    echo "    • glab auth login            (easiest)" >&2
    echo "    • export MERCYB_SYNTH_TOKEN=<token with api scope>" >&2
    echo "    • security add-generic-password -s mercyb-synth-token -a \"\$USER\" -w <token>" >&2
    exit 1
  fi
  curl -fsS -X POST -H "PRIVATE-TOKEN: ${TOKEN}" \
    "${API}/projects/${PROJECT_ENC}/pipeline_schedules/${SCHEDULE_ID}/play" >/dev/null
  sleep 3
  URL=$(newest_schedule_pipeline_url curl -fsS -H "PRIVATE-TOKEN: ${TOKEN}" \
    "${API}/projects/${PROJECT_ENC}/pipelines?source=schedule&per_page=1")
fi

echo "🟢 Synthetic run fired against prod (mercyblade.com), synthetic job pinned to mac-c2."
if [ -n "${URL:-}" ]; then
  echo "   Pipeline: ${URL}"
  echo "   (synthetic result lands in ~2–3 min under the 'verify' stage → prod-synthetic-learner)"
else
  echo "   Pipeline created — open Project → Build → Pipeline schedules → 'Synthetic learner' to watch it."
fi
