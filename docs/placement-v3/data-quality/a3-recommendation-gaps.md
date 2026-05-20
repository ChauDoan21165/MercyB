# A3 Recommendation Gaps

Status after rebase onto post-#942 `origin/main`: Placement V3 recommender files are present and audited.

## Sources Audited

- `src/lib/placement/v3/recommender.ts`
- `src/lib/placement/v3/recommenderTypes.ts`
- `src/lib/placement/v3/lessonIndex.ts`
- `src/lib/placement/cefrToRoom.ts`
- `src/lib/weakness/recommendationEngine.ts`
- `src/lib/weakness/micro-lessons.ts`
- `src/lib/weakness/weakness-catalog.ts`

The older requested path `src/lib/recommendations/` is still absent, but V3 recommendation logic now lives under `src/lib/placement/v3/`.

## Post-#942 Findings

- Orphan CEFR-to-room paths found in available maps: 0.
- Broken linked-room remediation paths where `linkedRoomId` is non-null: 0.
- Cyclic recommendation chains: 0 errors.
- Invalid V3 recommendation alias targets: 1 warning.

The warning is in `src/lib/placement/v3/recommender.ts`: alias target `vi_l1_final_consonants` is not defined in the legacy `vi_l1_*` weakness catalog or the V3 known L1 ID list. A3 did not rewrite it because changing the alias could affect recommendation behavior without enough linguistic evidence.
