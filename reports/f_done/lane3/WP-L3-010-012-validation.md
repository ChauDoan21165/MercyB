# Lane 3 F Validation: WP-L3-010..012

Status: f_done evidence only; not Judge verified.
Batch: Lane 3 F Batch 4

## Commands

```sh
npx eslint src/lib/tutor/speakFollowups.ts
npx eslint src/lib/tutor/__tests__/speakFollowups.test.ts
npx vitest run src/lib/tutor/__tests__/speakFollowups.test.ts
git diff --check
```

## Results

- `npx eslint src/lib/tutor/speakFollowups.ts`: passed
- `npx eslint src/lib/tutor/__tests__/speakFollowups.test.ts`: passed
- `npx vitest run src/lib/tutor/__tests__/speakFollowups.test.ts`: passed, 52 tests
- `git diff --check`: passed

## Typecheck

Full `npm run typecheck` was skipped per Lane 3 instruction because the full app typecheck is a known active compiler hot graph and is not the batch gate.

## Acceptance Evidence

- WP-L3-010: Added assertions that `I need an ahead because summer is sunny` is unclear with reason `hat_homophone_confusion:ahead`, asks for repeat in topic selection, and does not emit a generated follow-up about `the ahead`.
- WP-L3-011: Added assertions that `cau hoi confusing` and `khong hieu question` are learner reports of unclear follow-up questions and ask for repeat.
- WP-L3-012: Added assertions that `isSpeakTranscriptUnclearForFollowUp` returns true for the newly covered unclear cases and false for ordinary clear `ahead` usage.

## F Queue Boundary

F did not mark any row verified. Judge/Admin verification remains separate.
