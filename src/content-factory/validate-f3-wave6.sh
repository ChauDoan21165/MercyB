#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BANK="$ROOT/src/content-factory/f3-launch-bank"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

[[ -d "$BANK" ]] || fail "missing $BANK"

for n in $(seq -w 51 60); do
  file="$BANK/post-$n.md"
  [[ -f "$file" ]] || fail "missing post-$n.md"
  grep -q '^status: "draft-needs-chau-approval"$' "$file" || fail "post-$n missing draft status"
  grep -q '^---$' "$file" || fail "post-$n missing frontmatter fence"
done

# Seasonal posts must have [điền] slots
grep -q '\[điền' "$BANK/post-51.md" || fail "post-51 missing [điền] slot (seasonal template)"
grep -q '\[điền' "$BANK/post-52.md" || fail "post-52 missing [điền] slot (seasonal template)"
grep -q '\[điền' "$BANK/post-53.md" || fail "post-53 missing [điền] slot (seasonal template)"

# Honesty check: seasonal templates must include a ghi-chú warning
grep -qi 'ghi chú' "$BANK/post-51.md" || fail "post-51 missing ghi-chú honesty note"
grep -qi 'ghi chú' "$BANK/post-52.md" || fail "post-52 missing ghi-chú honesty note"
grep -qi 'ghi chú' "$BANK/post-53.md" || fail "post-53 missing ghi-chú honesty note"

# Minimal-pair feature posts
grep -qi 'minimal.pair\|cặp âm' "$BANK/post-54.md" || fail "post-54 must cover minimal pairs"
grep -q 'ship' "$BANK/post-55.md" || fail "post-55 must use ship/sheep pair"
grep -q 'bed' "$BANK/post-56.md" || fail "post-56 must use bed/bad pair"

# V2 conversation depth posts
grep -qi 'V2\|hội thoại\|lượt' "$BANK/post-57.md" || fail "post-57 must cover V2 conversation depth"
grep -qi 'lượt' "$BANK/post-58.md" || fail "post-58 must demo multi-turn conversation"

# Family bridge posts
grep -qi 'family.bridge\|phụ huynh' "$BANK/post-59.md" || fail "post-59 must cover family bridge / parent angle"
grep -q '\[điền' "$BANK/post-60.md" || fail "post-60 missing [điền] slot (parent template)"
grep -qi 'ghi chú' "$BANK/post-60.md" || fail "post-60 missing ghi-chú honesty note"

# No fabricated testimonial patterns (scores or "đạt [X]" claims)
for n in $(seq -w 51 60); do
  file="$BANK/post-$n.md"
  if grep -qiP 'band [0-9]\.[0-9]|đạt [0-9]|điểm [0-9]{3}|toeic [0-9]' "$file" 2>/dev/null; then
    fail "post-$n contains a score claim — honesty rule violation"
  fi
done

echo "PASS: F3 wave 6 launch-bank drafts validated."
