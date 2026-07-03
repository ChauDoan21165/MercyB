# Lane 3 F Artifact: WP-L3-017..020

Status: f_done candidate only; not Judge verified.
Batch: Lane 3 F Batch 6
Worker: F

## Workpacks

- WP-L3-017: Guarded topic resolution so unclear learner text does not switch topics before the repeat prompt.
- WP-L3-018: Expanded salience stopwords for existing proper-place words beyond Canada.
- WP-L3-019: Added focused coverage that pronoun `us` does not become a place-target salience keyword.
- WP-L3-020: Added positive coverage preserving clear "the way to..." learner text.

## Changed Files

- `src/lib/tutor/speakFollowups.ts`
- `src/lib/tutor/__tests__/speakFollowups.test.ts`

## Implementation Notes

- `resolveSpeakFollowUpTopicId` now returns the current topic, or the seed topic when no current topic exists, if learner text is unclear.
- Added `vietnam`, `america`, `usa`, `california`, `toronto`, `vancouver`, `hanoi`, `saigon`, and `home` to salience stopwords to avoid generated references like `the vietnam`.
- Added focused tests for unclear topic preservation, place-name salience suppression, `us` pronoun behavior, and clear "the way to work" handling.

## Non-Goals

- No RoomRenderer changes.
- No room JSON changes.
- No Supabase changes.
- No Thai queue/gate changes.
- No full app typecheck used as a gate.
