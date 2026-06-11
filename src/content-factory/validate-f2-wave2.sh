#!/usr/bin/env bash
# F2 Content Factory wave 2 validation.
# Content-only checks: JSON shape, Vietnamese diacritics, append-only status,
# and no TypeScript engine imports.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
export F2_CONTENT_FACTORY_ROOT="$ROOT"

python3 - <<'PY'
import json
import os
import pathlib
import re
import sys

root = pathlib.Path(os.environ["F2_CONTENT_FACTORY_ROOT"])
files = {
    "interference": (root / "f2-interference-taxonomy-wave2.json", "patterns", 8),
    "family": (root / "f2-family-bridge-scripts-wave2.json", "scripts", 6),
    "themes": (root / "f2-theme-scenarios-wave2.json", "themes", 4),
}

diacritic_re = re.compile(r"[À-ỹ]")
bad = []

for label, (path, key, minimum) in files.items():
    text = path.read_text(encoding="utf-8")
    if re.search(r"^\s*(import|export)\s", text, re.M):
        bad.append(f"{label}: engine import/export found")
    if not diacritic_re.search(text):
        bad.append(f"{label}: no Vietnamese diacritics found")
    data = json.loads(text)
    if data.get("status") != "review_queue_not_wired":
        bad.append(f"{label}: status must be review_queue_not_wired")
    if data.get("authoredBy") != "F2":
        bad.append(f"{label}: authoredBy must be F2")
    if data.get("wave") != 2:
        bad.append(f"{label}: wave must be 2")
    items = data.get(key)
    if not isinstance(items, list) or len(items) < minimum:
        bad.append(f"{label}: expected at least {minimum} {key}")
    ids = [item.get("id") for item in items or [] if isinstance(item, dict)]
    if len(ids) != len(set(ids)):
        bad.append(f"{label}: duplicate ids")

if bad:
    print("FAIL")
    for item in bad:
        print(f" - {item}")
    sys.exit(1)

print("PASS: F2 wave 2 content validation")
PY
