#!/usr/bin/env bash
# Upload iOS dSYMs to Sentry so native crash stack traces symbolicate.
#
# Wired from A7c gap #1 (reports/NATIVE-sentry-init-audit-A7c.md, PR #816).
# Without this step, Sentry receives raw memory addresses ("0x100abcdef")
# for every native iOS crash and the stack is unreadable.
#
# How it runs
# -----------
# Designed for an Xcode Run Script build phase on the Release configuration.
# Xcode injects DWARF_DSYM_FOLDER_PATH at build time pointing at the .dSYM
# bundles the linker just produced; that's the canonical path to upload.
# When run outside Xcode (e.g. after `xcodebuild archive`), pass the
# archive's dSYMs directory as the first argument instead.
#
# Required env (Xcode-injected for build-phase use):
#   DWARF_DSYM_FOLDER_PATH   directory holding the .dSYM bundles
#   CONFIGURATION            Debug / Release (we only run on Release)
#   DEBUG_INFORMATION_FORMAT must be "dwarf-with-dsym" for dSYMs to exist
#
# Required env (always — from your shell, .env.local, or Xcode Build Settings):
#   SENTRY_AUTH_TOKEN        Sentry API token with project:write scope
#   SENTRY_ORG               canonical: chau-doan
#   SENTRY_PROJECT           canonical: mercyblade-web
#
# Manual usage (after xcodebuild archive):
#   ./scripts/upload-ios-dsyms.sh /path/to/App.xcarchive/dSYMs

set -euo pipefail

# When invoked manually, accept the dSYMs directory as $1. Inside an Xcode
# Run Script phase that arg is empty and DWARF_DSYM_FOLDER_PATH is set.
DSYM_DIR="${1:-${DWARF_DSYM_FOLDER_PATH:-}}"

if [ -z "${DSYM_DIR}" ]; then
  echo "error: no dSYMs directory provided." >&2
  echo "  - from Xcode: DWARF_DSYM_FOLDER_PATH should be set by the build" >&2
  echo "  - from CLI:   pass the dSYMs path as the first argument" >&2
  exit 1
fi

if [ ! -d "${DSYM_DIR}" ]; then
  echo "error: dSYMs directory does not exist: ${DSYM_DIR}" >&2
  exit 1
fi

# Skip Debug builds — they're never shipped, never crash for users, and
# the dSYMs would only pollute the Sentry project. Exit 0 so the Xcode
# build phase stays green.
if [ "${CONFIGURATION:-Release}" != "Release" ]; then
  echo "[upload-ios-dsyms] skip — CONFIGURATION=${CONFIGURATION} (only Release uploads)"
  exit 0
fi

# If dSYMs weren't generated (DEBUG_INFORMATION_FORMAT not set to
# "dwarf-with-dsym"), there's nothing to upload. Fail loud so the build
# doesn't silently ship without symbolication. Bypass with
# DEBUG_INFORMATION_FORMAT=dwarf-with-dsym in the Xcode Build Settings
# for the Release config (it's the App-Store-default already).
if [ -n "${DEBUG_INFORMATION_FORMAT:-}" ] && \
   [ "${DEBUG_INFORMATION_FORMAT}" != "dwarf-with-dsym" ]; then
  echo "error: DEBUG_INFORMATION_FORMAT=${DEBUG_INFORMATION_FORMAT} — set it to 'dwarf-with-dsym' in the Release build settings so dSYMs are produced." >&2
  exit 1
fi

missing=()
[ -n "${SENTRY_AUTH_TOKEN:-}" ] || missing+=("SENTRY_AUTH_TOKEN")
[ -n "${SENTRY_ORG:-}" ]        || missing+=("SENTRY_ORG")
[ -n "${SENTRY_PROJECT:-}" ]    || missing+=("SENTRY_PROJECT")
if [ "${#missing[@]}" -gt 0 ]; then
  echo "error: missing required env: ${missing[*]}" >&2
  echo "  - set them in Xcode → Target → Build Settings → User-Defined" >&2
  echo "  - or export them in your shell before running ./scripts/upload-ios-dsyms.sh" >&2
  echo "  - SENTRY_AUTH_TOKEN must NEVER be committed; store it in the keychain" >&2
  echo "    (memory: \`mb-sentry-auth-token\`)" >&2
  exit 1
fi

# Locate the bundled sentry-cli (installed as a transitive dep of
# @sentry/vite-plugin; package-lock.json pins 2.58.x). Prefer the
# repo-local binary so the script doesn't depend on a global install.
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "${SCRIPT_DIR}/.." && pwd )"
SENTRY_CLI="${REPO_ROOT}/node_modules/.bin/sentry-cli"
if [ ! -x "${SENTRY_CLI}" ]; then
  echo "error: sentry-cli not found at ${SENTRY_CLI}." >&2
  echo "  Run \`npm ci\` from the repo root to install @sentry/cli" >&2
  echo "  (transitive via @sentry/vite-plugin)." >&2
  exit 1
fi

echo "[upload-ios-dsyms] uploading dSYMs from: ${DSYM_DIR}"
echo "[upload-ios-dsyms] target: ${SENTRY_ORG}/${SENTRY_PROJECT}"

# --include-sources embeds the Swift source-context so Sentry can show
# the surrounding lines, not just the symbolicated frame name. The dSYMs
# already contain DWARF line-number tables for the symbolication itself.
"${SENTRY_CLI}" debug-files upload \
  --org "${SENTRY_ORG}" \
  --project "${SENTRY_PROJECT}" \
  --include-sources \
  "${DSYM_DIR}"

echo "[upload-ios-dsyms] done."
