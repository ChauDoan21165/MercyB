#!/usr/bin/env bash
#
# scripts/db-backup/nightly-dump.sh
#
# Take an encrypted, compressed pg_dump of the production Supabase
# Postgres database. Output is a single .dump.gpg file that only the
# holder of the matching GPG private key can decrypt.
#
# Why this exists: Supabase's own backups live INSIDE Supabase. If the
# Supabase account is ever locked out or terminated, those backups
# become inaccessible — even to the project owner. This script is the
# durable external insurance: an encrypted dump that can be uploaded to
# any object store (Backblaze B2 / S3 / R2) and decrypted offline.
#
# Designed to be run from CI on a schedule (see .gitlab-ci.yml job
# nightly-db-backup) and also manually from a laptop with the right env.
#
# Required env vars (all set by the caller; never echoed by this script):
#   SUPABASE_DB_URL or DATABASE_URL  Postgres connection string. If both
#                                     are set, SUPABASE_DB_URL wins.
#   GPG_RECIPIENT_KEY_ID              Either a GPG key ID/fingerprint
#                                     ALREADY imported into the keyring,
#                                     OR a path to a public key file
#                                     (auto-detected — if it looks like a
#                                     readable file, it's imported first).
#
# Optional:
#   BACKUP_OUTPUT_DIR                 Where to drop the encrypted dump.
#                                     Default: $PWD.
#   BACKUP_FILENAME_PREFIX            Filename prefix. Default: mercyb.
#   BACKUP_ENV_LABEL                  Filename env suffix. Default: prod.
#
# Output:
#   On success, prints a single line to stdout:
#     OK <path-to-file> <bytes>
#   and exits 0.
#   On any failure, exits non-zero with a single-line ERROR diagnostic
#   to stderr (no connection string, no service key).

set -euo pipefail

# ── Helpers ────────────────────────────────────────────────────────────

# log_err prints to STDERR; never echo the connection string itself.
log_err() {
  printf >&2 'ERROR [nightly-dump] %s\n' "$1"
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    log_err "missing required command: $1"
    exit 2
  fi
}

# ── Preflight ──────────────────────────────────────────────────────────

require_cmd pg_dump
require_cmd gpg

DB_URL="${SUPABASE_DB_URL:-${DATABASE_URL:-}}"
if [[ -z "$DB_URL" ]]; then
  log_err "neither SUPABASE_DB_URL nor DATABASE_URL is set"
  exit 3
fi

if [[ -z "${GPG_RECIPIENT_KEY_ID:-}" ]]; then
  log_err "GPG_RECIPIENT_KEY_ID is not set (key id/fingerprint OR path to public key)"
  exit 4
fi

# If the recipient looks like a file path, import the public key.
if [[ -r "$GPG_RECIPIENT_KEY_ID" && -f "$GPG_RECIPIENT_KEY_ID" ]]; then
  if ! gpg --batch --quiet --import "$GPG_RECIPIENT_KEY_ID" 2>/dev/null; then
    log_err "failed to import public key from file"
    exit 5
  fi
  # Resolve the recipient to the key id from the file (last imported).
  RECIPIENT_ID="$(gpg --with-colons --import-options show-only --import <"$GPG_RECIPIENT_KEY_ID" 2>/dev/null \
    | awk -F: '/^pub:/ {print $5; exit}')"
  if [[ -z "${RECIPIENT_ID:-}" ]]; then
    log_err "failed to resolve key id from public key file"
    exit 5
  fi
else
  RECIPIENT_ID="$GPG_RECIPIENT_KEY_ID"
fi

OUT_DIR="${BACKUP_OUTPUT_DIR:-$PWD}"
PREFIX="${BACKUP_FILENAME_PREFIX:-mercyb}"
LABEL="${BACKUP_ENV_LABEL:-prod}"

mkdir -p "$OUT_DIR"

# ISO-8601 UTC timestamp, filename-safe (colons replaced).
TS="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
OUT_FILE="${OUT_DIR}/${PREFIX}-${TS}-${LABEL}.dump.gpg"

# ── Dump ───────────────────────────────────────────────────────────────
#
# --format=custom is the binary, restorable-with-pg_restore format.
# --compress=9 uses pg_dump's built-in compression (zlib); we still pipe
# through gpg afterward for encryption. Stream-pipe to gpg so the
# plaintext dump never touches disk.

PGDUMP_LOG="$(mktemp)"
GPG_LOG="$(mktemp)"
# shellcheck disable=SC2064
trap "rm -f '$PGDUMP_LOG' '$GPG_LOG'" EXIT

# Note: we deliberately do NOT echo $DB_URL or build a command line that
# contains it. pg_dump reads the connection string from the first
# positional arg here, but `set -x` is OFF (we never enable it).
if ! pg_dump \
      --no-owner --no-privileges \
      --format=custom --compress=9 \
      "$DB_URL" 2>"$PGDUMP_LOG" \
    | gpg --batch --yes --quiet \
          --trust-model always \
          --recipient "$RECIPIENT_ID" \
          --encrypt --output "$OUT_FILE" 2>"$GPG_LOG"; then
  # Scrub anything that looks like a connection string from the pg_dump
  # log before surfacing it.
  PG_TAIL="$(tail -n 5 "$PGDUMP_LOG" | sed -E 's#postgres(ql)?://[^ ]+#[redacted-conn-string]#g; s#sb_secret_[A-Za-z0-9_-]+#[redacted-sb-secret]#g')"
  GPG_TAIL="$(tail -n 5 "$GPG_LOG")"
  log_err "pg_dump|gpg pipeline failed; pg_dump tail: ${PG_TAIL}; gpg tail: ${GPG_TAIL}"
  exit 6
fi

# ── Size + summary ─────────────────────────────────────────────────────

if [[ ! -s "$OUT_FILE" ]]; then
  log_err "output file is empty: $OUT_FILE"
  exit 7
fi

# Portable byte count (works on macOS BSD stat AND GNU coreutils stat).
if BYTES="$(stat -f%z "$OUT_FILE" 2>/dev/null)"; then :; else
  BYTES="$(stat -c%s "$OUT_FILE")"
fi

printf 'OK %s %s\n' "$OUT_FILE" "$BYTES"
