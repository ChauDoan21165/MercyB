# DP-LEARNER-SIGNAL-WP-000023 f_done

Worker: F-DP-INT-W1
Status: f_done
Commit: 09902c563e134701714ede2603a3a3e0cf639194

Objective: Connect the cited DP invariant through the runtime integration path used by placement or lessons. Base invariant: Map repeated hint usage into a DP signal that preserves alternatives.

Implementation evidence:
- Hint dependency now requires repeated hints across distinct task anchors, avoiding duplicate same-task inflation.
- Added TeacherContext runtime aggregation coverage proving hint dependency exposes evidence references and preserved EDU alternatives.

Validation evidence:
- `npm test -- --run src/lib/tm-int/learning-signals src/lib/tm-int` passed: 25 files, 173 tests.
- `npm run typecheck` passed.
- `npm exec eslint -- scripts src --format json` passed with zero errors.

