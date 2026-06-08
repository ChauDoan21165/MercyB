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
#
# Flags:
#   --keep-db                          Leave the throwaway DB in place for
#                                      manual inspection.
#   --dry-run                          Print actions without decrypting,
#                                      creating, restoring, or dropping.

set -euo pipefail

DUMP_FILE=""
KEEP_DB="no"
DRY_RUN="no"

while [[ $# -gt 0 ]]; do
  case "$1" in
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

if [[ -z "$DUMP_FILE" ]]; then
  log_err "usage: $0 <encrypted-dump-file> [--keep-db] [--dry-run]"
  exit 1
fi

if [[ ! -r "$DUMP_FILE" ]]; then
  log_err "dump file not readable: $DUMP_FILE"
  exit 3
fi

ADMIN_URL="${VERIFY_RESTORE_ADMIN_DATABASE_URL:-}"
if [[ -z "$ADMIN_URL" ]]; then
  log_err "VERIFY_RESTORE_ADMIN_DATABASE_URL is not set"
  exit 4
fi

DB_NAME="${VERIFY_RESTORE_DB_NAME:-mercyb_restore_verify_$(date -u +%Y%m%dT%H%M%SZ)_$$}"
if [[ ! "$DB_NAME" =~ ^[A-Za-z_][A-Za-z0-9_]{0,62}$ ]]; then
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
  exit "$status"
}
trap cleanup EXIT

cat <<EOF
[verify-restore] source dump : $DUMP_FILE
[verify-restore] admin DB    : $SAFE_ADMIN
[verify-restore] target DB   : $SAFE_TARGET
[verify-restore] keep DB     : $KEEP_DB
[verify-restore] dry-run     : $DRY_RUN
EOF

if [[ "$DRY_RUN" == "yes" ]]; then
  log_info "dry-run: would CREATE DATABASE \"$DB_NAME\""
  log_info "dry-run: would gpg --decrypt '$DUMP_FILE' | pg_restore --no-owner --no-privileges --dbname=[redacted-target]"
  log_info "dry-run: would run smoke queries and then drop the throwaway DB unless --keep-db is set"
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
if ! gpg --batch --quiet --decrypt "$DUMP_FILE" 2>"$GPG_LOG" \
    | pg_restore \
        --no-owner --no-privileges \
        --dbname="$TARGET_URL" 2>"$RESTORE_LOG"; then
  GPG_TAIL="$(tail -n 5 "$GPG_LOG")"
  REST_TAIL="$(tail -n 10 "$RESTORE_LOG" | sed -E 's#postgres(ql)?://[^ ]+#[redacted-conn-string]#g')"
  log_err "decrypt|pg_restore pipeline failed; gpg tail: ${GPG_TAIL}; pg_restore tail: ${REST_TAIL}"
  exit 6
fi

log_info "running restore smoke queries"
psql "$TARGET_URL" -v ON_ERROR_STOP=1 -qAt <<'SQL'
SELECT 'current_database=' || current_database();
SELECT 'public_tables=' || count(*) FROM information_schema.tables WHERE table_schema = 'public';
SELECT 'schemas=' || count(*) FROM information_schema.schemata;
SQL

if [[ "$KEEP_DB" == "yes" ]]; then
  log_info "restore verification passed; kept throwaway DB $DB_NAME"
else
  log_info "restore verification passed; throwaway DB will be dropped"
fi
