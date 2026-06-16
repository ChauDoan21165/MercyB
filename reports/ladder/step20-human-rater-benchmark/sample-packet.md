# Step 20 Frozen Human-Rater Sample Packet

Packet freeze date: 2026-06-16
Status: frozen sample packet, awaiting real human ratings
Benchmark state: blocked_by_owner until completed score sheets are attached

## Instructions For Coordinator

Use this exact sample packet for the Step 20 real human-rater benchmark. Do not alter scenario wording after raters begin unless the run is abandoned and a new run ID is created.

Raters must score blinded outputs where feasible. The coordinator should label outputs with neutral system labels such as `A` and `B`; this file does not assign which label is Mercy or the human tutor.

Do not enter invented reviewer names, invented native-speaker claims, synthetic ratings, or model self-ratings. If real raters are not available, leave the score sheets empty and keep the benchmark in `blocked_by_owner`.

## Run Metadata Fields

The coordinator must fill these fields outside the frozen scenario text:

- `run_id`
- `run_started_at_utc`
- `run_completed_at_utc`
- `app_environment`
- `app_version_or_commit`
- `feature_flags`
- `coordinator_id`
- `no_deploy_or_merge_during_benchmark`: yes/no
- `mercy_output_index_path`
- `human_tutor_output_index_path`
- `blinding_map_storage_location`
- `privacy_redaction_completed_by`
- `privacy_redaction_completed_at_utc`

## Rater Identity Fields

Each rater receives an owner-assigned opaque ID. Required fields:

- `rater_id`
- `rater_role`
- `relevant_qualification`
- `rater_vietnamese_proficiency`
- `rater_english_proficiency`
- `conflict_of_interest`
- `consent_confirmed`
- `rated_at_utc`

## Scoring Rubric

Use `reports/ladder/step20-human-rater-benchmark/rubric.md`.

Whole-number scores are required for:

- pedagogical correctness
- VN-EN specificity
- communicative usefulness
- tutor warmth
- safety and honesty
- real-session continuity

Verdict values are restricted to `pass`, `partial`, `fail`, or `critical_fail`.

## Frozen Scenario Set

The closeout benchmark requires all 12 scenarios from `reports/ladder/step20-human-rater-benchmark/scenarios.md`:

| Scenario ID | Title | Required Evidence |
|---|---|---|
| S01 | Correction With Correct Abstain | Mercy output and human-tutor output |
| S02 | Vietlish Naturalness | Mercy output and human-tutor output |
| S03 | Mixed VN-EN Support | Mercy output and human-tutor output |
| S04 | Register And Politeness | Mercy output and human-tutor output |
| S05 | Emotional State | Mercy output and human-tutor output |
| S06 | Challenge Calibration | Mercy output and human-tutor output |
| S07 | Conversation Pivot | Mercy output and human-tutor output |
| S08 | Family Bridge Without Shame | Mercy output and human-tutor output |
| S09 | Sensitive Family Stress | Mercy output and human-tutor output |
| S10 | Pronunciation Evidence Honesty | Mercy output, human-tutor output, and pronunciation evidence reference if available |
| S11 | STT Garble And No False Alarm | Mercy output and human-tutor output |
| S12 | Long Real-Life Run-On | Mercy output and human-tutor output |

## Minimum Completed Packet

A completed packet must attach:

- 24 blinded output artifacts: 12 scenarios x 2 systems.
- 72 raw rater rows minimum: 12 scenarios x 2 systems x 3 raters.
- A completed `completed-score-sheets.csv`.
- A completed `pass-fail-calculation.md`.
- A completed `owner-acceptance.md`.

Without those attachments, the benchmark remains benchmark-ready or blocked-by-owner only.
