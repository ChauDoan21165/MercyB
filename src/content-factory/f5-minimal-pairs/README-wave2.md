# F5 minimal-pair corpus

Wave 2 is a content-only review-queue corpus for Vietnamese-specific English minimal-pair drills. It is not wired into the pronunciation engine.

The shape mirrors the local pronunciation convention by naming the two words `target` and `contrast`, matching `ProblemPair`-style drill banks, while adding the fields requested for Step 7 review:

- `pair.target` and `pair.contrast`: the English minimal-pair words.
- `ipa.target` and `ipa.contrast`: IPA strings in slashes.
- `vi`: Vietnamese learner-facing interference note with full diacritics.
- `examples.target` and `examples.contrast`: one English example sentence per word.
- `difficulty`: `easy`, `medium`, or `hard`.

`status: "review_queue_not_wired"` means this file is pure content and has no engine import/export.
