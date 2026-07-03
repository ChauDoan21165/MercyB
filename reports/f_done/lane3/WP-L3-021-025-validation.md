# Lane 3 F Validation: WP-L3-021..025

Status: f_done evidence only; not Judge verified.
Batch: Lane 3 F Batch 7

## Commands

```sh
npx eslint src/lib/tutor/conversationPromptTemplates.ts
npx eslint src/lib/tutor/__tests__/conversationPromptTemplates.test.ts
npx vitest run src/lib/tutor/__tests__/conversationPromptTemplates.test.ts
git diff --check
```

## Results

- `npx eslint src/lib/tutor/conversationPromptTemplates.ts`: passed
- `npx eslint src/lib/tutor/__tests__/conversationPromptTemplates.test.ts`: passed
- `npx vitest run src/lib/tutor/__tests__/conversationPromptTemplates.test.ts`: passed, 7 tests
- `git diff --check`: passed

## Typecheck

Full `npm run typecheck` was skipped per Lane 3 instruction because the full app typecheck is a known active compiler hot graph and is not the batch gate.

## Acceptance Evidence

- WP-L3-021: Focused test asserts `Ask exactly one follow-up question, not a question list.`
- WP-L3-022: Focused test asserts `Do not jump to a new topic`.
- WP-L3-023: Focused test asserts hollow praise examples `Nice` and `Great job` are forbidden as full responses.
- WP-L3-024: Focused test asserts `Use simple English for Vietnamese learners`.
- WP-L3-025: Focused test asserts `do not overclaim certainty`.

## F Queue Boundary

F did not mark any row verified. Judge/Admin verification remains separate.
