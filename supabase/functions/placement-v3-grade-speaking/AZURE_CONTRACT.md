# Placement V3 Speaking Azure Phoneme Contract

Production-readiness prep only. This document records the local contract between
`placement-v3-grade-speaking` and `azure-phoneme`; it is not live Azure provider
validation evidence.

## Confirmed Local Fields

`azure-phoneme` accepts multipart form data:

- `audio`: learner audio blob
- `target_text`: prompt text used for pronunciation comparison
- `roomId`: placement context
- `lineId`: placement prompt id
- `accent`: optional Azure accent hint

Successful responses:

- `ok: true`
- `provider: "azure"`
- `score`: overall pronunciation score, 0-100
- `word_scores`: array of word scores
- `audio_seconds`: measured audio length
- `cost_usd_cents`: local cost estimate

Each `word_scores` item is expected to include:

- `word`
- `heard`
- `score`
- `status`
- `phonemes`: array of `{ phoneme, score }`

Degraded responses:

- `ok: false`
- `use_local: true`
- `reason`: sentinel reason such as `azure_timeout` or `azure_no_match`

## Defensive Parser Assumptions

The speaking grader treats malformed or partial phoneme payloads as low-confidence
pronunciation evidence. Missing phoneme arrays, duplicate phoneme rows, malformed
word rows, non-finite scores, and sentinel responses must not crash grading.
The bridge rebuilds multipart form data for each retry attempt so timeout,
429, 408, and 5xx retries cannot reuse a consumed request body. Success
payloads with no usable score or phoneme evidence are retained only as
low-confidence pronunciation context; they do not become CEFR readiness
evidence.

## Auth Forwarding

`placement-v3-session` must call `placement-v3-grade-speaking` with the
learner JWT as the `Authorization` bearer token. `placement-v3-grade-speaking`
then forwards that learner JWT to `azure-phoneme` while retaining the service
role key only as the internal `apikey`. If the learner JWT is unavailable, the
session grader client falls back before calling the speaking provider path.

## Weighting Rationale

Transcript grammar, vocabulary, and fluency carry 70% of the speaking CEFR
aggregation because the transcript grader owns language-control evidence.
Azure phoneme pronunciation contributes 30% as a bounded modifier. Usable
pronunciation evidence can lower the speaking estimate when it is consistently
weaker, but unavailable or low-confidence phoneme data does not collapse the
overall CEFR level.

## Live Validation Gap

No live Azure credentials were used and no live provider call was performed for
this preparation pass. Live validation remains required before claiming provider
readiness.
