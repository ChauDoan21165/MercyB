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
    "consecutiveErrors": 1
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

## Policies Scored

`tests/lpi-benchmark/run.ts` scores three policies with the same gold labels:

- MercyBlade policy: deterministic rule table for immediate correction, deferred recap, and silent logging.
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
- Gold labels are expert heuristics, not outcomes from a randomized learner study.
- The cases are synthetic and detector-level, not drawn from public ESL corpora.
- The rubric models pedagogical judgment, not detector accuracy.
- The seeded random baseline is reproducible but not a statistical confidence interval.

## Extension Path

The next version should map public ESL corpus items into the same context schema:

1. Select corpus examples with learner utterance, correction target, and surrounding turns.
2. Label detector tag, severity, recurrence, session density, and consecutive-error state.
3. Have two independent ESL teachers assign `correct_now`, `defer_to_recap`, or `log_silently`.
4. Track inter-rater agreement and adjudicate disagreements.
5. Re-run the same policy harness on corpus-backed golds and report confidence intervals.
