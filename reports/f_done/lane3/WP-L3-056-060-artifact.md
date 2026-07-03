# Lane 3 F Artifact: WP-L3-056..060

Status: f_done candidate only; not Judge verified.
Batch: Lane 3 F Batch 14
Worker: F

## Workpacks

- WP-L3-056: Sanitizes caller-supplied prompt control characters before returning UI/TTS copy.
- WP-L3-057: Adds coverage that every abstention trigger has nonblank bilingual copy.
- WP-L3-058: Adds coverage that default VI prompts retain Vietnamese markers while EN prompts do not.
- WP-L3-059: Sanitizes caller-supplied UI labels such as `Next question:` / `Question:`.
- WP-L3-060: Adds no-audio copy coverage to keep wording neutral and practice-forward.

## Changed Files

- `src/lib/tutor/conversationWarmth.ts`
- `src/lib/tutor/__tests__/conversationWarmth.test.ts`

## Implementation Notes

- Added `cleanSuggestedPromptLine` to remove ASCII control characters, normalize whitespace, trim, and strip simple UI labels from caller-supplied next prompts.
- Added focused tests for trigger coverage, language boundaries, sanitized prompt copy, and no-audio neutrality.

## Non-Goals

- No RoomRenderer changes.
- No room JSON changes.
- No Supabase changes.
- No Thai queue/gate changes.
- No full app typecheck used as a gate.
