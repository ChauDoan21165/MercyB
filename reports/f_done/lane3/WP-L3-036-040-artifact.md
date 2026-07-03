# Lane 3 F Artifact: WP-L3-036..040

Status: f_done candidate only; not Judge verified.
Batch: Lane 3 F Batch 10
Worker: F

## Workpacks

- WP-L3-036: Rejects `As a language model` implementation-leak wording with the existing `as_ai` reason.
- WP-L3-037: Uses a concrete deterministic fallback when the salience matched text is blank.
- WP-L3-038: Builds prompt context from the last three meaningful nonblank turns.
- WP-L3-039: Confirms unusual whitespace still counts toward the 30-word response cap.
- WP-L3-040: Guards high-stakes deterministic fallback as one safe question under the candidate checker.

## Changed Files

- `src/lib/tutor/pivotPromptSafety.ts`
- `src/lib/tutor/__tests__/pivotPromptSafety.test.ts`

## Implementation Notes

- Expanded implementation-leak detection from `as an AI` to include `as a language model`.
- Filtered blank session turns before selecting the last three prompt turns.
- Changed blank salience fallback from `that detail` to `your last answer` or `this important personal detail` for high-stakes pivots.
- Added focused tests for all new edge cases.

## Non-Goals

- No RoomRenderer changes.
- No room JSON changes.
- No Supabase changes.
- No Thai queue/gate changes.
- No full app typecheck used as a gate.
