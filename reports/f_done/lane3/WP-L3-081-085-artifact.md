# Lane 3 F Artifact: WP-L3-081..085

Status: f_done candidate only; not Judge verified.
Batch: Lane 3 F Batch 19
Worker: F

## Workpacks

- WP-L3-081: Hardened raw learner text leak detection when speakable text differs only by punctuation or case.
- WP-L3-082: Removed bracketed UI labels such as `[Corrected]` while preserving ordinary bracketed speech.
- WP-L3-083: Normalized basic HTML entity noise such as `&nbsp;` and `&amp;`.
- WP-L3-084: Removed script/style markup content before TTS sanitization.
- WP-L3-085: Deduped repeated speech fragments separated by semicolons or colons.

## Changed Files

- `src/lib/tutor/tutorEngine.ts`
- `src/lib/tutor/speakableText.ts`
- `src/lib/tutor/__tests__/tutorEngine.test.ts`

## Implementation Notes

- Added punctuation/case-insensitive raw-text leak comparison for conversation turns.
- Kept sanitizer changes local to deterministic text cleanup before speech output.
- Preserved valid corrected-text and conversation-turn behavior.

## Non-Goals

- No RoomRenderer, room JSON, Supabase, AI Tutor provider, or Thai queue/gate changes.
- No broad TTS rewrite.
- No full app typecheck used as a gate.
