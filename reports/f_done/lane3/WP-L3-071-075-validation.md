# Lane 3 F Validation: WP-L3-071..075

Status: f_done evidence only; not Judge verified.
Batch: Lane 3 F Batch 17

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
- `npx vitest run src/lib/tutor/__tests__/conversationPronunciationAdapter.test.ts`: passed, 10 tests
- `git diff --check`: passed

## Typecheck

Full `npm run typecheck` was skipped per Lane 3 instruction because the full app typecheck is a known active compiler hot graph and is not the batch gate.

## Acceptance Evidence

- WP-L3-071: Malformed scorer output returns a retry-safe `scoring_unavailable` result with no fabricated score.
- WP-L3-072: Negative cost-cap values are clamped to safe non-negative values before scorer input and on returned output.
- WP-L3-073: `audioSource: "text_only"` with a non-empty blob returns `no_audio` and does not call the scorer.
- WP-L3-074: `audioSource: "model_audio"` with an `audio/webm` blob returns `no_audio` and does not call the scorer.
- WP-L3-075: Blank target text with real learner audio returns `scoring_unavailable` and does not call the scorer.

## F Queue Boundary

F did not mark any row verified. Judge/Admin verification remains separate.
