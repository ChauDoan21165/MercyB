# LPI Held-Out Validation

Blindness rule followed: the 30 held-out golds in `tests/lpi-benchmark/cases.heldout.json` were authored and committed before the first scoring run, using only `reports/lpi-benchmark/METHOD.md` plus the original case file as a schema reference. I did not open, read, cat, or grep `src/services/lpi/correctionPolicy.ts` or `tests/lpi/` before that first scoring run.

## Accuracy

| Policy | Correct | Accuracy |
| --- | ---: | ---: |
| MercyBlade policy | 28/30 | 93.3% |
| Always-correct baseline | 9/30 | 30.0% |
| Seeded-random baseline | 14/30 | 46.7% |

## Disagreements

```json
[
  {
    "id": "heldout-high-density-target-first",
    "context": {
      "detectorTag": "gerund-infinitive-target",
      "severity": "target_form",
      "recurrenceCount": 0,
      "sessionErrorDensity": 4,
      "consecutiveErrors": 2,
      "correctionsThisBurst": 0
    },
    "shippedPolicyInput": {
      "detectorTag": "gerund-infinitive-target",
      "severity": "target_form",
      "recurrenceCount": 0,
      "sessionErrorDensity": 0.8,
      "consecutiveErrors": 2,
      "correctionsThisBurst": 0
    },
    "adapterFlags": [],
    "gold": "defer_to_recap",
    "mercyBladePolicyOutput": "correct_now",
    "mercyBladeReason": "target_first_occurrence",
    "rationale": "Defer because even a first target form can be too costly during a dense error stretch; affective-filter heuristic weighs timing against interruption."
  },
  {
    "id": "heldout-high-density-minor-repeat",
    "context": {
      "detectorTag": "apostrophe-possessive",
      "severity": "minor",
      "recurrenceCount": 4,
      "sessionErrorDensity": 4,
      "consecutiveErrors": 2,
      "correctionsThisBurst": 0
    },
    "shippedPolicyInput": {
      "detectorTag": "apostrophe-possessive",
      "severity": "minor",
      "recurrenceCount": 4,
      "sessionErrorDensity": 0.8,
      "consecutiveErrors": 2,
      "correctionsThisBurst": 0
    },
    "adapterFlags": [],
    "gold": "log_silently",
    "mercyBladePolicyOutput": "defer_to_recap",
    "mercyBladeReason": "low_severity_repeated_pattern",
    "rationale": "Log silently because repeated mechanics under high density are still low-value in the moment; Truscott-Ferris WCF and affective-filter heuristics."
  }
]
```

## Interpretation

At 93.3%, policy v2 clears the >=80% threshold, so this held-out validation suggests the rubric generalizes beyond the original authored benchmark. The remaining misses cluster in high-density but not consecutive-burst states: first target-form correction still fires immediately, and repeated minor mechanics still defer to recap instead of staying silent. Those are tuning candidates, not changes made in this validation task.
