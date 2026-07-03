# Lane 3 F Validation: WP-L3-017..020

Status: f_done evidence only; not Judge verified.
Batch: Lane 3 F Batch 6

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
- `npx vitest run src/lib/tutor/__tests__/speakFollowups.test.ts`: passed, 55 tests
- `git diff --check`: passed

## Typecheck

Full `npm run typecheck` was skipped per Lane 3 instruction because the full app typecheck is a known active compiler hot graph and is not the batch gate.

## Acceptance Evidence

- WP-L3-017: Added assertions that unclear learner text preserves the current topic and selection asks for repeat.
- WP-L3-018: Added assertions that `Vietnam` and `America` do not become salience keywords.
- WP-L3-019: Added assertion that `I went with us yesterday` does not promote `us` to salience.
- WP-L3-020: Added clear-transcript and follow-up selection coverage for `I know the way to work`.

## F Queue Boundary

F did not mark any row verified. Judge/Admin verification remains separate.
