#!/usr/bin/env bash
#
# scripts/db-backup/restore.sh
#
# Companion to nightly-dump.sh. Decrypt a .dump.gpg produced by that
# script and run pg_restore against a target Postgres database.
#
# DESTRUCTIVE: this script defaults to --clean --if-exists, which DROPS
# every object in the target before restoring. This is what you want for
# a clean disaster-recovery restore — but it is the wrong choice for
# almost anything else. The script prints a destructive-action banner
# and a 10-second countdown unless --yes is passed.
#
# Usage:
#   restore.sh <encrypted-dump-file> [--yes] [--dry-run]
#
# Required env:
#   DATABASE_URL                       Target Postgres connection string.
#                                       NOTE: this is the destination, NOT
#                                       the source. Almost always a
#                                       staging or local instance.
#   GPG private key for the recipient  MUST already be present in the
#                                       caller's GPG keyring. This script
#                                       will NOT import a private key
#                                       from disk — that is a human
#                                       decision.
#
# Optional:
#   --yes      Skip the 10-second destructive-action countdown.
#   --dry-run  Print what would happen; do NOT decrypt or restore.

set -euo pipefail

# ── Args ───────────────────────────────────────────────────────────────

DUMP_FILE=""
ASSUME_YES="no"
DRY_RUN="no"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --yes)     ASSUME_YES="yes"; shift ;;
    --dry-run) DRY_RUN="yes"; shift ;;
    -h|--help)
      sed -n '3,30p' "$0"
      exit 0
      ;;
    -*) printf >&2 'ERROR [restore] unknown flag: %s\n' "$1"; exit 1 ;;
    *)
      if [[ -z "$DUMP_FILE" ]]; then
        DUMP_FILE="$1"
      else
        printf >&2 'ERROR [restore] extra positional arg: %s\n' "$1"
        exit 1
      fi
      shift
      ;;
  esac
done

# ── Helpers ────────────────────────────────────────────────────────────

log_err() { printf >&2 'ERROR [restore] %s\n' "$1"; }
log_info() { printf '[restore] %s\n' "$1"; }

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    log_err "missing required command: $1"
    exit 2
  fi
}

# ── Preflight ──────────────────────────────────────────────────────────

if [[ -z "$DUMP_FILE" ]]; then
  log_err "usage: $0 <encrypted-dump-file> [--yes] [--dry-run]"
  exit 1
fi

if [[ ! -r "$DUMP_FILE" ]]; then
  log_err "dump file not readable: $DUMP_FILE"
  exit 3
fi

require_cmd gpg
require_cmd pg_restore

if [[ -z "${DATABASE_URL:-}" ]]; then
  log_err "DATABASE_URL (target) is not set"
  exit 4
fi

# Strip credentials before echoing the target. We accept either
# postgres:// or postgresql:// schemes; everything between '://' and the
# host is the userinfo and gets redacted.
SAFE_TARGET="$(printf '%s' "$DATABASE_URL" \
  | sed -E 's#(postgres(ql)?://)[^@]+@#\1[redacted-user]@#')"

# ── Destructive-action banner ──────────────────────────────────────────

cat <<EOF
─────────────────────────────────────────────────────────────────────
  DESTRUCTIVE OPERATION
─────────────────────────────────────────────────────────────────────
  Source dump : $DUMP_FILE
  Target DB   : $SAFE_TARGET
  Mode        : pg_restore --clean --if-exists --no-owner --no-privileges
  Dry-run     : $DRY_RUN
  Assume-yes  : $ASSUME_YES

  pg_restore --clean --if-exists DROPS every object in the target
  schema before recreating it. If this is anything other than a
  disaster-recovery restore to a known-empty target, ABORT NOW.
─────────────────────────────────────────────────────────────────────
EOF

if [[ "$DRY_RUN" == "yes" ]]; then
  log_info "dry-run: would gpg --decrypt '$DUMP_FILE' | pg_restore --clean --if-exists [target]"
  log_info "dry-run: no decryption performed, no database changes made"
  exit 0
fi

if [[ "$ASSUME_YES" != "yes" ]]; then
  for i in 10 9 8 7 6 5 4 3 2 1; do
    printf '\r  Starting in %2d s — Ctrl+C to abort.' "$i" >&2
    sleep 1
  done
  printf '\n' >&2
fi

# ── Decrypt + restore ──────────────────────────────────────────────────
#
# Stream gpg decrypt → pg_restore so the plaintext .dump never touches
# disk on this side either. The temp logs do NOT receive the connection
# string; pg_restore takes it via --dbname and we don't echo it.

GPG_LOG="$(mktemp)"
RESTORE_LOG="$(mktemp)"
# shellcheck disable=SC2064
trap "rm -f '$GPG_LOG' '$RESTORE_LOG'" EXIT

if ! gpg --batch --quiet --decrypt "$DUMP_FILE" 2>"$GPG_LOG" \
    | pg_restore \
        --clean --if-exists \
        --no-owner --no-privileges \
        --dbname="$DATABASE_URL" 2>"$RESTORE_LOG"; then
  GPG_TAIL="$(tail -n 5 "$GPG_LOG")"
  REST_TAIL="$(tail -n 10 "$RESTORE_LOG" | sed -E 's#postgres(ql)?://[^ ]+#[redacted-conn-string]#g')"
  log_err "decrypt|pg_restore pipeline failed; gpg tail: ${GPG_TAIL}; pg_restore tail: ${REST_TAIL}"
  exit 6
fi

log_info "restore complete against $SAFE_TARGET"
