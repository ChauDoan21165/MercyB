# Lane 3 F Artifact: WP-L3-046..050

Status: f_done candidate only; not Judge verified.
Batch: Lane 3 F Batch 12
Worker: F

## Workpacks

- WP-L3-046: Blank topic labels now fall back to a stable compact topic id instead of blank output.
- WP-L3-047: Mixed-case/punctuated `I DON'T KNOW!!!` remains a help request.
- WP-L3-048: Romanized Vietnamese `khong biet` is treated as a narrow help request.
- WP-L3-049: `How can I answer?` is treated as a help request.
- WP-L3-050: `Please help.` is treated as a help request while `helped my friend` is not.

## Changed Files

- `src/lib/tutor/contentAwarePivots.ts`
- `src/lib/tutor/__tests__/contentAwarePivots.test.ts`

## Implementation Notes

- Trimmed fallback topic labels before using them.
- Added narrow help-request variants for `khong biet` and `how can I answer`.
- Added focused tests for uppercase punctuation normalization, Romanized Vietnamese uncertainty, answer-help variants, and `helped` false positive safety.

## Non-Goals

- No RoomRenderer changes.
- No room JSON changes.
- No Supabase changes.
- No Thai queue/gate changes.
- No full app typecheck used as a gate.
