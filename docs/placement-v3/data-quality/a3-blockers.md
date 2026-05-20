# A3 Blockers

Timestamp: 2026-05-20T13:10:00-06:00

## Missing Files / Directories

The following requested A3 inputs are absent on the clean branch created from `origin/main`:

- `docs/placement-v3/calibration/`
- `docs/placement-v3/taxonomy/`
- `docs/placement-v3/prompt-library/`
- `src/lib/recommendations/`
- `supabase/functions/placement-v3-grade-writing/index.ts`
- `supabase/functions/placement-v3-session-orchestrator/index.ts`

A35 adaptive generation docs are also not present on `origin/main`, so A3 could not audit A35 artifacts from this branch.

## Commands Run

```bash
git fetch origin
git worktree add /private/tmp/a3-placement-v3-data-quality -b feat/a3-placement-v3-data-quality origin/main
rg --files docs/placement-v3
rg --files src/lib/recommendations src | rg 'recommend|placement|cefr|modality|rubric|prompt|taxonomy'
rg --files supabase | rg 'placement|recommend|cefr|rubric|taxonomy|prompt'
find docs/placement-v3 -maxdepth 3 -type d | sort
```

## Exact Errors / Evidence

```text
rg: src/lib/recommendations: No such file or directory (os error 2)
docs/placement-v3/native-audio/native-permission-audit.md
docs/placement-v3
docs/placement-v3/native-audio
```

## What Was Still Audited

- Deterministic placement question bank in `src/lib/placement/questions.ts`.
- CEFR-to-room recommendation mappings in `src/lib/placement/cefrToRoom.ts`.
- Server mirror CEFR mappings in `supabase/functions/placement-session/config.ts`.
- Placement item/session schemas in the `20260618` and `20260619` migrations.
- Vietnamese-L1 weakness catalog and remediation links in `src/lib/weakness/`.

## What Remains Unverifiable

- Historical Placement V3 calibration samples.
- Placement V3 prompt library consistency.
- Placement V3 prompt/rubric pairs from grader prompts.
- Placement V3 modality metadata outside the v2/session runtime types.
- Placement V3 taxonomy docs, if they exist on another branch.
- A35 adaptive generation corpus/docs, if they exist on another branch.

No consistency result for those absent surfaces is claimed in A3.
