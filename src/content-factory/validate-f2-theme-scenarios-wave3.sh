#!/usr/bin/env bash
# F2 Content Factory — theme-scenarios wave 3 validation.
# Content-only checks: JSON shape, Vietnamese diacritics, append-only status,
# unique IDs, no TypeScript engine imports, minimum depth per scenario.
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
path = root / "f2-theme-scenarios-wave3.json"
diacritic_re = re.compile(r"[À-ỹ]")
bad = []

text = path.read_text(encoding="utf-8")
if re.search(r"^\s*(import|export)\s", text, re.M):
    bad.append("engine import/export found")
if not diacritic_re.search(text):
    bad.append("no Vietnamese diacritics found")

data = json.loads(text)
if data.get("status") != "review_queue_not_wired":
    bad.append("status must be review_queue_not_wired")
if data.get("authoredBy") != "F2":
    bad.append("authoredBy must be F2")
if data.get("wave") != 3:
    bad.append("wave must be 3")

themes = data.get("themes")
if not isinstance(themes, list) or len(themes) < 2:
    bad.append("expected at least 2 themes")
    print("FAIL")
    for item in bad:
        print(f" - {item}")
    sys.exit(1)

all_scenario_ids = []
for theme in themes:
    theme_id = theme.get("themeId", "<missing>")
    scenarios = theme.get("scenarios", [])
    if not isinstance(scenarios, list) or len(scenarios) < 3:
        bad.append(f"{theme_id}: expected at least 3 scenarios")
        continue
    for scenario in scenarios:
        sid = scenario.get("id", "<missing-id>")
        all_scenario_ids.append(sid)
        seed_inputs = scenario.get("seedInputs", [])
        if not isinstance(seed_inputs, list) or len(seed_inputs) < 3:
            bad.append(f"{sid}: seedInputs must have at least 3 items (got {len(seed_inputs)})")
        l1_notes = scenario.get("l1InterferenceNotes", [])
        if not isinstance(l1_notes, list) or len(l1_notes) < 3:
            bad.append(f"{sid}: l1InterferenceNotes must have at least 3 items (got {len(l1_notes)})")
        for note in l1_notes:
            if not isinstance(note, dict):
                bad.append(f"{sid}: l1InterferenceNote must be an object")
                continue
            for key in ("id", "label", "note"):
                if not note.get(key):
                    bad.append(f"{sid}: l1InterferenceNote missing {key}")
            note_text = note.get("note", "")
            if not diacritic_re.search(note_text):
                bad.append(f"{sid} note '{note.get('id', '?')}': no Vietnamese diacritics")
        follow_ups = scenario.get("followUps", [])
        if not isinstance(follow_ups, list) or len(follow_ups) < 5:
            bad.append(f"{sid}: followUps must have at least 5 items (got {len(follow_ups)})")
        for fu in follow_ups:
            if not isinstance(fu, dict):
                bad.append(f"{sid}: followUp must be an object")
                continue
            for key in ("id", "question"):
                if not fu.get(key):
                    bad.append(f"{sid}: followUp missing {key}")
        for key in ("labelEn", "labelVi", "category"):
            if not scenario.get(key):
                bad.append(f"{sid}: missing {key}")

if len(all_scenario_ids) != len(set(all_scenario_ids)):
    bad.append("duplicate scenario ids found")

if bad:
    print("FAIL")
    for item in bad:
        print(f" - {item}")
    sys.exit(1)

print("PASS: F2 theme-scenarios wave 3 validation")
PY
