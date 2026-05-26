#!/usr/bin/env bash
set -euo pipefail

# Regenerate DB types after applying migrations.
# Adjust the output path to match the repo's existing shared type location.

PROJECT_REF="${PROJECT_REF:-}"
OUTPUT_PATH="${OUTPUT_PATH:-src/lib/database.types.ts}"
SCHEMA="${SCHEMA:-public}"

if [[ -z "$PROJECT_REF" ]]; then
  echo "PROJECT_REF is required (Supabase project ref)."
  echo "Example: PROJECT_REF=abcdefghijklmno OUTPUT_PATH=src/lib/database.types.ts ./scripts/regenerate-db-types.sh"
  exit 1
fi

npx supabase gen types typescript \
  --project-id "$PROJECT_REF" \
  --schema "$SCHEMA" \
  > "$OUTPUT_PATH"

echo "Wrote $OUTPUT_PATH"
