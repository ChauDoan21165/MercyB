#!/usr/bin/env bash
#
# scripts/host/restore-drill.sh
#
# Quarterly backup restore drill. Validates that the latest nightly
# GPG-encrypted pg_dump can be decrypted and restored into a SCRATCH
# Supabase project, then verifies row counts against the production
# source for the 10 biggest tables.
#
# NEVER targets production. VERIFY_RESTORE_ADMIN_DATABASE_URL must
# point to a throwaway Supabase project created solely for this drill.
# A prod-fingerprint guard is built in as a last resort.
#
# Usage:
#   VERIFY_RESTORE_ADMIN_DATABASE_URL="postgresql://postgres:<pw>@<scratch-host>:5432/postgres?sslmode=require" \
#   RCLONE_CONFIG_REMOTE="b2:mercyb-backups/prod" \
#   DRILL_SOURCE_DATABASE_URL="postgresql://postgres:<pw>@db.buemdfxyhxunzpgdoqin.supabase.co:5432/postgres?sslmode=require" \
#     scripts/host/restore-drill.sh [--dry-run] [--fast] [--dump <file>] [--keep-db]
#
# Required env:
#   VERIFY_RESTORE_ADMIN_DATABASE_URL   Admin Postgres URL on the SCRATCH
#                                        Supabase project — never prod.
#
# Optional env:
#   RCLONE_CONFIG_REMOTE                Remote path for the backup store,
#                                        e.g. "b2:mercyb-backups/prod".
#                                        Required unless --dump is passed.
#   DRILL_SOURCE_DATABASE_URL           Prod DB URL for row-count comparison.
#                                        If unset, comparison is skipped and
#                                        only restored counts are printed.
#
# Flags:
#   --dry-run     Print planned actions; no decryption, DB creation, or teardown.
#   --fast        Use pg_stat_user_tables.n_live_tup estimates instead of
#                 count(*). Requires ANALYZE to be accurate. Much faster on
#                 large tables; ~5% imprecise until autovacuum catches up.
#   --dump <f>    Use a local .dump.gpg file; skips the rclone download step.
#   --keep-db     Leave the throwaway DB on scratch for manual inspection.
#                 You must drop it yourself afterwards.
#
# Exit codes:
#   0  drill passed
#   2  missing required command
#   3  dump fetch / file error
#   4  missing required env var
#   6  restore or query failure
#   7  row-count drift > 5% on one or more tables
#   9  safety guard: admin URL looks like prod

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
VERIFY_RESTORE="$REPO_ROOT/scripts/db-backup/verify-restore.sh"

DRY_RUN="no"
FAST_MODE="no"
DUMP_FILE=""
KEEP_DB_FINAL="no"
TOP_N=10

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)       DRY_RUN="yes";            shift ;;
    --fast)          FAST_MODE="yes";           shift ;;
    --keep-db)       KEEP_DB_FINAL="yes";       shift ;;
    --dump)          DUMP_FILE="${2:-}"; shift 2 ;;
    -h|--help)       sed -n '3,46p' "$0"; exit 0 ;;
    -*)  printf >&2 'ERROR [restore-drill] unknown flag: %s\n' "$1"; exit 1 ;;
    *)   printf >&2 'ERROR [restore-drill] unexpected arg: %s\n' "$1";  exit 1 ;;
  esac
done

log_info() { printf '[restore-drill] %s\n' "$1"; }
log_err()  { printf >&2 'ERROR [restore-drill] %s\n' "$1"; }
log_step() { printf '\n[restore-drill] ── %s\n' "$1"; }

# ── Preflight ──────────────────────────────────────────────────────────

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    log_err "missing required command: $1 (install it and retry)"
    exit 2
  fi
}

ADMIN_URL="${VERIFY_RESTORE_ADMIN_DATABASE_URL:-}"
if [[ -z "$ADMIN_URL" ]]; then
  log_err "VERIFY_RESTORE_ADMIN_DATABASE_URL is not set"
  log_err "Set it to the admin Postgres URL of a SCRATCH (throwaway) Supabase project."
  exit 4
fi

REMOTE="${RCLONE_CONFIG_REMOTE:-}"
SOURCE_URL="${DRILL_SOURCE_DATABASE_URL:-}"

# Safety rail: refuse to run against the prod Supabase project.
if [[ "$ADMIN_URL" == *"buemdfxyhxunzpgdoqin"* ]]; then
  log_err "VERIFY_RESTORE_ADMIN_DATABASE_URL contains the PRODUCTION Supabase project ref."
  log_err "Create a separate throwaway Supabase project and use its URL instead."
  exit 9
fi

