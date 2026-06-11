#!/usr/bin/env bash
# F3 Content Factory wave 1 validation.
# Pure content checks: required frontmatter, Vietnamese diacritics, allowed
# formats, and honest template labeling.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
export F3_CONTENT_FACTORY_ROOT="$ROOT"

python3 - <<'PY'
import os
import pathlib
import re
import sys

root = pathlib.Path(os.environ["F3_CONTENT_FACTORY_ROOT"])
bank = root / "f3-launch-bank"
required = ["title", "audience", "format", "cta", "status"]
allowed_formats = {"post", "demo-script", "showcase"}
diacritic_re = re.compile(r"[À-ỹĐđ]")
template_markers = re.compile(r"(\[[A-ZÀ-Ỹ0-9/ ,:-]+\]|\{\{|điền thông tin thật|student-story|câu chuyện học viên)", re.I)
bad = []

files = sorted(bank.glob("post-*.md"))
expected = [bank / f"post-{i:02d}.md" for i in range(1, 11)]
if files != expected:
    bad.append("expected exactly post-01.md through post-10.md in src/content-factory/f3-launch-bank")

for path in expected:
    if not path.exists():
        continue
    text = path.read_text(encoding="utf-8")
    if re.search(r"^\s*(import|export)\s", text, re.M):
        bad.append(f"{path.name}: engine import/export found")
    if not diacritic_re.search(text):
        bad.append(f"{path.name}: no Vietnamese diacritics found")
    match = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not match:
        bad.append(f"{path.name}: missing YAML frontmatter")
        continue
    frontmatter = {}
    for line in match.group(1).splitlines():
        if ":" not in line:
            bad.append(f"{path.name}: malformed frontmatter line: {line}")
            continue
        key, value = line.split(":", 1)
        frontmatter[key.strip()] = value.strip().strip('"')
    for key in required:
        if not frontmatter.get(key):
            bad.append(f"{path.name}: missing frontmatter field {key}")
    extra = set(frontmatter) - set(required)
    if extra:
        bad.append(f"{path.name}: unexpected frontmatter fields: {', '.join(sorted(extra))}")
    if frontmatter.get("format") not in allowed_formats:
        bad.append(f"{path.name}: format must be one of {', '.join(sorted(allowed_formats))}")
    if frontmatter.get("status") != "draft-needs-chau-approval":
        bad.append(f"{path.name}: status must be draft-needs-chau-approval")
    if template_markers.search(text) and "MẪU — điền thông tin thật" not in text:
        bad.append(f"{path.name}: template/fill-in content must include MẪU — điền thông tin thật")

if bad:
    print("FAIL")
    for item in bad:
        print(f" - {item}")
    sys.exit(1)

print("PASS: F3 wave 1 launch bank validation")
PY
