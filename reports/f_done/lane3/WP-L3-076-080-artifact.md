# Lane 3 F Artifact: WP-L3-076..080

Status: f_done candidate only; not Judge verified.
Batch: Lane 3 F Batch 18
Worker: F

## Workpacks

- WP-L3-076: Added explicit coverage that the lower scorer owns missing-JWT fallback behavior.
- WP-L3-077: Normalized invalid non-positive timeout values before scorer delegation.
- WP-L3-078: Expanded retry-safe throw coverage for null cost-cap paths.
- WP-L3-079: Expanded disabled-scoring coverage for absent cost-cap metadata.
- WP-L3-080: Hardened malformed Blob-like audio probing so bad `size` values do not throw or score.

## Changed Files

- `src/lib/tutor/conversationPronunciationAdapter.ts`
- `src/lib/tutor/__tests__/conversationPronunciationAdapter.test.ts`

## Implementation Notes

- Preserved missing-JWT ownership in the lower cloud scorer, which already falls back before Azure when JWT is absent.
- Added adapter-local normalization for timeout and audio-size boundary checks.
- Preserved existing scorer delegation for valid learner audio and enabled scoring.

## Non-Goals

- No cloud scorer behavior changes.
- No RoomRenderer, room JSON, Supabase, AI Tutor orchestration, or Thai queue/gate changes.
- No full app typecheck used as a gate.
