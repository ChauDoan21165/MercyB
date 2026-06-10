#!/usr/bin/env bash
set -euo pipefail

# Netlify build ignore contract:
#   exit 0 = ignore this deploy and skip the build
#   exit 1 = continue with the build
#
# By default, Netlify builds are disabled for mercyblade.com so ordinary pushes
# and merge requests cannot burn build credits. A human may opt back in by
# setting MERCYB_ALLOW_NETLIFY_BUILD=1 for a controlled recovery/diagnostic run.
# With the override set, docs/report/root-Markdown-only changes still skip;
# app, data, config, script, dependency, or deploy-config changes continue.

log() {
  printf '[netlify-ignore] %s\n' "$*" >&2
}

get_changed_files() {
  if [[ -n "${NETLIFY_IGNORE_CHANGED_FILES:-}" ]]; then
    printf '%s\n' "$NETLIFY_IGNORE_CHANGED_FILES"
    return
  fi

  if [[ -z "${CACHED_COMMIT_REF:-}" || -z "${COMMIT_REF:-}" ]]; then
    log "missing CACHED_COMMIT_REF or COMMIT_REF; continuing build"
    return 1
  fi

  git diff --name-only "$CACHED_COMMIT_REF" "$COMMIT_REF"
}

is_docs_only_file() {
  local file="$1"

  case "$file" in
    docs/*|reports/*)
      return 0
      ;;
    */*)
      return 1
      ;;
    *.md)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

context="${NETLIFY_CONTEXT:-${CONTEXT:-unknown}}"

if [[ "${MERCYB_ALLOW_NETLIFY_BUILD:-}" != "1" ]]; then
  log "netlify builds disabled by policy for mercyblade.com (context=${context}); skipping build"
  exit 0
fi

if ! changed_output="$(get_changed_files)"; then
  exit 1
fi

changed_files=()
while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  changed_files+=("$file")
done <<< "$changed_output"

if (( ${#changed_files[@]} == 0 )); then
  log "no changed files detected; skipping build"
  exit 0
fi

for file in "${changed_files[@]}"; do
  if ! is_docs_only_file "$file"; then
    log "build required: $file is outside docs/**, reports/**, or root *.md"
    exit 1
  fi
done

log "docs/report/root-Markdown-only change detected; skipping build"
exit 0