if [[ ! -f "$VERIFY_RESTORE" ]]; then
  log_err "verify-restore.sh not found at $VERIFY_RESTORE"
  exit 2
fi

require_cmd psql
require_cmd gpg
require_cmd pg_restore

if [[ -z "$DUMP_FILE" ]]; then
  require_cmd rclone
  if [[ -z "$REMOTE" ]]; then
    log_err "RCLONE_CONFIG_REMOTE is not set and --dump was not passed"
    log_err "Either set RCLONE_CONFIG_REMOTE or pass --dump <path/to/mercyb-<ts>-prod.dump.gpg>"
    exit 4
  fi
fi

if [[ "$DRY_RUN" != "yes" && -n "$DUMP_FILE" && ! -r "$DUMP_FILE" ]]; then
  log_err "dump file not readable: $DUMP_FILE"
  exit 3
fi

if [[ "$DRY_RUN" != "yes" ]]; then
  # Verify GPG private key is present in keyring — the dump is encrypted
  # to admin@mercyblade.com; this key must be imported from 1Password first.
  if ! gpg --list-secret-keys admin@mercyblade.com >/dev/null 2>&1; then
    log_err "GPG private key for admin@mercyblade.com not found in keyring."
    log_err "Import it from 1Password first:"
    log_err "  gpg --import mercyb-backup-priv.asc   (then rm the file)"
    exit 4
  fi
fi

# ── Identifiers for this drill run ────────────────────────────────────

DRILL_TS="$(date -u +%Y%m%d%H%M%S)"
DRILL_DB_NAME="mercyb_drill_${DRILL_TS}_$$"

redact_url() { sed -E 's#(postgres(ql)?://)[^@]+@#\1[redacted]@#'; }

target_url_for_db() {
  local admin_url="$1" db_name="$2"
  local base query prefix
  if [[ "$admin_url" == *\?* ]]; then
    query="${admin_url#*\?}"; base="${admin_url%%\?*}"
  else
    query=""; base="$admin_url"
  fi
  prefix="${base%/*}"
  if [[ -n "$query" ]]; then printf '%s/%s?%s' "$prefix" "$db_name" "$query"
  else printf '%s/%s' "$prefix" "$db_name"; fi
}

TARGET_URL="$(target_url_for_db "$ADMIN_URL" "$DRILL_DB_NAME")"
SAFE_ADMIN="$(printf '%s' "$ADMIN_URL" | redact_url)"
SAFE_TARGET="$(printf '%s' "$TARGET_URL" | redact_url)"

# ── Cleanup / teardown trap ────────────────────────────────────────────

RCLONE_TMP=""
CREATED_DB="no"

cleanup() {
  local status=$?
  if [[ "$CREATED_DB" == "yes" && "$KEEP_DB_FINAL" != "yes" ]]; then
    log_info "teardown: terminating connections and dropping $DRILL_DB_NAME …"
    psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -qAt \
      -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DRILL_DB_NAME' AND pid <> pg_backend_pid();" >/dev/null 2>&1 || true
    psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -qAt \
      -c "DROP DATABASE IF EXISTS \"$DRILL_DB_NAME\";" >/dev/null 2>&1 || true
    log_info "teardown: done — throwaway DB dropped"
  elif [[ "$CREATED_DB" == "yes" && "$KEEP_DB_FINAL" == "yes" ]]; then
    log_info "teardown: --keep-db set — $DRILL_DB_NAME kept on scratch project"
    log_info "teardown: connect: psql '$SAFE_TARGET'"
    log_info "teardown: drop when done: psql '$SAFE_ADMIN' -c 'DROP DATABASE \"$DRILL_DB_NAME\";'"
  fi
  if [[ -n "$RCLONE_TMP" && -d "$RCLONE_TMP" ]]; then
    rm -rf "$RCLONE_TMP"
  fi
  exit "$status"
}
trap cleanup EXIT

# ── Print plan ─────────────────────────────────────────────────────────

cat <<EOF

[restore-drill] ════════════════════════════════════════════════════════
[restore-drill]  BACKUP RESTORE DRILL — $(date -u +%Y-%m-%dT%H:%M:%SZ)
[restore-drill] ════════════════════════════════════════════════════════
[restore-drill]  scratch admin URL : $SAFE_ADMIN
[restore-drill]  throwaway DB      : $DRILL_DB_NAME
[restore-drill]  dump source       : ${DUMP_FILE:-rclone ($REMOTE)}
[restore-drill]  source comparison : ${SOURCE_URL:+(enabled — DRILL_SOURCE_DATABASE_URL set)}${SOURCE_URL:-(disabled — set DRILL_SOURCE_DATABASE_URL for prod comparison)}
[restore-drill]  count mode        : ${FAST_MODE/yes/fast (n_live_tup estimates after ANALYZE)}${FAST_MODE/no/exact (count(*) — slower, precise)}
[restore-drill]  dry-run           : $DRY_RUN
[restore-drill]  keep DB after     : $KEEP_DB_FINAL
[restore-drill] ════════════════════════════════════════════════════════
EOF

