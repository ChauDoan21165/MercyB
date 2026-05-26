#!/usr/bin/env bash
set -euo pipefail

# scripts/regenerate-db-types.sh
#
# Regenerate the two canonical supabase-generated TypeScript types files
# that this repo keeps in lock-step:
#
#   - src/integrations/supabase/types.ts            (browser / SPA consumer)
#   - supabase/functions/_shared/database.types.ts  (Deno edge functions)
#
# Both are produced from the same `supabase gen types typescript`
# command against the same project + schema. After every regeneration
# they MUST remain byte-identical (`diff -q` clean) — the script
# enforces this invariant and exits non-zero on drift.
#
# Project ref is read from `supabase/config.toml` (single source of
# truth). Override via PROJECT_REF env var for ad-hoc runs against a
# different project.
#
# Usage:
#   ./scripts/regenerate-db-types.sh             regenerate both files
#   ./scripts/regenerate-db-types.sh --dry-run   print actions, no writes
#   ./scripts/regenerate-db-types.sh --help      show usage and exit
#
# Prerequisites:
#   - npx supabase --version              (CLI installed)
#   - supabase login                      (one-time interactive auth)
#   - target migrations applied to prod   (otherwise types lag schema)
#
# Operator runbook: reports/OPS-database-types-regen-runbook-A8g.md
# Finding source:   PR #849 (A8g — incorrect default path in prior script)

DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --dry-run|-n)
      DRY_RUN=1
      ;;
    --help|-h)
      sed -n '/^# Usage:/,/^$/{s/^# \{0,1\}//;p;}' "$0"
      exit 0
      ;;
    *)
      printf 'error: unknown argument %q\n' "$arg" >&2
      printf 'usage: %s [--dry-run] [--help]\n' "$0" >&2
      exit 2
      ;;
  esac
done

# Resolve repo root from the script's own location so the script works
# regardless of cwd.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

CONFIG_TOML="$REPO_ROOT/supabase/config.toml"
SPA_TYPES="$REPO_ROOT/src/integrations/supabase/types.ts"
EDGE_TYPES="$REPO_ROOT/supabase/functions/_shared/database.types.ts"
SCHEMA="${SCHEMA:-public}"

# Resolve PROJECT_REF — env var wins, else parse supabase/config.toml.
if [[ -z "${PROJECT_REF:-}" ]]; then
  if [[ ! -f "$CONFIG_TOML" ]]; then
    printf 'error: %s not found and PROJECT_REF env var is unset\n' \
      "$CONFIG_TOML" >&2
    exit 2
  fi
  # Parse `project_id = "<ref>"` from config.toml. Tolerate inline
  # comments and surrounding whitespace; reject anything that doesn't
  # parse cleanly to a non-empty token.
  PROJECT_REF="$(
    awk -F'=' '
      /^[[:space:]]*project_id[[:space:]]*=/ {
        sub(/^[[:space:]]+/, "", $2)
        sub(/[[:space:]]*#.*$/, "", $2)
        gsub(/^[[:space:]]*"|"[[:space:]]*$/, "", $2)
        print $2
        exit
      }' "$CONFIG_TOML"
  )"
  if [[ -z "$PROJECT_REF" ]]; then
    printf 'error: could not parse project_id from %s\n' "$CONFIG_TOML" >&2
    exit 2
  fi
fi

# Sanity-check target directories exist (so a typo doesn't quietly write
# nothing useful). These are checked even in dry-run.
for target in "$SPA_TYPES" "$EDGE_TYPES"; do
  target_dir="$(dirname "$target")"
  if [[ ! -d "$target_dir" ]]; then
    printf 'error: target directory %q does not exist\n' "$target_dir" >&2
    exit 2
  fi
done

if (( DRY_RUN )); then
  printf '[dry-run] would regenerate (no writes):\n'
  printf '  project_ref = %s\n' "$PROJECT_REF"
  printf '  schema      = %s\n' "$SCHEMA"
  printf '  ->         %s\n' "$SPA_TYPES"
  printf '  ->         %s\n' "$EDGE_TYPES"
  printf '  verify:    diff -q (byte-identical invariant)\n'
  exit 0
fi

# Generate to temp files first; only swap into the canonical paths if
# BOTH generates succeed AND the byte-identical invariant holds. This
# prevents a partial-state regen (e.g. SPA updated, edge stale).
TMP_SPA="$(mktemp -t regen-db-types-spa.XXXXXX)"
TMP_EDGE="$(mktemp -t regen-db-types-edge.XXXXXX)"
cleanup() { rm -f "$TMP_SPA" "$TMP_EDGE"; }
trap cleanup EXIT

printf 'regenerating (1/2) for %s ...\n' "$SPA_TYPES"
npx supabase gen types typescript \
  --project-id "$PROJECT_REF" \
  --schema "$SCHEMA" \
  > "$TMP_SPA"

printf 'regenerating (2/2) for %s ...\n' "$EDGE_TYPES"
npx supabase gen types typescript \
  --project-id "$PROJECT_REF" \
  --schema "$SCHEMA" \
  > "$TMP_EDGE"

# Sanity-check the output: empty or marker-less output usually means an
# auth/network failure that didn't propagate a non-zero exit.
for tmp in "$TMP_SPA" "$TMP_EDGE"; do
  if [[ ! -s "$tmp" ]]; then
    printf 'error: gen types produced empty output for %s\n' "$tmp" >&2
    printf '       (auth failure or network error? run: supabase login)\n' >&2
    exit 4
  fi
  if ! grep -q '^export type Database' "$tmp"; then
    printf 'error: gen types output missing "export type Database" marker:\n' >&2
    printf '       %s\n' "$tmp" >&2
    exit 4
  fi
done

# Byte-identical invariant. Two consecutive runs of the same command
# against the same project should be deterministic; if they aren't, the
# CLI introduced non-determinism and we want to surface that — never
# silently commit drifting copies of generated types.
if ! diff -q "$TMP_SPA" "$TMP_EDGE" > /dev/null; then
  printf 'error: the two generated outputs differ (byte-identical invariant violated).\n' >&2
  printf '       this is non-deterministic CLI output — investigate before re-running.\n' >&2
  diff "$TMP_SPA" "$TMP_EDGE" | head -50 >&2 || true
  exit 3
fi

# Swap into the canonical paths.
mv "$TMP_SPA"  "$SPA_TYPES"
mv "$TMP_EDGE" "$EDGE_TYPES"
# Clear vars so the EXIT trap's rm -f doesn't fire on already-moved temps.
TMP_SPA=""
TMP_EDGE=""

# Final guard — defensive; should always pass after the pre-mv check.
if ! diff -q "$SPA_TYPES" "$EDGE_TYPES" > /dev/null; then
  printf 'error: post-mv byte-identical invariant violated.\n' >&2
  exit 3
fi

printf 'ok — both files regenerated and byte-identical.\n'
printf '       %s\n' "$SPA_TYPES"
printf '       %s\n' "$EDGE_TYPES"
