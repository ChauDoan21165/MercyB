# Lane 3 F Artifact: WP-L3-086..090

Status: f_done candidate only; not Judge verified.
Batch: Lane 3 F Batch 20
Worker: F

## Workpacks

- WP-L3-086: Required conversation `nextQuestion` to contain exactly one question mark.
- WP-L3-087: Stripped preamble UI labels before keeping the first next question.
- WP-L3-088: Made explanation truncation code-point safe and avoided trailing combining marks.
- WP-L3-089: Added focused invalid-date fallback coverage without relying on the exact current time.
- WP-L3-090: Added focused coverage that empty caller IDs fall back to generated mode-prefixed IDs.

## Changed Files

- `src/lib/tutor/tutorEngine.ts`
- `src/lib/tutor/__tests__/tutorEngine.test.ts`

## Implementation Notes

- Kept conversation-turn changes local to existing normalization/validation helpers.
- Preserved valid one-question conversation turns and correction turns.
- Did not alter AI provider, RoomRenderer, room JSON, Supabase, or Thai queue/gate behavior.

## Non-Goals

- No broad tutor engine rewrite.
- No full app typecheck used as a gate.
