#!/usr/bin/env bash
set -euo pipefail

blocked_patterns=(
  ".local/"
  "reports/ladder/"
  "deepclaude/"
  "src/pages/home/__tests__/Home.lazyBoundaries.test.ts"
)

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "guard-clean-commit: not inside a git worktree" >&2
  exit 2
fi

changed_paths="$(
  {
    git diff --name-only --cached
    git diff --name-only
    git ls-files --others --exclude-standard
  } | sed '/^$/d' | sort -u
)"

violations=()
while IFS= read -r path; do
  [[ -z "$path" ]] && continue
  for blocked in "${blocked_patterns[@]}"; do
    if [[ "$blocked" == */ ]]; then
      if [[ "$path" == "$blocked"* ]]; then
        violations+=("$path")
      fi
    elif [[ "$path" == "$blocked" ]]; then
      violations+=("$path")
    fi
  done
done <<< "$changed_paths"

if (( ${#violations[@]} > 0 )); then
  echo "guard-clean-commit: blocked local-only or forbidden files are staged/changed:" >&2
  printf '  - %s\n' "${violations[@]}" >&2
  echo "Remove these paths from the commit/worktree before committing." >&2
  exit 1
fi

echo "guard-clean-commit: OK"
