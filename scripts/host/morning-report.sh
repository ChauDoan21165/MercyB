#!/usr/bin/env bash
# MercyBlade daily morning report — cron: 06:00 daily.
# Writes /Users/admin/morning-report.txt (overwrite) and appends a dated copy
# to /Users/admin/reports/morning/morning-report-YYYY-MM-DD.txt.
export PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

set -uo pipefail

REPORT_FILE=/Users/admin/morning-report.txt
DATED_DIR=/Users/admin/reports/morning
DISK_LAST="${DATED_DIR}/.disk-last"
BOARD=/Users/admin/agent-board.md
FACTORY_DIR=/Users/admin/reports/factory
TODAY=$(date +%Y-%m-%d)
DATED_COPY="${DATED_DIR}/morning-report-${TODAY}.txt"

mkdir -p "${DATED_DIR}"

TMPFILE=$(mktemp /tmp/morning-report-XXXXXX.txt)
trap 'rm -f "${TMPFILE}"' EXIT

{
  echo "=== MercyBlade Morning Report $(date) ==="

  # ── 1. Disk Free ──────────────────────────────────────────────────────────
  echo ""
  echo "--- Disk Free ---"
  _kb=$(df -k / | awk 'NR==2 {print $4}')
  _gb=$(awk "BEGIN {printf \"%.1f\", ${_kb}/1048576}")
  if [[ -f "${DISK_LAST}" ]]; then
    _prev=$(cat "${DISK_LAST}" 2>/dev/null || echo "")
    if [[ -n "${_prev}" ]]; then
      _delta=$(awk "BEGIN {d=${_gb}-${_prev}; if(d>=0) printf \"+%.1f\", d; else printf \"%.1f\", d}")
      echo "Disk: ${_gb} GB free  delta: ${_delta} GB vs yesterday"
    else
      echo "Disk: ${_gb} GB free  delta: n/a (empty prior reading)"
    fi
  else
    echo "Disk: ${_gb} GB free  delta: n/a (first run)"
  fi
  printf '%s\n' "${_gb}" > "${DISK_LAST}"

  # ── 2. Worktrees (/private/tmp) ───────────────────────────────────────────
  echo ""
  echo "--- Worktrees (/private/tmp) ---"
  _found=0
  shopt -s nullglob
  for _pat in "agent-*" "f[0-9]*-*" "mercyb-*" "mercyB-*"; do
    for _dir in /private/tmp/${_pat}; do
      [[ -d "${_dir}" ]] || continue
      _sz=$(du -sh "${_dir}" 2>/dev/null | cut -f1)
      _keep=""
      [[ -f "${_dir}/.mb-keep" ]] && _keep="  [.mb-keep]"
      echo "  ${_sz}  ${_dir}${_keep}"
      _found=1
    done
  done
  shopt -u nullglob
  [[ "${_found}" -eq 0 ]] && echo "  (none found)"

  # ── 3. Merged MRs (last 24h) ──────────────────────────────────────────────
  echo ""
  echo "--- Merged MRs (last 24h) ---"
  if command -v glab >/dev/null 2>&1; then
    _since=$(date -u -v-24H +%Y-%m-%dT%H:%M:%SZ 2>/dev/null \
           || date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null \
           || echo "")
    if [[ -n "${_since}" ]]; then
      # Paginate pages 1+2 (GitLab max per_page=100; team routinely exceeds 100/day)
      _mr_p1=$(glab api \
        "projects/cd12536%2FmercyB/merge_requests?state=merged&updated_after=${_since}&per_page=100&page=1" \
        2>/dev/null || echo "[]")
      _mr_p2=$(glab api \
        "projects/cd12536%2FmercyB/merge_requests?state=merged&updated_after=${_since}&per_page=100&page=2" \
        2>/dev/null || echo "[]")
      # Merge pages and filter client-side on merged_at (updated_after is a broad net).
      _mr_filtered=$(SINCE="${_since}" python3 -c "
import os, sys, json
since = os.environ['SINCE']
p1 = json.loads(sys.argv[1])
p2 = json.loads(sys.argv[2])
combined = p1 + p2
out = [mr for mr in combined if (mr.get('merged_at') or '') >= since]
print(json.dumps(out, separators=(',', ':')))
" "${_mr_p1}" "${_mr_p2}" 2>/dev/null || printf '%s' "${_mr_p1}")
      _mr_nums=$(printf '%s\n' "${_mr_filtered}" \
        | grep -oE '"iid":[0-9]+' | awk -F: '{printf "!%s ", $2}' | sed 's/ $//' || echo "")
      _mr_count=$(printf '%s\n' "${_mr_filtered}" \
        | grep -oE '"iid":[0-9]+' | wc -l | tr -d ' ' || echo 0)
      if [[ "${_mr_count}" -gt 0 ]]; then
        echo "Merged: ${_mr_count}  ${_mr_nums}"
      else
        echo "Merged: 0"
      fi
    else
      echo "Merged: (date error)"
    fi
  else
    echo "Merged: (glab not found in PATH)"
  fi

  # ── 4. Function Scoreboard (latest CEO-1 STATUS/heartbeat) ────────────────
  echo ""
  echo "--- Function Scoreboard ---"
  if [[ -f "${BOARD}" ]]; then
    _func=$(grep -E "(FUNCTIONS:|FUNCTION SCOREBOARD)" "${BOARD}" | tail -1 || true)
    echo "${_func:-(no scoreboard found)}"
  else
    echo "(agent-board.md not found)"
  fi

  # ── 5. Escalations for Chau (latest block) ────────────────────────────────
  echo ""
  echo "--- Escalations for Chau ---"
  if [[ -f "${BOARD}" ]]; then
    _esc=$(grep "ESCALATIONS-FOR-CHAU" "${BOARD}" | tail -1 || true)
    echo "${_esc:-(none)}"
  else
    echo "(agent-board.md not found)"
  fi

  # ── 6. Factory Lanes ──────────────────────────────────────────────────────
  echo ""
  echo "--- Factory Lanes ---"
  if [[ -f "${BOARD}" ]]; then
    _fl=$(grep "FACTORY LANES" "${BOARD}" | tail -1 || true)
    echo "${_fl:-(no FACTORY LANES line found)}"
  else
    echo "(agent-board.md not found)"
  fi
  if [[ -d "${FACTORY_DIR}" ]]; then
    echo "  Lane artifacts:"
    shopt -s nullglob
    for _ld in "${FACTORY_DIR}"/f*/; do
      [[ -d "${_ld}" ]] || continue
      _lane=$(basename "${_ld}")
      _last=$(ls -t "${_ld}" 2>/dev/null | head -1 || echo "")
      if [[ -n "${_last}" ]]; then
        _mtime=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "${_ld}${_last}" 2>/dev/null || echo "?")
        echo "    ${_lane}: ${_last} (${_mtime})"
      fi
    done
    shopt -u nullglob
  fi

  echo ""
  echo "=== END ==="
} > "${TMPFILE}"

# Overwrite main report
cp "${TMPFILE}" "${REPORT_FILE}"

# Append dated copy
cat "${TMPFILE}" >> "${DATED_COPY}"

# Silent by policy: routine morning reports must not speak or play sounds.
# Emergency voice only via ~/bin/emergency-alert.sh.
