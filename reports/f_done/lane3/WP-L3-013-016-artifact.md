# Lane 3 F Artifact: WP-L3-013..016

Status: f_done candidate only; not Judge verified.
Batch: Lane 3 F Batch 5
Worker: F

## Workpacks

- WP-L3-013: Hardened asked-question dedupe for repeated questions with extra internal spaces.
- WP-L3-014: Hardened asked-question dedupe for terminal punctuation variants.
- WP-L3-015: Normalized negative `turnsOnTopic` values before selection.
- WP-L3-016: Normalized non-integer `turnsOnTopic` values before selection.

## Changed Files

- `src/lib/tutor/speakFollowups.ts`
- `src/lib/tutor/__tests__/speakFollowups.test.ts`

## Implementation Notes

- Added `normalizeAskedQuestionKey` for asked-question comparisons only.
- The displayed follow-up question text is unchanged.
- Asked-question keys now collapse whitespace and ignore terminal punctuation.
- Added `normalizeTurnsOnTopic` to clamp negative turns to `0` and floor finite float values.
- Applied normalized turn counts before scripted, library, salience, and pivot selection.
- Added focused regression tests for spacing variants, punctuation variants, negative turns, and float turns.

## Non-Goals

- No RoomRenderer changes.
- No room JSON changes.
- No Supabase changes.
- No Thai queue/gate changes.
- No full app typecheck used as a gate.
