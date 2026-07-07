# C4-NOTIF-CIRCULAR-DEP-004 — EXECUTION REPORT

## Workpack
`C4-NOTIF-CIRCULAR-DEP-004`

## Root cause
`src/notificationEngine/readModel.ts` imported `getStreakDays` from
`@/services/pointsService` to populate `HabitSnapshot.streakDays`. `pointsService`
in turn pulls in the notificationEngine graph, producing a
`notificationEngine ↔ pointsService` circular dependency flagged by dependency-cruiser.
The streak value is already available flag-agnostically from the single shared
rule in `@/lib/streak/canonicalStreak` (which `readModel.ts` already imported for
`isStreakAtRisk`), so the `pointsService` hop was redundant as well as cyclic.

## Fix (smallest safe)
Redirect the streak read off `pointsService` and onto the canonical source:
- `readModel.ts` — import `getCanonicalStreak` from `@/lib/streak/canonicalStreak`
  (already the import site for `isStreakAtRisk`); call site
  `getStreakDays()` → `getCanonicalStreak().current`.
- `types.ts` — updated the `streakDays` doc comment to reference
  `canonicalStreak.getCanonicalStreak` instead of `pointsService.getStreakDays`.
- `__tests__/readModel.test.ts` — repointed the mock to a partial
  `importOriginal` mock of `canonicalStreak` (so the real module shape is
  preserved and only the streak read is stubbed).

No behavior change to the emitted snapshot: `getCanonicalStreak().current` returns
the same flag-agnostic streak value the old path did. No architecture change; one
import + one call site + doc + test mock.

## Files changed
- `src/notificationEngine/readModel.ts`
- `src/notificationEngine/types.ts`
- `src/notificationEngine/__tests__/readModel.test.ts`

Diff stat: `3 files changed, 15 insertions(+), 4 deletions(-)`.

## Validation results
- `depcruise` circular-dependency count → **0**
- `npm run typecheck` → **PASS**
- `npm run lint` → **PASS**
- notificationEngine test suite → **11/11 green**

## Branch name
`repair/c4-notif-circular-dep-004`

## Commit hash
<recorded after commit>

## Push result
<recorded after push>

## MR recommendation
Open MR `repair/c4-notif-circular-dep-004` → `main`. Low risk: swaps one streak
read to the canonical source already used in the same file; snapshot output
unchanged; suite green and the cycle is gone. Reviewer check: confirm depcruise
stays at 0 and `streakDays` still reflects the flag-agnostic streak. No merge /
no deploy in this workpack.

## Mutation summary
- Source mutation: notificationEngine streak-read redirect (one import + call site) + doc + test mock
- Database mutation: none
- Runtime mutation: none (equivalent streak value from canonical source)
- Judge/Coverage mutation: none
- Package promotion: none
- Push / merge / deploy: branch push only; no merge, no deploy

## Rollback plan
`git checkout -- src/notificationEngine/readModel.ts src/notificationEngine/types.ts src/notificationEngine/__tests__/readModel.test.ts`
or delete the branch `repair/c4-notif-circular-dep-004`. No data/runtime state touched.

## Safety locks honored
- No C2 TM INT runtime fix.
- No architecture changes.
- No Judge/Coverage mutation.
- No merge/deploy.
