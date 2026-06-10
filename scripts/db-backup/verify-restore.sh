#!/usr/bin/env bash
#
# scripts/db-backup/verify-restore.sh
#
# Non-destructive restore proof for encrypted dumps produced by
# nightly-dump.sh. This creates a throwaway database, streams:
#
#   gpg --decrypt <dump.gpg> | pg_restore --dbname=<throwaway-db>
#
# then runs basic smoke queries and drops the throwaway DB unless
# --keep-db is passed.
#
# The GPG private key must already be present in the caller's keyring.
# This script never imports a private key from disk.
#
# Usage:
#   VERIFY_RESTORE_ADMIN_DATABASE_URL="postgresql://postgres:...@host:5432/postgres?sslmode=require" \
#     scripts/db-backup/verify-restore.sh ./mercyb-...-prod.dump.gpg
#   VERIFY_RESTORE_ADMIN_DATABASE_URL="..." RCLONE_CONFIG_REMOTE="b2:mercyb-backups/prod" \
#     scripts/db-backup/verify-restore.sh --from-rclone
#
# Required env:
#   VERIFY_RESTORE_ADMIN_DATABASE_URL  Maintenance/admin Postgres URL on
#                                      the target server, usually the
#                                      `postgres` database. The role must
#                                      be allowed to CREATE DATABASE and
#                                      DROP DATABASE.
#
# Optional env:
#   VERIFY_RESTORE_DB_NAME             Explicit throwaway database name.
#                                      Default: mercyb_restore_verify_<UTC>_<pid>
#   VERIFY_RESTORE_EXPECT_TABLE        Public table expected after restore.
#                                      Default: profiles. Empty disables.
#   VERIFY_RESTORE_MIN_TABLES          Minimum restored non-system table count.
#                                      Default: 1.
#
# Flags:
#   --from-rclone                      Fetch newest daily full *.dump.gpg from
#                                      RCLONE_CONFIG_REMOTE before restore.
#   --expect-table <table>             Override expected public table.
#   --min-tables <n>                   Override minimum restored table count.
#   --keep-db                          Leave the throwaway DB in place for
#                                      manual inspection.
#   --dry-run                          Print actions without decrypting,
#                                      creating, restoring, or dropping.

set -euo pipefail

DUMP_FILE=""
FROM_RCLONE="no"
KEEP_DB="no"
DRY_RUN="no"
EXPECT_TABLE="${VERIFY_RESTORE_EXPECT_TABLE:-profiles}"
MIN_TABLES="${VERIFY_RESTORE_MIN_TABLES:-1}"
RCLONE_TMP=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --from-rclone)
      FROM_RCLONE="yes"
      shift
      ;;
    --expect-table)
      EXPECT_TABLE="${2:-}"
      shift 2
      ;;
    --min-tables)
      MIN_TABLES="${2:-}"
      shift 2
      ;;
    --keep-db)
      KEEP_DB="yes"
      shift
      ;;
    --dry-run)
      DRY_RUN="yes"
      shift
      ;;
    -h|--help)
      sed -n '3,35p' "$0"
      exit 0
      ;;
    -*)
      printf >&2 'ERROR [verify-restore] unknown flag: %s\n' "$1"
      exit 1
      ;;
    *)
      if [[ -z "$DUMP_FILE" ]]; then
        DUMP_FILE="$1"
      else
        printf >&2 'ERROR [verify-restore] extra positional arg: %s\n' "$1"
        exit 1
      fi
      shift
      ;;
  esac
done

log_info() { printf '[verify-restore] %s\n' "$1"; }
log_err() { printf >&2 'ERROR [verify-restore] %s\n' "$1"; }

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    log_err "missing required command: $1"
    exit 2
  fi
}

redact_url() {
  sed -E 's#(postgres(ql)?://)[^@]+@#\1[redacted-user]@#'
}

target_url_for_db() {
  local admin_url="$1"
  local db_name="$2"
  local base query prefix

  if [[ "$admin_url" == *\?* ]]; then
    query="${admin_url#*\?}"
    base="${admin_url%%\?*}"
  else
    query=""
    base="$admin_url"
  fi

  prefix="${base%/*}"
  if [[ "$prefix" == "$base" || "$prefix" == "postgres:" || "$prefix" == "postgresql:" ]]; then
    log_err "VERIFY_RESTORE_ADMIN_DATABASE_URL must include a database path, e.g. /postgres"
    exit 4
  fi

  if [[ -n "$query" ]]; then
    printf '%s/%s?%s' "$prefix" "$db_name" "$query"
  else
    printf '%s/%s' "$prefix" "$db_name"
  fi
}

