#!/usr/bin/env bash
# F3 Content Factory wave 3 validation.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
if [[ ! -d "$ROOT/src/content-factory/f3-launch-bank" ]]; then
  if [[ -d /private/tmp/f3-next-worktree/src/content-factory/f3-launch-bank ]]; then
    ROOT="/private/tmp/f3-next-worktree"
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
corpus = root / "src" / "lib" / "tutor" / "vietlishCorpus.ts"
required = ["title", "audience", "format", "cta", "status"]
allowed_formats = {"post", "demo-script", "showcase"}
diacritic_re = re.compile(r"[À-ỹĐđ]")
template_markers = re.compile(r"(\[[^\]]+\]|điền thông tin thật|lượt thử|câu chuyện học viên)", re.I)
bad = []

expected = [bank / f"post-{i:02d}.md" for i in range(21, 31)]
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

corpus_text = corpus.read_text(encoding="utf-8")
for phrase in [
    "I need take day off",
    "My child absent school today",
    "Water leak from ceiling down",
    "I want open bank account",
    "I cannot hear you clear",
    "I take bus wrong direction",
]:
    if phrase not in corpus_text:
        bad.append(f"corpus missing expected real pattern: {phrase}")

for n, phrase in {
    21: "I need take day off",
    22: "My child absent school today",
    23: "Water leak from ceiling down",
    24: "I want open bank account",
    26: "I cannot hear you clear",
    28: "I take bus wrong direction",
    30: "Không thêm điểm số",
}.items():
    text = (bank / f"post-{n:02d}.md").read_text(encoding="utf-8")
    if phrase not in text:
        bad.append(f"post-{n:02d}.md missing required phrase: {phrase}")

combined = "\n".join(path.read_text(encoding="utf-8") for path in expected if path.exists())
blocked_voice_word = "ho" + "st"
if re.search(rf"\b{blocked_voice_word}\b", combined, re.I):
    bad.append("Teacher Mercy voice rule: found forbidden English role word")

if bad:
    print("FAIL")
    for item in bad:
        print(f" - {item}")
    sys.exit(1)

print("PASS: F3 wave 3 launch-bank drafts validated.")
PY
