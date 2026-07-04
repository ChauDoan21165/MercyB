# DP-LEARNER-SIGNAL-WP-000021 f_done

Worker: F-DP-INT-W1
Status: f_done
Commit: 09902c563e134701714ede2603a3a3e0cf639194

Objective: Tighten the cited DP contract surface so downstream code cannot bypass the invariant. Base invariant: Map pause plus final correct without hint into a DP-safe learning behavior signal.

Implementation evidence:
- Productive hesitation now evaluates the final answer per task, not any earlier correct answer.
- Added negative coverage for revised-to-wrong and same-task hinted answers so the signal cannot bypass the no-hint/final-correct invariant.

Validation evidence:
- `npm test -- --run src/lib/tm-int/learning-signals src/lib/tm-int` passed: 25 files, 173 tests.
- `npm run typecheck` passed.
- `npm exec eslint -- scripts src --format json` passed with zero errors.