quote_identifier_literal() {
  printf '%s' "$1" | sed "s/'/''/g"
}

ADMIN_URL="${VERIFY_RESTORE_ADMIN_DATABASE_URL:-}"
if [[ -z "$ADMIN_URL" ]]; then
  log_err "VERIFY_RESTORE_ADMIN_DATABASE_URL is not set"
  exit 4
fi

if [[ ! "$MIN_TABLES" =~ ^[0-9]+$ ]]; then
  log_err "--min-tables must be a non-negative integer"
  exit 5
fi

if [[ -n "$EXPECT_TABLE" && ! "$EXPECT_TABLE" =~ ^[A-Za-z_][A-Za-z0-9_]{0,62}$ ]]; then
  log_err "--expect-table must be empty or match ^[A-Za-z_][A-Za-z0-9_]{0,62}$"
  exit 5
fi

cleanup_download() {
  if [[ -n "$RCLONE_TMP" && -d "$RCLONE_TMP" ]]; then
    rm -rf "$RCLONE_TMP"
  fi
}

if [[ "$FROM_RCLONE" == "yes" ]]; then
  require_cmd rclone
  if [[ -n "$DUMP_FILE" ]]; then
    log_err "--from-rclone cannot be combined with a positional dump file"
    exit 1
  fi
  if [[ -z "${RCLONE_CONFIG_REMOTE:-}" ]]; then
    log_err "--from-rclone requires RCLONE_CONFIG_REMOTE"
    exit 4
  fi
  RCLONE_TMP="$(mktemp -d)"
  log_info "listing newest full dump under RCLONE_CONFIG_REMOTE/daily/"
  NEWEST_DUMP="$(
    rclone lsf --files-only "${RCLONE_CONFIG_REMOTE%/}/daily/" 2>/dev/null \
      | grep -E '\.dump\.gpg$' \
      | grep -vE '\.schema\.dump\.gpg$' \
      | sort \
      | tail -n 1
  )"
  if [[ -z "$NEWEST_DUMP" ]]; then
    cleanup_download
    log_err "no full *.dump.gpg found under RCLONE_CONFIG_REMOTE/daily/"
    exit 3
  fi
  log_info "fetching newest full dump: $NEWEST_DUMP"
  rclone copy "${RCLONE_CONFIG_REMOTE%/}/daily/$NEWEST_DUMP" "$RCLONE_TMP/" >/dev/null
  DUMP_FILE="$RCLONE_TMP/$NEWEST_DUMP"
fi

if [[ -z "$DUMP_FILE" ]]; then
  log_err "usage: $0 <encrypted-dump-file> [--keep-db] [--dry-run] or $0 --from-rclone"
  cleanup_download
  exit 1
fi

if [[ ! -r "$DUMP_FILE" ]]; then
  cleanup_download
  log_err "dump file not readable: $DUMP_FILE"
  exit 3
fi

case "$DUMP_FILE" in
  *.schema.dump.gpg)
    cleanup_download
    log_err "schema-only dump provided; verify the full *.dump.gpg artifact"
    exit 3
    ;;
esac

DB_NAME="${VERIFY_RESTORE_DB_NAME:-mercyb_restore_verify_$(date -u +%Y%m%dT%H%M%SZ)_$$}"
if [[ ! "$DB_NAME" =~ ^[A-Za-z_][A-Za-z0-9_]{0,62}$ ]]; then
  cleanup_download
  log_err "throwaway DB name must match ^[A-Za-z_][A-Za-z0-9_]{0,62}$"
  exit 5
fi

TARGET_URL="$(target_url_for_db "$ADMIN_URL" "$DB_NAME")"
SAFE_ADMIN="$(printf '%s' "$ADMIN_URL" | redact_url)"
SAFE_TARGET="$(printf '%s' "$TARGET_URL" | redact_url)"
DB_NAME_SQL="$(quote_identifier_literal "$DB_NAME")"
CREATED_DB="no"

cleanup() {
  local status=$?
  if [[ "$CREATED_DB" == "yes" && "$KEEP_DB" != "yes" && "$DRY_RUN" != "yes" ]]; then
    log_info "dropping throwaway DB $DB_NAME"
    psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -qAt \
      -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME_SQL' AND pid <> pg_backend_pid();" >/dev/null || true
    psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -qAt \
      -c "DROP DATABASE IF EXISTS \"$DB_NAME\";" >/dev/null || true
  fi
  cleanup_download
  exit "$status"
}
trap cleanup EXIT

