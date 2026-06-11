#!/usr/bin/env bash
# F3 Content Factory wave 7 validation.
# Checks posts 61-70: mix of post/poll/quiz/fill-in-blank/caption-this/
# demo-script/story-template formats, templates-only honesty rule.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
if [[ ! -d "$ROOT/src/content-factory/f3-launch-bank" ]]; then
  if [[ -d /private/tmp/a3-f3-wave7/src/content-factory/f3-launch-bank ]]; then
    ROOT="/private/tmp/a3-f3-wave7"
  else
    ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
  fi
fi
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
template_markers = re.compile(
    r"(\[[^\]]{3,}\]|điền thông tin thật|MẪU|câu chuyện học viên)",
    re.I,
)
bad = []

expected = [bank / f"post-{i:02d}.md" for i in range(61, 71)]
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
            continue
        key, value = line.split(":", 1)
        frontmatter[key.strip()] = value.strip().strip('"')
    for key in required:
        if not frontmatter.get(key):
            bad.append(f"{path.name}: missing frontmatter field '{key}'")
    fmt = frontmatter.get("format", "")
    if fmt not in allowed_formats:
        bad.append(f"{path.name}: format '{fmt}' not in {sorted(allowed_formats)}")
    if frontmatter.get("status") != "draft-needs-chau-approval":
        bad.append(f"{path.name}: status must be 'draft-needs-chau-approval'")
    # Honesty rule: story-template and fill-in-blank posts with template
    # placeholders MUST carry the MẪU — điền thông tin thật disclosure.
    if template_markers.search(text) and "MẪU — điền thông tin thật" not in text:
        if fmt in {"story-template"}:
            bad.append(
                f"{path.name}: story-template with [điền] slots must include "
                "'MẪU — điền thông tin thật' disclosure"
            )

# Per-post content guards
def check(path, pattern, msg):
    if not path.exists():
        return
    if not re.search(pattern, path.read_text(encoding="utf-8"), re.I):
        bad.append(f"{path.name}: {msg}")

check(bank / "post-61.md", r"although.{0,30}but|although.{0,50}even though",
      "post-61 must cover although/but conjunction doubling")
check(bank / "post-62.md", r"make.{0,20}homework|do.{0,20}homework",
      "post-62 must cover make vs do homework")
check(bank / "post-63.md", r"explain.{0,20}to me|explain me",
      "post-63 must cover explain to me pattern")
check(bank / "post-64.md", r"phỏng vấn|interview",
      "post-64 must cover job interview demo")
check(bank / "post-65.md", r"fill.{0,30}blank|điền|giới từ|preposition",
      "post-65 must cover preposition fill-in-blank exercise")
check(bank / "post-66.md", r"caption|lỗi|sửa",
      "post-66 must cover caption-this error-spotting")
check(bank / "post-67.md", r"sinh viên|professor|giáo sư|email",
      "post-67 must cover student email to professor template")
check(bank / "post-68.md", r"arrive at|arrive in|arrive to",
      "post-68 must cover arrive at/in/to")
check(bank / "post-69.md", r"good at|interested in|depend on|afraid of|listen to",
      "post-69 must cover preposition quiz items")
check(bank / "post-70.md", r"IT|kỹ sư|pull request|lập trình",
      "post-70 must cover IT professional template")

if bad:
    print("FAIL")
    for item in bad:
        print(f"  - {item}")
    sys.exit(1)

print("PASS: F3 wave 7 launch bank validated (posts 61-70).")
PY
