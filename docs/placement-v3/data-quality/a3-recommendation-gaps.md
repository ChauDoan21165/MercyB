# A3 Recommendation Gaps

Status after mechanical follow-up: recommendation graph warnings dropped from 1 to 0.

## Sources Audited

- `src/lib/placement/v3/recommender.ts`
- `src/lib/placement/v3/recommenderTypes.ts`
- `src/lib/placement/v3/lessonIndex.ts`
- `src/lib/placement/cefrToRoom.ts`
- `src/lib/weakness/recommendationEngine.ts`
- `src/lib/weakness/micro-lessons.ts`
- `src/lib/weakness/weakness-catalog.ts`

## Before / After

- Before: 1 warning for `vi_l1_final_consonants`.
- After: 0 warnings.

## Safe Fix Applied

`vi_l1_final_consonants` is defined in `src/lib/placement/v3/lessonIndex.ts` as a V3 lesson-index coverage ID. The audit was updated to treat lesson-index coverage IDs as valid recommendation graph nodes, rather than requiring every internal coverage ID to also be a legacy weakness-catalog entry.

No recommendation routing logic or taxonomy semantics were changed.
