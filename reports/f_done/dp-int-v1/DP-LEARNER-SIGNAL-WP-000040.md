# DP-LEARNER-SIGNAL-WP-000040 f_done

Worker: F-DP-INT-W1
Status: f_done
Commit: 31ac0277baedc832fe72317b23703869faf4a535

Objective: Add a negative-path fixture for the cited DP invariant so unsafe learner claims are rejected. Base invariant: Keep transfer success as a DP signal requiring cross-context evidence.

Implementation evidence:
- Added family replay negative coverage proving duplicate same-task correct answers do not emit transfer success.
- Asserted the resulting signal, DP, and PED serialization contains no unsafe learner-ability language and no verified marker.

Validation evidence:
- `npm test -- --run src/lib/tm-int/learning-signals src/lib/tm-int` passed: 25 files, 182 tests.
- `npm run typecheck` passed.
- `npm exec eslint -- scripts src --format json` passed with zero errors.

