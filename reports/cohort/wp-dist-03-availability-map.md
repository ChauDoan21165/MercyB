# WP-DIST-03 Cohort Instrumentation Availability Map

## Premise

The strategy metrics are cause-level metrics: copula-drop rate per hundred utterances, and phoneme scores on Vietnamese-confusable English sounds. This workpack adds a read-only, re-runnable report script and does not add tables or flip feature flags.

## Data Availability

| Metric | Status on origin/main | Existing source | Capture gate / caveat |
| --- | --- | --- | --- |
| Copula-drop event count | Partially computable today | `learning_events.rule_or_detector_id`; `conversation_events.error_details`; detector tag `vi_l1_missing_be` | Durable rows exist only if producer paths capture detector provenance. `TUTOR_PREDICTION_CAPTURE_ENABLED` can add prediction/surprise rows but is owner-gated and remains off unless the owner flips it. |
| Copula denominator per hundred utterances | Partially computable today | `conversations.turn_count`, fallback `conversation_events.turn_completed`, fallback `learning_events` row count proxy | Exact utterance denominator needs conversation capture. Learning-event count is an activity proxy, not true utterances. |
| Phoneme scores on VN-confusable sounds | Computable today when cloud-scored attempts exist | `speech_attempts.phoneme_scores`, `provider`, `overall_score`, `attempted_at` | Azure writes `phoneme_scores`; local client speech persistence writes `word_scores` only. `SPEECH_PERSISTENCE_ENABLED` and Azure pronunciation availability determine sample size. |
| Cohort tag | Computable today | `feature_flags.enabled_user_ids` | A cohort tag means a feature-flag key with the cohort in `enabled_user_ids`; explicit user-id lists are also supported. |
| Synthetic exclusion | Computable today | explicit `63e289e1-` prefix exclusion plus `profiles.is_synthetic` when available | The exact full synthetic UUID is not present in repo, so the script excludes the requested prefix and any profile row marked synthetic. |

## Script

Run with explicit user ids:

```sh
node scripts/cohort/report.mjs \
  --users uuid1,uuid2 \
  --entry-start 2026-07-01 --entry-end 2026-07-08 \
  --week3-start 2026-07-22 --week3-end 2026-07-29 \
  --out-json reports/cohort/cohort-report.json \
  --out-md reports/cohort/cohort-report.md
```

Run with a cohort tag:

```sh
node scripts/cohort/report.mjs \
  --cohort-tag diagnostic_contact_gate_pilot \
  --entry-start 2026-07-01 --entry-end 2026-07-08 \
  --week3-start 2026-07-22 --week3-end 2026-07-29
```

Required environment:

- `SUPABASE_URL` or `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The script performs read-only REST queries and writes local JSON/Markdown files only.

## First Real Cohort Run Needs

- The owner supplies the 20-30 learner UUIDs or the feature-flag key whose `enabled_user_ids` defines the cohort.
- The owner supplies exact entry and week-three windows.
- For phoneme metrics, cohort learners need Azure/cloud-scored pronunciation attempts with non-null `speech_attempts.phoneme_scores`.
- For exact copula-drop rate per hundred utterances, cohort learners need conversation capture rows with `turn_count` or `turn_completed` events, plus detector provenance rows carrying `vi_l1_missing_be` or equivalent.
