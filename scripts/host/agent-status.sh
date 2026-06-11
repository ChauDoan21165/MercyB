#!/bin/bash
# agent-status.sh — headless lane monitor
# Lanes: pool A1-A5, factory F1-F7, one-shots w-*
# Format: LANE | artifact (age: name) | board (Nlines-ago) | proc (pid or no)
# Cron-safe: no colors/tput, absolute paths, macOS BSD stat
#
# Live copy lives at ~/agent-status.sh; this is the durability copy.

REPORTS=/Users/admin/reports
FACTORY=/Users/admin/reports/factory
BOARD=/Users/admin/agent-board.md
NOW=$(date +%s)

_age() {
  # Human age from epoch seconds
  local s=$(( NOW - $1 ))
  if   [ "$s" -lt 60 ];    then echo "<1m"
  elif [ "$s" -lt 3600 ];  then echo "$(( s/60 ))m"
  elif [ "$s" -lt 86400 ]; then echo "$(( s/3600 ))h"
  else                          echo "$(( s/86400 ))d"
  fi
}

_newest() {
  # Newest artifact (file or dir) matching prefix $1 in directory $2
  # Prints: "<epoch> <basename>"
  local pre=$1 dir=$2 best_t=0 best_f="" f t
  for f in "$dir"/${pre}-*; do
    [ -e "$f" ] || continue
    t=$(stat -f %m "$f" 2>/dev/null) || continue
    [ "$t" -gt "$best_t" ] && { best_t=$t; best_f=$(basename "$f"); }
  done
  echo "$best_t $best_f"
}

_board() {
  # Distance (in lines) from the last board mention of label $1 to end of board
  local pat=$1 total lastline
  total=$(wc -l < "$BOARD" 2>/dev/null | tr -d ' ')
  lastline=$(grep -in -E "\b${pat}\b" "$BOARD" 2>/dev/null | tail -1 | cut -d: -f1)
  if [ -z "$lastline" ]; then
    echo "never"
  else
    echo "$(( total - lastline ))lines-ago"
  fi
}

_proc() {
  # Detect any live claude/codex process whose argv references lane $1 (lowercase)
  local pre=$1 hit
  hit=$(ps aux 2>/dev/null \
    | grep -iE "(dispatch|briefs)[/-]${pre}([^a-z0-9]|\\.md|$)|/${pre}-worktree" \
    | grep -v grep \
    | awk '{print $2}' \
    | head -3 \
    | tr '\n' ',' \
    | sed 's/,$//')
  if [ -n "$hit" ]; then echo "pid=$hit"; else echo "no"; fi
}

_row() {
  local label=$1
  local pre
  pre=$(echo "$label" | tr '[:upper:]' '[:lower:]')

  # Newest artifact in flat reports dir
  local r_t r_f
  read -r r_t r_f <<< "$(_newest "$pre" "$REPORTS")"
  local best_t=${r_t:-0} best_f=${r_f:-}

  # Factory dirs also checked for F-lanes
  case "$pre" in
    f*)
      local fa_t fa_f
      read -r fa_t fa_f <<< "$(_newest "$pre" "$FACTORY")"
      [ "${fa_t:-0}" -gt "$best_t" ] && { best_t=$fa_t; best_f=$fa_f; }
      ;;
  esac

  local art
  if [ "$best_t" -gt 0 ] && [ -n "$best_f" ]; then
    art="$(_age "$best_t"): $best_f"
  else
    art="never"
  fi

  printf "%-10s | %-44s | %-18s | %s\n" \
    "$label" "$art" "$(_board "$label")" "$(_proc "$pre")"
}

echo "═══ MercyBlade Headless Lane Status $(date '+%Y-%m-%d %H:%M') ═══"
echo ""
printf "%-10s | %-44s | %-18s | %s\n" "LANE" "LAST ARTIFACT (age: name)" "BOARD" "PROC"
python3 -c "print('─'*90)"

# Pool lanes A1-A5
for i in 1 2 3 4 5; do _row "A$i"; done
echo ""

# Factory lanes F1-F7
for i in 1 2 3 4 5 6 7; do _row "F$i"; done
echo ""

# One-shot w-* lanes (enumerate dynamically from reports)
W_LANES=$(find "$REPORTS" -maxdepth 1 -name 'w-*' 2>/dev/null \
  | xargs -I{} basename {} 2>/dev/null \
  | sed 's/-[0-9][0-9][0-9][0-9]\.[a-zA-Z]*$//' \
  | sed 's/\.[a-zA-Z]*$//' \
  | sort -u)

if [ -n "$W_LANES" ]; then
  while IFS= read -r wlane; do
    [ -n "$wlane" ] && _row "$wlane"
  done <<< "$W_LANES"
  echo ""
fi

printf 'Board: %s lines | Reports: %s files | Factory: %s entries\n' \
  "$(wc -l < "$BOARD" 2>/dev/null | tr -d ' ')" \
  "$(ls "$REPORTS" 2>/dev/null | wc -l | tr -d ' ')" \
  "$(ls "$FACTORY" 2>/dev/null | wc -l | tr -d ' ')"
