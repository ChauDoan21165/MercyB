#!/bin/bash
# ci-disk-clean.sh — DISK GUARD ROUND 3
# Runs */5 via crontab; extended 2026-06-11: agent-*/f[0-9]*-* patterns,
# .mb-keep skip, API-terminal build-dir check, freed-GB log.

PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin
LOGFILE=~/Library/Logs/mercyb-ci-disk-clean.log
TERMINAL_RE='^(success|failed|canceled|skipped)$'

# Snapshot free space before cleanup (kibibytes)
START_FREE=$(df -k /Users/admin | awk 'NR==2 {print $4}')

# --- 1. Build dirs: API-terminal check, 60-min mtime fallback ---
if [ -d ~/gitlab-runner-builds ]; then
  for build_dir in ~/gitlab-runner-builds/*/; do
    [ -d "$build_dir" ] || continue
    build_id=$(basename "$build_dir")
    pipe_status=$(glab api "projects/cd12536%2FmercyB/pipelines/${build_id}" 2>/dev/null \
      | /usr/bin/python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('status',''))" 2>/dev/null)
    if echo "$pipe_status" | grep -qE "$TERMINAL_RE"; then
      rm -rf "$build_dir"
    elif [ -z "$pipe_status" ]; then
      # API unavailable — fall back to 60-min mtime
      find "$build_dir" -maxdepth 0 -mmin +60 -exec rm -rf {} + 2>/dev/null
    fi
    # Non-terminal (running/pending/…): leave alone
  done
fi

# --- 2. Tmp worktree / agent dir cleanup (all patterns, skip .mb-keep) ---
cleanup_tmp() {
  local pattern="$1"
  local mmin="$2"
  find /private/tmp -maxdepth 1 -type d -name "$pattern" -mmin "+${mmin}" | while IFS= read -r d; do
    [ -f "$d/.mb-keep" ] && continue
    rm -rf "$d"
  done
}

cleanup_tmp "mercyb-*"   120
cleanup_tmp "mercyB-*"   120
cleanup_tmp "a[0-9]*-*"  120
cleanup_tmp "ceo[0-9]*-*" 120
cleanup_tmp "agent-*"    120
cleanup_tmp "f[0-9]*-*"  120

# --- 3. Log freed GB ---
END_FREE=$(df -k /Users/admin | awk 'NR==2 {print $4}')
FREED_KB=$(( END_FREE - START_FREE ))
FREED_GB=$(echo "$FREED_KB" | awk '{printf "%.2f", $1 / 1048576}')
DISK_FREE_GB=$(echo "$END_FREE" | awk '{printf "%.1f", $1 / 1048576}')
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
echo "[$TIMESTAMP] ci-disk-clean: freed ${FREED_GB} GB  (disk free now: ${DISK_FREE_GB} GB)" | tee -a "$LOGFILE"
