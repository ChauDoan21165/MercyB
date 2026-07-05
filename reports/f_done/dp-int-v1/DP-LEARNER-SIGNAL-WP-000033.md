# DP-LEARNER-SIGNAL-WP-000033 f_done

Worker: F-DP-INT-W1
Status: f_done
Commit: c9acd3fd19b17b4cedff46f28273cd0f9a145fe1

Objective: Add a negative-path fixture for the cited DP invariant so unsafe learner claims are rejected. Base invariant: Map repeated hint usage into a DP signal that preserves alternatives.

Implementation evidence:
- Added a negative-path fixture proving hint dependency output contains no unsafe learner-ability language.
- The fixture also asserts the signal does not write a verified marker.

Validation evidence:
- `npm test -- --run src/lib/tm-int/learning-signals src/lib/tm-int` passed: 25 files, 177 tests.
- `npm run typecheck` passed.
- `npm exec eslint -- scripts src --format json` passed with zero errors.

