# A3 Integrity Findings

Current status: infrastructure complete; full Placement V3 corpus audit blocked by missing requested corpus files on `origin/main`.

Findings are sourced from generated raw runs in `docs/placement-v3/data-quality/raw-runs/`.

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

## Evidence Rule

The A3 scanners report missing Placement V3 corpus directories as `missing_required_surface` blockers. They do not fabricate calibration examples, prompt-library entries, taxonomy docs, or live data.

## Final Corrected Issue Counts

- Corpus integrity: 6 issues, all `missing_required_surface` blockers.
- Taxonomy consistency: 111 issues: 6 missing-surface blockers, 48 missing remediation links, 57 taxonomy tags unused by the deterministic placement question bank.
- Recommendation graph: 6 issues, all `missing_required_surface` blockers.
- Prompt/rubric alignment: 11 issues: 6 missing-surface blockers, 2 CEFR descriptor gaps on Vietnamese-L1 interference prompts, 3 descriptor/category gaps on Vietnamese-L1 interference prompts.

No duplicate prompts, near-duplicate prompts, invalid taxonomy references, orphan room paths, malformed JSON, or invalid modality mappings were found in the available checked surfaces.
