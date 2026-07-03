# Lane 3 F Artifact: WP-L3-010..012

Status: f_done candidate only; not Judge verified.
Batch: Lane 3 F Batch 4
Worker: F

## Workpacks

- WP-L3-010: Hardened hat/head/ahead homophone handling so learner transcripts such as "I need an ahead because summer is sunny" are treated as unclear instead of producing a follow-up about "the ahead".
- WP-L3-011: Hardened learner confusion detection for romanized Vietnamese-English variants such as "cau hoi confusing" and "khong hieu question".
- WP-L3-012: Aligned `isSpeakTranscriptUnclearForFollowUp` with `assessSpeakTranscriptClarity` so the lightweight unclear-transcript check reflects newly covered high-confidence unclear cases.

## Changed Files

- `src/lib/tutor/speakFollowups.ts`
- `src/lib/tutor/__tests__/speakFollowups.test.ts`

## Implementation Notes

- Extended the existing hat homophone clarity guard from `head` to `head|ahead` only when existing hat/summer/buy/need context is present.
- Extended generated follow-up target rejection from `the head` to `the head|the ahead` in the same guarded context.
- Added narrow romanized learner-report patterns for `cau hoi ...` and `khong hieu ... question`.
- Changed `isSpeakTranscriptUnclearForFollowUp` to use the full clarity assessment after its existing explicit-pattern checks.
- Added focused regression assertions for unclear transcript routing, clarity reasons, generated follow-up target safety, and ordinary clear "ahead" usage.

## Non-Goals

- No RoomRenderer changes.
- No room JSON changes.
- No Supabase changes.
- No Thai queue/gate changes.
- No full app typecheck used as a gate.