cat <<EOF
[verify-restore] source dump : $DUMP_FILE
[verify-restore] admin DB    : $SAFE_ADMIN
[verify-restore] target DB   : $SAFE_TARGET
[verify-restore] keep DB     : $KEEP_DB
[verify-restore] dry-run     : $DRY_RUN
[verify-restore] min tables  : $MIN_TABLES
[verify-restore] expect table: ${EXPECT_TABLE:-<none>}
EOF

if [[ "$DRY_RUN" == "yes" ]]; then
  if [[ "$FROM_RCLONE" == "yes" ]]; then
    log_info "dry-run: selected newest full dump from RCLONE_CONFIG_REMOTE/daily/"
  fi
  log_info "dry-run: would CREATE DATABASE \"$DB_NAME\""
  log_info "dry-run: would gpg --decrypt '$DUMP_FILE' | pg_restore --no-owner --no-privileges --dbname=[redacted-target]"
  log_info "dry-run: would run content assertions and then drop the throwaway DB unless --keep-db is set"
  cleanup_download
  exit 0
fi

require_cmd gpg
require_cmd pg_restore
require_cmd psql

log_info "creating throwaway DB $DB_NAME"
psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -qAt \
  -c "CREATE DATABASE \"$DB_NAME\";" >/dev/null
CREATED_DB="yes"

GPG_LOG="$(mktemp)"
RESTORE_LOG="$(mktemp)"
# shellcheck disable=SC2064
trap "rm -f '$GPG_LOG' '$RESTORE_LOG'; cleanup" EXIT

log_info "restoring encrypted dump into $DB_NAME"
set +e
gpg --batch --quiet --decrypt "$DUMP_FILE" 2>"$GPG_LOG" \
  | pg_restore \
      --no-owner --no-privileges \
      --dbname="$TARGET_URL" 2>"$RESTORE_LOG"
RESTORE_RC=$?
set -e
if [[ "$RESTORE_RC" -ne 0 ]]; then
  log_info "decrypt|pg_restore exited non-zero ($RESTORE_RC); continuing to content assertions"
fi

query_target() {
  psql "$TARGET_URL" -v ON_ERROR_STOP=1 -qAt -c "$1" 2>/dev/null
}

log_info "running restore content assertions"
CURRENT_DB="$(query_target "SELECT current_database();" || true)"
TABLE_COUNT="$(query_target "SELECT count(*) FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog','information_schema');" || true)"
SCHEMA_COUNT="$(query_target "SELECT count(*) FROM information_schema.schemata;" || true)"

if [[ -z "$CURRENT_DB" || -z "$TABLE_COUNT" || -z "$SCHEMA_COUNT" ]]; then
  GPG_TAIL="$(tail -n 5 "$GPG_LOG")"
  REST_TAIL="$(tail -n 10 "$RESTORE_LOG" | sed -E 's#postgres(ql)?://[^ ]+#[redacted-conn-string]#g')"
  log_err "restore did not produce a queryable DB; gpg tail: ${GPG_TAIL}; pg_restore tail: ${REST_TAIL}"
  exit 6
fi

log_info "current_database=$CURRENT_DB"
log_info "restored_tables=$TABLE_COUNT"
log_info "schemas=$SCHEMA_COUNT"

if (( TABLE_COUNT < MIN_TABLES )); then
  log_err "too few restored tables: $TABLE_COUNT < $MIN_TABLES"
  exit 6
fi

if [[ -n "$EXPECT_TABLE" ]]; then
  EXPECT_EXISTS="$(query_target "SELECT to_regclass('public.${EXPECT_TABLE}') IS NOT NULL;" || echo "f")"
  if [[ "$EXPECT_EXISTS" != "t" ]]; then
    log_err "expected table public.${EXPECT_TABLE} is missing after restore"
    exit 6
  fi
  EXPECT_ROWS="$(query_target "SELECT count(*) FROM public.${EXPECT_TABLE};" || echo "?")"
  log_info "expected_table=public.${EXPECT_TABLE} rows=$EXPECT_ROWS"
  if [[ "$EXPECT_ROWS" == "0" ]]; then
    log_info "warning: public.${EXPECT_TABLE} restored with 0 rows; confirm this is expected"
  fi
fi

if [[ "$KEEP_DB" == "yes" ]]; then
  log_info "restore verification passed; kept throwaway DB $DB_NAME"
else
  log_info "restore verification passed; throwaway DB will be dropped"
fi
