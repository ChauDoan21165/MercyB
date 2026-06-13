# Lane C Pronunciation Grading Report — 2026-06-13

## Done

- Continued branch `lane-c/pronunciation-grading` for MR !1001.
- Tightened scripted Vietnamese target alignment so tone grading now requires Azure's returned word text to match the target word, including Vietnamese tone marks.
- Added collision-safe syllable contour lookup for minimal-tone targets:
  - explicit `syllable:<index>` contour keys
  - exact syllable keys
  - accent-stripped fallback only when the target base is unique
- Added regression tests for:
  - wrong-tone Azure word suppressing tone grading
  - minimal-tone contour keys not colliding on shared base syllables
  - multi-syllable unsupported-tone suppression using explicit contour keys

## Files Touched

- `src/lib/pronunciation/vietnamesePronunciationGrading.ts`
- `src/lib/pronunciation/__tests__/vietnamesePronunciationGrading.test.ts`
- `reports/lane-c-pronunciation-grading-2026-06-13.md`

## Validation

- PASS: `npm run test -- src/lib/pronunciation/__tests__/vietnamesePronunciationGrading.test.ts`
- PASS: `npm run test -- src/lib/pronunciation/__tests__/vietnameseToneScorer.test.ts src/lib/pronunciation/__tests__/vietnamesePronunciationGrading.test.ts src/lib/pronunciation/tests/vietnameseToneCalibration.test.ts src/lib/pronunciation/tests/vietnameseToneReferenceIngestion.test.ts`
- PASS: `npm run typecheck:app`
- PASS: `git diff --check`

## MR / Branch Status

- Branch: `lane-c/pronunciation-grading`
- MR: `https://gitlab.com/cd12536/mercyB/-/merge_requests/1001`
- Push target: `origin/lane-c/pronunciation-grading`
- Merge/deploy: not performed.

## Blocker

- Learner-visible tone scoring remains blocked by Chau/native-ear validation of held-out Vietnamese tone samples. The grading contract still returns diagnostic tone grades with `learnerToneDisplayAllowed: false`.
