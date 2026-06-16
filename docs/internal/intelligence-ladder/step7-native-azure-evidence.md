# Step 7 Native Azure Evidence Ledger

Date: 2026-06-16
Job: L7-step7-native-azure-evidence
Scope: Step 7 pronunciation evidence closeout only

## Final Status

Final status: not fully evidence-closed

Step 7 is not fully evidence-closed because this repository currently has readiness evidence and blocked-live-smoke records, but no durable proof that a real Azure pronunciation-assessment request completed with native-ear validation of learner-facing feedback.

## Evidence Classes

| Evidence class | Status | Current evidence | Closeout meaning |
| --- | --- | --- | --- |
| Real Azure evidence | Missing / unproven | `reports/ladder/step7-evidence/real-run-2026-06-16T092729997Z/live-azure-smoke.log` says the live Azure smoke was blocked because preflight was not ready. `manifest.json` records `liveAzureSmokeStatus=blocked_missing_preconditions` and `liveAzurePreconditionsReady=false`. | Not proof. No request was sent, and no Azure provider result, mode, or phoneme count was captured. |
| Synthetic evidence | Present as readiness-only evidence | `reports/ladder/step7-evidence/real-run-2026-06-16T092729997Z/manifest.json` records `localSmokePassed=true`. The smoke harness and unit tests cover local fallback, mocked/sanitized response shape, and safety behavior. | Useful CI signal only. It must not be presented as native-ear proof or real Azure proof. |
| Native-ear validation | Missing / unproven | `reports/ladder/step7-evidence/real-run-2026-06-16T092729997Z/native-ear-scores.csv` is still a template with `pending` and placeholder reviewer fields. | Not proof. No real reviewer verdicts, scores, dates, or notes are attached. |
| Missing / unproven evidence | Open blockers | Real Azure run, native-ear reviewers, completed scoring CSV, and owner acceptance are absent. | Step 7 cannot be called fully closed. |

## Real Azure Evidence

Required closeout proof:

- A live Step 7 smoke run against the intended runtime path.
- `provider=azure`.
- `mode=azure_phoneme_batch`.
- Nonzero phoneme evidence.
- A passing command exit code preserved in a durable log.
- Redacted logs that do not expose JWTs, Azure keys, raw audio, or learner transcripts.

Current repository evidence:

- `reports/ladder/step7-evidence/real-run-2026-06-16T092729997Z/preflight.json` records all live Azure preconditions as absent on this run: `STEP7_LIVE_AZURE_SMOKE`, `VITE_AZURE_PHONEME_BATCH_ENABLED`, `VITE_SUPABASE_URL`, smoke auth, and Supabase anon key are not present.
- `reports/ladder/step7-evidence/real-run-2026-06-16T092729997Z/live-azure-smoke.log` records: live Azure smoke was requested, but preflight was not ready, so no live request was sent.
- `reports/ladder/step7-evidence/real-run-2026-06-16T092729997Z/manifest.json` records `liveAzureSmokeStatus=blocked_missing_preconditions`.

Conclusion: real Azure evidence is missing / unproven. There is no Azure-native result to close Step 7.

## Synthetic Evidence

Synthetic and local evidence currently present:

- `src/lib/pronunciation/__tests__/step7AzureSmoke.test.tsx` validates no-Azure fallback behavior in CI and defines an opt-in live Azure shape smoke.
- `reports/ladder/step7-evidence/real-run-2026-06-16T092729997Z/manifest.json` records `localSmokePassed=true`.
- The fixture `src/lib/pronunciation/__fixtures__/step7-known-good-i-went-to-school-yesterday.wav` exists and was used as readiness input.
- Unit coverage validates safety behavior such as sanitized logs and no fabricated phoneme output.

Conclusion: synthetic evidence is present, but it is readiness-only evidence. It does not prove Azure scoring worked, does not prove native-ear quality, and must not be counted as native-ear validation.

## Native-Ear Validation

Required closeout proof:

- At least two native-ear or qualified pronunciation/ESL reviewers.
- At least ten real smoke cases covering clear speech, Vietnamese-accented English, weak final consonants, `/th/` substitutions, vowel errors, and one no-match or poor-audio case.
- Completed reviewer fields: reviewer ID, reviewer role, review date, native quality score, feedback accuracy score, register/politeness score, learner-safety score, verdict, and notes.
- Reviewer agreement that the learner-facing feedback is accurate, kind, and supported by the Azure evidence.

Current repository evidence:

- `reports/ladder/step7-evidence/real-run-2026-06-16T092729997Z/native-ear-scores.csv` is a template only.
- The only recorded row has placeholder reviewer fields and `verdict=pending`.
- No completed reviewer score, reviewer date, reviewer note, or pass verdict is attached.

Conclusion: native-ear validation is missing / unproven.

## Missing / Unproven Evidence

Exact missing evidence before Step 7 can be fully evidence-closed:

- A live Azure pronunciation-assessment smoke run with preconditions satisfied.
- Durable log evidence showing Azure `provider=azure`.
- Durable log evidence showing Azure `mode=azure_phoneme_batch`.
- Durable log evidence showing nonzero phoneme evidence.
- A completed native-ear scoring CSV with real reviewer identities or stable reviewer IDs, roles, dates, scores, verdicts, and notes.
- At least two reviewers and at least ten real smoke cases.
- Owner acceptance after both Azure and native-ear evidence are attached.

## Status Rule

Allowed final statuses are:

- fully closed
- partially closed
- not fully evidence-closed

This artifact uses `not fully evidence-closed` because real Azure evidence and native-ear validation are both missing / unproven.
