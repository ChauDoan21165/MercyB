# A3 Initial Audit: Placement V3 Data Quality

Timestamp: 2026-05-20T13:10:00-06:00

## Corpus Files Found

- `docs/placement-v3/native-audio/native-permission-audit.md`
- `src/lib/placement/questions.ts`
- `supabase/functions/placement-session/engine/itemBank.ts`
- `supabase/migrations/20260618000000_placement_items.sql`
- `supabase/migrations/20260619000000_placement_sessions.sql`

Requested but missing on clean `origin/main`:

- `docs/placement-v3/calibration/`
- `docs/placement-v3/taxonomy/`
- `docs/placement-v3/prompt-library/`
- `supabase/functions/placement-v3-grade-writing/index.ts`
- `supabase/functions/placement-v3-session-orchestrator/index.ts`

## Taxonomy Files Found

- `src/lib/weakness/weakness-catalog.ts`
- `src/lib/weakness/recommendationEngine.ts`
- `src/lib/weakness/micro-lessons.ts`

Requested Placement V3 taxonomy docs are missing:

- `docs/placement-v3/taxonomy/`

## Rubric Files Found

- `src/lib/placement/questions.ts` contains deterministic CEFR descriptors for each placement question.
- `supabase/functions/placement-session/types.ts` defines item metadata, L1-transfer tags, CEFR bands, and modality contracts.
- `supabase/functions/placement-session/engine/itemBank.ts` validates server-side item shape.

Requested Placement V3 prompt/rubric library docs are missing:

- `docs/placement-v3/prompt-library/`

## Recommendation Mapping Files Found

- `src/lib/placement/cefrToRoom.ts`
- `supabase/functions/placement-session/config.ts` server mirror of CEFR-to-room mappings.
- `src/lib/weakness/recommendationEngine.ts`
- `src/lib/weakness/micro-lessons.ts`

Requested `src/lib/recommendations/` path is missing on `origin/main`.

## Modality Schemas Found

- `supabase/functions/placement-session/types.ts`
- `supabase/functions/placement-session/engine/itemBank.ts`
- `src/lib/placement/questions.ts`

Known modality/type names found:

- Placement question skills: `grammar`, `vocabulary`, `usage`, `reading`.
- Placement session item types: `reading`, `listening`, `grammar`, `vocabulary`, `writing_sample`.
- Placement session skills: `reading`, `listening`, `grammar`, `vocabulary`, `writing`.

## Obvious Inconsistencies Already Visible

- The requested Placement V3 calibration/taxonomy/prompt-library docs are absent from the clean branch, so those surfaces cannot be audited directly.
- The runtime code currently exposes Placement Test v2/session infrastructure, not a complete Placement V3 linguistic corpus.
- `src/lib/placement/cefrToRoom.ts` intentionally maps `B2` to a B1 room and `C2` to a C1 room because matching free B2/C2 room paths do not exist; this is documented in code, but should remain visible in data-quality reports as a CEFR transition risk.
- Many weakness taxonomy tags intentionally have `linkedRoomId: null`; this is not fabricated as a bug, but it is an unresolved remediation-mapping gap for Placement V3 readiness.

## Estimated Audit Surface Size

- `docs/placement-v3/`: 1 pre-existing file before A3 additions.
- Placement/session/runtime files found: 43 files matching placement/session/item migrations/functions.
- Placement + weakness data files found: 20 files.
- Deterministic placement question bank: 45 questions in `src/lib/placement/questions.ts`.
- Vietnamese-L1 weakness taxonomy: 60 tags in `src/lib/weakness/weakness-catalog.ts`.

## Initial Conclusion

At the first A3 pass, the requested runtime V3 corpus was not yet present on `origin/main`, so A3 reported missing-surface blockers and added infrastructure without fabricating corpus evidence.

## Post-#942 Rebase Update

After rebasing onto post-#942 `origin/main`, the runtime Placement V3 surfaces are present and audited:

- `src/data/placement/v3/prompts/`
- `src/data/placement/v3/calibration/`
- `src/lib/placement/v3/recommender.ts`
- `src/lib/placement/v3/lessonIndex.ts`
- `supabase/functions/_shared/cefr/rubric.ts`
- `supabase/functions/_shared/cefr/types.ts`
- `supabase/functions/placement-v3-grade-writing/`
- `supabase/functions/placement-v3-session/`

Updated findings are in the post-#942 report docs and raw runs. The original missing-corpus conclusion is retained here only as historical context for the first audit pass.