# ── Step 1: Fetch dump ─────────────────────────────────────────────────
log_step "Step 1/4: Fetch latest encrypted dump"

if [[ -z "$DUMP_FILE" ]]; then
  if [[ "$DRY_RUN" == "yes" ]]; then
    log_info "dry-run: would rclone lsf ${REMOTE}/daily/ and fetch newest *.dump.gpg"
    DUMP_FILE="/tmp/dry-run-mercyb-<ts>-prod.dump.gpg"
  else
    RCLONE_TMP="$(mktemp -d)"
    log_info "listing newest full dump under ${REMOTE}/daily/ …"
    NEWEST="$(
      rclone lsf --files-only "${REMOTE%/}/daily/" 2>/dev/null \
        | grep -E '\.dump\.gpg$' \
        | grep -vE '\.schema\.dump\.gpg$' \
        | sort \
        | tail -n 1
    )"
    if [[ -z "$NEWEST" ]]; then
      log_err "no full *.dump.gpg found under ${REMOTE}/daily/"
      log_err "Confirm RCLONE_CONFIG_REMOTE is correct and the nightly backup job has run at least once."
      exit 3
    fi
    log_info "fetching: $NEWEST"
    rclone copy "${REMOTE%/}/daily/$NEWEST" "$RCLONE_TMP/"
    DUMP_FILE="$RCLONE_TMP/$NEWEST"
    log_info "fetched: $DUMP_FILE ($(du -sh "$DUMP_FILE" | cut -f1))"
  fi
else
  log_info "using provided dump file: $DUMP_FILE"
fi

# ── Step 2: Restore into scratch throwaway DB ──────────────────────────
log_step "Step 2/4: Restore into scratch throwaway DB ($DRILL_DB_NAME)"

if [[ "$DRY_RUN" == "yes" ]]; then
  log_info "dry-run: would VERIFY_RESTORE_DB_NAME=$DRILL_DB_NAME"
  log_info "dry-run: would call verify-restore.sh '$DUMP_FILE' --keep-db (then run ANALYZE)"
else
  VERIFY_RESTORE_ADMIN_DATABASE_URL="$ADMIN_URL" \
  VERIFY_RESTORE_DB_NAME="$DRILL_DB_NAME" \
    "$VERIFY_RESTORE" "$DUMP_FILE" --keep-db
  CREATED_DB="yes"

  log_info "running ANALYZE on restored DB (needed for accurate pg_stat_user_tables.n_live_tup) …"
  psql "$TARGET_URL" -v ON_ERROR_STOP=1 -qAt -c "ANALYZE;" >/dev/null
  log_info "ANALYZE complete"
fi

# ── Step 3: Row-count verification for top-10 tables ──────────────────
log_step "Step 3/4: Row-count verification (top $TOP_N tables)"

# Returns top-N user tables ordered by physical size (post-restore ANALYZE).
top_tables_by_size() {
  local url="$1" n="$2"
  psql "$url" -v ON_ERROR_STOP=1 -qAt -c "
    SELECT n.nspname || '.' || c.relname
    FROM   pg_class c
    JOIN   pg_namespace n ON n.oid = c.relnamespace
    WHERE  c.relkind = 'r'
      AND  n.nspname NOT IN ('pg_catalog','information_schema','pg_toast')
      AND  n.nspname NOT LIKE 'pg_%'
    ORDER  BY pg_total_relation_size(c.oid) DESC
    LIMIT  $n;" 2>/dev/null
}

count_rows() {
  local url="$1" table="$2"
  local schema relname
  schema="${table%%.*}"; relname="${table#*.}"
  if [[ "$FAST_MODE" == "yes" ]]; then
    psql "$url" -v ON_ERROR_STOP=1 -qAt -c \
      "SELECT COALESCE(n_live_tup::bigint, -1) FROM pg_stat_user_tables
       WHERE schemaname = '$schema' AND relname = '$relname';" 2>/dev/null \
    || echo "?"
  else
    psql "$url" -v ON_ERROR_STOP=1 -qAt -c \
      "SELECT count(*) FROM \"${schema}\".\"${relname}\";" 2>/dev/null \
    || echo "?"
  fi
}

