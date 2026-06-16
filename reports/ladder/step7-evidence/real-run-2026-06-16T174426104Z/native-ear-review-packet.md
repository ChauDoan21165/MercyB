# Step 7 Native-Ear Review Packet

validation_id=real-run-2026-06-16T174426104Z
generated_at=2026-06-16T17:44:26.105Z

## Instructions For Reviewer

- Review only the attached real smoke cases and Azure outputs.
- Do not infer results from fixtures, unit tests, or agent summaries.
- Score whether the learner-facing feedback is accurate, kind, and useful.
- Mark any overclaim as fail, especially phoneme or tone claims not supported by evidence.

## Required Minimum Evidence

- At least 2 native-ear reviewers for the first closeout pass.
- Complete all 10 prepared rows in native-ear-scores.csv, covering clear speech, VN-accented English, weak final consonants, /th/ substitutions, vowels, question intonation, and one no-match or poor-audio case.
- Reviewer date, role, rubric scores, and notes preserved in native-ear-scores.csv.

## Pass Rule

Step 7 remains incomplete unless:

- Live Azure smoke has passed with provider=azure, mode=azure_phoneme_batch, and phoneme evidence.
- Native-ear reviewers agree the feedback is accurate and learner-safe.
- Any disagreement or unsafe wording is fixed or explicitly waived by the owner.
