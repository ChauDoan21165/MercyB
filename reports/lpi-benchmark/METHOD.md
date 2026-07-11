# LPI Pedagogical-Judgment Benchmark Method

## Purpose

This benchmark scores whether a correction policy makes the right pedagogical timing call when a learner makes an error:

- `correct_now`: interrupt and correct immediately.
- `defer_to_recap`: remember the error and teach it in a recap/pattern moment.
- `log_silently`: keep the interaction moving and only record the signal.

The pitch question is simple: does MercyBlade make better correct-vs-hold judgments than a general always-correct tutor and a random baseline?

## Fixture

The fixture is `tests/lpi-benchmark/cases.json`: 40 hand-authored scenarios with this shape:

```json
{
  "context": {
    "detectorTag": "article-omission",
    "severity": "target_form",
    "recurrenceCount": 0,
    "sessionErrorDensity": 1,
    "consecutiveErrors": 1,
    "correctionsThisBurst": 0
  },
  "gold": "correct_now",
  "rationale": "..."
}
```

Coverage targets:

- First-occurrence errors.
- Repeat hammering and pattern recurrence.
- Error bursts.
- Low-severity noise.
- High-severity errors during likely frustration.

## Rubric

The gold labels are heuristic labels grounded in second-language-acquisition corrective-feedback literature, not measured learner outcomes.

- Meaning-blocking errors are corrected now because communication has failed.
- Current lesson targets are corrected now when cognitive/affective load is low.
- Repeated non-target form errors are corrected now only after recurrence shows a pattern.
- Target or repeated form errors are deferred during error bursts unless meaning is blocked.
- Low-severity fluency/mechanics noise is logged silently unless repetition makes a later recap useful.
- Over-correction risk increases when `sessionErrorDensity` or `consecutiveErrors` is high.

Literature anchors:

- Lyster and Ranta, 1997, "Corrective Feedback and Learner Uptake": classroom corrective-feedback moves and uptake differ by feedback type. Source: https://l2aquisition.wordpress.com/wp-content/uploads/2017/06/corrective-feedback-and-learner-uptake-negotiation-of-form-in-communicative-classrooms.pdf
- Ellis, Loewen, and Erlam, 2006, "Implicit and Explicit Corrective Feedback and the Acquisition of L2 Grammar": explicit feedback can help targeted grammar accuracy. Source: https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/implicit-and-explicit-corrective-feedback-and-the-acquisition-of-l2-grammar/CDE67D4A4E286921DA4BE9C40BAD9FE6
- Ammar and Spada, 2006, "One Size Fits All? Recasts, Prompts, and L2 Learning": feedback effectiveness depends on learner/context; one correction style is not universally best. Source: https://eric.ed.gov/?id=EJ777400
- Truscott/Ferris written corrective-feedback debate: grammar correction has contested effects, so low-value surface correction should not be automatic. Source: https://academiccommons.columbia.edu/doi/10.7916/D8JT0277/download
- Affective-filter/overcorrection heuristic: too much correction can reduce confidence, increase anxiety, and reduce willingness to participate. Source: https://seidlitzblog.org/2020/09/22/what-is-the-affective-filter-and-why-is-it-important-in-the-classroom/

## Production Policy Adapter

The benchmark now scores the shipped policy module: `src/services/lpi/correctionPolicy.ts`.

The fixture vocabulary intentionally stays stable, so `tests/lpi-benchmark/run.ts` uses an explicit adapter before calling `decideCorrection`. The adapter is part of the measured method, not an invisible coercion.

Severity mapping:

- `meaning_blocking` -> shipped `meaning_blocking`
- `target_form` -> shipped `target_form`
- `form` -> shipped `form`
- `fluency` -> shipped `fluency`
- `minor` -> shipped `minor`

There is no remaining severity coercion in v2, so no benchmark case is severity-misrepresented by the adapter.

Density mapping:

- Benchmark `sessionErrorDensity` is an integer count of recent errors.
- Shipped `sessionErrorDensity` is a `0..1` fraction over the last five learner turns.
- The adapter uses `min(count / 5, 1)`.
- Count `3` maps exactly to `0.6`, the shipped `HIGH_ERROR_DENSITY_THRESHOLD`. The shipped rule uses `>` rather than `>=`, so exactly `0.6` does not trigger the high-density branch. Those boundary cases are flagged in `results.json`.

Burst correction count:

- Benchmark cases now carry `correctionsThisBurst`.
- The deterministic convention is: first correction in a burst = `0`; narrative implies a prior in-burst correction = `1`.
- Cases set to `1`: `burst-target-tense`, `burst-form-agreement`, `burst-low-punctuation`, `burst-low-fluency`, `frustrated-high-target`, `frustrated-high-form`, `frustrated-high-collocation`, `frustrated-high-meaning`, `frustrated-high-negation`, `frustrated-low-spelling`, `frustrated-low-hesitation`.
- The harness reports scores before and after using this enrichment. Policy v2 currently scores the same both ways because it uses consecutive-error and density state for burst suppression rather than the old one-correction burst cap.

## Policies Scored

`tests/lpi-benchmark/run.ts` scores three policies with the same gold labels:

- MercyBlade policy: the shipped `decideCorrection` module, reached through the explicit adapter above.
- Always-correct baseline: always returns `correct_now`, matching the common general-AI behavior of correcting every detected error.
- Seeded-random baseline: deterministic pseudo-random action selection across the three actions.

The always-correct baseline receives no penalty other than the same rubric applied to every policy. If it scores close, that result should be reported as-is.

## Reproduction

Run:

```sh
npm run lpi:benchmark
```

Outputs:

- `reports/lpi-benchmark/results.json`
- `reports/lpi-benchmark/ACCURACY.md`

## Limitations

- `n=40` is a small benchmark.
- No cases were added for policy v2; golds and authored scenario contexts stayed frozen except for the documented `correctionsThisBurst` field.
- Gold labels are expert heuristics, not outcomes from a randomized learner study.
- The cases are synthetic and detector-level, not drawn from public ESL corpora.
- `n=40` authored cases can overfit a rule table. This benchmark is useful for regression and pitch explanation, but the out-of-sample answer is the public ESL corpus extension below.
- The rubric models pedagogical judgment, not detector accuracy.
- The seeded random baseline is reproducible but not a statistical confidence interval.
- The adapter is still necessary for density because the benchmark fixture stores integer recent-error counts while production stores a `0..1` fraction.

## Extension Path

The next version should map public ESL corpus items into the same context schema:

1. Select corpus examples with learner utterance, correction target, and surrounding turns.
2. Label detector tag, severity, recurrence, session density, and consecutive-error state.
3. Have two independent ESL teachers assign `correct_now`, `defer_to_recap`, or `log_silently`.
4. Track inter-rater agreement and adjudicate disagreements.
5. Re-run the same policy harness on corpus-backed golds and report confidence intervals.
