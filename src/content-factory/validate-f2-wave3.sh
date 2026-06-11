#!/usr/bin/env bash
# F2 Content Factory wave 3 validation.
# Content-only checks: JSON shape, Vietnamese diacritics, append-only status,
# unique IDs, and no TypeScript engine imports.
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
path = root / "f2-interference-taxonomy-wave3.json"
diacritic_re = re.compile(r"[À-ỹ]")
bad = []

text = path.read_text(encoding="utf-8")
if re.search(r"^\s*(import|export)\s", text, re.M):
    bad.append("interference: engine import/export found")
if not diacritic_re.search(text):
    bad.append("interference: no Vietnamese diacritics found")

data = json.loads(text)
if data.get("status") != "review_queue_not_wired":
    bad.append("interference: status must be review_queue_not_wired")
if data.get("authoredBy") != "F2":
    bad.append("interference: authoredBy must be F2")
if data.get("wave") != 3:
    bad.append("interference: wave must be 3")

patterns = data.get("patterns")
if not isinstance(patterns, list) or len(patterns) != 11:
    bad.append("interference: expected exactly 11 patterns")
else:
    ids = [item.get("id") for item in patterns if isinstance(item, dict)]
    if len(ids) != len(set(ids)):
        bad.append("interference: duplicate ids")
    for item in patterns:
        if not isinstance(item, dict):
            bad.append("interference: each pattern must be an object")
            continue
        for key in ("id", "category", "severity", "name", "l1ReasoningVi", "learnerSignal", "examples", "teachingMove", "ruleTags"):
            if key not in item:
                bad.append(f"{item.get('id', '<missing-id>')}: missing {key}")
        if item.get("severity") not in {"low", "medium", "high"}:
            bad.append(f"{item.get('id', '<missing-id>')}: invalid severity")
        examples = item.get("examples")
        if not isinstance(examples, list) or len(examples) != 3:
            bad.append(f"{item.get('id', '<missing-id>')}: expected exactly 3 examples")
        else:
            for example in examples:
                if not isinstance(example, dict):
                    bad.append(f"{item.get('id', '<missing-id>')}: example must be an object")
                    continue
                for key in ("incorrect", "natural", "explanationVi"):
                    if not example.get(key):
                        bad.append(f"{item.get('id', '<missing-id>')}: example missing {key}")

if bad:
    print("FAIL")
    for item in bad:
        print(f" - {item}")
    sys.exit(1)

print("PASS: F2 wave 3 interference taxonomy validation")
PY
