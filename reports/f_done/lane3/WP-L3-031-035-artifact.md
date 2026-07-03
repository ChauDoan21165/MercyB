# Lane 3 F Artifact: WP-L3-031..035

Status: f_done candidate only; not Judge verified.
Batch: Lane 3 F Batch 9
Worker: F

## Workpacks

- WP-L3-031: Rejects newline-separated candidates with more than one question-like prompt.
- WP-L3-032: Explicitly accepts supported full-width question punctuation.
- WP-L3-033: Rejects malformed punctuation noise that contains `?` but no semantic question.
- WP-L3-034: Treats terminal punctuation variants as repeats of the previous assistant response.
- WP-L3-035: Extends hollow-praise rejection to `Awesome` and `Amazing` variants.

## Changed Files

- `src/lib/tutor/pivotPromptSafety.ts`
- `src/lib/tutor/__tests__/pivotPromptSafety.test.ts`

## Implementation Notes

- Counted explicit `?`/`？` plus newline-separated implicit question starters.
- Allowed full-width `。！？` as ending punctuation.
- Required a semantic question word/starter somewhere in the candidate.
- Normalized terminal punctuation for previous-assistant repeat checks.
- Added `awesome` and `amazing` to the hollow-praise guard.

## Non-Goals

- No RoomRenderer changes.
- No room JSON changes.
- No Supabase changes.
- No Thai queue/gate changes.
- No full app typecheck used as a gate.
