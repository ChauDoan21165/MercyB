# Lane 3 F Artifact: WP-L3-021..025

Status: f_done candidate only; not Judge verified.
Batch: Lane 3 F Batch 7
Worker: F

## Workpacks

- WP-L3-021: Made the exactly-one-follow-up-question constraint explicit in the output contract.
- WP-L3-022: Made no-new-topic-jump guidance explicit in default conversation directions.
- WP-L3-023: Added an explicit hollow-praise guard for generated follow-ups.
- WP-L3-024: Added an explicit simple-English-for-Vietnamese-learners instruction.
- WP-L3-025: Strengthened correction humility by forbidding overclaimed certainty on ambiguous transcripts.

## Changed Files

- `src/lib/tutor/conversationPromptTemplates.ts`
- `src/lib/tutor/__tests__/conversationPromptTemplates.test.ts`

## Implementation Notes

- Added narrow prompt wording to existing prompt sections without changing prompt builder inputs or output shape.
- Added focused string assertions that protect the specific Teacher Mercy prompt constraints without snapshotting the entire prompt.

## Non-Goals

- No RoomRenderer changes.
- No room JSON changes.
- No Supabase changes.
- No Thai queue/gate changes.
- No full app typecheck used as a gate.
