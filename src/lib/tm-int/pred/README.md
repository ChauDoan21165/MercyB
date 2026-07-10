# WP-001 — Prediction-error capture (SHADOW MODE)

Flips the intelligence north star to **LIVE**: on every live tutor turn the decision
pipeline records what it *predicts* the learner will do next — **before** the learner's
outcome exists — then measures **surprise** once the outcome arrives.

Everything here is **capture-only** and gated behind
`FEATURE_FLAGS.TUTOR_PREDICTION_CAPTURE_ENABLED` (**default OFF**).

## Pipeline

1. `predictor.ts` — lookup-table predictor (**no ML**), versioned `pred-lut-v1`. Pure.
2. `capture.ts` — `capturePrediction()` writes a `PredictionRow` **before** any outcome;
   `resolveSurprise()` is the single chokepoint that pairs prediction + outcome.
3. `surprise.ts` — surprise = `|p(resolve) − actual|` in `[0,1]`.
4. `shadowRunner.ts` / `liveTurn.ts` — SHADOW-MODE wrappers. Learner-facing output is
   returned verbatim; capture is a read-only side-channel that can never mutate or throw
   into the turn.
5. `observe.ts` + `registry.ts` — born observable: prediction axes are registered and
   facts are emitted as **standard** observation events on the shared `observationEventBus`,
   digested with the standard evidence-packet hash.
6. `report.ts` — consumer: descending **top-surprises** report artifact for Chau review.
7. `fixtures.ts` + `thesis.ts` — committed fixtures with planted defects + the thesis metric.

## Hard invariants (proven by tests)

- **NO HINDSIGHT** — a pair is accepted **iff** `predictedAtMs < outcomeAtMs` *strictly*.
  Equal or reversed timestamps are `hindsightRejected` and excluded everywhere (report,
  thesis, sink). `noHindsight.test.ts` runs an exhaustive ordering sweep proving zero leakage.
- **SHADOW MODE** — capture ON vs OFF yields a **byte-identical** learner-facing decision
  (`wp001FlagOffByteIdentical.test.ts`, same pattern as the WP-000 keystone).
- **THESIS** — top-10 by surprise concentrates planted defects far better than a seeded
  random 10 (`thesisMetric.test.ts`; means printed to CI logs).

## Storage decision (stated)

Prediction and surprise rows go through the **existing learning-events sink and its drain
path, unchanged** — no new table, no migration, no new Supabase client, no new drain.
`sink.ts` records via the sink's public `recordLearningEvent()` as two new event types
(`prediction_recorded`, `surprise_resolved`) that flow through the same localStorage queue →
`eventSink` batch → `supabase.from("learning_events").insert()` path as every other event.
This satisfies *"no new write path to any registry."* Rows are projected onto the sink's
PII-safe allowlist (session id + a letters-only turn anchor for provenance, the scaled
scalar in `value`, predictor version in `rule_or_detector_id`). The authoritative structured
record is the in-memory `SurprisePair` (emitted as an observation fact + shipped in the report
artifact); the sink carries the drain-safe projection. Hindsight-rejected pairs are never drained.
