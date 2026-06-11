#!/usr/bin/env bash
# F5 Content Factory wave 2 validation.
# Content-only checks: id uniqueness, required fields, IPA presence,
# Vietnamese diacritics in vi notes, exact one-wave size, requested
# coverage, wave-1 dedupe, and no TS imports.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
export F5_CONTENT_FACTORY_ROOT="$ROOT"
export F5_WAVE1_PATH="${F5_WAVE1_PATH:-/Users/admin/reports/factory/f5-wave1/wave1-50.json}"

python3 - <<'PY'
import json
import os
import pathlib
import re
import sys

root = pathlib.Path(os.environ["F5_CONTENT_FACTORY_ROOT"])
path = root / "wave2-50.json"
wave1_path = pathlib.Path(os.environ["F5_WAVE1_PATH"])
text = path.read_text(encoding="utf-8")
bad = []

if re.search(r"^\s*(import|export)\s", text, re.M):
    bad.append("wave2-50.json: engine import/export found")

try:
    data = json.loads(text)
except json.JSONDecodeError as exc:
    print(f"FAIL: invalid JSON: {exc}")
    sys.exit(1)

if data.get("status") != "review_queue_not_wired":
    bad.append("status must be review_queue_not_wired")
if data.get("authoredBy") != "F5":
    bad.append("authoredBy must be F5")
if data.get("wave") != 2:
    bad.append("wave must be 2")

items = data.get("minimalPairs")
if not isinstance(items, list):
    bad.append("minimalPairs must be a list")
    items = []
elif len(items) != 50:
    bad.append(f"expected exactly 50 minimalPairs, found {len(items)}")

ids = []
pair_keys = []
diacritic_re = re.compile(r"[À-ỹ]")
allowed_difficulty = {"easy", "medium", "hard"}
required_categories = {
    "final_clusters",
    "final_consonants",
    "diphthongs",
    "stress_pairs",
}
seen_categories = set()

for i, item in enumerate(items, start=1):
    if not isinstance(item, dict):
        bad.append(f"item {i}: must be an object")
        continue

    item_id = item.get("id")
    if not isinstance(item_id, str) or not re.fullmatch(r"f5w2-\d{3}", item_id):
        bad.append(f"item {i}: invalid id")
    else:
        ids.append(item_id)

    category = item.get("category")
    if category not in required_categories:
        bad.append(f"{item_id or i}: invalid category")
    else:
        seen_categories.add(category)

    pair = item.get("pair")
    if not isinstance(pair, dict):
        bad.append(f"{item_id or i}: pair must be an object")
        pair = {}
    target = pair.get("target")
    contrast = pair.get("contrast")
    if not isinstance(target, str) or not target.strip():
        bad.append(f"{item_id or i}: missing pair.target")
    if not isinstance(contrast, str) or not contrast.strip():
        bad.append(f"{item_id or i}: missing pair.contrast")
    if isinstance(target, str) and isinstance(contrast, str):
        pair_keys.append(tuple(sorted([target.lower(), contrast.lower()])))

    ipa = item.get("ipa")
    if not isinstance(ipa, dict):
        bad.append(f"{item_id or i}: ipa must be an object")
        ipa = {}
    for side in ("target", "contrast"):
        value = ipa.get(side)
        if not isinstance(value, str) or not value.startswith("/") or not value.endswith("/") or len(value) < 3:
            bad.append(f"{item_id or i}: ipa.{side} must be present and wrapped in slashes")

    vi = item.get("vi")
    if not isinstance(vi, str) or len(vi.strip()) < 30:
        bad.append(f"{item_id or i}: vi must be a substantive Vietnamese note")
    elif not diacritic_re.search(vi):
        bad.append(f"{item_id or i}: vi note must include Vietnamese diacritics")

    examples = item.get("examples")
    if not isinstance(examples, dict):
        bad.append(f"{item_id or i}: examples must be an object")
        examples = {}
    for side in ("target", "contrast"):
        value = examples.get(side)
        if not isinstance(value, str) or len(value.strip()) < 8:
            bad.append(f"{item_id or i}: examples.{side} missing")

    if item.get("difficulty") not in allowed_difficulty:
        bad.append(f"{item_id or i}: difficulty must be easy|medium|hard")

if len(ids) != len(set(ids)):
    bad.append("duplicate ids")
if len(pair_keys) != len(set(pair_keys)):
    bad.append("duplicate word pairs in wave 2")
missing_categories = required_categories - seen_categories
if missing_categories:
    bad.append("missing categories: " + ", ".join(sorted(missing_categories)))

if wave1_path.exists():
    wave1 = json.loads(wave1_path.read_text(encoding="utf-8"))
    wave1_pairs = {
        tuple(sorted([item["pair"]["target"].lower(), item["pair"]["contrast"].lower()]))
        for item in wave1.get("minimalPairs", [])
    }
    repeats = sorted(set(pair_keys) & wave1_pairs)
    if repeats:
        bad.append("wave-1 pair repeats: " + ", ".join(f"{a}/{b}" for a, b in repeats))
else:
    bad.append(f"wave 1 baseline missing: {wave1_path}")

if bad:
    print("FAIL")
    for item in bad:
        print(f" - {item}")
    sys.exit(1)

print("PASS: F5 wave 2 minimal-pair content validation")
PY
