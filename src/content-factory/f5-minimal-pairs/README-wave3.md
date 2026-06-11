# F5 minimal-pair corpus

Wave 3 is a content-only review-queue corpus for Vietnamese-specific English minimal-pair drills. It is not wired into the pronunciation engine.

The shape follows waves 1 and 2:

- `pair.target` and `pair.contrast`: the English minimal-pair words.
- `ipa.target` and `ipa.contrast`: IPA strings in slashes.
- `vi`: Vietnamese learner-facing interference note with full diacritics.
- `examples.target` and `examples.contrast`: one English example sentence per word.
- `difficulty`: `easy`, `medium`, or `hard`.

`status: "review_queue_not_wired"` means this file is pure content and has no engine import/export.
