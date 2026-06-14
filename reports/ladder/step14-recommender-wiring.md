# Ladder Step 14 - Recommender Wiring

## Done

- Wired `/ai-tutor` session bootstrap to build a learner history profile from server aggregate input plus device-local profile state.
- `recommendNextLessons(profile)` now drives the first visible Today Lesson card when the top recommendation is not `cold-start:abstain`.
- Cold start still abstains: the bootstrap clears any recommender override and the card falls back to the default beginner plan.
- The Today Lesson card now renders the concrete lesson title via `data-testid="ai-tutor-today-lesson-title"` and accepts an explicit `TodayLessonPlan` override.
- Recommender ordering remains deterministic across the three signal families:
  - interference rules first,
  - history preference next,
  - mastery review last.
- Equal mastery scores now tie-break by topic id, avoiding insertion-order dependence.

## Test

Added a live page bootstrap test in `src/pages/__tests__/AiTutor.test.tsx`:

- Mocks server aggregate data with `missing-article` as the top interference signal.
- Renders the real `AiTutorPage`.
- Verifies the first `ai-tutor-today-lesson` card displays `Master English articles: a, an, and the`, which is the top `recommendNextLessons` output for that profile.

Also added recommender unit coverage for mixed-signal ordering and mastery tie determinism.

## Verification

```bash
npx vitest run src/lib/tutor/tests/nextLessonRecommender.test.ts src/pages/__tests__/AiTutor.test.tsx
```

Result: 2 files passed, 109 tests passed.
