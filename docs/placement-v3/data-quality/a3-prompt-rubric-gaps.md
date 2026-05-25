# A3 Prompt/Rubric Gaps

Status after mechanical follow-up: prompt/rubric findings dropped from 11 to 6.

## Sources Audited

- `src/data/placement/v3/prompts/*.ts`
- `src/data/placement/v3/calibration/*.ts`
- `supabase/functions/_shared/cefr/rubric.ts`
- `supabase/functions/_shared/cefr/types.ts`
- `supabase/functions/placement-v3-grade-writing/`
- `supabase/functions/placement-v3-session/`
- `src/lib/placement/questions.ts`

## Before / After

- Before: 11 warnings.
- After: 6 warnings.
- Resolved: 5 descriptor metadata warnings on `q_a1_009`, `q_a2_009`, and `q_b1_009`.

## Safe Fix Applied

The three deterministic Vietnamese-L1 placement descriptors already had structured `cefr` and `skill: "grammar"` fields. A3 copied those existing metadata labels into the descriptor strings. Prompt text, options, answer keys, CEFR levels, skills, and taxonomy tags were not changed.

## Remaining Findings

- 6 conversation prompts have no calibration entries:
  - `a1-c-mercy-greeting`
  - `a2-c-weekend-chat`
  - `b1-c-study-plan`
  - `b2-c-opinion-followup`
  - `c1-c-polished-disagreement`
  - `c2-c-identity-debate`

Creating calibration entries would be new linguistic corpus content, so A3 documented this as unresolved.
