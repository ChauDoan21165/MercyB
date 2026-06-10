#!/usr/bin/env bash
set -euo pipefail

CANONICAL_ROOT="/Users/admin/MercyB"
PROJECT_NAME="${CF_PAGES_PROJECT_NAME:-mercyblade}"

cd "$CANONICAL_ROOT"

ROOT="$(git rev-parse --show-toplevel)"
if [[ "$ROOT" != "$CANONICAL_ROOT" ]]; then
  echo "deploy-cloudflare-pages-main: refusing deploy outside $CANONICAL_ROOT (got $ROOT)" >&2
  exit 2
fi

CURRENT_BRANCH="$(git branch --show-current)"
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "deploy-cloudflare-pages-main: refusing deploy from branch '$CURRENT_BRANCH'; switch /Users/admin/MercyB to main first." >&2
  exit 2
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "deploy-cloudflare-pages-main: refusing deploy with uncommitted tracked changes." >&2
  exit 2
fi

git fetch origin main
LOCAL_SHA="$(git rev-parse HEAD)"
MAIN_SHA="$(git rev-parse origin/main)"
if [[ "$LOCAL_SHA" != "$MAIN_SHA" ]]; then
  echo "deploy-cloudflare-pages-main: refusing deploy; local main $LOCAL_SHA != origin/main $MAIN_SHA." >&2
  exit 2
fi

npm run build
rm -f dist/404.html

if grep -rq "placeholder.invalid" dist/assets/*.js; then
  echo "deploy-cloudflare-pages-main: ABORT placeholder.invalid found in built JS assets." >&2
  exit 2
fi

npx --yes wrangler pages deploy dist \
  --project-name "$PROJECT_NAME" \
  --branch main \
  --commit-hash "$MAIN_SHA" \
  --commit-message "Deploy main ${MAIN_SHA:0:8}"
