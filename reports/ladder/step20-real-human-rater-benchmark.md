# Step 20 Real Human-Rater Benchmark Closure Path

Date: 2026-06-16
Owner: CEO-1 / Codex
Status: blocked_by_owner
Evidence state: benchmark-ready, not evidence-closed

## Non-Claims

This packet does not claim Step 20 is complete.
This packet does not claim a real human-rater benchmark has run.
This packet does not contain real human ratings.
This packet does not invent reviewer names, native speakers, or qualifications.
This packet does not claim Mercy passed the Step 20 benchmark.

## Required Evidence Packet

The frozen benchmark packet for real human review is:

- `reports/ladder/step20-human-rater-benchmark/sample-packet.md`
- `reports/ladder/step20-human-rater-benchmark/rater-score-sheet-template.csv`
- `reports/ladder/step20-human-rater-benchmark/completed-score-sheets.csv`
- `reports/ladder/step20-human-rater-benchmark/pass-fail-calculation.md`
- `reports/ladder/step20-human-rater-benchmark/owner-acceptance.md`

The earlier readiness materials remain supporting context:

- `reports/ladder/step20-human-rater-benchmark/rubric.md`
- `reports/ladder/step20-human-rater-benchmark/scenarios.md`
- `reports/ladder/step20-human-rater-benchmark/evidence-template.md`
- `reports/ladder/STEP20_HUMAN_RATER_BENCHMARK_PACK_2026-06-15.md`

## Reviewer Fields

Every real rater row must include:

- `rater_id`: owner-assigned opaque ID, not a fabricated personal name.
- `rater_role`: reviewer role such as bilingual VN-EN reviewer, ESL pronunciation reviewer, teacher, tutor, or owner-approved equivalent.
- `rater_vietnamese_proficiency`: self-reported or owner-verified proficiency.
- `rater_english_proficiency`: self-reported or owner-verified proficiency.
- `rated_at_utc`: ISO-8601 UTC timestamp for the rating event.
- `conflict_of_interest`: explicit yes/no plus note if yes.
- `consent_confirmed`: yes/no.

The owner may map rater IDs to real people outside this repository. That mapping must not be invented here.

## Closure Rule

Step 20 may be marked evidence-closed only when all of the following are attached:

- Completed score sheets with at least 72 real rows: 12 scenarios x 2 blinded systems x 3 raters.
- At least 3 independent human raters.
- At least 2 qualified bilingual VN-EN reviewers.
- At least 1 native/near-native English reviewer or qualified ESL pronunciation/writing reviewer.
- Real Mercy outputs and real human-tutor benchmark outputs for each scenario.
- Aggregate pass/fail calculation produced from the completed score sheets.
- Owner acceptance artifact signed or explicitly rejected by the human owner.

## Current Blockers

Real human ratings are not attached in `completed-score-sheets.csv`.

Because the real completed score sheets are missing, the current state is `blocked_by_owner`, not evidence-closed. The next valid step is owner coordination to assign real raters, collect blinded ratings, attach completed score sheets, then rerun the verifier.

## Verification

Shape verifier:

`node scripts/verify-step20-human-rater-benchmark.mjs`

The verifier checks required artifact presence, CSV headers, blocked/ready status language, absence of closure/pass claims without at least 72 completed rows, and completed-row calculability if real ratings are later attached.

Expected current result:

`status=blocked_by_owner_missing_real_ratings`
