#!/usr/bin/env bash
#
# scripts/db-backup/nightly-dump.sh
#
# Take an encrypted, compressed pg_dump of the production Supabase
# Postgres database. Output is TWO encrypted files per run:
#
#   1. mercyb-<ts>-prod.schema.dump.gpg  — schema-only dump (DDL only).
#      Fast to decrypt, fast to restore. Use this when you need to
#      spin up a structurally-correct empty DB without waiting for
#      the data dump.
#   2. mercyb-<ts>-prod.dump.gpg          — full dump (schema + data).
#      The canonical recovery artifact.
#
# Both files use --format=custom + --compress=9 from pg_dump, then are
# stream-piped through gpg --encrypt. Plaintext dumps never touch disk.
#
# Why this exists: Supabase's own backups live INSIDE Supabase. If the
# Supabase account is ever locked out or terminated, those backups
# become inaccessible — even to the project owner. This script is the
# durable external insurance: encrypted dumps that can be uploaded to
# any object store (Backblaze B2 / S3 / R2) and decrypted offline.
#
# Designed to be run from CI on a schedule (see .gitlab-ci.yml job
# nightly-db-backup) and also manually from a laptop with the right env.
#
# Required env vars (all set by the caller; never echoed by this script):
#   DATABASE_URL or SUPABASE_DB_URL    Postgres connection string. If
#                                       both are set, DATABASE_URL wins.
#
#   One of the following two recipient inputs (mutually exclusive):
#     GPG_PUBLIC_KEY_FILE              Path to an armored public-key
#                                       file. The script imports it and
#                                       extracts the key id automatically.
#                                       Use this in CI ("file" type
#                                       variable in GitLab).
#     GPG_RECIPIENT_KEY_ID             Key id / fingerprint of a key
#                                       ALREADY imported into the
#                                       keyring. Use this on laptops
#                                       where the keyring is set up.
#
# Optional:
#   BACKUP_OUTPUT_DIR                  Where to drop the encrypted dumps.
#                                      Default: $PWD.
#   BACKUP_FILENAME_PREFIX             Filename prefix. Default: mercyb.
#   BACKUP_ENV_LABEL                   Filename env suffix. Default: prod.
#
# Output:
#   On success, prints two lines to stdout (in this order):
#     OK <schema-file-path> <bytes>
#     OK <full-file-path>   <bytes>
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

# Stream a pg_dump invocation (passed as the rest of the args) through
# gpg --encrypt to a target file. Plaintext never touches disk.
# Args: $1 = output path, $@ (rest) = pg_dump args.
dump_to() {
  local out_file="$1"; shift
  local pgdump_log gpg_log
  pgdump_log="$(mktemp)"
  gpg_log="$(mktemp)"

  if ! pg_dump "$@" "$DB_URL" 2>"$pgdump_log" \
      | gpg --batch --yes --quiet \
            --trust-model always \
            --recipient "$RECIPIENT_ID" \
            --encrypt --output "$out_file" 2>"$gpg_log"; then
    local pg_tail gpg_tail
    pg_tail="$(tail -n 5 "$pgdump_log" \
      | sed -E 's#postgres(ql)?://[^ ]+#[redacted-conn-string]#g; s#sb_secret_[A-Za-z0-9_-]+#[redacted-sb-secret]#g')"
    gpg_tail="$(tail -n 5 "$gpg_log")"
    rm -f "$pgdump_log" "$gpg_log"
    log_err "pg_dump|gpg pipeline failed for $out_file; pg_dump tail: ${pg_tail}; gpg tail: ${gpg_tail}"
    return 6
  fi
  rm -f "$pgdump_log" "$gpg_log"

  if [[ ! -s "$out_file" ]]; then
    log_err "output file is empty: $out_file"
    return 7
  fi
}

# Portable byte count (BSD stat on macOS, GNU stat on Linux).
bytes_of() {
  local p="$1" b
  if b="$(stat -f%z "$p" 2>/dev/null)"; then printf '%s' "$b"; else stat -c%s "$p"; fi
}

# ── Preflight ──────────────────────────────────────────────────────────

require_cmd pg_dump
require_cmd gpg

DB_URL="${DATABASE_URL:-${SUPABASE_DB_URL:-}}"
if [[ -z "$DB_URL" ]]; then
  log_err "neither DATABASE_URL nor SUPABASE_DB_URL is set"
  exit 3
fi

# Recipient resolution: GPG_PUBLIC_KEY_FILE wins if set, otherwise
# GPG_RECIPIENT_KEY_ID. Exactly one of the two must be set.
if [[ -n "${GPG_PUBLIC_KEY_FILE:-}" ]]; then
  if [[ ! -r "$GPG_PUBLIC_KEY_FILE" || ! -f "$GPG_PUBLIC_KEY_FILE" ]]; then
    log_err "GPG_PUBLIC_KEY_FILE is set but not a readable file"
    exit 4
  fi
  if ! gpg --batch --quiet --import "$GPG_PUBLIC_KEY_FILE" 2>/dev/null; then
    log_err "failed to import public key from GPG_PUBLIC_KEY_FILE"
    exit 5
  fi
  RECIPIENT_ID="$(gpg --with-colons --import-options show-only --import <"$GPG_PUBLIC_KEY_FILE" 2>/dev/null \
    | awk -F: '/^pub:/ {print $5; exit}')"
  if [[ -z "${RECIPIENT_ID:-}" ]]; then
    log_err "failed to resolve key id from GPG_PUBLIC_KEY_FILE"
    exit 5
  fi
elif [[ -n "${GPG_RECIPIENT_KEY_ID:-}" ]]; then
  RECIPIENT_ID="$GPG_RECIPIENT_KEY_ID"
else
  log_err "neither GPG_PUBLIC_KEY_FILE nor GPG_RECIPIENT_KEY_ID is set"
  exit 4
fi

OUT_DIR="${BACKUP_OUTPUT_DIR:-$PWD}"
PREFIX="${BACKUP_FILENAME_PREFIX:-mercyb}"
LABEL="${BACKUP_ENV_LABEL:-prod}"

mkdir -p "$OUT_DIR"

# ISO-8601 UTC timestamp, filename-safe (colons replaced).
TS="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
SCHEMA_FILE="${OUT_DIR}/${PREFIX}-${TS}-${LABEL}.schema.dump.gpg"
FULL_FILE="${OUT_DIR}/${PREFIX}-${TS}-${LABEL}.dump.gpg"

# ── 1. Schema-only dump ────────────────────────────────────────────────
#
# --schema-only emits DDL only (no row data). --no-owner / --no-privileges
# strip role + grant statements that won't survive cross-project restores.

dump_to "$SCHEMA_FILE" \
  --no-owner --no-privileges \
  --schema-only \
  --format=custom --compress=9

# ── 2. Full dump (schema + data) ───────────────────────────────────────

dump_to "$FULL_FILE" \
  --no-owner --no-privileges \
  --format=custom --compress=9

# ── Summary ────────────────────────────────────────────────────────────

printf 'OK %s %s\n' "$SCHEMA_FILE" "$(bytes_of "$SCHEMA_FILE")"
printf 'OK %s %s\n' "$FULL_FILE"   "$(bytes_of "$FULL_FILE")"
