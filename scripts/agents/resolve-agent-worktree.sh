#!/usr/bin/env bash
set -euo pipefail

AGENT="${1:-}"
BRANCH="${2:-}"
ROOT="${AGENT_ROOT:-$HOME/MercyB}"
BASE_DIR="${AGENT_WORKTREE_BASE:-/private/tmp}"

if [ -z "$AGENT" ] || [ -z "$BRANCH" ]; then
  echo "Usage: scripts/agents/resolve-agent-worktree.sh AGENT BRANCH" >&2
  exit 1
fi

cd "$ROOT"

LOCK_ROOT="$(git rev-parse --git-common-dir)/agent-worktree-locks"
LOCK_NAME="$(printf '%s' "$BRANCH" | tr -c 'A-Za-z0-9._-' '_')"
LOCK_FILE="$LOCK_ROOT/$LOCK_NAME.lock"

mkdir -p "$LOCK_ROOT"

current_branch_for_path() {
  local path="$1"
  git -C "$path" symbolic-ref --quiet --short HEAD 2>/dev/null || true
}

is_git_worktree() {
  local path="$1"
  git -C "$path" rev-parse --is-inside-work-tree >/dev/null 2>&1
}

worktree_for_branch() {
  git worktree list --porcelain | awk -v branch="refs/heads/$BRANCH" '
    /^worktree / { path = substr($0, 10) }
    /^branch / && substr($0, 8) == branch { print path; exit }
  '
}

write_lock() {
  local worktree="$1"
  {
    printf 'agent=%s\n' "$AGENT"
    printf 'branch=%s\n' "$BRANCH"
    printf 'worktree=%s\n' "$worktree"
    printf 'updated_at=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  } > "$LOCK_FILE"
}

locked_worktree=""
if [ -f "$LOCK_FILE" ]; then
  locked_branch="$(awk -F= '$1 == "branch" { print substr($0, index($0, "=") + 1) }' "$LOCK_FILE")"
  locked_worktree="$(awk -F= '$1 == "worktree" { print substr($0, index($0, "=") + 1) }' "$LOCK_FILE")"

  if [ "$locked_branch" = "$BRANCH" ] && [ -n "$locked_worktree" ] && is_git_worktree "$locked_worktree"; then
    if [ "$(current_branch_for_path "$locked_worktree")" = "$BRANCH" ]; then
      write_lock "$locked_worktree"
      printf '%s\n' "$locked_worktree"
      exit 0
    fi
  fi

  rm -f "$LOCK_FILE"
fi

existing_worktree="$(worktree_for_branch)"
if [ -n "$existing_worktree" ]; then
  write_lock "$existing_worktree"
  printf '%s\n' "$existing_worktree"
  exit 0
fi

if ! git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  if git show-ref --verify --quiet "refs/remotes/origin/$BRANCH"; then
    git branch --track "$BRANCH" "origin/$BRANCH" >/dev/null
  else
    echo "Branch does not exist locally or on origin: $BRANCH" >&2
    exit 1
  fi
fi

default_worktree="$BASE_DIR/agent-$AGENT"
target_worktree="$default_worktree"

if [ -e "$default_worktree" ]; then
  if is_git_worktree "$default_worktree" && [ "$(current_branch_for_path "$default_worktree")" = "$BRANCH" ]; then
    write_lock "$default_worktree"
    printf '%s\n' "$default_worktree"
    exit 0
  fi

  target_worktree="$BASE_DIR/agent-$AGENT-$(date -u +%Y%m%dT%H%M%SZ)-$$"
fi

git worktree add "$target_worktree" "$BRANCH" >/dev/null
write_lock "$target_worktree"
printf '%s\n' "$target_worktree"
