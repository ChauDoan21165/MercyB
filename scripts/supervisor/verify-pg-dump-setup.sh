#!/usr/bin/env bash
#
# scripts/supervisor/verify-pg-dump-setup.sh
#
# Pre-flight verification for the external Postgres backup pipeline
# (`scripts/db-backup/nightly-dump.sh`, scheduled via `.gitlab-ci.yml`).
#
# This script confirms — WITHOUT ever reading secret values and WITHOUT
# ever running the actual pg_dump — that:
#   1. The four required GitLab CI/CD variables exist in the project
#      (SUPABASE_DB_URL, GPG_RECIPIENT_KEY, RCLONE_CONFIG, RCLONE_REMOTE).
#   2. A pipeline schedule for `nightly-db-backup` exists.
#
# Run it after each step of `docs/runbooks/pg-dump-activation.md` to
# confirm progress. Exit 0 = all checks GREEN; exit 1 = at least one
# RED finding (action required). YELLOW findings are warnings (e.g.
# the schedule isn't created yet but variables are; that's expected
# mid-setup) and do NOT fail the exit code on their own.
#
# Why this exists:
#   - Setting up the pipeline involves seven independent CI/CD variables
#     and a pipeline schedule across two pages of the GitLab UI. It is
#     trivially easy to typo a variable name or skip a step. Running
#     this script after each section of the activation runbook catches
#     the typo before the next scheduled run silently no-ops.
#
# What this script DOES NOT do:
#   - Run the actual pg_dump. That would require the variable VALUES,
#     which we deliberately never read. The first real run is the
#     `nightly-db-backup-now` manual job per §8 of the activation
#     runbook.
#   - Validate that the variable VALUES are correct (e.g. that the
#     SUPABASE_DB_URL points at the real prod DB). Only presence is
#     checked. Value validity is verified by §8's manual job.
#   - Modify any GitLab state. Read-only inspection via `glab variable
#     list` and `glab schedule list`. If `glab` is missing, the script
#     exits with a clear "install glab first" message and a non-zero
#     code; no fallback to a less-safe path.
#
# Dependencies:
#   - glab CLI, authenticated to gitlab.com as the project owner.
#   - jq for parsing glab JSON output.
#   - Run from anywhere inside the cd12536/mercyB clone (glab picks up
#     the repo from the current directory's git remote).

set -euo pipefail

# ── ANSI color helpers ─────────────────────────────────────────────────
# Use tput when stdout is a TTY; otherwise emit no escape codes (CI-safe).

if [[ -t 1 ]] && command -v tput >/dev/null 2>&1; then
  C_GREEN="$(tput setaf 2)"
  C_YELLOW="$(tput setaf 3)"
  C_RED="$(tput setaf 1)"
  C_DIM="$(tput dim)"
  C_RESET="$(tput sgr0)"
else
  C_GREEN=""
  C_YELLOW=""
  C_RED=""
  C_DIM=""
  C_RESET=""
fi

# Counters drive the exit code + summary line.
GREEN_COUNT=0
YELLOW_COUNT=0
RED_COUNT=0

mark_green()  { GREEN_COUNT=$((GREEN_COUNT + 1));  printf '    %s[GREEN]%s  %s\n' "$C_GREEN"  "$C_RESET" "$1"; }
mark_yellow() { YELLOW_COUNT=$((YELLOW_COUNT + 1)); printf '    %s[YELLOW]%s %s\n' "$C_YELLOW" "$C_RESET" "$1"; }
mark_red()    { RED_COUNT=$((RED_COUNT + 1));      printf '    %s[RED  ]%s  %s\n' "$C_RED"    "$C_RESET" "$1"; }

# ── Preflight ──────────────────────────────────────────────────────────

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    printf >&2 '%sERROR%s missing required command: %s\n' "$C_RED" "$C_RESET" "$1"
    printf >&2 '  Install with:  brew install %s   (or see https://gitlab.com/-/help)\n' "$1"
    exit 2
  fi
}

require_cmd glab
require_cmd jq

# Confirm glab is authenticated. `glab auth status` prints to STDERR on
# success too; we only care about the exit code.
if ! glab auth status >/dev/null 2>&1; then
  printf >&2 '%sERROR%s glab is not authenticated.\n' "$C_RED" "$C_RESET"
  printf >&2 '  Run:  glab auth login\n'
  exit 3
fi

# Detect the project. We do not hard-code the slug — `glab` resolves
# it from the working-directory's git remote, which is the standard
# behavior the rest of the toolchain assumes.
PROJECT_SLUG="$(glab repo view --output json 2>/dev/null | jq -r '.full_path // .path_with_namespace // empty')"
if [[ -z "${PROJECT_SLUG}" ]]; then
  printf >&2 '%sERROR%s could not detect GitLab project. Are you inside the cd12536/mercyB clone?\n' "$C_RED" "$C_RESET"
  exit 4
fi

printf '[verify-pg-dump-setup] GitLab project: %s%s%s\n\n' "$C_DIM" "$PROJECT_SLUG" "$C_RESET"

# ── §1 CI/CD variables presence ────────────────────────────────────────

printf '  CI/CD variables\n'

