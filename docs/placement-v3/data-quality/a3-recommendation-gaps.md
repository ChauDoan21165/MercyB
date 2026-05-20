# A3 Recommendation Gaps

Available recommendation mapping sources:

- `src/lib/placement/cefrToRoom.ts`
- `supabase/functions/placement-session/config.ts`
- `src/lib/weakness/recommendationEngine.ts`
- `src/lib/weakness/micro-lessons.ts`

Missing requested source:

- `src/lib/recommendations/`

Known risk to track:

- `B2` routes to `english_b1_b114` and `C2` routes to `english_c1_c114` by documented product decision because matching free B2/C2 room paths do not exist.
- Weakness taxonomy entries with `linkedRoomId: null` are unresolved remediation gaps, not silently repaired.

## Final Corrected Findings

- Orphan CEFR-to-room paths found in available map: 0.
- Broken linked-room remediation paths found where `linkedRoomId` is non-null: 0.
- Missing requested recommendation source remains a blocker: `src/lib/recommendations/`.
