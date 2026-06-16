#!/usr/bin/env bash
set -euo pipefail

NPM_FLAGS=(--legacy-peer-deps --cache .npm --prefer-offline)
if [ -n "${NPM_CI_EXTRA_FLAGS:-}" ]; then
  # shellcheck disable=SC2206
  NPM_FLAGS+=(${NPM_CI_EXTRA_FLAGS})
fi

install_fresh() {
  rm -rf node_modules/.deno
  npm ci "${NPM_FLAGS[@]}"
}

if [ "${MERCYB_NODE_MODULES_CLONE_CACHE:-1}" != "1" ] || [ "$(uname -s)" != "Darwin" ]; then
  echo "[node-modules-cache] disabled-or-non-darwin; running npm ci"
  install_fresh
  exit 0
fi

if [ ! -f package-lock.json ]; then
  echo "[node-modules-cache] package-lock.json missing; running npm ci"
  install_fresh
  exit 0
fi

if ! cp -cR package-lock.json "${TMPDIR:-/tmp}/mercyb-cp-clone-probe-$$" >/dev/null 2>&1; then
  rm -rf "${TMPDIR:-/tmp}/mercyb-cp-clone-probe-$$" 2>/dev/null || true
  echo "[node-modules-cache] APFS clone copy unavailable; running npm ci"
  install_fresh
  exit 0
fi
rm -rf "${TMPDIR:-/tmp}/mercyb-cp-clone-probe-$$" 2>/dev/null || true

LOCK_HASH="$(shasum -a 256 package-lock.json | awk '{print $1}')"
CACHE_ROOT="${MERCYB_NODE_MODULES_CACHE_ROOT:-$HOME/.cache/mercyb-node-modules}"
CACHE_DIR="$CACHE_ROOT/$LOCK_HASH"
LOCK_DIR="$CACHE_ROOT/.lock-$LOCK_HASH"
mkdir -p "$CACHE_ROOT"

free_kb() {
  df -Pk . 2>/dev/null | awk 'NR==2 {print $4}'
}

restore_cache() {
  if [ ! -d "$CACHE_DIR/node_modules" ] || [ ! -f "$CACHE_DIR/package-lock.sha256" ]; then
    return 1
  fi
  if [ "$(cat "$CACHE_DIR/package-lock.sha256" 2>/dev/null || true)" != "$LOCK_HASH" ]; then
    return 1
  fi

  BEFORE_KB="$(free_kb || true)"
  START_SECONDS="$(date +%s)"
  rm -rf node_modules
  if ! cp -cR "$CACHE_DIR/node_modules" node_modules; then
    echo "[node-modules-cache] restore copy failed; falling back to npm ci"
    rm -rf node_modules
    return 1
  fi
  rm -rf node_modules/.deno
  if [ ! -x node_modules/.bin/vite ] || [ ! -x node_modules/.bin/tsc ]; then
    echo "[node-modules-cache] restore validation failed; falling back to npm ci"
    rm -rf node_modules
    return 1
  fi
  AFTER_KB="$(free_kb || true)"
  END_SECONDS="$(date +%s)"
  DELTA_MB="unknown"
  if [ -n "${BEFORE_KB:-}" ] && [ -n "${AFTER_KB:-}" ]; then
    DELTA_MB="$(awk "BEGIN {printf \"%.1f\", ($BEFORE_KB - $AFTER_KB) / 1024}")"
  fi
  echo "[node-modules-cache] hit key=$LOCK_HASH restore_seconds=$((END_SECONDS - START_SECONDS)) free_delta_mb=$DELTA_MB root=$CACHE_ROOT"
  return 0
}

seed_cache() {
  TMP_DIR="$CACHE_ROOT/.tmp-$LOCK_HASH-$$"
  rm -rf "$TMP_DIR"
  mkdir -p "$TMP_DIR"
  cp -cR node_modules "$TMP_DIR/node_modules"
  printf '%s\n' "$LOCK_HASH" > "$TMP_DIR/package-lock.sha256"
  date -u '+%Y-%m-%dT%H:%M:%SZ' > "$TMP_DIR/seeded-at.txt"
  mv "$TMP_DIR" "$CACHE_DIR"
  echo "[node-modules-cache] seeded key=$LOCK_HASH root=$CACHE_ROOT"
}

if restore_cache; then
  exit 0
fi

LOCK_WAIT_SECONDS="${MERCYB_NODE_MODULES_CACHE_LOCK_WAIT_SECONDS:-180}"
START_WAIT="$(date +%s)"
while ! mkdir "$LOCK_DIR" 2>/dev/null; do
  if restore_cache; then
    exit 0
  fi
  NOW="$(date +%s)"
  if [ $((NOW - START_WAIT)) -ge "$LOCK_WAIT_SECONDS" ]; then
    echo "[node-modules-cache] lock wait timed out; running npm ci without seeding"
    install_fresh
    exit 0
  fi
  echo "[node-modules-cache] waiting for seed lock key=$LOCK_HASH"
  sleep 5
done
trap 'rmdir "$LOCK_DIR" 2>/dev/null || true' EXIT

if restore_cache; then
  exit 0
fi

echo "[node-modules-cache] miss key=$LOCK_HASH; running npm ci and seeding"
install_fresh
rm -rf "$CACHE_DIR"
seed_cache

# Keep the cache bounded on small runner disks. A live job can always rebuild.
KEEP="${MERCYB_NODE_MODULES_CACHE_KEEP:-3}"
find "$CACHE_ROOT" -mindepth 1 -maxdepth 1 -type d ! -name ".lock-*" -print 2>/dev/null |
  while IFS= read -r dir; do
    printf '%s\t%s\n' "$(stat -f '%m' "$dir" 2>/dev/null || echo 0)" "$dir"
  done |
  sort -rn |
  awk -v keep="$KEEP" 'NR > keep {print $2}' |
  while IFS= read -r old; do
    [ -n "$old" ] && rm -rf -- "$old"
  done
