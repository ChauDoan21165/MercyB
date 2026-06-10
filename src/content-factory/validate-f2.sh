#!/usr/bin/env bash
# F2 Content Factory — local validation script.
# Zero runtime dependencies: pure file checks, no node, no CI, no API.
# Usage: bash src/content-factory/validate-f2.sh
set -euo pipefail

FACTORY_DIR="$(cd "$(dirname "$0")" && pwd)"
PASS=0
FAIL=0

ok()  { echo "  ✓ $1"; ((PASS+=1)); }
fail(){ echo "  ✗ $1"; ((FAIL+=1)); }

check_file() {
  local file="$1"
  local desc="$2"
  if [[ -f "$file" ]]; then
    ok "File exists: $desc"
  else
    fail "Missing file: $desc ($file)"
    return
  fi

  # Valid JSON
  if python3 -c "import json,sys; json.load(open('$file'))" 2>/dev/null; then
    ok "Valid JSON: $desc"
  else
    fail "Invalid JSON: $desc"
    return
  fi
}

check_diacritics() {
  local file="$1"
  local desc="$2"
  # Vietnamese diacritics: check that common Vietnamese chars are present
  # (confirms the file isn't accidentally ASCII-stripped)
  if grep -Pq '[àáâãèéêìíòóôõùúăđơưýàáâãèéêìíòóôõùúăđơư]' "$file" 2>/dev/null || \
     python3 -c "
import sys
text = open('$file', encoding='utf-8').read()
vn_chars = set('àáâãèéêìíòóôõùúăđơưýÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐƠƯÝ')
found = any(c in vn_chars for c in text)
sys.exit(0 if found else 1)
" 2>/dev/null; then
    ok "Vietnamese diacritics present: $desc"
  else
    fail "No Vietnamese diacritics found: $desc"
  fi
}

check_no_engine_imports() {
  local file="$1"
  local desc="$2"
  # Ensure no TypeScript import paths (would indicate engine coupling)
  if grep -q "^import\|^export\|from '\.\." "$file" 2>/dev/null; then
    fail "Engine coupling detected (import/export found): $desc"
  else
    ok "No engine imports: $desc"
  fi
}

check_review_status() {
  local file="$1"
  local desc="$2"
  if python3 -c "
import json, sys
data = json.load(open('$file'))
status = data.get('status', '')
valid = ['review_queue_not_wired', 'review_queue_needs_chau']
sys.exit(0 if status in valid else 1)
" 2>/dev/null; then
    ok "Review status set (not wired): $desc"
  else
    fail "Missing or invalid review status: $desc"
  fi
}

count_items() {
  local file="$1"
  local key="$2"
  local min="$3"
  local desc="$4"
  count=$(python3 -c "
import json, sys
data = json.load(open('$file'))
items = data.get('$key', [])
print(len(items))
" 2>/dev/null || echo "0")
  if [[ "$count" -ge "$min" ]]; then
    ok "$desc has ${count} items (min $min)"
  else
    fail "$desc has only ${count} items (need >= $min)"
  fi
}

echo ""
echo "=== F2 Content Factory Validation ==="
echo ""

# Interference taxonomy wave 1
echo "--- interference-taxonomy-wave1 ---"
F1="$FACTORY_DIR/f2-interference-taxonomy-wave1.json"
check_file "$F1" "interference-taxonomy-wave1"
check_diacritics "$F1" "interference-taxonomy-wave1"
check_no_engine_imports "$F1" "interference-taxonomy-wave1"
check_review_status "$F1" "interference-taxonomy-wave1"
count_items "$F1" "patterns" 10 "interference-taxonomy-wave1"

# Family-bridge scripts wave 1
echo ""
echo "--- family-bridge-scripts-wave1 ---"
F2="$FACTORY_DIR/f2-family-bridge-scripts-wave1.json"
check_file "$F2" "family-bridge-scripts-wave1"
check_diacritics "$F2" "family-bridge-scripts-wave1"
check_no_engine_imports "$F2" "family-bridge-scripts-wave1"
check_review_status "$F2" "family-bridge-scripts-wave1"
count_items "$F2" "scripts" 5 "family-bridge-scripts-wave1"

# Theme scenarios wave 1
echo ""
echo "--- theme-scenarios-wave1 ---"
F3="$FACTORY_DIR/f2-theme-scenarios-wave1.json"
check_file "$F3" "theme-scenarios-wave1"
check_diacritics "$F3" "theme-scenarios-wave1"
check_no_engine_imports "$F3" "theme-scenarios-wave1"
check_review_status "$F3" "theme-scenarios-wave1"
count_items "$F3" "themes" 3 "theme-scenarios-wave1"

echo ""
echo "=== Results: ${PASS} passed, ${FAIL} failed ==="
if [[ "$FAIL" -gt 0 ]]; then
  echo "FAIL"
  exit 1
else
  echo "PASS"
  exit 0
fi
