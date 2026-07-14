#!/usr/bin/env bash
set -euo pipefail

SUPABASE_URL="${SUPABASE_URL:-${VITE_SUPABASE_URL:-https://buemdfxyhxunzpgdoqin.supabase.co}}"
BUCKET="room-audio"
OUTBOX_DIR="${1:-reports/audio-census/pronun-prewarm-outbox}"

if [[ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
  echo "SUPABASE_SERVICE_ROLE_KEY is required; refusing to upload." >&2
  exit 1
fi

if [[ ! -d "$OUTBOX_DIR" ]]; then
  echo "Outbox directory not found: $OUTBOX_DIR" >&2
  exit 1
fi

mapfile -t FILES < <(find "$OUTBOX_DIR" -type f -name '*.mp3' | sort)
if [[ "${#FILES[@]}" -eq 0 ]]; then
  echo "No mp3 files found under $OUTBOX_DIR" >&2
  exit 1
fi

for file in "${FILES[@]}"; do
  object_path="${file#"$OUTBOX_DIR"/}"
  echo "upload $object_path"
  curl -fsS -X POST \
    "$SUPABASE_URL/storage/v1/object/$BUCKET/$object_path" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: audio/mpeg" \
    -H "x-upsert: true" \
    --data-binary "@$file" >/dev/null
done

echo "Uploaded ${#FILES[@]} mp3 file(s) to $BUCKET."
