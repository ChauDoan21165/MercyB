# MB-BLUE-15 — 2025-12-18
# Fix room JSON id ↔ filename mismatches
# Rule: json.id MUST equal filename (snake_case, no .json)

import json
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, "public", "data")

def normalize_id(name: str) -> str:
    return (
        name.replace(".json", "")
        .strip()
        .lower()
    )

fixed = 0
skipped = 0

for fname in sorted(os.listdir(DATA_DIR)):
    if not fname.endswith(".json"):
        continue

    path = os.path.join(DATA_DIR, fname)
    expected_id = normalize_id(fname)

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ SKIP (invalid JSON): {fname} — {e}")
        skipped += 1
        continue

    actual_id = str(data.get("id", "")).strip().lower()

    if actual_id != expected_id:
        data["id"] = expected_id
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ FIXED id: {actual_id} → {expected_id}")
        fixed += 1

print("\nSUMMARY")
print(f"Fixed: {fixed}")
print(f"Skipped: {skipped}")
print("Done.")
