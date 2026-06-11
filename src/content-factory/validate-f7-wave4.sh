#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIR="$ROOT/f7-video-scripts"
required_fields=(
  "title (VN):"
  "status: draft-needs-chau-approval"
  "length-target:"
  "audience:"
  "hook (first 3 seconds, exact words):"
  "shot-list:"
  "script:"
  "captions:"
  "cta:"
  "recording-notes:"
)

fail=0

for i in $(seq 31 40); do
  file="$DIR/video-$i.md"
  if [[ ! -f "$file" ]]; then
    echo "missing: $file"
    fail=1
    continue
  fi

  for field in "${required_fields[@]}"; do
    if ! grep -Fq "$field" "$file"; then
      echo "missing field in video-$i.md: $field"
      fail=1
    fi
  done

  shot_count="$(awk '
    /^shot-list:/ { in_list=1; next }
    /^script:/ { in_list=0 }
    in_list && /^[0-9]+\./ { count++ }
    END { print count + 0 }
  ' "$file")"
  if (( shot_count < 3 )); then
    echo "too few shots in video-$i.md: $shot_count"
    fail=1
  fi

  if ! LC_ALL=UTF-8 grep -Eq '[ăâđêôơưĂÂĐÊÔƠƯàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹÀÁẠẢÃẰẮẶẲẴẦẤẬẨẪÈÉẸẺẼỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕỒỐỘỔỖỜỚỢỞỠÙÚỤỦŨỪỨỰỬỮỲÝỴỶỸ]' "$file"; then
    echo "no Vietnamese diacritics detected in video-$i.md"
    fail=1
  fi
done

wave_count="$(find "$DIR" -maxdepth 1 -type f -name 'video-*.md' | awk -F/ '/video-(3[1-9]|40)[.]md$/ { count++ } END { print count + 0 }')"
if [[ "$wave_count" != "10" ]]; then
  echo "expected exactly 10 wave4 video markdown files, found $wave_count"
  fail=1
fi

if (( fail )); then
  exit 1
fi

echo "F7 wave4 validation passed: 10 scripts, required fields, >=3 shots, Vietnamese diacritics."
