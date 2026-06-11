#!/usr/bin/env bash
# F3 Content Factory wave 5 validation.
# Checks posts 41-50: story-template MẪU format for five learner archetypes
# (worker abroad, exam student, parent, retiree, shop owner).
# Honesty rule: all templates must carry the MẪU marker and [điền] slots.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
export F3_CONTENT_FACTORY_ROOT="$ROOT"

python3 - <<'PY'
import os
import pathlib
import re
import sys

root = pathlib.Path(os.environ["F3_CONTENT_FACTORY_ROOT"])
bank = root / "src" / "content-factory" / "f3-launch-bank"
required = ["title", "audience", "format", "cta", "status"]
allowed_formats = {
    "post", "demo-script", "showcase",
    "poll", "quiz", "fill-in-blank", "caption-this",
    "story-template",
}
diacritic_re = re.compile(r"[À-ỹĐđ]")
# Any [điền …] slot OR the MẪU header line counts as a template marker
slot_re = re.compile(r"\[điền [^\]]+\]")
bad = []

expected = [bank / f"post-{i:02d}.md" for i in range(41, 51)]
for path in expected:
    if not path.exists():
        bad.append(f"missing {path.relative_to(root)}")
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
            bad.append(f"{path.name}: malformed frontmatter line: {line!r}")
            continue
        key, value = line.split(":", 1)
        frontmatter[key.strip()] = value.strip().strip('"')
    for key in required:
        if not frontmatter.get(key):
            bad.append(f"{path.name}: missing frontmatter field '{key}'")
    extra = set(frontmatter) - set(required)
    if extra:
        bad.append(f"{path.name}: unexpected frontmatter fields: {', '.join(sorted(extra))}")
    if frontmatter.get("format") not in allowed_formats:
        bad.append(f"{path.name}: format must be one of {', '.join(sorted(allowed_formats))}")
    if frontmatter.get("status") != "draft-needs-chau-approval":
        bad.append(f"{path.name}: status must be 'draft-needs-chau-approval'")
    # Honesty rule: story-template posts MUST carry the MẪU disclosure header
    if "MẪU — điền thông tin thật" not in text:
        bad.append(f"{path.name}: missing honesty marker 'MẪU — điền thông tin thật'")
    # Each template must have at least three [điền …] slots
    slots = slot_re.findall(text)
    if len(slots) < 3:
        bad.append(f"{path.name}: expected ≥3 [điền …] slots, found {len(slots)}")

# Teacher Mercy voice rule: no forbidden legacy role word
combined = "\n".join(
    (bank / f"post-{i:02d}.md").read_text(encoding="utf-8")
    for i in range(41, 51)
    if (bank / f"post-{i:02d}.md").exists()
)
blocked_voice_word = "ho" + "st"
if re.search(rf"\b{blocked_voice_word}\b", combined, re.I):
    bad.append("Teacher Mercy voice rule: found forbidden English role word")

# Per-post archetype guards
guards = {
    # Worker abroad (41–42)
    41: [("nước ngoài", "post-41 must reference 'nước ngoài' (abroad worker archetype)"),
         ("[điền quốc gia", "post-41 must contain [điền quốc gia] slot")],
    42: [("nước ngoài", "post-42 must reference 'nước ngoài' (abroad worker result)"),
         ("[điền kết quả", "post-42 must contain [điền kết quả] slot")],
    # Exam student (43–44)
    43: [("IELTS", "post-43 must reference a named exam (IELTS)"),
         ("[điền band/điểm", "post-43 must contain [điền band/điểm] slot")],
    44: [("điền câu thật", "post-44 must contain [điền câu thật] slot for real before/after example")],
    # Parent (45–46)
    45: [("phụ huynh", "post-45 must reference 'phụ huynh' archetype"),
         ("trường", "post-45 must reference school context ('trường')")],
    46: [("phụ huynh", "post-46 must reference 'phụ huynh' archetype"),
         ("interested", "post-46 must include 'interested' correction example"),
         ("interesting", "post-46 must include 'interesting' pairing for contrast")],
    # Retiree (47–48)
    47: [("về hưu", "post-47 must reference 'về hưu' (retiree) archetype"),
         ("du lịch", "post-47 must reference travel context ('du lịch')")],
    48: [("về hưu", "post-48 must reference 'về hưu' (retiree) archetype"),
         ("con", "post-48 must reference family connection context")],
    # Shop owner (49–50)
    49: [("tiệm", "post-49 must reference 'tiệm' (shop) archetype"),
         ("spicy", "post-49 must include real tourist-facing phrase 'spicy'")],
    50: [("tiệm", "post-50 must reference 'tiệm' (shop) archetype"),
         ("sản phẩm", "post-50 must reference 'sản phẩm' (product) for e-commerce context"),
         ("affordable", "post-50 must include 'affordable' correction example")],
}
for n, checks in guards.items():
    path = bank / f"post-{n:02d}.md"
    if not path.exists():
        continue
    text = path.read_text(encoding="utf-8")
    for phrase, msg in checks:
        if phrase not in text:
            bad.append(msg)

if bad:
    print("FAIL")
    for item in bad:
        print(f" - {item}")
    sys.exit(1)

print("PASS: F3 wave 5 launch-bank story-template drafts validated.")
PY
