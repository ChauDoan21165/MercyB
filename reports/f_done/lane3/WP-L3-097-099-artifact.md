# Lane 3 F Artifact: WP-L3-097..099

Status: f_done candidate only; not Judge verified.
Batch: Lane 3 F Batch 23
Worker: F

## Workpacks

- WP-L3-097: Hardened pronunciation practice against malformed or missing keyword text.
- WP-L3-098: Added coverage that blank/missing active phrases do not open a recording flow.
- WP-L3-099: Added active-entry audio coverage for blank or malformed audio URL data.

## Changed Files

- `src/components/room/RoomPronunciationPractice.tsx`
- `src/components/room/__tests__/RoomPronunciationPractice.test.tsx`
- `src/components/room/__tests__/activeEntryAudioPlayback.test.tsx`

## Implementation Notes

- Treats malformed `keywordsEn` as empty before rendering practice controls.
- Keeps valid keyword practice behavior unchanged.
- Pins missing audio URL behavior on the active-entry playback path without changing RoomRenderer.

## Non-Goals

- No browser auto-open.
- No RoomRenderer, room JSON, Supabase, AI Tutor, or Thai queue/gate changes.
- No full app typecheck used as a gate.
