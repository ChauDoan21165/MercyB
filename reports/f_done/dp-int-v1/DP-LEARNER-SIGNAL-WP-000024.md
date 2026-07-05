# DP-LEARNER-SIGNAL-WP-000024 f_done

Worker: F-DP-INT-W1
Status: f_done
Commit: 09902c563e134701714ede2603a3a3e0cf639194

Objective: Add deterministic fixtures for the cited DP invariant so tests do not depend on hand-built samples. Base invariant: Map repeated same-concept wrong answers into a DP signal requiring follow-up evidence.

Implementation evidence:
- Corrected the family positive fixture to use two deterministic same-concept, distinct-item wrong answers.
- Existing negative coverage continues to prove duplicate same-task and different-concept wrong answers do not emit misconception recurrence.

Validation evidence:
- `npm test -- --run src/lib/tm-int/learning-signals src/lib/tm-int` passed: 25 files, 173 tests.
- `npm run typecheck` passed.
- `npm exec eslint -- scripts src --format json` passed with zero errors.