if [[ "$DRY_RUN" == "yes" ]]; then
  log_info "dry-run: would identify top $TOP_N tables from ${SOURCE_URL:+source (prod)}${SOURCE_URL:-restored DB}"
  if [[ "$FAST_MODE" == "yes" ]]; then
    log_info "dry-run: would query n_live_tup from pg_stat_user_tables (fast mode)"
  else
    log_info "dry-run: would run count(*) per table against both restored DB and source (exact mode)"
  fi
else
  # Get table list from SOURCE if available (preferred — catches tables
  # the dump might have missed), otherwise from the restored DB.
  if [[ -n "$SOURCE_URL" ]]; then
    log_info "getting top $TOP_N tables by size from source (prod) …"
    TABLE_LIST="$(top_tables_by_size "$SOURCE_URL" "$TOP_N" || true)"
  else
    log_info "DRILL_SOURCE_DATABASE_URL not set — getting top $TOP_N tables from restored DB …"
    TABLE_LIST="$(top_tables_by_size "$TARGET_URL" "$TOP_N" || true)"
  fi

  if [[ -z "$TABLE_LIST" ]]; then
    log_err "could not retrieve table list — check that VERIFY_RESTORE_ADMIN_DATABASE_URL is correct"
    exit 6
  fi

  printf '\n'
  printf '%-42s %15s %15s %12s\n' "TABLE" "RESTORED" "SOURCE" "STATUS"
  printf '%-42s %15s %15s %12s\n' \
    "$(printf '%.0s─' $(seq 1 42))" \
    "$(printf '%.0s─' $(seq 1 15))" \
    "$(printf '%.0s─' $(seq 1 15))" \
    "$(printf '%.0s─' $(seq 1 12))"

  FAIL_COUNT=0
  WARN_TABLES=""

  while IFS= read -r TABLE; do
    [[ -z "$TABLE" ]] && continue

    RESTORED_COUNT="$(count_rows "$TARGET_URL" "$TABLE")"

    if [[ -n "$SOURCE_URL" ]]; then
      SOURCE_COUNT="$(count_rows "$SOURCE_URL" "$TABLE")"
    else
      SOURCE_COUNT="(no source)"
    fi

    # Determine STATUS
    if [[ -z "$SOURCE_URL" ]]; then
      if [[ "$RESTORED_COUNT" =~ ^[0-9]+$ ]]; then
        STATUS="present"
      else
        STATUS="ERROR"
        FAIL_COUNT=$(( FAIL_COUNT + 1 ))
      fi
    elif [[ ! "$RESTORED_COUNT" =~ ^[0-9]+$ || ! "$SOURCE_COUNT" =~ ^[0-9]+$ ]]; then
      STATUS="ERROR"
      FAIL_COUNT=$(( FAIL_COUNT + 1 ))
    elif (( SOURCE_COUNT == 0 )); then
      STATUS="OK (src=0)"
    elif (( RESTORED_COUNT >= SOURCE_COUNT )); then
      STATUS="OK"
    else
      DRIFT=$(( (SOURCE_COUNT - RESTORED_COUNT) * 100 / SOURCE_COUNT ))
      if (( DRIFT <= 5 )); then
        STATUS="OK (${DRIFT}% drift)"
      else
        STATUS="WARN ${DRIFT}% short"
        FAIL_COUNT=$(( FAIL_COUNT + 1 ))
        WARN_TABLES="${WARN_TABLES} $TABLE"
      fi
    fi

    printf '%-42s %15s %15s %12s\n' "$TABLE" "$RESTORED_COUNT" "$SOURCE_COUNT" "$STATUS"
  done <<< "$TABLE_LIST"

  printf '\n'

  if [[ -n "$WARN_TABLES" ]]; then
    log_info "WARN: tables with >5%% row-count drift:${WARN_TABLES}"
    log_info "Likely cause: data written to prod between dump time and this count."
    log_info "Check the dump timestamp vs the current time. Drift up to ~10%% is"
    log_info "normal for active tables in the hours after a nightly dump."
  fi

  if [[ "$FAIL_COUNT" -gt 0 ]]; then
    log_err "$FAIL_COUNT table(s) failed verification (ERROR or >5%% drift)."
    exit 7
  else
    log_info "row-count verification PASSED — all $TOP_N tables within acceptable drift"
  fi
fi

# ── Step 4: Teardown ───────────────────────────────────────────────────
log_step "Step 4/4: Teardown"

if [[ "$DRY_RUN" == "yes" ]]; then
  log_info "dry-run: would DROP DATABASE \"$DRILL_DB_NAME\" from scratch project"
else
  log_info "teardown handled by EXIT trap"
fi

printf '\n[restore-drill] ── DRILL COMPLETE ── %s\n\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
