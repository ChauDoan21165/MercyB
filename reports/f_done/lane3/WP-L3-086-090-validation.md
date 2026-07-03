# Lane 3 F Validation: WP-L3-086..090

Status: f_done evidence only; not Judge verified.
Batch: Lane 3 F Batch 20

## Commands

```sh
npx eslint src/lib/tutor/tutorEngine.ts
npx eslint src/lib/tutor/__tests__/tutorEngine.test.ts
npx vitest run src/lib/tutor/__tests__/tutorEngine.test.ts
git diff --check
```

## Results

- `npx eslint src/lib/tutor/tutorEngine.ts`: passed
- `npx eslint src/lib/tutor/__tests__/tutorEngine.test.ts`: passed
- `npx vitest run src/lib/tutor/__tests__/tutorEngine.test.ts`: passed, 19 tests
- `git diff --check`: passed

## Typecheck

Full `npm run typecheck` was skipped per Lane 3 instruction because the full app typecheck is a known active compiler hot graph and is not the batch gate.

## Acceptance Evidence

- WP-L3-086: Conversation turn without a question mark now fails validation and produces no speakable text.
- WP-L3-087: `Next question:` preamble is stripped and only the first question is retained.
- WP-L3-088: Long explanation truncation avoids replacement characters and trailing combining marks.
- WP-L3-089: Invalid `createdAt` fallback remains a valid ISO date and validates.
- WP-L3-090: Empty caller ID falls back to a generated `conversation-` ID and validates.

## F Queue Boundary

F did not mark any row verified. Judge/Admin verification remains separate.
