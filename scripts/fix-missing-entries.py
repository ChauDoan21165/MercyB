# MB-BLUE-15.1 — 2025-12-18
# Ensure every room JSON has entries as an array (CORE_ONLY requirement)

import json
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, "public", "data")

fixed = 0
skipped = 0

for fname in sorted(os.listdir(DATA_DIR)):
    if not fname.endswith(".json"):
        continue

    path = os.path.join(DATA_DIR, fname)

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        skipped += 1
        continue

    if "entries" not in data or not isinstance(data.get("entries"), list):
        data["entries"] = []
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        fixed += 1

print(f"Fixed entries arrays: {fixed}")
print(f"Skipped invalid JSON: {skipped}")
