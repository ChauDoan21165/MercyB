# A3 Prompt/Rubric Gaps

Available prompt/rubric-like source:

- `src/lib/placement/questions.ts` question prompts and `cefrDescriptor` fields.
- `supabase/functions/placement-session/types.ts` item contract.
- `supabase/functions/placement-session/engine/itemBank.ts` item validation contract.

Missing requested source:

- `docs/placement-v3/prompt-library/`
- `supabase/functions/placement-v3-grade-writing/index.ts`

Automated checks added:

- prompt modality mismatch
- rubric category mismatch
- missing scoring dimensions
- prompt level mismatch
- impossible rubric expectations

These checks are limited to deterministic placement questions until true Placement V3 prompt/rubric files are present.

## Final Corrected Findings

- The three Vietnamese-L1 interference placement questions use descriptors prefixed with `Vietnamese L1 interference:` instead of normal `A1/A2/B1 grammar:` wording.
- Two of those descriptors do not explicitly include the CEFR label.
- Three of those descriptors do not include the literal skill label `grammar`.

These are prompt/rubric alignment warnings, not content rewrites. A3 did not change their linguistic meaning.
