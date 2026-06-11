#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATUS="draft-needs-chau-approval"
FAIL=0

for n in $(seq -w 21 25); do
  file="$ROOT/article-$n.md"
  if [[ ! -f "$file" ]]; then
    echo "Missing $file"
    FAIL=1
    continue
  fi

  python3 - "$file" "$STATUS" <<'PY' || FAIL=1
import re
import sys
from pathlib import Path

path = Path(sys.argv[1])
expected_status = sys.argv[2]
text = path.read_text(encoding="utf-8")

errors = []
match = re.match(r"^---\n(.*?)\n---\n", text, re.S)
if not match:
    errors.append("missing frontmatter")
    frontmatter = ""
    body = text
else:
    frontmatter = match.group(1)
    body = text[match.end():]

fields = {}
for line in frontmatter.splitlines():
    if ":" not in line:
        continue
    key, value = line.split(":", 1)
    fields[key.strip()] = value.strip().strip('"')

required = ["title", "slug", "meta-description", "target-query", "status"]
for key in required:
    if not fields.get(key):
        errors.append(f"missing frontmatter field: {key}")

if fields.get("status") != expected_status:
    errors.append(f"status must be {expected_status}")

meta = fields.get("meta-description", "")
if len(meta) > 155:
    errors.append(f"meta-description too long: {len(meta)} chars")

words = re.findall(r"\b[\wÀ-ỹ]+\b", body, flags=re.UNICODE)
word_count = len(words)
if not (800 <= word_count <= 1500):
    errors.append(f"word count out of range: {word_count}")

if not re.search(r"[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]", text, re.I):
    errors.append("no Vietnamese diacritics detected")

if errors:
    print(f"{path.name}: FAIL")
    for error in errors:
        print(f"  - {error}")
    sys.exit(1)

print(f"{path.name}: OK ({word_count} words)")
PY
done

exit "$FAIL"