# Fetch all variables once; presence-only — we never read .value.
# `glab variable list -F json` returns an array of { key, variable_type,
# protected, masked, ... } entries.
VARS_JSON="$(glab variable list -F json 2>/dev/null || printf '[]')"

# Sanity-check the JSON shape so a glab CLI change doesn't silently
# emit an unparsable response.
if ! printf '%s' "$VARS_JSON" | jq -e 'type == "array"' >/dev/null 2>&1; then
  printf >&2 '%sERROR%s unexpected `glab variable list -F json` output (not an array). Is your glab up-to-date?\n' "$C_RED" "$C_RESET"
  exit 5
fi

check_variable_presence() {
  local var_name="$1"
  local expected_type="${2:-variable}"   # "variable" or "file"
  local actual_type
  actual_type="$(printf '%s' "$VARS_JSON" | jq -r --arg k "$var_name" '.[] | select(.key == $k) | (.variable_type // "variable")')"

  if [[ -z "$actual_type" ]]; then
    mark_red "$var_name  NOT FOUND in project variables"
    return
  fi

  if [[ "$actual_type" == "$expected_type" ]]; then
    if [[ "$expected_type" == "file" ]]; then
      mark_green "$var_name  present (file type)"
    else
      mark_green "$var_name  present"
    fi
  else
    mark_yellow "$var_name  present but type is '$actual_type', expected '$expected_type' — see §6.2 of pg-dump-activation.md"
  fi
}

check_variable_presence "SUPABASE_DB_URL"     "variable"
check_variable_presence "GPG_RECIPIENT_KEY"   "file"
check_variable_presence "RCLONE_CONFIG"       "file"
check_variable_presence "RCLONE_REMOTE"       "variable"

printf '\n'

# ── §2 Pipeline schedules presence ─────────────────────────────────────

printf '  Pipeline schedules\n'

# glab schedule list is available; output format varies by version.
# We use the JSON-when-possible path with a graceful fallback.
SCHEDULES_JSON=""
if SCHEDULES_JSON="$(glab schedule list -F json 2>/dev/null)"; then
  : # ok
elif SCHEDULES_JSON="$(glab schedule list --output json 2>/dev/null)"; then
  : # older flag spelling
else
  # No JSON support — fall back to text parsing. Looser; we just look
  # for any schedule whose description mentions "nightly-db-backup".
  SCHEDULES_TEXT="$(glab schedule list 2>/dev/null || printf '')"
  if printf '%s' "$SCHEDULES_TEXT" | grep -qiE 'nightly[-_]db[-_]backup'; then
    mark_green "nightly-db-backup schedule  present (description matches; rerun with --version of glab for richer detail)"
  else
    mark_yellow "nightly-db-backup schedule  NOT FOUND (run §7 of pg-dump-activation.md)"
  fi
  SCHEDULES_JSON=""   # signal: text path consumed
fi

if [[ -n "$SCHEDULES_JSON" ]]; then
  # JSON path. Look for a schedule whose description matches the
  # canonical "nightly-db-backup" string (the §7 walkthrough's
  # Description field).
  if ! printf '%s' "$SCHEDULES_JSON" | jq -e 'type == "array"' >/dev/null 2>&1; then
    mark_yellow "schedule list returned non-array JSON; presence check skipped"
  else
    NEXT_RUN="$(printf '%s' "$SCHEDULES_JSON" \
      | jq -r '.[] | select((.description // "") | test("nightly[-_]db[-_]backup"; "i")) | (.next_run_at // .nextRunAt // empty)' \
      | head -n 1)"
    if [[ -n "$NEXT_RUN" ]]; then
      mark_green "nightly-db-backup schedule  present (next run: $NEXT_RUN)"
    else
      # Schedule may exist but lack next_run_at (deactivated).
      DESCRIPTION_HIT="$(printf '%s' "$SCHEDULES_JSON" \
        | jq -r '.[] | select((.description // "") | test("nightly[-_]db[-_]backup"; "i")) | (.description // empty)' \
        | head -n 1)"
      if [[ -n "$DESCRIPTION_HIT" ]]; then
        mark_yellow "nightly-db-backup schedule  present but deactivated (no next_run_at)"
      else
        mark_yellow "nightly-db-backup schedule  NOT FOUND (run §7 of pg-dump-activation.md)"
      fi
    fi
  fi
fi

printf '\n'

# ── Summary + exit code ────────────────────────────────────────────────

printf 'Summary: %s%d GREEN%s, %s%d YELLOW%s, %s%d RED%s\n' \
  "$C_GREEN"  "$GREEN_COUNT"  "$C_RESET" \
  "$C_YELLOW" "$YELLOW_COUNT" "$C_RESET" \
  "$C_RED"    "$RED_COUNT"    "$C_RESET"

if [[ "$RED_COUNT" -gt 0 ]]; then
  printf '\nAction required: see docs/runbooks/pg-dump-activation.md for the corresponding section.\n'
  exit 1
fi

if [[ "$YELLOW_COUNT" -gt 0 ]]; then
  printf '\nSetup in progress (YELLOW = warning, not failure). Continue with the remaining sections.\n'
  exit 0
fi

printf '\nAll checks GREEN. Trigger the first manual run per §8 of pg-dump-activation.md.\n'
exit 0
