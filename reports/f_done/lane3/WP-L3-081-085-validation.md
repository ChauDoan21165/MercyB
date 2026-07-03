# Lane 3 F Validation: WP-L3-081..085

Status: f_done evidence only; not Judge verified.
Batch: Lane 3 F Batch 19

## Commands

```sh
npx eslint src/lib/tutor/tutorEngine.ts
npx eslint src/lib/tutor/speakableText.ts
npx eslint src/lib/tutor/__tests__/tutorEngine.test.ts
npx vitest run src/lib/tutor/__tests__/tutorEngine.test.ts
git diff --check
```

## Results

- `npx eslint src/lib/tutor/tutorEngine.ts`: passed
- `npx eslint src/lib/tutor/speakableText.ts`: passed
- `npx eslint src/lib/tutor/__tests__/tutorEngine.test.ts`: passed
- `npx vitest run src/lib/tutor/__tests__/tutorEngine.test.ts`: passed, 14 tests
- `git diff --check`: passed

## Typecheck

Full `npm run typecheck` was skipped per Lane 3 instruction because the full app typecheck is a known active compiler hot graph and is not the batch gate.

## Acceptance Evidence

- WP-L3-081: Malformed conversation turn with raw user text differing by punctuation/case fails safe.
- WP-L3-082: `[Corrected]` is removed, while ordinary bracketed speech remains.
- WP-L3-083: `&nbsp;` and `&amp;` are normalized before speech.
- WP-L3-084: Script/style content is not spoken.
- WP-L3-085: Repeated semicolon/colon-separated fragments dedupe.

## F Queue Boundary

F did not mark any row verified. Judge/Admin verification remains separate.
