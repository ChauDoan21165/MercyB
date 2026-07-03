# Lane 3 F Validation: WP-L3-036..040

Status: f_done evidence only; not Judge verified.
Batch: Lane 3 F Batch 10

## Commands

```sh
npx eslint src/lib/tutor/pivotPromptSafety.ts
npx eslint src/lib/tutor/__tests__/pivotPromptSafety.test.ts
npx vitest run src/lib/tutor/__tests__/pivotPromptSafety.test.ts
git diff --check
```

## Results

- `npx eslint src/lib/tutor/pivotPromptSafety.ts`: passed
- `npx eslint src/lib/tutor/__tests__/pivotPromptSafety.test.ts`: passed
- `npx vitest run src/lib/tutor/__tests__/pivotPromptSafety.test.ts`: passed, 19 tests
- `git diff --check`: passed

## Typecheck

Full `npm run typecheck` was skipped per Lane 3 instruction because the full app typecheck is a known active compiler hot graph and is not the batch gate.

## Acceptance Evidence

- WP-L3-036: Test rejects `As a language model...` with `as_ai`.
- WP-L3-037: Test proves blank salience fallback says `your last answer`, not `that detail`.
- WP-L3-038: Test proves blank turns are ignored and the last three meaningful turns are included.
- WP-L3-039: Test proves tabs/nonbreaking spaces do not bypass the word cap.
- WP-L3-040: Test proves high-stakes fallback is one safe question accepted by `checkPivotCandidate`.

## F Queue Boundary

F did not mark any row verified. Judge/Admin verification remains separate.
