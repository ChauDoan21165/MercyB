#!/usr/bin/env bash
# F3 Content Factory wave 4 validation.
# Checks posts 31-40: engagement formats (poll, quiz, fill-in-blank, caption-this).
# Pure content checks: required frontmatter, Vietnamese diacritics, allowed
# formats, honest template labeling, and per-post content guards.
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
allowed_formats = {"post", "demo-script", "showcase", "poll", "quiz", "fill-in-blank", "caption-this"}
diacritic_re = re.compile(r"[À-ỹĐđ]")
template_markers = re.compile(r"(\[[^\]]+\]|điền thông tin thật|lượt thử|câu chuyện học viên)", re.I)
bad = []

expected = [bank / f"post-{i:02d}.md" for i in range(31, 41)]
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

# Teacher Mercy voice rule: no forbidden legacy role word
combined = "\n".join(
    (bank / f"post-{i:02d}.md").read_text(encoding="utf-8")
    for i in range(31, 41)
    if (bank / f"post-{i:02d}.md").exists()
)
blocked_voice_word = "ho" + "st"
if re.search(rf"\b{blocked_voice_word}\b", combined, re.I):
    bad.append("Teacher Mercy voice rule: found forbidden English role word")

# Per-post content guards
guards = {
    31: [("sensible", "post-31 must reference 'sensible'"),
         ("sensitive", "post-31 must reference 'sensitive'")],
    32: [("borrow", "post-32 must reference 'borrow'"),
         ("lend", "post-32 must reference 'lend'"),
         ("_____", "post-32 must contain fill-in blank marker '_____'")],
    33: [("3/3", "post-33 must contain quiz score '3/3'"),
         ("sensible", "post-33 quiz must include sensible/sensitive"),
         ("borrow", "post-33 quiz must include borrow/lend")],
    34: [("bác sĩ", "post-34 must set doctor scene with 'bác sĩ'")],
    35: [("actual", "post-35 must reference 'actual'"),
         ("current", "post-35 must reference 'current'")],
    36: [("economic", "post-36 must reference 'economic'"),
         ("economical", "post-36 must reference 'economical'"),
         ("_____", "post-36 must contain fill-in blank marker '_____'")],
    37: [("know how to", "post-37 must include 'know how to' correction")],
    38: [("dược sĩ", "post-38 must set pharmacy scene with 'dược sĩ'")],
    39: [("remind", "post-39 must reference 'remind'"),
         ("remember", "post-39 must reference 'remember'")],
    40: [("5/5", "post-40 grand quiz must contain score '5/5'")],
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

print("PASS: F3 wave 4 launch-bank drafts validated.")
PY
