#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BANK="$ROOT/src/content-factory/f3-launch-bank"
CORPUS="$ROOT/src/lib/tutor/vietlishCorpus.ts"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

[[ -d "$BANK" ]] || fail "missing $BANK"
[[ -f "$CORPUS" ]] || fail "missing $CORPUS"

for n in $(seq -w 11 20); do
  file="$BANK/post-$n.md"
  [[ -f "$file" ]] || fail "missing post-$n.md"
  grep -q '^status: "draft-needs-chau-approval"$' "$file" || fail "post-$n missing draft status"
  grep -q '^---$' "$file" || fail "post-$n missing frontmatter fence"
done

count="$(find "$BANK" -maxdepth 1 -type f -name 'post-*.md' | wc -l | tr -d ' ')"
[[ "$count" == "10" ]] || fail "expected 10 post files, found $count"

grep -qi 'Luyện nói' "$BANK/post-11.md" || fail "post-11 must cover Luyện nói"
grep -qi 'Exam-prep' "$BANK/post-12.md" || fail "post-12 must cover exam-prep"
grep -qi 'phụ huynh' "$BANK/post-13.md" || fail "post-13 must cover family/parent angle"
grep -qi 'M4 room descriptions' "$BANK/post-14.md" || fail "post-14 must cover M4 room descriptions"

grep -q 'Can you borrow me your pen' "$BANK/post-15.md" || fail "post-15 missing borrow/lend corpus entry"
grep -q 'This food is too delicious' "$BANK/post-16.md" || fail "post-16 missing too/so corpus entry"
grep -q 'Can you borrow me your pen' "$CORPUS" || fail "borrow/lend entry not found in corpus"
grep -q 'This food is too delicious' "$CORPUS" || fail "too delicious entry not found in corpus"

grep -qi 'giá' "$BANK/post-17.md" || fail "post-17 must handle price objection"
grep -qi 'khó' "$BANK/post-18.md" || fail "post-18 must handle looks-hard objection"
grep -qi 'AI' "$BANK/post-19.md" || fail "post-19 must handle AI skepticism"

grep -q '\[điền ngày\]' "$BANK/post-20.md" || fail "post-20 missing [điền ngày] slot"
grep -q '\[điền link\]' "$BANK/post-20.md" || fail "post-20 missing [điền link] slot"

echo "PASS: F3 wave 2 launch-bank drafts validated."
