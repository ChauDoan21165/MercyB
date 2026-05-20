# A3 Integrity Findings

Status after rebase onto post-#942 `origin/main`: real Placement V3 runtime corpus surfaces are present and audited.

Findings are sourced from generated raw runs in `docs/placement-v3/data-quality/raw-runs/`, especially the `post942-*.log` files and their matching `a3-20260520T1320*.json` raw outputs.

## Corpus Now Present

- `src/data/placement/v3/prompts/`: 44 prompts across writing, speaking, reading, listening, and conversation.
- `src/data/placement/v3/calibration/`: 40 calibration entries across writing, speaking, reading, and listening.
- `src/data/placement/v3/prompts/index.ts`: 28 known Vietnamese-L1 interference IDs.
- `src/lib/placement/v3/recommender.ts` and `src/lib/placement/v3/lessonIndex.ts`.
- `supabase/functions/_shared/cefr/rubric.ts` and `supabase/functions/_shared/cefr/types.ts`.
- `supabase/functions/placement-v3-grade-writing/` and `supabase/functions/placement-v3-session/`.

The docs-only folders `docs/placement-v3/calibration/`, `docs/placement-v3/taxonomy/`, and `docs/placement-v3/prompt-library/` are still absent, but the runtime corpus from #942 is no longer missing.

## Categories Covered

- duplicate prompts
- near-duplicate prompts
- invalid taxonomy refs
- orphan recommendation paths
- impossible CEFR transitions
- malformed calibration entries
- prompt/rubric mismatch
- unused taxonomy categories
- missing remediation mappings
- inconsistent modality metadata

## Post-Mechanical-Fix Issue Counts

- Corpus integrity: 0 issues.
- Taxonomy consistency: 96 findings: 48 missing remediation links and 48 unused taxonomy-category findings.
- Recommendation graph: 0 warnings.
- Prompt/rubric alignment: 6 warnings: 6 conversation prompts without calibration entries.

No duplicate prompts, near-duplicate prompts, invalid V3 taxonomy references, orphan CEFR room paths, malformed calibration entries, invalid modality mappings, or missing CEFR labels were found in the merged runtime V3 corpus.
