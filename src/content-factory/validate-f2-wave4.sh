#!/usr/bin/env bash
# F2 Content Factory wave 4 validation.
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
files = {
    "interference": (root / "f2-interference-taxonomy-wave4.json", "patterns", 8),
    "family": (root / "f2-family-bridge-scripts-wave4.json", "scripts", 6),
}

diacritic_re = re.compile(r"[À-ỹ]")
bad = []

for label, (path, key, expected) in files.items():
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
    if data.get("wave") != 4:
        bad.append(f"{label}: wave must be 4")

    items = data.get(key)
    if not isinstance(items, list) or len(items) != expected:
        bad.append(f"{label}: expected exactly {expected} {key}")
        continue

    ids = [item.get("id") for item in items if isinstance(item, dict)]
    if len(ids) != len(set(ids)):
        bad.append(f"{label}: duplicate ids")

    for item in items:
        if not isinstance(item, dict):
            bad.append(f"{label}: each item must be an object")
            continue
        if not item.get("id"):
            bad.append(f"{label}: missing id")
        if label == "interference":
            for field in ("category", "severity", "name", "l1ReasoningVi", "learnerSignal", "examples", "teachingMove", "ruleTags"):
                if field not in item:
                    bad.append(f"{item.get('id', '<missing-id>')}: missing {field}")
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
                    for field in ("incorrect", "natural", "explanationVi"):
                        if not example.get(field):
                            bad.append(f"{item.get('id', '<missing-id>')}: example missing {field}")
        else:
            for field in ("scenario", "learnerNeed", "tone", "englishScript", "vietnameseBridge", "coachNoteVi", "avoid", "step13Tags"):
                if field not in item:
                    bad.append(f"{item.get('id', '<missing-id>')}: missing {field}")
            if not isinstance(item.get("englishScript"), list) or len(item["englishScript"]) != 3:
                bad.append(f"{item.get('id', '<missing-id>')}: expected 3 English script lines")
            if not isinstance(item.get("vietnameseBridge"), list) or len(item["vietnameseBridge"]) != 3:
                bad.append(f"{item.get('id', '<missing-id>')}: expected 3 Vietnamese bridge lines")
            if not isinstance(item.get("avoid"), list) or len(item["avoid"]) < 2:
                bad.append(f"{item.get('id', '<missing-id>')}: expected at least 2 avoid lines")

if bad:
    print("FAIL")
    for item in bad:
        print(f" - {item}")
    sys.exit(1)

print("PASS: F2 wave 4 content validation")
PY
