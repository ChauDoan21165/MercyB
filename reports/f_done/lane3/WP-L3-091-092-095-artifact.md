# Lane 3 F Artifact: WP-L3-091, WP-L3-092, WP-L3-095

Status: f_done candidate only; not Judge verified.
Batch: Lane 3 F Batch 21
Worker: F

## Workpacks

- WP-L3-091: Normalized uppercase room tier suffix variants consistently.
- WP-L3-092: Trimmed and safely handled blank/whitespace room ID input.
- WP-L3-095: Normalized repeated separators such as `room--id__level2` deterministically.

## Changed Files

- `src/components/room/roomIdUtils.ts`
- `src/components/room/__tests__/roomIdUtils.test.ts`

## Implementation Notes

- Added a room-ID separator normalizer for utility input.
- Preserved existing canonical underscore room IDs.
- Kept human title handling in `isBadAutoTitle` from treating ordinary spaces as snake_case IDs.

## Non-Goals

- No RoomRenderer behavior changes.
- No room JSON, Supabase, AI Tutor, or Thai queue/gate changes.
- No full app typecheck used as a gate.
