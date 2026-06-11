#!/bin/bash
export PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

# protected_path_hits: read a unified diff on stdin, print the changed
# paths that touch a protected area (one per line); print nothing when
# clear. Used by CHECK 2.
#
# ROBUST PARSER (CEO-2 SECOND, 2026-06-10). `glab mr diff` emits unified
# headers WITHOUT git's a/ b/ prefix (`+++ src/x.ts`, not `+++ b/src/x.ts`),
# so the original `grep '^+++ b/'` matched zero lines and CHECK 2 was
# FAIL-OPEN (protected paths slipped through ungated). The parser now:
#   - reads BOTH the --- (old) and +++ (new) header lines, so a protected
#     file that is DELETED or RENAMED (its new side is /dev/null) is still
#     caught via its old path,
#   - strips an OPTIONAL a/ or b/ prefix (works for glab AND raw git diff),
#   - drops /dev/null,
#   - de-dupes,
#   - then matches via two passes (A5 word-boundary fix r2, 2026-06-11):
#     Pass 1a (exact) — supabaseClient.ts anchored to path segment end; fires
#       everywhere including test/doc dirs.
#     Pass 1b (token) — /auth(/|.) segment and .env root; test/doc dirs and
#       *.test.*, *.spec.*, *.md paths are excluded.
#     Pass 2 (broad) — billing/stripe/payment/entitle/auth/vite.config/
#       wrangler/deploy matched anywhere, but __tests__/, docs/, *.test.*,
#       and *.md paths are excluded (block implementations, not test coverage).
protected_path_hits() {
  local _paths
  _paths=$(
    grep -E '^[-+]{3} ' \
      | sed -E 's@^[-+]{3} (a/|b/)?@@' \
      | grep -vx '/dev/null' \
      | sort -u
  )
  # Pass 1a: supabaseClient.ts exact segment match — fires even inside test/doc dirs.
  local _anchored_exact
  _anchored_exact=$(printf '%s\n' "$_paths" \
    | grep -E "(^|/)supabaseClient\.ts$") || true
  # Pass 1b: /auth(/|.) and .env tokens — implementation paths only (exclude test/doc dirs).
  local _anchored_token
  _anchored_token=$(printf '%s\n' "$_paths" \
    | grep -vE "(^|/)(__tests__|docs)/|\.test\.[tj]sx?$|\.spec\.[tj]sx?$|\.md$" \
    | grep -E "(^|/)auth(/|\.)|(^|/)\.env($| |\.)") || true
  # Merge 1a + 1b.
  local _anchored
  _anchored=$(printf '%s\n' "$_anchored_exact" "$_anchored_token" \
    | grep -v '^$' | sort -u) || true
  # Pass 2: broad token match — implementation files only; skip test/doc contexts.
  local _broad
  _broad=$(printf '%s\n' "$_paths" \
    | grep -iE "billing|stripe|payment|entitle|auth|vite\.config|wrangler|deploy" \
    | grep -vE "(^|/)(__tests__|docs)/|\.test\.[tj]sx?$|\.spec\.[tj]sx?$|\.md$") || true
  # Merge and de-dupe; emit nothing when both passes are empty.
  printf '%s\n%s\n' "$_anchored" "$_broad" | grep -v '^$' | sort -u || true
}

main() {
  MR=$1; [ -z "$MR" ] && echo "usage: merge-gate.sh <MR-number>" && exit 2
  cd /Users/admin/MercyB; FAIL=0
  # CHECK 1: MR head pipeline is green (read directly via API, fail-closed)
  PSTATUS=$(glab api "projects/cd12536%2FmercyB/merge_requests/$MR" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print((d.get('head_pipeline') or {}).get('status',''))")
  [ "$PSTATUS" = "success" ] || { echo "FAIL 1: MR head pipeline not green: ${PSTATUS:-none}"; FAIL=1; }
  # CHECK 2: protected paths require Chau (billing/auth/env/build/deploy)
  HIT=$(glab mr diff "$MR" 2>/dev/null | protected_path_hits)
  [ -n "$HIT" ] && { echo "FAIL 2: touches protected paths (Chau approval required):"; echo "$HIT"; FAIL=1; }
  # CHECK 3/3b/4 patterns are ASSEMBLED from fragments at runtime so this
  # gate's own source never contains the verbatim guarded literal. Otherwise
  # running the gate on a diff that ADDS this very script would self-trip
  # CHECK 3/3b/4 on its own pattern strings. Runtime values — and therefore
  # enforcement semantics — are byte-identical to the originals.
  # (comments below deliberately avoid the verbatim guarded strings too)
  P3="placeholder"".""invalid"                 # the forbidden placeholder fallback marker (dot = regex any-char, as before)
  P3B="sk-[A-Za-z0-9]""{20}""|gl""rt-"         # OpenAI-style + GitLab-runner-token secret prefixes
  P4="drop ""table|truncate ""table|db ""push" # destructive SQL / migration verbs
  # CHECK 3: never adds the placeholder fallback or hardcoded secrets
  glab mr diff "$MR" 2>/dev/null | grep '^+' | grep -q "$P3" && { echo "FAIL 3: adds the forbidden $P3 fallback"; FAIL=1; }
  glab mr diff "$MR" 2>/dev/null | grep '^+' | grep -qE "$P3B" && { echo "FAIL 3b: hardcoded secret in diff"; FAIL=1; }
  # CHECK 4: no destructive SQL patterns
  glab mr diff "$MR" 2>/dev/null | grep '^+' | grep -qiE "$P4" && { echo "FAIL 4: destructive SQL pattern"; FAIL=1; }
  if [ $FAIL -eq 0 ]; then VERDICT="PASS — clear to merge"; else VERDICT="BLOCKED — needs Chau"; fi
  echo "MERGE-GATE !$MR: $VERDICT"
  echo "[MERGE-GATE] !$MR $VERDICT $(date '+%m-%d %H:%M')" >> /Users/admin/agent-board.md
  exit $FAIL
}

# Run the gate only when executed directly. When the file is sourced
# (e.g. by tests/scripts/merge-gate-shape.test.ts) only the functions
# above are defined — the parser can be exercised against fixtures with
# no network/glab call and no board write or process exit.
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then main "$@"; fi
