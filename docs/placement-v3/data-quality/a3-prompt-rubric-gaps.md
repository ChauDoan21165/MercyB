# A3 Prompt/Rubric Gaps

Status after rebase onto post-#942 `origin/main`: V3 prompt files, calibration files, and shared CEFR rubric files are present and audited.

## Sources Audited

- `src/data/placement/v3/prompts/*.ts`
- `src/data/placement/v3/calibration/*.ts`
- `supabase/functions/_shared/cefr/rubric.ts`
- `supabase/functions/_shared/cefr/types.ts`
- `supabase/functions/placement-v3-grade-writing/`
- `supabase/functions/placement-v3-session/`
- `src/lib/placement/questions.ts`

The docs-only directory `docs/placement-v3/prompt-library/` remains absent, so this audit covers runtime prompt/rubric files.

## Post-#942 Findings

- V3 reading and listening prompts include embedded questions: 0 missing-question errors after the parser was fixed to read full top-level prompt objects.
- V3 calibration modality mismatches: 0.
- V3 calibration expected levels outside prompt acceptable levels: 0.
- V3 calibration subskill dimensions outside rubric dimensions: 0.
- Conversation prompts without calibration entries: 6 warnings.
- Deterministic Vietnamese-L1 placement prompt descriptor warnings: 5 warnings across 3 question records.

The conversation calibration gap is documented rather than fixed because adding calibration samples would create linguistic corpus content. A3 did not rewrite prompt or rubric meaning.
