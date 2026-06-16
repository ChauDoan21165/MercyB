# Step 7 Native-Ear Review Packet

validation_id=real-run-2026-06-16T092318135Z
generated_at=2026-06-16T09:23:18.138Z

## Instructions For Reviewer

- Review only the attached real smoke cases and Azure outputs.
- Do not infer results from fixtures, unit tests, or agent summaries.
- Score whether the learner-facing feedback is accurate, kind, and useful.
- Mark any overclaim as fail, especially phoneme or tone claims not supported by evidence.

## Required Minimum Evidence

- At least 2 native-ear reviewers for the first closeout pass.
- At least 10 real smoke cases covering clear speech, VN-accented English, weak final consonants, /th/ substitutions, vowels, and one no-match or poor-audio case.
- Reviewer date, role, rubric scores, and notes preserved in native-ear-scores.csv.

## Pass Rule

Step 7 remains incomplete unless:

- Live Azure smoke has passed with provider=azure, mode=azure_phoneme_batch, and phoneme evidence.
- Native-ear reviewers agree the feedback is accurate and learner-safe.
- Any disagreement or unsafe wording is fixed or explicitly waived by the owner.
