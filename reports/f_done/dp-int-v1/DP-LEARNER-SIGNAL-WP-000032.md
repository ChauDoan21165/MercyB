# DP-LEARNER-SIGNAL-WP-000032 f_done

Worker: F-DP-INT-W1
Status: f_done
Commit: c9acd3fd19b17b4cedff46f28273cd0f9a145fe1

Objective: Add regression coverage for the cited DP invariant so unsupported edits fail before promotion. Base invariant: Map wrong revised correct sequences into a DP-safe self-correction signal.

Implementation evidence:
- Added regression coverage proving healthy self-correction does not emit for correct-then-wrong ordering.
- Added split-task coverage proving wrong and correct facts must belong to the same task to emit self-correction.

Validation evidence:
- `npm test -- --run src/lib/tm-int/learning-signals src/lib/tm-int` passed: 25 files, 177 tests.
- `npm run typecheck` passed.
- `npm exec eslint -- scripts src --format json` passed with zero errors.

