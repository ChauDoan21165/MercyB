# Lane 3 F Validation: WP-L3-076..080

Status: f_done evidence only; not Judge verified.
Batch: Lane 3 F Batch 18

## Commands

```sh
npx eslint src/lib/tutor/conversationPronunciationAdapter.ts
npx eslint src/lib/tutor/__tests__/conversationPronunciationAdapter.test.ts
npx vitest run src/lib/tutor/__tests__/conversationPronunciationAdapter.test.ts
git diff --check
```

## Results

- `npx eslint src/lib/tutor/conversationPronunciationAdapter.ts`: passed
- `npx eslint src/lib/tutor/__tests__/conversationPronunciationAdapter.test.ts`: passed
- `npx vitest run src/lib/tutor/__tests__/conversationPronunciationAdapter.test.ts`: passed, 15 tests
- `git diff --check`: passed

## Typecheck

Full `npm run typecheck` was skipped per Lane 3 instruction because the full app typecheck is a known active compiler hot graph and is not the batch gate.

## Acceptance Evidence

- WP-L3-076: Test documents missing JWT is forwarded to the lower scorer, whose existing guard owns fallback.
- WP-L3-077: Non-positive timeout is normalized to `undefined` before scorer input.
- WP-L3-078: Throw path preserves null cost-cap and returns retry-safe `scoring_unavailable`.
- WP-L3-079: Disabled scoring with absent cost-cap returns `shouldAskRetry: false` and `costCap: null`.
- WP-L3-080: Malformed Blob-like values with invalid or throwing `size` do not throw and do not score.

## F Queue Boundary

F did not mark any row verified. Judge/Admin verification remains separate.
