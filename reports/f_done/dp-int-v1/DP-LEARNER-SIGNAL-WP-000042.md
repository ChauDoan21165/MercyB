# DP-LEARNER-SIGNAL-WP-000042 f_done

Worker: F-DP-INT-W1
Status: f_done
Commit: 31ac0277baedc832fe72317b23703869faf4a535

Objective: Tighten the cited DP contract surface so downstream code cannot bypass the invariant. Base invariant: Map wrong revised correct sequences into a DP-safe self-correction signal.

Implementation evidence:
- Added self-correction evidence scoping coverage for multiple wrong attempts followed by a correct revision.
- The fixture proves the signal cites the first wrong evidence and the following correct evidence without including unrelated intermediate facts.

Validation evidence:
- `npm test -- --run src/lib/tm-int/learning-signals src/lib/tm-int` passed: 25 files, 182 tests.
- `npm run typecheck` passed.
- `npm exec eslint -- scripts src --format json` passed with zero errors.

